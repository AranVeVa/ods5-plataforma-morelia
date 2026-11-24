import { describe, it, expect } from "vitest";
import { TASKS_HIJOS, TASKS_PADRES, evaluateBalance } from "@/content/game2-balanza";
import { DEFAULT_CARE_FAMILY, calculateCareEconomy, INEGI_CARE_GDP_PCT } from "@/content/game6-valor";
import { INITIAL_SALARY_SECTORS, calculateSalaryAudit } from "@/content/game7-salario";
import { createInitialStoryState, transitionStoryState } from "@/content/game8-circulo";

describe("Lógica Juego 2 — La Balanza del Tiempo", () => {
  it("detecta desequilibrio inicial en las tareas de Hijos (hogar y descanso desparejos)", () => {
    const res = evaluateBalance(TASKS_HIJOS);
    expect(res.leftChoreHours).toBeGreaterThan(res.rightChoreHours);
    expect(res.isBalanced).toBe(false);
  });

  it("verifica que el modo Padres cuenta con tareas de empleo, cuidados y descanso para ambos", () => {
    expect(TASKS_PADRES.length).toBeGreaterThanOrEqual(12);
    const workTasks = TASKS_PADRES.filter((t) => t.category === "trabajo");
    expect(workTasks.length).toBe(2);
  });

  it("detecta que aunque las tareas de hogar estén parejas, si el descanso no lo está, no hay equilibrio", () => {
    // Si asignamos tareas de hogar iguales pero descanso desigual
    const tasks = [
      { id: "t1", name: "Lavar platos", category: "hogar" as const, hours: 2, effortWeight: 2, assignedTo: "left" as const, icon: "🍽️", description: "" },
      { id: "t2", name: "Barrer", category: "hogar" as const, hours: 2, effortWeight: 2, assignedTo: "right" as const, icon: "🧹", description: "" },
      { id: "t3", name: "Descanso A", category: "descanso" as const, hours: 1, effortWeight: 0, assignedTo: "left" as const, icon: "🛋️", description: "" },
      { id: "t4", name: "Videojuegos B", category: "descanso" as const, hours: 6, effortWeight: 0, assignedTo: "right" as const, icon: "🎮", description: "" },
    ];
    const res = evaluateBalance(tasks);
    expect(res.isChoreBalanced).toBe(true);
    expect(res.isRestBalanced).toBe(false);
    expect(res.isBalanced).toBe(false);
  });

  it("valida equilibrio cuando TANTO labores domésticas COMO descanso están nivelados", () => {
    const tasks = [
      { id: "t1", name: "Lavar platos", category: "hogar" as const, hours: 2, effortWeight: 2, assignedTo: "left" as const, icon: "🍽️", description: "" },
      { id: "t2", name: "Barrer", category: "hogar" as const, hours: 2, effortWeight: 2, assignedTo: "right" as const, icon: "🧹", description: "" },
      { id: "t3", name: "Jugar y descansar A", category: "descanso" as const, hours: 3, effortWeight: 0, assignedTo: "left" as const, icon: "🎮", description: "" },
      { id: "t4", name: "Jugar y descansar B", category: "descanso" as const, hours: 3, effortWeight: 0, assignedTo: "right" as const, icon: "🎮", description: "" },
    ];
    const res = evaluateBalance(tasks);
    expect(res.isChoreBalanced).toBe(true);
    expect(res.isRestBalanced).toBe(true);
    expect(res.isBalanced).toBe(true);
  });
});

describe("Lógica Juego 6 — El Valor Invisible (Economía del Cuidado, Empleo y Estudio)", () => {
  it("calcula la doble jornada femenina inicial considerando empleo y labores domésticas", () => {
    const summary = calculateCareEconomy(DEFAULT_CARE_FAMILY, 90);
    expect(summary.totalCareHours).toBeGreaterThan(0);
    expect(summary.femaleCareSharePct).toBeGreaterThan(65);
    expect(summary.nationalGdpReferencePct).toBe(INEGI_CARE_GDP_PCT);
    expect(summary.isEquitable).toBe(false);
    expect(summary.monthlyTotalMxn).toBe(summary.monthlyFemaleMxn + summary.monthlyMaleMxn);
    // Mamá tiene empleo remunerado fuera (35h) + labores domésticas (40h) = 75h
    expect(summary.femaleOccupiedHours).toBeGreaterThan(summary.maleOccupiedHours);
  });

  it("marca equidad cuando mujeres y hombres aportan horas equivalentes en el hogar", () => {
    const equalFamily = DEFAULT_CARE_FAMILY.slice(0, 2).map((m) => ({
      ...m,
      cocinaHours: 5,
      limpiezaHours: 5,
      cuidadosHours: 5,
    }));
    const summary = calculateCareEconomy(equalFamily, 100);
    expect(summary.femaleCareSharePct).toBe(50);
    expect(summary.maleCareSharePct).toBe(50);
    expect(summary.isEquitable).toBe(true);
  });
});

describe("Lógica Juego 7 — Brecha Salarial y Techo de Cristal", () => {
  it("detecta brecha salarial y pérdida acumulada en 10 años inicialmente", () => {
    const tech = INITIAL_SALARY_SECTORS[0];
    const audit = calculateSalaryAudit(tech);
    expect(audit.salaryDiff).toBe(tech.maleSalary - tech.femaleSalary);
    expect(audit.gapPct).toBeGreaterThan(20);
    expect(audit.cumulativeLoss10Years).toBe(audit.salaryDiff * 12 * 10);
    expect(audit.isFullyEquitable).toBe(false);
  });

  it("aprueba auditoría cuando salario y promociones directivas son equitativos", () => {
    const tech = {
      ...INITIAL_SALARY_SECTORS[0],
      femaleSalary: INITIAL_SALARY_SECTORS[0].maleSalary,
      femalePromotionRate: INITIAL_SALARY_SECTORS[0].malePromotionRate,
      productivityIndex: 92,
    };
    const audit = calculateSalaryAudit(tech);
    expect(audit.isSalaryEqual).toBe(true);
    expect(audit.isPromoEqual).toBe(true);
    expect(audit.isFullyEquitable).toBe(true);
  });
});

describe("Lógica Juego 8 — Máquina de Estados (Círculo de Confianza)", () => {
  it("avanza hacia final ejemplar aumentando el medidor de apoyo con decisiones protectoras", () => {
    let state = createInitialStoryState("digital");
    expect(state.currentNodeId).toBe("dig_start");
    expect(state.supportMeter).toBe(50);

    state = transitionStoryState(state, 0); // decisión protectora
    expect(state.currentNodeId).toBe("dig_support");
    expect(state.supportMeter).toBe(75);

    state = transitionStoryState(state, 0); // canalización institucional
    expect(state.currentNodeId).toBe("dig_safe");
    expect(state.supportMeter).toBe(100);
  });

  it("permite rectificar después de una decisión pasiva inicial", () => {
    let state = createInitialStoryState("noviazgo");
    state = transitionStoryState(state, 1); // normalizar celos
    expect(state.currentNodeId).toBe("nov_normalize");
    expect(state.supportMeter).toBe(30);

    state = transitionStoryState(state, 0); // rectificar con empatía
    expect(state.currentNodeId).toBe("nov_reflexive");
    expect(state.supportMeter).toBe(55);
  });
});
