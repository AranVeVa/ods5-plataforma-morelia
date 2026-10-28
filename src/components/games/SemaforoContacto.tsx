"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertCircle, HeartHandshake, Info, Sparkles, RefreshCw } from "lucide-react";

interface BodyZone {
  id: string;
  name: string;
  color: "green" | "yellow" | "red";
  description: string;
  actionGuide: string;
  examples: string[];
}

const BODY_ZONES: BodyZone[] = [
  {
    id: "hands",
    name: "Manos y Brazos (Chocar las manos, saludos)",
    color: "green",
    description: "Contacto afectivo, lúdico o de saludo basado siempre en el consentimiento mutuo.",
    actionGuide: "¡Es seguro y bonito cuando ambas personas están de acuerdo y te hace sentir bien!",
    examples: ["Chocar las cinco", "Un apretón de manos con un amigo", "Abrazar a mamá o papá cuando tú quieres"]
  },
  {
    id: "head",
    name: "Cabeza, Hombros y Espalda",
    color: "yellow",
    description: "Zona de atención y límites personales. Depende totalmente de tu comodidad y de quién se trate.",
    actionGuide: "Si una caricia o contacto en tu cabeza o espalda te hace sentir incómodo/a o raro/a, tienes derecho a decir: ¡NO me gusta, detente!",
    examples: ["Una palmada de ánimo de tu entrenador", "Un saludo de un conocido que te hace dudar", "Una cosquilla insistente"]
  },
  {
    id: "private",
    name: "Zonas Íntimas (Pecho, entrepierna, glúteos cubiertos por traje de baño)",
    color: "red",
    description: "Zonas estrictamente privadas de tu cuerpo. Nadie tiene derecho a tocarlas, mirarlas ni pedirte fotos.",
    actionGuide: "¡Regla de oro!: Solo un médico con tus papás presentes por salud puede revisarte. Si alguien intenta tocarlas o te pide secretos, ¡CUÉNTALO DE INMEDIATO a un adulto de confianza!",
    examples: ["El pecho", "La zona genital / entrepierna", "Los glúteos"]
  }
];

export default function SemaforoContacto() {
  const [selectedZone, setSelectedZone] = useState<BodyZone>(BODY_ZONES[0]);
  const [activeFilter, setActiveFilter] = useState<"all" | "green" | "yellow" | "red">("all");

  const getColorClasses = (color: "green" | "yellow" | "red") => {
    switch (color) {
      case "green":
        return {
          badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
          glow: "border-emerald-500 bg-emerald-50/50 shadow-emerald-200",
          button: "bg-emerald-600 hover:bg-emerald-700 text-white",
          dot: "bg-emerald-500"
        };
      case "yellow":
        return {
          badge: "bg-amber-100 text-amber-800 border-amber-300",
          glow: "border-amber-500 bg-amber-50/50 shadow-amber-200",
          button: "bg-amber-500 hover:bg-amber-600 text-white",
          dot: "bg-amber-500"
        };
      case "red":
        return {
          badge: "bg-rose-100 text-rose-800 border-rose-300",
          glow: "border-rose-500 bg-rose-50/50 shadow-rose-200",
          button: "bg-rose-600 hover:bg-rose-700 text-white",
          dot: "bg-rose-600"
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-4 h-4" /> Nivel Infantil (6-9 años) • Meta ODS 5.2
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
            🚦 Semáforo del Contacto
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Aprende a reconocer tus límites corporales y a proteger tu espacio personal de forma segura.
          </p>
        </div>
        <button
          onClick={() => setSelectedZone(BODY_ZONES[0])}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Reiniciar exploración"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reiniciar vista
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
        {/* SVG Interactive Avatar */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
            Toca una zona del avatar amigable:
          </p>

          <svg
            viewBox="0 0 200 320"
            className="w-48 h-72 drop-shadow-md select-none"
            aria-label="Silueta interactiva del cuerpo infantil"
          >
            {/* Cabeza (Amarillo / Alerta) */}
            <circle
              cx="100"
              cy="45"
              r="28"
              className={`cursor-pointer transition-all duration-300 ${
                selectedZone.id === "head" ? "fill-amber-400 stroke-amber-600 stroke-4" : "fill-amber-200 hover:fill-amber-300 stroke-amber-400 stroke-2"
              }`}
              onClick={() => setSelectedZone(BODY_ZONES[1])}
            />
            {/* Ojos y sonrisa amigable */}
            <circle cx="90" cy="40" r="3" fill="#334155" />
            <circle cx="110" cy="40" r="3" fill="#334155" />
            <path d="M 92 52 Q 100 60 108 52" stroke="#334155" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Torso - Zona roja privada */}
            <rect
              x="75"
              y="80"
              width="50"
              height="80"
              rx="15"
              className={`cursor-pointer transition-all duration-300 ${
                selectedZone.id === "private" ? "fill-rose-500 stroke-rose-700 stroke-4" : "fill-rose-300 hover:fill-rose-400 stroke-rose-400 stroke-2"
              }`}
              onClick={() => setSelectedZone(BODY_ZONES[2])}
            />

            {/* Brazos y Manos (Verde) */}
            {/* Brazo Izquierdo */}
            <path
              d="M 75 90 L 40 140 L 30 135 L 65 85 Z"
              className={`cursor-pointer transition-all duration-300 ${
                selectedZone.id === "hands" ? "fill-emerald-500 stroke-emerald-700 stroke-4" : "fill-emerald-300 hover:fill-emerald-400 stroke-emerald-500 stroke-2"
              }`}
              onClick={() => setSelectedZone(BODY_ZONES[0])}
            />
            {/* Mano Izquierda */}
            <circle
              cx="33"
              cy="145"
              r="10"
              className={`cursor-pointer transition-all duration-300 ${
                selectedZone.id === "hands" ? "fill-emerald-500 stroke-emerald-700 stroke-4" : "fill-emerald-300 hover:fill-emerald-400 stroke-emerald-500 stroke-2"
              }`}
              onClick={() => setSelectedZone(BODY_ZONES[0])}
            />

            {/* Brazo Derecho */}
            <path
              d="M 125 90 L 160 140 L 170 135 L 135 85 Z"
              className={`cursor-pointer transition-all duration-300 ${
                selectedZone.id === "hands" ? "fill-emerald-500 stroke-emerald-700 stroke-4" : "fill-emerald-300 hover:fill-emerald-400 stroke-emerald-500 stroke-2"
              }`}
              onClick={() => setSelectedZone(BODY_ZONES[0])}
            />
            {/* Mano Derecha */}
            <circle
              cx="167"
              cy="145"
              r="10"
              className={`cursor-pointer transition-all duration-300 ${
                selectedZone.id === "hands" ? "fill-emerald-500 stroke-emerald-700 stroke-4" : "fill-emerald-300 hover:fill-emerald-400 stroke-emerald-500 stroke-2"
              }`}
              onClick={() => setSelectedZone(BODY_ZONES[0])}
            />

            {/* Piernas */}
            <rect x="78" y="165" width="18" height="95" rx="9" fill="#94a3b8" />
            <rect x="104" y="165" width="18" height="95" rx="9" fill="#94a3b8" />
            {/* Zapatos */}
            <ellipse cx="85" cy="265" rx="14" ry="7" fill="#475569" />
            <ellipse cx="115" cy="265" rx="14" ry="7" fill="#475569" />
          </svg>

          {/* Quick Select Buttons */}
          <div className="flex gap-2 mt-4 w-full justify-center">
            <button
              onClick={() => setSelectedZone(BODY_ZONES[0])}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedZone.id === "hands" ? "bg-emerald-600 text-white scale-105" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              🟢 Verde
            </button>
            <button
              onClick={() => setSelectedZone(BODY_ZONES[1])}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedZone.id === "head" ? "bg-amber-500 text-white scale-105" : "bg-amber-100 text-amber-800"
              }`}
            >
              🟡 Amarillo
            </button>
            <button
              onClick={() => setSelectedZone(BODY_ZONES[2])}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedZone.id === "private" ? "bg-rose-600 text-white scale-105" : "bg-rose-100 text-rose-800"
              }`}
            >
              🔴 Rojo
            </button>
          </div>
        </div>

        {/* Informative Guidance Card */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div className={`p-6 rounded-2xl border-2 transition-all ${getColorClasses(selectedZone.color).glow}`}>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getColorClasses(selectedZone.color).badge}`}>
                {selectedZone.color === "green" ? "Luz Verde • Contacto Libre y Seguro" : selectedZone.color === "yellow" ? "Luz Amarilla • ¡Alerta y Pregunta!" : "Luz Roja • ¡Zona Privada Intocable!"}
              </span>
              <span className={`w-3.5 h-3.5 rounded-full ${getColorClasses(selectedZone.color).dot} animate-pulse`} />
            </div>

            <h3 className="text-xl font-bold text-slate-800 mt-3">
              {selectedZone.name}
            </h3>

            <p className="text-slate-700 text-sm mt-2 leading-relaxed">
              {selectedZone.description}
            </p>

            <div className="mt-4 p-4 rounded-xl bg-white/80 border border-slate-200">
              <div className="flex items-start gap-2.5">
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Regla de Protección Personal:
                  </h4>
                  <p className="text-slate-800 text-sm font-semibold mt-0.5">
                    {selectedZone.actionGuide}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Ejemplos cotidianos:
              </h5>
              <div className="flex flex-wrap gap-2">
                {selectedZone.examples.map((ex, i) => (
                  <span key={i} className="text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium">
                    ✨ {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Child-friendly bottom message */}
          <div className="mt-4 p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-indigo-600 shrink-0" />
            <p className="text-xs md:text-sm text-indigo-950 font-medium">
              <strong>Recuerda siempre:</strong> Tu cuerpo te pertenece solo a ti. Nadie tiene derecho a obligarte a guardar secretos que te hagan sentir tristeza o miedo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
