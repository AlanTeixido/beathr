"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";

const CinematicIntro = dynamic(() => import("@/components/CinematicIntro"), { ssr: false });
const ECGHero3D = dynamic(() => import("@/components/ECGHero3D"), { ssr: false });
const OrbitalSteps = dynamic(() => import("@/components/OrbitalSteps"), { ssr: false });
const PricingToggle = dynamic(() => import("@/components/PricingToggle"), { ssr: false });
const ThemeToggle = dynamic(() => import("@/components/ThemeToggle"), { ssr: false });

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

/* ─── Inline Logo ─── */
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
  const [introDone, setIntroDone] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [isDark]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#0a0a0a] text-zinc-100" : "bg-white text-zinc-900"}`}>
      {/* Cinematic intro */}
      {!introDone && <CinematicIntro onComplete={handleIntroDone} />}
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 z-50 w-full border-b backdrop-blur-md ${isDark ? "border-zinc-800/60 bg-[#0a0a0a]/80" : "border-zinc-200 bg-white/80"}`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#how" className={`hidden text-sm transition-colors sm:block ${isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-500 hover:text-zinc-900"}`}>
              C&oacute;mo funciona
            </a>
            <a href="#pricing" className={`hidden text-sm transition-colors sm:block ${isDark ? "text-zinc-400 hover:text-zinc-100" : "text-zinc-500 hover:text-zinc-900"}`}>
              Precios
            </a>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            <a
              href="#pricing"
              className="rounded-lg bg-[#4ade80] px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
            >
              Ver planes
            </a>
          </div>
        </div>
      </motion.nav>

      {/* ════════════════════════════════════════════
          HERO — ECG background + waitlist
         ════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
        <ECGHero3D />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(74,222,128,0.04)_0%,_transparent_70%)]" />
        <div
          className="pointer-events-none absolute inset-0 z-[5] opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 inline-block rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 px-4 py-1.5 text-xs font-medium tracking-wide text-[#4ade80]"
          >
            BETA PRIVADA
          </motion.div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            {["Tu", "Garmin", "te", "dice", "lo", "que", "hiciste."].map((word, i) => (
              <motion.span
                key={`l1-${i}`}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: "easeOut" }}
                className="mr-[0.3em] inline-block"
              >
                {word}
              </motion.span>
            ))}{" "}
            <span className="text-[#4ade80]">
              {["Beathr", "te", "dice", "qu\u00e9", "hacer", "hoy."].map((word, i) => (
                <motion.span
                  key={`l2-${i}`}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, delay: 0.4 + (7 + i) * 0.08, ease: "easeOut" }}
                  className="mr-[0.3em] inline-block"
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
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none backdrop-blur-sm transition-colors focus:border-[#4ade80]/50 focus:ring-1 focus:ring-[#4ade80]/30"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#4ade80] px-6 py-3 text-sm font-semibold text-[#0a0a0a] shadow-lg shadow-[#4ade80]/20 transition-all hover:opacity-90 hover:shadow-[#4ade80]/30"
                >
                  Unirme a la waitlist
                </button>
              </form>
            ) : (
              <div className="mx-auto max-w-md rounded-xl border border-[#4ade80]/30 bg-[#4ade80]/10 px-6 py-4 text-sm text-[#4ade80]">
                Apuntado. Te avisaremos cuando abramos plazas.
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-10 animate-bounce text-zinc-600"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          PROBLEM — Interactive hover cards
         ════════════════════════════════════════════ */}
      <section className={`border-t px-6 py-24 ${isDark ? "border-zinc-800/60" : "border-zinc-200"}`}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP} className="mx-auto max-w-5xl">
          <motion.h2 variants={fadeUp} className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[#4ade80]">
            El problema
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mb-14 max-w-2xl text-center text-2xl font-bold sm:text-3xl">
            Tres fuentes de datos que no se hablan entre s&iacute;
          </motion.p>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-[#4ade80]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
                title: "Oura / Garmin",
                desc: "HRV, sue\u00f1o, frecuencia card\u00edaca en reposo. Datos crudos sin contexto de entrenamiento.",
                color: "from-[#4ade80]/5 to-transparent",
              },
              {
                icon: (
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-[#fc4c02]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                title: "Strava",
                desc: "Distancia, ritmo, potencia. No sabe c\u00f3mo dormiste ni cu\u00e1l es tu carga real.",
                color: "from-[#fc4c02]/5 to-transparent",
              },
              {
                icon: (
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                ),
                title: "T\u00fa decidiendo a ciegas",
                desc: "\u00bfEntreno fuerte hoy? \u00bfDescanso? Cada d\u00eda decides con intuici\u00f3n en vez de datos.",
                color: "from-zinc-500/5 to-transparent",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-600"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${card.color} opacity-0 transition-opacity group-hover:opacity-100`} />
                <div className="relative">
                  <div className="mb-4">{card.icon}</div>
                  <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          HOW IT WORKS — Orbital timeline
         ════════════════════════════════════════════ */}
      <section id="how" className={`border-t px-6 py-24 ${isDark ? "border-zinc-800/60 bg-zinc-900/30" : "border-zinc-200 bg-zinc-50"}`}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP} className="mx-auto max-w-5xl">
          <motion.h2 variants={fadeUp} className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[#4ade80]">
            C&oacute;mo funciona
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mb-6 max-w-2xl text-center text-2xl font-bold sm:text-3xl">
            De datos dispersos a una se&ntilde;al clara
          </motion.p>
          <motion.p variants={fadeUp} className="mx-auto mb-10 max-w-lg text-center text-sm text-zinc-500">
            Toca cada fuente para ver qu&eacute; datos recogemos. Haz clic en Beathr Engine para ver el resultado.
          </motion.p>

          <motion.div variants={fadeUp}>
            <OrbitalSteps />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          SEMAPHORE DEMO — Phone mockup
         ════════════════════════════════════════════ */}
      <section className={`border-t px-6 py-24 ${isDark ? "border-zinc-800/60" : "border-zinc-200"}`}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP} className="mx-auto max-w-5xl">
          <motion.h2 variants={fadeUp} className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[#4ade80]">
            Tu ma&ntilde;ana con Beathr
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mb-4 max-w-2xl text-center text-2xl font-bold sm:text-3xl">
            Esto es lo que ves al despertar
          </motion.p>
          <motion.p variants={fadeUp} className="mx-auto mb-14 max-w-md text-center text-sm text-zinc-500">
            Sin abrir 3 apps. Sin interpretar gr&aacute;ficas. Una se&ntilde;al clara en 5 segundos.
          </motion.p>

          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Left: context + benefits */}
            <motion.div variants={fadeUp} className="space-y-6">
              {[
                {
                  emoji: "\u2705",
                  title: "Se\u00f1al, no datos",
                  desc: "Verde, \u00e1mbar o rojo. No necesitas ser cient\u00edfico para entenderlo.",
                },
                {
                  emoji: "\u23f0",
                  title: "Cada ma\u00f1ana a las 7 AM",
                  desc: "Email o notificaci\u00f3n push con tu sem\u00e1foro y recomendaci\u00f3n de entrenamiento.",
                },
                {
                  emoji: "\ud83e\udde0",
                  title: "Aprende de ti",
                  desc: "Tu baseline es \u00fanica. Beathr ajusta los umbrales a tu fisiolog\u00eda, no a promedios.",
                },
                {
                  emoji: "\ud83d\udcc8",
                  title: "Tendencias visibles",
                  desc: "Detecta fatiga acumulada antes de que la sientas. Previene lesiones y sobreentrenamiento.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800/80 text-base">
                    {item.emoji}
                  </div>
                  <div>
                    <h4 className="mb-0.5 text-sm font-semibold">{item.title}</h4>
                    <p className="text-xs leading-relaxed text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Right: phone mockup */}
            <motion.div variants={fadeUp} className="mx-auto max-w-sm" style={{ perspective: 800 }}>
            <motion.div
              initial={{ rotateY: 5, opacity: 0 }}
              whileInView={{ rotateY: 0, opacity: 1 }}
              viewport={VP}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="overflow-hidden rounded-[2rem] border border-zinc-700/60 bg-zinc-900 p-1 shadow-2xl shadow-black/40"
            >
              <div className="rounded-[1.75rem] bg-[#111] px-6 py-8">
                <p className="mb-6 text-center text-xs text-zinc-500">Hoy, 27 de marzo &middot; 7:14 AM</p>

                <div className="mb-6 flex items-center justify-center gap-5">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative h-14 w-14 rounded-full bg-[#4ade80] shadow-[0_0_24px_rgba(74,222,128,0.5)]"
                  />
                  <div className="h-14 w-14 rounded-full bg-[#fbbf24]/20 ring-1 ring-[#fbbf24]/20" />
                  <div className="h-14 w-14 rounded-full bg-[#f87171]/20 ring-1 ring-[#f87171]/20" />
                </div>

                <p className="mb-3 text-center text-xl font-bold text-[#4ade80]">Hoy puedes apretar.</p>
                <p className="mb-6 text-center text-xs leading-relaxed text-zinc-400">
                  Tu HRV lleva 4 d&iacute;as por encima de tu media y dormiste bien. La carga de esta semana es moderada.
                </p>

                <div className="space-y-3">
                  {[
                    { l: "HRV vs media", v: "+12% \u2191", c: "text-[#4ade80]" },
                    { l: "Calidad sue\u00f1o", v: "Buena \u00b7 7h 40min", c: "text-[#4ade80]" },
                    { l: "Carga 7 d\u00edas", v: "Moderada", c: "text-[#fbbf24]" },
                    { l: "Tendencia", v: "Estable", c: "text-zinc-300" },
                  ].map((m) => (
                    <div key={m.l} className="flex items-center justify-between rounded-lg bg-zinc-800/40 px-4 py-2.5">
                      <span className="text-xs text-zinc-400">{m.l}</span>
                      <span className={`text-xs font-semibold ${m.c}`}>{m.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          PRICING — Toggle + animated cards
         ════════════════════════════════════════════ */}
      <section id="pricing" className={`border-t px-6 py-24 ${isDark ? "border-zinc-800/60 bg-zinc-900/30" : "border-zinc-200 bg-zinc-50"}`}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP} className="mx-auto max-w-5xl">
          <motion.h2 variants={fadeUp} className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[#4ade80]">
            Planes
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mb-10 max-w-2xl text-center text-2xl font-bold sm:text-3xl">
            Elige tu nivel de ventaja
          </motion.p>
          <motion.div variants={fadeUp}>
            <PricingToggle />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER — Clean centered design
         ════════════════════════════════════════════ */}
      <footer className={`border-t py-16 ${isDark ? "border-zinc-800/60 bg-[#080808]" : "border-zinc-200 bg-zinc-50"}`}>
        <div className="mx-auto max-w-5xl px-6">
          {/* Logo */}
          <div className="flex justify-center">
            <Logo />
          </div>

          {/* Links */}
          <div className="my-8 flex flex-wrap justify-center gap-8 text-sm">
            {["Producto", "Precios", "Blog", "Documentaci\u00f3n", "Soporte"].map((link) => (
              <a
                key={link}
                href={link === "Precios" ? "#pricing" : "#"}
                className="text-zinc-500 transition-colors hover:text-zinc-100"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Social icons */}
          <div className="my-8 flex justify-center gap-5">
            {/* X / Twitter */}
            <a href="#" className="text-zinc-600 transition-colors hover:text-zinc-100" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="text-zinc-600 transition-colors hover:text-zinc-100" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="text-zinc-600 transition-colors hover:text-zinc-100" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            {/* Strava */}
            <a href="#" className="text-zinc-600 transition-colors hover:text-zinc-100" aria-label="Strava">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
            </a>
          </div>

          {/* Bottom */}
          <div className={`border-t pt-8 text-center text-xs ${isDark ? "border-zinc-800/40 text-zinc-600" : "border-zinc-200 text-zinc-400"}`}>
            &copy; 2025 Beathr &middot; hola@beathr.app &middot; beathr.app
          </div>
        </div>
      </footer>
    </div>
  );
}
