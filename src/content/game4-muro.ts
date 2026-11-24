export interface MythBrickSpec {
  myth: string;
  truth: string;
  color: string;
  resistant?: boolean;
}

export const MYTH_BRICKS_POOL: MythBrickSpec[] = [
  { myth: "Los hombres no lloran", truth: "Llorar es una respuesta humana saludable que libera emociones y alivia el dolor.", color: "#f43f5e", resistant: true },
  { myth: "Las niñas son débiles", truth: "La valentía, la fuerza física y la capacidad intelectual no tienen género.", color: "#ec4899" },
  { myth: "El rosa es de niñas", truth: "Los colores son para todas las personas; no tienen género.", color: "#a855f7" },
  { myth: "Cocinar es de mujeres", truth: "Cocinar es una habilidad básica de autonomía y disfrute para cualquier persona.", color: "#6366f1", resistant: true },
  { myth: "Ellas deben aguantar", truth: "Nadie debe tolerar faltas de respeto ni violencia. El cuidado mutuo es regla.", color: "#0ea5e9" },
  { myth: "Celos son amor", truth: "Los celos buscan controlar; el amor sano confía y respeta la libertad.", color: "#10b981", resistant: true },
  { myth: "No es carrera femenina", truth: "Las mujeres lideran ingenierías, ciencia espacial, medicina y tecnología.", color: "#3b82f6", resistant: true },
  { myth: "Los niños pelean", truth: "Resolver conflictos con diálogo y empatía demuestra verdadera madurez.", color: "#0284c7" },
  { myth: "Ellas provocan", truth: "La ropa es libertad personal; el respeto hacia las demás personas es obligatorio.", color: "#e11d48", resistant: true },
  { myth: "Varones mandan", truth: "El liderazgo democrático escucha, coopera y comparte decisiones por igual.", color: "#f59e0b" },
  { myth: "Mujer solo en casa", truth: "Toda persona tiene derecho a elegir su profesión, estudios y proyecto de vida.", color: "#14b8a6" },
  { myth: "Es solo broma", truth: "Si un chiste humilla o discrimina, no es gracioso: perpetúa la desigualdad.", color: "#db2777", resistant: true },
];

export const MURO_TUTORIAL = [
  {
    emoji: "🧱",
    title: "Rompe los mitos machistas",
    description: "Rebota la bola con tu barra usando el mouse, tu dedo o las flechas del teclado para derribar estereotipos.",
  },
  {
    emoji: "⚡",
    title: "Atrapa Power-Ups",
    description: "Al romper ladrillos caen cápsulas especiales: Bola Múltiple (2x), Barra Ancha (↔) y Bola Lenta (🐢).",
  },
  {
    emoji: "💡",
    title: "Descubre la verdad en la tarjeta lateral",
    description: "Cada mito destruido desbloquea su respuesta formativa para reflexionar en familia o escuela.",
  },
];
