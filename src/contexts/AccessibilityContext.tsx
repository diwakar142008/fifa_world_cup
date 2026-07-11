"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────

type FontSize = "normal" | "large" | "x-large";
type Contrast = "normal" | "high";
type ReducedMotion = "auto" | "reduced";

interface AccessibilityState {
  fontSize: FontSize;
  highContrast: Contrast;
  reducedMotion: ReducedMotion;
  screenReaderMode: boolean;
  keyboardMode: boolean;
  dyslexiaFriendly: boolean;
}

interface AccessibilityContextType extends AccessibilityState {
  setFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleScreenReaderMode: () => void;
  toggleDyslexiaFriendly: () => void;
  resetAccessibility: () => void;
}

// ─── Context ──────────────────────────────────────────────────

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = "stadiummind-a11y";

function loadSettings(): AccessibilityState {
  if (typeof window === "undefined") {
    return {
      fontSize: "normal",
      highContrast: "normal",
      reducedMotion: "auto",
      screenReaderMode: false,
      keyboardMode: false,
      dyslexiaFriendly: false,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...getDefaultState(), ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }

  // Check system preferences
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersHighContrast = window.matchMedia("(prefers-contrast: high)").matches;

  return {
    ...getDefaultState(),
    reducedMotion: prefersReducedMotion ? "reduced" : "auto",
    highContrast: prefersHighContrast ? "high" : "normal",
  };
}

function getDefaultState(): AccessibilityState {
  return {
    fontSize: "normal",
    highContrast: "normal",
    reducedMotion: "auto",
    screenReaderMode: false,
    keyboardMode: false,
    dyslexiaFriendly: false,
  };
}

// ─── Provider ─────────────────────────────────────────────────

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccessibilityState>(loadSettings);

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  // Apply CSS classes to document
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.classList.remove("text-normal", "text-large", "text-x-large");
    root.classList.add(`text-${state.fontSize}`);

    // High contrast
    root.classList.toggle("high-contrast", state.highContrast === "high");

    // Reduced motion
    root.classList.toggle("reduce-motion", state.reducedMotion === "reduced");

    // Dyslexia friendly
    root.classList.toggle("dyslexia-friendly", state.dyslexiaFriendly);

    // Screen reader mode
    if (state.screenReaderMode) {
      root.setAttribute("aria-live", "polite");
    } else {
      root.removeAttribute("aria-live");
    }
  }, [state]);

  // Track keyboard usage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setState((prev) => ({ ...prev, keyboardMode: true }));
        document.documentElement.classList.add("keyboard-mode");
      }
    };

    const handleMouseDown = () => {
      setState((prev) => ({ ...prev, keyboardMode: false }));
      document.documentElement.classList.remove("keyboard-mode");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const setFontSize = useCallback((fontSize: FontSize) => {
    setState((prev) => ({ ...prev, fontSize }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setState((prev) => ({
      ...prev,
      highContrast: prev.highContrast === "high" ? "normal" : "high",
    }));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      reducedMotion: prev.reducedMotion === "reduced" ? "auto" : "reduced",
    }));
  }, []);

  const toggleScreenReaderMode = useCallback(() => {
    setState((prev) => ({ ...prev, screenReaderMode: !prev.screenReaderMode }));
  }, []);

  const toggleDyslexiaFriendly = useCallback(() => {
    setState((prev) => ({ ...prev, dyslexiaFriendly: !prev.dyslexiaFriendly }));
  }, []);

  const resetAccessibility = useCallback(() => {
    setState(getDefaultState());
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        ...state,
        setFontSize,
        toggleHighContrast,
        toggleReducedMotion,
        toggleScreenReaderMode,
        toggleDyslexiaFriendly,
        resetAccessibility,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────

export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
