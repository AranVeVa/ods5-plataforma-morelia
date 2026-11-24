"use client";
import { useEffect, useRef } from "react";

type LoopCallback = (deltaMs: number, timestamp: number) => void;

/**
 * useGameLoop — requestAnimationFrame loop con delta-time.
 * Respeta prefers-reduced-motion: pausa automáticamente si el usuario lo prefiere.
 */
export function useGameLoop(callback: LoopCallback, active: boolean = true) {
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const callbackRef = useRef<LoopCallback>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastRef.current = null;
      }
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    lastRef.current = null;

    const loop = (timestamp: number) => {
      if (lastRef.current === null) lastRef.current = timestamp;
      const delta = Math.min(timestamp - lastRef.current, 100);
      lastRef.current = timestamp;
      callbackRef.current(delta, timestamp);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastRef.current = null;
      }
    };
  }, [active]);
}
