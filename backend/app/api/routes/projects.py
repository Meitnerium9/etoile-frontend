import token
from typing import Annotated
from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import null
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.project import CustomProject
from app.models.user import User
from app.schemas.project import ProjectCreate
from app.core.security import get_current_user
from sqlalchemy.exc import IntegrityError
from datetime import datetime

router = APIRouter()

@router.post("/")
def create_project(project: ProjectCreate, token: Annotated[str | None, Header()] = None, db: Session = Depends(get_db)):
    user_id=get_current_user(token, db)
    new_project = CustomProject(
        user_id=user_id,
        name = project.name,
        image_path = project.image_path,
        total_price = project.total_price,
        created_at=datetime.utcnow(),
        category_id = project.category_id,
        metal = project.metal,
        project_size = project.project_size,
        trinket1 = project.trinket1,
        trinket2 = project.trinket2
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return {"msg": "Projekt zapisany", "project_id": new_project.project_id}

@router.get("/")
def get_projects(token: Annotated[str | None, Header()] = None, db: Session = Depends(get_db)):
    user_id = get_current_user(token, db)
    return db.query(CustomProject).filter(CustomProject.user_id == user_id).all()

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    token: Annotated[str | None, Header()] = None,
    db: Session = Depends(get_db)
):
    user_id = get_current_user(token, db)

    project = (
        db.query(CustomProject)
        .filter(CustomProject.project_id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        db.delete(project)
        db.commit()
        return {"msg": "deleted"}

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Nie można usunąć projektu, ponieważ zawiera powiązane elementy."
        )

@router.get("/{project_id}")
def get_project_author(project_id: int, db: Session = Depends(get_db)):
    project = db.query(CustomProject).filter(
        CustomProject.project_id == project_id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    user = db.query(User).filter(User.user_id == project.user_id).first()
    name = project.name if project.name else "Brak nazwy"
    image_path = project.image_path
    price = project.total_price if project.total_price else 0
    return {"username": user.username, "name": name, "image_path": image_path, "price": price}
