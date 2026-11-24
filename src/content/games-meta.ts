import { GameId } from "@/context/ProgressContext";

export type LevelKey = "infantil" | "intermedio" | "juvenil";

export interface WorldTheme {
  key: LevelKey;
  title: string;
  subtitle: string;
  ageRange: string;
  description: string;
  badgeText: string;
  gradientClass: string;
  borderClass: string;
  accentBgClass: string;
  accentTextClass: string;
  pillClass: string;
  pathStroke: string;
}

export interface GameCatalogItem {
  id: GameId;
  order: number;
  title: string;
  shortTitle: string;
  badge: string;
  levelKey: LevelKey;
  levelLabel: string;
  odsTarget: string;
  duration: string;
  difficultyLabel: string;
  description: string;
  learningSummary: string;
  funFact: string;
  funFactSource: string;
  badgeReward: { emoji: string; label: string };
}

export const WORLD_THEMES: Record<LevelKey, WorldTheme> = {
  infantil: {
    key: "infantil",
    title: "Mundo 1 · Valle del Respeto",
    subtitle: "Nivel Infantil (6 a 9 años)",
    ageRange: "6–9 años",
    description:
      "Aventuras alegres sobre los límites de nuestro cuerpo, el trabajo compartido en casa y grandes mujeres pioneras.",
    badgeText: "Verde Menta · Sol · Coral",
    gradientClass: "from-emerald-50 via-amber-50 to-rose-50",
    borderClass: "border-emerald-300",
    accentBgClass: "bg-emerald-500",
    accentTextClass: "text-emerald-800",
    pillClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
    pathStroke: "#10b981",
  },
  intermedio: {
    key: "intermedio",
    title: "Mundo 2 · Ciudad Equidad",
    subtitle: "Nivel Intermedio (10 a 13 años)",
    ageRange: "10–13 años",
    description:
      "Desafíos arcade y simuladores para derrumbar mitos, validar todas las emociones y medir el valor del cuidado.",
    badgeText: "Azul Eléctrico · Turquesa · Naranja",
    gradientClass: "from-blue-50 via-teal-50 to-orange-50",
    borderClass: "border-blue-300",
    accentBgClass: "bg-blue-600",
    accentTextClass: "text-blue-900",
    pillClass: "bg-blue-100 text-blue-900 border-blue-300",
    pathStroke: "#2563eb",
  },
  juvenil: {
    key: "juvenil",
    title: "Mundo 3 · Cumbre Justicia",
    subtitle: "Nivel Juvenil (14+ años)",
    ageRange: "14+ años",
    description:
      "Simulación laboral y novela gráfica interactiva sobre igualdad salarial, Ley Olimpia y redes de apoyo en Morelia.",
    badgeText: "Violeta · Magenta · Índigo",
    gradientClass: "from-violet-50 via-fuchsia-50 to-slate-100",
    borderClass: "border-violet-300",
    accentBgClass: "bg-violet-600",
    accentTextClass: "text-violet-900",
    pillClass: "bg-violet-100 text-violet-900 border-violet-300",
    pathStroke: "#7c3aed",
  },
};

export const GAMES_CATALOG: GameCatalogItem[] = [
  {
    id: "semaforo",
    order: 1,
    title: "1. Semáforo del Respeto",
    shortTitle: "Semáforo del Respeto",
    badge: "Límites Corporales y Autocuidado",
    levelKey: "infantil",
    levelLabel: "Infantil (6–9 años)",
    odsTarget: "Meta 5.2 · Prevención",
    duration: "5 min",
    difficultyLabel: "3 niveles progresivos",
    description:
      "Modo Misión con situaciones cotidianas ilustradas y mapa corporal respetuoso para aprender a decir ¡NO! y pedir ayuda.",
    learningSummary:
      "Tu cuerpo te pertenece solo a ti. Puedes decir ¡NO! ante cualquier contacto o secreto incómodo y contar siempre con una persona adulta de confianza.",
    funFact:
      "Enseñar límites corporales y el nombre respetuoso de las decisiones desde los 6 años fortalece la prevención y reduce el silencio ante situaciones de riesgo.",
    funFactSource: "UNICEF & Protocolo Escolar de Prevención",
    badgeReward: { emoji: "🛡️", label: "Guardián/a del Respeto" },
  },
  {
    id: "balanza",
    order: 2,
    title: "2. La Balanza del Tiempo",
    shortTitle: "La Balanza del Tiempo",
    badge: "Corresponsabilidad en el Hogar",
    levelKey: "infantil",
    levelLabel: "Infantil (6–9 años)",
    odsTarget: "Meta 5.4 · Cuidados y Hogar",
    duration: "6 min",
    difficultyLabel: "3 escenarios + eventos",
    description:
      "Reparte 20 tareas del hogar en una balanza animada con familias diversas y resuelve eventos sorpresa con justicia.",
    learningSummary:
      "Las tareas de la casa no tienen género. Cuando todas las personas en familia colaboran por igual, todas tienen tiempo para descansar, estudiar y jugar.",
    funFact:
      "En México, las mujeres dedican más del doble de horas semanales al trabajo doméstico y de cuidados que los hombres.",
    funFactSource: "INEGI · ENUT (Encuesta Nacional sobre Uso del Tiempo)",
    badgeReward: { emoji: "⚖️", label: "Equilibrista" },
  },
  {
    id: "memorama",
    order: 3,
    title: "3. Memorama de Pioneras",
    shortTitle: "Memorama de Pioneras",
    badge: "Mujeres STEM, Arte e Historia",
    levelKey: "infantil",
    levelLabel: "Infantil (6–9 años)",
    odsTarget: "Meta 5.5 · Liderazgo Pleno",
    duration: "5 min",
    difficultyLabel: "Tableros 3x2, 4x3 y 4x4",
    description:
      "Voltea cartas 3D con retratos ilustrados de científicas, médicas y líderes mexicanas y michoacanas, con modo contrarreloj y combos.",
    learningSummary:
      "Mujeres mexicanas y michoacanas han transformado la ciencia, la medicina, el arte y los derechos humanos. Sus historias abren camino para todas y todos.",
    funFact:
      "De acuerdo con la UNESCO, solo alrededor del 33% de las personas investigadoras científicas en el mundo son mujeres, por lo que visibilizar referentes inspira nuevas vocaciones.",
    funFactSource: "UNESCO · Informe sobre la Ciencia",
    badgeReward: { emoji: "🧠", label: "Historiadora" },
  },
  {
    id: "muro",
    order: 4,
    title: "4. El Muro de los Mitos",
    shortTitle: "El Muro de los Mitos",
    badge: "Erradicación de Estereotipos",
    levelKey: "intermedio",
    levelLabel: "Intermedio (10–13 años)",
    odsTarget: "Meta 5.1 · Igualdad Social",
    duration: "6 min",
    difficultyLabel: "3 niveles arcade + power-ups",
    description:
      "Arcade Breakout con delta-time, bola múltiple, barra ancha y tarjetas laterales que transforman mitos machistas en verdades.",
    learningSummary:
      "Los estereotipos y micromachismos limitan lo que creemos que podemos sentir o lograr. Cuestionarlos abre espacios más libres y respetuosos.",
    funFact:
      "Los estereotipos de género comienzan a internalizarse desde la niñez temprana a través de comentarios cotidianos, juguetes y medios de comunicación.",
    funFactSource: "ONU Mujeres · Campaña HeForShe",
    badgeReward: { emoji: "🧱", label: "Demoledora de Mitos" },
  },
  {
    id: "escudo",
    order: 5,
    title: "5. El Escudo Emocional",
    shortTitle: "El Escudo Emocional",
    badge: "Nuevas Masculinidades y Salud",
    levelKey: "intermedio",
    levelLabel: "Intermedio (10–13 años)",
    odsTarget: "Salud Socioemocional",
    duration: "5 min",
    difficultyLabel: "3 mundos visuales",
    description:
      "Acción 2D en canvas: esquiva mandatos de presión y atrapa emociones válidas como tristeza, empatía y pedir ayuda.",
    learningSummary:
      "Todas las personas tenemos derecho a sentir miedo, tristeza o ternura y a pedir ayuda. Expresar emociones con respeto construye relaciones sanas.",
    funFact:
      "Los mandatos rígidos de 'aguantarse todo' en la adolescencia dificultan pedir apoyo psicológico y aumentan el aislamiento emocional.",
    funFactSource: "OPS / OMS · Salud Adolescente",
    badgeReward: { emoji: "💚", label: "Empática" },
  },
  {
    id: "valor",
    order: 6,
    title: "6. El Valor Invisible",
    shortTitle: "El Valor Invisible",
    badge: "Economía del Cuidado & INEGI",
    levelKey: "intermedio",
    levelLabel: "Intermedio (10–13 años)",
    odsTarget: "Meta 5.4 · 23.9% del PIB",
    duration: "6 min",
    difficultyLabel: "Simulador + Modo Reto",
    description:
      "Calcula el valor económico mensual del trabajo doméstico no remunerado en familias de hasta 5 integrantes y redistribuye la carga.",
    learningSummary:
      "Cocinar, limpiar y cuidar a otras personas sostiene la economía de todo el país, aunque no reciba salario. Reconocerlo y repartirlo es justicia social.",
    funFact:
      "En México, el trabajo no remunerado en labores domésticas y de cuidados equivale al 23.9% del PIB nacional, y más del 72% lo realizan mujeres.",
    funFactSource: "INEGI · Cuenta Satélite del Trabajo No Remunerado",
    badgeReward: { emoji: "📊", label: "Economista del Cuidado" },
  },
  {
    id: "salario",
    order: 7,
    title: "7. A Igual Trabajo, Igual Salario",
    shortTitle: "Igual Trabajo, Igual Salario",
    badge: "LFT Art. 86 & Techo de Cristal",
    levelKey: "juvenil",
    levelLabel: "Juvenil (14+ años)",
    odsTarget: "Meta 5.1 · Paridad Laboral",
    duration: "7 min",
    difficultyLabel: "4 sectores + eventos laborales",
    description:
      "Audita nóminas en 4 sectores, observa la pirámide jerárquica del techo de cristal y responde a licencias y ascensos sin sesgos.",
    learningSummary:
      "El Artículo 86 de la Ley Federal del Trabajo establece salario igual para trabajo igual. Licencias parentales equitativas y ascensos justos benefician a toda la organización.",
    funFact:
      "En México y América Latina persisten brechas de ingreso y menor presencia de mujeres en puestos directivos a causa del llamado 'techo de cristal'.",
    funFactSource: "INEGI / IMCO · Brecha Salarial y LFT Art. 86",
    badgeReward: { emoji: "💼", label: "Auditora Salarial" },
  },
  {
    id: "circulo",
    order: 8,
    title: "8. Círculo de Confianza y Valentía",
    shortTitle: "Círculo de Confianza",
    badge: "Ley Olimpia & Red de Apoyo",
    levelKey: "juvenil",
    levelLabel: "Juvenil (14+ años)",
    odsTarget: "Meta 5.2 & AVGM Morelia",
    duration: "8 min",
    difficultyLabel: "3 casos interactivos",
    description:
      "Novela gráfica con 3 historias sobre violencia digital, noviazgo y acoso escolar, con medidor de apoyo y botón de salida rápida.",
    learningSummary:
      "Difundir imágenes íntimas sin consentimiento es un delito (Ley Olimpia). Ninguna forma de control o violencia en el noviazgo o la escuela es tu culpa.",
    funFact:
      "La Ley Olimpia reconoce la violencia digital en México y sanciona compartir contenido íntimo sin consentimiento, protegiendo la dignidad digital.",
    funFactSource: "Código Penal / Policía Cibernética de Michoacán",
    badgeReward: { emoji: "🤝", label: "Aliada de Confianza" },
  },
];

export function getNextGameId(currentId: GameId): GameId | undefined {
  const idx = GAMES_CATALOG.findIndex((g) => g.id === currentId);
  if (idx === -1 || idx + 1 >= GAMES_CATALOG.length) return undefined;
  return GAMES_CATALOG[idx + 1].id;
}
