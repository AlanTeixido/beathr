"use client";

import { useEffect, useRef } from "react";

function ecg(n: number): number {
  if (n > 0.08 && n < 0.19) return 0.13 * Math.sin(((n - 0.08) / 0.11) * Math.PI);
  if (n >= 0.27 && n < 0.30) return -0.09 * Math.sin(((n - 0.27) / 0.03) * Math.PI);
  if (n >= 0.30 && n < 0.35) return 1.0 * Math.sin(((n - 0.30) / 0.05) * Math.PI);
  if (n >= 0.35 && n < 0.40) return -0.28 * Math.sin(((n - 0.35) / 0.05) * Math.PI);
  if (n > 0.50 && n < 0.67) return 0.22 * Math.sin(((n - 0.50) / 0.17) * Math.PI);
  return 0;
}

export default function ECGHero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const SAMPLES = 800;
    const ecgY: number[] = [];
    for (let i = 0; i < SAMPLES; i++) ecgY.push(ecg(i / SAMPLES));

    let cursor = 0;
    const speed = 2.2;

    function cycleW() { return w * 0.28; }

    function getY(x: number): number {
      const cw = cycleW();
      const phase = ((x % cw) + cw) % cw / cw;
      return ecgY[Math.floor(phase * SAMPLES) % SAMPLES];
    }

    function draw() {
      // Fade trail
      ctx!.globalCompositeOperation = "destination-in";
      ctx!.fillStyle = "rgba(0,0,0,0.93)";
      ctx!.fillRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "source-over";

      // Clear gap ahead
      const gapW = w * 0.05;
      ctx!.clearRect(cursor, 0, gapW + 2, h);
      if (cursor + gapW > w) ctx!.clearRect(0, 0, (cursor + gapW) - w, h);

      cursor += speed;
      if (cursor >= w) cursor -= w;

      const centerY = h * 0.5;
      const amp = h * 0.2;

      // Draw head segment
      const headLen = 6;
      ctx!.beginPath();
      for (let i = 0; i <= headLen; i++) {
        const px = ((cursor - headLen + i) % w + w) % w;
        const y = centerY - getY(px) * amp;
        if (i === 0) ctx!.moveTo(px, y); else ctx!.lineTo(px, y);
      }

      // Glow
      ctx!.strokeStyle = "rgba(220,60,60,0.25)";
      ctx!.lineWidth = 5;
      ctx!.shadowColor = "rgba(220,60,60,0.4)";
      ctx!.shadowBlur = 16;
      ctx!.stroke();

      // Core line
      ctx!.strokeStyle = "rgba(220,60,60,0.45)";
      ctx!.lineWidth = 1.5;
      ctx!.shadowBlur = 6;
      ctx!.stroke();
      ctx!.shadowBlur = 0;

      // Cursor dot
      const dotY = centerY - getY(cursor) * amp;
      ctx!.beginPath();
      ctx!.arc(cursor, dotY, 2.5, 0, Math.PI * 2);
      ctx!.fillStyle = "rgba(220,60,60,0.6)";
      ctx!.shadowColor = "rgba(220,60,60,0.5)";
      ctx!.shadowBlur = 10;
      ctx!.fill();
      ctx!.shadowBlur = 0;

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
