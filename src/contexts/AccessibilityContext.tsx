"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AccessibilitySettings {
  highContrast: boolean;
  largeFont: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  fontScale: number;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  toggleHighContrast: () => void;
  toggleLargeFont: () => void;
  toggleReducedMotion: () => void;
  toggleScreenReaderMode: () => void;
  setFontScale: (scale: number) => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeFont: false,
  reducedMotion: false,
  screenReaderMode: false,
  fontScale: 1,
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem("stadiummind-accessibility");
    if (saved) {
      try { setSettings(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("stadiummind-accessibility", JSON.stringify(settings));
    const root = document.documentElement;
    if (settings.highContrast) root.classList.add("high-contrast");
    else root.classList.remove("high-contrast");
    const scale = settings.largeFont ? 1.25 : settings.fontScale;
    root.style.fontSize = `${scale * 16}px`;
    if (settings.reducedMotion) root.classList.add("prefers-reduced-motion");
    else root.classList.remove("prefers-reduced-motion");
  }, [settings]);

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        toggleHighContrast: () => setSettings((s) => ({ ...s, highContrast: !s.highContrast })),
        toggleLargeFont: () => setSettings((s) => ({ ...s, largeFont: !s.largeFont })),
        toggleReducedMotion: () => setSettings((s) => ({ ...s, reducedMotion: !s.reducedMotion })),
        toggleScreenReaderMode: () => setSettings((s) => ({ ...s, screenReaderMode: !s.screenReaderMode })),
        setFontScale: (scale: number) => setSettings((s) => ({ ...s, fontScale: scale })),
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}
