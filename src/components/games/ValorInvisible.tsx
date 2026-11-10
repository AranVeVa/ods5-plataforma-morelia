"use client";

import React, { useState } from "react";
import {
  Calculator,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  CheckCircle,
  Sparkles,
  PieChart,
  HelpCircle,
  RotateCcw,
  Scale
} from "lucide-react";
import confetti from "canvas-confetti";
import GameHeader from "@/components/common/GameHeader";
import InstructionsModal from "@/components/common/InstructionsModal";
import VictoryModal from "@/components/common/VictoryModal";
import EmergencyHelpModal from "@/components/common/EmergencyHelpModal";
import { sound } from "@/utils/audio";

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  gender: "female" | "male";
  hours: number;
  avatar: string;
}

const DEFAULT_FAMILY: FamilyMember[] = [
  { id: "mama", name: "Mamá (Laura)", role: "Madre", gender: "female", hours: 39, avatar: "👩" },
  { id: "papa", name: "Papá (Carlos)", role: "Padre", gender: "male", hours: 15, avatar: "👨" },
  { id: "hija", name: "Hija (Ana, 12 años)", role: "Hija mayor", gender: "female", hours: 16, avatar: "👧" },
  { id: "hijo", name: "Hijo (Diego, 11 años)", role: "Hijo", gender: "male", hours: 4, avatar: "👦" },
  { id: "abuela", name: "Abuelita (Elena)", role: "Abuela", gender: "female", hours: 20, avatar: "👵" },
];

export default function ValorInvisible() {
  const [members, setMembers] = useState<FamilyMember[]>(DEFAULT_FAMILY);
  const [hourlyWage, setHourlyWage] = useState<number>(85); // Reference market hourly rate (MXN)
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const updateHours = (id: string, newHours: number) => {
    sound.playClick();
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, hours: newHours } : m))
    );
  };

  const totalFemaleHours = members
    .filter((m) => m.gender === "female")
    .reduce((sum, m) => sum + m.hours, 0);

  const totalMaleHours = members
    .filter((m) => m.gender === "male")
    .reduce((sum, m) => sum + m.hours, 0);

  const totalHours = totalFemaleHours + totalMaleHours;

  const femalePercentage = totalHours > 0 ? ((totalFemaleHours / totalHours) * 100).toFixed(1) : "0";
  const malePercentage = totalHours > 0 ? ((totalMaleHours / totalHours) * 100).toFixed(1) : "0";

  const monthlyFemaleValue = Math.round(totalFemaleHours * 4.33 * hourlyWage);
  const monthlyMaleValue = Math.round(totalMaleHours * 4.33 * hourlyWage);
  const annualTotalFamilyValue = Math.round(totalHours * 52 * hourlyWage);

  const isEquitable = Math.abs(Number(femalePercentage) - 50) <= 8;

  const handleBalance = () => {
    sound.playPowerup();
    const avg = Math.round(totalHours / members.length);
    setMembers((prev) => prev.map((m) => ({ ...m, hours: avg })));
    sound.playCelebration();
    setIsVictoryOpen(true);
  };

  const handleRestart = () => {
    sound.playPowerup();
    setMembers(DEFAULT_FAMILY);
    setHourlyWage(85);
    setIsVictoryOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-100 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <GameHeader
        title="📊 El Valor Invisible: Economía del Cuidado"
        badge="Valor económico del trabajo doméstico y de cuidados (Meta ODS 5.4)"
        levelBadge="Nivel Intermedio (10 a 13 años)"
        levelColor="rose"
        odsTarget="ODS 5.4"
        score={isEquitable ? 300 : 150}
        stars={isEquitable ? 3 : 2}
        maxStars={3}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onRestart={handleRestart}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Family Member Sliders */}
        <div className="md:col-span-6 bg-slate-50 p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              Integrantes y Horas Semanales de Labores:
            </h3>
            <span className="text-[11px] font-bold text-slate-500">Horas/Sem</span>
          </div>

          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.id} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m.avatar}</span>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{m.name}</p>
                      <span className="text-[10px] text-slate-400 capitalize">{m.role}</span>
                    </div>
                  </div>

                  <span
                    className={`font-black px-2.5 py-1 rounded-xl text-xs ${
                      m.gender === "female"
                        ? "bg-pink-100 text-pink-800 border border-pink-200"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}
                  >
                    {m.hours} hrs/sem
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="60"
                  value={m.hours}
                  onChange={(e) => updateHours(m.id, Number(e.target.value))}
                  className={`w-full h-2 rounded-lg cursor-pointer ${
                    m.gender === "female" ? "accent-pink-600 bg-pink-100" : "accent-blue-600 bg-blue-100"
                  }`}
                  aria-label={`Horas de ${m.name}`}
                />
              </div>
            ))}
          </div>

          {/* Reference Market Wage Slider */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Salario de referencia en el mercado:
              </span>
              <span className="font-black text-slate-900 bg-white border border-slate-300 px-2.5 py-0.5 rounded-lg">
                ${hourlyWage} MXN/hr
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="160"
              step="5"
              value={hourlyWage}
              onChange={(e) => {
                sound.playClick();
                setHourlyWage(Number(e.target.value));
              }}
              className="w-full accent-slate-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <button
            onClick={handleBalance}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simular Corresponsabilidad Equitativa (50% - 50%)</span>
          </button>
        </div>

        {/* Dynamic Visual Results Column */}
        <div className="md:col-span-6 space-y-4">
          {/* Proportion Gauge */}
          <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              Proporción de Trabajo No Remunerado en Casa:
            </h4>
            <div className="w-full h-9 rounded-2xl bg-slate-200 overflow-hidden flex font-black text-xs text-white shadow-inner">
              <div
                style={{ width: `${femalePercentage}%` }}
                className="bg-pink-500 flex items-center justify-center transition-all duration-300"
              >
                {Number(femalePercentage) > 15 ? `${femalePercentage}% 👩` : ""}
              </div>
              <div
                style={{ width: `${malePercentage}%` }}
                className="bg-blue-500 flex items-center justify-center transition-all duration-300"
              >
                {Number(malePercentage) > 15 ? `${malePercentage}% 👨` : ""}
              </div>
            </div>
            <div className="flex justify-between text-xs mt-2.5 font-bold">
              <span className="text-pink-600">Mujeres del hogar: {femalePercentage}% ({totalFemaleHours}h)</span>
              <span className="text-blue-600">Varones del hogar: {malePercentage}% ({totalMaleHours}h)</span>
            </div>
          </div>

          {/* Economic Value Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-3xl bg-pink-50 border-2 border-pink-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wide text-pink-700 block">
                Valor Aportado por Mujeres:
              </span>
              <p className="text-xl sm:text-2xl font-black text-pink-900 mt-1">
                ${monthlyFemaleValue.toLocaleString("es-MX")} <span className="text-xs font-normal">MXN/mes</span>
              </p>
              <span className="text-[10px] text-pink-700 font-semibold mt-1 block">
                Equivalente mensual de cuidado
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-blue-50 border-2 border-blue-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wide text-blue-700 block">
                Valor Aportado por Varones:
              </span>
              <p className="text-xl sm:text-2xl font-black text-blue-900 mt-1">
                ${monthlyMaleValue.toLocaleString("es-MX")} <span className="text-xs font-normal">MXN/mes</span>
              </p>
              <span className="text-[10px] text-blue-700 font-semibold mt-1 block">
                Equivalente mensual de cuidado
              </span>
            </div>
          </div>

          {/* Official Benchmark Box (INEGI Context) */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 text-xs text-amber-950 space-y-1">
            <div className="flex items-center gap-2 font-black text-amber-900">
              <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Dato Oficial INEGI (CSTNRHM 2024 / Comunicado 148/25):</span>
            </div>
            <p className="leading-relaxed">
              El valor económico de las labores domésticas y de cuidados en México equivale al <strong>23.9% del PIB nacional</strong>. A nivel país, más del <strong>72% de esta carga</strong> es asumida por mujeres sin remuneración.
            </p>
            <p className="text-[10px] text-amber-800 italic pt-1 border-t border-amber-200/60">
              *Nota metodológica: Las cifras del simulador son una estimación pedagógica familiar y no reemplazan las cuentas satélite oficiales.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        title="Instrucciones: El Valor Invisible"
        objective="Calcular y visibilizar el valor económico que representa el trabajo doméstico y de cuidado de la familia, comprendiendo por qué debe distribuirse con justicia."
        rules={[
          "Mueve los controles de horas de cada familiar para reflejar su colaboración semanal en el hogar.",
          "Ajusta el salario de referencia en el mercado por hora de servicios.",
          "Observa cómo se reparte la carga entre mujeres y hombres y presiona 'Simular Corresponsabilidad' para equilibrar."
        ]}
        tips={[
          "El trabajo doméstico no suele tener un sueldo, pero tiene un inmenso valor económico que sostiene la vida.",
          "Ningún dato introducido se almacena en servidores (Privacy by Design)."
        ]}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        title="¡Corresponsabilidad Familiar Alcanzada!"
        score={300}
        stars={3}
        maxStars={3}
        takeaway="Has demostrado que distribuir el trabajo de cuidados entre todos los miembros de la familia permite que nadie cargue con el agotamiento y todas las personas tengan bienestar."
        summaryPoints={[
          "Equilibraste la jornada no remunerada al 50%-50%.",
          "Reconociste el aporte económico del trabajo de cuidado en el PIB.",
          "Construiste un modelo de hogar justo e incluyente."
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
