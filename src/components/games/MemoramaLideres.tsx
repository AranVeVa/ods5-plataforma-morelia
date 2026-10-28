"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Award, RefreshCw, Volume2, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { FEMALE_LEADERS, FemaleLeader } from "@/data/educational-content";

interface MemoryCard {
  uid: string;
  leaderId: string;
  leader: FemaleLeader;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoramaLideres() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [activeLeaderModal, setActiveLeaderModal] = useState<FemaleLeader | null>(null);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);

  // Initialize deck
  const initializeDeck = () => {
    const deck: MemoryCard[] = [];
    FEMALE_LEADERS.forEach((leader) => {
      deck.push({
        uid: `${leader.id}-1`,
        leaderId: leader.id,
        leader,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        uid: `${leader.id}-2`,
        leaderId: leader.id,
        leader,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle algorithm (Fisher-Yates)
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedCards([]);
    setMatchedPairsCount(0);
    setMoves(0);
    setActiveLeaderModal(null);
  };

  useEffect(() => {
    initializeDeck();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedCards.length === 2) {
      return;
    }

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
          firstCard.isMatched = true;
          secondCard.isMatched = true;
          setCards([...newCards]);
          setFlippedCards([]);
          setMatchedPairsCount((c) => c + 1);
          setActiveLeaderModal(firstCard.leader);

          // Voice feedback capsule using SpeechSynthesis if available
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            const utter = new SpeechSynthesisUtterance(
              `¡Par encontrado! ${firstCard.leader.name}. ${firstCard.leader.role}.`
            );
            utter.lang = "es-MX";
            window.speechSynthesis.speak(utter);
          }

          if (matchedPairsCount + 1 === FEMALE_LEADERS.length) {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 },
            });
          }
        }, 400);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          firstCard.isFlipped = false;
          secondCard.isFlipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 1100);
      }
    }
  };

  const playLeaderAudio = (leader: FemaleLeader) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        `${leader.name}. ${leader.role}. ${leader.achievement}. Frase inspiradora: ${leader.quote}`
      );
      utter.lang = "es-MX";
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <Award className="w-4 h-4" /> Nivel Infantil (6-9 años) • STEM y Empoderamiento
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">
            🧠 Memorama de Mujeres Líderes
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Encuentra los pares de científicas, activistas y pioneras mexicanas e históricas para conocer sus logros.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-semibold block">Movimientos: {moves}</span>
            <span className="text-xs font-bold text-purple-600 block">Pares: {matchedPairsCount}/{FEMALE_LEADERS.length}</span>
          </div>
          <button
            onClick={initializeDeck}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Reiniciar Memorama"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of memory cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {cards.map((card, idx) => {
          const isRevealed = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.uid}
              onClick={() => handleCardClick(idx)}
              disabled={isRevealed}
              className={`h-36 sm:h-44 rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300 transform perspective-1000 ${
                card.isMatched
                  ? "bg-emerald-50 border-2 border-emerald-400 shadow-sm"
                  : isRevealed
                  ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-purple-400 shadow-md scale-105"
                  : "bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white shadow-md hover:scale-102 cursor-pointer border-2 border-indigo-400"
              }`}
              aria-label={`Tarjeta ${idx + 1}`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-between h-full py-1">
                  <span className="text-3xl">
                    {card.leader.area === "STEM" ? "🔬" : card.leader.area === "Arte y Cultura" ? "📜" : "⚖️"}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {card.leader.name}
                    </h4>
                    <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">
                      {card.leader.area}
                    </span>
                  </div>
                  {card.isMatched && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> ¡Completado!
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                  <span className="text-xs font-bold tracking-wider uppercase text-white/90">
                    ODS 5
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Modal/Capsule on found pair */}
      {activeLeaderModal && (
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold tracking-wide uppercase px-2.5 py-1 bg-purple-200 text-purple-900 rounded-lg">
                🌟 Cápsula Biográfica: {activeLeaderModal.area}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                {activeLeaderModal.name}
              </h3>
              <p className="text-xs font-semibold text-purple-700">
                {activeLeaderModal.role}
              </p>
            </div>
            <button
              onClick={() => playLeaderAudio(activeLeaderModal)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow transition-colors shrink-0"
            >
              <Volume2 className="w-4 h-4" /> Escuchar cápsula
            </button>
          </div>

          <p className="text-sm text-slate-700 mt-3 leading-relaxed">
            {activeLeaderModal.achievement}
          </p>

          <blockquote className="mt-3 p-3 bg-white/80 rounded-xl border-l-4 border-purple-500 italic text-xs text-slate-600">
            &ldquo;{activeLeaderModal.quote}&rdquo;
          </blockquote>
        </div>
      )}
    </div>
  );
}
