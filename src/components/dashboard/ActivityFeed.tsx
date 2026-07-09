"use client";

import { useState } from "react";
import {
  Users,
  AlertTriangle,
  Heart,
  Navigation,
  Bell,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import StatusBadge from "./StatusBadge";

interface Activity {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  status: "active" | "cleared" | "pending" | "critical";
  type: "incident" | "alert" | "update" | "resolution";
}

const initialActivities: Activity[] = [
  {
    id: "1",
    icon: Users,
    title: "Gate B congestion rising",
    description: "Crowd density at Gate B reached 65%. Predicted to exceed 80% in 15 minutes.",
    time: "2 min ago",
    status: "active",
    type: "alert",
  },
  {
    id: "2",
    icon: Heart,
    title: "Medical dispatched — Section 304",
    description: "Fan feeling faint. EMT team en route, ETA 2 minutes.",
    time: "5 min ago",
    status: "pending",
    type: "incident",
  },
  {
    id: "3",
    icon: CheckCircle,
    title: "Lost child reunited",
    description: "Child found at Gate A reunited with family at information desk.",
    time: "8 min ago",
    status: "cleared",
    type: "resolution",
  },
  {
    id: "4",
    icon: Navigation,
    title: "Food Court 4 approaching capacity",
    description: "AI recommends opening Food Court 6 and redirecting fans.",
    time: "12 min ago",
    status: "active",
    type: "alert",
  },
  {
    id: "5",
    icon: AlertTriangle,
    title: "Metro Line 2 delay",
    description: "8-minute delay due to signal maintenance. Rerouting via Line 3.",
    time: "15 min ago",
    status: "active",
    type: "incident",
  },
  {
    id: "6",
    icon: CheckCircle,
    title: "Spill cleaned — Corridor 2A",
    description: " cleaning crew completed cleanup. Corridor reopened.",
    time: "20 min ago",
    status: "cleared",
    type: "resolution",
  },
];

const typeStyles: Record<string, string> = {
  incident: "border-l-rose",
  alert: "border-l-amber",
  update: "border-l-stadium-400",
  resolution: "border-l-emerald",
};

export default function ActivityFeed() {
  const [filter, setFilter] = useState<"all" | "active" | "cleared">("all");

  const filtered = filter === "all"
    ? initialActivities
    : initialActivities.filter((a) => a.status === filter);

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-stadium-400" />
          Activity Feed
        </h3>
        <div className="flex gap-1">
          {(["all", "active", "cleared"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                filter === f
                  ? "bg-gold-500/10 text-gold-400"
                  : "text-stadium-500 hover:text-stadium-300"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-8 h-8 text-emerald/50 mx-auto mb-2" />
            <p className="text-sm text-stadium-500">No {filter} activities</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className={clsx(
                    "px-4 py-3 hover:bg-white/5 transition-colors border-l-2",
                    typeStyles[activity.type]
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-stadium-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-medium text-white truncate">
                          {activity.title}
                        </h4>
                        <StatusBadge status={activity.status} />
                      </div>
                      <p className="text-xs text-stadium-400 line-clamp-2">
                        {activity.description}
                      </p>
                      <p className="text-[10px] text-stadium-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
