"use client";

import { useState } from 'react';
import { FEATURE_LIST } from '@/lib/constants';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section id="features" ref={sectionRef} className="bg-[#0a0a0a] pt-24 md:pt-32 pb-0 flex flex-col relative overflow-hidden">
      <div className="absolute top-10 left-[20%] w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute top-40 right-[10%] w-2 h-2 bg-white rounded-full opacity-20 animate-pulse animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-20 w-full relative z-10">
        <div className="max-w-2xl relative">
          <div className="absolute -top-32 -right-64 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none hidden lg:block animate-pulse animation-delay-4000"></div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white leading-tight">Built for speed.<br/><span className="text-slate-500 font-light">Designed to impress.</span></h2>
        </div>
      </div>
      
      <div className="w-full border-t border-b border-white/10 flex flex-col md:flex-row h-auto md:h-[450px] relative z-10">
        {FEATURE_LIST.map((feat) => {
          const isActive = activeFeature === feat.id;

          return (
            <div 
              key={feat.id} 
              onMouseEnter={() => window.innerWidth >= 768 && setActiveFeature(feat.id)}
              onMouseLeave={() => window.innerWidth >= 768 && setActiveFeature(null)}
              onClick={() => setActiveFeature(isActive ? null : feat.id)}
              className={`relative flex-1 p-8 md:p-10 lg:p-12 border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-[#0a0a0a] ${isActive ? 'md:flex-[1.4] bg-[#111111]' : ''}`}
            >
              <div className={`absolute top-0 left-0 w-full h-[2px] transition-colors duration-500 z-10 ${isActive ? 'bg-[#ff9e00]' : 'bg-transparent'}`}></div>
              
              <div className="relative h-full flex flex-col">
                <h3 className={`text-2xl lg:text-3xl font-bold text-white pr-4 tracking-tight leading-snug transform transition-all duration-500 ${isActive ? 'mb-4 md:-translate-y-2' : 'mb-4 md:mb-6'}`}>
                  {feat.title}
                </h3>
                
                <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? 'grid-rows-[1fr] opacity-100 md:translate-y-0 mb-6' : 'grid-rows-[0fr] opacity-0 md:translate-y-8 mb-0'}`}>
                  <div className="overflow-hidden">
                    <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-sm pt-2">
                      {feat.desc}
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto relative w-12 h-12 shrink-0">
                  <div className={`absolute bottom-0 left-0 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 transition-all duration-300 ${isActive ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}>
                    <i className="fas fa-arrow-right text-[10px]"></i>
                  </div>
                  
                  <div className={`absolute bottom-0 left-0 w-12 h-12 rounded-full bg-[#ff9e00] flex items-center justify-center text-black transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isActive ? 'opacity-100 scale-100 shadow-[0_0_20px_rgba(255,158,0,0.3)] rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}>
                    <i className="fas fa-arrow-right text-sm"></i>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
