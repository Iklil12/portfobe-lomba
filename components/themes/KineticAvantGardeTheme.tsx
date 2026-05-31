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

export default function KineticAvantGardeTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isPreviewRoute = pathname?.includes('/preview/');
    
    // Sync Lenis with ScrollTrigger
    useLenis((scroll) => {
        if (!isCardPreview) {
            ScrollTrigger.update();
        }
    });

    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    const fullName = data?.profile?.fullName || data?.fullName || "VISUAL REBEL";
    const profession = data?.profile?.profession || data?.profession || "DESAIN SEJATI TIDAK PERNAH MEMINTA IZIN";
    const bio = data?.profile?.bio || data?.bio || "Mendobrak batas desain konvensional. Kami tidak mengikuti aturan.";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `halo@${subdomain}.art`;
    
    const allProjects = data?.projects || data?.user?.projects || [];
    const featuredProjects = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d').slice(0, 3);
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');
    
    const certificates = data?.certificates || data?.user?.certificates || [];
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    // TEMA & WARNA
    const accentColor = theme?.themeColor || '#c92a2a'; // Blood Red default
    const fontHeading = theme?.fontHeading || 'Anton';
    const fontBody = theme?.fontBody || 'Space Grotesk';

    const getFontFamily = (fontName: string) => {
        if (!fontName) return "'Space Grotesk', monospace";
        if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Grotesk', monospace";
        if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant')) return "'Playfair Display', serif";
        if (fontName.toLowerCase().includes('anton')) return "'Anton', sans-serif";
        return `'${fontName}', sans-serif`;
    };

    const headingFont = getFontFamily(theme?.fontHeading) === "'Space Grotesk', monospace" ? "'Anton', sans-serif" : getFontFamily(theme?.fontHeading);
    const bodyFont = getFontFamily(theme?.fontBody);

    const buttonShape = theme?.buttonShape || 'hard';
    const radiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-xl' : 'rounded-none';
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-3xl' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';

    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#111] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? `bg-[#050505] border border-white/20 shadow-[6px_6px_0_0_${accentColor}]` : 'bg-[#0a0a0a] border border-white/10';

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    useGSAP(() => {
        if (isCardPreview) return;

        // Custom Cursor Animation
        const cursorDot = document.getElementById('kag-cursor-dot');
        const cursorOutline = document.getElementById('kag-cursor-outline');
        
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let dotX = mouseX, dotY = mouseY;
        let outlineX = mouseX, outlineY = mouseY;

        const onMouseMove = (e: MouseEvent) => {
            const container = containerRef.current;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            // Calculate scale in case it's in the editor preview
            const scaleX = rect.width / container.offsetWidth || 1;
            const scaleY = rect.height / container.offsetHeight || 1;
            
            mouseX = (e.clientX - rect.left) / scaleX;
            mouseY = (e.clientY - rect.top) / scaleY;
        };

        window.addEventListener('mousemove', onMouseMove);

        const animateCursor = () => {
            if (!cursorDot || !cursorOutline) return;
            dotX += (mouseX - dotX) * 0.2;
            dotY += (mouseY - dotY) * 0.2;
            outlineX += (mouseX - outlineX) * 0.1;
            outlineY += (mouseY - outlineY) * 0.1;

            cursorDot.style.transform = `translate(calc(${dotX}px - 50%), calc(${dotY}px - 50%))`;
            cursorOutline.style.transform = `translate(calc(${outlineX}px - 50%), calc(${outlineY}px - 50%))`;

            requestAnimationFrame(animateCursor);
        };
        let animFrame = requestAnimationFrame(animateCursor);

        // Visibility Toggle
        const container = containerRef.current;
        const showCursor = () => {
            if (cursorOutline) cursorOutline.style.opacity = '1';
            if (cursorDot && !cursorDot.classList.contains('dot-hidden')) cursorDot.style.opacity = '1';
        };
        const hideCursor = () => {
            if (cursorOutline) cursorOutline.style.opacity = '0';
            if (cursorDot) cursorDot.style.opacity = '0';
        };

        if (container) {
            container.addEventListener('mouseenter', showCursor);
            container.addEventListener('mouseleave', hideCursor);
        }

        // Hover Effect
        const hoverTriggers = document.querySelectorAll('.hover-trigger');
        const handleMouseEnter = () => {
            cursorOutline?.classList.add('cursor-hover');
            cursorDot?.classList.add('dot-hidden');
            if (cursorDot) cursorDot.style.opacity = '0';
        };
        const handleMouseLeave = () => {
            cursorOutline?.classList.remove('cursor-hover');
            cursorDot?.classList.remove('dot-hidden');
            if (cursorDot) cursorDot.style.opacity = '1';
        };

        hoverTriggers.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });



        // Hero Parallax
        const parallaxWrap = document.querySelector('.parallax-wrap');
        const floatingImgs = document.querySelectorAll('.floating-img');
        
        const onParallaxMove = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const x = mouseEvent.clientX - window.innerWidth / 2;
            const y = mouseEvent.clientY - window.innerHeight / 2;

            floatingImgs.forEach(img => {
                const el = img as HTMLElement;
                const speed = parseFloat(el.getAttribute('data-speed') || '0');
                const xPos = x * speed;
                const yPos = y * speed;
                el.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
        };
        const onParallaxLeave = () => {
            floatingImgs.forEach(img => {
                const el = img as HTMLElement;
                el.style.transform = `translate(0px, 0px)`;
            });
        };

        if (parallaxWrap) {
            parallaxWrap.addEventListener('mousemove', onParallaxMove);
            parallaxWrap.addEventListener('mouseleave', onParallaxLeave);
        }

        // Cinematic Text Reveal
        gsap.to('.clip-mask', {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'none',
            scrollTrigger: {
                trigger: '#statement-trigger',
                start: 'top top',
                end: 'bottom bottom', 
                scrub: 1,
                pin: false
            }
        });

        // Stacking Cards
        const cards = gsap.utils.toArray('.stack-card') as HTMLElement[];
        cards.forEach((card, i) => {
            if (i !== cards.length - 1) { 
                gsap.to(card, {
                    scale: 0.9,
                    opacity: 0.5,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                        pin: false
                    }
                });
            }
        });

        // Timeline Scroll Indicators
        const timelineItems = gsap.utils.toArray('.timeline-item') as HTMLElement[];
        timelineItems.forEach(item => {
            const indicator = item.querySelector('.indicator');
            if (indicator) {
                gsap.to(indicator, {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                    scale: 1.5,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 60%',
                        end: 'bottom 40%',
                        toggleActions: 'play reverse play reverse'
                    }
                });
            }
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animFrame);
            hoverTriggers.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            if (parallaxWrap) {
                parallaxWrap.removeEventListener('mousemove', onParallaxMove);
                parallaxWrap.removeEventListener('mouseleave', onParallaxLeave);
            }
        };

    }, { scope: containerRef, dependencies: [isMobileView, isCardPreview, isEditor, theme, accentColor] });

    const fontStyleString = `
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        .font-kag-brutal { font-family: ${headingFont}; }
        .font-kag-serif { font-family: ${headingFont.includes('Playfair') ? headingFont : "'Playfair Display', serif"}; }
        .font-kag-mono { font-family: ${bodyFont}; }
        
        .kag-theme {
            background-color: #0a0a0a;
            color: #e6e4dc;
            ${!isMobileView && !isCardPreview ? 'cursor: none;' : ''}
        }
        
        /* Lenis Override to prevent native smooth scroll conflict */
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        
        .kag-cursor-dot, .kag-cursor-outline {
            position: absolute;
            top: 0; left: 0;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            z-index: 10000;
            pointer-events: none;
            mix-blend-mode: difference;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .kag-cursor-dot { width: 10px; height: 10px; background-color: white; }
        .kag-cursor-outline {
            width: 40px; height: 40px; border: 1px solid white;
            transition: width 0.3s ease, height 0.3s ease, background-color 0.3s ease, opacity 0.3s ease;
        }
        .kag-cursor-outline.cursor-hover { width: 80px; height: 80px; background-color: white; border: none; }
        

        
        .kag-text-massive { font-size: clamp(6rem, 20vw, 25rem); line-height: 0.8; letter-spacing: -0.02em; }
        .kag-text-outline { color: transparent; -webkit-text-stroke: 2px #e6e4dc; }
        
        .parallax-wrap { position: relative; width: 100%; height: 100vh; overflow: hidden; }
        .floating-img { position: absolute; transition: transform 0.1s linear; box-shadow: 0 30px 60px rgba(0,0,0,0.5); will-change: transform; }
        
        .stack-card { position: sticky; top: 0; height: 100vh; width: 100%; transform-origin: center top; }
        
        .kag-marquee { white-space: nowrap; overflow: hidden; display: flex; }
        .kag-marquee span { display: inline-block; padding-right: 2rem; animation: kag-marquee 15s linear infinite; }
        @keyframes kag-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        
        .kag-bg-void { background-color: #0a0a0a; }
        .kag-bg-bone { background-color: #e6e4dc; }
        .kag-bg-blood { background-color: ${accentColor}; }
        
        .kag-text-void { color: #0a0a0a; }
        .kag-text-bone { color: #e6e4dc; }
        .kag-text-blood { color: ${accentColor}; }
    `;

    // Handler untuk smooth scrolling navigasi
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
            <div ref={containerRef} className={`w-full min-h-screen kag-theme relative selection:bg-white selection:text-black ${isCardPreview ? 'overflow-hidden' : ''}`}>
                <style dangerouslySetInnerHTML={{ __html: fontStyleString }} />
                
                {/* Custom Cursor */}
                {!isMobileView && !isCardPreview && (
                    <>
                        <div className="kag-cursor-dot" id="kag-cursor-dot"></div>
                        <div className="kag-cursor-outline" id="kag-cursor-outline"></div>
                    </>
                )}



                {/* Navigation */}
                <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference kag-text-bone pointer-events-none">
                    <div className="font-kag-mono text-sm tracking-widest uppercase font-bold hover-trigger pointer-events-auto">Dynamic / 01</div>
                    <div className="font-kag-brutal text-3xl hover-trigger pointer-events-auto">
                        <EditableText entity="appearance" field="kag_logo" value={getCustomText('kag_logo', 'KXT.')} isEditor={isEditor} />
                    </div>
                    <div className="font-kag-mono text-sm tracking-widest uppercase hover-trigger pointer-events-auto">
                        <EditableText entity="appearance" field="kag_nav_menu" value={getCustomText('kag_nav_menu', 'Menu')} isEditor={isEditor} />
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="parallax-wrap kag-bg-void flex flex-col justify-center items-center" id="hero">
                    <h1 className="font-kag-brutal kag-text-massive kag-text-bone z-30 relative text-center w-full select-none flex flex-col items-center leading-none" id="hero-title">
                        <EditableText entity="appearance" field="kag_hero_top" value={getCustomText('kag_hero_top', 'VISUAL')} isEditor={isEditor} />
                        <span className="kag-text-outline">
                            <EditableText entity="appearance" field="kag_hero_bottom" value={getCustomText('kag_hero_bottom', 'REBEL')} isEditor={isEditor} />
                        </span>
                    </h1>

                    <div className="floating-img z-20 w-48 md:w-80 aspect-[3/4] top-[15%] left-[10%] md:left-[20%] rounded-xl overflow-hidden" data-speed="-0.05">
                        <LazyImage src={data?.profile?.avatarUrl || "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=800&q=80"} alt="Hero 1" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition duration-500" />
                    </div>
                    
                    <div className="floating-img z-0 w-40 md:w-64 aspect-square bottom-[10%] right-[10%] md:right-[15%] rounded-xl overflow-hidden" data-speed="0.08">
                        <LazyImage src={featuredProjects[0]?.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"} alt="Hero 2" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="absolute bottom-10 left-10 z-30 mix-blend-difference pointer-events-none">
                        <p className="font-kag-mono text-xs kag-text-bone tracking-widest max-w-[200px] uppercase pointer-events-auto text-left">
                            <EditableText entity="profile" field="bio" value={bio} isEditor={isEditor} />
                        </p>
                    </div>
                </section>

                {/* Statement Section with Mask Reveal */}
                <section className="h-[200vh] relative kag-bg-bone" id="statement-trigger">
                    <div className="sticky top-0 h-screen flex flex-col justify-center px-6 md:px-20 overflow-hidden">
                        <div className="relative w-full max-w-6xl mx-auto">
                            <h2 className="font-kag-serif text-4xl md:text-7xl lg:text-8xl leading-tight kag-text-void opacity-20 select-none">
                                <EditableText entity="appearance" field="kag_statement" value={getCustomText('kag_statement', 'Desain sejati tidak pernah meminta izin. Ia datang, ia menata ulang ruang, dan ia meninggalkan')} isEditor={isEditor} /> 
                                <span className="font-kag-brutal uppercase kag-text-void opacity-20 tracking-wider ml-2">
                                    <EditableText entity="appearance" field="kag_statement_highlight" value={getCustomText('kag_statement_highlight', 'jejak abadi')} isEditor={isEditor} />
                                </span>.
                            </h2>
                            
                            <h2 className="absolute top-0 left-0 font-kag-serif text-4xl md:text-7xl lg:text-8xl leading-tight kag-text-blood select-none clip-mask pointer-events-none" style={{ clipPath: 'inset(0 100% 0 0)' }}>
                                {getCustomText('kag_statement', 'Desain sejati tidak pernah meminta izin. Ia datang, ia menata ulang ruang, dan ia meninggalkan')} 
                                <span className="font-kag-brutal uppercase kag-text-void tracking-wider ml-2">
                                    {getCustomText('kag_statement_highlight', 'jejak abadi')}
                                </span>.
                            </h2>
                        </div>
                        
                        <div className="absolute bottom-10 left-0 w-full kag-bg-void kag-text-bone py-4 transform -rotate-2 scale-110 shadow-2xl">
                            <div className="kag-marquee font-kag-brutal text-2xl tracking-widest">
                                <span>{getCustomText('kag_marquee_text', 'ESTETIKA KEKACAUAN — SENI MURNI — TANPA BATAS — ESTETIKA KEKACAUAN — SENI MURNI — TANPA BATAS —')}</span>
                                <span>{getCustomText('kag_marquee_text', 'ESTETIKA KEKACAUAN — SENI MURNI — TANPA BATAS — ESTETIKA KEKACAUAN — SENI MURNI — TANPA BATAS —')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stacking Gallery Section */}
                <section className="relative kag-bg-void pb-[10vh]" id="gallery">
                    <div className="pt-32 pb-16 px-10">
                        <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-4">
                            <EditableText entity="appearance" field="kag_gallery_subtitle" value={getCustomText('kag_gallery_subtitle', '[ ARSIP PROYEK ]')} isEditor={isEditor} />
                        </h3>
                        <h2 className="font-kag-brutal text-6xl md:text-9xl kag-text-bone uppercase flex flex-wrap gap-4 leading-none">
                            <EditableText entity="appearance" field="kag_gallery_title1" value={getCustomText('kag_gallery_title1', 'KARYA')} isEditor={isEditor} />
                            <span className="kag-text-outline">
                                <EditableText entity="appearance" field="kag_gallery_title2" value={getCustomText('kag_gallery_title2', 'MURNI')} isEditor={isEditor} />
                            </span>
                        </h2>
                    </div>

                    {featuredProjects.map((project: any, i: number) => {
                        const isEven = i % 2 !== 0;
                        const displayMedia = project.projectType === 'video' ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
                        const zIndex = i + 1;

                        if (i === 2) {
                            // Card 3 Style (Full Image Background)
                            return (
                                <div key={project.id} className="stack-card flex items-center justify-center p-4 md:p-10" style={{ zIndex }}>
                                    <div className="w-full h-[80vh] md:h-[90vh] bg-[#111] rounded-2xl overflow-hidden relative flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.8)] hover-trigger cursor-pointer" onClick={() => setSelectedMedia({ url: project.mediaUrl, title: project.title, type: project.projectType || 'photo' })}>
                                        <div className="absolute inset-0 bg-black/50 z-10"></div>
                                        <LazyImage src={displayMedia} alt={project.title} className="absolute inset-0 w-full h-full object-cover object-top transition duration-700 hover:scale-105" />
                                        
                                        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center p-6">
                                            <span className="font-kag-mono text-white/70 text-sm uppercase tracking-widest mb-6">00{i+1} — {project.projectType || 'Media'}</span>
                                            <h4 className="font-kag-serif italic text-6xl md:text-9xl text-white">{project.title}</h4>
                                            <button className="mt-12 border border-white/50 px-8 py-3 rounded-full font-kag-mono text-white hover:bg-white hover:kag-text-blood transition duration-300 uppercase tracking-widest text-xs pointer-events-none">
                                                Eksplorasi Penuh
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={project.id} className="stack-card flex items-center justify-center p-4 md:p-10" style={{ zIndex }}>
                                <div className={`w-full h-[80vh] md:h-[90vh] ${isEven ? 'kag-bg-bone' : 'bg-[#111]'} rounded-2xl overflow-hidden relative flex flex-col md:flex-row shadow-[0_-20px_50px_rgba(0,0,0,0.8)]`}>
                                    <div className={`w-full md:w-1/2 h-1/2 md:h-full overflow-hidden relative group hover-trigger cursor-pointer ${isEven ? 'order-2 md:order-1' : ''}`} onClick={() => setSelectedMedia({ url: project.mediaUrl, title: project.title, type: project.projectType || 'photo' })}>
                                        {isEven ? (
                                            <LazyImage src={displayMedia} alt={project.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full overflow-hidden relative">
                                                <LazyImage src={displayMedia} alt={project.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                                            </div>
                                        )}
                                    </div>
                                    <div className={`w-full md:w-1/2 h-1/2 md:h-full p-10 flex flex-col justify-center ${isEven ? 'order-1 md:order-2' : ''}`}>
                                        <span className="font-kag-mono kag-text-blood text-sm uppercase tracking-widest">00{i+1} — {project.projectType || 'Project'}</span>
                                        <h4 className={`font-kag-brutal text-5xl md:text-7xl ${isEven ? 'kag-text-void' : 'kag-text-bone'} mt-4 leading-none uppercase`}>
                                            {project.title}
                                        </h4>
                                        <p className={`font-kag-mono ${isEven ? 'kag-text-void/70' : 'kag-text-bone/60'} mt-8 max-w-sm text-sm line-clamp-4`}>{project.description || 'Tidak ada deskripsi'}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </section>

                {/* More Projects Button Section */}
                {allProjects.length > 3 && (
                    <section className="kag-bg-void py-20 flex justify-center w-full relative z-20 border-t border-white/5">
                        {isEditor ? (
                            <button className="border border-white/20 px-8 py-3 rounded-full font-kag-mono text-white/50 text-xs tracking-widest uppercase cursor-not-allowed">
                                [ Lebih Banyak Proyek di Live Site ]
                            </button>
                        ) : (
                            <Link href={isEditor ? '#' : (isPreviewRoute ? `/preview/${subdomain}/gallery` : `/${subdomain}/gallery`)}
                                  className="border border-white/20 px-8 py-3 rounded-full font-kag-mono text-white hover:bg-white hover:kag-text-blood transition duration-300 text-xs tracking-widest uppercase hover-trigger">
                                Eksplorasi Arsip Penuh
                            </Link>
                        )}
                    </section>
                )}

                {/* 3D Section */}
                {items3D.length > 0 && (
                    <section className="kag-bg-void pt-20 pb-32 w-full relative border-t border-white/5 z-20 overflow-hidden" id="models">
                        <div className="absolute top-10 left-0 w-full kag-bg-blood kag-text-bone py-2 transform rotate-3 scale-110 shadow-2xl z-0 pointer-events-none opacity-50">
                            <div className="kag-marquee font-kag-brutal text-2xl tracking-widest">
                                <span>INTERACTIVE DIMENSION — SPATIAL REALITY — INTERACTIVE DIMENSION — SPATIAL REALITY —</span>
                                <span>INTERACTIVE DIMENSION — SPATIAL REALITY — INTERACTIVE DIMENSION — SPATIAL REALITY —</span>
                            </div>
                        </div>

                        <div className="px-10 mt-20 relative z-10">
                            <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-4">
                                <EditableText entity="appearance" field="kag_3d_subtitle" value={getCustomText('kag_3d_subtitle', '[ OBJEK SPASIAL ]')} isEditor={isEditor} />
                            </h3>
                            <h2 className="font-kag-brutal text-6xl md:text-8xl kag-text-bone uppercase flex flex-wrap gap-4 leading-none mb-12">
                                <EditableText entity="appearance" field="kag_3d_title1" value={getCustomText('kag_3d_title1', 'DIMENSI')} isEditor={isEditor} />
                                <span className="kag-text-outline">
                                    <EditableText entity="appearance" field="kag_3d_title2" value={getCustomText('kag_3d_title2', 'KINETIK')} isEditor={isEditor} />
                                </span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                {items3D.map((p: any, idx: number) => (
                                    <div key={idx} className={`p-4 md:p-8 hover-trigger group ${cardStyleClass}`} style={{ borderRadius: buttonShape }}>
                                        <div className="font-kag-mono text-white/50 text-xs tracking-widest mb-4 uppercase flex justify-between">
                                            <span>MODEL / 0{idx + 1}</span>
                                            <span className="kag-text-blood">{p.title}</span>
                                        </div>
                                        <div className={`w-full aspect-video bg-black overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700 ${cardStyleClass}`} style={{ borderRadius: buttonShape }}>
                                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#000000" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Expertise Section */}
                <section className="relative kag-bg-bone kag-text-void py-32 px-6 md:px-20 z-10" id="expertise">
                    <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-16">
                        <EditableText entity="appearance" field="kag_expertise_subtitle" value={getCustomText('kag_expertise_subtitle', '[ KEAHLIAN INTI ]')} isEditor={isEditor} />
                    </h3>
                    
                    <div className="flex flex-col border-t border-black/20 w-full">
                        <div className="group border-b border-black/20 py-8 md:py-12 flex justify-between items-center hover-trigger relative overflow-hidden">
                            <h2 className="text-4xl md:text-8xl transition-all duration-500 ease-out group-hover:kag-text-blood group-hover:translate-x-8 z-10" style={{ fontFamily: fontHeading }}>
                                <EditableText entity="appearance" field="kag_skill_1" value={getCustomText('kag_skill_1', 'DIREKSI SENI')} isEditor={isEditor} />
                            </h2>
                            <span className="font-kag-mono text-lg md:text-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:-translate-x-8 z-10">/01</span>
                            <div className="absolute inset-0 bg-black/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                        </div>
                        
                        <div className="group border-b border-black/20 py-8 md:py-12 flex justify-between items-center hover-trigger relative overflow-hidden">
                            <h2 className="text-4xl md:text-8xl transition-all duration-500 ease-out group-hover:kag-text-blood group-hover:translate-x-8 z-10" style={{ fontFamily: fontHeading }}>
                                <EditableText entity="appearance" field="kag_skill_2" value={getCustomText('kag_skill_2', 'DESAIN SPASIAL')} isEditor={isEditor} />
                            </h2>
                            <span className="font-kag-mono text-lg md:text-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:-translate-x-8 z-10">/02</span>
                            <div className="absolute inset-0 bg-black/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                        </div>

                        <div className="group border-b border-black/20 py-8 md:py-12 flex justify-between items-center hover-trigger relative overflow-hidden">
                            <h2 className="text-4xl md:text-8xl transition-all duration-500 ease-out group-hover:kag-text-blood group-hover:translate-x-8 z-10" style={{ fontFamily: fontHeading }}>
                                <EditableText entity="appearance" field="kag_skill_3" value={getCustomText('kag_skill_3', 'SISTEM KREATIF')} isEditor={isEditor} />
                            </h2>
                            <span className="font-kag-mono text-lg md:text-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:-translate-x-8 z-10">/03</span>
                            <div className="absolute inset-0 bg-black/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                        </div>
                    </div>
                </section>

                {/* Chronology Section */}
                <section className="relative kag-bg-void kag-text-bone py-32 px-6 md:px-20 z-10 overflow-hidden" id="chronology">
                    <div className="flex flex-col md:flex-row gap-16 md:gap-20 max-w-7xl mx-auto">
                        <div className="md:w-1/3">
                            <div className="md:sticky md:top-32">
                                <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-4">
                                    <EditableText entity="appearance" field="kag_history_subtitle" value={getCustomText('kag_history_subtitle', '[ RIWAYAT ]')} isEditor={isEditor} />
                                </h3>
                                <h2 className="text-6xl md:text-8xl leading-none" style={{ fontFamily: fontHeading }}>
                                    <EditableText entity="appearance" field="kag_history_title" value={getCustomText('kag_history_title', 'KRONOLOGI KARIR')} isEditor={isEditor} />
                                </h2>
                                <p className="font-kag-mono text-white/60 mt-6 text-sm max-w-xs text-left">
                                    <EditableText entity="appearance" field="kag_history_desc" value={getCustomText('kag_history_desc', 'Evolusi pemikiran dan eksekusi lintas waktu dan dimensi kreatif.')} isEditor={isEditor} />
                                </p>
                            </div>
                        </div>

                        <div className="md:w-2/3 border-l border-white/20 relative mt-10 md:mt-0 pt-10">
                            {data?.experiences?.length > 0 ? (
                                data.experiences.map((exp: any, index: number) => (
                                    <div key={index} className="pl-10 pb-24 relative timeline-item group">
                                        <div className="absolute w-4 h-4 rounded-full border border-white/50 left-[-8.5px] top-2 kag-bg-void indicator transition-colors duration-300"></div>
                                        <span className="font-kag-mono kag-text-blood text-sm tracking-widest">{exp.startYear} — {exp.endYear || 'SEKARANG'}</span>
                                        <h4 className="italic text-3xl md:text-5xl mt-2 kag-text-bone group-hover:kag-text-blood transition-colors duration-300" style={{ fontFamily: fontHeading }}>{exp.role}</h4>
                                        <p className="font-kag-mono text-white/50 text-sm mt-4">{exp.company}</p>
                                        <p className="font-kag-mono text-sm mt-4 leading-relaxed max-w-md text-white/80">{exp.description}</p>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="pl-10 pb-24 relative timeline-item group">
                                        <div className="absolute w-4 h-4 rounded-full border border-white/50 left-[-8.5px] top-2 kag-bg-void indicator transition-colors duration-300"></div>
                                        <span className="font-kag-mono kag-text-blood text-sm tracking-widest">SEKARANG — 2024</span>
                                        <h4 className="italic text-3xl md:text-5xl mt-2 kag-text-bone group-hover:kag-text-blood transition-colors duration-300" style={{ fontFamily: fontHeading }}>Kepala Eksperimen Visual</h4>
                                        <p className="font-kag-mono text-white/50 text-sm mt-4">Studio Monolith / Jakarta</p>
                                        <p className="font-kag-mono text-sm mt-4 leading-relaxed max-w-md text-white/80">Memimpin tim arsitek antarmuka dalam merumuskan ulang batasan antara seni digital dan pengalaman pengguna.</p>
                                    </div>
                                    <div className="pl-10 pb-24 relative timeline-item group">
                                        <div className="absolute w-4 h-4 rounded-full border border-white/50 left-[-8.5px] top-2 kag-bg-void indicator transition-colors duration-300"></div>
                                        <span className="font-kag-mono kag-text-blood text-sm tracking-widest">2023 — 2021</span>
                                        <h4 className="italic text-3xl md:text-5xl mt-2 kag-text-bone group-hover:kag-text-blood transition-colors duration-300" style={{ fontFamily: fontHeading }}>Desainer Produk Senior</h4>
                                        <p className="font-kag-mono text-white/50 text-sm mt-4">Nexus Digital / Singapura</p>
                                        <p className="font-kag-mono text-sm mt-4 leading-relaxed max-w-md text-white/80">Merancang sistem desain skala besar untuk perusahaan fintech, berfokus pada tipografi dan interaksi mikro.</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Recognition Section */}
                <section className="relative kag-bg-blood kag-text-bone py-32 px-6 md:px-20 z-10" id="recognition">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/30 pb-6">
                            <h2 className="text-5xl md:text-7xl uppercase kag-text-bone tracking-wide" style={{ fontFamily: fontHeading }}>
                                <EditableText entity="appearance" field="kag_recog_title" value={getCustomText('kag_recog_title', 'REKOGNISI')} isEditor={isEditor} />
                            </h2>
                            <p className="font-kag-mono text-xs uppercase tracking-widest mt-4 md:mt-0 text-left">
                                <EditableText entity="appearance" field="kag_recog_subtitle" value={getCustomText('kag_recog_subtitle', 'Sistem Bukti Validasi Murni')} isEditor={isEditor} />
                            </p>
                        </div>

                        <div className="w-full font-kag-mono text-xs md:text-sm uppercase tracking-widest border border-white/30">
                            <div className="grid grid-cols-12 border-b border-white/30 bg-black/10 p-4 opacity-70">
                                <div className="col-span-2">TAHUN</div>
                                <div className="col-span-6">PENGHARGAAN / SERTIFIKASI</div>
                                <div className="col-span-4 text-right">KREDENSIAL</div>
                            </div>
                            
                            {certificates.length > 0 ? (
                                certificates.map((cert: any, i: number) => (
                                    <div key={cert.id || i} className="grid grid-cols-12 border-b border-white/30 p-4 hover:kag-bg-bone hover:kag-text-blood hover-trigger transition-colors duration-300 cursor-pointer" onClick={() => cert.url ? window.open(cert.url, '_blank') : setSelectedMedia({ url: cert.fileUrl, title: cert.title, type: 'certificate' })}>
                                        <div className="col-span-2">{cert.year || '2024'}</div>
                                        <div className="col-span-6 truncate pr-4">{cert.title}</div>
                                        <div className="col-span-4 text-right truncate text-white/60 group-hover:kag-text-blood/60">{cert.issuer}</div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="grid grid-cols-12 border-b border-white/30 p-4 hover:kag-bg-bone hover:kag-text-blood hover-trigger transition-colors duration-300">
                                        <div className="col-span-2">2025</div>
                                        <div className="col-span-6">AWWWARDS SITE OF THE MONTH</div>
                                        <div className="col-span-4 text-right">KINETIKA</div>
                                    </div>
                                    <div className="grid grid-cols-12 border-b border-white/30 p-4 hover:kag-bg-bone hover:kag-text-blood hover-trigger transition-colors duration-300">
                                        <div className="col-span-2">2024</div>
                                        <div className="col-span-6">FWA OF THE DAY</div>
                                        <div className="col-span-4 text-right">MONOLIT</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                {testimonials.length > 0 && (
                    <section className="relative kag-bg-void kag-text-bone py-32 px-6 md:px-20 z-10 overflow-hidden border-t border-white/10" id="testimonials">
                        <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-16 text-center">
                            <EditableText entity="appearance" field="kag_testi_subtitle" value={getCustomText('kag_testi_subtitle', '[ SUARA KLIEN ]')} isEditor={isEditor} />
                        </h3>
                        <h2 className="text-6xl md:text-9xl text-center uppercase kag-text-bone tracking-tighter mb-24 hover-trigger" style={{ fontFamily: fontHeading }}>
                            <EditableText entity="appearance" field="kag_testi_title" value={getCustomText('kag_testi_title', 'TESTIMONI')} isEditor={isEditor} />
                        </h2>

                        <div className="flex flex-wrap md:flex-nowrap gap-8 md:gap-4 justify-center">
                            {testimonials.map((t: any, idx: number) => (
                                <div key={idx} className={`w-full md:w-1/3 p-8 hover:bg-white/5 transition-colors duration-300 group ${cardStyleClass}`} style={{ borderRadius: buttonShape }}>
                                    <div className="text-6xl kag-text-blood mb-6 leading-none" style={{ fontFamily: fontHeading }}>"</div>
                                    <p className="font-kag-mono text-sm md:text-base leading-relaxed mb-12 min-h-[150px]">
                                        {t.content}
                                    </p>
                                    <div className="border-t border-white/20 pt-6 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-2xl uppercase tracking-wide group-hover:kag-text-blood transition-colors" style={{ fontFamily: fontHeading }}>{t.authorName}</h4>
                                            <p className="font-kag-mono text-xs text-white/50 uppercase mt-1">{t.authorRole} {t.company && `— ${t.company}`}</p>
                                        </div>
                                        <span className="font-kag-mono kag-text-blood text-2xl">/0{idx + 1}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="kag-bg-bone kag-text-void py-20 px-10 relative overflow-hidden z-10">
                    <div className="max-w-7xl mx-auto flex flex-col items-center">
                        <p className="font-kag-mono uppercase tracking-widest text-sm kag-text-blood font-bold mb-4 text-center">
                            <EditableText entity="appearance" field="kag_footer_subtitle" value={getCustomText('kag_footer_subtitle', 'Jangan Ragu.')} isEditor={isEditor} />
                        </p>
                        <a href={`mailto:${userEmail}`} className="text-[12vw] leading-none hover:kag-text-blood transition-colors duration-300 hover-trigger text-center w-full block" style={{ fontFamily: fontHeading }}>
                            <EditableText entity="appearance" field="kag_footer_title" value={getCustomText('kag_footer_title', 'SAPA KAMI')} isEditor={isEditor} />
                        </a>
                        
                        <div className="w-full flex flex-col md:flex-row justify-between items-center mt-20 font-kag-mono text-xs uppercase tracking-widest border-t border-black/20 pt-8 gap-6 md:gap-0">
                            <p>© {new Date().getFullYear()} {fullName.toUpperCase()}</p>
                            <div className="flex gap-8">
                                {data?.links?.map((link: any, i: number) => (
                                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="hover-trigger hover:kag-text-blood transition-colors">{link.title}</a>
                                ))}
                                {!data?.links?.length && (
                                    <>
                                        <a href="#" className="hover-trigger hover:kag-text-blood transition-colors">Instagram</a>
                                        <a href="#" className="hover-trigger hover:kag-text-blood transition-colors">Behance</a>
                                    </>
                                )}
                            </div>
                            <p>JAKARTA — SELURUH DUNIA</p>
                        </div>
                    </div>
                </footer>

                {/* Media Modal */}
                <AnimatePresence>
                    {selectedMedia && (
                        <motion.div 
                            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                            transition={{ duration: 0.4 }}
                            className="fixed inset-0 z-[99999] bg-black/90 flex flex-col justify-center items-center p-4 md:p-12 cursor-auto"
                            data-lenis-prevent="true"
                        >
                            <button onClick={() => setSelectedMedia(null)} className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white rounded-full flex items-center justify-center text-white hover:text-black transition-colors z-50">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                            <div className="w-full max-w-6xl max-h-[85vh] relative flex flex-col">
                                <div className="w-full bg-[#050505] relative rounded-xl overflow-hidden border border-white/10 shadow-2xl" style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}>
                                    {selectedMedia.type === 'video' ? (
                                        <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                    ) : (
                                        <div className="w-full flex items-center justify-center p-4">
                                            <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[75vh] object-contain" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-white font-kag-brutal text-2xl uppercase mt-6 text-center tracking-wide">{selectedMedia.title}</h3>
                            </div>
                        </motion.div>
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
