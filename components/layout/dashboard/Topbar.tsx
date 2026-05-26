"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import GlobalSearch from "@/components/GlobalSearch";
import { NotificationItem } from '@/hooks/useDashboardLayout';

interface TopbarProps {
  isLoading: boolean;
  userName: string;
  userEmail: string;
  userPlan: string;
  userAvatar: string;
  userSubdomain?: string;
  canClaimTrial?: boolean;
  alertCount: number;
  notifications: NotificationItem[];
  onToggleSidebar: () => void;
}

export function Topbar({
  isLoading,
  userName,
  userEmail,
  userPlan,
  userAvatar,
  userSubdomain,
  canClaimTrial,
  alertCount,
  notifications,
  onToggleSidebar
}: TopbarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setIsProfileMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("hasSeenWelcomePromo");
    }
    signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-[88px] w-full bg-white/60 backdrop-blur-xl border-b border-slate-100/50 flex items-center justify-between px-6 sm:px-10 shrink-0 animate-page-load delay-100">
        <div className="flex items-center gap-6 flex-1">
          <button className="md:hidden w-11 h-11 rounded-full border border-slate-200 bg-white/80 text-slate-600 hover:text-slate-900 active:scale-90 transition-all flex items-center justify-center shadow-sm" onClick={onToggleSidebar}>
            <i className="fas fa-bars text-sm"></i>
          </button>
          <GlobalSearch />
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          {!isLoading && (
            <>
              {canClaimTrial && (
                <Link href="/dashboard/billing" className="flex items-center justify-center gap-2 w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-[11px] font-black tracking-wide shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all" title="Klaim Trial 14 Hari">
                  <i className="fas fa-gift animate-bounce" style={{ animationDuration: '2s' }}></i>
                  <span className="hidden sm:inline">KLAIM TRIAL 14 HARI</span>
                </Link>
              )}

              <div className="relative" ref={notifRef}>
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-50 active:scale-90 transition-all flex items-center justify-center shadow-sm">
                  <i className="fas fa-bell"></i>
                  {alertCount > 0 && <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>}
                </button>

              {isNotifOpen && (
                <div className="absolute top-[calc(100%+12px)] right-[-60px] md:right-0 w-[320px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-200 py-2 animate-dropdown z-50">
                  <div className="px-4 py-3 border-b border-slate-100 mb-1 flex justify-between items-center">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-800">Pusat Informasi</p>
                    {alertCount > 0 && <span className="text-[10px] px-2.5 py-0.5 bg-red-100 text-red-600 rounded-full font-bold">{alertCount} Info</span>}
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto px-2 custom-scrollbar flex flex-col gap-1">
                    {notifications.length === 0 ? (
                      <div className="px-5 py-8 text-center text-slate-400">
                        <i className="fas fa-bell-slash text-2xl mb-2 opacity-20"></i>
                        <p className="text-sm font-medium">Tidak ada notifikasi baru.</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <Link key={notif.id} href={notif.link} onClick={() => setIsNotifOpen(false)} className="p-3 hover:bg-slate-50 rounded-xl transition-colors flex items-start gap-3 group">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'critical' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                            <i className={`fas ${notif.icon} text-sm`}></i>
                          </div>
                          <div className="flex-1 pt-0.5">
                            <p className={`text-sm font-bold mb-1 ${notif.type === 'critical' ? 'text-red-600' : 'text-slate-800'}`}>{notif.title}</p>
                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{notif.desc}</p>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            </>
          )}

          <div className="relative" ref={profileMenuRef}>
            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end gap-2">
                  <div className="h-3 w-24 skeleton-premium rounded-full"></div>
                  <div className="h-2 w-16 skeleton-premium rounded-full"></div>
                </div>
                <div className="w-11 h-11 rounded-full skeleton-premium border border-slate-100"></div>
              </div>
            ) : (
              <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                <div className="hidden sm:block text-right">
                  <p className="text-[13px] font-extrabold text-slate-900 tracking-tight group-hover:text-[#ff9e00] transition-colors">{userName}</p>
                  <p className={`text-[9px] font-extrabold uppercase tracking-widest mt-0.5 ${userPlan === 'SUPREME' ? 'text-violet-500' : userPlan !== 'FREE' ? 'text-[#ff9e00]' : 'text-slate-400'}`}>{userPlan} PLAN</p>
                </div>
                <div className="relative">
                  <div className={`w-11 h-11 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 ${userPlan === 'SUPREME' ? 'border-2 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : userPlan !== 'FREE' ? 'border-2 border-[#ff9e00] shadow-[0_0_15px_rgba(255,158,0,0.3)]' : 'border border-slate-200'}`}>
                    <img src={userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f8fafc&color=0f172a&bold=true`} className="w-full h-full object-cover" alt="Profile" />
                  </div>
                  {userPlan !== 'FREE' && <div className={`absolute -top-1 -right-1 rounded-full w-4 h-4 flex items-center justify-center border border-white shadow-sm z-10 ${userPlan === 'SUPREME' ? 'bg-violet-500 text-white' : 'bg-[#ff9e00] text-black'}`}><i className="fas fa-crown text-[8px]"></i></div>}
                </div>
              </div>
            )}

            {isProfileMenuOpen && !isLoading && (
              <div className="absolute top-[calc(100%+16px)] right-0 w-[280px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-200 py-2 animate-dropdown z-50">
                {/* Header Profile */}
                <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-100 mb-1">
                  <div className="relative shrink-0">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                        {userName ? userName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">{userName || "Pengguna"}</p>
                    <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col px-2">
                  {/* Lihat Web */}
                  {userSubdomain ? (
                    <a
                      href={`/${userSubdomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group px-3 py-2.5 text-[13px] font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <i className="fas fa-external-link-alt text-slate-400 group-hover:text-[#ff9e00] transition-colors w-4 text-center"></i>
                      <span className="flex-1">Lihat Web</span>
                    </a>
                  ) : (
                    <div className="px-3 py-2.5 text-[13px] font-semibold text-slate-300 rounded-lg flex items-center gap-3 cursor-not-allowed" title="Atur subdomain terlebih dahulu">
                      <i className="fas fa-external-link-alt w-4 text-center"></i>
                      <span className="flex-1">Lihat Web</span>
                    </div>
                  )}
                  <div className="h-px bg-slate-100 my-1 mx-2"></div>
                  <Link href="/dashboard/profile" className="px-3 py-2.5 text-[13px] font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3" onClick={() => setIsProfileMenuOpen(false)}>
                    <i className="fas fa-user text-slate-400 w-4 text-center"></i> 
                    <span className="flex-1">Edit Profil</span>
                  </Link>
                  <Link href="/dashboard/settings" className="px-3 py-2.5 text-[13px] font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3" onClick={() => setIsProfileMenuOpen(false)}>
                    <i className="fas fa-cog text-slate-400 w-4 text-center"></i> 
                    <span className="flex-1">Pengaturan</span>
                  </Link>
                  
                  <div className="h-px bg-slate-100 my-1 mx-2"></div>
                  
                  <Link href="/support" className="px-3 py-2.5 text-[13px] font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3" onClick={() => setIsProfileMenuOpen(false)}>
                    <i className="fas fa-headset text-slate-400 w-4 text-center"></i> 
                    <span className="flex-1">Pusat Bantuan</span>
                  </Link>
                  {userPlan === 'FREE' && (
                    <Link href="/pricing" className="px-3 py-2.5 text-[13px] font-semibold text-[#ff9e00] hover:bg-[#ff9e00]/10 rounded-lg transition-colors flex items-center gap-3" onClick={() => setIsProfileMenuOpen(false)}>
                      <i className="fas fa-arrow-up w-4 text-center"></i> 
                      <span className="flex-1">Upgrade Pro</span>
                    </Link>
                  )}
                </div>
                
                <div className="h-px bg-slate-100 mt-2 mb-3"></div>
                
                {/* Sign Out Button */}
                <div className="px-4 pb-2">
                  <button onClick={() => { setIsProfileMenuOpen(false); setShowLogoutModal(true); }} className="w-full px-4 py-2.5 text-[13px] font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <i className="fas fa-sign-out-alt"></i> Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* LOGOUT MODAL */}
      {/* LOGOUT MODAL */}
      {showLogoutModal && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* 1. Full Screen Blur */}
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity duration-300" onClick={() => !isLoggingOut && setShowLogoutModal(false)}></div>
          
          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-[310px] md:max-w-[400px] animate-enter-modal mx-auto">
            {/* 2. Outer Blurred Box */}
            <div className="absolute inset-[-12px] md:inset-[-20px] bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/50 shadow-2xl"></div>
            
            {/* 3. Main Inner White Box */}
            <div className="relative bg-white rounded-[1.5rem] p-5 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex flex-col text-center">
              
              {/* Close Button */}
              <button onClick={() => !isLoggingOut && setShowLogoutModal(false)} className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                 <i className="fas fa-times text-xs md:text-sm"></i>
              </button>

              {/* Rippling Orange Icon */}
              <div className="relative flex items-center justify-center mx-auto mb-4 w-10 h-10 md:w-12 md:h-12">
                <div className="absolute inset-0 bg-[#ff9e00]/20 rounded-full animate-ping opacity-70" style={{ animationDuration: '2s' }}></div>
                <div className="absolute inset-1.5 bg-[#ff9e00]/10 rounded-full"></div>
                <div className="relative w-5 h-5 md:w-6 md:h-6 bg-[#ff9e00] text-white rounded-full flex items-center justify-center shadow-md">
                  <i className="fas fa-sign-out-alt text-[8px] md:text-[10px] translate-x-px"></i>
                </div>
              </div>
              
              <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1.5 md:mb-2 tracking-tight">Keluar dari akun?</h3>
              <p className="text-xs md:text-sm font-medium text-slate-500 mb-5 md:mb-6 leading-relaxed px-1">
                Sesi Anda akan diakhiri. Anda perlu masuk kembali untuk mengakses dashboard kreator.
              </p>
              
              <div className="flex flex-row gap-2 md:gap-3 w-full">
                <button 
                  onClick={handleLogout} 
                  disabled={isLoggingOut} 
                  className="flex-1 py-2.5 md:py-3 bg-[#ff9e00] hover:bg-[#e68e00] rounded-xl font-bold text-white shadow-lg shadow-[#ff9e00]/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs md:text-sm disabled:opacity-50"
                >
                  {isLoggingOut ? <i className="fas fa-circle-notch animate-spin text-white"></i> : 'Keluar'}
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)} 
                  disabled={isLoggingOut} 
                  className="flex-1 py-2.5 md:py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 active:scale-95 transition-all text-xs md:text-sm disabled:opacity-50"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
