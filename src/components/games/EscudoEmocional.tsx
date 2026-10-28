"use client";

import React, { useRef, useEffect, useState } from "react";
import { Shield, Play, RotateCcw, Heart, AlertTriangle } from "lucide-react";

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
  { text: "Aguántate como hombre", icon: "🛑" },
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
    playerW: 60,
    playerH: 28,
    entities: [] as FallingEntity[],
    nextId: 1,
    lastSpawn: 0,
    animationId: 0,
  });

  const resetGame = () => {
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

      // Spawn falling entities periodically
      if (timestamp - state.lastSpawn > 1100) {
        state.lastSpawn = timestamp;
        const isEmotion = Math.random() > 0.45;
        const pool = isEmotion ? EMOTIONS : TOXIC_MANDATES;
        const chosen = pool[Math.floor(Math.random() * pool.length)];

        state.entities.push({
          id: state.nextId++,
          x: Math.random() * (width - 120) + 20,
          y: -20,
          speed: 1.8 + Math.random() * 1.4,
          type: isEmotion ? "emotion" : "toxic",
          text: chosen.text,
          icon: chosen.icon,
        });
      }

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Draw Player Shield / Character
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.roundRect(state.playerX, state.playerY, state.playerW, state.playerH, 8);
      ctx.fill();

      // Shield badge on player
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🛡️ Escudo", state.playerX + state.playerW / 2, state.playerY + state.playerH / 2);

      // Update & Draw Entities
      const remaining: FallingEntity[] = [];

      for (const ent of state.entities) {
        ent.y += ent.speed;

        // Collision check with player shield
        const hitX = ent.x + 40 > state.playerX && ent.x < state.playerX + state.playerW;
        const hitY = ent.y + 15 > state.playerY && ent.y < state.playerY + state.playerH;

        if (hitX && hitY) {
          if (ent.type === "emotion") {
            setScore((s) => s + 50);
            setRecentAction(`✨ ¡Excelente! Integraste: "${ent.text}"`);
          } else {
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
          continue; // Item absorbed/hit, don't keep it
        }

        // Draw Entity if still on screen
        if (ent.y < height + 30) {
          ctx.fillStyle = ent.type === "emotion" ? "#10b981" : "#ef4444";
          ctx.beginPath();
          ctx.roundRect(ent.x, ent.y, 110, 24, 6);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${ent.icon} ${ent.text}`, ent.x + 55, ent.y + 12);

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

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    stateRef.current.playerX = Math.max(0, Math.min(canvas.width - stateRef.current.playerW, touchX - stateRef.current.playerW / 2));
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800">
            <Shield className="w-4 h-4" /> Nivel Intermedio (10-13 años) • Nuevas Masculinidades
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
            🛡️ El Escudo Emocional
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Usa el escudo para recibir tus emociones válidas y esquivar mandatos tóxicos de invulnerabilidad.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Lives */}
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${i < lives ? "text-rose-500 fill-rose-500" : "text-slate-300"}`}
              />
            ))}
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 font-semibold block">Puntos</span>
            <span className="text-xl font-black text-cyan-700">{score}</span>
          </div>

          {!isPlaying ? (
            <button
              onClick={resetGame}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              <Play className="w-4 h-4 fill-white" /> {gameOver ? "Reintentar" : "Jugar"}
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
        {/* Game Canvas */}
        <div className="md:col-span-8 flex flex-col items-center">
          <div className="relative rounded-2xl overflow-hidden border-4 border-slate-800 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 shadow-inner w-full max-w-[480px]">
            <canvas
              ref={canvasRef}
              width={480}
              height={330}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="w-full h-auto cursor-ew-resize block"
            />

            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center p-6 text-center text-white">
                <Shield className="w-12 h-12 text-cyan-400 mb-2 animate-bounce" />
                <h3 className="font-bold text-lg">Mueve tu escudo</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xs">
                  🟢 Atrapa rectángulos verdes (emociones sanas). <br />
                  🔴 Esquiva mandatos rojos que ordenan callar o pelear.
                </p>
                <button
                  onClick={resetGame}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-bold text-xs text-slate-950 shadow-lg"
                >
                  ¡Iniciar sesión!
                </button>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-rose-950/85 flex flex-col items-center justify-center p-6 text-center text-white">
                <AlertTriangle className="w-12 h-12 text-yellow-300 mb-1" />
                <p className="text-2xl font-black text-rose-200">¡Presión acumulada!</p>
                <p className="text-xs text-slate-300 mt-1 max-w-xs">
                  Recuerda: pedir ayuda y expresar lo que sientes es de personas valientes, no débiles.
                </p>
                <button
                  onClick={resetGame}
                  className="mt-4 px-5 py-2 rounded-xl bg-white text-rose-900 font-black text-xs shadow hover:bg-rose-100"
                >
                  Jugar otra vez
                </button>
              </div>
            )}
          </div>

          <div className="w-full max-w-[480px] mt-2 px-3 py-2 bg-slate-100 rounded-xl text-center text-xs font-semibold text-slate-700">
            {recentAction}
          </div>
        </div>

        {/* Legend / Pedagogical Guide */}
        <div className="md:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <h4 className="text-xs font-bold uppercase text-emerald-900 flex items-center gap-1.5">
              <span>🟢 Emociones a validar (+50 pts):</span>
            </h4>
            <ul className="text-xs text-emerald-800 space-y-1.5 mt-2 font-medium">
              <li>• Llorar ante la pérdida o tristeza</li>
              <li>• Pedir un abrazo o consuelo</li>
              <li>• Expresar dudas y vulnerabilidad</li>
              <li>• Actuar con ternura y empatía</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <h4 className="text-xs font-bold uppercase text-rose-900 flex items-center gap-1.5">
              <span>🔴 Mandatos tóxicos a esquivar (-1 vida):</span>
            </h4>
            <ul className="text-xs text-rose-800 space-y-1.5 mt-2 font-medium">
              <li>• &ldquo;Los hombres no lloran&rdquo;</li>
              <li>• Resolver conflictos con violencia física</li>
              <li>• Obligación de aparentar invulnerabilidad</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
