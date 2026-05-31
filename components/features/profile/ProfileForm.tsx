import React, { useState } from 'react';
import Link from 'next/link';
import { showToast } from '@/lib/customToast';

interface ProfileFormProps {
  state: any;
  actions: any;
}

export function ProfileForm({ state, actions }: ProfileFormProps) {
  const { firstName, lastName, profession, bio, isSaving, isFormValid, subdomain, subdomainStatus, session } = state;
  const { setFirstName, setLastName, setProfession, setBio, handleSave, setSubdomain } = actions;
  
  const email = session?.user?.email || "user@example.com";
  const defaultUsername = session?.user?.email?.split('@')[0] || "user";

  const [bioPrompt, setBioPrompt] = useState("");
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const handleGenerateBio = async () => {
    if (!bioPrompt.trim()) return;
    setIsGeneratingBio(true);
    try {
      const res = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: bioPrompt, profession: profession })
      });
      const data = await res.json();
      if (res.ok && data.bio) {
        setBio(data.bio);
        if (data.profession) setProfession(data.profession);
        setBioPrompt("");
      } else {
        showToast({ message: data.error || "Gagal membuat bio", id: "error-bio", icon: "fa-times" });
      }
    } catch (err) {
      showToast({ message: "Terjadi kesalahan", id: "error-bio", icon: "fa-times" });
    } finally {
      setIsGeneratingBio(false);
    }
  };

  // Deteksi login Google: Berdasarkan image provider Google atau ekstensi @gmail.com
  const isGoogleUser = session?.user?.provider === 'google' || session?.user?.image?.includes('googleusercontent.com') || session?.user?.email?.endsWith('@gmail.com');

  // Fungsi untuk membersihkan teks dari emoji dan karakter aneh (HTML tags, dll)
  const sanitizeText = (text: string) => {
    return text
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
      .replace(/[<>]/g, '');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`portfo.be/${subdomain}`);
    showToast({ message: "Tautan berhasil disalin!", id: "copy-link", icon: "fa-link" });
  };

  return (
    <form className="space-y-6 sm:space-y-8 animate-enter" style={{animationDelay: '300ms'}} onSubmit={handleSave}>
      
      {/* SECTION: NAME */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8 pt-4">
        <div className="w-full sm:w-1/3 shrink-0">
          <label className="block text-sm font-extrabold text-slate-900 mb-1">Nama Lengkap</label>
          <p className="text-[11px] font-medium text-slate-500">Nama yang akan tampil publik.</p>
        </div>
        <div className="w-full flex gap-3">
          <input 
            type="text" 
            maxLength={10} 
            value={firstName} 
            onChange={(e) => setFirstName(sanitizeText(e.target.value))} 
            placeholder="Sienna"
            className="w-1/2 px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:ring-[3px] focus:ring-orange-500/10 outline-none transition-all text-[13px] font-bold text-slate-900" 
          />
          <input 
            type="text" 
            maxLength={10} 
            value={lastName} 
            onChange={(e) => setLastName(sanitizeText(e.target.value))} 
            placeholder="Hewitt"
            className="w-1/2 px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:ring-[3px] focus:ring-orange-500/10 outline-none transition-all text-[13px] font-bold text-slate-900" 
          />
        </div>
      </div>

      {/* SECTION: EMAIL ADDRESS */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="w-full sm:w-1/3 shrink-0">
          <label className="block text-sm font-extrabold text-slate-900 mb-1">Email Address</label>
          <p className="text-[11px] font-medium text-slate-500">Email untuk login dan kontak.</p>
        </div>
        <div className="w-full">
          <div className="relative flex items-center">
            <i className="far fa-envelope absolute left-4 text-slate-400"></i>
            <input 
              type="email" 
              value={email} 
              disabled
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 bg-slate-100/50 text-slate-500 outline-none text-[13px] font-medium cursor-not-allowed opacity-80" 
            />
          </div>
          {/* Tag "Terverifikasi oleh Google" HANYA MUNCUL jika login menggunakan Google */}
          {isGoogleUser && (
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-2 flex items-center gap-1.5">
              <i className="fas fa-check-circle"></i> Terverifikasi oleh Google
            </p>
          )}
        </div>
      </div>

      {/* SECTION: USERNAME / SUBDOMAIN */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="w-full sm:w-1/3 shrink-0 pt-2">
          <label className="block text-sm font-extrabold text-slate-900 mb-1">Username / Link</label>
          <p className="text-[11px] font-medium text-slate-500">Tautan portofolio Anda.</p>
        </div>
        <div className="w-full flex flex-col">
          <div className={`relative flex items-center text-[13px] font-bold text-slate-600 pl-4 pr-[70px] py-3 rounded-xl border transition-all overflow-hidden w-full ${
            subdomainStatus === 'taken' ? 'border-rose-400 bg-rose-50 ring-[3px] ring-rose-400/20' :
            subdomainStatus === 'available' ? 'border-emerald-400 bg-emerald-50 ring-[3px] ring-emerald-400/20' :
            'border-slate-200/80 bg-slate-50/50 focus-within:bg-white focus-within:border-orange-500 focus-within:ring-[3px] focus-within:ring-orange-500/10'
          }`}>
             <span className="opacity-50 select-none shrink-0 whitespace-nowrap">portfo.be/</span>
             <input
               type="text"
               maxLength={15}
               value={subdomain} 
               onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
               placeholder={defaultUsername}
               className="bg-transparent outline-none text-slate-900 w-full p-0 border-none focus:ring-0 truncate"
             />
             
             {/* Tombol Copy Link (Di dalam kolom input) */}
             <button 
                type="button" 
                onClick={copyLink} 
                className="absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors" 
                title="Salin Tautan"
             >
                <i className="far fa-copy text-[13px]"></i>
             </button>

             {/* Ikon Loading/Status */}
             <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
               {subdomainStatus === 'checking' && <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-orange-500 rounded-full animate-spin"></div>}
               {subdomainStatus === 'available' && <i className="fas fa-check-circle text-emerald-500 text-sm"></i>}
               {subdomainStatus === 'taken' && <i className="fas fa-times-circle text-rose-500 text-sm"></i>}
             </div>
          </div>
          {subdomainStatus === 'taken' && (
            <span className="text-[10px] font-bold text-rose-500 mt-2">Username ini sudah digunakan orang lain.</span>
          )}
        </div>
      </div>

      {/* SECTION: PROFESSION & BIO */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="w-full sm:w-1/3 shrink-0">
          <label className="block text-sm font-extrabold text-slate-900 mb-1">Profesi & Bio</label>
          <p className="text-[11px] font-medium text-slate-500">Ceritakan sedikit tentang keahlian Anda.</p>
        </div>
        <div className="w-full flex flex-col gap-4">
          <input 
            type="text" 
            maxLength={20} 
            value={profession} 
            onChange={(e) => setProfession(sanitizeText(e.target.value))} 
            placeholder="Contoh: UI/UX Designer"
            className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:ring-[3px] focus:ring-orange-500/10 outline-none transition-all text-[13px] font-bold text-slate-900" 
          />
          <textarea 
            rows={4} 
            maxLength={250} 
            value={bio} 
            onChange={(e) => setBio(sanitizeText(e.target.value))} 
            placeholder="Tuliskan bio singkat Anda di sini..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:ring-[3px] focus:ring-orange-500/10 outline-none transition-all text-[13px] font-medium leading-relaxed text-slate-900 resize-none" 
          />
          {/* AI BIO GENERATOR */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-gradient-to-r from-violet-50 to-fuchsia-50 p-3 rounded-xl border border-violet-100 shadow-sm mt-1">
            <input 
              type="text" 
              value={bioPrompt}
              onChange={(e) => setBioPrompt(e.target.value)}
              placeholder="Contoh: web dev, suka bikin animasi 3D, react"
              className="flex-1 px-3 py-2 rounded-lg border border-violet-200/60 bg-white/60 focus:bg-white outline-none transition-all text-[12px] text-slate-700 placeholder-slate-400"
            />
            <button 
              type="button"
              onClick={handleGenerateBio}
              disabled={isGeneratingBio || !bioPrompt.trim()}
              className="whitespace-nowrap flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-[11px] font-extrabold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGeneratingBio ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Merapal mantra AI...
                </>
              ) : (
                <>
                  <i className="fas fa-sparkles text-amber-300"></i> Buat Bio dengan AI
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: CONNECTED WORKS REDIRECT */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8 pt-2">
        <div className="w-full sm:w-1/3 shrink-0">
          <label className="block text-sm font-extrabold text-slate-900 mb-1">Connected Works</label>
          <p className="text-[11px] font-medium text-slate-500">Tampilkan karya dari platform lain.</p>
        </div>
        <div className="w-full">
          <Link
            href="/dashboard/integrations"
            className="flex items-center gap-3 px-5 py-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 transition-all group w-full sm:w-max"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-slate-900 transition-colors shadow-sm">
              <i className="fas fa-plug text-xs"></i>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors leading-tight">Kelola Connected Works</span>
              <span className="text-[11px] font-medium text-slate-400">GitHub, Penpot, dan lainnya</span>
            </div>
            <i className="fas fa-arrow-right text-xs text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all"></i>
          </Link>
        </div>
      </div>
      
      {/* ACTION BUTTONS */}
      <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3">
        <button type="button" onClick={() => window.location.reload()} className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-[13px]">
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSaving || !isFormValid} 
          className={`relative px-8 py-2.5 rounded-xl text-[13px] font-extrabold transition-all duration-300 transform w-full sm:w-auto shadow-sm
            ${isSaving || !isFormValid 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent' 
              : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg active:scale-95 border border-slate-900'
            }`}
        >
          <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isSaving ? 'opacity-0' : 'opacity-100'}`}>
            Save changes
          </div>
          {isSaving && <div className="absolute inset-0 flex items-center justify-center"><div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div></div>}
        </button>
      </div>

    </form>
  );
}
