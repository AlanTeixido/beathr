"use client";

import { useState } from "react";

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
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight">
            beat<span className="text-[#4ade80]">hr</span>
          </span>
          <a
            href="#pricing"
            className="rounded-lg bg-[#4ade80] px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
          >
            Ver planes
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(74,222,128,0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-6 inline-block rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 px-4 py-1.5 text-xs font-medium tracking-wide text-[#4ade80]">
            BETA PRIVADA
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Tu Garmin te dice lo que hiciste.{" "}
            <span className="text-[#4ade80]">Beathr te dice qu&eacute; hacer hoy.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-zinc-400">
            Conecta tus datos de sue&ntilde;o, HRV y entrenamiento. Recibe cada
            ma&ntilde;ana una se&ntilde;al clara: verde, &aacute;mbar o rojo.
            Sin ruido, sin dashboards infinitos.
          </p>

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
        </div>

        <div className="absolute bottom-10 animate-bounce text-zinc-600">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-zinc-800/60 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[#4ade80]">
            El problema
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-2xl font-bold sm:text-3xl">
            Tres fuentes de datos que no se hablan entre s&iacute;
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <Card
              icon={
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-[#4ade80]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              }
              title="Oura / Garmin"
              description="HRV, sue&ntilde;o, frecuencia card&iacute;aca en reposo. Datos crudos sin contexto de entrenamiento."
            />
            <Card
              icon={
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-[#4ade80]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              }
              title="Strava"
              description="Distancia, ritmo, potencia. No sabe c&oacute;mo dormiste ni cu&aacute;l es tu carga real."
            />
            <Card
              icon={
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-[#4ade80]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              }
              title="T&uacute; decidiendo a ciegas"
              description="&iquest;Entreno fuerte hoy? &iquest;Descanso? Cada d&iacute;a decides con intuici&oacute;n en vez de datos."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-800/60 bg-zinc-900/30 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[#4ade80]">
            C&oacute;mo funciona
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-2xl font-bold sm:text-3xl">
            De datos dispersos a una se&ntilde;al clara en 3 pasos
          </p>
          <div className="grid gap-10 md:grid-cols-3">
            <Step
              number="01"
              title="Conecta Strava + wearable"
              description="Vincula tu Strava y tu Oura o Garmin. Un clic, sin configurar nada m&aacute;s."
            />
            <Step
              number="02"
              title="Beathr aprende tu baseline"
              description="Analizamos tu HRV, sue&ntilde;o y carga de entrenamiento para conocer tu perfil."
            />
            <Step
              number="03"
              title="Se&ntilde;al diaria: verde, &aacute;mbar, rojo"
              description="Cada ma&ntilde;ana recibes tu sem&aacute;foro: cu&aacute;nto y c&oacute;mo entrenar hoy."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-zinc-800/60 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[#4ade80]">
            Planes
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-2xl font-bold sm:text-3xl">
            Elige tu nivel de ventaja
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <PricingCard
              name="Free"
              price="0"
              features={[
                "Sem&aacute;foro diario b&aacute;sico",
                "Conexi&oacute;n con Strava",
                "Historial 7 d&iacute;as",
              ]}
            />
            <PricingCard
              name="Pro"
              price="8"
              featured
              features={[
                "Sem&aacute;foro avanzado con HRV",
                "Conexi&oacute;n Oura + Garmin",
                "Historial 90 d&iacute;as",
                "Recomendaciones de intensidad",
                "Email diario personalizado",
              ]}
            />
            <PricingCard
              name="Elite"
              price="15"
              features={[
                "Todo lo de Pro",
                "An&aacute;lisis de tendencias",
                "Alertas de sobreentrenamiento",
                "API access",
                "Soporte prioritario",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-sm text-zinc-500">
          <span className="font-bold tracking-tight text-zinc-300">
            beat<span className="text-[#4ade80]">hr</span>
          </span>
          <span>&copy; {new Date().getFullYear()} Beathr. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
}

function Card({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p
        className="text-sm leading-relaxed text-zinc-400"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#4ade80]/30 bg-[#4ade80]/10 text-sm font-bold text-[#4ade80]">
        {number}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p
        className="text-sm leading-relaxed text-zinc-400"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}

function PricingCard({
  name,
  price,
  features,
  featured = false,
}: {
  name: string;
  price: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`relative rounded-xl border p-6 ${
        featured
          ? "border-[#4ade80]/40 bg-[#4ade80]/5 shadow-lg shadow-[#4ade80]/5"
          : "border-zinc-800 bg-zinc-900/50"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#4ade80] px-3 py-0.5 text-xs font-bold text-[#0a0a0a]">
          POPULAR
        </div>
      )}
      <h3 className="mb-1 text-lg font-semibold">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-extrabold">{price}&euro;</span>
        <span className="text-sm text-zinc-400">/mes</span>
      </div>
      <ul className="mb-6 space-y-3">
        {features.map((f) => (
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
            <span dangerouslySetInnerHTML={{ __html: f }} />
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
    </div>
  );
}
