"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { GithubStats } from '@/components/themes/widgets/GithubStats';
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { EditableText } from '@/components/ui/EditableText';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export default function MonolithTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [isCopied, setIsCopied] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

  // --- ANIMASI STABILISASI ---
  // Kita gunakan animate="visible" untuk editor agar langsung tampil tanpa pemicu scroll (yang sering rusak di preview)
  // Tapi tetap gunakan whileInView untuk live site agar ada efek scroll reveal.
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const [currentTime, setCurrentTime] = useState("");
    
    // Ref untuk Slider Project
    const sliderRef = useRef<HTMLDivElement>(null);

    // Waktu Real-Time
    useEffect(() => {
        if (isCardPreview || isEditor) return; // Skip interval di card preview
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [isCardPreview]);

    // Ekstraksi Data
    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const profession = data?.profile?.profession || data?.profession || "Creative Director & Designer";
    const bio = data?.profile?.bio || data?.bio || "We craft digital experiences that transcend the ordinary. Merging aesthetic elegance with relentless engineering.";
    const location = data?.profile?.location || data?.location || "Indonesia";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 5);
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

    // Warna Aksen
    const rawHighlightColor = theme?.themeColor || '#ff3366';
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#ff3366';

    // Font Sync
    const fontHeading = theme?.fontHeading || 'Playfair Display';
    const fontBody = theme?.fontBody || 'Inter';
    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        return "'Inter', sans-serif";
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    // Button Shape Sync
    const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[40px]' : 'rounded-2xl';
    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#111111] shadow-[0_30px_60px_rgba(255,255,255,0.03)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[6px_6px_0_0_rgba(255,255,255,0.2)]' : 'bg-[#080808] border border-white/10 hover:border-white/30';

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const nameParts = fullName.split(' ');
    const firstName = data?.profile?.firstName || data?.firstName || nameParts[0];
    const lastName = data?.profile?.lastName || data?.lastName || nameParts.slice(1).join(' ');

    // --- FUNGSI SLIDER KIRI & KANAN ---
    const scrollLeft = () => {
        if (sliderRef.current) {
            const clientWidth = sliderRef.current.clientWidth;
            const scrollAmount = clientWidth < 768 ? clientWidth * 0.85 : clientWidth * 0.65;
            sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            const clientWidth = sliderRef.current.clientWidth;
            const scrollAmount = clientWidth < 768 ? clientWidth * 0.85 : clientWidth * 0.65;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // --- SETUP ANIMASI ---
    const cinematicEase = [0.22, 1, 0.36, 1] as any;
    
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <main className="w-full bg-[#050505] text-[#f4f4f5] selection:bg-[var(--hl)] selection:text-white overflow-x-hidden @container monolith-theme" style={{ '--hl': highlightColor } as React.CSSProperties}>

            <style dangerouslySetInnerHTML={{
                __html: `
        .monolith-theme .font-serif { font-family: ${customHeadingFont}; }
        .monolith-theme .font-sans { font-family: ${customBodyFont}; }
        .monolith-theme .custom-heading { font-family: ${customHeadingFont} !important; }
        .monolith-theme .custom-body { font-family: ${customBodyFont} !important; }

        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 25s linear infinite; }

        .text-outline {
            color: transparent;
            -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.6);
        }
        .text-outline-black {
            color: transparent;
            -webkit-text-stroke: 1px rgba(0, 0, 0, 0.3);
        }
        
        /* CSS untuk menghilangkan scrollbar bawaan pada slider */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; }
        .snap-item { scroll-snap-align: center; }
      `}} />

            {/* FLOATING NAVBAR */}
            <nav className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} top-0 left-0 w-full z-50 mix-blend-difference flex justify-between items-center pointer-events-none px-6 py-6 @md:px-12`}>
                <div className="font-sans font-bold tracking-widest uppercase text-sm pointer-events-auto">
                    {firstName}<span className="text-[var(--hl)]">.</span>
                </div>
                <div className={`hidden @md:flex items-center gap-8 font-sans text-sm font-medium pointer-events-auto`}>
                    <a href="#about" className="hover:text-[var(--hl)] transition-colors">Vision</a>
                    <a href="#work" className="hover:text-[var(--hl)] transition-colors">Archive</a>
                    <a href="#awards" className="hover:text-[var(--hl)] transition-colors">Honors</a>
                </div>
            </nav>

            {/* FLOATING ACTION BUTTON */}
            <a href={`mailto:${userEmail}`} className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} z-50 bg-[var(--hl)] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer group bottom-4 right-4 w-12 h-12 @md:bottom-12 @md:right-12 @md:w-24 @md:h-24`}>
                <span className={`font-sans font-bold text-black uppercase tracking-widest text-center leading-tight text-[7px] @md:text-[10px]`}>Let's<br/>Talk</span>
                <span className="absolute inset-0 rounded-full bg-[var(--hl)] animate-ping opacity-20 pointer-events-none"></span>
            </a>

            {/* SECTION 1: STICKY HERO */}
            <section className="sticky top-0 h-[100svh] w-full flex flex-col justify-between z-0 bg-[#050505] overflow-hidden">
                <LazyImage src={displayAvatar} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale transition-transform duration-[10s] scale-105 hover:scale-100" alt="Hero" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/70"></div>

                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
                    className={`relative z-10 flex flex-col justify-between h-full p-6 @md:p-12`}
                >
                    <motion.div variants={fadeUp} className={`flex justify-between items-start mt-12`}>
                        <div className="flex flex-col gap-1">
                            <span className="font-sans text-[9px] @md:text-xs font-bold uppercase tracking-[0.2em] text-[var(--hl)]"><EditableText value={location} field="location" entity="profile" isEditor={isEditor} as="span" maxLength={25} /></span>
                            <span className="font-sans text-[10px] @md:text-sm font-medium text-slate-300">{currentTime}</span>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className={`mb-16 @md:mb-20`}>
                        <h1 className={`font-serif leading-[0.85] tracking-tight text-5xl @md:text-7xl @lg:text-[9cqi]`}>
                            <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} /> <br />
                            <span className="italic text-outline"><EditableText value={lastName} field="lastName" entity="profile" isEditor={isEditor} as="span" maxLength={15} /></span>
                        </h1>
                    </motion.div>
                </motion.div>
            </section>

            {/* SECTION 2: EDITORIAL BIO (Warna Putih) */}
            <section id="about" className={`relative z-10 w-full bg-white text-black mt-[-20px] rounded-t-[30px] @md:rounded-t-[50px] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pt-16 pb-20 px-6 @md:pt-32 @md:pb-40 @md:px-12`}>
                <div className={`flex justify-between items-start mx-auto max-w-[1800px] flex-col gap-8 @md:flex-row @md:gap-20`}>
                    <div className={`w-full @md:w-2/3`}>
                        <motion.h2 
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                            className={`font-serif leading-tight text-3xl @md:text-5xl @lg:text-[3.5cqi]`}
                        >
                            <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />
                        </motion.h2>
                    </div>
                    
                    <div className={`w-full flex flex-col gap-6 @md:gap-8 @md:w-1/3`}>
                        <motion.p initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className={`font-sans font-medium text-slate-600 leading-relaxed border-l-2 border-black text-sm pl-4 @md:text-xl @md:pl-6`}>
                            I am a <strong className="text-black"><EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} /></strong> specializing in pushing the boundaries of digital and visual aesthetics.
                        </motion.p>
                        
                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className={`flex flex-col gap-3 mt-4 @md:mt-8`}>
                            <span className="font-sans text-[10px] @md:text-xs font-bold uppercase tracking-widest text-slate-400">Connect</span>
                            <div className="flex flex-wrap gap-3">
                                {links.map((l: any, i: number) => (
                                    <a key={i} href={l.url} target="_blank" rel="noreferrer" className={`rounded-full border border-black hover:bg-black hover:text-white transition-colors font-sans font-bold uppercase tracking-wider px-4 py-2 text-[10px] @md:px-6 @md:py-3 @md:text-sm`}>
                                        {l.platform}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className={`w-full overflow-hidden border-t border-black/10 mt-20 pt-8 @md:mt-32 @md:pt-12`}>
                    <div className={`w-[200%] flex animate-marquee font-serif italic text-outline-black whitespace-nowrap text-5xl @md:text-8xl`}>
                        <div className={`flex items-center gap-12 px-6`}>
                            {[...Array(5)].map((_, i) => (<React.Fragment key={i}><span>Aesthetics</span><span>&bull;</span><span>Engineering</span><span>&bull;</span></React.Fragment>))}
                        </div>
                        <div className={`flex items-center gap-12 px-6`}>
                            {[...Array(5)].map((_, i) => (<React.Fragment key={i + 10}><span>Aesthetics</span><span>&bull;</span><span>Engineering</span><span>&bull;</span></React.Fragment>))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: PROJECT SLIDER (INTERACTIVE CAROUSEL) */}
            <section id="work" className="relative z-20 w-full bg-[#050505] py-20 @md:py-32">
                {/* Header Portofolio & Tombol Kontrol */}
                <div className={`flex justify-between items-end mb-12 @md:mb-20 px-6 @md:px-12`}>
                    <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className={`font-serif leading-none text-white text-4xl @md:text-5xl @lg:text-[5cqi]`}>
                        <EditableText value={theme?.customTexts?.projects_title || 'Selected Archives'} field="projects_title" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
                    </motion.h2>
                    
                    {/* Navigation Buttons */}
                    <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className={`flex gap-3 @md:gap-4`}>
                        <button onClick={scrollLeft} className={`rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 w-10 h-10 @md:w-14 @md:h-14`}>
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <button onClick={scrollRight} className={`rounded-full border border-white/20 flex items-center justify-center hover:bg-[var(--hl)] hover:text-black hover:border-[var(--hl)] transition-all duration-300 w-10 h-10 @md:w-14 @md:h-14`}>
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </motion.div>
                </div>

                {/* SLIDER CONTAINER */}
                <div 
                    ref={sliderRef} 
                    className={`flex overflow-x-auto hide-scrollbar gap-4 @md:gap-8 pb-10 px-6 @md:px-12`}
                >
                    {archiveItems.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        return (
                            <motion.div
                                key={i}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "50px" }} variants={fadeUp}
                                onClick={() => {
                                    if (isVideo || p.projectType === 'photo') {
                                        setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                    } else if (p.mediaUrl) {
                                        window.open(p.mediaUrl, '_blank');
                                    }
                                }}
                                className={`snap-item shrink-0 relative overflow-hidden group cursor-pointer transition-colors duration-500 ${cardRadiusClass} ${cardStyleClassDark}
                                w-[85cqi] max-w-[320px] aspect-[4/5] @md:max-w-none @md:aspect-auto @md:w-[65cqi] @md:h-[75vh]`}
                            >
                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100 opacity-60 group-hover:opacity-90" />
                                <div className={`absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent @md:h-full @md:inset-0 @md:from-black @md:via-black/30`}></div>

                                {isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div className="w-24 h-24 rounded-full bg-[var(--hl)] text-black flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-500 shadow-[0_0_50px_rgba(var(--hl),0.5)]">
                                            <i className="fas fa-play text-2xl ml-1"></i>
                                        </div>
                                    </div>
                                )}

                                <div className={`absolute bottom-0 w-full flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-10 p-5 gap-2 @md:p-12 @md:gap-3 @md:flex-row @md:items-end @md:justify-between`}>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`font-sans font-bold uppercase tracking-widest text-white border border-white/30 backdrop-blur-md rounded-full text-[9px] px-3 py-1 @md:text-xs @md:px-4 @md:py-1`}>0{i + 1}</span>
                                            <span className={`font-sans font-bold uppercase tracking-widest text-[var(--hl)] text-[9px] @md:text-xs uppercase`}>{p.projectType}</span>
                                        </div>
                                        <h3 className={`font-serif text-white leading-[1.1] line-clamp-2 text-3xl @md:text-6xl @lg:text-[5cqi]`}>{p.title}</h3>
                                    </div>

                                    <div className={`flex justify-between items-end flex-row w-full @md:flex-col @md:w-1/3 gap-4 @md:gap-6`}>
                                        <p className={`font-sans font-medium text-slate-300 line-clamp-2 text-[10px] text-left max-w-[70%] @md:max-w-none @md:text-right @md:text-sm`}>
                                            {p.description || 'Immersive case study and visual exploration of this masterpiece.'}
                                        </p>
                                        <div className={`rounded-full bg-white text-black flex items-center justify-center group-hover:bg-[var(--hl)] transition-colors duration-300 shrink-0 w-8 h-8 @md:w-16 @md:h-16`}>
                                            <i className={`fas fa-arrow-right -rotate-45 text-[10px] @md:text-2xl`}></i>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    {/* Spacer Kosong agar kartu terakhir bisa di-scroll sampai ke tengah dengan rapi */}
                    <div className={`shrink-0 w-12`}></div>
                </div>

                <div className={`w-full flex justify-center mt-12 px-6 @md:px-12`}>
                    <Link href={`/${subdomain}/gallery`} scroll={false} className="group flex items-center gap-4">
                        <span className={`font-serif text-white group-hover:text-[var(--hl)] transition-colors italic text-2xl @md:text-3xl @lg:text-5xl`}><EditableText value={theme?.customTexts?.explore_archive || 'View Full Catalog'} field="explore_archive" entity="appearance" isEditor={isEditor} maxLength={30} as="span" /></span>
                        <div className={`rounded-full border border-white/20 flex items-center justify-center group-hover:border-[var(--hl)] transition-colors w-10 h-10 @md:w-12 @md:h-12`}>
                            <i className="fas fa-arrow-right text-white group-hover:text-[var(--hl)]"></i>
                        </div>
                    </Link>
                </div>
            </section>

            {/* SECTION 3.5: 3D SHOWCASE */}
            {items3D.length > 0 && (
                <section className="relative z-20 w-full bg-[#050505] py-20 @md:py-32 border-t border-white/5">
                    <div className="flex justify-between items-end mb-12 @md:mb-20 px-6 @md:px-12">
                        <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-serif leading-none text-white text-4xl @md:text-5xl @lg:text-[5cqi]">
                            <EditableText value={theme?.customTexts?.models_title || 'Interactive Models'} field="models_title" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
                        </motion.h2>
                    </div>
                    <div className="flex flex-col gap-12 @md:gap-20 px-6 @md:px-12 pb-20">
                        {items3D.map((p: any, i: number) => (
                            <motion.div
                                key={i}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "50px" }} variants={fadeUp}
                                className={`snap-item relative overflow-hidden group transition-colors duration-500 w-full aspect-[4/5] @md:aspect-video ${cardRadiusClass} ${cardStyleClassDark}`}
                            >
                                <div className="absolute inset-0 bg-[#050505]"></div>
                                <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#050505" />
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                                <div className="absolute bottom-0 w-full flex flex-col justify-end p-8 gap-4 @md:p-16 @md:gap-6 pointer-events-none">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-sans font-bold uppercase tracking-[0.4em] text-[var(--hl)] text-[10px] @md:text-xs">Spatial Asset 0{i+1}</span>
                                        </div>
                                        <h3 className="font-serif text-white leading-[1.1] line-clamp-2 text-4xl @md:text-7xl @lg:text-[6cqi]">{p.title}</h3>
                                        {p.description && <p className="font-sans text-white/50 text-sm @md:text-lg max-w-2xl mt-4">{p.description}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* INTEGRATIONS SECTION */}
            {data?.id && (
                <div className="w-full bg-[#050505]">
                    <PenpotShowcase userId={data.id} variant="monolith" />
                    <CanvaShowcase userId={data.id} variant="monolith" />
                </div>
            )}

            {/* GITHUB STATS SECTION */}
            {data?.id && (
                <div className="w-full bg-[#050505]">
                    <GithubStats userId={data.id} variant="monolith" themeColor={highlightColor} />
                </div>
            )}

            {/* TESTIMONIALS SECTION */}
            {testimonials.length > 0 && (
                <section className="relative z-20 w-full bg-[#050505] py-20 @md:py-32 border-t border-white/5">
                    <div className="flex justify-between items-end mb-12 @md:mb-20 px-6 @md:px-12">
                        <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-serif leading-none text-white text-4xl @md:text-5xl @lg:text-[5cqi]">
                            <EditableText value={theme?.customTexts?.testimonials_title || 'Client Voices'} field="testimonials_title" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
                        </motion.h2>
                    </div>
                    <div className="grid grid-cols-1 @md:grid-cols-2 gap-6 @md:gap-12 px-6 @md:px-12 pb-10">
                        {testimonials.map((t: any, i: number) => (
                            <motion.div
                                key={t.id}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className={`group flex flex-col p-8 @md:p-12 transition-colors duration-500 ${cardRadiusClass} ${cardStyleClassDark}`}
                            >
                                <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-6 group-hover:border-[var(--hl)]/50 transition-colors">
                                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-white/20">
                                        {t.avatarUrl ? (
                                            <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                                        ) : (
                                            <div className="w-full h-full bg-white/10 flex items-center justify-center font-sans font-bold text-white text-xl">
                                                {t.clientName.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="font-serif text-white text-2xl group-hover:text-[var(--hl)] transition-colors">{t.clientName}</h4>
                                        {t.company && <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">{t.company}</p>}
                                    </div>
                                </div>
                                <p className="font-sans text-sm @md:text-lg text-slate-300 leading-relaxed mb-8">
                                    "{t.content}"
                                </p>
                                <div className="flex gap-1 text-[10px] @md:text-xs mt-auto">
                                    {[...Array(5)].map((_, idx) => (
                                        <i key={idx} className={`${idx < t.rating ? 'fas fa-star text-[var(--hl)]' : 'far fa-star text-white/20'}`}></i>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* SECTION 4: AWARDS (KEMBALI KE PUTIH) */}
            {awardItems.length > 0 && (
                <section id="awards" className={`relative z-[100] w-full bg-[#f4f4f5] text-black mt-[-20px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] rounded-t-[30px] @md:rounded-t-[40px] py-16 px-6 @md:py-24 @md:py-32 @md:px-12`}>
                    <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-10 @md:mb-16">
                        <h2 className={`font-serif font-bold text-4xl @md:text-7xl`}><EditableText value={theme?.customTexts?.awards_title || 'Honors & Recognitions'} field="awards_title" entity="appearance" isEditor={isEditor} maxLength={40} as="span" /></h2>
                    </motion.div>

                    <div className="w-full flex flex-col border-t border-black">
                        {awardItems.map((award: any, i: number) => (
                            <motion.a 
                                href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className={`w-full border-b border-black flex justify-between group hover:bg-black hover:text-white transition-all duration-500 rounded-xl @md:rounded-2xl flex-col gap-4 py-6 px-4 -mx-4 @md:flex-row @md:items-center @md:gap-6 @md:py-8 @md:py-12 @md:px-8 @md:-mx-8`}
                            >
                                <div className={`flex w-full flex-col gap-1 @md:flex-row @md:items-center @md:gap-6 @md:gap-12 @md:w-1/2`}>
                                    <span className={`font-serif text-slate-400 group-hover:text-slate-300 text-xl @md:text-3xl w-16`}>{award.year || new Date(award.createdAt).getFullYear()}</span>
                                    <h3 className={`font-sans font-bold tracking-tight leading-tight text-2xl @md:text-4xl`}>{award.title}</h3>
                                </div>
                                <div className={`w-full flex flex-col @md:w-1/4`}>
                                    <span className={`font-sans font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-400 mb-1 text-[9px] @md:text-xs`}>Issuer</span>
                                    <span className={`font-serif italic text-base @md:text-lg @lg:text-xl`}>{award.issuer}</span>
                                </div>
                                <div className={`w-full flex justify-between items-center @md:w-1/4`}>
                                    <span className={`font-sans font-bold uppercase tracking-widest rounded-full border border-black group-hover:border-white text-[9px] px-3 py-1 @md:text-xs @md:px-4 @md:py-1`}>{award.status || 'Verified'}</span>
                                    <i className="fas fa-external-link-alt transform group-hover:scale-125 transition-transform"></i>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </section>
            )}

            {/* SECTION 5: FOOTER (KEMBALI KE HITAM) */}
            <footer className={`relative z-[110] w-full bg-[#050505] flex flex-col pt-24 pb-8 px-6 @md:pt-32 @md:pb-12 @md:px-12`}>
                <div className={`flex flex-col items-center text-center mb-32`}>
                    <span className={`font-sans font-bold uppercase tracking-[0.3em] text-[var(--hl)] text-xs mb-8`}><EditableText value={theme?.customTexts?.cta_subtitle || 'Got a project in mind?'} field="cta_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} as="span" /></span>
                    
                    <div onClick={handleCopyEmail} className="cursor-pointer group relative">
                        <h2 className={`font-serif leading-[0.8] text-white transition-colors duration-500 text-5xl @md:text-7xl @lg:text-[10cqi]`}>
                            <EditableText value={theme?.customTexts?.cta_title || "Let's Create"} field="cta_title" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
                        </h2>
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--hl)] text-black rounded-full font-sans font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-2xl pointer-events-none px-4 py-2 text-[9px] @md:px-6 @md:py-3 @md:text-sm`}>
                            {isCopied ? 'Email Copied!' : 'Copy Email'}
                        </div>
                    </div>
                </div>

                <div className={`w-full flex justify-between items-center border-t border-white/10 font-sans font-medium uppercase tracking-widest text-slate-500 flex-col gap-4 pt-6 text-[9px] @md:flex-row @md:gap-6 @md:pt-8 @md:text-xs`}>
                    <div className="flex items-center gap-6">
                        {links.map((l: any, i: number) => (
                            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                                {l.platform}
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <span>© {new Date().getFullYear()} {fullName}.</span>
                        <Link href={`/${subdomain}`} className="hover:text-[var(--hl)] transition-colors">PORTFO.BE</Link>
                    </div>
                </div>
            </footer>

            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-0 @md:p-12"
                    >
                        <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl" onClick={() => setSelectedMedia(null)}></div>
                        
                        <motion.div 
                            initial={{ y: 100, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.6, ease: cinematicEase }}
                            className={`relative w-full max-w-7xl flex flex-col overflow-hidden ${cardRadiusClass} ${cardStyleClassDark} shadow-[0_50px_100px_rgba(0,0,0,0.8)]`}
                        >
                            {/* Cinematic Header */}
                            <div className="flex justify-between items-center px-6 py-3 @md:px-10 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">Monolith_Vault</span>
                                    <h3 className="font-serif text-xl @md:text-2xl text-white italic">{selectedMedia.title}</h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)} 
                                    className="w-10 h-10 @md:w-12 @md:h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 shrink-0"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Center Content */}
                            <div 
                                className="w-full bg-black relative"
                                style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4 @md:p-12">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-2xl border border-white/10" />
                                    </div>
                                )}
                            </div>

                            {/* Modernist Footer */}
                            <div className="px-6 py-3 @md:px-8 flex justify-between items-center bg-black/50 border-t border-white/5 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <div className="flex items-center gap-8">
                                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[var(--hl)]"></span> Cinematic_Feed</span>
                                    <span className="hidden @md:inline">Aspect: Widescreen</span>
                                </div>
                                <button onClick={() => setSelectedMedia(null)} className="text-white hover:text-[var(--hl)] transition-colors tracking-[0.5em]">/ TERMINATE_VIEW</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}