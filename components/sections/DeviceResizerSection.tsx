"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// ARTISTIC CONCEPT: THE LIQUID CANVAS (DIMENSIONAL SHIFTER)
// High-end cinematic exterior wrapping the meticulously crafted simulated portfolio.
// ============================================================================

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PenpotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M22 4.5L37.5 12.25V31.75L22 39.5L6.5 31.75V12.25L22 4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 39.5V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M37.5 12.25L22 22L6.5 12.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 12V6M22 15V4M30 12V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function DeviceResizerSection() {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <section className="relative min-h-[130vh] w-full bg-[#020202] text-white overflow-hidden pt-12 pb-32 sm:pt-16 md:pt-20 flex flex-col items-center justify-center font-sans">

      {/* ================= BACKGROUND ART ================= */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div
          layout
          className="absolute rounded-full blur-[120px] opacity-20"
          animate={{
            width: previewMode === 'desktop' ? '80vw' : '40vw',
            height: previewMode === 'desktop' ? '40vw' : '80vw',
            backgroundColor: previewMode === 'desktop' ? '#ff9e00' : '#3b82f6',
          }}
          transition={{ duration: 1.5, ease: EASE }}
        />

        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] mix-blend-overlay">
          <AnimatePresence mode="wait">
            <motion.h1
              key={previewMode}
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
              transition={{ duration: 1 }}
              className="text-[20vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap"
            >
              {previewMode}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col items-center">

        {/* ================= POETIC HEADER ================= */}
        <div
          className="text-center mb-16 space-y-6"
        >
          <span className="font-mono text-[#ff9e00] text-[10px] tracking-[0.5em] uppercase block border-b border-[#ff9e00]/30 pb-4 inline-block">
            [ DIMENSIONAL FLUIDITY ]
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight">
            Liquid <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/50 to-white/10">Architecture</span>
          </h2>
          <p className="text-white/40 font-mono text-[9px] md:text-xs tracking-[0.2em] max-w-lg mx-auto uppercase leading-relaxed">
            The interface bends to the vessel. Complete responsive precision without breaking the artistic narrative.
          </p>
        </div>

        {/* ================= THE CONTROLLER ================= */}
        <div
          className="flex gap-4 mb-20 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`relative px-8 py-3 rounded-full transition-colors duration-500 z-10 ${previewMode === 'desktop' ? 'text-black' : 'text-white/40 hover:text-white/80'}`}
          >
            <span className="relative z-20 font-mono text-[10px] uppercase tracking-widest font-bold">Desktop Layout</span>
            {previewMode === 'desktop' && (
              <motion.div layoutId="pill-active" className="absolute inset-0 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10" />
            )}
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`relative px-8 py-3 rounded-full transition-colors duration-500 z-10 ${previewMode === 'mobile' ? 'text-black' : 'text-white/40 hover:text-white/80'}`}
          >
            <span className="relative z-20 font-mono text-[10px] uppercase tracking-widest font-bold">Mobile View</span>
            {previewMode === 'mobile' && (
              <motion.div layoutId="pill-active" className="absolute inset-0 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10" />
            )}
          </button>
        </div>

        {/* ================= THE LIVING CANVAS (MOCKUP) ================= */}
        <div className="relative w-full flex justify-center items-center min-h-[600px] perspective-[2000px]">

          {/* The Morphing Container */}
          <motion.div
            layout
            className={`bg-white shadow-[0_0_80px_rgba(0,0,0,0.4)] overflow-hidden relative flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${previewMode === 'desktop'
                ? 'w-full max-w-[960px] h-[480px] md:h-[640px] rounded-xl md:rounded-2xl'
                : 'w-[315px] h-[600px] rounded-[3rem] border-[12px] border-neutral-900'
              }`}
          >
            {/* Browser Header / Notch bar */}
            <div className="shrink-0 z-20">
              {previewMode === 'desktop' ? (
                <div className="h-12 flex items-center px-4 gap-3 bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  </div>
                  <div className="mx-auto px-6 py-1.5 bg-white text-[10px] font-mono text-slate-400 rounded-md flex items-center gap-2 font-bold shadow-sm border border-slate-200/50 truncate max-w-[250px]">
                    <i className="fas fa-lock text-[8px]"></i>portfo.be/jamal
                  </div>
                </div>
              ) : (
                <div className="absolute top-0 left-0 h-7 bg-transparent flex justify-center w-full z-50 pointer-events-none">
                  <div className="w-24 h-5.5 bg-slate-900 rounded-b-2xl"></div>
                </div>
              )}
            </div>

            {/* SIMULATED MINIMALIST THEME PAGE WRAPPER FOR MOBILE SCALING */}
            <div className="flex-1 relative overflow-hidden w-full bg-white">
              <div
                className={`absolute top-0 left-0 origin-top-left w-[125%] h-[125%] scale-[0.8] md:w-full md:h-full md:scale-100 bg-white text-black text-xs flex simulated-theme ${
                  previewMode === 'desktop' ? 'flex-row overflow-hidden' : 'flex-col overflow-y-auto custom-scrollbar'
                  }`}
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
              <style dangerouslySetInnerHTML={{
                __html: `
                  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
                  .simulated-theme *:not(i):not(.fa):not(.fas):not(.far):not(.fab) {
                    font-family: 'Space Mono', monospace !important;
                  }
                  .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
                  }
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.15);
                    border-radius: 99px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.35);
                  }
                `}} />

              {/* --- SIDEBAR SECTION (Kiri Desktop, Atas Mobile) --- */}
              <div className={`
                  bg-gray-50 border-gray-200 flex flex-col justify-between shrink-0
                  ${previewMode === 'desktop'
                  ? 'w-[35%] border-r h-full overflow-y-auto custom-scrollbar p-3 md:p-6'
                  : 'w-full border-b pt-9 p-4 sm:p-6'}
                `}>
                <div>
                  {/* Name Header & Availability Status */}
                  <div className="flex justify-between items-start mb-6">
                    <h1 className="font-bold text-sm leading-none tracking-tight">
                      JAMAL<br />ARIFIN
                    </h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-[7px] font-bold uppercase tracking-widest text-gray-500">Available</span>
                    </div>
                  </div>

                  {/* Grayscale Profile Avatar (Square, Full Width) */}
                  <div className="w-full aspect-square mb-6 overflow-hidden border border-gray-200 rounded-none relative group">
                    <img
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      alt="avatar"
                    />
                  </div>

                  {/* Profession & Bio */}
                  <div className={previewMode === 'desktop' ? 'text-left' : 'text-center'}>
                    <h2 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Director & Editor
                    </h2>
                    <p className="text-gray-600 text-[9px] sm:text-[10px] leading-relaxed mb-4">
                      A visual storyteller based in Jakarta. I craft meticulous, high-end visual narratives for commercial brands.
                    </p>

                    <ul className="text-[8px] text-gray-500 space-y-1 opacity-80 list-none pl-0">
                      <li>→ Minimalist Layout</li>
                      <li>→ Clean Typography</li>
                      <li>→ High-end Visuals</li>
                    </ul>
                  </div>
                </div>

                {/* Links / Contact Info & Socials (Static & non-clickable for preview) */}
                <div className="pt-6 border-t border-gray-200 mt-6 text-left pointer-events-none select-none">
                  <div className="block text-xs font-bold tracking-tight mb-3 text-black">
                    hello@jamal.co
                  </div>
                  <div className="flex flex-wrap gap-3 text-[8px] font-bold uppercase tracking-wider text-gray-400">
                    <span>Instagram</span>
                    <span>Behance</span>
                    <span>Vimeo</span>
                    <span>YouTube</span>
                  </div>
                </div>
              </div>

              {/* --- MAIN CONTENT SECTION (Kanan Desktop, Bawah Mobile) --- */}
              <div className={`bg-white flex-1 ${
                previewMode === 'desktop' 
                  ? 'h-full overflow-y-auto custom-scrollbar p-3 md:p-6 pb-12 md:pb-16' 
                  : 'p-4 sm:p-6 pb-16'
                }`}>

                {/* Stats Counter Section */}
                <div className="grid grid-cols-2 border-b border-gray-200 pb-3 mb-6">
                  <div>
                    <p className="text-[7px] font-bold uppercase text-gray-400 mb-0.5">Projects</p>
                    <p className="text-xs font-bold">8 Total</p>
                  </div>
                  <div className="border-l border-gray-200 pl-3">
                    <p className="text-[7px] font-bold uppercase text-gray-400 mb-0.5">Recognition</p>
                    <p className="text-xs font-bold">3 Awards</p>
                  </div>
                </div>

                {/* Projects Index Header */}
                <div className="flex justify-between items-end mb-4 pb-2 border-b border-gray-100">
                  <h3 className="text-[10px] uppercase font-bold">Selected Index</h3>
                  <span className="text-[7px] text-gray-400">Archive</span>
                </div>

                {/* Projects Grid (Video & Photo types) */}
                <div className={`
                    grid mb-8
                    ${previewMode === 'mobile' ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-3 md:gap-4'}
                  `}>

                  {/* Project 1: Video type */}
                  <div className="group">
                    <div className="aspect-[4/3] w-full overflow-hidden relative bg-white border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] rounded-none">
                      <img
                        src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=200&auto=format&fit=crop"
                        className="w-full h-full object-cover grayscale"
                        alt="work"
                      />
                      {/* Play Button Icon for Video */}
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white border border-black text-black flex items-center justify-center rounded-none shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                          <i className="fas fa-play text-[8px] ml-0.5"></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start mt-3">
                      <div>
                        <h4 className="text-[9px] font-bold">Commercial Film</h4>
                        <p className="text-[7px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">Video</p>
                      </div>
                      <span className="text-[7px] text-gray-400">01</span>
                    </div>
                  </div>

                  {/* Project 2: Photo type */}
                  <div className="group">
                    <div className="aspect-[4/3] w-full overflow-hidden relative bg-white border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] rounded-none">
                      <img
                        src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=200&auto=format&fit=crop"
                        className="w-full h-full object-cover grayscale"
                        alt="work"
                      />
                      {/* Arrow Icon for Photo */}
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white border border-black text-black flex items-center justify-center rounded-none shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                          <i className="fas fa-arrow-right -rotate-45 text-[8px]"></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start mt-3">
                      <div>
                        <h4 className="text-[9px] font-bold">Architectural Series</h4>
                        <p className="text-[7px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">Photo</p>
                      </div>
                      <span className="text-[7px] text-gray-400">02</span>
                    </div>
                  </div>

                </div>

                {/* Explore Archive Button */}
                <div className="flex justify-center mb-12">
                  <div className="inline-flex items-center gap-3 border border-gray-200 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">EXPLORE ARCHIVE</span>
                    <div className="w-6 h-6 border border-gray-200 flex items-center justify-center bg-white">
                      <i className="fas fa-arrow-right text-[8px] text-gray-400"></i>
                    </div>
                  </div>
                </div>

                {/* --- 3D SHOWCASE SECTION --- */}
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <div className="flex justify-between items-baseline mb-4">
                    <div>
                      <h3 className="text-[10px] uppercase font-bold">3D Showcase</h3>
                      <p className="text-[6px] text-gray-400 uppercase tracking-widest mt-0.5">Interactive Models</p>
                    </div>
                    <span className="text-[7px] font-mono text-gray-400 uppercase"><i className="fas fa-cube mr-1"></i> 1 Model</span>
                  </div>

                  {/* Simulated 3D Viewer box */}
                  <div className="w-full aspect-[16/9] bg-zinc-50 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex flex-col justify-between p-3 relative overflow-hidden">
                    {/* 3D Static Render Image */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src="/minimalist_chair_3d.png"
                        className="w-full h-full object-cover grayscale opacity-95"
                        alt="3D Industrial Chair Render"
                      />
                    </div>

                    {/* Grid background for 3D simulation */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:10px_10px] opacity-30 z-10 pointer-events-none"></div>

                    <div className="flex justify-between z-20">
                      <span className="text-[7px] font-bold bg-black text-white px-1.5 py-0.5">Interactive</span>
                      <div className="flex gap-1">
                        <span className="w-4 h-4 bg-white border border-black flex items-center justify-center text-[8px]"><i className="fas fa-search-plus"></i></span>
                        <span className="w-4 h-4 bg-white border border-black flex items-center justify-center text-[8px]"><i className="fas fa-sync"></i></span>
                      </div>
                    </div>

                    {/* Spacer/Empty container for centering */}
                    <div className="flex-1 z-20"></div>

                    <div className="flex justify-between items-end z-20">
                      <span className="text-[6px] text-gray-400 font-bold uppercase">[ Drag to Orbit ]</span>
                      <span className="text-[6px] text-gray-500 font-bold">Scale: 1.0</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mt-3">
                    <div>
                      <h4 className="text-[9px] font-bold">Industrial Chair Concept</h4>
                      <p className="text-[7px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">3D Model</p>
                    </div>
                  </div>
                </div>

                {/* --- PENPOT SHOWCASE SECTION --- */}
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-[10px] uppercase font-bold">Design Index</h3>
                    <div className="flex items-center gap-1.5 text-[7px] font-bold text-gray-400">
                      <PenpotIcon className="w-3.5 h-3.5 text-black" />
                      <span>Penpot</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 border-2 border-black bg-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                      <div className="w-8 h-8 shrink-0 bg-emerald-50 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <PenpotIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[9px] font-bold uppercase truncate">Mobile UI Dashboard</h4>
                        <span className="text-[7px] text-gray-500">View on Penpot</span>
                      </div>
                      <i className="fas fa-arrow-right -rotate-45 text-[8px] text-gray-400"></i>
                    </div>
                  </div>
                </div>

                {/* --- CANVA SHOWCASE SECTION --- */}
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <div className="flex justify-between items-baseline mb-6 pb-2 border-b border-gray-100">
                    <h3 className="text-[10px] uppercase font-bold">Canva Showcase</h3>
                    <span className="text-[7px] font-bold uppercase tracking-widest text-gray-400">Canva</span>
                  </div>

                  <div>
                    <h4 className="text-[9px] font-bold mb-3 flex items-center gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Logo Portfo.be
                    </h4>

                    <div className="w-full aspect-video bg-[#18191b] border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] rounded-none flex items-center justify-center p-4 relative overflow-hidden">
                      {/* Slide center logo */}
                      <div className="w-3/5 h-auto flex items-center justify-center">
                        <img
                          src="/portfo.be.png"
                          className="max-h-full max-w-full object-contain invert brightness-200"
                          alt="Portfo.be Logo Slide"
                        />
                      </div>

                      {/* Mock Canva interactive button overlay */}
                      <div className="absolute bottom-2 right-2 z-10 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[6px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <i className="fas fa-external-link-alt text-[5px]"></i> Use Template
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- GITHUB STATS SECTION --- */}
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-[10px] uppercase font-bold">Open Source</h3>
                    <span className="text-[7px] font-bold text-gray-400">GitHub</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-4">
                    {/* Top Repo */}
                    <div className="p-3 border-2 border-black bg-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <i className="fab fa-github text-[10px]"></i>
                        <h4 className="text-[9px] font-bold">portfobe-app</h4>
                      </div>
                      <p className="text-[8px] text-gray-500 mb-2">Automated premium developer portfolio builder engine.</p>
                      <div className="flex items-center gap-3 text-[7px] font-bold text-gray-400">
                        <span><i className="fas fa-star text-[7px]"></i> 12</span>
                        <span><i className="fas fa-code-branch text-[7px]"></i> 4</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> TypeScript</span>
                      </div>
                    </div>
                  </div>

                  {/* Language Segmented Bar */}
                  <div className="mb-4">
                    <p className="text-[7px] font-bold text-gray-400 uppercase mb-1">Top Languages</p>
                    <div className="w-full h-2 flex bg-gray-100 mb-2">
                      <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
                      <div className="h-full bg-yellow-500" style={{ width: '20%' }}></div>
                      <div className="h-full bg-red-500" style={{ width: '15%' }}></div>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[7px] font-bold text-gray-500">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-500"></span> TypeScript 65%</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-yellow-500"></span> JavaScript 20%</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500"></span> HTML/CSS 15%</span>
                    </div>
                  </div>

                  {/* Mock Git contribution squares calendar */}
                  <div className="mb-4">
                    <p className="text-[7px] font-bold text-gray-400 uppercase mb-1">Activity Grid</p>
                    <div className="grid gap-0.5 p-1 bg-gray-50 border border-gray-200" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
                      {Array.from({ length: 48 }).map((_, i) => {
                        const level = i % 4 === 0 ? 'bg-green-700' : i % 3 === 0 ? 'bg-green-500' : i % 5 === 0 ? 'bg-green-300' : 'bg-gray-200';
                        return <div key={i} className={`aspect-square w-full ${level}`}></div>;
                      })}
                    </div>
                  </div>

                  {/* Mock Github Activity Feed Timeline */}
                  <div>
                    <p className="text-[7px] font-bold text-amber-500 uppercase tracking-widest mb-3">Recent Activity</p>
                    <div className="space-y-3 relative">
                      {/* Vertical line */}
                      <div className="absolute left-[2.5px] top-1 bottom-[-8px] w-[1px] bg-slate-900" />

                      {[
                        { desc: "Made a push to", repo: "iklil12/portfobe-app", time: "7H AGO", highlight: false },
                        { desc: "Made a push to", repo: "iklil12/portfobe-app", time: "1D AGO", highlight: false },
                        { desc: "Made a push to", repo: "iklil12/portfobe-app", time: "1D AGO", highlight: true },
                        { desc: "Made a push to", repo: "iklil12/portfobe-app", time: "2D AGO", highlight: false },
                        { desc: "Made a push to", repo: "iklil12/portfobe-app", time: "3D AGO", highlight: false }
                      ].map((act, idx) => (
                        <div key={idx} className="flex gap-3 items-center relative">
                          {/* Dot */}
                          <div className="relative z-10">
                            <div className={`w-1.5 h-1.5 rounded-full bg-amber-500 transition-all duration-300 ${act.highlight ? 'scale-150 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : ''}`} />
                          </div>
                          {/* Content */}
                          <div className="flex-1 flex justify-between items-center text-[7px] text-gray-500">
                            <p className="font-medium">
                              <span className="opacity-60">{act.desc}</span>{" "}
                              <span className="text-gray-900 font-bold">{act.repo}</span>
                            </p>
                            <span className="text-[6px] font-bold text-gray-400">{act.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* --- HONORS & AWARDS SECTION --- */}
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <h3 className="text-[10px] uppercase font-bold mb-4">Honors & Awards</h3>
                  <div className="border-t border-gray-200">
                    {/* Award Row 1 */}
                    <div className="py-2.5 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-3 w-2/3">
                        <span className="text-[8px] text-gray-400">2026</span>
                        <h4 className="text-[9px] font-bold truncate">Best Cinematography</h4>
                      </div>
                      <div className="flex items-center justify-end gap-2 w-1/3 text-[7px] text-gray-500 font-bold">
                        <span className="truncate">JFF</span>
                        <i className="fas fa-chevron-down"></i>
                      </div>
                    </div>

                    {/* Award Row 2 */}
                    <div className="py-2.5 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-3 w-2/3">
                        <span className="text-[8px] text-gray-400">2025</span>
                        <h4 className="text-[9px] font-bold truncate">Commercial of the Year</h4>
                      </div>
                      <div className="flex items-center justify-end gap-2 w-1/3 text-[7px] text-gray-500 font-bold">
                        <span className="truncate">IAA</span>
                        <i className="fas fa-chevron-down"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- TESTIMONIALS SECTION --- */}
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <h3 className="text-[10px] uppercase font-bold mb-6">Testimonials</h3>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Simulated Testimonial Card */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left">
                      <div className="flex items-center gap-3 mb-3">
                        {/* Circle Avatar (First Letter) */}
                        <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center font-bold text-[10px] text-black">
                          S
                        </div>
                        <div>
                          <h4 className="font-bold text-[9px] text-black leading-tight">Sarah Chen</h4>
                          <p className="text-[7px] text-gray-500 leading-none mt-0.5">Creative Director, Velo</p>
                        </div>
                      </div>

                      {/* Star Ratings */}
                      <div className="flex gap-0.5 mb-2.5 text-amber-400 text-[8px]">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>

                      <p className="text-[9px] text-gray-600 italic leading-relaxed">
                        "Jamal's attention to detail is exceptional. He brought our brand's vision to life with stunning visuals and seamless execution."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-[7px] text-gray-400">
                  <span>© 2026 Jamal. All Rights Reserved.</span>
                  <span className="font-bold text-black uppercase">portfo.be/jamal</span>
                </div>

              </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
