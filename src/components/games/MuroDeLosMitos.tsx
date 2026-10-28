"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Zap, Play, RotateCcw, ShieldAlert, Award } from "lucide-react";

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

const MYTH_DATA = [
  { myth: "Los hombres no lloran", truth: "Llorar es una respuesta humana saludable que libera emociones.", color: "#f43f5e" },
  { myth: "Las niñas son débiles", truth: "La fuerza, liderazgo y tenacidad no dependen del género.", color: "#ec4899" },
  { myth: "El rosa es solo de niñas", truth: "Los colores son luz y percepción, no tienen asignación de género.", color: "#a855f7" },
  { myth: "Cocinar es de mujeres", truth: "Alimentarse y cocinar son habilidades universales de supervivencia.", color: "#6366f1" },
  { myth: "Ellas visten para provocar", truth: "La vestimenta es expresión personal; el respeto es una obligación absoluta.", color: "#0ea5e9" },
  { myth: "Los celos demuestran amor", truth: "Los celos representan posesión e inseguridad, nunca afecto sano.", color: "#10b981" },
];

export default function MuroDeLosMitos() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [unlockedTruths, setUnlockedTruths] = useState<{ myth: string; truth: string }[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  // Game physical parameters in ref to avoid recreation
  const stateRef = useRef({
    paddleX: 190,
    paddleW: 90,
    paddleH: 12,
    ballX: 235,
    ballY: 260,
    ballDX: 3,
    ballDY: -3,
    ballR: 7,
    bricks: [] as Brick[],
    animationFrameId: 0,
  });

  const initBricks = useCallback(() => {
    const cols = 3;
    const rows = 2;
    const brickW = 130;
    const brickH = 26;
    const gap = 12;
    const startX = 25;
    const startY = 30;

    const newBricks: Brick[] = [];
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const item = MYTH_DATA[idx % MYTH_DATA.length];
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
        idx++;
      }
    }
    stateRef.current.bricks = newBricks;
  }, []);

  const resetGame = () => {
    stateRef.current.ballX = 235;
    stateRef.current.ballY = 240;
    stateRef.current.ballDX = (Math.random() > 0.5 ? 3 : -3);
    stateRef.current.ballDY = -3.5;
    stateRef.current.paddleX = 190;
    initBricks();
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setUnlockedTruths([]);
    setIsPlaying(true);
  };

  useEffect(() => {
    initBricks();
  }, [initBricks]);

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

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Draw Bricks
      let aliveCount = 0;
      state.bricks.forEach((b) => {
        if (!b.alive) return;
        aliveCount++;

        // Brick body
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 6);
        ctx.fill();

        // Myth Text inside brick
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.myth, b.x + b.w / 2, b.y + b.h / 2);
      });

      if (aliveCount === 0 && !gameWon) {
        setGameWon(true);
        setIsPlaying(false);
        return;
      }

      // Draw Paddle
      ctx.fillStyle = "#4f46e5";
      ctx.beginPath();
      ctx.roundRect(state.paddleX, height - 25, state.paddleW, state.paddleH, 6);
      ctx.fill();

      // Draw Ball
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, state.ballR, 0, Math.PI * 2);
      ctx.fill();

      // Ball Movement
      state.ballX += state.ballDX;
      state.ballY += state.ballDY;

      // Wall Collision (Left / Right)
      if (state.ballX - state.ballR <= 0 || state.ballX + state.ballR >= width) {
        state.ballDX = -state.ballDX;
      }

      // Wall Collision (Top)
      if (state.ballY - state.ballR <= 0) {
        state.ballDY = -state.ballDY;
      }

      // Bottom Collision / Paddle Hit
      if (state.ballY + state.ballR >= height - 25) {
        if (
          state.ballX >= state.paddleX - 4 &&
          state.ballX <= state.paddleX + state.paddleW + 4
        ) {
          // Bounce with slight angle according to hit position
          const hitOffset = (state.ballX - (state.paddleX + state.paddleW / 2)) / (state.paddleW / 2);
          state.ballDX = hitOffset * 4.5;
          state.ballDY = -Math.abs(state.ballDY);
        } else if (state.ballY - state.ballR > height) {
          // Fell down
          setGameOver(true);
          setIsPlaying(false);
          return;
        }
      }

      // Brick Collision Detection
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
          setScore((s) => s + 100);
          setUnlockedTruths((prev) => [
            { myth: b.myth, truth: b.truth },
            ...prev,
          ]);
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

  // Handle paddle dragging / mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const newX = mouseX - stateRef.current.paddleW / 2;
    stateRef.current.paddleX = Math.max(0, Math.min(canvas.width - stateRef.current.paddleW, newX));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const newX = touchX - stateRef.current.paddleW / 2;
    stateRef.current.paddleX = Math.max(0, Math.min(canvas.width - stateRef.current.paddleW, newX));
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <Zap className="w-4 h-4" /> Nivel Intermedio (10-13 años) • Arcade Breakout
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
            🧱 El Muro de los Mitos
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Controla la paleta para destruir los bloques de micromachismos y desbloquear reflexiones de equidad.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-semibold block">Puntaje</span>
            <span className="text-xl font-black text-rose-600">{score}</span>
          </div>
          {!isPlaying ? (
            <button
              onClick={resetGame}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              <Play className="w-4 h-4 fill-white" /> {gameOver || gameWon ? "Jugar de nuevo" : "Iniciar Juego"}
            </button>
          ) : (
            <button
              onClick={() => setIsPlaying(false)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Pausar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-start">
        {/* Canvas Area */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="relative rounded-2xl overflow-hidden border-4 border-slate-800 bg-slate-900 shadow-inner w-full max-w-[460px]">
            <canvas
              ref={canvasRef}
              width={460}
              height={320}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="w-full h-auto cursor-ew-resize block"
            />

            {!isPlaying && !gameOver && !gameWon && (
              <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center p-6 text-center text-white">
                <ShieldAlert className="w-12 h-12 text-rose-400 mb-2" />
                <h3 className="font-bold text-lg">Mueve el mouse o dedo</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xs">
                  Haz rebotar la esfera contra los ladrillos para derribar mitos machistas y revelar derechos.
                </p>
                <button
                  onClick={resetGame}
                  className="mt-4 px-5 py-2 rounded-xl bg-rose-600 font-bold text-xs text-white shadow-lg hover:bg-rose-500"
                >
                  ¡Comenzar ahora!
                </button>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-rose-950/85 flex flex-col items-center justify-center p-6 text-center text-white">
                <p className="text-2xl font-black text-rose-300">¡Inténtalo otra vez!</p>
                <p className="text-xs text-slate-200 mt-1">La bola cayó, pero puedes derribar todos los mitos.</p>
                <button
                  onClick={resetGame}
                  className="mt-4 px-5 py-2 rounded-xl bg-white text-rose-900 font-black text-xs shadow hover:bg-rose-100"
                >
                  Reiniciar partida
                </button>
              </div>
            )}

            {gameWon && (
              <div className="absolute inset-0 bg-emerald-950/85 flex flex-col items-center justify-center p-6 text-center text-white">
                <Award className="w-12 h-12 text-yellow-300 mb-1" />
                <p className="text-2xl font-black text-emerald-300">¡Muro Derribado!</p>
                <p className="text-xs text-emerald-100 mt-1">Has desarticulado todos los estereotipos del nivel.</p>
                <button
                  onClick={resetGame}
                  className="mt-4 px-5 py-2 rounded-xl bg-emerald-500 font-black text-xs text-white shadow hover:bg-emerald-400"
                >
                  Jugar de nuevo
                </button>
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-500 mt-2">
            Mueve horizontalmente la barra inferior para no dejar caer la esfera.
          </span>
        </div>

        {/* Unlocked Truths Column */}
        <div className="md:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 h-[340px] flex flex-col">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
            <span>✨ Mensajes Desbloqueados ({unlockedTruths.length}/6):</span>
          </h4>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {unlockedTruths.map((item, i) => (
              <div
                key={i}
                className="bg-white p-3 rounded-xl border-l-4 border-l-rose-500 border border-slate-200 shadow-sm text-xs"
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
                  Destruye ladrillos en el juego para desmentir prejuicios y micromachismos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
