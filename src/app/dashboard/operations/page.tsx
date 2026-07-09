"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Users,
  AlertTriangle,
  Heart,
  Warehouse,
  Bus,
  Trash2,
  ShieldAlert,
  Brain,
  TrendingUp,
  TrendingDown,
  Clock,
  Thermometer,
  Ticket,
  ChevronRight,
  RefreshCw,
  Zap,
  Droplets,
  type LucideIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPICard from "@/components/dashboard/KPICard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import clsx from "clsx";

// ─── Types ────────────────────────────────────────────────────

interface AISummary {
  headline: string;
  narrative: string;
  risk_level: string;
  confidence_score: number;
  key_insights: string[];
  top_recommendations: string[];
  predicted_hotspots: string[];
}

interface CrowdData {
  current_attendance: number;
  total_capacity: number;
  occupancy_pct: number;
  zones_critical: number;
  zones_high: number;
  zones_moderate: number;
  zones_low: number;
  gate_throughput_rate: number;
  trend_direction: string;
  peak_time_estimate: string | null;
}

interface IncidentData {
  total_active: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  average_response_time_min: number;
  most_recent: any[];
}

interface VendorData {
  total_outlets: number;
  critical_stock_count: number;
  low_stock_count: number;
  peak_demand_period: string;
  revenue_per_hour: number;
  top_selling_item: string;
}

interface TransportData {
  metro_lines_online: number;
  metro_lines_delayed: number;
  shuttle_buses_active: number;
  parking_lots_full: number;
  total_parking_capacity: number;
  road_conditions: string;
}

interface MedicalData {
  active_incidents: number;
  responder_teams_available: number;
  total_responder_teams: number;
  equipment_ready_pct: number;
  triage_capacity_used: number;
  triage_capacity_total: number;
}

interface SecurityData {
  personnel_on_duty: number;
  cameras_online: number;
  total_cameras: number;
  active_alerts: number;
  zones_secured: number;
  total_zones: number;
}

interface DomainStatus {
  domain: string;
  status: string;
  health_score: number;
  active_count: number;
  total_count: number;
  details: string;
}

interface DashboardData {
  timestamp: string;
  ai_summary: AISummary;
  crowd: CrowdData;
  incidents: IncidentData;
  vendor: VendorData;
  transport: TransportData;
  medical: MedicalData;
  security: SecurityData;
  domains: DomainStatus[];
  crowd_trend_history: any[];
  incident_trend_history: any[];
  vendor_trend_history: any[];
}

// ─── Domain Status Card ───────────────────────────────────────

const domainIcons: Record<string, LucideIcon> = {
  "Stadium Operations": Activity,
  Security: ShieldAlert,
  Medical: Heart,
  Vendor: Warehouse,
  Transport: Bus,
  Cleaning: Trash2,
};

const domainGradients: Record<string, string> = {
  "Stadium Operations": "from-stadium-400 to-stadium-600",
  Security: "from-rose-500 to-red-500",
  Medical: "from-emerald-500 to-teal-500",
  Vendor: "from-amber-400 to-orange-500",
  Transport: "from-blue-400 to-blue-600",
  Cleaning: "from-cyan-400 to-cyan-600",
};

function DomainCard({ domain }: { domain: DomainStatus }) {
  const Icon = domainIcons[domain.domain] || Activity;
  const gradient =
    domainGradients[domain.domain] || "from-stadium-400 to-stadium-600";

  return (
    <div
      className={clsx(
        "glass rounded-2xl p-4 flex items-center gap-4 transition-all hover:bg-white/[0.05]",
        domain.status === "warning" && "ring-1 ring-amber/30",
        domain.status === "critical" && "ring-1 ring-rose/30",
      )}
    >
      <div
        className={clsx(
          "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0",
          gradient,
        )}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h4 className="text-sm font-semibold text-white truncate">
            {domain.domain}
          </h4>
          <StatusBadge
            status={
              domain.status as "online" | "warning" | "critical" | "offline"
            }
          />
        </div>
        <p className="text-xs text-stadium-400 truncate">{domain.details}</p>
        {/* Health bar */}
        <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-500",
              domain.health_score >= 80
                ? "bg-emerald"
                : domain.health_score >= 50
                  ? "bg-amber"
                  : "bg-rose",
            )}
            style={{ width: `${domain.health_score}%` }}
          />
        </div>
        <p className="text-[10px] text-stadium-500 mt-1">
          {domain.health_score}% health score
        </p>
      </div>
    </div>
  );
}

// ─── Insight Card ─────────────────────────────────────────────

function InsightCard({
  icon: Icon,
  label,
  value,
  gradient,
  children,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
  gradient?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div
          className={clsx(
            "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center",
            gradient || "from-stadium-400 to-stadium-600",
          )}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-white">{label}</h3>
        {value && (
          <span className="text-xs text-stadium-400 ml-auto">{value}</span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* AI Summary Skeleton */}
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-white/5 rounded-lg w-3/4 mb-3" />
        <div className="h-4 bg-white/5 rounded w-full mb-2" />
        <div className="h-4 bg-white/5 rounded w-2/3" />
      </div>
      {/* KPI Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-5 animate-pulse">
            <div className="h-10 w-10 rounded-xl bg-white/5 mb-3" />
            <div className="h-7 bg-white/5 rounded w-1/2 mb-1" />
            <div className="h-4 bg-white/5 rounded w-3/4" />
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5 animate-pulse h-64">
          <div className="h-5 bg-white/5 rounded w-1/3 mb-4" />
          <div className="h-full bg-white/5 rounded" />
        </div>
        <div className="glass rounded-2xl p-5 animate-pulse h-64">
          <div className="h-5 bg-white/5 rounded w-1/3 mb-4" />
          <div className="h-full bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-xs">
      <p className="text-stadium-400 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}:{" "}
          {typeof entry.value === "number"
            ? entry.value.toLocaleString()
            : entry.value}
        </p>
      ))}
    </div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────

function AnimatedValue({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────

export default function OperationsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedInsight, setSelectedInsight] = useState(0);

  const fetchDashboard = useCallback(async () => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const now = new Date().toISOString();

    const mockData: DashboardData = {
      timestamp: now,
      ai_summary: {
        headline: "All Systems Operational",
        narrative:
          "Stadium operations are running smoothly across all domains. Crowd levels are moderate and all critical systems are online. One vendor outlet is running low on hot dogs — restock scheduled. Gate B showing slight congestion, resolving naturally.",
        risk_level: "low",
        confidence_score: 0.94,
        key_insights: [
          "Crowd density at 67% — no immediate overflow risk",
          "Gate B throughput decreased 8% in last 15 min — monitoring",
          "Food Court 4 approaching capacity threshold (ETA 9 min)",
          "Medical team available — no active critical incidents",
          "Transport: Metro Line 2 normal, shuttle buses on schedule",
        ],
        top_recommendations: [
          "Monitor Gate B queue length — deploy volunteer if >50 people",
          "Pre-position restock at Food Court 4 before capacity breach",
          "Continue 30-second patrol cycles in Sections 200-250",
        ],
        predicted_hotspots: [
          "Gate B (78% congestion in 20 min)",
          "Food Court 4 (92% capacity in 9 min)",
        ],
      },
      crowd: {
        current_attendance: 62843,
        total_capacity: 75000,
        occupancy_pct: 84,
        zones_critical: 0,
        zones_high: 1,
        zones_moderate: 3,
        zones_low: 4,
        gate_throughput_rate: 142,
        trend_direction: "up",
        peak_time_estimate: "19:45 UTC",
      },
      incidents: {
        total_active: 3,
        critical_count: 1,
        high_count: 0,
        medium_count: 2,
        low_count: 0,
        average_response_time_min: 4.2,
        most_recent: [
          {
            id: "INC-001",
            type: "medical",
            location: "Section 304",
            severity: "critical",
            time: "2m ago",
            status: "responding",
          },
          {
            id: "INC-002",
            type: "spill",
            location: "Corridor 2A",
            severity: "medium",
            time: "5m ago",
            status: "dispatched",
          },
          {
            id: "INC-003",
            type: "lost_child",
            location: "Gate B",
            severity: "medium",
            time: "8m ago",
            status: "resolved",
          },
        ],
      },
      vendor: {
        total_outlets: 48,
        critical_stock_count: 2,
        low_stock_count: 7,
        peak_demand_period: "19:30 - 20:30",
        revenue_per_hour: 12400,
        top_selling_item: "Hot Dog Combo",
      },
      transport: {
        metro_lines_online: 3,
        metro_lines_delayed: 0,
        shuttle_buses_active: 12,
        parking_lots_full: 2,
        total_parking_capacity: 12500,
        road_conditions: "clear",
      },
      medical: {
        active_incidents: 1,
        responder_teams_available: 8,
        total_responder_teams: 10,
        equipment_ready_pct: 100,
        triage_capacity_used: 15,
        triage_capacity_total: 200,
      },
      security: {
        personnel_on_duty: 156,
        cameras_online: 247,
        total_cameras: 256,
        active_alerts: 2,
        zones_secured: 8,
        total_zones: 8,
      },
      domains: [
        {
          domain: "Stadium Operations",
          status: "online",
          health_score: 96,
          active_count: 8,
          total_count: 8,
          details: "All systems nominal — 12 AI agents active",
        },
        {
          domain: "Security",
          status: "online",
          health_score: 98,
          active_count: 156,
          total_count: 160,
          details: "247/256 cameras online, 2 low-priority alerts",
        },
        {
          domain: "Medical",
          status: "warning",
          health_score: 85,
          active_count: 1,
          total_count: 4,
          details: "1 active incident (non-critical), 8 teams available",
        },
        {
          domain: "Vendor",
          status: "warning",
          health_score: 82,
          active_count: 46,
          total_count: 48,
          details: "2 outlets critically low on stock",
        },
        {
          domain: "Transport",
          status: "online",
          health_score: 94,
          active_count: 12,
          total_count: 12,
          details: "All shuttles active, parking at 78%",
        },
        {
          domain: "Cleaning",
          status: "online",
          health_score: 91,
          active_count: 24,
          total_count: 26,
          details: "2 staff on break, coverage maintained",
        },
      ],
      crowd_trend_history: Array.from({ length: 12 }, (_, i) => ({
        time: `${18 + i}:00`,
        attendance: Math.round(45000 + i * 1500 + Math.random() * 2000),
        capacity: 75000,
      })),
      incident_trend_history: Array.from({ length: 12 }, (_, i) => ({
        time: `${18 + i}:00`,
        active: Math.max(
          0,
          5 - Math.floor(i / 2) + Math.floor(Math.random() * 2),
        ),
        resolved: Math.floor(i * 1.5),
      })),
      vendor_trend_history: Array.from({ length: 12 }, (_, i) => ({
        time: `${18 + i}:00`,
        revenue: Math.round(8000 + i * 400 + Math.random() * 1000),
        orders: Math.round(600 + i * 30 + Math.random() * 50),
      })),
    };

    setData(mockData);
    setLastUpdated(new Date());
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboard();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  if (loading) return <LoadingSkeleton />;

  // ─── Render ────────────────────────────────────────────────

  return (
    <>
      <DashboardHeader
        title="AI Operations Dashboard"
        subtitle="Real-time generative intelligence for stadium operations"
        role="Operations"
        roleGradient="from-stadium-500 to-stadium-700"
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="glass rounded-2xl p-5 border-l-2 border-l-rose">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose shrink-0" />
              <p className="text-sm text-stadium-200">{error}</p>
              <button
                onClick={fetchDashboard}
                className="ml-auto px-3 py-1.5 rounded-lg bg-white/5 text-xs text-stadium-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <RefreshCw className="w-3 h-3 inline mr-1" />
                Retry
              </button>
            </div>
          </div>
        )}

        {data && (
          <>
            {/* ─── AI Generative Summary ────────────────────────── */}
            <div
              className={clsx(
                "glass rounded-2xl p-5 md:p-7 relative overflow-hidden",
                data.ai_summary.risk_level === "critical" &&
                  "border-l-2 border-l-rose",
                data.ai_summary.risk_level === "high" &&
                  "border-l-2 border-l-amber",
                data.ai_summary.risk_level === "moderate" &&
                  "border-l-2 border-l-amber/60",
                data.ai_summary.risk_level === "low" &&
                  "border-l-2 border-l-emerald",
              )}
            >
              {/* Glow effect */}
              <div
                className={clsx(
                  "absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl",
                  data.ai_summary.risk_level === "critical"
                    ? "bg-rose"
                    : data.ai_summary.risk_level === "high"
                      ? "bg-amber"
                      : data.ai_summary.risk_level === "moderate"
                        ? "bg-amber/60"
                        : "bg-emerald",
                )}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-[#050510]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        AI-Generated Operations Summary
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StatusBadge
                          status={
                            data.ai_summary.risk_level as
                              | "low"
                              | "moderate"
                              | "high"
                              | "critical"
                          }
                        />
                        <span className="text-[10px] text-stadium-500">
                          Confidence:{" "}
                          {(data.ai_summary.confidence_score * 100).toFixed(0)}%
                        </span>
                        {lastUpdated && (
                          <span className="text-[10px] text-stadium-500">
                            • Updated: {lastUpdated.toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={fetchDashboard}
                    className="p-2 rounded-xl hover:bg-white/5 text-stadium-400 hover:text-stadium-200 transition-all"
                    aria-label="Refresh data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-gold-400 mb-2">
                  {data.ai_summary.headline}
                </h3>
                <p className="text-sm text-stadium-200 leading-relaxed mb-4">
                  {data.ai_summary.narrative}
                </p>

                {/* Insights carousel */}
                {data.ai_summary.key_insights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {data.ai_summary.key_insights.map((insight, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedInsight(i)}
                        className={clsx(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          selectedInsight === i
                            ? "bg-gold-500/20 text-gold-400 ring-1 ring-gold-500/30"
                            : "bg-white/5 text-stadium-400 hover:text-stadium-200",
                        )}
                      >
                        {insight}
                      </button>
                    ))}
                  </div>
                )}

                {/* Predicted hotspots */}
                {data.ai_summary.predicted_hotspots.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-stadium-400">
                    <Zap className="w-3 h-3 text-amber" />
                    <span>Hotspots:</span>
                    {data.ai_summary.predicted_hotspots.map((spot, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-amber/10 text-amber"
                      >
                        {spot}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ─── KPI Row ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
              {/* Custom card for animated attendance counter */}
              <div className="glass rounded-2xl p-5 group hover:bg-white/[0.05] transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stadium-400 to-stadium-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className={clsx(
                      "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                      data.crowd.trend_direction === "rising"
                        ? "text-emerald bg-emerald/10"
                        : data.crowd.trend_direction === "falling"
                          ? "text-rose bg-rose/10"
                          : "text-stadium-400 bg-white/5",
                    )}
                  >
                    {data.crowd.trend_direction === "rising" && (
                      <TrendingUp className="w-3 h-3" />
                    )}
                    {data.crowd.trend_direction === "falling" && (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{data.crowd.trend_direction}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-0.5">
                  <AnimatedValue value={data.crowd.current_attendance} />
                </div>
                <div className="text-sm text-stadium-400">
                  Current Attendance
                </div>
                <div className="text-xs text-stadium-500 mt-1">
                  / {data.crowd.total_capacity.toLocaleString()} capacity
                </div>
              </div>
              <KPICard
                title="Crowd Density"
                value={`${data.crowd.occupancy_pct}%`}
                subtitle={`${data.crowd.zones_critical} critical zones`}
                icon={Activity}
                trend={data.crowd.occupancy_pct > 75 ? "up" : "neutral"}
                gradient="from-amber-400 to-orange-500"
              />
              <KPICard
                title="Active Incidents"
                value={data.incidents.total_active.toString()}
                subtitle={`${data.incidents.critical_count} critical • ${data.incidents.high_count} high`}
                icon={AlertTriangle}
                trend={data.incidents.total_active > 3 ? "up" : "neutral"}
                gradient="from-rose-500 to-red-500"
              />
              <KPICard
                title="Medical"
                value={data.medical.active_incidents.toString()}
                subtitle={`${data.medical.responder_teams_available} teams ready`}
                icon={Heart}
                trend={data.medical.active_incidents > 2 ? "down" : "neutral"}
                gradient="from-emerald-500 to-teal-500"
              />
              <KPICard
                title="Vendor Health"
                value={`${data.vendor.critical_stock_count} critical`}
                subtitle={`$${(data.vendor.revenue_per_hour / 1000).toFixed(0)}K/hr revenue`}
                icon={Warehouse}
                trend={
                  data.vendor.critical_stock_count > 2 ? "down" : "neutral"
                }
                gradient="from-amber-400 to-orange-500"
              />
              <KPICard
                title="Parking"
                value={`${data.transport.parking_lots_full} full`}
                subtitle={`${data.transport.total_parking_capacity.toLocaleString()} spaces`}
                icon={Bus}
                trend={data.transport.parking_lots_full > 2 ? "up" : "neutral"}
                gradient="from-blue-400 to-blue-600"
              />
            </div>

            {/* ─── Charts Row ──────────────────────────────────── */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* Crowd Trend Chart */}
              <InsightCard
                icon={Activity}
                label="Crowd Trend (3h)"
                gradient="from-stadium-400 to-stadium-600"
              >
                {data.crowd_trend_history.length > 0 && (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data.crowd_trend_history}>
                      <defs>
                        <linearGradient
                          id="crowdGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#818cf8"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#818cf8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                      />
                      <XAxis
                        dataKey="timestamp"
                        tick={{ fill: "#6366f1", fontSize: 10 }}
                        tickFormatter={(v) => {
                          const d = new Date(v);
                          return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
                        }}
                        axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
                      />
                      <YAxis
                        tick={{ fill: "#6366f1", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="attendance"
                        stroke="#818cf8"
                        fillOpacity={1}
                        fill="url(#crowdGradient)"
                        name="Attendance"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </InsightCard>

              {/* Incident Trend Chart */}
              <InsightCard
                icon={AlertTriangle}
                label="Incident Activity"
                gradient="from-rose-500 to-red-500"
              >
                {data.incident_trend_history.length > 0 && (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.incident_trend_history}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                      />
                      <XAxis
                        dataKey="timestamp"
                        tick={{ fill: "#6366f1", fontSize: 10 }}
                        tickFormatter={(v) => {
                          const d = new Date(v);
                          return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
                        }}
                        axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
                      />
                      <YAxis
                        tick={{ fill: "#6366f1", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar
                        dataKey="count"
                        name="Incidents"
                        fill="#f43f5e"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </InsightCard>

              {/* Vendor Revenue + Orders */}
              <InsightCard
                icon={Warehouse}
                label="Vendor Revenue & Orders"
                gradient="from-amber-400 to-orange-500"
              >
                {data.vendor_trend_history.length > 0 && (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.vendor_trend_history}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                      />
                      <XAxis
                        dataKey="timestamp"
                        tick={{ fill: "#6366f1", fontSize: 10 }}
                        tickFormatter={(v) => {
                          const d = new Date(v);
                          return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
                        }}
                        axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fill: "#6366f1", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: "#6366f1", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue ($)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        name="Orders"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </InsightCard>
            </div>

            {/* ─── Domain Status Grid ──────────────────────────── */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-stadium-400" />
                Domain Health Overview
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                {data.domains.map((domain) => (
                  <DomainCard key={domain.domain} domain={domain} />
                ))}
              </div>
            </div>

            {/* ─── Recommendations + Activity ──────────────────── */}
            <div className="grid xl:grid-cols-3 gap-6">
              {/* AI Recommendations */}
              <div className="xl:col-span-2">
                <InsightCard
                  icon={Brain}
                  label="AI Recommendations"
                  gradient="from-gold-400 to-gold-600"
                >
                  <div className="space-y-2">
                    {data.ai_summary.top_recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-gold-400">
                            {i + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-stadium-200">{rec}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stadium-600 shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                </InsightCard>
              </div>

              {/* Right Column: Stats + Activity */}
              <div className="space-y-4">
                {/* Quick Stats */}
                <div className="glass rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <StatRow
                      icon={Ticket}
                      label="Gate Throughput"
                      value={`${data.crowd.gate_throughput_rate}/min`}
                    />
                    <StatRow
                      icon={Clock}
                      label="Avg Response Time"
                      value={`${data.incidents.average_response_time_min} min`}
                    />
                    <StatRow
                      icon={Thermometer}
                      label="Equipment Readiness"
                      value={`${data.medical.equipment_ready_pct}%`}
                    />
                    <StatRow
                      icon={ShieldAlert}
                      label="Cameras Online"
                      value={`${data.security.cameras_online}/${data.security.total_cameras}`}
                    />
                    <StatRow
                      icon={Droplets}
                      label="Road Conditions"
                      value={data.transport.road_conditions}
                    />
                    <StatRow
                      icon={TrendingUp}
                      label="Peak Period"
                      value={data.vendor.peak_demand_period}
                    />
                  </div>
                </div>

                {/* Activity Feed */}
                <ActivityFeed />
              </div>
            </div>

            {/* ─── Last Updated ────────────────────────────────── */}
            <div className="text-center">
              <p className="text-[10px] text-stadium-600">
                Last updated: {lastUpdated?.toLocaleTimeString()} •
                Auto-refreshes every 30s • Source: StadiumMind AI
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── Stat Row ─────────────────────────────────────────────────

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-stadium-400" />
        <span className="text-xs text-stadium-400">{label}</span>
      </div>
      <span className="text-xs font-medium text-white">{value}</span>
    </div>
  );
}
