"""Stadium, zone, and point-of-interest Pydantic schemas."""

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID


class StadiumBase(BaseModel):
    name: str
    slug: str
    location: str
    latitude: float
    longitude: float
    total_capacity: int = 75000

class StadiumCreate(StadiumBase):
    pass

class StadiumResponse(StadiumBase):
    id: UUID
    current_attendance: int = 0
    match_day: int = 0
    match_name: Optional[str] = None
    weather_condition: Optional[str] = None
    temperature_f: Optional[float] = None
    occupancy_pct: float = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class ZoneResponse(BaseModel):
    id: UUID
    stadium_id: UUID
    name: str
    zone_type: str
    capacity: int
    current_count: int
    crowd_level: int
    status: str
    level: int

    model_config = {"from_attributes": True}


class POIResponse(BaseModel):
    id: UUID
    stadium_id: UUID
    name: str
    poi_type: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    status: str

    model_config = {"from_attributes": True}


class CrowdDataResponse(BaseModel):
    id: UUID
    zone_id: UUID
    current_count: int
    capacity: int
    density_pct: float
    flow_rate: int
    timestamp: datetime
    status: str

    model_config = {"from_attributes": True}


class IncidentResponse(BaseModel):
    id: UUID
    incident_type: str
    priority: str
    status: str
    title: str
    description: Optional[str] = None
    location_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    reported_by: Optional[str] = None
    assigned_to: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class AIMessage(BaseModel):
    role: str = Field(..., pattern="^(user|ai|system)$")
    content: str


class AIChatRequest(BaseModel):
    messages: list[AIMessage]
    context: Optional[dict] = None


class AIChatResponse(BaseModel):
    response: str
    confidence: float = 0.85
    risk_level: str = "low"
    recommendations: list[str] = []
    alternative_actions: list[str] = []
    reasoning: str = ""
