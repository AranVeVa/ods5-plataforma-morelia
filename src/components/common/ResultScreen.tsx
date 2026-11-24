"use client";
import React, { ReactNode } from "react";
import StarRating from "./StarRating";
import Button3D from "./Button3D";
import Mascot, { MascotExpression } from "./Mascot";
import Confetti from "./Confetti";

interface ResultScreenProps {
  stars: 0 | 1 | 2 | 3;
  score?: number;
  maxScore?: number;
  title?: string;
  message?: string;
  didYouKnow?: ReactNode;
  badge?: { emoji: string; label: string };
  extraContent?: ReactNode;
  onReplay?: () => void;
  onNext?: () => void;
  onHome?: () => void;
  levelColor?: "infantil" | "intermedio" | "juvenil";
}

const levelGradients = {
  infantil: "from-emerald-50 via-yellow-50 to-red-50",
  intermedio: "from-blue-50 via-cyan-50 to-orange-50",
  juvenil: "from-violet-50 via-fuchsia-50 to-indigo-50",
};

const mascotByStars: Record<number, MascotExpression> = {
  0: "sad",
  1: "encouraging",
  2: "happy",
  3: "celebrating",
};

export default function ResultScreen({
  stars,
  score,
  maxScore,
  title,
  message,
  didYouKnow,
  badge,
  extraContent,
  onReplay,
  onNext,
  onHome,
  levelColor = "infantil",
}: ResultScreenProps) {
  const mascotExpr = mascotByStars[stars] ?? "happy";

  const defaultMessages: Record<number, string> = {
    0: "¡No te rindas! Cada intento te hace más fuerte. ¡Vuelve a intentarlo!",
    1: "¡Bien! Estás aprendiendo. ¡Con un poco más de práctica lo lograrás!",
    2: "¡Muy bien! Estás haciendo un gran trabajo por la igualdad.",
    3: "¡Increíble! ¡Eres una persona campeona de la equidad de género!",
  };

  const displayMessage = message ?? defaultMessages[stars];
  const displayTitle =
    title ??
    (stars === 3
      ? "¡Felicidades!"
      : stars >= 2
      ? "¡Buen trabajo!"
      : stars >= 1
      ? "¡Sigue adelante!"
      : "¡Ánimo!");

  return (
    <div
      className={`min-h-[440px] flex flex-col items-center justify-center gap-6 p-6 sm:p-8 bg-gradient-to-br ${levelGradients[levelColor]} rounded-4xl border-2 border-slate-200/80 shadow-xl animate-scaleUp max-w-3xl mx-auto`}
    >
      <Confetti active={stars === 3} duration={4000} />

      {/* Mascota */}
      <div className="relative">
        <Mascot expression={mascotExpr} size={105} animate={true} />
        {badge && (
          <div className="absolute -top-2 -right-2 bg-white rounded-full w-11 h-11 flex items-center justify-center text-2xl shadow-md border-2 border-yellow-300 animate-pop">
            {badge.emoji}
          </div>
        )}
      </div>

      {/* Título */}
      <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 text-center animate-slideUp">
        {displayTitle}
      </h2>

      {/* Estrellas */}
      <StarRating stars={stars} size="lg" animated showLabel />

      {/* Puntuación */}
      {score !== undefined && maxScore !== undefined && (
        <div className="text-center">
          <span className="text-3xl sm:text-4xl font-black text-slate-800">{score}</span>
          <span className="text-lg text-slate-500 ml-1">/{maxScore} pts</span>
        </div>
      )}

      {/* Insignia */}
      {badge && stars >= 1 && (
        <div className="flex items-center gap-2.5 bg-yellow-50 border-2 border-yellow-300 rounded-2xl px-4 py-2 animate-pop shadow-xs">
          <span className="text-2xl">{badge.emoji}</span>
          <div className="text-left">
            <p className="text-[10px] text-yellow-800 font-black uppercase tracking-wider">
              Insignia desbloqueada
            </p>
            <p className="text-xs sm:text-sm font-black text-yellow-950">{badge.label}</p>
          </div>
        </div>
      )}

      {/* Mensaje descriptivo */}
      <p className="text-sm sm:text-base text-slate-700 text-center max-w-lg leading-relaxed font-semibold">
        {displayMessage}
      </p>

      {/* Contenido Extra (para leer mitos desmentidos, emociones o resúmenes sin prisa) */}
      {extraContent && (
        <div className="w-full max-w-xl text-left bg-white/95 rounded-3xl border-2 border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
          {extraContent}
        </div>
      )}

      {/* ¿Sabías que...? (sin citas académicas visuales) */}
      {didYouKnow && (
        <div className="bg-white/85 border border-slate-200 rounded-2xl p-4 max-w-xl w-full text-left shadow-2xs">
          <p className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <span>💡</span> ¿Sabías que...?
          </p>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {didYouKnow}
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3 justify-center mt-2 w-full max-w-lg">
        {onReplay && (
          <Button3D
            variant="secondary"
            size="md"
            onClick={onReplay}
            icon={<span>🔄</span>}
          >
            Volver a jugar
          </Button3D>
        )}
        {onNext && (
          <Button3D
            variant={levelColor}
            size="md"
            onClick={onNext}
            icon={<span>▶️</span>}
          >
            Siguiente juego
          </Button3D>
        )}
        {onHome && (
          <Button3D
            variant="ghost"
            size="md"
            onClick={onHome}
            icon={<span>🗺️</span>}
          >
            Volver al Mapa
          </Button3D>
        )}
      </div>
    </div>
  );
}
