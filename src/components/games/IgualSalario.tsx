"use client";

import React, { useState } from "react";
import {
  Briefcase,
  CheckCircle,
  AlertOctagon,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Calendar,
  Building,
  GraduationCap,
  Award,
  DollarSign,
  PieChart,
  FileCheck
} from "lucide-react";
import confetti from "canvas-confetti";
import GameHeader from "@/components/common/GameHeader";
import InstructionsModal from "@/components/common/InstructionsModal";
import VictoryModal from "@/components/common/VictoryModal";
import EmergencyHelpModal from "@/components/common/EmergencyHelpModal";
import { sound } from "@/utils/audio";

interface RoleScenario {
  id: string;
  position: string;
  sector: string;
  department: string;
  maleSalary: number;
  femaleSalary: number;
  femalePromotionRate: number; // percentage
  malePromotionRate: number;
  responsibilities: string;
  sourceContext: string;
}

const INITIAL_ROLES: RoleScenario[] = [
  {
    id: "tech",
    position: "Ingeniería de Software Senior & Cloud",
    sector: "Tecnología e Información",
    department: "Desarrollo de Software",
    maleSalary: 45000,
    femaleSalary: 34000,
    femalePromotionRate: 25,
    malePromotionRate: 70,
    responsibilities: "Misma experiencia (5 años), certificaciones idénticas en arquitectura cloud y metas de código equivalentes.",
    sourceContext: "Referencia: IMCO (2024), Brecha salarial en sectores STEM en México."
  },
  {
    id: "health",
    position: "Especialista Médica y Cirugía General",
    sector: "Salud y Hospitales",
    department: "Cirugía Hospitalaria",
    maleSalary: 52000,
    femaleSalary: 41000,
    femalePromotionRate: 30,
    malePromotionRate: 75,
    responsibilities: "Mismo número de guardias nocturnas, cirugías de alta complejidad y evaluaciones de pacientes idénticas.",
    sourceContext: "Referencia: ENOE-INEGI (2024), Remuneración en personal de salud de segundo nivel."
  },
  {
    id: "finance",
    position: "Dirección de Contraloría y Finanzas",
    sector: "Corporativo y Comercio",
    department: "Administración Central",
    maleSalary: 62000,
    femaleSalary: 49000,
    femalePromotionRate: 35,
    malePromotionRate: 80,
    responsibilities: "Supervisión del mismo volumen presupuestal, auditorías fiscales y metas de rentabilidad equivalentes.",
    sourceContext: "Referencia: Secretaría del Trabajo y Previsión Social (STPS), Norma Mexicana NMX-R-025-SCFI."
  },
  {
    id: "education",
    position: "Cátedra e Investigación Universitaria",
    sector: "Educación Superior",
    department: "Ciencias Exactas",
    maleSalary: 39000,
    femaleSalary: 30500,
    femalePromotionRate: 20,
    malePromotionRate: 65,
    responsibilities: "Misma carga horaria frente a grupo, publicaciones de artículos indexados y comités de posgrado.",
    sourceContext: "Referencia: ANUIES / CONAHCYT, Equidad de género en el Sistema Nacional de Investigadores."
  },
];

export default function IgualSalario() {
  const [roles, setRoles] = useState<RoleScenario[]>(INITIAL_ROLES);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const currentRole = roles[selectedIdx];

  const salaryDiff = currentRole.maleSalary - currentRole.femaleSalary;
  const gapPercentage = ((salaryDiff / currentRole.maleSalary) * 100).toFixed(1);

  // 10-year cumulative wage loss calculation (12 months + aguinaldo reference)
  const cumulativeLoss10Years = Math.max(0, salaryDiff * 12 * 10);

  const updateFemaleSalary = (newSalary: number) => {
    sound.playClick();
    setRoles((prev) =>
      prev.map((r, i) => (i === selectedIdx ? { ...r, femaleSalary: newSalary } : r))
    );
  };

  const updateFemalePromotion = (newRate: number) => {
    sound.playClick();
    setRoles((prev) =>
      prev.map((r, i) => (i === selectedIdx ? { ...r, femalePromotionRate: newRate } : r))
    );
  };

  const isRoleEquitable =
    Math.abs(salaryDiff) <= 500 &&
    Math.abs(currentRole.malePromotionRate - currentRole.femalePromotionRate) <= 5;

  const handleApplyParity = () => {
    sound.playPowerup();
    updateFemaleSalary(currentRole.maleSalary);
    updateFemalePromotion(currentRole.malePromotionRate);
    sound.playCelebration();
    setIsVictoryOpen(true);
  };

  const handleRestart = () => {
    sound.playPowerup();
    setRoles(INITIAL_ROLES);
    setIsVictoryOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-100 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <GameHeader
        title="💼 A Igual Trabajo, Igual Salario"
        badge="Auditoría salarial corporativa y Ley Federal del Trabajo Art. 86"
        levelBadge="Nivel Juvenil (14 años en adelante)"
        levelColor="violet"
        odsTarget="ODS 5.1 & LFT"
        score={isRoleEquitable ? 300 : 150}
        stars={isRoleEquitable ? 3 : 1}
        maxStars={3}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onRestart={handleRestart}
      />

      {/* Role Selection Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-2 rounded-2xl">
        {roles.map((r, idx) => (
          <button
            key={r.id}
            onClick={() => {
              sound.playClick();
              setSelectedIdx(idx);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              selectedIdx === idx
                ? "bg-violet-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 bg-white/60"
            }`}
          >
            {r.position}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Sliders and Policy Levers */}
        <div className="md:col-span-7 bg-slate-50 p-6 rounded-3xl border-2 border-slate-200/80 shadow-xs space-y-5">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-violet-800 bg-violet-100 px-2.5 py-0.5 rounded-md inline-block">
              Sector: {currentRole.sector} • {currentRole.department}
            </span>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed">
              <strong>Perfil del puesto:</strong> {currentRole.responsibilities}
            </p>
          </div>

          {/* Salary Slider */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-slate-900">
                Remuneración Mensual de la Profesionista:
              </span>
              <span className="text-sm font-black text-violet-700 bg-violet-50 border border-violet-200 px-3 py-0.5 rounded-xl">
                ${currentRole.femaleSalary.toLocaleString("es-MX")} MXN
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="70000"
              step="500"
              value={currentRole.femaleSalary}
              onChange={(e) => updateFemaleSalary(Number(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer h-2 bg-violet-100 rounded-lg"
              aria-label="Ajuste de salario mensual de la colaboradora"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
              <span>Salario Masculino (Par): <strong>${currentRole.maleSalary.toLocaleString("es-MX")} MXN</strong></span>
            </div>
          </div>

          {/* Promotion Slider */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-slate-900">
                Tasa de Ascensos Directivos Femeninos (Romper techo de cristal):
              </span>
              <span className="text-sm font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-xl">
                {currentRole.femalePromotionRate}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={currentRole.femalePromotionRate}
              onChange={(e) => updateFemalePromotion(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-indigo-100 rounded-lg"
              aria-label="Tasa de acceso a ascensos"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
              <span>Tasa de ascensos masculinos: <strong>{currentRole.malePromotionRate}%</strong></span>
            </div>
          </div>

          {/* Direct Equilibrium Button */}
          <button
            onClick={handleApplyParity}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Aplicar Principio Constitucional: Igual Trabajo = Igual Salario</span>
          </button>
        </div>

        {/* Audit Report and 10-Year Cumulative Impact */}
        <div className="md:col-span-5 space-y-4">
          <div
            className={`p-6 rounded-3xl border-2 transition-all shadow-xs ${
              isRoleEquitable ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Dictamen de Auditoría
              </span>
              {isRoleEquitable ? (
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-200 text-emerald-950 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Paridad Lograda
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-200 text-rose-950 flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5" /> Brecha Activa
                </span>
              )}
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-600 font-medium block">Diferencia Mensual:</span>
              <p className={`text-3xl font-black mt-0.5 ${isRoleEquitable ? "text-emerald-700" : "text-rose-700"}`}>
                {salaryDiff <= 0 ? "$0 MXN (Paridad)" : `-$${salaryDiff.toLocaleString("es-MX")} MXN`}
              </p>
              <span className="text-xs font-bold text-slate-600 block mt-1">
                Brecha: <strong>{Number(gapPercentage) > 0 ? `${gapPercentage}% menos para la mujer` : "0% (Equidad salarial)"}</strong>
              </span>
            </div>

            {/* 10-year cumulative loss simulation */}
            <div className="mt-4 p-3.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 font-black text-slate-900">
                <Calendar className="w-4 h-4 text-violet-600" />
                <span>Pérdida acumulada estimada a 10 años:</span>
              </div>
              <p className="text-xl font-black text-rose-700">
                ${cumulativeLoss10Years.toLocaleString("es-MX")} MXN
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                *Cálculo hipotético sobre 10 años de carrera: impacta directamente la pensión para el retiro, créditos de vivienda y ahorro patrimonial.
              </p>
            </div>
          </div>

          {/* Legal Framework & Sources Box */}
          <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-indigo-900">
              <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Marco Legal Vigente:</span>
            </div>
            <p className="leading-relaxed">
              <strong>Ley Federal del Trabajo (Art. 86):</strong> &ldquo;A trabajo igual, desempeñado en puesto, jornada y condiciones de eficiencia también iguales, debe corresponder salario igual.&rdquo;
            </p>
            <p className="text-[10px] text-indigo-800 italic">
              {currentRole.sourceContext}
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        title="Instrucciones: A Igual Trabajo, Igual Salario"
        objective="Auditar salarios, oportunidades de ascenso y prestaciones en diferentes profesiones para erradicar la discriminación laboral por razón de género."
        rules={[
          "Explora los diferentes sectores profesionales disponibles.",
          "Revisa las responsabilidades y detecta la brecha salarial existente entre el hombre y la mujer.",
          "Ajusta el salario y la tasa de ascensos para alcanzar la paridad plena exigida por la ley."
        ]}
        tips={[
          "La brecha salarial no solo afecta el ingreso mensual; a 10 años representa pérdidas millonarias en patrimonio y pensiones.",
          "El simulador distingue claramente entre datos de referencia y supuestos del modelo."
        ]}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        title="¡Certificación en Igualdad Laboral Otorgada!"
        score={300}
        stars={3}
        maxStars={3}
        takeaway="Has demostrado que garantizar salarios iguales ante responsabilidades iguales no compromete la productividad y dignifica el trabajo de las profesionistas."
        summaryPoints={[
          "Eliminaste la brecha salarial en el sector auditado.",
          "Rompiste el techo de cristal garantizando acceso justo a ascensos.",
          "Cumpliste con el artículo 86 de la Ley Federal del Trabajo."
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
