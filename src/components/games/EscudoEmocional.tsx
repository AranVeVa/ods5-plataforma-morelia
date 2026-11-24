"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Shield, Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import GameShell, { DifficultyLevel } from "@/components/common/GameShell";
import Button3D from "@/components/common/Button3D";
import {
  HEALTHY_EMOTIONS_POOL,
  TOXIC_MANDATES_POOL,
  ESCUDO_WORLDS,
  ESCUDO_TUTORIAL,
  EmotionEntityData,
} from "@/content/game5-escudo";
import { useSound } from "@/hooks/useSound";

interface GameProps {
  onHome?: () => void;
  onNextGame?: () => void;
}

interface FallingEntity {
  id: number;
  x: number;
  y: number;
  speed: number;
  kind: "emotion" | "toxic" | "powerup";
  label: string;
  icon: string;
  explanation: string;
}

function EscudoGameplay({
  difficulty,
  onComplete,
}: {
  difficulty: DifficultyLevel;
  onComplete: (
    stars: 0 | 1 | 2 | 3,
    score: number,
    maxScore: number,
    msg: string,
    extraContent?: React.ReactNode
  ) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { playShield, playCorrect, playAlert, playPowerup, playClick } = useSound();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [wellness, setWellness] = useState(85);
  const [shieldEnergy, setShieldEnergy] = useState(100);
  const [score, setScore] = useState(0);
  const [worldIdx, setWorldIdx] = useState(0);
  const [recentMsg, setRecentMsg] = useState("¡Atrapa emociones sanas! Tu escudo repele mandatos dañinos automáticamente.");

  const targetScore = difficulty === "facil" ? 400 : difficulty === "normal" ? 650 : 900;

  const stateRef = useRef({
    playerX: 200,
    playerW: 76,
    entities: [] as FallingEntity[],
    nextId: 1,
    lastSpawn: 0,
    lastTime: 0,
    shieldFlashUntil: 0,
    shieldEnergy: 100,
    wellness: 85,
    score: 0,
    caught: {} as Record<string, { count: number; explanation: string; icon: string }>,
    deflected: {} as Record<string, { count: number; explanation: string; icon: string }>,
    finished: false,
    currentWorldIdx: 0,
    lastUiShieldEnergy: 100,
  });

  const resetGame = useCallback(() => {
    const g = stateRef.current;
    g.playerX = 200;
    g.entities = [];
    g.shieldFlashUntil = 0;
    g.shieldEnergy = 100;
    g.wellness = 85;
    g.score = 0;
    g.caught = {};
    g.deflected = {};
    g.finished = false;
    g.currentWorldIdx = 0;
    setWellness(85);
    setShieldEnergy(100);
    setScore(0);
    setWorldIdx(0);
    setRecentMsg("¡Listo! Muévete a los lados para cuidar tu bienestar emocional.");
  }, []);

  // Controles de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused) return;
      const g = stateRef.current;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        g.playerX = Math.max(8, g.playerX - 42);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        g.playerX = Math.min(480 - g.playerW - 8, g.playerX + 42);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying, isPaused]);

  // Loop de Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    stateRef.current.lastTime = performance.now();

    const loop = (now: number) => {
      const g = stateRef.current;
      const dt = Math.min((now - g.lastTime) / 1000, 0.05);
      g.lastTime = now;

      // Determinación del mundo según el puntaje alcanzado
      const currentIdx =
        g.score >= targetScore * 0.66 ? 2 : g.score >= targetScore * 0.33 ? 1 : 0;
      const world = ESCUDO_WORLDS[currentIdx];

      if (isPlaying && !isPaused && !g.finished) {
        if (currentIdx !== g.currentWorldIdx) {
          g.currentWorldIdx = currentIdx;
          setWorldIdx(currentIdx);
        }
        // Recarga continua y automática del escudo (+14% por segundo)
        g.shieldEnergy = Math.min(100, g.shieldEnergy + dt * 14);
        const roundedEnergy = Math.round(g.shieldEnergy);
        if (roundedEnergy !== g.lastUiShieldEnergy) {
          g.lastUiShieldEnergy = roundedEnergy;
          setShieldEnergy(roundedEnergy);
        }

        // Aparición de entidades
        const spawnEvery = difficulty === "facil" ? 1150 : difficulty === "normal" ? 950 : 780;
        if (now - g.lastSpawn > spawnEvery) {
          g.lastSpawn = now;
          const roll = Math.random();
          if (roll < 0.12) {
            g.entities.push({
              id: g.nextId++,
              x: 20 + Math.random() * (canvas.width - 120),
              y: -24,
              speed: 95 * world.speedMultiplier,
              kind: "powerup",
              label: "Recarga Escudo",
              icon: "⚡",
              explanation: "¡Energía del escudo y bienestar restablecidos al 100%!",
            });
          } else if (roll < 0.58) {
            const em: EmotionEntityData =
              HEALTHY_EMOTIONS_POOL[Math.floor(Math.random() * HEALTHY_EMOTIONS_POOL.length)];
            g.entities.push({
              id: g.nextId++,
              x: 20 + Math.random() * (canvas.width - 130),
              y: -24,
              speed: (90 + Math.random() * 35) * world.speedMultiplier,
              kind: "emotion",
              label: em.shortLabel,
              icon: em.icon,
              explanation: em.explanation,
            });
          } else {
            const tx: EmotionEntityData =
              TOXIC_MANDATES_POOL[Math.floor(Math.random() * TOXIC_MANDATES_POOL.length)];
            g.entities.push({
              id: g.nextId++,
              x: 20 + Math.random() * (canvas.width - 130),
              y: -24,
              speed: (100 + Math.random() * 45) * world.speedMultiplier,
              kind: "toxic",
              label: tx.shortLabel,
              icon: tx.icon,
              explanation: tx.explanation,
            });
          }
        }

        const playerY = canvas.height - 52;

        g.entities = g.entities.filter((ent) => {
          ent.y += ent.speed * dt;
          const hit =
            ent.y + 28 >= playerY &&
            ent.y <= playerY + 34 &&
            ent.x + 112 >= g.playerX &&
            ent.x <= g.playerX + g.playerW;

          if (hit) {
            if (ent.kind === "powerup") {
              playPowerup();
              g.shieldEnergy = 100;
              g.wellness = Math.min(100, g.wellness + 15);
              setRecentMsg(ent.explanation);
            } else if (ent.kind === "emotion") {
              playCorrect();
              g.score += 75;
              g.wellness = Math.min(100, g.wellness + 8);
              const prevItem = g.caught[ent.label] || {
                count: 0,
                explanation: ent.explanation,
                icon: ent.icon,
              };
              g.caught[ent.label] = { ...prevItem, count: prevItem.count + 1 };
              setScore(g.score);
              setRecentMsg(`✓ ${ent.label}: ${ent.explanation}`);
            } else {
              // Mandato tóxico: si el escudo tiene al menos 18% de energía, repele automáticamente
              if (g.shieldEnergy >= 18) {
                playShield();
                g.shieldEnergy = Math.max(0, g.shieldEnergy - 18);
                g.shieldFlashUntil = now + 400; // Efecto visual de cúpula
                g.score += 40;
                const prevTx = g.deflected[ent.label] || {
                  count: 0,
                  explanation: ent.explanation,
                  icon: ent.icon,
                };
                g.deflected[ent.label] = { ...prevTx, count: prevTx.count + 1 };
                setScore(g.score);
                setRecentMsg(`🛡️ Escudo repelió "${ent.label}" con éxito.`);
              } else {
                playAlert();
                g.wellness = Math.max(0, g.wellness - 20);
                setRecentMsg(`⚠️ "${ent.label}": ${ent.explanation}`);
              }
            }
            setWellness(g.wellness);
            return false;
          }
          return ent.y < canvas.height + 30;
        });

        // Generar componente de revisión para leer al final
        const createReviewContent = () => (
          <div className="space-y-4">
            <div className="border-b border-cyan-200 pb-2">
              <h4 className="font-black text-sm text-cyan-950 flex items-center gap-1.5">
                <span>📖</span> Resumen Socioemocional para Leer con Calma
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Conoce por qué las emociones que viviste son clave para una vida libre y sana:
              </p>
            </div>

            {/* Emociones sanas atrapadas */}
            <div className="space-y-2">
              <p className="text-xs font-black text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                <span>💚</span> Emociones sanas expresadas:
              </p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {Object.entries(g.caught).length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-xl">
                    No atrapaste emociones en este intento. ¡Inténtalo de nuevo!
                  </p>
                ) : (
                  Object.entries(g.caught).map(([label, info]) => (
                    <div
                      key={label}
                      className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 text-xs"
                    >
                      <span className="font-black text-emerald-950">
                        {info.icon} {label} (×{info.count}):
                      </span>{" "}
                      <span className="text-slate-700">{info.explanation}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Mandatos repelidos */}
            <div className="space-y-2">
              <p className="text-xs font-black text-rose-800 uppercase tracking-wide flex items-center gap-1">
                <span>🛑</span> Mandatos rígidos repelidos por tu escudo:
              </p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {Object.entries(g.deflected).length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-xl">
                    Ningún mandato repelido aún.
                  </p>
                ) : (
                  Object.entries(g.deflected).map(([label, info]) => (
                    <div
                      key={label}
                      className="bg-rose-50/80 border border-rose-200 rounded-xl p-2.5 text-xs"
                    >
                      <span className="font-black text-rose-900 line-through">
                        {info.icon} &ldquo;{label}&rdquo; (×{info.count}):
                      </span>{" "}
                      <span className="text-slate-700">{info.explanation}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

        // Fin por victoria
        if (g.score >= targetScore && !g.finished) {
          g.finished = true;
          setIsPlaying(false);
          const stars: 0 | 1 | 2 | 3 = g.wellness >= 70 ? 3 : g.wellness >= 40 ? 2 : 1;

          // Mensaje adaptativo exacto según el mundo completado (evita decir 3 mundos si solo jugó 1)
          const worldsVisited = g.currentWorldIdx + 1;
          const worldMsg =
            worldsVisited === 1
              ? `¡Completaste con éxito el ${ESCUDO_WORLDS[0].name} cuidando tu bienestar emocional!`
              : worldsVisited === 2
              ? `¡Avanzaste por 2 mundos (Patio y Bosque Cuauhtémoc) cuidando tu bienestar emocional!`
              : `¡Recorriste los 3 mundos visuales protegiendo tu bienestar emocional!`;

          onComplete(stars, g.score, targetScore, worldMsg, createReviewContent());
        } else if (g.wellness <= 0 && !g.finished) {
          // Fin por agotamiento
          g.finished = true;
          setIsPlaying(false);
          const stars: 0 | 1 | 2 | 3 = g.score >= targetScore * 0.4 ? 1 : 0;
          onComplete(
            stars,
            g.score,
            targetScore,
            "Los mandatos de presión agotaron tu barra de bienestar. ¡Permite que el escudo se recargue y vuelve a intentarlo!",
            createReviewContent()
          );
        }
      }

      // Dibujo del escenario del mundo actual
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, world.skyTop);
      grad.addColorStop(1, world.skyBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Suelo del mundo
      ctx.fillStyle = world.groundColor;
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

      // Etiqueta del mundo actual
      ctx.fillStyle = currentIdx === 2 ? "#e0e7ff" : "#0f172a";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(world.name, 12, 20);

      // Entidades que caen
      g.entities.forEach((ent) => {
        ctx.fillStyle =
          ent.kind === "emotion" ? "#dcfce7" : ent.kind === "powerup" ? "#fef9c3" : "#ffe4e6";
        ctx.strokeStyle =
          ent.kind === "emotion" ? "#16a34a" : ent.kind === "powerup" ? "#eab308" : "#e11d48";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(ent.x, ent.y, 112, 28, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 11px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${ent.icon} ${ent.label}`, ent.x + 56, ent.y + 18);
      });

      // Personaje y su Escudo
      const px = g.playerX;
      const py = canvas.height - 52;
      const isFlashingShield = performance.now() < g.shieldFlashUntil;
      const shieldReady = g.shieldEnergy >= 18;

      // Cúpula protectora del escudo (brilla cuando está activo o cuando repele)
      ctx.strokeStyle = isFlashingShield ? "#38bdf8" : shieldReady ? "rgba(56, 189, 248, 0.45)" : "rgba(226, 232, 240, 0.3)";
      ctx.lineWidth = isFlashingShield ? 5 : 2.5;
      ctx.beginPath();
      ctx.arc(px + g.playerW / 2, py + 15, 46, Math.PI, 0);
      ctx.stroke();

      // Cuerpo del avatar
      ctx.fillStyle = world.accent;
      ctx.beginPath();
      ctx.roundRect(px, py, g.playerW, 30, 12);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(
        isFlashingShield ? "🛡️ ¡REPELIDO!" : shieldReady ? "🛡️ PROTEGIDO" : "⚠️ SIN ESCUDO",
        px + g.playerW / 2,
        py + 19
      );

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isPaused, difficulty, targetScore, onComplete, playAlert, playCorrect, playPowerup, playShield]);

  const movePointer = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (clientX - rect.left) * scaleX - stateRef.current.playerW / 2;
    stateRef.current.playerX = Math.max(6, Math.min(canvas.width - stateRef.current.playerW - 6, x));
  };

  return (
    <div className="bg-white rounded-4xl border-2 border-cyan-200 shadow-xl p-5 sm:p-7 space-y-5">
      {/* HUD: Barras de Bienestar y Escudo Automático */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pb-3 border-b border-slate-100">
        <div>
          <div className="flex justify-between text-xs font-black text-slate-700 mb-1">
            <span>💚 Bienestar Emocional</span>
            <span>{wellness}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all ${wellness > 50 ? "bg-emerald-500" : "bg-rose-500"}`}
              style={{ width: `${wellness}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-black text-slate-700 mb-1">
            <span>🛡️ Escudo Automático (Recarga sola)</span>
            <span className={shieldEnergy >= 18 ? "text-sky-700" : "text-rose-600 font-bold"}>
              {shieldEnergy >= 18 ? `${shieldEnergy}% (Listo)` : "Recargando..."}
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div className="h-full bg-sky-500 transition-all" style={{ width: `${shieldEnergy}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 text-xs font-black">
            Meta: {score}/{targetScore}
          </span>
          {!isPlaying ? (
            <Button3D
              variant="intermedio"
              size="sm"
              onClick={() => {
                playClick();
                if (stateRef.current.finished) resetGame();
                setIsPlaying(true);
                setIsPaused(false);
              }}
              icon={<Play className="w-4 h-4 fill-current" />}
            >
              Jugar
            </Button3D>
          ) : (
            <Button3D
              variant="secondary"
              size="sm"
              onClick={() => setIsPaused((p) => !p)}
              icon={<Pause className="w-4 h-4" />}
            >
              {isPaused ? "Seguir" : "Pausa"}
            </Button3D>
          )}
          <button
            onClick={() => {
              playClick();
              setIsPlaying(false);
              resetGame();
            }}
            className="min-h-[44px] px-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
            aria-label="Reiniciar juego"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mensaje de retroalimentación en vivo */}
      <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs sm:text-sm font-bold text-sky-950 flex items-center justify-between gap-2">
        <span className="truncate">{recentMsg}</span>
        <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white text-sky-800 shrink-0">
          {ESCUDO_WORLDS[worldIdx].name}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={480}
        height={320}
        onMouseMove={(e) => isPlaying && !isPaused && movePointer(e.clientX)}
        onTouchMove={(e) => isPlaying && !isPaused && e.touches[0] && movePointer(e.touches[0].clientX)}
        className="w-full max-w-2xl mx-auto block rounded-3xl border-4 border-sky-200 shadow-md cursor-ew-resize"
        aria-label="Escenario 2D El Escudo Emocional"
      />

      {/* Controles táctiles sencillos + indicador de escudo automático */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => (stateRef.current.playerX = Math.max(8, stateRef.current.playerX - 45))}
            className="min-h-[48px] flex-1 rounded-2xl bg-slate-100 hover:bg-slate-200 font-black text-xs inline-flex items-center justify-center gap-1 border border-slate-300"
            aria-label="Mover a la izquierda"
          >
            <ChevronLeft className="w-4 h-4" /> Mover Izquierda (←)
          </button>

          <div className="px-3.5 py-2.5 rounded-2xl bg-sky-100/80 border border-sky-300 text-sky-900 text-xs font-black inline-flex items-center gap-1.5 shrink-0">
            <Shield className="w-4 h-4 text-sky-600" />
            <span>Escudo Automático Activo</span>
          </div>

          <button
            onClick={() => (stateRef.current.playerX = Math.min(400, stateRef.current.playerX + 45))}
            className="min-h-[48px] flex-1 rounded-2xl bg-slate-100 hover:bg-slate-200 font-black text-xs inline-flex items-center justify-center gap-1 border border-slate-300"
            aria-label="Mover a la derecha"
          >
            Mover Derecha (→) <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EscudoEmocional({ onHome, onNextGame }: GameProps) {
  return (
    <GameShell
      gameId="escudo"
      tutorialSteps={ESCUDO_TUTORIAL}
      difficulties={[
        { id: "facil", label: "Nivel 1 · 400 pts", subtitle: "Patio Escolar y ritmo tranquilo", emoji: "💚" },
        { id: "normal", label: "Nivel 2 · 650 pts", subtitle: "2 mundos visuales y mandatos más rápidos", emoji: "🛡️" },
        { id: "reto", label: "Nivel 3 · 900 pts", subtitle: "3 mundos completos con velocidad arcade", emoji: "⚡" },
      ]}
      onHome={onHome}
      onNextGame={onNextGame}
    >
      {({ difficulty, finishGame }) => (
        <EscudoGameplay difficulty={difficulty} onComplete={finishGame} />
      )}
    </GameShell>
  );
}
