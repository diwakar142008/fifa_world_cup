"""Real-time crowd data and AI prediction models."""

import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class CrowdData(Base):
    __tablename__ = "crowd_data"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    zone_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("zones.id"), nullable=False, index=True)
    stadium_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stadiums.id"), nullable=False, index=True)
    current_count: Mapped[int] = mapped_column(Integer)
    capacity: Mapped[int] = mapped_column(Integer)
    density_pct: Mapped[float] = mapped_column(Float)
    flow_rate: Mapped[int] = mapped_column(Integer, default=0)  # people per minute
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "zone_id": str(self.zone_id),
            "current_count": self.current_count,
            "capacity": self.capacity,
            "density_pct": round(self.density_pct, 1),
            "flow_rate": self.flow_rate,
            "timestamp": self.timestamp.isoformat(),
            "status": "critical" if self.density_pct > 85 else "high" if self.density_pct > 65 else "moderate" if self.density_pct > 40 else "low",
        }


class CrowdPrediction(Base):
    __tablename__ = "crowd_predictions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    zone_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("zones.id"), nullable=False, index=True)
    predicted_pct: Mapped[float] = mapped_column(Float)
    confidence: Mapped[float] = mapped_column(Float, default=0.85)
    prediction_minutes: Mapped[int] = mapped_column(Integer)  # e.g., 10 = predicted in 10 min
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
