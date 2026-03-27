"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface ScrollExpansionHeroProps {
  children?: React.ReactNode;
  onExpanded?: () => void;
}

export default function ScrollExpansionHero({ children, onExpanded }: ScrollExpansionHeroProps) {
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
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
      setTouchStartY(e.touches[0].clientY);
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

  // Interpolated values
  const cardW = 340 + progress * 1200;
  const cardH = 420 + progress * 500;
  const borderRadius = 32 - progress * 32;
  const overlayOpacity = 0.6 - progress * 0.5;
  const textSpread = progress * 120;

  return (
    <div ref={sectionRef} className="overflow-x-hidden">
      <section className="relative flex min-h-screen flex-col items-center justify-center">
        {/* Background ECG — fades out as card expands */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: 1 - progress * 0.7 }}
        >
          {/* ECG canvas will be placed here by parent */}
        </motion.div>

        <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
          {/* Expanding card */}
          <div
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-2xl shadow-black/50"
            style={{
              width: `${Math.min(cardW, typeof window !== "undefined" ? window.innerWidth * 0.95 : 1400)}px`,
              height: `${Math.min(cardH, typeof window !== "undefined" ? window.innerHeight * 0.9 : 800)}px`,
              maxWidth: "95vw",
              maxHeight: "90vh",
              borderRadius: `${borderRadius}px`,
              transition: "none",
            }}
          >
            {/* Card inner — dark gradient with ECG pattern */}
            <div className="relative h-full w-full bg-gradient-to-b from-[#0d1a0d] via-[#0a0a0a] to-[#0a0a0a]">
              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundSize: "40px 40px",
                  backgroundImage: `linear-gradient(to right, rgba(74,222,128,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(74,222,128,0.08) 1px, transparent 1px)`,
                  maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
                }}
              />

              {/* ECG line inside card */}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                <motion.polyline
                  points="0,100 80,100 120,100 160,100 200,100 230,95 250,80 260,100 280,100 300,105 310,30 320,170 330,60 340,100 360,100 400,100 440,95 460,85 480,100 520,100 560,100 600,100 640,100 670,95 690,80 700,100 720,100 740,105 750,30 760,170 770,60 780,100 800,100"
                  fill="none"
                  stroke="rgba(74,222,128,0.15)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress > 0.3 ? 1 : progress / 0.3 }}
                  transition={{ duration: 0.5 }}
                />
              </svg>

              {/* Overlay that lightens as expansion happens */}
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: overlayOpacity }}
              />

              {/* Content inside the card — appears near end */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center px-6"
                style={{ opacity: Math.max(0, (progress - 0.6) / 0.4) }}
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full bg-[#4ade80] shadow-[0_0_30px_rgba(74,222,128,0.5)]">
                    <div className="absolute inset-0 animate-ping rounded-full bg-[#4ade80]/20" />
                  </div>
                  <div className="h-12 w-12 rounded-full bg-[#fbbf24]/15 ring-1 ring-[#fbbf24]/20" />
                  <div className="h-12 w-12 rounded-full bg-[#f87171]/15 ring-1 ring-[#f87171]/20" />
                </div>
                <p className="text-2xl font-bold text-[#4ade80] sm:text-3xl">Hoy puedes apretar.</p>
                <p className="mt-2 text-sm text-zinc-500">
                  HRV +12% &middot; Sue&ntilde;o 7h40 &middot; Carga moderada
                </p>
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
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
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
                <div
                  className="h-full rounded-full bg-[#4ade80] transition-none"
                  style={{ width: `${progress * 100}%` }}
                />
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
