"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Zap, Play, RotateCcw, Award, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "@/utils/audio";

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  myth: string;
  truth: string;
  alive: boolean;
  color: string;
}

interface LevelConfig {
  title: string;
  description: string;
  myths: { myth: string; truth: string; color: string }[];
}

const LEVELS: LevelConfig[] = [
  {
    title: "Nivel 1: Estereotipos en la Familia",
    description: "Derriba prejuicios sobre roles domésticos y emocionales en el hogar.",
    myths: [
      { myth: "Los hombres no lloran", truth: "Llorar es una respuesta humana saludable que ayuda a liberar tensiones.", color: "#f43f5e" },
      { myth: "Las niñas son débiles", truth: "La tenacidad, valentía y liderazgo no tienen género.", color: "#ec4899" },
      { myth: "Cocinar es solo de mujeres", truth: "Cocinar y alimentarse son habilidades universales de supervivencia y autonomía.", color: "#8b5cf6" },
      { myth: "El rosa es solo para niñas", truth: "Los colores son luz y alegría; cualquiera puede vestirlos libremente.", color: "#3b82f6" },
      { myth: "Ellas deben cuidar a todos", truth: "Los cuidados familiares son una responsabilidad compartida de toda la familia.", color: "#10b981" },
      { myth: "Los niños no juegan muñecas", truth: "Jugar a cuidar muñecos fomenta la empatía y la futura paternidad afectiva.", color: "#f59e0b" },
    ],
  },
  {
    title: "Nivel 2: Mitos en la Escuela y el Deporte",
    description: "Rompe barreras en ciencias, liderazgo escolar y actividades físicas.",
    myths: [
      { myth: "Las niñas no son para matemáticas", truth: "Las mujeres lideran investigaciones espaciales y desarrollos científicos en todo el mundo.", color: "#6366f1" },
      { myth: "El fútbol es exclusivo de niños", truth: "El talento deportivo pertenece a cualquier persona que lo practique con pasión.", color: "#0ea5e9" },
      { myth: "Los niños deben pelear a golpes", truth: "El verdadero valor radica en resolver desacuerdos mediante el diálogo y la empatía.", color: "#14b8a6" },
      { myth: "Ellas son muy sentimentales", truth: "Todas las personas sentimos emociones; expresarlas con claridad es inteligencia emocional.", color: "#f97316" },
      { myth: "Los hombres siempre dirigen", truth: "El liderazgo eficaz se basa en la escucha, la ética y la preparación, sin distinción de sexo.", color: "#ec4899" },
      { myth: "Los celos demuestran amor", truth: "Los celos reflejan inseguridad y afán de control; el amor sano respeta la libertad.", color: "#ef4444" },
    ],
  },
];

export default function MuroDeLosMitos() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [levelIdx, setLevelIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [unlockedTruths, setUnlockedTruths] = useState<{ myth: string; truth: string }[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const currentLevel = LEVELS[levelIdx];

  const stateRef = useRef({
    paddleX: 185,
    paddleW: 90,
    paddleH: 12,
    ballX: 230,
    ballY: 240,
    ballDX: 3,
    ballDY: -3,
    ballR: 7,
    bricks: [] as Brick[],
    animationFrameId: 0,
  });

  const initBricks = useCallback((lvlIndex: number) => {
    const myths = LEVELS[lvlIndex].myths;
    const cols = 3;
    const rows = Math.ceil(myths.length / cols);
    const brickW = 135;
    const brickH = 26;
    const gap = 12;
    const startX = 20;
    const startY = 30;

    const newBricks: Brick[] = [];
    myths.forEach((item, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      newBricks.push({
        x: startX + c * (brickW + gap),
        y: startY + r * (brickH + gap),
        w: brickW,
        h: brickH,
        myth: item.myth,
        truth: item.truth,
        alive: true,
        color: item.color,
      });
    });

    stateRef.current.bricks = newBricks;
  }, []);

  const resetGame = (newLevelIdx = levelIdx) => {
    sound.playPowerup();
    stateRef.current.ballX = 230;
    stateRef.current.ballY = 240;
    stateRef.current.ballDX = Math.random() > 0.5 ? 3.2 : -3.2;
    stateRef.current.ballDY = -3.5;
    stateRef.current.paddleX = 185;
    initBricks(newLevelIdx);
    setGameOver(false);
    setGameWon(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    initBricks(levelIdx);
  }, [levelIdx, initBricks]);

  // Main canvas loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      const state = stateRef.current;
      const { width, height } = canvas;

      ctx.clearRect(0, 0, width, height);

      // Draw Bricks
      let aliveCount = 0;
      state.bricks.forEach((b) => {
        if (!b.alive) return;
        aliveCount++;

        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 6);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.myth, b.x + b.w / 2, b.y + b.h / 2);
      });

      if (aliveCount === 0 && !gameWon) {
        setGameWon(true);
        setIsPlaying(false);
        sound.playCelebration();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        return;
      }

      // Draw Paddle
      ctx.fillStyle = "#4f46e5";
      ctx.beginPath();
      ctx.roundRect(state.paddleX, height - 24, state.paddleW, state.paddleH, 6);
      ctx.fill();

      // Draw Ball
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, state.ballR, 0, Math.PI * 2);
      ctx.fill();

      // Movement
      state.ballX += state.ballDX;
      state.ballY += state.ballDY;

      // Wall Bounce
      if (state.ballX - state.ballR <= 0 || state.ballX + state.ballR >= width) {
        state.ballDX = -state.ballDX;
        sound.playClick();
      }
      if (state.ballY - state.ballR <= 0) {
        state.ballDY = -state.ballDY;
        sound.playClick();
      }

      // Paddle Bounce
      if (state.ballY + state.ballR >= height - 24) {
        if (
          state.ballX >= state.paddleX - 4 &&
          state.ballX <= state.paddleX + state.paddleW + 4
        ) {
          const hitOffset = (state.ballX - (state.paddleX + state.paddleW / 2)) / (state.paddleW / 2);
          state.ballDX = hitOffset * 4.5;
          state.ballDY = -Math.abs(state.ballDY);
          sound.playClick();
        } else if (state.ballY - state.ballR > height) {
          setGameOver(true);
          setIsPlaying(false);
          sound.playAlert();
          return;
        }
      }

      // Bricks Collision
      state.bricks.forEach((b) => {
        if (!b.alive) return;
        if (
          state.ballX > b.x &&
          state.ballX < b.x + b.w &&
          state.ballY - state.ballR < b.y + b.h &&
          state.ballY + state.ballR > b.y
        ) {
          b.alive = false;
          state.ballDY = -state.ballDY;
          sound.playCorrect();
          setScore((s) => s + 100);
          setUnlockedTruths((prev) => [{ myth: b.myth, truth: b.truth }, ...prev]);
        }
      });

      state.animationFrameId = requestAnimationFrame(loop);
    };

    stateRef.current.animationFrameId = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(stateRef.current.animationFrameId);
    };
  }, [isPlaying, gameWon]);

  // Touch and Mouse handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    stateRef.current.paddleX = Math.max(0, Math.min(canvas.width - stateRef.current.paddleW, mouseX - stateRef.current.paddleW / 2));
  };

  const movePaddleStep = (delta: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    stateRef.current.paddleX = Math.max(0, Math.min(canvas.width - stateRef.current.paddleW, stateRef.current.paddleX + delta));
  };

  return (
    <div className="bg-gradient-to-br from-white via-rose-50/20 to-orange-50/20 rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <Zap className="w-4 h-4" /> Nivel Intermedio (10-13 años) • Arcade Breakout
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
            🧱 El Muro de los Mitos
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            {currentLevel.description}
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                setLevelIdx(0);
                resetGame(0);
              }}
              className={`px-3 py-1 rounded-xl transition-all ${
                levelIdx === 0 ? "bg-white text-rose-700 shadow-sm" : "text-slate-600"
              }`}
            >
              Fase 1
            </button>
            <button
              onClick={() => {
                setLevelIdx(1);
                resetGame(1);
              }}
              className={`px-3 py-1 rounded-xl transition-all ${
                levelIdx === 1 ? "bg-white text-rose-700 shadow-sm" : "text-slate-600"
              }`}
            >
              Fase 2
            </button>
          </div>

          <div className="text-right ml-2">
            <span className="text-[10px] text-slate-400 font-bold block">Puntaje</span>
            <span className="text-lg font-black text-rose-600">{score}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-start">
        {/* Canvas Arcade Area */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="relative rounded-3xl overflow-hidden border-4 border-slate-900 bg-slate-950 shadow-2xl w-full max-w-[460px]">
            <canvas
              ref={canvasRef}
              width={460}
              height={320}
              onMouseMove={handleMouseMove}
              className="w-full h-auto cursor-ew-resize block"
            />

            {!isPlaying && !gameOver && !gameWon && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                <Zap className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
                <h3 className="font-black text-lg">{currentLevel.title}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xs">
                  Mueve la paleta inferior para rebotar la esfera de la verdad y desarticular estereotipos.
                </p>
                <button
                  onClick={() => resetGame()}
                  className="mt-4 px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 font-black text-xs text-white shadow-lg transition-all"
                >
                  ¡Iniciar Partida!
                </button>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-rose-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                <p className="text-2xl font-black text-rose-300">¡La esfera cayó!</p>
                <p className="text-xs text-slate-200 mt-1">No te preocupes, puedes reintentar y derribar todos los mitos.</p>
                <button
                  onClick={() => resetGame()}
                  className="mt-4 px-5 py-2.5 rounded-2xl bg-white text-rose-900 font-black text-xs shadow hover:bg-rose-100"
                >
                  Reintentar Fase
                </button>
              </div>
            )}

            {gameWon && (
              <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                <Award className="w-12 h-12 text-yellow-300 mb-1" />
                <p className="text-2xl font-black text-emerald-300">¡Fase Superada!</p>
                <p className="text-xs text-emerald-100 mt-1">Has desmitificado los prejuicios de esta etapa con éxito.</p>
                <button
                  onClick={() => {
                    const next = levelIdx === 0 ? 1 : 0;
                    setLevelIdx(next);
                    resetGame(next);
                  }}
                  className="mt-4 px-5 py-2.5 rounded-2xl bg-emerald-500 font-black text-xs text-white shadow hover:bg-emerald-400"
                >
                  {levelIdx === 0 ? "Pasar a la Fase 2 ➡️" : "Volver a jugar"}
                </button>
              </div>
            )}
          </div>

          {/* On-screen tactile paddle controls */}
          <div className="flex items-center gap-3 mt-3 w-full max-w-[460px] justify-between">
            <button
              onClick={() => movePaddleStep(-35)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Mover Izquierda
            </button>
            <button
              onClick={() => movePaddleStep(35)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              Mover Derecha <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Unlocked Truths Column */}
        <div className="md:col-span-5 bg-white rounded-3xl p-5 border-2 border-slate-200/80 shadow-md h-[370px] flex flex-col">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-rose-100 text-rose-800">✨</span>
            <span>Verdades Reveladas ({unlockedTruths.length}):</span>
          </h4>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {unlockedTruths.map((item, i) => (
              <div
                key={i}
                className="bg-slate-50 p-3 rounded-2xl border-l-4 border-l-rose-500 border border-slate-200 text-xs shadow-xs"
              >
                <span className="text-rose-700 font-bold line-through block text-[11px]">
                  Mito: &ldquo;{item.myth}&rdquo;
                </span>
                <p className="text-slate-800 font-semibold mt-1">
                  💡 Realidad: {item.truth}
                </p>
              </div>
            ))}

            {unlockedTruths.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
                <p className="text-xs italic">
                  Haz rebotar la bola para romper bloques y descubrir reflexiones sobre equidad y derechos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
