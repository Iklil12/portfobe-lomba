import React from 'react';

export function ThemeHeader({ state }: { state: any }) {
  const { subdomain } = state;

  return (
    <div className="mb-12 animate-enter flex flex-col md:flex-row md:justify-between md:items-end gap-6 mt-4">
      <div className="text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-6 shadow-sm">
          <i className="fas fa-layer-group text-slate-400"></i> Desain Visual
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 flex items-center justify-center md:justify-start gap-3">
          Koleksi Tema.
          <i className="fas fa-palette text-slate-300 text-[1.5rem] md:text-[2rem] animate-spin-slow"></i>
        </h1>
        <p className="text-slate-500 font-medium text-sm sm:text-base max-w-xl leading-relaxed">
          Tentukan fondasi estetika portofoliomu. Klik salah satu tema untuk mulai merakit dan mendesain.
        </p>
      </div>
      
      {subdomain && (
        <div className="flex justify-center md:justify-end">
          <a 
            href={`/${subdomain}`} 
            target="_blank" 
            rel="noreferrer"
            className="group inline-flex items-center gap-3 px-7 py-4 bg-white border border-slate-200 text-slate-900 rounded-full text-[11px] font-extrabold uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all duration-500 shadow-sm hover:shadow-md active:scale-95"
          >
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <i className="fas fa-external-link-alt text-slate-500 group-hover:text-slate-800 transition-colors"></i>
            </div>
            Lihat Portofolio
          </a>
        </div>
      )}
    </div>
  );
}
