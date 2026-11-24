"use client";

import React, { useState, useMemo } from "react";
import { Briefcase, TrendingUp, CheckCircle2, AlertTriangle, RotateCcw, Sparkles, Trophy, HelpCircle } from "lucide-react";
import GameShell, { DifficultyLevel } from "@/components/common/GameShell";
import Button3D from "@/components/common/Button3D";
import {
  INITIAL_SALARY_SECTORS,
  WORKPLACE_EVENTS,
  SalarySectorRole,
  calculateSalaryAudit,
  SALARIO_TUTORIAL,
} from "@/content/game7-salario";
import { useSound } from "@/hooks/useSound";

interface GameProps {
  onHome?: () => void;
  onNextGame?: () => void;
}

/** Pirámide visual "Techo de Cristal" en SVG */
function GlassCeilingPyramidSvg({ femalePromoRate }: { femalePromoRate: number }) {
  const execPct = Math.round(femalePromoRate * 0.65);
  return (
    <svg viewBox="0 0 260 175" className="w-full max-w-xs mx-auto" role="img" aria-label={`Pirámide jerárquica: ${execPct}% de mujeres en dirección`}>
      {/* Nivel 3: Base operativa */}
      <polygon points="15,160 245,160 212,115 48,115" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" />
      <text x="130" y="142" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#4c1d95">
        Base Operativa (50% mujeres)
      </text>

      {/* Nivel 2: Gerencias */}
      <polygon points="52,110 208,110 178,66 82,66" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="2" />
      <text x="130" y="92" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#4c1d95">
        Gerencias ({Math.round(femalePromoRate * 0.85)}%)
      </text>

      {/* Línea Techo de Cristal */}
      <line
        x1="60"
        y1="63"
        x2="200"
        y2="63"
        stroke={femalePromoRate >= 60 ? "#10b981" : "#e11d48"}
        strokeWidth="3.5"
        strokeDasharray={femalePromoRate >= 60 ? "0" : "6 4"}
      />
      <text
        x="130"
        y="57"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="900"
        fill={femalePromoRate >= 60 ? "#047857" : "#be123c"}
      >
        {femalePromoRate >= 60 ? "✓ TECHO DE CRISTAL SUPERADO" : "⚡ TECHO DE CRISTAL"}
      </text>

      {/* Nivel 1: Alta Dirección */}
      <polygon points="86,52 174,52 130,10" fill={femalePromoRate >= 60 ? "#a7f3d0" : "#fae8ff"} stroke={femalePromoRate >= 60 ? "#059669" : "#c026d3"} strokeWidth="2.5" />
      <text x="130" y="40" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e1b4b">
        Dirección ({execPct}%)
      </text>
    </svg>
  );
}

/** Gráfica animada SVG comparando salario Hombre vs Mujer */
function SalaryGapChartSvg({ maleSalary, femaleSalary }: { maleSalary: number; femaleSalary: number }) {
  const maxVal = Math.max(maleSalary, femaleSalary, 65000);
  const maleW = (maleSalary / maxVal) * 190;
  const femaleW = (femaleSalary / maxVal) * 190;

  return (
    <svg viewBox="0 0 320 96" className="w-full h-24" role="img" aria-label="Comparativa salarial mensual">
      {/* Barra Hombre */}
      <text x="6" y="28" fontSize="11" fontWeight="bold" fill="#1e293b">
        Hombre
      </text>
      <rect x="75" y="14" width="190" height="20" rx="6" fill="#f1f5f9" />
      <rect
        x="75"
        y="14"
        width={maleW}
        height="20"
        rx="6"
        fill="#6366f1"
        style={{ transition: "width 0.35s ease-out" }}
      />
      <text x="270" y="28" fontSize="11" fontWeight="900" fill="#312e81">
        ${(maleSalary / 1000).toFixed(1)}k
      </text>

      {/* Barra Mujer */}
      <text x="6" y="66" fontSize="11" fontWeight="bold" fill="#1e293b">
        Mujer
      </text>
      <rect x="75" y="52" width="190" height="20" rx="6" fill="#f1f5f9" />
      <rect
        x="75"
        y="52"
        width={femaleW}
        height="20"
        rx="6"
        fill={femaleSalary >= maleSalary - 500 ? "#10b981" : "#ec4899"}
        style={{ transition: "width 0.35s ease-out" }}
      />
      <text x="270" y="66" fontSize="11" fontWeight="900" fill="#831843">
        ${(femaleSalary / 1000).toFixed(1)}k
      </text>
    </svg>
  );
}

function SalarioGameplay({
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

  const [roles, setRoles] = useState<SalarySectorRole[]>(() =>
    INITIAL_SALARY_SECTORS.map((r) => ({ ...r }))
  );
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [appliedEvents, setAppliedEvents] = useState<string[]>([]);
  const [showGlossary, setShowGlossary] = useState(false);

  const requiredEquitableCount = difficulty === "facil" ? 1 : difficulty === "normal" ? 2 : 4;
  const current = roles[selectedIdx];
  const audit = useMemo(() => calculateSalaryAudit(current), [current]);

  const equitableSectors = roles.filter((r) => calculateSalaryAudit(r).isFullyEquitable).length;

  const updateCurrentRole = (patch: Partial<SalarySectorRole>) => {
    setRoles((prev) => prev.map((r, i) => (i === selectedIdx ? { ...r, ...patch } : r)));
  };

  const handleApplyEvent = (evId: string) => {
    if (appliedEvents.includes(evId)) return;
    const ev = WORKPLACE_EVENTS.find((e) => e.id === evId);
    if (!ev) return;
    playPowerup();
    setAppliedEvents((prev) => [...prev, evId]);
    setRoles((prev) =>
      prev.map((r) => ({
        ...r,
        femaleSalary: Math.min(r.maleSalary, Math.round(r.femaleSalary * (1 + ev.salaryBoostPct / 100))),
        femalePromotionRate: Math.min(r.malePromotionRate, r.femalePromotionRate + ev.promotionBoostPts),
        productivityIndex: Math.min(100, r.productivityIndex + ev.productivityDelta),
      }))
    );
  };

  const handleEqualCurrent = () => {
    playPowerup();
    updateCurrentRole({
      femaleSalary: current.maleSalary,
      femalePromotionRate: current.malePromotionRate,
      productivityIndex: Math.min(100, current.productivityIndex + 4),
    });
  };

  const handleComplete = () => {
    playCorrect();
    const stars: 0 | 1 | 2 | 3 =
      equitableSectors >= requiredEquitableCount
        ? 3
        : equitableSectors >= 1
        ? 2
        : 1;
    const score = equitableSectors * 100 + appliedEvents.length * 50;
    const maxScore = requiredEquitableCount * 100 + 100;

    const reviewContent = (
      <div className="space-y-3">
        <div className="border-b border-violet-200 pb-2">
          <h4 className="font-black text-sm text-violet-950 flex items-center gap-1.5">
            <span>⚖️</span> Dictamen Final de Auditoría Laboral
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Sectores regulados bajo el Artículo 86 de la Ley Federal del Trabajo:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {roles.map((r) => {
            const a = calculateSalaryAudit(r);
            return (
              <div
                key={r.id}
                className={`p-3 rounded-2xl border ${
                  a.isFullyEquitable
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <p className="font-black">{r.sector} · {r.position}</p>
                <p className="text-[11px] mt-1">
                  Salario: ${r.femaleSalary.toLocaleString("es-MX")} (H: ${r.maleSalary.toLocaleString("es-MX")})
                </p>
                <p className="text-[11px]">
                  Promoción directiva: {r.femalePromotionRate}% (H: {r.malePromotionRate}%)
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );

    onComplete(
      stars,
      score,
      maxScore,
      `Auditaste ${equitableSectors} de 4 sectores cumpliendo el Artículo 86 de la Ley Federal del Trabajo y manteniendo la productividad laboral en ${current.productivityIndex}%.`,
      reviewContent
    );
  };

  return (
    <div className="bg-white rounded-4xl border-2 border-violet-200 shadow-xl p-5 sm:p-8 space-y-6">
      {/* Selector de 4 sectores */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap gap-2">
          {roles.map((r, idx) => {
            const done = calculateSalaryAudit(r).isFullyEquitable;
            return (
              <button
                key={r.id}
                onClick={() => {
                  playClick();
                  setSelectedIdx(idx);
                }}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-black border transition-all inline-flex items-center gap-1.5 ${
                  selectedIdx === idx
                    ? "bg-violet-700 text-white border-violet-800 shadow-sm"
                    : done
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{r.sector}</span>
                {done && <span>✓</span>}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGlossary((v) => !v)}
            className="min-h-[44px] px-3 py-1.5 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-900 text-xs font-bold inline-flex items-center gap-1 border border-violet-300"
          >
            <HelpCircle className="w-4 h-4 text-violet-700" />
            <span>{showGlossary ? "Ocultar Explicación" : "¿Qué significan los términos?"}</span>
          </button>
          <button
            onClick={() => {
              playClick();
              setRoles(INITIAL_SALARY_SECTORS.map((r) => ({ ...r })));
              setAppliedEvents([]);
            }}
            className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Explicador de Términos didáctico y amigable para jóvenes */}
      {showGlossary && (
        <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-2 border-violet-200 rounded-3xl p-5 space-y-3 animate-scaleUp">
          <h4 className="text-sm font-black text-violet-950 flex items-center gap-2">
            <span>💡</span> Conceptos Clave Explicados en Lenguaje Claro
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-violet-200 shadow-2xs space-y-1.5">
              <span className="font-black text-violet-800 block text-sm">
                💵 Salario Mensual Femenino vs Masculino:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                Es el sueldo que recibe cada persona al mes por realizar las <strong>mismas funciones, con la misma experiencia y en el mismo horario</strong>. El Artículo 86 de la Ley Federal del Trabajo dice claramente que está prohibido pagarle menos a una mujer por hacer el mismo trabajo.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-violet-200 shadow-2xs space-y-1.5">
              <span className="font-black text-fuchsia-800 block text-sm">
                🪜 Tasa de Promoción Directiva:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                De cada 100 ascensos a puestos de <strong>jefa, gerenta o directora</strong> en la empresa, ¿cuántos se otorgan a mujeres? Si la tasa es del 25%, significa que 75 puestos se los dan a hombres y solo 25 a mujeres. Esta barrera invisible se llama <strong>techo de cristal</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Políticas institucionales */}
      <div className="bg-violet-50 border-2 border-violet-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-violet-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-violet-600" />
            Políticas de Igualdad Laboral (Aplícalas a toda la empresa):
          </p>
          <p className="text-xs text-violet-900/80">
            Objetivo en este nivel: lograr paridad total en {requiredEquitableCount} de 4 sectores (actual: {equitableSectors}/4).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {WORKPLACE_EVENTS.map((ev) => {
            const active = appliedEvents.includes(ev.id);
            return (
              <button
                key={ev.id}
                onClick={() => handleApplyEvent(ev.id)}
                disabled={active}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-black border transition-all ${
                  active
                    ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                    : "bg-white hover:bg-violet-100 text-violet-950 border-violet-300 shadow-xs"
                }`}
              >
                {ev.emoji} {active ? "Aplicada ✓" : ev.title.split("(")[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tablero de Nómina + Pirámide Techo de Cristal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl border-2 border-slate-200 bg-slate-50/70 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-black uppercase text-violet-700">{current.department}</span>
                <h3 className="text-lg sm:text-xl font-display font-black text-slate-900">
                  {current.position}
                </h3>
                <p className="text-xs text-slate-600 mt-1">{current.responsibilities}</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-950 text-xs font-black shrink-0 inline-flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Productividad: {current.productivityIndex}%
              </span>
            </div>

            <SalaryGapChartSvg maleSalary={current.maleSalary} femaleSalary={current.femaleSalary} />

            {/* Sliders con explicaciones claras de los términos */}
            <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
              <label className="block text-xs space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-black text-slate-900 text-xs sm:text-sm">
                    Ajustar Salario Mensual Femenino:
                  </span>
                  <span className="text-violet-700 font-black text-sm sm:text-base">
                    ${current.femaleSalary.toLocaleString("es-MX")} MXN
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Referencia hombre con el mismo cargo: ${current.maleSalary.toLocaleString("es-MX")} MXN. (Ley: deben ganar igual).
                </p>
                <input
                  type="range"
                  min={25000}
                  max={current.maleSalary + 5000}
                  step={500}
                  value={current.femaleSalary}
                  onChange={(e) => updateCurrentRole({ femaleSalary: Number(e.target.value) })}
                  className="w-full accent-violet-600 h-2.5 mt-1 cursor-pointer"
                  aria-label="Ajustar salario mensual femenino"
                />
              </label>

              <label className="block text-xs space-y-1 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-black text-slate-900 text-xs sm:text-sm">
                    Tasa de Promoción Directiva Femenina:
                  </span>
                  <span className="text-fuchsia-700 font-black text-sm sm:text-base">
                    {current.femalePromotionRate}% de ascensos
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Referencia hombre: {current.malePromotionRate}%. % de ascensos a puestos de dirección dados a mujeres.
                </p>
                <input
                  type="range"
                  min={15}
                  max={85}
                  step={5}
                  value={current.femalePromotionRate}
                  onChange={(e) => updateCurrentRole({ femalePromotionRate: Number(e.target.value) })}
                  className="w-full accent-fuchsia-600 h-2.5 mt-1 cursor-pointer"
                  aria-label="Ajustar tasa de promoción directiva femenina"
                />
              </label>
            </div>

            {/* Indicadores legales y pérdida acumulada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-slate-200">
                <span className="text-slate-500 font-bold block">Brecha salarial actual</span>
                <strong className={`text-lg font-black ${audit.isSalaryEqual ? "text-emerald-700" : "text-rose-600"}`}>
                  {audit.gapPct}% (${audit.salaryDiff.toLocaleString("es-MX")}/mes)
                </strong>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200">
                <span className="text-slate-500 font-bold block">Pérdida acumulada en 10 años</span>
                <strong className="text-lg font-black text-slate-900">
                  ${audit.cumulativeLoss10Years.toLocaleString("es-MX")} MXN
                </strong>
              </div>
            </div>

            {/* Contexto del sector en lenguaje reflexivo, sin citas académicas */}
            <p className="text-xs font-semibold text-slate-600 bg-white/80 p-3 rounded-2xl border border-slate-200">
              💡 {current.sectorContext}
            </p>
          </div>
        </div>

        {/* Techo de cristal + Acciones */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl border-2 border-violet-200 bg-gradient-to-b from-violet-50/70 to-white space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-violet-950 text-center">
              Visualización del Techo de Cristal
            </h3>
            <GlassCeilingPyramidSvg femalePromoRate={current.femalePromotionRate} />

            <div
              className={`p-3.5 rounded-2xl border-2 flex items-start gap-2.5 text-xs font-bold leading-relaxed ${
                audit.isFullyEquitable
                  ? "bg-emerald-50 border-emerald-400 text-emerald-950"
                  : "bg-amber-50 border-amber-300 text-amber-950"
              }`}
            >
              {audit.isFullyEquitable ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <span>
                {audit.isFullyEquitable
                  ? "¡Sector regulado conforme al Art. 86 de la Ley Federal del Trabajo! A igual trabajo, igual salario."
                  : `Brecha salarial o techo de cristal activo en ${current.sector}. Iguala salario y tasa de ascenso para corregir.`}
              </span>
            </div>

            <div className="space-y-2">
              {!audit.isFullyEquitable && difficulty !== "reto" && (
                <Button3D variant="secondary" size="sm" fullWidth onClick={handleEqualCurrent}>
                  ⚖️ Igualar Nómina y Ascensos en este Sector
                </Button3D>
              )}
              <Button3D
                variant="juvenil"
                size="md"
                fullWidth
                onClick={handleComplete}
                icon={<Trophy className="w-4 h-4" />}
              >
                Emitir Dictamen de Auditoría ({equitableSectors}/4)
              </Button3D>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IgualSalario({ onHome, onNextGame }: GameProps) {
  return (
    <GameShell
      gameId="salario"
      tutorialSteps={SALARIO_TUTORIAL}
      difficulties={[
        { id: "facil", label: "Auditoría Inicial (1 sector)", subtitle: "Corrige la brecha en un departamento", emoji: "🌱" },
        { id: "normal", label: "Auditoría Parcial (2 sectores)", subtitle: "Combina salarios, ascensos y licencias", emoji: "💼" },
        { id: "reto", label: "Paridad Total (4 sectores)", subtitle: "Elimina brecha y techo de cristal sin atajos", emoji: "⚖️" },
      ]}
      onHome={onHome}
      onNextGame={onNextGame}
    >
      {({ difficulty, finishGame }) => (
        <SalarioGameplay difficulty={difficulty} onComplete={finishGame} />
      )}
    </GameShell>
  );
}
