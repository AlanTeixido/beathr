"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Plan {
  name: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  includes: string[];
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    features: [
      "Sem\u00e1foro diario b\u00e1sico",
      "Conexi\u00f3n con Strava",
      "Historial 7 d\u00edas",
    ],
    includes: ["Sem\u00e1foro verde/rojo", "Datos de Strava", "Panel b\u00e1sico"],
  },
  {
    name: "Pro",
    price: 8,
    yearlyPrice: 77,
    features: [
      "Sem\u00e1foro avanzado con HRV",
      "Conexi\u00f3n Oura + Garmin",
      "Historial 90 d\u00edas",
      "Recomendaciones de intensidad",
      "Email diario personalizado",
    ],
    includes: [
      "Todo lo de Free",
      "An\u00e1lisis de carga",
      "Tendencias semanales",
      "Integraci\u00f3n wearables",
    ],
    featured: true,
  },
  {
    name: "Elite",
    price: 15,
    yearlyPrice: 144,
    features: [
      "Todo lo de Pro",
      "An\u00e1lisis de tendencias",
      "Alertas de sobreentrenamiento",
      "API access",
      "Soporte prioritario",
    ],
    includes: [
      "Todo lo de Pro",
      "Modo coach",
      "TrainingPeaks sync",
      "Informes exportables",
    ],
  },
];

const COMPARISON = [
  { label: "Fuentes de datos", free: "Strava", pro: "Strava + Oura + Garmin", elite: "Todas + API" },
  { label: "Historial", free: "7 d\u00edas", pro: "90 d\u00edas", elite: "Ilimitado" },
  { label: "Ajuste del plan", free: false, pro: true, elite: true },
  { label: "Modo coach", free: false, pro: false, elite: true },
  { label: "TrainingPeaks", free: false, pro: false, elite: true },
];

function AnimatedPrice({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-4xl font-extrabold"
    >
      {value}
    </motion.span>
  );
}

export default function PricingToggle() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div>
      {/* Toggle */}
      <div className="mb-10 flex justify-center">
        <div className="relative flex rounded-full border border-zinc-700 bg-zinc-900 p-1">
          <button
            onClick={() => setIsYearly(false)}
            className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              !isYearly ? "text-[#0a0a0a]" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {!isYearly && (
              <motion.span
                layoutId="pricing-switch"
                className="absolute inset-0 rounded-full bg-[#4ade80]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative">Mensual</span>
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              isYearly ? "text-[#0a0a0a]" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {isYearly && (
              <motion.span
                layoutId="pricing-switch"
                className="absolute inset-0 rounded-full bg-[#4ade80]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              Anual
              <span className="rounded-full bg-[#4ade80]/20 px-2 py-0.5 text-[10px] font-bold text-[#4ade80]">
                -20%
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ scale: 1.02, y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`relative rounded-2xl border p-6 ${
              plan.featured
                ? "border-[#4ade80]/40 bg-[#4ade80]/5 shadow-lg shadow-[#4ade80]/5"
                : "border-zinc-800 bg-zinc-900/50"
            }`}
          >
            {plan.featured && (
              <>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#4ade80] px-3 py-0.5 text-xs font-bold text-[#0a0a0a]">
                  POPULAR
                </div>
                <motion.div
                  animate={{
                    borderColor: [
                      "rgba(74,222,128,0.4)",
                      "rgba(74,222,128,0.15)",
                      "rgba(74,222,128,0.4)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-0 rounded-2xl border"
                />
              </>
            )}

            <h3 className="mb-1 text-lg font-semibold">{plan.name}</h3>
            <div className="mb-6">
              <AnimatedPrice value={isYearly ? plan.yearlyPrice : plan.price} />
              <span className="text-sm text-zinc-400">
                &euro;/{isYearly ? "a\u00f1o" : "mes"}
              </span>
            </div>

            <ul className="mb-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2"
                    className="mt-0.5 shrink-0"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {/* Includes section */}
            <div className="space-y-2 border-t border-zinc-800 pt-4">
              <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Incluye
              </h4>
              {plan.includes.map((inc) => (
                <div key={inc} className="flex items-center gap-2 text-xs text-zinc-400">
                  <div className="h-1 w-1 rounded-full bg-[#4ade80]" />
                  {inc}
                </div>
              ))}
            </div>

            <button
              className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition-all hover:opacity-90 ${
                plan.featured
                  ? "bg-[#4ade80] text-[#0a0a0a] shadow-lg shadow-[#4ade80]/20"
                  : "border border-zinc-700 bg-transparent text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {plan.featured ? "Empezar ahora" : "Elegir plan"}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mt-14 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-3 pr-4 text-left font-medium text-zinc-500" />
              <th className="px-4 py-3 text-center font-semibold text-zinc-400">Free</th>
              <th className="px-4 py-3 text-center font-semibold text-[#4ade80]">Pro</th>
              <th className="px-4 py-3 text-center font-semibold text-zinc-400">Elite</th>
            </tr>
          </thead>
          <tbody className="text-zinc-400">
            {COMPARISON.map((row) => (
              <tr key={row.label} className="border-b border-zinc-800/50">
                <td className="py-3 pr-4 text-left text-zinc-400">{row.label}</td>
                <td className="px-4 py-3 text-center">
                  <CellValue val={row.free} />
                </td>
                <td className="px-4 py-3 text-center">
                  <CellValue val={row.pro} />
                </td>
                <td className="px-4 py-3 text-center">
                  <CellValue val={row.elite} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CellValue({ val }: { val: string | boolean }) {
  if (val === true) return <span className="text-[#4ade80]">&#10003;</span>;
  if (val === false) return <span className="text-zinc-700">&mdash;</span>;
  return <span className="text-zinc-300">{val}</span>;
}
