"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const ACCENT = new THREE.Color("#6EE7FF");
const VIOLET = new THREE.Color("#8B5CF6");

function Core() {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, x * 0.6 + state.clock.elapsedTime * 0.08, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.4, 3, delta);
    if (shell.current) {
      shell.current.rotation.z += delta * 0.05;
      shell.current.rotation.y -= delta * 0.08;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.05, 64]} />
          <MeshDistortMaterial
            color="#16161d"
            roughness={0.08}
            metalness={1}
            envMapIntensity={1.4}
            distort={0.38}
            speed={1.6}
          />
        </mesh>
        <mesh ref={shell} scale={1.6}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.18} />
        </mesh>
      </Float>
    </group>
  );
}

function Particles({ count = 420 }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.4 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      array[i * 3 + 2] = radius * Math.cos(phi);
    }
    return array;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#ffffff" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function HeroObject() {
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Pause rendering when off-screen or tab hidden.
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 });
    observer.observe(element);
    const onVisibility = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={container} className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[-4, 3, 2]} intensity={1.2} color={ACCENT} />
        {/* Procedural studio lighting for reflections — no HDR download. */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={4} color={ACCENT} position={[-5, 2, 2]} scale={[3, 6, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={5} color={VIOLET} position={[5, -1, 2]} scale={[3, 6, 1]} target={[0, 0, 0]} />
          <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 4, -4]} scale={3} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={1} color="#ffffff" position={[0, -5, 1]} scale={[10, 1, 1]} target={[0, 0, 0]} />
        </Environment>
        <Core />
        <Particles />
      </Canvas>
    </div>
  );
}
