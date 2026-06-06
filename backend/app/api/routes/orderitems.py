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
# obsługa elementówzamówień #
# ================ #
router = APIRouter()

@router.get("/{order_id}")
def get_order_items(
    order_id: int,
    token: Annotated[str | None, Header()] = None,
    db: Session = Depends(get_db)
):
    user_id = get_current_user(token, db)
    data = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    for e in data:
        if e.project_id is None:
            e.title = db.query(Product).filter(Product.product_id == e.product_id).first().name
        else:
            e.title = db.query(CustomProject).filter(CustomProject.project_id == e.project_id).first().name
    return data