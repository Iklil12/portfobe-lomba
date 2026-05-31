"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LazyImage } from '@/components/ui/LazyImage';

interface SidebarProps {
  isLoading: boolean;
  userPlan: string;
  isSidebarOpen: boolean;
  projectsCount?: number;
  linksCount?: number;
  testimonialsCount?: number;
}

export function Sidebar({ isLoading, userPlan, isSidebarOpen, projectsCount = 0, linksCount = 0, testimonialsCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  // Deteksi apakah sedang di rute desain
  const isDesignRoute = pathname.includes('/dashboard/projects') || 
                        pathname.includes('/dashboard/themes') || 
                        pathname.includes('/dashboard/links') || 
                        pathname.includes('/dashboard/testimonials') ||
                        pathname.includes('/dashboard/build-with-ai') ||
                        pathname.includes('/dashboard/integrations') ||
                        pathname.includes('/dashboard/trash');
  
  const [isMobileDesignMenuOpen, setIsMobileDesignMenuOpen] = useState(isDesignRoute);

  return (
    <div className={`fixed inset-y-0 left-0 z-50 flex transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0 md:relative md:shadow-none'}`}>
      
      {/* ============================================================== */}
      {/* DESKTOP SIDEBAR (TWO-PANE LAYOUT)                              */}
      {/* ============================================================== */}
      <div className="hidden md:flex h-full">
        {/* PRIMARY SIDEBAR (NAVIGATION RAIL) */}
        <aside className="w-[90px] bg-white border-r border-slate-100 flex flex-col h-full flex-shrink-0 z-20 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
          <div className="h-[88px] shrink-0 flex items-center justify-center relative">
            {isLoading ? (
               <div className="w-10 h-10 skeleton-premium rounded-xl"></div>
            ) : (
              <Link href="/dashboard" className="flex items-center justify-center w-full h-full cursor-pointer hover:scale-105 transition-transform">
                 <LazyImage src="/portfobe.png" alt="Logo" className="w-9 h-9 object-contain" />
              </Link>
            )}
          </div>

          <nav className="flex-1 flex flex-col gap-0 py-4 px-2 overflow-y-auto hide-scrollbar">
            {isLoading ? (
               <div className="flex flex-col gap-3 px-1">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="w-full h-16 skeleton-premium rounded-2xl"></div>)}
               </div>
            ) : (
               <>
                  <RailItem href="/dashboard" icon="fas fa-layer-group" label="Overview" active={isActive('/dashboard')} />
                  <RailItem href="/dashboard/projects" icon="fas fa-paint-roller" label="Desain" active={isDesignRoute} />
                  <RailItem href="/dashboard/explore" icon="fas fa-compass" label="Explore" active={isActive('/dashboard/explore')} />
                  <RailItem href="/dashboard/analytics" icon="fas fa-chart-pie" label="Metrics" active={isActive('/dashboard/analytics')} />
                  <RailItem href="/dashboard/profile" icon="fas fa-user-circle" label="Profil" active={isActive('/dashboard/profile')} />
                  <RailItem href="/support" icon="fas fa-headset" label="Bantuan" active={isActive('/support')} />
                  <RailItem href="/dashboard/settings" icon="fas fa-cog" label="Settings" active={isActive('/dashboard/settings')} />
               </>
            )}
          </nav>
          
          {/* User Plan Indicator in Rail */}
          <div className="shrink-0 pb-6 pt-2 flex justify-center border-t border-slate-50 mt-auto">
             {isLoading ? (
                <div className="w-12 h-12 skeleton-premium rounded-2xl mt-4"></div>
             ) : userPlan === 'FREE' ? (
               <Link href="/pricing" className="w-12 h-12 mt-4 bg-[#0a0a0a] rounded-2xl flex items-center justify-center relative group shadow-sm border border-slate-800" title="Upgrade to PRO">
                  <i className="fas fa-crown text-[#ff9e00] text-lg group-hover:scale-110 transition-transform"></i>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
               </Link>
             ) : (
               <div className={`w-12 h-12 mt-4 rounded-2xl flex items-center justify-center border ${userPlan === 'SUPREME' ? 'bg-violet-50 border-violet-200' : 'bg-slate-50 border-slate-200'}`} title={userPlan === 'SUPREME' ? 'Supreme Creator' : 'Pro Creator'}>
                  <i className={`fas fa-gem text-lg ${userPlan === 'SUPREME' ? 'text-violet-500' : 'text-[#ff9e00]'}`}></i>
               </div>
             )}
          </div>
        </aside>

        {/* SECONDARY SIDEBAR (KHUSUS UNTUK DESAIN) */}
        <aside className={`bg-white border-r border-slate-100 flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden z-10
          ${isDesignRoute ? 'w-[240px] opacity-100 border-r' : 'w-0 opacity-0 border-r-0'}
        `}>
          {isDesignRoute && (
             <div className="flex flex-col h-full w-[240px]">
               <div className="h-[88px] shrink-0 flex flex-col justify-center px-6">
                 {isLoading ? (
                   <>
                     <div className="w-16 h-3 skeleton-premium rounded-md mb-2"></div>
                     <div className="w-32 h-5 skeleton-premium rounded-md"></div>
                   </>
                 ) : (
                   <>
                     <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Sub Menu</p>
                     <h2 className="font-extrabold text-[15px] text-slate-900 tracking-tight">Desain Portofolio</h2>
                   </>
                 )}
               </div>
               
               <nav className="flex-1 py-2 px-3 space-y-1 overflow-y-auto hide-scrollbar">
                 {isLoading ? (
                   <div className="flex flex-col gap-2">
                     {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-11 skeleton-premium rounded-xl"></div>)}
                   </div>
                 ) : (
                   <>
                     {/* KONTEN */}
                     <div className="mb-4 space-y-0.5">
                       <p className="px-3 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Konten</p>
                       <SecondaryNavItem href="/dashboard/projects" icon="fas fa-folder-open" label="Proyek & Karya" active={isActive('/dashboard/projects')} count={projectsCount} />
                       <SecondaryNavItem href="/dashboard/links" icon="fas fa-link" label="Tautan (Links)" active={isActive('/dashboard/links')} count={linksCount} />
                       <SecondaryNavItem href="/dashboard/testimonials" icon="fas fa-comment-dots" label="Testimoni" active={isActive('/dashboard/testimonials')} count={testimonialsCount} />
                     </div>

                     {/* TAMPILAN */}
                     <div className="mb-4 space-y-0.5">
                       <p className="px-3 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Tampilan</p>
                       <SecondaryNavItem href="/dashboard/themes" icon="fas fa-palette" label="Koleksi Tema" active={isActive('/dashboard/themes')} />
                     </div>

                     {/* EKSTENSI */}
                     <div className="mb-4 space-y-0.5">
                       <p className="px-3 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Ekstensi</p>
                       <SecondaryNavItem href="/dashboard/integrations" icon="fas fa-plug" label="Connected Works" active={isActive('/dashboard/integrations')} />
                     </div>

                     {/* EKSPERIMEN */}
                     <div className="mb-2 space-y-0.5">
                       <p className="px-3 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Eksperimen</p>
                       <SecondaryNavItem href="/dashboard/build-with-ai" icon="fas fa-wand-magic-sparkles" label="Build with AI" active={isActive('/dashboard/build-with-ai')} highlightText="Segera" />
                     </div>

                     {/* DIVIDER + TRASH */}
                     <div className="pt-1 pb-0.5">
                       <div className="h-px bg-slate-100 mx-2 mb-3" />
                       <SecondaryNavItem href="/dashboard/trash" icon="fas fa-trash-alt" label="Trash" active={isActive('/dashboard/trash')} />
                     </div>
                   </>
                 )}
               </nav>
               
               <div className="p-5 mt-auto">
                 {isLoading ? (
                   <div className="w-full h-24 skeleton-premium rounded-2xl"></div>
                 ) : (
                   <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100/50 relative overflow-hidden group shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff9e00]/10 blur-2xl rounded-full translate-x-1/3 -translate-y-1/3 group-hover:bg-[#ff9e00]/20 transition-all duration-500"></div>
                      <i className="fas fa-lightbulb text-[#ff9e00] mb-2.5 text-lg relative z-10 drop-shadow-sm"></i>
                      <p className="text-[11px] text-slate-600 font-bold leading-relaxed relative z-10">Atur karya dan koleksi tema sesuai gayamu untuk menarik lebih banyak klien.</p>
                   </div>
                 )}
               </div>
             </div>
          )}
        </aside>
      </div>


      {/* ============================================================== */}
      {/* MOBILE SIDEBAR (SINGLE PANE LAYOUT WITH ACCORDION)             */}
      {/* ============================================================== */}
      <div className="flex md:hidden h-full w-[280px]">
        <aside className="w-full bg-white border-r border-slate-100 flex flex-col h-full">
          <div className="h-[88px] shrink-0 flex items-center justify-between px-6 border-b border-transparent">
            {isLoading ? (
              <div className="h-8 w-28 skeleton-premium rounded-lg"></div>
            ) : (
              <Link href="/" className="flex items-center group cursor-pointer">
                 <LazyImage src="/portfo.be.png" alt="Portfo.be Logo" className="h-10 w-auto object-contain transition-transform" />
              </Link>
            )}
          </div>

          <nav className="flex-1 space-y-1 mt-4 overflow-y-auto hide-scrollbar px-4">
            {isLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-11 w-full skeleton-premium rounded-2xl"></div>
                ))}
              </div>
            ) : (
              <>
                {/* Menu Overview */}
                <MobileNavItem href="/dashboard" icon="fas fa-layer-group" label="Overview" active={isActive('/dashboard')} />
                
                {/* Menu Desain (Dengan Submenu Accordion) */}
                <div className="pt-2">
                  <button onClick={() => setIsMobileDesignMenuOpen(!isMobileDesignMenuOpen)} className={`w-full flex items-center transition-all duration-300 group py-3.5 rounded-2xl px-4 justify-between ${isDesignRoute ? 'text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <div className="flex items-center gap-4">
                      <i className={`fas fa-paint-roller text-center text-lg w-6 ${isDesignRoute ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                      <span className="font-extrabold text-[13px] tracking-wide">Desain</span>
                    </div>
                    <i className={`fas fa-chevron-down text-[10px] text-slate-400 transition-transform duration-300 ${isMobileDesignMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {/* Submenu Inline (Accordion) */}
                  <div className={`flex flex-col pl-[3.25rem] pr-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isMobileDesignMenuOpen ? 'max-h-80 py-2 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'}`}>
                    <MobileSubNavItem href="/dashboard/projects" label="Proyek & Karya" active={isActive('/dashboard/projects')} count={projectsCount} />
                    <MobileSubNavItem href="/dashboard/themes" label="Koleksi Tema" active={isActive('/dashboard/themes')} />
                    <MobileSubNavItem href="/dashboard/build-with-ai" label="Build with AI" active={isActive('/dashboard/build-with-ai')} highlightText="Segera" />
                    <MobileSubNavItem href="/dashboard/links" label="Tautan (Links)" active={isActive('/dashboard/links')} count={linksCount} />
                    <MobileSubNavItem href="/dashboard/testimonials" label="Testimoni" active={isActive('/dashboard/testimonials')} count={testimonialsCount} />
                    <MobileSubNavItem href="/dashboard/integrations" label="Connected Works" active={isActive('/dashboard/integrations')} />
                    <div className="h-px bg-slate-100 my-1" />
                    <MobileSubNavItem href="/dashboard/trash" label="Trash" active={isActive('/dashboard/trash')} />
                  </div>
                </div>

                {/* Menu Lainnya */}
                <MobileNavItem href="/dashboard/explore" icon="fas fa-compass" label="Explore" active={isActive('/dashboard/explore')} className="mt-2" />
                <MobileNavItem href="/dashboard/analytics" icon="fas fa-chart-pie" label="Metrics" active={isActive('/dashboard/analytics')} />

                <div className="px-5 pt-6 pb-2">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Pengaturan</p>
                </div>

                <MobileNavItem href="/dashboard/profile" icon="fas fa-user-circle" label="Profil & Bio" active={isActive('/dashboard/profile')} />
                <MobileNavItem href="/support" icon="fas fa-headset" label="Bantuan" active={isActive('/support')} />
                <MobileNavItem href="/dashboard/settings" icon="fas fa-cog" label="Settings" active={isActive('/dashboard/settings')} />
              </>
            )}
          </nav>
          
          <div className="shrink-0 border-t border-slate-100 bg-white z-10 p-4">
            {isLoading ? (
               <div className="h-28 w-full skeleton-premium rounded-3xl"></div>
            ) : userPlan === 'FREE' ? (
              <div className="relative overflow-hidden bg-[#0a0a0a] p-4 rounded-3xl shadow-sm border border-slate-800">
                <i className="fas fa-gem absolute -bottom-4 -right-3 text-6xl text-white opacity-[0.02] transform rotate-12"></i>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-extrabold uppercase tracking-widest text-[#ff9e00] mb-3">
                    <i className="fas fa-crown"></i> PRO
                  </div>
                  <Link href="/pricing" className="block w-full text-center bg-white text-slate-900 text-[10px] font-extrabold tracking-widest uppercase py-2.5 px-2 rounded-xl shadow-lg hover:bg-slate-200">
                    Upgrade
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden bg-slate-50 border border-slate-200 p-4 rounded-3xl group">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className={`text-[9px] font-extrabold tracking-widest uppercase mb-1 ${userPlan === 'SUPREME' ? 'text-violet-500' : 'text-[#ff9e00]'}`}>Status</p>
                    <p className="text-sm font-extrabold text-slate-900">{userPlan === 'SUPREME' ? 'Supreme Creator' : 'Pro Creator'}</p>
                  </div>
                  <i className={`fas fa-check-circle text-2xl ${userPlan === 'SUPREME' ? 'text-violet-500' : 'text-[#ff9e00]'}`}></i>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

    </div>
  );
}

// --------------------------------------------------------
// DESKTOP COMPONENTS
// --------------------------------------------------------
function RailItem({ href, icon, label, active }: { href: string, icon: string, label: string, active: boolean }) {
  return (
    <Link 
      href={href} 
      className="flex flex-col items-center justify-center py-1 w-full transition-all duration-300 group relative"
    >
      <div className={`relative flex items-center justify-center w-9 h-9 rounded-[10px] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        active 
          ? 'bg-slate-900 shadow-[0_8px_16px_rgba(15,23,42,0.2)] scale-[1.05]' 
          : 'bg-transparent hover:bg-slate-50 active:scale-95'
      }`}>
        <i className={`${icon} text-[1.05rem] transition-all duration-300 ${
          active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
        }`}></i>
        
        {/* Orange Accent Dot */}
        {active && (
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#ff9e00] border-2 border-white rounded-full shadow-sm animate-in zoom-in duration-300 delay-100"></div>
        )}
      </div>
      
      <span className={`mt-1 text-[8px] font-black uppercase tracking-widest transition-all duration-300 ${
        active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'
      }`}>
        {label}
      </span>
    </Link>
  );
}

// Komponen Item untuk Secondary Sidebar
function SecondaryNavItem({ href, icon, label, active, count, highlightText }: { href: string, icon: string, label: string, active: boolean, count?: number, highlightText?: string }) {
  return (
    <Link href={href} className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-[13px] transition-all duration-200 group relative ${active ? 'bg-slate-100/80 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
      
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2/3 w-[3px] bg-[#ff9e00] rounded-r-md"></div>}

      <div className="flex items-center transition-transform duration-200 group-hover:translate-x-1">
        <i className={`${icon} w-6 text-center text-[15px] mr-2.5 transition-colors ${active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-500'}`}></i>
        <span className={active ? 'font-extrabold' : 'font-bold'}>{label}</span>
      </div>
      
      <div className="transition-transform duration-200 group-hover:-translate-x-0.5 shrink-0 ml-2">
        {highlightText ? (
          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wide ${active ? 'bg-[#ff9e00]/10 text-[#ff9e00] border border-[#ff9e00]/20' : 'bg-slate-100 text-slate-500 border border-slate-200/50'}`}>
            {highlightText}
          </span>
        ) : count !== undefined ? (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md transition-colors ${active ? 'bg-white text-slate-700 shadow-sm border border-slate-200/50' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
            {count}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

// --------------------------------------------------------
// MOBILE COMPONENTS
// --------------------------------------------------------
function MobileNavItem({ href, icon, label, active, className = "" }: { href: string, icon: string, label: string, active: boolean, className?: string }) {
  return (
    <Link href={href} className={`w-full flex items-center py-3.5 rounded-2xl transition-all duration-300 group px-4 gap-4 ${active ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${className}`}>
      <i className={`${icon} text-center text-lg w-6 ${active ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
      <span className="font-extrabold text-[13px] tracking-wide">{label}</span>
    </Link>
  );
}

function MobileSubNavItem({ href, label, active, count, highlightText }: { href: string, label: string, active: boolean, count?: number, highlightText?: string }) {
  return (
    <Link href={href} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all relative ${active ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'}`}>
      <div className="flex items-center">
        {active && <div className="absolute left-0 w-1 h-1/2 bg-[#ff9e00] rounded-r-full"></div>} 
        <span className={active ? '' : 'pl-1'}>{label}</span>
      </div>
      {highlightText ? (
        <span className="text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wide bg-[#ff9e00]/10 text-[#ff9e00] border border-[#ff9e00]/20">
          {highlightText}
        </span>
      ) : count !== undefined ? (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-md transition-colors ${active ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500'}`}>
          {count}
        </span>
      ) : null}
    </Link>
  );
}
