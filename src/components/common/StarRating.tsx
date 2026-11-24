"use client";
import React from "react";

interface StarRatingProps {
  stars: 0 | 1 | 2 | 3;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  showLabel?: boolean;
}

const sizeMap = { sm: "text-xl", md: "text-3xl", lg: "text-5xl" };
const labels = ["Sin completar", "¡Bien hecho!", "¡Muy bien!", "¡Perfecto!"];

export default function StarRating({
  stars,
  size = "md",
  animated = true,
  showLabel = false,
}: StarRatingProps) {
  return (
    <div className="flex flex-col items-center gap-1" role="img" aria-label={`${stars} de 3 estrellas`}>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => {
          const filled = i <= stars;
          return (
            <span
              key={i}
              className={`${sizeMap[size]} transition-all ${
                animated && filled ? "animate-pop" : ""
              }`}
              style={animated && filled ? { animationDelay: `${(i - 1) * 150}ms` } : {}}
              aria-hidden="true"
            >
              {filled ? "⭐" : "☆"}
            </span>
          );
        })}
      </div>
      {showLabel && (
        <span className="text-sm font-bold text-slate-600 mt-1">{labels[stars]}</span>
      )}
    </div>
  );
}
