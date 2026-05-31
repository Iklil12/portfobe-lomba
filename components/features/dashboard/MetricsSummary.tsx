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
      setCount(Math.round(easeOut * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}

interface MetricsSummaryProps {
  analytics: any;
  strength: number;
  breakdown?: { id: string; label: string; done: boolean; weight: number }[];
  userPlan?: string;
  isLoading: boolean;
}

export function MetricsSummary({ analytics, strength, breakdown = [], userPlan = 'FREE', isLoading }: MetricsSummaryProps) {
  const [animatedStrength, setAnimatedStrength] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isMounted) {
      const timer = setTimeout(() => {
        setAnimatedStrength(strength);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [strength, isLoading, isMounted]);

  if (isLoading) {
    return (
      <div className="h-40 md:h-48 bg-white border border-slate-100 rounded-[2rem] shimmer"></div>
    );
  }

  return (
    <AnimateOnScroll delay={0} className="h-full">
      <div className="h-full bg-white border border-slate-200/60 p-5 md:p-7 rounded-[2rem] transition-all group overflow-hidden relative cursor-help shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:border-slate-350 hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:-translate-y-0.5">

        {/* Main Content */}
        <div className="flex items-center justify-between gap-4 h-full relative z-10 transition-all duration-300 group-hover:opacity-0 group-hover:scale-95">
          <div className="flex flex-col justify-between h-full py-1">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                Portfolio Strength
              </p>
              <h4 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
                {strength === 100 ? 'Portofolio Sempurna!' : 'Lengkapi Profil Anda'}
              </h4>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                {strength === 100
                  ? 'Semua aspek profil terisi secara maksimal.'
                  : 'Tingkatkan kekuatan profil untuk visibilitas optimal.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                {strength === 100 ? 'Siap Bersaing' : 'Perlu Diisi'}
              </span>
            </div>
          </div>

          {/* SVG Circular Progress Gauge */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <defs>
                <linearGradient id="strengthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="none" />
              <circle
                cx="50" cy="50" r="40"
                stroke="url(#strengthGradient)" strokeWidth="8" fill="none"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 * (1 - animatedStrength / 100)}
                strokeLinecap="round"
                className="transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight">
                <AnimatedCounter value={strength} duration={1500} />%
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                Kekuatan
              </span>
            </div>
          </div>
        </div>

        {/* Premium Hover Breakdown Overlay */}
        <div className="absolute inset-0 bg-white/95 p-4 md:p-5 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 transition-all duration-200 z-20 flex flex-col justify-center rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2 shrink-0">
            <i className="fas fa-bullseye text-indigo-600"></i> Kelengkapan Profil
          </h4>
          <div className="space-y-1.5 md:space-y-2 overflow-y-auto pr-1 pb-1" style={{ scrollbarWidth: 'none' }}>
            {breakdown.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between group/item translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center gap-2 md:gap-2.5">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${item.done ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    <i className={`fas ${item.done ? 'fa-check' : 'fa-minus'} text-[8px]`}></i>
                  </div>
                  <span className={`text-[11px] md:text-xs font-medium transition-colors ${item.done ? 'text-slate-900' : 'text-slate-450'}`}>
                    {item.label}
                  </span>
                </div>
                <span className={`text-[8px] font-mono font-bold px-2 py-0.5 border rounded-full ${item.done ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100/50' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                  +{item.weight}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AnimateOnScroll>
  );
}
