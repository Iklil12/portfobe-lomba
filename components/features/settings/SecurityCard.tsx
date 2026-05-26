import React from 'react';

interface SecurityCardProps {
  state: any;
  actions: any;
}

export function SecurityCard({ state, actions }: SecurityCardProps) {
  const { isStrictlyGoogle } = state;
  const { setShowPasswordModal } = actions;

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 animate-enter" style={{animationDelay: '350ms'}}>
      <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-2">Keamanan Kata Sandi</h4>
      <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6 sm:mb-8 leading-relaxed max-w-md">
          {isStrictlyGoogle ? "Buat kata sandi agar Anda bisa login manual tanpa harus selalu menggunakan Google." : "Ubah kata sandi Anda secara berkala untuk mencegah akses yang tidak sah."}
      </p>
      <button 
        onClick={() => setShowPasswordModal(true)} 
        className={`w-full sm:w-auto px-8 py-3.5 sm:py-4 text-[11px] font-extrabold uppercase tracking-widest rounded-xl sm:rounded-2xl transition-all active:scale-95 flex items-center justify-center sm:justify-start gap-2 shadow-sm
          ${isStrictlyGoogle ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'}
        `}
      >
        <i className={isStrictlyGoogle ? "fas fa-key" : "fas fa-lock"}></i> 
        {isStrictlyGoogle ? 'Buat Sandi Lokal' : 'Perbarui Sandi'}
      </button>
    </div>
  );
}
