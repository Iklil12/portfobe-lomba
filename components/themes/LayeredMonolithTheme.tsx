"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import Link from 'next/link';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { EditableText } from '@/components/ui/EditableText';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { AnimatePresence, motion } from 'framer-motion';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);
}

export default function LayeredMonolithTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Sync Lenis with ScrollTrigger
    useLenis((scroll) => {
        if (!isCardPreview) {
            ScrollTrigger.update();
        }
    });

    const [timeString, setTimeString] = useState('00:00:00 WIB');
    
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Jakarta',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            setTimeString(time + ' WIB');
        };
        const timer = setInterval(updateTime, 1000);
        updateTime();
        return () => clearInterval(timer);
    }, []);

    const fullName = data?.profile?.fullName || data?.fullName || "Elevate Studio";
    const profession = data?.profile?.profession || data?.profession || "Digital Architecture";
    const bio = data?.profile?.bio || data?.bio || "Merging architectural precision with dynamic interaction to build flagship digital products for visionary brands.";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    
    const allProjects = data?.projects || data?.user?.projects || [];
    const featuredProjects = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d').slice(0, 4);
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];
    const services = data?.services || data?.user?.services || [
        { title: 'Strategy & Identity', description: 'Brand Positioning, Visual Identity Systems, Typography, Tone of Voice, Art Direction.' },
        { title: 'Spatial UX/UI', description: 'User Experience Design, Wireframing, Prototyping, Design Systems, Mobile Apps.' },
        { title: 'Creative Engineering', description: 'WebGL / 3D Experiences, GSAP Animation, React / Next.js, Headless CMS, E-Commerce.' }
    ];

    // GSAP Stacking Effect
    useGSAP(() => {
        if (isCardPreview) return;
        
        const cards = gsap.utils.toArray('.stack-card') as HTMLElement[];
        
        cards.forEach((card, i) => {
            if (i === cards.length - 1) return; // Skip last card

            const nextCard = cards[i + 1];

            // Shrink animation (removed brightness to prevent instant black bug)
            gsap.to(card, {
                scale: 0.92,
                opacity: 0.8,
                ease: "none",
                scrollTrigger: {
                    trigger: nextCard,
                    start: "top 95%", 
                    end: "top 5%",      
                    scrub: true,         
                }
            });

            // Parallax Images
            const img = card.querySelector('.parallax-img');
            if (img) {
                gsap.to(img, {
                    yPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        });

        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
        
        return () => clearTimeout(timer);
    }, { scope: containerRef, dependencies: [featuredProjects.length, isMobileView, isCardPreview] });

    // Custom Cursor Logic
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorTextRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (isMobileView || isCardPreview) return;
        
        const cursor = cursorRef.current;
        const cursorText = cursorTextRef.current;
        if (!cursor || !cursorText) return;

        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('mousemove', onMouseMove);

        const ticker = gsap.ticker.add(() => {
            cursorPos.x += (mouse.x - cursorPos.x) * 0.2;
            cursorPos.y += (mouse.y - cursorPos.y) * 0.2;
            gsap.set(cursor, { x: cursorPos.x, y: cursorPos.y });
        });

        const hoverElements = document.querySelectorAll('.cursor-hover');
        
        const handleMouseEnter = (e: Event) => {
            cursor.classList.add('hover-mode');
            const target = e.currentTarget as HTMLElement;
            const text = target.getAttribute('data-cursor-text');
            if (text && cursorText) cursorText.innerText = text;
        };

        const onMouseLeave = () => {
            cursor.classList.remove('hover-mode');
            if (cursorText) cursorText.innerText = "VIEW";
        };

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            gsap.ticker.remove(ticker);
            hoverElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', onMouseLeave);
            });
        };
    }, [isMobileView, isCardPreview]);

    const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(`nav-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Fonts
    const fontHeading = theme?.fontHeading || 'Space Grotesk';
    const fontBody = theme?.fontBody || 'Manrope';

    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('space grotesk')) return "'Space Grotesk', sans-serif";
        if (f?.toLowerCase().includes('manrope')) return "'Manrope', sans-serif";
        if (f?.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif')) return "'Playfair Display', serif";
        return "'Inter', sans-serif";
    };
    
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);
    const accentColor = theme?.themeColor || '#E84A27';

    const buttonShape = theme?.buttonShape || 'hard';
    const radiusClass = buttonShape === 'pill' ? 'rounded-[32px]' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const btnRadiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-xl' : 'rounded-none';

    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#1A1A18] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1A1A18] shadow-none' : 'bg-[#1e1e1c] border border-white/10';

    const content = (
        <div ref={containerRef} className="layered-monolith-root bg-black text-[#1A1A18] font-body selection:bg-brand-accent selection:text-white min-h-screen relative">
            <style dangerouslySetInnerHTML={{
                __html: `
                .layered-monolith-root {
                    --brand-accent: ${accentColor};
                    ${!isMobileView && !isCardPreview ? 'cursor: none;' : ''}
                }
                .layered-monolith-root .font-display { font-family: ${customHeadingFont} !important; }
                .layered-monolith-root .font-body { font-family: ${customBodyFont} !important; }
                .layered-monolith-root .text-brand-accent { color: var(--brand-accent) !important; }
                .layered-monolith-root .bg-brand-accent { background-color: var(--brand-accent) !important; }
                .layered-monolith-root .border-brand-accent { border-color: var(--brand-accent) !important; }

                /* Lenis Override to prevent native smooth scroll conflict */
                html.lenis, html.lenis body { height: auto; }
                .lenis.lenis-smooth { scroll-behavior: auto !important; }
                .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
                .lenis.lenis-stopped { overflow: hidden; }
                

                #cursor {
                    position: fixed; top: 0; left: 0; width: 12px; height: 12px;
                    background-color: var(--brand-accent); border-radius: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none; z-index: 99999;
                    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                                height 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                                background-color 0.3s, mix-blend-mode 0.3s;
                    display: flex; align-items: center; justify-content: center;
                }
                #cursor.hover-mode {
                    width: 80px; height: 80px;
                    background-color: #fff; mix-blend-mode: difference;
                }
                .custom-cursor-label {
                    display: none; font-family: ${customHeadingFont};
                    font-size: 10px; font-weight: 700; letter-spacing: 1px; 
                    color: #000; text-transform: uppercase;
                }
                #cursor.hover-mode .custom-cursor-label { display: block; }

                .stack-container { position: relative; width: 100%; }
                /* Stacking cards */
                .stack-card {
                    position: sticky; top: 0; height: 100dvh; width: 100%; overflow: hidden;
                    transform-origin: top center; border-bottom: 1px solid rgba(0,0,0,0.1);
                    box-shadow: 0 -20px 50px rgba(0,0,0,0.15); 
                    display: flex; flex-direction: column; will-change: transform, filter;
                }
                .stack-card:nth-child(1) { box-shadow: none; border-bottom: none; }
                
                .parallax-img { position: absolute; top: 0; left: 0; width: 100%; height: 120%; object-fit: cover; z-index: 0; }
                .parallax-overlay { position: absolute; inset: 0; z-index: 1; }

                .floating-dock {
                    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
                    background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.2); border-radius: 100px;
                    padding: 0.5rem 1rem; display: flex; gap: 2rem; z-index: 9999;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: all 0.4s ease;
                }
                .floating-dock a {
                    font-family: ${customHeadingFont}; font-size: 0.75rem; text-transform: uppercase;
                    font-weight: 600; letter-spacing: 0.1em; color: #fff; opacity: 0.7; transition: opacity 0.3s;
                    padding: 0.5rem;
                }
                .floating-dock a:hover { opacity: 1; }

                @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
                .animate-marquee { display: flex; width: 200%; white-space: nowrap; animation: marquee 20s linear infinite; }
                @keyframes spin-slow { 100% { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 12s linear infinite; }

                .chip {
                    border: 1px solid rgba(255,255,255,0.2); border-radius: 50px;
                    padding: 6px 16px; font-family: ${customHeadingFont};
                    font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em;
                    backdrop-filter: blur(10px); background: rgba(255,255,255,0.05);
                }
                .chip-dark { border-color: rgba(0,0,0,0.2); background: rgba(0,0,0,0.05); }

                @media (max-width: 768px) {
                    #cursor { display: none; }
                    .layered-monolith-root { cursor: auto; }
                    .floating-dock { bottom: 1rem; width: 90%; gap: 1rem; justify-content: space-around; padding: 0.5rem; }
                    .floating-dock a { font-size: 0.65rem; gap: 0.5rem; }
                }

                .noise {
                    position: absolute; inset: 0; opacity: 0.03; z-index: 1; pointer-events: none;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
            `}} />

            {!isMobileView && !isCardPreview && (
                <div id="cursor" ref={cursorRef}><span className="custom-cursor-label" ref={cursorTextRef}>VIEW</span></div>
            )}

            {/* Floating Dock Navigation */}
            <nav className="floating-dock mix-blend-difference">
                <a href="#hero" onClick={(e) => handleScrollTo(e, 'hero')} className="cursor-hover" data-cursor-text="TOP">Start</a>
                <a href="#philosophy" onClick={(e) => handleScrollTo(e, 'philosophy')} className="cursor-hover" data-cursor-text="READ">Ethos</a>
                <a href="#works" onClick={(e) => handleScrollTo(e, 'works')} className="cursor-hover" data-cursor-text="VIEW">Works</a>
                <a href="#expertise" onClick={(e) => handleScrollTo(e, 'expertise')} className="cursor-hover" data-cursor-text="INFO">Studio</a>
            </nav>

            <main className="stack-container w-full">
                <div id="nav-hero" className="w-full h-0 pointer-events-none invisible"></div>
                {/* HERO CARD */}
                <section id="hero" className="stack-card bg-[#F5F5F0] flex flex-col justify-between overflow-hidden relative" style={{ zIndex: 10 }}>
                    <div className="noise mix-blend-multiply"></div>
                    
                    <div className="absolute top-8 right-8 md:top-12 md:right-12 z-20 w-24 h-24 md:w-32 md:h-32 opacity-60">
                        <svg className="animate-spin-slow w-full h-full" viewBox="0 0 100 100">
                            <path id="circlePath" fill="none" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                            <text fontFamily={customHeadingFont} fontSize="10" fontWeight="600" letterSpacing="2" fill="#1A1A18">
                                <textPath href="#circlePath">
                                    {isEditor ? (
                                        <tspan>{theme?.customTexts?.lm_badge_text || 'EST. 2026 • INDEPENDENT STUDIO •'}</tspan>
                                    ) : (
                                        <EditableText value={theme?.customTexts?.lm_badge_text || 'EST. 2026 • INDEPENDENT STUDIO •'} field="lm_badge_text" entity="appearance" isEditor={isEditor} as="tspan" maxLength={45} />
                                    )}
                                </textPath>
                            </text>
                        </svg>
                    </div>

                    <header className="p-8 md:p-12 relative z-10 w-full">
                        <h1 className="font-display font-bold text-xl md:text-2xl tracking-tight">
                            <EditableText value={fullName.split(' ')[0].toUpperCase()} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                            <sup className="text-xs ml-1 opacity-50">TM</sup>
                        </h1>
                    </header>

                    <div className="grow flex flex-col justify-center items-center text-center relative z-10 w-full px-4">
                        <p className="font-body font-medium text-brand-accent tracking-[0.3em] uppercase text-xs md:text-sm mb-6">
                            <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={40} />
                        </p>
                        <h2 className="font-display text-6xl md:text-[8rem] lg:text-[10rem] font-bold uppercase leading-[0.85] tracking-tighter cursor-hover" data-cursor-text="SCROLL">
                            <EditableText value={theme?.customTexts?.lm_hero_h1 || 'Shaping'} field="lm_hero_h1" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /><br/>
                            <EditableText value={theme?.customTexts?.lm_hero_h2 || 'The'} field="lm_hero_h2" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /><br/>
                            <span className="italic font-light">
                                <EditableText value={theme?.customTexts?.lm_hero_h3 || 'Unseen.'} field="lm_hero_h3" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                            </span>
                        </h2>
                        <div className="mt-8 md:mt-12 flex justify-center w-full">
                            <p className="font-body text-sm md:text-base max-w-md text-[#1A1A18]/60 leading-relaxed font-medium">
                                <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={200} />
                            </p>
                        </div>
                    </div>

                    <div className="w-full relative z-10 border-t border-black/10 overflow-hidden bg-black/5 py-4">
                        <div className="animate-marquee font-display text-xs uppercase tracking-widest opacity-70">
                            <span className="mx-8">• CREATIVE DIRECTION</span>
                            <span className="mx-8">• WEBGL DEVELOPMENT</span>
                            <span className="mx-8">• SPATIAL UI/UX</span>
                            <span className="mx-8">• BRAND STRATEGY</span>
                            <span className="mx-8">• MOTION DESIGN</span>
                            <span className="mx-8">• CREATIVE DIRECTION</span>
                            <span className="mx-8">• WEBGL DEVELOPMENT</span>
                            <span className="mx-8">• SPATIAL UI/UX</span>
                            <span className="mx-8">• BRAND STRATEGY</span>
                            <span className="mx-8">• MOTION DESIGN</span>
                        </div>
                    </div>
                </section>

                <div id="nav-philosophy" className="w-full h-0 pointer-events-none invisible"></div>
                {/* PHILOSOPHY CARD */}
                <section id="philosophy" className="stack-card bg-[#1A1A18] text-[#F5F5F0] p-8 md:p-16 flex flex-col justify-center" style={{ zIndex: 15 }}>
                    <div className="noise mix-blend-overlay opacity-20"></div>
                    
                    <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col gap-12">
                        <p className="font-display text-xs tracking-[0.3em] uppercase opacity-50 border-l border-brand-accent pl-4">
                            <EditableText value={theme?.customTexts?.lm_ethos_label || '00 — The Ethos'} field="lm_ethos_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                        </p>
                        
                        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter leading-[1.1] max-w-4xl cursor-hover" data-cursor-text="READ">
                            <EditableText value={theme?.customTexts?.lm_ethos_h1 || "We don't just design interfaces. We engineer"} field="lm_ethos_h1" entity="appearance" isEditor={isEditor} as="span" maxLength={100} />{' '}
                            <span className="italic font-light text-brand-accent">
                                <EditableText value={theme?.customTexts?.lm_ethos_h2 || "digital legacies"} field="lm_ethos_h2" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                            </span>{' '}
                            <EditableText value={theme?.customTexts?.lm_ethos_h3 || "that command attention."} field="lm_ethos_h3" entity="appearance" isEditor={isEditor} as="span" maxLength={50} />
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 mt-8 pt-8 border-t border-white/10">
                            <div className="font-body text-sm md:text-base text-white/60 leading-relaxed">
                                <EditableText value={theme?.customTexts?.lm_ethos_desc || 'In a sea of templates and standard grids, we choose rebellion guided by discipline. Every pixel, motion, and interaction is calculated to evoke emotion and establish authority for our partners.'} field="lm_ethos_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={300} />
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-2 h-2 rounded-full bg-brand-accent mt-2"></div>
                                <p className="font-display text-xs uppercase tracking-widest leading-loose">
                                    <EditableText value={theme?.customTexts?.lm_location || 'Based in Sampang, IDN.'} field="lm_location" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /><br/>
                                    Operating Globally.<br/>
                                    Est. MMXVI
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WORK CARDS */}
                <div id="nav-works" className="w-full h-0 pointer-events-none invisible"></div>
                <div id="works">
                    {featuredProjects.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        // Alternate card styles
                        const bgClasses = ['bg-[#1E2328] text-white', 'bg-black text-white', 'bg-[#F5F5F0] text-[#1A1A18]', 'bg-[#1A1A18] text-white'];
                        const overlayClasses = [
                            'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))',
                            'rgba(0,0,0,0.6)',
                            'linear-gradient(to top, rgba(245,245,240,1), rgba(245,245,240,0.3))',
                            'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4))'
                        ];
                        const chipStyles = [
                            'chip', 'chip', 'chip chip-dark text-black', 'chip'
                        ];
                        const zIndex = 20 + (i * 10);
                        const styleIdx = i % bgClasses.length;

                        return (
                            <section key={i} className={`stack-card ${bgClasses[styleIdx]} flex items-center justify-center relative cursor-pointer`} style={{ zIndex }} onClick={() => {
                                if (isVideo || p.projectType === 'photo') {
                                    setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                } else if (p.mediaUrl) {
                                    window.open(p.mediaUrl, '_blank');
                                }
                            }}>
                                <img src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className={`parallax-img ${styleIdx === 2 ? 'opacity-80 mix-blend-multiply filter grayscale contrast-125' : ''}`} />
                                <div className="parallax-overlay" style={{ background: overlayClasses[styleIdx] }}></div>
                                <div className={`noise ${styleIdx === 2 ? 'mix-blend-multiply opacity-5' : 'mix-blend-overlay opacity-10'}`}></div>

                                <div className="relative z-10 p-8 md:p-12 w-full h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className={`font-display text-xs tracking-[0.3em] uppercase border ${styleIdx === 2 ? 'border-black/30' : 'border-white/30'} px-4 py-2 rounded-full backdrop-blur-md`}>
                                            PRJ / 0{i + 1}
                                        </span>
                                        <span className="font-body text-xs tracking-widest opacity-70">
                                            {p.year || new Date().getFullYear()}
                                        </span>
                                    </div>

                                    <div className="cursor-hover pb-24 md:pb-0 group" data-cursor-text="VIEW">
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className={chipStyles[styleIdx]}>{p.projectType || 'Project'}</span>
                                        </div>
                                        <h3 className="font-display text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-4 group-hover:scale-[1.02] origin-left transition-transform duration-500">
                                            {p.title}
                                        </h3>
                                        <p className={`font-body text-sm md:text-base max-w-sm ${styleIdx === 2 ? 'text-[#1A1A18]/70 font-medium' : 'text-white/70 font-light'}`}>
                                            {p.description || 'View details of this featured project.'}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                    
                    {/* View Gallery Card */}
                    {allProjects.length > featuredProjects.length && (
                        <section className="stack-card bg-brand-accent text-white flex items-center justify-center relative cursor-pointer" style={{ zIndex: 20 + featuredProjects.length * 10 }}>
                            <div className="noise mix-blend-overlay opacity-20"></div>
                            <Link href={`/${subdomain}/gallery`} scroll={false} className="relative z-10 flex flex-col items-center justify-center w-full h-full cursor-hover group" data-cursor-text="ALL">
                                <h2 className="font-display text-6xl md:text-[8rem] font-bold uppercase leading-none tracking-tighter group-hover:scale-105 transition-transform duration-500">
                                    EXPLORE<br/>ARCHIVE
                                </h2>
                                <div className={`mt-8 border border-white px-8 py-4 font-display uppercase tracking-widest text-sm group-hover:bg-white group-hover:text-brand-accent transition-colors ${btnRadiusClass}`}>
                                    View All {allProjects.length} Projects
                                </div>
                            </Link>
                        </section>
                    )}
                </div>

                {/* 3D CONSTRUCTS CARD */}
                {items3D.length > 0 && (
                    <section id="models" className="stack-card bg-[#F5F5F0] text-[#1A1A18] p-8 md:p-16 flex flex-col" style={{ zIndex: 55 }}>
                        <div className="noise mix-blend-multiply opacity-5"></div>
                        <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col gap-8 h-full">
                            <p className="font-display text-xs tracking-[0.3em] uppercase opacity-50 border-l border-brand-accent pl-4">
                                <EditableText value={theme?.customTexts?.lm_models_label || 'Interactive Constructs'} field="lm_models_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                            </p>
                            
                            <div className="w-full grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                {items3D.slice(0,2).map((p: any, idx: number) => (
                                    <div key={idx} className="bg-[#1A1A18] flex flex-col h-[50vh] md:h-[60vh] overflow-hidden group cursor-hover" data-cursor-text="DRAG">
                                        <div className="p-4 border-b border-white/10 flex justify-between items-center text-white shrink-0">
                                            <span className="font-display text-xs uppercase tracking-widest">{p.title}</span>
                                            <span className="text-[10px] uppercase bg-white/10 px-2 py-1 rounded-sm">3D MODEL</span>
                                        </div>
                                        <div className={`w-full aspect-video bg-black overflow-hidden relative ${radiusClass}`}>
                                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#000000" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <div id="nav-expertise" className="w-full h-0 pointer-events-none invisible"></div>
                {/* EXPERTISE CARD */}
                <section id="expertise" className="stack-card bg-[#1E2328] text-white p-8 md:p-16 flex flex-col justify-center" style={{ zIndex: 60 }}>
                    <div className="noise mix-blend-overlay opacity-10"></div>
                    
                    <div className="w-full max-w-6xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                            <h2 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">
                                <EditableText value={theme?.customTexts?.lm_expertise_title || 'Studio\nCapabilities.'} field="lm_expertise_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                            </h2>
                            <p className="font-body text-sm md:text-base max-w-xs text-white/60 font-light">
                                <EditableText value={theme?.customTexts?.lm_expertise_desc || 'Delivering end-to-end digital solutions, from conceptual strategy to flawless creative engineering.'} field="lm_expertise_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={150} />
                            </p>
                        </div>

                        <div className="flex flex-col border-t border-white/10">
                            {services.map((svc: any, i: number) => (
                                <div key={i} className="group flex flex-col md:flex-row justify-between items-start md:items-center py-8 border-b border-white/10 cursor-hover transition-colors hover:bg-white/5 px-4 -mx-4 rounded-lg" data-cursor-text="INFO">
                                    <div className="flex items-center gap-6 md:gap-12 w-full md:w-1/2">
                                        <span className="font-display text-xs tracking-widest opacity-40">0{i + 1}</span>
                                        <h3 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight group-hover:pl-4 transition-all duration-300">
                                            {svc.title || svc.name}
                                        </h3>
                                    </div>
                                    <div className="mt-4 md:mt-0 md:w-1/2 pl-12 md:pl-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <p className="font-body text-sm">{svc.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* AWARDS CARD */}
                {awardItems.length > 0 && (
                    <section id="awards" className="stack-card bg-[#F5F5F0] text-[#1A1A18] p-8 md:p-16 flex flex-col justify-center" style={{ zIndex: 65 }}>
                        <div className="noise mix-blend-multiply opacity-5"></div>
                        
                        <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col gap-12">
                            <p className="font-display text-xs tracking-[0.3em] uppercase opacity-50 border-l border-brand-accent pl-4">
                                <EditableText value={theme?.customTexts?.lm_awards_label || 'Recognition'} field="lm_awards_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                            </p>
                            
                            <div className="flex flex-col border-t border-black/10 text-sm md:text-base font-body font-medium uppercase tracking-widest">
                                {awardItems.map((award: any, i: number) => (
                                    <div key={i} className="flex flex-col md:flex-row justify-between py-6 border-b border-black/10 cursor-hover group" data-cursor-text="WINNER">
                                        <span className="mb-2 md:mb-0 group-hover:text-brand-accent transition-colors">{award.title}</span>
                                        <span className="opacity-60 mb-2 md:mb-0">{award.issuer}</span>
                                        <span>{award.year || new Date(award.createdAt).getFullYear()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* TESTIMONIALS CARD (BONUS SECTION) */}
                {testimonials.length > 0 && (
                    <section id="testimonials" className="stack-card bg-[#1A1A18] text-white p-8 md:p-16 flex flex-col justify-center" style={{ zIndex: 68 }}>
                        <div className="noise mix-blend-overlay opacity-10"></div>
                        
                        <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col h-full justify-center py-20">
                            <p className="font-display text-xs tracking-[0.3em] uppercase opacity-50 border-l border-brand-accent pl-4 mb-12">
                                <EditableText value={theme?.customTexts?.lm_testi_label || 'Client Feedback'} field="lm_testi_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                            </p>
                            
                            <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-8 no-scrollbar cursor-hover" data-cursor-text="DRAG">
                                {testimonials.map((t: any, i: number) => (
                                    <div key={i} className={`p-8 md:p-12 hover:bg-white/5 transition-colors ${cardStyleClass} ${radiusClass}`}>
                                        <p className="font-display text-2xl md:text-4xl font-light italic leading-tight mb-12">
                                            "{t.content}"
                                        </p>
                                        <div className="flex items-center gap-4">
                                            {t.avatarUrl || t.avatar ? (
                                                <img src={t.avatarUrl || t.avatar} alt={t.clientName} className="w-14 h-14 rounded-full object-cover grayscale border border-white/20" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-full bg-brand-accent/20 flex items-center justify-center font-display font-bold text-brand-accent border border-brand-accent/30">
                                                    {(t.clientName || 'U').charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-display font-bold uppercase tracking-tight text-lg">{t.clientName}</h4>
                                                <p className="font-body text-xs uppercase tracking-widest text-white/50">{t.position} {t.company ? `AT ${t.company}` : ''}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* FOOTER CARD */}
                <section id="contact" className="stack-card bg-brand-accent text-white p-8 md:p-12 flex flex-col justify-between" style={{ zIndex: 70 }}>
                    <div className="noise mix-blend-overlay opacity-20"></div>
                    
                    <div className="grow flex flex-col items-center justify-center text-center relative z-10 w-full mt-24">
                        <p className="font-body text-xs md:text-sm tracking-[0.3em] uppercase mb-8 font-medium">
                            <EditableText value={theme?.customTexts?.lm_footer_prompt || 'Ready to build something iconic?'} field="lm_footer_prompt" entity="appearance" isEditor={isEditor} as="span" maxLength={50} />
                        </p>
                        <a href={`mailto:${userEmail}`} className="cursor-hover group block relative" data-cursor-text="HI!">
                            <h2 className="font-display text-[12vw] font-bold uppercase leading-none tracking-tighter">
                                <EditableText value={theme?.customTexts?.lm_footer_cta || 'START A\nPROJECT'} field="lm_footer_cta" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                            </h2>
                            <div className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-1 md:h-2 bg-white scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></div>
                        </a>
                    </div>

                    <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-end relative z-10 font-body text-xs uppercase tracking-widest gap-4 border-t border-white/20 pt-6 mt-24 md:mt-0 pb-20 md:pb-0">
                        <div className="flex flex-wrap gap-6 justify-center">
                            {links.map((l: any, i: number) => (
                                <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:underline">
                                    {l.platform}
                                </a>
                            ))}
                        </div>
                        <div className="text-center md:text-right flex flex-col gap-1">
                            <span>© {new Date().getFullYear()} {fullName.toUpperCase()}.</span>
                            <span className="opacity-60">
                                <EditableText value={theme?.customTexts?.lm_footer_location || 'SAMPANG, IDN'} field="lm_footer_location" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> — <span className="font-display">{timeString}</span>
                            </span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Media Modal */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-0 md:p-10"
                    >
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedMedia(null)}></div>
                        <motion.div 
                            initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="relative w-full max-w-6xl bg-[#1A1A18] flex flex-col overflow-hidden border border-white/10 shadow-2xl rounded-lg"
                        >
                            <div className="flex justify-between items-center px-4 py-3 md:px-6 border-b border-white/10">
                                <h3 className="font-display font-bold uppercase tracking-tight text-white">{selectedMedia.title}</h3>
                                <button onClick={() => setSelectedMedia(null)} className="w-8 h-8 flex items-center justify-center bg-white/10 text-white hover:bg-white hover:text-black transition-all rounded-full cursor-hover" data-cursor-text="CLOSE">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="w-full bg-black relative" style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}>
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4 md:p-12">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain shadow-2xl" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const isSmoothScroll = (!isMobileView && !isCardPreview) && (theme?.customTexts?.smooth_scroll === 'true');

    if (isSmoothScroll) {
        return (
            <ReactLenis 
                root 
                options={{ 
                    duration: 1.2, 
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
                    smoothWheel: true
                }}
            >
                {content}
            </ReactLenis>
        );
    }

    return content;
}
