"use client";

import React, { useState } from "react";
import { Calculator, TrendingUp, Users, DollarSign, Award } from "lucide-react";

export default function ValorInvisible() {
  // Weekly hours devoted by members
  const [womenHours, setWomenHours] = useState<number>(38);
  const [menHours, setMenHours] = useState<number>(14);
  const [hourlyWage, setHourlyWage] = useState<number>(75); // average hourly wage reference in MXN

  // Calculations
  const weeklyTotalHours = womenHours + menHours;
  const femaleShare = weeklyTotalHours > 0 ? ((womenHours / weeklyTotalHours) * 100).toFixed(1) : "0";
  const maleShare = weeklyTotalHours > 0 ? ((menHours / weeklyTotalHours) * 100).toFixed(1) : "0";

  // Monthly and Annual economic value calculation in Mexican Pesos
  const monthlyWomenValue = Math.round(womenHours * 4.33 * hourlyWage);
  const monthlyMenValue = Math.round(menHours * 4.33 * hourlyWage);
  const annualTotalFamilyValue = Math.round((womenHours + menHours) * 52 * hourlyWage);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <Calculator className="w-4 h-4" /> Nivel Intermedio (10-13 años) • Meta ODS 5.4 & INEGI
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
            📊 El Valor Invisible: Economía del Cuidado
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Calculadora interactiva del trabajo doméstico no remunerado y su impacto en la economía y el PIB.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
        {/* Controls Column */}
        <div className="md:col-span-6 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="women-slider" className="text-xs font-bold uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
                👩 Horas Semanales Mujeres (Mamá, Hermanas, Abuela):
              </label>
              <span className="text-base font-black text-pink-700 bg-pink-100 px-3 py-0.5 rounded-lg">
                {womenHours} hrs/sem
              </span>
            </div>
            <input
              id="women-slider"
              type="range"
              min="0"
              max="70"
              value={womenHours}
              onChange={(e) => setWomenHours(Number(e.target.value))}
              className="w-full accent-pink-600 cursor-pointer h-2 bg-pink-200 rounded-lg"
            />
            <span className="text-[11px] text-slate-500">Promedio nacional en México según INEGI: ~39.7 hrs/semana.</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="men-slider" className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                👨 Horas Semanales Varones (Papá, Hermanos, Abuelo):
              </label>
              <span className="text-base font-black text-blue-700 bg-blue-100 px-3 py-0.5 rounded-lg">
                {menHours} hrs/sem
              </span>
            </div>
            <input
              id="men-slider"
              type="range"
              min="0"
              max="70"
              value={menHours}
              onChange={(e) => setMenHours(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-blue-200 rounded-lg"
            />
            <span className="text-[11px] text-slate-500">Promedio nacional en México según INEGI: ~15.2 hrs/semana.</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="wage-slider" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                💵 Salario de referencia por hora (Mercado de servicios):
              </label>
              <span className="text-sm font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg">
                ${hourlyWage} MXN/hr
              </span>
            </div>
            <input
              id="wage-slider"
              type="range"
              min="40"
              max="150"
              step="5"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(Number(e.target.value))}
              className="w-full accent-slate-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Quick preset balance button */}
          <div className="pt-2">
            <button
              onClick={() => {
                setWomenHours(25);
                setMenHours(25);
              }}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              🤝 Simular Corresponsabilidad Equitativa (50% - 50%)
            </button>
          </div>
        </div>

        {/* Results & Economic Visualization */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-4">
          {/* Proportion bar */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Distribución de la jornada no remunerada en casa:
            </h4>
            <div className="w-full h-7 rounded-xl bg-slate-200 overflow-hidden flex font-bold text-xs text-white">
              <div
                style={{ width: `${femaleShare}%` }}
                className="bg-pink-500 flex items-center justify-center transition-all duration-300"
              >
                {Number(femaleShare) > 15 ? `${femaleShare}% 👩` : ""}
              </div>
              <div
                style={{ width: `${maleShare}%` }}
                className="bg-blue-500 flex items-center justify-center transition-all duration-300"
              >
                {Number(maleShare) > 15 ? `${maleShare}% 👨` : ""}
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-600 mt-2 font-medium">
              <span className="text-pink-600 font-bold">Mujeres: {femaleShare}%</span>
              <span className="text-blue-600 font-bold">Hombres: {maleShare}%</span>
            </div>
          </div>

          {/* Money valuation cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200">
              <span className="text-[11px] font-bold uppercase tracking-wide text-pink-700 block">
                Valor mensual aportado por Mujeres:
              </span>
              <p className="text-xl md:text-2xl font-black text-pink-900 mt-1">
                ${monthlyWomenValue.toLocaleString("es-MX")} <span className="text-xs font-normal">MXN</span>
              </p>
              <span className="text-[10px] text-pink-700 mt-1 block">Aporte económico no reconocido</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[11px] font-bold uppercase tracking-wide text-blue-700 block">
                Valor mensual aportado por Hombres:
              </span>
              <p className="text-xl md:text-2xl font-black text-blue-900 mt-1">
                ${monthlyMenValue.toLocaleString("es-MX")} <span className="text-xs font-normal">MXN</span>
              </p>
              <span className="text-[10px] text-blue-700 mt-1 block">Aporte económico varones</span>
            </div>
          </div>

          {/* Macroeconomic Context Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950">
              <p className="font-bold">
                Impacto en el PIB Nacional (INEGI 2025):
              </p>
              <p className="mt-1 leading-relaxed">
                El trabajo de cuidados y doméstico no remunerado equivale al <strong>23.9% del PIB de México</strong>. Más del <strong>72%</strong> es sostenido por mujeres de forma gratuita, limitando sus oportunidades académicas y laborales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
