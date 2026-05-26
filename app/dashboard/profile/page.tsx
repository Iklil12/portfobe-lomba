"use client";

import React from 'react';
import { useProfile } from '@/hooks/useProfile';
import { ProfileSkeleton } from '@/components/features/profile/ProfileSkeleton';
import { ProfileHeader } from '@/components/features/profile/ProfileHeader';
import { AvatarUpload } from '@/components/features/profile/AvatarUpload';
import { ProfileForm } from '@/components/features/profile/ProfileForm';

export default function ProfilePage() {
  const { state, actions } = useProfile();

  if (state.status === "loading" || state.isLoadingData) {
    return <ProfileSkeleton />;
  }

  return (
    <main className="min-h-screen font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0; 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(3px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        .animate-spin-slow { animation: spin 10s linear infinite; }

        .bg-grid-slate {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
        }
      `}} />

      {/* ELEMEN DEKORASI BACKGROUND DIHAPUS (Dipindah ke layout.tsx) */}

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">
        <ProfileHeader />

        <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] transition-all duration-500 relative animate-enter overflow-hidden" style={{animationDelay: '200ms'}}>
          <AvatarUpload state={state} actions={actions} />
          <ProfileForm state={state} actions={actions} />
        </div>
      </div>
    </main>
  );
}