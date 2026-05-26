import React, { useState } from 'react';
import { THEMES_DATA } from '@/lib/themes';
import { ThemeGrid } from '../themes/ThemeGrid';
import { AnimatePresence, motion } from 'framer-motion';

interface ThemeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: string;
  onSelectTheme: (themeId: string) => void;
  favorites?: string[];
  userPlan?: string;
  onToggleFavorite?: (themeId: string) => void;
}

const FILTER_TABS = [
  { id: 'all',       label: 'All Themes',   icon: 'fa-th-large' },
  { id: 'free',      label: 'Free',         icon: 'fa-gift' },
  { id: 'pro',       label: 'Pro',          icon: 'fa-crown' },
  { id: 'favorites', label: 'Favorit',      icon: 'fa-heart' },
] as const;

export function ThemeSelectionModal({ 
  isOpen, 
  onClose, 
  activeTheme, 
  onSelectTheme, 
  favorites = [], 
  userPlan = 'FREE',
  onToggleFavorite
}: ThemeSelectionModalProps) {
  const [isSwitching, setIsSwitching] = useState(false);
  const [targetTheme, setTargetTheme] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'pro' | 'favorites'>('all');

  // Filter logic
  const availableThemes = THEMES_DATA.filter(t => t.isAvailable !== false);
  const favoriteThemes = THEMES_DATA.filter(t => favorites.includes(t.id));

  const filteredThemes = (() => {
    let list = THEMES_DATA;
    if (activeFilter === 'free')      list = availableThemes.filter(t => !t.isPro);
    else if (activeFilter === 'pro')  list = availableThemes.filter(t => t.isPro);
    else if (activeFilter === 'favorites') list = favoriteThemes;
    
    // Sort: Tema yang sedang aktif berada di urutan pertama
    return [...list].sort((a, b) => {
      if (a.id === activeTheme) return -1;
      if (b.id === activeTheme) return 1;
      return 0;
    });
  })();

  // Mock actions for ThemeGrid
  const actions = {
    handleUseTheme: (themeId: string, themeName: string) => {
      const theme = THEMES_DATA.find(t => t.id === themeId);
      if (theme && !theme.isAvailable) return;

      setTargetTheme(themeName);
      setIsSwitching(true);
      
      // Simulate smooth transition loading
      setTimeout(() => {
        onSelectTheme(themeId);
        setTimeout(() => {
          setIsSwitching(false);
          setTargetTheme(null);
          onClose();
        }, 600); // Wait for UI to update before closing
      }, 800); // 800ms "fake" loading for premium feel
    },
    toggleFavorite: (themeId: string) => {
      if (onToggleFavorite) onToggleFavorite(themeId);
    }
  };

  const state = {
    currentTheme: activeTheme,
    favorites: favorites
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000001] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={!isSwitching ? onClose : undefined}
          ></motion.div>

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-6xl h-[90vh] bg-[#FAFAFA] rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col"
          >
            {/* Loading Overlay */}
            <AnimatePresence>
              {isSwitching && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center"
                >
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                      <i className="fas fa-magic text-indigo-600 text-xl animate-pulse"></i>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Menerapkan Tema...</h3>
                    <p className="text-sm font-medium text-slate-500">Menyesuaikan tata letak untuk {targetTheme}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-200/60 shrink-0 bg-white/80 backdrop-blur-xl relative z-40">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pilih Tema Basis</h2>
                  <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Eksplorasi berbagai gaya visual untuk portofolio Anda.</p>
                </div>
                <button 
                  onClick={!isSwitching ? onClose : undefined}
                  disabled={isSwitching}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all active:scale-90 disabled:opacity-50 disabled:hover:bg-slate-100 disabled:hover:text-slate-400"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                {FILTER_TABS.map(tab => {
                  const isActive = activeFilter === tab.id;
                  const count = tab.id === 'all'
                    ? THEMES_DATA.length
                    : tab.id === 'free'
                    ? THEMES_DATA.filter(t => !t.isPro && t.isAvailable).length
                    : tab.id === 'pro'
                    ? THEMES_DATA.filter(t => t.isPro).length
                    : favorites.length;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 border whitespace-nowrap shrink-0
                        ${isActive
                          ? tab.id === 'favorites'
                            ? 'bg-rose-500 text-white border-rose-500 shadow-lg'
                            : 'bg-slate-900 text-white border-slate-900 shadow-lg'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                    >
                      <i className={`fas ${tab.icon} text-[10px] ${isActive && tab.id === 'favorites' ? 'text-white' : tab.id === 'pro' && isActive ? 'text-[#ff9e00]' : ''}`}></i>
                      {tab.label}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-lg font-black ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative z-30">
              {filteredThemes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
                    <i className={`fas ${activeFilter === 'favorites' ? 'fa-heart-broken' : 'fa-ghost'} text-2xl text-slate-300`}></i>
                  </div>
                  <p className="font-extrabold text-slate-700 text-lg mb-1">
                    {activeFilter === 'favorites' ? 'Belum ada favorit' : 'Tidak ada tema'}
                  </p>
                  <p className="text-slate-400 text-[11px] font-medium max-w-[200px] mx-auto">
                    {activeFilter === 'favorites'
                      ? 'Klik ikon ♡ pada tema untuk menyimpannya.'
                      : 'Coba filter lain.'}
                  </p>
                </div>
              ) : (
                <ThemeGrid themes={filteredThemes} state={state} actions={actions} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
