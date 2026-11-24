"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  Copy,
  Check,
  Clock,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { MORELIA_RESOURCES } from "@/data/educational-content";
import { useSound } from "@/hooks/useSound";

interface SupportLine {
  id: string;
  institution: string;
  scope: string;
  phone: string;
  telHref: string;
  hours: string;
  location: string;
  category: "nacional" | "estatal" | "municipal";
  description: string;
}

const SUPPORT_DIRECTORY: SupportLine[] = [
  {
    id: "linea-vida",
    institution: "Línea de la Vida",
    scope: "Nacional · Apoyo Emocional y Crisis 24/7",
    phone: "800 911 2000",
    telHref: "tel:8009112000",
    hours: "24 horas, los 365 días del año",
    location: "Cobertura Nacional (Gratuita)",
    category: "nacional",
    description:
      "Atención psicológica inmediata, escucha empática y orientación especializada en crisis socioemocionales.",
  },
  {
    id: "linea-mujeres",
    institution: "Línea Mujeres / Telmujer",
    scope: "Nacional · Orientación ante Violencia de Género",
    phone: "800 108 4053",
    telHref: "tel:8001084053",
    hours: "24 horas, todos los días",
    location: "Cobertura Nacional (Confidencial)",
    category: "nacional",
    description:
      "Acompañamiento psicológico y asesoría jurídica gratuita para mujeres, niñas y adolescentes.",
  },
  {
    id: "emergencias-911",
    institution: "Emergencias 911 · Código Violeta",
    scope: "Nacional / Michoacán · Riesgo Inmediato",
    phone: "911",
    telHref: "tel:911",
    hours: "24 horas, llamada gratuita",
    location: "C5i Michoacán · Morelia",
    category: "nacional",
    description:
      "Despacho inmediato de policía de género, paramédicos y protección urgente en situaciones de peligro.",
  },
  {
    id: "denuncia-089",
    institution: "Denuncia Anónima 089",
    scope: "Nacional / Michoacán · Reporte Confidencial",
    phone: "089",
    telHref: "tel:089",
    hours: "24 horas, todos los días",
    location: "Cobertura Estatal y Nacional",
    category: "nacional",
    description:
      "Canal anónimo para reportar delitos, acoso, extorsión digital o violencia sin exponer tu identidad.",
  },
  {
    id: "dif-michoacan",
    institution: "DIF Michoacán / Procuraduría de Protección de Niñas, Niños y Adolescentes",
    scope: "Estatal · Protección a la Infancia",
    phone: "443 313 3540",
    telHref: "tel:4433133540",
    hours: "Lunes a Viernes 9:00 a 16:00 hrs (Guardias de emergencia)",
    location: "Av. Acueducto esq. Ventura Puente, Col. Chapultepec Norte, Morelia",
    category: "estatal",
    description:
      "Protección legal, psicológica y asistencial prioritaria para niñas, niños y adolescentes en situación de vulnerabilidad.",
  },
  {
    id: "fiscalia-michoacan",
    institution: "Fiscalía General del Estado de Michoacán (FGE) y Policía Cibernética",
    scope: "Estatal · Denuncia Penal y Ley Olimpia",
    phone: "443 322 3600",
    telHref: "tel:4433223600",
    hours: "Atención 24/7 en Ministerio Público",
    location: "Periférico Independencia #5000, Col. Sentimientos de la Nación, Morelia",
    category: "estatal",
    description:
      "Recepción de denuncias, medidas de protección y atención especializada en violencia digital (Ext. 1065).",
  },
  ...MORELIA_RESOURCES.filter((r) => ["seimujer", "cjm", "immujeris"].includes(r.id)).map((r) => ({
    id: r.id,
    institution: r.institution,
    scope: r.scope,
    phone: r.phone,
    telHref: `tel:${r.phone.replace(/\D/g, "")}`,
    hours: r.hours,
    location: `${r.address}, ${r.colonia}`,
    category: (r.id === "immujeris" ? "municipal" : "estatal") as "municipal" | "estatal",
    description: r.description,
  })),
];

export default function DirectorioApoyo({ compact = false }: { compact?: boolean }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"todos" | "nacional" | "estatal" | "municipal">("todos");
  const { playClick } = useSound();

  const handleCopy = (id: string, phone: string) => {
    playClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filtered = SUPPORT_DIRECTORY.filter((item) =>
    filter === "todos" ? true : item.category === filter
  );

  return (
    <div className="space-y-4">
      {/* Regla de oro para infancias y juventudes */}
      <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-indigo-50 border-2 border-rose-200 rounded-2xl p-4">
        <p className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5 mb-2">
          <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
          Mensaje importante de protección
        </p>
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
          Si algo te hace sentir incómodo/a, inseguro/a o en peligro: <strong>no es tu culpa</strong>.
          <strong> Confía en un adulto de confianza</strong> (mamá, papá, maestra, orientador/a o familiar cercano)
          y recuerda que puedes comunicarte gratis y de forma confidencial con estas instituciones.
        </p>
      </div>

      {/* Aviso obligatorio de verificación de vigencia */}
      <div
        role="note"
        className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 flex items-start gap-2.5 text-amber-950"
      >
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong>Aviso institucional:</strong> Los números telefónicos, extensiones y domicilios de apoyo
          en Morelia y a nivel nacional corresponden a directorios públicos de referencia.{" "}
          <span className="underline font-bold">
            Verifica la vigencia y horarios actualizados de cada línea antes de publicar esta plataforma en producción escolar.
          </span>
        </div>
      </div>

      {/* Filtros de ámbito */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar líneas de apoyo">
        {[
          { key: "todos", label: `Todas (${SUPPORT_DIRECTORY.length})` },
          { key: "nacional", label: "🇲🇽 Nacionales" },
          { key: "estatal", label: "🏛️ Michoacán" },
          { key: "municipal", label: "📍 Morelia" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              playClick();
              setFilter(tab.key as typeof filter);
            }}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              filter === tab.key
                ? "bg-indigo-600 text-white border-indigo-700 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista de contactos */}
      <div className={`grid grid-cols-1 ${compact ? "" : "md:grid-cols-2"} gap-3`}>
        {filtered.map((item) => (
          <article
            key={item.id}
            className="p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-300 transition-all flex flex-col justify-between gap-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                  {item.scope}
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-sm leading-snug">{item.institution}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              <div className="pt-1 space-y-1 text-[11px] text-slate-600">
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{item.hours}</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{item.location}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <a
                href={item.telHref}
                onClick={() => playClick()}
                className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
                aria-label={`Llamar a ${item.institution} al ${item.phone}`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Llamar: {item.phone}</span>
              </a>
              <button
                onClick={() => handleCopy(item.id, item.phone)}
                className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors inline-flex items-center justify-center"
                title="Copiar número"
                aria-label={`Copiar número ${item.phone} de ${item.institution}`}
              >
                {copiedId === item.id ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Nota Privacy by Design */}
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>
          <strong>Privacidad garantizada:</strong> Consultar este directorio no deja ningún rastro, cookie ni registro en servidores.
        </span>
      </div>
    </div>
  );
}
