from fastapi import APIRouter, Depends, Header, HTTPException
import uuid
from typing import Annotated
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.core.security import get_current_user, hash_password
from app.schemas.user import UserUpdate
from sqlalchemy import delete, update

router = APIRouter()

@router.get("/")
def get_user(Token: Annotated[str, Header()], db: Session = Depends(get_db)):
    user = get_current_user(Token, db)
    return db.query(User).filter(User.user_id == user).first()

@router.patch("/")
def update_user(Token: Annotated[str, Header()], data: UserUpdate, db: Session = Depends(get_db)):
    user = get_current_user(Token, db)
    if data.username:
        stmt = update(User).where(User.user_id == user).values(username=data.username)
        db.execute(stmt)
    if data.email:
        stmt = update(User).where(User.user_id == user).values(email=data.email)
        db.execute(stmt)
    if data.password:
        stmt = update(User).where(User.user_id == user).values(password_hash=hash_password(data.password))
        db.execute(stmt)
    db.commit()

@router.delete("/")
def delete_user(Token: Annotated[str, Header()], db: Session = Depends(get_db)):
    user_id = get_current_user(Token, db)

    anonymous_username = f"deleted_user_{uuid.uuid4().hex[:8]}"
    anonymous_email = f"deleted_{uuid.uuid4().hex}@anonymous.local"

    stmt = (
        update(User)
        .where(User.user_id == user_id)
        .values(
            username=anonymous_username,
            email=anonymous_email
        )
    )

    db.execute(stmt)
    db.commit()

    return {"message": "Konto zostało zanonimizowane"}