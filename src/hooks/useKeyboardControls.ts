"use client";
import { useEffect, useCallback, useRef } from "react";

type KeyMap = Record<string, () => void>;

/**
 * useKeyboardControls — gestiona eventos de teclado para juegos.
 */
export function useKeyboardControls(keyMap: KeyMap, active: boolean = true) {
  const keyMapRef = useRef<KeyMap>(keyMap);

  useEffect(() => {
    keyMapRef.current = keyMap;
  }, [keyMap]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!active) return;
      const handler = keyMapRef.current[e.key] || keyMapRef.current[e.code];
      if (handler) {
        e.preventDefault();
        handler();
      }
    },
    [active]
  );

  useEffect(() => {
    if (!active) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, handleKeyDown]);
}
