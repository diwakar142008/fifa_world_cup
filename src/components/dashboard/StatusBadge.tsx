"use client";

import clsx from "clsx";

type StatusType =
  | "active" | "cleared" | "pending" | "critical"
  | "low" | "medium" | "high"
  | "online" | "offline" | "warning" | "secure" | "good" | "moderate"
  | "success" | "error" | "info";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { dot: string; bg: string; text: string; defaultLabel: string }> = {
  active:    { dot: "bg-emerald",   bg: "bg-emerald/10",   text: "text-emerald",   defaultLabel: "Active" },
  cleared:   { dot: "bg-stadium-400", bg: "bg-stadium-500/10", text: "text-stadium-300", defaultLabel: "Cleared" },
  pending:   { dot: "bg-amber",     bg: "bg-amber/10",     text: "text-amber",     defaultLabel: "Pending" },
  critical:  { dot: "bg-rose",      bg: "bg-rose/10",      text: "text-rose",      defaultLabel: "Critical" },
  low:       { dot: "bg-emerald",   bg: "bg-emerald/10",   text: "text-emerald",   defaultLabel: "Low" },
  medium:    { dot: "bg-amber",     bg: "bg-amber/10",     text: "text-amber",     defaultLabel: "Medium" },
  high:      { dot: "bg-rose",      bg: "bg-rose/10",      text: "text-rose",      defaultLabel: "High" },
  online:    { dot: "bg-emerald",   bg: "bg-emerald/10",   text: "text-emerald",   defaultLabel: "Online" },
  offline:   { dot: "bg-stadium-500", bg: "bg-stadium-500/10", text: "text-stadium-400", defaultLabel: "Offline" },
  warning:   { dot: "bg-amber",     bg: "bg-amber/10",     text: "text-amber",     defaultLabel: "Warning" },
  success:   { dot: "bg-emerald",   bg: "bg-emerald/10",   text: "text-emerald",   defaultLabel: "Success" },
  error:     { dot: "bg-rose",      bg: "bg-rose/10",      text: "text-rose",      defaultLabel: "Error" },
  secure:    { dot: "bg-emerald",   bg: "bg-emerald/10",   text: "text-emerald",   defaultLabel: "Secure" },
  good:      { dot: "bg-emerald",   bg: "bg-emerald/10",   text: "text-emerald",   defaultLabel: "Good" },
  moderate:  { dot: "bg-amber",     bg: "bg-amber/10",     text: "text-amber",     defaultLabel: "Moderate" },
  info:      { dot: "bg-stadium-400", bg: "bg-stadium-500/10", text: "text-stadium-300", defaultLabel: "Info" },
};

export default function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full", config.dot)} aria-hidden="true" />
      {label || config.defaultLabel}
    </span>
  );
}
