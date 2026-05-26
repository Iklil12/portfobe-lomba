// components/OnboardingModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";

interface OnboardingModalProps {
  userName: string;
  onFinish?: () => void;
}

const professions = [
  { id: "photographer", label: "Photographer", icon: "fa-camera", color: "text-[#ff6b6b]", bg: "bg-[#ff6b6b]/10", shadow: "hover:shadow-[#ff6b6b]/20" },
  { id: "videographer", label: "Videographer", icon: "fa-video", color: "text-[#4dabf7]", bg: "bg-[#4dabf7]/10", shadow: "hover:shadow-[#4dabf7]/20" },
  { id: "uiux", label: "UI/UX Designer", icon: "fa-pen-nib", color: "text-[#cc5de8]", bg: "bg-[#cc5de8]/10", shadow: "hover:shadow-[#cc5de8]/20" },
  { id: "dev", label: "Web Developer", icon: "fa-code", color: "text-[#20c997]", bg: "bg-[#20c997]/10", shadow: "hover:shadow-[#20c997]/20" },
  { id: "creator", label: "Content Creator", icon: "fa-clapperboard", color: "text-[#fcc419]", bg: "bg-[#fcc419]/10", shadow: "hover:shadow-[#fcc419]/20" },
  { id: "other", label: "Lainnya", icon: "fa-magic", color: "text-slate-500", bg: "bg-slate-100", shadow: "hover:shadow-slate-200" },
];

export default function OnboardingModal({ userName, onFinish }: OnboardingModalProps) {
  // --- STATE INTRO & PROGRESS ---
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // --- STATE FORM ---
  const [sub, setSub] = useState("");
  const [name, setName] = useState(userName === "Creator" ? "" : userName);
  const [err, setErr] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // --- EFEK INTRO ANIMATION ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2200); // Intro muncul selama 2.2 detik
    return () => clearTimeout(timer);
  }, []);

  // --- FUNGSI SUBMIT ---
  const finishOnboarding = async (selectedProfession: string | null) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Menyiapkan ruang digitalmu...");
    
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain: sub.toLowerCase(),
          fullName: name.trim() || userName,
          profession: selectedProfession === "other" ? null : selectedProfession,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data.");
      
      // Paksa refresh data SWR di background
      await mutate('/api/layout-sync');
      
      toast.success("Yeay! Berhasil.", { id: loadingToast });
      
      setTimeout(() => {
        if (onFinish) onFinish();
        else window.location.reload();
      }, 1200);
      
    } catch (e: any) {
      toast.error(e.message || "Terjadi kesalahan teknis.", { id: loadingToast });
      setIsSubmitting(false);
      if (e.message.toLowerCase().includes("url") || e.message.toLowerCase().includes("subdomain")) {
        setCurrentStep(1);
      }
    }
  };

  // --- FUNGSI NEXT ---
  const handleNext = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); 
    
    if (currentStep === 1) {
      if (sub.length < 3) return toast.error("Subdomain minimal 3 karakter.");
      if (!/^[a-z0-9]+$/.test(sub)) return toast.error("Hanya boleh huruf kecil dan angka.");

      setIsValidating(true);
      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: 'check_subdomain', subdomain: sub }),
        });
        const data = await res.json();

        if (!data.available) {
          setErr(data.message || "URL sudah diambil orang.");
          toast.error(data.message || "URL sudah diambil.");
          setIsValidating(false);
          return;
        }
        setErr("");
        setCurrentStep(2);
      } catch (error) {
        toast.error("Server sedang sibuk.");
      }
      setIsValidating(false);

    } else if (currentStep === 2) {
      if (!name.trim()) return toast.error("Namanya diisi dulu ya.");
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <>
      {/* ========================================== */}
      {/* RUMUS ANIMASI GLOBAL UNTUK MODAL INI         */}
      {/* (Ditaruh di luar agar tidak ikut terhapus) */}
      {/* ========================================== */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popInModal { 
          0% { opacity: 0; transform: scale(0.95) translateY(10px); } 
          100% { opacity: 1; transform: scale(1) translateY(0); } 
        }
        @keyframes fadeInBackdrop { 
          0% { opacity: 0; } 
          100% { opacity: 1; } 
        }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes float-fast { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(-5deg); } }
        @keyframes blob { 0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; } }
        @keyframes wave { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-20deg); } 75% { transform: rotate(20deg); } }

        .modal-enter { animation: popInModal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .backdrop-enter { animation: fadeInBackdrop 0.5s ease-out forwards; opacity: 0; }
        .animate-blob { animation: blob 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .intro-wave { animation: wave 1.5s ease-in-out infinite; transform-origin: bottom right; display: inline-block; }
        
        .glass-panel { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.6); }
        .step-transition { transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
      `}} />

      {/* ========================================== */}
      {/* LAYAR 1: INTRO SPLASH SCREEN                 */}
      {/* ========================================== */}
      {showIntro ? (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-slate-900 overflow-hidden backdrop-enter">
          {/* Latar Belakang Ambient */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff9e00] rounded-full blur-[120px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          </div>

          <div className="relative z-10 text-center modal-enter">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl mb-8">
              <span className="text-5xl sm:text-6xl intro-wave">👋</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">Halo, Kreator!</h1>
            <p className="text-slate-400 font-medium text-sm sm:text-base">Mari bangun ruang digitalmu...</p>
          </div>
        </div>
      ) : (
        /* ========================================== */
        /* LAYAR 2: MAIN MODAL (MARSHMALLOW VIBE)     */
        /* ========================================== */
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          
          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md backdrop-enter"></div>

          {/* Kontainer Modal */}
          <div className="relative w-full max-w-5xl bg-white/95 backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] flex flex-col-reverse lg:flex-row border border-white/50 overflow-hidden max-h-[95vh] modal-enter">
            
            {/* Tombol Back */}
            {currentStep > 1 && !isSubmitting && (
              <button onClick={handleBack} className="absolute top-4 left-4 lg:top-8 lg:left-8 z-50 w-10 h-10 bg-white shadow-sm border border-slate-100 text-slate-500 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95">
                <i className="fas fa-arrow-left"></i>
              </button>
            )}

            {/* --- LEFT: FORM AREA --- */}
            <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white/80 shrink-0 relative z-10">
              
              {/* Progress Indicator Dots */}
              <div className="flex gap-1 mb-8 justify-center lg:justify-start">
                {[1, 2, 3].map((step) => (
                  <div key={step} className={`h-2 rounded-full step-transition ${currentStep === step ? 'w-8 bg-[#ff9e00]' : currentStep > step ? 'w-2 bg-[#ff9e00]/40' : 'w-2 bg-slate-200'}`}></div>
                ))}
              </div>

              {currentStep === 1 && (
                <div className="animate-[fadeInBackdrop_0.5s_forwards]">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 tracking-tighter">Klaim Rumahmu.</h3>
                  <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Ini adalah alamat permanen yang akan disebarkan ke klien atau audiensmu.</p>

                  <form onSubmit={handleNext} className="space-y-5">
                    <div className="relative flex items-center bg-white border-2 border-slate-100 rounded-2xl overflow-hidden focus-within:border-[#ff9e00] focus-within:ring-4 focus-within:ring-[#ff9e00]/10 transition-all shadow-sm group">
                      <div className="pl-5 pr-2 py-4 bg-slate-50 border-r border-slate-100 text-slate-400 font-bold text-sm">portfo.be/</div>
                      <input type="text" autoFocus maxLength={15} value={sub} onChange={(e) => setSub(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))} placeholder="namamu" className="flex-1 px-4 py-4 bg-transparent outline-none font-black text-slate-900 text-sm placeholder:text-slate-300" />
                      <div className="pr-5 text-[10px] font-extrabold text-slate-300">{sub.length}/15</div>
                    </div>
                    {err && <p className="text-[11px] font-bold text-red-500 ml-1 animate-pulse"><i className="fas fa-exclamation-circle mr-1"></i> {err}</p>}
                    <button type="submit" disabled={sub.length < 3 || isValidating} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center gap-2">
                      {isValidating ? <><i className="fas fa-circle-notch animate-spin text-lg"></i> Mengecek...</> : <>Kunci Nama Ini <i className="fas fa-arrow-right"></i></>}
                    </button>
                  </form>
                </div>
              )}

              {currentStep === 2 && (
                <div className="animate-[fadeInBackdrop_0.5s_forwards]">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 tracking-tighter">Kenalan Dulu.</h3>
                  <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Bagaimana dunia harus memanggilmu? Ini akan jadi judul utamamu.</p>

                  <form onSubmit={handleNext} className="space-y-5">
                    <div className="relative flex items-center bg-white border-2 border-slate-100 rounded-2xl overflow-hidden focus-within:border-[#ff9e00] focus-within:ring-4 focus-within:ring-[#ff9e00]/10 transition-all shadow-sm">
                      <input type="text" autoFocus maxLength={50} value={name} onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9\s\.\-]/g, ""))} placeholder="Nama Lengkap / Panggung" className="flex-1 px-5 py-4 bg-transparent outline-none font-black text-slate-900 text-sm placeholder:text-slate-300" />
                      <div className="pr-5 text-[10px] font-extrabold text-slate-300">{name.length}/50</div>
                    </div>
                    <button type="submit" disabled={!name.trim()} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50">Langkah Terakhir <i className="fas fa-arrow-right ml-2"></i></button>
                    <button type="button" onClick={() => setCurrentStep(3)} className="w-full py-2 text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-slate-900 transition-colors">Lewati Dulu</button>
                  </form>
                </div>
              )}

              {currentStep === 3 && (
                <div className="animate-[fadeInBackdrop_0.5s_forwards]">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 tracking-tighter">Satu Hal Lagi.</h3>
                  <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Apa keahlian utamamu? Kami akan menyesuaikan tampilan untukmu.</p>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 text-xs sm:text-sm">
                    {professions.map((p) => (
                      <button key={p.id} onClick={() => finishOnboarding(p.id)} disabled={isSubmitting} className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border-2 border-transparent bg-white shadow-sm hover:border-slate-200 transition-all group hover:-translate-y-1 active:scale-95 ${p.shadow} disabled:opacity-50`}>
                        <div className={`w-12 h-12 rounded-2xl ${p.bg} ${p.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                          {isSubmitting ? <i className="fas fa-circle-notch animate-spin text-xl"></i> : <i className={`fas ${p.icon} text-xl`}></i>}
                        </div>
                        <span className="text-[11px] sm:text-xs font-black text-slate-700 text-center uppercase tracking-tight">{p.label}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => finishOnboarding(null)} disabled={isSubmitting} className="w-full text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-slate-900 transition-colors py-2 disabled:opacity-50">
                    {isSubmitting ? "Sedang Memproses..." : "Saya Rahasiakan Dulu"}
                  </button>
                </div>
              )}
            </div>

            {/* --- RIGHT: DYNAMIC 3D PLAYFUL STAGE --- */}
            <div className="w-full lg:w-1/2 h-40 sm:h-56 lg:h-auto bg-[#f8f9fa] relative overflow-hidden flex items-center justify-center shrink-0">
              {/* Latar Grid Halus */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              {/* Ambient Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff9e00]/20 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#cc5de8]/10 rounded-full blur-[80px]"></div>

              {/* Dinamis Visual Berdasarkan Step */}
              <div className="relative w-40 h-40 lg:w-80 lg:h-80 flex items-center justify-center">
                
                {/* Objek 1: Bola Oranye Morphing */}
                <div className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] animate-blob ${
                  currentStep === 1 ? 'w-32 h-32 lg:w-48 lg:h-48 bg-gradient-to-tr from-[#ff9e00] to-[#fcc419] top-0 right-4' :
                  currentStep === 2 ? 'w-40 h-40 lg:w-64 lg:h-64 bg-gradient-to-tr from-[#cc5de8] to-[#ff6b6b] top-4 left-4 scale-110' :
                  'w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-tr from-[#20c997] to-[#4dabf7] bottom-0 right-0'
                } shadow-2xl`}></div>

                {/* Objek 2: Glass Panel Utama */}
                <div className={`absolute z-10 glass-panel rounded-3xl p-4 lg:p-6 shadow-xl animate-float-slow step-transition flex flex-col ${
                  currentStep === 1 ? 'w-40 lg:w-56 h-24 lg:h-32 rotate-[-5deg]' :
                  currentStep === 2 ? 'w-32 lg:w-48 h-40 lg:h-56 rotate-[5deg] translate-y-4' :
                  'w-48 lg:w-64 h-32 lg:h-40 rotate-[0deg] scale-110'
                }`}>
                   {currentStep === 1 && (
                     <div className="w-full h-full flex flex-col justify-center gap-2 lg:gap-3">
                       <div className="w-1/2 h-3 bg-white/60 rounded-full"></div>
                       <div className="w-full h-8 bg-white/40 rounded-xl"></div>
                     </div>
                   )}
                   {currentStep === 2 && (
                     <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                       <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/60 rounded-full shadow-inner"></div>
                       <div className="w-3/4 h-3 bg-white/50 rounded-full"></div>
                       <div className="w-1/2 h-2 bg-white/40 rounded-full"></div>
                     </div>
                   )}
                   {currentStep === 3 && (
                     <div className="w-full h-full grid grid-cols-2 gap-2 lg:gap-3">
                       <div className="bg-white/40 rounded-xl shadow-sm"></div>
                       <div className="bg-[#ff9e00]/40 rounded-xl shadow-sm flex items-center justify-center"><i className="fas fa-check text-white"></i></div>
                       <div className="bg-white/40 rounded-xl shadow-sm"></div>
                       <div className="bg-white/40 rounded-xl shadow-sm"></div>
                     </div>
                   )}
                </div>

                {/* Objek 3: Floating Badges (Aksen) */}
                <div className={`absolute z-20 bg-white px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl lg:rounded-2xl shadow-lg font-bold text-[10px] lg:text-xs text-slate-800 animate-float-fast step-transition ${
                  currentStep === 1 ? 'bottom-0 left-0 rotate-[-10deg]' :
                  currentStep === 2 ? 'top-0 right-0 rotate-[10deg]' :
                  'top-[-20px] left-[-20px] rotate-[-5deg]'
                }`}>
                  {currentStep === 1 ? '✨ Domain Unik' : currentStep === 2 ? '😎 Keren' : '🚀 Mulai Skuy!'}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}