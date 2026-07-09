"use client";

import {
  Heart,
  Activity,
  Ambulance,
  Stethoscope,
  Pill,
  Clock,
  MapPin,
  AlertTriangle,
  Users,
  Syringe,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPICard from "@/components/dashboard/KPICard";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import StatusBadge from "@/components/dashboard/StatusBadge";

const activeIncidents = [
  {
    id: "M-001",
    type: "Faintness",
    location: "Section 304, Row J",
    priority: "medium" as const,
    status: "active" as const,
    responder: "Team Alpha",
    eta: "2 min",
    note: "Fan feeling dizzy, seated, vital signs stable",
  },
  {
    id: "M-002",
    type: "Allergic Reaction",
    location: "Food Court 3",
    priority: "high" as const,
    status: "active" as const,
    responder: "Team Bravo",
    eta: "1 min",
    note: "Possible nut allergy. EpiPen available. EMT on site.",
  },
  {
    id: "M-003",
    type: "Minor Injury",
    location: "Gate A, Stairs",
    priority: "low" as const,
    status: "pending" as const,
    responder: "Team Charlie",
    eta: "5 min",
    note: "Fan twisted ankle on stairs. Walking with assistance.",
  },
];

const responderTeams = [
  { name: "Team Alpha", status: "on-call" as const, location: "Section 301", members: 3, equipment: "Full" },
  { name: "Team Bravo", status: "responding" as const, location: "Food Court 3", members: 2, equipment: "Full" },
  { name: "Team Charlie", status: "on-call" as const, location: "Gate A", members: 2, equipment: "Basic" },
  { name: "Team Delta", status: "stationed" as const, location: "Medical Room 2", members: 3, equipment: "Full" },
  { name: "Team Echo", status: "on-call" as const, location: "VIP Lounge", members: 2, equipment: "Full" },
];

const equipment = [
  { name: "AED Defibrillators", status: "operational" as const, count: 24, locations: "12 zones" },
  { name: "Stretchers", status: "operational" as const, count: 16, locations: "4 stations" },
  { name: "First Aid Kits", status: "operational" as const, count: 48, locations: "All zones" },
  { name: "Oxygen Tanks", status: "low" as const, count: 6, locations: "3 stations" },
];

export default function MedicalDashboard() {
  return (
    <>
      <DashboardHeader
        title="Medical Operations Center"
        subtitle="Real-time incident tracking • Responder coordination • Equipment monitoring"
        role="Medical"
        roleGradient="from-emerald-600 to-teal-600"
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Incident Alert */}
        {activeIncidents.filter(i => i.priority === "high").length > 0 && (
          <div className="glass rounded-2xl p-5 border-l-2 border-l-rose">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose mt-0.5 animate-pulse" />
              <div>
                <h2 className="text-white font-semibold text-sm">High Priority Incident</h2>
                <p className="text-stadium-300 text-sm mt-1">
                  Allergic reaction reported at Food Court 3. Team Bravo responding (ETA 1 min). EpiPen deployed.
                  Requesting medical room preparation.
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose/20 text-rose hover:bg-rose/30 transition-colors">
                    Track Response
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-stadium-300 hover:text-white transition-colors">
                    Prepare Medical Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          <KPICard title="Active Incidents" value={activeIncidents.length.toString()} subtitle="1 high priority" icon={Heart} trend="up" trendValue="+1" gradient="from-rose-500 to-red-500" />
          <KPICard title="Responders Active" value="12" subtitle="5 teams deployed" icon={Ambulance} trend="neutral" gradient="from-emerald-400 to-teal-500" />
          <KPICard title="Avg Response Time" value="2.4 min" subtitle="Below 5 min target" icon={Clock} trend="down" trendValue="-0.3" gradient="from-stadium-400 to-stadium-600" />
          <KPICard title="Patients Treated" value="18" subtitle="Today" icon={Stethoscope} trend="up" trendValue="+3" gradient="from-gold-400 to-gold-600" />
          <KPICard title="Equipment Ready" value="94%" subtitle="3 items low" icon={Pill} trend="neutral" gradient="from-cyan-400 to-blue-500" />
          <KPICard title="Medical Rooms" value="4/4" subtitle="All operational" icon={Syringe} trend="neutral" gradient="from-violet-400 to-purple-500" />
        </div>

        {/* Main Grid */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Left: Incidents & Chat */}
          <div className="xl:col-span-2 space-y-6">
            {/* Active Incidents Table */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose" />
                  Active Medical Incidents
                </h3>
              </div>
              <div className="divide-y divide-white/5">
                {activeIncidents.map((incident) => (
                  <div key={incident.id} className="px-5 py-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          incident.priority === "high" ? "bg-rose animate-pulse" :
                          incident.priority === "medium" ? "bg-amber" : "bg-emerald"
                        }`} />
                        <div>
                          <span className="text-sm font-medium text-white">{incident.type}</span>
                          <span className="text-xs text-stadium-500 ml-2">{incident.id}</span>
                        </div>
                      </div>
                      <StatusBadge status={incident.status} />
                    </div>
                    <div className="ml-5 grid sm:grid-cols-3 gap-3 text-xs">
                      <div className="flex items-center gap-2 text-stadium-400">
                        <MapPin className="w-3 h-3" />
                        {incident.location}
                      </div>
                      <div className="flex items-center gap-2 text-stadium-400">
                        <Ambulance className="w-3 h-3" />
                        {incident.responder} • ETA {incident.eta}
                      </div>
                      <div className="text-stadium-500">
                        {incident.note}
                      </div>
                    </div>
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
            {/* Responder Teams */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald" />
                Responder Teams
              </h3>
              <div className="space-y-3">
                {responderTeams.map((team) => (
                  <div key={team.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        team.status === "on-call" ? "bg-emerald" :
                        team.status === "responding" ? "bg-amber animate-pulse" : "bg-stadium-400"
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-white">{team.name}</p>
                        <p className="text-xs text-stadium-400">{team.location} • {team.members} members</p>
                      </div>
                    </div>
                    <StatusBadge status={team.status === "on-call" ? "online" : team.status === "responding" ? "warning" : "active"} />
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Status */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Equipment Status</h3>
              <div className="space-y-3">
                {equipment.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-stadium-200">{item.name}</p>
                      <p className="text-xs text-stadium-500">{item.count} units • {item.locations}</p>
                    </div>
                    <StatusBadge status={item.status === "operational" ? "success" : "warning"} />
                  </div>
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
