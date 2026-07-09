"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio, TrendingUp, Users, Zap } from "lucide-react";

export default function LiveMatchWidget() {
  const [minute, setMinute] = useState(52);
  const [possession, setPossession] = useState({ home: 58, away: 42 });
  const [crowdEnergy, setCrowdEnergy] = useState(94);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinute((m) => (m >= 90 ? 90 : m + 1));
      setPossession((p) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const newHome = Math.max(40, Math.min(65, p.home + delta));
        return { home: newHome, away: 100 - newHome };
      });
      setCrowdEnergy((e) => Math.max(80, Math.min(100, e + (Math.random() > 0.5 ? 1 : -1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="glass rounded-3xl p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose" />
          </span>
          <span className="text-xs font-semibold text-rose uppercase tracking-wider">Live</span>
        </div>
        <div className="flex items-center gap-2 text-stadium-400 text-xs">
          <Radio className="w-3.5 h-3.5" />
          <span>Quarter-Final</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">BRA</span>
          </div>
          <div className="text-right"><p className="text-xs text-stadium-400">Brazil</p></div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-4xl md:text-5xl font-bold text-white tabular-nums">1</span>
          <div className="flex flex-col items-center">
            <span className="text-stadium-600 text-xl font-light">&mdash;</span>
            <span className="text-xs text-stadium-500 font-mono mt-0.5">{minute}&apos;</span>
          </div>
          <span className="text-4xl md:text-5xl font-bold text-white tabular-nums">0</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left"><p className="text-xs text-stadium-400">Argentina</p></div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">ARG</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-emerald font-medium">{possession.home}%</span>
            <span className="text-stadium-500">Possession</span>
            <span className="text-sky-400 font-medium">{possession.away}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden flex">
            <div className="h-full bg-emerald rounded-l-full transition-all duration-1000" style={{ width: `${possession.home}%` }} />
            <div className="h-full bg-sky-400 rounded-r-full transition-all duration-1000" style={{ width: `${possession.away}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { label: "Shots", home: "8", away: "5", icon: Zap },
            { label: "xG", home: "1.2", away: "0.6", icon: TrendingUp },
            { label: "Crowd", home: `${crowdEnergy}%`, away: "", icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-2 rounded-lg bg-white/5">
              <stat.icon className="w-3 h-3 text-stadium-500 mx-auto mb-1" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald font-mono">{stat.home}</span>
                <span className="text-[10px] text-stadium-500">{stat.label}</span>
                <span className="text-xs text-sky-400 font-mono">{stat.away}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-gold rounded-xl p-3 flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
        <p className="text-xs text-stadium-300 leading-relaxed">
          <span className="text-gold-400 font-medium">AI Commentary:</span> Brazil dominating possession. Argentina dangerous on counter. Crowd energy at <span className="text-gold-400 font-medium">{crowdEnergy}%</span> -- electric at MetLife!
        </p>
      </div>
    </motion.div>
  );
}
