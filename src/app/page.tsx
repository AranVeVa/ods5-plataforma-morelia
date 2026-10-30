"use client";

import React, { useState } from "react";
import {
  Lock,
  Sparkles,
  Gamepad2,
  Volume2,
  VolumeX,
  ChevronRight,
  HeartHandshake,
  FileText,
  ShieldCheck,
  CheckCircle2,
  BookOpen
} from "lucide-react";

import SemaforoContacto from "@/components/games/SemaforoContacto";
import BalanzaDelTiempo from "@/components/games/BalanzaDelTiempo";
import MemoramaLideres from "@/components/games/MemoramaLideres";
import MuroDeLosMitos from "@/components/games/MuroDeLosMitos";
import EscudoEmocional from "@/components/games/EscudoEmocional";
import ValorInvisible from "@/components/games/ValorInvisible";
import IgualSalario from "@/components/games/IgualSalario";
import CirculoConfianza from "@/components/games/CirculoConfianza";
import { sound } from "@/utils/audio";

type GameId =
  | "semaforo"
  | "balanza"
  | "memorama"
  | "muro"
  | "escudo"
  | "valor"
  | "salario"
  | "circulo";

interface GameMeta {
  id: GameId;
  title: string;
  badge: string;
  level: "Infantil (6-9 años)" | "Intermedio (10-13 años)" | "Juvenil (14+ años)";
  levelKey: "infantil" | "intermedio" | "juvenil";
  odsTarget: string;
  description: string;
  icon: string;
  accent: string;
}

const GAMES_LIST: GameMeta[] = [
  // Nivel Infantil (6-9 años)
  {
    id: "semaforo",
    title: "1. Semáforo del Respeto",
    badge: "Límites Corporales y Autocuidado",
    level: "Infantil (6-9 años)",
    levelKey: "infantil",
    odsTarget: "Meta 5.2: Prevención del Abuso",
    description: "Modo Misión y desafío para reconocer zonas de protección personal y límites afectivos sanos.",
    icon: "🚦",
    accent: "border-emerald-300 text-emerald-800 bg-emerald-50",
  },
  {
    id: "balanza",
    title: "2. La Balanza del Tiempo",
    badge: "Corresponsabilidad en el Hogar",
    level: "Infantil (6-9 años)",
    levelKey: "infantil",
    odsTarget: "Meta 5.4: Cuidados y Hogar",
    description: "Distribución equitativa de 12 tareas cotidianas para que niñas y niños tengan descanso y estudio.",
    icon: "⚖️",
    accent: "border-blue-300 text-blue-800 bg-blue-50",
  },
  {
    id: "memorama",
    title: "3. Memorama de Pioneras",
    badge: "Mujeres STEM e Historia",
    level: "Infantil (6-9 años)",
    levelKey: "infantil",
    odsTarget: "Meta 5.5: Participación Plena",
    description: "Tres tamaños de tablero (3x2, 4x3, 4x4) con cápsulas de científicas y líderes michoacanas.",
    icon: "🧠",
    accent: "border-purple-300 text-purple-800 bg-purple-50",
  },

  // Nivel Intermedio (10-13 años)
  {
    id: "muro",
    title: "4. El Muro de los Mitos",
    badge: "Erradicación de Micromachismos",
    level: "Intermedio (10-13 años)",
    levelKey: "intermedio",
    odsTarget: "Meta 5.1: Igualdad Social",
    description: "Arcade Breakout multinivel con controles táctiles para romper prejuicios y desbloquear derechos.",
    icon: "🧱",
    accent: "border-rose-300 text-rose-800 bg-rose-50",
  },
  {
    id: "escudo",
    title: "5. El Escudo Emocional",
    badge: "Nuevas Masculinidades y Salud",
    level: "Intermedio (10-13 años)",
    levelKey: "intermedio",
    odsTarget: "Salud Socioemocional",
    description: "Físicas 2D para validar la empatía, el llanto y la búsqueda de ayuda, esquivando mandatos machistas.",
    icon: "🛡️",
    accent: "border-cyan-300 text-cyan-800 bg-cyan-50",
  },
  {
    id: "valor",
    title: "6. El Valor Invisible",
    badge: "Economía del Cuidado & INEGI",
    level: "Intermedio (10-13 años)",
    levelKey: "intermedio",
    odsTarget: "Meta 5.4: 23.9% del PIB Nacional",
    description: "Simulador familiar de 5 integrantes que calcula el impacto del trabajo doméstico no remunerado.",
    icon: "📊",
    accent: "border-teal-300 text-teal-800 bg-teal-50",
  },

  // Nivel Juvenil (14+ años)
  {
    id: "salario",
    title: "7. A Igual Trabajo, Igual Salario",
    badge: "LFT Art. 86 & Auditoría Salarial",
    level: "Juvenil (14+ años)",
    levelKey: "juvenil",
    odsTarget: "Meta 5.1: Paridad Laboral",
    description: "Auditoría en 4 sectores profesionales para eliminar la brecha salarial y de ascensos directivos.",
    icon: "💼",
    accent: "border-violet-300 text-violet-800 bg-violet-50",
  },
  {
    id: "circulo",
    title: "8. Círculo de Confianza y Valentía",
    badge: "Ley Olimpia & Directorio Morelia",
    level: "Juvenil (14+ años)",
    levelKey: "juvenil",
    odsTarget: "Meta 5.2 & AVGM Morelia",
    description: "Novela gráfica con 3 casos (violencia digital, noviazgo y acoso) y directorio oficial de Michoacán.",
    icon: "🤝",
    accent: "border-slate-400 text-slate-800 bg-slate-100",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"all" | "infantil" | "intermedio" | "juvenil">("all");
  const [selectedGameId, setSelectedGameId] = useState<GameId>("semaforo");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const filteredGames = GAMES_LIST.filter((g) => {
    if (activeTab === "all") return true;
    return g.levelKey === activeTab;
  });

  const toggleAudio = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectGame = (id: GameId) => {
    sound.playClick();
    setSelectedGameId(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Banner / Privacy by Design */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white px-4 py-2.5 text-xs text-center border-b border-indigo-900/50 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
              <Lock className="w-3.5 h-3.5" /> Privacy by Design: Cero recopilación de datos de menores
            </span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline text-slate-300">
              Tecnología Cívica (Civic Tech) para Morelia, Michoacán
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-amber-300 font-bold hidden sm:inline">ODS 5: Igualdad de Género</span>
            <button
              onClick={toggleAudio}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
              title={isMuted ? "Activar efectos de sonido" : "Silenciar efectos de sonido"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  <span>Silenciado</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sonido ON</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-md text-2xl font-black">
              5
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 leading-tight">
                Plataforma Educativa ODS 5 • Morelia
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                8 Juegos Didácticos Ciberseguros para la Igualdad de Género
              </p>
            </div>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab("all");
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "all" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Todos (8)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab("infantil");
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "infantil" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🟢 Infantil (6-9)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab("intermedio");
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "intermedio" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🔵 Intermedio (10-13)
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab("juvenil");
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "juvenil" ? "bg-white text-violet-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🟣 Juvenil (14+)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Games Shelf */}
        <section aria-label="Catálogo de Juegos">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-indigo-600" />
              Módulos Didácticos Disponibles:
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Procesamiento Client-Side sin recolección de datos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredGames.map((game) => {
              const isSelected = selectedGameId === game.id;
              return (
                <button
                  key={game.id}
                  onClick={() => handleSelectGame(game.id)}
                  className={`text-left p-4 rounded-3xl border-2 transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-white border-indigo-600 shadow-lg scale-102 ring-4 ring-indigo-100"
                      : "bg-white/90 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl p-1.5 bg-slate-50 rounded-2xl border border-slate-100">{game.icon}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {game.level.split(" ")[0]}
                      </span>
                    </div>

                    <h3 className="font-black text-sm text-slate-900 mt-2.5 line-clamp-1">
                      {game.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className={`font-bold ${isSelected ? "text-indigo-600" : "text-slate-400"}`}>
                      {isSelected ? "● En juego" : "Seleccionar"}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-600 translate-x-0.5" : "text-slate-300"}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Game Dynamic Stage */}
        <section aria-label="Escenario de Juego Activo" className="transition-all duration-300">
          {selectedGameId === "semaforo" && <SemaforoContacto />}
          {selectedGameId === "balanza" && <BalanzaDelTiempo />}
          {selectedGameId === "memorama" && <MemoramaLideres />}
          {selectedGameId === "muro" && <MuroDeLosMitos />}
          {selectedGameId === "escudo" && <EscudoEmocional />}
          {selectedGameId === "valor" && <ValorInvisible />}
          {selectedGameId === "salario" && <IgualSalario />}
          {selectedGameId === "circulo" && <CirculoConfianza />}
        </section>

        {/* Civic Tech & Pedagogical Foundation */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Fundamentación del Proyecto y Ciberseguridad Infantil
              </h3>
              <p className="text-xs text-slate-500">
                Arquitectura Stateless • Privacy by Design (Cavoukian, 2011) • WCAG 2.1 • OWASP Top 10
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" /> Cero Rastreo Comercial
              </h4>
              <p>
                No requiere contraseñas, ni recopila datos biométricos o escolares de menores. Toda la lógica corre en memoria volátil de forma efímera en el dispositivo del estudiante.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Green IT e Inclusión
              </h4>
              <p>
                Generado con un tamaño de paquete optimizado para funcionar fluidamente en dispositivos de bajos recursos o redes 3G intermitentes en escuelas públicas de Morelia.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-pink-600" /> Acción ante la AVGM
              </h4>
              <p>
                Brinda una herramienta pedagógica preventiva ante la Alerta de Violencia de Género contra las Mujeres (CONAVIM 2016), sembrando equidad desde la infancia temprana.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-1.5">
          <p className="font-bold text-slate-800">
            Plataforma Web Interactiva para la Educación Infantil sobre Equidad de Género (ODS 5)
          </p>
          <p>
            Desarrollo Sustentable • Facultad de Ingeniería / Sistemas • Morelia, Michoacán
          </p>
          <p className="text-[11px] text-slate-400">
            Código abierto bajo licencia MIT disponible para replicación institucional y ciudadana.
          </p>
        </div>
      </footer>
    </div>
  );
}
