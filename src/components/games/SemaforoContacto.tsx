"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Star,
  CheckCircle2,
  HelpCircle,
  Heart,
  Volume2,
  VolumeX,
  AlertTriangle,
  Lightbulb,
  Info,
  ShieldAlert,
  ArrowRight,
  Smile,
  Meh,
  Frown
} from "lucide-react";
import confetti from "canvas-confetti";
import GameHeader from "@/components/common/GameHeader";
import InstructionsModal from "@/components/common/InstructionsModal";
import VictoryModal from "@/components/common/VictoryModal";
import EmergencyHelpModal from "@/components/common/EmergencyHelpModal";
import { sound } from "@/utils/audio";

interface ScenarioMission {
  id: number;
  situation: string;
  context: string;
  avatarMood: "happy" | "thinking" | "alert";
  targetZoneId: "hands" | "shoulders" | "private" | "any";
  options: {
    text: string;
    trafficLight: "green" | "yellow" | "red";
    isCorrect: boolean;
    explanation: string;
    protectiveRule: string;
  }[];
}

const MISSIONS: ScenarioMission[] = [
  {
    id: 1,
    situation: "Un compañero de tu escuela te sonríe y alza la mano abierta para chocar las cinco porque metieron un gol en el recreo.",
    context: "Chocar las cinco o saludar amistosamente",
    avatarMood: "happy",
    targetZoneId: "hands",
    options: [
      {
        text: "Verde: Es una interacción respetuosa y divertida porque ambos quieren celebrar juntos.",
        trafficLight: "green",
        isCorrect: true,
        explanation: "¡Exacto! Chocar las manos o saludarse es seguro y bonito cuando existe acuerdo mutuo.",
        protectiveRule: "Recuerda: El contacto respetuoso siempre se basa en el consentimiento de ambas personas."
      },
      {
        text: "Rojo: Nadie puede chocar las manos en la escuela.",
        trafficLight: "red",
        isCorrect: false,
        explanation: "Chocar las manos no está prohibido. Si tú también quieres saludar o festejar, es seguro y positivo.",
        protectiveRule: "Las manos son para jugar, crear y compartir con respeto."
      }
    ]
  },
  {
    id: 2,
    situation: "Un familiar o conocido insiste en que le des un abrazo muy apretado, pero tú hoy te sientes incómodo y no tienes ganas.",
    context: "Consentimiento ante muestras de afecto",
    avatarMood: "thinking",
    targetZoneId: "shoulders",
    options: [
      {
        text: "Verde: Tienes la obligación de abrazar a todos los adultos aunque no quieras.",
        trafficLight: "green",
        isCorrect: false,
        explanation: "No tienes obligación de abrazar a nadie si no lo deseas. Tu comodidad y tus límites importan.",
        protectiveRule: "Tu cuerpo te pertenece. Puedes saludar con una sonrisa o la mano si prefieres no abrazar."
      },
      {
        text: "Amarillo: Tienes derecho a decir con calma 'No gracias, hoy prefiero solo saludar con la mano'.",
        trafficLight: "yellow",
        isCorrect: true,
        explanation: "¡Muy bien! Tienes total libertad de decidir sobre tu espacio personal. Decir 'no' debe ser respetado.",
        protectiveRule: "No tienes que aceptar abrazos ni caricias si te hacen sentir incomodidad."
      }
    ]
  },
  {
    id: 3,
    situation: "Una persona en el parque o en internet te pide que le muestres o te tomes fotos de las zonas cubiertas por tu traje de baño, diciendo que 'será un secreto de amigos'.",
    context: "Zonas privadas y protección personal",
    avatarMood: "alert",
    targetZoneId: "private",
    options: [
      {
        text: "Rojo: ¡ALTO TOTAL! Nadie debe mirar, tocar ni pedir fotos de tus zonas privadas. ¡Cuéntaselo ya a un adulto de confianza!",
        trafficLight: "red",
        isCorrect: true,
        explanation: "¡Excelente decisión! Tus zonas íntimas son inviolables. Los secretos incómodos sobre tu cuerpo NUNCA deben guardarse.",
        protectiveRule: "Nunca es tu culpa. Aléjate de inmediato y cuéntaselo a mamá, papá o tu maestra."
      },
      {
        text: "Verde: Puedes guardar el secreto si te prometen un regalo o dulce.",
        trafficLight: "green",
        isCorrect: false,
        explanation: "¡Peligro! Nadie puede pedirte secretos sobre tu cuerpo a cambio de regalos o promesas.",
        protectiveRule: "Si un secreto te hace sentir miedo, incomodidad o tristeza, ¡rompe el silencio y busca ayuda!"
      }
    ]
  },
  {
    id: 4,
    situation: "Fuiste al médico porque te dolía el estómago. El doctor te explica qué parte va a revisar con tu mamá o papá presentes a tu lado.",
    context: "Atención médica con acompañamiento y cuidado",
    avatarMood: "happy",
    targetZoneId: "private",
    options: [
      {
        text: "Verde / Seguro: La atención médica por salud es válida cuando te explican con respeto y tus padres o tutores están presentes cuidándote.",
        trafficLight: "green",
        isCorrect: true,
        explanation: "¡Correcto! Los médicos y enfermeras pueden revisarte por salud y bienestar, siempre con explicación clara y acompañamiento de tus tutores.",
        protectiveRule: "Las revisiones médicas deben ser respetuosas, necesarias y acompañadas de tu familia de confianza."
      },
      {
        text: "Rojo: Ningún médico puede revisarte aunque te sientas enfermo.",
        trafficLight: "red",
        isCorrect: false,
        explanation: "Cuidar la salud es indispensable. Lo importante es que siempre estén presentes tus familiares de confianza y se te explique con respeto.",
        protectiveRule: "La salud y el cuidado médico se realizan siempre con protección y acompañamiento adulto."
      }
    ]
  },
  {
    id: 5,
    situation: "Una persona conocida intenta hacerte cosquillas o caricias que te molestan. Le dices '¡Basta, no me gusta!' pero continúa insistiendo.",
    context: "Límites ignorados y búsqueda de apoyo",
    avatarMood: "alert",
    targetZoneId: "shoulders",
    options: [
      {
        text: "Rojo / Alerta: Aléjate, di con voz firme '¡Dije que NO!' y acude de inmediato con una persona adulta de confianza.",
        trafficLight: "red",
        isCorrect: true,
        explanation: "¡Magnífico! Cuando alguien no respeta tu 'NO', debes alejarte y pedir apoyo. Si la primera persona no te escucha, acude con otra.",
        protectiveRule: "Si alguien no respeta tus límites, busca ayuda sin dudar. Recuerda: NUNCA es tu culpa."
      },
      {
        text: "Amarillo: Quedarte callado y soportarlo para que la otra persona no se enoje.",
        trafficLight: "yellow",
        isCorrect: false,
        explanation: "Nunca debes aguantar algo que te lastima o incomoda por temor al enojo de otros. Tu bienestar es lo primero.",
        protectiveRule: "Tus límites son valiosos y deben ser respetados por todas y todos."
      }
    ]
  }
];

export default function SemaforoContacto() {
  const [mode, setMode] = useState<"missions" | "explore">("missions");
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [selectedBodyZone, setSelectedBodyZone] = useState<"hands" | "shoulders" | "private">("hands");
  const [score, setScore] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [readAloud, setReadAloud] = useState<boolean>(false);

  const activeMission = MISSIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOptionIdx !== null) return;
    setSelectedOptionIdx(idx);

    const option = activeMission.options[idx];
    if (option.isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 100);
      setStars((st) => Math.min(3, st + 1));

      if (readAloud && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(option.explanation);
        utter.lang = "es-MX";
        window.speechSynthesis.speak(utter);
      }
    } else {
      sound.playAlert();
    }
  };

  const handleNextMission = () => {
    sound.playClick();
    if (currentIdx + 1 < MISSIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setAnsweredCount((c) => c + 1);
    } else {
      setIsVictoryOpen(true);
    }
  };

  const handleRestart = () => {
    sound.playPowerup();
    setCurrentIdx(0);
    setSelectedOptionIdx(null);
    setScore(0);
    setStars(0);
    setAnsweredCount(0);
    setIsVictoryOpen(false);
  };

  const handleZoneClick = (zone: "hands" | "shoulders" | "private") => {
    sound.playClick();
    setSelectedBodyZone(zone);
  };

  const handleNarrateSituation = () => {
    sound.playClick();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        `Misión ${activeMission.id}. ${activeMission.situation}`
      );
      utter.lang = "es-MX";
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-100 max-w-4xl mx-auto space-y-6">
      {/* Shared Header Component */}
      <GameHeader
        title="🚦 Semáforo del Respeto y Autocuidado"
        badge="Consentimiento, límites corporales y prevención de abusos (Meta ODS 5.2)"
        levelBadge="Nivel Infantil (6 a 9 años)"
        levelColor="emerald"
        odsTarget="ODS 5.2"
        score={score}
        stars={stars}
        maxStars={3}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onRestart={handleRestart}
      />

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-1.5 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setMode("missions");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              mode === "missions"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🎯 Modo Misiones ({currentIdx + 1}/{MISSIONS.length})
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setMode("explore");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              mode === "explore"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🔍 Modo Explorar el Cuerpo
          </button>
        </div>

        <button
          onClick={handleNarrateSituation}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1.5 shadow-xs"
          title="Escuchar narración de la misión"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Voz de lectura</span>
        </button>
      </div>

      {/* Main Content Area */}
      {mode === "missions" ? (
        <div className="space-y-6">
          {/* Mission Context & Question Card */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-5 sm:p-6 rounded-3xl border-2 border-indigo-200 shadow-xs relative">
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-200/70 px-3 py-0.5 rounded-full inline-block">
                Misión {activeMission.id} de {MISSIONS.length} • {activeMission.context}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Puntuación actual: <strong>{score} pts</strong>
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug mt-2">
              {activeMission.situation}
            </h3>

            <p className="text-xs font-bold text-indigo-950 mt-3 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              ¿Qué semáforo y decisión corresponde aplicar en esta situación?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Clothed Interactive Character Silhouette */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-slate-50 rounded-3xl border-2 border-slate-200">
              <span className="text-[11px] font-black uppercase text-slate-500 mb-2">
                Guardián de tus Límites
              </span>

              {/* Clothed friendly child character SVG */}
              <svg
                viewBox="0 0 200 320"
                className="w-48 h-72 drop-shadow-md select-none transition-transform hover:scale-102"
                aria-label="Silueta ilustrada de un personaje infantil con ropa"
              >
                {/* Cabello amigable */}
                <path
                  d="M 65 50 Q 100 15 135 50 Q 140 25 100 18 Q 60 25 65 50 Z"
                  fill="#78350f"
                />

                {/* Cabeza / Rostro */}
                <circle
                  cx="100"
                  cy="52"
                  r="26"
                  fill="#fde68a"
                  stroke="#d97706"
                  strokeWidth="2"
                />

                {/* Ojos */}
                <circle cx="92" cy="48" r="3.5" fill="#1e293b" />
                <circle cx="108" cy="48" r="3.5" fill="#1e293b" />

                {/* Expresión bucal según estado */}
                {activeMission.avatarMood === "happy" && (
                  <path
                    d="M 91 58 Q 100 68 109 58"
                    stroke="#1e293b"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                )}
                {activeMission.avatarMood === "thinking" && (
                  <ellipse cx="100" cy="60" rx="3.5" ry="4" fill="#1e293b" />
                )}
                {activeMission.avatarMood === "alert" && (
                  <path
                    d="M 92 63 Q 100 56 108 63"
                    stroke="#b91c1c"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                )}

                {/* Cuello */}
                <rect x="94" y="76" width="12" height="10" fill="#fde68a" />

                {/* Playera / Ropa Superior (Torso) */}
                <path
                  d="M 68 85 L 132 85 L 138 155 L 62 155 Z"
                  className={`cursor-pointer transition-all ${
                    activeMission.targetZoneId === "shoulders" || activeMission.targetZoneId === "private"
                      ? "fill-indigo-500 stroke-indigo-700 stroke-[3px]"
                      : "fill-indigo-400 stroke-indigo-600 stroke-2"
                  }`}
                  onClick={() => handleZoneClick("shoulders")}
                />

                {/* Escudo protector en la playera */}
                <g transform="translate(90, 105) scale(0.8)">
                  <path
                    d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z"
                    fill="#ffffff"
                    opacity="0.95"
                  />
                </g>

                {/* Brazos con mangas */}
                {/* Manga Izquierda */}
                <path d="M 68 85 L 42 110 L 52 118 L 74 96 Z" fill="#6366f1" />
                {/* Brazo y Mano Izquierda */}
                <path
                  d="M 45 112 L 30 148 L 40 152 L 52 118 Z"
                  className="cursor-pointer fill-amber-200 stroke-amber-400 stroke-2 hover:fill-emerald-300"
                  onClick={() => handleZoneClick("hands")}
                />
                <circle
                  cx="32"
                  cy="154"
                  r="9"
                  className={`cursor-pointer transition-all ${
                    activeMission.targetZoneId === "hands"
                      ? "fill-emerald-400 stroke-emerald-600 stroke-[3px]"
                      : "fill-amber-200 hover:fill-emerald-300 stroke-amber-500 stroke-2"
                  }`}
                  onClick={() => handleZoneClick("hands")}
                />

                {/* Manga Derecha */}
                <path d="M 132 85 L 158 110 L 148 118 L 126 96 Z" fill="#6366f1" />
                {/* Brazo y Mano Derecha */}
                <path
                  d="M 155 112 L 170 148 L 160 152 L 148 118 Z"
                  className="cursor-pointer fill-amber-200 stroke-amber-400 stroke-2 hover:fill-emerald-300"
                  onClick={() => handleZoneClick("hands")}
                />
                <circle
                  cx="168"
                  cy="154"
                  r="9"
                  className={`cursor-pointer transition-all ${
                    activeMission.targetZoneId === "hands"
                      ? "fill-emerald-400 stroke-emerald-600 stroke-[3px]"
                      : "fill-amber-200 hover:fill-emerald-300 stroke-amber-500 stroke-2"
                  }`}
                  onClick={() => handleZoneClick("hands")}
                />

                {/* Short / Pantalón (Zona de traje de baño / ropa interior protegida) */}
                <path
                  d="M 62 155 L 138 155 L 142 205 L 105 205 L 100 180 L 95 205 L 58 205 Z"
                  className={`cursor-pointer transition-all ${
                    activeMission.targetZoneId === "private"
                      ? "fill-rose-500 stroke-rose-700 stroke-[4px]"
                      : "fill-rose-400 stroke-rose-600 stroke-2 hover:fill-rose-500"
                  }`}
                  onClick={() => handleZoneClick("private")}
                />

                {/* Piernas */}
                <rect x="68" y="205" width="18" height="60" rx="6" fill="#fde68a" />
                <rect x="114" y="205" width="18" height="60" rx="6" fill="#fde68a" />

                {/* Calzado / Tenis */}
                <ellipse cx="77" cy="272" rx="14" ry="8" fill="#3b82f6" />
                <ellipse cx="123" cy="272" rx="14" ry="8" fill="#3b82f6" />
              </svg>

              <p className="text-[10px] text-slate-500 text-center mt-2 font-medium">
                Personaje con ropa completa • Toca las manos, torso o traje de baño para probar
              </p>
            </div>

            {/* Answer Options */}
            <div className="md:col-span-7 space-y-3">
              <span className="text-xs font-black uppercase text-slate-600 block">
                Selecciona la respuesta adecuada:
              </span>

              {activeMission.options.map((opt, i) => {
                const isSelected = selectedOptionIdx === i;
                const showValidation = selectedOptionIdx !== null;

                let borderClasses = "border-slate-200 hover:border-indigo-400 bg-white";
                if (showValidation) {
                  if (opt.isCorrect) {
                    borderClasses = "border-emerald-500 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-200";
                  } else if (isSelected && !opt.isCorrect) {
                    borderClasses = "border-rose-500 bg-rose-50 text-rose-950";
                  } else {
                    borderClasses = "border-slate-200 opacity-60 bg-slate-50";
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(i)}
                    disabled={selectedOptionIdx !== null}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all shadow-xs flex items-start gap-3 ${borderClasses}`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">
                      {opt.trafficLight === "green" ? "🟢" : opt.trafficLight === "yellow" ? "🟡" : "🔴"}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {opt.text}
                      </p>

                      {showValidation && isSelected && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-xs">
                          <p className="font-semibold text-slate-800">
                            {opt.explanation}
                          </p>
                          <p className="text-indigo-900 font-bold mt-1 bg-white/80 p-2 rounded-xl border border-indigo-100">
                            🛡️ {opt.protectiveRule}
                          </p>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Next Mission Button */}
              {selectedOptionIdx !== null && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextMission}
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <span>
                      {currentIdx + 1 < MISSIONS.length ? "Siguiente Misión" : "Ver Resultados"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Explore Body & Consent Mode */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 bg-slate-50 p-6 rounded-3xl border-2 border-slate-200 flex flex-col items-center">
            <span className="text-xs font-black uppercase text-slate-600 mb-3">
              Selecciona una zona:
            </span>

            <div className="grid grid-cols-3 gap-2 w-full mb-4">
              <button
                onClick={() => handleZoneClick("hands")}
                className={`py-2 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                  selectedBodyZone === "hands"
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                }`}
              >
                🟢 Manos
              </button>
              <button
                onClick={() => handleZoneClick("shoulders")}
                className={`py-2 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                  selectedBodyZone === "shoulders"
                    ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                🟡 Cabeza / Hombros
              </button>
              <button
                onClick={() => handleZoneClick("private")}
                className={`py-2 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                  selectedBodyZone === "private"
                    ? "bg-rose-600 text-white border-rose-700 shadow-sm"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                🔴 Traje de Baño
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Recuerda: Cualquier zona puede requerir tu consentimiento. Lo que importa es cómo te sientes y que tus límites sean respetados.
            </p>
          </div>

          <div className="md:col-span-7 bg-white p-6 rounded-3xl border-2 border-indigo-100 shadow-sm space-y-4">
            {selectedBodyZone === "hands" && (
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 inline-block">
                  Luz Verde • Saludo y Juego Compartido
                </span>
                <h4 className="text-lg font-black text-slate-900">
                  Manos y Brazos: Compartir con Consentimiento
                </h4>
                <p>
                  Las manos permiten chocar las cinco, jugar a la pelota, escribir, dibujar y darse un apretón de saludo cordial.
                </p>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 font-medium">
                  <strong>Regla de Respeto:</strong> Si alguien te toma de la mano o del brazo y no quieres, también tienes derecho a retirar tu mano amablemente y pedir tu espacio.
                </div>
              </div>
            )}

            {selectedBodyZone === "shoulders" && (
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 inline-block">
                  Luz Amarilla • Atención y Decisiones Personales
                </span>
                <h4 className="text-lg font-black text-slate-900">
                  Cabeza, Hombros y Espalda: Espacio de Confianza
                </h4>
                <p>
                  Un abrazo o una palmada en la espalda pueden ser afectuosos entre familiares o amistades si ambas personas están de acuerdo.
                </p>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 font-medium">
                  <strong>Regla de Respeto:</strong> Si una caricia, abrazo o cosquilla no te gusta o te hace sentir incomodidad, tienes total derecho a decir con claridad: &ldquo;¡No me gusta, por favor detente!&rdquo;
                </div>
              </div>
            )}

            {selectedBodyZone === "private" && (
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300 inline-block">
                  Luz Roja • Límites de Protección Personal Íntima
                </span>
                <h4 className="text-lg font-black text-slate-900">
                  Zonas Cubiertas por Traje de Baño: ¡Inviolables!
                </h4>
                <p>
                  Son las zonas privadas de tu cuerpo. Nadie tiene derecho a pedirte que las muestres, las toques, permitas que las toquen o que les tomes fotos.
                </p>
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-950 font-medium">
                  <strong>Regla de Oro:</strong> Solo doctores con tus padres presentes por salud pueden revisarte. Si alguien insiste o te pide secretos, ¡CUÉNTALO DE INMEDIATO a un adulto de confianza!
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pedagogical Guidance Alert Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 flex items-start gap-3 text-xs text-indigo-950">
        <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Mensaje de Empoderamiento Infantil:</strong> Recuerda siempre que tu cuerpo merece respeto. No tienes que aceptar abrazos obligados. Si algo te confunde o inquieta, cuéntaselo a mamá, papá o a tu maestra. ¡Nunca es tu culpa!
        </p>
      </div>

      {/* Shared Modals */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        title="Instrucciones: Semáforo del Respeto y Autocuidado"
        objective="Aprender a reconocer límites personales, consentir de forma segura, identificar situaciones de alerta y saber a quién acudir si algo nos incomoda."
        rules={[
          "Lee cada situación cotidiana de la misión.",
          "Decide qué color del semáforo corresponde (Verde: Seguro con consentimiento, Amarillo: Atención y límites, Rojo: Protección absoluta).",
          "Toca la respuesta que consideres correcta para recibir retroalimentación formativa.",
          "Gana estrellas y aprende a proteger tu espacio personal y el de tus compañeros."
        ]}
        tips={[
          "No clasifiques una parte del cuerpo sin pensar en el contexto: lo importante es el consentimiento y cómo te hace sentir.",
          "Usa el botón permanente 'Necesito ayuda' en cualquier momento si requieres apoyo o información de Morelia."
        ]}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        title="¡Guardián del Respeto y Autocuidado!"
        score={score}
        stars={stars}
        maxStars={3}
        takeaway="Has demostrado comprender que tu cuerpo merece respeto, que decir ¡NO! es un derecho y que los secretos incómodos nunca deben guardarse."
        summaryPoints={[
          "Sabes reconocer interacciones respetuosas y afectuosas.",
          "Sabes poner límites claros ante contactos que te incomoden.",
          "Identificaste las instituciones de auxilio en Morelia ante cualquier duda."
        ]}
        onRestart={handleRestart}
      />

      <EmergencyHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
