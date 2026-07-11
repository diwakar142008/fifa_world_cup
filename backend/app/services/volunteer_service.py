"""Volunteer allocation and shortage forecasting for stadium operations."""

from datetime import UTC, datetime


class VolunteerService:
    """Allocate available volunteers using priority, skills, and workload."""

    PRIORITY_MULTIPLIER = {"critical": 1.5, "high": 1.25, "medium": 1.0, "low": 0.75}

    @classmethod
    def assign(
        cls,
        zone: str,
        required: int,
        volunteers: list[dict],
        priority: str = "medium",
        required_skills: list[str] | None = None,
    ) -> dict:
        """Return ranked assignments without mutating the supplied roster."""
        if required < 1:
            raise ValueError("required must be at least 1")
        skills = set(required_skills or [])
        available = [v for v in volunteers if v.get("status", "available") == "available"]

        def rank(volunteer: dict) -> tuple:
            volunteer_skills = set(volunteer.get("skills", []))
            skill_matches = len(skills & volunteer_skills)
            return (-skill_matches, volunteer.get("workload", 0), volunteer.get("eta_minutes", 999))

        selected = sorted(available, key=rank)[:required]
        shortage = max(0, required - len(selected))
        assignments = [
            {
                "volunteer_id": volunteer["id"],
                "name": volunteer.get("name", volunteer["id"]),
                "zone": zone,
                "eta_minutes": volunteer.get("eta_minutes", 10),
                "matched_skills": sorted(skills & set(volunteer.get("skills", []))),
                "notification": f"Report to {zone}; priority {priority}.",
            }
            for volunteer in selected
        ]
        coverage = round(len(selected) / required * 100, 1)
        return {
            "zone": zone,
            "priority": priority,
            "assignments": assignments,
            "requested": required,
            "assigned": len(selected),
            "shortage": shortage,
            "coverage_pct": coverage,
            "risk_level": "high" if shortage else "low",
            "confidence_score": min(0.98, 0.72 + coverage / 500),
            "recommended_actions": (
                ["Notify reserve volunteers", "Relocate staff from the nearest low-risk zone"]
                if shortage
                else ["Confirm assignments", "Reassess workload in 15 minutes"]
            ),
            "generated_at": datetime.now(UTC).isoformat(),
        }

    @classmethod
    def forecast_shortage(cls, demand: int, available: int, priority: str = "medium") -> dict:
        """Estimate shortage risk from demand, availability, and incident priority."""
        if demand < 0 or available < 0:
            raise ValueError("demand and available must be non-negative")
        adjusted_demand = round(demand * cls.PRIORITY_MULTIPLIER.get(priority, 1.0))
        shortage = max(0, adjusted_demand - available)
        probability = 0.0 if adjusted_demand == 0 else min(1.0, shortage / adjusted_demand + 0.15)
        return {
            "adjusted_demand": adjusted_demand,
            "available": available,
            "predicted_shortage": shortage,
            "shortage_probability": round(probability, 2),
            "risk_level": "high" if probability >= 0.6 else "medium" if probability >= 0.3 else "low",
        }
