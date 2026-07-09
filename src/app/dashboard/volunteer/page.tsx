"use client";

import {
  Handshake,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Bell,
  Calendar,
  Navigation,
  Phone,
  MessageCircle,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KPICard from "@/components/dashboard/KPICard";
import AIChatPanel from "@/components/dashboard/AIChatPanel";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import StatusBadge from "@/components/dashboard/StatusBadge";

const activeTasks = [
  {
    id: "V-101",
    task: "Guide wheelchair user to Section 304",
    location: "Gate B Entrance",
    priority: "high" as const,
    status: "active" as const,
    assignee: "You",
    eta: "Now",
  },
  {
    id: "V-102",
    task: "Assist with Gate A crowd分流",
    location: "Gate A",
    priority: "high" as const,
    status: "active" as const,
    assignee: "You + Team Alpha",
    eta: "5 min",
  },
  {
    id: "V-103",
    task: "Restock information kiosk — Section 210",
    location: "Section 210, Level 2",
    priority: "medium" as const,
    status: "pending" as const,
    assignee: "Pending",
    eta: "15 min",
  },
  {
    id: "V-104",
    task: "Language support — Spanish — Food Court 3",
    location: "Food Court 3",
    priority: "medium" as const,
    status: "pending" as const,
    assignee: "Pending",
    eta: "20 min",
  },
];

const shiftSchedule = [
  { day: "Today", shift: "4:00 PM — 11:00 PM", zone: "Gates A-C", status: "active" as const },
  { day: "Tomorrow", shift: "2:00 PM — 9:00 PM", zone: "Food Courts", status: "pending" as const },
  { day: "Fri", shift: "OFF", zone: "—", status: "cleared" as const },
  { day: "Sat", shift: "6:00 PM — 1:00 AM", zone: "Section 200-300", status: "pending" as const },
];

const notifications = [
  { id: 1, message: "Section 304 — wheelchair assistance needed", time: "Just now", type: "urgent" as const },
  { id: 2, message: "Gate A crowd divert — report to Team Lead", time: "3 min ago", type: "urgent" as const },
  { id: 3, message: "Spanish translator requested at Food Court 3", time: "8 min ago", type: "info" as const },
  { id: 4, message: "Shift handoff reminder: 15 min remaining", time: "12 min ago", type: "info" as const },
];

export default function VolunteerDashboard() {
  return (
    <>
      <DashboardHeader
        title="Volunteer Operations"
        subtitle="Real-time task dispatch • Shift management • Zone coverage"
        role="Volunteer"
        roleGradient="from-violet-500 to-purple-600"
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="glass rounded-2xl p-5 border-l-2 border-l-violet-500">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shrink-0">
              <Handshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Welcome back, Maria!</h2>
              <p className="text-stadium-300 text-sm mt-1">
                You have <span className="text-violet-400 font-medium">2 active tasks</span> and{" "}
                <span className="text-amber font-medium">2 pending assignments</span>.
                Next shift starts now at Gate B. Check in when you arrive.
              </p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  Check In — Gate B
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-stadium-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <Navigation className="w-3 h-3" />
                  Navigate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KPICard title="Active Tasks" value="2" subtitle="1 high priority" icon={CheckCircle2} trend="neutral" gradient="from-violet-400 to-violet-600" />
          <KPICard title="Volunteers On Duty" value="24" subtitle="8 zones covered" icon={Users} trend="up" trendValue="+4" gradient="from-stadium-400 to-stadium-600" />
          <KPICard title="Hours Today" value="6.5" subtitle="4.5 remaining" icon={Clock} trend="neutral" gradient="from-cyan-400 to-blue-500" />
          <KPICard title="Tasks Completed" value="12" subtitle="Today" icon={Handshake} trend="up" trendValue="+3" gradient="from-gold-400 to-gold-600" />
        </div>

        {/* Main Grid */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Left: Tasks & Chat */}
          <div className="xl:col-span-2 space-y-6">
            {/* Active Tasks */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-violet-400" />
                  My Tasks
                </h3>
                <button className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
                  View All
                </button>
              </div>
              <div className="divide-y divide-white/5">
                {activeTasks.map((task) => (
                  <div key={task.id} className="px-5 py-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <StatusBadge status={task.status} />
                        <span className="text-sm font-medium text-white truncate">{task.task}</span>
                      </div>
                      <span className="text-xs text-stadium-500 shrink-0 ml-2">{task.id}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stadium-400 ml-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        {task.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        ETA: {task.eta}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        {task.assignee}
                      </div>
                      <StatusBadge status={task.priority} />
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
            {/* Shift Schedule */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                My Shift Schedule
              </h3>
              <div className="space-y-2">
                {shiftSchedule.map((shift) => (
                  <div key={shift.day} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{shift.day}</p>
                      <p className="text-xs text-stadium-400 truncate">{shift.shift}</p>
                      {shift.zone !== "—" && (
                        <p className="text-xs text-stadium-500">{shift.zone}</p>
                      )}
                    </div>
                    <StatusBadge status={shift.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Urgent Notifications */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber" />
                Live Notifications
              </h3>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      n.type === "urgent" ? "bg-rose animate-pulse" : "bg-stadium-400"
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm text-stadium-200">{n.message}</p>
                      <p className="text-xs text-stadium-500 mt-0.5">{n.time}</p>
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
                  { label: "Check In", icon: MapPin },
                  { label: "Report Issue", icon: AlertCircle },
                  { label: "Call Team", icon: Phone },
                  { label: "Chat", icon: MessageCircle },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-400/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <action.icon className="w-4 h-4 text-violet-400" />
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
