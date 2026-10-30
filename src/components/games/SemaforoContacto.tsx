"use client";

import React, { useState } from "react";
import { ShieldCheck, Sparkles, RefreshCw, Star, CheckCircle, HelpCircle, Heart, Award } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "@/utils/audio";

interface ZoneInfo {
  id: "hands" | "face" | "torso" | "personal";
  name: string;
  zoneType: "green" | "yellow" | "red";
  trafficLight: "Verde" | "Amarillo" | "Rojo";
  rule: string;
  friendlyTip: string;
}

const ZONES: Record<string, ZoneInfo> = {
  hands: {
    id: "hands",
    name: "Manos y Brazos",
    zoneType: "green",
    trafficLight: "Verde",
    rule: "Espacio de saludo y juego compartido.",
    friendlyTip: "Chocar los cinco, saludarse con respeto y jugar juntos siempre que ambas personas estén de acuerdo."
  },
  face: {
    id: "face",
    name: "Cabeza y Hombros",
    zoneType: "yellow",
    trafficLight: "Amarillo",
    rule: "Zona de alerta y consentimiento mutuo.",
    friendlyTip: "Si una caricia o palmada no te agrada o te hace sentir incomodidad, tienes todo el derecho de decir: ¡No me agrada, por favor mantén mi distancia!"
  },
  personal: {
    id: "personal",
    name: "Zona de Protección Personal Íntima",
    zoneType: "red",
    trafficLight: "Rojo",
    rule: "¡Espacio personal inviolable y protegido!",
    friendlyTip: "Cualquier zona cubierta por tu traje de baño te pertenece únicamente a ti. Nadie tiene derecho a invadirla ni a pedirte secretos incómodos. ¡Comunícalo siempre a tu familia o maestros!"
  }
};

interface Challenge {
  id: number;
  prompt: string;
  targetZone: "hands" | "face" | "personal";
  hint: string;
  successMessage: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    prompt: "¿Cuál es la zona íntima de protección personal que nadie puede invadir ni pedirte secretos incómodos?",
    targetZone: "personal",
    hint: "Busca la zona central protegida con el semáforo rojo.",
    successMessage: "¡Correcto! Tu espacio personal íntimo te pertenece solo a ti y debe respetarse siempre."
  },
  {
    id: 2,
    prompt: "¿Con qué parte de tu cuerpo puedes saludar amistosamente, chocar las cinco o jugar en equipo?",
    targetZone: "hands",
    hint: "Observa las extremidades con el color verde del semáforo.",
    successMessage: "¡Excelente! Las manos permiten compartir afecto sano, amistad y trabajo colaborativo."
  },
  {
    id: 3,
    prompt: "Si alguien te toca la cabeza o el hombro y te hace dudar o sentir molestia, ¿en qué zona de atención te encuentras?",
    targetZone: "face",
    hint: "Identifica la zona amarilla de precaución donde debes hacer valer tu comodidad.",
    successMessage: "¡Gran decisión! Ante cualquier duda o incomodidad, enciende tu luz amarilla y habla con un adulto de confianza."
  }
];

export default function SemaforoContacto() {
  const [mode, setMode] = useState<"challenge" | "explore">("challenge");
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState<number>(0);
  const [selectedZone, setSelectedZone] = useState<ZoneInfo>(ZONES.personal);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [completedAll, setCompletedAll] = useState<boolean>(false);

  const activeChallenge = CHALLENGES[currentChallengeIdx];

  const handleZoneSelect = (zoneKey: "hands" | "face" | "personal") => {
    const zone = ZONES[zoneKey];
    setSelectedZone(zone);

    if (mode === "challenge") {
      if (zoneKey === activeChallenge.targetZone) {
        sound.playCorrect();
        setIsSuccess(true);
        setFeedback(activeChallenge.successMessage);
        setScore((s) => s + 100);

        if (currentChallengeIdx + 1 < CHALLENGES.length) {
          setTimeout(() => {
            setCurrentChallengeIdx((prev) => prev + 1);
            setFeedback(null);
            setIsSuccess(false);
          }, 1800);
        } else {
          setCompletedAll(true);
          sound.playCelebration();
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        sound.playAlert();
        setIsSuccess(false);
        setFeedback(`Pista: ${activeChallenge.hint}`);
      }
    } else {
      sound.playClick();
      setFeedback(null);
    }
  };

  const restartChallenges = () => {
    sound.playPowerup();
    setCurrentChallengeIdx(0);
    setScore(0);
    setFeedback(null);
    setIsSuccess(false);
    setCompletedAll(false);
    setSelectedZone(ZONES.personal);
  };

  return (
    <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-4 h-4" /> Nivel Infantil (6-9 años) • ODS 5.2
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {score} Puntos
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
            🚦 Semáforo del Respeto y Autocuidado
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Reconoce las zonas de tu espacio personal para aprender a cuidarte y poner límites sanos.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => {
              setMode("challenge");
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === "challenge"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🎯 Modo Misión
          </button>
          <button
            onClick={() => {
              setMode("explore");
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === "explore"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🔍 Explorar
          </button>
        </div>
      </div>

      {/* Challenge Banner in Challenge Mode */}
      {mode === "challenge" && !completedAll && (
        <div className="mt-5 p-4 rounded-2xl bg-indigo-600 text-white shadow-md flex items-start gap-3 animate-fadeIn">
          <HelpCircle className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-200">
              Misión {currentChallengeIdx + 1} de {CHALLENGES.length}:
            </span>
            <p className="text-sm md:text-base font-bold mt-0.5 leading-snug">
              {activeChallenge.prompt}
            </p>
          </div>
        </div>
      )}

      {/* Completion Banner */}
      {completedAll && (
        <div className="mt-5 p-5 rounded-2xl bg-emerald-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-10 h-10 text-yellow-300" />
            <div>
              <h4 className="text-lg font-black">¡Felicitaciones, Guardián del Respeto!</h4>
              <p className="text-xs text-emerald-100">Has completado todas las misiones de autocuidado con éxito.</p>
            </div>
          </div>
          <button
            onClick={restartChallenges}
            className="px-4 py-2 bg-white text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors shadow"
          >
            Repetir Desafío
          </button>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6 items-center">
        {/* Interactive Silhouette Display */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-white/90 rounded-3xl p-6 border-2 border-indigo-100 shadow-inner">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Toca el cuerpo para responder:
          </span>

          <svg
            viewBox="0 0 200 320"
            className="w-52 h-80 drop-shadow-md select-none transition-transform hover:scale-102"
            aria-label="Silueta anatómica amigable de autocuidado infantil"
          >
            {/* Cabeza / Zona de alerta y respeto */}
            <circle
              cx="100"
              cy="45"
              r="28"
              className={`cursor-pointer transition-all duration-300 ${
                selectedZone.id === "face"
                  ? "fill-amber-400 stroke-amber-600 stroke-[4px] filter drop-shadow"
                  : "fill-amber-200 hover:fill-amber-300 stroke-amber-400 stroke-2"
              }`}
              onClick={() => handleZoneSelect("face")}
            />
            {/* Ojos y sonrisa afectuosa */}
            <circle cx="91" cy="42" r="3.5" fill="#1e293b" />
            <circle cx="109" cy="42" r="3.5" fill="#1e293b" />
            <path
              d="M 91 53 Q 100 62 109 53"
              stroke="#1e293b"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Zona Íntima y Protegida (Torso y cadera) */}
            <rect
              x="72"
              y="82"
              width="56"
              height="85"
              rx="16"
              className={`cursor-pointer transition-all duration-300 ${
                selectedZone.id === "personal"
                  ? "fill-rose-500 stroke-rose-700 stroke-[4px] filter drop-shadow"
                  : "fill-rose-300 hover:fill-rose-400 stroke-rose-400 stroke-2"
              }`}
              onClick={() => handleZoneSelect("personal")}
            />

            {/* Icono de escudo de protección sobre zona íntima */}
            <g transform="translate(90, 110) scale(0.8)" pointerEvents="none">
              <path
                d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"
                fill="#ffffff"
                opacity="0.9"
              />
            </g>

            {/* Brazo y Mano Izquierda (Zona Verde) */}
            <path
              d="M 72 90 L 38 145 L 28 138 L 62 85 Z"
              className={`cursor-pointer transition-all duration-300 ${
                selectedZone.id === "hands"
                  ? "fill-emerald-500 stroke-emerald-700 stroke-[4px]"
                  : "fill-emerald-300 hover:fill-emerald-400 stroke-emerald-500 stroke-2"
              }`}
              onClick={() => handleZoneSelect("hands")}
            />
            <circle
              cx="33"
              cy="150"
              r="11"
              className={`cursor-pointer transition-all duration-300 ${
                selectedZone.id === "hands"
                  ? "fill-emerald-500 stroke-emerald-700 stroke-[4px]"
                  : "fill-emerald-300 hover:fill-emerald-400 stroke-emerald-500 stroke-2"
              }`}
              onClick={() => handleZoneSelect("hands")}
            />

            {/* Brazo y Mano Derecha (Zona Verde) */}
            <path
              d="M 128 90 L 162 145 L 172 138 L 138 85 Z"
              className={`cursor-pointer transition-all duration-300 ${
                selectedZone.id === "hands"
                  ? "fill-emerald-500 stroke-emerald-700 stroke-[4px]"
                  : "fill-emerald-300 hover:fill-emerald-400 stroke-emerald-500 stroke-2"
              }`}
              onClick={() => handleZoneSelect("hands")}
            />
            <circle
              cx="167"
              cy="150"
              r="11"
              className={`cursor-pointer transition-all duration-300 ${
                selectedZone.id === "hands"
                  ? "fill-emerald-500 stroke-emerald-700 stroke-[4px]"
                  : "fill-emerald-300 hover:fill-emerald-400 stroke-emerald-500 stroke-2"
              }`}
              onClick={() => handleZoneSelect("hands")}
            />

            {/* Piernas */}
            <rect x="76" y="172" width="18" height="90" rx="9" fill="#94a3b8" />
            <rect x="106" y="172" width="18" height="90" rx="9" fill="#94a3b8" />
            {/* Zapatos */}
            <ellipse cx="85" cy="268" rx="14" ry="7" fill="#475569" />
            <ellipse cx="115" cy="268" rx="14" ry="7" fill="#475569" />
          </svg>

          {/* Direct Selection Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-4 w-full">
            <button
              onClick={() => handleZoneSelect("hands")}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold text-center border transition-all ${
                selectedZone.id === "hands"
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-md scale-102"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              🟢 Manos
            </button>
            <button
              onClick={() => handleZoneSelect("face")}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold text-center border transition-all ${
                selectedZone.id === "face"
                  ? "bg-amber-500 text-white border-amber-600 shadow-md scale-102"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              🟡 Cabeza
            </button>
            <button
              onClick={() => handleZoneSelect("personal")}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold text-center border transition-all ${
                selectedZone.id === "personal"
                  ? "bg-rose-600 text-white border-rose-700 shadow-md scale-102"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              🔴 Espacio Íntimo
            </button>
          </div>
        </div>

        {/* Informative / Feedback Card */}
        <div className="md:col-span-7 space-y-4">
          {/* Reaction Banner */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2.5 transition-all shadow-sm ${
                isSuccess
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}
            >
              {isSuccess ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />}
              <span>{feedback}</span>
            </div>
          )}

          {/* Pedagogical Guidance Detail */}
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  selectedZone.zoneType === "green"
                    ? "bg-emerald-100 text-emerald-800"
                    : selectedZone.zoneType === "yellow"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                Semáforo {selectedZone.trafficLight}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Educación en Límites Personales
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-800 mt-3">
              {selectedZone.name}
            </h3>

            <p className="text-sm font-bold text-indigo-900 mt-1">
              {selectedZone.rule}
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900 mb-1">
                ¿Cómo actuar en esta zona?:
              </p>
              {selectedZone.friendlyTip}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
              <span>Regla de Oro: Tu cuerpo es tuyo. Si algo te inquieta o incomoda, cuéntaselo a un adulto de confianza.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
