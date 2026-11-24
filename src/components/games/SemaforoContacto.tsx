"use client";

import React, { useState, useMemo } from "react";
import {
  Volume2,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  UserCheck,
} from "lucide-react";
import GameShell, { DifficultyLevel } from "@/components/common/GameShell";
import Mascot from "@/components/common/Mascot";
import Button3D from "@/components/common/Button3D";
import {
  SEMAFORO_SITUATIONS,
  BODY_ZONES_INFO,
  TRUSTED_ADULTS_MINI_SCENE,
  SEMAFORO_TUTORIAL,
  TrafficColor,
  BodyZoneInfo,
} from "@/content/game1-semaforo";
import { useSound } from "@/hooks/useSound";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";

interface GameProps {
  onHome?: () => void;
  onNextGame?: () => void;
}

/** Ilustración SVG propia para cada tipo de situación cotidiana */
function SituationIllustration({ sceneType }: { sceneType: string }) {
  switch (sceneType) {
    case "high_five":
    case "friendly_wave":
      return (
        <svg viewBox="0 0 180 110" className="w-full h-28" aria-hidden="true">
          <rect width="180" height="110" rx="16" fill="#ecfdf5" />
          <circle cx="55" cy="44" r="16" fill="#fbbf24" />
          <path d="M 48 44 Q 55 52 62 44" stroke="#1e293b" strokeWidth="2.5" fill="none" />
          <rect x="42" y="64" width="26" height="32" rx="10" fill="#10b981" />
          <circle cx="125" cy="44" r="16" fill="#f472b6" />
          <path d="M 118 44 Q 125 52 132 44" stroke="#1e293b" strokeWidth="2.5" fill="none" />
          <rect x="112" y="64" width="26" height="32" rx="10" fill="#3b82f6" />
          <path d="M 68 72 L 86 48 M 112 72 L 94 48" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
          <text x="90" y="34" textAnchor="middle" fontSize="18">✨</text>
        </svg>
      );
    case "unwanted_hug":
    case "hair_pull":
      return (
        <svg viewBox="0 0 180 110" className="w-full h-28" aria-hidden="true">
          <rect width="180" height="110" rx="16" fill="#fefce8" />
          <circle cx="90" cy="42" r="17" fill="#fde047" />
          <circle cx="84" cy="39" r="2.2" fill="#1e293b" />
          <circle cx="96" cy="39" r="2.2" fill="#1e293b" />
          <path d="M 83 48 Q 90 44 97 48" stroke="#1e293b" strokeWidth="2.5" fill="none" />
          <rect x="74" y="63" width="32" height="36" rx="12" fill="#f59e0b" />
          <circle cx="90" cy="55" r="42" fill="none" stroke="#eab308" strokeWidth="2.5" strokeDasharray="6 4" />
          <text x="144" y="36" fontSize="20">✋</text>
        </svg>
      );
    case "doctor_visit":
    case "coach_respect":
      return (
        <svg viewBox="0 0 180 110" className="w-full h-28" aria-hidden="true">
          <rect width="180" height="110" rx="16" fill="#eff6ff" />
          <circle cx="60" cy="45" r="15" fill="#93c5fd" />
          <rect x="46" y="63" width="28" height="34" rx="10" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
          <rect x="57" y="70" width="6" height="14" rx="1" fill="#ef4444" />
          <rect x="53" y="74" width="14" height="6" rx="1" fill="#ef4444" />
          <circle cx="120" cy="48" r="13" fill="#86efac" />
          <rect x="108" y="64" width="24" height="32" rx="10" fill="#10b981" />
          <circle cx="146" cy="40" r="12" fill="#fde68a" />
          <rect x="136" y="55" width="20" height="38" rx="8" fill="#8b5cf6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 180 110" className="w-full h-28" aria-hidden="true">
          <rect width="180" height="110" rx="16" fill="#fff1f2" />
          <polygon points="90,14 128,82 52,82" fill="#fecdd3" stroke="#e11d48" strokeWidth="3.5" strokeLinejoin="round" />
          <rect x="87" y="36" width="6" height="24" rx="3" fill="#be123c" />
          <circle cx="90" cy="70" r="4" fill="#be123c" />
          <text x="26" y="60" fontSize="22">🛡️</text>
          <text x="142" y="60" fontSize="22">🗣️</text>
        </svg>
      );
  }
}

/** Silueta corporal neutra y respetuosa para explorar límites personales */
function NeutralBodyMap({
  selectedZone,
  onSelectZone,
}: {
  selectedZone: BodyZoneInfo["id"];
  onSelectZone: (id: BodyZoneInfo["id"]) => void;
}) {
  const zoneColor = (id: BodyZoneInfo["id"], base: string) =>
    selectedZone === id ? "#4f46e5" : base;

  return (
    <svg
      viewBox="0 0 220 300"
      className="w-48 sm:w-56 mx-auto select-none"
      role="img"
      aria-label="Silueta corporal neutra interactiva para aprender límites personales"
    >
      {/* Fondo */}
      <rect x="10" y="10" width="200" height="280" rx="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />

      {/* Cabeza */}
      <g
        onClick={() => onSelectZone("head")}
        className="cursor-pointer transition-opacity hover:opacity-85"
        role="button"
        tabIndex={0}
        aria-label="Zona: Cabeza y rostro"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectZone("head");
          }
        }}
      >
        <circle cx="110" cy="54" r="28" fill={zoneColor("head", "#fde68a")} stroke="#475569" strokeWidth="2.5" />
        <circle cx="101" cy="50" r="3" fill="#334155" />
        <circle cx="119" cy="50" r="3" fill="#334155" />
        <path d="M 102 62 Q 110 68 118 62" stroke="#334155" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Hombros / Brazos superiores */}
      <g
        onClick={() => onSelectZone("shoulders")}
        className="cursor-pointer hover:opacity-85"
        role="button"
        tabIndex={0}
        aria-label="Zona: Hombros y espalda alta"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectZone("shoulders");
          }
        }}
      >
        <rect x="52" y="88" width="116" height="26" rx="13" fill={zoneColor("shoulders", "#fed7aa")} stroke="#475569" strokeWidth="2.5" />
      </g>

      {/* Manos */}
      <g
        onClick={() => onSelectZone("hands")}
        className="cursor-pointer hover:opacity-85"
        role="button"
        tabIndex={0}
        aria-label="Zona: Manos y antebrazos"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectZone("hands");
          }
        }}
      >
        <rect x="34" y="114" width="24" height="58" rx="12" fill={zoneColor("hands", "#bbf7d0")} stroke="#15803d" strokeWidth="2.5" />
        <rect x="162" y="114" width="24" height="58" rx="12" fill={zoneColor("hands", "#bbf7d0")} stroke="#15803d" strokeWidth="2.5" />
      </g>

      {/* Zona privada (traje de baño neutro) */}
      <g
        onClick={() => onSelectZone("chest_hip")}
        className="cursor-pointer hover:opacity-90"
        role="button"
        tabIndex={0}
        aria-label="Zona privada cubierta por traje de baño"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectZone("chest_hip");
          }
        }}
      >
        <rect
          x="72"
          y="114"
          width="76"
          height="82"
          rx="14"
          fill={zoneColor("chest_hip", "#fecaca")}
          stroke="#dc2626"
          strokeWidth="3"
        />
        <text x="110" y="152" textAnchor="middle" fontSize="11" fontWeight="bold" fill={selectedZone === "chest_hip" ? "#ffffff" : "#991b1b"}>
          TRAJE DE
        </text>
        <text x="110" y="167" textAnchor="middle" fontSize="11" fontWeight="bold" fill={selectedZone === "chest_hip" ? "#ffffff" : "#991b1b"}>
          BAÑO 🛡️
        </text>
      </g>

      {/* Piernas */}
      <g
        onClick={() => onSelectZone("legs")}
        className="cursor-pointer hover:opacity-85"
        role="button"
        tabIndex={0}
        aria-label="Zona: Piernas y pies"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectZone("legs");
          }
        }}
      >
        <rect x="76" y="200" width="28" height="72" rx="12" fill={zoneColor("legs", "#fef08a")} stroke="#475569" strokeWidth="2.5" />
        <rect x="116" y="200" width="28" height="72" rx="12" fill={zoneColor("legs", "#fef08a")} stroke="#475569" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

function SemaforoGameplay({
  difficulty,
  onComplete,
}: {
  difficulty: DifficultyLevel;
  onComplete: (stars: 0 | 1 | 2 | 3, score: number, maxScore: number, msg: string) => void;
}) {
  const { playClick, playCorrect, playAlert } = useSound();

  const missions = useMemo(() => {
    if (difficulty === "facil") return SEMAFORO_SITUATIONS.slice(0, 6);
    if (difficulty === "normal") return SEMAFORO_SITUATIONS.slice(0, 10);
    return SEMAFORO_SITUATIONS; // 12
  }, [difficulty]);

  const [step, setStep] = useState<"missions" | "bodymap" | "trusted">("missions");
  const [idx, setIdx] = useState(0);
  const [chosenColor, setChosenColor] = useState<TrafficColor | null>(null);
  const [score, setScore] = useState(0);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [readAloud, setReadAloud] = useState(false);

  // Body map state
  const [selectedZone, setSelectedZone] = useState<BodyZoneInfo["id"]>("chest_hip");
  const [inspectedZones, setInspectedZones] = useState<string[]>(["chest_hip"]);

  // Mini escena final state
  const [selectedAdultId, setSelectedAdultId] = useState<string | null>(null);

  const current = missions[idx];
  const zoneDetail = BODY_ZONES_INFO.find((z) => z.id === selectedZone)!;

  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!readAloud || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-MX";
    window.speechSynthesis.speak(u);
  };

  const handleChooseColor = (color: TrafficColor) => {
    if (chosenColor !== null || step !== "missions") return;
    setChosenColor(color);
    const isRight = color === current.correctColor;

    if (isRight) {
      playCorrect();
      setScore((s) => s + 100);
      speak(current.explanation);
    } else {
      playAlert();
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 450);
      speak(`Casi. ${current.explanation}`);
    }
  };

  // Teclado 1=Verde, 2=Amarillo, 3=Rojo
  useKeyboardControls(
    {
      "1": () => handleChooseColor("green"),
      "2": () => handleChooseColor("yellow"),
      "3": () => handleChooseColor("red"),
    },
    step === "missions" && chosenColor === null
  );

  const handleNextMission = () => {
    playClick();
    if (idx + 1 < missions.length) {
      setIdx(idx + 1);
      setChosenColor(null);
    } else {
      setStep("bodymap");
    }
  };

  const handleZoneSelect = (id: BodyZoneInfo["id"]) => {
    playClick();
    setSelectedZone(id);
    if (!inspectedZones.includes(id)) {
      setInspectedZones((prev) => [...prev, id]);
    }
  };

  const handleTrustedSelect = (optionId: string) => {
    playClick();
    setSelectedAdultId(optionId);
    const found = TRUSTED_ADULTS_MINI_SCENE.find((a) => a.id === optionId);
    if (found?.isTrusted) {
      playCorrect();
    } else {
      playAlert();
    }
  };

  const handleFinishAll = () => {
    const trustedPicked = TRUSTED_ADULTS_MINI_SCENE.find((a) => a.id === selectedAdultId)?.isTrusted;
    const totalScore = score + (trustedPicked ? 100 : 0);
    const maxScore = missions.length * 100 + 100;
    const ratio = totalScore / maxScore;
    const stars: 0 | 1 | 2 | 3 = ratio >= 0.85 ? 3 : ratio >= 0.6 ? 2 : 1;

    onComplete(
      stars,
      totalScore,
      maxScore,
      `¡Completaste ${missions.length} situaciones del Semáforo del Respeto y exploraste tu red de confianza! Recuerda siempre: tu cuerpo es tuyo, puedes decir ¡NO! y contar a un adulto de confianza.`
    );
  };

  const isAnswerCorrect = chosenColor === current?.correctColor;

  return (
    <div className="bg-white rounded-4xl border-2 border-emerald-200 shadow-xl p-5 sm:p-8 space-y-6">
      {/* Barra superior del juego */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
            {step === "missions"
              ? `Misión ${idx + 1} de ${missions.length}`
              : step === "bodymap"
              ? "Paso 2 · Mapa Corporal"
              : "Paso 3 · ¿A quién le cuento?"}
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
            {score} pts
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClick();
              setReadAloud((v) => !v);
            }}
            className={`min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 ${
              readAloud
                ? "bg-indigo-600 text-white border-indigo-700"
                : "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {readAloud ? "Voz Activa" : "Activar Voz"}
          </button>

          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              onClick={() => setStep("missions")}
              className={`px-2.5 py-1.5 rounded-lg ${
                step === "missions" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
              }`}
            >
              🚦 Misiones
            </button>
            <button
              onClick={() => setStep("bodymap")}
              className={`px-2.5 py-1.5 rounded-lg ${
                step === "bodymap" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
              }`}
            >
              🧍 Cuerpo
            </button>
          </div>
        </div>
      </div>

      {/* PASO 1: MISIONES */}
      {step === "missions" && (
        <div className={`space-y-5 ${shakeWrong ? "animate-shake" : ""}`}>
          {/* Tarjeta arrastrable de situación */}
          <div
            draggable={chosenColor === null}
            onDragStart={(e) => e.dataTransfer.setData("text/plain", String(current.id))}
            className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 items-center cursor-grab active:cursor-grabbing"
          >
            <SituationIllustration sceneType={current.sceneType} />
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-display font-black text-slate-900">
                  {current.title}
                </h3>
                <button
                  onClick={() => speak(`${current.title}. ${current.situation}`)}
                  className="min-h-[36px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold inline-flex items-center gap-1"
                  aria-label="Escuchar situación"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Escuchar
                </button>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                {current.situation}
              </p>
              <p className="text-[11px] font-bold text-slate-600">
                Arrastra esta situación hacia el color correcto del semáforo o presiona un botón (teclas 1, 2 o 3).
              </p>
            </div>
          </div>

          {/* 3 Zonas de Semáforo (Drop targets + Click buttons) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              {
                color: "green" as TrafficColor,
                label: "VERDE · Seguro y con permiso",
                sub: "Ambas personas quieren y hay respeto",
                emoji: "🟢",
                cls: "border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-emerald-950",
              },
              {
                color: "yellow" as TrafficColor,
                label: "AMARILLO · Tú decides",
                sub: "Puedes decir 'No gracias, prefiero otra cosa'",
                emoji: "🟡",
                cls: "border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-950",
              },
              {
                color: "red" as TrafficColor,
                label: "ROJO · ¡ALTO y pedir ayuda!",
                sub: "Di ¡NO!, aléjate y avisa a un adulto de confianza",
                emoji: "🔴",
                cls: "border-rose-400 bg-rose-50 hover:bg-rose-100 text-rose-950",
              },
            ].map((btn) => {
              const isPicked = chosenColor === btn.color;
              const isTrue = current.correctColor === btn.color;
              return (
                <button
                  key={btn.color}
                  onClick={() => handleChooseColor(btn.color)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleChooseColor(btn.color);
                  }}
                  disabled={chosenColor !== null}
                  className={`min-h-[96px] p-4 rounded-3xl border-3 text-left transition-all flex flex-col justify-between shadow-sm ${
                    chosenColor === null
                      ? btn.cls
                      : isTrue
                      ? "border-emerald-600 bg-emerald-100 ring-4 ring-emerald-200"
                      : isPicked
                      ? "border-rose-600 bg-rose-100"
                      : "border-slate-200 bg-slate-50 opacity-55"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{btn.emoji}</span>
                    {chosenColor !== null && isTrue && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    )}
                  </div>
                  <div>
                    <p className="font-black text-sm">{btn.label}</p>
                    <p className="text-xs opacity-85 mt-0.5">{btn.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Retroalimentación inmediata con Axo */}
          {chosenColor !== null && (
            <div
              className={`rounded-3xl p-4 sm:p-5 border-2 flex flex-col sm:flex-row items-center gap-4 animate-scaleUp ${
                isAnswerCorrect
                  ? "bg-emerald-50 border-emerald-300"
                  : "bg-amber-50 border-amber-300"
              }`}
            >
              <Mascot expression={isAnswerCorrect ? "celebrating" : "encouraging"} size={72} />
              <div className="flex-1 space-y-1">
                <p className="font-black text-sm text-slate-900">
                  {isAnswerCorrect ? "¡Excelente criterio de autocuidado!" : "Buena oportunidad para aprender juntos:"}
                </p>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {current.explanation}
                </p>
                <p className="text-xs font-bold text-indigo-800 pt-1">
                  💡 Axo dice: &ldquo;{current.axoTip}&rdquo;
                </p>
              </div>
              <Button3D
                variant="infantil"
                size="md"
                onClick={handleNextMission}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                {idx + 1 < missions.length ? "Siguiente" : "Ir al Mapa Corporal"}
              </Button3D>
            </div>
          )}
        </div>
      )}

      {/* PASO 2: MAPA CORPORAL EDUCATIVO Y RESPETUOSO */}
      {step === "bodymap" && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4">
            <h3 className="font-black text-indigo-950 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Explora tu Mapa Corporal Respetuoso (Toca cada zona)
            </h3>
            <p className="text-xs sm:text-sm text-indigo-900/80 mt-1">
              Identifica qué partes de tu cuerpo son privadas (cubiertas por tu traje de baño) y cómo defender tus límites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <NeutralBodyMap selectedZone={selectedZone} onSelectZone={handleZoneSelect} />

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {BODY_ZONES_INFO.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => handleZoneSelect(z.id)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedZone === z.id
                        ? "bg-indigo-600 text-white border-indigo-700"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {z.defaultSafe === "red" ? "🔴" : z.defaultSafe === "green" ? "🟢" : "🟡"}{" "}
                    {z.label.split(" ")[0]}
                  </button>
                ))}
              </div>

              <div className="p-5 rounded-3xl border-2 border-slate-200 bg-slate-50 space-y-2.5">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                    zoneDetail.defaultSafe === "red"
                      ? "bg-rose-100 text-rose-900"
                      : zoneDetail.defaultSafe === "green"
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {zoneDetail.label}
                </span>
                <p className="text-sm font-black text-slate-900">{zoneDetail.rule}</p>
                <p className="text-xs text-slate-700 leading-relaxed">{zoneDetail.examples}</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-500">
                  Zonas exploradas: {inspectedZones.length} de {BODY_ZONES_INFO.length}
                </span>
                <Button3D
                  variant="infantil"
                  size="md"
                  onClick={() => {
                    playClick();
                    setStep("trusted");
                  }}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Mini-escena final: ¿A quién cuento?
                </Button3D>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PASO 3: MINI-ESCENA FINAL (RED DE CONFIANZA) */}
      {step === "trusted" && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-rose-50 border-2 border-rose-200 rounded-3xl p-5">
            <Mascot expression="encouraging" size={80} />
            <div>
              <h3 className="text-lg sm:text-xl font-display font-black text-rose-950 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-rose-600" />
                Mini-Escena Final: ¿A quién le cuentas si un secreto te incomoda?
              </h3>
              <p className="text-xs sm:text-sm text-rose-900 mt-1">
                Imagina que alguien cruzó un semáforo amarillo o rojo. Elige con quién acudirías en Morelia:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {TRUSTED_ADULTS_MINI_SCENE.map((opt) => {
              const picked = selectedAdultId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleTrustedSelect(opt.id)}
                  className={`min-h-[88px] p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all ${
                    picked
                      ? opt.isTrusted
                        ? "bg-emerald-50 border-emerald-500 ring-4 ring-emerald-100"
                        : "bg-amber-50 border-amber-500"
                      : "bg-white border-slate-200 hover:border-indigo-400"
                  }`}
                >
                  <span className="text-3xl shrink-0">{opt.emoji}</span>
                  <div>
                    <p className="font-black text-sm text-slate-900">{opt.name}</p>
                    <p className="text-xs text-slate-500">{opt.role}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedAdultId && (
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3 animate-scaleUp">
              <p className="text-sm font-bold text-slate-900">
                {TRUSTED_ADULTS_MINI_SCENE.find((a) => a.id === selectedAdultId)?.feedback}
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                Recuerda: el botón rojo &ldquo;Necesito ayuda&rdquo; arriba siempre te conecta con el directorio de Morelia.
              </p>

              {TRUSTED_ADULTS_MINI_SCENE.find((a) => a.id === selectedAdultId)?.isTrusted && (
                <Button3D variant="success" size="lg" onClick={handleFinishAll}>
                  Finalizar Misión y Ver Mis Estrellas ⭐
                </Button3D>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SemaforoContacto({ onHome, onNextGame }: GameProps) {
  return (
    <GameShell
      gameId="semaforo"
      tutorialSteps={SEMAFORO_TUTORIAL}
      difficulties={[
        { id: "facil", label: "Nivel 1 · Exploración (6 casos)", subtitle: "Situaciones esenciales paso a paso", emoji: "🟢" },
        { id: "normal", label: "Nivel 2 · Aventura (10 casos)", subtitle: "Incluye límites en internet y escuela", emoji: "🟡" },
        { id: "reto", label: "Nivel 3 · Guardián (12 casos)", subtitle: "Todos los escenarios + mapa corporal", emoji: "🛡️" },
      ]}
      onHome={onHome}
      onNextGame={onNextGame}
    >
      {({ difficulty, finishGame }) => (
        <SemaforoGameplay difficulty={difficulty} onComplete={finishGame} />
      )}
    </GameShell>
  );
}
