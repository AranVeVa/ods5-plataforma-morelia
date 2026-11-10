"use client";

import React from "react";
import {
  Volume2,
  VolumeX,
  HelpCircle,
  Pause,
  RotateCcw,
  Star,
  ShieldAlert,
  ArrowLeft
} from "lucide-react";
import { sound } from "@/utils/audio";

interface GameHeaderProps {
  title: string;
  badge: string;
  levelBadge: string;
  levelColor?: "emerald" | "blue" | "purple" | "rose" | "violet";
  odsTarget: string;
  score?: number;
  stars?: number;
  maxStars?: number;
  onOpenHelp: () => void;
  onOpenInstructions?: () => void;
  onRestart?: () => void;
  onPause?: () => void;
  onBack?: () => void;
  isPaused?: boolean;
  extraControls?: React.ReactNode;
}

export default function GameHeader({
  title,
  badge,
  levelBadge,
  levelColor = "emerald",
  odsTarget,
  score,
  stars,
  maxStars = 3,
  onOpenHelp,
  onOpenInstructions,
  onRestart,
  onPause,
  onBack,
  isPaused,
  extraControls,
}: GameHeaderProps) {
  const [isMuted, setIsMuted] = React.useState<boolean>(sound.getMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const getBadgeColorClasses = () => {
    switch (levelColor) {
      case "emerald":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "blue":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "purple":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "rose":
        return "bg-rose-100 text-rose-900 border-rose-300";
      case "violet":
        return "bg-violet-100 text-violet-900 border-violet-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="flex flex-col gap-3 pb-5 border-b border-slate-200/80">
      {/* Top Badges & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {onBack && (
            <button
              onClick={() => {
                sound.playClick();
                onBack();
              }}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Volver"
              aria-label="Volver"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${getBadgeColorClasses()}`}
          >
            {levelBadge}
          </span>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {odsTarget}
          </span>
        </div>

        {/* Global Sound & Need Help Buttons */}
        <div className="flex items-center gap-2">
          {/* Permanent Visible Emergency Help Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenHelp();
            }}
            className="px-3 py-1.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm transition-all flex items-center gap-1.5 animate-pulse"
            title="Abrir orientación y directorio de ayuda en Morelia"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Necesito ayuda</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
            title={isMuted ? "Activar sonido" : "Silenciar sonido"}
            aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>

          {/* Instructions Button */}
          {onOpenInstructions && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenInstructions();
              }}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-indigo-600 transition-colors"
              title="Ver instrucciones y objetivos didácticos"
              aria-label="Ver instrucciones"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}

          {/* Pause Button */}
          {onPause && (
            <button
              onClick={() => {
                sound.playClick();
                onPause();
              }}
              className={`p-2 rounded-xl border transition-colors ${
                isPaused
                  ? "bg-amber-500 text-white border-amber-600"
                  : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
              }`}
              title={isPaused ? "Reanudar juego" : "Pausar juego"}
              aria-label={isPaused ? "Reanudar juego" : "Pausar juego"}
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          {/* Restart Button */}
          {onRestart && (
            <button
              onClick={() => {
                sound.playClick();
                onRestart();
              }}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
              title="Reiniciar juego"
              aria-label="Reiniciar juego"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Title & Score Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            {badge}
          </p>
        </div>

        {/* Score & Stars Display */}
        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          {stars !== undefined && (
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
              {[...Array(maxStars)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < stars
                      ? "text-amber-500 fill-amber-500"
                      : "text-slate-300 fill-slate-200"
                  }`}
                />
              ))}
            </div>
          )}

          {score !== undefined && (
            <div className="text-right bg-indigo-50/80 px-3 py-1 rounded-xl border border-indigo-100">
              <span className="text-[10px] font-black uppercase text-indigo-700 block">Puntos</span>
              <span className="text-lg font-black text-indigo-900 leading-none">{score}</span>
            </div>
          )}

          {extraControls}
        </div>
      </div>
    </div>
  );
}
