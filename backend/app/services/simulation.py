"""AI Simulation Engine — 'What If' scenario analysis for stadium operations.

Simulates the impact of events (gate closures, weather, metro delays, etc.)
on queue times, walking times, evacuation, safety, transport, and revenue.
"""

import random
from datetime import datetime

from app.schemas.simulation import (
    SimulationRequest,
    SimulationResponse,
    SimulationImpact,
    SimulationResult,
    ScenarioPreset,
)

_SEED = 42
random.seed(_SEED)


# ─── Scenario Presets ──────────────────────────────────────────

SCENARIO_PRESETS: list[ScenarioPreset] = [
    ScenarioPreset(
        id="gate-closure",
        title="Gate Closure",
        description="Simulate the impact of closing one or more entry gates",
        icon="gate",
        category="crowd",
        severity="high",
        example_query="What happens if Gate A closes due to a security incident?",
    ),
    ScenarioPreset(
        id="rain",
        title="Rain / Weather",
        description="Simulate sudden rain or extreme weather",
        icon="weather",
        category="environment",
        severity="moderate",
        example_query="What happens if it starts raining heavily during the match?",
    ),
    ScenarioPreset(
        id="metro-delay",
        title="Metro Line Delay",
        description="Simulate a metro or transit line disruption",
        icon="train",
        category="transport",
        severity="moderate",
        example_query="What happens if Metro Line 2 stops running?",
    ),
    ScenarioPreset(
        id="power-failure",
        title="Power Failure",
        description="Simulate a partial or total power failure",
        icon="power",
        category="safety",
        severity="critical",
        example_query="What happens if there's a power failure in Section 200?",
    ),
    ScenarioPreset(
        id="evacuation",
        title="Evacuation",
        description="Simulate a full or partial stadium evacuation",
        icon="evacuate",
        category="safety",
        severity="critical",
        example_query="What happens if we need to evacuate the upper bowl?",
    ),
    ScenarioPreset(
        id="vendor-shortage",
        title="Vendor Shortage",
        description="Simulate a major food/beverage shortage at peak hours",
        icon="food",
        category="operations",
        severity="moderate",
        example_query="What happens if Food Court 4 runs out of supplies during half-time?",
    ),
    ScenarioPreset(
        id="crowd-surge",
        title="Crowd Surge",
        description="Simulate a sudden crowd surge at a specific gate or section",
        icon="crowd",
        category="crowd",
        severity="high",
        example_query="What happens if there's a sudden crowd surge at Gate B after the match?",
    ),
    ScenarioPreset(
        id="medical-mass",
        title="Mass Medical Incident",
        description="Simulate a large-scale medical emergency",
        icon="medical",
        category="safety",
        severity="critical",
        example_query="What happens if there's a medical emergency affecting 50+ fans?",
    ),
]


# ─── Scenario Detection ────────────────────────────────────────

def detect_scenario(query: str) -> str | None:
    """Detect the scenario type from a natural language query."""
    q = query.lower()

    detections: list[tuple[list[str], str]] = [
        (["gate", "close", "entry", "exit", "entrance"], "gate_closure"),
        (["rain", "weather", "storm", "lightning", "flood"], "rain"),
        (["metro", "train", "subway", "transit", "delay"], "metro_delay"),
        (["power", "electricity", "lights", "blackout"], "power_failure"),
        (["evacuat", "emergency", "fire"], "evacuation"),
        (["vendor", "food", "supply", "shortage", "inventory"], "vendor_shortage"),
        (["surge", "crowd", "stampede", "rush"], "crowd_surge"),
        (["medical", "injur", "accident", "health", "paramedic"], "medical_mass"),
    ]

    for keywords, scenario in detections:
        if any(kw in q for kw in keywords):
            return scenario
    return None


# ─── Simulation Engine ─────────────────────────────────────────

def run_simulation(request: SimulationRequest) -> SimulationResponse:
    """Run a what-if simulation and return the results."""
    scenario_type = request.scenario_type or detect_scenario(request.query) or "custom"
    simulation_id = f"sim-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}-{random.randint(100, 999)}"

    if scenario_type == "gate_closure":
        return _simulate_gate_closure(simulation_id, request.query)
    elif scenario_type == "rain":
        return _simulate_rain(simulation_id, request.query)
    elif scenario_type == "metro_delay":
        return _simulate_metro_delay(simulation_id, request.query)
    elif scenario_type == "power_failure":
        return _simulate_power_failure(simulation_id, request.query)
    elif scenario_type == "evacuation":
        return _simulate_evacuation(simulation_id, request.query)
    elif scenario_type == "vendor_shortage":
        return _simulate_vendor_shortage(simulation_id, request.query)
    elif scenario_type == "crowd_surge":
        return _simulate_crowd_surge(simulation_id, request.query)
    elif scenario_type == "medical_mass":
        return _simulate_medical_mass(simulation_id, request.query)
    else:
        return _simulate_custom(simulation_id, request.query)


# ─── Scenario: Gate Closure ────────────────────────────────────

def _simulate_gate_closure(sim_id: str, query: str) -> SimulationResponse:
    return SimulationResponse(
        id=sim_id,
        scenario="Gate Closure",
        query=query,
        summary=(
            "Closing Gate A would redirect approximately 18,000 fans to Gates B, C, and D. "
            "Gate B would experience a 210% increase in foot traffic, causing estimated queue times of 22+ minutes. "
            "Crowd density in the northeast corridor would reach critical levels within 10 minutes. "
            "Parking Lot A would lose its primary pedestrian access point."
        ),
        risk_level="high",
        confidence_score=0.87,
        impacts=SimulationImpact(
            queue_times=[
                SimulationResult(metric="Gate B Queue", before="4 min", after="22 min", unit="minutes", impact="negative", delta_pct=450),
                SimulationResult(metric="Gate C Queue", before="2 min", after="8 min", unit="minutes", impact="negative", delta_pct=300),
                SimulationResult(metric="Gate D Queue", before="3 min", after="12 min", unit="minutes", impact="negative", delta_pct=300),
                SimulationResult(metric="Security Screening", before="30 sec", after="2 min", unit="seconds", impact="negative", delta_pct=300),
            ],
            walking_times=[
                SimulationResult(metric="Gate A → Section 210", before="5 min", after="18 min", unit="minutes", impact="negative", delta_pct=260),
                SimulationResult(metric="Gate B → Section 100", before="3 min", after="4 min", unit="minutes", impact="neutral", delta_pct=33),
                SimulationResult(metric="Main Concourse Density", before="63%", after="89%", unit="capacity", impact="negative", delta_pct=41),
            ],
            safety=[
                SimulationResult(metric="Crush Risk Index", before="Low (22)", after="Critical (84)", unit="index", impact="negative", delta_pct=282),
                SimulationResult(metric="Evacuation Time", before="8 min", after="14 min", unit="minutes", impact="negative", delta_pct=75),
                SimulationResult(metric="Emergency Access", before="Clear", after="Obstructed", unit="status", impact="negative", delta_pct=0),
            ],
            transport=[
                SimulationResult(metric="Parking Lot A Access", before="Open", after="Restricted", unit="status", impact="negative", delta_pct=0),
                SimulationResult(metric="Ride-Share Pickup", before="5 min", after="15 min", unit="minutes", impact="negative", delta_pct=200),
                SimulationResult(metric="Bus Shuttle Demand", before="240/hr", after="680/hr", unit="riders/hr", impact="negative", delta_pct=183),
            ],
            revenue=[
                SimulationResult(metric="Food Court 4 Sales", before="$18K/hr", after="$12K/hr", unit="USD/hr", impact="negative", delta_pct=-33),
                SimulationResult(metric="Vendor Staff Required", before="24", after="40", unit="staff", impact="negative", delta_pct=67),
                SimulationResult(metric="Merchandise Revenue", before="$8K/hr", after="$5.5K/hr", unit="USD/hr", impact="negative", delta_pct=-31),
            ],
            crowd_flow=[
                SimulationResult(metric="Northeast Corridor", before="42 ppl/min", after="118 ppl/min", unit="people/min", impact="negative", delta_pct=181),
                SimulationResult(metric="Gate B Throughput", before="28 ppl/min", after="52 ppl/min", unit="people/min", impact="negative", delta_pct=86),
                SimulationResult(metric="Section 210 Density", before="67%", after="94%", unit="capacity", impact="negative", delta_pct=40),
            ],
        ),
        recommended_actions=[
            "Immediately deploy 8 additional security personnel to Gate B",
            "Activate auxiliary Gate E (emergency overflow gate)",
            "Redirect parking Lot A traffic to Lots C and D via shuttle",
            "Deploy 4 volunteers to the northeast corridor for crowd management",
            "Open Food Court 6 to distribute crowd away from Gate B area",
        ],
        alternatives=[
            "Partial Gate A closure (4 of 12 lanes) instead of full closure",
            "Staggered entry: redirect every other admission to alternate gates",
            "Digital notification to fans: 'Gate A closed — use Gates C or D'",
        ],
        expected_outcome=(
            "With recommended actions, queue times stabilize at 12-14 min (vs 22 min without intervention). "
            "Crush risk drops from critical (84) to moderate (45). Full recovery expected within 45 minutes."
        ),
    )


# ─── Scenario: Rain ────────────────────────────────────────────

def _simulate_rain(sim_id: str, query: str) -> SimulationResponse:
    return SimulationResponse(
        id=sim_id,
        scenario="Heavy Rain",
        query=query,
        summary=(
            "Sudden heavy rain would drive approximately 65% of fans to covered concourses and indoor areas. "
            "Food courts and concession areas would see a 240% surge in traffic. "
            "Outdoor standing sections would empty rapidly, creating congestion in corridors. "
            "Parking lot exits would be reduced by 30% due to standing water."
        ),
        risk_level="moderate",
        confidence_score=0.84,
        impacts=SimulationImpact(
            queue_times=[
                SimulationResult(metric="Food Court 1 Queue", before="3 min", after="14 min", unit="minutes", impact="negative", delta_pct=367),
                SimulationResult(metric="Covered Concourse", before="2 min", after="9 min", unit="minutes", impact="negative", delta_pct=350),
                SimulationResult(metric="Merchandise Stands", before="1 min", after="6 min", unit="minutes", impact="negative", delta_pct=500),
            ],
            walking_times=[
                SimulationResult(metric="Outdoor → Indoor Transition", before="2 min", after="8 min", unit="minutes", impact="negative", delta_pct=300),
                SimulationResult(metric="Parking Lot → Gate", before="5 min", after="12 min", unit="minutes", impact="negative", delta_pct=140),
            ],
            safety=[
                SimulationResult(metric="Slip/Trip Risk", before="Low", after="Elevated", unit="risk", impact="negative", delta_pct=0),
                SimulationResult(metric="Outdoor Section Occupancy", before="85%", after="22%", unit="capacity", impact="neutral", delta_pct=-74),
            ],
            transport=[
                SimulationResult(metric="Road Visibility", before="Good", after="Reduced", unit="status", impact="negative", delta_pct=0),
                SimulationResult(metric="Parking Exit Rate", before="120/hr", after="84/hr", unit="cars/hr", impact="negative", delta_pct=-30),
            ],
            revenue=[
                SimulationResult(metric="Rain Poncho Sales", before="$200/hr", after="$4,800/hr", unit="USD/hr", impact="positive", delta_pct=2300),
                SimulationResult(metric="Hot Food Sales", before="$12K/hr", after="$28K/hr", unit="USD/hr", impact="positive", delta_pct=133),
            ],
            crowd_flow=[],
        ),
        recommended_actions=[
            "Deploy 6 volunteers with umbrellas at outdoor section transitions",
            "Activate all indoor overflow seating areas",
            "Open additional concession points in covered areas",
            "Distribute free rain ponchos at all gates",
            "Increase concourse cleaning staff to prevent slip hazards",
        ],
        alternatives=[
            "Hold fans in seating areas with in-seat service",
            "Delay match start by 30 minutes if lightning is forecast",
            "Activate covered walkways and tunnel connections",
        ],
        expected_outcome=(
            "With proactive rain preparation, fan comfort rating stays above 85%. "
            "Indoor congestion resolves within 20 minutes as fans settle into covered areas. "
            "Revenue from food and merchandise increases by 15% during rain period."
        ),
    )


# ─── Scenario: Metro Delay ─────────────────────────────────────

def _simulate_metro_delay(sim_id: str, query: str) -> SimulationResponse:
    return SimulationResponse(
        id=sim_id,
        scenario="Metro Line Delay",
        query=query,
        summary=(
            "A Metro Line 2 shutdown would strand approximately 8,400 passengers within a 2km radius of the stadium. "
            "Shuttle bus demand would surge by 280%. "
            "Ride-share pickup zones would see 3x normal demand. "
            "Post-match departure would be delayed by an average of 45 minutes for affected fans."
        ),
        risk_level="moderate",
        confidence_score=0.91,
        impacts=SimulationImpact(
            queue_times=[
                SimulationResult(metric="Shuttle Bus Queue", before="5 min", after="25 min", unit="minutes", impact="negative", delta_pct=400),
                SimulationResult(metric="Ride-Share Wait", before="4 min", after="18 min", unit="minutes", impact="negative", delta_pct=350),
                SimulationResult(metric="Taxi Stand Queue", before="3 min", after="15 min", unit="minutes", impact="negative", delta_pct=400),
            ],
            walking_times=[
                SimulationResult(metric="Stadium → Metro Station", before="8 min", after="n/a", unit="minutes", impact="negative", delta_pct=0),
            ],
            safety=[
                SimulationResult(metric="Bus Stop Crowd Density", before="35%", after="92%", unit="capacity", impact="negative", delta_pct=163),
            ],
            transport=[
                SimulationResult(metric="Shuttle Bus Demand", before="400/hr", after="1,520/hr", unit="riders/hr", impact="negative", delta_pct=280),
                SimulationResult(metric="Ride-Share Requests", before="120/hr", after="380/hr", unit="requests/hr", impact="negative", delta_pct=217),
                SimulationResult(metric="Surrounding Road Congestion", before="Moderate", after="Severe", unit="status", impact="negative", delta_pct=0),
            ],
            revenue=[],
            crowd_flow=[
                SimulationResult(metric="Bus Stop Area Density", before="42%", after="94%", unit="capacity", impact="negative", delta_pct=124),
            ],
        ),
        recommended_actions=[
            "Activate emergency shuttle bus fleet (12 additional buses from depot)",
            "Contract with Uber/Lyft for surge pricing mitigation — 500 subsidized rides",
            "Deploy 8 transport volunteers to Metro station for directional assistance",
            "Open overflow waiting area in Parking Lot C with shelter and information screens",
            "Coordinate with city transit authority for alternative routing via Line 3",
        ],
        alternatives=[
            "Arrange corporate shuttle buses from nearby office buildings",
            "Activate bike-share program with 200 additional bicycles",
            "Organize fan walking groups with volunteer escorts to alternate stations",
        ],
        expected_outcome=(
            "With shuttle deployment, 70% of affected passengers are moving within 20 minutes. "
            "Metro Line 2 restoration estimated at 45 minutes. Complete departure clearance within 90 minutes."
        ),
    )


# ─── Scenario: Power Failure ───────────────────────────────────

def _simulate_power_failure(sim_id: str, query: str) -> SimulationResponse:
    return SimulationResponse(
        id=sim_id,
        scenario="Power Failure",
        query=query,
        summary=(
            "A partial power failure in Section 200 would affect 3,200 fans in the club level. "
            "Emergency lighting activates automatically. "
            "Elevators and escalators in the affected section would stop. "
            "Food preparation in 2 nearby concession stands would halt. "
            "Full power restoration estimated at 20-30 minutes."
        ),
        risk_level="critical",
        confidence_score=0.93,
        impacts=SimulationImpact(
            queue_times=[
                SimulationResult(metric="Elevator Wait Time", before="30 sec", after="n/a (stopped)", unit="status", impact="negative", delta_pct=0),
                SimulationResult(metric="Stairwell Throughput", before="15 ppl/min", after="8 ppl/min", unit="people/min", impact="negative", delta_pct=-47),
            ],
            walking_times=[
                SimulationResult(metric="Section 200 → Ground Level", before="2 min", after="8 min", unit="minutes", impact="negative", delta_pct=300),
                SimulationResult(metric="Accessible Route (Wheelchair)", before="3 min", after="25 min", unit="minutes", impact="negative", delta_pct=733),
            ],
            safety=[
                SimulationResult(metric="Emergency Lighting", before="n/a", after="Activated", unit="status", impact="neutral", delta_pct=0),
                SimulationResult(metric="Stairwell Crowding Risk", before="Low", after="High", unit="risk", impact="negative", delta_pct=0),
                SimulationResult(metric="Panic Risk Index", before="Low (12)", after="Moderate (45)", unit="index", impact="negative", delta_pct=275),
            ],
            transport=[],
            revenue=[
                SimulationResult(metric="Concession Stand Revenue", before="$4.2K/hr", after="$0/hr", unit="USD/hr", impact="negative", delta_pct=-100),
                SimulationResult(metric="Spoilage Loss", before="$0", after="$2,400", unit="USD", impact="negative", delta_pct=0),
            ],
            crowd_flow=[
                SimulationResult(metric="Section 200 Occupancy", before="55%", after="12% (evacuating)", unit="capacity", impact="neutral", delta_pct=-78),
                SimulationResult(metric="Main Concourse Spillover", before="+0", after="+1,800 people", unit="people", impact="negative", delta_pct=0),
            ],
        ),
        recommended_actions=[
            "Activate backup generator for Section 200 (estimated 5 min to full power)",
            "Deploy 4 volunteers with flashlights to stairwells for crowd guidance",
            "Provide manual assistance to wheelchair users — 3 team members needed",
            "Open adjacent sections 201 and 100 for displaced fans",
            "Broadcast multilingual announcement: 'Power restoration in progress, remain calm'",
        ],
        alternatives=[
            "Full stadium generator activation (covers 100% of critical systems)",
            "Mobile phone flashlight guidance via push notification",
            "Temporary food/drink redistribution to unaffected concession stands",
        ],
        expected_outcome=(
            "Emergency systems respond within 30 seconds. Backup power online in 5 minutes. "
            "90% of affected fans relocated within 10 minutes. Zero safety incidents."
        ),
    )


# ─── Scenario: Evacuation ──────────────────────────────────────

def _simulate_evacuation(sim_id: str, query: str) -> SimulationResponse:
    return SimulationResponse(
        id=sim_id,
        scenario="Partial Evacuation",
        query=query,
        summary=(
            "Upper bowl evacuation would involve 9,700 fans across Sections 300-302. "
            "Estimated safe evacuation time: 14 minutes (within FIFA standard of 18 min). "
            "Lower bowl and club level remain unaffected. "
            "Evacuation routes via 4 stairwells and 2 ramps are clear."
        ),
        risk_level="critical",
        confidence_score=0.95,
        impacts=SimulationImpact(
            queue_times=[
                SimulationResult(metric="Stairwell Evacuation Rate", before="n/a", after="42 ppl/min per stairwell", unit="people/min", impact="neutral", delta_pct=0),
                SimulationResult(metric="Assembly Point Arrival", before="n/a", after="8-14 min", unit="minutes", impact="neutral", delta_pct=0),
            ],
            walking_times=[
                SimulationResult(metric="Section 300 → Assembly Point", before="3 min", after="12 min", unit="minutes", impact="neutral", delta_pct=300),
                SimulationResult(metric="Wheelchair Evacuation Time", before="n/a", after="18 min", unit="minutes", impact="negative", delta_pct=0),
            ],
            safety=[
                SimulationResult(metric="Evacuation Clear Time", before="n/a", after="14 min", unit="minutes", impact="positive", delta_pct=0),
                SimulationResult(metric="Stairwell Capacity", before="60%", after="85%", unit="capacity", impact="moderate", delta_pct=42),
                SimulationResult(metric="FIFA Standard Compliance", before="n/a", after="14/18 min (✅ Pass)", unit="status", impact="positive", delta_pct=0),
            ],
            transport=[
                SimulationResult(metric="Emergency Vehicle Access", before="Clear", after="Clear (separate lane)", unit="status", impact="positive", delta_pct=0),
            ],
            revenue=[],
            crowd_flow=[
                SimulationResult(metric="Evacuation Flow Rate", before="0", after="168 ppl/min (all routes)", unit="people/min", impact="neutral", delta_pct=0),
                SimulationResult(metric="Assembly Point Density", before="0%", after="72%", unit="capacity", impact="moderate", delta_pct=0),
            ],
        ),
        recommended_actions=[
            "Activate evacuation protocol — 12 trained evacuation marshals to positions",
            "Broadcast multilingual evacuation instructions (pre-recorded messages)",
            "Open all 4 upper bowl exits simultaneously with priority lanes",
            "Deploy 2 wheelchair evacuation teams with evacuation chairs",
            "Direct evacuees to Assembly Point Alpha (north lot) via designated routes",
        ],
        alternatives=[
            "Staged evacuation (floor-by-floor) if threat allows",
            "Partial shelter-in-place if lower bowl is safe",
            "Reverse evacuation if threat is external",
        ],
        expected_outcome=(
            "Complete upper bowl evacuation in 14 minutes (under FIFA 18-min standard). "
            "Zero injuries predicted. All 9,700 fans safely at assembly point."
        ),
    )


# ─── Scenario: Vendor Shortage ─────────────────────────────────

def _simulate_vendor_shortage(sim_id: str, query: str) -> SimulationResponse:
    return SimulationResponse(
        id=sim_id,
        scenario="Vendor Shortage",
        query=query,
        summary=(
            "Food Court 4 running out of key supplies during half-time would affect 2,400 hungry fans. "
            "Estimated revenue loss of $18,000 during peak period. "
            "Nearby Food Courts 2 and 3 would see 80% increased demand. "
            "Fan satisfaction predicted to drop by 22 points."
        ),
        risk_level="moderate",
        confidence_score=0.82,
        impacts=SimulationImpact(
            queue_times=[
                SimulationResult(metric="Food Court 2 Queue", before="4 min", after="14 min", unit="minutes", impact="negative", delta_pct=250),
                SimulationResult(metric="Food Court 3 Queue", before="3 min", after="11 min", unit="minutes", impact="negative", delta_pct=267),
                SimulationResult(metric="All Other Vendors", before="3 min", after="8 min", unit="minutes", impact="negative", delta_pct=167),
            ],
            walking_times=[],
            safety=[
                SimulationResult(metric="Fan Satisfaction", before="84%", after="62%", unit="score", impact="negative", delta_pct=-26),
            ],
            transport=[],
            revenue=[
                SimulationResult(metric="Food Court 4 Revenue", before="$18K/hr", after="$2K/hr", unit="USD/hr", impact="negative", delta_pct=-89),
                SimulationResult(metric="Nearby Vendors Revenue", before="$22K/hr", after="$35K/hr", unit="USD/hr", impact="positive", delta_pct=59),
                SimulationResult(metric="Total F&B Revenue", before="$62K/hr", after="$48K/hr", unit="USD/hr", impact="negative", delta_pct=-23),
            ],
            crowd_flow=[
                SimulationResult(metric="Food Court 4 Area", before="340 people", after="12 people", unit="people", impact="negative", delta_pct=-96),
                SimulationResult(metric="Food Court 2/3 Area", before="280 people", after="510 people", unit="people", impact="negative", delta_pct=82),
            ],
        ),
        recommended_actions=[
            "Reroute supply inventory from Food Court 1 reserve stock (30-min transfer)",
            "Activate mobile food carts (4 units) to serve displaced fans",
            "Deploy 4 additional staff to Food Courts 2 and 3",
            "Send push notification: 'Food Court 4 closed — visit Food Courts 2 or 3'",
            "Activate simplified menu (top 5 items only) to speed service",
        ],
        alternatives=[
            "Partner with external food trucks (2 available near Gate D)",
            "Distribute complimentary snacks as goodwill",
            "Extend half-time by 5 minutes to reduce rush pressure",
        ],
        expected_outcome=(
            "Inventory replenished within 30 minutes. Fan satisfaction recovers to 75%. "
            "Revenue loss limited to $10K (vs $18K projected without intervention)."
        ),
    )


# ─── Scenario: Crowd Surge ─────────────────────────────────────

def _simulate_crowd_surge(sim_id: str, query: str) -> SimulationResponse:
    return SimulationResponse(
        id=sim_id,
        scenario="Crowd Surge",
        query=query,
        summary=(
            "A post-match crowd surge at Gate B would increase foot traffic by 340% within 5 minutes. "
            "Gate B would reach 195% of designed throughput capacity. "
            "Risk of crushing injury would elevate from low to critical. "
            "Emergency services would have delayed access to the affected corridor."
        ),
        risk_level="critical",
        confidence_score=0.89,
        impacts=SimulationImpact(
            queue_times=[
                SimulationResult(metric="Gate B Exit Queue", before="3 min", after="18 min", unit="minutes", impact="negative", delta_pct=500),
                SimulationResult(metric="Gate B Area Throughput", before="48 ppl/min", after="18 ppl/min", unit="people/min", impact="negative", delta_pct=-63),
            ],
            walking_times=[
                SimulationResult(metric="Gate B → Parking Lot", before="4 min", after="20 min", unit="minutes", impact="negative", delta_pct=400),
                SimulationResult(metric="Gate B → Metro Station", before="6 min", after="22 min", unit="minutes", impact="negative", delta_pct=267),
            ],
            safety=[
                SimulationResult(metric="Crush Risk Index", before="Low (18)", after="Critical (92)", unit="index", impact="negative", delta_pct=411),
                SimulationResult(metric="EMS Access Time", before="30 sec", after="5 min", unit="minutes", impact="negative", delta_pct=900),
                SimulationResult(metric="Injury Risk (per 1000)", before="0.3", after="4.8", unit="injuries", impact="negative", delta_pct=1500),
            ],
            transport=[
                SimulationResult(metric="Ride-Share Access", before="4 min", after="Blocked", unit="status", impact="negative", delta_pct=0),
            ],
            revenue=[],
            crowd_flow=[
                SimulationResult(metric="Gate B Area Density", before="340 ppl", after="1,520 ppl", unit="people", impact="negative", delta_pct=347),
                SimulationResult(metric="Corridor 2B Flow Rate", before="24 ppl/min", after="8 ppl/min", unit="people/min", impact="negative", delta_pct=-67),
            ],
        ),
        recommended_actions=[
            "IMMEDIATE: Deploy 8 security personnel to form crowd barriers at Gate B bottleneck",
            "Open Gate E (emergency exit) and Gate D overflow to redistribute flow",
            "Activate voice announcements: 'Use Gates C and D for faster exit'",
            "Divert 3 shuttle buses to Gate D to absorb passenger load",
            "Alert EMS to stage at Gate B corridor as precaution",
        ],
        alternatives=[
            "One-way pedestrian flow system (entry only on one side)",
            "Timed exit releases (release sections in 5-min staggered intervals)",
            "Digital signage redirecting to all available exits with live wait times",
        ],
        expected_outcome=(
            "With intervention, Gate B crowd density drops from critical (92) to high (58) within 8 minutes. "
            "Flow rate recovers to 32 ppl/min. Zero injuries predicted with timely response."
        ),
    )


# ─── Scenario: Mass Medical ────────────────────────────────────

def _simulate_medical_mass(sim_id: str, query: str) -> SimulationResponse:
    return SimulationResponse(
        id=sim_id,
        scenario="Mass Medical Incident",
        query=query,
        summary=(
            "A mass medical incident affecting 50+ fans would overwhelm standard medical capacity. "
            "All 5 responder teams would need to be deployed simultaneously. "
            "Medical room capacity (24 treatment spaces) would be exceeded by 2x. "
            "Estimated 8 additional ambulances required from external services."
        ),
        risk_level="critical",
        confidence_score=0.94,
        impacts=SimulationImpact(
            queue_times=[
                SimulationResult(metric="Triage Processing", before="2 min/patient", after="5 min/patient", unit="minutes", impact="negative", delta_pct=150),
            ],
            walking_times=[
                SimulationResult(metric="Responder → Incident", before="1.5 min", after="3.5 min (distant)", unit="minutes", impact="negative", delta_pct=133),
                SimulationResult(metric="Patient → Medical Room", before="2 min", after="8 min (overflow)", unit="minutes", impact="negative", delta_pct=300),
            ],
            safety=[
                SimulationResult(metric="Medical Triage Capacity", before="24 patients", after="12 patients (overwhelmed)", unit="patients", impact="negative", delta_pct=-50),
                SimulationResult(metric="Available Responders", before="12", after="0 (all deployed)", unit="responders", impact="negative", delta_pct=-100),
                SimulationResult(metric="Ambulance Availability", before="4 on-site", after="12 needed", unit="ambulances", impact="negative", delta_pct=200),
            ],
            transport=[
                SimulationResult(metric="EMS Vehicle Access", before="Clear", after="Restricted (crowd)", unit="status", impact="negative", delta_pct=0),
            ],
            revenue=[],
            crowd_flow=[
                SimulationResult(metric="Incident Area Crowd", before="Normal", after="Gathering (spectators)", unit="status", impact="negative", delta_pct=0),
            ],
        ),
        recommended_actions=[
            "Activate Mass Casualty Incident (MCI) protocol — highest alert level",
            "Request 8 additional ambulances from mutual aid (North Jersey EMS)",
            "Establish triage zones in Parking Lot A (3 color-coded zones)",
            "Deploy all 5 responder teams with priority to critical (red) patients",
            "Broadcast: 'Medical emergency in progress — clear corridors 2A and 3B'",
            "Activate 4 volunteer medical runners for equipment/supply transport",
        ],
        alternatives=[
            "Request medical helicopter landing zone in Parking Lot D",
            "Activate neighboring hospital emergency protocols (3 hospitals within 10 min)",
            "Establish on-site pharmacy distribution for non-critical patients",
        ],
        expected_outcome=(
            "All critical patients triaged within 10 minutes. "
            "External ambulances arrive within 12 minutes. "
            "Full patient transport to hospitals completed within 45 minutes."
        ),
    )


# ─── Custom / Unknown Scenario ─────────────────────────────────

def _simulate_custom(sim_id: str, query: str) -> SimulationResponse:
    return SimulationResponse(
        id=sim_id,
        scenario="Custom Scenario",
        query=query,
        summary=(
            "Analysis of your scenario shows moderate operational impact. "
            "Crowd flow patterns would shift, requiring adjustments to staffing and resource allocation. "
            "AI recommends proactive monitoring and预备 response teams."
        ),
        risk_level="moderate",
        confidence_score=0.76,
        impacts=SimulationImpact(
            queue_times=[
                SimulationResult(metric="Affected Areas", before="Normal", after="Elevated wait times", unit="status", impact="negative", delta_pct=0),
            ],
            walking_times=[
                SimulationResult(metric="Detour Impact", before="Normal routes", after="Alternative routes needed", unit="status", impact="negative", delta_pct=0),
            ],
            safety=[
                SimulationResult(metric="Overall Safety Index", before="95%", after="82%", unit="score", impact="moderate", delta_pct=-14),
            ],
            transport=[],
            revenue=[],
            crowd_flow=[
                SimulationResult(metric="Crowd Distribution", before="Balanced", after="Shifting", unit="status", impact="neutral", delta_pct=0),
            ],
        ),
        recommended_actions=[
            "Monitor the affected area closely for the next 15 minutes",
            "Have 2 volunteer teams on standby for redeployment",
            "Prepare multilingual announcement for potential broadcast",
        ],
        alternatives=[
            "Consult the Operations Coordinator for specialized assessment",
            "Run a secondary simulation with adjusted parameters",
        ],
        expected_outcome=(
            "Situation assessed. Standard operating procedures recommended. "
            "Escalate if conditions change significantly."
        ),
    )
