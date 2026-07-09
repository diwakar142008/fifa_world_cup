"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export default function CountdownTimer() {
  const targetDate = useMemo(() => new Date("2026-06-11T20:00:00-04:00"), []);
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="flex items-center gap-2 text-stadium-400 text-xs uppercase tracking-[0.2em]">
        <Trophy className="w-3.5 h-3.5 text-gold-400" />
        <span>Kickoff In</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center">
              <div className="glass-strong rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[52px] sm:min-w-[68px] text-center">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-mono tabular-nums">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-stadium-500 mt-1.5 uppercase tracking-wider">
                {unit.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="text-stadium-600 text-lg sm:text-xl font-bold mb-4">:</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function calculateTimeLeft(target: Date) {
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
