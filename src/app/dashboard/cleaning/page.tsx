"use client";

import {
  Trash2,
  RotateCw,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Bath,
  SprayCan,
  ClipboardList,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPICard from "@/components/dashboard/KPICard";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import StatusBadge from "@/components/dashboard/StatusBadge";

const wasteStations = [
  { id: "W-01", location: "Gate A — North", fillLevel: 87, status: "critical" as const, lastEmptied: "45 min ago" },
  { id: "W-02", location: "Gate A — South", fillLevel: 62, status: "warning" as const, lastEmptied: "1.2h ago" },
  { id: "W-03", location: "Food Court 3", fillLevel: 94, status: "critical" as const, lastEmptied: "2.1h ago" },
  { id: "W-04", location: "Section 210", fillLevel: 45, status: "active" as const, lastEmptied: "0.8h ago" },
  { id: "W-05", location: "Section 304", fillLevel: 28, status: "cleared" as const, lastEmptied: "0.3h ago" },
  { id: "W-06", location: "Main Concourse", fillLevel: 71, status: "warning" as const, lastEmptied: "1.5h ago" },
];

const restrooms = [
  { name: "Restroom A — Level 1", cleanliness: 92, status: "good" as const, lastCleaned: "10 min ago" },
  { name: "Restroom B — Level 1", cleanliness: 78, status: "active" as const, lastCleaned: "35 min ago" },
  { name: "Restroom C — Level 2", cleanliness: 55, status: "warning" as const, lastCleaned: "1.2h ago" },
  { name: "Restroom D — Level 2", cleanliness: 88, status: "good" as const, lastCleaned: "20 min ago" },
  { name: "Restroom E — VIP", cleanliness: 96, status: "good" as const, lastCleaned: "5 min ago" },
  { name: "Restroom F — Level 3", cleanliness: 41, status: "critical" as const, lastCleaned: "2.5h ago" },
];

const cleaningTasks = [
  { id: "C-101", task: "Empty waste bins — Food Court 3", priority: "high" as const, status: "pending" as const, location: "Food Court 3", eta: "Now" },
  { id: "C-102", task: "Deep clean — Restroom F, Level 3", priority: "high" as const, status: "pending" as const, location: "Restroom F", eta: "5 min" },
  { id: "C-103", task: "Spill cleanup — Corridor 2A", priority: "medium" as const, status: "active" as const, location: "Corridor 2A", eta: "In Progress" },
  { id: "C-104", task: "Restock supplies — Restroom C", priority: "medium" as const, status: "pending" as const, location: "Restroom C", eta: "15 min" },
  { id: "C-105", task: "Gate A waste station — urgent", priority: "high" as const, status: "pending" as const, location: "Gate A North", eta: "10 min" },
];

export default function CleaningDashboard() {
  return (
    <>
      <DashboardHeader
        title="Sanitation & Waste Operations"
        subtitle="Real-time waste monitoring • Cleaning schedules • Restroom status"
        role="Cleaning"
        roleGradient="from-cyan-500 to-teal-600"
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Critical Alert Banner */}
        <div className="glass rounded-2xl p-5 border-l-2 border-l-rose">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose mt-0.5 animate-pulse" />
            <div>
              <h2 className="text-white font-semibold text-sm">Urgent: Waste Overflow Risk</h2>
              <p className="text-stadium-300 text-sm mt-1">
                <strong className="text-rose">2 waste stations</strong> above 85% capacity (Gate A North, Food Court 3).
                <strong className="text-rose"> Restroom F</strong> cleanliness at 41% — requires immediate attention.
                AI recommends dispatching 2 cleaning crews.
              </p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose/20 text-rose hover:bg-rose/30 transition-colors flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Dispatch Crews
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-stadium-300 hover:text-white transition-colors">
                  View Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          <KPICard title="Waste Capacity" value="68%" subtitle="2 stations critical" icon={Trash2} trend="up" trendValue="+5%" gradient="from-rose-500 to-red-500" />
          <KPICard title="Restroom Status" value="3/6" subtitle="Good condition" icon={Bath} trend="neutral" gradient="from-cyan-400 to-cyan-600" />
          <KPICard title="Active Tasks" value="5" subtitle="3 high priority" icon={ClipboardList} trend="up" trendValue="+2" gradient="from-stadium-400 to-stadium-600" />
          <KPICard title="Crews On Duty" value="8" subtitle="4 zones" icon={Users} trend="neutral" gradient="from-gold-400 to-gold-600" />
          <KPICard title="Spills Today" value="6" subtitle="5 resolved" icon={SprayCan} trend="down" trendValue="-2" gradient="from-emerald-400 to-teal-500" />
          <KPICard title="Avg Response" value="4.8 min" subtitle="Below 7 min target" icon={Clock} trend="down" trendValue="-1.2" gradient="from-violet-400 to-purple-500" />
        </div>

        {/* Main Grid */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Left: Waste & Restroom Status */}
          <div className="xl:col-span-2 space-y-6">
            {/* Waste Station Status */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-cyan-400" />
                Waste Station Fill Levels
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {wasteStations.map((station) => (
                  <div key={station.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{station.location}</p>
                        <p className="text-xs text-stadium-500">{station.id} • Last: {station.lastEmptied}</p>
                      </div>
                      <StatusBadge status={station.status} />
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          station.fillLevel > 85 ? "bg-rose" :
                          station.fillLevel > 60 ? "bg-amber" :
                          station.fillLevel > 35 ? "bg-stadium-400" : "bg-emerald"
                        }`}
                        style={{ width: `${station.fillLevel}%` }}
                      />
                    </div>
                    <p className="text-xs text-stadium-500 mt-1">{station.fillLevel}% full</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat */}
            <div className="min-h-[400px]">
              <AIChatPanel />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Cleaning Tasks */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-cyan-400" />
                Active Cleaning Tasks
              </h3>
              <div className="space-y-2">
                {cleaningTasks.map((task) => (
                  <div key={task.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm text-white">{task.task}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-stadium-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {task.location}
                          </span>
                          <span className="text-xs text-stadium-500">{task.eta}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <StatusBadge status={task.status} />
                        <StatusBadge status={task.priority} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restroom Status */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Bath className="w-4 h-4 text-cyan-400" />
                Restroom Cleanliness
              </h3>
              <div className="space-y-2">
                {restrooms.map((room) => (
                  <div key={room.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{room.name}</p>
                      <p className="text-xs text-stadium-500">{room.lastCleaned}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono ${
                        room.cleanliness >= 80 ? "text-emerald" :
                        room.cleanliness >= 60 ? "text-stadium-300" :
                        room.cleanliness >= 40 ? "text-amber" : "text-rose"
                      }`}>
                        {room.cleanliness}%
                      </span>
                      <StatusBadge status={room.status === "good" ? "success" : room.status === "active" ? "active" : room.status === "warning" ? "warning" : "critical"} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Report Spill", icon: SprayCan },
                  { label: "Request Supplies", icon: RotateCw },
                  { label: "Check Schedule", icon: Clock },
                  { label: "Crew Chat", icon: Users },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400/20 to-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <action.icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-xs text-stadium-300">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeed />
          </div>
        </div>
      </div>
    </>
  );
}
