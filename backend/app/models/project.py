from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from app.db.base import Base

class CustomProject(Base):
    __tablename__ = "custom_projects"

    project_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    name = Column(String)
    total_price = Column(Float)
    created_at = Column(DateTime)
    category_id = Column(Integer)
    metal = Column(String)
    project_size = Column(Integer)
    trinket1 = Column(String)
    trinket2 = Column(String)