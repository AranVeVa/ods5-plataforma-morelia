"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Shield,
  Play,
  RotateCcw,
  Heart,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle,
  Pause
} from "lucide-react";
import confetti from "canvas-confetti";
import GameHeader from "@/components/common/GameHeader";
import InstructionsModal from "@/components/common/InstructionsModal";
import VictoryModal from "@/components/common/VictoryModal";
import PauseModal from "@/components/common/PauseModal";
import EmergencyHelpModal from "@/components/common/EmergencyHelpModal";
import { sound } from "@/utils/audio";

interface FallingEntity {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: "toxic" | "emotion";
  text: string;
  icon: string;
  explanation: string;
}

const HEALTHY_EMOTIONS = [
  { text: "Llorar ante la tristeza", icon: "💧", explanation: "Llorar es natural; ayuda al cuerpo a liberar dolor y restablecer el equilibrio emocional." },
  { text: "Pedir un abrazo de apoyo", icon: "🤗", explanation: "Buscar afecto y cercanía fortalece la salud mental y la empatía en los vínculos." },
  { text: "Reconocer que siento miedo", icon: "🛡️", explanation: "El miedo es una señal que nos protege del peligro real; expresarlo nos permite recibir ayuda." },
  { text: "Tratar con ternura", icon: "🌸", explanation: "La ternura y la delicadeza son muestras de madurez y fortaleza humana, no de debilidad." },
  { text: "Pedir ayuda cuando no puedo", icon: "🤝", explanation: "Pedir ayuda es un acto de gran valentía e inteligencia que resuelve dificultades." },
  { text: "Manifestar mis dudas", icon: "💬", explanation: "Preguntar y dudar es la base del aprendizaje y del pensamiento crítico sin presiones." },
];

const TOXIC_MANDATES = [
  { text: "Los hombres no lloran", icon: "🛑", explanation: "Mandato machista que enferma y reprime la salud emocional." },
  { text: "No muestres debilidad", icon: "🚫", explanation: "Pretensión dañina de invulnerabilidad que aísla a las personas." },
  { text: "Pelea a golpes", icon: "👊", explanation: "La violencia física degrada la convivencia y nunca soluciona desacuerdos." },
  { text: "Imponte a la fuerza", icon: "⚠️", explanation: "El autoritarismo destruye la confianza y vulnera derechos." },
  { text: "Sentir es de débiles", icon: "⛔", explanation: "Todas las personas sienten; reprimir las emociones genera conductas agresivas." },
];

export default function EscudoEmocional() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [shieldEnergy, setShieldEnergy] = useState<number>(100);
  const [isShieldActive, setIsShieldActive] = useState<boolean>(false);
  const [recentMessage, setRecentMessage] = useState<string>("¡Mueve tu personaje para acoger emociones saludables y activar tu escudo ante presiones!");
  const [collectedEmotions, setCollectedEmotions] = useState<{ text: string; icon: string; explanation: string }[]>([]);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const stateRef = useRef({
    playerX: 200,
    playerTargetX: 200,
    playerW: 75,
    playerH: 30,
    entities: [] as FallingEntity[],
    nextId: 1,
    lastSpawn: 0,
    animationId: 0,
    lastTime: 0,
    shieldActive: false,
    shieldEnergy: 100,
  });

  const activateShield = () => {
    if (stateRef.current.shieldEnergy >= 25 && !stateRef.current.shieldActive) {
      sound.playShield();
      stateRef.current.shieldActive = true;
      stateRef.current.shieldEnergy -= 25;
      setIsShieldActive(true);
      setShieldEnergy(stateRef.current.shieldEnergy);

      setTimeout(() => {
        stateRef.current.shieldActive = false;
        setIsShieldActive(false);
      }, 1500);
    }
  };

  const resetGame = () => {
    sound.playPowerup();
    stateRef.current.entities = [];
    stateRef.current.playerX = 200;
    stateRef.current.playerTargetX = 200;
    stateRef.current.shieldEnergy = 100;
    stateRef.current.shieldActive = false;
    setScore(0);
    setLives(3);
    setShieldEnergy(100);
    setIsShieldActive(false);
    setCollectedEmotions([]);
    setRecentMessage("¡Muévete con agilidad para integrar emociones y rechazar imposiciones machistas!");
    setIsPlaying(true);
    setIsPaused(false);
    setIsVictoryOpen(false);
  };

  // Keyboard controls (Arrow keys / A-D and Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused) return;

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        stateRef.current.playerTargetX = Math.max(10, stateRef.current.playerTargetX - 45);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        const canvas = canvasRef.current;
        if (canvas) {
          stateRef.current.playerTargetX = Math.min(canvas.width - stateRef.current.playerW - 10, stateRef.current.playerTargetX + 45);
        }
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        activateShield();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isPaused]);

  // Main Action Loop
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;
    stateRef.current.lastTime = performance.now();

    const loop = (timestamp: number) => {
      if (!isRunning) return;

      const state = stateRef.current;
      const dt = Math.min((timestamp - state.lastTime) / 1000, 0.05);
      state.lastTime = timestamp;

      const { width, height } = canvas;

      // Slowly recharge shield energy
      if (state.shieldEnergy < 100) {
        state.shieldEnergy = Math.min(100, state.shieldEnergy + dt * 10);
        setShieldEnergy(Math.round(state.shieldEnergy));
      }

      // Smooth player movement
      state.playerX += (state.playerTargetX - state.playerX) * 0.2;

      // Spawn items periodically
      if (timestamp - state.lastSpawn > 1100) {
        state.lastSpawn = timestamp;
        const isEmotion = Math.random() > 0.42;
        const pool = isEmotion ? HEALTHY_EMOTIONS : TOXIC_MANDATES;
        const chosen = pool[Math.floor(Math.random() * pool.length)];

        state.entities.push({
          id: state.nextId++,
          x: Math.random() * (width - 130) + 15,
          y: -25,
          speed: 85 + Math.random() * 45, // px/sec controlled speed
          type: isEmotion ? "emotion" : "toxic",
          text: chosen.text,
          icon: chosen.icon,
          explanation: chosen.explanation,
        });
      }

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Draw Player
      ctx.fillStyle = state.shieldActive ? "#06b6d4" : "#3b82f6";
      ctx.beginPath();
      ctx.roundRect(state.playerX, height - 38, state.playerW, state.playerH, 8);
      ctx.fill();

      // Shield Aura when active
      if (state.shieldActive) {
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(state.playerX + state.playerW / 2, height - 23, state.playerW * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Player Label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        state.shieldActive ? "🛡️ Escudo ON" : "🧘 Yo Auténtico",
        state.playerX + state.playerW / 2,
        height - 23
      );

      // Process Falling Entities
      const remaining: FallingEntity[] = [];

      for (const ent of state.entities) {
        ent.y += ent.speed * dt;

        // Collision Check
        const hitX = ent.x + 55 > state.playerX && ent.x < state.playerX + state.playerW;
        const hitY = ent.y + 18 > height - 38 && ent.y < height - 10;

        if (hitX && hitY) {
          if (ent.type === "emotion") {
            sound.playCorrect();
            setScore((s) => s + 50);
            setRecentMessage(`✨ Acogiste: "${ent.text}" — ${ent.explanation}`);
            setCollectedEmotions((prev) => [
              { text: ent.text, icon: ent.icon, explanation: ent.explanation },
              ...prev.slice(0, 4),
            ]);

            // Victory check
            if (score + 50 >= 300) {
              sound.playCelebration();
              setIsVictoryOpen(true);
              setIsPlaying(false);
              return;
            }
          } else {
            // Toxic Mandate hit
            if (state.shieldActive) {
              sound.playShield();
              setScore((s) => s + 25);
              setRecentMessage(`🛡️ ¡Tu escudo rechazó la presión: "${ent.text}"!`);
            } else {
              sound.playAlert();
              setLives((l) => {
                const updated = l - 1;
                if (updated <= 0) {
                  setIsPlaying(false);
                }
                return updated;
              });
              setRecentMessage(`⚠️ Mandato impuesto: "${ent.text}" — ${ent.explanation}`);
            }
          }
          continue;
        }

        if (ent.y < height + 30) {
          // Draw falling pill
          ctx.fillStyle = ent.type === "emotion" ? "#10b981" : "#ef4444";
          ctx.beginPath();
          ctx.roundRect(ent.x, ent.y, 125, 26, 6);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9.5px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${ent.icon} ${ent.text}`, ent.x + 62, ent.y + 13);

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
  }, [isPlaying, isPaused, score]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    stateRef.current.playerTargetX = Math.max(10, Math.min(canvas.width - stateRef.current.playerW - 10, mouseX - stateRef.current.playerW / 2));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    stateRef.current.playerTargetX = Math.max(10, Math.min(canvas.width - stateRef.current.playerW - 10, touchX - stateRef.current.playerW / 2));
  };

  const movePlayerStep = (delta: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    stateRef.current.playerTargetX = Math.max(10, Math.min(canvas.width - stateRef.current.playerW - 10, stateRef.current.playerTargetX + delta));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-100 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <GameHeader
        title="🛡️ El Escudo Emocional"
        badge="Nuevas masculinidades, salud socioemocional y empatía"
        levelBadge="Nivel Intermedio (10 a 13 años)"
        levelColor="rose"
        odsTarget="Salud y Equidad"
        score={score}
        stars={lives}
        maxStars={3}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onRestart={resetGame}
        onPause={() => setIsPaused(!isPaused)}
        isPaused={isPaused}
      />

      {/* Control Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2 rounded-2xl">
        <div className="flex items-center gap-3">
          {/* Energy Bar */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <Zap className="w-4 h-4 text-cyan-600" />
            <span className="text-xs font-bold text-slate-700">Escudo:</span>
            <div className="w-20 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${shieldEnergy}%` }}
                className="h-full bg-cyan-500 transition-all duration-300"
              />
            </div>
            <span className="text-[10px] font-black text-cyan-800">{shieldEnergy}%</span>
          </div>

          <button
            onClick={activateShield}
            disabled={shieldEnergy < 25}
            className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-xs transition-all ${
              shieldEnergy >= 25
                ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            🛡️ Activar Escudo (Espacio)
          </button>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-rose-500">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${
                  i < lives ? "fill-rose-500 text-rose-500" : "text-slate-300"
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-bold text-slate-500">
            Meta: 300 pts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Canvas Area */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="relative rounded-3xl overflow-hidden border-4 border-slate-900 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 shadow-2xl w-full max-w-[480px]">
            <canvas
              ref={canvasRef}
              width={480}
              height={320}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="w-full h-auto cursor-ew-resize block"
            />

            {!isPlaying && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                <Shield className="w-12 h-12 text-cyan-400 mb-2 animate-bounce" />
                <h3 className="font-black text-lg">Acoge lo que sientes</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
                  🟢 Atrapa las emociones humanas saludables (+50 pts). <br />
                  🔴 Esquiva mandatos machistas o usa tu escudo protector.
                </p>
                <button
                  onClick={resetGame}
                  className="mt-4 px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 font-black text-xs text-slate-950 shadow-lg"
                >
                  ¡Iniciar Partida!
                </button>
              </div>
            )}
          </div>

          {/* On-screen tactile controls */}
          <div className="flex items-center gap-2 mt-3 w-full max-w-[480px]">
            <button
              onClick={() => movePlayerStep(-45)}
              className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Izquierda
            </button>
            <button
              onClick={activateShield}
              disabled={shieldEnergy < 25}
              className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5" /> Escudo
            </button>
            <button
              onClick={() => movePlayerStep(45)}
              className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center gap-1 transition-colors"
            >
              Derecha <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Action Card */}
          <div className="w-full max-w-[480px] mt-2 p-3 bg-slate-100 rounded-2xl text-xs font-bold text-slate-800 text-center leading-snug">
            {recentMessage}
          </div>
        </div>

        {/* Collected Healthy Emotions Showcase */}
        <div className="md:col-span-5 bg-slate-50 rounded-3xl p-5 border-2 border-slate-200/80 shadow-sm h-[390px] flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Emociones que has acogido:
            </h4>
            <p className="text-[11px] text-slate-500 mb-3">
              Las emociones nunca son debilidad; expresarlas saludablemente nos hace personas libres y empáticas.
            </p>

            <div className="space-y-2 overflow-y-auto max-h-[240px] pr-1">
              {collectedEmotions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-2xl border border-emerald-200 text-xs shadow-2xs animate-fadeIn"
                >
                  <div className="flex items-center gap-2 font-black text-emerald-900">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-tight">
                    {item.explanation}
                  </p>
                </div>
              ))}

              {collectedEmotions.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-8">
                  Atrapa rectángulos verdes para registrar reflexiones socioemocionales.
                </p>
              )}
            </div>
          </div>

          <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-[11px] text-cyan-950 font-medium">
            <strong>Consejo para varones:</strong> Rompe el mandato del silencio. Expresar tristeza o pedir un abrazo demuestra auténtica valentía y previene agresiones.
          </div>
        </div>
      </div>

      {/* Modals */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        title="Instrucciones: El Escudo Emocional"
        objective="Aprender a validar las emociones humanas (tristeza, ternura, miedo, pedir ayuda) y esquivar mandatos machistas que reprimen los sentimientos."
        rules={[
          "Mueve a tu personaje hacia los lados con las flechas del teclado, deslizando el mouse o tocando la pantalla.",
          "Atrapa los bloques verdes que representan emociones válidas para sumar puntos y comprender su valor.",
          "Esquiva los bloques rojos de mandatos machistas o presiona 'Espacio' para activar tu escudo protector temporal."
        ]}
        tips={[
          "Las emociones nunca son negativas ni obstáculos.",
          "Llega a 300 puntos para completar el reto con honores."
        ]}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        title="¡Campeón de la Salud Socioemocional!"
        score={score}
        stars={lives}
        maxStars={3}
        takeaway="Has demostrado que las emociones no tienen género, que los hombres también pueden llorar, pedir ayuda y ser empáticos sin miedo al qué dirán."
        summaryPoints={[
          "Reconociste el valor de pedir ayuda y expresar vulnerabilidad.",
          "Rechazaste la presión social que impone resolver conflictos a golpes.",
          "Fortaleciste una masculinidad empática, responsable y pacífica."
        ]}
        onRestart={resetGame}
      />

      <PauseModal
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
        onRestart={resetGame}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <EmergencyHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
