"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ShareModal } from './ShareModal';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';

interface OverviewHeaderProps {
  subdomain: string;
  avatarUrl?: string;
  isLoading?: boolean;
}

export function OverviewHeader({ subdomain, avatarUrl, isLoading }: OverviewHeaderProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const quickActions = [
    { label: 'Buat Proyek', href: '/dashboard/projects', color: 'text-white', bg: 'bg-slate-900 border-slate-900 hover:bg-slate-800' },
    { label: 'Kanvas', href: '/dashboard/themes', color: 'text-slate-700', bg: 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300' },
    { label: 'Build with AI', href: '/dashboard/build-with-ai', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300', icon: 'fas fa-wand-magic-sparkles' }
  ];

  if (isLoading) {
    return (
      <div className="animate-enter">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="h-10 w-48 bg-white border border-slate-100 rounded-lg shimmer mb-3"></div>
            <div className="h-4 w-72 bg-white border border-slate-100 rounded-lg shimmer"></div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="h-12 flex-1 md:w-32 bg-white border border-slate-100 rounded-2xl md:rounded-full shimmer"></div>
            <div className="h-12 flex-1 md:w-32 bg-white border border-slate-100 rounded-2xl md:rounded-full shimmer"></div>
          </div>
        </div>
        <div className="mb-8 flex gap-3">
          <div className="h-10 w-32 bg-white border border-slate-100 rounded-full shimmer"></div>
          <div className="h-10 w-24 bg-white border border-slate-100 rounded-full shimmer"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 animate-enter">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Overview. 
          </h1>
          <p className="text-sm font-medium text-slate-500">Ringkasan performa dan data portofolio Anda saat ini.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-2 md:gap-3">
          {subdomain && (
            <>
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex-1 md:flex-none animate-enter group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all duration-500 shadow-sm active:scale-95"
              >
                <i className="fas fa-share-nodes text-slate-400 group-hover:text-indigo-500 transition-colors"></i>
                <span className="whitespace-nowrap">Bagikan</span>
              </button>
              <a 
                  href={`/${subdomain}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 md:flex-none animate-enter group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all duration-500 shadow-sm active:scale-95"
              >
                  <i className="fas fa-external-link-alt text-slate-400 group-hover:text-[#ff9e00] transition-colors"></i>
                  <span className="whitespace-nowrap">Lihat Web</span>
              </a>
            </>
          )}
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <AnimateOnScroll delay={50} className="mb-8">
        <div className="flex gap-3 pt-2 pb-2 px-1 -mt-2 w-full">
          {quickActions.map((action, idx) => (
             <Link 
                key={idx} 
                href={action.href}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border ${action.bg} ${action.color} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 font-bold text-sm`}
             >
                {action.icon && <i className={`${action.icon} text-amber-500`}></i>}
                <span className="whitespace-nowrap">{action.label}</span>
             </Link>
          ))}
        </div>
      </AnimateOnScroll>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        subdomain={subdomain} 
        avatarUrl={avatarUrl}
      />
    </>
  );
}
