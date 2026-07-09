"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility, Eye, Type, ZapOff, X } from "lucide-react";
import clsx from "clsx";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { settings, toggleHighContrast, toggleLargeFont, toggleReducedMotion } = useAccessibility();

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const toggles = [
    { label: "High Contrast", desc: "Increase text and border contrast", icon: Eye, active: settings.highContrast, toggle: toggleHighContrast },
    { label: "Large Font", desc: "Increase base font size", icon: Type, active: settings.largeFont, toggle: toggleLargeFont },
    { label: "Reduced Motion", desc: "Disable animations", icon: ZapOff, active: settings.reducedMotion, toggle: toggleReducedMotion },
  ];

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx("p-2 rounded-xl transition-all", isOpen ? "bg-gold-500/10 text-gold-400" : "text-stadium-400 hover:text-stadium-200 hover:bg-white/5")}
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
      >
        <Accessibility className="w-4.5 h-4.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-72 glass-strong rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-gold-400" />
                <h3 className="text-sm font-semibold text-white">Accessibility</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-stadium-400 hover:text-white transition-colors" aria-label="Close">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-3 space-y-1">
              {toggles.map((t) => {
                const Icon = t.icon;
                return (
                  <button key={t.label} onClick={t.toggle} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left" aria-pressed={t.active}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors", t.active ? "bg-gold-500/20 text-gold-400" : "bg-white/5 text-stadium-400")}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium">{t.label}</p>
                        <p className="text-[10px] text-stadium-500 truncate">{t.desc}</p>
                      </div>
                    </div>
                    <div className={clsx("w-10 h-5 rounded-full relative transition-colors shrink-0 ml-3", t.active ? "bg-gold-500" : "bg-white/10")}>
                      <div className={clsx("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", t.active ? "translate-x-[22px]" : "translate-x-0.5")} />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-2.5 border-t border-white/5">
              <p className="text-[10px] text-stadium-500 text-center">Settings are saved to your browser</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
