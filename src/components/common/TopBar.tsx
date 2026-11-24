"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  ShieldAlert,
  Volume2,
  VolumeX,
  Accessibility,
  Trophy,
  GraduationCap,
  Lock,
  Type,
  Contrast,
  Sparkles,
  Users,
} from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useProgress, LevelKey } from "@/context/ProgressContext";
import { useAccessibility } from "@/context/AppProviders";
import BrandLogo from "./BrandLogo";
import EmergencyHelpModal from "./EmergencyHelpModal";
import AchievementAlbumModal from "./AchievementAlbumModal";

interface TopBarProps {
  onGoHome?: () => void;
  showHomeButton?: boolean;
  onOpenAgeSelector?: () => void;
}

const AGE_LABELS: Record<LevelKey | "todos", { label: string; emoji: string }> = {
  infantil: { label: "6–9 años", emoji: "🌱" },
  intermedio: { label: "10–13 años", emoji: "⚡" },
  juvenil: { label: "14+ años", emoji: "🚀" },
  todos: { label: "Todos", emoji: "🌐" },
};

export default function TopBar({
  onGoHome,
  showHomeButton = false,
  onOpenAgeSelector,
}: TopBarProps) {
  const { isMuted, toggleMute, playClick } = useSound();
  const { selectedAgeGroup, getGroupProgress } = useProgress();
  const {
    largeText,
    highContrast,
    reducedMotion,
    toggleLargeText,
    toggleHighContrast,
    toggleReducedMotion,
  } = useAccessibility();

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const a11yMenuRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);

  // Auto-ocultar barra al bajar y mostrarla al subir para dar más espacio en pantallas pequeñas
  useEffect(() => {
    if (typeof window === "undefined") return;
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      if (currentY < 48 || isA11yOpen) {
        setIsHeaderVisible(true);
      } else if (delta > 8) {
        setIsHeaderVisible(false);
      } else if (delta < -6) {
        setIsHeaderVisible(true);
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isA11yOpen]);

  useEffect(() => {
    if (!isA11yOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (a11yMenuRef.current && !a11yMenuRef.current.contains(e.target as Node)) {
        setIsA11yOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsA11yOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isA11yOpen]);

  const groupSummary = getGroupProgress();

  const ageBadge = selectedAgeGroup ? AGE_LABELS[selectedAgeGroup] : null;

  return (
    <>
      {/* Banda superior Privacy by Design */}
      <div className="bg-slate-950 text-slate-100 px-3 py-1 text-[10px] sm:text-[11px] border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 truncate">
            <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" aria-hidden="true" />
            <span>Privacy by Design: Cero cuentas, cero cookies, cero rastreo</span>
          </span>
          <span className="hidden sm:inline text-slate-300 font-medium shrink-0">
            Plataforma Educativa ODS 5 · Morelia, Michoacán
          </span>
        </div>
      </div>

      {/* Barra persistente inteligente: se oculta al bajar y reaparece al subir */}
      <header
        onFocusCapture={() => setIsHeaderVisible(true)}
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-sm transition-transform duration-200 ease-out ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-5 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Izquierda: Logo siempre a la izquierda + Inicio + Selector de edad en pantallas medianas/grandes */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink-0">
            {onGoHome ? (
              <button
                onClick={() => {
                  playClick();
                  onGoHome();
                }}
                className="rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 transition-opacity hover:opacity-90 shrink-0"
                aria-label="ODS 5 Morelia — Volver al inicio"
              >
                <BrandLogo size={34} showText={false} className="sm:hidden" />
                <BrandLogo size={38} showText={true} compact={true} className="hidden sm:inline-flex" />
              </button>
            ) : showHomeButton ? (
              <Link
                href="/"
                onClick={() => playClick()}
                className="rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 transition-opacity hover:opacity-90 shrink-0"
                aria-label="ODS 5 Morelia — Volver al inicio"
              >
                <BrandLogo size={34} showText={false} className="sm:hidden" />
                <BrandLogo size={38} showText={true} compact={true} className="hidden sm:inline-flex" />
              </Link>
            ) : (
              <>
                <BrandLogo size={34} showText={false} className="sm:hidden" />
                <BrandLogo size={40} showText={true} className="hidden sm:inline-flex" />
              </>
            )}

            {(onGoHome || showHomeButton) &&
              (onGoHome ? (
                <button
                  onClick={() => {
                    playClick();
                    onGoHome();
                  }}
                  className="min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs inline-flex items-center gap-1.5 border border-slate-300 transition-colors shrink-0"
                  aria-label="Volver al mapa de aventura (Inicio)"
                >
                  <Home className="w-4 h-4 text-indigo-700" aria-hidden="true" />
                  <span className="hidden sm:inline">Inicio</span>
                </button>
              ) : (
                <Link
                  href="/"
                  onClick={() => playClick()}
                  className="min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs inline-flex items-center gap-1.5 border border-slate-300 transition-colors shrink-0"
                  aria-label="Volver al mapa de aventura (Inicio)"
                >
                  <Home className="w-4 h-4 text-indigo-700" aria-hidden="true" />
                  <span className="hidden sm:inline">Inicio</span>
                </Link>
              ))}

            {/* Pill de cambio de edad (en móvil ya aparece en el encabezado del mundo) */}
            {onOpenAgeSelector && (
              <button
                onClick={() => {
                  playClick();
                  onOpenAgeSelector();
                }}
                className="hidden md:inline-flex min-h-[44px] px-3 py-2 rounded-2xl bg-slate-100 hover:bg-indigo-50 text-slate-900 hover:text-indigo-950 font-black text-xs items-center gap-1.5 border border-slate-300 hover:border-indigo-300 transition-colors shrink-0"
                title="Cambiar grupo de edad"
                aria-label="Cambiar rango de edad"
              >
                <Users className="w-3.5 h-3.5 text-indigo-700" aria-hidden="true" />
                <span>
                  {ageBadge ? `${ageBadge.emoji} ${ageBadge.label}` : "Elegir edad"}
                </span>
                <span className="text-[10px] text-slate-600 font-semibold underline">
                  (Cambiar)
                </span>
              </button>
            )}
          </div>

          {/* Derecha: Logros, Panel Docente, Accesibilidad, Sonido, Necesito Ayuda en una sola fila limpia */}
          <div className="flex items-center gap-1 sm:gap-2 justify-end shrink-0">
            {/* Álbum de logros adaptado a su nivel */}
            <button
              onClick={() => {
                playClick();
                setIsAlbumOpen(true);
              }}
              className="min-h-[40px] sm:min-h-[44px] px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-black text-[11px] sm:text-xs inline-flex items-center gap-1 border-2 border-amber-300 transition-colors shrink-0"
              aria-label={`Abrir álbum de logros (${groupSummary.totalStars}/${groupSummary.maxStars} estrellas)`}
              title="Álbum de Logros"
            >
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 shrink-0" aria-hidden="true" />
              <span>
                {groupSummary.totalStars}/{groupSummary.maxStars}
              </span>
              <span className="hidden sm:inline">⭐ Logros</span>
            </button>

            <Link
              href="/docentes"
              onClick={() => playClick()}
              className="min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-bold text-xs inline-flex items-center justify-center gap-1.5 border border-indigo-200 transition-colors shrink-0"
              title="Guía pedagógica para docentes (solo lectura)"
              aria-label="Panel Docente"
            >
              <GraduationCap className="w-4 h-4 text-indigo-700 shrink-0" aria-hidden="true" />
              <span className="hidden lg:inline">Panel Docente</span>
            </Link>

            {/* Accesibilidad */}
            <div className="relative" ref={a11yMenuRef}>
              <button
                onClick={() => {
                  playClick();
                  setIsA11yOpen((v) => !v);
                }}
                aria-expanded={isA11yOpen}
                aria-haspopup="true"
                className={`min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl font-bold text-xs inline-flex items-center justify-center gap-1.5 border transition-colors shrink-0 ${
                  largeText || highContrast || reducedMotion
                    ? "bg-indigo-600 text-white border-indigo-700"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                }`}
                aria-label="Opciones de accesibilidad"
                title="Accesibilidad WCAG 2.1"
              >
                <Accessibility className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="hidden lg:inline">Accesibilidad</span>
              </button>

              {isA11yOpen && (
                <div
                  role="menu"
                  aria-label="Controles de accesibilidad"
                  className="fixed inset-x-3 top-20 sm:inset-auto sm:absolute sm:right-0 sm:mt-2 sm:w-64 bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-3 space-y-2 z-50 animate-scaleUp"
                >
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-1">
                    Accesibilidad WCAG 2.1
                  </p>
                  <button
                    role="menuitemcheckbox"
                    aria-checked={largeText}
                    onClick={() => {
                      playClick();
                      toggleLargeText();
                    }}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between border transition-colors ${
                      largeText
                        ? "bg-indigo-50 border-indigo-400 text-indigo-900"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Type className="w-4 h-4" /> Texto grande
                    </span>
                    <span>{largeText ? "ON" : "OFF"}</span>
                  </button>

                  <button
                    role="menuitemcheckbox"
                    aria-checked={highContrast}
                    onClick={() => {
                      playClick();
                      toggleHighContrast();
                    }}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between border transition-colors ${
                      highContrast
                        ? "bg-slate-900 border-slate-900 text-yellow-300"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Contrast className="w-4 h-4" /> Alto contraste
                    </span>
                    <span>{highContrast ? "ON" : "OFF"}</span>
                  </button>

                  <button
                    role="menuitemcheckbox"
                    aria-checked={reducedMotion}
                    onClick={() => {
                      playClick();
                      toggleReducedMotion();
                    }}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between border transition-colors ${
                      reducedMotion
                        ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Reducir movimiento
                    </span>
                    <span>{reducedMotion ? "ON" : "OFF"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sonido */}
            <button
              onClick={toggleMute}
              className="min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shrink-0"
              aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
              title={isMuted ? "Activar sonido" : "Silenciar sonido"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              )}
              <span className="hidden lg:inline">{isMuted ? "Silencio" : "Sonido"}</span>
            </button>

            {/* Botón permanente NECESITO AYUDA */}
            <button
              onClick={() => {
                playClick();
                setIsHelpOpen(true);
              }}
              className="min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] sm:text-xs font-black shadow-sm border-b-4 border-rose-800 active:border-b-0 active:translate-y-0.5 inline-flex items-center gap-1 sm:gap-1.5 transition-all shrink-0"
              aria-label="Necesito ayuda: abrir directorio de apoyo en Morelia y México"
            >
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
              <span className="sm:hidden">Ayuda</span>
              <span className="hidden sm:inline">Necesito ayuda</span>
            </button>
          </div>
        </div>
      </header>

      <EmergencyHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <AchievementAlbumModal isOpen={isAlbumOpen} onClose={() => setIsAlbumOpen(false)} />
    </>
  );
}
