from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey("categories.category_id"))
    name = Column(String)
    price = Column(Float)
    image_path = Column(String)