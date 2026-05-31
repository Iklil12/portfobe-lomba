"use client";

import React, { useState, useEffect } from 'react';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';

// Smooth Counter Component
function AnimatedCounter({ value, duration = 1500 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOut * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}

interface StatsData {
  projects: number;
  awards: number;
  links: number;
  testimonials: number;
  themeName: string;
}

interface StatCardsProps {
  stats: StatsData;
  isLoading: boolean;
}

export function StatCards({ stats, isLoading }: StatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-[2rem] border border-slate-100 h-[104px] md:h-[120px] shimmer"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
      {/* CARD 1: Projects */}
      <AnimateOnScroll delay={0}>
        <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-200/60 hover:border-indigo-500/25 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.012)]">
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Proyek</p>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-650"><i className="fas fa-folder-open text-[10px] md:text-xs"></i></div>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              <AnimatedCounter value={stats.projects} />
            </h3>
            <span className="hidden sm:block px-2.5 py-1 bg-indigo-50 border border-indigo-150 text-indigo-600 rounded-full text-[9px] font-bold uppercase">Live</span>
          </div>
        </div>
      </AnimateOnScroll>

      {/* CARD 2: Awards */}
      <AnimateOnScroll delay={70}>
        <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-200/60 hover:border-cyan-500/25 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.012)]">
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sertifikat</p>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-650"><i className="fas fa-award text-[10px] md:text-xs"></i></div>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              <AnimatedCounter value={stats.awards} duration={1700} />
            </h3>
            <span className="hidden sm:block px-2.5 py-1 bg-cyan-50 border border-cyan-150 text-cyan-600 rounded-full text-[9px] font-bold uppercase">Verified</span>
          </div>
        </div>
      </AnimateOnScroll>

      {/* CARD 3: Testimonials */}
      <AnimateOnScroll delay={140}>
        <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-200/60 hover:border-emerald-500/25 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.012)]">
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Testimoni</p>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-650"><i className="fas fa-comment-dots text-[10px] md:text-xs"></i></div>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              <AnimatedCounter value={stats.testimonials || 0} duration={1800} />
            </h3>
            <span className="hidden sm:block px-2.5 py-1 bg-emerald-50 border border-emerald-150 text-emerald-600 rounded-full text-[9px] font-bold uppercase">Social</span>
          </div>
        </div>
      </AnimateOnScroll>

      {/* CARD 4: Links */}
      <AnimateOnScroll delay={210}>
        <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-200/60 hover:border-violet-500/25 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.012)]">
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              Tautan
            </p>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-650"><i className="fas fa-link text-[10px] md:text-xs"></i></div>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              <AnimatedCounter value={stats.links} duration={1900} />
            </h3>
            <span className="hidden sm:block px-2.5 py-1 bg-violet-50 border border-violet-150 text-violet-600 rounded-full text-[9px] font-bold uppercase">Aktif</span>
          </div>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
