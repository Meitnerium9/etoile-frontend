from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.cart import Cart
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.order import OrderUpdate, OrderDelete
from app.core.security import get_current_user
from app.models.product import Product
from app.models.project import CustomProject

# ================ #
# obsługa zamówień #
# ================ #
router = APIRouter()

# ========== dodawanie zamówienia ========== #
@router.post("/")
def create_order(
    token: Annotated[str | None, Header()] = None,
    db: Session = Depends(get_db)
):
    # =========================
    # pobranie koszyka użytkownika
    # =========================
    user_id = get_current_user(token, db)
    cart_items = (
        db.query(Cart)
        .filter(Cart.user_id == user_id)
        .all()
    )
    if not cart_items:
        raise HTTPException(
            status_code=404,
            detail="Cart is empty"
        )
    try:
        # =========================
        # tworzenie zamówienia
        # =========================
        new_order = Order(
            user_id=user_id,
            status="Oczekujące",
            created_at=datetime.utcnow()
        )
        db.add(new_order)
        #pobranie ID ordera
        db.flush()

        # =========================
        # cart -> order_items
        # =========================
        for item in cart_items:
            if item.project_id is not None:
                order_item = OrderItem(
                    order_id=new_order.order_id,
                    product_id=item.product_id,
                    project_id=item.project_id,
                    quantity=item.quantity,
                    price_at_purchase=db.query(CustomProject).filter(CustomProject.project_id == item.project_id).first().total_price
                )
                db.add(order_item)
            else:
                order_item = OrderItem(
                    order_id=new_order.order_id,
                    product_id=item.product_id,
                    project_id=item.project_id,
                    quantity=item.quantity,
                    price_at_purchase=db.query(Product).filter(Product.product_id == item.product_id).first().price
                )
                db.add(order_item)

        # =========================
        # usuwanie koszyka
        # =========================
        for item in cart_items:
            db.delete(item)
        db.commit()
        return {
            "msg": "order created",
            "order_id": new_order.order_id
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ========== zmiana statusu ========== #
@router.patch("/")
def update_order(
    order: OrderUpdate,
    db: Session = Depends(get_db)
):
    db_order = (
        db.query(Order)
        .filter(Order.order_id == order.order_id)
        .first()
    )
    if not db_order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )
    db_order.status = order.status
    db.commit()

    return {"msg": "ok"}

# ========== usuwanie zamówienia ========== #
@router.delete("/")
def delete_order(
    order: OrderDelete,
    db: Session = Depends(get_db)
):

    db_order = (
        db.query(Order)
        .filter(Order.order_id == order.order_id)
        .first()
    )

    if not db_order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    db.delete(db_order)
    db.commit()

    return {"msg": "deleted"}

# ========== pobranie listy zamówień ========== #
@router.get("/")
def get_orders(
    token: Annotated[str | None, Header()] = None,
    db: Session = Depends(get_db)
):
    user_id = get_current_user(token, db)
    return (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .all()
    )