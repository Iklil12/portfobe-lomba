"use client";

import Link from 'next/link';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';

interface RecentActivityProps {
  activities: any[];
  isLoading: boolean;
}

// --- HELPER: FORMAT WAKTU ---
function timeAgo(dateParam: string | Date) {
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  if (days === 1) return 'Kemarin';
  if (days < 7) return `${days} hari yang lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

// --- HELPER: IKON & WARNA AKTIVITAS ---
function getActivityIconProps(actionType: string) {
  if (actionType.includes('LINK')) return { icon: 'fa-link', color: 'bg-indigo-50 text-indigo-500 border-indigo-100' };
  if (actionType.includes('THEME')) return { icon: 'fa-palette', color: 'bg-rose-50 text-rose-500 border-rose-100' };
  if (actionType.includes('PROJECT')) return { icon: 'fa-folder-open', color: 'bg-emerald-50 text-emerald-500 border-emerald-100' };
  if (actionType.includes('CERTIFICATE')) return { icon: 'fa-award', color: 'bg-amber-50 text-amber-500 border-amber-100' };
  if (actionType.includes('TESTIMONIAL')) return { icon: 'fa-comment-dots', color: 'bg-cyan-50 text-cyan-500 border-cyan-100' };
  return { icon: 'fa-check-circle', color: 'bg-slate-50 text-slate-500 border-slate-200' };
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  return (
    <AnimateOnScroll delay={200}>
    <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Aktivitas Terbaru</h3>
          <p className="text-xs font-medium text-slate-500 mt-1">Timeline perubahan Anda</p>
        </div>
        <Link href="/dashboard/history" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all group">
          <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
        </Link>
      </div>

      <div className="relative">
        {/* Vertical line - positioned perfectly at the center of the 36px (w-9) icons */}
        <div className="absolute top-2 bottom-4 left-[18px] -translate-x-1/2 w-[2px] bg-slate-100 z-0 rounded-full"></div>

        <div className="space-y-6 relative z-10">
          {isLoading ? (
            <div className="absolute inset-0 z-50 bg-white rounded-[2.5rem] shimmer" style={{ margin: '-24px -32px' }}></div>
          ) : activities.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm font-medium bg-white">Belum ada aktivitas baru.</div>
          ) : (
            activities.slice(0, 5).map((activity, idx) => {
              const { icon, color } = getActivityIconProps(activity.actionType);
              return (
                <AnimateOnScroll key={activity.id} delay={idx * 50}>
                <div className="flex items-start gap-4 group cursor-default relative">
                  <div className={`w-9 h-9 shrink-0 rounded-full ${color} flex items-center justify-center border-[3px] border-white shadow-sm transition-all group-hover:scale-110 relative z-20`}>
                    <i className={`fas ${icon} text-[10px]`}></i>
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-xs font-bold text-slate-800 leading-snug">
                      {activity.details.split(/"|'/).map((part: string, i: number) =>
                        i % 2 === 0 ? part : <span key={i} className="text-[#ff9e00] font-black underline decoration-2 underline-offset-4">"{part}"</span>
                      )}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{timeAgo(activity.createdAt)}</p>
                  </div>
                </div>
                </AnimateOnScroll>
              );
            })
          )}
        </div>
      </div>
    </div>
    </AnimateOnScroll>
  );
}
