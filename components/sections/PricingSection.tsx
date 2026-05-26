"use client";

import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useState, useEffect, useRef } from 'react';

const STARTER_FEATURES = [
  { text: '1 Portfolio Page', icon: 'fa-layer-group' },
  { text: 'Up to 12 Content Blocks', icon: 'fa-cube' },
  { text: 'Standard portfo.be/name link', icon: 'fa-link' },
  { text: 'Community Support', icon: 'fa-users' },
];

const PRO_FEATURES = [
  { text: 'Unlimited Pages & Blocks', icon: 'fa-infinity' },
  { text: 'Custom Domain (.com/.id) coming soon', icon: 'fa-globe' },
  { text: 'Advanced Analytics Dashboard', icon: 'fa-chart-line' },
  { text: 'Remove Portfo.be Badge', icon: 'fa-eye-slash' },
  { text: 'Priority Support', icon: 'fa-headset' },
];

export function PricingSection() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const [isInView, setIsInView] = useState(false);
  const [starterAnimated, setStarterAnimated] = useState(false);
  const [proAnimated, setProAnimated] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<'starter' | 'pro' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect when section comes into view for staggered animations
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setTimeout(() => setStarterAnimated(true), 200);
          setTimeout(() => setProAnimated(true), 450);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="relative py-24 md:py-36 bg-[#080810] overflow-hidden">
      
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.06) 0%, transparent 70%)',
        }}
      ></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#a855f7]/4 blur-[200px] rounded-full pointer-events-none animate-blob"></div>
      <div className="absolute top-1/3 right-[10%] w-[400px] h-[400px] bg-[#ff9e00]/3 blur-[180px] rounded-full pointer-events-none animate-blob animation-delay-4000"></div>

      {/* Subtle Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      ></div>

      <div ref={containerRef} className="max-w-6xl mx-auto px-5 md:px-12 relative z-10">
        
        {/* Header */}
        <div className={`text-center mb-16 md:mb-20 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 text-white">
            Simple <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] via-[#c084fc] to-[#e879f9]">pricing</span>
          </h2>
          <p className="text-white/35 font-medium text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Get started with Portfo.be today and experience the power of seamless portfolio creation.
          </p>
        </div>
        
        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
          
          {/* ─── STARTER CARD ─── */}
          <div 
            onMouseEnter={() => setHoveredCard('starter')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`
              relative rounded-[1.75rem] overflow-hidden
              transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
              ${starterAnimated ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-[0.97]'}
              ${hoveredCard === 'starter' ? 'md:-translate-y-2' : ''}
            `}
          >
            {/* Border glow */}
            <div className={`
              absolute inset-0 rounded-[1.75rem] pointer-events-none z-10
              transition-all duration-700
              ${hoveredCard === 'starter' 
                ? 'ring-1 ring-white/15 shadow-[0_8px_60px_rgba(255,255,255,0.06)]' 
                : 'ring-1 ring-white/5'}
            `}></div>

            <div className="relative bg-[#0e0e14] p-7 md:p-10">
              
              {/* Hover gradient overlay */}
              <div className={`
                absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent
                transition-opacity duration-500
                ${hoveredCard === 'starter' ? 'opacity-100' : 'opacity-0'}
              `}></div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Plan Label */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <i className="fas fa-rocket text-white/50 text-sm"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Starter</h3>
                      <p className="text-white/30 text-xs font-medium">Free forever</p>
                    </div>
                  </div>
                </div>
                
                {/* Price */}
                <div className="mb-7">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">Rp0</span>
                  </div>
                  <p className="text-white/25 text-sm mt-2 font-medium">Everything you need to start</p>
                </div>
                
                {/* CTA Button */}
                <Link 
                  href="/register" 
                  className={`
                    group/btn relative block w-full text-center py-4 rounded-2xl font-bold text-sm uppercase tracking-wider
                    transition-all duration-500 mb-9 overflow-hidden
                    bg-white/[0.07] text-white border border-white/10
                    hover:bg-white hover:text-[#0e0e14] hover:border-white
                    hover:shadow-[0_8px_30px_rgba(255,255,255,0.12)]
                    active:scale-[0.98]
                  `}
                >
                  {/* Shimmer sweep */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  <span className="relative z-10">Get Started</span>
                </Link>
                
                {/* Features */}
                <div className="space-y-0">
                  <p className="text-white/20 text-[11px] font-bold uppercase tracking-widest mb-4">What&apos;s included</p>
                  {STARTER_FEATURES.map((feat, i) => (
                    <div 
                      key={i} 
                      className={`
                        group/item flex items-center gap-3.5 py-3 border-t border-white/[0.04]
                        transition-all duration-300 cursor-default
                        hover:bg-white/[0.02] hover:px-2 rounded-lg -mx-2
                      `}
                    >
                      <div className={`
                        w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                        transition-all duration-300
                        bg-white/[0.04] group-hover/item:bg-[#a855f7]/15
                      `}>
                        <i className={`fas ${feat.icon} text-[10px] text-white/40 group-hover/item:text-[#c084fc] transition-colors duration-300`}></i>
                      </div>
                      <span className="text-white/50 text-sm font-medium group-hover/item:text-white/80 transition-colors duration-300">{feat.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── PRO CARD ─── */}
          <div 
            onMouseEnter={() => setHoveredCard('pro')}
            onMouseLeave={() => setHoveredCard(null)}
            className={`
              relative rounded-[1.75rem] overflow-hidden
              transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
              ${proAnimated ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-[0.97]'}
              ${hoveredCard === 'pro' ? 'md:-translate-y-2' : ''}
            `}
          >
            {/* Animated gradient border */}
            <div className={`
              absolute inset-0 rounded-[1.75rem] pointer-events-none z-10
              transition-all duration-700
              ${hoveredCard === 'pro' 
                ? 'ring-1 ring-[#a855f7]/40 shadow-[0_8px_80px_rgba(168,85,247,0.15),0_0_60px_rgba(168,85,247,0.08)]' 
                : 'ring-1 ring-[#a855f7]/15 shadow-[0_0_30px_rgba(168,85,247,0.05)]'}
            `}></div>

            <div className="relative bg-gradient-to-b from-[#12101e] to-[#0e0e14] p-7 md:p-10">
              
              {/* Decorative gradient glow */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#a855f7]/30 to-transparent"></div>
              
              {/* Hover gradient overlay */}
              <div className={`
                absolute inset-0 bg-gradient-to-br from-[#a855f7]/[0.03] via-transparent to-[#6366f1]/[0.02]
                transition-opacity duration-500
                ${hoveredCard === 'pro' ? 'opacity-100' : 'opacity-0'}
              `}></div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Plan Label */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 flex items-center justify-center">
                      <i className="fas fa-crown text-[#c084fc] text-sm"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Pro Creator</h3>
                      <p className="text-[#c084fc]/60 text-xs font-medium">Most popular</p>
                    </div>
                  </div>
                  {/* Popular badge */}
                  <div className="px-3 py-1 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/20">
                    <span className="text-[#c084fc] text-[10px] font-bold uppercase tracking-wider">Popular</span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="mb-7">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">Rp49k</span>
                    <span className="text-white/25 font-medium text-base">/mo</span>
                  </div>
                  <p className="text-white/25 text-sm mt-2 font-medium">Unlock your full potential</p>
                </div>
                
                {/* CTA Button - Purple gradient */}
                <Link 
                  href="/register" 
                  className={`
                    group/btn relative block w-full text-center py-4 rounded-2xl font-bold text-sm uppercase tracking-wider
                    transition-all duration-500 mb-9 overflow-hidden
                    bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white
                    hover:from-[#b366f8] hover:to-[#8b5cf6]
                    hover:shadow-[0_8px_40px_rgba(168,85,247,0.35)]
                    active:scale-[0.98]
                  `}
                >
                  {/* Shimmer sweep */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <span className="relative z-10">Get Started</span>
                </Link>
                
                {/* Features */}
                <div className="space-y-0">
                  <p className="text-[#c084fc]/40 text-[11px] font-bold uppercase tracking-widest mb-4">Everything in Starter, plus</p>
                  {PRO_FEATURES.map((feat, i) => (
                    <div 
                      key={i} 
                      className={`
                        group/item flex items-center gap-3.5 py-3 border-t border-white/[0.04]
                        transition-all duration-300 cursor-default
                        hover:bg-[#a855f7]/[0.03] hover:px-2 rounded-lg -mx-2
                      `}
                    >
                      <div className={`
                        w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                        transition-all duration-300
                        bg-[#a855f7]/[0.08] group-hover/item:bg-[#a855f7]/20
                      `}>
                        <i className={`fas ${feat.icon} text-[10px] text-[#a855f7]/60 group-hover/item:text-[#c084fc] transition-colors duration-300`}></i>
                      </div>
                      <span className="text-white/50 text-sm font-medium group-hover/item:text-white/80 transition-colors duration-300">{feat.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Trust Footer */}
        <div className={`
          text-center mt-12 md:mt-16
          transition-all duration-700 delay-700
          ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        `}>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-white/20">
            <div className="flex items-center gap-2">
              <i className="fas fa-shield-alt text-xs"></i>
              <span className="text-xs font-medium uppercase tracking-wider">Secure Payment</span>
            </div>
            <div className="w-px h-3 bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <i className="fas fa-bolt text-xs"></i>
              <span className="text-xs font-medium uppercase tracking-wider">Instant Setup</span>
            </div>
            <div className="w-px h-3 bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <i className="fas fa-times-circle text-xs"></i>
              <span className="text-xs font-medium uppercase tracking-wider">Cancel Anytime</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
