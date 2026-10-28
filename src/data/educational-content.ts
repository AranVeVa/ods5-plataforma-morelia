export interface EmergencyContact {
  institution: string;
  scope: string;
  phone: string;
  address: string;
  description: string;
  hours: string;
}

export const MORELIA_RESOURCES: EmergencyContact[] = [
  {
    institution: "Centro de Justicia para las Mujeres (CJM) Michoacán",
    scope: "Atención Integral y Legal Gratuita",
    phone: "443 299 8200",
    address: "Periférico Paseo de la República #6040, Col. Ex Ejido Emiliano Zapata, Morelia",
    description: "Atención psicológica, asesoría jurídica, trabajo social y albergue temporal para mujeres, niñas y adolescentes.",
    hours: "Atención 24 horas, los 365 días del año"
  },
  {
    institution: "Secretaría de Igualdad Sustantiva y Desarrollo de las Mujeres Michoacanas (SeiMujer)",
    scope: "Prevención y Acompañamiento Institucional",
    phone: "443 113 6700",
    address: "Calle Batalla de Casa Mata #25, Col. Chapultepec Norte, Morelia",
    description: "Orientación y canalización ante la Alerta de Violencia de Género contra las Mujeres (AVGM).",
    hours: "Lunes a Viernes 9:00 a 17:00 hrs"
  },
  {
    institution: "Instituto de la Mujer Moreliana para la Igualdad Sustantiva (IMMUJERIS)",
    scope: "Atención Municipal Morelia",
    phone: "443 322 0000 Ext. 3101",
    address: "Calle Bartolomé de las Casas #491, Centro Histórico, Morelia",
    description: "Programas preventivos locales, contención emocional, talleres y defensa de los derechos de las niñas y mujeres morelianas.",
    hours: "Lunes a Viernes 8:30 a 16:30 hrs"
  },
  {
    institution: "Policía Cibernética del Estado de Michoacán",
    scope: "Violencia Digital y Ciberacoso",
    phone: "443 322 3600 Ext. 1065 / 911",
    address: "Fiscalía General del Estado de Michoacán, Morelia",
    description: "Investigación y atención inmediata en casos de acoso virtual, sexting no consentido, suplantación o amenazas en redes sociales.",
    hours: "24/7 en línea y vía 911"
  },
  {
    institution: "Línea de Emergencia 911 y 089 Denuncia Anónima",
    scope: "Emergencias Inmediatas",
    phone: "911 / 089",
    address: "Cobertura estatal Michoacán",
    description: "Canal de enlace prioritario para patrullaje, auxilio médico o protección ante violencia de género activa.",
    hours: "24 horas ininterrumpidas"
  }
];

export interface FemaleLeader {
  id: string;
  name: string;
  role: string;
  area: "STEM" | "Política y DDHH" | "Arte y Cultura";
  achievement: string;
  quote: string;
  color: string;
}

export const FEMALE_LEADERS: FemaleLeader[] = [
  {
    id: "katya",
    name: "Katya Echazarreta",
    role: "Ingeniera Eléctrica y Primera Astronauta Mexicana",
    area: "STEM",
    achievement: "Ingeniera de la NASA que viajó al espacio a los 26 años, impulsando la ciencia y tecnología aeroespacial en niñas mexicanas.",
    quote: "Nunca dejes que nadie defina el tamaño de tus sueños.",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "sor_juana",
    name: "Sor Juana Inés de la Cruz",
    role: "Filósofa, Poeta y Defensora de la Educación Femenina",
    area: "Arte y Cultura",
    achievement: "Pionera histórica en México en exigir el derecho irrestricto de las mujeres al conocimiento científico y académico.",
    quote: "Hombres necios que acusáis a la mujer sin razón...",
    color: "from-emerald-500 to-teal-700"
  },
  {
    id: "elvia",
    name: "Elvia Carrillo Puerto",
    role: "Luchadora Social y Pionera del Sufragio",
    area: "Política y DDHH",
    achievement: "Líder sufragista mexicana clave para la conquista del voto femenino y los derechos reproductivos y laborales.",
    quote: "La igualdad no es un favor que se otorga, es una justicia que se ejerce.",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: "mario_molina_companion",
    name: "Dra. Julieta Fierro",
    role: "Astrofísica y Divulgadora Científica",
    area: "STEM",
    achievement: "Científica de la UNAM galardonada internacionalmente por acercar la astronomía y el pensamiento crítico a millones de infancias.",
    quote: "La ciencia es para todas y todos; la curiosidad no tiene género.",
    color: "from-amber-500 to-orange-600"
  }
];
