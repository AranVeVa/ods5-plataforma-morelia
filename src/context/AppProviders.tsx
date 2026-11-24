"use client";
import React, { useState, useCallback, useEffect, ReactNode } from "react";
import { SoundProvider } from "@/context/SoundContext";
import { ProgressProvider } from "@/context/ProgressContext";

interface AccessibilityState {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
}

const AccessibilityContext = React.createContext<AccessibilityState | null>(null);
const A11Y_STORAGE_KEY = "ods5-a11y";

function saveA11yPrefs(prefs: { largeText: boolean; highContrast: boolean; reducedMotion: boolean }) {
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignorar en entornos sin almacenamiento disponible
  }
}

function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  // Detectar preferencias guardadas localmente o del sistema operativo al montar (compatible con SSR)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const contrastQuery = window.matchMedia("(prefers-contrast: more)");

    const syncPreferences = () => {
      let nextLarge = false;
      let nextContrast = contrastQuery.matches;
      let nextMotion = motionQuery.matches;

      try {
        const raw = localStorage.getItem(A11Y_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<{
            largeText: boolean;
            highContrast: boolean;
            reducedMotion: boolean;
          }>;
          if (typeof parsed.largeText === "boolean") nextLarge = parsed.largeText;
          if (typeof parsed.highContrast === "boolean") nextContrast = parsed.highContrast;
          if (typeof parsed.reducedMotion === "boolean") nextMotion = parsed.reducedMotion;
        }
      } catch {
        // Ignorar datos inválidos
      }

      setLargeText(nextLarge);
      setHighContrast(nextContrast);
      setReducedMotion(nextMotion);
      document.documentElement.classList.toggle("large-text", nextLarge);
      document.documentElement.classList.toggle("high-contrast", nextContrast);
      document.documentElement.classList.toggle("reduce-motion", nextMotion);
    };

    const timer = window.setTimeout(syncPreferences, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleLargeText = useCallback(() => {
    setLargeText((v) => {
      const next = !v;
      document.documentElement.classList.toggle("large-text", next);
      saveA11yPrefs({ largeText: next, highContrast, reducedMotion });
      setLiveAnnouncement(next ? "Texto grande activado" : "Texto grande desactivado");
      return next;
    });
  }, [highContrast, reducedMotion]);

  const toggleHighContrast = useCallback(() => {
    setHighContrast((v) => {
      const next = !v;
      document.documentElement.classList.toggle("high-contrast", next);
      saveA11yPrefs({ largeText, highContrast: next, reducedMotion });
      setLiveAnnouncement(next ? "Modo alto contraste activado" : "Modo alto contraste desactivado");
      return next;
    });
  }, [largeText, reducedMotion]);

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion((v) => {
      const next = !v;
      document.documentElement.classList.toggle("reduce-motion", next);
      saveA11yPrefs({ largeText, highContrast, reducedMotion: next });
      setLiveAnnouncement(next ? "Movimiento reducido activado" : "Movimiento reducido desactivado");
      return next;
    });
  }, [largeText, highContrast]);

  return (
    <AccessibilityContext.Provider
      value={{
        largeText,
        highContrast,
        reducedMotion,
        toggleLargeText,
        toggleHighContrast,
        toggleReducedMotion,
      }}
    >
      {children}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = React.useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility fuera de AppProviders");
  return ctx;
}

/** Wrapper que provee todos los contextos globales de la app */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SoundProvider>
      <ProgressProvider>
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </ProgressProvider>
    </SoundProvider>
  );
}
