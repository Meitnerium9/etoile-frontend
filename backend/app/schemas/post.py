from pydantic import BaseModel
from datetime import datetime
from typing import Optional
#CRUD dla postów

# Tworzenie posta
class PostCreate(BaseModel):
    project_id: Optional[int] = None
    title: str
    description: str
    image_path: Optional[str] = None

# Update dla posta
class PostUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_path: Optional[str] = None

# Zwracanie odpowiedzi do frontendu
class PostResponse(BaseModel):
    post_id: int
    user_id: int
    project_id: Optional[int] = None
    title: str
    description: str
    image_path: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True