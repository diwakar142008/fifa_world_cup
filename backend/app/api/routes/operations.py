"""AI Operations Dashboard — aggregated domain data with generative summaries and real-time metrics."""

from fastapi import APIRouter
from datetime import datetime, timedelta
import random

from app.schemas.base import APIResponse
from app.schemas.operations import (
    AIGeneratedSummary,
    CrowdSummary,
    IncidentSummary,
    VendorSummary,
    TransportSummary,
    MedicalSummary,
    SecuritySummary,
    DomainStatus,
    OperationsDashboardResponse,
)
from app.mock_data.generator import (
    get_mock_stadium_data,
    get_mock_medical_data,
    get_mock_security_data,
    get_mock_vendor_data,
    get_mock_transport_data,
)

router = APIRouter(prefix="/operations", tags=["Operations Dashboard"])

_SEED = 42
random.seed(_SEED)


def _generate_ai_summary(data: dict, medical: dict, security: dict, vendor: dict, transport: dict) -> AIGeneratedSummary:
    """Generate an AI-powered narrative summary of current stadium operations."""
    zones = data.get("zones", [])
    critical_zones = [z for z in zones if z.get("status") == "critical"]
    high_zones = [z for z in zones if z.get("status") == "high"]
    incidents = data.get("incidents", [])
    active_incidents = [i for i in incidents if i.get("status") == "active"]
    attendance = data.get("current_attendance", 0)
    occupancy = data.get("occupancy_pct", 0)

    # Determine overall risk level
    risk_level = "low"
    if critical_zones:
        risk_level = "critical"
    elif len(high_zones) >= 3:
        risk_level = "high"
    elif len(active_incidents) >= 3:
        risk_level = "moderate"

    # Build narrative
    zone_summary = f"{len(critical_zones)} zones at critical capacity"
    if critical_zones:
        zone_summary += f" ({', '.join(z['name'] for z in critical_zones[:3])})"
    zone_summary += f", {len(high_zones)} zones elevated"

    incident_summary = f"{len(active_incidents)} active incidents"
    if active_incidents:
        incident_summary += f" — highest priority: {active_incidents[0].get('title', 'N/A')}"

    vendor_data = vendor.get("inventory", [])
    critical_stock = [v for v in vendor_data if v.get("status") == "critical"]
    transport_lines = transport.get("transit", [])
    delayed_lines = [t for t in transport_lines if t.get("status") == "delayed"]

    # Generate insight-driven recommendations
    insights = []
    recommendations = []
    hotspots = []

    if critical_zones:
        for z in critical_zones[:2]:
            insights.append(f"{z['name']} is at critical capacity ({z.get('crowd_level', 0)}%)")
            recommendations.append(f"Immediately deploy additional personnel to {z['name']}")
            hotspots.append(f"{z['name']} — critical crowd density")

    if critical_stock:
        items = ", ".join(v["name"] for v in critical_stock[:3])
        insights.append(f"Critical stock shortage: {items}")
        recommendations.append(f"Rush replenishment order for: {items}")

    if delayed_lines:
        lines = ", ".join(t["name"] for t in delayed_lines[:2])
        insights.append(f"Transit delays on {lines}")
        recommendations.append(f"Activate shuttle bus contingency for affected lines")

    if occupancy > 80:
        insights.append(f"Overall stadium occupancy at {occupancy}% — near capacity")
        recommendations.append("Consider redirecting late-arriving fans to underutilized sections")

    if not insights:
        insights.append("All systems operating within normal parameters")
        recommendations.append("Continue standard monitoring protocol")

    if not hotspots:
        hotspots.append("No critical hotspots predicted in next 30 minutes")

    headline = (
        f"Stadium operating at {occupancy}% capacity — {risk_level.upper()} risk — {len(active_incidents)} incidents active"
        if risk_level != "low"
        else f"All systems nominal — {attendance:,} attendees — {occupancy}% capacity"
    )

    narrative = (
        f"StadiumMind AI reports {attendance:,} of 75,000 attendees ({occupancy}% occupancy). "
        f"{zone_summary}. "
        f"{incident_summary}. "
        f"{len(medical.get('incidents', []))} medical cases active, "
        f"{security.get('personnel', {}).get('on_duty', 0)} security personnel on duty. "
        f"Vendor status: {len(critical_stock)} items critically low. "
        f"Transport: {len(delayed_lines)} transit lines experiencing delays. "
        f"Overall operations status: {risk_level.upper()}."
    )

    return AIGeneratedSummary(
        headline=headline,
        narrative=narrative,
        risk_level=risk_level,
        confidence_score=round(random.uniform(0.82, 0.95), 2),
        key_insights=insights,
        top_recommendations=recommendations[:5],
        predicted_hotspots=hotspots[:4],
    )


def _build_trend_history(hours_back: int = 3, interval_minutes: int = 15) -> list[dict]:
    """Generate mock trend history data for charts."""
    now = datetime.utcnow()
    points = hours_back * 60 // interval_minutes
    trend = []
    base_attendance = 60000
    base_incidents = 2
    base_vendor = 75

    for i in range(points):
        t = now - timedelta(minutes=i * interval_minutes)
        attendance = int(base_attendance + random.randint(-3000, 3000) + (i * 80))
        incidents = max(0, base_incidents + random.randint(-1, 2))
        vendor_score = max(0, min(100, base_vendor + random.randint(-10, 10) - (i // 4)))
        trend.append({
            "timestamp": t.isoformat(),
            "attendance": attendance,
            "incidents": incidents,
            "vendor_health": vendor_score,
        })

    trend.reverse()
    return trend


@router.get("/dashboard", response_model=APIResponse[OperationsDashboardResponse])
async def get_operations_dashboard():
    """Get the complete AI Operations Dashboard data — generative summary + real-time metrics."""
    data = get_mock_stadium_data()
    medical = get_mock_medical_data()
    security = get_mock_security_data()
    vendor = get_mock_vendor_data()
    transport = get_mock_transport_data()

    zones = data.get("zones", [])
    incidents_list = data.get("incidents", [])
    active_incidents = [i for i in incidents_list if i.get("status") == "active"]
    attendance = data.get("current_attendance", 0)
    capacity = data.get("total_capacity", 75000)
    occupancy = data.get("occupancy_pct", 0)

    # Crowd summary
    critical_zones = [z for z in zones if z.get("status") == "critical"]
    high_zones = [z for z in zones if z.get("status") == "high"]
    moderate_zones = [z for z in zones if z.get("status") == "moderate"]
    low_zones = [z for z in zones if z.get("status") == "low"]

    crowd = CrowdSummary(
        current_attendance=attendance,
        total_capacity=capacity,
        occupancy_pct=occupancy,
        zones_critical=len(critical_zones),
        zones_high=len(high_zones),
        zones_moderate=len(moderate_zones),
        zones_low=len(low_zones),
        gate_throughput_rate=random.randint(120, 180),
        trend_direction=random.choice(["rising", "stable", "falling"]),
        peak_time_estimate="7:30 PM — 8:15 PM",
    )

    # Incident summary
    priorities = [i.get("priority", "low") for i in active_incidents]
    incident = IncidentSummary(
        total_active=len(active_incidents),
        critical_count=priorities.count("critical"),
        high_count=priorities.count("high"),
        medium_count=priorities.count("medium"),
        low_count=priorities.count("low"),
        average_response_time_min=round(random.uniform(2.5, 5.0), 1),
        most_recent=active_incidents[:3],
    )

    # Vendor summary
    inventory = vendor.get("inventory", [])
    critical_stock = [v for v in inventory if v.get("status") == "critical"]
    low_stock = [v for v in inventory if v.get("status") == "low"]

    vendor_summary = VendorSummary(
        total_outlets=len(vendor.get("peak_hours", [])),
        critical_stock_count=len(critical_stock),
        low_stock_count=len(low_stock),
        peak_demand_period="6:00 PM — 8:00 PM",
        revenue_per_hour=round(random.uniform(42000, 68000), 0),
        top_selling_item="Bottled Water",
    )

    # Transport summary
    transit = transport.get("transit", [])
    delayed = [t for t in transit if t.get("status") == "delayed"]
    parking = transport.get("parking", [])
    full_lots = [p for p in parking if p.get("occupancy_pct", 0) >= 85]

    transport_summary = TransportSummary(
        metro_lines_online=len(transit) - len(delayed),
        metro_lines_delayed=len(delayed),
        shuttle_buses_active=random.randint(8, 16),
        parking_lots_full=len(full_lots),
        total_parking_capacity=sum(p.get("total_spaces", 0) for p in parking),
        road_conditions=random.choice(["clear", "moderate", "heavy"]),
    )

    # Medical summary
    med_incidents = medical.get("incidents", [])
    responders = medical.get("responders", [])
    available_responders = [r for r in responders if r.get("status") in ("on-call", "stationed")]
    equipment = medical.get("equipment", [])
    equip_ready = sum(1 for e in equipment if e.get("status") == "operational")

    medical_summary = MedicalSummary(
        active_incidents=len(med_incidents),
        responder_teams_available=len(available_responders),
        total_responder_teams=len(responders),
        equipment_ready_pct=round((equip_ready / max(len(equipment), 1)) * 100, 1),
        triage_capacity_used=random.randint(4, 18),
        triage_capacity_total=24,
    )

    # Security summary
    sec_zones = security.get("zones", [])
    sec_personnel = security.get("personnel", {})

    security_summary = SecuritySummary(
        personnel_on_duty=sec_personnel.get("on_duty", 0),
        cameras_online=sec_personnel.get("cameras_online", 0),
        total_cameras=64,
        active_alerts=len(security.get("alerts", [])),
        zones_secured=sum(1 for z in sec_zones if z.get("status") == "secure"),
        total_zones=len(sec_zones),
    )

    # Domain statuses
    domains = [
        DomainStatus(domain="Stadium Operations", status="online", health_score=92, active_count=attendance, total_count=capacity, details="All systems nominal"),
        DomainStatus(domain="Security", status="online" if security_summary.active_alerts < 3 else "warning", health_score=round(100 - (security_summary.active_alerts * 5), 1), active_count=security_summary.active_alerts, total_count=10, details=f"{sec_personnel.get('on_duty', 0)} personnel on duty"),
        DomainStatus(domain="Medical", status="online" if medical_summary.active_incidents < 3 else "warning", health_score=round(100 - (medical_summary.active_incidents * 8), 1), active_count=medical_summary.active_incidents, total_count=5, details=f"{medical_summary.responder_teams_available} teams available"),
        DomainStatus(domain="Vendor", status="warning" if vendor_summary.critical_stock_count > 0 else "online", health_score=round(100 - (vendor_summary.critical_stock_count * 10), 1), active_count=vendor_summary.critical_stock_count, total_count=10, details=f"{vendor_summary.critical_stock_count} items critically low"),
        DomainStatus(domain="Transport", status="warning" if transport_summary.metro_lines_delayed > 0 else "online", health_score=round(100 - (transport_summary.metro_lines_delayed * 15), 1), active_count=transport_summary.metro_lines_delayed, total_count=5, details=f"{transport_summary.metro_lines_delayed} lines delayed"),
        DomainStatus(domain="Cleaning", status="online", health_score=88, active_count=0, total_count=0, details="All facilities serviced"),
    ]

    # Generate AI summary
    ai_summary = _generate_ai_summary(data, medical, security, vendor, transport)

    # Trend history
    trend_history = _build_trend_history()

    # Incident trend history (simplified)
    incident_trend = [
        {"timestamp": (datetime.utcnow() - timedelta(minutes=i * 30)).isoformat(), "count": max(0, 2 + random.randint(-2, 3))}
        for i in range(6)
    ]
    incident_trend.reverse()

    # Vendor trend history
    vendor_trend = [
        {"timestamp": (datetime.utcnow() - timedelta(minutes=i * 30)).isoformat(), "revenue": round(random.uniform(35000, 65000), 0), "orders": random.randint(80, 240)}
        for i in range(6)
    ]
    vendor_trend.reverse()

    return APIResponse(data=OperationsDashboardResponse(
        ai_summary=ai_summary,
        crowd=crowd,
        incidents=incident,
        vendor=vendor_summary,
        transport=transport_summary,
        medical=medical_summary,
        security=security_summary,
        domains=domains,
        crowd_trend_history=trend_history,
        incident_trend_history=incident_trend,
        vendor_trend_history=vendor_trend,
    ))
