"""Decision-support workflow for stadium emergency response."""

from datetime import UTC, datetime

from app.services.volunteer_service import VolunteerService


class EmergencyResponseService:
    """Create an auditable response plan from incident and staffing data."""

    @staticmethod
    def build_plan(incident: dict, volunteers: list[dict]) -> dict:
        """Analyze an incident and return assignments, timeline, and expected impact."""
        severity = incident.get("severity", "medium").lower()
        zone = incident.get("zone", "unknown zone")
        required = {"critical": 8, "high": 5, "medium": 3, "low": 2}.get(severity, 3)
        required_skills = ["medical"] if incident.get("type") == "medical" else ["crowd_control"]
        allocation = VolunteerService.assign(zone, required, volunteers, severity, required_skills)
        evacuation = severity in {"critical", "high"} and incident.get("evacuation_required", False)
        response_minutes = max(2, min((a["eta_minutes"] for a in allocation["assignments"]), default=10))

        return {
            "incident_id": incident.get("id", "unassigned"),
            "situation_summary": f"{severity.title()} {incident.get('type', 'operational')} incident at {zone}.",
            "reasoning": "Severity, evacuation need, responder skills, workload, and travel time were ranked.",
            "confidence_score": allocation["confidence_score"],
            "risk_level": severity,
            "priority": "P0" if severity == "critical" else "P1" if severity == "high" else "P2",
            "recommended_actions": [
                "Establish an incident command point",
                "Keep the emergency access route clear",
                *( ["Begin phased evacuation using the nearest accessible exits"] if evacuation else [] ),
                *allocation["recommended_actions"],
            ],
            "alternative_actions": ["Move responders from the nearest low-risk zone", "Escalate to external emergency services"],
            "expected_impact": {
                "estimated_response_minutes": response_minutes,
                "staffing_coverage_pct": allocation["coverage_pct"],
                "evacuation_recommended": evacuation,
            },
            "volunteer_assignments": allocation["assignments"],
            "timeline": [
                {"minute": 0, "action": "Validate incident and notify command"},
                {"minute": response_minutes, "action": "First assigned responder arrives"},
                {"minute": response_minutes + 5, "action": "Reassess severity and publish status update"},
            ],
            "generated_at": datetime.now(UTC).isoformat(),
        }
