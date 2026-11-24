"use client";

import React, { useState } from "react";
import { AlertTriangle, LogOut, RotateCcw, HeartHandshake, ArrowRight, ShieldCheck } from "lucide-react";
import GameShell, { DifficultyLevel } from "@/components/common/GameShell";
import Button3D from "@/components/common/Button3D";
import DirectorioApoyo from "@/components/DirectorioApoyo";
import {
  STORY_SCENARIOS,
  StoryScenarioKey,
  createInitialStoryState,
  transitionStoryState,
  CIRCULO_TUTORIAL,
} from "@/content/game8-circulo";
import { useSound } from "@/hooks/useSound";

interface GameProps {
  onHome?: () => void;
  onNextGame?: () => void;
}

/** Personaje SVG expresivo con burbuja de diálogo */
function StoryCharacterSvg({ mood }: { mood: "alarm" | "concerned" | "resolute" | "safe" }) {
  const bg =
    mood === "safe"
      ? "#dcfce7"
      : mood === "resolute"
      ? "#ede9fe"
      : mood === "alarm"
      ? "#ffe4e6"
      : "#fef3c7";
  const shirt =
    mood === "safe"
      ? "#10b981"
      : mood === "resolute"
      ? "#7c3aed"
      : mood === "alarm"
      ? "#e11d48"
      : "#f59e0b";

  return (
    <svg viewBox="0 0 110 110" className="w-24 h-24 shrink-0" aria-hidden="true">
      <circle cx="55" cy="55" r="50" fill={bg} />
      <path d="M 24 98 Q 55 72 86 98 Z" fill={shirt} />
      <circle cx="55" cy="46" r="21" fill="#1e1b4b" />
      <circle cx="55" cy="49" r="17" fill="#ecc8af" />
      <circle cx="49" cy="47" r="2.2" fill="#1e293b" />
      <circle cx="61" cy="47" r="2.2" fill="#1e293b" />
      {mood === "safe" || mood === "resolute" ? (
        <path d="M 49 55 Q 55 61 61 55" stroke="#7c2d12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M 49 58 Q 55 53 61 58" stroke="#7c2d12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

function CirculoGameplay({
  difficulty,
  onHome,
  onComplete,
}: {
  difficulty: DifficultyLevel;
  onHome?: () => void;
  onComplete: (stars: 0 | 1 | 2 | 3, score: number, maxScore: number, msg: string) => void;
}) {
  const { playClick, playCorrect, playAlert } = useSound();

  const initialCase: StoryScenarioKey =
    difficulty === "facil" ? "noviazgo" : difficulty === "normal" ? "digital" : "escolar";

  const [acceptedWarning, setAcceptedWarning] = useState(false);
  const [engineState, setEngineState] = useState(() => createInitialStoryState(initialCase));

  const scenario = STORY_SCENARIOS[engineState.scenarioKey];
  const node = scenario.nodes[engineState.currentNodeId] || scenario.nodes[scenario.startNode];

  const handleSelectCase = (key: StoryScenarioKey) => {
    playClick();
    setEngineState(createInitialStoryState(key));
  };

  const handleChoice = (idx: number) => {
    const choice = node.choices[idx];
    if (!choice) return;
    if (choice.isProtective) playCorrect();
    else playAlert();
    setEngineState((prev) => transitionStoryState(prev, idx));
  };

  const handleFinishCase = () => {
    const stars: 0 | 1 | 2 | 3 =
      engineState.supportMeter >= 85 ? 3 : engineState.supportMeter >= 60 ? 2 : 1;
    onComplete(
      stars,
      engineState.supportMeter * 3,
      300,
      `Completaste "${scenario.title}" construyendo un medidor de apoyo de ${engineState.supportMeter}%. Recuerda que nunca es culpa de quien vive violencia y Morelia cuenta con redes gratuitas de auxilio.`
    );
  };

  // Advertencia de contenido antes de comenzar
  if (!acceptedWarning) {
    return (
      <div className="bg-white rounded-4xl border-2 border-violet-200 shadow-xl p-6 sm:p-8 max-w-2xl mx-auto space-y-5 animate-scaleUp">
        <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-black text-amber-950 text-base">
              Advertencia de Contenido Sensible
            </h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              Esta historia aborda con respeto situaciones de <strong>violencia digital, control en el noviazgo y acoso escolar</strong> para aprender a pedir ayuda y proteger derechos. Nunca incluye contenido gráfico ni culpabiliza a quien sufre violencia.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          En cualquier momento puedes usar el botón <strong>&ldquo;Salida rápida&rdquo;</strong> para regresar al mapa principal de inmediato, o abrir el botón rojo <strong>&ldquo;Necesito ayuda&rdquo;</strong> arriba.
        </p>

        <div className="flex flex-wrap gap-3 justify-end">
          {onHome && (
            <Button3D variant="ghost" size="md" onClick={onHome} icon={<LogOut className="w-4 h-4" />}>
              Salir al Mapa
            </Button3D>
          )}
          <Button3D
            variant="juvenil"
            size="md"
            onClick={() => {
              playClick();
              setAcceptedWarning(true);
            }}
          >
            Entendido, iniciar historia →
          </Button3D>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-4xl border-2 border-violet-200 shadow-xl p-5 sm:p-8 space-y-6">
      {/* Barra superior: Selector de 3 casos + Medidor de apoyo + Salida Rápida */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap gap-2">
          {(["digital", "noviazgo", "escolar"] as StoryScenarioKey[]).map((key, idx) => (
            <button
              key={key}
              onClick={() => handleSelectCase(key)}
              className={`min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                engineState.scenarioKey === key
                  ? "bg-violet-700 text-white border-violet-800 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              Caso {idx + 1}: {key === "digital" ? "Ley Olimpia" : key === "noviazgo" ? "Noviazgo" : "Acoso"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectCase(engineState.scenarioKey)}
            className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reiniciar caso
          </button>
          {onHome && (
            <button
              onClick={() => {
                playClick();
                onHome();
              }}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-black border border-rose-300 inline-flex items-center gap-1.5"
              title="Salir inmediatamente de esta historia"
            >
              <LogOut className="w-4 h-4" /> Salida rápida
            </button>
          )}
        </div>
      </div>

      {/* Medidor de apoyo */}
      <div className="bg-violet-50/70 border border-violet-200 rounded-2xl p-3.5">
        <div className="flex items-center justify-between text-xs font-black text-violet-950 mb-1.5">
          <span className="flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-violet-700" />
            Medidor de Apoyo y Red de Confianza
          </span>
          <span>{engineState.supportMeter}%</span>
        </div>
        <div className="h-3 bg-white rounded-full border border-violet-200 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              engineState.supportMeter >= 75
                ? "bg-emerald-500"
                : engineState.supportMeter >= 45
                ? "bg-violet-600"
                : "bg-rose-500"
            }`}
            style={{ width: `${engineState.supportMeter}%` }}
          />
        </div>
      </div>

      {/* Escena con Personaje SVG y Burbuja de Diálogo */}
      <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-violet-50/40 p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-violet-100 text-violet-900">
            {node.context}
          </span>
          {node.endingQuality && (
            <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
              Final: {node.endingQuality}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            <StoryCharacterSvg mood={node.characterMood} />
            <span className="text-[11px] font-black text-slate-600">{node.speaker}</span>
          </div>

          {/* Burbuja de diálogo */}
          <div className="flex-1 bg-white border-2 border-violet-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-2 relative">
            <h3 className="text-lg sm:text-xl font-display font-black text-slate-900">
              {node.title}
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              &ldquo;{node.dialogue}&rdquo;
            </p>
          </div>
        </div>

        {/* Consecuencia de la última decisión */}
        {engineState.lastConsequence && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 space-y-1 animate-fadeIn">
            <p className="text-xs font-black text-indigo-950">
              Impacto de tu decisión: {engineState.lastConsequence}
            </p>
            {engineState.lastNote && (
              <p className="text-xs text-indigo-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {engineState.lastNote}
              </p>
            )}
          </div>
        )}

        {/* Opciones de decisión */}
        {!node.isTerminal && node.choices.length > 0 ? (
          <div className="space-y-3 pt-1">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">
              ¿Cómo decides actuar?
            </p>
            {node.choices.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(idx)}
                className="w-full min-h-[60px] text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-violet-500 bg-white hover:bg-violet-50/60 transition-all flex items-center justify-between gap-3 shadow-2xs group"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  {ch.text}
                </span>
                <ArrowRight className="w-5 h-5 text-violet-600 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        ) : (
          /* Cierre con Directorio de Morelia y botón para completar */
          <div className="space-y-5 pt-2 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4">
              <p className="text-sm font-black text-emerald-950">
                ¡Historia completada! Puedes explorar otro caso o finalizar para ver tus estrellas.
              </p>
              <Button3D variant="juvenil" size="md" onClick={handleFinishCase}>
                Finalizar Caso y Ver Estrellas ⭐
              </Button3D>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-black text-slate-900 mb-3">
                Directorio de Auxilio en Morelia y Nacional:
              </h4>
              <DirectorioApoyo compact />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CirculoConfianza({ onHome, onNextGame }: GameProps) {
  return (
    <GameShell
      gameId="circulo"
      tutorialSteps={CIRCULO_TUTORIAL}
      difficulties={[
        { id: "facil", label: "Caso · Noviazgo Sano", subtitle: "Detectar celos, control y redes de confianza", emoji: "💬" },
        { id: "normal", label: "Caso · Violencia Digital", subtitle: "Ley Olimpia y apoyo entre amistades", emoji: "📱" },
        { id: "reto", label: "Caso · Rutas Seguras Morelia", subtitle: "Protocolo Punto Naranja y comunidad protectora", emoji: "🛡️" },
      ]}
      onHome={onHome}
      onNextGame={onNextGame}
    >
      {({ difficulty, finishGame }) => (
        <CirculoGameplay difficulty={difficulty} onHome={onHome} onComplete={finishGame} />
      )}
    </GameShell>
  );
}
