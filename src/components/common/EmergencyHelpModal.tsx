"use client";

import React from "react";
import { ShieldAlert, X, ShieldCheck } from "lucide-react";
import DirectorioApoyo from "@/components/DirectorioApoyo";
import { sound } from "@/utils/audio";

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyHelpModal({ isOpen, onClose }: EmergencyHelpModalProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-rose-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 text-white p-5 sm:p-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-100 bg-white/15 px-2.5 py-0.5 rounded-full inline-block">
                Espacio Seguro y Confidencial
              </span>
              <h2 id="emergency-modal-title" className="text-xl sm:text-2xl font-black mt-1">
                Directorio de Apoyo · Morelia y Nacional
              </h2>
              <p className="text-xs text-rose-100 font-medium mt-0.5">
                Líneas gratuitas de atención psicológica, jurídica y de emergencia.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="min-w-[44px] min-h-[44px] p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors inline-flex items-center justify-center"
            aria-label="Cerrar ventana de ayuda"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          <DirectorioApoyo />
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Privacy by Design · Sin historial ni rastreo
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow transition-colors"
          >
            Entendido, volver
          </button>
        </div>
      </div>
    </div>
  );
}
