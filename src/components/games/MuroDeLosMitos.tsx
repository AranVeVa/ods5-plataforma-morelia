"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
  Layers,
  Heart,
  Volume2,
  Sparkles,
  Shield,
  Clock,
  Gauge
} from "lucide-react";
import confetti from "canvas-confetti";
import GameHeader from "@/components/common/GameHeader";
import InstructionsModal from "@/components/common/InstructionsModal";
import VictoryModal from "@/components/common/VictoryModal";
import PauseModal from "@/components/common/PauseModal";
import EmergencyHelpModal from "@/components/common/EmergencyHelpModal";
import { sound } from "@/utils/audio";

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  myth: string;
  truth: string;
  alive: boolean;
  maxHits: number;
  hitsLeft: number;
  isSpecial?: boolean;
  color: string;
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

type SpeedSetting = "tranquila" | "normal" | "desafio";

const MYTH_DATA_LEVEL_1 = [
  { myth: "Los hombres no lloran", truth: "Llorar es una respuesta humana saludable que libera emociones y alivia el dolor.", color: "#f43f5e", resistant: true },
  { myth: "Las niñas son débiles", truth: "La tenacidad, la valentía y la fuerza intelectual y física no tienen género.", color: "#ec4899", resistant: false },
  { myth: "El rosa es solo para niñas", truth: "Los colores son luz y percepción estética; no tienen asignación biológica de género.", color: "#a855f7", resistant: false },
  { myth: "Cocinar es solo de mujeres", truth: "Cocinar y alimentarse son habilidades universales de supervivencia y autonomía humana.", color: "#6366f1", resistant: true },
  { myth: "Ellas deben aguantar todo", truth: "Nadie debe tolerar maltrato ni violencia. El respeto mutuo es innegociable.", color: "#0ea5e9", resistant: false },
  { myth: "Los celos demuestran amor", truth: "Los celos reflejan inseguridad y afán de control; el amor sano respeta la libertad.", color: "#10b981", resistant: true, isSpecial: true },
];

const MYTH_DATA_LEVEL_2 = [
  { myth: "No es carrera para mujeres", truth: "Las mujeres lideran misiones aeroespaciales, medicina e ingenierías en todo el mundo.", color: "#6366f1", resistant: true },
  { myth: "Los niños deben pelear", truth: "El verdadero carácter se demuestra resolviendo conflictos mediante el diálogo y la empatía.", color: "#0ea5e9", resistant: false },
  { myth: "Ellas visten para provocar", truth: "La vestimenta es libertad individual; el respeto a la dignidad ajena es una obligación absoluta.", color: "#f43f5e", resistant: true },
  { myth: "Los varones mandan siempre", truth: "El liderazgo eficaz se fundamenta en la cooperación ética y la escucha activa.", color: "#f59e0b", resistant: false },
  { myth: "La mujer es para el hogar", truth: "Toda persona tiene derecho a forjar su proyecto de vida académico y profesional.", color: "#14b8a6", resistant: false },
  { myth: "Es broma, no te ofendas", truth: "El humor denigrante o machista daña la convivencia. Si lastima a alguien, no es gracioso.", color: "#ec4899", resistant: true, isSpecial: true },
];

export default function MuroDeLosMitos() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [speedSetting, setSpeedSetting] = useState<SpeedSetting>("tranquila");
  const [gameState, setGameState] = useState<"menu" | "countdown" | "playing" | "paused" | "gameover" | "levelwon">("menu");
  const [countdown, setCountdown] = useState<number>(3);
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [unlockedTruths, setUnlockedTruths] = useState<{ myth: string; truth: string }[]>([]);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Speed constants in pixels per second
  const getBaseSpeed = useCallback(() => {
    switch (speedSetting) {
      case "tranquila":
        return 205; // 205 px/sec (calm, precise, perfectly controllable)
      case "normal":
        return 235; // 235 px/sec (standard arcade)
      case "desafio":
        return 270; // 270 px/sec (slightly faster)
    }
  }, [speedSetting]);

  // Physical game state in Ref to calculate exact delta-time
  const stateRef = useRef({
    paddleX: 180,
    paddleW: 105, // slightly wider paddle
    paddleH: 14,
    paddleTargetX: 180,
    ballX: 240,
    ballY: 260,
    ballVX: 120, // px/sec
    ballVY: -190, // px/sec
    ballR: 8,
    bricks: [] as Brick[],
    particles: [] as Particle[],
    lastTime: 0,
    animationFrameId: 0,
    paddleExpandedUntil: 0,
  });

  const initBricks = useCallback((lvl: number) => {
    const mythPool = lvl === 1 ? MYTH_DATA_LEVEL_1 : MYTH_DATA_LEVEL_2;
    const cols = 3;
    const rows = 2;
    const brickW = 140;
    const brickH = 28;
    const gap = 12;
    const startX = 20;
    const startY = 35;

    const newBricks: Brick[] = [];
    mythPool.forEach((item, idx) => {
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
        maxHits: item.resistant ? 2 : 1,
        hitsLeft: item.resistant ? 2 : 1,
        isSpecial: item.isSpecial,
        color: item.color,
      });
    });

    stateRef.current.bricks = newBricks;
  }, []);

  const spawnParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 80;
      stateRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1,
        size: 3 + Math.random() * 3,
      });
    }
  };

  const startCountdown = useCallback(() => {
    setGameState("countdown");
    setCountdown(3);
    sound.playCountdown(false);

    let count = 3;
    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
        sound.playCountdown(false);
      } else {
        clearInterval(timer);
        sound.playCountdown(true);
        setGameState("playing");
        stateRef.current.lastTime = performance.now();
      }
    }, 800);
  }, []);

  const resetRound = useCallback(
    (lvl = level) => {
      const baseSpd = getBaseSpeed();
      const angle = (Math.PI / 4) * (Math.random() > 0.5 ? 1 : -1) - Math.PI / 2;
      stateRef.current.ballX = 240;
      stateRef.current.ballY = 260;
      stateRef.current.ballVX = Math.cos(angle) * baseSpd;
      stateRef.current.ballVY = -Math.abs(Math.sin(angle) * baseSpd);
      stateRef.current.paddleX = 180;
      stateRef.current.paddleTargetX = 180;
      stateRef.current.paddleW = 105;
      stateRef.current.particles = [];
      initBricks(lvl);
      startCountdown();
    },
    [getBaseSpeed, initBricks, level, startCountdown]
  );

  const startNewGame = () => {
    sound.playPowerup();
    setScore(0);
    setLives(3);
    setLevel(1);
    setUnlockedTruths([]);
    resetRound(1);
  };

  useEffect(() => {
    initBricks(level);
  }, [initBricks, level]);

  // Main Canvas Animation Game Loop with Delta-Time Physics
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;
    stateRef.current.lastTime = performance.now();

    const loop = (currentTime: number) => {
      if (!isRunning) return;

      const state = stateRef.current;
      const dt = Math.min((currentTime - state.lastTime) / 1000, 0.05); // clamp delta time
      state.lastTime = currentTime;

      const { width, height } = canvas;

      // Smooth paddle movement toward target
      state.paddleX += (state.paddleTargetX - state.paddleX) * 0.25;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Draw Bricks
      let aliveCount = 0;
      state.bricks.forEach((b) => {
        if (!b.alive) return;
        aliveCount++;

        // Brick body
        ctx.fillStyle = b.hitsLeft === 2 ? b.color : `${b.color}b3`;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 6);
        ctx.fill();

        // Brick stroke
        ctx.strokeStyle = b.isSpecial ? "#fef08a" : "#ffffff";
        ctx.lineWidth = b.isSpecial ? 2 : 1;
        ctx.stroke();

        // Special icon
        if (b.isSpecial) {
          ctx.fillStyle = "#fef08a";
          ctx.font = "bold 9px sans-serif";
          ctx.fillText("★", b.x + 8, b.y + 16);
        }

        // Text inside brick
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.myth, b.x + b.w / 2, b.y + b.h / 2);

        // Crack line indicator if hit once
        if (b.hitsLeft === 1 && b.maxHits === 2) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(b.x + b.w * 0.3, b.y + 4);
          ctx.lineTo(b.x + b.w * 0.5, b.y + b.h - 4);
          ctx.stroke();
        }
      });

      // Win condition
      if (aliveCount === 0) {
        setGameState("levelwon");
        sound.playCelebration();
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
        if (level === 2) {
          setIsVictoryOpen(true);
        }
        return;
      }

      // Update and draw particles
      state.particles = state.particles.filter((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= dt * 1.5;
        if (p.alpha <= 0) return false;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      // Draw Paddle
      ctx.fillStyle = "#4f46e5";
      ctx.beginPath();
      ctx.roundRect(state.paddleX, height - 24, state.paddleW, state.paddleH, 7);
      ctx.fill();

      // Draw Ball
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, state.ballR, 0, Math.PI * 2);
      ctx.fill();

      // Ball Physics
      state.ballX += state.ballVX * dt;
      state.ballY += state.ballVY * dt;

      // Left and Right Wall bounce
      if (state.ballX - state.ballR <= 0) {
        state.ballX = state.ballR;
        state.ballVX = Math.abs(state.ballVX);
        sound.playBounce(1);
      } else if (state.ballX + state.ballR >= width) {
        state.ballX = width - state.ballR;
        state.ballVX = -Math.abs(state.ballVX);
        sound.playBounce(1);
      }

      // Top Wall bounce
      if (state.ballY - state.ballR <= 0) {
        state.ballY = state.ballR;
        state.ballVY = Math.abs(state.ballVY);
        sound.playBounce(1.1);
      }

      // Paddle Collision
      if (
        state.ballY + state.ballR >= height - 24 &&
        state.ballY - state.ballR <= height - 24 + state.paddleH
      ) {
        if (
          state.ballX >= state.paddleX - 4 &&
          state.ballX <= state.paddleX + state.paddleW + 4
        ) {
          state.ballY = height - 24 - state.ballR;
          // Normalized hit offset (-1 to +1)
          const hitOffset =
            (state.ballX - (state.paddleX + state.paddleW / 2)) / (state.paddleW / 2);
          const baseSpd = getBaseSpeed();

          // Smooth rebound angle clamp
          const angle = (hitOffset * 0.8 * Math.PI) / 3 - Math.PI / 2;
          state.ballVX = Math.cos(angle) * baseSpd;
          state.ballVY = Math.sin(angle) * baseSpd;
          sound.playBounce(1.2);
        }
      }

      // Bottom death boundary check
      if (state.ballY - state.ballR > height) {
        sound.playAlert();
        setLives((l) => {
          const nextLives = l - 1;
          if (nextLives <= 0) {
            setGameState("gameover");
          } else {
            // Soft respawn
            const baseSpd = getBaseSpeed();
            state.ballX = 240;
            state.ballY = 240;
            state.ballVX = Math.random() > 0.5 ? baseSpd * 0.6 : -baseSpd * 0.6;
            state.ballVY = -baseSpd * 0.8;
            startCountdown();
          }
          return nextLives;
        });
        return;
      }

      // Brick Collisions
      state.bricks.forEach((b) => {
        if (!b.alive) return;
        if (
          state.ballX + state.ballR > b.x &&
          state.ballX - state.ballR < b.x + b.w &&
          state.ballY + state.ballR > b.y &&
          state.ballY - state.ballR < b.y + b.h
        ) {
          b.hitsLeft -= 1;
          state.ballVY = -state.ballVY;
          sound.playBrickHit();
          spawnParticles(state.ballX, state.ballY, b.color);

          if (b.hitsLeft <= 0) {
            b.alive = false;
            setScore((s) => s + (b.isSpecial ? 200 : 100));
            setUnlockedTruths((prev) => [{ myth: b.myth, truth: b.truth }, ...prev]);

            // Special Bonus: expand paddle temporarily
            if (b.isSpecial) {
              sound.playPowerup();
              state.paddleW = 135;
              setTimeout(() => {
                stateRef.current.paddleW = 105;
              }, 6000);
            }
          }
        }
      });

      state.animationFrameId = requestAnimationFrame(loop);
    };

    stateRef.current.animationFrameId = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(stateRef.current.animationFrameId);
    };
  }, [gameState, getBaseSpeed, level, startCountdown]);

  // Mouse / Touch handlers for paddle
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const newX = mouseX - stateRef.current.paddleW / 2;
    stateRef.current.paddleTargetX = Math.max(0, Math.min(canvas.width - stateRef.current.paddleW, newX));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const newX = touchX - stateRef.current.paddleW / 2;
    stateRef.current.paddleTargetX = Math.max(0, Math.min(canvas.width - stateRef.current.paddleW, newX));
  };

  const movePaddleStep = (delta: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const newX = stateRef.current.paddleX + delta;
    stateRef.current.paddleTargetX = Math.max(0, Math.min(canvas.width - stateRef.current.paddleW, newX));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-100 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <GameHeader
        title="🧱 El Muro de los Mitos"
        badge="Erradicación de micromachismos y prejuicios de género (Meta ODS 5.1)"
        levelBadge="Nivel Intermedio (10 a 13 años)"
        levelColor="rose"
        odsTarget="ODS 5.1"
        score={score}
        stars={lives}
        maxStars={3}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onRestart={startNewGame}
        onPause={() => setGameState(gameState === "playing" ? "paused" : "playing")}
        isPaused={gameState === "paused"}
      />

      {/* Control Bar: Speed options & Lives */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-slate-600 flex items-center gap-1 pl-1">
            <Gauge className="w-3.5 h-3.5" /> Velocidad:
          </span>
          <button
            onClick={() => {
              sound.playClick();
              setSpeedSetting("tranquila");
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              speedSetting === "tranquila"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tranquila (Precisa)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setSpeedSetting("normal");
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              speedSetting === "normal"
                ? "bg-white text-indigo-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setSpeedSetting("desafio");
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              speedSetting === "desafio"
                ? "bg-white text-rose-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Desafío
          </button>
        </div>

        {/* Lives & Phase */}
        <div className="flex items-center gap-4 text-xs font-black px-2">
          <div className="flex items-center gap-1 text-rose-600">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${
                  i < lives ? "fill-rose-500 text-rose-500" : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-indigo-900">
            Fase {level} de 2
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Canvas Arcade Area */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="relative rounded-3xl overflow-hidden border-4 border-slate-900 bg-slate-950 shadow-2xl w-full max-w-[480px]">
            <canvas
              ref={canvasRef}
              width={480}
              height={320}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="w-full h-auto cursor-ew-resize block"
            />

            {/* Menu State Overlay */}
            {gameState === "menu" && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                <Zap className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
                <h3 className="font-black text-lg">Muro de los Mitos Arcade</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xs">
                  Mueve la paleta inferior para rebotar la esfera contra los ladrillos de micromachismos.
                </p>
                <button
                  onClick={startNewGame}
                  className="mt-4 px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 font-black text-xs text-white shadow-lg transition-all"
                >
                  ¡Iniciar Partida!
                </button>
              </div>
            )}

            {/* Countdown Overlay */}
            {gameState === "countdown" && (
              <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center text-center text-white pointer-events-none">
                <span className="text-6xl font-black text-yellow-400 animate-ping">
                  {countdown}
                </span>
                <span className="text-xs font-bold text-slate-300 mt-2">¡Prepárate!</span>
              </div>
            )}

            {/* Paused Overlay */}
            {gameState === "paused" && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                <Pause className="w-12 h-12 text-amber-400 mb-2" />
                <h3 className="font-black text-lg">Juego Pausado</h3>
                <button
                  onClick={() => setGameState("playing")}
                  className="mt-4 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-black text-xs text-white shadow-lg"
                >
                  Reanudar Partida
                </button>
              </div>
            )}

            {/* Game Over Overlay */}
            {gameState === "gameover" && (
              <div className="absolute inset-0 bg-rose-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                <p className="text-2xl font-black text-rose-300">¡Partida terminada!</p>
                <p className="text-xs text-slate-200 mt-1 max-w-xs">
                  Puntaje alcanzado: {score} pts. Recuerda que siempre puedes reintentarlo y derribar todos los mitos.
                </p>
                <button
                  onClick={startNewGame}
                  className="mt-4 px-5 py-2.5 rounded-2xl bg-white text-rose-900 font-black text-xs shadow hover:bg-rose-100"
                >
                  Jugar otra vez
                </button>
              </div>
            )}

            {/* Level Won Overlay */}
            {gameState === "levelwon" && (
              <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                <Award className="w-12 h-12 text-yellow-300 mb-1" />
                <p className="text-2xl font-black text-emerald-300">¡Fase {level} Superada!</p>
                <p className="text-xs text-emerald-100 mt-1">Has desmitificado los prejuicios de esta etapa con éxito.</p>
                <button
                  onClick={() => {
                    if (level === 1) {
                      setLevel(2);
                      resetRound(2);
                    } else {
                      setIsVictoryOpen(true);
                    }
                  }}
                  className="mt-4 px-5 py-2.5 rounded-2xl bg-emerald-500 font-black text-xs text-white shadow hover:bg-emerald-400"
                >
                  {level === 1 ? "Avanzar a Fase 2 ➡️" : "Ver Recompensas 🎉"}
                </button>
              </div>
            )}
          </div>

          {/* Accessible Touch Controls for Tablets & Mobiles */}
          <div className="flex items-center gap-3 mt-3 w-full max-w-[480px] justify-between">
            <button
              onClick={() => movePaddleStep(-40)}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center gap-1 transition-colors"
              aria-label="Mover paleta a la izquierda"
            >
              <ChevronLeft className="w-4 h-4" /> Mover Izquierda
            </button>
            <button
              onClick={() => movePaddleStep(40)}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center gap-1 transition-colors"
              aria-label="Mover paleta a la derecha"
            >
              Mover Derecha <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Unlocked Truths Column */}
        <div className="md:col-span-5 bg-slate-50 rounded-3xl p-5 border-2 border-slate-200/80 shadow-sm h-[380px] flex flex-col">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-500" />
              Mitos Derribados ({unlockedTruths.length}):
            </span>
            <span className="text-[10px] font-bold text-slate-400">En tiempo real</span>
          </h4>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {unlockedTruths.map((item, i) => (
              <div
                key={i}
                className="bg-white p-3 rounded-2xl border-l-4 border-l-rose-500 border border-slate-200 text-xs shadow-xs animate-fadeIn"
              >
                <span className="text-rose-700 font-black line-through block text-[11px]">
                  Mito: &ldquo;{item.myth}&rdquo;
                </span>
                <p className="text-slate-800 font-semibold mt-1 leading-snug">
                  💡 Realidad: {item.truth}
                </p>
              </div>
            ))}

            {unlockedTruths.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
                <p className="text-xs italic leading-relaxed">
                  Rompe ladrillos para desmitificar estereotipos de género y desbloquear verdades formativas de derechos humanos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        title="Instrucciones: El Muro de los Mitos"
        objective="Destruir los bloques de estereotipos machistas y desbloquear reflexiones sobre equidad, libertad y respeto."
        rules={[
          "Mueve la barra inferior deslizando el mouse, tocando la pantalla o usando los botones de flecha.",
          "Haz rebotar la esfera para impactar los ladrillos.",
          "Algunos bloques requieren dos impactos y los bloques con estrella dorada otorgan bonificaciones.",
          "Elige la velocidad que prefieras (Tranquila, Normal o Desafío) para jugar a tu propio ritmo."
        ]}
        tips={[
          "El punto de contacto sobre la barra determina la dirección del rebote.",
          "Cuentas con 3 vidas para completar ambas fases."
        ]}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        title="¡Muro de Mitos Totalmente Derribado!"
        score={score}
        stars={lives}
        maxStars={3}
        takeaway="Has demostrado destreza y desarticulado prejuicios sobre la expresión de emociones, las profesiones y los roles sociales."
        summaryPoints={[
          "Completaste las dos fases del muro de estereotipos.",
          "Desbloqueaste mensajes de respeto e igualdad de oportunidades.",
          "Reconociste que el talento y las emociones no tienen género."
        ]}
        onRestart={startNewGame}
      />

      <PauseModal
        isOpen={gameState === "paused"}
        onResume={() => setGameState("playing")}
        onRestart={startNewGame}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <EmergencyHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
