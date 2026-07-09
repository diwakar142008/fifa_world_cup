"""Stadium, Zone, and Point-of-Interest models."""

import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum


class ZoneType(str, enum.Enum):
    SECTION = "section"
    CONCOURSE = "concourse"
    FOOD_COURT = "food_court"
    VIP = "vip"
    PARKING = "parking"
    GATE_AREA = "gate_area"
    RESTROOM = "restroom"
    MEDICAL = "medical"
    CORRIDOR = "corridor"


class POIType(str, enum.Enum):
    GATE = "gate"
    RESTROOM = "restroom"
    FOOD = "food"
    MEDICAL = "medical"
    INFO = "info"
    PARKING = "parking"
    ENTRANCE = "entrance"
    ESCALATOR = "escalator"
    ELEVATOR = "elevator"
    STORE = "store"


class Stadium(Base):
    __tablename__ = "stadiums"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    location: Mapped[str] = mapped_column(String(300))
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    total_capacity: Mapped[int] = mapped_column(Integer)
    current_attendance: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    match_day: Mapped[int] = mapped_column(Integer, default=0)
    match_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    weather_condition: Mapped[str | None] = mapped_column(String(100), nullable=True)
    temperature_f: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    zones: Mapped[list["Zone"]] = relationship("Zone", back_populates="stadium", cascade="all, delete-orphan")
    pois: Mapped[list["POI"]] = relationship("POI", back_populates="stadium", cascade="all, delete-orphan")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "name": self.name,
            "slug": self.slug,
            "location": self.location,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "total_capacity": self.total_capacity,
            "current_attendance": self.current_attendance,
            "match_day": self.match_day,
            "match_name": self.match_name,
            "weather_condition": self.weather_condition,
            "temperature_f": self.temperature_f,
            "occupancy_pct": round((self.current_attendance / self.total_capacity) * 100, 1) if self.total_capacity else 0,
        }


class Zone(Base):
    __tablename__ = "zones"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stadium_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stadiums.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    zone_type: Mapped[ZoneType] = mapped_column(SAEnum(ZoneType), default=ZoneType.SECTION)
    capacity: Mapped[int] = mapped_column(Integer)
    current_count: Mapped[int] = mapped_column(Integer, default=0)
    crowd_level: Mapped[int] = mapped_column(Integer, default=0)  # 0-100
    status: Mapped[str] = mapped_column(String(20), default="low")  # low, moderate, high, critical
    level: Mapped[int] = mapped_column(Integer, default=1)
    color: Mapped[str | None] = mapped_column(String(7), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    # Relationships
    stadium: Mapped["Stadium"] = relationship("Stadium", back_populates="zones")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "stadium_id": str(self.stadium_id),
            "name": self.name,
            "zone_type": self.zone_type.value,
            "capacity": self.capacity,
            "current_count": self.current_count,
            "crowd_level": self.crowd_level,
            "status": self.status,
            "level": self.level,
        }


class POI(Base):
    __tablename__ = "points_of_interest"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stadium_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stadiums.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    poi_type: Mapped[POIType] = mapped_column(SAEnum(POIType))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(20), default="open")
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    # Relationships
    stadium: Mapped["Stadium"] = relationship("Stadium", back_populates="pois")

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "stadium_id": str(self.stadium_id),
            "name": self.name,
            "poi_type": self.poi_type.value,
            "description": self.description,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "status": self.status,
        }
