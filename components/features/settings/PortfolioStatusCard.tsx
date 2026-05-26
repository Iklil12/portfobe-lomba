import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { resendVerificationEmail } from '@/app/actions/auth';

interface PortfolioStatusCardProps {
  state: any;
  actions: any;
}

export function PortfolioStatusCard({ state, actions }: PortfolioStatusCardProps) {
  const { isLive, isLoadingStatus, session } = state;
  const { toggleStatus } = actions;
  const [isResending, setIsResending] = useState(false);

  // Check verification status from NextAuth Session
  const isVerified = session?.user?.isEmailVerified;

  const handleResend = async () => {
    if (!session?.user?.email) return;
    setIsResending(true);
    const toastId = toast.loading("Mengirim ulang email...");
    
    try {
      const result = await resendVerificationEmail(session.user.email);
      if (result?.error) {
        toast.error(result.error, { id: toastId });
      } else {
        toast.success("Email verifikasi terkirim! Silakan cek kotak masuk/spam Anda.", { id: toastId, duration: 6000 });
      }
    } catch (e) {
      toast.error("Gagal mengirim email.", { id: toastId });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 animate-enter" style={{animationDelay: '150ms'}}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          {isLoadingStatus ? (
            <div className="w-48 h-6 shimmer rounded-md"></div>
          ) : (
            <>
              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Status Portofolio</h4>
              {isLive ? (
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition-all">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse relative before:absolute before:inset-0 before:bg-emerald-500 before:rounded-full before:animate-ping"></span> Live
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-400 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition-all">
                   <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Offline
                </span>
              )}
            </>
          )}
        </div>
        
        {isLoadingStatus ? (
          <div className="w-full max-w-sm h-4 shimmer rounded-md mt-3"></div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
            {isLive ? "Website portofolio Anda saat ini dapat dikunjungi oleh publik." : "Website Anda saat ini sedang disembunyikan dari publik."}
          </p>
        )}
      </div>
      
      {isLoadingStatus ? (
        <div className="w-14 h-8 shimmer rounded-full shrink-0"></div>
      ) : (
        <button onClick={toggleStatus} disabled={isLoadingStatus} className={`shrink-0 w-14 h-8 rounded-full p-1 relative shadow-inner transition-colors duration-300 ${isLive ? 'bg-slate-900' : 'bg-slate-200 hover:bg-slate-300'} ${isLoadingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
           <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${isLive ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
      )}
      </div>

      {/* WARNING VERIFIKASI */}
      {!isLoadingStatus && isVerified === false && (
        <div className="mt-6 p-4 sm:p-5 bg-orange-50/80 border border-orange-200/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100/80 flex items-center justify-center shrink-0">
              <i className="fas fa-exclamation-triangle text-orange-500 text-sm"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Email Belum Diverifikasi</p>
              <p className="text-xs text-slate-500 font-medium max-w-sm mt-0.5 leading-relaxed">Anda tidak dapat menyalakan portofolio (Live) ke publik sebelum memverifikasi email Anda.</p>
            </div>
          </div>
          <button 
            onClick={handleResend}
            disabled={isResending}
            className={`shrink-0 w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition-all ${isResending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 hover:border-slate-300 active:scale-95'}`}
          >
            {isResending ? 'Mengirim...' : 'Kirim Ulang Email'}
          </button>
        </div>
      )}
    </div>
  );
}
