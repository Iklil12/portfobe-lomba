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
      <div className="mb-6 md:mb-8 animate-enter">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 mb-1 md:mb-2">
              Overview
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-500">Ringkasan performa dan data portofolio Anda saat ini.</p>
          </div>

          {/* Desktop: full label buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {subdomain && (
              <>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full text-[11px] font-extrabold uppercase tracking-widest hover:border-slate-350 hover:bg-slate-50 hover:text-slate-950 transition-all duration-300 shadow-sm active:scale-95"
                >
                  <i className="fas fa-share-nodes text-slate-400 group-hover:text-[#ff9e00] transition-colors"></i>
                  Bagikan
                </button>
                <a
                  href={`/${subdomain}`} target="_blank" rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full text-[11px] font-extrabold uppercase tracking-widest hover:border-slate-350 hover:bg-slate-50 hover:text-slate-950 transition-all duration-300 shadow-sm active:scale-95"
                >
                  <i className="fas fa-external-link-alt text-slate-400 group-hover:text-[#ff9e00] transition-colors"></i>
                  Lihat Web
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ALL ACTIONS ROW — single line on mobile */}
      <AnimateOnScroll delay={50} className="mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/dashboard/projects"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#ff9e00] text-white font-extrabold text-xs md:text-sm shadow-[0_4px_14px_rgba(255,158,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,158,0,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <i className="fas fa-plus text-[10px] md:hidden"></i>
            <span className="whitespace-nowrap">Buat Proyek</span>
          </Link>
          <Link
            href="/dashboard/appearance"
            className="flex-1 md:flex-none flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-300 font-extrabold text-xs md:text-sm"
          >
            <span className="whitespace-nowrap">Kanvas</span>
          </Link>
          <Link
            href="/dashboard/build-with-ai"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-extrabold text-xs md:text-sm hover:bg-slate-800 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <i className="fas fa-wand-magic-sparkles text-amber-300"></i>
            <span className="whitespace-nowrap">Build with AI</span>
          </Link>

          {/* Mobile: compact icon buttons for Bagikan & Lihat Web */}
          {subdomain && (
            <div className="flex md:hidden items-center gap-1.5 ml-auto shrink-0">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-50 hover:text-[#ff9e00] hover:border-slate-300 transition-all active:scale-90 shadow-sm"
              >
                <i className="fas fa-share-nodes text-xs"></i>
              </button>
              <a
                href={`/${subdomain}`} target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-50 hover:text-[#ff9e00] hover:border-slate-300 transition-all active:scale-90 shadow-sm"
              >
                <i className="fas fa-external-link-alt text-xs"></i>
              </a>
            </div>
          )}
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
