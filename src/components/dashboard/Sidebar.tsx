"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  Users,
  LayoutDashboard,
  ShieldAlert,
  Heart,
  Warehouse,
  Handshake,
  Trash2,
  Bus,
  Map,
  Settings,
  FlaskConical,
  Activity,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";

// ─── Role Configuration ────────────────────────────────────────

export interface RoleConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
}

const roles: RoleConfig[] = [
  { id: "organizer", label: "Organizer", icon: LayoutDashboard, href: "/dashboard/organizer", gradient: "from-stadium-400 to-stadium-600" },
  { id: "fan", label: "Fan", icon: Users, href: "/dashboard/fan", gradient: "from-gold-400 to-gold-600" },
  { id: "security", label: "Security", icon: ShieldAlert, href: "/dashboard/security", gradient: "from-rose-500 to-red-500" },
  { id: "medical", label: "Medical", icon: Heart, href: "/dashboard/medical", gradient: "from-emerald-500 to-teal-500" },
  { id: "volunteer", label: "Volunteer", icon: Handshake, href: "/dashboard/volunteer", gradient: "from-violet-400 to-violet-600" },
  { id: "vendor", label: "Vendor", icon: Warehouse, href: "/dashboard/vendor", gradient: "from-amber-400 to-orange-500" },
  { id: "cleaning", label: "Cleaning", icon: Trash2, href: "/dashboard/cleaning", gradient: "from-cyan-400 to-cyan-600" },
  { id: "transport", label: "Transport", icon: Bus, href: "/dashboard/transport", gradient: "from-blue-400 to-blue-600" },
];

// ─── Sidebar Nav Item ──────────────────────────────────────────

function NavItem({
  icon: Icon,
  label,
  href,
  isActive,
  collapsed,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "relative flex items-center gap-3 rounded-lg transition-colors duration-200 group",
        collapsed ? "justify-center p-3" : "px-3 py-2.5",
        isActive
          ? "bg-gold-500/10 text-gold-300"
          : "text-stadium-400 hover:text-stadium-100 hover:bg-white/5"
      )}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <span
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-gold-400"
          aria-hidden="true"
        />
      )}
      <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
      {!collapsed && (
        <span className="text-sm font-medium truncate">{label}</span>
      )}
    </Link>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "flex flex-col bg-ink/95 border-r border-line h-screen sticky top-0 transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
      aria-label="Dashboard navigation"
    >
      {/* Logo */}
      <div className={clsx("flex items-center border-b border-line", collapsed ? "justify-center p-3" : "px-4 py-4")}>
        <Link href="/dashboard" className="flex items-center gap-3 group" aria-label="Dashboard home">
          <div className="w-9 h-9 rounded-md bg-gold-500 flex items-center justify-center shrink-0 ring-1 ring-gold-200/40">
            <Brain className="w-5 h-5 text-ink" />
          </div>
          {!collapsed && (
            <div>
              <span className="block font-display text-xl font-semibold uppercase tracking-[0.06em] leading-none text-white">
                Stadium<span className="text-gold-400">Mind</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-stadium-400 font-medium mt-1">
                Operations AI
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Role Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto" aria-label="Role dashboards">
        {!collapsed && (
          <p className="eyebrow px-3 pb-2 !text-stadium-500">Role views</p>
        )}
        {roles.map((role) => (
          <NavItem
            key={role.id}
            icon={role.icon}
            label={role.label}
            href={role.href}
            isActive={pathname === role.href}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-2 py-3 border-t border-line space-y-1">
        <NavItem
          icon={Activity}
          label="AI Operations"
          href="/dashboard/operations"
          isActive={pathname === "/dashboard/operations"}
          collapsed={collapsed}
        />
        <NavItem
          icon={Map}
          label="Stadium Map"
          href="/dashboard/map"
          isActive={pathname === "/dashboard/map"}
          collapsed={collapsed}
        />
        <NavItem
          icon={FlaskConical}
          label="Simulation"
          href="/dashboard/simulation"
          isActive={pathname === "/dashboard/simulation"}
          collapsed={collapsed}
        />
        <NavItem
          icon={Settings}
          label="Settings"
          href="/dashboard/settings"
          isActive={pathname === "/dashboard/settings"}
          collapsed={collapsed}
        />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "flex items-center gap-3 w-full rounded-lg transition-colors duration-200 text-stadium-500 hover:text-stadium-100 hover:bg-white/5",
            collapsed ? "justify-center p-3" : "px-3 py-2.5"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
