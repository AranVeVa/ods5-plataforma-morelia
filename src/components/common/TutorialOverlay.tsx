"use client";
import React, { useState, useEffect, ReactNode } from "react";
import Button3D from "./Button3D";
import { useAccessibility } from "@/context/AppProviders";

interface TutorialStep {
  emoji: string;
  title: string;
  description: string;
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  onComplete: () => void;
  accentColor?: "indigo" | "emerald" | "blue" | "violet";
  gameTitle?: string;
  children?: ReactNode;
}

const ACCENT_CLASSES: Record<
  NonNullable<TutorialOverlayProps["accentColor"]>,
  { header: string; bar: string }
> = {
  indigo: { header: "from-indigo-600 to-indigo-700", bar: "bg-indigo-600" },
  emerald: { header: "from-emerald-600 to-teal-700", bar: "bg-emerald-600" },
  blue: { header: "from-blue-600 to-cyan-700", bar: "bg-blue-600" },
  violet: { header: "from-violet-600 to-purple-700", bar: "bg-violet-600" },
};

/**
 * TutorialOverlay — Tutorial guiado saltable y pausable (WCAG 2.1 SC 2.2.1).
 * Respeta el modo de movimiento reducido desactivando el avance automático por tiempo.
 */
export default function TutorialOverlay({
  steps,
  onComplete,
  accentColor = "indigo",
  gameTitle,
}: TutorialOverlayProps) {
  const { reducedMotion } = useAccessibility();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stepDuration = Math.floor(15000 / Math.max(1, steps.length));
  const styles = ACCENT_CLASSES[accentColor] ?? ACCENT_CLASSES.indigo;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onComplete();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onComplete]);

  useEffect(() => {
    if (reducedMotion || isPaused || steps.length === 0) return;

    const intervalMs = 50;
    const stepsTotal = stepDuration / intervalMs;
    let tick = 0;

    const interval = window.setInterval(() => {
      tick++;
      setProgress(Math.min(100, (tick / stepsTotal) * 100));

      if (tick >= stepsTotal) {
        window.clearInterval(interval);
        if (currentStep + 1 >= steps.length) {
          onComplete();
        } else {
          setProgress(0);
          setCurrentStep((prev) => prev + 1);
        }
      }
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [currentStep, stepDuration, steps.length, onComplete, reducedMotion, isPaused]);

  const step = steps[currentStep] ?? steps[0];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setProgress(0);
      setCurrentStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fadeIn p-3"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
    >
      <div className="bg-white rounded-4xl shadow-float max-w-sm w-full overflow-hidden animate-scaleUp border-2 border-slate-200">
        <div className={`bg-gradient-to-r ${styles.header} p-5 text-white text-center`}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/90 mb-1">Tutorial</p>
          {gameTitle && (
            <h2 id="tutorial-title" className="text-lg font-black">
              {gameTitle}
            </h2>
          )}
          <div className="flex justify-center gap-1.5 mt-3" aria-hidden="true">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? "w-6 bg-white" : i < currentStep ? "w-3 bg-white/75" : "w-3 bg-white/35"
                }`}
              />
            ))}
          </div>
        </div>

        <div key={currentStep} className="p-6 text-center animate-scaleUp">
          <div className="text-6xl mb-4 animate-bounceGentle inline-block" aria-hidden="true">
            {step.emoji}
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">{step.title}</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{step.description}</p>
        </div>

        {!reducedMotion && (
          <div className="mx-6 mb-3 space-y-1.5">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${styles.bar} rounded-full transition-none`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 underline min-h-[28px] px-2"
              >
                {isPaused ? "Reanudar avance automático" : "Pausar para leer con calma"}
              </button>
            </div>
          </div>
        )}

        <div className="p-4 pt-1 flex gap-2">
          <Button3D variant="ghost" size="sm" fullWidth onClick={onComplete}>
            Saltar
          </Button3D>
          <Button3D variant="primary" size="sm" fullWidth onClick={handleNext}>
            {currentStep < steps.length - 1 ? "Siguiente →" : "¡Jugar!"}
          </Button3D>
        </div>
      </div>
    </div>
  );
}
