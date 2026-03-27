"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";

/* ─── Animation variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const VP = { once: true, amount: 0.15 };

/* ─── Hero word-by-word animation ─── */
const HERO_LINE_1 = ["Tu", "Garmin", "te", "dice", "lo", "que", "hiciste."];
const HERO_LINE_2 = ["Beathr", "te", "dice", "qu\u00e9", "hacer", "hoy."];

/* ─── Inline Logo (ECG wave + text) ─── */
function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg width="28" height="20" viewBox="0 0 56 28" fill="none">
        <polyline
          points="0,18 10,18 14,18 18,4 22,24 26,10 30,18 36,18 40,18 44,6 48,22 52,14 56,18"
          stroke="#4ade80"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="text-xl font-bold tracking-tight">
        beat<span className="text-[#4ade80]">hr</span>
      </span>
    </span>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-50 w-full border-b border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <a
            href="#pricing"
            className="rounded-lg bg-[#4ade80] px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
          >
            Ver planes
          </a>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(74,222,128,0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6 inline-block rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 px-4 py-1.5 text-xs font-medium tracking-wide text-[#4ade80]"
          >
            BETA PRIVADA
          </motion.div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            {HERO_LINE_1.map((word, i) => (
              <motion.span
                key={`l1-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                className="inline-block mr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}{" "}
            <span className="text-[#4ade80]">
              {HERO_LINE_2.map((word, i) => (
                <motion.span
                  key={`l2-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + (HERO_LINE_1.length + i) * 0.08 }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mx-auto mb-10 max-w-xl text-lg text-zinc-400"
          >
            Conecta tus datos de sue&ntilde;o, HRV y entrenamiento. Recibe cada
            ma&ntilde;ana una se&ntilde;al clara: verde, &aacute;mbar o rojo.
            Sin ruido, sin dashboards infinitos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-[#4ade80]/50 focus:ring-1 focus:ring-[#4ade80]/30"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#4ade80] px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
                >
                  Unirme a la waitlist
                </button>
              </form>
            ) : (
              <div className="mx-auto max-w-md rounded-lg border border-[#4ade80]/30 bg-[#4ade80]/10 px-6 py-4 text-sm text-[#4ade80]">
                Apuntado. Te avisaremos cuando abramos plazas.
              </div>
            )}
          </motion.div>
        </div>

        <div className="absolute bottom-10 animate-bounce text-zinc-600">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-zinc-800/60 px-6 py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="mx-auto max-w-5xl"
        >
          <motion.h2 variants={fadeUp} className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[#4ade80]">
            El problema
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mb-14 max-w-2xl text-center text-2xl font-bold sm:text-3xl">
            Tres fuentes de datos que no se hablan entre s&iacute;
          </motion.p>
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div variants={fadeUp}>
              <Card
                icon={
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-[#4ade80]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                }
                title="Oura / Garmin"
                description="HRV, sue&ntilde;o, frecuencia card&iacute;aca en reposo. Datos crudos sin contexto de entrenamiento."
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Card
                icon={
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-[#4ade80]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                }
                title="Strava"
                description="Distancia, ritmo, potencia. No sabe c&oacute;mo dormiste ni cu&aacute;l es tu carga real."
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Card
                icon={
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-[#4ade80]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                }
                title="T&uacute; decidiendo a ciegas"
                description="&iquest;Entreno fuerte hoy? &iquest;Descanso? Cada d&iacute;a decides con intuici&oacute;n en vez de datos."
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-800/60 bg-zinc-900/30 px-6 py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="mx-auto max-w-5xl"
        >
          <motion.h2 variants={fadeUp} className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[#4ade80]">
            C&oacute;mo funciona
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mb-14 max-w-2xl text-center text-2xl font-bold sm:text-3xl">
            De datos dispersos a una se&ntilde;al clara en 3 pasos
          </motion.p>

          {/* Animated data flow diagram */}
          <motion.div variants={fadeUp} className="mx-auto mb-16 flex max-w-2xl flex-col items-center">
            <div className="flex w-full items-center justify-center gap-6 sm:gap-10">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fc4c02]/20 text-xs font-bold text-[#fc4c02] ring-1 ring-[#fc4c02]/30">S</div>
                <span className="text-[10px] text-zinc-500">Strava</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-700/40 text-xs font-bold text-zinc-300 ring-1 ring-zinc-600">O</div>
                <span className="text-[10px] text-zinc-500">Oura</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#007cc3]/20 text-xs font-bold text-[#007cc3] ring-1 ring-[#007cc3]/30">G</div>
                <span className="text-[10px] text-zinc-500">Garmin</span>
              </div>
            </div>

            {/* Animated dashed lines with pathLength */}
            <div className="relative my-4 h-16 w-full max-w-xs">
              <svg className="h-full w-full" viewBox="0 0 200 60" fill="none">
                <motion.path
                  d="M40 0 L100 55"
                  stroke="#4ade80"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={VP}
                  transition={{ duration: 1, delay: 0 }}
                />
                <motion.path
                  d="M100 0 L100 55"
                  stroke="#4ade80"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={VP}
                  transition={{ duration: 1, delay: 0.3 }}
                />
                <motion.path
                  d="M160 0 L100 55"
                  stroke="#4ade80"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={VP}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </svg>
            </div>

            {/* Beathr node with pulse */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(74,222,128,0.4)",
                    "0 0 20px 6px rgba(74,222,128,0.2)",
                    "0 0 0 0 rgba(74,222,128,0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#4ade80]/20 ring-2 ring-[#4ade80]/50"
              >
                <svg width="28" height="20" viewBox="0 0 56 28" fill="none">
                  <polyline
                    points="0,18 10,18 14,18 18,4 22,24 26,10 30,18 36,18 40,18 44,6 48,22 52,14 56,18"
                    stroke="#4ade80"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <span className="text-sm font-semibold text-[#4ade80]">&rarr; Verde. Hoy puedes apretar.</span>
            </div>
          </motion.div>

          <div className="grid gap-10 md:grid-cols-3">
            <motion.div variants={fadeUp}>
              <Step number="01" title="Conecta Strava + wearable" description="Vincula tu Strava y tu Oura o Garmin. Un clic, sin configurar nada m&aacute;s." />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Step number="02" title="Beathr aprende tu baseline" description="Analizamos tu HRV, sue&ntilde;o y carga de entrenamiento para conocer tu perfil." />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Step number="03" title="Se&ntilde;al diaria: verde, &aacute;mbar, rojo" description="Cada ma&ntilde;ana recibes tu sem&aacute;foro: cu&aacute;nto y c&oacute;mo entrenar hoy." />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Semaphore Demo */}
      <section className="border-t border-zinc-800/60 px-6 py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="mx-auto max-w-5xl"
        >
          <motion.h2 variants={fadeUp} className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[#4ade80]">
            Tu ma&ntilde;ana con Beathr
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mb-14 max-w-2xl text-center text-2xl font-bold sm:text-3xl">
            Esto es lo que ves al despertar
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mx-auto max-w-sm"
            style={{ perspective: 800 }}
          >
            {/* Phone mockup with 3D entrance */}
            <motion.div
              initial={{ rotateY: 5, opacity: 0 }}
              whileInView={{ rotateY: 0, opacity: 1 }}
              viewport={VP}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="overflow-hidden rounded-[2rem] border border-zinc-700/60 bg-zinc-900 p-1 shadow-2xl shadow-black/40"
            >
              <div className="rounded-[1.75rem] bg-[#111] px-6 py-8">
                <p className="mb-6 text-center text-xs text-zinc-500">
                  Hoy, 27 de marzo &middot; 7:14 AM
                </p>

                {/* Semaphore circles */}
                <div className="mb-6 flex items-center justify-center gap-5">
                  {/* Green circle with Framer glow */}
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [1, 0.8, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative h-14 w-14 rounded-full bg-[#4ade80] shadow-[0_0_24px_rgba(74,222,128,0.5)]"
                  />
                  <div className="h-14 w-14 rounded-full bg-[#fbbf24]/20 ring-1 ring-[#fbbf24]/20" />
                  <div className="h-14 w-14 rounded-full bg-[#f87171]/20 ring-1 ring-[#f87171]/20" />
                </div>

                <p className="mb-3 text-center text-xl font-bold text-[#4ade80]">
                  Hoy puedes apretar.
                </p>
                <p className="mb-6 text-center text-xs leading-relaxed text-zinc-400">
                  Tu HRV lleva 4 d&iacute;as por encima de tu media y dormiste
                  bien. La carga de esta semana es moderada. Buen d&iacute;a para
                  series o umbral.
                </p>

                <div className="space-y-3">
                  <MetricRow label="HRV vs media" value="+12% &uarr;" color="text-[#4ade80]" />
                  <MetricRow label="Calidad sue&ntilde;o" value="Buena &middot; 7h 40min" color="text-[#4ade80]" />
                  <MetricRow label="Carga 7 d&iacute;as" value="Moderada" color="text-[#fbbf24]" />
                  <MetricRow label="Tendencia" value="Estable" color="text-zinc-300" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-zinc-800/60 bg-zinc-900/30 px-6 py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="mx-auto max-w-5xl"
        >
          <motion.h2 variants={fadeUp} className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[#4ade80]">
            Planes
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mb-14 max-w-2xl text-center text-2xl font-bold sm:text-3xl">
            Elige tu nivel de ventaja
          </motion.p>
          <motion.div variants={fadeUp} className="grid gap-6 md:grid-cols-3">
            <PricingCard name="Free" price="0" features={["Sem\u00e1foro diario b\u00e1sico", "Conexi\u00f3n con Strava", "Historial 7 d\u00edas"]} />
            <PricingCard name="Pro" price="8" featured features={["Sem\u00e1foro avanzado con HRV", "Conexi\u00f3n Oura + Garmin", "Historial 90 d\u00edas", "Recomendaciones de intensidad", "Email diario personalizado"]} />
            <PricingCard name="Elite" price="15" features={["Todo lo de Pro", "An\u00e1lisis de tendencias", "Alertas de sobreentrenamiento", "API access", "Soporte prioritario"]} />
          </motion.div>

          {/* Comparison table */}
          <motion.div variants={fadeUp} className="mt-14 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-3 pr-4 text-left font-medium text-zinc-400" />
                  <th className="px-4 py-3 text-center font-semibold text-zinc-300">Free</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#4ade80]">Pro</th>
                  <th className="px-4 py-3 text-center font-semibold text-zinc-300">Elite</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <ComparisonRow label="Fuentes de datos" free="Strava" pro="Strava + Oura + Garmin" elite="Todas + API" />
                <ComparisonRow label="Historial" free="7 d&iacute;as" pro="90 d&iacute;as" elite="Ilimitado" />
                <ComparisonRow label="Ajuste del plan" free={false} pro={true} elite={true} />
                <ComparisonRow label="Modo coach" free={false} pro={false} elite={true} />
                <ComparisonRow label="TrainingPeaks" free={false} pro={false} elite={true} />
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 bg-[#080808]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
            <Logo />
            <div className="flex gap-8 text-sm text-zinc-400">
              <a href="#" className="transition-colors hover:text-zinc-100">Producto</a>
              <a href="#pricing" className="transition-colors hover:text-zinc-100">Precios</a>
              <a href="#" className="transition-colors hover:text-zinc-100">Blog</a>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-500 transition-colors hover:text-zinc-100" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-zinc-500 transition-colors hover:text-zinc-100" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" className="text-zinc-500 transition-colors hover:text-zinc-100" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-10 border-t border-zinc-800/60 pt-6 text-center text-xs text-zinc-600">
            &copy; 2025 Beathr &middot; hola@beathr.app &middot; beathr.app
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Sub-components ─── */

function Card({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#4ade80]/30 bg-[#4ade80]/10 text-sm font-bold text-[#4ade80]">
        {number}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
}

function MetricRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-zinc-800/40 px-4 py-2.5">
      <span className="text-xs text-zinc-400" dangerouslySetInnerHTML={{ __html: label }} />
      <span className={`text-xs font-semibold ${color}`} dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
}

function PricingCard({ name, price, features, featured = false }: { name: string; price: string; features: string[]; featured?: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-xl border p-6 ${
        featured
          ? "border-[#4ade80]/40 bg-[#4ade80]/5 shadow-lg shadow-[#4ade80]/5"
          : "border-zinc-800 bg-zinc-900/50"
      }`}
    >
      {featured && (
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
            className="pointer-events-none absolute inset-0 rounded-xl border"
          />
        </>
      )}
      <h3 className="mb-1 text-lg font-semibold">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-extrabold">{price}&euro;</span>
        <span className="text-sm text-zinc-400">/mes</span>
      </div>
      <ul className="mb-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" className="mt-0.5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 ${
          featured
            ? "bg-[#4ade80] text-[#0a0a0a]"
            : "border border-zinc-700 bg-transparent text-zinc-300 hover:border-zinc-500"
        }`}
      >
        {featured ? "Empezar ahora" : "Elegir plan"}
      </button>
    </motion.div>
  );
}

function ComparisonRow({ label, free, pro, elite }: { label: string; free: string | boolean; pro: string | boolean; elite: string | boolean }) {
  function renderCell(val: string | boolean) {
    if (val === true) return <span className="text-[#4ade80]">&#10003;</span>;
    if (val === false) return <span className="text-zinc-600">&mdash;</span>;
    return <span className="text-zinc-300" dangerouslySetInnerHTML={{ __html: val }} />;
  }
  return (
    <tr className="border-b border-zinc-800/50">
      <td className="py-3 pr-4 text-left text-zinc-400" dangerouslySetInnerHTML={{ __html: label }} />
      <td className="px-4 py-3 text-center">{renderCell(free)}</td>
      <td className="px-4 py-3 text-center">{renderCell(pro)}</td>
      <td className="px-4 py-3 text-center">{renderCell(elite)}</td>
    </tr>
  );
}
