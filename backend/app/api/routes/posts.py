from fastapi import APIRouter, Depends, HTTPException, Query, Header
from typing import Annotated
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.favorite import Favorite
from app.core.security import get_current_user

from app.db.session import get_db
from app.models.post import BlogPost

router = APIRouter()

# Pobieranie postów użytkownika (MUST be before /{post_id})
@router.get("/user/{user_id}")
def get_user_posts(
    user_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(5, ge=1, le=50),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit

    total_posts = db.query(BlogPost).filter(BlogPost.user_id == user_id).count()

    posts = (
        db.query(BlogPost)
        .filter(BlogPost.user_id == user_id)
        .order_by(BlogPost.post_id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    total_pages = (total_posts + limit - 1) // limit

    return {
        "posts": posts,
        "pagination": {
            "page": page,
            "limit": limit,
            "total_posts": total_posts,
            "total_pages": total_pages
        }
    }

# Pobieranie z bazy jednego posta (do podstrony)
@router.get("/{post_id}")
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.post_id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post nie istnieje."
        )

    post.fav = db.query(Favorite).filter(Favorite.project_id == post.project_id).count()

    return post

# Pobieranie z bazy określonej liczby postów
@router.get("/")
def get_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(5, ge=1, le=50),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit

    total_posts = db.query(BlogPost).count()

    posts = (
        db.query(BlogPost)
        .order_by(BlogPost.post_id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    total_pages = (total_posts + limit - 1) // limit

    return {
        "posts": posts,
        "pagination": {
            "page": page,
            "limit": limit,
            "total_posts": total_posts,
            "total_pages": total_pages
        }
    }

# Tworzenie posta
@router.post("/")
def create_post(data: dict, token: Annotated[str | None, Header()] = None, db: Session = Depends(get_db)):
    post = BlogPost(
        user_id=get_current_user(token, db),
        project_id=data.get("project_id"),
        title=data.get("title"),
        description=data.get("description"),
        image_path=data.get("image_path"),
        created_at=datetime.utcnow()
        )

    db.add(post)
    db.commit()
    return {"msg": "posted",
            "post_id":post.post_id}

# Usuwanie posta
@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = (db.query(BlogPost).filter(BlogPost.post_id == post_id).first())

    if not post:
        raise HTTPException(
            status_code = 404,
            detail = "Post nie istnieje."
        )

    db.delete(post)
    db.commit()

    return{
        "msg":"Post został usunięty"
    }

# Edytowanie konkretnego posta
@router.patch("/{post_id}")
def update_post(post_id: int, data: dict, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.post_id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post nie istnieje."
        )

    if "title" in data:
        post.title = data["title"]

    if "description" in data:
        post.description = data["description"]

    if "image_path" in data:
        post.image_path = data["image_path"]

    if "project_id" in data:
        post.project_id = data["project_id"]

    db.commit()
    db.refresh(post)

    return {
        "msg": "Post został zaktualizowany.",
        "post": post
    }