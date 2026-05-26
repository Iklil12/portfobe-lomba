import React from 'react';

export function ProBanner({ actions }: { actions: any }) {
  const { handleProComingSoon } = actions;

  return (
    <div 
      onClick={handleProComingSoon}
      className="relative overflow-hidden bg-[#0a0a0a] p-10 md:p-16 rounded-[2.5rem] border border-white/5 cursor-pointer group hover:border-white/10 transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.15)] animate-enter hover:-translate-y-1"
      style={{animationDelay: '700ms'}}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03]"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-slate-100/5 blur-[100px] rounded-full group-hover:opacity-100 opacity-50 transition-opacity duration-700"></div>

      <div className="absolute -top-10 -right-10 p-10 opacity-[0.02] group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000 pointer-events-none">
          <i className="fas fa-swatchbook text-[20rem] text-white"></i>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 group-hover:text-white transition-colors backdrop-blur-sm">
            <i className="fas fa-crown text-slate-300"></i> Pro Feature
          </div>

          <h4 className="text-3xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Live Theme <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 font-light">Editor.</span>
          </h4>
          
          <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed mb-10 max-w-lg group-hover:text-slate-300 transition-colors duration-500">
              Kendalikan setiap piksel portofoliomu. Ubah tata letak, warna, tipografi, dan efek secara instan dengan editor visual kelas studio profesional.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['Color Palettes', 'Typography', 'Grid Control', 'Dark Mode Switch'].map((tag) => (
                  <span key={tag} className="px-5 py-2.5 bg-white/5 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-default backdrop-blur-md">
                      {tag}
                  </span>
              ))}
          </div>

          <div className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-300 active:scale-95 group-hover:bg-slate-200">
              <i className="fas fa-lock text-slate-400"></i> Segera Hadir
          </div>
      </div>
    </div>
  );
}
