"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Activity,
  AlertTriangle,
  Calendar,
  Thermometer,
  ParkingSquare,
  Ticket,
  Clock,
  BarChart3,
  Map,
  Radio,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPICard from "@/components/dashboard/KPICard";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function OrganizerDashboard() {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState("");

  const quickActions = [
    {
      label: "Open Simulation Engine",
      icon: BarChart3,
      action: () => router.push("/dashboard/simulation"),
    },
    {
      label: "View Stadium Map",
      icon: Map,
      action: () => router.push("/dashboard/map"),
    },
    {
      label: "Broadcast Announcement",
      icon: Radio,
      action: () => {
        const msg = prompt("Enter announcement message:");
        if (msg?.trim()) setAnnouncement(msg);
      },
    },
    {
      label: "Generate Incident Report",
      icon: Clock,
      action: () =>
        alert(
          "Incident report generated!\n\n• 3 active incidents\n• 1 critical (Section 304)\n• 2 minor (Gate B, Corridor 2A)\n• All under control\n\nReport ID: INC-" +
            Date.now().toString(36).toUpperCase(),
        ),
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Operations Command Center"
        subtitle="MetLife Stadium • FIFA World Cup 2026 • Match Day 12"
        role="Organizer"
        roleGradient="from-stadium-500 to-stadium-700"
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Status Banner */}
        <div className="glass-gold rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <Radio className="w-5 h-5 text-[#050510]" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">
                AI Status Summary
              </h2>
              <p className="text-stadium-300 text-xs md:text-sm">
                All systems nominal. 12 agents active. Crowd at 67% capacity.
                <span className="hidden md:inline">
                  {" "}
                  Gate B approaching high congestion — recommend monitoring.
                </span>
              </p>
            </div>
          </div>
          <StatusBadge status="active" label="All Systems Go" />
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          <KPICard
            title="Current Attendance"
            value="62,843"
            subtitle="/ 75,000 capacity"
            icon={Users}
            trend="up"
            trendValue="+4.2%"
            gradient="from-stadium-400 to-stadium-600"
          />
          <KPICard
            title="Crowd Density"
            value="67%"
            subtitle="Moderate"
            icon={Activity}
            trend="up"
            trendValue="+3%"
            gradient="from-amber-400 to-orange-500"
          />
          <KPICard
            title="Active Incidents"
            value="3"
            subtitle="1 critical • 2 minor"
            icon={AlertTriangle}
            trend="neutral"
            gradient="from-rose-500 to-red-500"
          />
          <KPICard
            title="Temperature"
            value="72°F"
            subtitle="Clear skies"
            icon={Thermometer}
            trend="neutral"
            gradient="from-cyan-400 to-blue-500"
          />
          <KPICard
            title="Parking Occupancy"
            value="84%"
            subtitle="12,456 vehicles"
            icon={ParkingSquare}
            trend="up"
            trendValue="+8%"
            gradient="from-violet-400 to-purple-500"
          />
          <KPICard
            title="Ticket Scan Rate"
            value="142/min"
            subtitle="98.2% success"
            icon={Ticket}
            trend="up"
            trendValue="+2.1%"
            gradient="from-gold-400 to-gold-600"
          />
        </div>

        {/* Main Grid */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* AI Chat */}
          <div className="xl:col-span-2 min-h-[500px]">
            <AIChatPanel />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={action.action}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stadium-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Icon className="w-4 h-4 text-stadium-400" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Match */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">
                Next Match
              </h3>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stadium-400 to-stadium-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Quarter-Final
                  </p>
                  <p className="text-xs text-stadium-400">
                    BRA v ARG • Jul 12, 8PM
                  </p>
                  <p className="text-xs text-stadium-500">T-3 days</p>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeed />
          </div>
        </div>

        {/* Predictive Alert */}
        <div className="glass rounded-2xl p-5 border-l-2 border-l-amber">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                AI Prediction: Food Court 4
              </h3>
              <p className="text-sm text-stadium-300 mt-1">
                Food Court 4 will exceed comfortable capacity in approximately{" "}
                <strong className="text-amber">9 minutes</strong>. Recommended
                action: Open Food Court 6 and redirect visitors from Sections
                208-215.
              </p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber/20 text-amber hover:bg-amber/30 transition-colors">
                  Open Food Court 6
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-stadium-300 hover:text-white hover:bg-white/10 transition-colors">
                  Redirect Visitors
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-stadium-300 hover:text-white hover:bg-white/10 transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
