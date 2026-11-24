"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Heart, Flame, Zap } from "lucide-react";
import GameShell, { DifficultyLevel } from "@/components/common/GameShell";
import Button3D from "@/components/common/Button3D";
import { MYTH_BRICKS_POOL, MURO_TUTORIAL } from "@/content/game4-muro";
import { useSound } from "@/hooks/useSound";

interface GameProps {
  onHome?: () => void;
  onNextGame?: () => void;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  myth: string;
  truth: string;
  color: string;
  alive: boolean;
  hitsLeft: number;
  maxHits: number;
}

interface PowerUp {
  x: number;
  y: number;
  vy: number;
  type: "multi" | "wide" | "slow";
  label: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

function MuroGameplay({
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
  const { playBrickHit, playBounce, playPowerup, playAlert, playCorrect, playClick } = useSound();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [unlockedTruths, setUnlockedTruths] = useState<{ myth: string; truth: string }[]>([]);

  const baseSpeed = difficulty === "facil" ? 210 : difficulty === "normal" ? 245 : 285;
  const brickCount = difficulty === "facil" ? 6 : difficulty === "normal" ? 9 : 12;

  const gameRef = useRef({
    paddleX: 185,
    paddleW: 110,
    paddleH: 14,
    balls: [] as Ball[],
    bricks: [] as Brick[],
    powerUps: [] as PowerUp[],
    particles: [] as Particle[],
    lastTime: 0,
    wideUntil: 0,
    slowUntil: 0,
    combo: 0,
    score: 0,
    lives: 3,
    finished: false,
  });

  const populateGameRefs = useCallback(() => {
    const g = gameRef.current;
    const cols = 3;
    const brickW = 142;
    const brickH = 30;
    const gap = 12;
    const startX = 16;
    const startY = 34;

    const pool = MYTH_BRICKS_POOL.slice(0, brickCount);
    g.bricks = pool.map((item, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const offsetX = difficulty === "reto" && r % 2 === 1 ? 8 : 0;
      const hits = difficulty === "facil" ? 1 : item.resistant ? 2 : 1;
      return {
        x: startX + c * (brickW + gap) + offsetX,
        y: startY + r * (brickH + gap),
        w: brickW - (difficulty === "reto" ? 8 : 0),
        h: brickH,
        myth: item.myth,
        truth: item.truth,
        color: item.color,
        alive: true,
        hitsLeft: hits,
        maxHits: hits,
      };
    });

    g.paddleW = difficulty === "facil" ? 125 : 108;
    g.paddleX = (480 - g.paddleW) / 2;
    g.balls = [{ x: 240, y: 270, vx: baseSpeed * 0.55, vy: -baseSpeed * 0.85, r: 8 }];
    g.powerUps = [];
    g.particles = [];
    g.combo = 0;
    g.score = 0;
    g.lives = 3;
    g.wideUntil = 0;
    g.slowUntil = 0;
    g.finished = false;
  }, [brickCount, difficulty, baseSpeed]);

  const buildLevel = useCallback(() => {
    populateGameRefs();
    setLives(3);
    setScore(0);
    setCombo(0);
    setUnlockedTruths([]);
    setActiveEffect(null);
  }, [populateGameRefs]);

  useEffect(() => {
    populateGameRefs();
  }, [populateGameRefs]);

  const spawnParticles = (x: number, y: number, color: string) => {
    const reduceMotion =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.classList.contains("reduce-motion"));
    if (reduceMotion) return;
    for (let i = 0; i < 12; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 45 + Math.random() * 110;
      gameRef.current.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        color,
        alpha: 1,
        size: 3 + Math.random() * 3,
      });
    }
  };

  // Teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        if (isPlaying) setIsPaused((p) => !p);
        return;
      }
      if (!isPlaying || isPaused) return;
      const g = gameRef.current;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        g.paddleX = Math.max(4, g.paddleX - 32);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        g.paddleX = Math.min(480 - g.paddleW - 4, g.paddleX + 32);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying, isPaused]);

  // Loop principal delta-time
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    gameRef.current.lastTime = performance.now();

    const drawFrame = () => {
      const g = gameRef.current;
      const W = canvas.width;
      const H = canvas.height;

      // Fondo
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0f172a");
      bg.addColorStop(1, "#1e293b");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Ladrillos
      g.bricks.forEach((b) => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 7);
        ctx.fill();

        if (b.hitsLeft > 1) {
          ctx.strokeStyle = "#fde047";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const label = b.myth.length > 20 ? `${b.myth.slice(0, 18)}…` : b.myth;
        ctx.fillText(label, b.x + b.w / 2, b.y + b.h / 2);
      });

      // Power-Ups
      g.powerUps.forEach((p) => {
        ctx.fillStyle = p.type === "multi" ? "#f59e0b" : p.type === "wide" ? "#10b981" : "#38bdf8";
        ctx.beginPath();
        ctx.roundRect(p.x - 18, p.y - 11, 36, 22, 11);
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 10px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.label, p.x, p.y + 0.5);
      });

      // Partículas
      g.particles.forEach((pt) => {
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Barra
      const pw = performance.now() < g.wideUntil ? Math.min(180, g.paddleW * 1.45) : g.paddleW;
      ctx.fillStyle = performance.now() < g.wideUntil ? "#34d399" : "#38bdf8";
      ctx.beginPath();
      ctx.roundRect(g.paddleX, H - 24, pw, g.paddleH, 7);
      ctx.fill();

      // Bolas
      g.balls.forEach((ball) => {
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const tick = (now: number) => {
      const g = gameRef.current;
      const dt = Math.min((now - g.lastTime) / 1000, 0.05);
      g.lastTime = now;

      if (isPlaying && !isPaused && !g.finished) {
        const W = canvas.width;
        const H = canvas.height;
        const slowFactor = now < g.slowUntil ? 0.65 : 1;
        const pw = now < g.wideUntil ? Math.min(180, g.paddleW * 1.45) : g.paddleW;

        // Actualizar partículas
        g.particles = g.particles.filter((p) => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.alpha -= dt * 2.2;
          return p.alpha > 0;
        });

        // Actualizar power-ups
        g.powerUps = g.powerUps.filter((p) => {
          p.y += p.vy * dt;
          // Colisión con barra
          if (p.y + 11 >= H - 24 && p.y - 11 <= H - 10 && p.x >= g.paddleX && p.x <= g.paddleX + pw) {
            playPowerup();
            if (p.type === "multi") {
              const src = g.balls[0] || { x: W / 2, y: H - 50, vx: 120, vy: -200, r: 8 };
              g.balls.push({ x: src.x, y: src.y, vx: -src.vx, vy: -Math.abs(src.vy), r: 8 });
              setActiveEffect("⚡ ¡Bola Múltiple activa!");
            } else if (p.type === "wide") {
              g.wideUntil = now + 9000;
              setActiveEffect("↔ ¡Barra Ancha por 9s!");
            } else {
              g.slowUntil = now + 8000;
              setActiveEffect("🐢 ¡Bola Lenta por 8s!");
            }
            return false;
          }
          return p.y < H + 20;
        });

        // Actualizar bolas
        const remainingBalls: Ball[] = [];
        for (const ball of g.balls) {
          ball.x += ball.vx * slowFactor * dt;
          ball.y += ball.vy * slowFactor * dt;

          // Paredes
          if (ball.x - ball.r < 0) {
            ball.x = ball.r;
            ball.vx = Math.abs(ball.vx);
            playBounce(1.1);
          } else if (ball.x + ball.r > W) {
            ball.x = W - ball.r;
            ball.vx = -Math.abs(ball.vx);
            playBounce(1.1);
          }
          if (ball.y - ball.r < 0) {
            ball.y = ball.r;
            ball.vy = Math.abs(ball.vy);
            playBounce(1.2);
          }

          // Barra
          if (
            ball.vy > 0 &&
            ball.y + ball.r >= H - 24 &&
            ball.y - ball.r <= H - 10 &&
            ball.x >= g.paddleX - 4 &&
            ball.x <= g.paddleX + pw + 4
          ) {
            const hitOffset = (ball.x - (g.paddleX + pw / 2)) / (pw / 2);
            const speed = Math.hypot(ball.vx, ball.vy);
            ball.vx = hitOffset * speed * 0.85;
            ball.vy = -Math.max(140, Math.sqrt(Math.max(4000, speed * speed - ball.vx * ball.vx)));
            ball.y = H - 24 - ball.r;
            playBounce(1.0);
          }

          // Ladrillos
          for (const b of g.bricks) {
            if (!b.alive) continue;
            if (
              ball.x + ball.r > b.x &&
              ball.x - ball.r < b.x + b.w &&
              ball.y + ball.r > b.y &&
              ball.y - ball.r < b.y + b.h
            ) {
              ball.vy = -ball.vy;
              b.hitsLeft -= 1;
              spawnParticles(b.x + b.w / 2, b.y + b.h / 2, b.color);

              if (b.hitsLeft <= 0) {
                b.alive = false;
                playBrickHit();
                g.combo += 1;
                g.score += 100 + Math.min(g.combo * 20, 100);
                setCombo(g.combo);
                setScore(g.score);
                setUnlockedTruths((prev) => [{ myth: b.myth, truth: b.truth }, ...prev]);

                // Probabilidad de Power-Up
                if (Math.random() < 0.45) {
                  const roll = Math.random();
                  const pType: PowerUp["type"] = roll < 0.35 ? "multi" : roll < 0.7 ? "wide" : "slow";
                  const pLabel = pType === "multi" ? "2x" : pType === "wide" ? "↔" : "🐢";
                  g.powerUps.push({ x: b.x + b.w / 2, y: b.y + b.h, vy: 115, type: pType, label: pLabel });
                }
              } else {
                playBounce(1.3);
              }
              break;
            }
          }

          if (ball.y - ball.r <= H) {
            remainingBalls.push(ball);
          }
        }

        g.balls = remainingBalls;

        // Perdió todas las bolas
        if (g.balls.length === 0) {
          playAlert();
          g.lives -= 1;
          g.combo = 0;
          setLives(g.lives);
          setCombo(0);

          if (g.lives <= 0) {
            g.finished = true;
            setIsPlaying(false);
            const brokenCount = g.bricks.filter((b) => !b.alive).length;
            const stars: 0 | 1 | 2 | 3 = brokenCount >= Math.ceil(brickCount / 2) ? 1 : 0;
            const brokenList = g.bricks
              .filter((b) => !b.alive)
              .map((b) => ({ myth: b.myth, truth: b.truth }));
            const listToReview =
              brokenList.length > 0
                ? brokenList
                : g.bricks.slice(0, 4).map((b) => ({ myth: b.myth, truth: b.truth }));

            const reviewElement = (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-teal-200 pb-2">
                  <span className="text-xl">💡</span>
                  <div>
                    <h4 className="font-black text-sm text-teal-950">
                      Mitos y Verdades para Leer con Calma
                    </h4>
                    <p className="text-xs text-slate-600">
                      Aquí puedes reflexionar sobre lo aprendido sin prisa:
                    </p>
                  </div>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {listToReview.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-teal-50/70 border border-teal-200 rounded-2xl p-3"
                    >
                      <p className="text-xs font-black text-rose-600 line-through">
                        Mito: &ldquo;{item.myth}&rdquo;
                      </p>
                      <p className="text-xs font-semibold text-teal-950 mt-1 leading-relaxed">
                        ✓ Realidad: {item.truth}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );

            onComplete(
              stars,
              g.score,
              brickCount * 140,
              `Derribaste ${brokenCount} de ${brickCount} mitos machistas antes de quedarte sin vidas.`,
              reviewElement
            );
          } else {
            g.balls = [{ x: g.paddleX + pw / 2, y: H - 40, vx: baseSpeed * 0.5, vy: -baseSpeed * 0.85, r: 8 }];
          }
        }

        // Victoria al romper todos
        if (g.bricks.every((b) => !b.alive) && !g.finished) {
          g.finished = true;
          setIsPlaying(false);
          playCorrect();
          const stars: 0 | 1 | 2 | 3 = g.lives === 3 ? 3 : g.lives === 2 ? 2 : 1;
          const reviewElement = (
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-teal-200 pb-2">
                <span className="text-xl">🎉</span>
                <div>
                  <h4 className="font-black text-sm text-teal-950">
                    ¡Todos los Mitos Desmentidos en esta Misión!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Léelos con calma a tu propio ritmo:
                  </p>
                </div>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {g.bricks.map((b, idx) => (
                  <div
                    key={idx}
                    className="bg-teal-50/70 border border-teal-200 rounded-2xl p-3"
                  >
                    <p className="text-xs font-black text-rose-600 line-through">
                      Mito: &ldquo;{b.myth}&rdquo;
                    </p>
                    <p className="text-xs font-semibold text-teal-950 mt-1 leading-relaxed">
                      ✓ Realidad: {b.truth}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );

          onComplete(
            stars,
            g.score + g.lives * 50,
            brickCount * 140 + 150,
            `¡Demoliste los ${brickCount} mitos y estereotipos conservando ${g.lives} vidas!`,
            reviewElement
          );
        }
      }

      drawFrame();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isPaused, brickCount, baseSpeed, onComplete, playAlert, playBounce, playBrickHit, playCorrect, playPowerup]);

  const movePaddleToClientX = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (clientX - rect.left) * scaleX - gameRef.current.paddleW / 2;
    gameRef.current.paddleX = Math.max(4, Math.min(canvas.width - gameRef.current.paddleW - 4, x));
  };

  return (
    <div className="bg-white rounded-4xl border-2 border-blue-200 shadow-xl p-5 sm:p-7 space-y-5">
      {/* HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black inline-flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Vidas: {lives}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-black">
            Puntos: {score}
          </span>
          {combo > 1 && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-black inline-flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Racha x{combo}
            </span>
          )}
          {activeEffect && (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-black inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> {activeEffect}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <Button3D
              variant="intermedio"
              size="sm"
              onClick={() => {
                playClick();
                if (gameRef.current.finished) buildLevel();
                setIsPlaying(true);
                setIsPaused(false);
              }}
              icon={<Play className="w-4 h-4 fill-current" />}
            >
              Iniciar Arcade
            </Button3D>
          ) : (
            <Button3D
              variant="secondary"
              size="sm"
              onClick={() => {
                playClick();
                setIsPaused((p) => !p);
              }}
              icon={<Pause className="w-4 h-4" />}
            >
              {isPaused ? "Reanudar" : "Pausa (P)"}
            </Button3D>
          )}
          <button
            onClick={() => {
              playClick();
              setIsPlaying(false);
              buildLevel();
            }}
            className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 inline-flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" /> Reiniciar
          </button>
        </div>
      </div>

      {/* Canvas + Tarjeta lateral de verdades */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-5 items-start">
        <div className="space-y-3">
          <canvas
            ref={canvasRef}
            width={480}
            height={340}
            onMouseMove={(e) => isPlaying && !isPaused && movePaddleToClientX(e.clientX)}
            onTouchMove={(e) => {
              if (isPlaying && !isPaused && e.touches[0]) {
                movePaddleToClientX(e.touches[0].clientX);
              }
            }}
            className="w-full rounded-3xl border-4 border-slate-800 shadow-lg bg-slate-900 cursor-ew-resize"
            aria-label="Tablero arcade El Muro de los Mitos"
          />

          {/* Controles táctiles accesibles */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                gameRef.current.paddleX = Math.max(4, gameRef.current.paddleX - 42);
              }}
              className="min-h-[48px] flex-1 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs inline-flex items-center justify-center gap-1 border border-slate-300"
              aria-label="Mover barra a la izquierda"
            >
              <ChevronLeft className="w-5 h-5" /> Izquierda (←)
            </button>
            <button
              onClick={() => {
                gameRef.current.paddleX = Math.min(
                  480 - gameRef.current.paddleW - 4,
                  gameRef.current.paddleX + 42
                );
              }}
              className="min-h-[48px] flex-1 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs inline-flex items-center justify-center gap-1 border border-slate-300"
              aria-label="Mover barra a la derecha"
            >
              Derecha (→) <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tarjeta lateral que revela verdades al romper mitos */}
        <aside
          aria-label="Mensajes positivos desbloqueados"
          className="rounded-3xl border-2 border-teal-200 bg-teal-50/50 p-4 space-y-3 max-h-[395px] overflow-y-auto"
        >
          <h3 className="font-black text-sm text-teal-950 flex items-center gap-1.5">
            💡 Verdades Desbloqueadas ({unlockedTruths.length}/{brickCount})
          </h3>
          {unlockedTruths.length === 0 ? (
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-2xl border border-teal-100">
              Presiona <strong>Iniciar Arcade</strong> y rompe el primer ladrillo para revelar por qué ese mito es falso.
            </p>
          ) : (
            <div className="space-y-2.5">
              {unlockedTruths.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded-2xl border border-teal-200 shadow-2xs animate-scaleUp"
                >
                  <p className="text-[11px] font-black text-rose-600 line-through">
                    Mito: &ldquo;{item.myth}&rdquo;
                  </p>
                  <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">
                    ✓ {item.truth}
                  </p>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function MuroDeLosMitos({ onHome, onNextGame }: GameProps) {
  return (
    <GameShell
      gameId="muro"
      tutorialSteps={MURO_TUTORIAL}
      difficulties={[
        { id: "facil", label: "Nivel 1 · 6 Mitos", subtitle: "Velocidad tranquila y 1 golpe por bloque", emoji: "🌱" },
        { id: "normal", label: "Nivel 2 · 9 Mitos", subtitle: "Bloques resistentes y power-ups", emoji: "⚡" },
        { id: "reto", label: "Nivel 3 · Fortaleza 12 Mitos", subtitle: "Patrón escalonado y velocidad arcade", emoji: "🧱" },
      ]}
      onHome={onHome}
      onNextGame={onNextGame}
    >
      {({ difficulty, finishGame }) => (
        <MuroGameplay difficulty={difficulty} onComplete={finishGame} />
      )}
    </GameShell>
  );
}
