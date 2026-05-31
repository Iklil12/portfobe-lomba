// app/components/sections/TemplatesSection.tsx
"use client";

import Link from 'next/link';
import { OptimizedLazyImage } from '@/components/ui/OptimizedLazyImage';
import { TEMPLATE_LIST } from '@/lib/constants';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useState, useRef, useEffect, useCallback } from 'react';

export function TemplatesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [cardAnimations, setCardAnimations] = useState<boolean[]>(new Array(TEMPLATE_LIST.length).fill(false));



  // Track active card on mobile scroll with IntersectionObserver
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('[data-card-index]');
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number((entry.target as HTMLElement).dataset.cardIndex);
            if (!isNaN(idx)) setActiveCardIndex(idx);
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  // Scroll to a specific card when dot is clicked
  const scrollToCard = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>(`[data-card-index="${index}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, []);

  return (
    <section id="templates" className="relative pt-24 pb-10 md:pt-32 md:pb-12 bg-[#020202] overflow-hidden border-y border-white/10">
      
      {/* Animated Background Glows */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#ff9e00]/8 blur-[180px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#ff5e00]/6 blur-[200px] rounded-full pointer-events-none"></div>

      {/* Subtle Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      ></div>

      <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col h-full">
        
        {/* Clean Centered Header with staggered entrance */}
        <div className="text-center mb-10 md:mb-16 px-6">

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6">
            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9e00] via-[#ffb940] to-[#ff5e00]">Brilliance.</span>
          </h2>
          <p className="text-white/40 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Swipe to explore on mobile, hover on desktop. Each architectural canvas is fully customizable and ready for your masterpiece.
          </p>
        </div>

        {/* Template Counter - Mobile Only */}
        <div className="flex md:hidden justify-between items-center px-6 mb-4">
          <span className="text-white/30 text-sm font-mono">
            <span className="text-[#ff9e00] text-lg font-bold">{String(activeCardIndex + 1).padStart(2, '0')}</span>
            <span className="mx-1">/</span>
            {String(TEMPLATE_LIST.length).padStart(2, '0')}
          </span>
          <span className="text-white/30 text-xs uppercase tracking-widest">
            {TEMPLATE_LIST[activeCardIndex]?.category}
          </span>
        </div>

        {/* The Magic Container: Snap Scroll for Mobile, Accordion for Desktop */}
        <div 
          ref={scrollContainerRef}
          className="
            flex w-full gap-4 md:gap-3 
            /* Mobile Settings: Horizontal scroll, snap to center, hide scrollbar */
            overflow-x-auto md:overflow-visible snap-x snap-mandatory px-6 md:px-8 pb-4 md:pb-0
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            /* Desktop Settings: Fixed height for Accordion */
            md:h-[70vh] md:min-h-[500px] md:max-h-[700px]
          "
        >
          {TEMPLATE_LIST.map((item, index) => {
            const isActive = hoveredIndex === index;
            const isMobileActive = activeCardIndex === index;
            const isAnimated = cardAnimations[index];
            
            return (
              <div 
                key={item.id}
                data-card-index={index}
                onMouseEnter={() => setHoveredIndex(index)}
                className={`
                  group relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden cursor-pointer shrink-0
                  flex flex-col justify-end
                  
                  /* MOBILE: Card dimensions & snapping */
                  w-[85vw] sm:w-[65vw] aspect-square snap-center
                  
                  /* DESKTOP: Accordion logic override */
                  md:w-auto md:h-auto md:aspect-auto
                  ${isActive ? 'md:flex-[6]' : 'md:flex-[1]'}
                  
                  /* Animation entrance */
                  transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]
                  opacity-100 translate-y-0 scale-100
                `}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                {/* Gradient Border Effect */}
                <div className={`
                  absolute inset-0 rounded-[1.5rem] md:rounded-[2rem] z-20 pointer-events-none
                  transition-all duration-700
                  ${isMobileActive 
                    ? 'ring-1 ring-white/40 shadow-[0_0_40px_rgba(255,255,255,0.12),inset_0_0_40px_rgba(255,255,255,0.05)]' 
                    : 'ring-1 ring-white/5'}
                  ${isActive 
                    ? 'md:ring-1 md:ring-white/30 md:shadow-[0_0_60px_rgba(255,255,255,0.15),inset_0_0_60px_rgba(255,255,255,0.05)]' 
                    : 'md:ring-1 md:ring-white/5 md:shadow-none'}
                `}></div>

                {/* Inner Container with bg */}
                <div className="absolute inset-[1px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-[#0a0a0a]">
                  
                  {/* Background Image with enhanced transitions */}
                  <OptimizedLazyImage 
                    src={item.image} 
                    alt={item.title} 
                    className={`
                      absolute inset-0 w-full h-full object-cover transition-all duration-[1.4s] ease-[cubic-bezier(0.25,1,0.5,1)]
                      /* Default (Mobile): Clear and visible with subtle zoom on active */
                      ${isMobileActive ? 'opacity-90 scale-105' : 'opacity-60 scale-100'}
                      /* Desktop Logic: Conditional based on hover */
                      ${isActive ? 'md:opacity-90 md:scale-105 md:grayscale-0' : 'md:opacity-20 md:scale-110 md:grayscale'}
                    `}
                  />

                  {/* Multi-layer Gradient Overlay */}
                  <div className={`
                    absolute inset-0 transition-opacity duration-700
                    bg-gradient-to-t from-black via-black/60 to-transparent
                    ${isMobileActive ? 'opacity-80' : 'opacity-90'}
                    ${isActive ? 'md:opacity-80' : 'md:opacity-100'}
                  `}></div>
                  <div className={`
                    absolute inset-0 transition-opacity duration-700
                    bg-gradient-to-br from-white/5 via-transparent to-transparent
                    ${isMobileActive ? 'opacity-100' : 'opacity-0'}
                    ${isActive ? 'md:opacity-100' : 'md:opacity-0'}
                  `}></div>

                  {/* Floating Card Number */}
                  <div className={`
                    absolute top-5 left-5 md:top-6 md:left-6 z-10
                    transition-all duration-700
                    ${isMobileActive ? 'opacity-60' : 'opacity-20'}
                    ${isActive ? 'md:opacity-60 md:translate-y-0' : 'md:opacity-0 md:translate-y-4'}
                  `}>
                    <span className="text-white/80 text-xs font-mono tracking-widest">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* State 1: Compressed (Desktop ONLY, completely hidden on mobile) */}
                  <div className={`
                    absolute inset-0 hidden md:flex items-center justify-center
                    transition-all duration-700
                    ${isActive ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100 delay-200'}
                  `}>
                    <h3 className="text-white text-lg font-bold uppercase tracking-[0.3em] -rotate-90 whitespace-nowrap opacity-40 group-hover:opacity-80 transition-opacity duration-500">
                      {item.title}
                    </h3>
                  </div>

                  {/* State 2: Expanded Details */}
                  <div className={`
                    absolute bottom-0 inset-x-0 z-30
                    /* MOBILE: Translucent bottom bar for clean layout separation */
                    bg-[#050505]/90 backdrop-blur-md border-t border-white/[0.04] p-4 flex items-center justify-between gap-4
                    /* DESKTOP: Traditional absolute spacious overlay */
                    md:absolute md:inset-0 md:bg-transparent md:backdrop-blur-none md:border-t-0 md:p-10 md:lg:p-12 md:flex md:flex-col md:justify-end md:h-full md:w-full md:gap-0
                    
                    transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                    /* Desktop Logic */
                    ${isActive ? 'md:opacity-100 md:translate-y-0 md:delay-200' : 'md:opacity-0 md:translate-y-12 md:pointer-events-none md:absolute md:bottom-0'}
                  `}>
                    <div className="flex flex-row md:flex-col justify-between items-center md:items-stretch md:justify-end gap-3 md:gap-0 w-full md:h-full">
                      <div className="max-w-xl min-w-0 flex-1 md:flex-none">
                        {/* Category Tag */}
                        <p className="text-white text-[9px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1 sm:mb-1.5 md:mb-3 flex items-center gap-1.5 md:gap-2.5">
                          <span className={`
                            h-[2px] bg-gradient-to-r from-white to-transparent transition-all duration-700
                            ${isMobileActive ? 'w-6 sm:w-8' : 'w-4'}
                            ${isActive ? 'md:w-10' : 'md:w-0'}
                          `}></span>
                          {item.category}
                        </p>
                        
                        {/* Title with gradient on active */}
                        <h3 className={`
                          text-base sm:text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-widest mb-0.5 md:mb-2 leading-snug
                          transition-all duration-500 truncate md:whitespace-normal
                          ${isMobileActive ? 'text-white' : 'text-white/70'}
                          md:text-white
                        `}>
                          {item.title}
                        </h3>
                        
                        {/* Description - Desktop only */}
                        <p className={`
                          text-white/50 text-sm hidden md:block max-w-md leading-relaxed mt-2
                          transition-all duration-500 delay-100
                          ${isActive ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-4'}
                        `}>
                          A perfect starting point for your next portfolio. Experience the seamless blend of form and function.
                        </p>
                      </div>
                      
                      {/* CTA Button with shimmer effect */}
                      <Link 
                        href="/register" 
                        className={`
                          shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full 
                          flex items-center justify-center 
                          transition-all duration-500 
                          shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                          ${isMobileActive 
                            ? 'bg-white text-black scale-100' 
                            : 'bg-white/10 text-white/40 scale-90'}
                          md:bg-white md:text-black md:scale-100
                          md:hover:bg-white md:hover:scale-110 md:hover:shadow-[0_8px_40px_rgba(255,255,255,0.3)]
                          group/btn
                        `}
                      >
                        <i className="fas fa-arrow-right -rotate-45 group-hover/btn:rotate-0 transition-transform duration-500 text-sm sm:text-base md:text-lg"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Dot Indicators with animated progress */}
        <div className="flex md:hidden justify-center items-center gap-2 mt-6 px-6">
          {TEMPLATE_LIST.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              aria-label={`Go to template ${index + 1}`}
              className={`
                rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                ${activeCardIndex === index 
                  ? 'w-8 h-2 bg-gradient-to-r from-[#ff9e00] to-[#ff5e00] shadow-[0_0_12px_rgba(255,158,0,0.4)]' 
                  : 'w-2 h-2 bg-white/15 hover:bg-white/30'}
              `}
            />
          ))}
        </div>

        {/* Swipe Hint - Mobile Only, fades out after first scroll */}
        <div className={`
          flex md:hidden justify-center items-center gap-2 mt-4
          transition-opacity duration-1000
          ${activeCardIndex > 0 ? 'opacity-0 pointer-events-none' : 'opacity-40'}
        `}>
          <span className="text-white/60 text-xs uppercase tracking-widest flex items-center gap-2">
            <i className="fas fa-hand-pointer text-[#ff9e00]/60"></i>
            Swipe to explore
          </span>
        </div>

        {/* Global Action Button */}
        <div className="mt-10 md:mt-16 flex justify-center pb-0 px-6">
            <Link href="/register" className="group relative flex items-center gap-4 px-8 py-4 rounded-full border border-white/10 text-white font-bold hover:border-[#ff9e00]/30 hover:shadow-[0_0_40px_rgba(255,158,0,0.1)] transition-all duration-500 w-full md:w-auto justify-center overflow-hidden">
              {/* Button shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              <span className="relative z-10">View Template Gallery</span>
              <i className="fas fa-arrow-right relative z-10 group-hover:translate-x-1 transition-transform"></i>
            </Link>
        </div>
        
      </div>
    </section>
  );
}