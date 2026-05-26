import React from 'react';

export function ThemeSkeleton() {
  return (
    <main className="min-h-screen font-sans relative overflow-hidden pb-24">
      <style dangerouslySetInnerHTML={{__html: `
        .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}} />
      {/* ELEMEN DEKORASI BACKGROUND DIHAPUS (Dipindah ke layout.tsx) */}
      <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
        
        {/* Header Skeleton */}
        <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6 mt-4">
          <div>
            <div className="w-28 h-7 shimmer rounded-full mb-6"></div>
            <div className="w-64 md:w-80 h-12 shimmer rounded-lg mb-4"></div>
            <div className="w-full max-w-md h-4 shimmer rounded-full mb-2"></div>
            <div className="w-64 h-4 shimmer rounded-full"></div>
          </div>
          <div className="w-40 h-14 shimmer rounded-full hidden md:block"></div>
        </div>

        {/* Filter Tab Skeleton */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1 bg-slate-100/60 rounded-2xl p-1.5">
            {[82, 58, 52, 72].map((w, i) => (
              <div
                key={i}
                className="h-9 rounded-xl shimmer"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>

        {/* Grid Skeleton (Dribbble Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              {/* Visual Card 4:3 */}
              <div className="relative w-full aspect-[4/3] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                <div className="absolute inset-0 shimmer opacity-50"></div>
              </div>
              
              {/* Footer Metadata */}
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 shimmer rounded-full"></div>
                  <div className="w-24 h-4 shimmer rounded-md"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-3 shimmer rounded-md"></div>
                  <div className="w-8 h-3 shimmer rounded-md"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
