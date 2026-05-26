// components/GlobalSearch.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { useSession, signOut } from "next-auth/react";
import Fuse from "fuse.js";
import { useDebounce } from "use-debounce";

// =========================================================================
// 1. DATA MENU STATIS
// =========================================================================
const APP_COMMANDS = [
  { id: "nav-1", title: "Dashboard Overview", group: "Navigasi", icon: "fa-layer-group", link: "/dashboard", type: "link", keywords: "beranda utama home" },
  { id: "nav-2", title: "Metrik & Analitik", group: "Navigasi", icon: "fa-chart-pie", link: "/dashboard/analytics", type: "link", keywords: "statistik grafik pengunjung views" },
  { id: "nav-3", title: "Riwayat Pengunjung", group: "Navigasi", icon: "fa-history", link: "/dashboard/analytics?tab=history", type: "link", keywords: "log riwayat history siapa yang lihat" },
  { id: "des-1", title: "Proyek & Karya", group: "Desain & Konten", icon: "fa-paint-roller", link: "/dashboard/projects", type: "link", keywords: "portfolio list karya desain" },
  { id: "des-2", title: "Koleksi Tema", group: "Desain & Konten", icon: "fa-palette", link: "/dashboard/themes", type: "link", keywords: "warna tampilan baju warna-warni themes" },
  { id: "des-3", title: "Atur Tautan (Links)", group: "Desain & Konten", icon: "fa-link", link: "/dashboard/links", type: "link", keywords: "sosmed sosial media url tautan" },
  { id: "des-4", title: "Pengaturan SEO", group: "Desain & Konten", icon: "fa-search", link: "/dashboard/settings?tab=seo", type: "link", keywords: "google pencarian meta tag seo" },
  { id: "app-1", title: "Ubah Bentuk Tombol", group: "Tampilan Web", icon: "fa-shapes", link: "/dashboard/themes?focus=buttonShape", type: "link", keywords: "button shape tombol kotak bulat pill" },
  { id: "app-2", title: "Ganti Warna Utama", group: "Tampilan Web", icon: "fa-fill-drip", link: "/dashboard/themes?focus=themeColor", type: "link", keywords: "warna color theme aksen" },
  { id: "app-3", title: "Ubah Font (Tipografi)", group: "Tampilan Web", icon: "fa-font", link: "/dashboard/themes?focus=fonts", type: "link", keywords: "font huruf tulisan tipografi" },
  { id: "app-4", title: "Atur Gaya Kartu", group: "Tampilan Web", icon: "fa-id-card", link: "/dashboard/themes?focus=cardStyle", type: "link", keywords: "card kartu kotak bayangan glass" },
  { id: "pro-1", title: "Ubah Nomor WhatsApp", group: "Pengaturan Akun", icon: "fa-whatsapp", link: "/dashboard/profile?focus=whatsapp", type: "link", keywords: "wa whatsapp nomor kontak hp" },
  { id: "pro-2", title: "Status 'Available for Hire'", group: "Pengaturan Akun", icon: "fa-briefcase", link: "/dashboard/profile?focus=hire", type: "link", keywords: "hire kerja open freelance buka" },
  { id: "set-1", title: "Edit Profil & Bio", group: "Pengaturan Akun", icon: "fa-user-edit", link: "/dashboard/profile", type: "link", keywords: "deskripsi tentang saya bio profil" },
  { id: "set-2", title: "Keamanan & Password", group: "Pengaturan Akun", icon: "fa-key", link: "/dashboard/settings?tab=security", type: "link", keywords: "keamanan sandi kata kunci ubah password" },
  { id: "act-1", title: "Buat Proyek Baru", group: "Aksi Cepat", icon: "fa-plus-circle", link: "/dashboard/projects?action=new", type: "link", keywords: "tambah bikin portofolio baru" },
  { id: "act-2", title: "Salin Link Portofolio", group: "Aksi Cepat", icon: "fa-copy", action: "copy_link", type: "action", keywords: "copy share bagikan url salin" },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobalSearch() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500); // 1. IMPLEMENTASI DEBOUNCE
  
  const [mounted, setMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); 
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  // 2. INISIALISASI FUSE.JS (Memoized untuk performa)
  const fuse = useMemo(() => new Fuse(APP_COMMANDS, {
    keys: ["title", "keywords", "group"],
    threshold: 0.3, // 0.3 = toleran terhadap typo
  }), []);

  // 3. FETCHING DATA DB (Hanya saat debouncedQuery berubah)
  const { data: dbResults, isLoading: isSearchingDB } = useSWR(
    debouncedQuery.length >= 2 ? `/api/search?q=${debouncedQuery}` : null,
    fetcher
  );

  // 4. LOGIKA PENCARIAN GABUNGAN
  const filteredResults = useMemo(() => {
    if (!query) return APP_COMMANDS; // Jika kosong tampilkan semua menu utama

    // Pencarian Fuzzy untuk Menu Lokal
    const fuseResults = fuse.search(query).map(res => res.item);
    
    // Gabungkan dengan hasil Database
    const remoteResults = dbResults && Array.isArray(dbResults) ? dbResults : [];
    
    return [...remoteResults, ...fuseResults];
  }, [query, dbResults, fuse]);

  // Loading state (User sedang ngetik atau API sedang fetch)
  const isCurrentlyWaiting = query !== debouncedQuery || isSearchingDB;

  useEffect(() => { setSelectedIndex(0); }, [query]);

  // Shortcut Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (!isOpen) return;
      if (e.key === "Escape") setIsOpen(false);

      if (filteredResults.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          handleItemClick(filteredResults[selectedIndex]);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
    else setQuery("");
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && resultsRef.current) {
      const activeElement = resultsRef.current.querySelector('.selected-item') as HTMLElement;
      if (activeElement) activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex, isOpen]);

  const groupedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const handleItemClick = async (item: any) => {
    setIsOpen(false);
    if (item.type === "action") {
      switch (item.action) {
        case "copy_link":
          const userSubdomain = (session?.user as any)?.subdomain || "username";
          const portfolioUrl = `https://portfo.be/${userSubdomain}`;
          try {
            await navigator.clipboard.writeText(portfolioUrl);
            toast.success(`Berhasil! Link disalin: portfo.be/${userSubdomain}`);
          } catch (err) {
            toast.error("Gagal menyalin link.");
          }
          break;
        case "logout":
          toast.loading("Mengakhiri sesi Anda...");
          if (typeof window !== "undefined") sessionStorage.removeItem("hasSeenWelcomePromo");
          signOut({ redirect: true, callbackUrl: "/login" });
          break;
        default:
          toast.success(`Perintah tidak dikenal: ${item.action}`);
      }
    } else {
      router.push(item.link);
    }
  };

  let globalItemIndex = 0;

  return (
    <>
      <div className="hidden md:flex relative group max-w-md w-full cursor-pointer" onClick={() => setIsOpen(true)}>
        <div className="relative flex items-center w-full transition-all duration-300 bg-slate-100/40 border border-slate-200/40 rounded-2xl px-4 py-2.5 group-hover:bg-white group-hover:border-[#ff9e00]/40 group-hover:shadow-[0_0_15px_rgba(255,158,0,0.1)]">
          <i className="fas fa-search text-xs text-slate-400 group-hover:text-[#ff9e00]"></i>
          <div className="flex-1 text-[13px] font-bold text-slate-400/80 px-3 text-left truncate">Cari proyek, fitur, metrik...</div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-black text-slate-400">
            <span>⌘</span><span>K</span>
          </div>
        </div>
      </div>

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-[10vh] px-4 overflow-hidden">
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes searchPop { 0% { opacity: 0; transform: scale(0.96) translateY(-10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
            @keyframes fadeInOverlay { 0% { opacity: 0; } 100% { opacity: 1; } }
            .animate-search-pop { animation: searchPop 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
          `}} />

          <div className="absolute inset-0 bg-slate-900/40 animate-[fadeInOverlay_0.2s_forwards]" onClick={() => setIsOpen(false)}></div>

          <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-slate-200 overflow-hidden animate-search-pop flex flex-col max-h-[80vh]">
            
            <div className="flex items-center px-6 py-5 border-b border-slate-100 shrink-0">
              {isCurrentlyWaiting ? (
                <div className="w-5 h-5 border-2 border-[#ff9e00] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <i className="fas fa-search text-[#ff9e00] text-xl"></i>
              )}
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Cari proyek, tautan, sertifikat, fitur..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none px-4 text-lg font-bold text-slate-800 placeholder:text-slate-300"
              />
              <button onClick={() => setIsOpen(false)} className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                ESC
              </button>
            </div>

            <div ref={resultsRef} className="overflow-y-auto p-2 custom-scrollbar bg-slate-50/50 flex-1">
              {filteredResults.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <i className="fas fa-ghost text-2xl"></i>
                  </div>
                  <p className="font-bold text-slate-500">Tidak ada hasil untuk "{query}"</p>
                  <p className="text-xs text-slate-400 mt-1">Gunakan kata kunci atau jalankan perintah cepat.</p>
                </div>
              ) : (
                <>
                  {!query && (
                    <div className="p-4 mb-4 mx-2 mt-2 bg-blue-50/50 border border-blue-100 rounded-2xl">
                      <p className="text-xs font-bold text-blue-800 mb-2"><i className="fas fa-info-circle mr-1"></i> Apa yang bisa dicari di sini?</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-white border border-blue-200 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider"><i className="fas fa-paint-roller mr-1"></i> Proyek & Karya</span>
                        <span className="px-2 py-1 bg-white border border-blue-200 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider"><i className="fas fa-link mr-1"></i> Tautan / Links</span>
                        <span className="px-2 py-1 bg-white border border-blue-200 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider"><i className="fas fa-certificate mr-1"></i> Sertifikat</span>
                        <span className="px-2 py-1 bg-white border border-blue-200 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider"><i className="fas fa-layer-group mr-1"></i> Menu Sistem</span>
                      </div>
                    </div>
                  )}
                  {Object.entries(groupedResults).map(([groupName, items]: [string, any]) => (
                  <div key={groupName} className="mb-4 last:mb-0">
                    <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-3">
                      {groupName} <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                    <div className="space-y-1">
                      {(items as any[]).map((item: any) => {
                        const currentIndex = globalItemIndex; 
                        const isSelected = currentIndex === selectedIndex;
                        globalItemIndex++; 
                        
                        return (
                          <button 
                            key={item.id} 
                            onClick={() => handleItemClick(item)}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group border ${isSelected ? 'bg-white border-slate-200 shadow-sm selected-item' : 'border-transparent hover:bg-white hover:border-slate-200'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-[#ff9e00]/10 text-[#ff9e00]' : 'bg-slate-100 text-slate-400'}`}>
                                <i className={`fas ${item.icon} text-sm`}></i>
                              </div>
                              <div className="text-left">
                                <p className="text-[14px] font-bold text-slate-800">{item.title}</p>
                                <p className="text-[10px] font-medium text-slate-400">
                                  {item.type === 'action' ? '⚡ Jalankan Perintah' : `Buka ${item.link}`}
                                </p>
                              </div>
                            </div>
                            <div className={`transition-opacity flex items-center ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                               <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">Pilih ↵</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                </>
              )}
            </div>

            <div className="bg-white px-6 py-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5">⌘ K - Search</span>
                <span className="flex items-center gap-1.5">↑↓ - Navigasi</span>
              </div>
              <span>Portfo.be System</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}