"use client";

import React from "react";
import { BookOpen, X, Play, Target, CheckCircle2, Lightbulb } from "lucide-react";
import { sound } from "@/utils/audio";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  objective: string;
  rules: string[];
  tips: string[];
  onStart?: () => void;
}

export default function InstructionsModal({
  isOpen,
  onClose,
  title,
  objective,
  rules,
  tips,
  onStart,
}: InstructionsModalProps) {
  if (!isOpen) return null;

  const handleStart = () => {
    sound.playPowerup();
    onClose();
    if (onStart) onStart();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructions-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-indigo-200 max-w-lg w-full overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200">
                Guía de Aprendizaje
              </span>
              <h2 id="instructions-modal-title" className="text-lg font-black leading-tight">
                {title}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Cerrar instrucciones"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Objective */}
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
            <h3 className="font-black text-indigo-950 flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-indigo-600" />
              Objetivo del Juego:
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {objective}
            </p>
          </div>

          {/* Rules */}
          <div>
            <h3 className="font-black text-slate-900 uppercase tracking-wide text-xs mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ¿Cómo se juega?:
            </h3>
            <ul className="space-y-1.5 text-slate-600">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          {tips.length > 0 && (
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl">
              <h3 className="font-black text-amber-950 flex items-center gap-2 mb-1.5 text-xs uppercase tracking-wide">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                Consejo clave:
              </h3>
              <ul className="space-y-1 text-slate-700 text-xs">
                {tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">★</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={handleStart}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>¡Comenzar ahora!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
