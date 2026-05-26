import React from 'react';

interface EmailCredentialCardProps {
  state: any;
  actions: any;
}

export function EmailCredentialCard({ state, actions }: EmailCredentialCardProps) {
  const { session, isOAuthLinked } = state;
  const { setShowEmailModal } = actions;

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 animate-enter" style={{animationDelay: '250ms'}}>
      <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-2">Email Kredensial</h4>
      <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6 sm:mb-8 leading-relaxed max-w-md">Alamat email utama yang tertaut dengan akun Portfo.be Anda.</p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <i className="fas fa-envelope text-slate-400 text-sm"></i>
          </div>
          <input type="email" value={session?.user?.email || "Memuat..."} disabled className="w-full pl-12 pr-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-600 font-bold text-sm outline-none cursor-not-allowed" />
        </div>
        <button 
          onClick={() => setShowEmailModal(true)} 
          disabled={isOAuthLinked}
          className={`w-full sm:w-auto px-8 py-3.5 sm:py-4 text-[11px] font-extrabold uppercase tracking-widest rounded-xl sm:rounded-2xl transition-all flex items-center justify-center shrink-0 shadow-sm
            ${isOAuthLinked 
              ? 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed' 
              : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 active:scale-95'
            }
          `}
        >
          {isOAuthLinked ? <><i className="fab fa-google mr-2 text-slate-300"></i> Terkunci (Google)</> : 'Ubah Email'}
        </button>
      </div>
      {isOAuthLinked && (
        <p className="text-[10px] text-slate-400 font-medium mt-3 italic">
          *Akun ini ditautkan dengan kredensial Google OAuth. Email tidak dapat diubah.
        </p>
      )}
    </div>
  );
}
