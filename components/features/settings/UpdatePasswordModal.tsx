import React, { useState } from 'react';

interface UpdatePasswordModalProps {
  state: any;
  actions: any;
}

export function UpdatePasswordModal({ state, actions }: UpdatePasswordModalProps) {
  const { showPasswordModal, isUpdatingPassword, isStrictlyGoogle, isSuccessModal, successData } = state;
  const { setShowPasswordModal, setIsSuccessModal, handleUpdatePassword, handleInternalForgotPassword } = actions;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!showPasswordModal) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleUpdatePassword(currentPassword, newPassword, confirmPassword);
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={() => {
            if (!isUpdatingPassword) {
                setShowPasswordModal(false);
                setTimeout(() => setIsSuccessModal(false), 300); // Reset state saat tutup
            }
        }}
      ></div>
      <div className="relative w-full max-w-md bg-white/60 backdrop-blur-xl p-2 md:p-3 rounded-[32px] shadow-2xl border border-white/40 animate-in zoom-in-95 fade-in duration-300 z-10">
        <div className="bg-white rounded-[24px] p-6 md:p-8 w-full shadow-sm border border-slate-100 overflow-hidden">
        
        {isSuccessModal ? (
            /* --- TAMPILAN SUKSES ELEGAN --- */
            <div className="flex flex-col items-center justify-center py-4 text-center animate-in zoom-in-95 fade-in duration-500">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border-4 border-emerald-100 rounded-full animate-ping opacity-50"></div>
                <i className="fas fa-check text-3xl text-emerald-500"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                {successData.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 px-4">
                {successData.desc}
              </p>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setTimeout(() => setIsSuccessModal(false), 300);
                }} 
                className="w-full bg-[#ff9e00] text-white py-3.5 rounded-full text-sm font-bold tracking-wide hover:bg-[#ff9e00]/90 transition-all active:scale-[0.98] shadow-[0_8px_20px_rgba(255,158,0,0.3)]"
              >
                Selesai
              </button>
            </div>
        ) : (
            /* --- TAMPILAN FORM ASLI --- */
            <>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{isStrictlyGoogle ? "Buat Sandi Lokal" : "Perbarui Sandi"}</h3>
                <p className="text-slate-500 mb-8 text-sm font-medium leading-relaxed">
                  {isStrictlyGoogle ? "Buat kata sandi agar Anda bisa login menggunakan email ini tanpa melalui Google." : "Pastikan kata sandi baru Anda unik dan aman."}
                </p>
                
                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                  {!isStrictlyGoogle && (
                    <div>
                      <div className="flex justify-between items-end mb-2 ml-3 pr-3">
                        <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Sandi Saat Ini</label>
                        <button 
                          type="button"
                          onClick={handleInternalForgotPassword}
                          className="text-[10px] text-[#ff9e00] font-bold hover:underline transition-all"
                        >
                          Lupa sandi saat ini?
                        </button>
                      </div>
                      <div className="relative">
                        <i className="fas fa-unlock absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold text-slate-700 outline-none focus:border-[#ff9e00] focus:ring-[3px] focus:ring-[#ff9e00]/20 focus:bg-white transition-all hover:border-slate-300" placeholder="Sandi lama Anda" />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-3">Sandi Baru</label>
                    <div className="relative">
                      <i className="fas fa-key absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold text-slate-700 outline-none focus:border-[#ff9e00] focus:ring-[3px] focus:ring-[#ff9e00]/20 focus:bg-white transition-all hover:border-slate-300" placeholder="Minimal 6 karakter" />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-3">Konfirmasi Sandi</label>
                    <div className="relative">
                      <i className="fas fa-check-double absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold text-slate-700 outline-none focus:border-[#ff9e00] focus:ring-[3px] focus:ring-[#ff9e00]/20 focus:bg-white transition-all hover:border-slate-300" placeholder="Ulangi sandi baru" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowPasswordModal(false)} disabled={isUpdatingPassword} className="flex-1 py-3.5 rounded-full font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all text-sm">Batal</button>
                    <button type="submit" disabled={isUpdatingPassword} className="flex-1 py-3.5 rounded-full font-bold text-white bg-[#ff9e00] hover:bg-[#ff9e00]/90 transition-all flex items-center justify-center gap-2 text-sm shadow-[0_8px_20px_rgba(255,158,0,0.3)]">
                      {isUpdatingPassword ? <i className="fas fa-circle-notch animate-spin text-white/70"></i> : 'Simpan Sandi'}
                    </button>
                  </div>
                </form>
            </>
        )}
        </div>
      </div>
    </div>
  );
}
