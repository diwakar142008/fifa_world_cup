"""Transportation models for transit lines, parking, and traffic."""

import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, ForeignKey, Enum as SAEnum, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum


class TransitStatus(str, enum.Enum):
    ON_TIME = "on-time"
    DELAYED = "delayed"
    CANCELLED = "cancelled"


class TransitLine(Base):
    __tablename__ = "transit_lines"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stadium_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stadiums.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(200))
    line_type: Mapped[str] = mapped_column(String(50))  # metro, bus, shuttle
    status: Mapped[TransitStatus] = mapped_column(SAEnum(TransitStatus), default=TransitStatus.ON_TIME)
    next_arrival_min: Mapped[int] = mapped_column(Integer, default=0)
    delay_minutes: Mapped[int] = mapped_column(Integer, default=0)
    crowd_level: Mapped[str] = mapped_column(String(20), default="moderate")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "name": self.name,
            "line_type": self.line_type,
            "status": self.status.value,
            "next_arrival_min": self.next_arrival_min,
            "delay_minutes": self.delay_minutes,
            "crowd_level": self.crowd_level,
        }


class ParkingLot(Base):
    __tablename__ = "parking_lots"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stadium_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stadiums.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(200))
    total_spaces: Mapped[int] = mapped_column(Integer)
    available_spaces: Mapped[int] = mapped_column(Integer)
    occupancy_pct: Mapped[float] = mapped_column(Float, default=0)
    status: Mapped[str] = mapped_column(String(20), default="active")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "name": self.name,
            "total_spaces": self.total_spaces,
            "available_spaces": self.available_spaces,
            "occupancy_pct": round(self.occupancy_pct, 1),
            "status": "critical" if self.occupancy_pct > 85 else "warning" if self.occupancy_pct > 60 else "active" if self.occupancy_pct > 20 else "cleared",
        }


class TrafficPrediction(Base):
    __tablename__ = "traffic_predictions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stadium_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stadiums.id"), nullable=False)
    route_name: Mapped[str] = mapped_column(String(200))
    condition: Mapped[str] = mapped_column(String(50))  # clear, moderate, heavy
    estimated_time_min: Mapped[int] = mapped_column(Integer)
    normal_time_min: Mapped[int] = mapped_column(Integer)
    recommendation: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
