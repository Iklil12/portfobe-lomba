"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ThemeType = 'spatial' | 'cyber' | 'noir' | 'brutalist';

const THEME_DATA = {
  spatial: {
    name: 'Aura Spatial',
    skyTop: '#020617',
    skyBottom: '#1e1b4b',
    sunColor: '#60a5fa',
    sunBorder: 'rgba(0,0,0,0)',
    sunBorderWidth: 0,
    sunGlow: '0px 0px 80px rgba(96,165,250,0.8)',
    sunY: '20%',
    sunScale: 1,
    m1Fill: '#312e81',
    m2Fill: '#1e1b4b',
    m3Fill: '#0f172a',
    mStroke: 'rgba(0,0,0,0)',
    mStrokeWidth: 0,
    groundFill: '#020617',
    gridColor: 'rgba(96,165,250,0.0)',
    cardBorder: 'rgba(255,255,255,0.1)',
    cardRadius: '24px',
    cardShadow: '0 20px 40px rgba(0,0,0,0.5)',
    indicator: '#60a5fa'
  },
  cyber: {
    name: 'Acid Tech',
    skyTop: '#000000',
    skyBottom: '#050a08',
    sunColor: 'transparent',
    sunBorder: '#ff007f',
    sunBorderWidth: 2,
    sunGlow: '0px 0px 40px rgba(255,0,127,0.5)',
    sunY: '35%',
    sunScale: 1.5,
    m1Fill: '#000000',
    m2Fill: '#000000',
    m3Fill: '#000000',
    mStroke: '#bcfe00',
    mStrokeWidth: 1.5,
    groundFill: '#000000',
    gridColor: 'rgba(188,254,0,0.25)',
    cardBorder: '#ff007f',
    cardRadius: '0px',
    cardShadow: '0 0 30px rgba(255,0,127,0.2)',
    indicator: '#bcfe00'
  },
  noir: {
    name: 'Midnight Emulsion',
    skyTop: '#111111',
    skyBottom: '#050505',
    sunColor: '#e5e5e5',
    sunBorder: 'rgba(0,0,0,0)',
    sunBorderWidth: 0,
    sunGlow: '0px 0px 60px rgba(255,255,255,0.15)',
    sunY: '15%',
    sunScale: 0.8,
    m1Fill: '#262626',
    m2Fill: '#171717',
    m3Fill: '#0a0a0a',
    mStroke: '#333333',
    mStrokeWidth: 1,
    groundFill: '#000000',
    gridColor: 'rgba(0,0,0,0)',
    cardBorder: '#333333',
    cardRadius: '8px',
    cardShadow: '0 20px 40px rgba(0,0,0,0.8)',
    indicator: '#ff9e00'
  },
  brutalist: {
    name: 'Monolith Vanguard',
    skyTop: '#e5e5e5',
    skyBottom: '#d4d4d4',
    sunColor: '#ef4444',
    sunBorder: '#000000',
    sunBorderWidth: 4,
    sunGlow: '0px 0px 0px rgba(0,0,0,0)',
    sunY: '25%',
    sunScale: 1.2,
    m1Fill: '#ffffff',
    m2Fill: '#f5f4eb',
    m3Fill: '#e5e5e5',
    mStroke: '#000000',
    mStrokeWidth: 4,
    groundFill: '#ffffff',
    gridColor: 'rgba(0,0,0,0)',
    cardBorder: '#000000',
    cardRadius: '0px',
    cardShadow: '12px 12px 0px #000000',
    indicator: '#ef4444'
  }
};

export function ThemeHoverShowcase() {
  const [activeTheme, setActiveTheme] = useState<ThemeType>('noir');
  const t = THEME_DATA[activeTheme];

  // Auto-rotate themes perfectly
  useEffect(() => {
    const themes: ThemeType[] = ['noir', 'spatial', 'cyber', 'brutalist'];
    const interval = setInterval(() => {
      setActiveTheme((prev) => {
        const idx = themes.indexOf(prev);
        return themes[(idx + 1) % themes.length];
      });
    }, 1500); // 1.5s gives time to admire the gorgeous transitions
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="w-full h-full flex flex-col rounded-[2rem] overflow-hidden relative z-10"
      animate={{
        borderWidth: t.mStrokeWidth === 4 ? 4 : 1,
        borderColor: t.cardBorder,
        boxShadow: t.cardShadow,
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ borderStyle: 'solid' }}
      translate="no"
    >
      {/* SKY BACKGROUND */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ background: `linear-gradient(to bottom, ${t.skyTop}, ${t.skyBottom})` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* STARS (Spatial Only) */}
      <AnimatePresence>
        {activeTheme === 'spatial' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <div className="absolute top-[10%] left-[20%] w-1.5 h-1.5 bg-white rounded-full opacity-60" />
            <div className="absolute top-[30%] left-[80%] w-2 h-2 bg-white rounded-full opacity-80 shadow-[0_0_5px_#fff]" />
            <div className="absolute top-[15%] left-[50%] w-1 h-1 bg-white rounded-full opacity-40" />
            <div className="absolute top-[40%] left-[10%] w-1.5 h-1.5 bg-white rounded-full opacity-70" />
            <div className="absolute top-[25%] left-[90%] w-2 h-2 bg-white rounded-full opacity-90 shadow-[0_0_8px_#fff]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER: Controls & Presets */}
      <div className="w-full flex justify-between items-center shrink-0 z-20 relative p-5 md:p-8">
        <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-bold">
          [ SCENERY PREVIEW ]
        </span>
        <div className="flex items-center gap-1.5">
          {(['noir', 'spatial', 'cyber', 'brutalist'] as ThemeType[]).map((themeKey) => {
            const isSelected = activeTheme === themeKey;
            return (
              <button
                key={themeKey}
                onClick={() => setActiveTheme(themeKey)}
                onMouseEnter={() => setActiveTheme(themeKey)}
                className="py-1 px-1 flex items-center justify-center cursor-pointer focus:outline-none"
                title={`Switch to ${themeKey}`}
              >
                <div
                  className="h-1.5 rounded-full transition-all duration-[400ms] ease-out"
                  style={{
                    width: isSelected ? '24px' : '6px',
                    backgroundColor: isSelected ? THEME_DATA[themeKey].indicator : 'rgba(255, 255, 255, 0.25)'
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* SUN / MOON */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 rounded-full z-10"
        animate={{
          top: t.sunY,
          width: 180 * t.sunScale,
          height: 180 * t.sunScale,
          backgroundColor: t.sunColor,
          borderColor: t.sunBorder,
          borderWidth: t.sunBorderWidth,
          boxShadow: t.sunGlow
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 70 }}
      />

      {/* MOUNTAINS */}
      <svg viewBox="0 0 800 400" className="absolute bottom-[20%] w-full h-[60%] z-20 pointer-events-none" preserveAspectRatio="none">
        <motion.path
          d="M -100,250 C 100,150 250,50 400,130 C 550,210 650,100 900,150 L 900,400 L -100,400 Z"
          animate={{ fill: t.m1Fill, stroke: t.mStroke, strokeWidth: t.mStrokeWidth }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        <motion.path
          d="M -100,300 C 150,250 250,300 400,230 C 550,160 700,250 900,200 L 900,400 L -100,400 Z"
          animate={{ fill: t.m2Fill, stroke: t.mStroke, strokeWidth: t.mStrokeWidth }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        <motion.path
          d="M -100,350 C 100,400 300,300 500,340 C 700,380 800,330 900,370 L 900,400 L -100,400 Z"
          animate={{ fill: t.m3Fill, stroke: t.mStroke, strokeWidth: t.mStrokeWidth }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </svg>

      {/* FOREGROUND GROUND */}
      <motion.div
        className="absolute bottom-0 w-full h-[20%] z-30 border-t"
        animate={{
          backgroundColor: t.groundFill,
          borderColor: t.mStroke,
          borderTopWidth: t.mStrokeWidth ? t.mStrokeWidth : 0
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* SYNTHWAVE 3D GRID */}
        <div className="absolute inset-0 overflow-hidden" style={{ perspective: '300px' }}>
          <motion.div
            className="absolute inset-0 -bottom-[150%] w-[200%] -left-[50%]"
            style={{ transform: 'rotateX(75deg)', transformOrigin: 'top center' }}
            animate={{
              backgroundImage: `linear-gradient(${t.gridColor} 2px, transparent 2px), linear-gradient(90deg, ${t.gridColor} 2px, transparent 2px)`,
              backgroundSize: '40px 40px',
              opacity: t.gridColor === 'rgba(0,0,0,0)' ? 0 : 1
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* NOISE OVERLAY FOR PREMIUM FILM GRAIN */}
      <svg className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.15] z-50 w-full h-full">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </motion.div>
  );
}
