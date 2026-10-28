"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  Gamepad2,
  Users,
  Info,
  ExternalLink,
  ChevronRight,
  HeartHandshake,
  Layers,
  FileText,
  Lock
} from "lucide-react";

import SemaforoContacto from "@/components/games/SemaforoContacto";
import BalanzaDelTiempo from "@/components/games/BalanzaDelTiempo";
import MemoramaLideres from "@/components/games/MemoramaLideres";
import MuroDeLosMitos from "@/components/games/MuroDeLosMitos";
import EscudoEmocional from "@/components/games/EscudoEmocional";
import ValorInvisible from "@/components/games/ValorInvisible";
import IgualSalario from "@/components/games/IgualSalario";
import CirculoConfianza from "@/components/games/CirculoConfianza";

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
  color: string;
}

const GAMES_LIST: GameMeta[] = [
  // Nivel Infantil (6-9 años)
  {
    id: "semaforo",
    title: "1. Semáforo del Contacto",
    badge: "Límites Corporales & Autocuidado",
    level: "Infantil (6-9 años)",
    levelKey: "infantil",
    odsTarget: "Meta 5.2: Prevención de Violencias",
    description: "Avatar SVG interactivo con código de semáforo para reconocer límites y zonas privadas.",
    icon: "🚦",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "balanza",
    title: "2. La Balanza del Tiempo",
    badge: "Corresponsabilidad en el Hogar",
    level: "Infantil (6-9 años)",
    levelKey: "infantil",
    odsTarget: "Meta 5.4: Trabajo Doméstico No Remunerado",
    description: "Mecánica interactiva de distribución justa de actividades y tiempo libre.",
    icon: "⚖️",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "memorama",
    title: "3. Memorama de Mujeres Líderes",
    badge: "Empoderamiento y Vocaciones STEM",
    level: "Infantil (6-9 años)",
    levelKey: "infantil",
    odsTarget: "Meta 5.5: Participación Plena",
    description: "Emparejamiento con cápsulas auditivas de pioneras científicas y mexicanas históricas.",
    icon: "🧠",
    color: "from-purple-500 to-pink-600",
  },

  // Nivel Intermedio (10-13 años)
  {
    id: "muro",
    title: "4. El Muro de los Mitos",
    badge: "Erradicación de Micromachismos",
    level: "Intermedio (10-13 años)",
    levelKey: "intermedio",
    odsTarget: "Meta 5.1 & 5.2: Deconstrucción de Estereotipos",
    description: "Arcade Canvas tipo Breakout para destruir bloques de prejuicios y desbloquear verdades.",
    icon: "🧱",
    color: "from-rose-500 to-red-600",
  },
  {
    id: "escudo",
    title: "5. El Escudo Emocional",
    badge: "Nuevas Masculinidades y Salud",
    level: "Intermedio (10-13 años)",
    levelKey: "intermedio",
    odsTarget: "Salud Socioemocional y No Violencia",
    description: "Juego de físicas 2D: atrapa emociones válidas y esquiva mandatos machistas.",
    icon: "🛡️",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "valor",
    title: "6. El Valor Invisible",
    badge: "Economía del Cuidado & PIB (INEGI)",
    level: "Intermedio (10-13 años)",
    levelKey: "intermedio",
    odsTarget: "Meta 5.4: Cuidados y PIB Nacional",
    description: "Calculadora interactiva del valor económico de las labores familiares del hogar.",
    icon: "📊",
    color: "from-emerald-600 to-teal-700",
  },

  // Nivel Juvenil (14+ años)
  {
    id: "salario",
    title: "7. A Igual Trabajo, Igual Salario",
    badge: "Justicia Laboral y Brecha Salarial",
    level: "Juvenil (14+ años)",
    levelKey: "juvenil",
    odsTarget: "Meta 5.1 & LFT Art. 86",
    description: "Simulador con sliders de auditoría organizacional para cerrar brechas de género.",
    icon: "💼",
    color: "from-violet-600 to-purple-700",
  },
  {
    id: "circulo",
    title: "8. Círculo de Confianza y Valentía",
    badge: "Prevención Digital & Directorio Morelia",
    level: "Juvenil (14+ años)",
    levelKey: "juvenil",
    odsTarget: "Meta 5.2: Ley Olimpia y AVGM Morelia",
    description: "Novela interactiva con árbol de decisiones y directorio oficial de auxilio local.",
    icon: "🤝",
    color: "from-slate-700 to-slate-900",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"all" | "infantil" | "intermedio" | "juvenil">("all");
  const [selectedGameId, setSelectedGameId] = useState<GameId>("semaforo");

  const filteredGames = GAMES_LIST.filter((g) => {
    if (activeTab === "all") return true;
    return g.levelKey === activeTab;
  });

  const selectedGame = GAMES_LIST.find((g) => g.id === selectedGameId) || GAMES_LIST[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Banner / Privacy & Civic Tech Tagline */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white px-4 py-2.5 text-xs text-center border-b border-indigo-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
            <Lock className="w-3.5 h-3.5" /> Privacy by Design: Cero recopilación de datos de menores
          </span>
          <span className="hidden sm:inline text-indigo-400">•</span>
          <span className="text-slate-200">
            Iniciativa de Tecnología Cívica para Morelia, Michoacán (Alerta de Violencia de Género)
          </span>
          <span className="hidden sm:inline text-indigo-400">•</span>
          <span className="text-amber-300 font-bold">ODS 5: Igualdad de Género</span>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md text-xl font-black">
              5
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900">
                Plataforma Educativa ODS 5 • Morelia
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Educación Interactiva, Cibersegura y Abierta para la Equidad de Género
              </p>
            </div>
          </div>

          {/* Quick Level Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "all" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Todos (8)
            </button>
            <button
              onClick={() => setActiveTab("infantil")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "infantil" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Infantil (6-9)
            </button>
            <button
              onClick={() => setActiveTab("intermedio")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "intermedio" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Intermedio (10-13)
            </button>
            <button
              onClick={() => setActiveTab("juvenil")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "juvenil" ? "bg-white text-violet-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Juvenil (14+)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Game Selection Shelf Carousel */}
        <section aria-label="Catálogo de Juegos">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-indigo-600" />
              Módulos Lúdicos Disponibles ({filteredGames.length}):
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Selecciona un juego para cargar de inmediato en memoria local
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredGames.map((game) => {
              const isSelected = selectedGameId === game.id;
              return (
                <button
                  key={game.id}
                  onClick={() => setSelectedGameId(game.id)}
                  className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-white border-indigo-600 shadow-lg scale-102 ring-2 ring-indigo-200"
                      : "bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{game.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {game.level.split(" ")[0]}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 mt-2 line-clamp-1">
                      {game.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {game.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-indigo-600">
                      {isSelected ? "● Jugando ahora" : "Tocar para jugar"}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Active Game Stage View */}
        <section aria-label="Zona de Juego Activo" className="transition-all duration-300">
          {selectedGameId === "semaforo" && <SemaforoContacto />}
          {selectedGameId === "balanza" && <BalanzaDelTiempo />}
          {selectedGameId === "memorama" && <MemoramaLideres />}
          {selectedGameId === "muro" && <MuroDeLosMitos />}
          {selectedGameId === "escudo" && <EscudoEmocional />}
          {selectedGameId === "valor" && <ValorInvisible />}
          {selectedGameId === "salario" && <IgualSalario />}
          {selectedGameId === "circulo" && <CirculoConfianza />}
        </section>

        {/* Academic & Methodological Justification Panel */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Fundamentación del Proyecto y Ciberseguridad Infantil
              </h3>
              <p className="text-xs text-slate-500">
                Arquitectura Stateless • Privacy by Design (Cavoukian, 2011) • WCAG 2.1 • OWASP Top 10
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" /> Cero Extracción de Datos
              </h4>
              <p>
                A diferencia de software comercial que monetiza el perfilamiento infantil, esta plataforma no requiere inicio de sesión, no utiliza cookies de rastreo y procesa toda la lógica en memoria volátil de forma efímera en el dispositivo del alumno.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Green IT & Inclusión
              </h4>
              <p>
                Desarrollado en Next.js optimizado y empaquetado ligero para ejecutarse fluidamente en dispositivos de gama baja o conexiones 3G intermitentes en escuelas públicas y zonas vulnerables de Morelia.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-pink-600" /> Respuesta a la AVGM
              </h4>
              <p>
                Atiende la Alerta de Violencia de Género contra las Mujeres (CONAVIM 2016) transformando la pedagogía punitiva o adulta en herramientas lúdicas tempranas para la erradicación del machismo sistémico.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">
            Plataforma Web Interactiva para la Educación Infantil sobre Equidad de Género (ODS 5)
          </p>
          <p>
            Desarrollo Sustentable • Facultad de Ingeniería / Sistemas • Morelia, Michoacán
          </p>
          <p className="text-[11px] text-slate-400">
            Código Abierto (Open Source) liberado bajo estándares de Tecnología Cívica.
          </p>
        </div>
      </footer>
    </div>
  );
}
