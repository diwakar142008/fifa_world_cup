"use client";

import { useState } from "react";
import {
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  Brain,
} from "lucide-react";
import clsx from "clsx";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  role: string;
  roleGradient?: string;
}

export default function DashboardHeader({
  title,
  subtitle,
  role,
  roleGradient = "from-stadium-400 to-stadium-600",
}: DashboardHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const notifications = [
    { id: 1, text: "Gate C congestion predicted in 12 min", time: "2m ago", type: "warning" },
    { id: 2, text: "Medical team dispatched to Section 210", time: "5m ago", type: "info" },
    { id: 3, text: "Metro Line 2 delayed by 8 minutes", time: "10m ago", type: "alert" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left: Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-stadium-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Role badge */}
          <div className={clsx("hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r text-white text-xs font-semibold", roleGradient)}>
            <Brain className="w-3.5 h-3.5" />
            {role}
          </div>

          {/* Search */}
          <button
            className="p-2 rounded-xl hover:bg-white/5 text-stadium-400 hover:text-stadium-200 transition-all"
            aria-label="Search"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl hover:bg-white/5 text-stadium-400 hover:text-stadium-200 transition-all"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
              className="p-2 rounded-xl hover:bg-white/5 text-stadium-400 hover:text-stadium-200 transition-all relative"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose animate-pulse" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className={clsx(
                          "w-2 h-2 rounded-full mt-1.5 shrink-0",
                          n.type === "warning" && "bg-amber",
                          n.type === "info" && "bg-stadium-400",
                          n.type === "alert" && "bg-rose"
                        )} />
                        <div className="min-w-0">
                          <p className="text-sm text-stadium-200">{n.text}</p>
                          <p className="text-xs text-stadium-500 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-white/5 text-center">
                  <button className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-stadium-400 to-stadium-600 flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Profile menu"
              aria-expanded={profileOpen}
            >
              <User className="w-4 h-4 text-white" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-medium text-white">Alex Morgan</p>
                  <p className="text-xs text-stadium-400">Operations Manager</p>
                </div>
                <div className="py-1">
                  {[
                    { label: "Profile", icon: User },
                    { label: "Settings", icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stadium-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose hover:text-rose/80 hover:bg-white/5 transition-colors border-t border-white/5 mt-1">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
