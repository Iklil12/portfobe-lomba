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
  let icon = 'fa-check-circle';
  if (actionType.includes('LINK')) icon = 'fa-link';
  else if (actionType.includes('THEME')) icon = 'fa-palette';
  else if (actionType.includes('PROJECT')) icon = 'fa-folder-open';
  else if (actionType.includes('CERTIFICATE')) icon = 'fa-award';
  else if (actionType.includes('TESTIMONIAL')) icon = 'fa-comment-dots';
  return { icon, color: 'bg-white text-slate-700 border-slate-200' };
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  return (
    <AnimateOnScroll delay={200}>
      <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 h-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Aktivitas Terbaru</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Timeline perubahan Anda</p>
          </div>
          <Link href="/dashboard/history" className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all group shadow-sm">
            <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
          </Link>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-2 bottom-4 left-[18px] -translate-x-1/2 w-[2px] bg-slate-100 z-0"></div>

          <div className="space-y-6 relative z-10">
            {isLoading ? (
              <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-slate-100 shimmer" style={{ margin: '-24px -32px' }}></div>
            ) : activities.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs rounded-2xl border border-dashed border-slate-200 bg-slate-50">Belum ada aktivitas baru.</div>
            ) : (
              activities.slice(0, 5).map((activity, idx) => {
                const { icon, color } = getActivityIconProps(activity.actionType);
                return (
                  <AnimateOnScroll key={activity.id} delay={idx * 50}>
                    <div className="flex items-start gap-4 group cursor-default relative">
                      <div className={`w-9 h-9 shrink-0 rounded-full ${color} flex items-center justify-center border relative z-20 shadow-sm`}>
                        <i className={`fas ${icon} text-[10px]`}></i>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-xs font-medium text-slate-700 leading-snug">
                          {activity.details.split(/"|'/).map((part: string, i: number) =>
                            i % 2 === 0 ? part : <span key={i} className="text-slate-900 font-extrabold">"{part}"</span>
                          )}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{timeAgo(activity.createdAt)}</p>
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
