"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Center } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// SHARED GEOMETRY & MATERIALS — Create once, reuse for all 52 meshes
// This massively reduces WebGL memory footprint and initialization overhead
// ============================================================================
const CUBIE_SIZE = 0.27;
const SPACING = 0.31;

const sharedGeometry = new THREE.BoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE);
const sharedBaseMaterial = new THREE.MeshStandardMaterial({
  color: "#090d16",
  metalness: 0.9,
  roughness: 0.15
});

const sharedWireMaterials = {
  top: new THREE.MeshBasicMaterial({ color: "#3b82f6", wireframe: true, transparent: true, opacity: 0.25 }),
  middle: new THREE.MeshBasicMaterial({ color: "#10b981", wireframe: true, transparent: true, opacity: 0.25 }),
  bottom: new THREE.MeshBasicMaterial({ color: "#ff9e00", wireframe: true, transparent: true, opacity: 0.25 })
};

// ============================================================================
// VISIBILITY HOOK — Only mount Canvas when in viewport
// ============================================================================
function useInView(rootMargin = '100px') {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isInView };
}

// ============================================================================
// RUBIK CUBE — Uses invalidate() for on-demand rendering
// ============================================================================
function RubikCube() {
  const topLayerRef = useRef<THREE.Group>(null);
  const middleLayerRef = useRef<THREE.Group>(null);
  const bottomLayerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Twist layers in opposite directions/speeds like a Rubik's cube puzzle
    if (topLayerRef.current) {
      topLayerRef.current.rotation.y = t * 0.4;
    }
    if (middleLayerRef.current) {
      middleLayerRef.current.rotation.y = t * -0.2;
    }
    if (bottomLayerRef.current) {
      bottomLayerRef.current.rotation.y = t * 0.6;
    }
  });

  // Generate coordinates for outer cubies (skipping hollow center)
  const getCubiesForY = (yVal: number) => {
    const list = [];
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && yVal === 0 && z === 0) continue; // hollow center
        list.push({ x, z });
      }
    }
    return list;
  };

  const getLayerMaterial = (yVal: number) => {
    if (yVal === 1) return sharedWireMaterials.top;
    if (yVal === 0) return sharedWireMaterials.middle;
    return sharedWireMaterials.bottom;
  };

  const renderSlice = (yVal: number, ref: React.RefObject<THREE.Group | null>) => {
    const cubies = getCubiesForY(yVal);
    const wireMaterial = getLayerMaterial(yVal);

    return (
      <group ref={ref}>
        {cubies.map(({ x, z }, idx) => (
          <group 
            key={`${x}-${yVal}-${z}-${idx}`} 
            position={[x * SPACING, yVal * SPACING, z * SPACING]}
          >
            {/* Dark chrome solid base cubie */}
            <mesh geometry={sharedGeometry} material={sharedBaseMaterial} />

            {/* Glowing neon wireframe edge accent */}
            <mesh geometry={sharedGeometry} material={wireMaterial} scale={1.015} />
          </group>
        ))}
      </group>
    );
  };

  return (
    <group scale={2.2}>
      {renderSlice(1, topLayerRef)}
      {renderSlice(0, middleLayerRef)}
      {renderSlice(-1, bottomLayerRef)}
    </group>
  );
}

// ============================================================================
// STATIC PLACEHOLDER — Lightweight CSS-only fallback when Canvas is unmounted
// ============================================================================
function CanvasPlaceholder() {
  return (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
      {/* Subtle cube silhouette hint */}
      <div className="relative w-20 h-20 opacity-20">
        <div
          className="absolute inset-0 border border-white/30 rounded-sm"
          style={{ transform: 'rotateX(15deg) rotateY(25deg)', transformStyle: 'preserve-3d' }}
        />
        <div
          className="absolute inset-2 border border-emerald-500/20 rounded-sm"
          style={{ transform: 'rotateX(15deg) rotateY(25deg)', transformStyle: 'preserve-3d' }}
        />
      </div>
      <span className="absolute bottom-6 left-6 font-mono text-[10px] text-white/20 tracking-widest pointer-events-none">
        [ LOADING WEBGL ]
      </span>
    </div>
  );
}

// ============================================================================
// MAIN EXPORT — Canvas only mounts when visible in viewport
// ============================================================================
export function Abstract3DShowcase() {
  const { ref: containerRef, isInView } = useInView('200px');

  return (
    <div 
      ref={containerRef}
      className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center'
      }}
    >
      {isInView ? (
        <Canvas 
          camera={{ position: [0, 0, 6], fov: 45 }} 
          dpr={[1, 1.5]} // Clamp pixel ratio to max 1.5 to prevent massive lag on high-DPI screens
          gl={{ 
            antialias: true,
            powerPreference: "high-performance",
            precision: "mediump",
            alpha: true,
            stencil: false,
            depth: true
          }}
        >
          <ambientLight intensity={1.3} />
          
          {/* Balanced directional lights for metallic reflections */}
          <directionalLight position={[5, 8, 4]} intensity={2.2} color="#10b981" />
          <directionalLight position={[-5, -8, -4]} intensity={1.8} color="#3b82f6" />

          <Center>
            <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
              <RubikCube />
            </Float>
          </Center>

          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.8} 
          />
        </Canvas>
      ) : (
        <CanvasPlaceholder />
      )}
    </div>
  );
}
