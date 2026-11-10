"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  X,
  PhoneCall,
  MapPin,
  Clock,
  Check,
  Copy,
  Heart,
  HelpCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { MORELIA_RESOURCES } from "@/data/educational-content";
import { sound } from "@/utils/audio";

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyHelpModal({ isOpen, onClose }: EmergencyHelpModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    sound.playClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-indigo-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0 shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-200 bg-white/10 px-2.5 py-0.5 rounded-full inline-block">
                Espacio Seguro y Confidencial
              </span>
              <h2 id="emergency-modal-title" className="text-xl sm:text-2xl font-black mt-1">
                ¿Necesitas ayuda o apoyo?
              </h2>
              <p className="text-xs text-rose-100 font-medium mt-0.5">
                Aquí tienes orientación inmediata y números directos de atención gratuita en Morelia.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Cerrar ventana de ayuda"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          {/* Key Protective Socioemotional Affirmations */}
          <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-indigo-50 border-2 border-rose-200 rounded-2xl p-4 sm:p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
              Recuerda siempre estas reglas de protección:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Tu cuerpo te pertenece solo a ti</strong> y merece respeto en todo momento.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Puedes decir ¡NO!</strong> con firmeza cuando algo o alguien te haga sentir incomodidad, miedo o confusión.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No tienes la obligación de aceptar abrazos</strong>, besos ni contactos físicos si no lo deseas.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Nunca guardes secretos</strong> que te hagan sentir malestar, tristeza o peligro.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Cuéntaselo a una persona adulta de confianza</strong> (mamá, papá, abuelos, maestras o personal directivo escolar).</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Si la primera persona no te escucha, insiste</strong> con otra hasta recibir el apoyo que necesitas.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>NUNCA es tu culpa</strong> que otra persona no respete tus límites personales.</span>
              </li>
            </ul>
          </div>

          {/* Emergency Direct Directory in Morelia */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-600" />
                Directorio Oficial en Morelia y Michoacán:
              </h3>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                100% Gratuito y Confidencial
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {MORELIA_RESOURCES.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-indigo-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md inline-block">
                      {item.scope}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {item.institution}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      {item.hours}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <a
                      href={`tel:${item.phone.replace(/\D/g, "")}`}
                      onClick={() => sound.playClick()}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{item.phone}</span>
                    </a>
                    <button
                      onClick={() => handleCopy(item.id, item.phone)}
                      className="p-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Copiar número"
                      aria-label={`Copiar teléfono de ${item.institution}`}
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Aviso de Privacidad por Diseño:</strong> Esta plataforma no registra tus consultas, no solicita datos personales ni rastrea tu actividad.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow transition-colors"
          >
            Entendido, volver al juego
          </button>
        </div>
      </div>
    </div>
  );
}
