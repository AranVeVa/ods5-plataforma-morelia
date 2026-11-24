export type StoryScenarioKey = "digital" | "noviazgo" | "escolar";

export interface StoryChoice {
  text: string;
  nextNodeId: string;
  isProtective: boolean;
  supportDelta: number;
  consequence: string;
  legalOrEmotionalNote: string;
}

export interface StoryNode {
  id: string;
  context: string;
  speaker: string;
  title: string;
  dialogue: string;
  characterMood: "alarm" | "concerned" | "resolute" | "safe";
  isTerminal?: boolean;
  endingQuality?: "ejemplar" | "reflexivo";
  choices: StoryChoice[];
}

export interface StoryScenario {
  key: StoryScenarioKey;
  title: string;
  subtitle: string;
  startNode: string;
  nodes: Record<string, StoryNode>;
}

export interface StoryEngineState {
  scenarioKey: StoryScenarioKey;
  currentNodeId: string;
  supportMeter: number; // 0 to 100
  history: string[];
  lastConsequence: string | null;
  lastNote: string | null;
}

export const STORY_SCENARIOS: Record<StoryScenarioKey, StoryScenario> = {
  digital: {
    key: "digital",
    title: "Caso 1 · Violencia Digital y Ley Olimpia",
    subtitle: "Difusión no consentida de fotografías en chat escolar",
    startNode: "dig_start",
    nodes: {
      dig_start: {
        id: "dig_start",
        context: "Preparatoria en Morelia · Chat Estudiantil",
        speaker: "Sofía (Compañera)",
        title: "Comparten una foto privada sin permiso",
        dialogue:
          "En el grupo de WhatsApp del salón alguien reenvió una foto íntima de nuestra compañera Valeria y piden pasarla a otros grupos. Valeria está llorando y no sabe qué hacer.",
        characterMood: "concerned",
        choices: [
          {
            text: "Frenar la difusión en el chat, guardar capturas como evidencia y acompañar a Valeria con orientación escolar y Policía Cibernética.",
            nextNodeId: "dig_support",
            isProtective: true,
            supportDelta: 25,
            consequence: "Rompes la cadena de complicidad y proteges la evidencia para actuar legalmente.",
            legalOrEmotionalNote: "Ley Olimpia: difundir contenido íntimo sin consentimiento es delito en Michoacán.",
          },
          {
            text: "Ignorar el chat por miedo a burlas o reenviarla para 'preguntar si es real'.",
            nextNodeId: "dig_passive",
            isProtective: false,
            supportDelta: -20,
            consequence: "Reenviar o guardar silencio multiplica el daño emocional sobre la víctima.",
            legalOrEmotionalNote: "Recuerda: la víctima nunca es culpable; compartir también configura delito.",
          },
        ],
      },
      dig_support: {
        id: "dig_support",
        context: "Acompañamiento Seguro",
        speaker: "Orientadora Escolar",
        title: "Construyendo el Círculo de Confianza",
        dialogue:
          "Valeria siente alivio al saber que no está sola. Juntas deciden qué paso dar ahora con su familia y autoridades especializadas en Morelia.",
        characterMood: "resolute",
        choices: [
          {
            text: "Llamar a Policía Cibernética Michoacán (443 322 3600) y acudir al CJM Morelia para bajar los enlaces y recibir apoyo psicológico.",
            nextNodeId: "dig_safe",
            isProtective: true,
            supportDelta: 25,
            consequence: "Se solicita la baja del contenido y se brinda atención jurídica y psicológica gratuita.",
            legalOrEmotionalNote: "Red de protección institucional activa 24/7 en Morelia.",
          },
          {
            text: "Ir a buscar al agresor a golpes a la salida de la escuela.",
            nextNodeId: "dig_detour",
            isProtective: false,
            supportDelta: -15,
            consequence: "La violencia física pone en riesgo tu integridad y desvía la atención del delito digital.",
            legalOrEmotionalNote: "Siempre prioriza rutas seguras, acompañamiento adulto y vías legales.",
          },
        ],
      },
      dig_passive: {
        id: "dig_passive",
        context: "Impacto Emocional",
        speaker: "Valeria",
        title: "El peso del aislamiento",
        dialogue:
          "Al crecer los rumores, Valeria dejó de venir a clases. Todavía estás a tiempo de cambiar la historia y actuar con solidaridad.",
        characterMood: "alarm",
        choices: [
          {
            text: "Borrar cualquier copia, denunciar las cuentas y ofrecer acompañamiento sincero con adultos de confianza.",
            nextNodeId: "dig_reflexive",
            isProtective: true,
            supportDelta: 20,
            consequence: "Rectificar a tiempo reconstruye la red de apoyo y detiene la revictimización.",
            legalOrEmotionalNote: "Nunca es tarde para pedir ayuda y reparar la convivencia escolar.",
          },
        ],
      },
      dig_detour: {
        id: "dig_detour",
        context: "Aprendizaje Reflexivo",
        speaker: "Axo & Orientación",
        title: "Cuidar sin ponerte en peligro",
        dialogue:
          "Confrontar violentamente generó sanciones escolares. Ahora entienden que el respaldo institucional protege mejor a Valeria y a ti.",
        characterMood: "concerned",
        choices: [
          {
            text: "Canalizar formalmente el reporte ante Policía Cibernética y familiares.",
            nextNodeId: "dig_reflexive",
            isProtective: true,
            supportDelta: 20,
            consequence: "Encauzas la situación hacia una solución segura y protectora.",
            legalOrEmotionalNote: "Confía en adultos protectores y autoridades especializadas.",
          },
        ],
      },
      dig_safe: {
        id: "dig_safe",
        context: "Final Ejemplar",
        speaker: "Valeria y Red de Apoyo",
        title: "¡Justicia Digital y Solidaridad!",
        dialogue:
          "Gracias a tu acompañamiento, la familia de Valeria activó la Ley Olimpia, se eliminaron los archivos y recibió apoyo emocional.",
        characterMood: "safe",
        isTerminal: true,
        endingQuality: "ejemplar",
        choices: [],
      },
      dig_reflexive: {
        id: "dig_reflexive",
        context: "Final Reflexivo",
        speaker: "Comunidad Escolar",
        title: "Aprender a ser aliado/a",
        dialogue:
          "Aunque hubo tropiezos al principio, elegiste pedir ayuda a tiempo y apoyar a Valeria sin juzgarla.",
        characterMood: "safe",
        isTerminal: true,
        endingQuality: "reflexivo",
        choices: [],
      },
    },
  },
  noviazgo: {
    key: "noviazgo",
    title: "Caso 2 · Control y Celos en el Noviazgo",
    subtitle: "Señales tempranas de violencia psicológica y aislamiento",
    startNode: "nov_start",
    nodes: {
      nov_start: {
        id: "nov_start",
        context: "Secundaria / Preparatoria · Vínculos Afectivos",
        speaker: "Camila (Amiga)",
        title: "Exigencia de contraseñas y ubicación",
        dialogue:
          "Mi pareja revisa mi celular todos los días, se enoja si hablo con amigos de clase y me pide fotos de mi ropa antes de salir. Dice que lo hace porque me ama muchísimo.",
        characterMood: "concerned",
        choices: [
          {
            text: "Escucharla sin juzgar, explicarle que los celos y el control no son amor, y explorar juntas el Violentómetro.",
            nextNodeId: "nov_support",
            isProtective: true,
            supportDelta: 25,
            consequence: "Visibilizas las señales de alerta antes de que escale el aislamiento.",
            legalOrEmotionalNote: "El amor sano respeta privacidad, amistades y decisiones propias.",
          },
          {
            text: "Decirle que es normal que haya celos en una relación seria.",
            nextNodeId: "nov_normalize",
            isProtective: false,
            supportDelta: -20,
            consequence: "Normalizar el control hace más difícil reconocer la violencia psicológica.",
            legalOrEmotionalNote: "Ninguna persona tiene derecho a vigilarte ni aislar tus vínculos.",
          },
        ],
      },
      nov_support: {
        id: "nov_support",
        context: "Fortalecimiento Emocional",
        speaker: "Camila",
        title: "Recuperar libertad y red de confianza",
        dialogue:
          "Camila nota que siente miedo constante a que su pareja se enoje. Decide contarle a su mamá y buscar acompañamiento juvenil en Morelia.",
        characterMood: "resolute",
        choices: [
          {
            text: "Acompañarla a hablar con un adulto de confianza y acercarse a IMMUJERIS o Línea Mujeres (800 108 4053).",
            nextNodeId: "nov_safe",
            isProtective: true,
            supportDelta: 25,
            consequence: "Establecen límites seguros con respaldo familiar y orientación profesional.",
            legalOrEmotionalNote: "Pedir ayuda temprana previene la escalada de violencia.",
          },
        ],
      },
      nov_normalize: {
        id: "nov_normalize",
        context: "Señal de Alerta",
        speaker: "Camila",
        title: "Cuando el aislamiento crece",
        dialogue:
          "Un mes después, Camila dejó de salir al recreo y bajó sus calificaciones porque su pareja le prohíbe hablar con el grupo.",
        characterMood: "alarm",
        choices: [
          {
            text: "Acercarte con empatía, recordarle que no es su culpa y compartirle apoyo adulto y líneas gratuitas.",
            nextNodeId: "nov_reflexive",
            isProtective: true,
            supportDelta: 25,
            consequence: "Tu escucha respetuosa abre la puerta para que Camila recupere su tranquilidad.",
            legalOrEmotionalNote: "Confiar en un adulto de confianza rompe el ciclo de aislamiento.",
          },
        ],
      },
      nov_safe: {
        id: "nov_safe",
        context: "Final Ejemplar",
        speaker: "Camila",
        title: "¡Relaciones Libres y Respetuosas!",
        dialogue:
          "Camila conversó con su familia, recibió orientación en IMMUJERIS Morelia y aprendió que el cariño verdadero nunca da miedo.",
        characterMood: "safe",
        isTerminal: true,
        endingQuality: "ejemplar",
        choices: [],
      },
      nov_reflexive: {
        id: "nov_reflexive",
        context: "Final Reflexivo",
        speaker: "Camila",
        title: "Romper el aislamiento a tiempo",
        dialogue:
          "Con apoyo empático, Camila reconoció las banderas rojas y buscó orientación con su familia.",
        characterMood: "safe",
        isTerminal: true,
        endingQuality: "reflexivo",
        choices: [],
      },
    },
  },
  escolar: {
    key: "escolar",
    title: "Caso 3 · Acoso Escolar y Espacio Público",
    subtitle: "Intervención solidaria segura y Puntos Naranja en Morelia",
    startNode: "esc_start",
    nodes: {
      esc_start: {
        id: "esc_start",
        context: "Salida Escolar · Parada de Transporte en Morelia",
        speaker: "Lucía (Estudiante)",
        title: "Acoso insistente en la vía pública",
        dialogue:
          "Al salir de clase, ves que un adulto desconocido acorrala verbalmente a una estudiante en la parada de camión con comentarios incómodos.",
        characterMood: "concerned",
        choices: [
          {
            text: "Aplicar distracción segura: acercarte saludándola como conocida ('¡Hola Lucía, vamos!') e ingresar juntas a un comercio Punto Naranja o regresar al plantel.",
            nextNodeId: "esc_support",
            isProtective: true,
            supportDelta: 25,
            consequence: "Desactivas el riesgo sin confrontación física y llevas a la compañera a un espacio seguro.",
            legalOrEmotionalNote: "En Morelia existen comercios Punto Naranja capacitados para resguardo.",
          },
          {
            text: "Seguir de largo fingiendo que no viste nada.",
            nextNodeId: "esc_ignore",
            isProtective: false,
            supportDelta: -20,
            consequence: "La indiferencia deja en mayor vulnerabilidad a quien sufre acoso.",
            legalOrEmotionalNote: "Cuidarnos colectivamente hace más seguras nuestras rutas escolares.",
          },
        ],
      },
      esc_support: {
        id: "esc_support",
        context: "Protocolo Punto Naranja",
        speaker: "Encargada del Punto Naranja",
        title: "Resguardo y aviso familiar",
        dialogue:
          "Dentro del comercio capacitado resguardan a Lucía, avisan a su familia y reportan al 911 Código Violeta para vigilancia de la ruta escolar.",
        characterMood: "resolute",
        choices: [
          {
            text: "Permanecer acompañando hasta que lleguen sus familiares o la escuela tome conocimiento.",
            nextNodeId: "esc_safe",
            isProtective: true,
            supportDelta: 25,
            consequence: "Aseguras acompañamiento solidario y prevención comunitaria.",
            legalOrEmotionalNote: "El trabajo entre estudiantes, escuelas y familias protege a toda la comunidad.",
          },
        ],
      },
      esc_ignore: {
        id: "esc_ignore",
        context: "Reflexión Ciudadana",
        speaker: "Prefectura Escolar",
        title: "La fuerza de la solidaridad segura",
        dialogue:
          "Otra persona auxilió a Lucía, y en la escuela organizaron un taller sobre cómo intervenir de forma segura sin exponerse.",
        characterMood: "alarm",
        choices: [
          {
            text: "Comprometerte a usar tácticas seguras (acompañar, buscar un adulto o Punto Naranja y llamar al 911).",
            nextNodeId: "esc_reflexive",
            isProtective: true,
            supportDelta: 20,
            consequence: "Aprendes estrategias prácticas de apoyo comunitario.",
            legalOrEmotionalNote: "Nunca te pongas en riesgo físico: busca siempre respaldo adulto o institucional.",
          },
        ],
      },
      esc_safe: {
        id: "esc_safe",
        context: "Final Ejemplar",
        speaker: "Lucía",
        title: "¡Círculo de Valentía Activo!",
        dialogue:
          "Tu rápida acción solidaria protegió a Lucía y activó el protocolo escolar de rutas seguras en Morelia.",
        characterMood: "safe",
        isTerminal: true,
        endingQuality: "ejemplar",
        choices: [],
      },
      esc_reflexive: {
        id: "esc_reflexive",
        context: "Final Reflexivo",
        speaker: "Comunidad Estudiantil",
        title: "De espectador/a a aliado/a seguro/a",
        dialogue:
          "Conoces ahora cómo actuar con seguridad y empatía cuando alguien necesita apoyo en la escuela o la calle.",
        characterMood: "safe",
        isTerminal: true,
        endingQuality: "reflexivo",
        choices: [],
      },
    },
  },
};

/**
 * Función pura de transición de la máquina de estados finitos (testeable con Vitest).
 */
export function transitionStoryState(
  state: StoryEngineState,
  choiceIndex: number
): StoryEngineState {
  const scenario = STORY_SCENARIOS[state.scenarioKey];
  const node = scenario.nodes[state.currentNodeId];
  if (!node || node.choices.length === 0) return state;

  const choice = node.choices[choiceIndex];
  if (!choice) return state;

  const nextSupport = Math.max(0, Math.min(100, state.supportMeter + choice.supportDelta));
  return {
    scenarioKey: state.scenarioKey,
    currentNodeId: choice.nextNodeId,
    supportMeter: nextSupport,
    history: [...state.history, state.currentNodeId],
    lastConsequence: choice.consequence,
    lastNote: choice.legalOrEmotionalNote,
  };
}

export function createInitialStoryState(scenarioKey: StoryScenarioKey): StoryEngineState {
  return {
    scenarioKey,
    currentNodeId: STORY_SCENARIOS[scenarioKey].startNode,
    supportMeter: 50,
    history: [],
    lastConsequence: null,
    lastNote: null,
  };
}

export const CIRCULO_TUTORIAL = [
  {
    emoji: "📖",
    title: "Elige entre 3 historias reales",
    description: "Explora casos sobre violencia digital (Ley Olimpia), control en el noviazgo y acoso en el transporte escolar.",
  },
  {
    emoji: "🤝",
    title: "Cuida el Medidor de Apoyo",
    description: "Tus decisiones cambian el rumbo de la historia, muestran consecuencias legales/emocionales y fortalecen la red de confianza.",
  },
  {
    emoji: "🚪",
    title: "Espacio seguro con Salida Rápida",
    description: "Si algún tema te remueve emociones, puedes usar el botón de Salida Rápida o consultar el directorio oficial de Morelia.",
  },
];
