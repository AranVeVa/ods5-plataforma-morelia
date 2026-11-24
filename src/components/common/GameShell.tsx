"use client";

import React, { useState, useCallback, ReactNode } from "react";
import { Play, Sparkles, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { GameId, useProgress } from "@/context/ProgressContext";
import { GAMES_CATALOG, WORLD_THEMES } from "@/content/games-meta";
import { useSound } from "@/hooks/useSound";
import Button3D from "./Button3D";
import Mascot from "./Mascot";
import TutorialOverlay from "./TutorialOverlay";
import ResultScreen from "./ResultScreen";
import GameIllustration from "./GameIllustrations";

export type DifficultyLevel = "facil" | "normal" | "reto";

export interface DifficultyOption {
  id: DifficultyLevel;
  label: string;
  subtitle: string;
  emoji: string;
}

export interface TutorialStep {
  emoji: string;
  title: string;
  description: string;
}

export interface GameShellRenderArgs {
  difficulty: DifficultyLevel;
  finishGame: (
    stars: 0 | 1 | 2 | 3,
    score?: number,
    maxScore?: number,
    customMessage?: string,
    extraContent?: ReactNode
  ) => void;
  restartKey: number;
  backToDifficulty: () => void;
}

interface GameShellProps {
  gameId: GameId;
  tutorialSteps: TutorialStep[];
  difficulties?: DifficultyOption[];
  onHome?: () => void;
  onNextGame?: () => void;
  children: (args: GameShellRenderArgs) => ReactNode;
}

const DEFAULT_DIFFICULTIES: DifficultyOption[] = [
  { id: "facil", label: "Nivel 1 · Exploración", subtitle: "Ritmo tranquilo con más pistas de Axo", emoji: "🌱" },
  { id: "normal", label: "Nivel 2 · Desafío", subtitle: "Experiencia equilibrada recomendada", emoji: "⚡" },
  { id: "reto", label: "Nivel 3 · Experto/a", subtitle: "Mayor velocidad, eventos o retos extra", emoji: "🏆" },
];

type Phase = "title" | "tutorial" | "difficulty" | "playing" | "result";

export default function GameShell({
  gameId,
  tutorialSteps,
  difficulties = DEFAULT_DIFFICULTIES,
  onHome,
  onNextGame,
  children,
}: GameShellProps) {
  const meta = GAMES_CATALOG.find((g) => g.id === gameId)!;
  const world = WORLD_THEMES[meta.levelKey];

  const { setGameProgress } = useProgress();
  const { playClick, playCelebration } = useSound();

  const [phase, setPhase] = useState<Phase>("title");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("normal");
  const [restartKey, setRestartKey] = useState(0);
  const [resultData, setResultData] = useState<{
    stars: 0 | 1 | 2 | 3;
    score?: number;
    maxScore?: number;
    customMessage?: string;
    extraContent?: ReactNode;
  }>({ stars: 3 });

  const finishGame = useCallback(
    (
      stars: 0 | 1 | 2 | 3,
      score?: number,
      maxScore?: number,
      customMessage?: string,
      extraContent?: ReactNode
    ) => {
      setGameProgress(gameId, stars);
      if (stars >= 2) playCelebration();
      setResultData({ stars, score, maxScore, customMessage, extraContent });
      setPhase("result");
    },
    [gameId, setGameProgress, playCelebration]
  );

  const handleSelectDifficulty = (level: DifficultyLevel) => {
    playClick();
    setDifficulty(level);
    setRestartKey((k) => k + 1);
    setPhase("playing");
  };

  const handleReplay = () => {
    playClick();
    setRestartKey((k) => k + 1);
    setPhase("playing");
  };

  const accentVariant = meta.levelKey;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {phase === "title" && (
        <section
          aria-label={`Pantalla de inicio de ${meta.title}`}
          className={`rounded-4xl border-2 ${world.borderClass} bg-gradient-to-br ${world.gradientClass} p-6 sm:p-10 shadow-xl animate-scaleUp`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              {onHome && (
                <button
                  onClick={() => {
                    playClick();
                    onHome();
                  }}
                  className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-800 text-xs font-black border border-slate-300 inline-flex items-center gap-1.5 shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" /> Volver al Mapa
                </button>
              )}
              <span className={`px-3 py-1.5 rounded-full text-xs font-black border ${world.pillClass}`}>
                {meta.levelLabel}
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/80 text-slate-700 border border-slate-200">
                {meta.odsTarget}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200">
              <Clock className="w-3.5 h-3.5" /> {meta.duration}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-3xl shadow-md border border-slate-100 shrink-0">
                  <GameIllustration gameId={gameId} className="w-16 h-16" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {meta.badge}
                  </p>
                  <h2 className="text-2xl sm:text-4xl font-display font-black text-slate-900">
                    {meta.title}
                  </h2>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium max-w-2xl">
                {meta.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button3D
                  variant={accentVariant}
                  size="lg"
                  onClick={() => {
                    playClick();
                    setPhase("tutorial");
                  }}
                  icon={<Play className="w-5 h-5 fill-current" />}
                >
                  ¡Comenzar Misión!
                </Button3D>
                <Button3D
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    playClick();
                    setPhase("difficulty");
                  }}
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Elegir dificultad directa
                </Button3D>
              </div>
            </div>

            <div className="flex flex-col items-center bg-white/75 backdrop-blur-sm p-4 rounded-3xl border border-white shadow-sm">
              <Mascot expression="encouraging" size={115} />
              <p className="text-xs font-bold text-slate-700 text-center max-w-[190px] mt-1">
                &ldquo;¡Hola! Soy Axo. Te acompañaré paso a paso.&rdquo;
              </p>
            </div>
          </div>
        </section>
      )}

      {phase === "tutorial" && (
        <TutorialOverlay
          steps={tutorialSteps}
          gameTitle={meta.title}
          onComplete={() => setPhase("difficulty")}
        />
      )}

      {phase === "difficulty" && (
        <section
          aria-label="Selector de dificultad"
          className="bg-white rounded-4xl border-2 border-slate-200 p-6 sm:p-8 shadow-xl space-y-6 animate-scaleUp"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Mascot expression="thinking" size={64} />
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900">
                  Elige tu nivel de desafío
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  {meta.title} · Puedes cambiar de nivel cuando quieras.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                playClick();
                setPhase("title");
              }}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Atrás
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficulties.map((d) => (
              <button
                key={d.id}
                onClick={() => handleSelectDifficulty(d.id)}
                className="min-h-[130px] text-left p-5 rounded-3xl border-2 border-slate-200 hover:border-indigo-500 bg-slate-50/70 hover:bg-indigo-50/50 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
              >
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                  {d.emoji}
                </span>
                <div>
                  <h3 className="font-black text-base text-slate-900">{d.label}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{d.subtitle}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                playClick();
                setPhase("tutorial");
              }}
              className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1.5 min-h-[44px]"
            >
              <BookOpen className="w-4 h-4" /> Ver mini-tutorial animado de nuevo
            </button>
          </div>
        </section>
      )}

      {phase === "playing" && (
        <div key={restartKey} className="animate-fadeIn">
          {children({
            difficulty,
            finishGame,
            restartKey,
            backToDifficulty: () => setPhase("difficulty"),
          })}
        </div>
      )}

      {phase === "result" && (
        <ResultScreen
          stars={resultData.stars}
          score={resultData.score}
          maxScore={resultData.maxScore}
          message={resultData.customMessage ?? meta.learningSummary}
          extraContent={resultData.extraContent}
          didYouKnow={
            <div className="space-y-1.5">
              <p className="font-semibold text-slate-800">{meta.learningSummary}</p>
              <p className="text-xs text-slate-600 border-t border-slate-200 pt-2">
                <strong>Dato reflexivo:</strong> {meta.funFact}
              </p>
            </div>
          }
          badge={meta.badgeReward}
          levelColor={meta.levelKey}
          onReplay={handleReplay}
          onNext={onNextGame}
          onHome={onHome}
        />
      )}
    </div>
  );
}
