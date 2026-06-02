from typing import Annotated
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db.session import get_db
from app.models.cart import Cart
from app.schemas.cart import CartCreate, CartUpdate, CartDelete
from app.core.security import get_current_user

router = APIRouter()

# ========== dodawanie do koszyka ========== #
@router.post("/")
def add_to_cart(cart_item: CartCreate, token: Annotated[str | None, Header()] = None, db: Session = Depends(get_db)):
    user_id = get_current_user(token, db)

    existing_item = db.query(Cart).filter(
        and_(
            Cart.user_id == user_id,
            Cart.product_id == cart_item.product_id,
            Cart.project_id == cart_item.project_id
        )
    ).first()

    if existing_item:
        existing_item.quantity += cart_item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item

    db_cart = Cart(
        user_id = user_id,
        product_id = cart_item.product_id,
        project_id = cart_item.project_id,
        quantity = cart_item.quantity
    )

    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)
    return db_cart

# ========== zmiana ilości produktów w koszyku ========== #
@router.patch("/")
def update_cart(cart_item: CartUpdate, db: Session = Depends(get_db)):

    db_cart_item = (
        db.query(Cart)
        .filter(Cart.cart_item_id == cart_item.cart_item_id)
        .first()
    )

    if not db_cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db_cart_item.quantity = cart_item.quantity
    db.commit()
    #db.refresh(db_cart_item)
    return {"msg": "ok"}

# ========== usuwanie z koszyka ========== #
@router.delete("/")
def delete_cart(
    cart_id: CartDelete,
    db: Session = Depends(get_db)
):
    cart_item = (
        db.query(Cart)
        .filter(Cart.cart_item_id == cart_id.cart_item_id)
        .first()
    )

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()

    return {"msg": "deleted"}

# ========== zwracanie koszyka użytkownika ========== #
@router.get("/")
def get_cart(token: Annotated[str | None, Header()] = None, db: Session = Depends(get_db)):
    user_id = get_current_user(token, db)
    return db.query(Cart).filter(Cart.user_id == user_id).all()
