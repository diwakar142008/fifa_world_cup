"use client";

import {
  Shield,
  ShieldAlert,
  Camera,
  Eye,
  Fingerprint,
  Lock,
  Radio,
  ScanFace,
  BellRing,
  Siren,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPICard from "@/components/dashboard/KPICard";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import StatusBadge from "@/components/dashboard/StatusBadge";

const securityZones = [
  { name: "Gate A", status: "secure" as const, personel: 4, crowd: 78 },
  { name: "Gate B", status: "secure" as const, personel: 3, crowd: 45 },
  { name: "Gate C", status: "warning" as const, personel: 2, crowd: 23 },
  { name: "VIP Zone", status: "secure" as const, personel: 8, crowd: 12 },
  { name: "Parking East", status: "secure" as const, personel: 3, crowd: 34 },
  { name: "Parking West", status: "secure" as const, personel: 2, crowd: 41 },
  { name: "Food Court 4", status: "warning" as const, personel: 1, crowd: 67 },
  { name: "Section 210", status: "critical" as const, personel: 2, crowd: 89 },
];

const alerts = [
  { id: 1, type: "warning" as const, message: "Unattended bag spotted near Gate C", time: "2m ago", priority: "high" as const },
  { id: 2, type: "info" as const, message: "VIP vehicle approaching East entrance", time: "5m ago", priority: "medium" as const },
  { id: 3, type: "info" as const, message: "Gate C ticket scanner back online", time: "8m ago", priority: "low" as const },
  { id: 4, type: "critical" as const, message: "Section 210 crowd density critical — deploy support", time: "1m ago", priority: "high" as const },
];

export default function SecurityDashboard() {
  return (
    <>
      <DashboardHeader
        title="Security Command Center"
        subtitle="Real-time threat monitoring • Access Control • Crowd Surveillance"
        role="Security"
        roleGradient="from-rose-600 to-red-600"
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Status Banner */}
        <div className="glass rounded-2xl p-5 border-l-2 border-l-rose">
          <div className="flex items-start gap-3">
            <Siren className="w-5 h-5 text-rose mt-0.5" />
            <div>
              <h2 className="text-white font-semibold text-sm">Active Security Advisory</h2>
              <p className="text-stadium-300 text-sm mt-1">
                Section 210 has reached critical crowd density. AI recommends deploying 2 additional security personnel
                to manage flow. All other zones are nominal. Camera systems operational at 100%.
              </p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose/20 text-rose hover:bg-rose/30 transition-colors">
                  Deploy to Section 210
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-stadium-300 hover:text-white transition-colors">
                  View Camera Feed
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard title="Active Alerts" value="4" subtitle="1 critical" icon={ShieldAlert} trend="up" trendValue="+1" gradient="from-rose-500 to-red-500" />
          <KPICard title="Personnel On Duty" value="28" subtitle="6 zones covered" icon={Shield} trend="neutral" gradient="from-stadium-400 to-stadium-600" />
          <KPICard title="Gate Status" value="8/8" subtitle="All gates operational" icon={Lock} trend="neutral" gradient="from-cyan-400 to-blue-500" />
          <KPICard title="Cameras Online" value="64/64" subtitle="100% uptime" icon={Camera} trend="neutral" gradient="from-emerald-400 to-teal-500" />
        </div>

        {/* Main Grid */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Zone Monitoring */}
          <div className="xl:col-span-2 space-y-6">
            {/* Zone Grid */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <ScanFace className="w-4 h-4 text-stadium-400" />
                Zone Security Status
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {securityZones.map((zone) => (
                  <div key={zone.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        zone.status === "secure" ? "bg-emerald" :
                        zone.status === "warning" ? "bg-amber" :
                        "bg-rose animate-pulse"
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-white">{zone.name}</p>
                        <p className="text-xs text-stadium-400">{zone.personel} personnel</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-stadium-300">{zone.crowd}%</p>
                      <StatusBadge status={zone.status} />
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
            {/* Real-time Alerts */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <BellRing className="w-4 h-4 text-rose" />
                Real-time Alerts
              </h3>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      alert.type === "critical" ? "bg-rose animate-pulse" :
                      alert.type === "warning" ? "bg-amber" : "bg-stadium-400"
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm text-stadium-200">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-stadium-500">{alert.time}</span>
                        <StatusBadge status={alert.priority} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Security Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Lockdown Protocol", icon: Lock, variant: "danger" as const },
                  { label: "Evacuation Route", icon: Siren, variant: "danger" as const },
                  { label: "Broadcast Alert", icon: Radio, variant: "normal" as const },
                  { label: "Access Logs", icon: Fingerprint, variant: "normal" as const },
                  { label: "Camera Grid View", icon: Eye, variant: "normal" as const },
                ].map((action) => (
                  <button
                    key={action.label}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      action.variant === "danger"
                        ? "text-rose hover:bg-rose/10"
                        : "text-stadium-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
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
