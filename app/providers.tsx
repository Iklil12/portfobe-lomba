//app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { Toaster, resolveValue, toast } from 'react-hot-toast';
import { usePathname } from "next/navigation";

const globalFetcher = (url: string) =>
  fetch(url, { cache: 'no-store' }).then((res) => {
    if (!res.ok) throw new Error("API Error");
    return res.json();
  });

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === "/" || 
                       pathname === "/pricing" || 
                       pathname === "/privacy" || 
                       pathname === "/terms";

  const swrAndToastContent = (
    <SWRConfig
      value={{
        fetcher: globalFetcher,
        revalidateOnFocus: true,
        focusThrottleInterval: 10000,
        dedupingInterval: 10000,
        revalidateOnReconnect: true,
      }}
    >
      {children}
        <Toaster position="top-center" containerStyle={{ zIndex: 1000000, marginTop: '20px' }}>
        {(t) => {
          const message = resolveValue(t.message, t) as React.ReactNode;
          
          let title = "Info";
          let iconClass = "fa-info";
          let bgClass = "bg-[#eff6ff]";
          let borderClass = "border-blue-400";
          let iconBgClass = "bg-blue-500 text-white";
          
          if (t.type === 'success') {
            title = "Berhasil!";
            iconClass = "fa-check";
            bgClass = "bg-[#f0fdf4]";
            borderClass = "border-green-400";
            iconBgClass = "bg-green-500 text-white";
          } else if (t.type === 'error') {
            title = "Terjadi Kesalahan!";
            iconClass = "fa-times";
            bgClass = "bg-[#fef2f2]";
            borderClass = "border-red-400";
            iconBgClass = "bg-red-500 text-white";
          } else if (t.type === 'loading') {
            title = "Memproses...";
            iconClass = "fa-circle-notch animate-spin";
            bgClass = "bg-slate-50";
            borderClass = "border-slate-300";
            iconBgClass = "bg-slate-500 text-white";
          } else if (t.className === 'warning') {
            title = "Peringatan!";
            iconClass = "fa-exclamation";
            bgClass = "bg-[#fffbeb]";
            borderClass = "border-amber-400";
            iconBgClass = "bg-amber-500 text-white";
          }

          const renderIcon = () => {
            if (typeof t.icon === 'string') {
              if (t.icon.includes('fa-')) {
                const faClass = t.icon.match(/^(fas|far|fab)\b/) ? t.icon : `fas ${t.icon}`;
                return <i className={`${faClass} text-[11px]`}></i>;
              }
              return <span className="text-[13px] leading-none flex items-center justify-center">{t.icon}</span>;
            }
            return <i className={`fas ${iconClass} text-[11px]`}></i>;
          };

          return (
            <div 
              className={`transition-all duration-300 ease-out flex items-start gap-2.5 w-[290px] md:w-[340px] max-w-full p-2.5 rounded-xl border ${bgClass} ${borderClass} shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md pointer-events-auto origin-top
              ${t.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95'}`}
            >
              <div className={`transition-colors duration-300 w-7 h-7 rounded-full flex shrink-0 items-center justify-center ${iconBgClass}`}>
                {renderIcon()}
              </div>
              
              <div className="flex flex-col flex-1 mt-[3px]">
                <p className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">{title}</p>
                <p className="text-[11px] text-slate-600 font-medium leading-snug">{message}</p>
              </div>
              
              {t.type !== 'loading' && (
                <button 
                  onClick={() => toast.dismiss(t.id)}
                  className="w-6 h-6 rounded-full flex shrink-0 items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 active:scale-90 transition-all"
                >
                  <i className="fas fa-times text-[10px]"></i>
                </button>
              )}
            </div>
          );
        }}
        </Toaster>
      </SWRConfig>
  );

  if (isPublicPage) {
    return swrAndToastContent;
  }

  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {swrAndToastContent}
    </SessionProvider>
  );
}