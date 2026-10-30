"use client";

import React, { useRef, useEffect, useState } from "react";
import { Shield, Play, RotateCcw, Heart, AlertTriangle, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { sound } from "@/utils/audio";

interface FallingEntity {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: "toxic" | "emotion";
  text: string;
  icon: string;
}

const EMOTIONS = [
  { text: "Llorar por tristeza", icon: "💧" },
  { text: "Pedir un abrazo", icon: "🤗" },
  { text: "Sentir miedo", icon: "❤️" },
  { text: "Mostrar ternura", icon: "🌸" },
  { text: "Pedir ayuda", icon: "🤝" },
  { text: "Expresar dudas", icon: "💬" },
];

const TOXIC_MANDATES = [
  { text: "Los hombres no lloran", icon: "🛑" },
  { text: "No muestres debilidad", icon: "🚫" },
  { text: "Pelea a golpes", icon: "👊" },
  { text: "Imponte a la fuerza", icon: "⚠️" },
  { text: "Las emociones son de débiles", icon: "⛔" },
];

export default function EscudoEmocional() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [recentAction, setRecentAction] = useState<string>("¡Atrapa emociones sanas y esquiva presiones machistas!");
  const [gameOver, setGameOver] = useState<boolean>(false);

  const stateRef = useRef({
    playerX: 200,
    playerY: 280,
    playerW: 70,
    playerH: 28,
    entities: [] as FallingEntity[],
    nextId: 1,
    lastSpawn: 0,
    animationId: 0,
  });

  const resetGame = () => {
    sound.playPowerup();
    stateRef.current.entities = [];
    stateRef.current.playerX = 200;
    setScore(0);
    setLives(3);
    setGameOver(false);
    setRecentAction("¡Muévete para capturar emociones saludables y esquivar presiones!");
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;

    const loop = (timestamp: number) => {
      if (!isRunning) return;

      const state = stateRef.current;
      const { width, height } = canvas;

      // Spawn items
      if (timestamp - state.lastSpawn > 1150) {
        state.lastSpawn = timestamp;
        const isEmotion = Math.random() > 0.45;
        const pool = isEmotion ? EMOTIONS : TOXIC_MANDATES;
        const chosen = pool[Math.floor(Math.random() * pool.length)];

        state.entities.push({
          id: state.nextId++,
          x: Math.random() * (width - 120) + 15,
          y: -20,
          speed: 1.8 + Math.random() * 1.3,
          type: isEmotion ? "emotion" : "toxic",
          text: chosen.text,
          icon: chosen.icon,
        });
      }

      ctx.clearRect(0, 0, width, height);

      // Draw Player Shield
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.roundRect(state.playerX, state.playerY, state.playerW, state.playerH, 8);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🛡️ Escudo", state.playerX + state.playerW / 2, state.playerY + state.playerH / 2);

      const remaining: FallingEntity[] = [];

      for (const ent of state.entities) {
        ent.y += ent.speed;

        const hitX = ent.x + 45 > state.playerX && ent.x < state.playerX + state.playerW;
        const hitY = ent.y + 16 > state.playerY && ent.y < state.playerY + state.playerH;

        if (hitX && hitY) {
          if (ent.type === "emotion") {
            sound.playCorrect();
            setScore((s) => s + 50);
            setRecentAction(`✨ ¡Excelente! Integraste: "${ent.text}"`);
          } else {
            sound.playAlert();
            setLives((l) => {
              const updated = l - 1;
              if (updated <= 0) {
                setGameOver(true);
                setIsPlaying(false);
              }
              return updated;
            });
            setRecentAction(`⚠️ ¡Cuidado con el mandato: "${ent.text}"!`);
          }
          continue;
        }

        if (ent.y < height + 30) {
          ctx.fillStyle = ent.type === "emotion" ? "#10b981" : "#ef4444";
          ctx.beginPath();
          ctx.roundRect(ent.x, ent.y, 115, 24, 6);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${ent.icon} ${ent.text}`, ent.x + 57, ent.y + 12);

          remaining.push(ent);
        }
      }

      state.entities = remaining;
      state.animationId = requestAnimationFrame(loop);
    };

    stateRef.current.animationId = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(stateRef.current.animationId);
    };
  }, [isPlaying]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    stateRef.current.playerX = Math.max(0, Math.min(canvas.width - stateRef.current.playerW, mouseX - stateRef.current.playerW / 2));
  };

  const movePaddleStep = (delta: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    stateRef.current.playerX = Math.max(0, Math.min(canvas.width - stateRef.current.playerW, stateRef.current.playerX + delta));
  };

  return (
    <div className="bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/20 rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
            <Shield className="w-4 h-4" /> Nivel Intermedio (10-13 años) • Nuevas Masculinidades
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
            🛡️ El Escudo Emocional
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Usa el escudo para acoger emociones saludables y esquivar imposiciones de violencia o machismo.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${i < lives ? "text-rose-500 fill-rose-500" : "text-slate-200"}`}
              />
            ))}
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block">Puntos</span>
            <span className="text-xl font-black text-cyan-700">{score}</span>
          </div>

          {!isPlaying ? (
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              <Play className="w-4 h-4 fill-white inline mr-1" /> {gameOver ? "Reintentar" : "Jugar"}
            </button>
          ) : (
            <button
              onClick={() => setIsPlaying(false)}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
        {/* Canvas Area */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="relative rounded-3xl overflow-hidden border-4 border-slate-900 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 shadow-2xl w-full max-w-[480px]">
            <canvas
              ref={canvasRef}
              width={480}
              height={320}
              onMouseMove={handleMouseMove}
              className="w-full h-auto cursor-ew-resize block"
            />

            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                <Shield className="w-12 h-12 text-cyan-400 mb-2 animate-bounce" />
                <h3 className="font-black text-lg">Mueve tu escudo protector</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xs">
                  🟢 Atrapa las emociones humanas saludables. <br />
                  🔴 Esquiva mandatos machistas que reprimen o agreden.
                </p>
                <button
                  onClick={resetGame}
                  className="mt-4 px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 font-black text-xs text-slate-950 shadow-lg"
                >
                  ¡Comenzar!
                </button>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-rose-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                <AlertTriangle className="w-12 h-12 text-yellow-300 mb-1" />
                <p className="text-2xl font-black text-rose-200">¡Presión acumulada!</p>
                <p className="text-xs text-slate-300 mt-1 max-w-xs">
                  Recuerda: expresar lo que sientes y pedir ayuda es de personas valientes.
                </p>
                <button
                  onClick={resetGame}
                  className="mt-4 px-5 py-2.5 rounded-2xl bg-white text-rose-900 font-black text-xs shadow hover:bg-rose-100"
                >
                  Jugar otra vez
                </button>
              </div>
            )}
          </div>

          {/* Touch paddle controls */}
          <div className="flex items-center gap-3 mt-3 w-full max-w-[480px] justify-between">
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

          <div className="w-full max-w-[480px] mt-2 px-3 py-2 bg-slate-100 rounded-2xl text-center text-xs font-bold text-slate-700">
            {recentAction}
          </div>
        </div>

        {/* Legend */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200">
            <h4 className="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
              <span>🟢 Emociones válidas (+50 pts):</span>
            </h4>
            <ul className="text-xs text-emerald-800 space-y-1.5 mt-2 font-medium">
              <li>• Llorar ante la pérdida o tristeza</li>
              <li>• Pedir un abrazo o consuelo</li>
              <li>• Expresar dudas y vulnerabilidad</li>
              <li>• Actuar con ternura y empatía</li>
            </ul>
          </div>

          <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200">
            <h4 className="text-xs font-black uppercase text-rose-900 flex items-center gap-1.5">
              <span>🔴 Mandatos machistas (-1 vida):</span>
            </h4>
            <ul className="text-xs text-rose-800 space-y-1.5 mt-2 font-medium">
              <li>• &ldquo;Los hombres no lloran&rdquo;</li>
              <li>• Resolver desacuerdos a golpes</li>
              <li>• Aparentar insensibilidad o dureza extrema</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
