"use client";

import React, { useState, useMemo } from "react";
import { ArrowLeftRight, AlertCircle, CheckCircle2, RotateCcw, Users2 } from "lucide-react";
import GameShell, { DifficultyLevel } from "@/components/common/GameShell";
import Button3D from "@/components/common/Button3D";
import {
  TASKS_HIJOS,
  TASKS_PADRES,
  FAMILY_PROFILES,
  SURPRISE_EVENTS,
  BALANZA_TUTORIAL,
  BalanceTask,
  BalanceMode,
  evaluateBalance,
} from "@/content/game2-balanza";
import { useSound } from "@/hooks/useSound";

interface GameProps {
  onHome?: () => void;
  onNextGame?: () => void;
}

function getInitialTasks(mode: BalanceMode): BalanceTask[] {
  const base = mode === "hijos" ? TASKS_HIJOS : TASKS_PADRES;
  return base.map((t) => ({ ...t }));
}

function BalanzaGameplay({
  difficulty,
  onComplete,
}: {
  difficulty: DifficultyLevel;
  onComplete: (stars: 0 | 1 | 2 | 3, score: number, maxScore: number, msg: string) => void;
}) {
  const { playClick, playCorrect, playPowerup } = useSound();

  const [mode, setMode] = useState<BalanceMode>("hijos");
  const [tasks, setTasks] = useState<BalanceTask[]>(() => getInitialTasks("hijos"));
  const [triggeredEvents, setTriggeredEvents] = useState<string[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);

  const profile = FAMILY_PROFILES.find((p) => p.mode === mode) || FAMILY_PROFILES[0];
  const evalResult = useMemo(() => evaluateBalance(tasks), [tasks]);

  const leftTasks = tasks.filter((t) => t.assignedTo === "left");
  const rightTasks = tasks.filter((t) => t.assignedTo === "right");

  const handleSwitchMode = (newMode: BalanceMode) => {
    playClick();
    setMode(newMode);
    setTasks(getInitialTasks(newMode));
    setTriggeredEvents([]);
    setMoves(0);
  };

  const moveTask = (taskId: string, side: "left" | "right") => {
    playClick();
    setMoves((m) => m + 1);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignedTo: side } : t))
    );
  };

  const triggerEvent = (eventId: string) => {
    if (triggeredEvents.includes(eventId)) return;
    const ev = SURPRISE_EVENTS.find((e) => e.id === eventId);
    if (!ev) return;
    playPowerup();
    setTriggeredEvents((prev) => [...prev, eventId]);
    setTasks((prev) => [...prev, ...ev.addedTasks.map((t) => ({ ...t }))]);
  };

  const handleReset = () => {
    playClick();
    setTasks(getInitialTasks(mode));
    setTriggeredEvents([]);
    setMoves(0);
  };

  const handleCompleteMission = () => {
    playCorrect();
    const penalty = Math.round((evalResult.choreDiff + evalResult.restDiff) * 20);
    const eventBonus = triggeredEvents.length * 100;
    const score = Math.max(100, 300 + eventBonus - penalty);
    const maxScore = 300 + (difficulty === "reto" ? 200 : 100);
    const stars: 0 | 1 | 2 | 3 =
      evalResult.isBalanced && (difficulty !== "reto" || triggeredEvents.length >= 1)
        ? 3
        : evalResult.isBalanced
        ? 2
        : 1;

    onComplete(
      stars,
      score,
      maxScore,
      `Lograste equilibrar el hogar (${evalResult.leftChoreHours}h vs ${evalResult.rightChoreHours}h) y el descanso (${evalResult.leftFreeHours}h vs ${evalResult.rightFreeHours}h) en ${profile.title}.`
    );
  };

  return (
    <div className="bg-white rounded-4xl border-2 border-blue-200 shadow-xl p-5 sm:p-8 space-y-6">
      {/* Selector de Rol: Hijos vs Padres */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1">
            <Users2 className="w-4 h-4 text-blue-600" /> Elige a quiénes equilibrar:
          </span>
          <div className="flex flex-wrap rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold gap-1">
            <button
              onClick={() => handleSwitchMode("hijos")}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl transition-all ${
                mode === "hijos"
                  ? "bg-white text-blue-700 shadow-sm font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              👧🏽👦🏽 Hijos (Hermana y Hermano)
            </button>
            <button
              onClick={() => handleSwitchMode("padres")}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl transition-all ${
                mode === "padres"
                  ? "bg-white text-blue-700 shadow-sm font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              👩🏽👨🏽 Padres (Mamá y Papá)
            </button>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" /> Reiniciar ({moves} movs)
        </button>
      </div>

      {/* Indicadores duales: Hogar Y Descanso */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          className={`p-3.5 rounded-2xl border-2 flex items-center justify-between ${
            evalResult.isChoreBalanced
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-amber-50 border-amber-300 text-amber-950"
          }`}
        >
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider block">
              1. Tareas de Hogar y Cuidados
            </span>
            <span className="text-sm font-bold">
              {profile.leftName}: {evalResult.leftChoreHours}h &nbsp;vs&nbsp; {profile.rightName}: {evalResult.rightChoreHours}h
            </span>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-white shadow-xs">
            {evalResult.isChoreBalanced ? "✓ Niveladas" : `Desfase: ${evalResult.choreDiff}h`}
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border-2 flex items-center justify-between ${
            evalResult.isRestBalanced
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-rose-50 border-rose-300 text-rose-950"
          }`}
        >
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider block">
              2. Horas de Descanso y Juego
            </span>
            <span className="text-sm font-bold">
              {profile.leftName}: {evalResult.leftFreeHours}h &nbsp;vs&nbsp; {profile.rightName}: {evalResult.rightFreeHours}h
            </span>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-white shadow-xs">
            {evalResult.isRestBalanced ? "✓ Niveladas" : `Desfase: ${evalResult.restDiff}h`}
          </span>
        </div>
      </div>

      {/* BALANZA ANIMADA SVG */}
      <div className="bg-gradient-to-b from-sky-50 to-slate-50 rounded-3xl p-5 border-2 border-sky-100 flex flex-col items-center gap-3">
        <div className="w-full max-w-md">
          <svg viewBox="0 0 360 155" className="w-full h-36 overflow-visible" aria-hidden="true">
            {/* Base */}
            <rect x="120" y="136" width="120" height="12" rx="6" fill="#0369a1" />
            <rect x="172" y="42" width="16" height="96" rx="6" fill="#0284c7" />

            {/* Barra inclinable con física suave CSS */}
            <g
              style={{
                transformOrigin: "180px 44px",
                transform: `rotate(${evalResult.rotationDeg}deg)`,
                transition: "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <line x1="45" y1="44" x2="315" y2="44" stroke="#f59e0b" strokeWidth="9" strokeLinecap="round" />

              {/* Platillo izquierdo */}
              <line x1="55" y1="44" x2="35" y2="95" stroke="#64748b" strokeWidth="2.5" />
              <line x1="55" y1="44" x2="75" y2="95" stroke="#64748b" strokeWidth="2.5" />
              <path d="M 22 95 Q 55 114 88 95 Z" fill={evalResult.isBalanced ? "#22c55e" : "#f43f5e"} />
              <text x="55" y="90" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">
                {evalResult.leftChoreHours}h hogar · {evalResult.leftFreeHours}h juego
              </text>

              {/* Platillo derecho */}
              <line x1="305" y1="44" x2="285" y2="95" stroke="#64748b" strokeWidth="2.5" />
              <line x1="305" y1="44" x2="325" y2="95" stroke="#64748b" strokeWidth="2.5" />
              <path d="M 272 95 Q 305 114 338 95 Z" fill={evalResult.isBalanced ? "#22c55e" : "#3b82f6"} />
              <text x="305" y="90" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">
                {evalResult.rightChoreHours}h hogar · {evalResult.rightFreeHours}h juego
              </text>
            </g>

            {/* Pivote central */}
            <circle cx="180" cy="44" r="10" fill="#fbbf24" stroke="#b45309" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Mensaje de retroalimentación formativa */}
        <div
          className={`w-full rounded-2xl p-3.5 border-2 flex items-center gap-3 ${
            evalResult.isBalanced
              ? "bg-emerald-50 border-emerald-400 text-emerald-950"
              : "bg-white border-amber-300 text-slate-800"
          }`}
        >
          {evalResult.isBalanced ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
          )}
          <p className="text-xs sm:text-sm font-bold flex-1">{evalResult.feedbackMessage}</p>
          {evalResult.isBalanced && (
            <Button3D variant="success" size="sm" onClick={handleCompleteMission}>
              ¡Validar Equilibrio! ⭐
            </Button3D>
          )}
        </div>

        {/* Retos y Eventos Sorpresa */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs">
          <span className="font-bold text-amber-950 flex items-center gap-1.5">
            <span>⚡</span> Eventos sorpresa (pon a prueba tu justicia familiar):
          </span>
          <div className="flex flex-wrap gap-2">
            {SURPRISE_EVENTS.map((ev) => {
              const active = triggeredEvents.includes(ev.id);
              return (
                <button
                  key={ev.id}
                  onClick={() => triggerEvent(ev.id)}
                  disabled={active}
                  className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-black border transition-all ${
                    active
                      ? "bg-amber-200 text-amber-950 border-amber-400"
                      : "bg-white hover:bg-amber-100 text-amber-900 border-amber-300 shadow-2xs"
                  }`}
                >
                  {ev.emoji} {active ? "Ocurrido ✓" : ev.title.split(":")[1]?.trim() || ev.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* COLUMNAS INTERACTIVAS DRAG & DROP / BOTONES MOVER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Columna Izquierda */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const id = draggedId || e.dataTransfer.getData("text/plain");
            if (id) moveTask(id, "left");
            setDraggedId(null);
          }}
          className="rounded-3xl border-2 border-rose-200 bg-rose-50/40 p-4 space-y-3"
        >
          <div className="flex items-center justify-between border-b border-rose-200 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{profile.leftEmoji}</span>
              <div>
                <h3 className="font-black text-sm text-slate-900">{profile.leftName}</h3>
                <p className="text-[11px] text-slate-500">{profile.leftRole}</p>
              </div>
            </div>
            <div className="text-right text-[11px] font-bold text-slate-700">
              <span className="block text-slate-900">Hogar: {evalResult.leftChoreHours}h</span>
              <span className="text-emerald-700">Descanso/Juego: {evalResult.leftFreeHours}h</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {leftTasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => {
                  setDraggedId(task.id);
                  e.dataTransfer.setData("text/plain", task.id);
                }}
                className={`p-3 rounded-2xl bg-white border shadow-xs flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing hover:border-blue-400 ${
                  task.category === "descanso"
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl shrink-0">{task.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">{task.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {task.hours}h ·{" "}
                      <span className={`uppercase font-bold ${task.category === "descanso" ? "text-emerald-700" : "text-slate-600"}`}>
                        {task.category}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => moveTask(task.id, "right")}
                  className="min-h-[40px] px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-black shrink-0 inline-flex items-center gap-1 border border-blue-200"
                  aria-label={`Mover ${task.name} a ${profile.rightName}`}
                >
                  <span>Mover</span>
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const id = draggedId || e.dataTransfer.getData("text/plain");
            if (id) moveTask(id, "right");
            setDraggedId(null);
          }}
          className="rounded-3xl border-2 border-blue-200 bg-blue-50/40 p-4 space-y-3"
        >
          <div className="flex items-center justify-between border-b border-blue-200 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{profile.rightEmoji}</span>
              <div>
                <h3 className="font-black text-sm text-slate-900">{profile.rightName}</h3>
                <p className="text-[11px] text-slate-500">{profile.rightRole}</p>
              </div>
            </div>
            <div className="text-right text-[11px] font-bold text-slate-700">
              <span className="block text-slate-900">Hogar: {evalResult.rightChoreHours}h</span>
              <span className="text-emerald-700">Descanso/Juego: {evalResult.rightFreeHours}h</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {rightTasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => {
                  setDraggedId(task.id);
                  e.dataTransfer.setData("text/plain", task.id);
                }}
                className={`p-3 rounded-2xl bg-white border shadow-xs flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing hover:border-rose-400 ${
                  task.category === "descanso"
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-slate-200"
                }`}
              >
                <button
                  onClick={() => moveTask(task.id, "left")}
                  className="min-h-[40px] px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-black shrink-0 inline-flex items-center gap-1 border border-rose-200"
                  aria-label={`Mover ${task.name} a ${profile.leftName}`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Mover</span>
                </button>
                <div className="flex items-center gap-2.5 min-w-0 text-right">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">{task.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {task.hours}h ·{" "}
                      <span className={`uppercase font-bold ${task.category === "descanso" ? "text-emerald-700" : "text-slate-600"}`}>
                        {task.category}
                      </span>
                    </p>
                  </div>
                  <span className="text-xl shrink-0">{task.icon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BalanzaDelTiempo({ onHome, onNextGame }: GameProps) {
  return (
    <GameShell
      gameId="balanza"
      tutorialSteps={BALANZA_TUTORIAL}
      difficulties={[
        { id: "facil", label: "Nivel 1 · Rutina Equitativa", subtitle: "Equilibra tareas y descanso entre hermanos o padres", emoji: "⚖️" },
        { id: "normal", label: "Nivel 2 · Fin de Semana", subtitle: "Más labores y tiempo libre para nivelar", emoji: "📅" },
        { id: "reto", label: "Nivel 3 · Con Eventos Sorpresa", subtitle: "Resuelve imprevistos sin sobrecargar a nadie", emoji: "👶" },
      ]}
      onHome={onHome}
      onNextGame={onNextGame}
    >
      {({ difficulty, finishGame }) => (
        <BalanzaGameplay difficulty={difficulty} onComplete={finishGame} />
      )}
    </GameShell>
  );
}
