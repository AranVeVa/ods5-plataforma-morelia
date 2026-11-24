export interface EmotionEntityData {
  text: string;
  shortLabel: string;
  icon: string;
  explanation: string;
}

export const HEALTHY_EMOTIONS_POOL: EmotionEntityData[] = [
  { text: "Llorar ante la tristeza", shortLabel: "Tristeza", icon: "💧", explanation: "Llorar libera tensión emocional y nos ayuda a sanar; todas las personas sienten tristeza." },
  { text: "Pedir ayuda a tiempo", shortLabel: "Pedir ayuda", icon: "🤝", explanation: "Pedir apoyo demuestra inteligencia emocional y confianza en nuestra comunidad." },
  { text: "Reconocer mi miedo", shortLabel: "Miedo", icon: "🛡️", explanation: "El miedo avisa ante peligros reales y nos permite buscar protección." },
  { text: "Expresar empatía y ternura", shortLabel: "Empatía", icon: "🌸", explanation: "Cuidar a otras personas con amabilidad es fortaleza humana, no debilidad." },
  { text: "Hablar de lo que siento", shortLabel: "Diálogo", icon: "💬", explanation: "Poner palabras a las emociones evita que se conviertan en enojo o aislamiento." },
  { text: "Buscar un abrazo seguro", shortLabel: "Afecto", icon: "🤗", explanation: "El afecto consensuado fortalece la salud mental y el bienestar." },
];

export const TOXIC_MANDATES_POOL: EmotionEntityData[] = [
  { text: "Los hombres no lloran", shortLabel: "No llores", icon: "🛑", explanation: "Mandato dañino que obliga a reprimir el dolor y dificulta pedir apoyo." },
  { text: "Aguántate en silencio", shortLabel: "Cállate", icon: "🚫", explanation: "Guardar todo en silencio aumenta la ansiedad; hablar libera y protege." },
  { text: "Resuelve a golpes", shortLabel: "Violencia", icon: "👊", explanation: "La violencia nunca resuelve desacuerdos; el diálogo sí construye paz." },
  { text: "Sentir es de débiles", shortLabel: "Frialdad", icon: "⛔", explanation: "Todas las personas tienen emociones válidas sin importar su género." },
  { text: "Siempre debes mandar", shortLabel: "Imposición", icon: "⚠️", explanation: "Las relaciones sanas se basan en igualdad, nunca en imponer." },
];

export interface VisualWorldConfig {
  id: number;
  name: string;
  skyTop: string;
  skyBottom: string;
  groundColor: string;
  accent: string;
  speedMultiplier: number;
}

export const ESCUDO_WORLDS: VisualWorldConfig[] = [
  {
    id: 1,
    name: "Mundo 1 · Patio Escolar",
    skyTop: "#e0f2fe",
    skyBottom: "#bae6fd",
    groundColor: "#10b981",
    accent: "#0284c7",
    speedMultiplier: 1.0,
  },
  {
    id: 2,
    name: "Mundo 2 · Parque Bosque Cuauhtémoc",
    skyTop: "#dcfce7",
    skyBottom: "#fef9c3",
    groundColor: "#15803d",
    accent: "#f97316",
    speedMultiplier: 1.25,
  },
  {
    id: 3,
    name: "Mundo 3 · Ciudad Digital Nocturna",
    skyTop: "#1e1b4b",
    skyBottom: "#312e81",
    groundColor: "#4338ca",
    accent: "#38bdf8",
    speedMultiplier: 1.5,
  },
];

export const ESCUDO_TUTORIAL = [
  {
    emoji: "💚",
    title: "Atrapa emociones válidas",
    description: "Muévete a los lados para recoger tristeza, empatía, diálogo y pedir ayuda. Aumentan tu bienestar.",
  },
  {
    emoji: "🛡️",
    title: "Escudo Protector Automático",
    description: "Tu escudo repele automáticamente los mandatos tóxicos usando su energía, la cual se recarga sola con el tiempo.",
  },
  {
    emoji: "📖",
    title: "Léelos al final con calma",
    description: "Al terminar el juego, podrás leer con calma todas las emociones y mandatos desmentidos junto a tu puntuación.",
  },
];
