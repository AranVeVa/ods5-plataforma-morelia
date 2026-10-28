"use client";

import React, { useState } from "react";
import { Briefcase, CheckCircle, AlertOctagon, TrendingUp, Sparkles, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

interface RoleScenario {
  id: string;
  position: string;
  department: string;
  maleSalary: number;
  femaleSalary: number;
  femalePromotionRate: number; // percentage
  malePromotionRate: number;
  responsibilities: string;
}

const INITIAL_ROLES: RoleScenario[] = [
  {
    id: "dev",
    position: "Desarrollador/a de Software Senior",
    department: "Tecnología e Innovación",
    maleSalary: 42000,
    femaleSalary: 33500,
    femalePromotionRate: 20,
    malePromotionRate: 65,
    responsibilities: "Misma experiencia (5 años), mismas horas y metas de entrega idénticas.",
  },
  {
    id: "admin",
    position: "Gerente de Finanzas y Operaciones",
    department: "Administración",
    maleSalary: 55000,
    femaleSalary: 45000,
    femalePromotionRate: 30,
    malePromotionRate: 70,
    responsibilities: "Mismo nivel de maestría y supervisión del mismo volumen presupuestal.",
  },
  {
    id: "support",
    position: "Especialista en Atención y Soporte",
    department: "Operaciones",
    maleSalary: 18000,
    femaleSalary: 15200,
    femalePromotionRate: 25,
    malePromotionRate: 50,
    responsibilities: "Mismo índice de satisfacción de clientes y resolución de tickets.",
  },
];

export default function IgualSalario() {
  const [roles, setRoles] = useState<RoleScenario[]>(INITIAL_ROLES);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const currentRole = roles[selectedIdx];

  // Current wage gap calculation
  const salaryDiff = currentRole.maleSalary - currentRole.femaleSalary;
  const gapPercentage = ((salaryDiff / currentRole.maleSalary) * 100).toFixed(1);

  const updateFemaleSalary = (newSalary: number) => {
    setRoles((prev) =>
      prev.map((r, i) => (i === selectedIdx ? { ...r, femaleSalary: newSalary } : r))
    );
  };

  const updateFemalePromotion = (newRate: number) => {
    setRoles((prev) =>
      prev.map((r, i) => (i === selectedIdx ? { ...r, femalePromotionRate: newRate } : r))
    );
  };

  const isRoleEquitable = Math.abs(salaryDiff) <= 500 && Math.abs(currentRole.malePromotionRate - currentRole.femalePromotionRate) <= 5;

  const triggerCelebration = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-800">
            <Briefcase className="w-4 h-4" /> Nivel Juvenil (14+ años) • Justicia Laboral y Brecha Salarial
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
            💼 A Igual Trabajo, Igual Salario
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Simulador de auditoría salarial y corporativa. Ajusta los controles para erradicar la brecha sin comprometer presupuestos.
          </p>
        </div>
        <button
          onClick={() => setRoles(INITIAL_ROLES)}
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
            onClick={() => setSelectedIdx(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedIdx === idx
                ? "bg-violet-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {r.position}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
        {/* Sliders & Audit adjustment */}
        <div className="md:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Puesto Auditado: {currentRole.department}
            </span>
            <p className="text-xs text-slate-600 mt-1">
              {currentRole.responsibilities}
            </p>
          </div>

          {/* Female Salary Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="salary-slider" className="text-xs font-bold text-slate-800">
                Ajuste Salario Femenino:
              </label>
              <span className="text-sm font-black text-violet-700 bg-violet-100 px-3 py-0.5 rounded-lg">
                ${currentRole.femaleSalary.toLocaleString("es-MX")} MXN
              </span>
            </div>
            <input
              id="salary-slider"
              type="range"
              min="20000"
              max="65000"
              step="500"
              value={currentRole.femaleSalary}
              onChange={(e) => updateFemaleSalary(Number(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer h-2 bg-violet-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Salario Masculino (Referencia fija): <strong>${currentRole.maleSalary.toLocaleString("es-MX")} MXN</strong></span>
            </div>
          </div>

          {/* Promotion Access Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="promo-slider" className="text-xs font-bold text-slate-800">
                Tasa de Acceso a Ascensos Femeninos (Romper techo de cristal):
              </label>
              <span className="text-sm font-black text-indigo-700 bg-indigo-100 px-3 py-0.5 rounded-lg">
                {currentRole.femalePromotionRate}%
              </span>
            </div>
            <input
              id="promo-slider"
              type="range"
              min="10"
              max="90"
              value={currentRole.femalePromotionRate}
              onChange={(e) => updateFemalePromotion(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-indigo-200 rounded-lg"
            />
            <span className="text-[11px] text-slate-500">
              Tasa de ascensos masculinos para este puesto: {currentRole.malePromotionRate}%.
            </span>
          </div>

          {/* Quick Equilibrium Action */}
          <button
            onClick={() => {
              updateFemaleSalary(currentRole.maleSalary);
              updateFemalePromotion(currentRole.malePromotionRate);
              triggerCelebration();
            }}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Aplicar Principio Constitucional: Igual Trabajo = Igual Remuneración
          </button>
        </div>

        {/* Audit Status Card */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div className={`p-6 rounded-2xl border-2 transition-all ${isRoleEquitable ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Auditoría Salarial
              </span>
              {isRoleEquitable ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-200 text-emerald-900 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Equitativo
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-200 text-rose-900 flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5" /> Brecha Activa
                </span>
              )}
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-600 block">Diferencia Salarial Mensual:</span>
              <p className={`text-3xl font-black mt-1 ${isRoleEquitable ? "text-emerald-700" : "text-rose-700"}`}>
                {salaryDiff <= 0 ? "$0 MXN (Paridad)" : `-$${salaryDiff.toLocaleString("es-MX")} MXN`}
              </p>
              <span className="text-xs font-semibold text-slate-500 block mt-1">
                Brecha de género en este puesto: <strong>{Number(gapPercentage) > 0 ? `${gapPercentage}% menos para la mujer` : "0% (Sin discriminación)"}</strong>
              </span>
            </div>

            <p className="text-xs text-slate-700 mt-4 leading-relaxed bg-white/70 p-3 rounded-xl border border-slate-200">
              {isRoleEquitable
                ? "¡Certificación de Igualdad Laboral y No Discriminación alcanzada! La empresa remunera según capacidad y responsabilidad, sin sesgos de género."
                : "Se detecta discriminación salarial indirecta. A pesar de contar con el mismo perfil y horas laborales, se remunera con menor salario a la colaboradora."}
            </p>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-950">
              <strong>Marco Legal (Ley Federal del Trabajo, Art. 86):</strong> A trabajo igual, desempeñado en puesto, jornada y condiciones de eficiencia también iguales, debe corresponder salario igual.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
