"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Globe, Shield, Palette } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import clsx from "clsx";

const settingSections = [
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    desc: "Configure alerts for crowd levels, incidents, and system updates",
    toggles: [
      { label: "Crowd Alerts", defaultOn: true },
      { label: "Incident Reports", defaultOn: true },
      { label: "System Updates", defaultOn: false },
      { label: "Email Digest", defaultOn: true },
    ],
  },
  {
    id: "language",
    label: "Language & Region",
    icon: Globe,
    desc: "Set your preferred language, timezone, and measurement units",
    selects: [
      {
        label: "Language",
        options: ["English", "Spanish", "French", "Arabic", "Mandarin"],
        value: "English",
      },
      {
        label: "Timezone",
        options: [
          "UTC-5 (EST)",
          "UTC+0 (GMT)",
          "UTC+1 (CET)",
          "UTC+5:30 (IST)",
        ],
        value: "UTC-5 (EST)",
      },
      {
        label: "Temperature",
        options: ["Celsius", "Fahrenheit"],
        value: "Celsius",
      },
    ],
  },
  {
    id: "security",
    label: "Security & Access",
    icon: Shield,
    desc: "Manage dashboard access, sessions, and authentication",
    toggles: [
      { label: "Two-Factor Auth", defaultOn: false },
      { label: "Session Timeout", defaultOn: true },
    ],
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    desc: "Customize the dashboard theme and display preferences",
    toggles: [
      { label: "Compact Mode", defaultOn: false },
      { label: "Show Animations", defaultOn: true },
      { label: "High Contrast", defaultOn: false },
    ],
  },
];

function ToggleSwitch({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={clsx(
        "w-10 h-5 rounded-full relative transition-colors shrink-0",
        on ? "bg-gold-500" : "bg-white/10",
      )}
      role="switch"
      aria-checked={on}
    >
      <div
        className={clsx(
          "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader
        title="Settings"
        subtitle="Configure your dashboard preferences"
        role="Organizer"
      />
      <div className="p-4 md:p-6 space-y-6 max-w-3xl">
        {settingSections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stadium-500/20 to-gold-500/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {section.label}
                  </h3>
                  <p className="text-xs text-stadium-400">{section.desc}</p>
                </div>
              </div>
              <div className="px-5 py-4 space-y-4">
                {section.toggles?.map((toggle) => (
                  <div
                    key={toggle.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-stadium-200">
                      {toggle.label}
                    </span>
                    <ToggleSwitch defaultOn={toggle.defaultOn} />
                  </div>
                ))}
                {section.selects?.map((select) => (
                  <div
                    key={select.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-stadium-200">
                      {select.label}
                    </span>
                    <select className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-stadium-200 focus:outline-none focus:border-gold-500/50">
                      {select.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
