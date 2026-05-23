# models.py — table prefix: build_a_full_stack_personal_finance_trac
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class Item(Base):
    __tablename__ = "build_a_full_stack_personal_finance_trac_items"
    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, index=True)
    description = Column(String, nullable=True)
    status      = Column(String, default="active")
    amount      = Column(Float, default=0.0)
    category    = Column(String, default="General")
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
