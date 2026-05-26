"use client";

import React, { useState, useEffect } from 'react';

const features = [
  {
    icon: 'fas fa-palette',
    title: 'Community Themes',
    desc: 'Temukan dan gunakan tema portofolio yang dibuat oleh kreator lain di komunitas Portfo.be.',
    color: 'bg-violet-50 text-violet-500 border-violet-100',
  },
  {
    icon: 'fas fa-upload',
    title: 'Publish Desainmu',
    desc: 'Bagikan tampilan portofoliomu ke komunitas dan dapatkan reputasi sebagai kreator terbaik.',
    color: 'bg-blue-50 text-blue-500 border-blue-100',
  },
  {
    icon: 'fas fa-star',
    title: 'Rating & Ulasan',
    desc: 'Beri penilaian dan ulasan jujur agar komunitas terus menghadirkan desain berkualitas.',
    color: 'bg-amber-50 text-amber-500 border-amber-100',
  },
  {
    icon: 'fas fa-bolt',
    title: 'Terapkan 1 Klik',
    desc: 'Gunakan desain apapun langsung ke portofoliomu — konten dan proyekmu tetap aman.',
    color: 'bg-emerald-50 text-emerald-500 border-emerald-100',
  },
];

const mockCards = [
  { label: 'Midnight Dev', user: '@arsyad', uses: '1.2K', tag: 'Dark · Developer' },
  { label: 'Clean Studio', user: '@linadesign', uses: '980', tag: 'Light · Designer' },
  { label: 'Bold Minimal', user: '@rizkiworks', uses: '754', tag: 'Minimal · Writer' },
  { label: 'Neon Coder', user: '@devhero_id', uses: '631', tag: 'Dark · Developer' },
  { label: 'Warm Lens', user: '@kirafoto', uses: '510', tag: 'Warm · Photographer' },
  { label: 'Type Editorial', user: '@rahmatype', uses: '412', tag: 'Light · Writer' },
];

export default function ExplorePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <main className="min-h-screen font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-24">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .animate-enter { opacity: 0; animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(24px) scale(0.98); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .skeleton-premium {
          background: linear-gradient(110deg, #f1f5f9 8%, #e2e8f0 18%, #f1f5f9 33%);
          background-size: 200% 100%;
          animation: 1.5s shine linear infinite;
        }
        @keyframes shine { to { background-position-x: -200%; } }
        .card-hover { transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
      `}} />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">

        {/* ── HEADER ── */}
        <div className="animate-enter mb-12" style={{animationDelay:'0ms'}}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-extrabold uppercase tracking-widest mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-400"></span>
            </span>
            Dalam Pengembangan
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Explore <span className="font-light text-slate-400">Community</span>
          </h1>
          <p className="text-slate-500 text-base font-medium max-w-lg leading-relaxed">
            Segera hadir — marketplace desain portofolio dari sesama kreator Portfo.be. Temukan, gunakan, dan bagikan desain terbaikmu.
          </p>
        </div>

        {/* ── FEATURE CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14 animate-enter" style={{animationDelay:'100ms'}}>
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] card-hover"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.color}`}>
                <i className={`${f.icon} text-[14px]`}></i>
              </div>
              <h3 className="font-extrabold text-slate-900 text-[14px] mb-1.5">{f.title}</h3>
              <p className="text-slate-500 text-[12px] leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ── PREVIEW BLUR SECTION ── */}
        <div className="animate-enter" style={{animationDelay:'200ms'}}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">Pratinjau Komunitas</h2>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">Begini tampilannya nanti</p>
            </div>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-400 text-[10px] font-extrabold rounded-full uppercase tracking-widest border border-slate-200">Segera</span>
          </div>

          {/* Blurred Grid Preview */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
            {/* Blur Overlay */}
            <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center justify-center mb-4">
                <i className="fas fa-compass text-2xl text-slate-300"></i>
              </div>
              <p className="font-extrabold text-slate-700 text-base mb-1">Komunitas Belum Dibuka</p>
              <p className="text-slate-400 text-sm font-medium text-center max-w-xs">
                Kami sedang membangun ekosistem komunitas terbaik untuk para kreator Portfo.be.
              </p>
            </div>

            {/* Mock Grid (behind blur) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-5 pointer-events-none select-none">
              {mockCards.map((card, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                  {/* Mock thumbnail */}
                  <div className="h-28 skeleton-premium"></div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-slate-900 text-[12px]">{card.label}</span>
                      <span className="text-[10px] font-bold text-slate-400">
                        <i className="fas fa-download text-[8px] mr-0.5"></i>{card.uses}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">{card.user}</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md font-bold">{card.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── NOTIFY BANNER ── */}
        <div className="animate-enter mt-10" style={{animationDelay:'300ms'}}>
          <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/70 text-[10px] font-extrabold uppercase tracking-widest mb-3">
                  <i className="fas fa-bell text-[#ff9e00]"></i> Dapatkan Notifikasi
                </div>
                <h3 className="font-extrabold text-white text-xl mb-1">Jadilah Kreator Pertama</h3>
                <p className="text-slate-400 text-sm font-medium">Saat Explore Community diluncurkan, desain kamu bisa langsung dikenal jutaan pengguna.</p>
              </div>
              <button
                onClick={() => {}}
                className="flex-shrink-0 bg-white text-slate-900 px-6 py-3 rounded-xl font-extrabold text-sm hover:bg-slate-100 active:scale-95 transition-all whitespace-nowrap"
              >
                <i className="fas fa-compass mr-2 text-[#ff9e00]"></i>
                Kabari Saya
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
