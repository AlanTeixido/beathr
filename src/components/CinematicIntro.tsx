"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Canvas ECG for the intro ─── */
function IntroECG({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ECG waveform function
    function ecg(n: number): number {
      if (n > 0.08 && n < 0.19) return 0.13 * Math.sin(((n - 0.08) / 0.11) * Math.PI);
      if (n >= 0.27 && n < 0.30) return -0.09 * Math.sin(((n - 0.27) / 0.03) * Math.PI);
      if (n >= 0.30 && n < 0.35) return 1.0 * Math.sin(((n - 0.30) / 0.05) * Math.PI);
      if (n >= 0.35 && n < 0.40) return -0.28 * Math.sin(((n - 0.35) / 0.05) * Math.PI);
      if (n > 0.50 && n < 0.67) return 0.22 * Math.sin(((n - 0.50) / 0.17) * Math.PI);
      return 0;
    }

    const totalPoints = 600;
    const ecgPoints: number[] = [];
    for (let i = 0; i < totalPoints; i++) ecgPoints.push(ecg(i / totalPoints));

    const centerY = h * 0.5;
    const amp = h * 0.28;
    startRef.current = performance.now();

    function draw(time: number) {
      const elapsed = time - startRef.current;
      const drawDuration = 2000; // 2s to draw full line
      const progress = Math.min(elapsed / drawDuration, 1);
      const drawnPoints = Math.floor(progress * totalPoints);

      ctx!.clearRect(0, 0, w, h);

      if (drawnPoints < 2) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Calculate x positions
      const startX = w * 0.08;
      const endX = w * 0.92;
      const rangeX = endX - startX;

      // Outer glow layer
      ctx!.beginPath();
      for (let i = 0; i < drawnPoints; i++) {
        const x = startX + (i / totalPoints) * rangeX;
        const y = centerY - ecgPoints[i] * amp;
        if (i === 0) ctx!.moveTo(x, y); else ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = "rgba(74,222,128,0.15)";
      ctx!.lineWidth = 8;
      ctx!.shadowColor = "#4ade80";
      ctx!.shadowBlur = 30;
      ctx!.stroke();

      // Mid glow
      ctx!.beginPath();
      for (let i = 0; i < drawnPoints; i++) {
        const x = startX + (i / totalPoints) * rangeX;
        const y = centerY - ecgPoints[i] * amp;
        if (i === 0) ctx!.moveTo(x, y); else ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = "rgba(74,222,128,0.4)";
      ctx!.lineWidth = 3;
      ctx!.shadowBlur = 15;
      ctx!.stroke();

      // Core line
      ctx!.beginPath();
      for (let i = 0; i < drawnPoints; i++) {
        const x = startX + (i / totalPoints) * rangeX;
        const y = centerY - ecgPoints[i] * amp;
        if (i === 0) ctx!.moveTo(x, y); else ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = "#4ade80";
      ctx!.lineWidth = 2;
      ctx!.shadowBlur = 6;
      ctx!.stroke();
      ctx!.shadowBlur = 0;

      // Cursor dot at the drawing head
      const headIdx = drawnPoints - 1;
      const headX = startX + (headIdx / totalPoints) * rangeX;
      const headY = centerY - ecgPoints[headIdx] * amp;
      const isSpike = ecgPoints[headIdx] > 0.3;

      // Dot glow
      ctx!.beginPath();
      ctx!.arc(headX, headY, isSpike ? 12 : 6, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(74,222,128,${isSpike ? 0.3 : 0.15})`;
      ctx!.fill();

      // Dot core
      ctx!.beginPath();
      ctx!.arc(headX, headY, isSpike ? 5 : 3, 0, Math.PI * 2);
      ctx!.fillStyle = "#4ade80";
      ctx!.shadowColor = "#4ade80";
      ctx!.shadowBlur = isSpike ? 25 : 12;
      ctx!.fill();
      ctx!.shadowBlur = 0;

      // Spike flash
      if (isSpike) {
        const grad = ctx!.createRadialGradient(headX, headY, 0, headX, headY, h * 0.35);
        grad.addColorStop(0, "rgba(74,222,128,0.12)");
        grad.addColorStop(1, "rgba(74,222,128,0)");
        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, w, h);
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(draw);
      }
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: active ? 1 : 0 }}
    />
  );
}

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),   // ECG starts drawing
      setTimeout(() => setPhase(2), 2200),   // Logo appears (after ECG draws)
      setTimeout(() => setPhase(3), 3200),   // Tagline
      setTimeout(() => setPhase(4), 4400),   // Begin exit
      setTimeout(() => onComplete(), 5200),  // Done
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 4 && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
        >
          {/* Noise texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px",
            }}
          />

          {/* Heavy vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.7)_100%)]" />

          {/* Canvas ECG that draws across the screen */}
          <IntroECG active={phase >= 1} />

          {/* Glow pulse — starts subtle, grows with logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: phase >= 2 ? 0.2 : phase >= 1 ? 0.05 : 0,
              scale: phase >= 2 ? 1.5 : 0.5,
            }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute h-80 w-80 rounded-full bg-[#4ade80] blur-[120px]"
          />

          {/* Logo — appears after ECG finishes drawing */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, filter: "blur(40px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              <h1
                className="text-6xl font-extrabold tracking-tight sm:text-8xl md:text-9xl"
                style={{
                  textShadow: "0 0 60px rgba(74,222,128,0.15), 0 0 120px rgba(74,222,128,0.05)",
                }}
              >
                beat<span className="text-[#4ade80]">hr</span>
              </h1>
            </motion.div>
          )}

          {/* Tagline — letter-spaced reveal */}
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 12, letterSpacing: "0.5em" }}
              animate={{ opacity: 0.5, y: 0, letterSpacing: "0.3em" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative z-10 mt-5"
            >
              <p className="text-xs font-medium uppercase text-zinc-500 sm:text-sm">
                Recovery Intelligence
              </p>
            </motion.div>
          )}

          {/* Horizontal line accent under logo */}
          {phase >= 2 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 mt-6 h-px w-32 origin-center bg-gradient-to-r from-transparent via-[#4ade80]/40 to-transparent"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
