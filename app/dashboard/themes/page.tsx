"use client";

import React from 'react';
import { useThemes } from '@/hooks/useThemes';
import { ThemeSkeleton } from '@/components/features/themes/ThemeSkeleton';
import { ThemeHeader } from '@/components/features/themes/ThemeHeader';
import { ThemeGrid } from '@/components/features/themes/ThemeGrid';
import { ProBanner } from '@/components/features/themes/ProBanner';

const FILTER_TABS = [
  { id: 'all',       label: 'All Themes',   icon: 'fa-th-large' },
  { id: 'free',      label: 'Free',         icon: 'fa-gift' },
  { id: 'pro',       label: 'Pro',          icon: 'fa-crown' },
  { id: 'favorites', label: 'Favorit',      icon: 'fa-heart' },
] as const;

export default function ThemesPage() {
  const { state, actions, themes } = useThemes();
  const { activeFilter, favorites } = state;
  const { setActiveFilter } = actions;

  if (state.isLoading) return <ThemeSkeleton />;

  // Filter logic
  const availableThemes = themes.filter(t => t.isAvailable !== false);
  const favoriteThemes = themes.filter(t => favorites.includes(t.id));

  const filteredThemes = (() => {
    let list = themes;
    if (activeFilter === 'free')      list = availableThemes.filter(t => !t.isPro);
    else if (activeFilter === 'pro')  list = availableThemes.filter(t => t.isPro);
    else if (activeFilter === 'favorites') list = favoriteThemes;
    
    // Sort: Tema yang sedang aktif berada di urutan pertama
    return [...list].sort((a, b) => {
      if (a.id === state.currentTheme) return -1;
      if (b.id === state.currentTheme) return 1;
      return 0;
    });
  })();

  return (
    <main className="min-h-screen font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0;
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(40px) scale(0.98); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes scrollHint {
            0%, 100% { transform: translateX(0); opacity: 0.5; }
            50%       { transform: translateX(3px); opacity: 1; }
        }
        .scroll-hint-icon { animation: scrollHint 1.4s ease-in-out 1.2s 3; }
      `}} />

      <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
        <ThemeHeader state={state} />

        {/* ── TAB FILTER ── */}
        <div className="relative mb-10 animate-enter" style={{ animationDelay: '120ms' }}>
          {/* scroll-hint: right fade + chevron — mobile only */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10 md:hidden flex items-center justify-end pr-1.5"
            style={{ background: 'linear-gradient(to left, rgba(248,250,252,0.98) 20%, transparent)' }}
          >
            <i className="scroll-hint-icon fas fa-chevron-right text-[9px] text-slate-400" />
          </div>

          <div
            role="tablist"
            className="flex items-center gap-1 bg-slate-100/80 rounded-2xl p-1.5
              overflow-x-auto hide-scrollbar w-full md:w-auto md:inline-flex"
          >
            {FILTER_TABS.map(tab => {
              const isActive = activeFilter === tab.id;
              const count = tab.id === 'all'
                ? themes.length
                : tab.id === 'free'
                ? themes.filter(t => !t.isPro && t.isAvailable).length
                : tab.id === 'pro'
                ? themes.filter(t => t.isPro).length
                : favorites.length;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`
                    relative flex items-center gap-2
                    px-4 py-2.5 rounded-xl
                    text-[12px] font-bold tracking-wide whitespace-nowrap shrink-0
                    transition-all duration-200 select-none
                    ${isActive
                      ? 'bg-white text-slate-900 shadow-sm shadow-slate-200/80'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                    }
                  `}
                >
                  <i className={`fas ${tab.icon} text-[10px] ${isActive ? 'text-slate-600' : 'text-slate-400'}`} />
                  {tab.label}
                  {count > 0 && (
                    <span className={`
                      text-[10px] font-black min-w-[18px] h-[18px] px-1.5 rounded-md
                      inline-flex items-center justify-center leading-none
                      ${isActive ? 'bg-slate-100 text-slate-600' : 'bg-slate-200/60 text-slate-400'}
                    `}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {filteredThemes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
              <i className={`fas ${activeFilter === 'favorites' ? 'fa-heart-broken' : 'fa-ghost'} text-3xl text-slate-300`}></i>
            </div>
            <p className="font-extrabold text-slate-700 text-xl mb-2">
              {activeFilter === 'favorites' ? 'Belum ada favorit' : 'Tidak ada tema'}
            </p>
            <p className="text-slate-400 text-sm font-medium">
              {activeFilter === 'favorites'
                ? 'Klik ikon ♡ pada tema yang kamu suka untuk menyimpannya di sini.'
                : 'Coba filter lain atau nantikan koleksi tema terbaru.'}
            </p>
          </div>
        ) : (
          <ThemeGrid themes={filteredThemes} state={state} actions={actions} />
        )}

        <ProBanner actions={actions} />
      </div>
    </main>
  );
}