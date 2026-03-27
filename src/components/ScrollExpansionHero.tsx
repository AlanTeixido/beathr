"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface ScrollExpansionHeroProps {
  children?: React.ReactNode;
  onExpanded?: () => void;
}

/* ─── Fake sparkline SVG ─── */
function Sparkline({ points, color, w = 80, h = 24 }: { points: number[]; color: string; w?: number; h?: number }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * h * 0.8 - h * 0.1;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <path d={d} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ScrollExpansionHero({ children, onExpanded }: ScrollExpansionHeroProps) {
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleProgress = useCallback(
    (delta: number) => {
      if (expanded && delta < 0 && window.scrollY <= 5) {
        setExpanded(false);
        setProgress(0.99);
        return;
      }
      if (expanded) return;

      setProgress((prev) => {
        const next = Math.min(Math.max(prev + delta, 0), 1);
        if (next >= 1 && !expanded) {
          setExpanded(true);
          onExpanded?.();
        }
        return next;
      });
    },
    [expanded, onExpanded]
  );

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!expanded) {
        e.preventDefault();
        handleProgress(e.deltaY * 0.0008);
      } else if (e.deltaY < 0 && window.scrollY <= 5) {
        e.preventDefault();
        handleProgress(-0.05);
      }
    };

    let lastTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const deltaY = lastTouchY - e.touches[0].clientY;
      lastTouchY = e.touches[0].clientY;
      if (!expanded) {
        e.preventDefault();
        handleProgress(deltaY * 0.004);
      }
    };

    const onScroll = () => {
      if (!expanded) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [expanded, handleProgress]);

  const cardW = 340 + progress * 1200;
  const cardH = 420 + progress * 500;
  const borderRadius = 32 - progress * 32;
  const textSpread = progress * 120;

  // Progressive reveal thresholds
  const showSemaphore = progress > 0.2;
  const showMetrics = progress > 0.4;
  const showSidebar = progress > 0.6;
  const showCharts = progress > 0.7;

  return (
    <div ref={sectionRef} className="overflow-x-hidden">
      <section className="relative flex min-h-screen flex-col items-center justify-center">
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
          {/* Expanding card — becomes the app dashboard */}
          <div
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-zinc-800/60 shadow-2xl shadow-black/60"
            style={{
              width: `${Math.min(cardW, typeof window !== "undefined" ? window.innerWidth * 0.96 : 1400)}px`,
              height: `${Math.min(cardH, typeof window !== "undefined" ? window.innerHeight * 0.92 : 800)}px`,
              maxWidth: "96vw",
              maxHeight: "92vh",
              borderRadius: `${borderRadius}px`,
              transition: "none",
            }}
          >
            <div className="relative flex h-full w-full overflow-hidden bg-[#0c0c0c]">
              {/* Sidebar — appears at 60% */}
              <div
                className="flex h-full shrink-0 flex-col border-r border-zinc-800/50 bg-[#080808] transition-none"
                style={{
                  width: showSidebar ? "200px" : "0px",
                  opacity: showSidebar ? Math.min(1, (progress - 0.6) / 0.15) : 0,
                  overflow: "hidden",
                }}
              >
                <div className="flex items-center gap-2 border-b border-zinc-800/50 px-4 py-4">
                  <svg width="18" height="12" viewBox="0 0 56 28" fill="none">
                    <polyline points="0,18 10,18 14,18 18,4 22,24 26,10 30,18 36,18 40,18 44,6 48,22 52,14 56,18" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs font-bold">beat<span className="text-[#4ade80]">hr</span></span>
                </div>
                <div className="flex-1 space-y-1 p-3">
                  {[
                    { label: "Dashboard", active: true },
                    { label: "Historial", active: false },
                    { label: "Tendencias", active: false },
                    { label: "Conexiones", active: false },
                    { label: "Ajustes", active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-lg px-3 py-2 text-[11px] ${
                        item.active
                          ? "bg-[#4ade80]/10 font-semibold text-[#4ade80]"
                          : "text-zinc-600"
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-800/50 p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-zinc-800" />
                    <span className="text-[10px] text-zinc-600">Alex Runner</span>
                  </div>
                </div>
              </div>

              {/* Main content area */}
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <div
                  className="flex items-center justify-between border-b border-zinc-800/50 px-6 py-3 transition-none"
                  style={{ opacity: showMetrics ? Math.min(1, (progress - 0.4) / 0.1) : 0 }}
                >
                  <div>
                    <span className="text-[10px] text-zinc-600">Jueves, 27 de marzo</span>
                    <h2 className="text-sm font-semibold">Buenos d&iacute;as, Alex</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#4ade80] shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
                    <span className="text-[10px] text-zinc-500">Sincronizado</span>
                  </div>
                </div>

                {/* Dashboard body */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Center — semaphore */}
                  <div className="flex flex-1 flex-col items-center justify-center px-6">
                    {/* Semaphore — first thing visible */}
                    <div
                      className="flex flex-col items-center transition-none"
                      style={{ opacity: showSemaphore ? Math.min(1, (progress - 0.2) / 0.15) : 0 }}
                    >
                      <div className="mb-4 flex items-center gap-4">
                        <div className="relative h-14 w-14 rounded-full bg-[#4ade80] shadow-[0_0_28px_rgba(74,222,128,0.5)]">
                          <div className="absolute inset-0 animate-ping rounded-full bg-[#4ade80]/20" />
                        </div>
                        <div className="h-14 w-14 rounded-full bg-[#fbbf24]/15 ring-1 ring-[#fbbf24]/15" />
                        <div className="h-14 w-14 rounded-full bg-[#f87171]/15 ring-1 ring-[#f87171]/15" />
                      </div>
                      <p className="text-xl font-bold text-[#4ade80] sm:text-2xl">Hoy puedes apretar.</p>
                      <p className="mt-1 text-[11px] text-zinc-500">
                        Series o umbral. Tu cuerpo est&aacute; listo.
                      </p>
                    </div>

                    {/* Metric cards below semaphore */}
                    <div
                      className="mt-6 grid w-full max-w-md grid-cols-2 gap-3 transition-none"
                      style={{ opacity: showMetrics ? Math.min(1, (progress - 0.4) / 0.15) : 0 }}
                    >
                      {[
                        { label: "HRV", value: "62 ms", delta: "+12%", color: "text-[#4ade80]", spark: [45, 48, 52, 50, 55, 58, 62] },
                        { label: "Sue\u00f1o", value: "7h 40m", delta: "85%", color: "text-[#4ade80]", spark: [6.2, 7.1, 6.8, 7.5, 7.2, 7.8, 7.7] },
                        { label: "Carga 7d", value: "TSS 340", delta: "Moderada", color: "text-[#fbbf24]", spark: [80, 45, 65, 70, 30, 50, 0] },
                        { label: "FC reposo", value: "48 bpm", delta: "-2", color: "text-[#4ade80]", spark: [52, 51, 50, 49, 50, 48, 48] },
                      ].map((m) => (
                        <div key={m.label} className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-3">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[10px] text-zinc-600">{m.label}</span>
                            <span className={`text-[10px] ${m.color}`}>{m.delta}</span>
                          </div>
                          <div className="flex items-end justify-between">
                            <span className="text-sm font-bold">{m.value}</span>
                            <Sparkline points={m.spark} color={m.color.includes("fbbf24") ? "#fbbf24" : "#4ade80"} w={48} h={18} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right panel — charts */}
                  <div
                    className="flex h-full shrink-0 flex-col gap-3 border-l border-zinc-800/50 bg-[#080808] p-4 transition-none"
                    style={{
                      width: showCharts ? "220px" : "0px",
                      opacity: showCharts ? Math.min(1, (progress - 0.7) / 0.15) : 0,
                      overflow: "hidden",
                    }}
                  >
                    <div className="text-[10px] font-semibold text-zinc-500">TENDENCIA 30D</div>
                    <div className="rounded-lg border border-zinc-800/40 bg-zinc-900/30 p-3">
                      <div className="mb-1 text-[10px] text-zinc-600">HRV</div>
                      <Sparkline points={[42, 45, 44, 48, 50, 47, 52, 55, 53, 58, 56, 60, 62]} color="#4ade80" w={170} h={40} />
                      <div className="mt-1 text-[10px] text-[#4ade80]">+18% vs mes anterior</div>
                    </div>
                    <div className="rounded-lg border border-zinc-800/40 bg-zinc-900/30 p-3">
                      <div className="mb-1 text-[10px] text-zinc-600">Carga semanal</div>
                      {/* Bar chart */}
                      <div className="flex items-end gap-1.5" style={{ height: "40px" }}>
                        {[60, 80, 45, 70, 55, 40, 20].map((v, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm"
                            style={{
                              height: `${v}%`,
                              background: i === 6 ? "rgba(74,222,128,0.3)" : "rgba(74,222,128,0.12)",
                            }}
                          />
                        ))}
                      </div>
                      <div className="mt-1 flex justify-between text-[8px] text-zinc-700">
                        <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-zinc-800/40 bg-zinc-900/30 p-3">
                      <div className="mb-1 text-[10px] text-zinc-600">Sue&ntilde;o</div>
                      <Sparkline points={[6.5, 7.2, 6.8, 7.0, 7.5, 7.1, 7.8, 7.4, 7.6, 7.7, 7.3, 7.9, 7.7]} color="#a78bfa" w={170} h={40} />
                      <div className="mt-1 text-[10px] text-[#a78bfa]">Media: 7h 20m</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text that splits apart on scroll */}
          <div className="pointer-events-none relative z-20 flex flex-col items-center gap-2 text-center">
            <h1
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
              style={{
                transform: `translateX(-${textSpread}vw)`,
                opacity: 1 - progress * 1.5,
                transition: "none",
              }}
            >
              Tu Garmin te dice
            </h1>
            <h1
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
              style={{
                transform: `translateX(${textSpread}vw)`,
                opacity: 1 - progress * 1.5,
                color: "#4ade80",
                transition: "none",
              }}
            >
              lo que hiciste.
            </h1>
          </div>

          {/* Scroll indicator */}
          {!expanded && progress < 0.1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-12 z-20 flex flex-col items-center gap-2"
            >
              <span className="text-xs tracking-widest text-zinc-600">SCROLL PARA EXPLORAR</span>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-zinc-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.div>
          )}

          {/* Progress bar */}
          {!expanded && progress > 0 && (
            <div className="absolute bottom-6 left-1/2 z-20 w-24 -translate-x-1/2">
              <div className="h-0.5 w-full rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-[#4ade80] transition-none" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Content after expansion */}
        <motion.div
          className="w-full"
          style={{ opacity: expanded ? 1 : 0, pointerEvents: expanded ? "auto" : "none" }}
        >
          {children}
        </motion.div>
      </section>
    </div>
  );
}
