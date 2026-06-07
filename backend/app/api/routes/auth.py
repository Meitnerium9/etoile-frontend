from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.core.security import hash_password, verify_password, create_token
from datetime import datetime
from app.core.email import send_mail

# =============================== #
# obsługa autoryzacji użytkownika #
# =============================== #

router = APIRouter()

# ========== obsługa rejestracji użytkownika ========== #
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Konto z takim adresem email już istnieje."
        )

    try:
        new_user = User(
            username=user.username,
            email=user.email,
            password_hash=hash_password(user.password),
            is_designer=False,
            created_at=datetime.utcnow()
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        try:
            print("Próba wysłania maila do:", new_user.email)

            send_mail(
                new_user.email,
                "Witaj w Etoile!",
                "Dziękujemy za rejestrację"
            )

            print("Mail został wysłany poprawnie.")

        except Exception as e:
            print("BŁĄD WYSYŁANIA MAILA:", e)


        return {"msg": "Konto zostało utworzone."}

    except ValueError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        db.rollback()
        print("Błąd rejestracji:", e)
        raise HTTPException(
            status_code=500,
            detail="Wystąpił błąd serwera podczas rejestracji."
        )

# ========== obsługa logowania ========== #
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Zły email lub hasło."
        )

    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=400,
            detail="Zły email lub hasło."
        )

    token = create_token(db_user.user_id)

    return {
        "access_token": token
    }