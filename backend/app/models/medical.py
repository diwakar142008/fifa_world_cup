"""Medical models for incidents, responder teams, and equipment."""

import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Text, Boolean, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum


class ResponderStatus(str, enum.Enum):
    ON_CALL = "on-call"
    RESPONDING = "responding"
    STATIONED = "stationed"
    OFF_DUTY = "off-duty"


class MedicalIncident(Base):
    __tablename__ = "medical_incidents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stadium_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stadiums.id"), nullable=False)
    incident_type: Mapped[str] = mapped_column(String(100))  # faintness, allergic, injury, cardiac, etc
    location_name: Mapped[str] = mapped_column(String(200))
    priority: Mapped[str] = mapped_column(String(20), default="medium")
    status: Mapped[str] = mapped_column(String(20), default="active")
    responder_team_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("responder_teams.id"), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    eta_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "incident_type": self.incident_type,
            "location_name": self.location_name,
            "priority": self.priority,
            "status": self.status,
            "responder_team_id": str(self.responder_team_id) if self.responder_team_id else None,
            "notes": self.notes,
            "eta_minutes": self.eta_minutes,
            "created_at": self.created_at.isoformat(),
        }


class ResponderTeam(Base):
    __tablename__ = "responder_teams"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stadium_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stadiums.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(100))
    status: Mapped[ResponderStatus] = mapped_column(SAEnum(ResponderStatus), default=ResponderStatus.ON_CALL)
    location: Mapped[str] = mapped_column(String(200))
    member_count: Mapped[int] = mapped_column(Integer, default=2)
    equipment_level: Mapped[str] = mapped_column(String(20), default="full")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "name": self.name,
            "status": self.status.value,
            "location": self.location,
            "member_count": self.member_count,
            "equipment_level": self.equipment_level,
        }


class Equipment(Base):
    __tablename__ = "medical_equipment"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stadium_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stadiums.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(200))
    total_count: Mapped[int] = mapped_column(Integer)
    available_count: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(20), default="operational")
    locations: Mapped[str] = mapped_column(String(300))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
