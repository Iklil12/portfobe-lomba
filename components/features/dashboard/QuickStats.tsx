"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';

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

interface QuickStatsProps {
  stats: any;
  analytics: any;
  isLoadingStats: boolean;
  isLoadingAnalytics: boolean;
  userPlan?: string;
  strength: number;
  strengthBreakdown: { id: string; label: string; done: boolean; weight: number }[];
}

export function QuickStats({ stats, analytics, isLoadingStats, isLoadingAnalytics, userPlan = 'FREE', strength, strengthBreakdown }: QuickStatsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [animatedStrength, setAnimatedStrength] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoadingStats && isMounted) {
      const timer = setTimeout(() => setAnimatedStrength(strength), 100);
      return () => clearTimeout(timer);
    }
  }, [strength, isLoadingStats, isMounted]);

  if (isLoadingStats || isLoadingAnalytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="h-36 bg-white border border-slate-200/60 rounded-[2rem] shimmer"></div>
          <div className="h-36 bg-white border border-slate-200/60 rounded-[2rem] shimmer"></div>
          <div className="col-span-2 h-28 bg-white border border-slate-200/60 rounded-[2rem] shimmer"></div>
        </div>
        <div className="h-full min-h-[280px] bg-white border border-slate-200/60 rounded-[2rem] shimmer"></div>
      </div>
    );
  }

  const totalViews = analytics?.stats?.totalViews ?? analytics?.summary?.totalViews ?? 0;
  const chartData: any[] = analytics?.chartData ?? analytics?.dailyStats ?? [];
  const todayViews = chartData[chartData.length - 1]?.views ?? 0;
  const yesterdayViews = chartData[chartData.length - 2]?.views ?? 0;
  const change = yesterdayViews === 0 ? 0 : Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100);
  const sparkData = chartData.slice(-7).map((d: any) => ({ views: d.views ?? 0 }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

      {/* LEFT 2 COLUMNS: Stats + Portfolio Strength */}
      <div className="md:col-span-2 grid grid-cols-2 gap-4 md:gap-5">

        {/* Total Kunjungan */}
        <AnimateOnScroll delay={0} className="h-full">
          <div className="h-full bg-white border border-slate-200/60 p-5 rounded-[2rem] transition-all hover:border-slate-350 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#ff9e00] rounded-full animate-pulse shadow-[0_0_8px_#ff9e00]"></span>
              Total Kunjungan
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                <AnimatedCounter value={totalViews} />
              </h3>
              <div className="flex items-center gap-1 text-[9px] font-bold text-[#ff9e00] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                <i className="fas fa-arrow-trend-up"></i> +12%
              </div>
            </div>
            {userPlan !== 'FREE' ? (
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Desktop</p>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ff9e00] to-amber-400 rounded-full transition-all duration-1000" style={{ width: `${analytics?.stats?.devices?.desktop || 0}%` }}></div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-900 mt-1">{analytics?.stats?.devices?.desktop || 0}%</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Mobile</p>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-1000" style={{ width: `${analytics?.stats?.devices?.mobile || 0}%` }}></div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-900 mt-1">{analytics?.stats?.devices?.mobile || 0}%</p>
                </div>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                  <i className="fas fa-lock text-[8px] text-slate-400"></i>
                </div>
                <p className="text-[9px] font-medium text-slate-500">Upgrade <span className="text-[#ff9e00] font-bold">PRO</span></p>
              </div>
            )}
          </div>
        </AnimateOnScroll>

        {/* Hari Ini */}
        <AnimateOnScroll delay={80} className="h-full">
          <div className="h-full bg-slate-900 border border-slate-800 p-5 rounded-[2rem] transition-all hover:border-slate-700 hover:shadow-[0_8px_30px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 shadow-[0_8px_30px_rgba(15,23,42,0.1)]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  Hari Ini
                  <span className="w-1.5 h-1.5 bg-[#ff9e00] rounded-full animate-pulse shadow-[0_0_8px_#ff9e00]"></span>
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    <AnimatedCounter value={todayViews} duration={1200} />
                  </h3>
                  {change !== 0 && (
                    <span className={`text-[9px] font-bold ${change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {change > 0 ? '+' : ''}<AnimatedCounter value={change} duration={1200} />%
                    </span>
                  )}
                </div>
              </div>
              <div className="w-14 h-7 opacity-95">
                {isMounted && sparkData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                      <Line type="monotone" dataKey="views" stroke="#ff9e00" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            {userPlan !== 'FREE' ? (
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between gap-2">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Avg. Time</p>
                  <p className="text-xs font-bold text-white">{analytics?.todayStats?.avgTime || '0s'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Bounce Rate</p>
                  <p className="text-xs font-bold text-white">{analytics?.todayStats?.bounceRate || '0%'}</p>
                </div>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-slate-800 bg-slate-800 flex items-center justify-center shrink-0">
                  <i className="fas fa-lock text-[8px] text-slate-400"></i>
                </div>
                <p className="text-[9px] font-medium text-slate-400">Upgrade <span className="text-[#ff9e00] font-bold">PRO</span></p>
              </div>
            )}
          </div>
        </AnimateOnScroll>

        {/* Portfolio Strength - spans both columns below */}
        <AnimateOnScroll delay={160} className="col-span-2 h-full">
          <div className="h-full bg-white border border-slate-200/60 p-5 rounded-[2rem] transition-all group overflow-hidden relative cursor-help shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:border-slate-350 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5">
            <div className="flex items-center justify-between gap-6 h-full relative z-10 transition-all duration-300 group-hover:opacity-0 group-hover:scale-95">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Portfolio Strength</p>
                <h4 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight leading-tight mt-1.5">
                  {strength === 100 ? 'Portofolio Sempurna!' : 'Lengkapi Profil Anda'}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  {strength === 100 ? 'Semua aspek profil terisi secara maksimal.' : 'Tingkatkan kekuatan profil untuk visibilitas optimal.'}
                </p>
              </div>
              {/* Progress bar horizontal */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="w-32 md:w-48">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-pulse shadow-[0_0_8px_rgba(15,23,42,0.3)]"></span>
                      {strength === 100 ? 'Siap Bersaing' : 'Perlu Diisi'}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900"><AnimatedCounter value={strength} duration={1500} />%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff9e00] to-amber-400 rounded-full transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ width: `${animatedStrength}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Breakdown Overlay */}
            <div className="absolute inset-0 bg-white/95 p-4 md:p-5 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 transition-all duration-200 z-20 flex flex-col justify-center rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2 shrink-0">
                <i className="fas fa-bullseye text-[#ff9e00]"></i> Kelengkapan Profil
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 overflow-y-auto pr-1 pb-1" style={{ scrollbarWidth: 'none' }}>
                {strengthBreakdown.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ transitionDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${item.done ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                        <i className={`fas ${item.done ? 'fa-check' : 'fa-minus'} text-[7px]`}></i>
                      </div>
                      <span className={`text-[10px] font-medium ${item.done ? 'text-slate-900' : 'text-slate-450'}`}>{item.label}</span>
                    </div>
                    <span className={`text-[7px] font-mono font-bold px-1.5 py-0.5 border rounded-full ${item.done ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                      +{item.weight}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* RIGHT COLUMN: KARYA & KOLEKSI */}
      <AnimateOnScroll delay={120} className="h-full">
        <div className="h-full bg-white border border-slate-200/60 p-4 md:p-5 rounded-[2rem] transition-all overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:border-slate-350 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5">
          <div className="flex flex-col h-full relative z-10">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 px-1">
              <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-pulse shadow-[0_0_8px_rgba(15,23,42,0.3)]"></span>
              Karya & Koleksi
            </p>
            
            <div className="grid grid-cols-2 gap-2.5 flex-1">
              {/* Proyek */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all duration-300 group/item flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 shadow-sm">
                    <i className="fas fa-folder-open text-[10px] text-slate-700"></i>
                  </div>
                  <span className="text-[7px] font-extrabold text-white bg-slate-900 px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Live</span>
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-black text-slate-900 leading-none block mb-0.5">
                    <AnimatedCounter value={stats?.projects ?? 0} />
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 leading-none">Proyek</span>
                </div>
              </div>

              {/* Sertifikat */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all duration-300 group/item flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 shadow-sm">
                    <i className="fas fa-award text-[10px] text-slate-700"></i>
                  </div>
                  <span className="text-[7px] font-extrabold text-white bg-slate-900 px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Verified</span>
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-black text-slate-900 leading-none block mb-0.5">
                    <AnimatedCounter value={stats?.awards ?? 0} />
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 leading-none">Sertifikat</span>
                </div>
              </div>

              {/* Testimoni */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all duration-300 group/item flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 shadow-sm">
                    <i className="fas fa-comment-dots text-[10px] text-slate-700"></i>
                  </div>
                  <span className="text-[7px] font-extrabold text-white bg-slate-900 px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Social</span>
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-black text-slate-900 leading-none block mb-0.5">
                    <AnimatedCounter value={stats?.testimonials ?? 0} />
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 leading-none">Testimoni</span>
                </div>
              </div>

              {/* Tautan */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all duration-300 group/item flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 shadow-sm">
                    <i className="fas fa-link text-[10px] text-slate-700"></i>
                  </div>
                  <span className="text-[7px] font-extrabold text-white bg-slate-900 px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Aktif</span>
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-black text-slate-900 leading-none block mb-0.5">
                    <AnimatedCounter value={stats?.links ?? 0} />
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 leading-none">Tautan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

    </div>
  );
}
