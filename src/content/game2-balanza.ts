export interface BalanceTask {
  id: string;
  name: string;
  category: "cuidado" | "hogar" | "estudio" | "descanso" | "trabajo";
  hours: number;
  effortWeight: number;
  assignedTo: "left" | "right";
  icon: string;
  description: string;
}

export type BalanceMode = "hijos" | "padres";

export interface FamilyProfile {
  id: string;
  mode: BalanceMode;
  title: string;
  subtitle: string;
  description: string;
  leftName: string;
  leftRole: string;
  leftEmoji: string;
  rightName: string;
  rightRole: string;
  rightEmoji: string;
}

export interface SurpriseEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  addedTasks: BalanceTask[];
}

export const FAMILY_PROFILES: FamilyProfile[] = [
  {
    id: "hijos",
    mode: "hijos",
    title: "Modo Hijos (Hermana y Hermano)",
    subtitle: "Sofía y Mateo en edad escolar",
    description: "Equilibra tareas de la casa, tareas escolares y el tiempo para jugar y descansar.",
    leftName: "Sofía",
    leftRole: "Hermana (8 años)",
    leftEmoji: "👧🏽",
    rightName: "Mateo",
    rightRole: "Hermano (9 años)",
    rightEmoji: "👦🏽",
  },
  {
    id: "padres",
    mode: "padres",
    title: "Modo Padres (Mamá y Papá)",
    subtitle: "Laura y Carlos compartiendo el hogar",
    description: "Distribuye la cocina, el aseo, los cuidados y el empleo para que ambos tengan tiempo libre.",
    leftName: "Mamá (Laura)",
    leftRole: "Madre",
    leftEmoji: "👩🏽",
    rightName: "Papá (Carlos)",
    rightRole: "Padre",
    rightEmoji: "👨🏽",
  },
];

// 12 tareas específicas para Hijos
export const TASKS_HIJOS: BalanceTask[] = [
  // Tareas de Hogar / Cuidados
  { id: "h1", name: "Lavar sus trastes del desayuno", category: "hogar", hours: 1, effortWeight: 2, assignedTo: "left", icon: "🍽️", description: "Higiene de platos y cocina." },
  { id: "h2", name: "Barrer la entrada y el patio", category: "hogar", hours: 1, effortWeight: 2, assignedTo: "left", icon: "🧹", description: "Cuidado del espacio común." },
  { id: "h3", name: "Recoger y guardar los juguetes", category: "hogar", hours: 1, effortWeight: 1, assignedTo: "left", icon: "🧸", description: "Orden en la recámara." },
  { id: "h4", name: "Tender su cama al levantarse", category: "hogar", hours: 0.5, effortWeight: 1, assignedTo: "left", icon: "🛏️", description: "Hábito de orden personal." },
  { id: "h5", name: "Pasear al perro en el parque", category: "cuidado", hours: 1, effortWeight: 1, assignedTo: "left", icon: "🐕", description: "Cuidado de la mascota." },
  { id: "h6", name: "Sacar la basura clasificada", category: "hogar", hours: 0.5, effortWeight: 1, assignedTo: "right", icon: "🗑️", description: "Traslado de residuos." },
  { id: "h7", name: "Regar las plantas y flores", category: "hogar", hours: 0.5, effortWeight: 1, assignedTo: "right", icon: "🌱", description: "Cuidado ambiental." },
  { id: "h8", name: "Ayudar a poner la mesa", category: "hogar", hours: 0.5, effortWeight: 1, assignedTo: "right", icon: "🥣", description: "Colaboración antes de comer." },

  // Estudio
  { id: "h9", name: "Hacer tarea de matemáticas", category: "estudio", hours: 1.5, effortWeight: 2, assignedTo: "left", icon: "📐", description: "Compromiso académico." },
  { id: "h10", name: "Estudiar para examen de ciencias", category: "estudio", hours: 1.5, effortWeight: 2, assignedTo: "right", icon: "📚", description: "Tiempo de estudio." },

  // Descanso y Juego (¡Inicialmente desequilibrado para que el niño lo nivele!)
  { id: "h11", name: "Tarde de descanso y siesta", category: "descanso", hours: 1.5, effortWeight: 0, assignedTo: "left", icon: "🛋️", description: "Descanso reparador." },
  { id: "h12", name: "Jugar videojuegos y recreación", category: "descanso", hours: 3.5, effortWeight: 0, assignedTo: "right", icon: "🎮", description: "Juegos y diversión." },
  { id: "h13", name: "Salir a jugar fútbol y bici", category: "descanso", hours: 2, effortWeight: 0, assignedTo: "right", icon: "⚽", description: "Deporte al aire libre." },
  { id: "h14", name: "Ver caricaturas y relajarse", category: "descanso", hours: 1.5, effortWeight: 0, assignedTo: "left", icon: "📺", description: "Tiempo de recreación." },
];

// 14 tareas específicas para Padres
export const TASKS_PADRES: BalanceTask[] = [
  // Hogar / Cuidados
  { id: "p1", name: "Cocinar la comida familiar", category: "hogar", hours: 2, effortWeight: 3, assignedTo: "left", icon: "🍲", description: "Preparación de alimentos nutritivos." },
  { id: "p2", name: "Trapear sala y recámaras", category: "hogar", hours: 1.5, effortWeight: 3, assignedTo: "left", icon: "🧽", description: "Limpieza profunda." },
  { id: "p3", name: "Cuidar y alimentar al bebé", category: "cuidado", hours: 2.5, effortWeight: 3, assignedTo: "left", icon: "🍼", description: "Atención y afecto al bebé." },
  { id: "p4", name: "Acompañar a la abuelita con medicinas", category: "cuidado", hours: 1.5, effortWeight: 2, assignedTo: "left", icon: "👵", description: "Cuidado de personas mayores." },
  { id: "p5", name: "Lavar y tender sábanas y ropa", category: "hogar", hours: 1.5, effortWeight: 2, assignedTo: "left", icon: "🧺", description: "Lavandería del hogar." },
  { id: "p6", name: "Comprar la despensa en el mercado", category: "hogar", hours: 1.5, effortWeight: 2, assignedTo: "right", icon: "🛒", description: "Abastecimiento familiar." },
  { id: "p7", name: "Revisar tareas de las hijas/hijos", category: "cuidado", hours: 1, effortWeight: 2, assignedTo: "right", icon: "📖", description: "Acompañamiento escolar." },
  { id: "p8", name: "Preparar desayunos y mochilas", category: "hogar", hours: 1, effortWeight: 2, assignedTo: "right", icon: "🥪", description: "Organización matutina." },

  // Trabajo fuera
  { id: "p9", name: "Jornada laboral de empleo", category: "trabajo", hours: 4, effortWeight: 2, assignedTo: "left", icon: "💼", description: "Trabajo remunerado fuera de casa." },
  { id: "p10", name: "Jornada laboral de empleo", category: "trabajo", hours: 4, effortWeight: 2, assignedTo: "right", icon: "💼", description: "Trabajo remunerado fuera de casa." },

  // Descanso y Tiempo Libre
  { id: "p11", name: "Ver una serie o película favorita", category: "descanso", hours: 1.5, effortWeight: 0, assignedTo: "left", icon: "🎬", description: "Tiempo de relajación." },
  { id: "p12", name: "Tiempo libre para café o charla", category: "descanso", hours: 3, effortWeight: 0, assignedTo: "right", icon: "☕", description: "Descanso y convivencia." },
  { id: "p13", name: "Salir a caminar o hacer ejercicio", category: "descanso", hours: 2, effortWeight: 0, assignedTo: "right", icon: "🏃", description: "Salud física y mental." },
  { id: "p14", name: "Lectura y siesta reparadora", category: "descanso", hours: 1.5, effortWeight: 0, assignedTo: "left", icon: "📖", description: "Descanso personal." },
];

export const SURPRISE_EVENTS: SurpriseEvent[] = [
  {
    id: "baby",
    title: "¡Evento Sorpresa: Llegó un bebé a casa!",
    description: "El recién nacido requiere 3 horas extras de biberón, pañales y vigilancia. ¿Quién las asumirá para no sobrecargar a una sola persona?",
    emoji: "👶",
    addedTasks: [
      { id: "ev-baby-1", name: "Preparar biberones y arrullar al bebé", category: "cuidado", hours: 2, effortWeight: 3, assignedTo: "left", icon: "🍼", description: "Cuidado infantil nocturno/diurno." },
      { id: "ev-baby-2", name: "Lavar ropita y cobijas del bebé", category: "cuidado", hours: 1, effortWeight: 2, assignedTo: "left", icon: "🧷", description: "Higiene del bebé." },
    ],
  },
  {
    id: "flu",
    title: "¡Evento Sorpresa: Alguien pescó gripe!",
    description: "Se necesita preparar té, tomar la temperatura y limpiar los cuartos. ¡Reparte los cuidados con justicia!",
    emoji: "🤒",
    addedTasks: [
      { id: "ev-flu-1", name: "Preparar sopa caliente y dar medicina", category: "cuidado", hours: 1.5, effortWeight: 2, assignedTo: "left", icon: "🍵", description: "Cuidado de salud en casa." },
      { id: "ev-flu-2", name: "Desinfectar mesa y cambiar sábanas", category: "hogar", hours: 1, effortWeight: 2, assignedTo: "left", icon: "🧼", description: "Higiene preventiva." },
    ],
  },
];

export interface BalanceEvaluation {
  leftChoreHours: number;
  rightChoreHours: number;
  leftFreeHours: number;
  rightFreeHours: number;
  leftStudyHours: number;
  rightStudyHours: number;
  leftWorkHours: number;
  rightWorkHours: number;
  choreDiff: number;
  restDiff: number;
  isChoreBalanced: boolean;
  isRestBalanced: boolean;
  isBalanced: boolean;
  rotationDeg: number;
  feedbackMessage: string;
}

/**
 * Función pura evaluadora del equilibrio de la balanza.
 * Exige que TANTO el trabajo del hogar COMO el descanso y juego estén nivelados.
 */
export function evaluateBalance(tasks: BalanceTask[]): BalanceEvaluation {
  const left = tasks.filter((t) => t.assignedTo === "left");
  const right = tasks.filter((t) => t.assignedTo === "right");

  const sumHours = (arr: BalanceTask[], cats: BalanceTask["category"][]) =>
    arr.filter((t) => cats.includes(t.category)).reduce((acc, t) => acc + t.hours, 0);

  const leftChoreHours = sumHours(left, ["hogar", "cuidado"]);
  const rightChoreHours = sumHours(right, ["hogar", "cuidado"]);
  const leftFreeHours = sumHours(left, ["descanso"]);
  const rightFreeHours = sumHours(right, ["descanso"]);
  const leftStudyHours = sumHours(left, ["estudio"]);
  const rightStudyHours = sumHours(right, ["estudio"]);
  const leftWorkHours = sumHours(left, ["trabajo"]);
  const rightWorkHours = sumHours(right, ["trabajo"]);

  const choreDiff = Number(Math.abs(leftChoreHours - rightChoreHours).toFixed(1));
  const restDiff = Number(Math.abs(leftFreeHours - rightFreeHours).toFixed(1));

  const isChoreBalanced = choreDiff <= 1.5;
  const isRestBalanced = restDiff <= 1.5;
  const bothHaveMinRest = leftFreeHours >= 2.0 && rightFreeHours >= 2.0;

  // Está equilibrado solo cuando hogar Y descanso están parejos y ambos descansan al menos 2 horas
  const isBalanced = isChoreBalanced && isRestBalanced && bothHaveMinRest;

  // Inclinación visual según la sobrecarga combinada de tareas
  const rawDiff = leftChoreHours - rightChoreHours;
  const rotationDeg = Math.max(-18, Math.min(18, -rawDiff * 3));

  let feedbackMessage = "";
  if (isBalanced) {
    feedbackMessage =
      "¡Equilibrio perfecto! Tanto las tareas del hogar como las horas de descanso y juego están repartidas por igual. ¡Nadie se sobrecarga y todas y todos descansan!";
  } else if (!isChoreBalanced) {
    if (leftChoreHours > rightChoreHours) {
      feedbackMessage = `La primera persona carga con ${choreDiff}h más de tareas del hogar. Pasa algunas labores a la derecha para emparejar.`;
    } else {
      feedbackMessage = `La segunda persona tiene ${choreDiff}h más de tareas domésticas. Reparte hacia la izquierda para emparejar.`;
    }
  } else if (!isRestBalanced) {
    feedbackMessage = `¡Cuidado con el descanso! Las tareas están parejas, pero el descanso no: una persona tiene ${leftFreeHours}h y la otra ${rightFreeHours}h. Para que sea justo, ¡la hija o la mamá también tienen derecho a jugar y descansar igual!`;
  } else if (!bothHaveMinRest) {
    feedbackMessage =
      "Una de las personas tiene muy poco tiempo libre (menos de 2h). Todas y todos necesitan descansar y divertirse.";
  }

  return {
    leftChoreHours,
    rightChoreHours,
    leftFreeHours,
    rightFreeHours,
    leftStudyHours,
    rightStudyHours,
    leftWorkHours,
    rightWorkHours,
    choreDiff,
    restDiff,
    isChoreBalanced,
    isRestBalanced,
    isBalanced,
    rotationDeg,
    feedbackMessage,
  };
}

export const BALANZA_TUTORIAL = [
  {
    emoji: "⚖️",
    title: "Elige entre Hijos o Padres",
    description: "Puedes elegir jugar con la hermana y hermano o con mamá y papá, cada quien con sus actividades reales.",
  },
  {
    emoji: "🎮",
    title: "Nivela también el descanso y juego",
    description: "No basta con repartir la limpieza: ¡la hija o la mamá también deben tener las mismas horas para jugar, descansar y divertirse!",
  },
  {
    emoji: "🤝",
    title: "Mueve tareas hasta equilibrar",
    description: "Usa los botones 'Mover' o arrastra las tarjetas para que ambos lados tengan tareas y descanso equivalentes.",
  },
];
