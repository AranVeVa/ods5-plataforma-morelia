"use client";

import React from "react";
import { Play, RotateCcw, Volume2, VolumeX, ShieldAlert, Sparkles } from "lucide-react";
import { sound } from "@/utils/audio";

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onOpenHelp?: () => void;
}

export default function PauseModal({
  isOpen,
  onResume,
  onRestart,
  onOpenHelp,
}: PauseModalProps) {
  const [isMuted, setIsMuted] = React.useState<boolean>(sound.getMuted());

  if (!isOpen) return null;

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 max-w-sm w-full p-6 text-center space-y-4 animate-scaleUp">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center font-black text-2xl shadow-inner">
          ⏸️
        </div>

        <div>
          <h2 id="pause-modal-title" className="text-xl font-black text-slate-900">
            Juego en Pausa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tómate tu tiempo. Puedes reanudar cuando estés listo.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Continuar Partida</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-500" />
                <span>Activar Sonido</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Silenciar Sonido</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar Nivel</span>
          </button>

          {onOpenHelp && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenHelp();
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-rose-200"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Directorio y Apoyo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
