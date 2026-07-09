"""Sustainability models for environmental monitoring and tracking."""

import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum


class MetricType(str, enum.Enum):
    ENERGY = "energy"
    WATER = "water"
    WASTE = "waste"
    CARBON = "carbon"
    PLASTIC = "plastic"


class SustainabilityMetric(Base):
    __tablename__ = "sustainability_metrics"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stadium_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("stadiums.id"), nullable=False, index=True)
    metric_type: Mapped[MetricType] = mapped_column(SAEnum(MetricType))
    value: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String(50))
    reduction_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="good")
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "metric_type": self.metric_type.value,
            "value": self.value,
            "unit": self.unit,
            "reduction_pct": round(self.reduction_pct, 1) if self.reduction_pct else None,
            "status": self.status,
            "timestamp": self.timestamp.isoformat(),
        }
