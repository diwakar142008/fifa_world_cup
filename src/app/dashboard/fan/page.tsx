"use client";

import {
  Navigation,
  Users,
  MapPin,
  UtensilsCrossed,
  Clock,
  LocateFixed,
  Volume2,
  Globe,
  Star,
  Ticket,
  Wifi,
  BatteryFull,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPICard from "@/components/dashboard/KPICard";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function FanDashboard() {
  return (
    <>
      <DashboardHeader
        title="Fan Experience"
        subtitle="Welcome, Alex! • Section 210 • Seat 12A"
        role="Fan"
        roleGradient="from-gold-500 to-amber-600"
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Match Banner */}
        <div className="glass-gold rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <Star className="w-7 h-7 text-[#050510]" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Quarter-Final: BRA v ARG</h2>
              <p className="text-stadium-300 text-sm">MetLife Stadium • Kickoff 8:00 PM • Live Match</p>
              <div className="flex items-center gap-3 mt-1.5">
                <StatusBadge status="active" label="Live" />
                <span className="text-xs text-stadium-400">42nd minute • 1-0</span>
              </div>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-[#050510] font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all">
            Navigate to Seat
          </button>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard title="Your Gate" value="Gate B" subtitle="5 min walk" icon={MapPin} trend="neutral" gradient="from-stadium-400 to-stadium-600" />
          <KPICard title="Gate B Crowd" value="78%" subtitle="Moderately busy" icon={Users} trend="up" trendValue="+5%" gradient="from-amber-400 to-orange-500" />
          <KPICard title="Nearest Restroom" value="40 ft" subtitle="Section 209" icon={LocateFixed} trend="neutral" gradient="from-cyan-400 to-blue-500" />
          <KPICard title="WiFi Status" value="Connected" subtitle="5G Stadium Network" icon={Wifi} trend="neutral" gradient="from-emerald-400 to-teal-500" />
        </div>

        {/* Main Content */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* AI Chat */}
          <div className="xl:col-span-2 min-h-[450px]">
            <AIChatPanel />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Navigation Quick Actions */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-gold-400" />
                Quick Navigate
              </h3>
              <div className="space-y-2">
                {[
                  { label: "My Seat (210-12A)", icon: MapPin, desc: "Level 2, Section 210" },
                  { label: "Nearest Restroom", icon: LocateFixed, desc: "Section 209, 40 ft" },
                  { label: "Food Court 3", icon: UtensilsCrossed, desc: "Vegetarian options available" },
                  { label: "Gate B (Exit)", icon: Navigation, desc: "5 min walk, moderate crowd" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="w-4 h-4 text-gold-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{item.label}</p>
                      <p className="text-xs text-stadium-400 truncate">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Stadium Services</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Translation", icon: Globe, gradient: "from-stadium-400 to-stadium-600" },
                  { label: "Voice Guide", icon: Volume2, gradient: "from-gold-400 to-gold-600" },
                  { label: "My Tickets", icon: Ticket, gradient: "from-rose-400 to-rose-500" },
                  { label: "Battery Status", icon: BatteryFull, gradient: "from-emerald-400 to-emerald-500" },
                ].map((service) => (
                  <button
                    key={service.label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-stadium-300">{service.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Crowd Intelligence */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Crowd Intelligence</h3>
              <div className="space-y-3">
                {[
                  { gate: "Gate A", level: 78, status: "high" as const },
                  { gate: "Gate B", level: 45, status: "medium" as const },
                  { gate: "Gate C", level: 23, status: "low" as const },
                  { gate: "Gate D", level: 34, status: "low" as const },
                ].map((g) => (
                  <div key={g.gate} className="flex items-center gap-3">
                    <span className="text-xs text-stadium-400 w-12">{g.gate}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          g.status === "high" ? "bg-rose" :
                          g.status === "medium" ? "bg-amber" : "bg-emerald"
                        }`}
                        style={{ width: `${g.level}%` }}
                      />
                    </div>
                    <span className="text-xs text-stadium-400 w-8 text-right">{g.level}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
