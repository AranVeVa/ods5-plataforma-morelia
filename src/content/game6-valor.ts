export interface CareFamilyMember {
  id: string;
  name: string;
  role: string;
  gender: "female" | "male";
  avatar: string;
  trabajoFueraHours: number; // Empleo o trabajo remunerado fuera de casa
  estudioHours: number;      // Escuela, clases y estudio
  cocinaHours: number;       // Preparación de comidas
  limpiezaHours: number;     // Aseo y mantenimiento del hogar
  cuidadosHours: number;     // Atención a infancias, mayores o enfermos
}

export const DEFAULT_CARE_FAMILY: CareFamilyMember[] = [
  {
    id: "mama",
    name: "Laura",
    role: "Mamá (Empleo + Hogar)",
    gender: "female",
    avatar: "👩🏽",
    trabajoFueraHours: 35,
    estudioHours: 0,
    cocinaHours: 14,
    limpiezaHours: 12,
    cuidadosHours: 14,
  },
  {
    id: "papa",
    name: "Carlos",
    role: "Papá (Empleo)",
    gender: "male",
    avatar: "👨🏽",
    trabajoFueraHours: 40,
    estudioHours: 0,
    cocinaHours: 4,
    limpiezaHours: 5,
    cuidadosHours: 6,
  },
  {
    id: "hija",
    name: "Ana (13)",
    role: "Hija (Secundaria)",
    gender: "female",
    avatar: "👧🏽",
    trabajoFueraHours: 0,
    estudioHours: 30,
    cocinaHours: 5,
    limpiezaHours: 6,
    cuidadosHours: 5,
  },
  {
    id: "hijo",
    name: "Diego (11)",
    role: "Hijo (Primaria)",
    gender: "male",
    avatar: "👦🏽",
    trabajoFueraHours: 0,
    estudioHours: 30,
    cocinaHours: 1,
    limpiezaHours: 2,
    cuidadosHours: 1,
  },
  {
    id: "abuela",
    name: "Elena",
    role: "Abuela",
    gender: "female",
    avatar: "👵🏽",
    trabajoFueraHours: 0,
    estudioHours: 0,
    cocinaHours: 8,
    limpiezaHours: 4,
    cuidadosHours: 8,
  },
];

export interface CareEconomySummary {
  // Horas de trabajo no remunerado del hogar
  totalCareHours: number;
  femaleCareHours: number;
  maleCareHours: number;
  femaleCareSharePct: number;
  maleCareSharePct: number;

  // Horas de trabajo remunerado / estudio
  totalOutsideHours: number;
  femaleOutsideHours: number;
  maleOutsideHours: number;

  // Carga total semanal (Empleo + Estudio + Hogar)
  totalOccupiedHours: number;
  femaleOccupiedHours: number;
  maleOccupiedHours: number;

  // Horas por categoría de labor doméstica
  cocinaTotal: number;
  limpiezaTotal: number;
  cuidadosTotal: number;

  // Valor económico mensual estimado
  monthlyTotalMxn: number;
  monthlyFemaleMxn: number;
  monthlyMaleMxn: number;
  annualTotalMxn: number;

  // Indicador de equilibrio global
  isEquitable: boolean;
  nationalGdpReferencePct: number;
}

export const INEGI_CARE_GDP_PCT = 23.9;
export const INEGI_FEMALE_SHARE_PCT = 72;

/**
 * Función pura de cálculo económico del trabajo doméstico y distribución de la carga total.
 */
export function calculateCareEconomy(
  members: CareFamilyMember[],
  hourlyWageMxn: number
): CareEconomySummary {
  let femaleCareHours = 0;
  let maleCareHours = 0;
  let femaleOutsideHours = 0;
  let maleOutsideHours = 0;
  let femaleOccupiedHours = 0;
  let maleOccupiedHours = 0;

  let cocinaTotal = 0;
  let limpiezaTotal = 0;
  let cuidadosTotal = 0;

  for (const m of members) {
    const careSum = m.cocinaHours + m.limpiezaHours + m.cuidadosHours;
    const outsideSum = m.trabajoFueraHours + m.estudioHours;
    const occupiedSum = careSum + outsideSum;

    cocinaTotal += m.cocinaHours;
    limpiezaTotal += m.limpiezaHours;
    cuidadosTotal += m.cuidadosHours;

    if (m.gender === "female") {
      femaleCareHours += careSum;
      femaleOutsideHours += outsideSum;
      femaleOccupiedHours += occupiedSum;
    } else {
      maleCareHours += careSum;
      maleOutsideHours += outsideSum;
      maleOccupiedHours += occupiedSum;
    }
  }

  const totalCareHours = femaleCareHours + maleCareHours;
  const totalOutsideHours = femaleOutsideHours + maleOutsideHours;
  const totalOccupiedHours = femaleOccupiedHours + maleOccupiedHours;

  const femaleCareSharePct =
    totalCareHours > 0 ? Number(((femaleCareHours / totalCareHours) * 100).toFixed(1)) : 0;
  const maleCareSharePct =
    totalCareHours > 0 ? Number(((maleCareHours / totalCareHours) * 100).toFixed(1)) : 0;

  const weeksPerMonth = 4.33;
  const monthlyFemaleMxn = Math.round(femaleCareHours * weeksPerMonth * hourlyWageMxn);
  const monthlyMaleMxn = Math.round(maleCareHours * weeksPerMonth * hourlyWageMxn);
  const monthlyTotalMxn = monthlyFemaleMxn + monthlyMaleMxn;
  const annualTotalMxn = Math.round(totalCareHours * 52 * hourlyWageMxn);

  // Es equitativo cuando el reparto del cuidado está entre 42% y 58% y la carga total no está polarizada
  const isCareBalanced = totalCareHours > 0 && Math.abs(femaleCareSharePct - 50) <= 8;
  const isEquitable = isCareBalanced;

  return {
    totalCareHours,
    femaleCareHours,
    maleCareHours,
    femaleCareSharePct,
    maleCareSharePct,
    totalOutsideHours,
    femaleOutsideHours,
    maleOutsideHours,
    totalOccupiedHours,
    femaleOccupiedHours,
    maleOccupiedHours,
    cocinaTotal,
    limpiezaTotal,
    cuidadosTotal,
    monthlyTotalMxn,
    monthlyFemaleMxn,
    monthlyMaleMxn,
    annualTotalMxn,
    isEquitable,
    nationalGdpReferencePct: INEGI_CARE_GDP_PCT,
  };
}

export const VALOR_TUTORIAL = [
  {
    emoji: "💼",
    title: "Mide empleo, estudio y hogar",
    description: "Cada integrante ahora tiene horas de empleo fuera o estudio, además de cocina, limpieza y cuidados, para visibilizar la doble jornada.",
  },
  {
    emoji: "📊",
    title: "Equilibra el tiempo libre",
    description: "Ajusta las horas de cada persona para que tanto mujeres como hombres tengan tiempo equivalente para descansar y recrearse.",
  },
  {
    emoji: "💰",
    title: "Descubre el valor económico real",
    description: "Conoce cuántos miles de pesos mensuales vale el trabajo no remunerado del hogar y cómo sostendría un salario justo.",
  },
];
