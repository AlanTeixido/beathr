"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  // 0 = black, 1 = ecg line draws, 2 = name reveals, 3 = tagline, 4 = exit

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => setPhase(4), 3800),
      setTimeout(() => onComplete(), 4600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 4 && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]"
        >
          {/* Film grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px",
            }}
          />

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.6)_100%)]" />

          {/* ECG line that draws itself */}
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute"
            >
              <svg width="280" height="60" viewBox="0 0 280 60" fill="none">
                <motion.polyline
                  points="0,30 40,30 60,30 80,30 95,28 105,22 110,30 120,30 130,32 135,8 140,52 145,18 150,30 160,30 180,30 195,28 205,24 215,30 240,30 280,30"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
          )}

          {/* Brand name */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, filter: "blur(30px)", rotateX: -25 }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", rotateX: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 mt-16"
              style={{ perspective: "800px" }}
            >
              <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
                beat<span className="text-[#4ade80]">hr</span>
              </h1>
            </motion.div>
          )}

          {/* Tagline with clip-path reveal */}
          {phase >= 3 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 mt-4 text-sm tracking-[0.3em] text-zinc-500 uppercase"
            >
              Recovery Intelligence
            </motion.p>
          )}

          {/* Glow pulse behind the text */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.15, scale: 1.2 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute h-64 w-64 rounded-full bg-[#4ade80] blur-[100px]"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
