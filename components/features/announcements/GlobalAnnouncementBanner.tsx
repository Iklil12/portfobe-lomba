"use client";

import { useEffect, useState } from "react";

interface AnnouncementBannerProps {
  announcements?: any[];
  userPlan?: string;
}

export function GlobalAnnouncementBanner({ announcements, userPlan }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  // Filter: hanya tampilkan yang channel BANNER atau BOTH, dan cocok dengan plan user
  const bannerItems = (announcements || []).filter((a: any) => {
    const ch = a.channel || 'BOTH';
    const tp = a.targetPlan || 'ALL';
    const channelMatch = ch === 'BANNER' || ch === 'BOTH';
    const planMatch = tp === 'ALL' || tp === (userPlan || 'FREE');
    return channelMatch && planMatch && !dismissed.includes(a.id);
  });

  if (bannerItems.length === 0) return null;

  return (
    <div className="flex flex-col w-full z-[60] relative">
      {bannerItems.map((item: any) => {
        let style = "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-b border-indigo-700";
        let iconClass = "fa-solid fa-info-circle text-blue-200";
        
        if (item.type === "WARNING") {
          style = "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-b border-orange-600";
          iconClass = "fa-solid fa-triangle-exclamation text-amber-100";
        } else if (item.type === "DANGER") {
          style = "bg-gradient-to-r from-rose-600 to-red-600 text-white border-b border-red-700";
          iconClass = "fa-solid fa-circle-exclamation text-rose-200";
        } else if (item.type === "SUCCESS") {
          style = "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-b border-teal-700";
          iconClass = "fa-solid fa-circle-check text-emerald-100";
        }

        return (
          <div key={item.id} className={`w-full py-2.5 px-4 sm:px-6 text-[13px] font-semibold flex items-center justify-between gap-4 ${style} shadow-md relative overflow-hidden transition-all duration-300`}>
            {/* Visual Textures */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 blur-2xl"></div>
            
            <div className="flex items-center gap-3 relative z-10 w-full max-w-7xl mx-auto justify-center">
              <div className="p-1.5 bg-black/20 rounded-full w-7 h-7 flex items-center justify-center backdrop-blur-sm shrink-0 border border-white/10 shadow-inner">
                <i className={`${iconClass} text-[11px]`} />
              </div>
              <span className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 tracking-wide">
                <strong className="tracking-widest uppercase text-[10px] opacity-100 font-black bg-black/20 px-2 py-0.5 rounded-md border border-white/10 shrink-0 text-center shadow-inner">
                  {item.title}
                </strong> 
                <span className="opacity-95 leading-snug font-medium text-xs sm:text-[13px]">{item.message}</span>
              </span>
            </div>

            <button 
              onClick={() => setDismissed([...dismissed, item.id])}
              className="relative z-10 w-7 h-7 flex items-center justify-center bg-black/10 hover:bg-black/30 rounded-full transition-all shrink-0 border border-transparent hover:border-white/20"
              aria-label="Tutup Pengumuman"
            >
              <i className="fa-solid fa-xmark text-sm opacity-80 hover:opacity-100 text-white" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
