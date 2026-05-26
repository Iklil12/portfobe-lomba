"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import { useLinks } from '@/hooks/useLinks';
import { LinksHeader } from '@/components/features/links/LinksHeader';
import { EmptyLinks } from '@/components/features/links/EmptyLinks';
import { LinkItem } from '@/components/features/links/LinkItem';
import { DeleteLinkModal } from '@/components/features/links/DeleteLinkModal';
import { LinksSkeleton, AddingSkeleton } from '@/components/features/links/LinksSkeleton';

export default function LinksPage() {
  const { state, actions } = useLinks();
  const { mounted, links, isLoading, isAdding } = state;

  return (
    <main className="min-h-screen font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-20">
      
      {/* Global Styles Injected for Animations & Fonts */}
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

        .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}} />

      {/* ELEMEN DEKORASI BACKGROUND DIHAPUS (Dipindah ke layout.tsx) */}

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">

        {mounted && createPortal(<DeleteLinkModal state={state} actions={actions} />, document.body)}

        <LinksHeader state={state} actions={actions} />

        {/* --- LIST LINKS --- */}
        <div className="space-y-4 sm:space-y-5">
          {isLoading ? (
            <LinksSkeleton />
          ) : links.length === 0 && !isAdding ? (
            <EmptyLinks state={state} actions={actions} />
          ) : (
            <>
              {links.map((link, index) => (
                <LinkItem key={link.id} link={link} index={index} actions={actions} />
              ))}

              {isAdding && <AddingSkeleton />}
            </>
          )}
        </div>
      </div>
    </main>
  );
}