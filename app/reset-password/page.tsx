//app/reset-password/page.tsx
"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setStatus({ type: "error", message: "Token reset tidak ditemukan. Silakan minta link baru." });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: "error", message: "Sandi minimal harus 6 karakter." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Konfirmasi sandi tidak cocok." });
      return;
    }

    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setStatus({ type: "success", message: "Sandi berhasil diperbarui! Mengalihkan ke halaman login..." });
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setStatus({ type: "error", message: data.error || "Gagal mereset sandi." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Terjadi kesalahan server." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess && !status.message) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
          <i className="fas fa-link-slash"></i>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Link Tidak Valid</h2>
        <p className="text-slate-500 mb-8 text-sm font-medium">Link reset password tidak ditemukan atau formatnya salah.</p>
        <Link href="/login" className="bg-slate-900 text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-all">
          Kembali ke Login
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Berhasil!</h2>
        <p className="text-slate-500 mb-8 text-sm font-medium">{status.message}</p>
        <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-slate-900">Buat Sandi Baru</h1>
        <p className="text-slate-500 text-sm md:text-base font-medium">Pastikan kata sandi baru Anda kuat dan unik.</p>
      </div>

      {status.message && (
        <div className={`mb-6 p-4 rounded-2xl text-sm font-bold border flex items-start gap-3 ${status.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${status.type === 'error' ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-500'}`}>
             <i className={`fas ${status.type === 'error' ? 'fa-exclamation-circle' : 'fa-check'}`}></i>
          </div>
          <p className="mt-1">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-6">
        <div className="group">
          <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Sandi Baru</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 karakter" 
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-800 tracking-widest placeholder:tracking-normal" 
              required 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ff9e00] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-50">
              <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
            </button>
          </div>
        </div>

        <div className="group">
          <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Konfirmasi Sandi Baru</label>
          <input 
            type={showPassword ? "text" : "password"} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi sandi baru" 
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-800 tracking-widest placeholder:tracking-normal" 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full relative bg-slate-900 text-white py-4 rounded-2xl text-[13px] font-bold tracking-wide overflow-hidden transition-all duration-300 transform active:scale-[0.98] ${isLoading ? 'bg-slate-800' : 'hover:bg-[#ff9e00] hover:text-black hover:shadow-[0_15px_30px_rgba(255,158,0,0.3)] hover:-translate-y-0.5'}`}
        >
          <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            Simpan Sandi Baru <i className="fas fa-check text-[10px] ml-1"></i>
          </div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-[#FAFAFA] text-slate-900 flex min-h-screen font-sans selection:bg-[#ff9e00]/30 selection:text-slate-900">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />

      <div className="w-full lg:w-[55%] bg-white flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-40 relative z-10 shadow-[20px_0_50px_rgba(0,0,0,0.03)]">
        <Link href="/" className="absolute top-10 left-8 sm:left-16 md:left-24 xl:left-40 group">
          <img src="/portfo.be.png" alt="Logo" className="h-7 md:h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
        </Link>
        <div className="w-full max-w-md mx-auto py-12 mt-12 md:mt-0">
          <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[45%] relative bg-[#0a0a0a] items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#ff9e00]/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 w-full max-w-md text-center">
           <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md border border-white/20">
              <i className="fas fa-shield-alt text-4xl text-white"></i>
           </div>
           <h2 className="text-3xl font-bold text-white leading-snug tracking-tight mb-4">Akses Kembali Akun Anda.</h2>
           <p className="text-slate-400 font-medium">Sistem keamanan kelas enterprise menjaga data dan portofolio Anda tetap aman.</p>
        </div>
      </div>
    </div>
  );
}