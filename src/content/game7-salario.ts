export interface SalarySectorRole {
  id: string;
  position: string;
  sector: string;
  department: string;
  maleSalary: number;
  femaleSalary: number;
  malePromotionRate: number;
  femalePromotionRate: number;
  productivityIndex: number;
  responsibilities: string;
  sectorContext: string;
}

export interface WorkplaceEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  salaryBoostPct: number;
  promotionBoostPts: number;
  productivityDelta: number;
}

export const INITIAL_SALARY_SECTORS: SalarySectorRole[] = [
  {
    id: "tech",
    position: "Ingeniería de Software Senior",
    sector: "Tecnología",
    department: "Arquitectura Cloud",
    maleSalary: 45000,
    femaleSalary: 34000,
    malePromotionRate: 70,
    femalePromotionRate: 25,
    productivityIndex: 88,
    responsibilities: "5 años de experiencia, certificaciones cloud idénticas y mismas metas técnicas.",
    sectorContext: "En el sector tecnológico, tanto la ingeniera como el ingeniero tienen exactamente las mismas certificaciones y entregan el mismo código.",
  },
  {
    id: "health",
    position: "Medicina Especialista y Cirugía",
    sector: "Salud",
    department: "Cirugía Hospitalaria",
    maleSalary: 52000,
    femaleSalary: 41000,
    malePromotionRate: 75,
    femalePromotionRate: 30,
    productivityIndex: 90,
    responsibilities: "Mismas guardias nocturnas, cirugías de alta especialidad y evaluaciones clínicas.",
    sectorContext: "En hospitales y clínicas, doctoras y doctores cubren las mismas guardias de 24 horas y atienden pacientes de alta complejidad.",
  },
  {
    id: "finance",
    position: "Dirección de Contraloría",
    sector: "Finanzas",
    department: "Administración Central",
    maleSalary: 62000,
    femaleSalary: 49000,
    malePromotionRate: 80,
    femalePromotionRate: 35,
    productivityIndex: 86,
    responsibilities: "Gestión de presupuestos millonarios y auditorías fiscales ante el SAT.",
    sectorContext: "En el sector financiero, las mujeres representan la mitad del personal pero enfrentan barreras invisibles para llegar a las direcciones generales.",
  },
  {
    id: "academia",
    position: "Investigación Científica Titular",
    sector: "Ciencia",
    department: "Laboratorio de Biotecnología",
    maleSalary: 38000,
    femaleSalary: 30000,
    malePromotionRate: 65,
    femalePromotionRate: 20,
    productivityIndex: 92,
    responsibilities: "Mismos artículos internacionales publicados y dirección de tesis universitarias.",
    sectorContext: "En la investigación científica, investigadoras e investigadores dedican las mismas horas de laboratorio y producen ciencia de nivel mundial.",
  },
];

export const WORKPLACE_EVENTS: WorkplaceEvent[] = [
  {
    id: "paternity",
    title: "Licencia de Paternidad Equitativa (12 semanas)",
    description: "Permite a los papás cuidar al bebé igual que a las mamás, eliminando el sesgo de contratación contra mujeres jóvenes.",
    emoji: "👶",
    salaryBoostPct: 8,
    promotionBoostPts: 18,
    productivityDelta: 4,
  },
  {
    id: "blind_cv",
    title: "Currículum Ciego en Selección Directiva",
    description: "Elimina nombres, fotos y género de las postulaciones; las promociones se eligen 100% por mérito y experiencia.",
    emoji: "📄",
    salaryBoostPct: 10,
    promotionBoostPts: 22,
    productivityDelta: 5,
  },
  {
    id: "audit",
    title: "Auditoría Salarial Transparente (Art. 86 LFT)",
    description: "Hace públicos los tabuladores de sueldos para garantizar que a trabajo igual corresponda salario igual.",
    emoji: "📋",
    salaryBoostPct: 12,
    promotionBoostPts: 15,
    productivityDelta: 3,
  },
];

export interface SalaryAuditResult {
  salaryDiff: number;
  gapPct: number;
  promoDiff: number;
  isSalaryEqual: boolean;
  isPromoEqual: boolean;
  isFullyEquitable: boolean;
  cumulativeLoss10Years: number;
}

export function calculateSalaryAudit(role: SalarySectorRole): SalaryAuditResult {
  const salaryDiff = Math.max(0, role.maleSalary - role.femaleSalary);
  const gapPct = role.maleSalary > 0 ? Number(((salaryDiff / role.maleSalary) * 100).toFixed(1)) : 0;
  const promoDiff = Math.max(0, role.malePromotionRate - role.femalePromotionRate);
  const isSalaryEqual = salaryDiff <= 400;
  const isPromoEqual = promoDiff <= 8;
  const isFullyEquitable = isSalaryEqual && isPromoEqual;
  const cumulativeLoss10Years = salaryDiff * 12 * 10;

  return {
    salaryDiff,
    gapPct,
    promoDiff,
    isSalaryEqual,
    isPromoEqual,
    isFullyEquitable,
    cumulativeLoss10Years,
  };
}

export const SALARIO_TUTORIAL = [
  {
    emoji: "⚖️",
    title: "A igual trabajo, igual salario",
    description: "Conoce el Artículo 86 de la Ley Federal del Trabajo: dos personas con las mismas funciones deben ganar exactamente lo mismo.",
  },
  {
    emoji: "⚡",
    title: "Rompe el techo de cristal",
    description: "Observa la pirámide de la empresa: aumenta la tasa de promoción de mujeres a puestos de dirección y gerencia.",
  },
  {
    emoji: "📜",
    title: "Aplica políticas institucionales",
    description: "Activa licencias parentales equitativas, currículum ciego y auditorías públicas para erradicar la brecha sin perder productividad.",
  },
];
