"use client";

import React from "react";
import { GameId } from "@/context/ProgressContext";

interface GameIllustrationProps {
  gameId: GameId;
  className?: string;
}

/**
 * Ilustraciones SVG propias y ligeras para cada uno de los 8 juegos.
 * Reemplazan emojis como arte principal para dar identidad visual profesional.
 */
export default function GameIllustration({ gameId, className = "w-16 h-16" }: GameIllustrationProps) {
  switch (gameId) {
    case "semaforo":
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="22" y="8" width="36" height="64" rx="12" fill="#1e293b" />
          <rect x="25" y="11" width="30" height="58" rx="9" fill="#334155" />
          <circle cx="40" cy="23" r="8" fill="#ef4444" />
          <circle cx="38" cy="21" r="2.5" fill="#fecaca" />
          <circle cx="40" cy="40" r="8" fill="#eab308" />
          <circle cx="38" cy="38" r="2.5" fill="#fef08a" />
          <circle cx="40" cy="57" r="8" fill="#22c55e" />
          <circle cx="38" cy="55" r="2.5" fill="#bbf7d0" />
        </svg>
      );
    case "balanza":
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="37" y="18" width="6" height="48" rx="3" fill="#0284c7" />
          <rect x="22" y="64" width="36" height="7" rx="3.5" fill="#0369a1" />
          <path d="M 14 26 L 66 22" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
          <circle cx="40" cy="24" r="5" fill="#fbbf24" />
          <path d="M 14 26 L 8 44 L 22 44 Z" fill="none" stroke="#64748b" strokeWidth="2" />
          <path d="M 6 44 Q 15 52 24 44 Z" fill="#22c55e" />
          <path d="M 66 22 L 58 40 L 72 40 Z" fill="none" stroke="#64748b" strokeWidth="2" />
          <path d="M 56 40 Q 65 48 74 40 Z" fill="#3b82f6" />
        </svg>
      );
    case "memorama":
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="10" y="16" width="34" height="46" rx="6" fill="#a855f7" transform="rotate(-8 27 39)" />
          <rect x="34" y="16" width="34" height="46" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="3" transform="rotate(6 51 39)" />
          <circle cx="51" cy="34" r="8" fill="#ec4899" />
          <path d="M 41 52 Q 51 43 61 52" fill="#8b5cf6" />
          <path d="M 22 36 L 26 42 L 30 34" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "muro":
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="8" y="12" width="20" height="10" rx="3" fill="#ef4444" />
          <rect x="30" y="12" width="20" height="10" rx="3" fill="#f97316" />
          <rect x="52" y="12" width="20" height="10" rx="3" fill="#eab308" />
          <rect x="8" y="25" width="20" height="10" rx="3" fill="#3b82f6" />
          <rect x="52" y="25" width="20" height="10" rx="3" fill="#14b8a6" />
          <circle cx="40" cy="44" r="6" fill="#f43f5e" />
          <rect x="20" y="62" width="40" height="8" rx="4" fill="#1e40af" />
        </svg>
      );
    case "escudo":
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <path
            d="M 40 10 L 66 20 V 40 C 66 56 54 66 40 72 C 26 66 14 56 14 40 V 20 Z"
            fill="#0ea5e9"
            stroke="#0369a1"
            strokeWidth="3"
          />
          <path
            d="M 40 18 L 58 25 V 40 C 58 51 49 59 40 64 C 31 59 22 51 22 40 V 25 Z"
            fill="#38bdf8"
          />
          <path
            d="M 40 48 C 30 41 28 32 34 28 C 37 26 40 30 40 30 C 40 30 43 26 46 28 C 52 32 50 41 40 48 Z"
            fill="#fef08a"
          />
        </svg>
      );
    case "valor":
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="12" y="44" width="12" height="24" rx="3" fill="#14b8a6" />
          <rect x="30" y="30" width="12" height="38" rx="3" fill="#0d9488" />
          <rect x="48" y="18" width="12" height="50" rx="3" fill="#f97316" />
          <circle cx="58" cy="22" r="11" fill="#fde047" stroke="#ca8a04" strokeWidth="2.5" />
          <text x="58" y="26" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#854d0e">$</text>
        </svg>
      );
    case "salario":
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <polygon points="40,12 12,64 68,64" fill="#ede9fe" stroke="#7c3aed" strokeWidth="3" />
          <line x1="25" y1="38" x2="55" y2="38" stroke="#c026d3" strokeWidth="3" strokeDasharray="4 2" />
          <rect x="30" y="48" width="20" height="4" rx="2" fill="#7c3aed" />
          <rect x="30" y="55" width="20" height="4" rx="2" fill="#7c3aed" />
        </svg>
      );
    case "circulo":
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <circle cx="40" cy="40" r="28" fill="#fae8ff" stroke="#a855f7" strokeWidth="3" strokeDasharray="6 4" />
          <circle cx="40" cy="24" r="8" fill="#8b5cf6" />
          <circle cx="24" cy="48" r="8" fill="#ec4899" />
          <circle cx="56" cy="48" r="8" fill="#6366f1" />
          <path d="M 30 44 L 37 31 M 50 44 L 43 31 M 32 48 H 48" stroke="#7c3aed" strokeWidth="2.5" />
        </svg>
      );
  }
}
