"use client";

import React, { useState } from "react";
import {
  Users2,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Clock,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  HeartHandshake,
  ShieldAlert
} from "lucide-react";
import confetti from "canvas-confetti";
import GameHeader from "@/components/common/GameHeader";
import InstructionsModal from "@/components/common/InstructionsModal";
import VictoryModal from "@/components/common/VictoryModal";
import EmergencyHelpModal from "@/components/common/EmergencyHelpModal";
import { MORELIA_RESOURCES, EmergencyContact } from "@/data/educational-content";
import { sound } from "@/utils/audio";

interface Choice {
  text: string;
  nextNodeId: string;
  isProtective: boolean;
  consequence: string;
}

interface StoryNode {
  id: string;
  context: string;
  title: string;
  dialogue: string;
  characterMood: "alarm" | "concerned" | "resolute" | "safe";
  choices: Choice[];
}

type ScenarioKey = "digital" | "noviazgo" | "escolar";

const SCENARIOS: Record<ScenarioKey, { title: string; subtitle: string; startNode: string; nodes: Record<string, StoryNode> }> = {
  digital: {
    title: "Caso 1: Violencia Digital y Ley Olimpia",
    subtitle: "Difusión de fotografías íntimas sin consentimiento en grupos de chat",
    startNode: "dig_start",
    nodes: {
      dig_start: {
        id: "dig_start",
        context: "Preparatoria en Morelia • Grupo de Mensajería",
        title: "Una imagen privada compartida en el chat escolar",
        dialogue: "En un grupo de mensajería estudiantil de tu preparatoria, alguien comparte una fotografía íntima de una compañera de clase acompañada de comentarios denigrantes y peticiones para reenviarla a otros salones.",
        characterMood: "concerned",
        choices: [
          {
            text: "Exigir en el grupo frenar la difusión, resguardar capturas de pantalla como prueba y acompañar a la compañera con una orientadora escolar o la Policía Cibernética.",
            nextNodeId: "dig_support",
            isProtective: true,
            consequence: "Cortas la cadena de complicidad machista, proteges la intimidad de tu compañera y activas los protocolos legales de la Ley Olimpia."
          },
          {
            text: "Reenviar la foto a otros contactos para 'preguntar si es verdad' o guardar silencio por temor a burlas.",
            nextNodeId: "dig_passive",
            isProtective: false,
            consequence: "La difusión no consentida de material íntimo es un delito penal en Michoacán con penas de 4 a 8 años de prisión."
          }
        ]
      },
      dig_support: {
        id: "dig_support",
        context: "Acompañamiento Ciudadano Responsable",
        title: "Activando la Red de Valentía y Solidaridad",
        dialogue: "Tu compañera se siente en crisis emocional y con miedo al juicio social. Agradece profundamente que no hayas sido cómplice. Juntas analizan cómo proceder con seguridad y confidencialidad.",
        characterMood: "resolute",
        choices: [
          {
            text: "Contactar a la Policía Cibernética de Michoacán y al Centro de Justicia para las Mujeres de Morelia para recibir asesoría gratuita y solicitar la baja formal del contenido.",
            nextNodeId: "dig_safe",
            isProtective: true,
            consequence: "Se ordena la eliminación inmediata de los enlaces digitales y se brinda contención psicológica profesional gratuita."
          },
          {
            text: "Buscar confrontar a golpes al responsable a la salida del plantel educativo.",
            nextNodeId: "dig_violence",
            isProtective: false,
            consequence: "La confrontación física escala la violencia, pone en riesgo tu integridad y desvía la atención del delito digital cometido."
          }
        ]
      },
      dig_passive: {
        id: "dig_passive",
        context: "Consecuencias de la Omisión",
        title: "Impacto del Ciberacoso y Responsabilidad Ética",
        dialogue: "Al no detenerse la difusión, la compañera sufre ataques de pánico y decide dejar de asistir a clases. Reconoces el grave daño que provoca el silencio de los testigos.",
        characterMood: "alarm",
        choices: [
          {
            text: "Rectificar el actuar: Borrar los archivos, denunciar las cuentas que difunden y acercarte a ofrecer apoyo sincero canalizándola a las instituciones de Morelia.",
            nextNodeId: "dig_support",
            isProtective: true,
            consequence: "Reconocer un error a tiempo y solidarizarse activamente puede salvar una vida y reparar el tejido escolar."
          }
        ]
      },
      dig_violence: {
        id: "dig_violence",
        context: "Desvío del Conflicto",
        title: "La violencia nunca resuelve la violencia",
        dialogue: "La riña causó sanciones disciplinarias para ambas partes mientras el contenido digital continuó en línea sin resolver el fondo del problema.",
        characterMood: "alarm",
        choices: [
          {
            text: "Canalizar la denuncia por la vía institucional especializada, pacífica y legal.",
            nextNodeId: "dig_safe",
            isProtective: true,
            consequence: "Se recurre a los especialistas en prevención de delitos digitales de Michoacán."
          }
        ]
      },
      dig_safe: {
        id: "dig_safe",
        context: "Resolución Segura y Reparadora",
        title: "¡Actuación Ejemplar y Ciudadanía Digital Ética!",
        dialogue: "Gracias a tu solidaridad informada, se evitó la revictimización, se retiró el material y se activó el protocolo formal en Morelia. Consulta el directorio de auxilio oficial a continuación.",
        characterMood: "safe",
        choices: []
      }
    }
  },
  noviazgo: {
    title: "Caso 2: Control y Celos en el Noviazgo",
    subtitle: "Detección de señales tempranas de violencia psicológica y control coercitivo",
    startNode: "nov_start",
    nodes: {
      nov_start: {
        id: "nov_start",
        context: "Relaciones Afectivas en la Juventud",
        title: "La exigencia de contraseñas y permisos",
        dialogue: "La pareja de una amiga le exige que le entregue sus contraseñas de Instagram y WhatsApp, le reclama si habla con compañeros de clase y le pide fotos de cómo va vestida antes de salir de casa.",
        characterMood: "concerned",
        choices: [
          {
            text: "Platicar en privado con tu amiga, recordarle que el amor sano se basa en la confianza y privacidad mutua, y sugerirle revisar el Violentómetro de IMMUJERIS.",
            nextNodeId: "nov_support",
            isProtective: true,
            consequence: "Visibilizas el control coercitivo a tiempo antes de que escale a violencia física, económica o patrimonial."
          },
          {
            text: "Decirle que 'así son las parejas modernas' o que 'si la cela tanto es porque la ama demasiado'.",
            nextNodeId: "nov_normalize",
            isProtective: false,
            consequence: "Normalizar los celos y la invasión de privacidad perpetúa relaciones tóxicas de dominación machista."
          }
        ]
      },
      nov_support: {
        id: "nov_support",
        context: "Establecimiento de Límites",
        title: "Recuperando la Autonomía Personal",
        dialogue: "Tu amiga reconoce que siente angustia constante y que ha dejado de ver a sus amistades. Decide poner un alto y solicitar orientación psicológica juvenil gratuita.",
        characterMood: "resolute",
        choices: [
          {
            text: "Acompañarla a las sesiones del Instituto de la Mujer Moreliana (IMMUJERIS) o SeiMujer para recibir contención emocional y asesoría.",
            nextNodeId: "nov_safe",
            isProtective: true,
            consequence: "Aprende a identificar relaciones afectivas saludables y a construir redes de apoyo seguras."
          }
        ]
      },
      nov_normalize: {
        id: "nov_normalize",
        context: "Escalada del Aislamiento",
        title: "Pérdida de Redes de Apoyo",
        dialogue: "Con el paso de las semanas, la pareja le prohíbe tener cualquier amistad. Su rendimiento escolar cae y se siente completamente sola y deprimida.",
        characterMood: "alarm",
        choices: [
          {
            text: "Intervenir con empatía: acercarte sin juzgarla, escucharla y ofrecerle las líneas de atención psicológica de Morelia.",
            nextNodeId: "nov_support",
            isProtective: true,
            consequence: "Romper el aislamiento es el paso indispensable para recuperar la tranquilidad y la seguridad."
          }
        ]
      },
      nov_safe: {
        id: "nov_safe",
        context: "Relaciones Libres de Violencia",
        title: "¡Vínculos Afectivos Basados en el Respeto!",
        dialogue: "Lograron identificar banderas rojas a tiempo. El amor sincero nunca exige sumisión, control, miedo ni renuncia a la propia libertad.",
        characterMood: "safe",
        choices: []
      }
    }
  },
  escolar: {
    title: "Caso 3: Acoso en Espacio Público y Transporte",
    subtitle: "Solidaridad activa ante tocamientos o comentarios lascivos en paradas de autobús",
    startNode: "esc_start",
    nodes: {
      esc_start: {
        id: "esc_start",
        context: "Parada de Transporte Público en Morelia",
        title: "Un sujeto molesta a una estudiante en la parada",
        dialogue: "Esperando el transporte hacia la secundaria, notas que un sujeto desconocido comienza a hacer comentarios lascivos insistentes y a acercarse indebidamente a una estudiante visiblemente asustada.",
        characterMood: "concerned",
        choices: [
          {
            text: "Aplicar la técnica de intervención solidaria: acercarte fingiendo que la conoces ('¡Hola Laura, te estaba buscando!'), invitarla a caminar juntos e ingresar a un comercio 'Punto Naranja'.",
            nextNodeId: "esc_support",
            isProtective: true,
            consequence: "Disuades la agresión sin confrontación violenta directa y resguardas a la estudiante en un espacio seguro capacitado."
          },
          {
            text: "Quedarte mirando con indiferencia o retirarte del lugar pensando que 'no es tu problema'.",
            nextNodeId: "esc_ignore",
            isProtective: false,
            consequence: "La falta de empatía ciudadana deja a la víctima en alta vulnerabilidad ante un posible delito en la vía pública."
          }
        ]
      },
      esc_support: {
        id: "esc_support",
        context: "Resguardo y Auxilio Inmediato",
        title: "Protocolo Punto Naranja en Morelia",
        dialogue: "En el establecimiento comercial activan de inmediato el protocolo: resguardan a la estudiante, contactan a sus familiares y reportan la situación a la Policía de Morelia.",
        characterMood: "resolute",
        choices: [
          {
            text: "Acompañarla tranquilamente hasta que lleguen sus familiares o el personal policial de género.",
            nextNodeId: "esc_safe",
            isProtective: true,
            consequence: "Garantizas un acompañamiento solidario y seguro sin exponer a nadie a riesgos innecesarios."
          }
        ]
      },
      esc_ignore: {
        id: "esc_ignore",
        context: "Inseguridad Colectiva",
        title: "El costo del silencio ciudadano",
        dialogue: "Una vendedora cercana intervino para auxiliar a la joven, pero la indiferencia colectiva incrementa el miedo en los estudiantes que transitan a diario por esa ruta.",
        characterMood: "alarm",
        choices: [
          {
            text: "Aprender el protocolo de intervención ciudadana solidaria y comprometerte a actuar de forma segura.",
            nextNodeId: "esc_safe",
            isProtective: true,
            consequence: "La seguridad comunitaria en Morelia se fortalece cuando cuidamos colectivamente a la juventud."
          }
        ]
      },
      esc_safe: {
        id: "esc_safe",
        context: "Comunidad Activa y Protectora",
        title: "¡Solidaridad Ciudadana que Salva Vidas!",
        dialogue: "Una comunidad informada, empática y valiente previene delitos y garantiza que las calles y escuelas de Morelia sean espacios libres de violencia.",
        characterMood: "safe",
        choices: []
      }
    }
  }
};

export default function CirculoConfianza() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("digital");
  const [currentNodeId, setCurrentNodeId] = useState<string>("dig_start");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const scenario = SCENARIOS[scenarioKey];
  const currentNode = scenario.nodes[currentNodeId] || scenario.nodes[scenario.startNode];

  const handleScenarioChange = (key: ScenarioKey) => {
    sound.playPowerup();
    setScenarioKey(key);
    setCurrentNodeId(SCENARIOS[key].startNode);
  };

  const handleChoice = (choice: Choice) => {
    if (choice.isProtective) {
      sound.playCorrect();
    } else {
      sound.playAlert();
    }
    setCurrentNodeId(choice.nextNodeId);

    if (scenario.nodes[choice.nextNodeId]?.choices.length === 0) {
      sound.playCelebration();
      setIsVictoryOpen(true);
    }
  };

  const handleCopyPhone = (id: string, phone: string) => {
    sound.playClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleRestart = () => {
    sound.playPowerup();
    setCurrentNodeId(scenario.startNode);
    setIsVictoryOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-100 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <GameHeader
        title="🤝 Círculo de Confianza y Valentía"
        badge="Prevención de violencia digital, escolar y noviazgo • AVGM Morelia"
        levelBadge="Nivel Juvenil (14 años en adelante)"
        levelColor="violet"
        odsTarget="ODS 5.2"
        score={currentNode.choices.length === 0 ? 300 : 150}
        stars={currentNode.choices.length === 0 ? 3 : 2}
        maxStars={3}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onRestart={handleRestart}
      />

      {/* Scenario Selector Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-2 rounded-2xl">
        <button
          onClick={() => handleScenarioChange("digital")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
            scenarioKey === "digital"
              ? "bg-slate-900 text-emerald-400 shadow-sm"
              : "text-slate-600 hover:text-slate-900 bg-white/60"
          }`}
        >
          📱 Caso 1: Violencia Digital (Ley Olimpia)
        </button>
        <button
          onClick={() => handleScenarioChange("noviazgo")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
            scenarioKey === "noviazgo"
              ? "bg-slate-900 text-emerald-400 shadow-sm"
              : "text-slate-600 hover:text-slate-900 bg-white/60"
          }`}
        >
          💔 Caso 2: Control en el Noviazgo
        </button>
        <button
          onClick={() => handleScenarioChange("escolar")}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
            scenarioKey === "escolar"
              ? "bg-slate-900 text-emerald-400 shadow-sm"
              : "text-slate-600 hover:text-slate-900 bg-white/60"
          }`}
        >
          🚍 Caso 3: Acoso Callejero y Punto Naranja
        </button>
      </div>

      {/* Narrative Graphic Novel Stage */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border-2 border-slate-800 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800">
            {currentNode.context}
          </span>
          <span className="text-xs text-slate-400">
            Árbol de decisiones éticas
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-100 leading-tight">
          {currentNode.title}
        </h3>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {currentNode.dialogue}
        </p>

        {/* Decisions Choices */}
        {currentNode.choices.length > 0 ? (
          <div className="mt-5 space-y-3 pt-2 border-t border-slate-800">
            <span className="text-xs font-black uppercase text-slate-400 block">
              ¿Qué decisión tomas?:
            </span>
            {currentNode.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 border ${
                  choice.isProtective
                    ? "bg-slate-800/90 hover:bg-emerald-950/80 border-slate-700 hover:border-emerald-500 text-emerald-100"
                    : "bg-slate-800/90 hover:bg-rose-950/80 border-slate-700 hover:border-rose-500 text-rose-100"
                }`}
              >
                <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <div className="space-y-1">
                  <span className="font-bold text-slate-100">{choice.text}</span>
                  <p className="text-[11px] text-slate-400 font-normal leading-snug">
                    <strong>Consecuencia legal y emocional:</strong> {choice.consequence}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/60 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
              <div>
                <p className="font-black">¡Caso resuelto con solidaridad y perspectiva de derechos!</p>
                <p className="text-[11px] text-emerald-300">
                  Has demostrado que la violencia nunca se justifica y que existen canales verificados para actuar.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVictoryOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shrink-0 shadow"
            >
              Ver Conclusión
            </button>
          </div>
        )}
      </div>

      {/* Directory of Emergency & Assistance in Morelia */}
      <div className="pt-4 border-t border-slate-200 space-y-4">
        <div>
          <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-indigo-600" /> Directorio de Auxilio y Denuncia en Morelia y Michoacán
          </h4>
          <p className="text-xs text-slate-500">
            Instituciones gubernamentales con atención gratuita, asesoría legal y psicológica confidencial ante la Alerta de Violencia de Género (AVGM).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MORELIA_RESOURCES.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200/80 hover:border-indigo-300 hover:bg-white transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-md inline-block">
                  {res.scope}
                </span>

                <h5 className="font-black text-slate-900 text-sm">
                  {res.institution}
                </h5>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {res.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {res.services.map((svc, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md"
                    >
                      • {svc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between font-black text-indigo-900">
                  <a
                    href={`tel:${res.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-1.5 hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Tel: {res.phone}</span>
                  </a>
                  <button
                    onClick={() => handleCopyPhone(res.id, res.phone)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100"
                  >
                    {copiedId === res.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> ¡Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copiar
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{res.address}, {res.colonia} ({res.reference})</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{res.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        title="Instrucciones: Círculo de Confianza y Valentía"
        objective="Explorar situaciones reales de violencia digital, noviazgo y acoso callejero, comprendiendo las consecuencias legales de cada decisión y las rutas de apoyo institucional en Morelia."
        rules={[
          "Selecciona el caso que deseas resolver (Violencia Digital, Celos en el Noviazgo o Acoso Callejero).",
          "Lee la narrativa y elige la opción que priorice la protección de los derechos humanos y la empatía.",
          "Conoce las leyes protectoras como la Ley Olimpia y el programa Punto Naranja.",
          "Consulta el directorio oficial con teléfonos y direcciones en Morelia."
        ]}
        tips={[
          "Pedir ayuda es un acto de gran valentía. La responsabilidad de una situación de violencia nunca corresponde a quien la recibe."
        ]}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        title="¡Líder en Prevención y Cultura de Paz!"
        score={300}
        stars={3}
        maxStars={3}
        takeaway="Has demostrado que la solidaridad comunitaria, el conocimiento de las leyes y la denuncia oportuna son las herramientas más eficaces para frenar la violencia de género."
        summaryPoints={[
          "Identificaste el delito de violencia digital conforme a la Ley Olimpia.",
          "Reconociste los signos tempranos de control coercitivo en el noviazgo.",
          "Aprendiste a canalizar situaciones de auxilio a las instituciones oficiales de Morelia."
        ]}
        onRestart={handleRestart}
      />

      <EmergencyHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
