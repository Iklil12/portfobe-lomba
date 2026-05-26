import React from 'react';

interface EmptyLinksProps {
  state: any;
  actions: any;
}

export function EmptyLinks({ state, actions }: EmptyLinksProps) {
  const { isAdding } = state;
  const { addLink } = actions;

  return (
    <div className="py-20 sm:py-24 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 hover:border-slate-300 transition-colors animate-enter" style={{animationDelay: '200ms'}}>
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300 text-2xl shadow-sm">
        <i className="fas fa-link"></i>
      </div>
      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 tracking-tight">Belum ada tautan.</h3>
      <p className="text-xs sm:text-sm font-medium text-slate-500 mb-8 max-w-xs leading-relaxed px-4">
        Tambahkan tautan portofolio, sosial media, atau email Anda di sini untuk memudahkan klien menghubungi Anda.
      </p>
      <button 
        onClick={addLink} 
        disabled={isAdding}
        className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest bg-slate-900 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full hover:bg-slate-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-50"
      >
        <i className="fas fa-plus"></i> Tambah Tautan Pertama
      </button>
    </div>
  );
}
