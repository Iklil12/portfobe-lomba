// components/WelcomeBannerModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface AdminPromoData {
  isActive: boolean;
  type: "promo" | "info" | "greeting";
  title: string;
  desc: string;
  btnText?: string;
  btnLink?: string;
}

interface WelcomeBannerModalProps {
  userName: string;
  userPlan?: string; 
  adminData?: AdminPromoData | null; 
  canClaimTrial?: boolean;
}
export default function WelcomeBannerModal({ userName, userPlan = "FREE", adminData, canClaimTrial = false }: WelcomeBannerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [greeting, setGreeting] = useState({ text: "Halo", icon: "👋", color: "from-blue-500 to-indigo-600" });

  useEffect(() => {
    // 1. Logika Jam
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      setGreeting({ text: "Selamat Pagi", icon: "☀️", color: "from-[#ff9e00] to-[#fcc419]" });
    } else if (hour >= 11 && hour < 15) {
      setGreeting({ text: "Selamat Siang", icon: "🌤️", color: "from-[#4dabf7] to-[#20c997]" });
    } else if (hour >= 15 && hour < 18) {
      setGreeting({ text: "Selamat Sore", icon: "☕", color: "from-[#ff6b6b] to-[#cc5de8]" });
    } else {
      setGreeting({ text: "Selamat Malam", icon: "🌙", color: "from-slate-800 to-slate-900" });
    }

    // 2. Cek Session
    const hasSeenPromo = sessionStorage.getItem("hasSeenWelcomePromo");
    if (!hasSeenPromo) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenWelcomePromo", "true");
  };

  if (!isOpen) return null;

  const firstName = userName.split(" ")[0] || "Kreator";

  // LOGIK PRIORITAS KONTEN
  let displayTitle = "";
  let displayDesc = "";
  let displayBg = "";
  let displayIcon: React.ReactNode = null;
  let btnText = "";
  let btnLink = "";
  let badgeLabel = "";

  if (adminData && adminData.isActive) {
    displayTitle = adminData.title;
    displayDesc = adminData.desc;
    displayBg = adminData.type === 'promo' ? "from-rose-500 to-pink-600" : "from-emerald-500 to-teal-500";
    btnText = adminData.btnText || "Lihat Detail";
    btnLink = adminData.btnLink || "#";
    badgeLabel = adminData.type === 'promo' ? '🔥 Penawaran Spesial' : '💡 Informasi Penting';
  } else if (canClaimTrial) {
    displayTitle = "Klaim Trial PRO 14 Hari! 🎁";
    displayDesc = `Halo ${firstName}! Kesempatan emas untukmu! Buka akses seluruh fitur premium tanpa batas. 100% Gratis, tanpa kartu kredit.`;
    displayBg = "from-amber-500 to-orange-600";
    displayIcon = <i className="fas fa-gift text-5xl sm:text-7xl text-white animate-bounce"></i>;
    btnText = "Klaim Trial Sekarang";
    btnLink = "/dashboard/billing";
    badgeLabel = "🔥 Penawaran Spesial";
  } else if (userPlan === "FREE") {
    displayTitle = "Waktunya Naik Level! 🚀";
    displayDesc = `Halo ${firstName}! Saat ini kamu pakai paket FREE. Upgrade ke PRO untuk custom domain & fitur eksklusif lainnya.`;
    displayBg = "from-slate-900 to-slate-800";
    displayIcon = <i className="fas fa-crown text-5xl sm:text-6xl text-[#ff9e00] animate-pulse"></i>;
    btnText = "Upgrade ke Pro";
    btnLink = "/pricing";
    badgeLabel = "💎 Rekomendasi";
  } else {
    displayTitle = `${greeting.text}, ${firstName}! ${greeting.icon}`;
    displayDesc = "Semoga harimu produktif. Apa mahakarya yang ingin kamu bagikan hari ini?";
    displayBg = greeting.color;
    displayIcon = <div className="text-6xl sm:text-7xl">{greeting.icon}</div>;
    btnText = "Mulai Berkarya 🚀";
    btnLink = "/dashboard/projects";
    badgeLabel = "✨ Dashboard Aktif";
  }

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      
      {/* ANIMASI CSS UNTUK BACKDROP & MODAL 
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blurIn { 
          from { opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); background: rgba(15, 23, 42, 0); } 
          to { opacity: 1; backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); background: rgba(15, 23, 42, 0.7); } 
        }
        @keyframes modalShow { 
          from { opacity: 0; transform: translateY(30px) scale(0.95); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
        .backdrop-blur-global { 
          animation: blurIn 0.5s ease-out forwards; 
        }
        .modal-animate-in { 
          animation: modalShow 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards; 
          opacity: 0;
        }
      `}} />

      {/* BACKDROP YANG MENUTUPI SELURUH LAYAR
          Inilah yang membuat background dashboard Anda ngeblur total.
      */}
      <div 
        className="fixed inset-0 backdrop-blur-global cursor-pointer"
        onClick={handleClose}
      ></div>

      {/* KONTAINER MODAL (Desain yang Anda suka) */}
      <div className={`relative w-full max-w-2xl bg-gradient-to-br ${displayBg} rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden modal-animate-in text-white border border-white/20 z-10`}>
        
        {/* Tombol Close */}
        <button onClick={handleClose} className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full transition-all z-20">
          <i className="fas fa-times text-sm"></i>
        </button>

        {/* Dekorasi Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        <div className="relative z-10 p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          
          {/* Visual Icon */}
          <div className="shrink-0 w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] shadow-2xl rotate-[-4deg] hover:rotate-[0deg] transition-transform duration-500">
            {displayIcon}
          </div>

          {/* Konten Teks */}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-[9px] font-black uppercase tracking-widest mb-4">
              {badgeLabel}
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black mb-3 leading-tight tracking-tight drop-shadow-md">
              {displayTitle}
            </h2>
            <p className="text-white/80 text-sm sm:text-base font-medium leading-relaxed mb-8">
              {displayDesc}
            </p>

            <div className="flex justify-center sm:justify-start">
              <Link 
                href={btnLink} 
                onClick={handleClose}
                className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl text-sm hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                {btnText} <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}