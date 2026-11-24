"use client";

import React, { useState, useMemo } from "react";
import { Users, Scale, RotateCcw, CheckCircle2, Trophy, Plus, Trash2, Clock, Sparkles } from "lucide-react";
import GameShell, { DifficultyLevel } from "@/components/common/GameShell";
import Button3D from "@/components/common/Button3D";
import {
  DEFAULT_CARE_FAMILY,
  CareFamilyMember,
  calculateCareEconomy,
  INEGI_CARE_GDP_PCT,
  INEGI_FEMALE_SHARE_PCT,
  VALOR_TUTORIAL,
} from "@/content/game6-valor";
import { useSound } from "@/hooks/useSound";

interface GameProps {
  onHome?: () => void;
  onNextGame?: () => void;
}

/** Gráfica circular/dona SVG propia y animada */
function CareDonutChart({ femalePct, malePct }: { femalePct: number; malePct: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const femaleDash = (femalePct / 100) * circumference;

  return (
    <svg viewBox="0 0 150 150" className="w-36 h-36 mx-auto" role="img" aria-label={`Mujeres ${femalePct}%, Hombres ${malePct}%`}>
      <circle cx="75" cy="75" r={radius} fill="none" stroke="#dbeafe" strokeWidth="22" />
      <circle
        cx="75"
        cy="75"
        r={radius}
        fill="none"
        stroke="#ec4899"
        strokeWidth="22"
        strokeDasharray={`${femaleDash} ${circumference}`}
        transform="rotate(-90 75 75)"
        style={{ transition: "stroke-dasharray 0.5s ease-out" }}
      />
      <text x="75" y="71" textAnchor="middle" fontSize="16" fontWeight="900" fill="#0f172a">
        {femalePct}%
      </text>
      <text x="75" y="88" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#64748b">
        Mujeres
      </text>
    </svg>
  );
}

/** Gráfica de barras SVG por categoría */
function CategoryBarsSvg({ cocina, limpieza, cuidados }: { cocina: number; limpieza: number; cuidados: number }) {
  const max = Math.max(1, cocina, limpieza, cuidados);
  const bars = [
    { label: "Cocina", value: cocina, color: "#f97316" },
    { label: "Limpieza", value: limpieza, color: "#14b8a6" },
    { label: "Cuidados", value: cuidados, color: "#6366f1" },
  ];

  return (
    <svg viewBox="0 0 260 110" className="w-full h-28" role="img" aria-label="Horas semanales por categoría">
      {bars.map((b, i) => {
        const y = 12 + i * 33;
        const w = Math.max(6, (b.value / max) * 145);
        return (
          <g key={b.label}>
            <text x="4" y={y + 15} fontSize="11" fontWeight="bold" fill="#334155">
              {b.label}
            </text>
            <rect x="70" y={y + 3} width="145" height="16" rx="8" fill="#f1f5f9" />
            <rect
              x="70"
              y={y + 3}
              width={w}
              height="16"
              rx="8"
              fill={b.color}
              style={{ transition: "width 0.4s ease-out" }}
            />
            <text x="224" y={y + 15} fontSize="11" fontWeight="900" fill="#0f172a">
              {b.value}h
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ValorGameplay({
  difficulty,
  onComplete,
}: {
  difficulty: DifficultyLevel;
  onComplete: (
    stars: 0 | 1 | 2 | 3,
    score: number,
    maxScore: number,
    msg: string,
    extraContent?: React.ReactNode
  ) => void;
}) {
  const { playClick, playPowerup, playCorrect } = useSound();

  const [members, setMembers] = useState<CareFamilyMember[]>(() =>
    difficulty === "facil"
      ? DEFAULT_CARE_FAMILY.slice(0, 3).map((m) => ({ ...m }))
      : DEFAULT_CARE_FAMILY.map((m) => ({ ...m }))
  );
  const [hourlyWage, setHourlyWage] = useState(90);

  const summary = useMemo(
    () => calculateCareEconomy(members, hourlyWage),
    [members, hourlyWage]
  );

  const updateMemberHours = (
    id: string,
    field: keyof Pick<
      CareFamilyMember,
      "trabajoFueraHours" | "estudioHours" | "cocinaHours" | "limpiezaHours" | "cuidadosHours"
    >,
    val: number
  ) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: val } : m)));
  };

  const handleAddMember = () => {
    if (members.length >= 5) return;
    playClick();
    const extra: CareFamilyMember =
      members.length === 3
        ? { ...DEFAULT_CARE_FAMILY[3] }
        : { ...DEFAULT_CARE_FAMILY[4] };
    setMembers((prev) => [...prev, extra]);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 2) return;
    playClick();
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAutoBalance = () => {
    playPowerup();
    const n = members.length;
    const eachCocina = Math.round(summary.cocinaTotal / n);
    const eachLimpieza = Math.round(summary.limpiezaTotal / n);
    const eachCuidados = Math.round(summary.cuidadosTotal / n);
    setMembers((prev) =>
      prev.map((m) => ({
        ...m,
        cocinaHours: eachCocina,
        limpiezaHours: eachLimpieza,
        cuidadosHours: eachCuidados,
      }))
    );
  };

  const handleFinish = () => {
    playCorrect();
    const stars: 0 | 1 | 2 | 3 = summary.isEquitable
      ? 3
      : Math.abs(summary.femaleCareSharePct - 50) <= 15
      ? 2
      : 1;
    const score = summary.isEquitable ? 300 : 180;

    const reviewContent = (
      <div className="space-y-3">
        <div className="border-b border-teal-200 pb-2">
          <h4 className="font-black text-sm text-teal-950 flex items-center gap-1.5">
            <span>📊</span> Balance Económico y Distribución del Tiempo
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Métricas clave alcanzadas en este modelo familiar:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-teal-50/80 border border-teal-200 p-3 rounded-2xl">
            <span className="font-bold text-slate-600 block">Valor económico mensual:</span>
            <span className="text-lg font-black text-teal-950">
              ${summary.monthlyTotalMxn.toLocaleString("es-MX")} MXN
            </span>
          </div>
          <div className="bg-pink-50/80 border border-pink-200 p-3 rounded-2xl">
            <span className="font-bold text-slate-600 block">Distribución del cuidado:</span>
            <span className="text-lg font-black text-pink-900">
              {summary.femaleCareSharePct}% Mujeres / {summary.maleCareSharePct}% Hombres
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
          💡 <strong>Reflexión pedagógica:</strong> Al repartir las horas de cocina, aseo y cuidados teniendo en cuenta el empleo y los estudios de cada persona, se elimina la doble jornada injusta y toda la familia gana tiempo para descansar y convivir.
        </p>
      </div>
    );

    onComplete(
      stars,
      score,
      300,
      `El trabajo del hogar en esta familia equivale a $${summary.monthlyTotalMxn.toLocaleString("es-MX")} MXN al mes (${summary.femaleCareSharePct}% mujeres / ${summary.maleCareSharePct}% hombres).`,
      reviewContent
    );
  };

  return (
    <div className="bg-white rounded-4xl border-2 border-teal-200 shadow-xl p-5 sm:p-8 space-y-6">
      {/* Encabezado sin citas académicas visuales */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-blue-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-teal-300">
            Economía del Cuidado y Uso del Tiempo
          </span>
          <p className="text-sm sm:text-base font-bold">
            El trabajo doméstico y de cuidados no remunerado representa el{" "}
            <strong className="text-amber-300">{INEGI_CARE_GDP_PCT}% del PIB nacional</strong>, y más del{" "}
            <strong className="text-pink-300">{INEGI_FEMALE_SHARE_PCT}%</strong> recae en mujeres.
          </p>
        </div>
        <div className="text-center bg-white/10 px-4 py-2 rounded-2xl border border-white/20 shrink-0">
          <span className="text-2xl font-black text-amber-300 block">{INEGI_CARE_GDP_PCT}% PIB</span>
          <span className="text-[10px] text-slate-200">Impacto Nacional</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Panel Izquierdo: Integrantes con Empleo/Estudio y Labores del Hogar */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-600" />
              Familia ({members.length}/5 integrantes) · Empleo, Estudio y Hogar:
            </h3>
            <div className="flex gap-2">
              {members.length < 5 && (
                <button
                  onClick={handleAddMember}
                  className="min-h-[36px] px-2.5 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar integrante
                </button>
              )}
              <button
                onClick={() => {
                  playClick();
                  setMembers(DEFAULT_CARE_FAMILY.slice(0, members.length).map((m) => ({ ...m })));
                }}
                className="min-h-[36px] px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {members.map((m) => {
            const careTotal = m.cocinaHours + m.limpiezaHours + m.cuidadosHours;
            const outsideTotal = m.trabajoFueraHours + m.estudioHours;
            const totalOccupied = careTotal + outsideTotal;
            // 112h activas a la semana (descontando 8h de sueño diario = 56h)
            const freeHours = Math.max(0, 112 - totalOccupied);

            return (
              <div key={m.id} className="p-4 rounded-3xl border-2 border-slate-200 bg-slate-50/70 space-y-3 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{m.avatar}</span>
                    <div>
                      <p className="text-sm font-black text-slate-900">{m.name}</p>
                      <p className="text-[11px] font-semibold text-slate-500">{m.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                        m.gender === "female"
                          ? "bg-pink-100 text-pink-900"
                          : "bg-blue-100 text-blue-900"
                      }`}
                    >
                      Hogar: {careTotal}h | Total ocupado: {totalOccupied}h
                    </span>
                    {members.length > 2 && (
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        className="min-w-[36px] min-h-[36px] p-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 inline-flex items-center justify-center"
                        aria-label={`Quitar a ${m.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Fila 1: Trabajo remunerado fuera de casa y/o Estudio */}
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="block">
                    <span className="font-bold text-slate-700 flex justify-between">
                      <span>💼 Empleo fuera de casa</span>
                      <span className="text-blue-700 font-black">{m.trabajoFueraHours}h/sem</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={1}
                      value={m.trabajoFueraHours}
                      onChange={(e) => updateMemberHours(m.id, "trabajoFueraHours", Number(e.target.value))}
                      className="w-full accent-blue-600 h-2 mt-1"
                    />
                  </label>

                  <label className="block">
                    <span className="font-bold text-slate-700 flex justify-between">
                      <span>📚 Escuela y Estudio</span>
                      <span className="text-indigo-700 font-black">{m.estudioHours}h/sem</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={45}
                      step={1}
                      value={m.estudioHours}
                      onChange={(e) => updateMemberHours(m.id, "estudioHours", Number(e.target.value))}
                      className="w-full accent-indigo-600 h-2 mt-1"
                    />
                  </label>
                </div>

                {/* Fila 2: Labores domésticas y de cuidados */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <label className="block">
                    <span className="font-bold text-slate-700 flex justify-between">
                      <span>🍳 Cocina</span>
                      <span className="text-orange-600 font-black">{m.cocinaHours}h</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      step={1}
                      value={m.cocinaHours}
                      onChange={(e) => updateMemberHours(m.id, "cocinaHours", Number(e.target.value))}
                      className="w-full accent-orange-500 h-2 mt-1"
                    />
                  </label>

                  <label className="block">
                    <span className="font-bold text-slate-700 flex justify-between">
                      <span>🧹 Limpieza</span>
                      <span className="text-teal-600 font-black">{m.limpiezaHours}h</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      step={1}
                      value={m.limpiezaHours}
                      onChange={(e) => updateMemberHours(m.id, "limpiezaHours", Number(e.target.value))}
                      className="w-full accent-teal-600 h-2 mt-1"
                    />
                  </label>

                  <label className="block">
                    <span className="font-bold text-slate-700 flex justify-between">
                      <span>👶 Cuidados</span>
                      <span className="text-violet-600 font-black">{m.cuidadosHours}h</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      step={1}
                      value={m.cuidadosHours}
                      onChange={(e) => updateMemberHours(m.id, "cuidadosHours", Number(e.target.value))}
                      className="w-full accent-violet-600 h-2 mt-1"
                    />
                  </label>
                </div>

                {/* Indicador de tiempo libre restante */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-200">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-600" /> Tiempo libre y descanso restante:
                  </span>
                  <span className={freeHours < 25 ? "text-rose-600 font-black" : "text-emerald-700 font-black"}>
                    {freeHours} hrs/semana {freeHours < 25 ? "(¡Sobrecarga!)" : "(Saludable)"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Panel Derecho: Gráficas SVG y Valor Monetario */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl border-2 border-teal-200 bg-gradient-to-b from-teal-50/60 to-white space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-teal-950 text-center">
              Distribución del Trabajo del Hogar
            </h3>
            <CareDonutChart femalePct={summary.femaleCareSharePct} malePct={summary.maleCareSharePct} />

            <div className="space-y-2">
              <span className="text-xs font-black text-slate-700 block">Horas por Tipo de Cuidado:</span>
              <CategoryBarsSvg
                cocina={summary.cocinaTotal}
                limpieza={summary.limpiezaTotal}
                cuidados={summary.cuidadosTotal}
              />
            </div>

            {/* Valor económico mensual */}
            <div className="p-4 rounded-2xl bg-white border border-teal-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Salario hora de referencia:</span>
                <span className="text-xs font-black text-teal-700">${hourlyWage} MXN/hr</span>
              </div>
              <input
                type="range"
                min={60}
                max={180}
                step={5}
                value={hourlyWage}
                onChange={(e) => setHourlyWage(Number(e.target.value))}
                className="w-full accent-teal-600 h-2"
                aria-label="Salario hora de referencia"
              />

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase text-slate-500 block">
                    Valor mensual familiar
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    ${summary.monthlyTotalMxn.toLocaleString("es-MX")}
                  </span>
                  <span className="text-xs text-slate-500 block">MXN al mes</span>
                </div>
                <div className="text-right text-xs">
                  <span className="block text-pink-700 font-bold">
                    Mujeres: ${summary.monthlyFemaleMxn.toLocaleString("es-MX")}
                  </span>
                  <span className="block text-blue-700 font-bold">
                    Hombres: ${summary.monthlyMaleMxn.toLocaleString("es-MX")}
                  </span>
                </div>
              </div>
            </div>

            {/* Estado de equidad */}
            <div
              className={`p-3.5 rounded-2xl border-2 flex items-start gap-2.5 text-xs font-bold leading-relaxed ${
                summary.isEquitable
                  ? "bg-emerald-50 border-emerald-400 text-emerald-950"
                  : "bg-amber-50 border-amber-300 text-amber-950"
              }`}
            >
              {summary.isEquitable ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <Scale className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <span>
                {summary.isEquitable
                  ? "¡Equilibrio alcanzado! El trabajo no remunerado del hogar está distribuido equitativamente (cerca del 50/50)."
                  : `Desbalance activo: las mujeres cargan con el ${summary.femaleCareSharePct}% del hogar. Redistribuye las horas.`}
              </span>
            </div>

            <div className="space-y-2">
              <Button3D variant="secondary" size="sm" fullWidth onClick={handleAutoBalance} icon={<Sparkles className="w-4 h-4" />}>
                Repartir Cuidados Equitativamente
              </Button3D>
              <Button3D
                variant="intermedio"
                size="md"
                fullWidth
                onClick={handleFinish}
                icon={<Trophy className="w-4 h-4" />}
              >
                Registrar Diagnóstico Económico
              </Button3D>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ValorInvisible({ onHome, onNextGame }: GameProps) {
  return (
    <GameShell
      gameId="valor"
      tutorialSteps={VALOR_TUTORIAL}
      difficulties={[
        { id: "facil", label: "Familia de 3 integrantes", subtitle: "Nivel inicial: mamá, papá e hija", emoji: "🌱" },
        { id: "normal", label: "Familia de 5 integrantes", subtitle: "Incluye abuela e hijo pequeño", emoji: "🏠" },
        { id: "reto", label: "Modo Experto/a: Doble Jornada", subtitle: "Nivela empleo, estudio y cuidados", emoji: "📊" },
      ]}
      onHome={onHome}
      onNextGame={onNextGame}
    >
      {({ difficulty, finishGame }) => (
        <ValorGameplay difficulty={difficulty} onComplete={finishGame} />
      )}
    </GameShell>
  );
}
