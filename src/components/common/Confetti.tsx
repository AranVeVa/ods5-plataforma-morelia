"use client";
import React, { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
  duration?: number; // ms
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "rect" | "circle" | "star";
}

const COLORS = [
  "#22c55e", "#eab308", "#ef4444", "#3b82f6", "#a855f7",
  "#f97316", "#14b8a6", "#ec4899", "#fbbf24", "#6366f1",
];

function createParticle(canvasW: number): Particle {
  return {
    x: Math.random() * canvasW,
    y: -20,
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 3 + 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.2,
    opacity: 1,
    shape: ["rect", "circle", "star"][Math.floor(Math.random() * 3)] as Particle["shape"],
  };
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const spikes = 5;
  const outerR = r;
  const innerR = r * 0.4;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const radius = i % 2 === 0 ? outerR : innerR;
    if (i === 0) ctx.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    else ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Confetti — Efecto canvas de confeti propio, sin librerías externas.
 * Se activa con prop `active=true` y deja de generar nuevas partículas tras `duration` ms.
 */
export default function Confetti({ active, duration = 3000 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Verificar prefers-reduced-motion o modo accesible .reduce-motion
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("reduce-motion")
    ) {
      return;
    }

    // Ajustar tamaño canvas al contenedor
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    startTimeRef.current = performance.now();
    particlesRef.current = [];

    // Generar ráfaga inicial
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push(createParticle(canvas.width));
    }

    let lastSpawnTime = 0;

    const animate = (now: number) => {
      if (!canvas || !ctx) return;

      const elapsed = now - (startTimeRef.current ?? now);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Generar nuevas partículas durante `duration`
      if (elapsed < duration && now - lastSpawnTime > 50) {
        for (let i = 0; i < 8; i++) {
          particlesRef.current.push(createParticle(canvas.width));
        }
        lastSpawnTime = now;
      }

      // Actualizar y dibujar partículas
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravedad suave
        p.rotation += p.rotationSpeed;
        p.opacity -= elapsed > duration * 0.7 ? 0.015 : 0;

        if (p.y > canvas.height + 20 || p.opacity <= 0) return false;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "star") {
          drawStar(ctx, 0, 0, p.size / 2);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
        return true;
      });

      if (particlesRef.current.length > 0 || elapsed < duration) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, duration]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
}
