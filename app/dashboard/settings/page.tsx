"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useSettings } from '@/hooks/useSettings';
import { PortfolioStatusCard } from '@/components/features/settings/PortfolioStatusCard';
import { EmailCredentialCard } from '@/components/features/settings/EmailCredentialCard';
import { SecurityCard } from '@/components/features/settings/SecurityCard';
import { DangerZoneCard } from '@/components/features/settings/DangerZoneCard';
import { DeleteAccountModal } from '@/components/features/settings/DeleteAccountModal';
import { UpdateEmailModal } from '@/components/features/settings/UpdateEmailModal';
import { UpdatePasswordModal } from '@/components/features/settings/UpdatePasswordModal';
import BillingContent from '@/components/features/settings/BillingContent';

const TABS = [
  { id: 'account', label: 'Akun & Keamanan', icon: 'fa-shield-alt' },
  { id: 'billing', label: 'Billing & Langganan', icon: 'fa-credit-card' },
  { id: 'integrations', label: 'Integrations', icon: 'fa-plug', comingSoon: true },
] as const;

type TabId = typeof TABS[number]['id'];

function SettingsContent() {
  const { state, actions } = useSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTab = (searchParams.get('tab') as TabId) || 'account';
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  const [isMinimumLoadTimeMet, setIsMinimumLoadTimeMet] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMinimumLoadTimeMet(false), 0); // reset when remounting
    setIsMinimumLoadTimeMet(false);
    const timeout = setTimeout(() => setIsMinimumLoadTimeMet(true), 1200);
    return () => clearTimeout(timeout);
  }, []);

  // Sync tab state with URL
  const handleTabChange = (tab: TabId) => {
    const target = TABS.find(t => t.id === tab);
    if (target && 'comingSoon' in target && target.comingSoon) return;
    setActiveTab(tab);
    router.replace(`/dashboard/settings?tab=${tab}`, { scroll: false });
  };

  return (
    <main className="min-h-screen font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { opacity: 0; animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(3px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}} />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">

        {state.mounted && createPortal(<DeleteAccountModal state={state} actions={actions} />, document.body)}
        {state.mounted && createPortal(<UpdateEmailModal state={state} actions={actions} />, document.body)}
        {state.mounted && createPortal(<UpdatePasswordModal state={state} actions={actions} />, document.body)}

        {/* PAGE HEADER */}
        <div className="mb-8 sm:mb-10 animate-enter text-center md:text-left" style={{animationDelay: '100ms'}}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-5 shadow-sm">
            <i className="fas fa-cog text-slate-400"></i> Pengaturan
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Settings
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-lg mx-auto md:mx-0">Kelola akun, keamanan, billing, dan integrasi dari satu tempat.</p>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-1 p-1.5 bg-slate-100/80 rounded-2xl mb-8 overflow-x-auto hide-scrollbar animate-enter" style={{animationDelay: '200ms'}}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              disabled={'comingSoon' in tab && tab.comingSoon}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[13px] font-extrabold transition-all duration-200 whitespace-nowrap relative
                ${activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'comingSoon' in tab && tab.comingSoon 
                    ? 'text-slate-400 cursor-not-allowed' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
              <i className={`fas ${tab.icon} text-[11px] ${activeTab === tab.id ? 'text-[#ff9e00]' : ''}`}></i>
              {tab.label}
              {'comingSoon' in tab && tab.comingSoon && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider ml-1 ${activeTab === tab.id ? 'bg-[#ff9e00]/10 text-[#ff9e00]' : 'bg-slate-200 text-slate-500'}`}>Soon</span>
              )}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="animate-enter" style={{animationDelay: '300ms'}}>
          
          {/* ACCOUNT & SECURITY TAB */}
          {activeTab === 'account' && (
            !isMinimumLoadTimeMet ? (
              <div className="space-y-5 sm:space-y-6 max-w-4xl animate-billing-fade">
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes billingFadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
                  .animate-billing-fade { opacity: 0; animation: billingFadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
                `}} />
                <div className="h-[210px] w-full skeleton-premium rounded-3xl" />
                <div className="h-[240px] w-full skeleton-premium rounded-3xl" />
                <div className="h-[240px] w-full skeleton-premium rounded-3xl" />
                <div className="h-[220px] w-full skeleton-premium rounded-3xl" />
              </div>
            ) : (
              <div className="space-y-5 sm:space-y-6 max-w-4xl">
                <PortfolioStatusCard state={state} actions={actions} />
                <EmailCredentialCard state={state} actions={actions} />
                <SecurityCard state={state} actions={actions} />
                <DangerZoneCard state={state} actions={actions} />
              </div>
            )
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <BillingContent />
          )}

          {/* INTEGRATIONS TAB (COMING SOON) */}
          {activeTab === 'integrations' && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-6">
                <i className="fas fa-plug text-3xl text-slate-300"></i>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Segera Hadir</h3>
              <p className="text-sm text-slate-500 font-medium max-w-md">Hubungkan layanan pihak ketiga seperti Google Analytics, Calendly, dan Webhook untuk memperkuat portofoliomu.</p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center font-sans text-slate-500">Memuat pengaturan...</div>}>
      <SettingsContent />
    </Suspense>
  );
}