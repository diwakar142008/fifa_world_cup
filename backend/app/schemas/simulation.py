"""Simulation engine Pydantic schemas."""

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class SimulationRequest(BaseModel):
    """Request to run a what-if simulation."""
    query: str = Field(..., min_length=3, description="Natural language scenario, e.g. 'What happens if Gate A closes?'")
    scenario_type: Optional[str] = Field(None, description="Optional explicit scenario type: gate_closure, rain, metro_delay, power_failure, evacuation, custom")


class SimulationResult(BaseModel):
    """Single simulation result metric."""
    metric: str
    before: str | float
    after: str | float
    unit: str
    impact: str  # positive, negative, neutral
    delta_pct: float  # percentage change


class SimulationImpact(BaseModel):
    """Impact assessment for a simulation."""
    queue_times: list[SimulationResult]
    walking_times: list[SimulationResult]
    safety: list[SimulationResult]
    transport: list[SimulationResult]
    revenue: list[SimulationResult]
    crowd_flow: list[SimulationResult]


class SimulationResponse(BaseModel):
    """Full simulation response."""
    id: str
    scenario: str
    query: str
    summary: str
    risk_level: str
    confidence_score: float
    impacts: SimulationImpact
    recommended_actions: list[str]
    alternatives: list[str]
    expected_outcome: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class ScenarioPreset(BaseModel):
    """Pre-defined simulation scenario."""
    id: str
    title: str
    description: str
    icon: str
    category: str
    severity: str  # low, moderate, high, critical
    example_query: str
