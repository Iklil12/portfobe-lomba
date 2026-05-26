"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import OnboardingModal from "@/components/OnboardingModal";
import WelcomeBannerModal from "@/components/WelcomeBannerModal";
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { Sidebar } from '@/components/layout/dashboard/Sidebar';
import { Topbar } from '@/components/layout/dashboard/Topbar';
import { TopBanner } from '@/components/layout/dashboard/TopBanner';
import { GlobalAnnouncementBanner } from '@/components/features/announcements/GlobalAnnouncementBanner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Tutup sidebar mobile otomatis saat pindah rute/menu
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const {
    isLoading,
    userName,
    userEmail,
    userPlan,
    userAvatar,
    userSubdomain,
    isSubdomainEmpty,
    canClaimTrial,
    notifications,
    topBanner,
    announcementsData,
    projectsCount,
    certificatesCount,
    linksCount,
    testimonialsCount
  } = useDashboardLayout();

  useEffect(() => {
    if (typeof document !== 'undefined' && !document.querySelector('#font-awesome-cdn')) {
      const link = document.createElement('link');
      link.id = 'font-awesome-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  // Gabungkan jumlah proyek dan sertifikat untuk menu "Proyek & Karya"
  const totalProjectsAndCertificates = (projectsCount || 0) + (certificatesCount || 0);

  const isDashboardRoot = pathname === '/dashboard';
  const isEditorPage = pathname === '/dashboard/appearance';
  
  if (!isLoading && isSubdomainEmpty && !isDashboardRoot) {
    if (typeof window !== 'undefined') window.location.href = '/dashboard'; 
  }

  if (isEditorPage) return <>{children}</>; 

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900 relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-enter-modal { animation: modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes modalEnter { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-dropdown { animation: dropdownEnter 0.2s ease-out forwards; transform-origin: top right; }
        @keyframes dropdownEnter { 0% { opacity: 0; transform: scale(0.95) translateY(-10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-page-load { opacity: 0; animation: smoothPageLoad 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes smoothPageLoad { 0% { opacity: 0; transform: translateY(15px); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
        .skeleton-premium { background: linear-gradient(110deg, #f1f5f9 8%, #e2e8f0 18%, #f1f5f9 33%); background-size: 200% 100%; animation: 1.5s shine linear infinite; }
        @keyframes shine { to { background-position-x: -200%; } }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}} />

      <Sidebar 
        isLoading={isLoading} 
        userPlan={userPlan} 
        isSidebarOpen={isSidebarOpen} 
        projectsCount={totalProjectsAndCertificates}
        linksCount={linksCount}
        testimonialsCount={testimonialsCount}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAFA] relative w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        
        {/* GLOBAL BACKGROUND STATIC - Tidak akan ikut tergeser oleh Notifikasi */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
           <div className="absolute inset-0" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px)', maskImage: 'linear-gradient(to bottom, white 40%, transparent)' }}></div>
           <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-slate-200/50 rounded-full blur-[120px]"></div>
           <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-amber-400/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-40 w-full flex flex-col">
          <GlobalAnnouncementBanner announcements={announcementsData} userPlan={userPlan} />
          <Topbar 
            isLoading={isLoading}
            userName={userName}
            userEmail={userEmail}
            userPlan={userPlan}
            userAvatar={userAvatar}
            userSubdomain={userSubdomain}
            canClaimTrial={canClaimTrial}
            alertCount={notifications.length}
            notifications={notifications}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <TopBanner isLoading={isLoading} topBanner={topBanner} />
        </div>

        <div className="flex-1 overflow-y-auto animate-page-load delay-300 relative z-10">
          {children}
        </div>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {(!isLoading && isSubdomainEmpty && !isEditorPage) && (
        <OnboardingModal userName={userName} />
      )}
      
      {(!isLoading && !isSubdomainEmpty && !isEditorPage) && (
        <WelcomeBannerModal 
          userName={userName} 
          userPlan={userPlan}
          canClaimTrial={canClaimTrial}
          adminData={{
            isActive: false,
            type: "promo",
            title: "Diskon 50% Pro Plan! 🎉",
            desc: "Khusus untukmu minggu ini! Upgrade ke Pro dan nikmati fitur custom domain serta analitik tanpa batas.",
            btnText: "Klaim Diskon",
            btnLink: "/pricing"
          }}
        />
      )}
    </div>
  );
}