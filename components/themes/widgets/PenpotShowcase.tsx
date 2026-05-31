'use client';

import React from 'react';
import useSWR from 'swr';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export type StatsVariant = 'monochrome' | 'classic' | 'acid' | 'aura' | 'noir' | 'bento' | 'brutalism' | 'cinematic' | 'editorial' | 'midnight' | 'monolith' | 'spatial' | 'split' | 'viewfinder' | 'minimalist';

interface PenpotShowcaseProps {
  userId: string;
  variant?: StatsVariant;
  themeColor?: string;
}

const fetcher = (url: string) => fetch(url).then(async (res) => {
  if (res.status === 401 || res.status === 403 || res.status === 404) {
    // User belum connect / token tidak valid → tandai sebagai "not connected"
    const err: any = new Error('Not connected');
    err.status = res.status;
    throw err;
  }
  if (!res.ok) {
    const err: any = new Error('Server Error');
    err.status = res.status;
    throw err;
  }
  return res.json();
});

export function PenpotShowcase({ userId, variant = 'monochrome', themeColor }: PenpotShowcaseProps) {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { data, error, isLoading } = useSWR(`/api/penpot/manual?userId=${userId}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  if (!isLoading && (!data?.projects || data.projects.length === 0)) return null;

  const styles = {
    monochrome: {
      section: 'p-8 @lg:py-10 @lg:px-12 border-t border-gray-100 bg-white text-slate-900',
      heading: 'text-xl font-black uppercase tracking-tighter text-slate-900',
      label: 'text-[10px] font-mono text-gray-400 uppercase',
      border: 'border-gray-100',
      cardBg: 'bg-gray-50 border-gray-100',
      icon: 'text-slate-900',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-500',
      progressBg: 'bg-slate-100',
      progressFill: 'bg-slate-900',
      calendarColorScheme: 'light' as const
    },
    classic: {
      section: 'p-8 @lg:p-12 border-t border-slate-800 bg-[#0d1117] text-slate-300',
      heading: 'text-2xl font-bold tracking-tight text-slate-100',
      label: 'text-[10px] font-mono text-slate-500 uppercase',
      border: 'border-slate-800',
      cardBg: 'bg-[#161b22] border-slate-800',
      icon: 'text-slate-100',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-400',
      progressBg: 'bg-slate-800',
      progressFill: 'bg-[#2ea043]',
      calendarColorScheme: 'dark' as const
    },
    acid: {
      section: 'p-8 @lg:p-12 border-t-2 border-[#1a1a1a] bg-[#09090b] text-[#fafafa] acid-theme',
      heading: 'text-3xl font-extrabold uppercase tracking-tighter text-[#fafafa] acid-heading',
      label: 'text-[10px] font-bold text-[#a3e635] uppercase tracking-[0.2em] acid-body',
      border: 'border-[#1a1a1a]',
      cardBg: 'bg-[#09090b] border-[#1a1a1a]',
      icon: 'text-[#a3e635]',
      textPrimary: 'text-[#fafafa]',
      textSecondary: 'text-zinc-500',
      progressBg: 'bg-zinc-800',
      progressFill: 'bg-[#a3e635]',
      calendarColorScheme: 'dark' as const
    },
    aura: {
      section: 'p-8 @lg:p-12 border-t border-white/10 bg-white/5 backdrop-blur-md text-white rounded-3xl mb-12',
      heading: 'text-2xl font-medium tracking-tight text-white',
      label: 'text-[10px] font-bold text-violet-300 uppercase tracking-widest',
      border: 'border-white/10',
      cardBg: 'bg-white/5 border-white/10',
      icon: 'text-white',
      textPrimary: 'text-white',
      textSecondary: 'text-violet-200/60',
      progressBg: 'bg-white/10',
      progressFill: 'bg-violet-400',
      calendarColorScheme: 'dark' as const
    },
    noir: {
      section: 'p-8 @md:p-12 border-t border-white/10 bg-[#050505] text-white wire-border-b',
      heading: 'font-sans font-black text-3xl @md:text-5xl tracking-tighter uppercase',
      label: 'font-mono text-[10px] uppercase tracking-[0.2em] text-white/50',
      border: 'border-white/10',
      cardBg: 'bg-[#0a0a0a] border border-white/20 transition-all duration-500 hover:-translate-y-2 hover:border-white/50 hover:bg-[#111]',
      icon: 'text-white',
      textPrimary: 'text-white font-black',
      textSecondary: 'text-white/60 font-mono',
      progressBg: 'bg-white/10',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const
    },
    bento: {
      section: 'bento-card flex flex-col p-6 @lg:p-10 @lg:col-span-4 w-full h-full',
      heading: 'text-xl @md:text-2xl font-black text-white',
      label: 'text-[10px] text-slate-500 font-bold uppercase tracking-widest',
      border: 'border-white/5',
      cardBg: 'bg-[#1a1a1d] border-white/5',
      icon: 'text-white',
      textPrimary: 'text-white font-bold',
      textSecondary: 'text-slate-400 font-medium',
      progressBg: 'bg-white/5',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const
    },
    brutalism: {
      section: 'p-6 @sm:p-12 border-b-[3px] border-black bg-[#f4f4f0] flex flex-col w-full font-mono text-black',
      heading: 'text-4xl @sm:text-5xl font-black uppercase tracking-tighter mb-8 font-sans',
      label: 'text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1 w-max',
      border: 'border-[3px] border-black',
      cardBg: 'bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] rounded-none',
      icon: 'text-black',
      textPrimary: 'text-black font-black uppercase',
      textSecondary: 'text-black font-bold uppercase',
      progressBg: 'bg-white border-y-[3px] border-black h-4 mt-2',
      progressFill: 'bg-black border-r-[3px] border-black h-full',
      calendarColorScheme: 'light' as const
    },
    cinematic: {
      section: 'py-20 @md:py-24 px-6 @md:px-12 border-t border-[#1f1f1f]',
      heading: 'font-black uppercase tracking-tighter text-white mb-12 text-4xl @md:text-6xl',
      label: 'text-[10px] @md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 inline-block',
      border: 'border-[#1f1f1f]',
      cardBg: 'bg-transparent border-y border-[#1f1f1f] py-8 rounded-none',
      icon: 'text-gray-400',
      textPrimary: 'text-white font-black uppercase tracking-tighter',
      textSecondary: 'text-gray-500 text-xs @md:text-sm',
      progressBg: 'bg-[#1f1f1f] h-[1px]',
      progressFill: 'bg-white h-[1px]',
      calendarColorScheme: 'dark' as const
    },
    editorial: {
      section: 'w-full max-w-[1600px] mx-auto px-6 py-12 @md:px-12 @lg:px-20',
      heading: 'font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl mb-8',
      label: 'font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-max mb-4',
      border: 'border-[rgba(0,0,0,0.08)]',
      cardBg: 'bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] transition-all duration-500 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:border-[var(--hl)]/20',
      icon: 'text-[#111]',
      textPrimary: 'font-serif text-lg @md:text-xl text-[#111]',
      textSecondary: 'font-sans text-sm text-slate-500 font-medium',
      progressBg: 'bg-slate-100 rounded-full',
      progressFill: 'bg-[#111] rounded-full',
      calendarColorScheme: 'light' as const
    },
    midnight: {
      section: 'p-6 @md:p-12 @lg:p-20 flex flex-col border-t border-white/5 bg-[#030508]/50 shrink-0 w-full',
      heading: 'font-serif text-3xl @md:text-5xl text-white mb-8',
      label: 'font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-2 block',
      border: 'border-white/10',
      cardBg: 'bg-[#05070a] border border-white/10 shadow-2xl rounded-xl',
      icon: 'text-white',
      textPrimary: 'font-serif text-xl @md:text-2xl text-white',
      textSecondary: 'font-sans text-xs text-slate-400 font-medium uppercase tracking-widest',
      progressBg: 'bg-white/10',
      progressFill: 'bg-white',
      calendarColorScheme: 'dark' as const
    },
    monolith: {
      section: 'relative z-20 w-full bg-[#050505] px-6 @md:px-12 pb-20 @md:pb-32 flex flex-col',
      heading: 'font-serif leading-none text-white text-4xl @md:text-5xl @lg:text-[5cqi] mb-12',
      label: 'font-sans font-bold uppercase tracking-widest text-[var(--hl)] text-[10px] @md:text-xs mb-2 block',
      border: 'border-white/10',
      cardBg: 'bg-black border border-white/10 rounded-[24px] @md:rounded-[40px] shadow-2xl',
      icon: 'text-white',
      textPrimary: 'font-serif leading-none text-white text-3xl @md:text-5xl',
      textSecondary: 'font-sans font-medium text-slate-400 text-[10px] @md:text-sm',
      progressBg: 'bg-white/10',
      progressFill: 'bg-[var(--hl)]',
      calendarColorScheme: 'dark' as const
    },
    spatial: {
      section: 'flex flex-col w-full px-8 mt-24 @md:mt-32',
      heading: 'font-medium tracking-tight text-white text-4xl mb-8',
      label: 'inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel mb-4 text-xs font-medium text-slate-300 w-max',
      border: 'border-white/10',
      cardBg: 'glass-panel p-5 @md:p-6 rounded-[24px]',
      icon: 'text-white',
      textPrimary: 'font-medium tracking-tight text-white text-lg @md:text-xl',
      textSecondary: 'text-[10px] text-slate-400 mt-1',
      progressBg: 'bg-white/10 rounded-full',
      progressFill: 'bg-[var(--hl)] rounded-full',
      calendarColorScheme: 'dark' as const
    },
    split: {
      section: 'flex flex-col pt-16 @lg:pt-24 pb-16 border-b border-white/10 w-full',
      heading: 'font-serif font-extrabold text-4xl @lg:text-6xl text-white mb-10 px-6 @md:px-12',
      label: 'font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--hl)] mb-2 block px-6 @md:px-12',
      border: 'border-white/10',
      cardBg: 'bg-white/5 backdrop-blur-md border border-white/10 rounded-xl mx-6 @md:mx-12 p-6 @md:p-8',
      icon: 'text-white',
      textPrimary: 'font-serif font-bold text-3xl @md:text-5xl text-white',
      textSecondary: 'font-sans font-medium text-slate-400 text-sm mt-2',
      progressBg: 'bg-white/10',
      progressFill: 'bg-[var(--hl)]',
      calendarColorScheme: 'dark' as const
    },
    viewfinder: {
      section: 'border-y-2 border-[#050505] py-10 mb-10 w-full',
      heading: 'font-cinema tracking-wide text-5xl text-[#050505] mb-6',
      label: 'font-bold uppercase tracking-widest text-[10px] text-[#050505] mb-2 block',
      border: 'border-[#050505]',
      cardBg: 'bg-transparent',
      icon: 'text-[#050505]',
      textPrimary: 'font-cinema text-5xl text-[#050505]',
      textSecondary: 'font-bold uppercase tracking-widest text-[10px] text-gray-500 mt-2',
      progressBg: 'bg-gray-300',
      progressFill: 'bg-[var(--primary)]',
      calendarColorScheme: 'light' as const
    },
    minimalist: {
      section: 'border-t border-gray-200 bg-gray-50/30 overflow-hidden w-full pb-8',
      heading: 'text-2xl font-black uppercase tracking-tighter text-black px-8 @lg:px-12 pt-8 pb-2 min-heading',
      label: 'text-[10px] font-bold uppercase tracking-widest text-gray-400 px-8 @lg:px-12 mb-6 block min-heading',
      border: 'border-gray-200',
      cardBg: 'bg-white border-y border-gray-200 py-8 px-8 @lg:px-12',
      icon: 'text-black',
      textPrimary: 'text-2xl font-black tracking-tighter text-black',
      textSecondary: 'text-xs font-medium text-gray-500 mt-2',
      progressBg: 'bg-gray-200',
      progressFill: 'bg-black',
      calendarColorScheme: 'light' as const
    }
  };

  const s = (styles as any)[variant] || styles.monochrome;
  const isDynamic = true;
  const dynamicTextStyle = isDynamic && themeColor ? { color: themeColor } : {};

  const PenpotIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M22 4.5L37.5 12.25V31.75L22 39.5L6.5 31.75V12.25L22 4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 39.5V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M37.5 12.25L22 22L6.5 12.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 12V6M22 15V4M30 12V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={`flex justify-between items-baseline mb-10 ${variant === 'editorial' ? 'pt-10 border-t' : 'pb-6 border-b'} ${s.border}`}>
        <h2 className={s.heading}>Design Index</h2>
        <div className={`flex items-center gap-2 ${s.label}`} style={dynamicTextStyle}>
          <PenpotIcon className="w-4 h-4" />
          <span>Penpot</span>
        </div>
      </div>

      <div className="w-full font-sans">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`animate-pulse flex items-center gap-4 p-5 rounded-2xl ${s.cardBg}`}>
                <div className="w-12 h-12 shrink-0 rounded-xl bg-current opacity-10"></div>
                <div className="flex flex-col flex-1 gap-2">
                  <div className={`h-4 ${s.textPrimary} bg-current opacity-20 rounded w-3/4`}></div>
                  <div className={`h-3 ${s.textSecondary} bg-current opacity-10 rounded w-1/2`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-6 ${variant === 'midnight' ? '@xl:grid-cols-2' : '@md:grid-cols-2 @xl:grid-cols-3'}`}>
            {data.projects.map((project: any, index: number) => (
              <a 
                key={index} 
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center ${variant === 'midnight' ? 'gap-2 p-3' : 'gap-3 p-4'} rounded-xl cursor-pointer group ${s.cardBg}`}
              >
                <div className={`${variant === 'midnight' ? 'w-8 h-8' : 'w-10 h-10'} shrink-0 rounded-lg bg-emerald-50/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-sm relative overflow-hidden`}>
                  <PenpotIcon className={variant === 'midnight' ? 'w-4 h-4' : 'w-5 h-5'} />
                </div>
                
                <div className="flex flex-col flex-1 min-w-0">
                  <h4 className={`${s.textPrimary} mb-0.5 uppercase tracking-tight`}>{project.title || 'Untitled Design'}</h4>
                  <span className={`${s.textSecondary} flex items-center gap-2 text-[10px]`}>
                    <i className="fas fa-external-link-alt text-[9px]"></i>
                    {variant === 'midnight' ? 'View' : 'View on Penpot'}
                  </span>
                </div>
                
                <div className={`${variant === 'midnight' ? 'w-6 h-6' : 'w-8 h-8'} rounded-full border border-current flex items-center justify-center opacity-50 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0`}>
                  <i className="fas fa-arrow-right -rotate-45 text-[10px]"></i>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
