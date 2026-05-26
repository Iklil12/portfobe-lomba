"use client";

import React from 'react';
import Link from 'next/link';

export function OfflineModal({ setShowOfflineModal }: { setShowOfflineModal: (show: boolean) => void }) {
  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-500" onClick={() => setShowOfflineModal(false)}></div>
      <div className="relative bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-100 animate-in zoom-in-95 fade-in duration-300 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 shadow-inner text-rose-500 rounded-full flex items-center justify-center mb-6 relative">
          <i className="fas fa-eye-slash text-xl"></i>
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Desain Disimpan.</h3>
        <p className="text-slate-500 mb-8 text-[13px] font-medium leading-relaxed">
          Namun, web portofolio Anda saat ini sedang berstatus <span className="font-bold text-rose-500">Offline</span>.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <Link href="/dashboard/settings" className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all text-xs uppercase tracking-widest shadow-[0_5px_15px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2">
            <i className="fas fa-globe"></i> Aktifkan Web Sekarang
          </Link>
          <button onClick={() => setShowOfflineModal(false)} className="w-full py-4 rounded-xl font-bold text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-700 active:scale-95 transition-all text-xs uppercase tracking-widest">
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
