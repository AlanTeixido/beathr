"use client";

import { useEffect, useRef } from "react";

/* ECG value at phase 0..1 within one heartbeat */
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
    let dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    // Precompute ECG samples
    const SAMPLES = 1000;
    const ecgY: number[] = [];
    for (let i = 0; i < SAMPLES; i++) ecgY.push(ecg(i / SAMPLES));

    const speed = 2.8;
    let cursor = 0;
    let lastBeatTime = 0;
    let beatFlash = 0;

    function cycleW() { return w * 0.25; }

    function getY(x: number): number {
      const cw = cycleW();
      const phase = ((x % cw) + cw) % cw / cw;
      return ecgY[Math.floor(phase * SAMPLES) % SAMPLES];
    }

    function isSpike(x: number): boolean {
      const cw = cycleW();
      const phase = ((x % cw) + cw) % cw / cw;
      return phase > 0.30 && phase < 0.35;
    }

    // Three traces at different vertical positions for depth
    const traces = [
      { yOff: 0.35, amp: 0.18, alpha: 0.06, width: 1 },   // top - dim
      { yOff: 0.52, amp: 0.24, alpha: 1.0, width: 2 },     // center - main
      { yOff: 0.70, amp: 0.14, alpha: 0.04, width: 0.8 },  // bottom - dim
    ];

    function draw(time: number) {
      // Afterglow fade — creates phosphor trail
      ctx!.globalCompositeOperation = "destination-in";
      ctx!.fillStyle = "rgba(0,0,0,0.91)";
      ctx!.fillRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "source-over";

      // Clear gap ahead of cursor
      const gapW = w * 0.06;
      ctx!.clearRect(cursor, 0, gapW + 4, h);
      if (cursor + gapW > w) ctx!.clearRect(0, 0, (cursor + gapW) - w, h);

      cursor += speed;
      if (cursor >= w) cursor -= w;

      // Beat detection
      if (isSpike(cursor)) {
        if (time - lastBeatTime > 500) {
          lastBeatTime = time;
          beatFlash = 1;
        }
      }
      beatFlash *= 0.91;

      // Draw each trace
      for (const trace of traces) {
        const centerY = h * trace.yOff;
        const amp = h * trace.amp;
        const isMain = trace.alpha === 1.0;
        const baseAlpha = isMain ? 1 : trace.alpha;

        // Draw recent head segment
        const headLen = 8;
        ctx!.beginPath();
        for (let i = 0; i <= headLen; i++) {
          const px = ((cursor - headLen + i) % w + w) % w;
          const y = centerY - getY(px) * amp;
          if (i === 0) ctx!.moveTo(px, y); else ctx!.lineTo(px, y);
        }

        if (isMain) {
          // Outer glow
          ctx!.strokeStyle = `rgba(74,222,128,${0.3 + beatFlash * 0.3})`;
          ctx!.lineWidth = 6;
          ctx!.shadowColor = "#4ade80";
          ctx!.shadowBlur = 20 + beatFlash * 35;
          ctx!.stroke();

          // Mid glow
          ctx!.strokeStyle = `rgba(74,222,128,${0.6 + beatFlash * 0.2})`;
          ctx!.lineWidth = 3.5;
          ctx!.shadowBlur = 10 + beatFlash * 20;
          ctx!.stroke();

          // Bright core
          ctx!.strokeStyle = `rgba(74,222,128,${0.9})`;
          ctx!.lineWidth = trace.width;
          ctx!.shadowBlur = 4;
          ctx!.stroke();
          ctx!.shadowBlur = 0;
        } else {
          ctx!.strokeStyle = `rgba(74,222,128,${baseAlpha})`;
          ctx!.lineWidth = trace.width;
          ctx!.shadowColor = "#4ade80";
          ctx!.shadowBlur = 3;
          ctx!.stroke();
          ctx!.shadowBlur = 0;
        }

        // Fresh trail segment
        if (isMain) {
          const trailLen = 50;
          ctx!.beginPath();
          for (let i = 0; i <= trailLen; i++) {
            const px = ((cursor - headLen - trailLen + i) % w + w) % w;
            const y = centerY - getY(px) * amp;
            if (i === 0) ctx!.moveTo(px, y); else ctx!.lineTo(px, y);
          }
          ctx!.strokeStyle = "rgba(74,222,128,0.5)";
          ctx!.lineWidth = 1.5;
          ctx!.shadowColor = "#4ade80";
          ctx!.shadowBlur = 5;
          ctx!.stroke();
          ctx!.shadowBlur = 0;
        }

        // Cursor dot (main trace only)
        if (isMain) {
          const dotY = centerY - getY(cursor) * amp;
          const dotR = 3.5 + beatFlash * 6;

          // Outer glow
          ctx!.beginPath();
          ctx!.arc(cursor, dotY, dotR + 4, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(74,222,128,${0.15 + beatFlash * 0.2})`;
          ctx!.fill();

          // Core dot
          ctx!.beginPath();
          ctx!.arc(cursor, dotY, dotR, 0, Math.PI * 2);
          ctx!.fillStyle = "#4ade80";
          ctx!.shadowColor = "#4ade80";
          ctx!.shadowBlur = 16 + beatFlash * 30;
          ctx!.fill();
          ctx!.shadowBlur = 0;
        }
      }

      // Beat flash — radial burst from main trace cursor
      if (beatFlash > 0.05) {
        const burstY = h * 0.52 - getY(cursor) * h * 0.24;
        const grad = ctx!.createRadialGradient(cursor, burstY, 0, cursor, burstY, h * 0.4);
        grad.addColorStop(0, `rgba(74,222,128,${beatFlash * 0.12})`);
        grad.addColorStop(1, "rgba(74,222,128,0)");
        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, w, h);
      }

      // Subtle grid
      ctx!.strokeStyle = "rgba(74,222,128,0.015)";
      ctx!.lineWidth = 0.5;
      const gridSpacing = 60;
      for (let gy = gridSpacing; gy < h; gy += gridSpacing) {
        ctx!.beginPath();
        ctx!.moveTo(0, gy);
        ctx!.lineTo(w, gy);
        ctx!.stroke();
      }
      for (let gx = gridSpacing; gx < w; gx += gridSpacing) {
        ctx!.beginPath();
        ctx!.moveTo(gx, 0);
        ctx!.lineTo(gx, h);
        ctx!.stroke();
      }

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
