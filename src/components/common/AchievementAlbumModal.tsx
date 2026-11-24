"use client";

import React, { useState } from "react";
import { X, Trophy, Star, HardDrive, Trash2, Lock, CheckCircle2 } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { useSound } from "@/hooks/useSound";
import { GAMES_CATALOG } from "@/content/games-meta";
import Button3D from "./Button3D";
import Mascot from "./Mascot";

interface AchievementAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementAlbumModal({ isOpen, onClose }: AchievementAlbumModalProps) {
  const { progress, badges, getTotalStars, getCompletedGames, saveToDevice, clearProgress, hasSavedData } =
    useProgress();
  const { playClick, playCelebration } = useSound();
  const [savedToast, setSavedToast] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalStars = getTotalStars();
  const maxStars = GAMES_CATALOG.length * 3; // 24
  const completedCount = getCompletedGames();
  const percent = Math.round((totalStars / maxStars) * 100);

  const handleSave = () => {
    playCelebration();
    saveToDevice();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleClear = () => {
    playClick();
    clearProgress();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="album-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-amber-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Trophy className="w-7 h-7 text-yellow-200" />
            </div>
            <div>
              <h2 id="album-modal-title" className="text-xl sm:text-2xl font-black">
                Álbum de Logros y Estrellas
              </h2>
              <p className="text-xs text-amber-50 font-medium">
                Tu avance vive solo en la memoria de esta sesión (Privacy by Design).
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="min-w-[44px] min-h-[44px] p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors inline-flex items-center justify-center"
            aria-label="Cerrar álbum de logros"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Progreso Global */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <Mascot expression={totalStars > 0 ? "celebrating" : "encouraging"} size={84} />
            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center justify-between text-sm font-black text-slate-900">
                <span>Progreso de la Aventura ODS 5</span>
                <span className="text-amber-700">
                  {totalStars} / {maxStars} ⭐ ({percent}%)
                </span>
              </div>
              <div
                className="w-full h-4 bg-white rounded-full border border-amber-200 overflow-hidden"
                role="progressbar"
                aria-label="Progreso total de la aventura"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-orange-500 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 font-semibold">
                Juegos completados: {completedCount} de {GAMES_CATALOG.length} · Insignias desbloqueadas:{" "}
                {badges.filter((b) => Boolean(b.earnedAt)).length} de {badges.length}
              </p>
            </div>
          </div>

          {/* Insignias */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3">
              Insignias de Equidad
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {badges.map((badge) => {
                const earned = Boolean(badge.earnedAt);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-2xl border-2 text-center transition-all ${
                      earned
                        ? "bg-amber-50 border-amber-300 shadow-sm"
                        : "bg-slate-50 border-slate-200 opacity-60 grayscale"
                    }`}
                  >
                    <div className="text-3xl mb-1">{badge.emoji}</div>
                    <p className="text-xs font-black text-slate-900 leading-tight">{badge.label}</p>
                    <p className="text-[10px] font-bold mt-1 text-slate-500">
                      {earned ? "✓ Desbloqueada" : "Por desbloquear"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estrellas por juego */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3">
              Estrellas por Misión
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GAMES_CATALOG.map((g) => {
                const stars = progress[g.id]?.stars ?? 0;
                return (
                  <div
                    key={g.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">{g.title}</p>
                      <p className="text-[11px] text-slate-500">{g.levelLabel}</p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0" aria-label={`${stars} de 3 estrellas`}>
                      {[1, 2, 3].map((n) => (
                        <Star
                          key={n}
                          className={`w-4 h-4 ${
                            n <= stars ? "text-amber-500 fill-amber-500" : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Control opcional de guardado local */}
          <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 space-y-3">
            <div className="flex items-start gap-2.5">
              <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-emerald-950 block mb-0.5">
                  Guardado opcional y 100% local (Privacy by Design)
                </strong>
                Por defecto, <strong>nada se guarda</strong> al cerrar la pestaña. Si deseas conservar tus estrellas
                en esta computadora o tableta, puedes guardarlas únicamente en{" "}
                <code>localStorage</code> de este dispositivo. <strong>Nunca se envía a ningún servidor.</strong>
              </div>
            </div>

            {savedToast && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white px-3 py-2 rounded-xl border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ¡Progreso guardado únicamente en este navegador!
              </div>
            )}

            <div className="flex flex-wrap gap-2.5">
              <Button3D
                variant="success"
                size="sm"
                onClick={handleSave}
                icon={<HardDrive className="w-4 h-4" />}
              >
                {hasSavedData ? "Actualizar en este dispositivo" : "Guardar en este dispositivo"}
              </Button3D>
              <Button3D
                variant="danger"
                size="sm"
                onClick={handleClear}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Borrar todo
              </Button3D>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
