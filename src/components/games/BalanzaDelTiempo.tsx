"use client";

import React, { useState } from "react";
import { Scale, RefreshCw, Trophy, Sparkles, Heart, BatteryCharging, BatteryWarning, Calendar } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "@/utils/audio";

interface TaskItem {
  id: string;
  name: string;
  category: "cuidado" | "hogar" | "estudio" | "descanso";
  hours: number;
  assignedTo: "female" | "male";
  icon: string;
  description: string;
}

const DEFAULT_TASKS: TaskItem[] = [
  { id: "1", name: "Lavar los trastes de la comida", category: "hogar", hours: 1.5, assignedTo: "female", icon: "🍽️", description: "Limpieza y secado de platos familiares." },
  { id: "2", name: "Barrer y trapear la sala y cocina", category: "hogar", hours: 2, assignedTo: "female", icon: "🧹", description: "Higiene y mantenimiento del hogar." },
  { id: "3", name: "Acompañar y alimentar al hermanito menor", category: "cuidado", hours: 2.5, assignedTo: "female", icon: "🍼", description: "Atención activa y cuidados de la primera infancia." },
  { id: "4", name: "Preparar el desayuno escolar", category: "hogar", hours: 1, assignedTo: "female", icon: "🍳", description: "Elaboración de alimentos matutinos." },
  { id: "5", name: "Hacer tareas y estudiar matemáticas", category: "estudio", hours: 2, assignedTo: "female", icon: "📚", description: "Tiempo imprescindible para el desarrollo escolar." },
  { id: "6", name: "Apoyar a la abuelita con sus medicinas", category: "cuidado", hours: 1.5, assignedTo: "female", icon: "👵", description: "Cuidado amoroso de personas mayores." },
  { id: "7", name: "Doblar y ordenar la ropa limpia", category: "hogar", hours: 1, assignedTo: "female", icon: "🧺", description: "Organización de vestimenta familiar." },

  // Assigned to boy initially (stereotypical imbalance)
  { id: "8", name: "Tarde de videojuegos y descanso libre", category: "descanso", hours: 3, assignedTo: "male", icon: "🎮", description: "Tiempo de esparcimiento recreativo." },
  { id: "9", name: "Sacar la basura a la calle", category: "hogar", hours: 0.5, assignedTo: "male", icon: "🗑️", description: "Traslado de residuos al contenedor." },
  { id: "10", name: "Salir a jugar fútbol con amigos", category: "descanso", hours: 2.5, assignedTo: "male", icon: "⚽", description: "Deporte y convivencia al aire libre." },
  { id: "11", name: "Hacer tarea escolar de ciencias", category: "estudio", hours: 1.5, assignedTo: "male", icon: "🔬", description: "Actividad académica personal." },
  { id: "12", name: "Regar las plantas del jardín", category: "hogar", hours: 0.5, assignedTo: "male", icon: "🌱", description: "Cuidado de áreas verdes." },
];

export default function BalanzaDelTiempo() {
  const [tasks, setTasks] = useState<TaskItem[]>(DEFAULT_TASKS);
  const [dayScenario, setDayScenario] = useState<"escuela" | "fin_semana">("escuela");

  const moveTask = (taskId: string, target: "female" | "male") => {
    sound.playClick();
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignedTo: target } : t))
    );
  };

  const femaleTasks = tasks.filter((t) => t.assignedTo === "female");
  const maleTasks = tasks.filter((t) => t.assignedTo === "male");

  // Calculate domestic workload
  const femaleChoreHours = femaleTasks
    .filter((t) => t.category === "hogar" || t.category === "cuidado")
    .reduce((acc, t) => acc + t.hours, 0);

  const maleChoreHours = maleTasks
    .filter((t) => t.category === "hogar" || t.category === "cuidado")
    .reduce((acc, t) => acc + t.hours, 0);

  const femaleFreeHours = femaleTasks
    .filter((t) => t.category === "descanso")
    .reduce((acc, t) => acc + t.hours, 0);

  const maleFreeHours = maleTasks
    .filter((t) => t.category === "descanso")
    .reduce((acc, t) => acc + t.hours, 0);

  const choreDifference = femaleChoreHours - maleChoreHours;
  const isBalanced = Math.abs(choreDifference) <= 1.5 && femaleFreeHours >= 1.5 && maleFreeHours >= 1.5;

  const triggerCelebrate = () => {
    sound.playCelebration();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  const rotationAngle = Math.min(Math.max(choreDifference * 3, -18), 18);

  const handleScenarioChange = (scenario: "escuela" | "fin_semana") => {
    sound.playPowerup();
    setDayScenario(scenario);
    setTasks(DEFAULT_TASKS);
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Scale className="w-4 h-4" /> Nivel Infantil (6-9 años) • Meta ODS 5.4
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
            ⚖️ La Balanza de la Corresponsabilidad
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Distribuye equitativamente las tareas de cuidado, estudio y descanso para lograr un hogar armónico.
          </p>
        </div>

        {/* Day Preset Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => handleScenarioChange("escuela")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dayScenario === "escuela" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"
            }`}
          >
            📅 Lunes Escolar
          </button>
          <button
            onClick={() => handleScenarioChange("fin_semana")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dayScenario === "fin_semana" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600"
            }`}
          >
            🧹 Sábado Familiar
          </button>
        </div>
      </div>

      {/* Dynamic Animated Scale Component */}
      <div className="mt-6 bg-gradient-to-b from-sky-50 to-indigo-50/50 rounded-3xl p-6 border border-sky-100 shadow-sm flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-lg text-xs font-black uppercase tracking-wide">
          <div className="flex items-center gap-1.5 text-pink-700">
            <span>👧 Sofía: {femaleChoreHours.toFixed(1)} hrs trabajo</span>
            {femaleFreeHours === 0 && <BatteryWarning className="w-4 h-4 text-rose-500 animate-pulse" />}
          </div>
          <span className={`px-2.5 py-0.5 rounded-full ${isBalanced ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
            {isBalanced ? "✨ ¡Equilibrio Justo!" : "⚠️ Desbalance en el hogar"}
          </span>
          <div className="flex items-center gap-1.5 text-blue-700">
            <span>👦 Mateo: {maleChoreHours.toFixed(1)} hrs trabajo</span>
            {maleFreeHours >= 4 && <BatteryCharging className="w-4 h-4 text-emerald-500" />}
          </div>
        </div>

        {/* Animated Scale Lever */}
        <div className="w-full max-w-md h-36 flex flex-col items-center justify-center relative my-2">
          <div className="absolute bottom-2 w-16 h-4 bg-slate-700 rounded-t-lg" />
          <div className="absolute bottom-6 w-3 h-20 bg-slate-500" />
          <div className="absolute top-10 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-800 z-10" />

          <div
            className="w-80 h-3 bg-slate-800 rounded-full transition-transform duration-500 relative flex justify-between items-center px-1"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            {/* Left Pan: Sofia */}
            <div className="w-20 h-14 border-b-4 border-l-2 border-r-2 border-pink-400 bg-pink-100/90 rounded-b-2xl flex flex-col items-center justify-center -translate-y-[-28px] shadow">
              <span className="text-xs font-black text-pink-800">{femaleChoreHours.toFixed(1)} hrs</span>
              <span className="text-[10px] text-pink-600 font-bold">👧 Sofía</span>
            </div>

            {/* Right Pan: Mateo */}
            <div className="w-20 h-14 border-b-4 border-l-2 border-r-2 border-blue-400 bg-blue-100/90 rounded-b-2xl flex flex-col items-center justify-center -translate-y-[-28px] shadow">
              <span className="text-xs font-black text-blue-800">{maleChoreHours.toFixed(1)} hrs</span>
              <span className="text-[10px] text-blue-600 font-bold">👦 Mateo</span>
            </div>
          </div>
        </div>

        {/* Balanced notification */}
        {isBalanced && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs md:text-sm font-bold flex items-center gap-2 animate-bounce">
            <Trophy className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>¡Excelente corresponsabilidad! Ambos colaboran con las labores y tienen tiempo garantizado para jugar y estudiar.</span>
            <button
              onClick={triggerCelebrate}
              className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-xl shadow font-semibold"
            >
              🎉 Celebrar
            </button>
          </div>
        )}
      </div>

      {/* Two Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Sofia's column */}
        <div className="bg-pink-50/60 rounded-3xl p-5 border-2 border-pink-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-pink-200">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">👧</span>
              <div>
                <h3 className="font-black text-pink-950 text-sm">Jornada de Sofía</h3>
                <span className="text-[11px] text-pink-700 font-semibold">
                  Labores: {femaleChoreHours.toFixed(1)} hrs • Descanso: {femaleFreeHours.toFixed(1)} hrs
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {femaleTasks.map((t) => (
              <div
                key={t.id}
                className="bg-white p-3 rounded-2xl border border-pink-200 shadow-xs flex items-center justify-between hover:border-pink-300 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{t.name}</p>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {t.hours} hrs • <span className="capitalize">{t.category}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => moveTask(t.id, "male")}
                  className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold px-2.5 py-1.5 rounded-xl transition-colors ml-2 shrink-0"
                >
                  Pasar a Mateo ➡️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mateo's column */}
        <div className="bg-blue-50/60 rounded-3xl p-5 border-2 border-blue-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-blue-200">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">👦</span>
              <div>
                <h3 className="font-black text-blue-950 text-sm">Jornada de Mateo</h3>
                <span className="text-[11px] text-blue-700 font-semibold">
                  Labores: {maleChoreHours.toFixed(1)} hrs • Descanso: {maleFreeHours.toFixed(1)} hrs
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {maleTasks.map((t) => (
              <div
                key={t.id}
                className="bg-white p-3 rounded-2xl border border-blue-200 shadow-xs flex items-center justify-between hover:border-blue-300 transition-all"
              >
                <button
                  onClick={() => moveTask(t.id, "female")}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-2.5 py-1.5 rounded-xl transition-colors mr-2 shrink-0"
                >
                  ⬅️ Pasar a Sofía
                </button>
                <div className="flex items-center gap-2.5 text-right ml-auto">
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{t.name}</p>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {t.hours} hrs • <span className="capitalize">{t.category}</span>
                    </span>
                  </div>
                  <span className="text-2xl">{t.icon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-950">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <p>
          <strong>Dato Educativo ODS 5:</strong> Cuando los hombres y niños asumen corresponsabilidad en el hogar, las niñas y mujeres disponen de tiempo libre para completar sus estudios, emprender y disfrutar plenamente de sus derechos.
        </p>
      </div>
    </div>
  );
}
