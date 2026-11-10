"use client";

import React, { useState } from "react";
import {
  Scale,
  RefreshCw,
  Trophy,
  Sparkles,
  Heart,
  BatteryCharging,
  BatteryWarning,
  Clock,
  ArrowLeftRight,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Smile,
  Meh
} from "lucide-react";
import confetti from "canvas-confetti";
import GameHeader from "@/components/common/GameHeader";
import InstructionsModal from "@/components/common/InstructionsModal";
import VictoryModal from "@/components/common/VictoryModal";
import EmergencyHelpModal from "@/components/common/EmergencyHelpModal";
import { sound } from "@/utils/audio";

interface TaskItem {
  id: string;
  name: string;
  category: "cuidado" | "hogar" | "estudio" | "descanso";
  hours: number;
  effortWeight: number; // 1-3 effort points
  assignedTo: "female" | "male";
  icon: string;
  description: string;
}

const SCHOOL_DAY_TASKS: TaskItem[] = [
  { id: "1", name: "Lavar los trastes del desayuno", category: "hogar", hours: 1, effortWeight: 2, assignedTo: "female", icon: "🍽️", description: "Higiene de platos y cocina." },
  { id: "2", name: "Barrer el patio y la entrada", category: "hogar", hours: 1, effortWeight: 2, assignedTo: "female", icon: "🧹", description: "Mantenimiento básico del espacio común." },
  { id: "3", name: "Cuidar y alimentar al hermanito", category: "cuidado", hours: 2.5, effortWeight: 3, assignedTo: "female", icon: "🍼", description: "Atención y cuidado afectivo en el hogar." },
  { id: "4", name: "Preparar mochilas y almuerzo escolar", category: "hogar", hours: 1, effortWeight: 2, assignedTo: "female", icon: "🥪", description: "Organización de alimentos para la escuela." },
  { id: "5", name: "Estudiar para examen de ciencias", category: "estudio", hours: 2, effortWeight: 2, assignedTo: "female", icon: "📚", description: "Tiempo escolar imprescindible." },
  { id: "6", name: "Tarde de descanso y siesta", category: "descanso", hours: 1.5, effortWeight: 0, assignedTo: "male", icon: "🛋️", description: "Descanso reparador." },
  { id: "7", name: "Sacar la basura al camión recolector", category: "hogar", hours: 0.5, effortWeight: 1, assignedTo: "male", icon: "🗑️", description: "Traslado de residuos clasificados." },
  { id: "8", name: "Jugar videojuegos y charlar con amigos", category: "descanso", hours: 2.5, effortWeight: 0, assignedTo: "male", icon: "🎮", description: "Tiempo libre y esparcimiento." },
  { id: "9", name: "Hacer tarea de geografía", category: "estudio", hours: 1.5, effortWeight: 2, assignedTo: "male", icon: "🗺️", description: "Compromiso académico personal." },
  { id: "10", name: "Regar las plantas y flores", category: "hogar", hours: 0.5, effortWeight: 1, assignedTo: "male", icon: "🌱", description: "Cuidado del entorno natural de la casa." },
];

const WEEKEND_TASKS: TaskItem[] = [
  { id: "w1", name: "Cocinar la comida familiar del mediodía", category: "hogar", hours: 2.5, effortWeight: 3, assignedTo: "female", icon: "🍲", description: "Preparación de platillos para la familia." },
  { id: "w2", name: "Trapear a fondo recámaras y sala", category: "hogar", hours: 2, effortWeight: 3, assignedTo: "female", icon: "🧽", description: "Aseo profundo de la vivienda." },
  { id: "w3", name: "Apoyar a la abuelita con sus medicinas", category: "cuidado", hours: 1.5, effortWeight: 2, assignedTo: "female", icon: "👵", description: "Acompañamiento a personas adultas mayores." },
  { id: "w4", name: "Lavar y tender sábanas limpias", category: "hogar", hours: 1.5, effortWeight: 2, assignedTo: "female", icon: "🧺", description: "Lavandería general del hogar." },
  { id: "w5", name: "Lectura de libro sobre astronautas", category: "estudio", hours: 1.5, effortWeight: 1, assignedTo: "female", icon: "🚀", description: "Vocación científica personal." },
  { id: "w6", name: "Partido de fútbol en la cancha de la colonia", category: "descanso", hours: 3, effortWeight: 0, assignedTo: "male", icon: "⚽", description: "Deporte y juego al aire libre." },
  { id: "w7", name: "Ordenar la despensa y guardar compras", category: "hogar", hours: 1, effortWeight: 1, assignedTo: "male", icon: "🛒", description: "Organización de provisiones." },
  { id: "w8", name: "Tocar la guitarra y relajarse", category: "descanso", hours: 2, effortWeight: 0, assignedTo: "male", icon: "🎸", description: "Hobby artístico." },
  { id: "w9", name: "Repasar proyecto escolar de arte", category: "estudio", hours: 1.5, effortWeight: 2, assignedTo: "male", icon: "🎨", description: "Preparación académica." },
  { id: "w10", name: "Bañar al perrito de la familia", category: "hogar", hours: 1, effortWeight: 2, assignedTo: "male", icon: "🐕", description: "Cuidado de animales de compañía." },
];

export default function BalanzaDelTiempo() {
  const [scenario, setScenario] = useState<"school" | "weekend">("school");
  const [tasks, setTasks] = useState<TaskItem[]>(SCHOOL_DAY_TASKS);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const femaleTasks = tasks.filter((t) => t.assignedTo === "female");
  const maleTasks = tasks.filter((t) => t.assignedTo === "male");

  // Calculations considering both hours and effort points
  const femaleChoreHours = femaleTasks
    .filter((t) => t.category === "hogar" || t.category === "cuidado")
    .reduce((sum, t) => sum + t.hours, 0);

  const maleChoreHours = maleTasks
    .filter((t) => t.category === "hogar" || t.category === "cuidado")
    .reduce((sum, t) => sum + t.hours, 0);

  const femaleFreeHours = femaleTasks
    .filter((t) => t.category === "descanso")
    .reduce((sum, t) => sum + t.hours, 0);

  const maleFreeHours = maleTasks
    .filter((t) => t.category === "descanso")
    .reduce((sum, t) => sum + t.hours, 0);

  const femaleStudyHours = femaleTasks
    .filter((t) => t.category === "estudio")
    .reduce((sum, t) => sum + t.hours, 0);

  const maleStudyHours = maleTasks
    .filter((t) => t.category === "estudio")
    .reduce((sum, t) => sum + t.hours, 0);

  const difference = femaleChoreHours - maleChoreHours;
  const isBalanced =
    Math.abs(difference) <= 1.2 &&
    femaleFreeHours >= 1 &&
    maleFreeHours >= 1 &&
    femaleStudyHours >= 1 &&
    maleStudyHours >= 1;

  const moveTask = (taskId: string, target: "female" | "male") => {
    sound.playClick();
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignedTo: target } : t))
    );
  };

  const handleScenarioChange = (newScenario: "school" | "weekend") => {
    sound.playPowerup();
    setScenario(newScenario);
    setTasks(newScenario === "school" ? SCHOOL_DAY_TASKS : WEEKEND_TASKS);
  };

  const handleRestart = () => {
    sound.playPowerup();
    setTasks(scenario === "school" ? SCHOOL_DAY_TASKS : WEEKEND_TASKS);
    setIsVictoryOpen(false);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e: React.DragEvent, target: "female" | "male") => {
    e.preventDefault();
    const id = draggedTaskId || e.dataTransfer.getData("text/plain");
    if (id) {
      moveTask(id, target);
      setDraggedTaskId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Scale rotation degrees (-18 to +18 deg)
  const rotationAngle = Math.min(Math.max(difference * 3.5, -18), 18);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-100 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <GameHeader
        title="⚖️ La Balanza del Tiempo y los Cuidados"
        badge="Corresponsabilidad equitativa en el hogar (Meta ODS 5.4)"
        levelBadge="Nivel Infantil (6 a 9 años)"
        levelColor="blue"
        odsTarget="ODS 5.4"
        score={isBalanced ? 300 : 100}
        stars={isBalanced ? 3 : 1}
        maxStars={3}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onRestart={handleRestart}
      />

      {/* Scenario Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-1.5 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScenarioChange("school")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              scenario === "school"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📅 Escenario: Lunes Escolar
          </button>
          <button
            onClick={() => handleScenarioChange("weekend")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              scenario === "weekend"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🧹 Escenario: Sábado Familiar
          </button>
        </div>

        <span className="text-xs text-slate-500 font-bold px-3">
          Objetivo: Que ambos colaboren en el hogar y tengan tiempo para estudiar y jugar
        </span>
      </div>

      {/* Scale Visual Stage */}
      <div className="bg-gradient-to-b from-sky-50 via-indigo-50/40 to-slate-50 rounded-3xl p-6 border-2 border-sky-100 shadow-inner flex flex-col items-center">
        {/* Status Indicators */}
        <div className="flex items-center justify-between w-full max-w-lg text-xs font-black uppercase mb-2">
          <div className="flex items-center gap-1.5 text-pink-700">
            <span>👧 Sofía: {femaleChoreHours.toFixed(1)} hrs labores</span>
            {femaleFreeHours === 0 && (
              <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-black animate-pulse">
                ¡Agotada!
              </span>
            )}
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-black transition-colors ${
              isBalanced
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                : "bg-amber-100 text-amber-900 border border-amber-300"
            }`}
          >
            {isBalanced ? "✨ ¡Balanza Equitativa!" : "⚠️ Desbalance en el Hogar"}
          </span>

          <div className="flex items-center gap-1.5 text-blue-700">
            <span>👦 Mateo: {maleChoreHours.toFixed(1)} hrs labores</span>
            {maleFreeHours >= 3.5 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                Exceso libre
              </span>
            )}
          </div>
        </div>

        {/* Animated Scale Diagram */}
        <div className="w-full max-w-md h-36 flex flex-col items-center justify-center relative my-3">
          {/* Base */}
          <div className="absolute bottom-1 w-20 h-4 bg-slate-800 rounded-t-lg" />
          <div className="absolute bottom-5 w-3.5 h-20 bg-slate-600" />
          <div className="absolute top-9 w-5 h-5 rounded-full bg-amber-400 border-2 border-slate-800 z-10" />

          {/* Scale Beam */}
          <div
            className="w-80 h-3.5 bg-slate-800 rounded-full transition-transform duration-500 relative flex justify-between items-center px-1 shadow-md"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            {/* Left Pan (Sofia) */}
            <div className="w-24 h-16 border-b-4 border-l-2 border-r-2 border-pink-400 bg-pink-100/95 rounded-b-2xl flex flex-col items-center justify-center -translate-y-[-32px] shadow-sm">
              <span className="text-xs font-black text-pink-900">{femaleChoreHours.toFixed(1)} hrs</span>
              <span className="text-[10px] text-pink-700 font-bold">👧 Sofía</span>
            </div>

            {/* Right Pan (Mateo) */}
            <div className="w-24 h-16 border-b-4 border-l-2 border-r-2 border-blue-400 bg-blue-100/95 rounded-b-2xl flex flex-col items-center justify-center -translate-y-[-32px] shadow-sm">
              <span className="text-xs font-black text-blue-900">{maleChoreHours.toFixed(1)} hrs</span>
              <span className="text-[10px] text-blue-700 font-bold">👦 Mateo</span>
            </div>
          </div>
        </div>

        {/* Success Trigger */}
        {isBalanced && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-lg animate-bounce">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>¡Increíble! Ambos comparten el trabajo del hogar y tienen tiempo para estudiar y descansar.</span>
            </div>
            <button
              onClick={() => setIsVictoryOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow shrink-0"
            >
              Ver Logro 🎉
            </button>
          </div>
        )}
      </div>

      {/* Columns for Sofia and Mateo (Drag & Drop + Accessible Buttons) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sofia's column */}
        <div
          onDrop={(e) => handleDrop(e, "female")}
          onDragOver={handleDragOver}
          className="bg-pink-50/60 rounded-3xl p-5 border-2 border-pink-200 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between pb-3 border-b border-pink-200">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">👧</span>
              <div>
                <h3 className="font-black text-pink-950 text-sm">Día de Sofía</h3>
                <p className="text-[11px] text-pink-700 font-bold">
                  Labores: {femaleChoreHours.toFixed(1)}h • Estudio: {femaleStudyHours.toFixed(1)}h • Descanso: {femaleFreeHours.toFixed(1)}h
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {femaleTasks.map((t) => (
              <div
                key={t.id}
                draggable
                onDragStart={(e) => handleDragStart(e, t.id)}
                className="bg-white p-3 rounded-2xl border border-pink-200 shadow-xs flex items-center justify-between cursor-grab hover:scale-101 transition-all"
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
                  title="Pasar esta tarea a Mateo"
                >
                  Pasar a Mateo ➡️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mateo's column */}
        <div
          onDrop={(e) => handleDrop(e, "male")}
          onDragOver={handleDragOver}
          className="bg-blue-50/60 rounded-3xl p-5 border-2 border-blue-200 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between pb-3 border-b border-blue-200">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">👦</span>
              <div>
                <h3 className="font-black text-blue-950 text-sm">Día de Mateo</h3>
                <p className="text-[11px] text-blue-700 font-bold">
                  Labores: {maleChoreHours.toFixed(1)}h • Estudio: {maleStudyHours.toFixed(1)}h • Descanso: {maleFreeHours.toFixed(1)}h
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {maleTasks.map((t) => (
              <div
                key={t.id}
                draggable
                onDragStart={(e) => handleDragStart(e, t.id)}
                className="bg-white p-3 rounded-2xl border border-blue-200 shadow-xs flex items-center justify-between cursor-grab hover:scale-101 transition-all"
              >
                <button
                  onClick={() => moveTask(t.id, "female")}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-2.5 py-1.5 rounded-xl transition-colors mr-2 shrink-0"
                  title="Pasar esta tarea a Sofía"
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

      {/* Educational Fact */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3 text-xs text-indigo-950">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Enseñanza Pedagógica (Meta ODS 5.4):</strong> El trabajo doméstico y de cuidado no es exclusivo de las mujeres. Aprender a cocinar, limpiar y cuidar de los demás son habilidades de independencia y cariño que todas las personas necesitan.
        </p>
      </div>

      {/* Modals */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        title="Instrucciones: La Balanza del Tiempo"
        objective="Distribuir las labores del hogar equitativamente para que ni Sofía ni Mateo queden sobrecargados de trabajo."
        rules={[
          "Arrastra o presiona los botones 'Pasar a...' para transferir tareas entre Sofía y Mateo.",
          "Cuida que ambos tengan tiempo para sus tareas escolares y horas de descanso libre.",
          "Observa cómo la balanza se equilibra cuando la corresponsabilidad es justa."
        ]}
        tips={[
          "Las tareas de cuidado (como atender a un hermanito o cocinar) consumen más horas y energía que sacar la basura.",
          "Prueba ambos escenarios: Lunes Escolar y Sábado Familiar."
        ]}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        title="¡Hogar Equitativo y Feliz!"
        score={300}
        stars={3}
        maxStars={3}
        takeaway="Has demostrado que cuando todas las personas cooperan con el cuidado del hogar, el tiempo rinde más y todas pueden estudiar, jugar y descansar."
        summaryPoints={[
          "Sofía y Mateo colaboran por igual en las labores del hogar.",
          "Ambos disponen de tiempo garantizado para sus tareas de la escuela.",
          "Derribaste el estereotipo de que las tareas del hogar son solo para mujeres."
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
