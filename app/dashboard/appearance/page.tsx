"use client";

import React, { Suspense } from 'react';

import { useThemeEditor } from '@/hooks/useThemeEditor';
import { EditorPanel } from '@/components/features/appearance/EditorPanel';
import { PreviewPanel } from '@/components/features/appearance/PreviewPanel';
import { OfflineModal } from '@/components/features/appearance/OfflineModal';

function AppearanceEditor() {
  const { state, actions } = useThemeEditor();

  if (state.isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#FAFAFA] animate-in fade-in duration-500 m-0 p-0 absolute inset-0 z-[999999]">
        <div className="w-10 h-10 border-[3px] border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest animate-pulse">Memuat Editor Canvas...</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen m-0 p-0 flex flex-col lg:flex-row bg-[#F8FAFC] font-sans overflow-hidden fixed inset-0 z-[99999]">

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@700&display=swap');
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(15, 23, 42, 0.15); border-radius: 10px; }
        
        .bg-grid-slate {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
        }

        :global(body > aside),
        :global(body > header),
        :global(main.layout-content-wrapper > header) { display: none !important; }
        :global(main.layout-content-wrapper) { padding: 0 !important; margin: 0 !important; max-width: 100vw !important; }
      `}} />

      {state.showOfflineModal && (
        <OfflineModal setShowOfflineModal={actions.setShowOfflineModal} />
      )}

      {/* PANEL KIRI: EDITOR TATA LETAK */}
      <EditorPanel state={state} actions={actions} />

      {/* PANEL KANAN: LIVE PREVIEW AREA */}
      <PreviewPanel state={state} actions={actions} />
      
    </main>
  );
}

export default function AppearancePage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <div className="w-10 h-10 border-[3px] border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Sinkronisasi Canvas...</p>
      </div>
    }>
      <AppearanceEditor />
    </Suspense>
  );
}