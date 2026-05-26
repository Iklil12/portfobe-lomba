"use client";

import React, { useState, useRef, useCallback } from 'react';
import { LazyImage } from '@/components/ui/LazyImage';
import PortfolioView from '@/components/PortfolioView';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion'; // Tambahkan framer-motion

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function ThemeGrid({ themes, state, actions }: { themes: any[], state: any, actions: any }) {
    const { currentTheme, favorites = [] } = state;
    const { handleUseTheme, toggleFavorite } = actions;
    const [hoveredThemeId, setHoveredThemeId] = useState<string | null>(null);
    // Debounce ref agar hover tidak flicker saat mouse gerak di atas child elements
    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = useCallback((id: string) => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => setHoveredThemeId(id), 80);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => setHoveredThemeId(null), 80);
    }, []);

    // Ambil data lengkap untuk Live Preview (hanya nge-fetch sekali berkat SWR cache)
    const { data: fullProfileData } = useSWR('/api/appearance', fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 60000
    });

    // Ambil total like dari semua user (aggregate stats)
    const { data: themeStats } = useSWR<Record<string, number>>('/api/themes/stats', fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 30000 // refresh setiap 30 detik
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24">
            {themes.map((theme, index) => {
                const isActive = currentTheme === theme.id;
                const isFavorite = favorites.includes(theme.id);
                const isHovered = hoveredThemeId === theme.id;

                return (
                    <div
                        key={theme.id}
                        onMouseEnter={() => handleMouseEnter(theme.id)}
                        onMouseLeave={handleMouseLeave}
                        className="group flex flex-col gap-3 animate-enter"
                        style={{ animationDelay: `${(index + 1) * 150}ms` }}
                    >
                        {/* 1. IMAGE CONTAINER (Dribbble Style 4:3 Aspect Ratio) */}
                        <div className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden transition-all duration-500
                    ${isActive ? 'border-[3px] border-slate-900 shadow-md scale-[1.02] ring-4 ring-slate-900/5 z-10' :
                                theme.isAvailable ? 'border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 z-0 hover:z-10' :
                                    'border border-slate-200/60 opacity-80 z-0'} 
                `}>

                            {/* BACKGROUND / CROSSFADE LIVE PREVIEW VS STATIC IMAGE */}
                            <div className="absolute inset-0 bg-slate-50 overflow-hidden">

                                {/* AnimatePresence mode=sync: crossfade tanpa blank frame */}
                                <AnimatePresence mode="sync">
                                    {isHovered && fullProfileData && theme.isAvailable ? (
                                        // LIVE PREVIEW STATE
                                        <motion.div
                                            key="live-preview"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="absolute inset-0 z-10 origin-top-left pointer-events-none"
                                            style={{ width: '400%', height: '400%', transform: 'scale(0.25)' }}
                                        >
                                            <PortfolioView
                                                data={fullProfileData}
                                                theme={{
                                                    themeTemplate: theme.id,
                                                    themeColor: fullProfileData.siteAppearance?.themeColor || '#000000',
                                                    fontHeading: fullProfileData.siteAppearance?.fontHeading || 'Space Mono',
                                                    fontBody: fullProfileData.siteAppearance?.fontBody || 'Inter',
                                                    buttonShape: fullProfileData.siteAppearance?.buttonShape || 'hard',
                                                    cardStyle: fullProfileData.siteAppearance?.cardStyle || 'hard-shadow',
                                                    splashScreen: false
                                                }}
                                                isCardPreview={true}
                                            />
                                        </motion.div>
                                    ) : (
                                        // STATIC IMAGE STATE
                                        <motion.div
                                            key="static-image"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="absolute inset-0 z-0"
                                        >
                                            {theme.img ? (
                                                <LazyImage
                                                    src={theme.img}
                                                    className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear group-hover:scale-110 ${!theme.isAvailable && 'blur-[2px] grayscale'}`}
                                                    alt={theme.name}
                                                />
                                            ) : (
                                                theme.content
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* HOVER OVERLAY (Gradient & Buttons) */}
                            {/* PERUBAHAN: opacity-100 di mobile agar tombol selalu terlihat, md:opacity-0 untuk efek hover di desktop */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-between p-4 pointer-events-none">

                                {/* TOP SECTION: FAVORITE BUTTON */}
                                <div className="flex justify-end pointer-events-auto">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(theme.id); }}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                                    ${isFavorite
                                                ? 'bg-white text-rose-500 scale-110'
                                                : 'bg-white/90 text-slate-400 hover:text-slate-900 hover:bg-white'
                                            }`}
                                        title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                                    >
                                        <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-[13px]`}></i>
                                    </button>
                                </div>

                                {/* BOTTOM SECTION: TITLE & ACTION BUTTON */}
                                {/* PERUBAHAN: translate-y-0 di mobile agar tidak tertutup, md:translate-y-4 untuk efek slide up di desktop */}
                                <div className="flex justify-between items-end transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
                                    <span className="text-white font-bold truncate pr-4 text-sm drop-shadow-md">
                                        {theme.name}
                                    </span>

                                    <button
                                        onClick={() => handleUseTheme(theme.id, theme.name)}
                                        disabled={!theme.isAvailable && !isActive}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-2 active:scale-95 shadow-lg
                                ${isActive
                                                ? 'bg-slate-900 text-white hover:bg-black border border-slate-700'
                                                : theme.isAvailable
                                                    ? 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200'
                                                    : 'bg-slate-800/80 text-white/50 cursor-not-allowed border border-slate-700/50'
                                            }
                                `}
                                    >
                                        {theme.isAvailable ? (
                                            isActive ? (
                                                <> <i className="fas fa-cog"></i> Kustomisasi </>
                                            ) : (
                                                <> <i className="fas fa-magic"></i> Gunakan </>
                                            )
                                        ) : (
                                            <span className="text-white/40 italic">Coming Soon</span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Coming Soon Badge Overlay (Center) */}
                            {!theme.isAvailable && isHovered && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                                    <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl transform scale-110">
                                        <span className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3">
                                            <i className="fas fa-lock text-[#FFD700]"></i>
                                            Coming Soon
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. OUTSIDE FOOTER (Dribbble Style Meta Data) */}
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2 min-w-0">
                                {/* Creator Avatar / Initial */}
                                <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[8px] font-black shrink-0">
                                    <i className="fas fa-paint-brush"></i>
                                </div>

                                {/* Theme Name */}
                                <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                                    {theme.name}
                                </span>

                                {/* Badges */}
                                {theme.isPro && (
                                    <span className="bg-slate-950 text-[#FFD700] border border-[#FFD700]/30 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shrink-0 shadow-sm">
                                        Pro
                                    </span>
                                )}
                                {isActive && (
                                    <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shrink-0 shadow-sm">
                                        Aktif
                                    </span>
                                )}
                            </div>

                            {/* Stats: Total like dari semua user */}
                            <div className="flex items-center gap-3 text-slate-400 text-[11px] font-semibold shrink-0">
                                <span
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(theme.id); }}
                                    className={`flex items-center gap-1 cursor-pointer transition-colors ${
                                        isFavorite ? 'text-rose-500 hover:text-rose-400' : 'hover:text-rose-400'
                                    }`}
                                    title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                                >
                                    <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
                                    <span>{(themeStats?.[theme.id] ?? 0).toLocaleString('id-ID')}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 3. PLACEHOLDER / SKELETON: Tema Lainnya (Dribbble Style) */}
            <div
                className="group flex flex-col gap-3 animate-enter"
                style={{ animationDelay: '600ms' }}
            >
                <div className="relative w-full aspect-[4/3] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-500 group cursor-default">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 group-hover:bg-slate-900">
                        <i className="fas fa-paint-brush text-slate-400 group-hover:text-white transition-colors"></i>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-6">Lagi Dimasak Oleh<br />Desainer</p>
                </div>

                <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] text-slate-400">
                            <i className="fas fa-clock"></i>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-300">Tema Lainnya...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}