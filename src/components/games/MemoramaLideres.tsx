"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Award, RefreshCw, Volume2, CheckCircle2, Clock, Star, Sparkles, Layers, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { FEMALE_LEADERS, FemaleLeader } from "@/data/educational-content";
import { sound } from "@/utils/audio";

interface MemoryCard {
  uid: string;
  leaderId: string;
  leader: FemaleLeader;
  isFlipped: boolean;
  isMatched: boolean;
}

type BoardSize = "facil" | "medio" | "experto";

export default function MemoramaLideres() {
  const [boardSize, setBoardSize] = useState<BoardSize>("medio");
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [activeLeaderModal, setActiveLeaderModal] = useState<FemaleLeader | null>(null);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const getTargetPairs = useCallback((size: BoardSize) => {
    switch (size) {
      case "facil":
        return 3; // 6 cards
      case "medio":
        return 6; // 12 cards
      case "experto":
        return 8; // 16 cards
    }
  }, []);

  const initializeDeck = useCallback(
    (size: BoardSize) => {
      const pairCount = getTargetPairs(size);
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

      // Fisher-Yates shuffle
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
    },
    [getTargetPairs]
  );

  useEffect(() => {
    initializeDeck(boardSize);
  }, [boardSize, initializeDeck]);

  // Timer effect
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

    sound.playClick();

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
        // Matched
        setTimeout(() => {
          sound.playCorrect();
          firstCard.isMatched = true;
          secondCard.isMatched = true;
          setCards([...newCards]);
          setFlippedCards([]);
          setMatchedPairsCount((c) => c + 1);
          setActiveLeaderModal(firstCard.leader);

          const targetPairs = getTargetPairs(boardSize);
          if (matchedPairsCount + 1 === targetPairs) {
            setIsTimerRunning(false);
            sound.playCelebration();
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.55 },
            });
          }
        }, 350);
      } else {
        // Did not match
        setTimeout(() => {
          sound.playAlert();
          firstCard.isFlipped = false;
          secondCard.isFlipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const playLeaderAudio = (leader: FemaleLeader) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        `${leader.name}. ${leader.role}. Originaria de ${leader.origin}. ${leader.achievement}. Dato curioso: ${leader.funFact}. Frase inspiradora: ${leader.quote}`
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

  const targetPairs = getTargetPairs(boardSize);
  const isFinished = matchedPairsCount === targetPairs && targetPairs > 0;

  return (
    <div className="bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Award className="w-4 h-4" /> Nivel Infantil (6-9 años) • Mujeres Pioneras en STEM
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
            🧠 Memorama de Pioneras y Científicas
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Descubre los logros de científicas, activistas y líderes michoacanas y mexicanas.
          </p>
        </div>

        {/* Board Size / Difficulty selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                setBoardSize("facil");
                sound.playPowerup();
              }}
              className={`px-3 py-1 rounded-xl transition-all ${
                boardSize === "facil" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600"
              }`}
            >
              Fácil (3x2)
            </button>
            <button
              onClick={() => {
                setBoardSize("medio");
                sound.playPowerup();
              }}
              className={`px-3 py-1 rounded-xl transition-all ${
                boardSize === "medio" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600"
              }`}
            >
              Medio (4x3)
            </button>
            <button
              onClick={() => {
                setBoardSize("experto");
                sound.playPowerup();
              }}
              className={`px-3 py-1 rounded-xl transition-all ${
                boardSize === "experto" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600"
              }`}
            >
              Experto (4x4)
            </button>
          </div>

          <button
            onClick={() => initializeDeck(boardSize)}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Reiniciar partida"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2 text-indigo-700">
          <Clock className="w-4 h-4" />
          <span>Tiempo: {formatTime(seconds)}</span>
        </div>
        <div className="flex items-center gap-2 text-purple-700">
          <Layers className="w-4 h-4" />
          <span>Movimientos: {moves}</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="w-4 h-4" />
          <span>Pares: {matchedPairsCount} / {targetPairs}</span>
        </div>
      </div>

      {/* Memory Board Grid */}
      <div
        className={`grid gap-3 sm:gap-4 mt-6 ${
          boardSize === "facil"
            ? "grid-cols-2 sm:grid-cols-3"
            : boardSize === "medio"
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
              className={`h-32 sm:h-40 rounded-2xl p-2.5 flex flex-col items-center justify-between text-center transition-all duration-300 transform ${
                card.isMatched
                  ? "bg-emerald-50 border-2 border-emerald-400 shadow-xs"
                  : isRevealed
                  ? "bg-white border-2 border-purple-400 shadow-md scale-102"
                  : "bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white shadow-sm hover:scale-102 cursor-pointer border-2 border-indigo-400"
              }`}
              aria-label={`Carta ${idx + 1}`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-between h-full py-1 w-full">
                  <span className="text-3xl">{card.leader.avatarIcon}</span>
                  <div>
                    <h4 className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight line-clamp-2">
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
                  <Sparkles className="w-7 h-7 text-yellow-300 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/90">
                    ODS 5
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Finished Banner */}
      {isFinished && (
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <div>
              <h4 className="font-black text-base">¡Completaste el Memorama!</h4>
              <p className="text-xs text-emerald-100">
                Logrado en {moves} movimientos y {formatTime(seconds)}. ¡Conociste a grandes pioneras mexicanas!
              </p>
            </div>
          </div>
          <button
            onClick={() => initializeDeck(boardSize)}
            className="px-4 py-2 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow hover:bg-emerald-50"
          >
            Jugar otra vez
          </button>
        </div>
      )}

      {/* Biographic Capsule Modal Card */}
      {activeLeaderModal && (
        <div className="mt-6 p-5 rounded-3xl bg-white border-2 border-purple-200 shadow-md animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2 bg-purple-50 rounded-2xl border border-purple-100">
                {activeLeaderModal.avatarIcon}
              </span>
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md">
                  {activeLeaderModal.area} • {activeLeaderModal.origin}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {activeLeaderModal.name}
                </h3>
                <p className="text-xs font-semibold text-purple-700">
                  {activeLeaderModal.role}
                </p>
              </div>
            </div>

            <button
              onClick={() => playLeaderAudio(activeLeaderModal)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow transition-colors shrink-0"
            >
              <Volume2 className="w-4 h-4" /> Escuchar biografía
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 mt-3 leading-relaxed">
            {activeLeaderModal.achievement}
          </p>

          <div className="mt-3 p-3 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs text-purple-900">
            <strong>Dato curioso:</strong> {activeLeaderModal.funFact}
          </div>

          <blockquote className="mt-3 p-3 bg-slate-50 rounded-2xl border-l-4 border-purple-500 italic text-xs text-slate-600">
            &ldquo;{activeLeaderModal.quote}&rdquo;
          </blockquote>
        </div>
      )}
    </div>
  );
}
