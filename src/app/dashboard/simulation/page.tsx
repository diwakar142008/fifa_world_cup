"use client";

import { useState, useCallback } from "react";
import {
  FlaskConical,
  Play,
  AlertTriangle,
  Clock,
  Footprints,
  Shield,
  Bus,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Lightbulb,
  RefreshCw,
  Brain,
  Zap,
  Droplets,
  Train,
  Siren,
  UtensilsCrossed,
  Heart,
  type LucideIcon,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import StatusBadge from "@/components/dashboard/StatusBadge";
import clsx from "clsx";

// ─── Types ────────────────────────────────────────────────────

interface SimulationResult {
  id: string;
  scenario: string;
  query: string;
  summary: string;
  risk_level: string;
  confidence_score: number;
  impacts: {
    queue_times: ImpactMetric[];
    walking_times: ImpactMetric[];
    safety: ImpactMetric[];
    transport: ImpactMetric[];
    revenue: ImpactMetric[];
    crowd_flow: ImpactMetric[];
  };
  recommended_actions: string[];
  alternatives: string[];
  expected_outcome: string;
  timestamp: string;
}

interface ImpactMetric {
  metric: string;
  before: string | number;
  after: string | number;
  unit: string;
  impact: string;
  delta_pct: number;
}

interface ScenarioPreset {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  severity: string;
  example_query: string;
}

// ─── Preset Icons ─────────────────────────────────────────────

const presetIcons: Record<string, LucideIcon> = {
  gate: Users,
  weather: Droplets,
  train: Train,
  power: Zap,
  evacuate: Siren,
  food: UtensilsCrossed,
  crowd: Users,
  medical: Heart,
};

const presetGradients: Record<string, string> = {
  crowd: "from-stadium-400 to-stadium-600",
  environment: "from-cyan-400 to-blue-500",
  transport: "from-violet-400 to-purple-500",
  safety: "from-rose-500 to-red-500",
  operations: "from-amber-400 to-orange-500",
};

const severityColors: Record<string, string> = {
  low: "bg-emerald/10 text-emerald",
  moderate: "bg-amber/10 text-amber",
  high: "bg-rose/10 text-rose",
  critical: "bg-rose/20 text-rose animate-pulse",
};

// ─── Mock Simulation Presets ──────────────────────────────────

const mockPresets: ScenarioPreset[] = [
  {
    id: "gate-closure",
    title: "Gate Closure",
    description: "Simulate the impact of closing entry gates",
    icon: "gate",
    category: "crowd",
    severity: "high",
    example_query: "What happens if Gate A closes?",
  },
  {
    id: "rain",
    title: "Heavy Rain",
    description: "Simulate sudden rain or extreme weather",
    icon: "weather",
    category: "environment",
    severity: "moderate",
    example_query: "What happens if it starts raining?",
  },
  {
    id: "metro-delay",
    title: "Metro Delay",
    description: "Simulate a transit line disruption",
    icon: "train",
    category: "transport",
    severity: "moderate",
    example_query: "What happens if Metro Line 2 stops?",
  },
  {
    id: "power-failure",
    title: "Power Failure",
    description: "Simulate a partial or total power failure",
    icon: "power",
    category: "safety",
    severity: "critical",
    example_query: "What happens if power fails?",
  },
  {
    id: "evacuation",
    title: "Evacuation",
    description: "Simulate a full or partial stadium evacuation",
    icon: "evacuate",
    category: "safety",
    severity: "critical",
    example_query: "What happens if we evacuate the upper bowl?",
  },
  {
    id: "crowd-surge",
    title: "Crowd Surge",
    description: "Simulate a sudden crowd surge at a gate",
    icon: "crowd",
    category: "crowd",
    severity: "high",
    example_query: "What happens if there's a surge at Gate B?",
  },
];

// ─── Impact Icons ─────────────────────────────────────────────

const impactSectionMeta: Record<
  string,
  { label: string; icon: LucideIcon; gradient: string }
> = {
  queue_times: {
    label: "Queue Times",
    icon: Clock,
    gradient: "from-amber-400 to-orange-500",
  },
  walking_times: {
    label: "Walking Times",
    icon: Footprints,
    gradient: "from-stadium-400 to-stadium-600",
  },
  safety: {
    label: "Safety",
    icon: Shield,
    gradient: "from-rose-400 to-red-500",
  },
  transport: {
    label: "Transport",
    icon: Bus,
    gradient: "from-violet-400 to-purple-500",
  },
  revenue: {
    label: "Revenue",
    icon: DollarSign,
    gradient: "from-gold-400 to-gold-600",
  },
  crowd_flow: {
    label: "Crowd Flow",
    icon: Users,
    gradient: "from-cyan-400 to-teal-500",
  },
};

// ─── Impact Indicator ─────────────────────────────────────────

function ImpactBadge({ impact, delta }: { impact: string; delta: number }) {
  if (impact === "positive") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">
        <TrendingUp className="w-3 h-3" />+{delta}%
      </span>
    );
  }
  if (impact === "negative") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose bg-rose/10 px-2 py-0.5 rounded-full">
        <TrendingDown className="w-3 h-3" />
        {delta > 0 ? "+" : ""}
        {delta}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-stadium-400 bg-white/5 px-2 py-0.5 rounded-full">
      <Minus className="w-3 h-3" />
      {delta}%
    </span>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────

export default function SimulationDashboard() {
  const [query, setQuery] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleRunSimulation = useCallback(async (simQuery: string) => {
    if (!simQuery.trim()) return;
    setIsRunning(true);
    setShowResult(false);

    // Simulate network delay for realistic UX
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1500));

    const lower = simQuery.toLowerCase();
    let scenario = "Custom Scenario";
    let riskLevel = "moderate";
    let summary = "";
    let recommended: string[] = [];
    let alternatives: string[] = [];
    let outcome = "";

    // ── Gate Closure ──────────────────────────────────────────
    if (lower.includes("close") && lower.includes("gate")) {
      scenario = "Gate Closure";
      riskLevel = "high";
      summary =
        "Closing Gate A during peak entry would cause significant congestion at adjacent gates. Queue times at Gate B would increase by approximately 40%, and overall entry flow would slow by 28%. Crowd flow analysis shows a bottleneck forming in Concourse 2A within 12 minutes. Food courts near Gate A would see a 15% drop in traffic, while Gate B-side courts would experience 22% increased demand. Emergency egress routes remain clear despite the congestion.";
      recommended = [
        "Open auxiliary Gate A2 to compensate for the closure",
        "Deploy 6 additional volunteers to Gate B for crowd management",
        "Activate digital signage redirecting fans to Gate C (currently at 45% capacity)",
        "Increase shuttle frequency from parking lots to Gate C by 30%",
        "Alert food vendors at Gate B-side to prepare for 22% increased demand",
      ];
      alternatives = [
        "Partial gate restriction (50% capacity) instead of full closure — reduces congestion by 60%",
        "Staggered entry by ticket section to balance load across all gates",
        "Extend entry window by 45 minutes and communicate via SMS/email",
      ];
      outcome =
        "With recommended actions, total entry time increases by only 8 minutes vs. 22 minutes without intervention. Crowd satisfaction predicted at 87%.";
    }
    // ── Weather / Rain ────────────────────────────────────────
    else if (
      lower.includes("rain") ||
      lower.includes("weather") ||
      lower.includes("storm")
    ) {
      scenario = "Heavy Weather";
      riskLevel = "moderate";
      summary =
        "Sudden heavy rain would cause 40% of fans to seek indoor shelter, creating crowding in concourses and food courts. Walking times between sections increase by 35% as fans move slowly on wet surfaces. Outside queue lines become unsafe within 15 minutes. Revenue from outdoor vendors drops 60%, while indoor food courts see 45% increased demand. Metro ridership jumps 28% as fans leave early.";
      recommended = [
        "Activate covered queuing areas at all gates immediately",
        "Deploy ground crew to apply anti-slip mats at all entrances and stairwells",
        "Open all indoor concession areas and activate rain contingency menu",
        "Broadcast weather update via PA system in 6 languages every 10 minutes",
        "Prepare medical teams for increased slip/fall incidents (typically +300% during rain)",
      ];
      alternatives = [
        "Distribute complimentary ponchos at gates (cost: $0.50/fan, improves satisfaction by 40%)",
        "Open upper bowl concourses as shelter areas to reduce lower concourse crowding",
        "Delay match start by 15 minutes with fan engagement activities indoors",
      ];
      outcome =
        "With proactive measures, fan comfort index maintains at 82%. Incident rate increases only 15% (vs. 180% without prep). Revenue loss contained to 8%.";
    }
    // ── Metro Delay ───────────────────────────────────────────
    else if (
      lower.includes("metro") ||
      lower.includes("train") ||
      lower.includes("transit")
    ) {
      scenario = "Metro Line Disruption";
      riskLevel = "moderate";
      summary =
        "Metro Line 2 stoppage affects 12,000 fans traveling to the match. Entry gate distribution shifts: Gate C (nearest metro) sees 55% fewer arrivals in first hour, while ride-share dropoffs increase 40%. Parking lots fill 35 minutes earlier than predicted. Post-match, 8,000 fans need alternative transport, creating congestion at bus stops and ride-share zones.";
      recommended = [
        "Activate shuttle bus service from alternate metro stations (Lines 1 and 3)",
        "Increase ride-share pickup zone capacity by 60% and add 4 dedicated marshals",
        "Open overflow parking lots P4 and P5 earlier to absorb extra vehicles",
        "Send SMS alert to all ticket holders with alternative transit routes",
        "Coordinate with metro authority for express bus service post-match",
      ];
      alternatives = [
        "Partner with ride-share companies for surge-free pricing codes for fans",
        "Open remote parking with shuttle service from 3 miles away",
        "Encourage staggered departures by section to reduce peak transport demand",
      ];
      outcome =
        "With rapid response, 93% of affected fans arrive before kickoff. Post-match departure time averages 38 minutes (vs. 62 minutes without intervention).";
    }
    // ── Evacuation ────────────────────────────────────────────
    else if (
      lower.includes("evacuation") ||
      lower.includes("evacuate") ||
      lower.includes("emergency")
    ) {
      scenario = "Stadium Evacuation";
      riskLevel = "critical";
      summary =
        "Full upper bowl evacuation would require clearing 25,000 fans. Current crowd distribution shows 60% of fans in the upper sections. Egress analysis shows 4 exits have sufficient capacity, but Exit 7 (Section 312-315) would be 40% over capacity. Total evacuation time estimated at 14 minutes for the upper bowl — within FIFA safety standards of 18 minutes. Mobility-impaired fans require assisted evacuation from 6 designated areas.";
      recommended = [
        "Activate evacuation protocol: clear upper bowl first, then lower bowl, then field",
        "Deploy 12 trained evacuation marshals to Exit 7 bottleneck area",
        "Activate emergency lighting and PA system with multilingual guidance",
        "Dispatch medical teams to 6 pre-identified mobility-assist points",
        "Open all 12 gates for egress (do not restrict to entry gates)",
      ];
      alternatives = [
        "Phased evacuation by section (slower but reduces congestion by 35%)",
        "Shelter-in-place for lower bowl while upper bowl clears (if threat is localized)",
        "Reverse field access as primary egress for 50% of capacity",
      ];
      outcome =
        "Upper bowl clears in 14 minutes (within FIFA 18-min standard). Zero congestion at 8 of 12 exits. All mobility-impaired evacuated within 8 minutes.";
    }
    // ── Crowd Surge ───────────────────────────────────────────
    else if (
      lower.includes("surge") ||
      lower.includes("crowd") ||
      lower.includes("crush")
    ) {
      scenario = "Crowd Surge at Gate";
      riskLevel = "high";
      summary =
        "A sudden crowd surge at Gate B from arriving shuttle buses creates a 500-person bottleneck in 3 minutes. The gate's current throughput of 40 people/minute is overwhelmed. Pressure sensors at Gate B indicate crowd density reaching 4.5 people/m² — approaching critical threshold of 5.0. If unmanaged, the surge could cause injuries and crush conditions within 8 minutes.";
      recommended = [
        "Immediately deploy 8 security personnel to Gate B for crowd control",
        "Redirect shuttle bus drop-offs to Gate C and Gate D (both at 40% capacity)",
        "Activate barrier system to create managed queuing lanes at Gate B",
        "Open Gate B auxiliary entrance to double throughput capacity",
        "Broadcast calm, authoritative instructions via Gate B PA system",
      ];
      alternatives = [
        "Reverse flow at Gate B (exit only) and redirect all entries to Gate C for 20 minutes",
        "Create one-way pedestrian flow on the plaza to prevent cross-traffic",
        "Triage entry: families and mobility-impaired through Gate B, general through Gate C",
      ];
      outcome =
        "Crowd density reduces to safe levels (2.8 people/m²) within 6 minutes of deploying resources. Zero injuries predicted with rapid response.";
    }
    // ── Power Failure ─────────────────────────────────────────
    else if (
      lower.includes("power") ||
      lower.includes("electricity") ||
      lower.includes("blackout")
    ) {
      scenario = "Power Failure";
      riskLevel = "critical";
      summary =
        "A partial power failure affects 40% of the stadium including sections 200-250, concourses 3 and 4, and 50% of food courts. Emergency lighting activates automatically. CCTV coverage drops by 35% in affected zones. Digital signage and 30% of POS systems go offline. Ticket scanning at gates slows by 60% as manual backup procedures engage. The backup generator covers 75% of essential systems within 90 seconds.";
      recommended = [
        "Activate backup generator and verify coverage of all critical systems",
        "Deploy portable lighting units to concourses 3 and 4 for safe pedestrian movement",
        "Switch all gates to manual ticket inspection with backup paper manifests",
        "Activate battery-powered PA system in affected zones for announcements",
        "Deploy mobile CCTV units to cover blind spots in sections 200-250",
      ];
      alternatives = [
        "Partial resumption: core stadium systems restored in 4 minutes with generator",
        "If power fails completely, initiate evacuation of upper sections (darker areas)",
        "Deploy staff with flashlights and megaphones to sections with no emergency lighting",
      ];
      outcome =
        "Essential systems restored in 90 seconds. Full power restored within 12 minutes. No incidents reported. Match resumes after 25-minute delay.";
    }
    // ── Food / Vendor ─────────────────────────────────────────
    else if (
      lower.includes("food") ||
      lower.includes("vendor") ||
      lower.includes("supply")
    ) {
      scenario = "Food Supply Chain Disruption";
      riskLevel = "low";
      summary =
        "A delivery delay affects 3 of 12 food courts (Courts 4, 7, and 9) — 40% of hot food options unavailable. Predicted demand is 8,400 meals during peak (halftime). With the shortfall, only 6,200 meals are available, leaving 2,200 fans without hot food options. Cold food and beverage supply is unaffected. Revenue impact estimated at $32,000 in lost hot food sales.";
      recommended = [
        "Divert food inventory from Court 4 to Courts 3 and 5 (within 50ft)",
        "Activate rapid restock from central commissary — ETA 18 minutes",
        "Expand cold food offerings (wraps, salads, sandwiches) at affected courts",
        "Deploy mobile ordering kiosks to reduce queue wait times",
        "Communicate menu changes via app push notification to all fans",
      ];
      alternatives = [
        "Partner with nearby food trucks to supplement supply (4 trucks available outside)",
        "Offer discount coupons for delayed hot food items to manage demand",
        "Cross-train beverage staff to assist with cold food service during peak",
      ];
      outcome =
        "90% of food demand met with mitigation strategies. Average queue time increases by only 3 minutes. Fan satisfaction score: 4.1/5.";
    }
    // ── Default / Generic ─────────────────────────────────────
    else {
      scenario = "Custom Analysis";
      riskLevel = "moderate";
      summary = `Analysis of "${simQuery}" shows moderate impact across stadium operations. AI confidence is high based on historical patterns and real-time data. The simulation engine has processed 847 similar scenarios with 91% accuracy. Key factors: crowd density currently at 68%, incident risk at low, and resource availability at 94%. No immediate critical risks identified, but proactive monitoring recommended for the next 30 minutes.`;
      recommended = [
        "Continue monitoring crowd levels across all 8 zones — 3 zones approaching 70% capacity",
        "Ensure all 12 AI agents are active and reporting — current status: 12/12 online",
        "Review the digital twin for any emerging patterns in sections 100-150",
        "Maintain current staffing levels — no additional deployment needed at this time",
      ];
      alternatives = [
        "Proactive resource pre-positioning at Gate B (historically highest traffic zone)",
        "Consider early opening of auxiliary concessions to spread demand",
        "Run parallel simulation for worst-case scenario to validate assumptions",
      ];
      outcome =
        "Current operations remain stable. Predicted outcome: normal operations with 94% confidence. Re-run simulation if conditions change by more than 15%.";
    }

    // Generate mock impact data based on scenario
    const mockImpact = (
      baseBefore: number,
      baseAfter: number,
      unit: string,
      label: string,
      direction: "positive" | "negative",
    ) => {
      const deltaPct = Math.round(
        ((baseAfter - baseBefore) / baseBefore) * 100,
      );
      return {
        metric: label,
        before: `${baseBefore}${unit}`,
        after: `${baseAfter}${unit}`,
        unit,
        impact: direction,
        delta_pct: deltaPct,
      };
    };

    const buildImpacts = (risk: string) => {
      const severity =
        risk === "critical"
          ? 1.8
          : risk === "high"
            ? 1.4
            : risk === "low"
              ? 0.7
              : 1.0;
      return {
        queue_times: [
          mockImpact(
            8,
            Math.round(8 * severity * (0.8 + Math.random() * 0.4)),
            " min",
            "Entry Wait Time",
            "negative",
          ),
          mockImpact(
            6,
            Math.round(6 * severity * (0.7 + Math.random() * 0.5)),
            " min",
            "Food Court Queue",
            "negative",
          ),
          mockImpact(
            3,
            Math.round(3 * severity * (0.6 + Math.random() * 0.4)),
            " min",
            "Restroom Queue",
            "negative",
          ),
        ],
        walking_times: [
          mockImpact(
            4,
            Math.round(4 * severity * (0.8 + Math.random() * 0.3)),
            " min",
            "Gate to Seat",
            "negative",
          ),
          mockImpact(
            6,
            Math.round(6 * severity * (0.7 + Math.random() * 0.4)),
            " min",
            "Concourse Transit",
            "negative",
          ),
          mockImpact(
            10,
            Math.round(10 * severity * (0.6 + Math.random() * 0.5)),
            " min",
            "Exit to Transport",
            "negative",
          ),
        ],
        safety: [
          mockImpact(
            1,
            Math.round(1 * severity * (0.5 + Math.random() * 1.5)),
            "",
            "Incident Risk (index)",
            "negative",
          ),
          mockImpact(
            94,
            Math.round(94 - 5 * severity + Math.random() * 3),
            "%",
            "Response Readiness",
            "positive",
          ),
          mockImpact(
            100,
            Math.round(100 - 8 * severity),
            "%",
            "Evacuation Capacity",
            risk === "critical" ? "negative" : "positive",
          ),
        ],
        transport: [
          mockImpact(
            85,
            Math.round(85 - 15 * severity + Math.random() * 5),
            "%",
            "Metro Capacity",
            "negative",
          ),
          mockImpact(
            12,
            Math.round(12 + 8 * severity),
            " min",
            "Ride-Share Wait",
            "negative",
          ),
          mockImpact(
            15,
            Math.round(15 + 5 * severity),
            " min",
            "Parking Exit",
            "negative",
          ),
        ],
        revenue: [
          mockImpact(
            100,
            Math.round(100 - 12 * severity),
            "%",
            "Concession Revenue",
            "negative",
          ),
          mockImpact(
            360,
            Math.round(360 - 18 * severity),
            " $/min",
            "Merchandise Rate",
            "negative",
          ),
          mockImpact(
            100,
            Math.round(100 - 5 * severity),
            "%",
            "Ticket Value Retention",
            "positive",
          ),
        ],
        crowd_flow: [
          mockImpact(
            68,
            Math.round(68 + 12 * severity),
            "%",
            "Overall Density",
            "negative",
          ),
          mockImpact(
            240,
            Math.round(240 - 30 * severity),
            "/min",
            "Gate Throughput",
            "negative",
          ),
          mockImpact(
            92,
            Math.round(92 - 8 * severity),
            "%",
            "Seating Efficiency",
            risk === "critical" ? "negative" : "positive",
          ),
        ],
      };
    };

    const resultData: SimulationResult = {
      id: `sim-${Date.now().toString(36)}`,
      scenario,
      query: simQuery,
      summary,
      risk_level: riskLevel,
      confidence_score: 0.78 + Math.random() * 0.18,
      impacts: buildImpacts(riskLevel),
      recommended_actions: recommended,
      alternatives,
      expected_outcome: outcome,
      timestamp: new Date().toISOString(),
    };

    setResult(resultData);
    setShowResult(true);
    setIsRunning(false);
  }, []);

  const handlePresetClick = useCallback((preset: ScenarioPreset) => {
    setSelectedPreset(preset.id);
    setQuery(preset.example_query);
  }, []);

  const impactKeys = [
    "queue_times",
    "walking_times",
    "safety",
    "transport",
    "revenue",
    "crowd_flow",
  ] as const;

  return (
    <>
      <DashboardHeader
        title="AI Simulation Engine"
        subtitle="Run 'what if' scenarios and see predicted impacts on stadium operations"
        role="Simulation"
        roleGradient="from-amber-500 to-rose-600"
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Top: Query Input + Presets */}
        {!showResult && (
          <div className="space-y-6">
            {/* Query Input */}
            <div className="glass rounded-2xl p-5 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    What happens if...?
                  </h2>
                  <p className="text-sm text-stadium-400">
                    Describe a scenario and the AI will simulate the impact
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleRunSimulation(query)
                  }
                  placeholder="e.g. What happens if Gate A closes due to a security incident?"
                  className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-stadium-500 outline-none focus:border-gold-500/30 focus:bg-white/10 transition-all"
                  aria-label="Simulation query"
                />
                <button
                  onClick={() => handleRunSimulation(query)}
                  disabled={!query.trim() || isRunning}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-semibold text-sm hover:from-amber-400 hover:to-rose-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  {isRunning ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isRunning ? "Simulating..." : "Run Simulation"}
                </button>
              </div>
            </div>

            {/* Scenario Presets */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-stadium-400" />
                Quick Scenario Presets
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                {mockPresets.map((preset) => {
                  const Icon = presetIcons[preset.icon] || FlaskConical;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className={clsx(
                        "glass rounded-2xl p-4 text-left hover:bg-white/[0.07] transition-all group",
                        selectedPreset === preset.id &&
                          "ring-1 ring-gold-500/40",
                      )}
                    >
                      <div
                        className={clsx(
                          "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
                          presetGradients[preset.category] ||
                            "from-stadium-500 to-gold-500",
                        )}
                      >
                        <Icon className="w-4.5 h-4.5 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        {preset.title}
                      </h4>
                      <p className="text-xs text-stadium-400 mb-2 line-clamp-2">
                        {preset.description}
                      </p>
                      <span
                        className={clsx(
                          "text-[10px] font-medium px-2 py-0.5 rounded-full",
                          severityColors[preset.severity],
                        )}
                      >
                        {preset.severity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tip */}
            <div className="glass rounded-2xl p-4 border-l-2 border-l-gold-500">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-stadium-300">
                    <span className="text-white font-medium">Pro tip:</span> Try
                    scenarios like &quot;What happens if it starts raining
                    during the match?&quot; or &quot;What happens if Metro Line
                    2 stops running?&quot; The AI analyzes impacts on queue
                    times, walking times, safety, transport, revenue, and crowd
                    flow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simulation Running */}
        {isRunning && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center mb-4 animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <p className="text-white font-semibold text-lg mb-2">
              Running Simulation...
            </p>
            <p className="text-stadium-400 text-sm">
              Analyzing crowd flow, queue times, safety, and revenue impact
            </p>
            <div className="mt-6 flex gap-2">
              {["Analyzing", "Predicting", "Optimizing"].map((step) => (
                <span
                  key={step}
                  className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-stadium-400 animate-pulse"
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {showResult && result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Result Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-white">
                    Simulation Results
                  </h2>
                  <StatusBadge
                    status={
                      result.risk_level as
                        | "low"
                        | "moderate"
                        | "high"
                        | "critical"
                    }
                  />
                </div>
                <p className="text-stadium-400 text-sm">
                  &ldquo;{result.query}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-stadium-500">
                    Scenario: {result.scenario}
                  </span>
                  <span className="text-stadium-600">•</span>
                  <span className="text-xs text-stadium-500">
                    Confidence: {(result.confidence_score * 100).toFixed(0)}%
                  </span>
                  <span className="text-stadium-600">•</span>
                  <span className="text-xs text-stadium-500">
                    ID: {result.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowResult(false);
                  setResult(null);
                  setQuery("");
                }}
                className="px-4 py-2 rounded-xl bg-white/5 text-stadium-300 hover:text-white hover:bg-white/10 transition-all text-sm"
              >
                New Simulation
              </button>
            </div>

            {/* Summary */}
            <div className="glass rounded-2xl p-5 border-l-2 border-l-gold-500">
              <h3 className="text-sm font-semibold text-white mb-2">
                AI Summary
              </h3>
              <p className="text-sm text-stadium-200 leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Impact Sections Grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {impactKeys.map((key) => {
                const meta = impactSectionMeta[key];
                const metrics = result.impacts[key];
                if (!metrics || metrics.length === 0) return null;

                return (
                  <div key={key} className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className={clsx(
                          "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center",
                          meta.gradient,
                        )}
                      >
                        <meta.icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        {meta.label}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {metrics.map((m, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-stadium-400 truncate">
                              {m.metric}
                            </span>
                            <ImpactBadge
                              impact={m.impact}
                              delta={m.delta_pct}
                            />
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-emerald font-medium">
                              {m.before}
                            </span>
                            <ArrowRight className="w-3 h-3 text-stadium-600" />
                            <span className="text-rose font-medium">
                              {m.after}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommended Actions */}
            <div className="glass rounded-2xl p-5 border-l-2 border-l-emerald">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald" />
                Recommended Actions
              </h3>
              <div className="space-y-2">
                {result.recommended_actions.map((action, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-emerald/5"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-emerald">
                        {i + 1}
                      </span>
                    </span>
                    <p className="text-sm text-stadium-200">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternatives + Expected Outcome */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Alternative Strategies
                </h3>
                <ul className="space-y-2">
                  {result.alternatives.map((alt, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-stadium-300"
                    >
                      <span className="text-stadium-500 mt-0.5">•</span>
                      {alt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-2xl p-5 border-l-2 border-l-gold-500">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Expected Outcome
                </h3>
                <p className="text-sm text-stadium-200 leading-relaxed">
                  {result.expected_outcome}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
