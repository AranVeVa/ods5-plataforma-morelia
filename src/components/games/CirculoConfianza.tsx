"use client";

import React, { useState } from "react";
import { Users2, ArrowRight, ShieldCheck, PhoneCall, MapPin, Clock, RotateCcw, AlertTriangle, Copy, Check, Sparkles } from "lucide-react";
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
  choices: Choice[];
}

type ScenarioKey = "digital" | "noviazgo" | "escolar";

const SCENARIOS: Record<ScenarioKey, { title: string; subtitle: string; startNode: string; nodes: Record<string, StoryNode> }> = {
  digital: {
    title: "Caso A: Violencia Digital y Ley Olimpia",
    subtitle: "Difusión de fotografías íntimas sin consentimiento en grupos de chat",
    startNode: "dig_start",
    nodes: {
      dig_start: {
        id: "dig_start",
        context: "Preparatoria en Morelia • Mensajería Instantánea",
        title: "Una imagen privada compartida en el chat escolar",
        dialogue: "En un grupo de mensajería estudiantil, alguien comparte una foto íntima de una compañera de salón acompañada de comentarios denigrantes y peticiones para viralizarla.",
        choices: [
          {
            text: "Exigir en el grupo frenar la difusión, resguardar capturas de pantalla como prueba y acompañar a la compañera con directivos o la Policía Cibernética.",
            nextNodeId: "dig_support",
            isProtective: true,
            consequence: "Cortas la cadena de complicidad, proteges los derechos de tu compañera y activas los mecanismos de la Ley Olimpia."
          },
          {
            text: "Reenviar la foto a otros contactos para 'preguntar si es verdad' o guardar silencio por temor.",
            nextNodeId: "dig_passive",
            isProtective: false,
            consequence: "La difusión no consentida de material íntimo es un delito penal en Michoacán con penas de prisión."
          }
        ]
      },
      dig_support: {
        id: "dig_support",
        context: "Acompañamiento Ciudadano Responsable",
        title: "Activando la Red de Valentía",
        dialogue: "Tu compañera se siente en crisis y con miedo a represalias. Agradece profundamente tu empatía. Juntas evalúan cuál es la mejor ruta legal y emocional.",
        choices: [
          {
            text: "Contactar a la Policía Cibernética de Michoacán y al Centro de Justicia para las Mujeres de Morelia para recibir asesoría confidencial y ordenar la baja del contenido.",
            nextNodeId: "dig_safe",
            isProtective: true,
            consequence: "Se solicita a las plataformas la eliminación de la imagen y se inicia acompañamiento psicológico gratuito."
          },
          {
            text: "Buscar confrontar a golpes al responsable para 'darle un escarmiento'.",
            nextNodeId: "dig_violence",
            isProtective: false,
            consequence: "La violencia física agrava el problema, pone en riesgo a más personas y desvía la investigación judicial."
          }
        ]
      },
      dig_passive: {
        id: "dig_passive",
        context: "Efecto Bola de Nieve",
        title: "Impacto Emocional y Responsabilidad Ética",
        dialogue: "Al no frenarse la difusión, la compañera presenta crisis de ansiedad y decide abandonar la escuela. Te das cuenta del grave daño provocado por el silencio colectivo.",
        choices: [
          {
            text: "Rectificar el actuar: Borrar los archivos, denunciar las cuentas que difunden y ofrecer apoyo a la afectada canalizándola a las instancias de Morelia.",
            nextNodeId: "dig_support",
            isProtective: true,
            consequence: "Reconocer un error a tiempo y solidarizarse puede salvar una vida y restablecer la dignidad comunitaria."
          }
        ]
      },
      dig_violence: {
        id: "dig_violence",
        context: "Desvío del Conflicto",
        title: "La violencia solo reproduce más violencia",
        dialogue: "La confrontación generó suspensiones escolares mientras el material digital continuó en línea sin resolver el fondo del problema.",
        choices: [
          {
            text: "Canalizar la denuncia por la vía institucional especializada y pacífica.",
            nextNodeId: "dig_safe",
            isProtective: true,
            consequence: "Se recurre a los expertos en cibercrimen y protección de género de Morelia."
          }
        ]
      },
      dig_safe: {
        id: "dig_safe",
        context: "Resolución Segura",
        title: "¡Actuación Ejemplar y Ética Ciudadana!",
        dialogue: "Gracias a tu solidaridad, se evitó la revictimización y se activaron las instituciones oficiales de Michoacán. Consulta el directorio a continuación.",
        choices: []
      }
    }
  },
  noviazgo: {
    title: "Caso B: Control y Celos en el Noviazgo",
    subtitle: "Detección de señales tempranas de violencia psicológica y control coercitivo",
    startNode: "nov_start",
    nodes: {
      nov_start: {
        id: "nov_start",
        context: "Relaciones Afectivas en la Juventud",
        title: "La exigencia de contraseñas y permisos",
        dialogue: "La pareja de una amiga le exige que le comparta sus contraseñas de redes sociales, le reclama si habla con compañeros y le pide fotos de cómo va vestida antes de salir.",
        choices: [
          {
            text: "Conversar en privado con tu amiga, recordarle que el amor sano se basa en la confianza y privacidad mutua, y recomendarle el Violentómetro de IMMUJERIS.",
            nextNodeId: "nov_support",
            isProtective: true,
            consequence: "Visibilizas el control coercitivo antes de que escale a violencia física o patrimonial."
          },
          {
            text: "Decirle que 'así son las parejas modernas' o que 'si la cela es porque la quiere mucho'.",
            nextNodeId: "nov_normalize",
            isProtective: false,
            consequence: "Normalizar los celos perpetúa ciclos de dominación machista y aislamiento social."
          }
        ]
      },
      nov_support: {
        id: "nov_support",
        context: "Establecimiento de Límites",
        title: "Recuperando la Autonomía",
        dialogue: "Tu amiga reconoce que siente angustia constante. Decide establecer límites claros y solicitar una sesión de contención emocional juvenil en Morelia.",
        choices: [
          {
            text: "Acompañarla al Instituto de la Mujer Moreliana (IMMUJERIS) o SeiMujer para recibir orientación psicológica gratuita.",
            nextNodeId: "nov_safe",
            isProtective: true,
            consequence: "Construye herramientas socioemocionales para mantener vínculos afectivos basados en el respeto mutuo."
          }
        ]
      },
      nov_normalize: {
        id: "nov_normalize",
        context: "Escalada del Aislamiento",
        title: "Pérdida de Redes de Apoyo",
        dialogue: "El novio le prohíbe tener amistades y la aísla por completo de su familia. Su autoestima está profundamente afectada.",
        choices: [
          {
            text: "Intervenir con empatía: acercarse sin juzgarla y ofrecerle la red de apoyo y líneas telefónicas oficiales.",
            nextNodeId: "nov_support",
            isProtective: true,
            consequence: "Romper el aislamiento es el primer paso para reconstruir la seguridad personal."
          }
        ]
      },
      nov_safe: {
        id: "nov_safe",
        context: "Crecimiento y Respeto",
        title: "¡Relaciones Afectivas Libres y Seguras!",
        dialogue: "Lograron identificar banderas rojas a tiempo. El amor verdadero nunca exige sumisión, control ni miedo.",
        choices: []
      }
    }
  },
  escolar: {
    title: "Caso C: Acoso en Entornos Escolares y Espacio Público",
    subtitle: "Solidaridad activa ante tocamientos o comentarios lascivos en transporte o calle",
    startNode: "esc_start",
    nodes: {
      esc_start: {
        id: "esc_start",
        context: "Transporte Público / Calle en Morelia",
        title: "Un sujeto molesta a una estudiante en la parada del camión",
        dialogue: "Esperando el transporte hacia la secundaria, un adulto desconocido comienza a hacerle comentarios insistentes y a acercarse indebidamente a una estudiante visiblemente asustada.",
        choices: [
          {
            text: "Acercarte de inmediato fingiendo que la conoces: '¡Hola! Te estaba buscando, ven con nosotros', e ingresar juntos a un comercio 'Punto Naranja'.",
            nextNodeId: "esc_support",
            isProtective: true,
            consequence: "Disuades al agresor sin confrontación física directa y resguardas a la víctima en un negocio seguro."
          },
          {
            text: "Quedarte mirando con indiferencia o retirarte del lugar.",
            nextNodeId: "esc_ignore",
            isProtective: false,
            consequence: "La falta de solidaridad deja a la persona en vulnerabilidad ante un posible delito en vía pública."
          }
        ]
      },
      esc_support: {
        id: "esc_support",
        context: "Resguardo y Auxilio Inmediato",
        title: "Punto Naranja Activado",
        dialogue: "En el establecimiento comercial activan el protocolo: llaman al 911 y resguardan a la estudiante hasta la llegada de la Policía de Morelia o sus familiares.",
        choices: [
          {
            text: "Proporcionar testimonio respetuoso a las autoridades y avisar a los familiares de la menor.",
            nextNodeId: "esc_safe",
            isProtective: true,
            consequence: "Se garantiza un retorno seguro a casa y se levanta el reporte de vigilancia para la zona."
          }
        ]
      },
      esc_ignore: {
        id: "esc_ignore",
        context: "Inseguridad Colectiva",
        title: "El impacto de la indiferencia",
        dialogue: "Afortunadamente una comerciante intervino a tiempo, pero la experiencia dejó una profunda sensación de miedo en la comunidad escolar.",
        choices: [
          {
            text: "Comprometerse a aplicar la técnica de intervención comunitaria solidaria ante cualquier situación similar.",
            nextNodeId: "esc_safe",
            isProtective: true,
            consequence: "La seguridad comunitaria en Morelia la construimos entre todas y todos con empatía y valentía civil."
          }
        ]
      },
      esc_safe: {
        id: "esc_safe",
        context: "Comunidad Protectora",
        title: "¡Ciudadanía Protectora en Morelia!",
        dialogue: "Una comunidad informada y solidaria previene delitos y cuida a sus niñas, niños y jóvenes.",
        choices: []
      }
    }
  }
};

export default function CirculoConfianza() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("digital");
  const [currentNodeId, setCurrentNodeId] = useState<string>("dig_start");
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
  };

  const handleCopyPhone = (id: string, phone: string) => {
    sound.playClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-white">
            <Users2 className="w-4 h-4 text-emerald-400" /> Nivel Juvenil (14+ años) • Novela Interactiva & AVGM
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
            🤝 Círculo de Confianza y Valentía
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Novela interactiva de toma de decisiones frente a situaciones de violencia escolar, digital o de pareja.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playPowerup();
            setCurrentNodeId(scenario.startNode);
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reiniciar caso actual
        </button>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex flex-wrap gap-2 mt-6">
        <button
          onClick={() => handleScenarioChange("digital")}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
            scenarioKey === "digital" ? "bg-slate-900 text-emerald-400 shadow-md" : "bg-slate-100 text-slate-700"
          }`}
        >
          📱 Caso 1: Violencia Digital (Ley Olimpia)
        </button>
        <button
          onClick={() => handleScenarioChange("noviazgo")}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
            scenarioKey === "noviazgo" ? "bg-slate-900 text-emerald-400 shadow-md" : "bg-slate-100 text-slate-700"
          }`}
        >
          💔 Caso 2: Control en el Noviazgo
        </button>
        <button
          onClick={() => handleScenarioChange("escolar")}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
            scenarioKey === "escolar" ? "bg-slate-900 text-emerald-400 shadow-md" : "bg-slate-100 text-slate-700"
          }`}
        >
          🚍 Caso 3: Acoso Callejero y Punto Naranja
        </button>
      </div>

      {/* Story Stage Box */}
      <div className="mt-5 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <span className="text-[11px] font-black tracking-widest uppercase text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800">
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Toma tu decisión ética:
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
                <div>
                  <span className="font-bold">{choice.text}</span>
                  <p className="text-[11px] text-slate-400 font-normal mt-1 leading-snug">
                    <strong>Consecuencia legal / emocional:</strong> {choice.consequence}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/60 text-emerald-200 text-xs sm:text-sm flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold">¡Caso completado con perspectiva de derechos humanos y no violencia!</p>
              <p className="text-[11px] text-emerald-300 mt-0.5">
                Revisa abajo el directorio de Morelia con teléfonos y ubicaciones de auxilio inmediato.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Directory of Morelia */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-indigo-600" /> Directorio de Auxilio y Denuncia en Morelia, Michoacán
            </h4>
            <p className="text-xs text-slate-500">
              Instituciones oficiales gratuitas y confidenciales ante la Alerta de Violencia de Género (AVGM).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MORELIA_RESOURCES.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-3xl bg-white border-2 border-slate-200/80 hover:border-indigo-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100">
                  {res.scope}
                </span>

                <h5 className="font-black text-slate-900 text-sm mt-2">
                  {res.institution}
                </h5>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {res.description}
                </p>

                {/* Services Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {res.services.map((svc, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      • {svc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                {/* Telephone & Copy */}
                <div className="flex items-center justify-between font-black text-indigo-900">
                  <div className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{res.phone}</span>
                  </div>
                  <button
                    onClick={() => handleCopyPhone(res.id, res.phone)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100"
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
    </div>
  );
}
