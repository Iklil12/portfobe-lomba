"use client";

import React from 'react';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import Link from 'next/link';

interface MiniLivePreviewProps {
  themeName: string;
  subdomain: string;
  isLoading?: boolean;
}

export function MiniLivePreview({ themeName, subdomain, isLoading }: MiniLivePreviewProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 h-full min-h-[250px] shimmer w-full"></div>
    );
  }

  return (
    <AnimateOnScroll delay={150} className="h-full">
      <div className="bg-white border border-slate-200/60 p-6 md:p-8 h-full flex flex-col justify-between relative overflow-hidden group rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:border-slate-350 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300">
        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tema Aktif</p>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight capitalize">{themeName}</h3>
          </div>
          <Link
            href="/dashboard/appearance"
            className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            <i className="fas fa-palette text-xs"></i>
          </Link>
        </div>

        {/* Mockup Device */}
        <div className="relative z-10 mt-4 flex-1 min-h-[180px] flex items-center justify-center">
          <div className="relative w-full max-w-[280px] aspect-[16/10] bg-slate-900 border border-slate-950 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden">
            {/* Browser Header */}
            <div className="h-6 bg-slate-950 w-full flex items-center justify-between px-3 border-b border-slate-900 text-[9px] text-slate-400 shrink-0">
              <span className="truncate">portfo.be/{subdomain}</span>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
              </div>
            </div>
            {/* Browser Content (Mock) */}
            <div className="flex-1 bg-slate-50 p-3 relative overflow-hidden flex flex-col">
              {/* Skeleton for Portfolio */}
              <div className="w-8 h-8 rounded-full bg-slate-200 mb-2"></div>
              <div className="w-3/4 h-1.5 bg-slate-200 rounded-full mb-1"></div>
              <div className="w-1/2 h-1.5 bg-slate-100 rounded-full mb-3"></div>

              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 bg-white border border-slate-200/60 rounded-lg"></div>
                <div className="h-10 bg-white border border-slate-200/60 rounded-lg"></div>
              </div>

              {/* Overlay blur and view button */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <a
                  href={`/${subdomain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-slate-900 text-white rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-200 hover:shadow-[0_4px_12px_rgba(15,23,42,0.3)] hover:scale-105"
                >
                  Live Preview
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
