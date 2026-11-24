"use client";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * useReducedMotion — detecta prefers-reduced-motion del sistema de forma compatible con SSR y React 19.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
