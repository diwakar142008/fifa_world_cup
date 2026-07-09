"""Mock data generator for development and demo mode.

Provides realistic stadium operations data for all API endpoints
without requiring a live database or third-party integrations.
"""

import random
from datetime import datetime, timedelta
from typing import Any

# ─── Seeded Randomness ─────────────────────────────────────────

_SEED = 42
random.seed(_SEED)


def _jitter(base: float, pct: float = 0.1) -> float:
    """Add random jitter to a base value."""
    return base * (1 + random.uniform(-pct, pct))


def _pick_weighted(options: list[tuple[Any, float]]) -> Any:
    """Pick from weighted options."""
    items, weights = zip(*options)
    return random.choices(items, weights=weights, k=1)[0]


# ─── Stadium ───────────────────────────────────────────────────

def get_mock_stadium_data() -> dict:
    now = datetime.utcnow()
    attendance = int(_jitter(62843, 0.02))
    capacity = 75000
    occupancy_pct = round((attendance / capacity) * 100, 1)

    return {
        "id": "stadium-001",
        "name": "MetLife Stadium",
        "slug": "metlife-stadium",
        "location": "East Rutherford, NJ",
        "latitude": 40.8135,
        "longitude": -74.0745,
        "total_capacity": capacity,
        "current_attendance": attendance,
        "occupancy_pct": occupancy_pct,
        "match_day": 12,
        "match_name": "Quarter-Final: BRA v ARG",
        "weather_condition": "Clear",
        "temperature_f": round(_jitter(72, 0.05), 1),
        "timestamp": now.isoformat(),
        "zones": _get_mock_zones(attendance),
        "pois": _get_mock_pois(),
        "crowd_data": _get_mock_crowd_data(),
        "incidents": _get_mock_incidents(),
    }


def _get_mock_zones(attendance: int) -> list[dict]:
    zones_data = [
        ("Section 100 (Lower Bowl)", 72, 2800, "high"),
        ("Section 101", 45, 2400, "moderate"),
        ("Section 102", 88, 2600, "critical"),
        ("Section 200 (Club Level)", 55, 3200, "moderate"),
        ("Section 201", 30, 2800, "low"),
        ("Section 202", 67, 3000, "high"),
        ("Section 300 (Upper Bowl)", 41, 3500, "low"),
        ("Section 301", 25, 3000, "low"),
        ("Section 302", 59, 3200, "moderate"),
        ("VIP Lounge", 35, 500, "low"),
        ("Food Court 1", 82, 400, "critical"),
        ("Food Court 2", 45, 350, "moderate"),
        ("Food Court 3", 91, 400, "critical"),
        ("Main Concourse", 63, 5000, "high"),
    ]
    return [
        {
            "id": f"zone-{i:03d}",
            "name": name,
            "crowd_level": level,
            "capacity": cap,
            "current_count": int(cap * level / 100),
            "status": status,
        }
        for i, (name, level, cap, status) in enumerate(zones_data)
    ]


def _get_mock_pois() -> list[dict]:
    pois = [
        ("Gate A — Main Entrance", "gate", -74.0765, 40.8135, "busy"),
        ("Gate B — East Entrance", "gate", -74.0725, 40.8145, "open"),
        ("Gate C — South Entrance", "gate", -74.0765, 40.8115, "busy"),
        ("Gate D — West Entrance", "gate", -74.0785, 40.8135, "open"),
        ("Restroom — Section 100", "restroom", -74.0748, 40.8138, "busy"),
        ("Restroom — Section 200", "restroom", -74.0752, 40.8142, "open"),
        ("Restroom — Section 300", "restroom", -74.0768, 40.8128, "busy"),
        ("Food Court 1 — North", "food", -74.0758, 40.8148, "busy"),
        ("Food Court 2 — East", "food", -74.0730, 40.8140, "open"),
        ("Food Court 3 — South", "food", -74.0755, 40.8122, "busy"),
        ("Medical Station — Main", "medical", -74.0750, 40.8135, "open"),
        ("Medical Station — Upper", "medical", -74.0765, 40.8130, "open"),
        ("Information Desk — Main", "info", -74.0745, 40.8138, "open"),
        ("Lot A — North", "parking", -74.0780, 40.8165, "busy"),
        ("Lot B — East", "parking", -74.0700, 40.8155, "busy"),
    ]
    return [
        {"id": f"poi-{i:03d}", "name": name, "poi_type": ptype, "latitude": lat, "longitude": lng, "status": status}
        for i, (name, ptype, lat, lng, status) in enumerate(pois)
    ]


def _get_mock_crowd_data() -> list[dict]:
    now = datetime.utcnow()
    gates = [
        ("Gate A", 78, 100), ("Gate B", 45, 100),
        ("Gate C", 23, 100), ("Gate D", 34, 100),
    ]
    return [
        {
            "zone_id": f"gate-{i}",
            "zone_name": name,
            "current_count": int(cap * pct / 100),
            "capacity": cap,
            "density_pct": pct,
            "flow_rate": random.randint(10, 80),
            "status": "critical" if pct > 85 else "high" if pct > 65 else "moderate" if pct > 40 else "low",
            "timestamp": now.isoformat(),
        }
        for i, (name, pct, cap) in enumerate(gates)
    ]


def _get_mock_incidents() -> list[dict]:
    now = datetime.utcnow()
    return [
        {
            "id": "INC-001",
            "incident_type": "medical",
            "priority": "high",
            "status": "active",
            "title": "Medical emergency — Section 304",
            "description": "Fan feeling faint, vital signs stable. EMT en route.",
            "location_name": "Section 304, Row J",
            "created_at": (now - timedelta(minutes=5)).isoformat(),
        },
        {
            "id": "INC-002",
            "incident_type": "security",
            "priority": "medium",
            "status": "active",
            "title": "Unattended bag — Gate C",
            "description": "Bag reported near ticket booth. Security investigating.",
            "location_name": "Gate C",
            "created_at": (now - timedelta(minutes=2)).isoformat(),
        },
        {
            "id": "INC-003",
            "incident_type": "other",
            "priority": "low",
            "status": "resolved",
            "title": "Spill cleaned — Corridor 2A",
            "description": "Cleaning crew completed cleanup. Corridor reopened.",
            "location_name": "Corridor 2A",
            "created_at": (now - timedelta(minutes=20)).isoformat(),
            "resolved_at": (now - timedelta(minutes=15)).isoformat(),
        },
    ]


# ─── Medical ───────────────────────────────────────────────────

def get_mock_medical_data() -> dict:
    return {
        "incidents": [
            {
                "id": "MED-001", "incident_type": "Faintness",
                "location_name": "Section 304, Row J",
                "priority": "medium", "status": "active",
                "responder": "Team Alpha", "eta_minutes": 2,
                "notes": "Fan feeling dizzy, seated, vital signs stable",
            },
            {
                "id": "MED-002", "incident_type": "Allergic Reaction",
                "location_name": "Food Court 3",
                "priority": "high", "status": "active",
                "responder": "Team Bravo", "eta_minutes": 1,
                "notes": "Possible nut allergy. EpiPen available.",
            },
            {
                "id": "MED-003", "incident_type": "Minor Injury",
                "location_name": "Gate A",
                "priority": "low", "status": "pending",
                "responder": "Team Charlie", "eta_minutes": 5,
                "notes": "Twisted ankle, walking with assistance",
            },
        ],
        "responders": [
            {"name": "Team Alpha", "status": "on-call", "location": "Section 301", "member_count": 3},
            {"name": "Team Bravo", "status": "responding", "location": "Food Court 3", "member_count": 2},
            {"name": "Team Charlie", "status": "on-call", "location": "Gate A", "member_count": 2},
            {"name": "Team Delta", "status": "stationed", "location": "Medical Room 2", "member_count": 3},
        ],
        "equipment": [
            {"name": "AED Defibrillators", "total_count": 24, "available_count": 22, "status": "operational"},
            {"name": "Stretchers", "total_count": 16, "available_count": 14, "status": "operational"},
            {"name": "Oxygen Tanks", "total_count": 6, "available_count": 4, "status": "low"},
        ],
    }


# ─── Security ──────────────────────────────────────────────────

def get_mock_security_data() -> dict:
    return {
        "zones": [
            {"name": "Gate A", "status": "secure", "personnel": 4, "crowd_pct": 78},
            {"name": "Gate B", "status": "secure", "personnel": 3, "crowd_pct": 45},
            {"name": "Gate C", "status": "warning", "personnel": 2, "crowd_pct": 23},
            {"name": "VIP Zone", "status": "secure", "personnel": 8, "crowd_pct": 12},
            {"name": "Parking East", "status": "warning", "personnel": 3, "crowd_pct": 78},
            {"name": "Section 210", "status": "critical", "personnel": 2, "crowd_pct": 89},
            {"name": "Food Court 4", "status": "warning", "personnel": 1, "crowd_pct": 67},
        ],
        "alerts": [
            {"type": "warning", "message": "Unattended bag — Gate C", "time": "2m ago", "priority": "high"},
            {"type": "info", "message": "VIP vehicle approaching East entrance", "time": "5m ago", "priority": "medium"},
            {"type": "critical", "message": "Section 210 crowd density critical", "time": "1m ago", "priority": "high"},
        ],
        "personnel": {"on_duty": 28, "zones_covered": 6, "cameras_online": 64},
    }


# ─── Vendor ────────────────────────────────────────────────────

def get_mock_vendor_data() -> dict:
    return {
        "inventory": [
            {"name": "Hot Dogs", "current_stock": 340, "forecast_demand": 520, "unit": "units", "status": "low"},
            {"name": "Burgers", "current_stock": 280, "forecast_demand": 410, "unit": "units", "status": "critical"},
            {"name": "Bottled Water", "current_stock": 2400, "forecast_demand": 3100, "unit": "bottles", "status": "medium"},
            {"name": "Soft Drinks", "current_stock": 1800, "forecast_demand": 2500, "unit": "cans", "status": "medium"},
            {"name": "Popcorn", "current_stock": 120, "forecast_demand": 200, "unit": "bags", "status": "critical"},
            {"name": "Pizza Slices", "current_stock": 90, "forecast_demand": 180, "unit": "slices", "status": "critical"},
        ],
        "peak_hours": [
            {"time_range": "6:00 PM — 8:00 PM", "demand": "Very High", "crowd_pct": 92, "recommended_staff": 12},
            {"time_range": "4:00 PM — 6:00 PM", "demand": "High", "crowd_pct": 78, "recommended_staff": 8},
            {"time_range": "8:00 PM — 10:00 PM", "demand": "Medium", "crowd_pct": 55, "recommended_staff": 6},
        ],
        "alerts": [
            {"message": "Food Court 4 demand spiking — 2x normal rate", "type": "urgent"},
            {"message": "Burgers running low at Station B — 15 remaining", "type": "urgent"},
            {"message": "Water sales 30% above forecast", "type": "warning"},
        ],
    }


# ─── Transport ─────────────────────────────────────────────────

def get_mock_transport_data() -> dict:
    return {
        "transit": [
            {"name": "Metro Line 1 (Red)", "status": "on-time", "next_arrival_min": 2, "crowd_level": "moderate"},
            {"name": "Metro Line 2 (Blue)", "status": "delayed", "next_arrival_min": 8, "crowd_level": "high", "delay_minutes": 8},
            {"name": "Metro Line 3 (Green)", "status": "on-time", "next_arrival_min": 4, "crowd_level": "low"},
            {"name": "Shuttle Bus — East Lot", "status": "on-time", "next_arrival_min": 3, "crowd_level": "moderate"},
            {"name": "Express Bus — Downtown", "status": "delayed", "next_arrival_min": 12, "crowd_level": "high", "delay_minutes": 6},
        ],
        "parking": [
            {"name": "Lot A — North", "occupancy_pct": 92, "total_spaces": 1200, "available_spaces": 96},
            {"name": "Lot B — East", "occupancy_pct": 78, "total_spaces": 800, "available_spaces": 176},
            {"name": "Lot C — South", "occupancy_pct": 45, "total_spaces": 600, "available_spaces": 330},
            {"name": "VIP Parking", "occupancy_pct": 88, "total_spaces": 200, "available_spaces": 24},
        ],
        "traffic": [
            {"route_name": "Stadium → Downtown", "condition": "heavy", "estimated_time_min": 28, "normal_time_min": 14},
            {"route_name": "Stadium → Airport", "condition": "moderate", "estimated_time_min": 35, "normal_time_min": 25},
            {"route_name": "Stadium → East Side", "condition": "clear", "estimated_time_min": 18, "normal_time_min": 16},
            {"route_name": "Stadium → West Side", "condition": "heavy", "estimated_time_min": 32, "normal_time_min": 18},
        ],
    }
