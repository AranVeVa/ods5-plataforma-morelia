"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  Star,
  CheckCircle2,
  Play,
  GraduationCap,
  MapPin,
  PhoneCall,
  Lock,
  Users,
  Trophy,
} from "lucide-react";

import TopBar from "@/components/common/TopBar";
import BrandLogo from "@/components/common/BrandLogo";
import Mascot, { MascotExpression } from "@/components/common/Mascot";
import Button3D from "@/components/common/Button3D";
import GameIllustration from "@/components/common/GameIllustrations";
import { GAMES_CATALOG, WORLD_THEMES, LevelKey, getNextGameId } from "@/content/games-meta";
import { GameId, useProgress } from "@/context/ProgressContext";
import { useSound } from "@/hooks/useSound";

// Code-splitting por juego (carga ligera para dispositivos de gama baja y 3G)
const GameLoadingFallback = () => (
  <div className="min-h-[380px] flex flex-col items-center justify-center gap-3 bg-white rounded-4xl border-2 border-slate-200 p-8">
    <div className="spinner" aria-hidden="true" />
    <p className="text-sm font-bold text-slate-600">Preparando aventura educativa...</p>
  </div>
);

const SemaforoContacto = dynamic(() => import("@/components/games/SemaforoContacto"), {
  loading: GameLoadingFallback,
  ssr: false,
});
const BalanzaDelTiempo = dynamic(() => import("@/components/games/BalanzaDelTiempo"), {
  loading: GameLoadingFallback,
  ssr: false,
});
const MemoramaLideres = dynamic(() => import("@/components/games/MemoramaLideres"), {
  loading: GameLoadingFallback,
  ssr: false,
});
const MuroDeLosMitos = dynamic(() => import("@/components/games/MuroDeLosMitos"), {
  loading: GameLoadingFallback,
  ssr: false,
});
const EscudoEmocional = dynamic(() => import("@/components/games/EscudoEmocional"), {
  loading: GameLoadingFallback,
  ssr: false,
});
const ValorInvisible = dynamic(() => import("@/components/games/ValorInvisible"), {
  loading: GameLoadingFallback,
  ssr: false,
});
const IgualSalario = dynamic(() => import("@/components/games/IgualSalario"), {
  loading: GameLoadingFallback,
  ssr: false,
});
const CirculoConfianza = dynamic(() => import("@/components/games/CirculoConfianza"), {
  loading: GameLoadingFallback,
  ssr: false,
});

export default function Home() {
  const { selectedAgeGroup, setSelectedAgeGroup, progress, getGroupProgress } = useProgress();
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  const [axoExpr, setAxoExpr] = useState<MascotExpression>("happy");

  const { playClick, playCelebration } = useSound();

  const groupSummary = getGroupProgress(selectedAgeGroup);

  const handleSelectAge = (level: LevelKey | "todos") => {
    playCelebration();
    setSelectedAgeGroup(level);
    setAxoExpr("celebrating");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenGame = (id: GameId) => {
    playClick();
    setActiveGameId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = () => {
    playClick();
    setActiveGameId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Si hay un juego activo en pantalla completa dentro del portal
  if (activeGameId) {
    const nextId = getNextGameId(activeGameId);
    const commonProps = {
      onHome: handleGoHome,
      onNextGame: nextId ? () => handleOpenGame(nextId) : undefined,
    };

    return (
      <div className="min-h-screen flex flex-col">
        <TopBar
          onGoHome={handleGoHome}
          showHomeButton
          onOpenAgeSelector={() => setSelectedAgeGroup(null)}
        />
        <main id="main-content" tabIndex={-1} className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-5 py-6 outline-none">
          {activeGameId === "semaforo" && <SemaforoContacto {...commonProps} />}
          {activeGameId === "balanza" && <BalanzaDelTiempo {...commonProps} />}
          {activeGameId === "memorama" && <MemoramaLideres {...commonProps} />}
          {activeGameId === "muro" && <MuroDeLosMitos {...commonProps} />}
          {activeGameId === "escudo" && <EscudoEmocional {...commonProps} />}
          {activeGameId === "valor" && <ValorInvisible {...commonProps} />}
          {activeGameId === "salario" && <IgualSalario {...commonProps} />}
          {activeGameId === "circulo" && <CirculoConfianza {...commonProps} />}
        </main>
      </div>
    );
  }

  // 1. PANTALLA INICIAL DE SELECCIÓN DE EDAD (Si aún no se ha elegido rango)
  if (selectedAgeGroup === null) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-sky-50 to-purple-50">
        <TopBar />

        <main id="main-content" tabIndex={-1} className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center space-y-8 animate-fadeIn outline-none">
          {/* Bienvenida de Axo */}
          <div className="flex flex-col items-center text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Morelia, Michoacán · Metas 5.2 y 5.4 ONU</span>
            </div>
            <div className="relative flex justify-center my-2">
              <Mascot expression="celebrating" size={120} animate={true} />
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900 tracking-tight">
              ¡Hola! ¿Cuántos años tienes?
            </h1>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl mx-auto font-medium">
              Elige tu rango de edad para vivir aventuras a tu medida. No guardamos tus datos personales y tu progreso se adaptará a tu nivel:
            </p>
          </div>

          {/* 3 Tarjetas de Selección por Rango de Edad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
            {/* Opción 1: Infantil */}
            <button
              onClick={() => handleSelectAge("infantil")}
              className="group text-left p-6 sm:p-7 rounded-4xl border-3 border-emerald-300 bg-gradient-to-br from-white via-emerald-50/60 to-emerald-100/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between gap-4 cursor-pointer focus-visible:ring-4 focus-visible:ring-emerald-400"
            >
              <div className="space-y-3">
                <span className="text-4xl block group-hover:scale-110 transition-transform">🌱</span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 inline-block">
                  6 a 9 años · Infantil
                </span>
                <h2 className="text-xl font-display font-black text-slate-900">
                  Mundo 1 · Valle del Respeto
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  3 misiones alegres: límites corporales (decir ¡NO!), balanza justa del hogar y memorama de mujeres pioneras.
                </p>
              </div>
              <div className="pt-3 border-t border-emerald-200 flex items-center justify-between text-xs font-black text-emerald-800">
                <span>3 misiones · 9 estrellas max</span>
                <span className="group-hover:translate-x-1 transition-transform">Entrar →</span>
              </div>
            </button>

            {/* Opción 2: Intermedio */}
            <button
              onClick={() => handleSelectAge("intermedio")}
              className="group text-left p-6 sm:p-7 rounded-4xl border-3 border-blue-300 bg-gradient-to-br from-white via-blue-50/60 to-cyan-100/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between gap-4 cursor-pointer focus-visible:ring-4 focus-visible:ring-blue-400"
            >
              <div className="space-y-3">
                <span className="text-4xl block group-hover:scale-110 transition-transform">⚡</span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 inline-block">
                  10 a 13 años · Intermedio
                </span>
                <h2 className="text-xl font-display font-black text-slate-900">
                  Mundo 2 · Ciudad Equidad
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  3 desafíos arcade: demoledor de mitos, escudo emocional automático y simulador de la economía del cuidado.
                </p>
              </div>
              <div className="pt-3 border-t border-blue-200 flex items-center justify-between text-xs font-black text-blue-800">
                <span>3 misiones · 9 estrellas max</span>
                <span className="group-hover:translate-x-1 transition-transform">Entrar →</span>
              </div>
            </button>

            {/* Opción 3: Juvenil */}
            <button
              onClick={() => handleSelectAge("juvenil")}
              className="group text-left p-6 sm:p-7 rounded-4xl border-3 border-violet-300 bg-gradient-to-br from-white via-violet-50/60 to-purple-100/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between gap-4 cursor-pointer focus-visible:ring-4 focus-visible:ring-violet-400"
            >
              <div className="space-y-3">
                <span className="text-4xl block group-hover:scale-110 transition-transform">🚀</span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-violet-100 text-violet-900 border border-violet-300 inline-block">
                  14+ años · Juvenil
                </span>
                <h2 className="text-xl font-display font-black text-slate-900">
                  Mundo 3 · Cumbre Justicia
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  2 experiencias avanzadas: auditoría de igualdad salarial (Art. 86 LFT) y novela gráfica interactiva de confianza.
                </p>
              </div>
              <div className="pt-3 border-t border-violet-200 flex items-center justify-between text-xs font-black text-violet-800">
                <span>2 misiones · 6 estrellas max</span>
                <span className="group-hover:translate-x-1 transition-transform">Entrar →</span>
              </div>
            </button>
          </div>

          {/* Opción Modo Libre / Docente */}
          <div className="pt-2 text-center">
            <button
              onClick={() => handleSelectAge("todos")}
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-700 underline inline-flex items-center gap-1.5 min-h-[44px]"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              ¿Quieres explorar todos los mundos a la vez? Modo Libre / Docente (8 misiones)
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 2. DASHBOARD DEL MUNDO SEGÚN EL RANGO DE EDAD SELECCIONADO
  const activeLevels: LevelKey[] =
    selectedAgeGroup === "todos"
      ? (["infantil", "intermedio", "juvenil"] as LevelKey[])
      : [selectedAgeGroup];

  const axoSpeech =
    selectedAgeGroup === "infantil"
      ? "¡Bienvenida/o al Valle del Respeto! Aquí aprenderás que tu cuerpo te pertenece y que en casa colaboramos en equipo."
      : selectedAgeGroup === "intermedio"
      ? "¡Hola! En Ciudad Equidad derrumbarás mitos machistas y protegerás tu bienestar emocional."
      : selectedAgeGroup === "juvenil"
      ? "¡Excelente! En Cumbre Justicia auditarás derechos laborales y construirás círculos de confianza seguros."
      : "¡Modo Libre! Puedes explorar cualquiera de los 3 mundos y 8 estaciones a tu gusto.";

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar onOpenAgeSelector={() => setSelectedAgeGroup(null)} />

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-8 outline-none">
        {/* HERO CON MASCOTA AXO + PROGRESO ADAPTADO AL NIVEL DE EDAD */}
        <section
          aria-label="Bienvenida a tu nivel de aventura"
          className="relative overflow-hidden rounded-4xl border-2 border-indigo-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50/50 p-6 sm:p-8 shadow-lg"
        >
          <div className="relative grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-6 items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black">
                  <MapPin className="w-3.5 h-3.5" /> Morelia, Michoacán · ODS 5
                </span>
                <button
                  onClick={() => {
                    playClick();
                    setSelectedAgeGroup(null);
                  }}
                  className="px-3 py-1 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-300 text-xs font-black inline-flex items-center gap-1 transition-colors"
                >
                  <Users className="w-3 h-3" />
                  <span>
                    Nivel: {selectedAgeGroup === "infantil" ? "6–9 años" : selectedAgeGroup === "intermedio" ? "10–13 años" : selectedAgeGroup === "juvenil" ? "14+ años" : "Todos"}
                  </span>
                  <span className="underline ml-0.5">(Cambiar)</span>
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-tight">
                {selectedAgeGroup === "infantil"
                  ? "Valle del Respeto (6–9 años)"
                  : selectedAgeGroup === "intermedio"
                  ? "Ciudad Equidad (10–13 años)"
                  : selectedAgeGroup === "juvenil"
                  ? "Cumbre Justicia (14+ años)"
                  : "Mapa Completo de Aventura ODS 5"}
              </h1>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl font-medium">
                {selectedAgeGroup === "infantil"
                  ? "Completa las 3 misiones de tu nivel para aprender sobre autocuidado corporal, labores compartidas y científicas admirables."
                  : selectedAgeGroup === "intermedio"
                  ? "3 desafíos interactivos para derribar mitos, expresar emociones sanas y conocer el valor del trabajo en casa."
                  : selectedAgeGroup === "juvenil"
                  ? "2 simulaciones avanzadas sobre derechos salariales, igualdad en el empleo y prevención de la violencia digital."
                  : "8 minijuegos interactivos de equidad de género diseñados con Privacy by Design y accesibilidad."}
              </p>

              {/* Barra de progreso exclusiva para su grupo de edad */}
              <div className="bg-white/95 border border-slate-200 rounded-3xl p-4 max-w-xl shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" /> Progreso de tu Nivel
                  </span>
                  <span className="text-amber-700">
                    {groupSummary.completedGames}/{groupSummary.totalGames} misiones · {groupSummary.totalStars}/{groupSummary.maxStars} ⭐ ({groupSummary.percent}%)
                  </span>
                </div>
                <div
                  className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200"
                  role="progressbar"
                  aria-label="Progreso de tu nivel"
                  aria-valuenow={groupSummary.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-600 transition-all duration-500"
                    style={{ width: `${groupSummary.percent}%` }}
                  />
                </div>
                {groupSummary.isAllCompleted && (
                  <p className="text-xs font-black text-emerald-700 pt-1 flex items-center gap-1">
                    <span>🎉</span> ¡Completaste al 100% las misiones de tu nivel! ¡Felicidades!
                  </p>
                )}
              </div>
            </div>

            {/* Mascota Axo interactiva */}
            <div className="flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  playCelebration();
                  setAxoExpr((prev) => (prev === "celebrating" ? "happy" : "celebrating"));
                }}
                className="group relative bg-white/90 hover:bg-white rounded-4xl p-5 border-2 border-pink-200 shadow-md transition-all focus-visible:ring-4"
                aria-label="Saludar a Axo, la mascota ajolote"
              >
                <Mascot expression={axoExpr} size={135} />
                <span className="block text-[11px] font-black text-pink-700 mt-1">
                  Toca a Axo para animarlo ✨
                </span>
              </button>

              <div className="mt-3 bg-white border-2 border-indigo-200 rounded-2xl p-3.5 shadow-sm max-w-sm relative">
                <p className="text-xs sm:text-sm font-bold text-slate-800 text-center leading-snug">
                  &ldquo;{axoSpeech}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MUNDOS Y ESTACIONES FILTRADOS POR RANGO DE EDAD */}
        <section aria-label="Misiones disponibles para tu edad" className="space-y-8">
          {activeLevels.map((levelKey) => {
            const world = WORLD_THEMES[levelKey];
            const worldGames = GAMES_CATALOG.filter((g) => g.levelKey === levelKey);

            return (
              <div
                id={`world-${levelKey}`}
                key={levelKey}
                className={`rounded-4xl border-2 ${world.borderClass} bg-gradient-to-br ${world.gradientClass} p-5 sm:p-7 shadow-md`}
              >
                {/* Encabezado del Mundo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-900/10">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border ${world.pillClass}`}>
                        {world.ageRange}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {worldGames.length} misiones
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900">
                      {world.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl font-medium">
                      {world.description}
                    </p>
                  </div>

                  {/* Nodos de progreso de estaciones */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-white/80 px-3 sm:px-4 py-2 rounded-2xl border border-white shadow-xs shrink-0">
                    {worldGames.map((g, idx) => {
                      const gStars = progress[g.id]?.stars ?? 0;
                      return (
                        <React.Fragment key={g.id}>
                          <button
                            onClick={() => handleOpenGame(g.id)}
                            title={`${g.shortTitle} (${gStars}/3 estrellas)`}
                            aria-label={`Ir a ${g.shortTitle}`}
                            className={`w-11 h-11 rounded-full font-black text-xs flex flex-col items-center justify-center border-2 transition-transform hover:scale-110 ${
                              gStars > 0
                                ? "bg-amber-400 border-amber-600 text-amber-950 shadow-sm"
                                : "bg-white border-slate-800 text-slate-900 shadow-xs"
                            }`}
                          >
                            <span>#{g.order}</span>
                            {gStars > 0 && <span className="text-[9px] leading-none">{gStars}★</span>}
                          </button>
                          {idx < worldGames.length - 1 && (
                            <div
                              className="w-6 h-1 rounded-full"
                              style={{ backgroundColor: world.pathStroke, opacity: 0.45 }}
                              aria-hidden="true"
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Tarjetas de estaciones de juego */}
                <div
                  className={`grid grid-cols-1 ${
                    worldGames.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
                  } gap-4`}
                >
                  {worldGames.map((game) => {
                    const stars = progress[game.id]?.stars ?? 0;

                    return (
                      <article
                        key={game.id}
                        className="game-card bg-white/95 border-2 border-white p-5 flex flex-col justify-between gap-4 rounded-3xl shadow-sm"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 shrink-0">
                              <GameIllustration gameId={game.id} className="w-14 h-14" />
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {game.odsTarget}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                                <Clock className="w-3 h-3" /> {game.duration} · {game.difficultyLabel}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-display font-black text-slate-900">
                              {game.title}
                            </h3>
                            <p className="text-xs font-bold text-indigo-700 mb-1">{game.badge}</p>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                              {game.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1" aria-label={`${stars} de 3 estrellas`}>
                            {[1, 2, 3].map((n) => (
                              <Star
                                key={n}
                                className={`w-4 h-4 ${
                                  n <= stars
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-slate-300"
                                }`}
                              />
                            ))}
                            <span className="text-[11px] font-bold text-slate-500 ml-1">
                              {stars > 0 ? "Completado" : "Disponible"}
                            </span>
                          </div>

                          <Button3D
                            variant={levelKey}
                            size="sm"
                            onClick={() => handleOpenGame(game.id)}
                            icon={<Play className="w-3.5 h-3.5 fill-current" />}
                          >
                            {stars > 0 ? "Rejugar" : "Jugar"}
                          </Button3D>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        {/* ACCESOS RÁPIDOS: PRIVACY BY DESIGN Y GUÍA DOCENTE */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs space-y-2">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" /> Privacy by Design (Cero Datos)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Sin registro, sin cookies ni analíticas. El progreso vive en la memoria de tu navegador salvo que elijas guardarlo en este dispositivo.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs space-y-2">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Green IT & WCAG 2.1 AA
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Gráficos SVG nativos y Web Audio API sintetizado para carga rápida en redes escolares 3G y teléfonos de gama básica.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl p-5 border-2 border-indigo-200 shadow-xs flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <h3 className="font-black text-indigo-950 text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-700" /> Guía para Docentes y Familias
              </h3>
              <p className="text-xs text-indigo-900/80 leading-relaxed font-medium">
                Consulta los objetivos pedagógicos, dinámicas grupales para el aula y versión imprimible.
              </p>
            </div>
            <Link
              href="/docentes"
              onClick={() => playClick()}
              className="min-h-[44px] px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black inline-flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> Abrir Panel Docente
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-8 text-center text-xs text-slate-700">
        <div className="max-w-6xl mx-auto px-4 space-y-2 flex flex-col items-center">
          <BrandLogo size={32} showText={true} compact={true} />
          <p className="font-medium text-slate-700">
            Tecnología Cívica y Educación Socioemocional • Privacy by Design • Código abierto para escuelas de Morelia, Michoacán
          </p>
          <p className="text-[11px] text-slate-600 font-semibold flex items-center justify-center gap-1">
            <PhoneCall className="w-3 h-3 text-rose-600" aria-hidden="true" /> Ante cualquier emergencia, utiliza el botón rojo &ldquo;Necesito ayuda&rdquo; en la barra superior.
          </p>
        </div>
      </footer>
    </div>
  );
}
