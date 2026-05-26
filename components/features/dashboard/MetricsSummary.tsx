"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
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
  const [isMounted, setIsMounted] = useState(false);
  const [animatedStrength, setAnimatedStrength] = useState(0);
  
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 mb-12">
        <div className="h-40 md:h-48 bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] shimmer"></div>
        <div className="h-40 md:h-48 bg-[#0a0a0a] rounded-[2rem] md:rounded-[2.5rem] shimmer"></div>
        <div className="col-span-2 md:col-span-1 h-40 md:h-48 bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] shimmer"></div>
      </div>
    );
  }

  // Data Processing — membaca dari /api/analytics/stats response shape
  // API returns: { stats: { totalViews, uniqueVisitors, avgTime, bounceRate }, chartData: [...], sources: [...] }
  const totalViews = analytics?.stats?.totalViews ?? analytics?.summary?.totalViews ?? 0;
  const chartData: any[] = analytics?.chartData ?? analytics?.dailyStats ?? [];
  const todayViews = chartData[chartData.length - 1]?.views ?? 0;
  const yesterdayViews = chartData[chartData.length - 2]?.views ?? 0;

  // Calculate change %
  const change = yesterdayViews === 0 ? 0 : Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100);

  // Last 7 days for Sparkline
  const sparkData = chartData.slice(-7).map((d: any) => ({ views: d.views ?? 0 }));

  // Dynamic message for strength
  const getStrengthMessage = (score: number) => {
    if (score < 30) return "Lengkapi profil Anda!";
    if (score < 60) return "Hampir siap dipublikasi!";
    if (score < 90) return "Sangat bagus, dikit lagi!";
    return "Portofolio Sempurna!";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 mb-12">
      
      {/* CARD 1: TOTAL VIEWS */}
      <AnimateOnScroll delay={0} className="h-full">
      <div className="h-full bg-white border border-slate-100 p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
        <div className="flex flex-col h-full justify-between relative z-10">
            <div>
                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> 
                    Total Kunjungan
                </p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">
                    <AnimatedCounter value={totalViews} />
                  </h3>
                  <div className="hidden lg:flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <i className="fas fa-arrow-trend-up"></i> +12%
                  </div>
                </div>
            </div>
            
            {userPlan !== 'FREE' ? (
            <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
               <div>
                  <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Desktop</p>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full transition-all duration-1000" style={{ width: `${analytics?.stats?.devices?.desktop || 0}%` }}></div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 mt-1">{analytics?.stats?.devices?.desktop || 0}%</p>
               </div>
               <div>
                  <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Mobile</p>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${analytics?.stats?.devices?.mobile || 0}%` }}></div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 mt-1">{analytics?.stats?.devices?.mobile || 0}%</p>
               </div>
            </div>
            ) : (
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <i className="fas fa-lock text-[7px] text-slate-400"></i>
              </div>
              <p className="text-[9px] font-bold text-slate-400">Upgrade <span className="text-slate-600">PRO</span> untuk data perangkat</p>
            </div>
            )}
        </div>
      </div>
      </AnimateOnScroll>

      {/* CARD 2: TODAY'S TRAFFIC */}
      <AnimateOnScroll delay={80} className="h-full">
      <div className="h-full bg-[#0a0a0a] p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
        <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex justify-between items-start">
              <div>
                  <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-1.5 flex items-center gap-2">
                      Hari Ini
                      <span className="flex items-center justify-center w-3 h-3 rounded-full bg-white/10">
                         <span className="w-1.5 h-1.5 rounded-full bg-[#ff9e00] animate-ping"></span>
                      </span>
                  </p>
                  <div className="flex items-baseline gap-2 md:gap-3">
                      <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter">
                        <AnimatedCounter value={todayViews} duration={1200} />
                      </h3>
                      {change !== 0 && (
                          <span className={`text-[9px] md:text-[11px] font-black ${change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                             {change > 0 ? '+' : ''}<AnimatedCounter value={change} duration={1200} />%
                          </span>
                      )}
                  </div>
              </div>
              <div className="w-16 h-8 opacity-70">
                 {isMounted && (
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparkData}>
                         <Line type="monotone" dataKey="views" stroke="#ff9e00" strokeWidth={2} dot={false} isAnimationActive={true} />
                      </LineChart>
                   </ResponsiveContainer>
                 )}
              </div>
            </div>

            {userPlan !== 'FREE' ? (
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between gap-2">
               <div>
                  <p className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest mb-0.5">Avg. Time</p>
                  <p className="text-xs font-bold text-white">{analytics?.todayStats?.avgTime || '0s'}</p>
               </div>
               <div className="text-right">
                  <p className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest mb-0.5">Bounce Rate</p>
                  <p className="text-xs font-bold text-white">{analytics?.todayStats?.bounceRate || '0%'}</p>
               </div>
            </div>
            ) : (
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <i className="fas fa-lock text-[7px] text-slate-500"></i>
              </div>
              <p className="text-[9px] font-bold text-slate-500">Upgrade <span className="text-slate-300">PRO</span> untuk analitik lengkap</p>
            </div>
            )}
        </div>
      </div>
      </AnimateOnScroll>

      {/* CARD 3: PORTFOLIO STRENGTH */}
      <AnimateOnScroll delay={160} className="col-span-2 md:col-span-1">
      <div className="h-full bg-white border border-slate-100 p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group overflow-hidden relative cursor-help">
        
        {/* Main Content */}
        <div className="flex items-center justify-between gap-4 h-full relative z-10 transition-all duration-300 group-hover:blur-[4px] group-hover:scale-[0.95] group-hover:opacity-0">
            <div className="flex flex-col justify-between h-full py-1">
                <div>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Portfolio Strength
                    </p>
                    <h4 className="text-sm md:text-base font-black text-slate-900 tracking-tight leading-tight mt-2">
                        {strength === 100 ? 'Portofolio Sempurna!' : 'Lengkapi Profil Anda'}
                    </h4>
                    <p className="text-[9px] md:text-[10px] font-medium text-slate-400 mt-1.5 leading-snug">
                        {strength === 100 
                          ? 'Semua aspek profil terisi secara maksimal.' 
                          : 'Tingkatkan kekuatan profil untuk visibilitas optimal.'}
                    </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${strength === 100 ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500 animate-pulse'}`}></span>
                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                        {strength === 100 ? 'Siap Bersaing' : 'Perlu Diisi'}
                    </span>
                </div>
            </div>
            
            {/* SVG Circular Progress Gauge */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <defs>
                        <linearGradient id="strengthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                    </defs>
                    {/* Track Circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#f8fafc"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="url(#strengthGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 * (1 - animatedStrength / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base md:text-lg font-black text-slate-900 tracking-tighter">
                        <AnimatedCounter value={strength} duration={1500} />%
                    </span>
                    <span className="text-[7px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                        Kekuatan
                    </span>
                </div>
            </div>
        </div>

        {/* Premium Hover Breakdown Overlay */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md p-4 md:p-5 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 transition-all duration-300 z-20 flex flex-col justify-center rounded-[2rem] md:rounded-[2.5rem] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
            <h4 className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-slate-800 mb-2.5 md:mb-3 flex items-center gap-2 shrink-0">
              <i className="fas fa-bullseye text-indigo-500"></i> Kelengkapan Profil
            </h4>
            <div className="space-y-1.5 md:space-y-2 overflow-y-auto pr-1 pb-1" style={{ scrollbarWidth: 'none' }}>
              {breakdown.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between group/item translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <div className="flex items-center gap-2 md:gap-2.5">
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center transition-colors ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                      <i className={`fas ${item.done ? 'fa-check' : 'fa-minus'} text-[8px] md:text-[9px]`}></i>
                    </div>
                    <span className={`text-[10px] md:text-xs font-bold transition-colors ${item.done ? 'text-slate-700' : 'text-slate-400'}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className={`text-[9px] font-black px-1.5 md:px-2 py-0.5 rounded-md transition-colors ${item.done ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                    +{item.weight}%
                  </span>
                </div>
              ))}
            </div>
        </div>

      </div>
      </AnimateOnScroll>

    </div>
  );
}
