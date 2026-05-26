"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  feature?: string;
}

export function ProUpgradeModal({ 
  isOpen, 
  onClose, 
  title = "Unlock Pro Access", 
  description = "Akses tanpa batas ke semua tema premium, analitik, dan kustomisasi penuh.",
  feature
}: ProUpgradeModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setMounted(false), 500);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  return (
    <div className="fixed inset-0 z-[1000002] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* LUXURY OVERLAY */}
      <div 
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-[12px] transition-opacity duration-700 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* MODAL CONTAINER - ULTRA COMPACT LANDSCAPE */}
      <div className={`relative w-full max-w-3xl transition-all duration-700 cubic-bezier(0.22, 1, 0.36, 1) ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'} flex flex-col md:flex-row bg-[#080808] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]`}>
        
        {/* LEFT COLUMN: VISUAL (Compact) */}
        <div className="w-full md:w-[35%] shrink-0 h-32 md:h-auto relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-black md:border-r border-white/5">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute w-24 h-24 bg-indigo-500/10 blur-[40px] rounded-full"></div>
            
            <div className="relative z-10">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.8rem] flex items-center justify-center shadow-2xl relative overflow-hidden group">
                    <i className="fas fa-crown text-4xl md:text-5xl text-[#ff9e00] drop-shadow-[0_0_10px_rgba(255,158,0,0.4)]"></i>
                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] animate-[shine_3s_infinite_ease-in-out]"></div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes shine {
                    0% { transform: translateX(-200%) skewX(-20deg); }
                    20%, 100% { transform: translateX(200%) skewX(-20deg); }
                }
            `}} />
        </div>

        {/* RIGHT COLUMN: CONTENT (Direct & Compact) */}
        <div className="flex-1 p-8 md:p-10 lg:p-12 relative flex flex-col justify-center">
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                <i className="fas fa-times text-xs"></i>
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff9e00]/10 border border-[#ff9e00]/20 text-[9px] font-black uppercase tracking-widest text-[#ff9e00] mb-5 w-fit">
                <i className="fas fa-star text-[7px]"></i> Pro Feature
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-3 leading-tight">
                {title}
            </h2>

            <p className="text-slate-400 text-[13px] font-medium leading-relaxed mb-6 max-w-md">
                {description}
            </p>

            {feature && (
                <div className="mb-8 flex items-center gap-3 p-3.5 bg-white/5 rounded-2xl border border-white/5 w-fit pr-6">
                    <div className="w-8 h-8 shrink-0 rounded-xl bg-[#ff9e00] flex items-center justify-center text-slate-900 text-xs shadow-[0_0_15px_rgba(255,158,0,0.2)]">
                        <i className="fas fa-unlock-keyhole"></i>
                    </div>
                    <div>
                        <p className="text-[11px] text-white font-black tracking-tight">{feature}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                    href="/pricing"
                    className="px-8 py-4 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-100 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    Upgrade Sekarang <i className="fas fa-arrow-right text-[9px]"></i>
                </Link>
                
                <button 
                    onClick={onClose}
                    className="px-6 py-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                    Nanti Saja
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
