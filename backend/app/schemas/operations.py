"""Operations Dashboard schemas — AI-generated summaries, domain status, and real-time metrics."""

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class DomainStatus(BaseModel):
    """Status snapshot for a single operations domain."""
    domain: str
    status: str  # online | warning | critical | offline
    health_score: float = Field(..., ge=0, le=100)
    active_count: int = 0
    total_count: int = 0
    details: str = ""


class IncidentSummary(BaseModel):
    """Summary of current incidents across the stadium."""
    total_active: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    average_response_time_min: float
    most_recent: list[dict] = []


class CrowdSummary(BaseModel):
    """Real-time crowd metrics."""
    current_attendance: int
    total_capacity: int
    occupancy_pct: float
    zones_critical: int
    zones_high: int
    zones_moderate: int
    zones_low: int
    gate_throughput_rate: int
    trend_direction: str  # rising | stable | falling
    peak_time_estimate: Optional[str] = None


class VendorSummary(BaseModel):
    """Vendor and concession status."""
    total_outlets: int
    critical_stock_count: int
    low_stock_count: int
    peak_demand_period: str
    revenue_per_hour: float
    top_selling_item: str


class TransportSummary(BaseModel):
    """Transit and parking status."""
    metro_lines_online: int
    metro_lines_delayed: int
    shuttle_buses_active: int
    parking_lots_full: int
    total_parking_capacity: int
    road_conditions: str  # clear | moderate | heavy


class MedicalSummary(BaseModel):
    """Medical operations summary."""
    active_incidents: int
    responder_teams_available: int
    total_responder_teams: int
    equipment_ready_pct: float
    triage_capacity_used: int
    triage_capacity_total: int


class SecuritySummary(BaseModel):
    """Security operations summary."""
    personnel_on_duty: int
    cameras_online: int
    total_cameras: int
    active_alerts: int
    zones_secured: int
    total_zones: int


class AIGeneratedSummary(BaseModel):
    """Generative AI narrative summary of current operations."""
    headline: str
    narrative: str
    risk_level: str
    confidence_score: float = Field(..., ge=0, le=1)
    key_insights: list[str] = []
    top_recommendations: list[str] = []
    predicted_hotspots: list[str] = []


class OperationsDashboardResponse(BaseModel):
    """Complete operations dashboard data payload."""
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    ai_summary: AIGeneratedSummary
    crowd: CrowdSummary
    incidents: IncidentSummary
    vendor: VendorSummary
    transport: TransportSummary
    medical: MedicalSummary
    security: SecuritySummary
    domains: list[DomainStatus] = []
    crowd_trend_history: list[dict] = []
    incident_trend_history: list[dict] = []
    vendor_trend_history: list[dict] = []
