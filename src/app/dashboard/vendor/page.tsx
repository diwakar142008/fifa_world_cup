"use client";

import clsx from "clsx";
import {
  Warehouse,
  TrendingUp,
  Package,
  Clock,
  Users,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  BarChart3,
  RefreshCw,
  Bell,
  UtensilsCrossed,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPICard from "@/components/dashboard/KPICard";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import StatusBadge from "@/components/dashboard/StatusBadge";

const inventoryItems = [
  { name: "Hot Dogs", stock: 340, forecast: 520, unit: "units", status: "low" as const, reorderAt: 400 },
  { name: "Burgers", stock: 280, forecast: 410, unit: "units", status: "critical" as const, reorderAt: 300 },
  { name: "Bottled Water", stock: 2400, forecast: 3100, unit: "bottles", status: "medium" as const, reorderAt: 2000 },
  { name: "Soft Drinks", stock: 1800, forecast: 2500, unit: "cans", status: "medium" as const, reorderAt: 1500 },
  { name: "Nachos", stock: 190, forecast: 260, unit: "bags", status: "medium" as const, reorderAt: 200 },
  { name: "Beer", stock: 850, forecast: 1100, unit: "cups", status: "good" as const, reorderAt: 600 },
  { name: "Popcorn", stock: 120, forecast: 200, unit: "bags", status: "critical" as const, reorderAt: 150 },
  { name: "Pizza Slices", stock: 90, forecast: 180, unit: "slices", status: "critical" as const, reorderAt: 120 },
];

const peakHours = [
  { time: "6:00 PM — 8:00 PM", demand: "Very High", crowd: "92%", staff: "Recommended: 12", status: "critical" as const },
  { time: "4:00 PM — 6:00 PM", demand: "High", crowd: "78%", staff: "Recommended: 8", status: "warning" as const },
  { time: "8:00 PM — 10:00 PM", demand: "Medium", crowd: "55%", staff: "Recommended: 6", status: "active" as const },
  { time: "2:00 PM — 4:00 PM", demand: "Low", crowd: "30%", staff: "Recommended: 4", status: "cleared" as const },
];

const demandAlerts = [
  { id: 1, message: "Food Court 4 demand spiking — 2x normal rate", time: "2m ago", type: "urgent" as const },
  { id: 2, message: "Burgers running low at Station B — 15 remaining", time: "5m ago", type: "urgent" as const },
  { id: 3, message: "Water sales 30% above forecast — adjust inventory", time: "10m ago", type: "warning" as const },
  { id: 4, message: "Staff check-in: 6/8 scheduled vendors confirmed", time: "15m ago", type: "info" as const },
];

export default function VendorDashboard() {
  return (
    <>
      <DashboardHeader
        title="Vendor Operations Center"
        subtitle="AI-driven demand forecasting • Inventory management • Staff optimization"
        role="Vendor"
        roleGradient="from-amber-500 to-orange-600"
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Demand Alert Banner */}
        <div className="glass rounded-2xl p-5 border-l-2 border-l-rose">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose mt-0.5 animate-pulse" />
            <div>
              <h2 className="text-white font-semibold text-sm">Critical Inventory Alert</h2>
              <p className="text-stadium-300 text-sm mt-1">
                <strong className="text-rose">3 items</strong> below reorder threshold. Pizza slices, popcorn, and burgers
                need restocking within the next 30 minutes to meet projected demand. AI recommends placing
                an urgent order.
              </p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose/20 text-rose hover:bg-rose/30 transition-colors flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3" />
                  Place Urgent Order
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-stadium-300 hover:text-white transition-colors">
                  View Forecast
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          <KPICard title="Inventory Items" value="8" subtitle="3 critical" icon={Package} trend="down" trendValue="-2" gradient="from-rose-500 to-red-500" />
          <KPICard title="Revenue Today" value="$142K" subtitle="124% of target" icon={DollarSign} trend="up" trendValue="+24%" gradient="from-gold-400 to-gold-600" />
          <KPICard title="Active Orders" value="1,240" subtitle="Past hour" icon={ShoppingCart} trend="up" trendValue="+18%" gradient="from-stadium-400 to-stadium-600" />
          <KPICard title="Peak Demand" value="92%" subtitle="7:15 PM — 8:30 PM" icon={TrendingUp} trend="up" trendValue="+12%" gradient="from-amber-400 to-orange-500" />
          <KPICard title="Vendors Active" value="6/8" subtitle="2 pending check-in" icon={Users} trend="neutral" gradient="from-cyan-400 to-blue-500" />
          <KPICard title="Avg Prep Time" value="4.2 min" subtitle="On target" icon={Clock} trend="down" trendValue="-0.3" gradient="from-emerald-400 to-teal-500" />
        </div>

        {/* Main Grid */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Left: Inventory & Chat */}
          <div className="xl:col-span-2 space-y-6">
            {/* Inventory Table */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-amber" />
                  Inventory & Demand Forecast
                </h3>
                <button className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-stadium-500 text-xs">
                      <th className="text-left px-5 py-3 font-medium">Item</th>
                      <th className="text-right px-4 py-3 font-medium">Stock</th>
                      <th className="text-right px-4 py-3 font-medium">Forecast</th>
                      <th className="text-right px-4 py-3 font-medium">Status</th>
                      <th className="text-right px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inventoryItems.map((item) => (
                      <tr key={item.name} className="hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3">
                          <span className="text-white font-medium">{item.name}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={clsx(
                            item.status === "critical" && "text-rose",
                            item.status === "low" && "text-amber",
                            item.status === "medium" && "text-stadium-300",
                            item.status === "good" && "text-emerald",
                            "font-mono"
                          )}>
                            {item.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-stadium-300">{item.forecast}</td>
                        <td className="px-4 py-3 text-right">
                          <StatusBadge status={item.stock < (item.forecast * 0.3) ? "critical" : item.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          {(item.status === "critical" || item.status === "low") && (
                            <button className="text-xs text-gold-400 hover:text-gold-300 transition-colors font-medium">
                              Reorder
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Chat */}
            <div className="min-h-[400px]">
              <AIChatPanel />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Peak Hours */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber" />
                Peak Hour Forecast
              </h3>
              <div className="space-y-2">
                {peakHours.map((peak) => (
                  <div key={peak.time} className="flex items-start justify-between p-3 rounded-xl bg-white/5">
                    <div className="min-w-0">
                      <p className="text-xs text-white font-medium">{peak.time}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-stadium-400">{peak.demand} demand</span>
                        <span className="text-xs text-stadium-500">{peak.crowd} crowd</span>
                      </div>
                      <p className="text-xs text-violet-400 mt-0.5">{peak.staff}</p>
                    </div>
                    <StatusBadge status={peak.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Demand Alerts */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber" />
                Live Demand Alerts
              </h3>
              <div className="space-y-3">
                {demandAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      alert.type === "urgent" ? "bg-rose animate-pulse" :
                      alert.type === "warning" ? "bg-amber" : "bg-stadium-400"
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm text-stadium-200">{alert.message}</p>
                      <p className="text-xs text-stadium-500 mt-0.5">{alert.time}</p>
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
                  { label: "Place Order", icon: ShoppingCart },
                  { label: "View Sales", icon: DollarSign },
                  { label: "Staff Roster", icon: Users },
                  { label: "Menu Update", icon: UtensilsCrossed },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <action.icon className="w-4 h-4 text-amber" />
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
