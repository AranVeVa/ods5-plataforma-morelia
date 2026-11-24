"use client";

import React from "react";
import { Trophy, Star, RotateCcw, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "@/utils/audio";

interface VictoryModalProps {
  isOpen: boolean;
  title?: string;
  score?: number;
  stars?: number;
  maxStars?: number;
  takeaway: string;
  summaryPoints?: string[];
  onRestart: () => void;
  onNextGame?: () => void;
  nextGameTitle?: string;
}

export default function VictoryModal({
  isOpen,
  title = "¡Misión Cumplida!",
  score,
  stars = 3,
  maxStars = 3,
  takeaway,
  summaryPoints = [],
  onRestart,
  onNextGame,
  nextGameTitle,
}: VictoryModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      sound.playCelebration();
      const reduceMotion =
        typeof window !== "undefined" &&
        (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
          document.documentElement.classList.contains("reduce-motion"));
      if (!reduceMotion) {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.55 },
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 max-w-lg w-full overflow-hidden text-center animate-scaleUp">
        {/* Banner with Trophy */}
        <div className="bg-gradient-to-b from-amber-400 via-orange-400 to-amber-500 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-40 pattern-dots" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white text-amber-500 flex items-center justify-center shadow-xl animate-bounce mb-2">
              <Trophy className="w-9 h-9" />
            </div>
            <h2 id="victory-modal-title" className="text-2xl sm:text-3xl font-black drop-shadow-sm">
              {title}
            </h2>

            {/* Stars */}
            <div className="flex items-center gap-2 mt-3">
              {[...Array(maxStars)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-7 h-7 transform transition-transform hover:scale-110 ${
                    i < stars
                      ? "text-yellow-200 fill-yellow-200 drop-shadow"
                      : "text-white/40 fill-white/20"
                  }`}
                />
              ))}
            </div>

            {score !== undefined && (
              <p className="mt-2 text-xs font-black uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full text-white">
                Puntuación Obtenida: {score} pts
              </p>
            )}
          </div>
        </div>

        {/* Learning Takeaway */}
        <div className="p-5 sm:p-6 space-y-4 text-left">
          <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              ¿Qué aprendimos con esta actividad?:
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {takeaway}
            </p>
          </div>

          {summaryPoints.length > 0 && (
            <ul className="space-y-1.5 text-xs text-slate-600">
              {summaryPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jugar otra vez</span>
          </button>

          {onNextGame && (
            <button
              onClick={() => {
                sound.playPowerup();
                onNextGame();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{nextGameTitle ? `Siguiente: ${nextGameTitle}` : "Siguiente juego"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
