// app/register/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from "@/app/actions/auth";
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // State baru khusus untuk loading tombol Google
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await registerUser(formData);

    if (result?.error) {
      setErrorMsg(result.error);
      setIsLoading(false);
    } else {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push('/login');
      } else {
        router.push('/dashboard');
      }
    }
  };

  // Fungsi baru untuk menangani pendaftaran/login via Google
  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    // Menggunakan NextAuth untuk redirect ke Google
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="bg-[#FAFAFA] text-slate-900 flex min-h-screen font-sans selection:bg-[#ff9e00]/30 selection:text-slate-900">
      
      {/* INJEKSI CSS */}
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

      {/* SISI KIRI: DESAIN MINIMALIS & PRESTIGE */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#0a0a0a] items-center justify-center p-16 overflow-hidden">
        {/* Abstract Background Decor */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#ff9e00]/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <Link href="/">
            <img src="/portfo.be.png" alt="Logo" className="h-8 mb-24 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity cursor-pointer" />
          </Link>
          
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Pamerkan karya terbaikmu <br /> <span className="text-[#ff9e00] italic font-medium">dalam 5 menit.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed font-medium">
            Bergabunglah dengan komunitas kreator visual paling eksklusif di dunia tanpa perlu menulis kode.
          </p>
          
          {/* Testimonial Kecil agar Terlihat Pro */}
          <div className="mt-24 pt-12 border-t border-white/10 flex items-center gap-5">
            <div className="flex -space-x-4">
              {[1,2,3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] bg-slate-800 flex items-center justify-center overflow-hidden hover:scale-110 hover:z-10 transition-transform">
                  <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div>
               <p className="text-sm text-white font-bold tracking-wide">+1.2k Kreator</p>
               <p className="text-xs text-slate-500 font-medium">bergabung bulan ini</p>
            </div>
          </div>
        </div>
      </div>

      {/* SISI KANAN: FORM REFINED DENGAN GOOGLE BUTTON */}
      <div className="w-full lg:w-[55%] bg-white flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-40 relative shadow-[-20px_0_50px_rgba(0,0,0,0.03)] z-10">
        
        {/* Logo for mobile only */}
        <Link href="/" className="absolute top-10 left-8 sm:left-16 lg:hidden group">
          <img src="/portfo.be.png" alt="Logo" className="h-7 w-auto object-contain group-hover:scale-105 transition-transform" />
        </Link>

        <div className="w-full max-w-md mx-auto py-12 mt-12 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
             <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-slate-900">Buat Akun</h1>
             <p className="text-slate-500 text-sm font-medium">Gratis selamanya, tanpa perlu kartu kredit.</p>
          </div>

          {/* Elegant Error Alert */}
          {errorMsg && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-red-500">
                 <i className="fas fa-exclamation-triangle text-xs"></i>
              </div>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="group">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Nama Lengkap</label>
              <input 
                name="fullName" 
                type="text" 
                placeholder="Iklil Uyun" 
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300" 
                required 
              />
            </div>

            <div className="group">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Alamat Email</label>
              <input 
                name="email" 
                type="email" 
                placeholder="hello@creator.com" 
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300" 
                required 
              />
            </div>

            <div className="group">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Password</label>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Min. 8 karakter" 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300 tracking-widest" 
                  required 
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
              className={`w-full relative bg-slate-900 text-white py-4 rounded-2xl text-[13px] font-bold tracking-wide overflow-hidden transition-all duration-300 transform active:scale-[0.98] ${isLoading ? 'bg-slate-800 opacity-70 cursor-not-allowed' : 'hover:bg-[#ff9e00] hover:text-black hover:shadow-[0_15px_30px_rgba(255,158,0,0.3)] hover:-translate-y-0.5'}`}
            >
              <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Buat Akun Sekarang
                <i className="fas fa-arrow-right text-[10px] ml-1"></i>
              </div>
              
              {/* Spinner Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>

          {/* DIVIDER: ATAU LANJUTKAN DENGAN */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="px-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Or Continue With</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {/* TOMBOL GOOGLE */}
          <button 
            type="button"
            onClick={handleGoogleRegister}
            disabled={isLoading || isGoogleLoading}
            className={`w-full relative bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl text-[13px] font-bold tracking-wide overflow-hidden transition-all duration-300 transform active:scale-[0.98] ${isGoogleLoading ? 'bg-slate-50' : 'hover:bg-slate-50 hover:border-slate-300 hover:shadow-md'}`}
          >
            <div className={`flex items-center justify-center gap-3 transition-opacity duration-300 ${isGoogleLoading ? 'opacity-0' : 'opacity-100'}`}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Sign up with Google
            </div>
            
            {/* Google Spinner */}
            {isGoogleLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
              </div>
            )}
          </button>

          <p className="text-center text-sm text-slate-500 mt-10 font-medium">
            Sudah punya akun? <Link href="/login" className="text-slate-900 font-extrabold hover:text-[#ff9e00] transition-colors ml-1">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}