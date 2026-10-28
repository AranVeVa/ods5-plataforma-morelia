"use client";

import React, { useState } from "react";
import { Users2, ArrowRight, ShieldCheck, PhoneCall, MapPin, Clock, AlertTriangle, RotateCcw } from "lucide-react";
import { MORELIA_RESOURCES, EmergencyContact } from "@/data/educational-content";

interface StoryNode {
  id: string;
  context: string;
  title: string;
  dialogue: string;
  choices: {
    text: string;
    nextNodeId: string;
    isProtective: boolean;
    consequence: string;
  }[];
}

const STORY_NODES: Record<string, StoryNode> = {
  start: {
    id: "start",
    context: "Entorno Escolar y Digital en Morelia",
    title: "Caso 1: El Grupo de WhatsApp y las Fotos No Consentidas",
    dialogue: "En un grupo escolar de mensajería, un compañero comparte sin consentimiento una fotografía íntima de una compañera de preparatoria, acompañada de burlas e incitaciones a viralizarla.",
    choices: [
      {
        text: "Pedir al grupo que borren la foto, guardar evidencia (capturas) y acompañar a la compañera con una orientadora escolar o al Centro de Justicia para las Mujeres.",
        nextNodeId: "support_action",
        isProtective: true,
        consequence: "Rompes la complicidad machista, proteges la dignidad de tu compañera y activas los protocolos legales (Ley Olimpia)."
      },
      {
        text: "Reenviar la imagen a otros amigos para 'ver si es verdad' o ignorar la situación fingiendo que no viste nada.",
        nextNodeId: "passive_action",
        isProtective: false,
        consequence: "La inacción y la difusión no consentida constituyen un delito digital sancionado por el Código Penal (violencia digital)."
      }
    ]
  },
  support_action: {
    id: "support_action",
    context: "Canalización y Acompañamiento",
    title: "Activando el Círculo de Valentía",
    dialogue: "Tu compañera se siente vulnerable y con miedo a represalias. Te agradece que no hayas sido cómplice y juntas deciden buscar apoyo formal.",
    choices: [
      {
        text: "Llamar a la Policía Cibernética de Michoacán o acudir al Centro de Justicia para las Mujeres de Morelia para recibir asesoría gratuita y confidencial.",
        nextNodeId: "resolution_safe",
        isProtective: true,
        consequence: "El contenido es dado de baja y se brinda contención emocional y protección jurídica."
      },
      {
        text: "Intentar confrontar a golpes al responsable a la salida de la escuela.",
        nextNodeId: "violence_cycle",
        isProtective: false,
        consequence: "La violencia física escala el conflicto, desvía la atención del delito digital y pone en riesgo a más personas."
      }
    ]
  },
  passive_action: {
    id: "passive_action",
    context: "Consecuencias de la Omisión",
    title: "Impacto del Ciberacoso y Responsabilidad",
    dialogue: "La imagen se propaga en varias redes. La afectada presenta un cuadro severo de ansiedad y decide abandonar las clases por temor al juicio social.",
    choices: [
      {
        text: "Rectificar el rumbo: Borrar el archivo, denunciar las publicaciones en redes y acercarte a ofrecer disculpas y canalizarla a las instituciones de apoyo en Morelia.",
        nextNodeId: "support_action",
        isProtective: true,
        consequence: "Reconocer un error y actuar a tiempo puede salvar la salud socioemocional y la vida de una persona."
      }
    ]
  },
  violence_cycle: {
    id: "violence_cycle",
    context: "Manejo Inadecuado del Conflicto",
    title: "La violencia nunca resuelve la violencia",
    dialogue: "La confrontación causó sanciones disciplinarias para ambas partes mientras el daño digital continuó activo.",
    choices: [
      {
        text: "Canalizar la situación por la vía legal y pacífica a través de las instituciones especializadas.",
        nextNodeId: "resolution_safe",
        isProtective: true,
        consequence: "Se recurre a los expertos en prevención y justicia de Michoacán."
      }
    ]
  },
  resolution_safe: {
    id: "resolution_safe",
    context: "Resolución y Directorio de Apoyo",
    title: "¡Actuación Ejemplar y Ciudadanía Digital Ética!",
    dialogue: "Gracias a una actuación informada y empática, se evitó la revictimización y se activaron los canales de protección en Morelia. A continuación tienes a tu disposición el directorio oficial.",
    choices: []
  }
};

export default function CirculoConfianza() {
  const [currentNodeId, setCurrentNodeId] = useState<string>("start");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const currentNode = STORY_NODES[currentNodeId] || STORY_NODES["start"];

  const handleChoice = (nextNodeId: string) => {
    setCurrentNodeId(nextNodeId);
  };

  const restartStory = () => {
    setCurrentNodeId("start");
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <Users2 className="w-4 h-4" /> Nivel Juvenil (14+ años) • Novela Gráfica y Redes de Apoyo
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
            🤝 Círculo de Confianza y Valentía
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Novela interactiva basada en toma de decisiones para prevenir la violencia digital y escolar, con directorio de auxilio local en Morelia.
          </p>
        </div>
        <button
          onClick={restartStory}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reiniciar caso
        </button>
      </div>

      {/* Decision Tree Story Panel */}
      <div className="mt-6 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800">
            {currentNode.context}
          </span>
          <h3 className="text-xl sm:text-2xl font-black mt-3 text-slate-100">
            {currentNode.title}
          </h3>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            {currentNode.dialogue}
          </p>

          {/* Choices */}
          {currentNode.choices.length > 0 ? (
            <div className="mt-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                ¿Qué decisión tomas?:
              </p>
              {currentNode.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(choice.nextNodeId)}
                  className={`w-full text-left p-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 border ${
                    choice.isProtective
                      ? "bg-slate-800/90 hover:bg-emerald-950/70 border-slate-700 hover:border-emerald-500 text-emerald-100"
                      : "bg-slate-800/90 hover:bg-rose-950/70 border-slate-700 hover:border-rose-500 text-rose-100"
                  }`}
                >
                  <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <span>{choice.text}</span>
                    <p className="text-[11px] text-slate-400 font-normal mt-1">
                      <strong>Impacto:</strong> {choice.consequence}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-6 p-4 bg-emerald-900/40 border border-emerald-500/60 rounded-xl text-emerald-200 text-xs sm:text-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
              Has completado el árbol de decisiones reconociendo la importancia del auxilio oportuno.
            </div>
          )}
        </div>
      </div>

      {/* Directory of Emergency & Help in Morelia */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-indigo-600" />
              Directorio de Atención y Denuncia en Morelia y Michoacán
            </h4>
            <p className="text-xs text-slate-500">
              Teléfonos y ubicaciones de auxilio gratuito ante casos de violencia o ciberacoso.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MORELIA_RESOURCES.map((res, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {res.scope}
                </span>
              </div>
              <h5 className="font-bold text-slate-800 text-sm mt-2">
                {res.institution}
              </h5>
              <p className="text-xs text-slate-600 mt-1">
                {res.description}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-200 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-indigo-900">
                  <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Tel: {res.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{res.address}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{res.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
