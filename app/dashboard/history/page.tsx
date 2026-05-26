"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Helper Waktu
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
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Helper Ikon
function getActivityIcon(actionType: string) {
  // Mapping action ke icon FontAwesome
  const iconMap: Record<string, string> = {
    'UPDATE_AVATAR': 'fa-camera',
    'UPDATE_PROFILE': 'fa-user-edit',
    'ADD_LINK': 'fa-link',
    'UPDATE_LINK': 'fa-link',
    'DELETE_LINK': 'fa-trash-alt', // Ikon sampah khusus untuk hapus
    'CHANGE_THEME': 'fa-palette',
    'UPLOAD_PROJECT': 'fa-cloud-upload-alt',
    'UPDATE_PROJECT': 'fa-edit',
  };

  // Jika ada di map, kembalikan ikonnya. 
  if (iconMap[actionType]) return iconMap[actionType];

  // Logika fallback menggunakan .includes() untuk kata kunci tertentu
  if (actionType.includes('LINK')) return 'fa-link';
  if (actionType.includes('THEME')) return 'fa-palette';
  if (actionType.includes('PROJECT')) return 'fa-project-diagram';

  // Default jika tidak ada yang cocok
  return 'fa-check-circle';
}

export default function HistoryPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAllActivities = async () => {
      try {
        const res = await fetch('/api/activity/all');
        if (res.ok) {
          const jsonResult = await res.json();
          
          // Jaring pengaman: Ambil array dari properti .data, atau fallback ke array kosong
          const activitiesArray = Array.isArray(jsonResult.data) 
            ? jsonResult.data 
            : (Array.isArray(jsonResult) ? jsonResult : []);
            
          setActivities(activitiesArray);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllActivities();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
            e.preventDefault();
            searchInputRef.current?.focus();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredActivities = activities.filter(act => 
    act.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    act.actionType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // FIX: Fungsi highlightText sekarang memberikan key pada setiap elemen teks
  const highlightText = (text: string, query: string, prefix: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={`${prefix}-h-${i}`} className="bg-[#ff9e00]/20 text-[#ff9e00] rounded-sm px-0.5 border-b border-[#ff9e00]/40">{part}</mark> 
        : <React.Fragment key={`${prefix}-t-${i}`}>{part}</React.Fragment>
    );
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-10 font-sans selection:bg-slate-200 selection:text-slate-900 pb-32">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0; 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
      `}} />

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-enter">
        <div>
          <Link href="/dashboard" className="text-xs font-extrabold uppercase tracking-widest text-slate-400 hover:text-[#ff9e00] transition-colors flex items-center gap-2 mb-4 group">
             <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Activity <span className="font-light text-slate-400">Log.</span>
          </h1>
          <p className="text-sm font-medium text-slate-500">Seluruh riwayat perubahan dan aktivitas pada portofolio Anda.</p>
        </div>

        <div className="relative w-full md:w-80 group">
           <i className={`fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors ${searchQuery ? 'text-slate-900' : 'text-slate-300'}`}></i>
           <input 
             ref={searchInputRef}
             type="text" 
             placeholder="Cari" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-slate-100 bg-white shadow-sm focus:ring-4 focus:ring-[#ff9e00]/10 focus:border-[#ff9e00]/20 outline-none transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300"
           />
           {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
              >
                <i className="fas fa-times text-[10px]"></i>
              </button>
           )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden animate-enter" style={{animationDelay: '150ms'}}>
        
        {isLoading ? (
          <div className="p-8 space-y-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex gap-5 animate-pulse">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-slate-50 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-50 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center px-6">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200 text-2xl">
                <i className="fas fa-search"></i>
             </div>
             <p className="text-lg font-bold text-slate-900">Aktivitas tidak ditemukan</p>
             <p className="text-sm text-slate-500 font-medium mt-1 mb-8">Tidak ada hasil yang cocok dengan kata kunci "{searchQuery}"</p>
             <button onClick={() => setSearchQuery("")} className="text-xs font-extrabold uppercase tracking-widest bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                Reset Pencarian
             </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredActivities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="flex items-center gap-5 p-6 hover:bg-slate-50/50 transition-colors group animate-enter"
                style={{animationDelay: `${index * 30}ms`}}
              >
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-slate-900 group-hover:border-slate-200 transition-all shadow-sm">
                    <i className={`fas ${getActivityIcon(activity.actionType)} text-sm`}></i>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                        {/* FIX: Membungkus map bagian teks dengan key yang valid */}
                        <div className="text-sm font-extrabold text-slate-900 truncate">
                          {activity.details.split(/"|'/).map((part: string, i: number) => (
                             <React.Fragment key={`segment-${activity.id}-${i}`}>
                               {i % 2 === 0 
                                  ? highlightText(part, searchQuery, `text-${activity.id}-${i}`) 
                                  : <span className="text-[#ff9e00] font-black">"{highlightText(part, searchQuery, `quote-${activity.id}-${i}`)}"</span>
                               }
                             </React.Fragment>
                          ))}
                        </div>
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest shrink-0 transition-colors ${searchQuery && activity.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ? 'text-[#ff9e00]' : 'text-slate-300'}`}>
                           {activity.actionType.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-xs font-medium text-slate-400 mt-1">{timeAgo(activity.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isLoading && filteredActivities.length > 0 && (
        <p className="text-center mt-10 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] animate-enter" style={{animationDelay: '500ms'}}>
           End of activity log • {filteredActivities.length} events
        </p>
      )}
    </main>
  );
}