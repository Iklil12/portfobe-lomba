'use client';

import React, { useRef, useState, useEffect } from 'react';
import useSWR from 'swr';
import { GithubCalendarWidget, CalendarThemeVariant } from './GithubCalendarWidget';
import { GithubActivityFeed } from './GithubActivityFeed';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export type StatsVariant = 'monochrome' | 'classic' | 'acid' | 'aura' | 'noir' | 'bento' | 'brutalism' | 'cinematic' | 'editorial' | 'midnight' | 'monolith' | 'spatial' | 'split' | 'viewfinder' | 'minimalist';

interface GithubStatsProps {
  userId: string;
  variant?: StatsVariant;
  themeColor?: string; // Menambahkan prop themeColor dinamis
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('API Error');
  return res.json();
});

export function GithubStats({ userId, variant = 'monochrome', themeColor }: GithubStatsProps) {
  const sectionRef = useScrollReveal<HTMLElement>(0);
  const headingRef = useScrollReveal<HTMLDivElement>(100);
  const reposRef = useScrollReveal<HTMLDivElement>(200);
  const langsRef = useScrollReveal<HTMLDivElement>(300);
  const calendarRef = useScrollReveal<HTMLDivElement>(400);

  const { data, error, isLoading } = useSWR(`/api/github/stats?userId=${userId}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateIfStale: true,
    dedupingInterval: 10000,
  });

  // State untuk animasi bar — reset tiap kali data baru masuk, baru aktif saat scroll
  const [barAnimated, setBarAnimated] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBarAnimated(false);
    const el = barRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setBarAnimated(true), 150);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [data]);


  if (error) return null;

  const hasNoPublicRepos = !isLoading && !data?.topRepo && (!data?.languages || data.languages.length === 0);

  // --- STYLING MAP ---
  const styles = {
    monochrome: {
      section: 'p-8 @lg:p-12 border-t border-gray-100 bg-white text-slate-900',
      heading: 'text-2xl font-black uppercase tracking-tighter text-slate-900',
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
      cardBg: 'bg-[#0a0a0a] border-white/10',
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
      cardBg: 'bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem]',
      icon: 'text-[#111]',
      textPrimary: 'font-serif text-3xl @md:text-4xl text-[#111]',
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
      cardBg: 'glass-panel p-6 @md:p-8 rounded-[24px]',
      icon: 'text-white',
      textPrimary: 'font-medium tracking-tight text-white text-2xl @md:text-4xl',
      textSecondary: 'text-sm text-slate-400 mt-2',
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
      heading: 'text-2xl font-black uppercase tracking-tighter text-black px-8 @lg:px-12 pt-8 pb-2',
      label: 'text-[10px] font-bold uppercase tracking-widest text-gray-400 px-8 @lg:px-12 mb-6 block',
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

  const s = styles[variant] || styles.monochrome;

  // --- DYNAMIC STYLING ---
  // Jika variant adalah acid atau aura, dan user memilih warna di editor, kita "timpa" warna bawaan
  const isDynamic = variant === 'acid' || variant === 'aura' || variant === 'noir' || variant === 'bento' || variant === 'brutalism' || variant === 'cinematic' || variant === 'editorial' || variant === 'midnight' || variant === 'monolith' || variant === 'spatial' || variant === 'split' || variant === 'viewfinder' || variant === 'minimalist';
  const dynamicTextStyle = isDynamic && themeColor ? { color: themeColor } : {};
  const dynamicBgStyle = isDynamic && themeColor ? { backgroundColor: themeColor } : {};

  return (
    <section ref={sectionRef} className={s.section}>
      <div ref={headingRef} className={`flex justify-between items-baseline mb-10 ${variant === 'editorial' ? 'pt-10 border-t' : 'pb-6 border-b'} ${s.border}`}>
        <h2 className={s.heading}>Open Source</h2>
        <span className={s.label} style={dynamicTextStyle}>GitHub</span>
      </div>

      <div className="w-full font-sans">
        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-6">
            <div>
              <div className={`h-4 ${s.progressBg} rounded w-1/3 mb-2`}></div>
              <div className={`h-3 ${s.progressBg} rounded w-full mb-1`}></div>
              <div className={`h-3 ${s.progressBg} rounded w-4/5`}></div>
            </div>
          </div>
        ) : hasNoPublicRepos ? (
          <div className={`py-8 text-center border rounded-2xl ${s.cardBg}`}>
            <i className={`fab fa-github text-3xl mb-3 ${s.textSecondary}`}></i>
            <p className={`text-sm font-bold tracking-tight ${s.textSecondary}`}>No public repositories</p>
            <p className={`text-[10px] uppercase tracking-widest mt-1 opacity-50 ${s.textSecondary}`}>Repositories are private or empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Repositories List */}
            {(data.topRepos || data.topRepo) && (
              <div ref={reposRef} className="flex flex-col gap-6">
                <span className={`${s.label} mb-1`} style={dynamicTextStyle}>
                  Top Repositories
                </span>
                <div className="flex flex-col gap-8">
                  {(data.topRepos || [data.topRepo]).map((repo: any, index: number) => (
                    <div key={repo.name || index} className="flex flex-col">
                      <a 
                        href={repo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <i className={`fab fa-github text-sm group-hover:opacity-70 transition-opacity ${s.icon}`} style={dynamicTextStyle}></i>
                          <h4 className={`text-base font-bold transition-all ${s.textPrimary}`}>
                            {repo.name}
                          </h4>
                        </div>
                        {repo.description && (
                          <p className={`text-xs leading-relaxed line-clamp-2 mb-3 ${s.textSecondary}`}>
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${s.textSecondary}`}>
                            <i className="fas fa-star text-[9px]"></i>
                            {repo.stars}
                          </div>
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${s.textSecondary}`}>
                            <i className="fas fa-eye text-[9px]"></i>
                            {repo.watchers}
                          </div>
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${s.textSecondary}`}>
                            <i className="fas fa-code-branch text-[9px]"></i>
                            {repo.forks}
                          </div>
                          {repo.language && (
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold ${s.textSecondary}`}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: repo.languageColor }}></span>
                              {repo.language}
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Languages */}
            {data.languages && data.languages.length > 0 && (
              <div ref={langsRef} className="flex flex-col">
                <span className={`${s.label} mb-4`} style={dynamicTextStyle}>
                  Top Languages
                </span>
                <div className="flex flex-col">
                  {/* Multi-segment Progress Bar */}
                  <div ref={barRef} className={`w-full h-2.5 flex rounded-full overflow-hidden mb-6 ${s.progressBg}`}>
                    {data.languages.map((lang: any, idx: number) => (
                      <div 
                        key={`bar-${lang.name}`}
                        style={{ 
                          width: barAnimated ? `${lang.percent}%` : '0%', 
                          backgroundColor: lang.color,
                          transitionDelay: barAnimated ? `${idx * 80}ms` : '0ms'
                        }}
                        className="h-full transition-[width] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                        title={`${lang.name}: ${lang.percent}%`}
                      />
                    ))}
                  </div>

                  {/* Language Legend */}
                  <div className={`grid gap-y-3 gap-x-4 ${variant === 'midnight' ? 'grid-cols-1 @xl:grid-cols-2' : 'grid-cols-2'}`}>
                    {data.languages.map((lang: any) => (
                      <div key={lang.name} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: lang.color }}></span>
                        <span className={`text-xs font-bold ${s.textPrimary}`}>
                          {lang.name}
                        </span>
                        <span className={`text-[10px] font-mono ml-auto ${s.textSecondary}`}>
                          {lang.percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Contribution Calendar */}
        {!isLoading && !hasNoPublicRepos && data?.username && (
          <div ref={calendarRef} className={`mt-12 pt-8 border-t ${s.border}`}>
            <GithubCalendarWidget 
              username={data.username} 
              variant={variant as CalendarThemeVariant} 
              colorScheme={s.calendarColorScheme}
              themeColor={themeColor}
            />
            <GithubActivityFeed 
              userId={userId} 
              themeColor={themeColor} 
            />
          </div>
        )}
      </div>
    </section>
  );
}
