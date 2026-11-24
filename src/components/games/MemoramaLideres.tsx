"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Clock, Flame, Volume2, RotateCcw, Sparkles, Timer } from "lucide-react";
import GameShell, { DifficultyLevel } from "@/components/common/GameShell";
import Button3D from "@/components/common/Button3D";
import { FEMALE_LEADERS, FemaleLeader, MEMORAMA_TUTORIAL } from "@/content/game3-memorama";
import { useSound } from "@/hooks/useSound";

interface GameProps {
  onHome?: () => void;
  onNextGame?: () => void;
}

interface MemoryCard {
  uid: string;
  leaderId: string;
  leader: FemaleLeader;
  isFlipped: boolean;
  isMatched: boolean;
}

/** Retrato SVG estilizado único por pionera mexicana/michoacana (sin fotos externas) */
function LeaderPortrait({ leaderId }: { leaderId: string }) {
  const styles: Record<string, { bg: string; skin: string; hair: string; outfit: string; prop: string }> = {
    katya: { bg: "#dbeafe", skin: "#e6b89c", hair: "#1e1b4b", outfit: "#f8fafc", prop: "🚀" },
    amalia: { bg: "#fef3c7", skin: "#e7bc91", hair: "#334155", outfit: "#be123c", prop: "🕊️" },
    sor_juana: { bg: "#d1fae5", skin: "#f3d5b5", hair: "#1e293b", outfit: "#0f172a", prop: "📜" },
    julieta: { bg: "#f3e8ff", skin: "#ecc8af", hair: "#78350f", outfit: "#7c3aed", prop: "🔭" },
    elvia: { bg: "#ffe4e6", skin: "#e5b293", hair: "#1e293b", outfit: "#e11d48", prop: "⚖️" },
    matilde: { bg: "#ccfbf1", skin: "#edd1b0", hair: "#292524", outfit: "#ffffff", prop: "🩺" },
    mariana: { bg: "#e0e7ff", skin: "#d9a07e", hair: "#0f172a", outfit: "#2563eb", prop: "🤖" },
    frida: { bg: "#fae8ff", skin: "#e2b08d", hair: "#09090b", outfit: "#db2777", prop: "🎨" },
  };
  const s = styles[leaderId] ?? styles.katya;

  return (
    <svg viewBox="0 0 90 90" className="w-14 h-14 sm:w-20 sm:h-20 mx-auto shrink-0" aria-hidden="true">
      <circle cx="45" cy="45" r="42" fill={s.bg} />
      {/* Cabello trasero */}
      <circle cx="45" cy="36" r="21" fill={s.hair} />
      {/* Hombros / atuendo */}
      <path d="M 18 80 Q 45 58 72 80 Z" fill={s.outfit} stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Rostro */}
      <circle cx="45" cy="39" r="15" fill={s.skin} />
      {/* Detalle cultural para Frida o Katya */}
      {leaderId === "frida" && (
        <>
          <circle cx="35" cy="22" r="4.5" fill="#f43f5e" />
          <circle cx="45" cy="20" r="5" fill="#fbbf24" />
          <circle cx="55" cy="22" r="4.5" fill="#ec4899" />
          <path d="M 38 35 Q 45 33 52 35" stroke={s.hair} strokeWidth="2.5" fill="none" />
        </>
      )}
      {leaderId === "katya" && (
        <circle cx="45" cy="39" r="20" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 3" />
      )}
      {/* Ojos y sonrisa */}
      <circle cx="40" cy="38" r="2" fill="#1e293b" />
      <circle cx="50" cy="38" r="2" fill="#1e293b" />
      <path d="M 40 44 Q 45 48 50 44" stroke="#9a3412" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Insignia temática */}
      <circle cx="70" cy="70" r="13" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <text x="70" y="75" textAnchor="middle" fontSize="13">{s.prop}</text>
    </svg>
  );
}

function buildShuffledDeck(targetPairs: number): MemoryCard[] {
  const selected = FEMALE_LEADERS.slice(0, targetPairs);
  const deck: MemoryCard[] = [];
  selected.forEach((leader) => {
    deck.push({ uid: `${leader.id}-a`, leaderId: leader.id, leader, isFlipped: false, isMatched: false });
    deck.push({ uid: `${leader.id}-b`, leaderId: leader.id, leader, isFlipped: false, isMatched: false });
  });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function MemoramaGameplay({
  difficulty,
  onComplete,
}: {
  difficulty: DifficultyLevel;
  onComplete: (stars: 0 | 1 | 2 | 3, score: number, maxScore: number, msg: string) => void;
}) {
  const { playFlip, playCorrect, playAlert, playClick } = useSound();

  const targetPairs = difficulty === "facil" ? 3 : difficulty === "normal" ? 6 : 8;
  const timedLimit = difficulty === "facil" ? 90 : difficulty === "normal" ? 120 : 140;

  const [timedMode, setTimedMode] = useState(difficulty === "reto");
  const [cards, setCards] = useState<MemoryCard[]>(() => buildShuffledDeck(targetPairs));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [capsule, setCapsule] = useState<FemaleLeader | null>(null);

  const initDeck = useCallback(() => {
    setCards(buildShuffledDeck(targetPairs));
    setFlipped([]);
    setMatchedCount(0);
    setMoves(0);
    setCombo(0);
    setMaxCombo(0);
    setScore(0);
    setSeconds(0);
    setRunning(false);
    setCapsule(null);
  }, [targetPairs]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        if (timedMode && next >= timedLimit) {
          setRunning(false);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, timedMode, timedLimit]);

  const timeExpired = timedMode && seconds >= timedLimit && matchedCount < targetPairs;

  useEffect(() => {
    if (timeExpired) {
      onComplete(
        matchedCount >= Math.ceil(targetPairs / 2) ? 1 : 0,
        score,
        targetPairs * 150,
        `¡Se acabó el tiempo! Descubriste ${matchedCount} de ${targetPairs} pioneras mexicanas. ¡Inténtalo de nuevo!`
      );
    }
  }, [timeExpired, matchedCount, targetPairs, score, onComplete]);

  const handleCardClick = (index: number) => {
    if (timeExpired || cards[index].isFlipped || cards[index].isMatched || flipped.length === 2) return;
    if (!running) setRunning(true);

    playFlip();
    const updated = [...cards];
    updated[index] = { ...updated[index], isFlipped: true };
    setCards(updated);

    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [i1, i2] = nextFlipped;
      const c1 = updated[i1];
      const c2 = updated[i2];

      if (c1.leaderId === c2.leaderId) {
        setTimeout(() => {
          playCorrect();
          const newCombo = combo + 1;
          const gained = 100 + (newCombo - 1) * 50;
          const nextScore = score + gained;
          const nextMatched = matchedCount + 1;

          setCards((prev) =>
            prev.map((c, idx) => (idx === i1 || idx === i2 ? { ...c, isMatched: true } : c))
          );
          setFlipped([]);
          setCombo(newCombo);
          setMaxCombo((mc) => Math.max(mc, newCombo));
          setScore(nextScore);
          setMatchedCount(nextMatched);
          setCapsule(c1.leader);

          if (nextMatched === targetPairs) {
            setRunning(false);
            const maxPossible = targetPairs * 150;
            const stars: 0 | 1 | 2 | 3 =
              moves <= targetPairs + 3 ? 3 : moves <= targetPairs * 2 ? 2 : 1;
            setTimeout(() => {
              onComplete(
                stars,
                nextScore,
                maxPossible,
                `¡Completaste el tablero de ${targetPairs} pioneras en ${moves + 1} intentos con combo máximo x${Math.max(maxCombo, newCombo)}!`
              );
            }, 900);
          }
        }, 280);
      } else {
        setTimeout(() => {
          playAlert();
          setCombo(0);
          setCards((prev) =>
            prev.map((c, idx) => (idx === i1 || idx === i2 ? { ...c, isFlipped: false } : c))
          );
          setFlipped([]);
        }, 800);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakLeader = (leader: FemaleLeader) => {
    playClick();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(
      `${leader.name}. ${leader.role}. ${leader.achievement}. Dato curioso: ${leader.funFact}`
    );
    u.lang = "es-MX";
    window.speechSynthesis.speak(u);
  };

  const gridColsClass =
    difficulty === "facil" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-3 sm:grid-cols-4";

  const remaining = Math.max(0, timedLimit - seconds);
  const displayTime = timedMode ? remaining : seconds;
  const mins = Math.floor(displayTime / 60);
  const secs = displayTime % 60;

  return (
    <div className="bg-white rounded-4xl border-2 border-amber-200 shadow-xl p-5 sm:p-8 space-y-6">
      {/* HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 text-xs font-black">
            Parejas: {matchedCount}/{targetPairs}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-black">
            Movimientos: {moves}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-black inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {mins}:{secs < 10 ? "0" : ""}{secs}
          </span>
          {combo > 1 && (
            <span className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-black inline-flex items-center gap-1 animate-pop">
              <Flame className="w-3.5 h-3.5" /> Combo x{combo}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClick();
              setTimedMode((v) => !v);
            }}
            className={`min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 ${
              timedMode
                ? "bg-rose-600 text-white border-rose-700"
                : "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <Timer className="w-4 h-4" />
            {timedMode ? "Contrarreloj ON" : "Contrarreloj OFF"}
          </button>

          <button
            onClick={() => {
              playClick();
              initDeck();
            }}
            className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Barajar
          </button>
        </div>
      </div>

      {/* Cápsula biográfica al descubrir pareja */}
      {capsule && (
        <div className="rounded-3xl border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 p-4 flex flex-col sm:flex-row items-center gap-4 animate-scaleUp">
          <LeaderPortrait leaderId={capsule.id} />
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-600 text-white">
                {capsule.area}
              </span>
              <span className="text-xs font-bold text-slate-500">{capsule.origin}</span>
            </div>
            <h3 className="text-base sm:text-lg font-display font-black text-slate-900">
              {capsule.name} — {capsule.role}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700">{capsule.achievement}</p>
            <p className="text-xs font-bold text-purple-900">
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              Dato curioso: {capsule.funFact}
            </p>
          </div>
          <Button3D
            variant="secondary"
            size="sm"
            onClick={() => speakLeader(capsule)}
            icon={<Volume2 className="w-4 h-4" />}
          >
            Escuchar
          </Button3D>
        </div>
      )}

      {/* Tablero 3D CSS */}
      <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
        {cards.map((card, i) => {
          const revealed = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.uid}
              onClick={() => handleCardClick(i)}
              disabled={card.isMatched}
              aria-label={
                revealed
                  ? `Carta descubierta: ${card.leader.name}`
                  : `Carta oculta número ${i + 1}`
              }
              className="perspective-1000 h-40 sm:h-44 w-full text-left focus-visible:ring-4 rounded-2xl"
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                  revealed ? "rotate-y-180" : ""
                }`}
              >
                {/* Reverso */}
                <div className="absolute inset-0 backface-hidden rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-600 via-indigo-600 to-fuchsia-600 text-white flex flex-col items-center justify-center shadow-md hover:shadow-lg">
                  <span className="text-3xl font-black">5</span>
                  <span className="text-[11px] font-bold tracking-wider uppercase opacity-90 mt-1">
                    Pioneras
                  </span>
                </div>

                {/* Frente */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 p-2.5 flex flex-col items-center justify-between text-center shadow-md ${
                    card.isMatched
                      ? "bg-emerald-50 border-emerald-400"
                      : "bg-white border-purple-300"
                  }`}
                >
                  <LeaderPortrait leaderId={card.leaderId} />
                  <div>
                    <p className="text-xs font-black text-slate-900 leading-tight line-clamp-2">
                      {card.leader.name}
                    </p>
                    <p className="text-[10px] font-bold text-purple-700 mt-0.5">
                      {card.leader.area}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MemoramaLideres({ onHome, onNextGame }: GameProps) {
  return (
    <GameShell
      gameId="memorama"
      tutorialSteps={MEMORAMA_TUTORIAL}
      difficulties={[
        { id: "facil", label: "Tablero 3x2 (6 cartas)", subtitle: "3 pioneras mexicanas · ideal para empezar", emoji: "🌱" },
        { id: "normal", label: "Tablero 4x3 (12 cartas)", subtitle: "6 mujeres STEM, arte e historia", emoji: "🧠" },
        { id: "reto", label: "Tablero 4x4 Contrarreloj (16 cartas)", subtitle: "Todas las pioneras con límite de tiempo", emoji: "⏱️" },
      ]}
      onHome={onHome}
      onNextGame={onNextGame}
    >
      {({ difficulty, finishGame }) => (
        <MemoramaGameplay difficulty={difficulty} onComplete={finishGame} />
      )}
    </GameShell>
  );
}
