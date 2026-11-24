"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";

export type GameId =
  | "semaforo"
  | "balanza"
  | "memorama"
  | "muro"
  | "escudo"
  | "valor"
  | "salario"
  | "circulo";

export type LevelKey = "infantil" | "intermedio" | "juvenil";

export const GAMES_BY_LEVEL: Record<LevelKey, GameId[]> = {
  infantil: ["semaforo", "balanza", "memorama"],
  intermedio: ["muro", "escudo", "valor"],
  juvenil: ["salario", "circulo"],
};

export interface GameProgress {
  stars: 0 | 1 | 2 | 3;
  completedAt?: number;
  badge?: string;
}

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  gameId: GameId;
  earnedAt?: number;
}

const BADGES: Badge[] = [
  { id: "guardian", label: "Guardián/a del Respeto", emoji: "🛡️", gameId: "semaforo" },
  { id: "equilibrista", label: "Equilibrista", emoji: "⚖️", gameId: "balanza" },
  { id: "historiadora", label: "Historiadora", emoji: "🧠", gameId: "memorama" },
  { id: "demoledora", label: "Demoledora de Mitos", emoji: "🧱", gameId: "muro" },
  { id: "empatica", label: "Empática", emoji: "💚", gameId: "escudo" },
  { id: "economista", label: "Economista del Cuidado", emoji: "📊", gameId: "valor" },
  { id: "auditora", label: "Auditora Salarial", emoji: "💼", gameId: "salario" },
  { id: "aliada", label: "Aliada de Confianza", emoji: "🤝", gameId: "circulo" },
];

export interface GroupProgressSummary {
  totalStars: number;
  maxStars: number;
  completedGames: number;
  totalGames: number;
  percent: number;
  isAllCompleted: boolean;
}

interface ProgressContextValue {
  progress: Record<GameId, GameProgress>;
  badges: Badge[];
  selectedAgeGroup: LevelKey | "todos" | null;
  setSelectedAgeGroup: (age: LevelKey | "todos" | null) => void;
  setGameProgress: (gameId: GameId, stars: 0 | 1 | 2 | 3) => void;
  getTotalStars: () => number;
  getCompletedGames: () => number;
  getGroupProgress: (group?: LevelKey | "todos" | null) => GroupProgressSummary;
  saveToDevice: () => void;
  clearProgress: () => void;
  hasSavedData: boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const DEFAULT_PROGRESS: Record<GameId, GameProgress> = {
  semaforo: { stars: 0 },
  balanza: { stars: 0 },
  memorama: { stars: 0 },
  muro: { stars: 0 },
  escudo: { stars: 0 },
  valor: { stars: 0 },
  salario: { stars: 0 },
  circulo: { stars: 0 },
};

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Record<GameId, GameProgress>>(() => ({
    ...DEFAULT_PROGRESS,
  }));
  const [badges, setBadges] = useState<Badge[]>(() => BADGES.map((b) => ({ ...b })));
  const [selectedAgeGroup, setSelectedAgeGroupState] = useState<LevelKey | "todos" | null>(null);
  const [hasSavedData, setHasSavedData] = useState<boolean>(false);

  // Cargar progreso solo si el usuario eligió explícitamente guardarlo antes
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem("ods5-progress");
        if (!raw) return;
        const parsed = JSON.parse(raw) as {
          progress?: Record<GameId, GameProgress>;
          badges?: Array<{ id: string; earnedAt?: number }>;
          selectedAgeGroup?: LevelKey | "todos" | null;
        };
        if (parsed.progress) {
          setProgress({ ...DEFAULT_PROGRESS, ...parsed.progress });
        }
        if (parsed.badges) {
          setBadges(
            BADGES.map((b) => {
              const match = parsed.badges?.find((pb) => pb.id === b.id);
              return match?.earnedAt ? { ...b, earnedAt: match.earnedAt } : { ...b };
            })
          );
        }
        if (parsed.selectedAgeGroup) {
          setSelectedAgeGroupState(parsed.selectedAgeGroup);
        }
        setHasSavedData(true);
      } catch {
        // Ignorar datos corruptos
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const setSelectedAgeGroup = useCallback((group: LevelKey | "todos" | null) => {
    setSelectedAgeGroupState(group);
  }, []);

  const setGameProgress = useCallback((gameId: GameId, stars: 0 | 1 | 2 | 3) => {
    setProgress((prev) => ({
      ...prev,
      [gameId]: { stars, completedAt: Date.now() },
    }));

    if (stars >= 1) {
      setBadges((prev) =>
        prev.map((b) =>
          b.gameId === gameId && !b.earnedAt ? { ...b, earnedAt: Date.now() } : b
        )
      );
    }
  }, []);

  const getTotalStars = useCallback(() => {
    return Object.values(progress).reduce((acc, p) => acc + p.stars, 0);
  }, [progress]);

  const getCompletedGames = useCallback(() => {
    return Object.values(progress).filter((p) => p.stars > 0).length;
  }, [progress]);

  const getGroupProgress = useCallback(
    (group?: LevelKey | "todos" | null): GroupProgressSummary => {
      const activeGroup = group ?? selectedAgeGroup;
      let targetIds: GameId[] = [];

      if (!activeGroup || activeGroup === "todos") {
        targetIds = Object.keys(DEFAULT_PROGRESS) as GameId[];
      } else {
        targetIds = GAMES_BY_LEVEL[activeGroup] || [];
      }

      const totalGames = targetIds.length;
      const maxStars = totalGames * 3;
      let totalStars = 0;
      let completedGames = 0;

      for (const id of targetIds) {
        const item = progress[id];
        if (item) {
          totalStars += item.stars;
          if (item.stars > 0) completedGames++;
        }
      }

      const percent = maxStars > 0 ? Math.round((totalStars / maxStars) * 100) : 0;
      const isAllCompleted = completedGames === totalGames && totalGames > 0;

      return {
        totalStars,
        maxStars,
        completedGames,
        totalGames,
        percent,
        isAllCompleted,
      };
    },
    [progress, selectedAgeGroup]
  );

  const saveToDevice = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const data = {
        progress,
        badges: badges.map((b) => ({ id: b.id, earnedAt: b.earnedAt })),
        selectedAgeGroup,
        savedAt: Date.now(),
      };
      localStorage.setItem("ods5-progress", JSON.stringify(data));
      setHasSavedData(true);
    } catch {
      // localStorage no disponible
    }
  }, [progress, badges, selectedAgeGroup]);

  const clearProgress = useCallback(() => {
    setProgress({ ...DEFAULT_PROGRESS });
    setBadges(BADGES.map((b) => ({ ...b })));
    setSelectedAgeGroupState(null);
    setHasSavedData(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("ods5-progress");
    }
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      badges,
      selectedAgeGroup,
      setSelectedAgeGroup,
      setGameProgress,
      getTotalStars,
      getCompletedGames,
      getGroupProgress,
      saveToDevice,
      clearProgress,
      hasSavedData,
    }),
    [
      progress,
      badges,
      selectedAgeGroup,
      setSelectedAgeGroup,
      setGameProgress,
      getTotalStars,
      getCompletedGames,
      getGroupProgress,
      saveToDevice,
      clearProgress,
      hasSavedData,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress debe usarse dentro de ProgressProvider");
  return ctx;
}
