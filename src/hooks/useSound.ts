"use client";

import { useSound as useSoundContext } from "@/context/SoundContext";

/**
 * useSound — Hook personalizado para acceder al sintetizador Web Audio API
 * y al estado global de silencio sin dependencias externas.
 */
export function useSound() {
  return useSoundContext();
}
