"""Tests for volunteer allocation and emergency decision support."""

import pytest

from app.services.emergency_response_service import EmergencyResponseService
from app.services.volunteer_service import VolunteerService


ROSTER = [
    {"id": "v1", "name": "A", "skills": ["medical"], "workload": 1, "eta_minutes": 3},
    {"id": "v2", "name": "B", "skills": ["crowd_control"], "workload": 0, "eta_minutes": 4},
    {"id": "v3", "name": "C", "skills": ["medical"], "workload": 2, "eta_minutes": 2},
]


def test_assignments_prefer_required_skill_and_report_shortage():
    result = VolunteerService.assign("Section 112", 3, ROSTER, "critical", ["medical"])
    assert result["assignments"][0]["volunteer_id"] == "v1"
    assert result["assigned"] == 3
    assert result["coverage_pct"] == 100


def test_assignment_validation():
    with pytest.raises(ValueError):
        VolunteerService.assign("Gate A", 0, ROSTER)


def test_shortage_forecast_accounts_for_priority():
    result = VolunteerService.forecast_shortage(6, 4, "critical")
    assert result["adjusted_demand"] == 9
    assert result["predicted_shortage"] == 5


def test_emergency_plan_contains_decision_support_contract():
    result = EmergencyResponseService.build_plan(
        {"id": "i1", "type": "medical", "severity": "critical", "zone": "Section 112", "evacuation_required": True},
        ROSTER,
    )
    assert result["priority"] == "P0"
    assert result["expected_impact"]["evacuation_recommended"] is True
    assert result["reasoning"]
    assert result["timeline"]
    assert result["volunteer_assignments"]
