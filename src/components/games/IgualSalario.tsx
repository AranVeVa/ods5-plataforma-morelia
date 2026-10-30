"use client";

import React, { useState } from "react";
import { Briefcase, CheckCircle, AlertOctagon, TrendingUp, Sparkles, RefreshCw, DollarSign, Calendar } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "@/utils/audio";

interface RoleScenario {
  id: string;
  position: string;
  sector: string;
  department: string;
  maleSalary: number;
  femaleSalary: number;
  femalePromotionRate: number;
  malePromotionRate: number;
  responsibilities: string;
}

const INITIAL_ROLES: RoleScenario[] = [
  {
    id: "tech",
    position: "Ingeniería de Software Senior",
    sector: "Tecnología e Innovación",
    department: "Desarrollo Cloud & IA",
    maleSalary: 45000,
    femaleSalary: 34000,
    femalePromotionRate: 25,
    malePromotionRate: 70,
    responsibilities: "Misma experiencia (6 años), certificaciones equivalentes y gestión del mismo volumen de código y entregables.",
  },
  {
    id: "health",
    position: "Especialista Médica y Cirugía",
    sector: "Salud y Hospitales",
    department: "Cirugía General",
    maleSalary: 52000,
    femaleSalary: 41000,
    femalePromotionRate: 30,
    malePromotionRate: 75,
    responsibilities: "Mismo número de guardias, intervenciones quirúrgicas y alta satisfacción hospitalaria de pacientes.",
  },
  {
    id: "finance",
    position: "Dirección de Finanzas y Auditoría",
    sector: "Corporativo y Comercio",
    department: "Contraloría General",
    maleSalary: 60000,
    femaleSalary: 48000,
    femalePromotionRate: 35,
    malePromotionRate: 80,
    responsibilities: "Supervisión de balances anuales idénticos y cumplimiento fiscal estricto.",
  },
  {
    id: "education",
    position: "Cátedra Universitaria y Posgrado",
    sector: "Educación Superior",
    department: "Investigación Científica",
    maleSalary: 38000,
    femaleSalary: 29500,
    femalePromotionRate: 20,
    malePromotionRate: 65,
    responsibilities: "Misma cantidad de horas frente a grupo, publicaciones indexadas y tutorías académicas.",
  },
];

export default function IgualSalario() {
  const [roles, setRoles] = useState<RoleScenario[]>(INITIAL_ROLES);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const currentRole = roles[selectedIdx];

  const salaryDiff = currentRole.maleSalary - currentRole.femaleSalary;
  const gapPercentage = ((salaryDiff / currentRole.maleSalary) * 100).toFixed(1);

  // 10-year cumulative wage loss calculation
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
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="bg-gradient-to-br from-white via-violet-50/20 to-purple-50/20 rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-800 border border-violet-200">
            <Briefcase className="w-4 h-4" /> Nivel Juvenil (14+ años) • Justicia Laboral y LFT Art. 86
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
            💼 A Igual Trabajo, Igual Salario
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Simulador de auditoría salarial. Modifica las políticas laborales para erradicar la brecha de género.
          </p>
        </div>
        <button
          onClick={() => {
            sound.playPowerup();
            setRoles(INITIAL_ROLES);
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reestablecer auditoría
        </button>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex flex-wrap gap-2 mt-6">
        {roles.map((r, idx) => (
          <button
            key={r.id}
            onClick={() => {
              sound.playClick();
              setSelectedIdx(idx);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
              selectedIdx === idx
                ? "bg-violet-600 text-white shadow-md scale-102"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {r.position}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
        {/* Sliders & Adjustments */}
        <div className="md:col-span-7 bg-white/90 p-6 rounded-3xl border-2 border-slate-200/80 shadow-sm space-y-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-violet-700 block">
              Sector: {currentRole.sector} • {currentRole.department}
            </span>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {currentRole.responsibilities}
            </p>
          </div>

          {/* Salary Adjustment */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-bold text-slate-800">
              <span>Remuneración Mensual de la Profesionista:</span>
              <span className="text-sm font-black text-violet-700 bg-violet-100 px-3 py-0.5 rounded-xl">
                ${currentRole.femaleSalary.toLocaleString("es-MX")} MXN
              </span>
            </div>
            <input
              type="range"
              min="25000"
              max="70000"
              step="500"
              value={currentRole.femaleSalary}
              onChange={(e) => updateFemaleSalary(Number(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer h-2 bg-violet-100 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Salario Masculino (Par): <strong>${currentRole.maleSalary.toLocaleString("es-MX")} MXN</strong></span>
            </div>
          </div>

          {/* Promotion Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-bold text-slate-800">
              <span>Tasa de Ascensos Directivos para Mujeres:</span>
              <span className="text-sm font-black text-indigo-700 bg-indigo-100 px-3 py-0.5 rounded-xl">
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
            />
            <span className="text-[11px] text-slate-500">
              Tasa de ascensos para hombres: {currentRole.malePromotionRate}%.
            </span>
          </div>

          <button
            onClick={handleApplyParity}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Aplicar Principio de Igual Remuneración (LFT Art. 86)
          </button>
        </div>

        {/* Audit Status & Lifetime Impact */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div
            className={`p-6 rounded-3xl border-2 transition-all ${
              isRoleEquitable ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                Resultado de Auditoría
              </span>
              {isRoleEquitable ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-200 text-emerald-900 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Certificado en Paridad
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-200 text-rose-900 flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5" /> Brecha Discriminatoria
                </span>
              )}
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-600 block">Diferencia Mensual:</span>
              <p className={`text-3xl font-black mt-1 ${isRoleEquitable ? "text-emerald-700" : "text-rose-700"}`}>
                {salaryDiff <= 0 ? "$0 MXN (Paridad Plena)" : `-$${salaryDiff.toLocaleString("es-MX")} MXN`}
              </p>
              <span className="text-xs font-semibold text-slate-500 block mt-1">
                Brecha porcentual: <strong>{Number(gapPercentage) > 0 ? `${gapPercentage}% de penalización por género` : "0% (Igualdad salarial)"}</strong>
              </span>
            </div>

            {/* 10-year cumulative loss indicator */}
            <div className="mt-4 p-3 rounded-2xl bg-white/80 border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Calendar className="w-4 h-4 text-violet-600" />
                <span>Pérdida acumulada a 10 años:</span>
              </div>
              <p className="text-base font-black text-rose-700 mt-0.5">
                ${cumulativeLoss10Years.toLocaleString("es-MX")} MXN
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                Impacta directamente el fondo de retiro, acceso a créditos de vivienda y bienestar familiar.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-950">
              <strong>Impacto Sostenible (ODS 5.1):</strong> Cerrar la brecha salarial eleva el bienestar general, reduce la pobreza y potencia el crecimiento económico en Michoacán.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
