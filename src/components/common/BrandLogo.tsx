"use client";

import React from "react";

interface BrandLogoProps {
  size?: number;
  showText?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * BrandLogo — Emblema SVG oficial de la Plataforma Educativa ODS 5 Morelia.
 * Combina tres símbolos:
 * 1. Escudo de ciberseguridad y Privacy by Design.
 * 2. Signo de igualdad (=) en el núcleo (ODS 5 · Equidad de Género).
 * 3. Brote/ala estilizada en degradado tricromático (los 3 mundos: Infantil, Intermedio, Juvenil).
 */
export default function BrandLogo({
  size = 42,
  showText = true,
  compact = false,
  className = "",
}: BrandLogoProps) {
  const gradId = React.useId();

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {/* Base redondeada estilo insignia */}
        <rect x="3" y="3" width="58" height="58" rx="18" fill={`url(#${gradId})`} />
        <rect
          x="4.5"
          y="4.5"
          width="55"
          height="55"
          rx="16.5"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />

        {/* Escudo de privacidad por diseño */}
        <path
          d="M32 12L49 18.5V31.5C49 42.3 41.6 50.6 32 53.5C22.4 50.6 15 42.3 15 31.5V18.5L32 12Z"
          fill="rgba(255,255,255,0.16)"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />

        {/* Signo de Igualdad (ODS 5) */}
        <rect x="23" y="25.5" width="18" height="4.5" rx="2.25" fill="#ffffff" />
        <rect x="23" y="34" width="18" height="4.5" rx="2.25" fill="#fde047" />

        {/* Destello superior (esperanza y Morelia) */}
        <circle cx="48" cy="15" r="3.5" fill="#fde047" />
      </svg>

      {showText && (
        <div className="leading-tight text-left">
          <span className="font-display font-black text-sm sm:text-base text-slate-900 block tracking-tight">
            ODS 5 · Morelia
          </span>
          {!compact && (
            <span className="text-[11px] font-bold text-slate-600 hidden sm:block">
              Igualdad y Privacidad Segura
            </span>
          )}
        </div>
      )}
    </div>
  );
}
