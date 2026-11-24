"use client";

import React from "react";
import { Printer, BookOpen, MessageCircle, Target, Lock, ShieldAlert } from "lucide-react";
import TopBar from "@/components/common/TopBar";
import DirectorioApoyo from "@/components/DirectorioApoyo";
import { GAMES_CATALOG } from "@/content/games-meta";
import Button3D from "@/components/common/Button3D";

const CLASSROOM_QUESTIONS: Record<string, string[]> = {
  semaforo: [
    "¿Qué significa que nuestro cuerpo nos pertenece y cuándo podemos decir 'NO' aunque sea alguien conocido?",
    "¿Qué diferencia hay entre un regalo bonito y un secreto que te hace sentir miedo o incomodidad?",
    "¿Quiénes son las personas adultas de confianza en nuestra escuela y familia a quienes siempre podemos acudir?",
  ],
  balanza: [
    "¿Por qué históricamente muchas tareas de limpieza y cuidado recaen solo en las mujeres?",
    "¿Qué pasa con el tiempo de estudio y juego de una niña cuando debe hacer más labores domésticas que sus hermanos?",
    "¿Cómo podemos repartir de manera más justa las tareas de nuestra propia casa esta semana?",
  ],
  memorama: [
    "¿Qué científicas, médicas o artistas mexicanas conocías antes de jugar?",
    "¿Por qué es importante conocer historias como la de Katya Echazarreta, Matilde Montoya o Amalia Solórzano?",
    "¿Qué profesión te gustaría explorar sin importar si antes se decía que era 'solo para hombres' o 'solo para mujeres'?",
  ],
  muro: [
    "¿Alguna vez escuchaste frases como 'los hombres no lloran' o 'es broma, no te ofendas'? ¿Cómo hacen sentir a la gente?",
    "¿Qué podemos responder con respeto cuando alguien hace un chiste que discrimina o burla a otra persona?",
  ],
  escudo: [
    "¿Por qué expresar tristeza, miedo o pedir ayuda nos hace más fuertes y no más débiles?",
    "¿Qué cambia en el salón cuando entre compañeros se escuchan en lugar de presionarse con burlas?",
  ],
  valor: [
    "Si en México el trabajo doméstico no remunerado equivale al 23.9% del PIB, ¿qué pasaría en la ciudad si nadie cocinara, limpiara ni cuidara?",
    "¿Cómo valorar y repartir en casa estas horas para que todas las personas tengan oportunidades de desarrollo?",
  ],
  salario: [
    "¿Qué establece el Artículo 86 de la Ley Federal del Trabajo sobre el salario igual por trabajo igual?",
    "¿Qué es el 'techo de cristal' y cómo ayudan las licencias parentales equitativas y evaluaciones sin sesgos?",
  ],
  circulo: [
    "¿Qué protege la Ley Olimpia en Michoacán y por qué reenviar contenido íntimo sin permiso nunca es broma?",
    "¿Qué señales de control o celos en el noviazgo debemos identificar a tiempo?",
    "¿Cómo funciona el acompañamiento solidario y los comercios Punto Naranja en Morelia?",
  ],
};

export default function DocentesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="print:hidden">
        <TopBar showHomeButton />
      </div>

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 outline-none">
        {/* Encabezado */}
        <section className="bg-white rounded-4xl border-2 border-indigo-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-black">
                <BookOpen className="w-3.5 h-3.5" /> Panel Docente · Solo Lectura (Cero Datos)
              </span>
              <h1 className="text-2xl sm:text-4xl font-display font-black text-slate-900">
                Guía Pedagógica de Aula · ODS 5 Morelia
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Orientaciones didácticas para usar los 8 minijuegos en escuelas primarias, secundarias y preparatorias de Michoacán, alineadas con las metas 5.2 y 5.4 de la Agenda 2030.
              </p>
            </div>

            <div className="print:hidden">
              <Button3D
                variant="primary"
                size="md"
                onClick={() => window.print()}
                icon={<Printer className="w-4 h-4" />}
              >
                Imprimir Guía (PDF)
              </Button3D>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
              <strong className="flex items-center gap-1.5 mb-1">
                <Lock className="w-4 h-4 text-emerald-700" /> Uso seguro en aula
              </strong>
              No solicita nombres, correos ni matrículas del alumnado. Funciona offline/3G una vez cargado.
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950">
              <strong className="flex items-center gap-1.5 mb-1">
                <Target className="w-4 h-4 text-blue-700" /> Dinámica sugerida
              </strong>
              10 min de juego individual o en parejas + 15 min de círculo de diálogo con las preguntas de abajo.
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950">
              <strong className="flex items-center gap-1.5 mb-1">
                <ShieldAlert className="w-4 h-4 text-rose-700" /> Contención y protocolo
              </strong>
              Ante cualquier revelación de violencia o riesgo infantil, escucha sin juzgar y activa ruta DIF / CJM / 911.
            </div>
          </div>
        </section>

        {/* Fichas por juego */}
        <section aria-label="Objetivos y preguntas por juego" className="space-y-4">
          <h2 className="text-xl font-display font-black text-slate-900">
            Fichas Didácticas de los 8 Minijuegos
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {GAMES_CATALOG.map((g) => (
              <article
                key={g.id}
                className="bg-white rounded-3xl border-2 border-slate-200 p-5 space-y-3 break-inside-avoid"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <h3 className="text-lg font-display font-black text-slate-900">{g.title}</h3>
                    <p className="text-xs font-bold text-indigo-700">
                      {g.levelLabel} · {g.badge}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black">
                    {g.odsTarget} · {g.duration}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Objetivo pedagógico:
                  </p>
                  <p className="text-sm text-slate-800 leading-relaxed">{g.learningSummary}</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-1.5">
                  <p className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-indigo-600" />
                    Preguntas detonadoras para conversar en clase:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
                    {(CLASSROOM_QUESTIONS[g.id] || []).map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>

                <p className="text-[11px] text-slate-500">
                  <strong>Dato de respaldo:</strong> {g.funFact} ({g.funFactSource})
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Directorio de referencia para docentes */}
        <section className="bg-white rounded-4xl border-2 border-rose-200 p-6 space-y-4 break-inside-avoid">
          <h2 className="text-xl font-display font-black text-slate-900">
            Directorio de Canalización Escolar (Morelia y Nacional)
          </h2>
          <DirectorioApoyo />
        </section>
      </main>
    </div>
  );
}
