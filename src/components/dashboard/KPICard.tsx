"use client";

import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  gradient?: string;
  className?: string;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  gradient = "from-stadium-600 to-stadium-700",
  className,
}: KPICardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

  return (
    <div
      className={clsx(
        "glass rounded-xl p-5 group relative overflow-hidden transition-colors duration-200 hover:border-stadium-600",
        className
      )}
    >
      {/* Scoreboard-style accent rule */}
      <span
        className={clsx("absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r", gradient)}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-3 mb-4">
        <p className="eyebrow !text-stadium-400 !tracking-[0.14em]">{title}</p>
        <div
          className={clsx(
            "w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0",
            gradient
          )}
        >
          <Icon className="w-[18px] h-[18px] text-white" aria-hidden="true" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="num text-3xl font-medium text-white leading-none">{value}</div>
        {TrendIcon && (
          <div
            className={clsx(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md num",
              trend === "up" && "text-emerald bg-emerald/10",
              trend === "down" && "text-rose bg-rose/10"
            )}
          >
            <TrendIcon className="w-3 h-3" aria-hidden="true" />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>

      {subtitle && <div className="text-xs text-stadium-400 mt-3">{subtitle}</div>}
    </div>
  );
}
