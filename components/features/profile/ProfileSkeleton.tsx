import React from 'react';

export function ProfileSkeleton() {
  return (
    <main className="min-h-screen font-sans relative overflow-hidden pb-20">
      <style dangerouslySetInnerHTML={{__html: `
        .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}} />
      {/* ELEMEN DEKORASI BACKGROUND DIHAPUS (Dipindah ke layout.tsx) */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">
        
        <div className="mb-12 mt-4">
          <div className="w-32 h-6 shimmer rounded-full mb-6"></div>
          <div className="w-64 md:w-80 h-10 shimmer rounded-lg mb-4"></div>
          <div className="w-full max-w-md h-4 shimmer rounded-full"></div>
        </div>
        
        <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 mb-10 pb-10 border-b border-slate-100">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full shimmer shrink-0"></div>
              <div className="flex-1 space-y-4 w-full">
                <div className="h-8 w-2/3 sm:w-1/3 shimmer rounded-lg"></div>
                <div className="h-10 w-full sm:w-2/3 shimmer rounded-xl"></div>
                <div className="flex gap-3 pt-2">
                   <div className="h-10 w-28 shimmer rounded-full"></div>
                   <div className="h-10 w-10 shimmer rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
               <div className="h-14 w-full shimmer rounded-2xl"></div>
               <div className="h-14 w-full shimmer rounded-2xl"></div>
            </div>
            <div className="h-14 w-full shimmer rounded-2xl mb-8"></div>
            <div className="h-32 w-full shimmer rounded-2xl"></div>
        </div>
      </div>
    </main>
  );
}
