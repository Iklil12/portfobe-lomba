"use client";

import React from 'react';
import Link from 'next/link';
import { ThemeSelectionModal } from './ThemeSelectionModal';
import { ProUpgradeModal } from '@/components/ProUpgradeModal';

import { ColorPicker, FontPicker, CardStylePicker, ButtonShapePicker } from '@/components/editor-controls/SharedControls';

export function EditorPanel({ state, actions }: { state: any, actions: any }) {
  const {
    isEditorCollapsed,
    isSaving,
    activeTheme,
    themeColor,
    fontHeading,
    fontBody,
    cardStyle,
    buttonShape,
    splashScreen,
    isThemeModalOpen,
    showProModal,
    isLoading,
    livePreviewData,
    favorites,
    subdomain: stateSubdomain
  } = state;

  const subdomain = stateSubdomain || livePreviewData?.subdomain;

  const userPlan = livePreviewData?.plan || 'FREE';

  const {
    setIsEditorCollapsed,
    saveDesign,
    setThemeColor,
    setFontHeading,
    setFontBody,
    setCardStyle,
    setButtonShape,
    setSplashScreen,
    setIsThemeModalOpen,
    setActiveTheme,
    setShowProModal,
    toggleFavorite
  } = actions;

  return (
    <>
      <ProUpgradeModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        feature={
          splashScreen ? "Fitur Cinematic Intro" :
            activeTheme === 'brutalism' ? "Tema Neo Brutalism" :
              activeTheme === 'cinematic' ? "Tema Cinematic Dark" :
                activeTheme === 'bentogrid' ? "Tema Bento Grid" :
                  activeTheme === 'spatial' ? "Tema Aura Spatial" :
                    activeTheme === 'monolith' ? "Tema Monolith Vanguard" :
                      activeTheme === 'acid' ? "Tema Acid Tech" : 
                        activeTheme === 'split' ? "Tema Nexus Split" : 
                          activeTheme === 'editorial' ? "Tema Editorial Clean" : undefined
        }
      />
      <ThemeSelectionModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        activeTheme={activeTheme}
        onSelectTheme={(themeId) => setActiveTheme(themeId)}
        favorites={favorites}
        userPlan={userPlan}
        onToggleFavorite={toggleFavorite}
      />

      <div className={`
        h-full flex flex-col z-30 relative shrink-0
        bg-white border-r border-neutral-200/70
        transition-all duration-300 ease-in-out
        ${isEditorCollapsed ? 'w-0 opacity-0 pointer-events-none overflow-hidden border-none' : 'w-full lg:w-[420px] xl:w-[460px] opacity-100'}
      `}>
        {/* Header Panel Editor */}
        <div className="p-6 border-b border-neutral-200/50 sticky top-0 z-20 shrink-0 bg-white/80 backdrop-blur-md">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="w-8 h-8 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200 shrink-0" title="Kembali ke Dashboard">
                <i className="fas fa-arrow-left text-[10px]"></i>
              </Link>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-neutral-900 tracking-tight leading-none">
                  Desain Visual
                </h1>
                <p className="text-[10px] text-neutral-500 font-medium mt-1 uppercase tracking-widest">
                  Pengaturan Tampilan
                </p>
              </div>
            </div>

            {/* Tombol Save Minimalist */}
            <button
              onClick={saveDesign}
              disabled={isSaving}
              className="px-5 py-2 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-200 bg-neutral-900 hover:bg-black text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isSaving ? <i className="fas fa-spinner animate-spin text-neutral-400"></i> : <i className="fas fa-check text-neutral-300"></i>}
              <span>{isSaving ? 'Menyimpan' : 'Simpan'}</span>
            </button>
          </div>
        </div>



        {/* Tombol Collapse Panel Editor */}
        <div className="absolute top-1/2 -right-[14px] -translate-y-1/2 z-[100] hidden lg:flex">
          <button onClick={() => setIsEditorCollapsed(true)} className="w-7 h-14 bg-white border border-neutral-200 shadow-sm rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all duration-200 hover:shadow-md" title="Sembunyikan Panel Editor">
            <i className="fas fa-chevron-left text-[10px]"></i>
          </button>
        </div>

        {/* Konten Menu Editor */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 pb-32 relative z-10">

          {/* SECTION: TEMA AKTIF */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">Basis Tema</h3>
              {!isLoading && (
                <button
                  onClick={() => setIsThemeModalOpen(true)}
                  className="text-[10px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors uppercase tracking-widest flex items-center gap-1"
                >
                  Ganti <i className="fas fa-chevron-right text-[8px]"></i>
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="p-5 rounded-2xl border border-neutral-100 bg-neutral-50 animate-pulse h-20"></div>
            ) : (
              <div 
                className="group cursor-pointer p-4 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm transition-all flex items-center justify-between"
                onClick={() => setIsThemeModalOpen(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white transition-transform group-hover:scale-105">
                    <i className={`fas ${activeTheme === 'minimalist' ? 'fa-align-left' : activeTheme === 'cinematic' ? 'fa-film' : activeTheme === 'acid' ? 'fa-bolt' : activeTheme === 'bentogrid' ? 'fa-th-large' : activeTheme === 'spatial' ? 'fa-star' : activeTheme === 'monolith' ? 'fa-cubes' : activeTheme === 'split' ? 'fa-columns' : activeTheme === 'editorial' ? 'fa-newspaper' : activeTheme === 'midnight-emulsion' ? 'fa-moon' : activeTheme === 'aura-kinetic' ? 'fa-water' : activeTheme === 'absolute-noir' ? 'fa-square' : 'fa-cube'} text-sm`}></i>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-900 text-sm tracking-tight">
                      {activeTheme === 'minimalist' ? 'Minimalist Clean' :
                        activeTheme === 'cinematic' ? 'Cinematic Dark' :
                          activeTheme === 'acid' ? 'Acid Punk' :
                            activeTheme === 'bentogrid' ? 'Bento Grid' :
                              activeTheme === 'spatial' ? 'Aura Spatial' :
                                activeTheme === 'monolith' ? 'Monolith Vanguard' :
                                  activeTheme === 'split' ? 'Nexus Split' :
                                    activeTheme === 'editorial' ? 'Editorial Clean' :
                                      activeTheme === 'midnight-emulsion' ? 'Midnight Emulsion' :
                                        activeTheme === 'aura-kinetic' ? 'Aura Kinetic' :
                                          activeTheme === 'absolute-noir' ? 'Absolute Noir' :
                                            'Neo Brutalism'}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium mt-0.5">
                      Sedang Digunakan
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DIVIDER */}
          <div className="flex items-center justify-center mb-10 opacity-70 relative">
            <div className="w-full h-px bg-neutral-200"></div>
            <div className="absolute bg-white px-3 text-[9px] font-semibold text-neutral-400 uppercase tracking-widest">Kustomisasi Lanjutan</div>
          </div>

          {/* KONTROL DINAMIS (TERSTANDARISASI) */}
          <div className="mb-10">
            {activeTheme === 'absolute-noir' && (
              <div className="p-4 mb-8 border border-neutral-200 bg-neutral-50 rounded-2xl flex items-start gap-3 animate-in fade-in duration-500">
                <i className="fas fa-exclamation-triangle mt-1 text-neutral-400"></i>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-800 mb-1">Strict Mode Active</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Absolute Noir menerapkan desain grayscale brutalist murni. Palet warna, bayangan, dan bentuk elemen dikunci untuk mempertahankan estetika khasnya.
                  </p>
                </div>
              </div>
            )}

            {/* Warna: Tersedia di semua tema kecuali Absolute Noir */}
            {activeTheme !== 'absolute-noir' && (
              <ColorPicker themeColor={themeColor} setThemeColor={setThemeColor} />
            )}

            {/* Font: Tersedia di semua tema */}
            <FontPicker fontHeading={fontHeading} setFontHeading={setFontHeading} setFontBody={setFontBody} />

            {/* Kartu & Tombol: Tersedia di semua tema kecuali Absolute Noir */}
            {activeTheme !== 'absolute-noir' && (
              <>
                <CardStylePicker cardStyle={cardStyle} setCardStyle={setCardStyle} />
                <ButtonShapePicker buttonShape={buttonShape} setButtonShape={setButtonShape} />
              </>
            )}
          </div>

          {/* TOGGLE SPLASH SCREEN */}
          {isLoading ? (
            <div className="border border-neutral-100 rounded-2xl p-5 h-20 animate-pulse mb-6"></div>
          ) : (
            <div 
              className="cursor-pointer border border-neutral-200 rounded-2xl p-5 mb-6 transition-all duration-200 hover:border-neutral-300 hover:shadow-sm bg-white flex items-center justify-between"
              onClick={() => setSplashScreen(!splashScreen)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${splashScreen ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                  <i className="fas fa-play text-[10px] ml-0.5"></i>
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-neutral-900 flex items-center gap-2">
                    Cinematic Intro
                    <span className="bg-neutral-100 border border-neutral-200 text-neutral-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">
                      PRO
                    </span>
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Animasi pembuka portofolio.</p>
                </div>
              </div>
              
              {/* Minimalist Switch */}
              <button className={`w-10 h-5 rounded-full relative transition-colors duration-300 shrink-0 outline-none ${splashScreen ? 'bg-neutral-900' : 'bg-neutral-200'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-[2px] transition-transform duration-300 shadow-sm ${splashScreen ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}></div>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* MOBILE FLOATING BUTTONS (Only on mobile) */}
      {!isEditorCollapsed && (
        <div className="lg:hidden">
          {subdomain && (
            <a 
              href={`/${subdomain}`} 
              target="_blank" 
              rel="noreferrer"
              className="fixed bottom-6 right-6 z-[100] px-6 py-3.5 bg-[#ff9e00] text-black font-black uppercase text-[10px] tracking-widest rounded-full shadow-[0_10px_30px_rgba(255,158,0,0.4)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 border-[2px] border-black"
            >
              <i className="fas fa-external-link-alt"></i> Live Preview
            </a>
          )}
        </div>
      )}
    </>
  );
}
