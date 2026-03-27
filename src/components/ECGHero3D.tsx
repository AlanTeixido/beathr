"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ECGWave() {
  const groupRef = useRef<THREE.Group>(null);

  // Realistic ECG heartbeat path: flat → P wave → flat → QRS complex → flat → T wave → flat
  const points = [
    new THREE.Vector3(-4, 0, 0),
    new THREE.Vector3(-3.5, 0, 0),
    new THREE.Vector3(-3, 0, 0),
    // P wave (small bump)
    new THREE.Vector3(-2.5, 0.15, 0),
    new THREE.Vector3(-2.2, 0.3, 0),
    new THREE.Vector3(-1.9, 0.15, 0),
    new THREE.Vector3(-1.6, 0, 0),
    // Flat before QRS
    new THREE.Vector3(-1.3, 0, 0),
    // Q dip
    new THREE.Vector3(-1.1, -0.15, 0),
    // R spike (sharp up)
    new THREE.Vector3(-0.9, 1.4, 0),
    // S dip (sharp down)
    new THREE.Vector3(-0.7, -0.4, 0),
    // Return to baseline
    new THREE.Vector3(-0.5, 0, 0),
    // Flat
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.3, 0, 0),
    // T wave (recovery bump)
    new THREE.Vector3(0.7, 0.1, 0),
    new THREE.Vector3(1.0, 0.35, 0),
    new THREE.Vector3(1.3, 0.25, 0),
    new THREE.Vector3(1.6, 0, 0),
    // Flat trailing
    new THREE.Vector3(2.0, 0, 0),
    new THREE.Vector3(2.5, 0, 0),
    new THREE.Vector3(3.0, 0, 0),
    new THREE.Vector3(3.5, 0, 0),
    new THREE.Vector3(4, 0, 0),
  ];

  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.3);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <tubeGeometry args={[curve, 200, 0.02, 8, false]} />
        <meshStandardMaterial
          color="#4ade80"
          emissive="#4ade80"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function GlowRing() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 1.2) * 0.08;
      meshRef.current.scale.set(s, s, s);
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.12 + Math.sin(clock.getElapsedTime() * 1.2) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -0.5]} rotation={[0, 0, 0]}>
      <torusGeometry args={[2.2, 0.06, 16, 100]} />
      <meshStandardMaterial
        color="#4ade80"
        emissive="#4ade80"
        emissiveIntensity={0.5}
        transparent
        opacity={0.15}
        toneMapped={false}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 2, 3]} intensity={1.5} color="#4ade80" />
      <ECGWave />
      <GlowRing />
    </>
  );
}

export default function ECGHero3D() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0.3, 5], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
