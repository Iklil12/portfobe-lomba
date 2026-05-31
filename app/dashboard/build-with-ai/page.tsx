"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/customToast';
import { useProfile } from '@/hooks/useProfile';

export default function BuildWithAIPage() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [promptSource, setPromptSource] = useState<'manual' | 'existing_profile'>('manual');
  const [prompt, setPrompt] = useState('');
  
  const { state: profileState } = useProfile();
  
  const [updateProfession, setUpdateProfession] = useState(true);
  const [updateBio, setUpdateBio] = useState(true);
  const [updateTheme, setUpdateTheme] = useState(true);
  const [updateContent, setUpdateContent] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  // Mouse tracking for ambient glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    const el = containerRef.current;
    if (el) el.addEventListener('mousemove', handleMouseMove);
    return () => { if (el) el.removeEventListener('mousemove', handleMouseMove); };
  }, []);

  const handleGenerate = async () => {
    if (promptSource === 'manual' && !prompt.trim()) {
      showToast({ message: "Silakan isi instruksi terlebih dahulu", id: "err-prompt", icon: "fa-warning" });
      return;
    }
    if (promptSource === 'existing_profile' && (!profileState.bio || profileState.bio.trim() === '')) {
      showToast({ message: "Bio profil Anda kosong! Silakan isi bio di pengaturan Profil terlebih dahulu.", id: "err-prompt-bio", icon: "fa-warning" });
      return;
    }

    setIsGenerating(true);
    setResultData(null);

    try {
      const res = await fetch('/api/build-with-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptSource, prompt, updateProfession, updateBio, updateTheme, updateContent })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResultData(data.data);
        showToast({ message: "Portofolio berhasil dioptimasi!", id: "ai-success", icon: "fa-magic" });
      } else {
        showToast({ message: data.error || "Gagal melakukan generate", id: "ai-err", icon: "fa-times" });
      }
    } catch (err) {
      showToast({ message: "Terjadi kesalahan sistem", id: "ai-sys-err", icon: "fa-bug" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 w-full h-full overflow-y-auto overflow-x-hidden font-sans"
      style={{ background: '#03030a' }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 0.3; }
          100% { transform: scale(0.9); opacity: 0.7; }
        }
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes border-glow {
          0%, 100% { border-color: rgba(139,92,246,0.2); }
          50% { border-color: rgba(139,92,246,0.6); box-shadow: 0 0 20px rgba(139,92,246,0.2); }
        }
        .ai-shimmer-text {
          background: linear-gradient(90deg, #c4b5fd 0%, #fff 30%, #f59e0b 60%, #a78bfa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .ai-glass-panel {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .ai-input {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #f8fafc;
          transition: all 0.3s ease;
        }
        .ai-input:focus {
          outline: none;
          border-color: rgba(139, 92, 246, 0.6);
          background: rgba(139, 92, 246, 0.03);
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }
        .ai-btn-primary {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
        }
        .ai-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .ai-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(124, 58, 237, 0.4);
        }
        .ai-btn-primary:hover::before { opacity: 1; }
        .ai-checkbox-card {
          transition: all 0.3s ease;
        }
        .ai-checkbox-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(139, 92, 246, 0.3);
        }
        .ai-checkbox-card.active {
          background: rgba(139, 92, 246, 0.08);
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
        }
      `}</style>

      {/* ── BACKGROUND EFFECTS ───────────────────────────── */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-500"
        style={{ background: `radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, rgba(139,92,246,0.08), transparent 60%)` }}
      />
      <div 
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center min-h-full px-4 sm:px-6 py-12 md:py-20 max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12 animate-enter" style={{ animationDelay: '100ms' }}>
          <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl" style={{ animation: 'pulse-ring 3s ease-in-out infinite', background: 'rgba(139,92,246,0.15)', transform: 'scale(1.5)' }} />
            <div className="relative w-full h-full rounded-2xl flex items-center justify-center overflow-hidden" style={{ animation: 'float 6s ease-in-out infinite', background: 'linear-gradient(135deg, #1e1b4b, #2e1065)', border: '1px solid rgba(139,92,246,0.4)' }}>
              <i className="fas fa-brain text-3xl text-violet-300"></i>
              <div className="absolute left-0 right-0 h-0.5 bg-violet-400/50" style={{ animation: 'scan-line 3s ease-in-out infinite' }} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            <span className="ai-shimmer-text">Supreme AI</span> Builder
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
            Hanya butuh satu prompt sederhana. AI kami akan merancang deskripsi memukau dan memilih tema visual terbaik untukmu.
          </p>
        </div>

        {/* WORKSPACE AREA */}
        <div className="w-full max-w-2xl">
          
          {/* STEP 1: PROMPT */}
          <div className="ai-glass-panel rounded-3xl p-6 md:p-8 mb-6 animate-enter" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold text-sm">1</div>
              <h2 className="text-lg font-bold text-white">Sumber Pengetahuan</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button 
                onClick={() => setPromptSource('manual')}
                className={`flex-1 p-4 rounded-2xl border text-left transition-all ${promptSource === 'manual' ? 'bg-violet-600/10 border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <i className={`fas fa-keyboard text-lg ${promptSource === 'manual' ? 'text-violet-400' : 'text-slate-500'}`}></i>
                  {promptSource === 'manual' && <i className="fas fa-circle-check text-violet-400"></i>}
                </div>
                <p className={`font-bold text-sm ${promptSource === 'manual' ? 'text-violet-100' : 'text-slate-300'}`}>Ketik Manual</p>
              </button>

              <button 
                onClick={() => {
                  if (!profileState.isLoadingData && (!profileState.bio || profileState.bio.trim() === '')) {
                    showToast({ message: "Opsi ini tidak dapat digunakan karena Bio Anda masih kosong. Silakan gunakan opsi Ketik Manual atau isi Bio di halaman Profil.", id: "err-bio-empty", icon: "fa-info-circle" });
                    return;
                  }
                  setPromptSource('existing_profile');
                }}
                className={`flex-1 p-4 rounded-2xl border text-left transition-all ${promptSource === 'existing_profile' ? 'bg-violet-600/10 border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <i className={`fas fa-user-astronaut text-lg ${promptSource === 'existing_profile' ? 'text-violet-400' : 'text-slate-500'}`}></i>
                  {promptSource === 'existing_profile' && <i className="fas fa-circle-check text-violet-400"></i>}
                </div>
                <p className={`font-bold text-sm ${promptSource === 'existing_profile' ? 'text-violet-100' : 'text-slate-300'}`}>Profil Saat Ini</p>
              </button>
            </div>

            {promptSource === 'manual' && (
              <div className="relative animate-enter">
                <textarea 
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Misal: Saya UI Designer yang suka gaya brutalism hitam putih. Pernah desain aplikasi kasir..."
                  className="ai-input w-full rounded-2xl p-5 text-sm font-medium resize-none placeholder:text-slate-600"
                />
                <i className="fas fa-pen-nib absolute right-4 bottom-4 text-slate-600 opacity-50"></i>
              </div>
            )}
          </div>

          {/* STEP 2: TARGET */}
          <div className="ai-glass-panel rounded-3xl p-6 md:p-8 mb-8 animate-enter" style={{ animationDelay: '300ms' }}>
             <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">2</div>
              <h2 className="text-lg font-bold text-white">Target Optimalisasi</h2>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'profession', label: 'Gelar Profesi', desc: 'Rumuskan julukan profesional yang lebih menjual', state: updateProfession, setter: setUpdateProfession, icon: 'fa-user-tie' },
                { id: 'bio', label: 'Copywriting Bio', desc: 'Rangkai 3 kalimat bio yang elegan & SEO friendly', state: updateBio, setter: setUpdateBio, icon: 'fa-quote-left' },
                { id: 'theme', label: 'Smart Theme Matching', desc: 'Biarkan AI merombak tema visual portofoliomu', state: updateTheme, setter: setUpdateTheme, icon: 'fa-palette' },
                { id: 'content', label: 'Injeksi Konten Dummy', desc: 'Isi portofolio dengan Proyek, Testimoni & Tautan', state: updateContent, setter: setUpdateContent, icon: 'fa-magic' }
              ].map(item => (
                <label key={item.id} className={`ai-checkbox-card flex items-center gap-4 p-4 rounded-2xl border border-white/5 cursor-pointer ${item.state ? 'active' : 'bg-white/5'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.state ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-800 text-slate-500'}`}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${item.state ? 'text-white' : 'text-slate-300'}`}>{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${item.state ? 'bg-violet-500 border-violet-500' : 'border-slate-600 bg-transparent'}`}>
                    {item.state && <i className="fas fa-check text-white text-xs"></i>}
                  </div>
                  {/* Invisible checkbox */}
                  <input type="checkbox" checked={item.state} onChange={(e) => item.setter(e.target.checked)} className="hidden" />
                </label>
              ))}
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="animate-enter" style={{ animationDelay: '400ms' }}>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || (!updateProfession && !updateBio && !updateTheme && !updateContent)}
              className="ai-btn-primary w-full py-4 rounded-2xl text-white font-extrabold text-[15px] flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> 
                  <span className="tracking-wide">AI sedang merajut masa depanmu...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-bolt text-amber-300 group-hover:scale-110 transition-transform"></i> 
                  <span className="tracking-wide">Inisiasi Keajaiban AI</span>
                </>
              )}
            </button>
          </div>

          {/* RESULT CARD */}
          {resultData && (
            <div className="mt-8 ai-glass-panel border-emerald-500/30 rounded-3xl p-6 md:p-8 animate-enter relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <i className="fas fa-check text-xl"></i>
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Sukses Dioptimalisasi</h2>
                  <p className="text-xs text-emerald-400 font-medium">Data portofolio telah diperbarui di database.</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-8 relative z-10">
                {resultData.profession && (
                  <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest mb-1.5">Gelar Profesi</p>
                    <p className="font-bold text-white">{resultData.profession}</p>
                  </div>
                )}
                {resultData.bio && (
                  <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest mb-1.5">Copywriting Bio</p>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed">{resultData.bio}</p>
                  </div>
                )}
                {resultData.theme && (
                  <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest mb-1.5">Tema Visual & Desain</p>
                      <p className="font-bold text-white capitalize text-lg">{resultData.theme.replace('-', ' ')}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {resultData.themeColor && <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 bg-white/5 rounded-md"><div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{backgroundColor: resultData.themeColor}}></div> {resultData.themeColor}</span>}
                        {resultData.fontFamily && <span className="text-[10px] font-bold px-2.5 py-1 bg-white/5 text-slate-300 rounded-md"><i className="fas fa-font mr-1 text-slate-500"></i> {resultData.fontFamily}</span>}
                        {resultData.cardStyle && <span className="text-[10px] font-bold px-2.5 py-1 bg-white/5 text-slate-300 rounded-md capitalize"><i className="far fa-square mr-1 text-slate-500"></i> {resultData.cardStyle}</span>}
                        {resultData.buttonShape && <span className="text-[10px] font-bold px-2.5 py-1 bg-white/5 text-slate-300 rounded-md capitalize"><i className="fas fa-shapes mr-1 text-slate-500"></i> {resultData.buttonShape}</span>}
                        {resultData.splashScreen !== undefined && <span className="text-[10px] font-bold px-2.5 py-1 bg-white/5 text-slate-300 rounded-md"><i className="fas fa-film mr-1 text-slate-500"></i> Cinematic: {resultData.splashScreen ? 'On' : 'Off'}</span>}
                      </div>
                    </div>
                    <i className="fas fa-palette text-emerald-400/20 text-4xl ml-4"></i>
                  </div>
                )}
                {resultData.dummyProjects && (
                  <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest mb-3"><i className="fas fa-boxes-packing mr-1"></i> Injeksi Konten Berhasil</p>
                    <div className="flex flex-wrap gap-3">
                       <div className="flex-1 min-w-[100px] bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                          <i className="fas fa-image text-emerald-400 text-xl"></i>
                          <div><p className="font-bold text-white leading-tight">{resultData.dummyProjects?.length || 0}</p><p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Proyek</p></div>
                       </div>
                       <div className="flex-1 min-w-[100px] bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                          <i className="fas fa-certificate text-emerald-400 text-xl"></i>
                          <div><p className="font-bold text-white leading-tight">{resultData.dummyCertificates?.length || 0}</p><p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Sertifikat</p></div>
                       </div>
                       <div className="flex-1 min-w-[100px] bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                          <i className="fas fa-comment-dots text-emerald-400 text-xl"></i>
                          <div><p className="font-bold text-white leading-tight">{resultData.dummyTestimonials?.length || 0}</p><p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Testimoni</p></div>
                       </div>
                       <div className="flex-1 min-w-[100px] bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                          <i className="fas fa-link text-emerald-400 text-xl"></i>
                          <div><p className="font-bold text-white leading-tight">{resultData.dummyLinks?.length || 0}</p><p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Tautan</p></div>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <button onClick={() => router.push('/dashboard')} className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors border border-white/10 text-center">
                  Kembali ke Dashboard
                </button>
                {resultData.subdomain && (
                  <a href={`/${resultData.subdomain}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-600/20 text-center flex items-center justify-center gap-2">
                    Lihat Web <i className="fas fa-external-link-alt text-xs opacity-70"></i>
                  </a>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
