"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepData {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: "active" | "pending";
}

const STEPS: StepData[] = [
  {
    id: 1,
    title: "Conecta tus fuentes",
    description:
      "Vincula Strava, Oura o Garmin en un clic. Beathr recoge HRV, sue\u00f1o, frecuencia card\u00edaca y carga de entrenamiento autom\u00e1ticamente.",
    icon: "S",
    status: "active",
  },
  {
    id: 2,
    title: "Aprende tu baseline",
    description:
      "En 7 d\u00edas Beathr construye tu perfil \u00fanico: tu HRV media, tus patrones de sue\u00f1o y tu capacidad de absorber carga.",
    icon: "B",
    status: "active",
  },
  {
    id: 3,
    title: "Sem\u00e1foro diario",
    description:
      "Cada ma\u00f1ana recibes una se\u00f1al clara: verde (apretar), \u00e1mbar (moderado) o rojo (recuperar). Sin ruido, sin dashboards.",
    icon: "\u2665",
    status: "active",
  },
];

export default function OrbitalSteps() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotation((prev) => (prev + 0.25) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, [autoRotate]);

  const handleNodeClick = useCallback(
    (id: number) => {
      if (activeId === id) {
        setActiveId(null);
        setAutoRotate(true);
      } else {
        setActiveId(id);
        setAutoRotate(false);
        const idx = STEPS.findIndex((s) => s.id === id);
        const targetAngle = (idx / STEPS.length) * 360;
        setRotation(270 - targetAngle);
      }
    },
    [activeId]
  );

  const handleBgClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === containerRef.current) {
        setActiveId(null);
        setAutoRotate(true);
      }
    },
    []
  );

  return (
    <div
      ref={containerRef}
      onClick={handleBgClick}
      className="relative mx-auto flex h-[480px] w-full max-w-lg items-center justify-center"
    >
      {/* Center node */}
      <div className="absolute z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#4ade80] via-[#22c55e] to-[#15803d]">
        <div className="absolute h-20 w-20 animate-ping rounded-full border border-[#4ade80]/20 opacity-70" />
        <div
          className="absolute h-24 w-24 animate-ping rounded-full border border-[#4ade80]/10 opacity-50"
          style={{ animationDelay: "0.5s" }}
        />
        <svg width="24" height="16" viewBox="0 0 56 28" fill="none">
          <polyline
            points="0,18 10,18 14,18 18,4 22,24 26,10 30,18 36,18 40,18 44,6 48,22 52,14 56,18"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Orbit ring */}
      <div className="absolute h-80 w-80 rounded-full border border-zinc-800/50 sm:h-96 sm:w-96" />

      {/* Orbit nodes */}
      {STEPS.map((step, index) => {
        const angle = ((index / STEPS.length) * 360 + rotation) % 360;
        const radius = typeof window !== "undefined" && window.innerWidth < 640 ? 160 : 192;
        const radian = (angle * Math.PI) / 180;
        const x = radius * Math.cos(radian);
        const y = radius * Math.sin(radian);
        const isActive = activeId === step.id;
        const opacity = Math.max(0.5, 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2));

        return (
          <div
            key={step.id}
            className="absolute cursor-pointer transition-all duration-700"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              zIndex: isActive ? 200 : Math.round(100 + 50 * Math.cos(radian)),
              opacity: isActive ? 1 : opacity,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleNodeClick(step.id);
            }}
          >
            {/* Glow */}
            <div
              className={`absolute -inset-3 rounded-full ${isActive ? "animate-pulse" : ""}`}
              style={{
                background: `radial-gradient(circle, rgba(74,222,128,${isActive ? 0.25 : 0.1}) 0%, transparent 70%)`,
              }}
            />

            {/* Node */}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "scale-125 border-[#4ade80] bg-[#4ade80] text-[#0a0a0a] shadow-lg shadow-[#4ade80]/30"
                  : "border-zinc-600 bg-zinc-900 text-zinc-300 hover:border-[#4ade80]/50"
              }`}
            >
              {step.icon}
            </div>

            {/* Label */}
            <div
              className={`absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${
                isActive ? "text-[#4ade80]" : "text-zinc-500"
              }`}
            >
              0{step.id}
            </div>

            {/* Expanded card */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-1/2 top-20 z-50 w-64 -translate-x-1/2 rounded-xl border border-zinc-700/50 bg-zinc-900/95 p-4 shadow-xl shadow-black/30 backdrop-blur-lg"
                >
                  <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-[#4ade80]/50" />
                  <h4 className="mb-2 text-sm font-bold text-zinc-100">
                    {step.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-400">
                    {step.description}
                  </p>
                  <div className="mt-3 border-t border-zinc-800 pt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Paso {step.id} de 3</span>
                      <div className="flex gap-1">
                        {STEPS.map((s) => (
                          <div
                            key={s.id}
                            className={`h-1 w-4 rounded-full ${
                              s.id <= step.id ? "bg-[#4ade80]" : "bg-zinc-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
