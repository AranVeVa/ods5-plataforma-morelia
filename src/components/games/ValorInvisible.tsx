"use client";

import React, { useState } from "react";
import { Calculator, TrendingUp, Users, DollarSign, Award, CheckCircle, PieChart, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "@/utils/audio";

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  gender: "female" | "male";
  hours: number;
}

const DEFAULT_FAMILY: FamilyMember[] = [
  { id: "mama", name: "Mamá (Laura)", role: "Madre", gender: "female", hours: 38 },
  { id: "papa", name: "Papá (Carlos)", role: "Padre", gender: "male", hours: 14 },
  { id: "hija", name: "Hija (Ana, 12 años)", role: "Hija", gender: "female", hours: 16 },
  { id: "hijo", name: "Hijo (Diego, 11 años)", role: "Hijo", gender: "male", hours: 4 },
  { id: "abuela", name: "Abuelita (Elena)", role: "Abuela", gender: "female", hours: 22 },
];

export default function ValorInvisible() {
  const [members, setMembers] = useState<FamilyMember[]>(DEFAULT_FAMILY);
  const [hourlyWage, setHourlyWage] = useState<number>(80);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

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

  const balanceAllMembers = () => {
    sound.playPowerup();
    const avg = Math.round(totalHours / members.length);
    setMembers((prev) => prev.map((m) => ({ ...m, hours: avg })));
    sound.playCelebration();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/20 rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Calculator className="w-4 h-4" /> Nivel Intermedio (10-13 años) • INEGI & ODS 5.4
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
            📊 El Valor Invisible: Economía del Cuidado
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Simula las labores de tu hogar y descubre su equivalencia económica según datos oficiales del INEGI.
          </p>
        </div>

        <button
          onClick={balanceAllMembers}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Equilibrar Corresponsabilidad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
        {/* Sliders for family members */}
        <div className="md:col-span-6 space-y-4 bg-white/90 p-5 rounded-3xl border-2 border-slate-200/80 shadow-sm">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span>Integrantes del Hogar:</span>
            <span className="text-[11px] text-slate-500 font-semibold">Horas semanales</span>
          </h4>

          {members.map((m) => (
            <div key={m.id} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">
                  {m.gender === "female" ? "👩" : "👨"} {m.name}
                </span>
                <span
                  className={`font-black px-2.5 py-0.5 rounded-lg text-xs ${
                    m.gender === "female" ? "bg-pink-100 text-pink-800" : "bg-blue-100 text-blue-800"
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
              />
            </div>
          ))}

          {/* Reference Wage */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-slate-700">Salario de referencia por hora:</span>
              <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                ${hourlyWage} MXN/hr
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="160"
              step="5"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(Number(e.target.value))}
              className="w-full accent-slate-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Results and Comparison Chart */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-4">
          {/* Proportion Gauge */}
          <div className="bg-white/90 p-5 rounded-3xl border-2 border-slate-200/80 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
              Distribución de la carga de cuidados:
            </h4>
            <div className="w-full h-8 rounded-2xl bg-slate-200 overflow-hidden flex font-black text-xs text-white">
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
            <div className="flex justify-between text-xs mt-2 font-bold">
              <span className="text-pink-600">Mujeres del hogar: {femalePercentage}%</span>
              <span className="text-blue-600">Varones del hogar: {malePercentage}%</span>
            </div>
          </div>

          {/* Economic Value Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-3xl bg-pink-50 border border-pink-200">
              <span className="text-[10px] font-black uppercase tracking-wide text-pink-700 block">
                Aporte Mensual Mujeres:
              </span>
              <p className="text-xl font-black text-pink-900 mt-1">
                ${monthlyFemaleValue.toLocaleString("es-MX")} <span className="text-[10px]">MXN</span>
              </p>
              <span className="text-[10px] text-pink-600 mt-0.5 block">{totalFemaleHours} horas semanales</span>
            </div>

            <div className="p-4 rounded-3xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-black uppercase tracking-wide text-blue-700 block">
                Aporte Mensual Varones:
              </span>
              <p className="text-xl font-black text-blue-900 mt-1">
                ${monthlyMaleValue.toLocaleString("es-MX")} <span className="text-[10px]">MXN</span>
              </p>
              <span className="text-[10px] text-blue-600 mt-0.5 block">{totalMaleHours} horas semanales</span>
            </div>
          </div>

          {/* Official Benchmark (INEGI) */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                Datos INEGI (Cuenta Satélite del Trabajo No Remunerado):
              </p>
              <p className="mt-0.5 leading-relaxed">
                El trabajo doméstico y de cuidados no remunerado equivale al <strong>23.9% del PIB nacional</strong>. Más del <strong>72%</strong> de ese valor recae en las mujeres.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
