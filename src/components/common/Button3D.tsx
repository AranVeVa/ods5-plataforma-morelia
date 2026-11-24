"use client";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "success" | "danger" | "warning" | "ghost" | "infantil" | "intermedio" | "juvenil";
type Size = "sm" | "md" | "lg" | "xl";

interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const variantStyles: Record<Variant, { top: string; bottom: string; text: string }> = {
  primary: {
    top: "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white border-indigo-700",
    bottom: "bg-indigo-700",
    text: "text-white",
  },
  secondary: {
    top: "bg-gradient-to-b from-slate-100 to-slate-200 text-slate-800 border-slate-300",
    bottom: "bg-slate-300",
    text: "text-slate-700",
  },
  success: {
    top: "bg-gradient-to-b from-emerald-400 to-emerald-500 text-white border-emerald-600",
    bottom: "bg-emerald-600",
    text: "text-white",
  },
  danger: {
    top: "bg-gradient-to-b from-rose-400 to-rose-500 text-white border-rose-600",
    bottom: "bg-rose-600",
    text: "text-white",
  },
  warning: {
    top: "bg-gradient-to-b from-amber-400 to-amber-500 text-white border-amber-600",
    bottom: "bg-amber-600",
    text: "text-white",
  },
  ghost: {
    top: "bg-white/80 hover:bg-white text-slate-700 border-slate-200",
    bottom: "bg-slate-200",
    text: "text-slate-600",
  },
  infantil: {
    top: "bg-gradient-to-b from-emerald-400 to-emerald-500 text-white border-emerald-700",
    bottom: "bg-emerald-700",
    text: "text-white",
  },
  intermedio: {
    top: "bg-gradient-to-b from-blue-400 to-blue-600 text-white border-blue-700",
    bottom: "bg-blue-700",
    text: "text-white",
  },
  juvenil: {
    top: "bg-gradient-to-b from-violet-500 to-violet-600 text-white border-violet-700",
    bottom: "bg-violet-700",
    text: "text-white",
  },
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs font-bold rounded-xl gap-1.5 min-h-[36px]",
  md: "px-5 py-2.5 text-sm font-bold rounded-2xl gap-2 min-h-[44px]",
  lg: "px-6 py-3 text-base font-bold rounded-2xl gap-2.5 min-h-[52px]",
  xl: "px-8 py-4 text-lg font-black rounded-3xl gap-3 min-h-[60px]",
};

export default function Button3D({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "left",
  loading = false,
  className = "",
  disabled,
  onClick,
  ...rest
}: Button3DProps) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center select-none
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${styles.top}
        border-b-4
        shadow-md
        transition-all duration-100 ease-out
        hover:-translate-y-0.5 hover:shadow-lg
        active:translate-y-1 active:border-b-0 active:shadow-sm
        disabled:opacity-50 disabled:pointer-events-none
        focus-visible:ring-4 focus-visible:ring-offset-2
        ${className}
      `}
      aria-disabled={isDisabled}
      aria-busy={loading}
    >
      {loading && (
        <svg
          className="animate-spin mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {icon && iconPosition === "left" && !loading && (
        <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span>
      )}
    </button>
  );
}
