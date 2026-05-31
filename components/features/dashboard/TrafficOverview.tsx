"use client";

import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';

interface TrafficOverviewProps {
  analytics: any;
  isLoading: boolean;
}

const safeDateFormatter = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};



// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs font-bold text-slate-600 capitalize">{entry.name}</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function TrafficOverview({ analytics, isLoading }: TrafficOverviewProps) {
  const [activeMetric, setActiveMetric] = useState<'both' | 'views' | 'visitors'>('both');

  const chartData = useMemo(() => {
    let raw: any[] = [];
    if (analytics?.chartData && analytics.chartData.length > 0) {
      raw = [...analytics.chartData].slice(-7);
    } else if (analytics?.dailyStats && analytics.dailyStats.length > 0) {
      raw = [...analytics.dailyStats].slice(-7);
    }

    if (raw.length === 0) return [];

    return raw.map((d: any) => ({
      date: d.day || safeDateFormatter(d.date),
      views: d.views ?? 0,
      visitors: d.visitors ?? 0,
    }));
  }, [analytics]);

  const summary = useMemo(() => {
    if (!chartData.length) return { totalViews: 0, avgDaily: 0, peakDay: '-', peakViews: 0 };
    let total = 0;
    let peak = 0;
    let peakD = '-';
    chartData.forEach(d => {
      total += d.views;
      if (d.views > peak) {
        peak = d.views;
        peakD = d.date;
      }
    });
    return {
      totalViews: total,
      avgDaily: Math.round(total / chartData.length),
      peakDay: peakD,
      peakViews: peak
    };
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 h-full min-h-[450px] shimmer w-full"></div>
    );
  }

  return (
    <AnimateOnScroll delay={100} className="h-full">
      <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 h-full flex flex-col">
        {/* Header & Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Traffic Overview</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Performa portofolio Anda selama 7 hari terakhir</p>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-slate-55 border border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-600 self-start lg:self-auto">
            7 Hari Terakhir
          </div>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Total Views</p>
            <h4 className="text-xl md:text-2xl font-black text-slate-900">{summary.totalViews.toLocaleString()}</h4>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Rata-rata Harian</p>
            <h4 className="text-xl md:text-2xl font-black text-slate-900">{summary.avgDaily.toLocaleString()}</h4>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
            <p className="text-[9px] font-extrabold text-orange-600 uppercase tracking-widest mb-1.5">Puncak Kunjungan</p>
            <div className="flex items-baseline gap-2 truncate">
              <h4 className="text-xl md:text-2xl font-black text-orange-700">{summary.peakDay}</h4>
              <span className="text-xs font-bold text-orange-500">({summary.peakViews} views)</span>
            </div>
          </div>
        </div>

        {/* Metric Toggles */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setActiveMetric(activeMetric === 'views' ? 'both' : 'views')}
            className="flex items-center gap-2 group"
          >
            <div className={`w-3 h-3 rounded-full transition-colors ${activeMetric === 'views' || activeMetric === 'both' ? 'bg-[#ff9e00]' : 'bg-slate-200'}`}></div>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest transition-colors ${activeMetric === 'views' || activeMetric === 'both' ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'}`}>Page Views</span>
          </button>
          <button
            onClick={() => setActiveMetric(activeMetric === 'visitors' ? 'both' : 'visitors')}
            className="flex items-center gap-2 group"
          >
            <div className={`w-3 h-3 rounded-full transition-colors ${activeMetric === 'visitors' || activeMetric === 'both' ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest transition-colors ${activeMetric === 'visitors' || activeMetric === 'both' ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'}`}>Uniq. Visitors</span>
          </button>
        </div>

        {/* Chart */}
        <div className="w-full h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff9e00" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ff9e00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.04)" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0, 0, 0, 0.05)', strokeWidth: 1 }} />

              {(activeMetric === 'both' || activeMetric === 'views') && (
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Views"
                  stroke="#ff9e00"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  activeDot={{ r: 6, fill: '#ff9e00', stroke: '#fff', strokeWidth: 2 }}
                />
              )}

              {(activeMetric === 'both' || activeMetric === 'visitors') && (
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="#0f172a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                  activeDot={{ r: 6, fill: '#0f172a', stroke: '#fff', strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
