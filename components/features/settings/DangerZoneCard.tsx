import React from 'react';

interface DangerZoneCardProps {
  state: any;
  actions: any;
}

export function DangerZoneCard({ state, actions }: DangerZoneCardProps) {
  const { isDeleting } = state;
  const { setShowDeleteModal } = actions;

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8 mt-10 relative overflow-hidden group shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:border-rose-100 transition-colors animate-enter" style={{animationDelay: '450ms'}}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/0 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors duration-500 pointer-events-none"></div>
      <div className="relative z-10">
        <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-2">Zona Berbahaya</h4>
        <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-sm leading-relaxed">Tindakan ini akan menghapus akun dan semua karya di dalamnya secara permanen.</p>
      </div>
      <button onClick={() => setShowDeleteModal(true)} disabled={isDeleting} className={`relative z-10 shrink-0 font-extrabold text-[11px] uppercase tracking-widest bg-white text-rose-500 border border-rose-100 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-95 w-full sm:w-auto shadow-sm ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {isDeleting ? 'Menghapus...' : 'Hapus Akun'}
      </button>
    </div>
  );
}
