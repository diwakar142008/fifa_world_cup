"use client";

import {
  Bus,
  Train,
  Car,
  Navigation,
  ParkingSquare,
  AlertTriangle,
  Users,
  Map,
  Route,
  Gauge,
  Wifi,
  ExternalLink,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPICard from "@/components/dashboard/KPICard";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import StatusBadge from "@/components/dashboard/StatusBadge";

const transitLines = [
  { name: "Metro Line 1 (Red)", status: "on-time" as const, next: "2 min", crowd: "moderate" as const, delay: 0 },
  { name: "Metro Line 2 (Blue)", status: "delayed" as const, next: "8 min", crowd: "high" as const, delay: 8 },
  { name: "Metro Line 3 (Green)", status: "on-time" as const, next: "4 min", crowd: "low" as const, delay: 0 },
  { name: "Shuttle Bus — East Lot", status: "on-time" as const, next: "3 min", crowd: "moderate" as const, delay: 0 },
  { name: "Shuttle Bus — West Lot", status: "on-time" as const, next: "5 min", crowd: "moderate" as const, delay: 0 },
  { name: "Express Bus — Downtown", status: "delayed" as const, next: "12 min", crowd: "high" as const, delay: 6 },
];

const parkingLots = [
  { name: "Lot A — North", occupancy: 92, status: "critical" as const, total: 1200, available: 96 },
  { name: "Lot B — East", occupancy: 78, status: "warning" as const, total: 800, available: 176 },
  { name: "Lot C — South", occupancy: 45, status: "active" as const, total: 600, available: 330 },
  { name: "Lot D — West", occupancy: 34, status: "active" as const, total: 500, available: 330 },
  { name: "VIP Parking", occupancy: 88, status: "warning" as const, total: 200, available: 24 },
  { name: "Overflow Lot", occupancy: 12, status: "cleared" as const, total: 400, available: 352 },
];

const trafficPredictions = [
  { route: "Stadium → Downtown", condition: "heavy" as const, time: "28 min", normal: "14 min", recommendation: "Use Metro Line 3" },
  { route: "Stadium → Airport", condition: "moderate" as const, time: "35 min", normal: "25 min", recommendation: "Shuttle bus recommended" },
  { route: "Stadium → East Side", condition: "clear" as const, time: "18 min", normal: "16 min", recommendation: "All routes normal" },
  { route: "Stadium → West Side", condition: "heavy" as const, time: "32 min", normal: "18 min", recommendation: "Avoid I-95, use Metro" },
];

const rideShareZones = [
  { name: "Zone A — North Gate", demand: "high" as const, waitTime: "8 min", cars: 12 },
  { name: "Zone B — East Gate", demand: "moderate" as const, waitTime: "5 min", cars: 8 },
  { name: "Zone C — South Gate", demand: "low" as const, waitTime: "3 min", cars: 15 },
  { name: "Zone D — West Gate", demand: "moderate" as const, waitTime: "6 min", cars: 6 },
];

export default function TransportDashboard() {
  return (
    <>
      <DashboardHeader
        title="Transportation Command Center"
        subtitle="Real-time transit • Parking • Traffic • Ride-sharing • Post-match predictions"
        role="Transport Authority"
        roleGradient="from-blue-500 to-blue-700"
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Traffic Advisory Banner */}
        <div className="glass rounded-2xl p-5 border-l-2 border-l-amber">
          <div className="flex items-start gap-3">
            <Route className="w-5 h-5 text-amber mt-0.5" />
            <div>
              <h2 className="text-white font-semibold text-sm">Post-Match Traffic Advisory</h2>
              <p className="text-stadium-300 text-sm mt-1">
                AI predicts <strong className="text-amber">heavy congestion</strong> on I-95 and downtown routes
                starting at 10:15 PM (match end + 15 min). Metro Line 2 delayed by 8 minutes.
                Recommend: deploy 4 extra shuttle buses, activate ride-share overflow zones.
              </p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber/20 text-amber hover:bg-amber/30 transition-colors flex items-center gap-1.5">
                  <Bus className="w-3 h-3" />
                  Deploy Shuttles
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-stadium-300 hover:text-white transition-colors">
                  View Traffic Map
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-stadium-300 hover:text-white transition-colors">
                  Send Alert
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4">
          <KPICard title="Transit Lines" value="6" subtitle="2 delayed" icon={Train} trend="neutral" gradient="from-stadium-400 to-stadium-600" />
          <KPICard title="Parking Occupancy" value="62%" subtitle="3,808 / 6,100" icon={ParkingSquare} trend="up" trendValue="+4%" gradient="from-rose-500 to-red-500" />
          <KPICard title="Avg Traffic Time" value="28 min" subtitle="+8 min above normal" icon={Gauge} trend="up" trendValue="+8" gradient="from-amber-400 to-orange-500" />
          <KPICard title="Active Rideshare" value="41" subtitle="Across 4 zones" icon={Car} trend="up" trendValue="+12" gradient="from-emerald-400 to-teal-500" />
          <KPICard title="Buses Deployed" value="18" subtitle="6 extra active" icon={Bus} trend="up" trendValue="+6" gradient="from-gold-400 to-gold-600" />
          <KPICard title="Passengers/hr" value="8,400" subtitle="Outbound" icon={Users} trend="up" trendValue="+15%" gradient="from-cyan-400 to-blue-500" />
          <KPICard title="WiFi on Transit" value="100%" subtitle="All vehicles" icon={Wifi} trend="neutral" gradient="from-violet-400 to-purple-500" />
        </div>

        {/* Main Grid */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Left: Transit & Parking */}
          <div className="xl:col-span-2 space-y-6">
            {/* Transit Lines */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Train className="w-4 h-4 text-blue-400" />
                Transit Lines — Live Status
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {transitLines.map((line) => (
                  <div key={line.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">{line.name}</p>
                        <StatusBadge status={line.status === "on-time" ? "success" : "warning"} />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-stadium-400">Next: {line.next}</span>
                        <span className="text-xs text-stadium-500">Crowd: {line.crowd}</span>
                        {line.delay > 0 && (
                          <span className="text-xs text-rose">{line.delay} min delay</span>
                        )}
                      </div>
                    </div>
                    <Navigation className="w-4 h-4 text-stadium-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Parking Occupancy */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <ParkingSquare className="w-4 h-4 text-blue-400" />
                Parking Lot Occupancy
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {parkingLots.map((lot) => (
                  <div key={lot.name} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-white">{lot.name}</p>
                      <StatusBadge status={lot.status} />
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-1">
                      <div
                        className={`h-full rounded-full transition-all ${
                          lot.occupancy > 85 ? "bg-rose" :
                          lot.occupancy > 60 ? "bg-amber" :
                          lot.occupancy > 30 ? "bg-stadium-400" : "bg-emerald"
                        }`}
                        style={{ width: `${lot.occupancy}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-stadium-400">{lot.occupancy}% full</span>
                      <span className="text-stadium-500">{lot.available} spots left</span>
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
            {/* Traffic Predictions */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-400" />
                Post-Match Traffic Predictions
              </h3>
              <div className="space-y-2">
                {trafficPredictions.map((t) => (
                  <div key={t.route} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-white font-medium">{t.route}</p>
                      <span className={`text-xs font-medium ${
                        t.condition === "heavy" ? "text-rose" :
                        t.condition === "moderate" ? "text-amber" : "text-emerald"
                      }`}>
                        {t.condition.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-stadium-400">{t.time}</span>
                        <span className="text-stadium-600">({t.normal} normal)</span>
                      </div>
                    </div>
                    <p className="text-xs text-stadium-500 mt-1">
                      💡 {t.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ride-Share Zones */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-400" />
                Ride-Share Zones
              </h3>
              <div className="space-y-2">
                {rideShareZones.map((zone) => (
                  <div key={zone.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div>
                      <p className="text-sm text-white">{zone.name}</p>
                      <div className="flex items-center gap-2 text-xs text-stadium-400 mt-0.5">
                        <span>Wait: {zone.waitTime}</span>
                        <span>{zone.cars} cars</span>
                      </div>
                    </div>
                    <StatusBadge status={zone.demand === "high" ? "critical" : zone.demand === "moderate" ? "warning" : "active"} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Traffic Map", icon: Map },
                  { label: "Route Planner", icon: Route },
                  { label: "Alert Fans", icon: AlertTriangle },
                  { label: "Deploy Bus", icon: ExternalLink },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <action.icon className="w-4 h-4 text-blue-400" />
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
