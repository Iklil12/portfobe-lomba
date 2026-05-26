"use client";

import React from 'react';
import { createPortal } from 'react-dom';

import { useProjects } from '@/hooks/useProjects';
import { ProjectHeader } from '@/components/features/projects/ProjectHeader';
import { ProjectFilterTabs } from '@/components/features/projects/ProjectFilterTabs';
import { ProjectList } from '@/components/features/projects/ProjectList';
import { ProjectFormModal } from '@/components/features/projects/ProjectFormModal';
import { DeleteConfirmModal } from '@/components/features/projects/DeleteConfirmModal';

export default function ProjectsPage() {
  const { state, actions } = useProjects();

  return (
    <main className="min-h-screen font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-20">

      
      {/* INJEKSI CSS ANIMASI, BACKGROUND & SKELETON */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .bg-grid { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px); }
        .animate-enter { opacity: 0; animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes slideUpFade { 
            0% { opacity: 0; transform: translateY(20px) scale(0.98); filter: blur(2px); } 
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } 
        }
        
        .animate-spin-slow { animation: spin 10s linear infinite; }
        
        /* Hilangkan Scrollbar di Mobile Tabs */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        
        /* Premium Shimmer Loading */
        .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}} />

      {/* ELEMEN DEKORASI BACKGROUND DIHAPUS (Dipindah ke layout.tsx) */}
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">
        
        {state.mounted && createPortal(<ProjectFormModal state={state} actions={actions} />, document.body)}
        {state.mounted && createPortal(<DeleteConfirmModal state={state} actions={actions} />, document.body)}

        <ProjectHeader state={state} actions={actions} />
        <ProjectFilterTabs state={state} actions={actions} />
        <ProjectList state={state} actions={actions} />
        
      </div>
    </main>
  );
}