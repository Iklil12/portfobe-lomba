import React from 'react';

export function ProfileHeader() {
  return (
    <div className="mb-10 sm:mb-12 animate-enter text-center md:text-left" style={{animationDelay: '100ms'}}>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-5 shadow-sm">
        <i className="fas fa-id-card text-slate-400"></i> Identitas Publik
      </div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-3 flex items-center justify-center md:justify-start gap-3">
        Profil & Bio.
        <i className="fas fa-asterisk text-slate-300 text-[1.2rem] md:text-[1.8rem] animate-spin-slow"></i>
      </h1>
      <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-lg mx-auto md:mx-0">Kelola identitas publik dan informasi spesialisasi Anda.</p>
    </div>
  );
}
