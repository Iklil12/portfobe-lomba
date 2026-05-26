"use client";

import React, { useState, useEffect } from 'react';
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

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export default function SplitTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [isCopied, setIsCopied] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

  // --- ANIMASI STABILISASI ---
  // Kita gunakan animate="visible" untuk editor agar langsung tampil tanpa pemicu scroll (yang sering rusak di preview)
  // Tapi tetap gunakan whileInView untuk live site agar ada efek scroll reveal.
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const [currentTime, setCurrentTime] = useState("");
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);

    // Update Jam Real-Time
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

    // Data Parsing
    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const profession = data?.profile?.profession || data?.profession || "Product Designer & Engineer";
    const bio = data?.profile?.bio || data?.bio || "Bridging the gap between flawless aesthetics and deep technical execution.";
    const location = data?.profile?.location || data?.location || "Indonesia";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 6);
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

    // Warna Tema
    const rawHighlightColor = theme?.themeColor || '#4f46e5'; // Default indigo
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#4f46e5';
    const fontHeading = theme?.fontHeading || 'Cabinet Grotesk';
    const fontBody = theme?.fontBody || 'Inter';
    const radiusClass = theme?.buttonShape === 'square' || theme?.buttonShape === 'hard' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';
    const cardRadiusClass = theme?.buttonShape === 'square' || theme?.buttonShape === 'hard' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-3xl' : 'rounded-2xl';
    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0a0a0a] shadow-[0_20px_50px_rgba(255,255,255,0.05)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border-2 border-[var(--hl)] shadow-[6px_6px_0_0_var(--hl)]' : 'bg-white/[0.02] border border-white/10 hover:border-white/20';

    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        return `'${f}', sans-serif`;
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];

    // Setup Animasi Framer Motion
    const nexusEase = [0.22, 1, 0.36, 1] as any;
    
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: nexusEase } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <main className="w-full bg-[#050505] text-[#f4f4f5] selection:bg-[var(--hl)] selection:text-white font-sans overflow-x-hidden @container nexus-theme" style={{ '--hl': highlightColor } as React.CSSProperties}>
            
            <style dangerouslySetInnerHTML={{
                __html: `
        .nexus-theme .font-display { font-family: ${customHeadingFont}; }
        .nexus-theme .font-sans { font-family: ${customBodyFont}; }
        
        /* Hilangkan Scrollbar untuk tampilan bersih — scoped ke nexus-theme */
        .nexus-theme ::-webkit-scrollbar { width: 6px; }
        .nexus-theme ::-webkit-scrollbar-track { background: #050505; }
        .nexus-theme ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
        .nexus-theme ::-webkit-scrollbar-thumb:hover { background: var(--hl); }

        .nexus-border { border-color: rgba(255, 255, 255, 0.08); }
        .nexus-panel { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(12px); }
        
        /* Link Hover Underline Animation */
        .hover-underline { position: relative; }
        .hover-underline::after {
            content: ''; position: absolute; width: 100%; transform: scaleX(0);
            height: 1px; bottom: 0; left: 0; background-color: var(--hl);
            transform-origin: bottom right; transition: transform 0.3s ease-out;
        }
        .hover-underline:hover::after { transform: scaleX(1); transform-origin: bottom left; }
      `}} />

            <div className={`flex w-full min-h-screen flex-col @md:flex-row`}>
                
                {/* =========================================
                    LEFT COLUMN: STICKY IDENTITY PANEL 
                ========================================= */}
                <div className={`w-full relative px-6 pt-12 pb-8 border-b nexus-border @md:w-[40%] @lg:w-[35%] @md:h-[100svh] @md:sticky @md:top-0 @md:flex @md:flex-col @md:justify-between @md:p-10 @lg:p-14 @md:border-r @md:nexus-border @md:bg-[#050505] @md:z-30`}>
                    
                    {/* Top: Avatar & Status */}
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className={`w-16 h-16 @md:w-20 @md:h-20 ${cardRadiusClass} overflow-hidden border border-white/10 shadow-2xl`}>
                                <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border nexus-border bg-white/5">
                                <span className="w-2 h-2 rounded-full animate-pulse bg-[var(--hl)]"></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Available</span>
                            </div>
                        </div>

                        {/* Identity */}
                        <div className="flex flex-col">
                            <h1 className="font-display font-extrabold text-4xl @lg:text-5xl tracking-tight leading-none text-white mb-3">
                                {fullName}
                            </h1>
                            <h2 className="font-sans text-base @lg:text-lg font-medium text-[var(--hl)] mb-6">
                                {profession}
                            </h2>
                            <p className="font-sans text-sm @lg:text-base text-slate-400 leading-relaxed font-normal">
                                {bio}
                            </p>
                        </div>
                    </div>

                    {/* Bottom: Links & Actions (Hidden on mobile to move to footer, or kept inline) */}
                    <div className={`flex-col gap-8 mt-10 flex @md:hidden @md:flex`}>
                        {/* Interactive Socials */}
                        <div className="flex flex-col gap-4">
                            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">Connect</span>
                            <div className="flex flex-col gap-2">
                                {links.map((l: any, i: number) => (
                                    <a key={i} href={l.url} target="_blank" rel="noreferrer" className="font-sans text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2 group w-max">
                                        <i className="fas fa-arrow-right text-[10px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[var(--hl)] transition-all duration-300"></i>
                                        <span className="hover-underline">{l.platform}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col @xl:flex-row gap-3 w-full border-t nexus-border pt-8">
                            <a href={`mailto:${userEmail}`} className={`flex-1 bg-white text-black hover:bg-[var(--hl)] hover:text-white transition-colors duration-300 ${radiusClass} py-3 px-4 flex items-center justify-center gap-2 font-sans font-bold text-sm`}>
                                Let's Talk <i className="fas fa-paper-plane"></i>
                            </a>
                            <button onClick={handleCopyEmail} className={`flex-1 bg-white/5 border nexus-border hover:bg-white/10 transition-colors duration-300 ${radiusClass} py-3 px-4 flex items-center justify-center gap-2 font-sans font-medium text-sm text-white`}>
                                {isCopied ? 'Copied!' : 'Copy Email'} <i className={isCopied ? 'fas fa-check text-[var(--hl)]' : 'far fa-copy'}></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* =========================================
                    RIGHT COLUMN: SCROLLING CONTENT 
                ========================================= */}
                <div className={`flex flex-col w-full @md:w-[60%] @lg:w-[65%] @md:min-h-screen`}>
                    
                    {/* Floating Gradient for ambience */}
                    <div className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} top-0 right-0 w-[40cqi] h-[40cqi] rounded-full blur-[150px] opacity-10 pointer-events-none mix-blend-screen z-0`} style={{ backgroundColor: highlightColor }}></div>

                    <div className="relative z-10 w-full flex flex-col">
                        
                        {/* SECTION: STATS STRIPE */}
                        <motion.section 
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
                            className={`grid grid-cols-2 @lg:grid-cols-4 border-b nexus-border `}
                        >
                            {[
                                { label: "Projects", val: archiveItems.length },
                                { label: "Awards", val: awardItems.length },
                                { label: "Experience", val: "Pro" },
                                { label: "Time", val: currentTime || "00:00" }
                            ].map((stat, idx) => (
                                <motion.div key={idx} variants={fadeUp} className="flex flex-col items-center justify-center py-8 @lg:py-12 border-r nexus-border last:border-r-0 hover:bg-white/5 transition-colors">
                                    <span className="font-display font-bold text-3xl @lg:text-4xl text-white mb-1">{stat.val}</span>
                                    <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</span>
                                </motion.div>
                            ))}
                        </motion.section>

                        {/* SECTION: SELECTED WORKS (Interactive List) */}
                        <section id="work" className="flex flex-col pt-16 @lg:pt-24 pb-10 border-b nexus-border">
                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={fadeUp} className={`flex justify-between items-end mb-10 px-6 @md:px-12`}>
                                <h2 className="font-display font-extrabold text-4xl @lg:text-6xl text-white">Selected Works</h2>
                                <span className="font-sans text-xs font-medium text-[var(--hl)] hidden @sm:block">Explore the archive</span>
                            </motion.div>

                            <div className="flex flex-col w-full">
                                {archiveItems.map((p: any, i: number) => {
                                    const isVideo = p.projectType === 'video';
                                    const isHovered = hoveredProject === i;

                                    return (
                                        <motion.div 
                                            key={i}
                                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                            onMouseEnter={() => setHoveredProject(i)}
                                            onMouseLeave={() => setHoveredProject(null)}
                                            onClick={() => {
                                                if (isVideo || p.projectType === 'photo') {
                                                    setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                                } else if (p.mediaUrl) {
                                                    window.open(p.mediaUrl, '_blank');
                                                }
                                            }}
                                            className={`relative w-full border-t nexus-border group cursor-pointer px-6 py-6 @md:px-12 @md:py-10`}
                                        >
                                            <div className="flex flex-col w-full relative z-10">
                                                <div className="flex justify-between items-start w-full">
                                                    <div className="flex flex-col gap-2">
                                                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-[var(--hl)] transition-colors">
                                                            0{i + 1} &nbsp;&mdash;&nbsp; {p.projectType}
                                                        </span>
                                                        <h3 className={`font-display font-bold text-white transition-colors duration-300 text-3xl @md:text-5xl @lg:text-6xl ${isHovered ? '@md:translate-x-4' : ''}`}>
                                                            {p.title}
                                                        </h3>
                                                    </div>
                                                    
                                                    {/* Arrow Button */}
                                                    <div className={`shrink-0 rounded-full border nexus-border flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 w-10 h-10 @md:w-14 @md:h-14`}>
                                                        <i className="fas fa-arrow-right -rotate-45"></i>
                                                    </div>
                                                </div>

                                                {/* Mobile Image Reveal (Inline) */}
                                                <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mt-6 border nexus-border @md:hidden relative">
                                                    <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover" />
                                                    {isVideo && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                            <div className="w-12 h-12 rounded-full bg-[var(--hl)] flex items-center justify-center text-white">
                                                                <i className="fas fa-play text-xs ml-0.5"></i>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Desktop Image Reveal (Floating) */}
                                            <AnimatePresence>
                                                <div className="hidden @md:block">
                                                    {isHovered && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                                            transition={{ duration: 0.3 }}
                                                            className={`absolute right-[15%] top-1/2 -translate-y-1/2 w-[320px] aspect-[4/3] ${cardRadiusClass} overflow-hidden shadow-2xl z-0 pointer-events-none border border-white/20`}
                                                        >
                                                            <div className="relative w-full h-full">
                                                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover" />
                                                                {isVideo && (
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                                        <div className="w-14 h-14 rounded-full border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white">
                                                                            <i className="fas fa-play text-lg ml-1"></i>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={fadeUp} className={`w-full flex mt-12 px-6 @md:px-12`}>
                                <Link href={`/${subdomain}/gallery`} scroll={false} className="inline-flex items-center gap-3 font-sans font-bold text-sm uppercase tracking-widest text-white hover:text-[var(--hl)] transition-colors group">
                                    View Full Archive <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                                </Link>
                            </motion.div>
                        </section>

                        {/* SECTION: 3D SHOWCASE */}
                        {items3D.length > 0 && (
                            <section className="flex flex-col pt-16 @lg:pt-24 pb-10 border-b nexus-border">
                                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={fadeUp} className={`flex justify-between items-end mb-10 px-6 @md:px-12`}>
                                    <h2 className="font-display font-extrabold text-4xl @lg:text-6xl text-white">3D Models</h2>
                                    <span className="font-sans text-xs font-medium text-[var(--hl)] hidden @sm:block">({items3D.length}) Items</span>
                                </motion.div>

                                <div className="flex flex-col gap-10 px-6 @md:px-12">
                                    {items3D.map((p: any, i: number) => {
                                        return (
                                            <motion.div 
                                                key={i}
                                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                                className={`relative w-full group overflow-hidden ${cardRadiusClass} ${cardStyleClass}`}
                                            >
                                                <div className="flex flex-col w-full relative z-10 p-8 @md:p-12 bg-gradient-to-b from-white/10 to-transparent">
                                                    <div className="flex flex-col gap-3">
                                                        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 group-hover:text-[var(--hl)] transition-colors">
                                                            Spatial_Data_0{i + 1}
                                                        </span>
                                                        <h3 className={`font-display font-bold text-white transition-colors duration-300 text-4xl @md:text-7xl leading-none`}>
                                                            {p.title}
                                                        </h3>
                                                        {p.description && <p className="font-sans text-slate-400 text-sm @md:text-lg max-w-2xl mt-6 leading-relaxed">{p.description}</p>}
                                                    </div>
                                                </div>

                                                <div className="w-full aspect-video bg-[#0a0a0a] border-t nexus-border relative">
                                                    <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0a0a0a" />
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* INTEGRATIONS SECTION */}
                        {data?.id && (
                            <div className="w-full">
                                <PenpotShowcase userId={data.id} variant="split" />
                                <CanvaShowcase userId={data.id} variant="split" />
                            </div>
                        )}

                        {/* GITHUB STATS SECTION */}
                        {data?.id && (
                            <GithubStats userId={data.id} variant="split" themeColor={highlightColor} />
                        )}

                        {/* SECTION: TESTIMONIALS */}
                        {testimonials.length > 0 && (
                            <section className="flex flex-col pt-16 @lg:pt-24 pb-16 border-b nexus-border">
                                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={fadeUp} className={`mb-10 px-6 @md:px-12`}>
                                    <h2 className="font-display font-extrabold text-4xl @lg:text-6xl text-white">Client Feedback</h2>
                                </motion.div>
                                <div className="flex flex-col w-full px-6 @md:px-12 gap-6">
                                    {testimonials.map((t: any, i: number) => (
                                        <motion.div
                                            key={t.id}
                                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                            className={`p-8 flex flex-col gap-6 transition-colors ${cardRadiusClass} ${cardStyleClass}`}
                                        >
                                            <p className="font-sans text-sm @md:text-lg text-slate-300 leading-relaxed font-medium">
                                                "{t.content}"
                                            </p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
                                                    {t.avatarUrl ? (
                                                        <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale opacity-80" />
                                                    ) : (
                                                        <div className="w-full h-full bg-white/10 flex items-center justify-center font-bold text-white">
                                                            {t.clientName.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="font-display font-bold text-white uppercase tracking-wider">{t.clientName}</h4>
                                                    {t.company && <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--hl)]">{t.company}</span>}
                                                </div>
                                                <div className="ml-auto flex gap-1">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <i key={idx} className={`text-xs ${idx < t.rating ? 'fas fa-star text-[var(--hl)]' : 'far fa-star text-white/20'}`}></i>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SECTION: RECOGNITION */}
                        {awardItems.length > 0 && (
                            <section id="awards" className="flex flex-col pt-16 @lg:pt-24 pb-16 border-b nexus-border">
                                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={fadeUp} className={`mb-10 px-6 @md:px-12`}>
                                    <h2 className="font-display font-extrabold text-4xl @lg:text-6xl text-white">Recognition</h2>
                                </motion.div>

                                <div className="flex flex-col w-full">
                                    {awardItems.map((award: any, i: number) => (
                                        <motion.a 
                                            href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i}
                                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                            className={`w-full border-t nexus-border flex flex-col @md:flex-row @md:items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors px-6 py-6 gap-4 @md:px-12 @md:py-8`}
                                        >
                                            <div className={`flex flex-col gap-1 @md:items-center @md:gap-10 @md:w-1/2`}>
                                                <span className="font-sans font-medium text-slate-500 group-hover:text-white transition-colors w-12">
                                                    {award.year || new Date(award.createdAt).getFullYear()}
                                                </span>
                                                <h3 className="font-display font-bold text-xl @lg:text-2xl text-white group-hover:text-[var(--hl)] transition-colors">
                                                    {award.title}
                                                </h3>
                                            </div>
                                            
                                            <div className={`flex justify-between items-center w-full mt-2 @md:w-1/2 @md:justify-end @md:gap-12`}>
                                                <div className="flex flex-col">
                                                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">Issuer</span>
                                                    <span className="font-sans text-sm font-medium text-slate-300">{award.issuer}</span>
                                                </div>
                                                <i className="fas fa-external-link-alt text-slate-600 group-hover:text-white transition-colors"></i>
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SECTION: FOOTER / CTA */}
                        <footer className={`flex flex-col pt-24 pb-12 px-6 @md:px-12`}>
                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={fadeUp} className="flex flex-col items-start mb-20">
                                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--hl)] mb-4">What's Next?</span>
                                <h2 className="font-display font-extrabold text-5xl @md:text-7xl @lg:text-[6cqi] text-white leading-[0.9] mb-8">
                                    Let's build<br/>the future.
                                </h2>
                                <a href={`mailto:${userEmail}`} className={`px-8 py-4 bg-white text-black hover:bg-[var(--hl)] hover:text-white ${radiusClass} font-sans font-bold text-sm uppercase tracking-widest transition-colors duration-300`}>
                                    Get in Touch
                                </a>
                            </motion.div>

                            <div className="w-full flex flex-col @md:flex-row justify-between items-center gap-6 pt-8 border-t nexus-border font-sans font-medium text-xs text-slate-500 uppercase tracking-widest">
                                <span>© {new Date().getFullYear()} {fullName}</span>
                                
                                {/* Socials for mobile at footer */}
                                { (
                                    <div className="flex items-center gap-6 my-2 @md:hidden">
                                        {links.map((l: any, i: number) => (
                                            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{l.platform}</a>
                                        ))}
                                    </div>
                                )}

                                <Link href={`/${subdomain}`} className="hover:text-[var(--hl)] transition-colors">
                                    PORTFO.BE/{subdomain.toUpperCase()}
                                </Link>
                            </div>
                        </footer>

                    </div>
                </div>
            </div>
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-12"
                    >
                        <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md" onClick={() => setSelectedMedia(null)}></div>
                        
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                            className={`relative w-full max-w-6xl bg-[#0a0a0a] border nexus-border shadow-2xl flex flex-col overflow-hidden ${radiusClass}`}
                        >
                            {/* Blueprint Header */}
                            <div className="flex justify-between items-center px-5 py-3 @md:px-8 border-b nexus-border bg-white/5">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">Technical_Overlay // 0.1</span>
                                    <h3 className="font-display font-bold text-xl @md:text-2xl text-white uppercase tracking-tight">{selectedMedia.title}</h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)} 
                                    className="w-10 h-10 flex items-center justify-center border nexus-border text-white hover:bg-white hover:text-black transition-all duration-300 shrink-0"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Main Content Area */}
                            <div 
                                className="w-full bg-black relative overflow-hidden"
                                style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}
                            >
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4 @md:p-12">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain shadow-2xl border nexus-border" />
                                    </div>
                                )}
                            </div>

                            {/* Industrial Footer */}
                            <div className="px-4 py-3 @md:px-6 flex justify-between items-center bg-white/5 border-t nexus-border font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <div className="flex items-center gap-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[var(--hl)] shadow-[0_0_10px_var(--hl)]"></div>
                                        <span>System_Active</span>
                                    </div>
                                    <span className="hidden @md:inline opacity-40">Blueprint_Ref: #{Math.floor(Math.random() * 90000) + 10000}</span>
                                </div>
                                <button onClick={() => setSelectedMedia(null)} className="text-white hover:text-[var(--hl)] transition-colors">/ Close_Stream</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}