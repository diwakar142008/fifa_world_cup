"""StadiumMind AI - Multi-Agent Orchestrator.

Coordinates specialized AI agents for stadium operations.
Each agent handles a specific domain with its own prompt and context.
"""

from typing import Optional
from datetime import datetime

# Agent definitions
AGENTS = {
    "navigation": {
        "name": "Navigation Agent",
        "description": "Indoor/outdoor routing, AR wayfinding, accessibility-aware paths",
        "capabilities": ["route_planning", "accessibility_routing", "poi_lookup"],
    },
    "crowd": {
        "name": "Crowd Management Agent",
        "description": "Predicts congestion before it happens, recommends dynamic rerouting",
        "capabilities": ["congestion_prediction", "flow_analysis", "capacity_monitoring"],
    },
    "emergency": {
        "name": "Emergency Agent",
        "description": "Instant incident detection, evacuation routing, responder coordination",
        "capabilities": ["incident_detection", "evacuation_planning", "responder_dispatch"],
    },
    "medical": {
        "name": "Medical Agent",
        "description": "Triage assistance, nearest defibrillator, ambulance coordination",
        "capabilities": ["triage_support", "equipment_locator", "ambulance_coordination"],
    },
    "security": {
        "name": "Security Agent",
        "description": "Threat detection, access control, suspicious activity analysis",
        "capabilities": ["threat_detection", "access_control", "surveillance_analysis"],
    },
    "transportation": {
        "name": "Transportation Agent",
        "description": "Metro, bus, ride-share, parking predictions",
        "capabilities": ["transit_monitoring", "parking_management", "traffic_analysis"],
    },
    "volunteer": {
        "name": "Volunteer Agent",
        "description": "Dynamic task assignment, location-aware dispatch, multilingual support",
        "capabilities": ["task_assignment", "location_dispatch", "multilingual_support"],
    },
    "vendor": {
        "name": "Vendor Agent",
        "description": "AI-predicted demand, inventory alerts, peak-hour staffing",
        "capabilities": ["demand_prediction", "inventory_management", "staffing_optimization"],
    },
    "accessibility": {
        "name": "Accessibility Agent",
        "description": "Multilingual support, accessibility routing, inclusive announcements",
        "capabilities": ["multilingual_translation", "accessibility_routing", "inclusive_announcements"],
    },
    "operations": {
        "name": "Operations Agent",
        "description": "Resource allocation, equipment tracking, maintenance scheduling",
        "capabilities": ["resource_allocation", "equipment_tracking", "maintenance_scheduling"],
    },
    "sustainability": {
        "name": "Sustainability Agent",
        "description": "Energy optimization, waste monitoring, carbon footprint tracking",
        "capabilities": ["energy_monitoring", "waste_tracking", "carbon_analytics"],
    },
    "coordinator": {
        "name": "Coordinator Agent",
        "description": "Orchestrates all agents into unified intelligent responses",
        "capabilities": ["agent_orchestration", "response_unification", "priority_routing"],
    },
}


class AgentOrchestrator:
    """Orchestrates multi-agent AI system for stadium operations."""

    def __init__(self):
        self.agents = AGENTS
        self.active_agents: dict[str, bool] = {k: True for k in AGENTS}

    def get_agent(self, agent_id: str) -> Optional[dict]:
        """Get agent definition by ID."""
        return self.agents.get(agent_id)

    def get_all_agents(self) -> list[dict]:
        """Get all agent definitions."""
        return [
            {"id": k, **v, "active": self.active_agents.get(k, True)}
            for k, v in self.agents.items()
        ]

    def get_active_agents(self) -> list[dict]:
        """Get only active agents."""
        return [a for a in self.get_all_agents() if a["active"]]

    def detect_relevant_agents(self, query: str) -> list[str]:
        """Detect which agents are relevant to a query."""
        query_lower = query.lower()
        relevant = []

        agent_keywords = {
            "navigation": ["where", "route", "direction", "find", "gate", "entrance", "exit"],
            "crowd": ["crowd", "congestion", "busy", "capacity", "density", "overflow"],
            "emergency": ["emergency", "evacuation", "fire", "danger", "alert", "critical"],
            "medical": ["medical", "injury", "hospital", "doctor", "paramedic", "first aid"],
            "security": ["security", "threat", "suspicious", "unauthorized", "breach"],
            "transportation": ["metro", "train", "bus", "parking", "shuttle", "traffic"],
            "volunteer": ["volunteer", "staff", "help", "assist", "volunteer"],
            "vendor": ["food", "vendor", "concession", "restaurant", "store", "shop"],
            "accessibility": ["wheelchair", "accessible", "disability", "language", "translation"],
            "operations": ["operation", "maintenance", "schedule", "resource", "equipment"],
            "sustainability": ["energy", "waste", "recycle", "carbon", "sustainable", "green"],
        }

        for agent_id, keywords in agent_keywords.items():
            if any(kw in query_lower for kw in keywords):
                relevant.append(agent_id)

        return relevant if relevant else ["coordinator"]

    def get_agent_status_summary(self) -> dict:
        """Get summary of all agent statuses."""
        active = sum(1 for v in self.active_agents.values() if v)
        return {
            "total_agents": len(self.agents),
            "active_agents": active,
            "inactive_agents": len(self.agents) - active,
            "agents": self.get_all_agents(),
            "timestamp": datetime.utcnow().isoformat(),
        }


agent_orchestrator = AgentOrchestrator()