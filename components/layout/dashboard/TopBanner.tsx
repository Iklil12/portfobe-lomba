"use client";

import { useState } from 'react';
import Link from 'next/link';
import { NotificationItem } from '@/hooks/useDashboardLayout';

interface TopBannerProps {
  isLoading: boolean;
  topBanner: NotificationItem | undefined;
}

export function TopBanner({ isLoading, topBanner }: TopBannerProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  if (isLoading || !topBanner || dismissed.includes(topBanner.id)) return null;
  
  return (
    <div className={`animate-page-load delay-200 shrink-0 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 sm:px-10 py-3 transition-all duration-500 relative overflow-hidden pr-12 sm:pr-16 z-20 ${topBanner.bg} ${topBanner.border}`}>
      
      {/* Ambient Glow Effect */}
      <div className={`absolute top-0 right-0 w-48 h-48 blur-3xl opacity-40 -translate-y-1/2 translate-x-1/4 rounded-full pointer-events-none ${topBanner.bg.includes('rose') ? 'bg-rose-300' : 'bg-amber-300'}`}></div>

      {/* Tombol Close (X) */}
      <button 
        onClick={() => setDismissed([...dismissed, topBanner.id])}
        className="absolute top-2.5 right-4 sm:top-1/2 sm:-translate-y-1/2 sm:right-6 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-700 transition-colors z-20"
        aria-label="Tutup Peringatan"
      >
        <i className="fas fa-times text-[13px]"></i>
      </button>

      <div className={`flex items-start sm:items-center gap-3.5 relative z-10 ${topBanner.color}`}>
        <div className={`mt-0.5 sm:mt-0 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-inner ${topBanner.bg.includes('rose') ? 'bg-rose-100 border-rose-200 text-rose-600' : 'bg-amber-100 border-amber-200 text-amber-600'}`}>
          <i className={`fas ${topBanner.icon} text-xs`}></i>
        </div>
        <div className="flex flex-col">
          <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-widest mb-0.5">{topBanner.title}</h3>
          <p className="text-[12px] font-medium opacity-90 leading-snug">{topBanner.desc}</p>
        </div>
      </div>
      
      {topBanner.btnText && (
        <Link href={topBanner.link} className={`relative z-10 shrink-0 px-5 py-2 rounded-xl font-extrabold text-[10px] sm:text-[11px] uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 ${topBanner.btnColor || 'bg-slate-900 text-white hover:bg-slate-800'}`}>
          {topBanner.btnText} <i className="fas fa-arrow-right text-[9px] opacity-70"></i>
        </Link>
      )}
    </div>
  );
}
