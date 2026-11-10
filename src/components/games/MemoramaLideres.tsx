"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Award,
  RefreshCw,
  Volume2,
  CheckCircle2,
  Clock,
  Star,
  Sparkles,
  Layers,
  Trophy,
  ExternalLink,
  BookOpen
} from "lucide-react";
import confetti from "canvas-confetti";
import GameHeader from "@/components/common/GameHeader";
import InstructionsModal from "@/components/common/InstructionsModal";
import VictoryModal from "@/components/common/VictoryModal";
import EmergencyHelpModal from "@/components/common/EmergencyHelpModal";
import { FEMALE_LEADERS, FemaleLeader } from "@/data/educational-content";
import { sound } from "@/utils/audio";

interface MemoryCard {
  uid: string;
  leaderId: string;
  leader: FemaleLeader;
  isFlipped: boolean;
  isMatched: boolean;
}

type BoardDifficulty = "facil" | "medio" | "experto";

export default function MemoramaLideres() {
  const [difficulty, setDifficulty] = useState<BoardDifficulty>("medio");
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [activeLeaderModal, setActiveLeaderModal] = useState<FemaleLeader | null>(null);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const getTargetPairs = useCallback((diff: BoardDifficulty) => {
    switch (diff) {
      case "facil":
        return 3; // 6 cards (3x2)
      case "medio":
        return 6; // 12 cards (4x3)
      case "experto":
        return 8; // 16 cards (4x4)
    }
  }, []);

  const initializeDeck = useCallback(
    (diff: BoardDifficulty) => {
      const pairCount = getTargetPairs(diff);
      const selectedLeaders = FEMALE_LEADERS.slice(0, pairCount);

      const deck: MemoryCard[] = [];
      selectedLeaders.forEach((leader) => {
        deck.push({
          uid: `${leader.id}-a`,
          leaderId: leader.id,
          leader,
          isFlipped: false,
          isMatched: false,
        });
        deck.push({
          uid: `${leader.id}-b`,
          leaderId: leader.id,
          leader,
          isFlipped: false,
          isMatched: false,
        });
      });

      // Fisher-Yates shuffle algorithm
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      setCards(deck);
      setFlippedCards([]);
      setMatchedPairsCount(0);
      setMoves(0);
      setSeconds(0);
      setIsTimerRunning(false);
      setActiveLeaderModal(null);
      setIsVictoryOpen(false);
    },
    [getTargetPairs]
  );

  useEffect(() => {
    initializeDeck(difficulty);
  }, [difficulty, initializeDeck]);

  // Timer runner
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedCards.length === 2) {
      return;
    }

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    sound.playFlip();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.leaderId === secondCard.leaderId) {
        // Matched pair!
        setTimeout(() => {
          sound.playCorrect();
          firstCard.isMatched = true;
          secondCard.isMatched = true;
          setCards([...newCards]);
          setFlippedCards([]);
          setMatchedPairsCount((c) => c + 1);
          setActiveLeaderModal(firstCard.leader);

          const targetPairs = getTargetPairs(difficulty);
          if (matchedPairsCount + 1 === targetPairs) {
            setIsTimerRunning(false);
            sound.playCelebration();
            setIsVictoryOpen(true);
          }
        }, 300);
      } else {
        // Not matched
        setTimeout(() => {
          sound.playAlert();
          firstCard.isFlipped = false;
          secondCard.isFlipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  const playLeaderAudio = (leader: FemaleLeader) => {
    sound.playClick();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        `${leader.name}. ${leader.role}. Originaria de ${leader.origin}. ${leader.achievement}. Dato curioso: ${leader.funFact}. Frase célebre: ${leader.quote}`
      );
      utter.lang = "es-MX";
      window.speechSynthesis.speak(utter);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const targetPairs = getTargetPairs(difficulty);
  const score = matchedPairsCount * 100 - Math.min(moves * 5, 200);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-100 max-w-4xl mx-auto space-y-6">
      {/* Shared Header */}
      <GameHeader
        title="🧠 Memorama de Mujeres Pioneras"
        badge="Visibilización de científicas y lideresas mexicanas (Meta ODS 5.5)"
        levelBadge="Nivel Infantil (6 a 9 años)"
        levelColor="purple"
        odsTarget="ODS 5.5"
        score={Math.max(0, score)}
        stars={matchedPairsCount === targetPairs ? 3 : matchedPairsCount > 2 ? 2 : 1}
        maxStars={3}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onRestart={() => initializeDeck(difficulty)}
      />

      {/* Difficulty Switcher & Game Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playPowerup();
              setDifficulty("facil");
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              difficulty === "facil"
                ? "bg-white text-purple-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Fácil (3x2 • 6 cartas)
          </button>
          <button
            onClick={() => {
              sound.playPowerup();
              setDifficulty("medio");
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              difficulty === "medio"
                ? "bg-white text-purple-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Medio (4x3 • 12 cartas)
          </button>
          <button
            onClick={() => {
              sound.playPowerup();
              setDifficulty("experto");
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              difficulty === "experto"
                ? "bg-white text-purple-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Experto (4x4 • 16 cartas)
          </button>
        </div>

        {/* Real-time Game stats */}
        <div className="flex items-center gap-4 text-xs font-black text-slate-700 px-2">
          <div className="flex items-center gap-1.5 text-indigo-700">
            <Clock className="w-4 h-4" />
            <span>{formatTime(seconds)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-700">
            <Layers className="w-4 h-4" />
            <span>{moves} intentos</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <span>{matchedPairsCount}/{targetPairs} pares</span>
          </div>
        </div>
      </div>

      {/* Cards Board Grid with 3D Flip style */}
      <div
        className={`grid gap-3 sm:gap-4 ${
          difficulty === "facil"
            ? "grid-cols-2 sm:grid-cols-3"
            : difficulty === "medio"
            ? "grid-cols-3 sm:grid-cols-4"
            : "grid-cols-4"
        }`}
      >
        {cards.map((card, idx) => {
          const isRevealed = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.uid}
              onClick={() => handleCardClick(idx)}
              disabled={isRevealed}
              className={`h-32 sm:h-36 rounded-3xl p-2.5 flex flex-col items-center justify-between text-center transition-all duration-300 transform ${
                card.isMatched
                  ? "bg-emerald-50 border-2 border-emerald-400 shadow-xs scale-98 opacity-90"
                  : isRevealed
                  ? "bg-white border-2 border-purple-500 shadow-md scale-102"
                  : "bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm hover:scale-102 cursor-pointer border-2 border-indigo-400"
              }`}
              aria-label={`Carta ${idx + 1}`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-between h-full py-1 w-full animate-fadeIn">
                  <span className="text-3xl p-1 bg-slate-50 rounded-2xl border border-slate-100">
                    {card.leader.avatarIcon}
                  </span>
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight line-clamp-1">
                      {card.leader.name}
                    </h4>
                    <span className="text-[9px] text-purple-700 font-bold block mt-0.5">
                      {card.leader.area}
                    </span>
                  </div>
                  {card.isMatched && (
                    <span className="inline-flex items-center gap-1 text-[9px] text-emerald-800 font-black bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Par
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-1.5">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/90">
                    ODS 5
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Discovered Leader Biographic Capsule */}
      {activeLeaderModal && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200 shadow-md animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2.5 bg-white rounded-2xl border border-purple-200 shadow-xs">
                {activeLeaderModal.avatarIcon}
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded-full">
                  {activeLeaderModal.area} • {activeLeaderModal.origin}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {activeLeaderModal.name}
                </h3>
                <p className="text-xs font-bold text-purple-700">
                  {activeLeaderModal.role}
                </p>
              </div>
            </div>

            <button
              onClick={() => playLeaderAudio(activeLeaderModal)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow transition-colors shrink-0"
            >
              <Volume2 className="w-4 h-4" /> Escuchar biografía
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 mt-3 leading-relaxed font-medium">
            {activeLeaderModal.achievement}
          </p>

          <div className="mt-3 p-3 bg-white/80 rounded-2xl border border-purple-100 text-xs text-purple-950">
            <strong>Dato inspirador:</strong> {activeLeaderModal.funFact}
          </div>

          <blockquote className="mt-3 p-3 bg-slate-50/90 rounded-2xl border-l-4 border-purple-500 italic text-xs text-slate-700">
            &ldquo;{activeLeaderModal.quote}&rdquo;
          </blockquote>
        </div>
      )}

      {/* Modals */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        title="Instrucciones: Memorama de Pioneras y Científicas"
        objective="Encontrar los pares de tarjetas para descubrir las aportaciones de pioneras mexicanas e históricas en ciencia, arte, política y educación."
        rules={[
          "Toca una tarjeta para voltearla y busca su pareja idéntica.",
          "Al encontrar cada par, desbloquearás su cápsula biográfica oficial y podrás escuchar su narración en voz alta.",
          "Elige entre dificultad Fácil (6 cartas), Media (12 cartas) y Experta (16 cartas)."
        ]}
        tips={[
          "Presta atención al icono y al área de cada líder para memorizar su ubicación.",
          "Conoce a pioneras michoacanas como Amalia Solórzano de Cárdenas y las jóvenes de Morelia STEM."
        ]}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        title="¡Gran Descubridora de Pioneras!"
        score={Math.max(0, score)}
        stars={3}
        maxStars={3}
        takeaway="Has demostrado excelente memoria y conocido a grandes mujeres que transformaron la ciencia, el espacio y la historia de México."
        summaryPoints={[
          `Completaste el reto en ${moves} movimientos y ${formatTime(seconds)}.`,
          "Conociste aportes reales en astronomía, medicina, sufragio y robótica.",
          "Derribaste el mito de que las ciencias o el liderazgo son exclusivos de los varones."
        ]}
        onRestart={() => initializeDeck(difficulty)}
      />

      <EmergencyHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
