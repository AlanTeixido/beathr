"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepData {
  id: number;
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  metrics: string[];
}

const SOURCES: StepData[] = [
  {
    id: 1,
    label: "Strava",
    title: "Entrenamiento",
    description: "Distancia, ritmo, potencia, frecuencia card\u00edaca en ejercicio, Training Load.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fc4c02">
        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
      </svg>
    ),
    color: "#fc4c02",
    metrics: ["TSS / carga", "km semanales", "FC media"],
  },
  {
    id: 2,
    label: "Oura",
    title: "Recuperaci\u00f3n",
    description: "HRV nocturna, fases de sue\u00f1o, temperatura corporal, frecuencia respiratoria.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    color: "#a78bfa",
    metrics: ["HRV (ms)", "Sue\u00f1o profundo", "Temp. corporal"],
  },
  {
    id: 3,
    label: "Garmin",
    title: "Biom\u00e9tricas",
    description: "Body Battery, Stress Score, SpO2, frecuencia card\u00edaca 24/7.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#38bdf8" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    color: "#38bdf8",
    metrics: ["Body Battery", "Stress", "SpO2"],
  },
];

export default function OrbitalSteps() {
  const [activeSource, setActiveSource] = useState<number | null>(null);
  const [showOutput, setShowOutput] = useState(false);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Data flow visualization */}
      <div className="relative flex flex-col items-center gap-8 py-4">

        {/* Source cards row */}
        <div className="grid w-full grid-cols-3 gap-4">
          {SOURCES.map((source) => (
            <motion.button
              key={source.id}
              onClick={() => {
                setActiveSource(activeSource === source.id ? null : source.id);
                setShowOutput(false);
              }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${
                activeSource === source.id
                  ? "border-zinc-500 bg-zinc-800/80"
                  : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
              }`}
            >
              {/* Accent top bar */}
              <div
                className="absolute left-0 right-0 top-0 h-0.5 transition-opacity"
                style={{
                  background: source.color,
                  opacity: activeSource === source.id ? 1 : 0.3,
                }}
              />

              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${source.color}15` }}
                >
                  {source.icon}
                </div>
                <div>
                  <div className="text-xs font-medium text-zinc-500">{source.label}</div>
                  <div className="text-sm font-semibold">{source.title}</div>
                </div>
              </div>

              {/* Metrics preview */}
              <div className="flex flex-wrap gap-1.5">
                {source.metrics.map((m) => (
                  <span
                    key={m}
                    className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-500"
                  >
                    {m}
                  </span>
                ))}
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {activeSource === source.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 border-t border-zinc-800 pt-3 text-xs leading-relaxed text-zinc-400">
                      {source.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Animated flow lines */}
        <div className="relative flex w-full items-center justify-center py-2">
          <svg className="h-12 w-full max-w-md" viewBox="0 0 400 48" fill="none">
            {/* Three lines converging to center */}
            <motion.path
              d="M60 4 L200 44"
              stroke="#fc4c02"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0.3 }}
              whileInView={{ pathLength: 1, opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0 }}
            />
            <motion.path
              d="M200 4 L200 44"
              stroke="#a78bfa"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0.3 }}
              whileInView={{ pathLength: 1, opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
            <motion.path
              d="M340 4 L200 44"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0.3 }}
              whileInView={{ pathLength: 1, opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.6 }}
            />
          </svg>
        </div>

        {/* Beathr processing node */}
        <motion.button
          onClick={() => setShowOutput(!showOutput)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(74,222,128,0.3)",
                "0 0 30px 8px rgba(74,222,128,0.15)",
                "0 0 0 0 rgba(74,222,128,0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#4ade80]/30 bg-gradient-to-br from-[#4ade80]/20 to-[#4ade80]/5"
          >
            <svg width="32" height="22" viewBox="0 0 56 28" fill="none">
              <polyline
                points="0,18 10,18 14,18 18,4 22,24 26,10 30,18 36,18 40,18 44,6 48,22 52,14 56,18"
                stroke="#4ade80"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <div className="mt-2 text-center text-xs font-bold text-[#4ade80]">Beathr Engine</div>
          <div className="text-center text-[10px] text-zinc-600">Clic para ver resultado</div>
        </motion.button>

        {/* Arrow down */}
        <AnimatePresence>
          {showOutput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full max-w-md overflow-hidden"
            >
              {/* Output signal */}
              <div className="rounded-2xl border border-[#4ade80]/20 bg-[#4ade80]/5 p-6">
                <div className="mb-4 flex items-center justify-center gap-4">
                  <div className="relative h-10 w-10 rounded-full bg-[#4ade80] shadow-[0_0_20px_rgba(74,222,128,0.4)]">
                    <div className="absolute inset-0 animate-ping rounded-full bg-[#4ade80]/20" />
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[#fbbf24]/15 ring-1 ring-[#fbbf24]/20" />
                  <div className="h-10 w-10 rounded-full bg-[#f87171]/15 ring-1 ring-[#f87171]/20" />
                </div>
                <p className="text-center text-lg font-bold text-[#4ade80]">
                  Verde. Hoy puedes apretar.
                </p>
                <p className="mt-2 text-center text-xs text-zinc-500">
                  HRV +12% sobre tu media &middot; 7h 40min sue&ntilde;o &middot; Carga moderada
                </p>

                {/* Mini metrics */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: "HRV", value: "62ms", delta: "+12%", color: "text-[#4ade80]" },
                    { label: "Sue\u00f1o", value: "7h40", delta: "85%", color: "text-[#4ade80]" },
                    { label: "Carga", value: "Media", delta: "TSS 340", color: "text-[#fbbf24]" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg bg-zinc-900/60 p-2 text-center">
                      <div className="text-[10px] text-zinc-600">{m.label}</div>
                      <div className="text-sm font-bold">{m.value}</div>
                      <div className={`text-[10px] ${m.color}`}>{m.delta}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
