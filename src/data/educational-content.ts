export interface EmergencyContact {
  id: string;
  institution: string;
  scope: string;
  phone: string;
  whatsapp?: string;
  address: string;
  colonia: string;
  reference: string;
  description: string;
  hours: string;
  services: string[];
}

export const MORELIA_RESOURCES: EmergencyContact[] = [
  {
    id: "cjm",
    institution: "Centro de Justicia para las Mujeres (CJM) Michoacán",
    scope: "Atención Integral y Jurídica Especializada",
    phone: "443 299 8200",
    address: "Periférico Paseo de la República #6040",
    colonia: "Col. Ex Ejido Emiliano Zapata, C.P. 58147, Morelia",
    reference: "Cerca de la salida a Salamanca y Poliforum Morelia",
    description: "Modelo único que reúne bajo un mismo techo a agentes del Ministerio Público, psicólogas, médicas legistas, trabajadoras sociales y sala lúdica para infancias.",
    hours: "Atención 24 horas, los 365 días del año",
    services: ["Denuncia penal inmediata", "Órdenes de protección", "Atención médica y psicológica infantil", "Albergue de emergencia seguro"]
  },
  {
    id: "seimujer",
    institution: "Secretaría de Igualdad Sustantiva y Desarrollo de las Mujeres (SeiMujer)",
    scope: "Protocolo de Emergencia AVGM Estatal",
    phone: "443 113 6700",
    address: "Calle Batalla de Casa Mata #25",
    colonia: "Col. Chapultepec Norte, C.P. 58260, Morelia",
    reference: "A espaldas de la Av. Acueducto",
    description: "Órgano rector de las políticas públicas para erradicar la violencia contra mujeres, niñas y adolescentes en Michoacán.",
    hours: "Lunes a Viernes de 9:00 a 18:00 hrs (Guardias activas 24/7)",
    services: ["Canalización a refugios", "Atención socioemocional a adolescentes", "Defensoría de derechos humanos"]
  },
  {
    id: "immujeris",
    institution: "Instituto de la Mujer Moreliana para la Igualdad Sustantiva (IMMUJERIS)",
    scope: "Atención y Protección Municipal de Morelia",
    phone: "443 322 0000 Ext. 3101",
    whatsapp: "443 787 5000",
    address: "Calle Bartolomé de las Casas #491",
    colonia: "Centro Histórico, C.P. 58000, Morelia",
    reference: "A tres cuadras de la Plaza Valladolid (San Francisco)",
    description: "Atención directa para morelianas de todas las edades, módulos comunitarios itinerantes y talleres de prevención en escuelas locales.",
    hours: "Lunes a Viernes de 8:30 a 16:30 hrs",
    services: ["Punto Naranja (Espacios seguros en comercios)", "Orientación psicológica gratuita", "Talleres para escuelas públicas"]
  },
  {
    id: "policia_ciber",
    institution: "Policía Cibernética del Estado de Michoacán",
    scope: "Ciberdelitos, Acoso Virtual y Ley Olimpia",
    phone: "443 322 3600 Ext. 1065",
    whatsapp: "443 322 3600",
    address: "Fiscalía General del Estado de Michoacán",
    colonia: "Periférico Independencia #5000, Col. Sentimientos de la Nación, Morelia",
    reference: "Edificio central de la Fiscalía General del Estado",
    description: "Unidad policial técnica especializada en la investigación de violencia digital, ciberbullying, sextorsión y difusión no autorizada de contenido íntimo.",
    hours: "Atención 24/7 en plataformas digitales y presencial",
    services: ["Baja de contenidos no consentidos", "Rastreo de perfiles falsos y acosadores", "Medidas cautelares digitales"]
  },
  {
    id: "emergencias_911",
    institution: "Centro de Comando, Control, Comunicaciones y Cómputo (C5i Michoacán)",
    scope: "Atención Inmediata de Emergencias 911 / 089",
    phone: "911",
    address: "C5i Michoacán, Periférico Paseo de la República s/n",
    colonia: "Morelia, Michoacán",
    reference: "Enlace prioritario con código Violeta",
    description: "Despacho inmediato de unidades de policía de género, ambulancias y personal de rescate capacitado en perspectiva de infancia y género.",
    hours: "Llamada gratuita las 24 horas del día",
    services: ["Código Violeta (Respuesta prioritaria)", "Ambulancias y paramédicos", "Denuncia anónima (089)"]
  }
];

export interface FemaleLeader {
  id: string;
  name: string;
  role: string;
  area: "STEM" | "Política y DDHH" | "Arte y Cultura";
  origin: string;
  achievement: string;
  quote: string;
  funFact: string;
  color: string;
  avatarIcon: string;
}

export const FEMALE_LEADERS: FemaleLeader[] = [
  {
    id: "katya",
    name: "Katya Echazarreta",
    role: "Primera Mujer Mexicana en el Espacio e Ingeniera Eléctrica",
    area: "STEM",
    origin: "Guadalajara / Residente de honor en México",
    achievement: "Ingeniera de la NASA en misiones a Marte; voló al espacio a bordo de la misión Blue Origin NS-21 a los 26 años.",
    quote: "Nunca permitas que nadie te diga que tus sueños son imposibles por ser mujer.",
    funFact: "Creó su propia fundación espacial para otorgar becas de robótica a niñas y niños en México.",
    color: "from-blue-600 via-indigo-600 to-cyan-500",
    avatarIcon: "🚀"
  },
  {
    id: "amalia",
    name: "Amalia Solórzano de Cárdenas",
    role: "Pionera Humanitaria y Defensora Social Michoacana",
    area: "Política y DDHH",
    origin: "Tacámbaro, Michoacán",
    achievement: "Líder michoacana que gestionó el asilo y protección de más de 450 niños huérfanos durante la Guerra Civil Española (los Niños de Morelia).",
    quote: "La bondad y la justicia se demuestran con acciones que salvan vidas.",
    funFact: "Vivió en Morelia y fundó múltiples comedores infantiles y hogares de acogida en Michoacán.",
    color: "from-amber-600 via-orange-600 to-rose-600",
    avatarIcon: "🕊️"
  },
  {
    id: "sor_juana",
    name: "Sor Juana Inés de la Cruz",
    role: "Filósofa, Poeta y Primera Gran Teórica Feminista",
    area: "Arte y Cultura",
    origin: "Tepetlixpa, México",
    achievement: "Publicó la histórica 'Respuesta a Sor Filotea', donde defendió el derecho de las mujeres a estudiar astronomía, matemáticas y filosofía.",
    quote: "Hombres necios que acusáis a la mujer sin razón, sin ver que sois la ocasión de lo mismo que culpáis.",
    funFact: "A los 3 años ya leía en la biblioteca de su abuelo y aprendió latín en tan solo 20 lecciones.",
    color: "from-emerald-600 via-teal-600 to-cyan-700",
    avatarIcon: "📜"
  },
  {
    id: "julieta",
    name: "Dra. Julieta Fierro Gossman",
    role: "Astrofísica y Máxima Divulgadora Científica de la UNAM",
    area: "STEM",
    origin: "Ciudad de México",
    achievement: "Investigadora de la materia interestelar galardonada con el Premio Kalinga de la UNESCO por sembrar vocaciones científicas en infancias.",
    quote: "La ciencia es el juego más fascinante del mundo y el universo nos pertenece a todas.",
    funFact: "Tiene un asteroide nombrado en su honor y enseña física usando burbujas de jabón y globos.",
    color: "from-purple-600 via-fuchsia-600 to-pink-500",
    avatarIcon: "🔭"
  },
  {
    id: "elvia",
    name: "Elvia Carrillo Puerto",
    role: "Luchadora Sufragista y Fundadora de las Ligas Feministas",
    area: "Política y DDHH",
    origin: "Motul, Yucatán",
    achievement: "Conocida como 'La Monja Roja del Mayab', fue una de las primeras tres diputadas electas en México y promotora del voto universal.",
    quote: "La libertad de las mujeres es la verdadera base de la democracia.",
    funFact: "Organizó el histórico Primer Congreso Feminista en 1916 reuniendo a más de 600 maestras.",
    color: "from-rose-600 via-pink-600 to-red-500",
    avatarIcon: "⚖️"
  },
  {
    id: "matilde",
    name: "Dra. Matilde Montoya",
    role: "Primera Médica Cirujana de la Historia de México",
    area: "STEM",
    origin: "Ciudad de México",
    achievement: "Superó barreras machistas para titularse en 1887 con honores de la Escuela Nacional de Medicina, abriendo las universidades a las mexicanas.",
    quote: "Que ninguna puerta del saber permanezca cerrada a las mujeres por prejuicios.",
    funFact: "El presidente de México tuvo que emitir un decreto especial para que le permitieran presentar su examen profesional.",
    color: "from-teal-600 via-emerald-600 to-green-500",
    avatarIcon: "🩺"
  },
  {
    id: "mariana",
    name: "Mariana Navarro (Morelia STEM)",
    role: "Joven Campeona Mexicana de Robótica e Inteligencia Artificial",
    area: "STEM",
    origin: "Morelia, Michoacán",
    achievement: "Ganadora en torneos internacionales de programación y robótica educativa, mentora de clubes de niñas científicas en Michoacán.",
    quote: "Las líneas de código que escribimos hoy construyen la igualdad de mañana.",
    funFact: "Diseñó un prototipo de detector de calidad del agua para las comunidades rurales de Michoacán.",
    color: "from-indigo-600 via-blue-600 to-cyan-600",
    avatarIcon: "🤖"
  },
  {
    id: "frida",
    name: "Frida Kahlo",
    role: "Pintora Revolucionaria y Referente de Identidad Global",
    area: "Arte y Cultura",
    origin: "Coyoacán, México",
    achievement: "Transformó el dolor físico en arte universal vanguardista, desafiando los cánones estéticos impuestos a las mujeres de su época.",
    quote: "Pies, ¿para qué los quiero si tengo alas para volar?",
    funFact: "Fue la primera artista plástica mexicana del siglo XX cuya obra fue adquirida por el prestigioso Museo del Louvre de París.",
    color: "from-fuchsia-600 via-purple-700 to-indigo-600",
    avatarIcon: "🎨"
  }
];
