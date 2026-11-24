export type TrafficColor = "green" | "yellow" | "red";

export interface SemaforoSituation {
  id: number;
  title: string;
  situation: string;
  sceneType:
    | "high_five"
    | "unwanted_hug"
    | "bad_secret"
    | "doctor_visit"
    | "tickles"
    | "photo_no_permission"
    | "online_gift"
    | "friendly_wave"
    | "pushed_in_line"
    | "hair_pull"
    | "coach_respect"
    | "stranger_car";
  correctColor: TrafficColor;
  explanation: string;
  axoTip: string;
  difficultyMin: "facil" | "normal" | "reto";
}

export interface BodyZoneInfo {
  id: "head" | "hands" | "shoulders" | "chest_hip" | "legs";
  label: string;
  defaultSafe: TrafficColor;
  rule: string;
  examples: string;
}

export interface TrustedAdultOption {
  id: string;
  name: string;
  role: string;
  emoji: string;
  isTrusted: boolean;
  feedback: string;
}

export const SEMAFORO_SITUATIONS: SemaforoSituation[] = [
  {
    id: 1,
    title: "Chocar las cinco",
    situation:
      "Tu amiga anota un punto en educación física y te extiende la mano sonriendo para chocar las cinco. Tú también quieres celebrar.",
    sceneType: "high_five",
    correctColor: "green",
    explanation:
      "¡Verde! Chocar las manos cuando ambas personas quieren celebrar es seguro, divertido y respetuoso.",
    axoTip: "El contacto respetuoso siempre nace de estar de acuerdo.",
    difficultyMin: "facil",
  },
  {
    id: 2,
    title: "Abrazo sin ganas",
    situation:
      "Llega una visita a casa y te pide un abrazo fuerte, pero hoy no tienes ganas de que te abracen.",
    sceneType: "unwanted_hug",
    correctColor: "yellow",
    explanation:
      "¡Amarillo! Tú decides sobre tu cuerpo. Puedes decir con calma: 'Hoy prefiero saludar de lejitos o con la mano'.",
    axoTip: "Nadie puede obligarte a dar abrazos o besos si no quieres.",
    difficultyMin: "facil",
  },
  {
    id: 3,
    title: "Secreto que incomoda",
    situation:
      "Alguien te pide guardar un 'secreto especial' sobre tocarte debajo de la ropa y te dice que no le cuentes a tu familia.",
    sceneType: "bad_secret",
    correctColor: "red",
    explanation:
      "¡Rojo total! Los secretos que te dan miedo, pena o involucran tu cuerpo NUNCA se guardan. Aléjate y cuéntalo a un adulto de confianza.",
    axoTip: "Mi cuerpo es mío y nunca es mi culpa. ¡Rompe el secreto!",
    difficultyMin: "facil",
  },
  {
    id: 4,
    title: "Revisión médica acompañada",
    situation:
      "Tienes fiebre y vas al consultorio. La doctora te explica qué va a revisar con tu estetoscopio mientras tu mamá o papá está contigo.",
    sceneType: "doctor_visit",
    correctColor: "green",
    explanation:
      "¡Verde! Cuidar tu salud es seguro cuando una persona profesional te explica con respeto y tu mamá, papá o tutor te acompaña.",
    axoTip: "En el médico siempre tienes derecho a estar acompañado/a y hacer preguntas.",
    difficultyMin: "facil",
  },
  {
    id: 5,
    title: "Cosquillas que no paran",
    situation:
      "Un conocido te hace cosquillas. Aunque ya le dijiste '¡Basta, ya no me gusta!', sigue haciéndolo.",
    sceneType: "tickles",
    correctColor: "red",
    explanation:
      "¡Rojo! Cuando dices 'NO' o 'Basta', la otra persona debe detenerse al instante. Si insiste, aléjate y avisa a un adulto de confianza.",
    axoTip: "¡NO significa NO, incluso en juegos o cosquillas!",
    difficultyMin: "facil",
  },
  {
    id: 6,
    title: "Foto sin tu permiso",
    situation:
      "En una fiesta o en el salón, alguien intenta tomarte fotos o videos de cerca sin preguntarte, aunque te tapas la cara.",
    sceneType: "photo_no_permission",
    correctColor: "red",
    explanation:
      "¡Rojo! Nadie debe tomar ni compartir fotos tuyas si tú no quieres o te sientes incómodo/a. Pide ayuda a tu maestra o familia.",
    axoTip: "Tu imagen y privacidad también forman parte de tus límites.",
    difficultyMin: "facil",
  },
  {
    id: 7,
    title: "Saludo amable con la mano",
    situation:
      "Tu vecina te saluda desde la banqueta moviendo la mano con una sonrisa cuando vas camino a la escuela en Morelia.",
    sceneType: "friendly_wave",
    correctColor: "green",
    explanation:
      "¡Verde! Un saludo cordial a distancia, sin invadir tu espacio personal, es amable y seguro.",
    axoTip: "La cortesía nunca invade tu espacio personal.",
    difficultyMin: "normal",
  },
  {
    id: 8,
    title: "Regalo por internet a cambio de foto",
    situation:
      "Mientras juegas en una tablet, una persona desconocida te ofrece monedas del juego si le mandas una foto tuya en pijama.",
    sceneType: "online_gift",
    correctColor: "red",
    explanation:
      "¡Rojo total! Nunca envíes fotos ni aceptes regalos de desconocidos en internet. Cierra el chat y avisa de inmediato a mamá, papá o tutores.",
    axoTip: "En internet también existen semáforos rojos. ¡Avisa a tu familia!",
    difficultyMin: "normal",
  },
  {
    id: 9,
    title: "Empujones en la fila",
    situation:
      "Al salir al recreo, un compañero más grande te empuja repetidamente contra la pared aunque le pides espacio.",
    sceneType: "pushed_in_line",
    correctColor: "red",
    explanation:
      "¡Rojo! Empujar o lastimar el cuerpo de otra persona nunca es un juego válido. Busca apoyo de tu maestra o prefectura.",
    axoTip: "Nadie tiene derecho a lastimarte ni intimidarte.",
    difficultyMin: "normal",
  },
  {
    id: 10,
    title: "Acomodar la mochila o el cabello sin pedir permiso",
    situation:
      "Una persona adulta conocida te jala el brazo o te toca el cabello sin avisarte y te hace sentir incómodo/a.",
    sceneType: "hair_pull",
    correctColor: "yellow",
    explanation:
      "¡Amarillo! Aunque sea alguien conocido, si un toque te incomoda o te sorprende, puedes dar un paso atrás y decir: 'Por favor no me toques así'.",
    axoTip: "Tus límites valen frente a cualquier persona, conocida o desconocida.",
    difficultyMin: "normal",
  },
  {
    id: 11,
    title: "Entrenamiento con respeto",
    situation:
      "En clase de natación o fútbol, tu entrenadora pregunta antes si puede corregir tu postura tocando tu hombro, y respeta si dices que prefieres solo mirarla.",
    sceneType: "coach_respect",
    correctColor: "green",
    explanation:
      "¡Verde! Preguntar antes y respetar tu respuesta demuestra trato seguro y profesional en el deporte.",
    axoTip: "Pedir permiso antes de ayudar físicamente es señal de respeto.",
    difficultyMin: "reto",
  },
  {
    id: 12,
    title: "Invitación de alguien extraño",
    situation:
      "A la salida de la escuela, una persona desconocida en un coche te dice que tus papás la mandaron por ti, pero no sabe la palabra secreta de tu familia.",
    sceneType: "stranger_car",
    correctColor: "red",
    explanation:
      "¡Rojo total! Nunca te subas ni te acerques al vehículo de alguien desconocido. Regresa dentro de la escuela y avisa a dirección o a tu maestra.",
    axoTip: "Quédate en un lugar seguro y avisa de inmediato al personal escolar.",
    difficultyMin: "reto",
  },
];

export const BODY_ZONES_INFO: BodyZoneInfo[] = [
  {
    id: "head",
    label: "Cabeza, rostro y cabello",
    defaultSafe: "yellow",
    rule: "Zona personal: solo si tú estás de acuerdo (ej. peinarte con mamá/papá o revisión de salud).",
    examples: "Puedes decir 'no' si alguien intenta pellizcarte los cachetes o despeinarte.",
  },
  {
    id: "hands",
    label: "Manos y antebrazos",
    defaultSafe: "green",
    rule: "Zona social: ideal para chocar las cinco, saludar o jugar en equipo cuando ambos quieren.",
    examples: "Si ya no quieres jugar o tomarte de las manos, puedes soltarte con libertad.",
  },
  {
    id: "shoulders",
    label: "Hombros y espalda alta",
    defaultSafe: "yellow",
    rule: "Zona de límite personal: abrazos y palmadas solo con tu consentimiento.",
    examples: "Si no quieres un abrazo, puedes pedir un saludo de mano o sonrisa.",
  },
  {
    id: "chest_hip",
    label: "Zonas privadas (cubiertas por tu traje de baño)",
    defaultSafe: "red",
    rule: "¡ZONA PRIVADA INVIOLABLE! Nadie puede tocarlas, fotografiarlas ni pedirte secretos sobre ellas.",
    examples: "Única excepción: higiene propia o revisión médica necesaria con mamá/papá presentes.",
  },
  {
    id: "legs",
    label: "Piernas y pies",
    defaultSafe: "yellow",
    rule: "Zona personal: nadie debe sujetarte ni lastimarte al jugar.",
    examples: "En juegos deportivos, el respeto físico siempre es obligatorio.",
  },
];

export const TRUSTED_ADULTS_MINI_SCENE: TrustedAdultOption[] = [
  {
    id: "mama_papa",
    name: "Mamá, Papá o Tutores",
    role: "Tu red familiar principal",
    emoji: "👨‍👩‍👧",
    isTrusted: true,
    feedback: "¡Excelente! Contárselo a tu familia de confianza es el primer gran paso para protegerte.",
  },
  {
    id: "maestra",
    name: "Maestra, Maestro o Dirección Escolar",
    role: "Adultos protectores en tu escuela",
    emoji: "👩‍🏫",
    isTrusted: true,
    feedback: "¡Muy bien! En la escuela las maestras y directivos tienen el deber de escucharte y cuidarte.",
  },
  {
    id: "unknown_chat",
    name: "Un amigo desconocido de videojuegos",
    role: "Perfil en internet",
    emoji: "🕵️",
    isTrusted: false,
    feedback: "Recuerda: las personas desconocidas en internet NO son adultos de confianza seguros.",
  },
  {
    id: "keep_secret",
    name: "No decirle a nadie y callarme",
    role: "Guardar el secreto",
    emoji: "🤐",
    isTrusted: false,
    feedback: "Nunca guardes un secreto que te lastima o asusta. Si una persona no te escucha, ¡busca a otra hasta recibir ayuda!",
  },
];

export const SEMAFORO_TUTORIAL = [
  {
    emoji: "🚦",
    title: "Lee o escucha cada situación",
    description: "Observa la escena ilustrada y piensa cómo se siente el cuerpo y si existe permiso o peligro.",
  },
  {
    emoji: "🟢",
    title: "Verde, Amarillo o Rojo",
    description: "Arrastra la tarjeta al semáforo o presiona el color correcto: Verde (seguro), Amarillo (tú decides), Rojo (¡Alto y pedir ayuda!).",
  },
  {
    emoji: "🛡️",
    title: "Mapa corporal y Red de Confianza",
    description: "Explora tus zonas privadas que nadie puede tocar y elige a los adultos de confianza en Morelia que siempre te cuidan.",
  },
];
