"use client";

import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-[#FAFAFA] pointer-events-none z-0"></div>

      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ff9e00]/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-pink-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">

          {/* TEXT CONTAINER HERO */}
          <div className="w-full lg:w-1/2 lg:pr-8 text-center lg:text-left flex flex-col items-center lg:items-start animate-hero-text">

            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] tracking-tighter leading-[1.05] text-slate-900 flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-2 md:gap-x-4 mb-8">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">Showcase</span>
              <div className="w-24 md:w-36 h-12 md:h-16 rounded-full overflow-hidden inline-block align-middle shadow-[0_8px_15px_rgba(0,0,0,0.1)] shrink-0 hover:scale-105 transition-transform duration-500 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" alt="Creative team" />
              </div>
              <span className="font-light text-slate-500 italic">Work.</span>
              <div className="w-full basis-full h-0"></div>
              <span className="font-extrabold">Land More</span>
              <span className="font-light text-slate-500">Clients.</span>
            </h1>

            <p className="text-slate-500 text-lg md:text-xl mb-10 leading-relaxed max-w-md font-medium text-center lg:text-left">
              The minimalist portfolio builder designed exclusively for visual creators. Zero coding, lightning-fast, and unapologetically beautiful.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 relative">
              <div className="absolute top-0 left-0 w-full sm:w-auto h-full bg-[#ff9e00]/60 blur-xl rounded-full animate-pulse pointer-events-none"></div>
              <Link href="/register" className="relative z-10 inline-flex items-center gap-4 pl-8 pr-2 py-2 rounded-full bg-[#ff9e00] hover:bg-[#e68e00] active:scale-95 transition-all group shadow-[0_10px_30px_rgba(255,158,0,0.3)]">
                <span className="text-[11px] font-black uppercase tracking-widest text-black">Start Building</span>
                <div className="bg-black w-10 h-10 rounded-full flex items-center justify-center text-white group-hover:bg-slate-800 transition-colors duration-300">
                  <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                </div>
              </Link>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-4 py-2">
                <i className="fas fa-star text-yellow-400 animate-pulse"></i> Free Forever Plan
              </span>
            </div>
          </div>

          {/* VISUAL CONTAINER HERO (MOCKUP) */}
          <div className="w-full lg:w-1/2 relative hidden md:block h-[550px] animate-hero-visual">
            <div className="absolute right-0 top-16 w-[65%] h-[400px] bg-slate-200 rounded-[2rem] overflow-hidden shadow-2xl animate-float" style={{ animationDelay: '1s' }}>
              <img src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-90" alt="Mockup Background" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>

            <div className="absolute left-4 top-32 w-[55%] h-[380px] bg-white/90 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white z-10 flex flex-col animate-float hover:scale-105 transition-transform duration-500 cursor-pointer group">
              <div className="h-12 bg-slate-50/50 border-b border-slate-100 flex items-center px-5 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400 group-hover:bg-red-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 group-hover:bg-yellow-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400 group-hover:bg-emerald-500 transition-colors"></div>
                <div className="ml-4 flex-1 h-6 bg-white rounded-md border border-slate-200 flex items-center px-3 shadow-sm">
                  <i className="fas fa-lock text-[8px] text-slate-300 mr-2"></i>
                  <span className="text-[9px] font-mono text-slate-400">portfo.be/creator</span>
                </div>
              </div>
              <div className="p-6 flex-1 overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-tr from-orange-100 to-orange-50 rounded-full p-1 border border-orange-200 shadow-sm group-hover:rotate-[360deg] transition-transform duration-[2s]">
                    <img src="https://ui-avatars.com/api/?name=CR&background=fff&color=ea580c" className="w-full h-full rounded-full" alt="avatar" />
                  </div>
                  <div>
                    <div className="w-24 h-4 bg-slate-800 rounded-full mb-2"></div>
                    <div className="w-16 h-3 bg-slate-300 rounded-full"></div>
                  </div>
                </div>
                <div className="w-full h-16 bg-slate-50 border border-slate-100 rounded-xl mb-3 flex items-center px-4 gap-3 hover:bg-slate-100 transition-colors"><i className="fab fa-instagram text-slate-400 text-lg"></i><div className="w-1/2 h-2 bg-slate-300 rounded-full"></div></div>
                <div className="w-full h-16 bg-slate-50 border border-slate-100 rounded-xl flex items-center px-4 gap-3 hover:bg-slate-100 transition-colors"><i className="fab fa-behance text-slate-400 text-lg"></i><div className="w-1/2 h-2 bg-slate-300 rounded-full"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
