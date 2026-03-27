"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/*
 * Generate a realistic ECG waveform as an array of [x, y] values.
 * One full heartbeat cycle then repeats across the width.
 */
function generateECGPoints(totalWidth: number, sampleCount: number): number[][] {
  const pts: number[][] = [];
  const cycleWidth = 3.2;
  for (let i = 0; i < sampleCount; i++) {
    const x = (i / sampleCount) * totalWidth - totalWidth / 2;
    const t = ((x % cycleWidth) + cycleWidth) % cycleWidth;
    const n = t / cycleWidth; // 0..1 within one cycle
    let y = 0;

    // P wave: gentle bump at n ~ 0.10-0.18
    if (n > 0.08 && n < 0.20) {
      const p = (n - 0.08) / 0.12;
      y = 0.12 * Math.sin(p * Math.PI);
    }
    // Q dip: n ~ 0.28-0.31
    else if (n > 0.28 && n < 0.31) {
      const q = (n - 0.28) / 0.03;
      y = -0.1 * Math.sin(q * Math.PI);
    }
    // R spike: n ~ 0.31-0.37
    else if (n >= 0.31 && n < 0.37) {
      const r = (n - 0.31) / 0.06;
      y = 0.85 * Math.sin(r * Math.PI);
    }
    // S dip: n ~ 0.37-0.42
    else if (n >= 0.37 && n < 0.42) {
      const s = (n - 0.37) / 0.05;
      y = -0.2 * Math.sin(s * Math.PI);
    }
    // T wave: broader bump at n ~ 0.52-0.68
    else if (n > 0.50 && n < 0.68) {
      const tw = (n - 0.50) / 0.18;
      y = 0.22 * Math.sin(tw * Math.PI);
    }

    pts.push([x, y]);
  }
  return pts;
}

/*
 * Animated ECG trace — draws itself like a real cardiac monitor.
 * A bright cursor sweeps right, leaving a fading trail behind.
 */
function ECGTrace() {
  const totalWidth = 12;
  const sampleCount = 600;
  const ecgData = useMemo(() => generateECGPoints(totalWidth, sampleCount), []);

  const lineRef = useRef<THREE.Object3D>(null);
  const glowRef = useRef<THREE.Object3D>(null);
  const cursorRef = useRef<THREE.Mesh>(null);
  const burstRef = useRef<THREE.PointLight>(null);

  // Colors array for fading trail
  const colorsArray = useMemo(() => new Float32Array(sampleCount * 3), [sampleCount]);
  const positionsArray = useMemo(() => {
    const arr = new Float32Array(sampleCount * 3);
    for (let i = 0; i < sampleCount; i++) {
      arr[i * 3] = ecgData[i][0];
      arr[i * 3 + 1] = ecgData[i][1];
      arr[i * 3 + 2] = 0;
    }
    return arr;
  }, [ecgData]);

  // Track heartbeat for burst flash
  const lastBeatRef = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = 0.12; // cycles per second
    const progress = (t * speed) % 1; // 0..1 sweep across the line
    const cursorIdx = Math.floor(progress * sampleCount);

    // Update colors: bright at cursor, fading trail behind, dark ahead
    const g = 0.294; // green channel for #4ade80 = 74/255
    const r = 0.290;
    const b = 0.502;

    for (let i = 0; i < sampleCount; i++) {
      let dist = cursorIdx - i;
      if (dist < 0) dist += sampleCount;

      let alpha: number;
      if (dist < 0 || dist > sampleCount * 0.85) {
        // Ahead of cursor — dark gap
        alpha = 0.03;
      } else if (dist < 3) {
        // Cursor head — full brightness
        alpha = 1.0;
      } else if (dist < sampleCount * 0.45) {
        // Recent trail — bright fade
        alpha = 1.0 - (dist / (sampleCount * 0.45)) * 0.7;
      } else {
        // Old trail — dim fade
        alpha = 0.3 - ((dist - sampleCount * 0.45) / (sampleCount * 0.4)) * 0.27;
      }

      colorsArray[i * 3] = r * alpha;
      colorsArray[i * 3 + 1] = g * alpha + (1 - g) * alpha * 0.8; // boost green
      colorsArray[i * 3 + 2] = b * alpha * 0.5;
    }

    if (lineRef.current) {
      const line = lineRef.current as unknown as THREE.Line;
      line.geometry.setAttribute("color", new THREE.BufferAttribute(colorsArray.slice(), 3));
      line.geometry.attributes.color.needsUpdate = true;
    }

    if (glowRef.current) {
      const line = glowRef.current as unknown as THREE.Line;
      const glowColors = new Float32Array(colorsArray.length);
      for (let i = 0; i < colorsArray.length; i++) {
        glowColors[i] = colorsArray[i] * 0.4;
      }
      line.geometry.setAttribute("color", new THREE.BufferAttribute(glowColors, 3));
      line.geometry.attributes.color.needsUpdate = true;
    }

    // Cursor dot position
    if (cursorRef.current && cursorIdx < sampleCount) {
      cursorRef.current.position.x = ecgData[cursorIdx][0];
      cursorRef.current.position.y = ecgData[cursorIdx][1];

      // Pulse the cursor size with heartbeat (bigger during R spike)
      const yVal = Math.abs(ecgData[cursorIdx][1]);
      const scale = 0.04 + yVal * 0.08;
      cursorRef.current.scale.setScalar(scale / 0.04);
    }

    // Flash on R-spike (heartbeat burst)
    if (burstRef.current) {
      const cycleWidth = 3.2;
      const cursorX = ecgData[cursorIdx][0];
      const posInCycle = ((cursorX % cycleWidth) + cycleWidth) % cycleWidth;
      const nPos = posInCycle / cycleWidth;

      // Detect R-spike region
      if (nPos > 0.31 && nPos < 0.37) {
        if (t - lastBeatRef.current > 0.5) {
          lastBeatRef.current = t;
        }
        burstRef.current.intensity = 3;
        burstRef.current.position.x = ecgData[cursorIdx][0];
        burstRef.current.position.y = ecgData[cursorIdx][1];
      } else {
        const fade = Math.max(0, 3 - (t - lastBeatRef.current) * 6);
        burstRef.current.intensity = fade;
      }
    }
  });

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positionsArray.slice(), 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colorsArray.slice(), 3));
    return geo;
  }, [positionsArray, colorsArray]);

  const glowGeo = useMemo(() => {
    // Slightly offset glow line
    const arr = new Float32Array(positionsArray.length);
    for (let i = 0; i < sampleCount; i++) {
      arr[i * 3] = positionsArray[i * 3];
      arr[i * 3 + 1] = positionsArray[i * 3 + 1];
      arr[i * 3 + 2] = -0.01;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colorsArray.slice(), 3));
    return geo;
  }, [positionsArray, colorsArray, sampleCount]);

  return (
    <group position={[0, 0, 0]}>
      {/* Glow line (thicker, behind) */}
      <primitive ref={glowRef} object={new THREE.Line(glowGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.3 }))} />

      {/* Main ECG line */}
      <primitive ref={lineRef} object={new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 }))} />

      {/* Cursor dot */}
      <mesh ref={cursorRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#4ade80" transparent opacity={0.95} />
      </mesh>

      {/* Heartbeat burst light */}
      <pointLight
        ref={burstRef}
        color="#4ade80"
        intensity={0}
        distance={4}
        position={[0, 0, 0.5]}
      />
    </group>
  );
}

/*
 * Floating particles that pulse with a heartbeat rhythm.
 */
function HeartbeatParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 80;

  const [positions, basePositions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 5;
      const z = (Math.random() - 0.5) * 3 - 1;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      sz[i] = Math.random() * 0.03 + 0.01;
    }
    return [pos, base, sz];
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();

    // Heartbeat rhythm: ~72 BPM = 1.2s per beat
    const beatPhase = (t % 1.2) / 1.2;
    // Sharp pulse at beat
    const pulse = beatPhase < 0.1 ? Math.sin((beatPhase / 0.1) * Math.PI) : 0;

    const posAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];

      // Gentle float + pulse expansion from center
      const dx = bx * 0.01 * pulse;
      const dy = by * 0.01 * pulse;

      posAttr.setXYZ(
        i,
        bx + dx + Math.sin(t * 0.3 + i) * 0.02,
        by + dy + Math.cos(t * 0.2 + i * 0.7) * 0.02,
        bz
      );
    }
    posAttr.needsUpdate = true;

    // Pulse opacity
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.25 + pulse * 0.35;
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, sizes]);

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        color="#4ade80"
        size={0.04}
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/*
 * Grid lines for a subtle monitor/medical feel.
 */
function MonitorGrid() {
  const horizontalLines = useMemo(() => {
    const lines: React.JSX.Element[] = [];
    for (let i = -2; i <= 2; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-7, i * 0.5, -0.2),
        new THREE.Vector3(7, i * 0.5, -0.2),
      ]);
      const mat = new THREE.LineBasicMaterial({ color: "#4ade80", transparent: true, opacity: 0.04 });
      lines.push(<primitive key={`h${i}`} object={new THREE.Line(geo, mat)} />);
    }
    return lines;
  }, []);

  const verticalLines = useMemo(() => {
    const lines: React.JSX.Element[] = [];
    for (let i = -7; i <= 7; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, -1.5, -0.2),
        new THREE.Vector3(i, 1.5, -0.2),
      ]);
      const mat = new THREE.LineBasicMaterial({ color: "#4ade80", transparent: true, opacity: 0.03 });
      lines.push(<primitive key={`v${i}`} object={new THREE.Line(geo, mat)} />);
    }
    return lines;
  }, []);

  return (
    <group>
      <group>{horizontalLines}</group>
      <group>{verticalLines}</group>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <ECGTrace />
      <HeartbeatParticles />
      <MonitorGrid />
    </>
  );
}

export default function ECGHero3D() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0.2, 4.5], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.5]}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
