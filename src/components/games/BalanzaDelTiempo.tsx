"use client";

import React, { useState } from "react";
import { Scale, CheckCircle2, RefreshCw, Trophy, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface TaskItem {
  id: string;
  name: string;
  category: "cuidado" | "hogar" | "descanso" | "estudio";
  weight: number; // impact load
  assignedTo: "unassigned" | "male" | "female";
  icon: string;
}

const INITIAL_TASKS: TaskItem[] = [
  { id: "1", name: "Lavar los platos de la comida", category: "hogar", weight: 2, assignedTo: "female", icon: "🍽️" },
  { id: "2", name: "Barrer y trapear la sala", category: "hogar", weight: 2, assignedTo: "female", icon: "🧹" },
  { id: "3", name: "Cuidar y alimentar a los hermanitos", category: "cuidado", weight: 3, assignedTo: "female", icon: "🍼" },
  { id: "4", name: "Hacer la tarea escolar", category: "estudio", weight: 2, assignedTo: "female", icon: "📚" },
  { id: "5", name: "Tarde de videojuegos y descanso", category: "descanso", weight: -2, assignedTo: "male", icon: "🎮" },
  { id: "6", name: "Cocinar la cena familiar", category: "cuidado", weight: 3, assignedTo: "female", icon: "🍲" },
  { id: "7", name: "Sacar la basura a la calle", category: "hogar", weight: 1, assignedTo: "male", icon: "🗑️" },
  { id: "8", name: "Salir a jugar fútbol con amigos", category: "descanso", weight: -2, assignedTo: "male", icon: "⚽" },
];

export default function BalanzaDelTiempo() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  const moveTask = (taskId: string, target: "unassigned" | "male" | "female") => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignedTo: target } : t))
    );
  };

  // Calculate domestic workload scores
  const femaleTasks = tasks.filter((t) => t.assignedTo === "female");
  const maleTasks = tasks.filter((t) => t.assignedTo === "male");

  const femaleLoad = femaleTasks.reduce((acc, t) => acc + Math.max(0, t.weight), 0);
  const maleLoad = maleTasks.reduce((acc, t) => acc + Math.max(0, t.weight), 0);

  // Free time calculation
  const femaleRest = femaleTasks.filter(t => t.category === "descanso").length;
  const maleRest = maleTasks.filter(t => t.category === "descanso").length;

  const difference = femaleLoad - maleLoad;
  const isBalanced = Math.abs(difference) <= 1 && femaleRest > 0 && maleRest > 0;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const resetGame = () => {
    setTasks(INITIAL_TASKS);
  };

  // Rotation degrees for the virtual scale (-15 to +15 deg)
  const rotationAngle = Math.min(Math.max(difference * 3.5, -20), 20);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <Scale className="w-4 h-4" /> Nivel Infantil (6-9 años) • Meta ODS 5.4
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
            ⚖️ La Balanza del Tiempo en el Hogar
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Reparte justamente las tareas del hogar y los tiempos de descanso entre la niña y el niño para equilibrar la balanza.
          </p>
        </div>
        <button
          onClick={resetGame}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reiniciar escenario
        </button>
      </div>

      {/* Virtual animated scale display */}
      <div className="mt-6 bg-gradient-to-b from-sky-50 to-indigo-50/40 rounded-2xl p-6 border border-sky-100 flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-md text-xs font-bold text-slate-600 uppercase mb-2">
          <span className="text-pink-600">Carga Niña: {femaleLoad} hrs</span>
          <span className={isBalanced ? "text-emerald-600" : "text-amber-600"}>
            {isBalanced ? "¡Balanza Equitativa!" : "Balanza Desigual"}
          </span>
          <span className="text-blue-600">Carga Niño: {maleLoad} hrs</span>
        </div>

        {/* Dynamic Scale Visual representation */}
        <div className="w-full max-w-sm h-36 flex flex-col items-center justify-center relative">
          {/* Base */}
          <div className="absolute bottom-2 w-16 h-4 bg-slate-600 rounded-t-lg" />
          <div className="absolute bottom-6 w-3 h-20 bg-slate-500" />
          <div className="absolute top-10 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-700 z-10" />

          {/* Lever Bar rotated dynamically */}
          <div
            className="w-72 h-3 bg-slate-700 rounded-full transition-transform duration-500 relative flex justify-between items-center px-1"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            {/* Left Pan (Female) */}
            <div className="w-16 h-12 border-b-4 border-l-2 border-r-2 border-pink-400 bg-pink-100/90 rounded-b-xl flex flex-col items-center justify-center -translate-y-[-24px] shadow-sm">
              <span className="text-xs font-bold text-pink-700">{femaleLoad} pts</span>
              <span className="text-[10px] text-pink-600">👧 Sofía</span>
            </div>

            {/* Right Pan (Male) */}
            <div className="w-16 h-12 border-b-4 border-l-2 border-r-2 border-blue-400 bg-blue-100/90 rounded-b-xl flex flex-col items-center justify-center -translate-y-[-24px] shadow-sm">
              <span className="text-xs font-bold text-blue-700">{maleLoad} pts</span>
              <span className="text-[10px] text-blue-600">👦 Mateo</span>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {isBalanced && (
          <div className="mt-4 p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs md:text-sm font-semibold flex items-center gap-2 animate-bounce">
            <Trophy className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>¡Excelente trabajo! Ambos colaboran por igual en el hogar y disfrutan de tiempo libre para estudiar y jugar.</span>
            <button
              onClick={triggerConfetti}
              className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1 rounded-lg"
            >
              🎉 Celebrar
            </button>
          </div>
        )}
      </div>

      {/* Task Distribution Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Column 1: Sofia */}
        <div className="bg-pink-50/50 rounded-2xl p-5 border-2 border-pink-200">
          <div className="flex items-center justify-between pb-3 border-b border-pink-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👧</span>
              <div>
                <h3 className="font-bold text-pink-900">Actividades de Sofía</h3>
                <p className="text-xs text-pink-700">Trabajo: {femaleLoad} pts • Descanso: {femaleRest}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2 min-h-[160px]">
            {femaleTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-3 rounded-xl border border-pink-200 shadow-sm flex items-center justify-between transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{task.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{task.name}</p>
                    <span className="text-[10px] text-slate-500 font-medium capitalize">
                      {task.category} ({task.weight > 0 ? `+${task.weight} carga` : `${task.weight} descanso`})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => moveTask(task.id, "male")}
                  className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-800 font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                  title="Pasar esta tarea a Mateo para equilibrar"
                >
                  Pasar a Mateo ➡️
                </button>
              </div>
            ))}
            {femaleTasks.length === 0 && (
              <p className="text-xs text-pink-400 italic text-center py-8">Sofía no tiene tareas asignadas.</p>
            )}
          </div>
        </div>

        {/* Column 2: Mateo */}
        <div className="bg-blue-50/50 rounded-2xl p-5 border-2 border-blue-200">
          <div className="flex items-center justify-between pb-3 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👦</span>
              <div>
                <h3 className="font-bold text-blue-900">Actividades de Mateo</h3>
                <p className="text-xs text-blue-700">Trabajo: {maleLoad} pts • Descanso: {maleRest}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2 min-h-[160px]">
            {maleTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm flex items-center justify-between transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{task.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{task.name}</p>
                    <span className="text-[10px] text-slate-500 font-medium capitalize">
                      {task.category} ({task.weight > 0 ? `+${task.weight} carga` : `${task.weight} descanso`})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => moveTask(task.id, "female")}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                  title="Pasar esta tarea a Sofía"
                >
                  ⬅️ Pasar a Sofía
                </button>
              </div>
            ))}
            {maleTasks.length === 0 && (
              <p className="text-xs text-blue-400 italic text-center py-8">Mateo no tiene tareas asignadas.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 flex items-start gap-2.5">
        <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <p>
          <strong>Dato formativo (INEGI, 2025):</strong> En México, las mujeres asumen más del 72% de la carga de tareas domésticas y de cuidados no remunerados. Aprender corresponsabilidad desde la infancia transforma los hogares en espacios libres, justos y felices.
        </p>
      </div>
    </div>
  );
}
