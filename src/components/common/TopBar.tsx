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
  const a11yMenuRef = useRef<HTMLDivElement>(null);

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
      <div className="bg-slate-950 text-slate-100 px-3 py-1.5 text-[11px] border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
            <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            Privacy by Design: Cero cuentas, cero cookies, cero rastreo
          </span>
          <span className="hidden sm:inline text-slate-300 font-medium">
            Plataforma Educativa ODS 5 · Morelia, Michoacán
          </span>
        </div>
      </div>

      {/* Barra persistente principal */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2">
          {/* Izquierda: Logo siempre a la izquierda + Inicio + Selector de edad rápido */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onGoHome ? (
              <button
                onClick={() => {
                  playClick();
                  onGoHome();
                }}
                className="rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500 transition-opacity hover:opacity-90"
                aria-label="ODS 5 Morelia — Volver al inicio"
              >
                <BrandLogo size={38} showText={false} className="sm:hidden" />
                <BrandLogo size={40} showText={true} compact={true} className="hidden sm:inline-flex" />
              </button>
            ) : showHomeButton ? (
              <Link
                href="/"
                onClick={() => playClick()}
                className="rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500 transition-opacity hover:opacity-90"
                aria-label="ODS 5 Morelia — Volver al inicio"
              >
                <BrandLogo size={38} showText={false} className="sm:hidden" />
                <BrandLogo size={40} showText={true} compact={true} className="hidden sm:inline-flex" />
              </Link>
            ) : (
              <BrandLogo size={42} showText={true} />
            )}

            {(onGoHome || showHomeButton) &&
              (onGoHome ? (
                <button
                  onClick={() => {
                    playClick();
                    onGoHome();
                  }}
                  className="min-h-[44px] px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs inline-flex items-center gap-1.5 border border-slate-300 transition-colors"
                  aria-label="Volver al mapa de aventura (Inicio)"
                >
                  <Home className="w-4 h-4 text-indigo-700" aria-hidden="true" />
                  <span>Inicio</span>
                </button>
              ) : (
                <Link
                  href="/"
                  onClick={() => playClick()}
                  className="min-h-[44px] px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs inline-flex items-center gap-1.5 border border-slate-300 transition-colors"
                  aria-label="Volver al mapa de aventura (Inicio)"
                >
                  <Home className="w-4 h-4 text-indigo-700" aria-hidden="true" />
                  <span>Inicio</span>
                </Link>
              ))}

            {/* Pill de cambio de edad */}
            {onOpenAgeSelector && (
              <button
                onClick={() => {
                  playClick();
                  onOpenAgeSelector();
                }}
                className="min-h-[44px] px-3 py-2 rounded-2xl bg-slate-100 hover:bg-indigo-50 text-slate-900 hover:text-indigo-950 font-black text-xs inline-flex items-center gap-1.5 border border-slate-300 hover:border-indigo-300 transition-colors"
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

            <Link
              href="/docentes"
              onClick={() => playClick()}
              className="min-h-[44px] px-3 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-bold text-xs inline-flex items-center gap-1.5 border border-indigo-200 transition-colors"
              title="Guía pedagógica para docentes (solo lectura)"
            >
              <GraduationCap className="w-4 h-4 text-indigo-700" aria-hidden="true" />
              <span className="hidden md:inline">Panel Docente</span>
            </Link>
          </div>

          {/* Derecha: Logros, Accesibilidad, Sonido, Necesito Ayuda */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Álbum de logros adaptado a su nivel */}
            <button
              onClick={() => {
                playClick();
                setIsAlbumOpen(true);
              }}
              className="min-h-[44px] px-3 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-black text-xs inline-flex items-center gap-1.5 border-2 border-amber-300 transition-colors"
              aria-label={`Abrir álbum de logros (${groupSummary.totalStars}/${groupSummary.maxStars} estrellas)`}
            >
              <Trophy className="w-4 h-4 text-amber-700" aria-hidden="true" />
              <span>
                {groupSummary.totalStars}/{groupSummary.maxStars} ⭐
              </span>
              <span className="hidden sm:inline">Logros</span>
            </button>

            {/* Accesibilidad */}
            <div className="relative" ref={a11yMenuRef}>
              <button
                onClick={() => {
                  playClick();
                  setIsA11yOpen((v) => !v);
                }}
                aria-expanded={isA11yOpen}
                aria-haspopup="true"
                className={`min-h-[44px] px-3 py-2 rounded-2xl font-bold text-xs inline-flex items-center gap-1.5 border transition-colors ${
                  largeText || highContrast || reducedMotion
                    ? "bg-indigo-600 text-white border-indigo-700"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                }`}
                aria-label="Opciones de accesibilidad"
              >
                <Accessibility className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Accesibilidad</span>
              </button>

              {isA11yOpen && (
                <div
                  role="menu"
                  aria-label="Controles de accesibilidad"
                  className="fixed inset-x-3 top-24 sm:inset-auto sm:absolute sm:right-0 sm:mt-2 sm:w-64 bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-3 space-y-2 z-50 animate-scaleUp"
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
              className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
              aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
              title={isMuted ? "Activar sonido" : "Silenciar sonido"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-600" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              )}
              <span className="hidden md:inline">{isMuted ? "Silencio" : "Sonido"}</span>
            </button>

            {/* Botón permanente NECESITO AYUDA */}
            <button
              onClick={() => {
                playClick();
                setIsHelpOpen(true);
              }}
              className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm border-b-4 border-rose-800 active:border-b-0 active:translate-y-0.5 inline-flex items-center gap-1.5 transition-all"
              aria-label="Necesito ayuda: abrir directorio de apoyo en Morelia y México"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Necesito ayuda</span>
            </button>
          </div>
        </div>
      </header>

      <EmergencyHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <AchievementAlbumModal isOpen={isAlbumOpen} onClose={() => setIsAlbumOpen(false)} />
    </>
  );
}
