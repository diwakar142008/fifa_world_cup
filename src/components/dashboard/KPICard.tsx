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
  gradient = "from-stadium-500/20 to-gold-500/10",
  className,
}: KPICardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

  return (
    <div className={clsx("glass rounded-2xl p-5 group hover:bg-white/[0.05] transition-all duration-300", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className={clsx("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300", gradient)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {TrendIcon && (
          <div className={clsx(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend === "up" && "text-emerald bg-emerald/10",
            trend === "down" && "text-rose bg-rose/10"
          )}>
            <TrendIcon className="w-3 h-3" />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-sm text-stadium-400">{title}</div>
      {subtitle && (
        <div className="text-xs text-stadium-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
}
