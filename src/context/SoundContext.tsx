"use client";
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from "react";
import { sound } from "@/utils/audio";

interface SoundContextValue {
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  playClick: () => void;
  playCorrect: () => void;
  playAlert: () => void;
  playCelebration: () => void;
  playFlip: () => void;
  playBounce: (pitch?: number) => void;
  playBrickHit: () => void;
  playShield: () => void;
  playPowerup: () => void;
  playCountdown: (isFinal?: boolean) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  // Inicializar de forma idéntica en SSR y CSR para evitar hydration mismatch
  const [isMuted, setIsMutedState] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem("ods5-muted") === "true";
        sound.setMuted(saved);
        setIsMutedState(saved);
      } catch {
        // Ignorar errores de almacenamiento en navegación restringida
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const toggleMute = useCallback(() => {
    const next = sound.toggleMute();
    setIsMutedState(next);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ods5-muted", String(next));
      } catch {
        // Ignorar si almacenamiento está bloqueado
      }
    }
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    sound.setMuted(muted);
    setIsMutedState(muted);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ods5-muted", String(muted));
      } catch {
        // Ignorar
      }
    }
  }, []);

  const playClick = useCallback(() => sound.playClick(), []);
  const playCorrect = useCallback(() => sound.playCorrect(), []);
  const playAlert = useCallback(() => sound.playAlert(), []);
  const playCelebration = useCallback(() => sound.playCelebration(), []);
  const playFlip = useCallback(() => sound.playFlip(), []);
  const playBounce = useCallback((pitch?: number) => sound.playBounce(pitch), []);
  const playBrickHit = useCallback(() => sound.playBrickHit(), []);
  const playShield = useCallback(() => sound.playShield(), []);
  const playPowerup = useCallback(() => sound.playPowerup(), []);
  const playCountdown = useCallback((isFinal?: boolean) => sound.playCountdown(isFinal), []);

  const value = useMemo<SoundContextValue>(
    () => ({
      isMuted,
      toggleMute,
      setMuted,
      playClick,
      playCorrect,
      playAlert,
      playCelebration,
      playFlip,
      playBounce,
      playBrickHit,
      playShield,
      playPowerup,
      playCountdown,
    }),
    [
      isMuted,
      toggleMute,
      setMuted,
      playClick,
      playCorrect,
      playAlert,
      playCelebration,
      playFlip,
      playBounce,
      playBrickHit,
      playShield,
      playPowerup,
      playCountdown,
    ]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound debe usarse dentro de SoundProvider");
  return ctx;
}
