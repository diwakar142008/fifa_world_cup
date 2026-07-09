"""Vendor operations models for inventory, demand forecasting, and orders."""

import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, Text, ForeignKey, Enum as SAEnum, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum


class InventoryStatus(str, enum.Enum):
    GOOD = "good"
    MEDIUM = "medium"
    LOW = "low"
    CRITICAL = "critical"


class Vendor(Base):
    __tablename__ = "vendors"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stadium_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stadiums.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(200))
    location: Mapped[str] = mapped_column(String(200))
    vendor_type: Mapped[str] = mapped_column(String(100))  # food, beverage, merch
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    peak_hours_start: Mapped[str | None] = mapped_column(String(5), nullable=True)
    peak_hours_end: Mapped[str | None] = mapped_column(String(5), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "name": self.name,
            "location": self.location,
            "vendor_type": self.vendor_type,
            "is_active": self.is_active,
            "peak_hours": f"{self.peak_hours_start} - {self.peak_hours_end}" if self.peak_hours_start else None,
        }


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vendor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("vendors.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(200))
    current_stock: Mapped[int] = mapped_column(Integer)
    forecast_demand: Mapped[int] = mapped_column(Integer)
    reorder_threshold: Mapped[int] = mapped_column(Integer)
    unit: Mapped[str] = mapped_column(String(50), default="units")
    status: Mapped[InventoryStatus] = mapped_column(SAEnum(InventoryStatus), default=InventoryStatus.GOOD)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "vendor_id": str(self.vendor_id),
            "name": self.name,
            "current_stock": self.current_stock,
            "forecast_demand": self.forecast_demand,
            "reorder_threshold": self.reorder_threshold,
            "unit": self.unit,
            "status": self.status.value,
        }


class Order(Base):
    __tablename__ = "vendor_orders"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vendor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("vendors.id"), nullable=False)
    item_name: Mapped[str] = mapped_column(String(200))
    quantity: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
