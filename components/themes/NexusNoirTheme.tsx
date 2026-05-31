"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

export default function NexusNoirTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isPreviewRoute = pathname?.includes('/preview/');
    
    // Sync Lenis with ScrollTrigger
    useLenis((scroll) => {
        ScrollTrigger.update();
    });

    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    const fullName = data?.profile?.fullName || data?.fullName || "AURA KINETIC";
    const profession = data?.profile?.profession || data?.profession || "Crafting Digital Excellence By Design.";
    const bio = data?.profile?.bio || data?.bio || "Saya membantu startup dan korporasi global merancang antarmuka digital yang premium, fungsional, dengan perhatian absolut pada setiap detail piksel.";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    
    const allProjects = data?.projects || data?.user?.projects || [];
    const featuredProjects = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d').slice(0, 4); // Up to 4 projects
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');
    
    const experiences = data?.experiences || data?.user?.experiences || [];
    const certificates = data?.certificates || data?.user?.certificates || [];
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    // TEMA & WARNA
    const accentColor = theme?.themeColor || '#4F46E5'; // Indigo default
    const fontHeading = theme?.fontHeading || 'Outfit';
    const fontBody = theme?.fontBody || 'Inter';

    const buttonShape = theme?.buttonShape || 'rounded';
    const radiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-3xl' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const btnRadiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-xl' : 'rounded-none';

    const cardStyle = theme?.cardStyle || 'glassmorphism';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0a0a0a] shadow-[0_20px_50px_rgba(255,255,255,0.03)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[8px_8px_0_0_#fff]' : 'bg-white/5 backdrop-blur-xl border border-white/10';

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    // Clock removed as requested


    useGSAP(() => {
        if (isCardPreview) return;

        // Custom Cursor Animation
        const cursorDot = document.getElementById('nn-cursor-dot');
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let dotX = mouseX, dotY = mouseY;

        const onMouseMove = (e: MouseEvent) => {
            const container = containerRef.current;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const scaleX = rect.width / container.offsetWidth || 1;
            const scaleY = rect.height / container.offsetHeight || 1;
            
            mouseX = (e.clientX - rect.left) / scaleX;
            mouseY = (e.clientY - rect.top) / scaleY;
        };

        window.addEventListener('mousemove', onMouseMove);

        const animateCursor = () => {
            if (!cursorDot) return;
            const dt = 1.0 - Math.pow(1.0 - 0.25, gsap.ticker.deltaRatio()); 
            dotX += (mouseX - dotX) * dt;
            dotY += (mouseY - dotY) * dt;
            
            cursorDot.style.transform = `translate(calc(${dotX}px - 50%), calc(${dotY}px - 50%))`;
            requestAnimationFrame(animateCursor);
        };
        let animFrame = requestAnimationFrame(animateCursor);

        // Visibility Toggle
        const container = containerRef.current;
        const showCursor = () => { if (cursorDot) cursorDot.style.opacity = '1'; };
        const hideCursor = () => { if (cursorDot) cursorDot.style.opacity = '0'; };

        if (container) {
            container.addEventListener('mouseenter', showCursor);
            container.addEventListener('mouseleave', hideCursor);
        }

        // Magnetic Hover Effect
        const magneticElements = document.querySelectorAll('.magnetic, .magnetic-card, button, a');
        
        const handleMouseEnter = () => {
            if (cursorDot) cursorDot.classList.add('cursor-hover');
        };
        const handleMouseLeave = (e: Event) => {
            if (cursorDot) cursorDot.classList.remove('cursor-hover');
            gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
        };
        const handleMagneticMove = (e: Event) => {
            const el = e.currentTarget as HTMLElement;
            if (el.classList.contains('magnetic')) {
                const mouseEvent = e as MouseEvent;
                const rect = el.getBoundingClientRect();
                const containerRect = container?.getBoundingClientRect();
                
                // We need clientX, but magnetic effect is local to the element
                const relX = mouseEvent.clientX - rect.left - rect.width / 2;
                const relY = mouseEvent.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: relX * 0.2, y: relY * 0.2, duration: 0.3, ease: 'power2.out' });
            }
        };

        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
            el.addEventListener('mousemove', handleMagneticMove);
        });

        if (!isEditor) {
            // Scramble Text
            const scrambleLinks = document.querySelectorAll('.scramble-link');
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            
            scrambleLinks.forEach((link: any) => {
                link.addEventListener('mouseenter', (event: any) => {
                    let iterations = 0;
                    const originalText = event.target.dataset.text;
                    clearInterval(link.interval);
                    link.interval = setInterval(() => {
                        event.target.innerText = originalText.split("")
                            .map((letter: string, index: number) => {
                                if(index < iterations) return originalText[index];
                                return letters[Math.floor(Math.random() * 26)];
                            })
                            .join("");
                        if(iterations >= originalText.length) clearInterval(link.interval);
                        iterations += 1 / 2;
                    }, 30);
                });
            });

            // Hero Animations
            gsap.fromTo('.text-reveal', 
                { y: '100%' },
                { y: '0%', duration: 1.5, ease: 'power4.out', stagger: 0.1, delay: 0.2 }
            );
            
            gsap.fromTo('#hero-line', 
                { scaleX: 0 },
                { scaleX: 1, duration: 1.5, ease: 'power4.inOut', delay: 0.7 }
            );

            // Scroll Reveal
            const revealElements = gsap.utils.toArray('.gs-reveal') as HTMLElement[];
            revealElements.forEach((el) => {
                gsap.fromTo(el, 
                    { y: 40, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                        },
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power3.out"
                    }
                );
            });
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animFrame);
            if (container) {
                container.removeEventListener('mouseenter', showCursor);
                container.removeEventListener('mouseleave', hideCursor);
            }
            magneticElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
                el.removeEventListener('mousemove', handleMagneticMove);
            });
            ScrollTrigger.getAll().forEach(t => t.kill());
        };

    }, { scope: containerRef, dependencies: [isMobileView, isCardPreview, isEditor, theme, accentColor] });

    const safeHeading = fontHeading === 'sans-serif' ? 'Inter' : fontHeading;
    const safeBody = fontBody === 'sans-serif' ? 'Inter' : fontBody;
    
    const headingQuery = safeHeading.replace(/ /g, '+');
    const bodyQuery = safeBody.replace(/ /g, '+');
    
    // Handle case where heading and body fonts are the same
    const familyQuery = safeHeading === safeBody 
        ? `family=${headingQuery}:wght@300;400;500;600;700;800`
        : `family=${headingQuery}:wght@300;400;500;600;700;800&family=${bodyQuery}:wght@300;400;500;600;700;800`;

    const fontStyleString = `
        @import url('https://fonts.googleapis.com/css2?${familyQuery}&display=swap');

        .font-nn-heading { font-family: "${safeHeading}", 'Outfit', sans-serif; }
        .font-nn-sans { font-family: "${safeBody}", 'Inter', sans-serif; }
        
        .nn-theme {
            background-color: #050505;
            color: #F5F5F5;
            ${!isMobileView && !isCardPreview ? 'cursor: none;' : ''}
        }
        
        ::selection { background-color: #F5F5F5; color: #050505; }
        
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        
        .nn-noise {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 10; opacity: 0.035;
            background: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
        }

        .nn-bg-grid {
            position: absolute; inset: 0; z-index: 1; pointer-events: none;
            background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 50px 50px;
            mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
            -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
        }

        .nn-cursor {
            position: absolute; top: 0; left: 0; width: 10px; height: 10px;
            background-color: #fff; border-radius: 50%;
            pointer-events: none; z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, background-color 0.3s, mix-blend-mode 0.3s, opacity 0.3s;
            opacity: 0;
        }
        .nn-cursor.cursor-hover {
            width: 70px; height: 70px;
            background-color: rgba(255, 255, 255, 1);
            mix-blend-mode: difference;
        }

        .marquee-wrap { overflow: hidden; display: flex; position: relative; }
        .marquee-inner { display: flex; white-space: nowrap; animation: marquee 20s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .project-card .img-wrap { overflow: hidden; position: relative; }
        .project-card img { transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .project-card:hover img { transform: scale(1.08); }
        .project-details-overlay {
            position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
            opacity: 0; transition: opacity 0.5s ease; display: flex; align-items: center; justify-content: center;
        }
        .project-card:hover .project-details-overlay { opacity: 1; }
        .view-btn { transform: translateY(20px); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .project-card:hover .view-btn { transform: translateY(0); }

        .scramble-link { display: inline-block; min-width: max-content; }

        .glass-panel {
            background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.4s ease, border-color 0.4s ease;
        }
        .glass-panel:hover { background: rgba(255, 255, 255, 0.04); border-color: rgba(255, 255, 255, 0.15); }

        .text-reveal-wrap { overflow: hidden; }
        .text-reveal { transform: ${isEditor ? 'translateY(0)' : 'translateY(100%)'}; }
    `;

    const lenis = useLenis();
    const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo(id, { offset: 0, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        } else {
            document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const content = (
        <div ref={containerRef} className={`w-full min-h-screen nn-theme relative font-nn-sans ${isCardPreview ? 'overflow-hidden' : ''}`}>
            <style dangerouslySetInnerHTML={{ __html: fontStyleString }} />
            
            {/* Background Elements */}
            <div className="nn-noise fixed"></div>
            <div className="nn-bg-grid fixed"></div>

            {/* Custom Cursor */}
            {!isMobileView && !isCardPreview && (
                <div className="nn-cursor" id="nn-cursor-dot"></div>
            )}

            {/* Navigation */}
            <nav className="absolute w-full top-0 z-50 px-6 py-6 mix-blend-difference">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="#" className="magnetic font-nn-heading font-bold text-xl tracking-wide text-white">
                        <EditableText entity="appearance" field="nn_logo" value={getCustomText('nn_logo', 'N')} isEditor={isEditor} />
                        <span className="text-gray-500">.</span>
                    </Link>
                    <div className="hidden md:flex gap-12 text-sm font-medium text-[#888888]">
                        <a href="#work" onClick={(e) => handleScrollTo(e, '#work')} className="magnetic hover:text-white transition-colors scramble-link" data-text={getCustomText('nn_nav_1', 'Works')}>
                            <EditableText entity="appearance" field="nn_nav_1" value={getCustomText('nn_nav_1', 'Works')} isEditor={isEditor} />
                        </a>
                        <a href="#experience" onClick={(e) => handleScrollTo(e, '#experience')} className="magnetic hover:text-white transition-colors scramble-link" data-text={getCustomText('nn_nav_2', 'Experience')}>
                            <EditableText entity="appearance" field="nn_nav_2" value={getCustomText('nn_nav_2', 'Experience')} isEditor={isEditor} />
                        </a>
                        <a href="#about" onClick={(e) => handleScrollTo(e, '#about')} className="magnetic hover:text-white transition-colors scramble-link" data-text={getCustomText('nn_nav_3', 'Expertise')}>
                            <EditableText entity="appearance" field="nn_nav_3" value={getCustomText('nn_nav_3', 'Expertise')} isEditor={isEditor} />
                        </a>
                    </div>
                    <a href="#contact" onClick={(e) => handleScrollTo(e, '#contact')} className="magnetic text-sm font-medium border border-white/20 rounded-full px-6 py-2.5 hover:bg-white hover:text-black transition-all duration-300">
                        Let's Talk
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-10 relative z-20">
                <div className="max-w-7xl mx-auto w-full flex flex-col items-start">
                    
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div className="text-reveal-wrap">
                            <p className="text-reveal text-[#888888] font-mono text-xs md:text-sm uppercase tracking-widest flex gap-4 items-center">
                                <span><EditableText entity="appearance" field="nn_hero_avail" value={getCustomText('nn_hero_avail', 'Available for Work')} isEditor={isEditor} /></span>
                            </p>
                        </div>
                    </div>
                    
                    <h1 className="font-nn-heading font-semibold text-[12vw] md:text-8xl lg:text-[8rem] leading-[0.95] tracking-tight w-full">
                        <div className="text-reveal-wrap"><span className="text-reveal block"><EditableText entity="profile" field="fullName" value={fullName} isEditor={isEditor} /></span></div>
                        <div className="text-reveal-wrap flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                            <span className="text-reveal block text-gray-500 italic font-light"><EditableText entity="appearance" field="nn_hero_mid" value={getCustomText('nn_hero_mid', 'Excellence')} isEditor={isEditor} /></span>
                            <div className="hidden md:block h-[2px] bg-white/20 flex-grow mt-4 origin-left scale-x-0" id="hero-line"></div>
                        </div>
                        <div className="text-reveal-wrap"><span className="text-reveal block" style={{ color: accentColor }}><EditableText entity="appearance" field="nn_hero_bot" value={getCustomText('nn_hero_bot', 'By Design.')} isEditor={isEditor} /></span></div>
                    </h1>
                    
                    <div className="mt-16 text-reveal-wrap ml-auto md:w-1/2">
                        <p className="text-reveal text-[#888888] text-lg leading-relaxed text-right md:text-left">
                            <EditableText entity="profile" field="bio" value={bio} isEditor={isEditor} />
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-10 left-6 text-reveal-wrap">
                    <span className="text-reveal text-xs tracking-widest uppercase text-[#888888] flex items-center gap-3">
                        <div className="w-12 h-[1px] bg-[#888888]"></div> Scroll to explore
                    </span>
                </div>
            </section>

            {/* Marquee Banner */}
            <div className="border-y border-white/10 py-6 bg-black relative z-20 transform -rotate-1 scale-105 my-20 hidden md:block overflow-hidden">
                <div className="marquee-wrap">
                    <div className="marquee-inner">
                        {[1, 2].map((group) => (
                            <div key={group} className="flex items-center gap-10 px-5">
                                <span className="font-nn-heading text-4xl text-transparent font-bold" style={{ WebkitTextStroke: '1px #888' }}>UI/UX DESIGN</span>
                                <span className="w-3 h-3 rounded-full bg-white"></span>
                                <span className="font-nn-heading text-4xl text-white font-bold">FRONTEND DEV</span>
                                <span className="w-3 h-3 rounded-full bg-white"></span>
                                <span className="font-nn-heading text-4xl text-transparent font-bold" style={{ WebkitTextStroke: '1px #888' }}>CREATIVE DIRECTION</span>
                                <span className="w-3 h-3 rounded-full bg-white"></span>
                                <span className="font-nn-heading text-4xl text-white font-bold">INTERACTION DESIGN</span>
                                <span className="w-3 h-3 rounded-full bg-white"></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Works Section */}
            <section id="work" className="py-20 px-6 relative z-20">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20">
                        <div className="gs-reveal">
                            <p className="text-sm tracking-widest uppercase mb-4" style={{ color: accentColor }}>[ Selected Works ]</p>
                            <h2 className="font-nn-heading text-4xl md:text-6xl font-semibold">Digital<br/>Artifacts.</h2>
                        </div>
                        <p className="text-[#888888] text-sm mt-4 md:mt-0 gs-reveal text-left md:text-right max-w-xs">
                            <EditableText entity="appearance" field="nn_work_desc" value={getCustomText('nn_work_desc', 'Koleksi proyek pilihan dengan fokus pada interaktivitas dan estetika presisi.')} isEditor={isEditor} />
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-20 md:gap-x-10">
                        {featuredProjects.map((project: any, i: number) => {
                            // Lay out staggered pattern: 1st is col-span-7, 2nd is col-span-5 + mt-40, etc.
                            const isOdd = i % 2 === 0;
                            const displayMedia = project.projectType === 'video' ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
                            
                            return (
                                <div key={project.id} className={`project-card magnetic-card group gs-reveal cursor-pointer ${isOdd ? 'md:col-span-7' : 'md:col-span-5 md:mt-40'}`} onClick={() => setSelectedMedia({ url: project.mediaUrl, title: project.title, type: project.projectType || 'photo' })}>
                                    <div className={`relative overflow-hidden group w-full mb-6 ${cardRadiusClass} ${cardStyleClass} ${isOdd ? 'aspect-[4/3]' : 'aspect-[4/5]'}`}>
                                        <LazyImage src={displayMedia} alt={project.title} className={`w-full h-full object-cover ${!isOdd ? 'grayscale group-hover:grayscale-0' : ''}`} />
                                        <div className="project-details-overlay">
                                            <span className={`view-btn bg-white text-black font-medium px-6 py-3 ${btnRadiusClass}`}>View Media</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-nn-heading text-2xl md:text-3xl font-medium mb-2">{project.title}</h3>
                                            <p className="text-[#888888] text-sm mb-4 line-clamp-2">{project.description || 'Proyek digital.'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xs font-mono text-[#888888] mb-1">{(project.createdAt || '2024').substring(0, 4)}</span>
                                            <span className={`block text-xs uppercase tracking-wider border border-white/10 px-3 py-1 ${btnRadiusClass} whitespace-nowrap`}>{project.projectType || 'Project'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {allProjects.length > 4 && (
                        <div className="mt-32 text-center gs-reveal relative z-20">
                            {isEditor ? (
                                <button className={`border border-white/20 px-8 py-3 ${btnRadiusClass} font-mono text-white/50 text-xs tracking-widest uppercase cursor-not-allowed`}>
                                    [ View Full Archive ]
                                </button>
                            ) : (
                                <Link href={isPreviewRoute ? `/preview/${subdomain}/gallery` : `/${subdomain}/gallery`}
                                      className={`border border-white/20 px-8 py-3 ${btnRadiusClass} font-mono text-white hover:bg-white hover:text-black transition duration-300 text-xs tracking-widest uppercase hover-trigger`}>
                                    View Full Archive
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* 3D Interactive Assets Section */}
            {items3D.length > 0 && (
                <section id="assets" className="py-20 px-6 relative z-20 border-t border-white/5">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
                            <div className="gs-reveal">
                                <p className="text-sm tracking-widest uppercase mb-4" style={{ color: accentColor }}>[ Interactive Assets ]</p>
                                <h2 className="font-nn-heading text-4xl md:text-5xl font-semibold">Spatial<br/>Models.</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 gs-reveal">
                            {items3D.map((p: any, idx: number) => (
                                <div key={idx} className={`relative overflow-hidden group ${cardStyleClass} ${cardRadiusClass}`}>
                                    <div className="flex justify-between items-center p-6 border-b border-white/5">
                                        <h3 className="font-nn-heading text-xl font-medium text-white">{p.title}</h3>
                                        <span className={`text-xs font-mono text-[#888888] px-3 py-1 border border-white/10 ${btnRadiusClass} uppercase`}>3D / GLB</span>
                                    </div>
                                    <div className={`absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-xl z-0 ${cardRadiusClass}`} style={{ backgroundColor: accentColor }}></div>
                                    <div className="w-full h-[50vh] min-h-[300px] relative bg-black opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                        <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#000000" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Experience Section */}
            <section id="experience" className="py-32 px-6 bg-[#030303] relative z-20">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="text-center mb-24 gs-reveal">
                        <p className="text-sm tracking-widest uppercase mb-4" style={{ color: accentColor }}>[ The Journey ]</p>
                        <h2 className="font-nn-heading text-4xl md:text-5xl font-semibold">Professional<br/>Timeline.</h2>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 md:-translate-x-1/2"></div>

                        {experiences.map((exp: any, i: number) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <div key={exp.id} className={`relative flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} justify-between items-center w-full mb-16 group gs-reveal`}>
                                    <div className={`relative z-10 w-[9px] h-[9px] bg-white/20 rounded-full md:-translate-x-1/2 group-hover:scale-150 group-hover:bg-white transition-all duration-300 left-[11px] md:left-1/2`}></div>
                                    
                                    <div className={`w-full md:w-[45%] pl-10 md:pl-0 ${isLeft ? 'md:text-right pr-0 md:pr-10' : 'md:text-left pr-0 md:pr-0 md:ml-10'} mb-4 md:mb-0`}>
                                        <h3 className="font-nn-heading text-2xl font-medium text-white">{exp.role}</h3>
                                        <p className="font-medium mt-1" style={{ color: accentColor }}>{exp.company}</p>
                                    </div>
                                    
                                    <div className={`w-full md:w-[45%] pl-10 ${isLeft ? 'md:pl-10' : 'md:pl-0 md:text-right pr-0 md:pr-10'}`}>
                                        <span className={`text-xs font-mono text-[#888888] mb-2 block border border-white/10 w-max px-3 py-1 ${btnRadiusClass} ${!isLeft ? 'md:ml-auto' : ''}`}>
                                            {exp.startDate} — {exp.endDate || 'Present'}
                                        </span>
                                        <p className="text-sm text-[#888888] leading-relaxed">{exp.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {experiences.length === 0 && (
                            <div className="text-center text-white/50 text-sm">No experience data available.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* About / Expertise Bento Grid */}
            <section id="about" className="py-32 px-6 relative z-20">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="mb-16 gs-reveal">
                        <p className="text-sm tracking-widest uppercase mb-4" style={{ color: accentColor }}>[ Core Arsenal ]</p>
                        <h2 className="font-nn-heading text-4xl md:text-5xl font-semibold">Bento Grid<br/>Expertise.</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
                        
                        <div className={`p-8 flex flex-col justify-between md:col-span-2 gs-reveal hover:-translate-y-1 transition-transform duration-300 cursor-default ${cardStyleClass} ${cardRadiusClass}`}>
                            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center mb-4">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            </div>
                            <div>
                                <h4 className="font-nn-heading text-xl font-medium mb-2 text-white">
                                    <EditableText entity="appearance" field="nn_bento_t1" value={getCustomText('nn_bento_t1', 'System Architecture')} isEditor={isEditor} />
                                </h4>
                                <p className="text-[#888888] text-xs leading-relaxed">
                                    <EditableText entity="appearance" field="nn_bento_d1" value={getCustomText('nn_bento_d1', 'Membangun design system yang terukur (scalable) dari komponen atomik hingga pola interaksi kompleks.')} isEditor={isEditor} />
                                </p>
                            </div>
                        </div>

                        <div className={`p-8 flex flex-col justify-end gs-reveal hover:-translate-y-1 transition-transform duration-300 md:col-span-1 border-t-4 ${cardStyleClass} ${cardRadiusClass}`} style={{ borderTopColor: accentColor }}>
                            <h4 className="font-nn-heading text-6xl font-bold mb-1 text-white">
                                <EditableText entity="appearance" field="nn_bento_t2" value={getCustomText('nn_bento_t2', '5+')} isEditor={isEditor} />
                            </h4>
                            <p className="text-[#888888] text-xs uppercase tracking-wide">
                                <EditableText entity="appearance" field="nn_bento_d2" value={getCustomText('nn_bento_d2', 'Years Exp.')} isEditor={isEditor} />
                            </p>
                        </div>

                        <div className={`p-8 flex flex-col justify-between gs-reveal hover:-translate-y-1 transition-transform duration-300 md:col-span-1 ${cardStyleClass} ${cardRadiusClass}`}>
                            <h4 className="font-nn-heading text-xl font-medium mb-4 text-white">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {(data?.skills || []).slice(0, 5).map((skill: any, i: number) => (
                                    <span key={i} className={`bg-white/5 px-3 py-1 ${btnRadiusClass} text-[10px] uppercase tracking-wider text-white border border-white/10`}>{skill.name}</span>
                                ))}
                                {(!data?.skills || data.skills.length === 0) && (
                                    <>
                                        <span className={`bg-white/5 px-3 py-1 ${btnRadiusClass} text-[10px] uppercase tracking-wider text-white border border-white/10`}>Figma</span>
                                        <span className={`bg-white/5 px-3 py-1 ${btnRadiusClass} text-[10px] uppercase tracking-wider text-white border border-white/10`}>React</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={`p-8 flex flex-col justify-between md:col-span-4 relative overflow-hidden gs-reveal group hover:-translate-y-1 transition-transform duration-300 ${cardStyleClass} ${cardRadiusClass}`}>
                            <div className="absolute right-0 top-0 w-96 h-96 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700 opacity-20" style={{ background: `linear-gradient(to bottom right, ${accentColor}, transparent)` }}></div>
                            <div className="w-2/3 md:w-1/2 relative z-10 flex flex-col h-full justify-center">
                                <h4 className="font-nn-heading text-2xl md:text-3xl font-medium mb-3 text-white">
                                    <EditableText entity="appearance" field="nn_bento_t4" value={getCustomText('nn_bento_t4', 'Bridging Design & Engineering')} isEditor={isEditor} />
                               </h4>
                                <p className="text-[#888888] text-sm leading-relaxed">
                                    <EditableText entity="appearance" field="nn_bento_d4" value={getCustomText('nn_bento_d4', 'Tidak hanya menggambar kotak-kotak di Figma. Saya menulis kode untuk memastikan animasi, transisi, dan interaksi yang saya desain terealisasi sempurna di browser.')} isEditor={isEditor} />
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {testimonials.length > 0 && (
                <section id="testimonials" className="py-20 px-6 relative z-20">
                    <div className="max-w-7xl mx-auto w-full border-t border-white/5 pt-20">
                        <div className="mb-16 gs-reveal text-center md:text-left flex flex-col md:flex-row justify-between items-center">
                            <div>
                                <p className="text-sm tracking-widest uppercase mb-4" style={{ color: accentColor }}>[ Client Voices ]</p>
                                <h2 className="font-nn-heading text-4xl md:text-5xl font-semibold">
                                    <EditableText entity="appearance" field="nn_testi_title" value={getCustomText('nn_testi_title', 'Testimonials.')} isEditor={isEditor} />
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testimonials.map((t: any, idx: number) => (
                                <div key={idx} className={`p-8 group hover:-translate-y-2 transition-all duration-500 relative ${cardStyleClass} ${cardRadiusClass}`}>
                                    <svg className="w-8 h-8 text-white/20 mb-6 group-hover:text-white/40 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                    <p className="text-[#888888] text-sm leading-relaxed mb-8 flex-grow group-hover:text-[#a0a0a0] transition-colors">{t.content}</p>
                                    <div className="border-t border-white/10 pt-6 mt-auto">
                                        <h4 className="font-nn-heading text-white font-medium mb-1">{t.authorName}</h4>
                                        <p className="text-xs uppercase tracking-widest text-[#888888]">{t.authorRole} {t.company && `— ${t.company}`}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer Contact */}
            <footer id="contact" className="pt-32 pb-10 px-6 mt-20 relative overflow-hidden bg-[#030303] z-20">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[30vh] blur-[100px] z-0 pointer-events-none rounded-full opacity-10" style={{ backgroundColor: accentColor }}></div>
                
                <div className="max-w-7xl mx-auto w-full text-center relative z-10">
                    <div className="inline-block border border-white/10 rounded-full px-6 py-2 mb-8 gs-reveal">
                        <span className="w-2 h-2 inline-block rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        <span className="text-xs uppercase tracking-widest text-white">Open for New Opportunities</span>
                    </div>
                    
                    <h2 className="magnetic inline-block font-nn-heading text-6xl md:text-[8vw] font-bold tracking-tighter mb-16 text-white hover:text-[#888888] transition-colors cursor-pointer leading-none gs-reveal">
                        <a href={`mailto:${userEmail}`}>Let's Collaborate.</a>
                    </h2>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/10 text-sm text-[#888888] gap-6">
                        <div className="flex items-center gap-4">
                            <p>&copy; {new Date().getFullYear()} {fullName}.</p>
                        </div>
                        <div className="flex gap-8">
                            {data?.socials?.map((social: any, i: number) => (
                                <a key={i} href={social.url} target="_blank" rel="noreferrer" className="magnetic hover:text-white transition-colors scramble-link" data-text={social.platform}>{social.platform}</a>
                            ))}
                        </div>
                        <p className="text-xs uppercase tracking-widest">Global</p>
                    </div>
                </div>
            </footer>

            {/* Media Viewer */}
            <AnimatePresence>
                {selectedMedia && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md"
                            onClick={() => setSelectedMedia(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative z-10 w-full max-w-6xl max-h-[90vh] flex flex-col"
                        >
                            <button 
                                onClick={() => setSelectedMedia(null)}
                                className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                            <div className="w-full bg-black relative rounded-xl overflow-hidden border border-white/10 shadow-2xl" style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}>
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[75vh] object-contain" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-white font-nn-heading text-2xl uppercase mt-6 text-center tracking-wide">{selectedMedia.title}</h3>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );

    const isSmoothScroll = (!isMobileView && !isCardPreview) && (theme?.customTexts?.smooth_scroll === 'true');

    if (isSmoothScroll) {
        return (
            <ReactLenis root options={{ smoothWheel: true, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }}>
                {content}
            </ReactLenis>
        );
    }

    return content;
}
