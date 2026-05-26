//app/login/LoginClient.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // --- STATE KHUSUS LUPA PASSWORD ---
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotStatus, setForgotStatus] = useState({ type: "", message: "" });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setErrorMsg("Email atau password yang Anda masukkan tidak cocok.");
      setIsLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsForgotLoading(true);
    setForgotStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      
      // Apapun hasilnya, kita selalu tampilkan sukses demi keamanan (anti-enumeration)
      if (res.ok) {
        setForgotStatus({ type: "success", message: "Jika email Anda terdaftar, kami telah mengirimkan instruksi reset ke kotak masuk Anda." });
        setForgotEmail(""); // Kosongkan input
      } else {
        setForgotStatus({ type: "error", message: "Terjadi kesalahan jaringan. Coba lagi nanti." });
      }
    } catch (error) {
      setForgotStatus({ type: "error", message: "Terjadi kesalahan server." });
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] text-slate-900 flex min-h-screen font-sans selection:bg-[#ff9e00]/30 selection:text-slate-900 relative">
      
      {/* INJEKSI CSS UNTUK ANIMASI & FONT */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 8s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}} />

      {/* --- MODAL LUPA PASSWORD --- */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
            onClick={() => !isForgotLoading && setShowForgotModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-[2rem] p-8 md:p-10 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 animate-in zoom-in-95 fade-in duration-300 z-10">
            <button 
              onClick={() => setShowForgotModal(false)} 
              disabled={isForgotLoading}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Lupa Sandi?</h3>
            <p className="text-slate-500 mb-8 text-sm font-medium leading-relaxed">
              Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mereset kata sandi Anda.
            </p>
            
            {forgotStatus.message && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-bold border flex items-start gap-3 ${forgotStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                <i className={`fas mt-0.5 ${forgotStatus.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                <p className="leading-relaxed">{forgotStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-1">Alamat Email</label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input 
                    type="email" 
                    required 
                    value={forgotEmail} 
                    onChange={(e) => setForgotEmail(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-[#ff9e00] focus:ring-[3px] focus:ring-[#ff9e00]/20 focus:bg-white transition-all" 
                    placeholder="email@anda.com" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isForgotLoading || !forgotEmail} 
                className={`mt-2 py-3.5 rounded-xl font-bold text-white bg-slate-900 transition-all flex items-center justify-center gap-2 text-sm shadow-md ${isForgotLoading || !forgotEmail ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-800 active:scale-[0.98]'}`}
              >
                {isForgotLoading ? <i className="fas fa-circle-notch animate-spin"></i> : 'Kirim Link Reset'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SISI KIRI: LOGIN FORM AREA */}
      <div className="w-full lg:w-[55%] bg-white flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-40 relative z-10 shadow-[20px_0_50px_rgba(0,0,0,0.03)]">
        
        <Link href="/" className="absolute top-10 left-8 sm:left-16 md:left-24 xl:left-40 group">
          <img src="/portfo.be.png" alt="Logo" className="h-7 md:h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
        </Link>

        <div className="w-full max-w-md mx-auto py-12 mt-12 md:mt-0">
          <div className="mb-10">
             <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-slate-900">Welcome Back</h1>
             <p className="text-slate-500 text-sm md:text-base font-medium">Masuk untuk mengelola portofolio profesional Anda.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-red-500">
                 <i className="fas fa-exclamation-circle text-xs"></i>
              </div>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6" suppressHydrationWarning>
            <div className="group">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Email Address</label>
              <input 
                name="email" 
                type="email" 
                placeholder="hello@creator.com" 
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium" 
                required 
                suppressHydrationWarning
              />
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 group-focus-within:text-[#ff9e00] transition-colors">Password</label>
                
                {/* --- TOMBOL TRIGGER MODAL LUPA PASSWORD --- */}
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForgotModal(true);
                    setForgotStatus({ type: "", message: "" });
                  }}
                  className="text-[11px] font-bold text-slate-400 hover:text-[#ff9e00] uppercase tracking-widest transition-colors outline-none"
                >
                  Lupa Password?
                </button>
              </div>
              
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300 tracking-widest" 
                  required 
                  suppressHydrationWarning
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ff9e00] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-50"
                >
                  <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || isGoogleLoading}
              className={`w-full relative bg-slate-900 text-white py-4 rounded-2xl text-[13px] font-bold tracking-wide overflow-hidden transition-all duration-300 transform active:scale-[0.98] ${isLoading ? 'bg-slate-800' : 'hover:bg-[#ff9e00] hover:text-black hover:shadow-[0_15px_30px_rgba(255,158,0,0.3)] hover:-translate-y-0.5'}`}
            >
              <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Masuk ke Dashboard <i className="fas fa-arrow-right text-[10px] ml-1"></i>
              </div>
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="px-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Or Continue With</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className={`w-full relative bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl text-[13px] font-bold tracking-wide overflow-hidden transition-all duration-300 transform active:scale-[0.98] ${isGoogleLoading ? 'bg-slate-50' : 'hover:bg-slate-50 hover:border-slate-300 hover:shadow-md'}`}
          >
            <div className={`flex items-center justify-center gap-3 transition-opacity duration-300 ${isGoogleLoading ? 'opacity-0' : 'opacity-100'}`}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Sign in with Google
            </div>
            
            {isGoogleLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
              </div>
            )}
          </button>

          <p className="text-center text-sm text-slate-500 mt-10 font-medium">
            Belum punya akun? <Link href="/register" className="text-slate-900 font-extrabold hover:text-[#ff9e00] transition-colors ml-1">Mulai Gratis Sekarang</Link>
          </p>
        </div>
      </div>

      {/* SISI KANAN: VISUAL PRESTIGE */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#0a0a0a] items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#ff9e00]/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff9e00] to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#ff9e00] animate-pulse"></div> Featured Creator
            </div>
            
            <h2 className="text-3xl font-bold text-white leading-snug tracking-tight mb-10">
              &quot;Portfo.be mengubah cara klien dan agensi melihat hasil karya saya.&quot;
            </h2>
            
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-full border border-[#ff9e00]/30 p-1 relative">
                  <div className="absolute inset-0 rounded-full border border-[#ff9e00] animate-ping opacity-20"></div>
                  <img src="https://i.pravatar.cc/150?img=11" className="w-full h-full rounded-full object-cover" alt="Avatar" />
               </div>
               <div>
                  <p className="text-white font-bold text-sm tracking-wide">Aris Setiawan</p>
                  <p className="text-[#ff9e00] text-xs font-bold mt-1 uppercase tracking-widest">Commercial Photographer</p>
               </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
