"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface Stat {
  value: number;
  suffix?: string;
  label: string;
  icon: LucideIcon;
}

interface AnimatedStatsProps {
  stats: Stat[];
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-white tabular-nums">
      {display.toLocaleString()}{suffix}
    </div>
  );
}

export default function AnimatedStats({ stats }: AnimatedStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center group"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-stadium-500/20 to-gold-500/10 mb-4 group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-6 h-6 text-gold-400" />
            </div>
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            <p className="text-sm text-stadium-400 mt-1">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
