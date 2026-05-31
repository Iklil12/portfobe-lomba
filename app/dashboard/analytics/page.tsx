"use client";

import React, { useState, useEffect } from 'react';
import { showToast } from '@/lib/customToast';
import useSWR from 'swr';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function AnimatedCounter({ value, duration = 1200 }: { value: number | string, duration?: number }) {
  const [count, setCount] = useState(typeof value === 'number' ? 0 : value);
  useEffect(() => {
    if (typeof value !== 'number') { setCount(value); return; }
    let start: number | null = null;
    let raf: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(2, -10 * p);
      setCount(Math.round(ease * value));
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{typeof count === 'number' ? count.toLocaleString() : count}</>;
}

const SOURCE_ICONS: Record<string, string> = {
  Instagram: 'fab fa-instagram text-pink-500',
  Google: 'fab fa-google text-blue-500',
  WhatsApp: 'fab fa-whatsapp text-emerald-500',
  Facebook: 'fab fa-facebook text-blue-600',
  'Twitter / X': 'fab fa-x-twitter text-slate-800',
  LinkedIn: 'fab fa-linkedin text-blue-700',
  TikTok: 'fab fa-tiktok text-slate-900',
  YouTube: 'fab fa-youtube text-red-500',
  Direct: 'fas fa-link text-slate-500',
};

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-2xl ${className}`} />;
}

const CustomAreaTooltip = ({ active, payload, label, isHourly }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-xl px-4 py-3 min-w-[140px]">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
        {isHourly ? `Pukul ${label}` : label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-xs font-bold text-slate-600 capitalize">{entry.name}</span>
            </div>
            <span className="text-sm font-black text-slate-900">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [range, setRange] = useState('7d');
  const [isMounted, setIsMounted] = useState(false);
  const [animReady, setAnimReady] = useState(false);

  const { data, isLoading } = useSWR(`/api/analytics/stats?range=${range}`, fetcher, { refreshInterval: 30000 });
  const { data: userData, isLoading: isUserLoading } = useSWR('/api/layout-sync', fetcher);
  // Default ke undefined dulu (bukan 'FREE') sampai data plan benar-benar loaded
  const userPlan = userData?.plan ?? undefined;

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => {
    if (!isLoading && isMounted) {
      const t = setTimeout(() => setAnimReady(true), 200);
      return () => clearTimeout(t);
    }
  }, [isLoading, isMounted]);

  const stats = data?.stats || { totalViews: 0, uniqueVisitors: 0, avgTime: '0s', bounceRate: '0%' };
  const chartData: { day: string; date: string; views: number }[] = data?.chartData || [];
  const sources: { name: string; count: number; percentage: number }[] = data?.sources || [];

  // derived metrics
  const peakEntry = chartData.reduce((a, b) => (b.views > a.views ? b : a), { day: '-', date: '', views: 0 });
  const totalPeriod = chartData.reduce((s, d) => s + d.views, 0);
  const avgDaily = chartData.length > 0 ? Math.round(totalPeriod / chartData.length) : 0;
  const growth = chartData.length >= 2
    ? chartData[chartData.length - 2].views === 0 ? 0
      : Math.round(((chartData[chartData.length - 1].views - chartData[chartData.length - 2].views) / chartData[chartData.length - 2].views) * 100)
    : 0;

  // Device split — use static data for FREE
  const isFree = userPlan === 'FREE';
  const deviceData = isFree
    ? [
        { name: 'Desktop', pct: 58, color: '#0f172a' },
        { name: 'Mobile', pct: 36, color: '#ff9e00' },
        { name: 'Tablet', pct: 6, color: '#e2e8f0' },
      ]
    : [
        { name: 'Desktop', pct: stats.devices?.desktop || 0, color: '#0f172a' },
        { name: 'Mobile', pct: stats.devices?.mobile || 0, color: '#ff9e00' },
        { name: 'Tablet', pct: stats.devices?.tablet || 0, color: '#e2e8f0' },
      ];

  // Static placeholder sources for FREE
  const staticSources = [
    { name: 'Instagram', count: 842, percentage: 38 },
    { name: 'Google', count: 531, percentage: 24 },
    { name: 'Direct', count: 419, percentage: 19 },
    { name: 'LinkedIn', count: 265, percentage: 12 },
    { name: 'Twitter / X', count: 154, percentage: 7 },
  ];
  const displaySources = isFree ? staticSources : sources;

  // Static placeholder values for locked KPI & secondary metrics (FREE)
  const lockedAvgTime = '2m 34s';
  const lockedBounceRate = '42%';
  const lockedAvgDaily = 127;
  const lockedPeakViews = 384;
  const lockedPeakDay = 'Senin';
  const lockedTotalPeriod = 891;

  const handleLocked = () => showToast({ message: "Upgrade ke PRO untuk membuka fitur analitik lengkap!", id: "range-lock", icon: "fa-lock" });

  const RANGES = [
    { id: '1d', label: 'Hari Ini', pro: false },
    { id: '7d', label: '7 Hari', pro: false },
    { id: '30d', label: '30 Hari', pro: true },
    { id: 'all', label: 'Semua', pro: true },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 pb-32 font-sans selection:bg-slate-200">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp { from { opacity:0;transform:translateY(20px) } to { opacity:1;transform:translateY(0) } }
        .animate-enter { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .recharts-wrapper,.recharts-surface,.recharts-wrapper svg,.recharts-layer { outline:none!important; }
      `}} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 animate-enter">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-1.5">
            Metrics.
          </h1>
          <p className="text-sm font-medium text-slate-500">Analisis mendalam performa dan trafik portofolio Anda.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50 self-start md:self-auto">
          {RANGES.map(r => {
            // Jangan lock jika plan belum loaded (undefined) — tunggu konfirmasi dulu
            const locked = r.pro && userPlan === 'FREE';
            return (
              <button key={r.id}
                onClick={() => locked ? handleLocked() : setRange(r.id)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all flex items-center gap-1.5 whitespace-nowrap ${range === r.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {r.label}
                {locked && <i className="fas fa-lock text-[8px] opacity-40" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-8">
        {/* Tampilkan skeleton jika analytics ATAU plan user belum loaded */}
        {(isLoading || isUserLoading || userPlan === undefined) ? [1,2,3,4].map(i => <SkeletonBlock key={i} className="h-[120px] md:h-[140px]" />) : [
          { label: 'Total Views', val: stats.totalViews, icon: 'fa-eye', badge: `${growth > 0 ? '+' : ''}${growth}%`, badgeColor: growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500', locked: false },
          { label: 'Unique Visitors', val: stats.uniqueVisitors, icon: 'fa-user', badge: 'Est.', badgeColor: 'bg-slate-50 text-slate-500', locked: false },
          { label: 'Avg. Time', val: isFree ? lockedAvgTime : stats.avgTime, icon: 'fa-clock', badge: 'PRO', badgeColor: 'bg-slate-900 text-white', locked: isFree },
          { label: 'Bounce Rate', val: isFree ? lockedBounceRate : stats.bounceRate, icon: 'fa-sign-out-alt', badge: 'PRO', badgeColor: 'bg-slate-900 text-white', locked: isFree },
        ].map((card, i) => (
          <div key={i} onClick={card.locked ? handleLocked : undefined}
            className={`bg-white border border-slate-100 rounded-[2rem] p-5 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-enter flex flex-col justify-between relative overflow-hidden ${card.locked ? 'cursor-pointer' : ''}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {card.locked && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs mb-1.5">
                  <i className="fas fa-lock" />
                </div>
                <span className="text-[9px] font-black text-slate-900 tracking-widest">PRO ONLY</span>
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${card.badgeColor}`}>{card.badge}</span>
            </div>
            <h3 className={`text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-none ${card.locked ? 'blur-sm opacity-30' : ''}`}>
              <AnimatedCounter value={card.val} duration={1000 + i * 150} />
            </h3>
          </div>
        ))}
      </div>

      {/* SECONDARY METRIC STRIP */}
      <div className="grid grid-cols-3 gap-3 md:gap-5 mb-8">
        {(isLoading || isUserLoading || userPlan === undefined) ? [1,2,3].map(i => <SkeletonBlock key={i} className="h-20" />) : [
          { label: 'Rata-rata Harian', val: isFree ? lockedAvgDaily : avgDaily, suffix: isFree ? 'views/hari' : 'views/hari', icon: 'fa-chart-bar' },
          { label: 'Puncak Kunjungan', val: isFree ? lockedPeakViews : peakEntry.views, suffix: isFree ? lockedPeakDay : peakEntry.day, icon: 'fa-trophy' },
          { label: 'Total Periode', val: isFree ? lockedTotalPeriod : totalPeriod, suffix: isFree ? 'dalam 7 hari' : `dalam ${chartData.length} hari`, icon: 'fa-calendar' },
        ].map((m, i) => (
          <div key={i} onClick={isFree ? handleLocked : undefined}
            className={`bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-5 shadow-sm animate-enter flex items-center gap-3 md:gap-4 relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
            style={{ animationDelay: `${250 + i * 50}ms` }}
          >
            {isFree && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center">
                <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] mb-1">
                  <i className="fas fa-lock" />
                </div>
                <span className="text-[8px] font-black text-slate-900 tracking-widest">PRO ONLY</span>
              </div>
            )}
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
              <i className={`fas ${m.icon} text-sm`} />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest truncate">{m.label}</p>
              <p className={`text-lg md:text-xl font-black text-slate-900 tracking-tighter leading-tight ${isFree ? 'blur-[6px] opacity-40' : ''}`}>
                <AnimatedCounter value={m.val} />
              </p>
              <p className={`text-[9px] font-bold text-slate-400 ${isFree ? 'blur-[6px] opacity-40' : ''}`}>{m.suffix}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

        {/* TRAFFIC AREA CHART — spans 2 cols */}
        {isLoading ? (
          <div className="lg:col-span-2 rounded-[2.5rem] shimmer h-[400px]" />
        ) : (
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm animate-enter" style={{ animationDelay: '300ms' }}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Traffic Overview</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
                {range === '1d' ? 'Per jam — hari ini' : range === '7d' ? '7 hari terakhir' : range === '30d' ? '30 hari terakhir' : 'Semua waktu'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff9e00] inline-block" /> Page Views
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Uniq. Visitors
              </span>
            </div>
          </div>

          {false ? <SkeletonBlock className="h-[280px]" /> : (
            <div className="h-[280px]" onMouseDown={e => e.preventDefault()}>
              {isMounted && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff9e00" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#ff9e00" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
                    <Tooltip content={<CustomAreaTooltip isHourly={range === '1d'} />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="views" name="Page Views" stroke="#ff9e00" strokeWidth={2.5} fill="url(#viewsGrad)" dot={false} activeDot={{ r: 5, fill: '#ff9e00', stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
                    <Area type="monotone" dataKey="visitors" name="Uniq. Visitors" stroke="#94a3b8" strokeWidth={2.5} fill="transparent" dot={false} activeDot={{ r: 5, fill: '#94a3b8', stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <i className="fas fa-chart-area text-3xl mb-3" />
                  <p className="text-[10px] font-bold tracking-widest">Belum ada data traffic</p>
                </div>
              )}
            </div>
          )}
        </div>
        )}

        {/* DEVICE BREAKDOWN */}
        {isLoading ? (
          <div className="rounded-[2.5rem] shimmer h-[400px]" />
        ) : (
        <div onClick={isFree ? handleLocked : undefined}
          className={`bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm animate-enter flex flex-col relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
          style={{ animationDelay: '350ms' }}
        >
          {isFree && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm mb-2">
                <i className="fas fa-lock" />
              </div>
              <span className="text-[9px] font-black text-slate-900 tracking-widest">PRO ONLY</span>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Upgrade untuk melihat data perangkat</p>
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Perangkat</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Distribusi per device</p>
          </div>
          {false ? <SkeletonBlock className="flex-1 min-h-[200px]" /> : (
            <div className="space-y-5 flex-1">
              {deviceData.map((d, i) => (
                <div key={d.name} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className="text-xs font-bold text-slate-700">{d.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">{d.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-[1200ms] ease-out"
                      style={{ width: animReady ? `${d.pct}%` : '0%', background: d.color, transitionDelay: `${i * 100}ms` }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 mt-4 border-t border-slate-50">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Estimasi berdasarkan User Agent</p>
                <div className="grid grid-cols-3 gap-2">
                  {deviceData.map(d => (
                    <div key={d.name} className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                      <p className="text-sm font-black text-slate-900">{d.pct}%</p>
                      <p className="text-[8px] font-bold text-slate-400">{d.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      {/* BOTTOM ROW: Top Sources + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

        {/* TOP SOURCES */}
        {isLoading ? (
          <div className="rounded-[2.5rem] shimmer h-[340px]" />
        ) : (
        <div onClick={isFree ? handleLocked : undefined}
          className={`bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm animate-enter relative overflow-hidden ${isFree ? 'cursor-pointer' : ''}`}
          style={{ animationDelay: '400ms' }}
        >
          {isFree && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm mb-2">
                <i className="fas fa-lock" />
              </div>
              <span className="text-[9px] font-black text-slate-900 tracking-widest">PRO ONLY</span>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Upgrade untuk melihat sumber trafik</p>
            </div>
          )}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Top Sources</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Dari mana trafik berasal</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
              <i className="fas fa-bullseye text-sm" />
            </div>
          </div>
          {false ? (
            <div className="space-y-4">{[1,2,3,4].map(i => <SkeletonBlock key={i} className="h-12" />)}</div>
          ) : displaySources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-300">
              <i className="fas fa-ghost text-3xl mb-3" />
              <p className="text-[10px] font-bold tracking-widest">Belum ada data sources</p>
            </div>
          ) : (
            <div className="space-y-5">
              {displaySources.map((src, i) => (
                <div key={i} className="group/src">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <i className={`${SOURCE_ICONS[src.name] || 'fas fa-link text-slate-500'} text-xs`} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{src.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-900">{src.percentage}%</p>
                      <p className="text-[9px] font-bold text-slate-400">{src.count} hits</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full group-hover/src:bg-[#ff9e00] transition-colors duration-300"
                      style={{ width: animReady ? `${src.percentage}%` : '0%', transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms, background-color 0.3s` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* DAILY BAR CHART */}
        {isLoading ? (
          <div className="rounded-[2.5rem] shimmer h-[340px]" />
        ) : (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm animate-enter flex flex-col" style={{ animationDelay: '450ms' }}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Volume Harian</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Distribusi per hari</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
              <i className="fas fa-chart-bar text-sm" />
            </div>
          </div>
          {isLoading ? <SkeletonBlock className="flex-1 min-h-[240px]" /> : (
            <div className="flex-1 min-h-[240px]" onMouseDown={e => e.preventDefault()}>
              {isMounted && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
                    <Tooltip cursor={{ fill: '#f8fafc', radius: 8, stroke: 'none' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', fontSize: '11px', fontWeight: 'bold' }} />
                    <Bar dataKey="views" radius={[8, 8, 0, 0]} barSize={28} animationDuration={1400}>
                      {chartData.map((entry, idx) => (
                        <Cell key={`c-${idx}`}
                          fill={entry.date === peakEntry.date ? '#ff9e00' : idx === chartData.length - 1 ? '#0f172a' : '#e2e8f0'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <i className="fas fa-chart-bar text-3xl mb-3" />
                  <p className="text-[10px] font-bold tracking-widest">Belum ada data</p>
                </div>
              )}
            </div>
          )}

          {/* Legenda */}
          {!isLoading && chartData.length > 0 && (
            <div className="flex gap-4 mt-4 pt-4 border-t border-slate-50">
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#ff9e00] inline-block" /> Puncak
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 inline-block" /> Hari Ini
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 inline-block" /> Lainnya
              </span>
            </div>
          )}
        </div>
        )}
      </div>

      {/* PRO BANNER */}
      <div onClick={handleLocked}
        className="relative overflow-hidden bg-[#050505] p-8 md:p-14 rounded-[2.5rem] border border-slate-800 cursor-pointer group shadow-2xl animate-enter hover:border-slate-700 transition-all duration-500"
        style={{ animationDelay: '500ms' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#ff9e00]/5 blur-[80px] rounded-full group-hover:bg-[#ff9e00]/10 transition-all duration-700" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-widest text-slate-400 mb-6">
            <i className="fas fa-crown text-[#ff9e00]" /> Pro Feature
          </span>
          <h4 className="text-2xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Advanced <span className="font-light text-slate-500">Insights.</span>
          </h4>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
            Dapatkan data geografis, peta panas klik pengunjung, demographic detail, dan pelacakan konversi secara real-time.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Real-time Tracking','Visitor Demographics','Click Heatmaps','Conversion Funnel','Geo Analytics'].map(t => (
              <span key={t} className="px-4 py-1.5 bg-white/5 text-slate-400 text-[9px] font-bold rounded-full tracking-widest border border-white/5">
                {t}
              </span>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 rounded-full text-[10px] font-black tracking-widest shadow-lg group-hover:bg-slate-100 transition-all">
            <i className="fas fa-lock text-slate-500" /> Tersedia Segera
          </div>
        </div>
      </div>

    </main>
  );
}