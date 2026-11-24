"use client";
import React from "react";

export type MascotExpression = "happy" | "thinking" | "celebrating" | "encouraging" | "sad" | "surprised";

interface MascotProps {
  expression?: MascotExpression;
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * Axo — Mascota ajolote (axolotl) de la plataforma.
 * Nativo del Lago de Pátzcuaro, Michoacán.
 * Dibujado completamente en SVG sin dependencias externas.
 */
export default function Mascot({
  expression = "happy",
  size = 120,
  className = "",
  animate = true,
}: MascotProps) {
  const animClass = animate ? "animate-float" : "";

  // Colores del ajolote
  const bodyColor = "#f9a8d4"; // rosa suave (axolotl rosado)
  const bodyDark = "#f472b6";
  const gillColor = "#fb7185"; // branquias rojizas
  const eyeColor = "#1e1b4b";
  const cheekColor = "#fda4af";

  // Expresiones de ojos
  const eyes: Record<MascotExpression, React.ReactNode> = {
    happy: (
      <>
        {/* Ojo izquierdo - arco feliz */}
        <path d="M 68 72 Q 76 66 84 72" stroke={eyeColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Ojo derecho - arco feliz */}
        <path d="M 116 72 Q 124 66 132 72" stroke={eyeColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </>
    ),
    thinking: (
      <>
        {/* Ojo izquierdo - entrecerrado */}
        <ellipse cx="76" cy="72" rx="9" ry="5" fill={eyeColor} />
        <ellipse cx="124" cy="72" rx="9" ry="5" fill={eyeColor} />
        {/* Pensamiento */}
        <circle cx="155" cy="45" r="4" fill="#c4b5fd" opacity="0.8" />
        <circle cx="162" cy="36" r="5" fill="#c4b5fd" opacity="0.9" />
        <circle cx="171" cy="26" r="7" fill="#a78bfa" />
        <text x="168" y="30" fontSize="8" fill="white" textAnchor="middle" dominantBaseline="middle">?</text>
      </>
    ),
    celebrating: (
      <>
        {/* Ojos con estrellas */}
        <text x="76" y="77" fontSize="16" textAnchor="middle" dominantBaseline="middle">⭐</text>
        <text x="124" y="77" fontSize="16" textAnchor="middle" dominantBaseline="middle">⭐</text>
      </>
    ),
    encouraging: (
      <>
        {/* Ojos abiertos cálidos */}
        <circle cx="76" cy="72" r="9" fill={eyeColor} />
        <circle cx="124" cy="72" r="9" fill={eyeColor} />
        <circle cx="79" cy="69" r="3" fill="white" />
        <circle cx="127" cy="69" r="3" fill="white" />
        <circle cx="81" cy="67" r="1.5" fill="white" />
        <circle cx="129" cy="67" r="1.5" fill="white" />
      </>
    ),
    sad: (
      <>
        {/* Ojos tristes */}
        <circle cx="76" cy="74" r="8" fill={eyeColor} />
        <circle cx="124" cy="74" r="8" fill={eyeColor} />
        <circle cx="79" cy="71" r="2.5" fill="white" />
        <circle cx="127" cy="71" r="2.5" fill="white" />
        {/* Lágrima */}
        <ellipse cx="72" cy="85" rx="3" ry="4" fill="#93c5fd" opacity="0.9" />
      </>
    ),
    surprised: (
      <>
        {/* Ojos muy abiertos */}
        <circle cx="76" cy="70" r="11" fill="white" stroke={eyeColor} strokeWidth="2" />
        <circle cx="124" cy="70" r="11" fill="white" stroke={eyeColor} strokeWidth="2" />
        <circle cx="76" cy="70" r="6" fill={eyeColor} />
        <circle cx="124" cy="70" r="6" fill={eyeColor} />
        <circle cx="78" cy="68" r="2.5" fill="white" />
        <circle cx="126" cy="68" r="2.5" fill="white" />
      </>
    ),
  };

  // Bocas según expresión
  const mouths: Record<MascotExpression, React.ReactNode> = {
    happy: (
      <path d="M 85 93 Q 100 103 115 93" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
    ),
    thinking: (
      <path d="M 90 95 Q 100 92 110 95" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
    ),
    celebrating: (
      <path d="M 83 92 Q 100 108 117 92" stroke={eyeColor} strokeWidth="3.5" fill={bodyDark} strokeLinecap="round" />
    ),
    encouraging: (
      <path d="M 86 94 Q 100 104 114 94" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
    ),
    sad: (
      <path d="M 88 100 Q 100 90 112 100" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
    ),
    surprised: (
      <ellipse cx="100" cy="96" rx="10" ry="12" fill={eyeColor} />
    ),
  };

  return (
    <div className={`inline-block ${animClass} ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        {/* Branquias superiores */}
        <ellipse cx="52" cy="38" rx="10" ry="28" fill={gillColor} transform="rotate(-25 52 38)" />
        <ellipse cx="52" cy="38" rx="6" ry="22" fill="#fda4af" transform="rotate(-25 52 38)" />
        <ellipse cx="72" cy="28" rx="8" ry="24" fill={gillColor} transform="rotate(-10 72 28)" />
        <ellipse cx="72" cy="28" rx="5" ry="18" fill="#fda4af" transform="rotate(-10 72 28)" />
        <ellipse cx="148" cy="38" rx="10" ry="28" fill={gillColor} transform="rotate(25 148 38)" />
        <ellipse cx="148" cy="38" rx="6" ry="22" fill="#fda4af" transform="rotate(25 148 38)" />
        <ellipse cx="128" cy="28" rx="8" ry="24" fill={gillColor} transform="rotate(10 128 28)" />
        <ellipse cx="128" cy="28" rx="5" ry="18" fill="#fda4af" transform="rotate(10 128 28)" />

        {/* Cuerpo principal */}
        <ellipse cx="100" cy="130" rx="62" ry="68" fill={bodyColor} />

        {/* Cabeza */}
        <ellipse cx="100" cy="88" rx="58" ry="52" fill={bodyColor} />

        {/* Mejillas sonrojadas */}
        {(expression === "happy" || expression === "celebrating" || expression === "encouraging") && (
          <>
            <ellipse cx="62" cy="88" rx="12" ry="8" fill={cheekColor} opacity="0.6" />
            <ellipse cx="138" cy="88" rx="12" ry="8" fill={cheekColor} opacity="0.6" />
          </>
        )}

        {/* Ojos */}
        {eyes[expression]}

        {/* Boca */}
        {mouths[expression]}

        {/* Patas delanteras */}
        <ellipse cx="45" cy="168" rx="22" ry="14" fill={bodyColor} transform="rotate(-30 45 168)" />
        <ellipse cx="45" cy="168" rx="18" ry="10" fill={bodyColor} transform="rotate(-30 45 168)" />
        {/* Dedos izquierdos */}
        <ellipse cx="30" cy="175" rx="6" ry="4" fill={bodyColor} transform="rotate(-40 30 175)" />
        <ellipse cx="22" cy="168" rx="6" ry="4" fill={bodyColor} transform="rotate(-55 22 168)" />
        <ellipse cx="20" cy="158" rx="6" ry="4" fill={bodyColor} transform="rotate(-70 20 158)" />

        <ellipse cx="155" cy="168" rx="22" ry="14" fill={bodyColor} transform="rotate(30 155 168)" />
        {/* Dedos derechos */}
        <ellipse cx="170" cy="175" rx="6" ry="4" fill={bodyColor} transform="rotate(40 170 175)" />
        <ellipse cx="178" cy="168" rx="6" ry="4" fill={bodyColor} transform="rotate(55 178 168)" />
        <ellipse cx="180" cy="158" rx="6" ry="4" fill={bodyColor} transform="rotate(70 180 158)" />

        {/* Cola */}
        <path
          d="M 55 185 Q 30 210 50 220 Q 70 228 80 215 Q 90 205 100 200"
          fill={bodyColor}
          stroke={bodyDark}
          strokeWidth="1"
        />
        <path
          d="M 145 185 Q 170 210 150 220 Q 130 228 120 215 Q 110 205 100 200"
          fill={bodyColor}
          stroke={bodyDark}
          strokeWidth="1"
        />

        {/* Detalles corporales */}
        <ellipse cx="100" cy="140" rx="30" ry="20" fill={bodyDark} opacity="0.12" />

        {/* Expresiones extra */}
        {expression === "celebrating" && (
          <>
            <text x="20" y="50" fontSize="18" transform="rotate(-20 20 50)">🎉</text>
            <text x="160" y="45" fontSize="16" transform="rotate(15 160 45)">✨</text>
          </>
        )}
        {expression === "thinking" && (
          <text x="40" y="95" fontSize="14" opacity="0.7">🌿</text>
        )}
      </svg>
    </div>
  );
}
