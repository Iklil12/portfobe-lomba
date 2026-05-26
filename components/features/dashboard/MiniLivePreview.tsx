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
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm h-full min-h-[250px] shimmer w-full"></div>
    );
  }

  return (
    <AnimateOnScroll delay={150} className="h-full">
      <div className="bg-slate-900 rounded-[2.5rem] p-6 md:p-8 h-full flex flex-col justify-between relative overflow-hidden group border border-slate-800 shadow-2xl">
        {/* Decorative Blur Background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#ff9e00] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Tema Aktif</p>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter capitalize">{themeName}</h3>
          </div>
          <Link 
            href="/dashboard/appearance" 
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all backdrop-blur-md"
          >
            <i className="fas fa-palette text-sm"></i>
          </Link>
        </div>

        {/* Mockup Device */}
        <div className="relative z-10 mt-4 flex-1 min-h-[180px] flex items-center justify-center perspective-1000">
          <div className="relative w-full max-w-[280px] aspect-[16/10] bg-slate-800 rounded-t-2xl rounded-b-md border-[6px] border-slate-700 shadow-2xl transform rotateX-12 group-hover:rotate-0 transition-transform duration-500 ease-out flex flex-col overflow-hidden">
            {/* Browser Header */}
            <div className="h-4 bg-slate-700 w-full flex items-center px-2 gap-1.5 shrink-0">
               <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            </div>
            {/* Browser Content (Mock) */}
            <div className="flex-1 bg-white p-3 relative overflow-hidden">
                {/* Skeleton for Portfolio */}
                <div className="w-8 h-8 rounded-full bg-slate-200 mb-2"></div>
                <div className="w-3/4 h-2 rounded bg-slate-200 mb-1"></div>
                <div className="w-1/2 h-2 rounded bg-slate-200 mb-3"></div>
                
                <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 bg-slate-100 rounded-lg"></div>
                    <div className="h-10 bg-slate-100 rounded-lg"></div>
                </div>
                
                {/* Overlay blur and view button */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <a 
                      href={`/${subdomain}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl scale-90 group-hover:scale-100 transition-all duration-300 hover:bg-slate-800"
                    >
                      Live Preview
                    </a>
                </div>
            </div>
          </div>
          {/* Laptop Base */}
          <div className="absolute bottom-0 w-[120%] h-2 bg-slate-600 rounded-b-xl rounded-t-sm shadow-2xl transform translate-y-3 group-hover:translate-y-4 transition-transform duration-500 opacity-80"></div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
