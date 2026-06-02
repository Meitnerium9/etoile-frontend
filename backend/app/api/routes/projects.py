from typing import Annotated
from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.project import CustomProject
from app.schemas.project import ProjectCreate
from app.core.security import get_current_user

router = APIRouter()

@router.post("/")
def create_project(project: ProjectCreate, token: Annotated[str | None, Header()] = None, db: Session = Depends(get_db)):
    user_id=get_current_user(token, db)
    new_project = CustomProject(
        user_id=user_id,
        name = project.name,
        total_price = project.total_price,
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