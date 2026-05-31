"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { GithubStats } from './widgets/GithubStats';
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { EditableText } from '@/components/ui/EditableText';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export default function AcidTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [openAward, setOpenAward] = useState<string | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

  // --- ANIMASI STABILISASI ---
  // Kita gunakan animate="visible" untuk editor agar langsung tampil tanpa pemicu scroll (yang sering rusak di preview)
  // Tapi tetap gunakan whileInView untuk live site agar ada efek scroll reveal.
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";


    // --- IDENTITAS ---
    const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
    const profession = data?.profile?.profession || data?.profession || "Creative Director";
    const bio = data?.profile?.bio || data?.bio || "Forging high-octane visual experiences. Editing raw footage into pure adrenaline.";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;

    // --- RELASI ---
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const displayAvatar = (rawAvatar.replace(/"/g, '').trim() !== "" && rawAvatar !== "null") ? rawAvatar.replace(/"/g, '').trim() : `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop`;

    // --- PENGATURAN DESAIN ---
    const rawThemeColor = theme?.themeColor || "#DFFF00";
    const themeColor = isValidHexColor(rawThemeColor) ? rawThemeColor : "#ff9e00";
    const fontHeading = theme?.fontHeading || "Syne";
    const fontBody = theme?.fontBody || "Space Grotesk";
    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const buttonShape = theme?.buttonShape || 'hard';
    const radiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';

    const nameParts = fullName.split(' ');
    const firstName = data?.profile?.firstName || data?.firstName || nameParts[0];
    const lastName = data?.profile?.lastName || data?.lastName || nameParts.slice(1).join(' ');

    const getHeadingFont = (fontName: string) => {
        if (!fontName) return "'Syne', sans-serif";
        if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant') || fontName.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        if (fontName.toLowerCase().includes('inter')) return "'Inter', sans-serif";
        return "'Syne', sans-serif";
    };
    const getBodyFont = (fontName: string) => {
        if (!fontName) return "'Space Grotesk', sans-serif";
        if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant') || fontName.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        if (fontName.toLowerCase().includes('inter')) return "'Inter', sans-serif";
        return "'Space Grotesk', sans-serif";
    };

    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-2xl' : buttonShape === 'rounded' ? 'rounded-lg' : 'rounded-none';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#18181b] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-transparent' : cardStyle === 'flat' ? 'bg-[#09090b] border-2 border-zinc-800' : 'bg-[#09090b] border-2 border-zinc-800 hover:shadow-[8px_8px_0_0_var(--theme-color)]';
    const testimonialStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#18181b] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-transparent' : cardStyle === 'flat' ? 'bg-[#09090b] border-4 border-[#09090b]' : 'bg-[#09090b] border-4 border-[#09090b] hover:shadow-[10px_10px_0px_var(--theme-color)]';

    // --- KONFIGURASI ANIMASI ACID ---
    const acidEase = [0.22, 1, 0.36, 1] as any; // Agresif di awal, super smooth di akhir

    const fadeUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };

    const scaleUp = {
        hidden: { opacity: 0, scale: 0.85 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: acidEase } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <div className={`w-full min-h-screen bg-[#09090b] text-[#fafafa] selection:text-black relative text-sm acid-theme`}>

            <style dangerouslySetInnerHTML={{
                __html: `
        .acid-heading { font-family: ${getHeadingFont(fontHeading)} !important; }
        .acid-body { font-family: ${getBodyFont(fontBody)} !important; }
        
        .acid-theme ::selection { background: ${themeColor}; color: #000000; }
        
        .acid-text { color: ${themeColor} !important; }
        .acid-bg { background-color: ${themeColor} !important; }
        .acid-border { border-color: ${themeColor} !important; }
        
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 10s linear infinite; }
        
        .project-item { transition: all 0.3s ease; }
        .project-item:hover { background-color: ${themeColor} !important; color: #09090b !important; transform: translateX(10px); border-color: ${themeColor} !important; }
        
        .hover-img { position: absolute; right: 10%; top: 50%; transform: translateY(-50%) scale(0.8) rotate(5deg); opacity: 0; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; z-index: 20; width: 300px; aspect-ratio: 16/9; object-fit: cover; border: 4px solid #000; box-shadow: 10px 10px 0px rgba(0,0,0,0.5); }
        .project-item:hover .hover-img { opacity: 1; transform: translateY(-50%) scale(1) rotate(-2deg); }

        .btn-acid { background-color: transparent; color: ${themeColor}; border: 2px solid ${themeColor}; transition: all 0.3s ease; position: relative; overflow: hidden; z-index: 1; }
        .btn-acid::before { content: ''; position: absolute; top: 0; left: 0; width: 0%; height: 100%; background-color: ${themeColor}; transition: all 0.3s ease; z-index: -1; }
        .btn-acid:hover { color: #000 !important; }
        .btn-acid:hover::before { width: 100%; }

        .acid-theme ::-webkit-scrollbar { width: 6px; }
        .acid-theme ::-webkit-scrollbar-track { background: #09090b; }
        .acid-theme ::-webkit-scrollbar-thumb { background: #27272a; }
      `}} />

            {/* NAVBAR */}
            <div className="sticky top-0 left-0 right-0 z-[99] h-0 @container">
                <motion.nav 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: acidEase }}
                    className={`${!isCardPreview ? 'mix-blend-difference' : ''} flex justify-between items-center p-6 @md:px-12`}
                >
                    <div className={`acid-heading font-extrabold tracking-tighter text-white uppercase text-2xl @md:text-3xl`}>
                        {firstName}<span className="acid-text">.</span>{lastName || 'PORTFO'}
                    </div>
                    <div className={`flex font-bold uppercase tracking-widest text-white acid-body gap-3 text-[9px] @md:gap-8 @md:text-sm`}>
                        <a href="#work" className="hover:text-[var(--theme-color)] transition" style={{ '--theme-color': themeColor } as any}>Index</a>
                        <a href="#awards" className="hover:text-[var(--theme-color)] transition" style={{ '--theme-color': themeColor } as any}>Awards</a>
                    </div>
                </motion.nav>
            </div>

            {/* HERO SECTION */}
            <header className={`relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20`}>

                <motion.div 
                    initial="hidden" 
                    {...{ [animationTrigger]: "visible" }} 
                    viewport={{ once: true, amount: 0 }} 
                    variants={staggerContainer}
                    className={`px-6 @md:px-12 relative z-10 flex flex-col items-start mt-10`}
                >
                    <motion.div variants={fadeUp} className="acid-bg text-[#09090b] px-4 py-1.5 font-bold text-[10px] @md:text-xs uppercase tracking-[0.2em] mb-8 inline-block transform -skew-x-12 acid-body">
                        <EditableText value={theme?.customTexts?.hero_badge || 'Available for New Projects'} field="hero_badge" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
                    </motion.div>

                    <motion.h1 variants={fadeUp} className={`acid-heading font-extrabold uppercase tracking-tighter text-[#fafafa] mb-4 w-full leading-[0.85] break-words
                  text-5xl @md:text-[clamp(5rem,12cqi,11rem)]
              `}>
                        <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" className="acid-heading" maxLength={10} /> <br />
                        <span className="text-transparent" style={{ WebkitTextStroke: '2px #fafafa' }}><EditableText value={lastName || profession} field="lastName" entity="profile" isEditor={isEditor} as="span" className="acid-heading" maxLength={10} /></span>
                    </motion.h1>

                    {/* Mobile Avatar */}
                    <motion.div variants={scaleUp} className={`flex @lg:hidden mt-8 mb-10 w-full justify-center relative z-30 group`}>
                        <div className="w-[85%] max-w-[280px] aspect-[4/5] relative">
                            <div className="absolute inset-0 acid-bg transform translate-x-3 translate-y-3 -z-10"></div>
                            <div className={`w-full h-full overflow-hidden ${cardStyleClassDark} ${cardRadiusClass} relative grayscale transition-all duration-700 hover:grayscale-0`}>
                                <LazyImage src={displayAvatar} alt="Hero" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className={`flex w-full max-w-5xl border-t-2 border-zinc-800 pt-8 flex-col gap-6 mt-2 @md:flex-row @md:gap-8 @lg:gap-16 @md:mt-8`}>
                        <p className={`text-zinc-400 font-medium leading-relaxed acid-body text-sm @md:text-lg @lg:text-xl max-w-md`}>
                            <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" className="acid-body" maxLength={250} />
                        </p>
                        <div className="flex flex-col gap-4 text-xs @md:text-sm font-bold uppercase tracking-widest text-zinc-300 acid-body">
                            {links.map((l: any, i: number) => (
                                <motion.a 
                                    whileHover={{ x: 5 }}
                                    key={i} href={l.url} target="_blank" rel="noreferrer" 
                                    className="transition w-max hover:text-white flex items-center gap-2" 
                                    style={{ transition: 'color 0.3s' }} 
                                    onMouseEnter={(e) => e.currentTarget.style.color = themeColor} 
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#d4d4d8'}
                                >
                                    <i className="fas fa-arrow-right -rotate-45"></i> {l.platform}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                
                    <motion.div 
                        initial={{ opacity: 0, x: 50, rotate: 5 }} 
                        whileInView={{ opacity: 1, x: 0, rotate: 0 }} 
                        viewport={{ once: true, amount: 0 }}
                        transition={{ duration: 1, ease: acidEase }}
                        className="hidden @lg:block absolute top-1/4 right-12 w-72 h-[450px] transition duration-700 z-30 group"
                    >
                        <div className="absolute inset-0 acid-bg transform translate-x-4 translate-y-4 -z-10 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
                        <div className={`w-full h-full overflow-hidden ${cardStyleClassDark} ${cardRadiusClass} relative grayscale hover:grayscale-0 transition-all duration-700`}>
                            <LazyImage src={displayAvatar} alt="Hero" className="w-full h-full object-cover" />
                        </div>
                        {/* Verified Badge */}
                        {(data?.plan !== 'FREE' || data?.userPlan !== 'FREE') && (data?.plan || data?.userPlan) && (
                            <motion.div 
                                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, type: "spring" }}
                                className={`absolute -bottom-4 -right-4 w-12 h-12 bg-blue-500 ${radiusClass} border-4 border-black flex items-center justify-center text-white text-[14px] shadow-[5px_5px_0px_rgba(0,0,0,1)] z-40`}
                            >
                                <i className="fas fa-check"></i>
                            </motion.div>
                        )}
                    </motion.div>
            </header>

            {/* MARQUEE */}
            <motion.div 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0 }} transition={{ duration: 1 }}
                className="w-full overflow-hidden py-10 -my-10"
            >
                <div className={`acid-bg text-[#09090b] py-3 overflow-hidden border-y-4 border-[#09090b] -rotate-2 scale-105 relative z-20 shadow-[0_0_50px_rgba(223,255,0,0.2)] my-10`}>
                    <div className="w-[200%] flex animate-marquee acid-heading font-bold text-2xl @md:text-4xl uppercase tracking-tighter">
                        <div className="flex items-center gap-8 px-4">
                            {[...Array(6)].map((_, i) => (<React.Fragment key={i}><span>{profession}</span><span>///</span></React.Fragment>))}
                        </div>
                        <div className="flex items-center gap-8 px-4">
                            {[...Array(6)].map((_, i) => (<React.Fragment key={i + 10}><span>{profession}</span><span>///</span></React.Fragment>))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* STATS SECTION */}
            <section className="px-6 @md:px-12 py-16 @md:py-20">
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
                    className={`grid gap-4 @md:gap-8 grid-cols-2 @md:grid-cols-4`}
                >
                    {[
                        { label: "Projects", value: archiveItems.length },
                        { label: "Awards", value: awardItems.length },
                        { label: "Links", value: links.length }
                    ].map((stat, idx) => (
                        <motion.div key={idx} variants={fadeUp} className={`flex flex-col justify-between aspect-square hover:-translate-y-2 transition-all p-5 @md:p-8 ${cardStyleClassDark} ${cardRadiusClass}`}>
                            <span className="acid-text font-bold text-[9px] @md:text-xs uppercase tracking-widest acid-body">{stat.label}</span>
                            <span className={`acid-heading font-extrabold text-4xl @md:text-5xl @lg:text-7xl`}>{stat.value}</span>
                        </motion.div>
                    ))}
                    
                    <motion.div variants={fadeUp} className={`flex flex-col justify-between aspect-square hover:-translate-y-2 transition-all cursor-pointer p-5 @md:p-8 ${cardStyleClassDark} ${cardRadiusClass}`} onClick={() => window.location.href = `mailto:${userEmail}`}>
                        <span className="acid-text font-bold text-[9px] @md:text-xs uppercase tracking-widest acid-body">Hire Me</span>
                        <motion.span whileHover={{ scale: 1.1, rotate: 5 }} className={`acid-heading font-extrabold flex items-center text-4xl @md:text-5xl @lg:text-7xl`}>
                            <i className="fas fa-envelope"></i>
                        </motion.span>
                    </motion.div>
                </motion.div>
            </section>

            {/* PROJECTS SECTION */}
            <section id="work" className="pt-10 pb-20 @md:pb-32">
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                    className="px-6 @md:px-12 mb-10 flex justify-between items-end border-b-2 border-zinc-800 pb-6"
                >
                    <h2 className={`acid-heading font-extrabold uppercase tracking-tighter text-4xl @md:text-[clamp(3rem,6cqi,5rem)]`}><EditableText value={theme?.customTexts?.projects_title || 'PROJECT INDEX'} field="projects_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" /></h2>
                    <span className="acid-text font-bold text-xs @md:text-sm uppercase tracking-widest acid-body">Hover to Reveal</span>
                </motion.div>

                <div className="flex flex-col relative w-full">
                    {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        return (
                            <motion.div 
                                key={`proj-${p.id || i}`}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, margin: "50px" }} variants={fadeUp}
                                className={`project-item relative w-full flex justify-between cursor-pointer flex-col py-6 px-6 @md:flex-row @md:items-center @md:py-10 @md:px-10 mb-4 ${cardStyleClassDark} ${cardRadiusClass}`}
                                onClick={() => {
                                    if (isVideo || p.projectType === 'photo') {
                                        setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                    } else if (p.mediaUrl) {
                                        window.open(p.mediaUrl, '_blank');
                                    }
                                }}
                            >
                                <div className="flex flex-col relative z-10 pointer-events-none">
                                    <span className="font-bold text-[10px] @md:text-xs uppercase tracking-[0.2em] mb-2 opacity-70 acid-body">0{i + 1} / {p.projectType}</span>
                                    <h3 className={`acid-heading font-extrabold uppercase tracking-tighter line-clamp-1 text-3xl @md:text-[clamp(2rem,4cqi,4rem)]`}>{p.title}</h3>
                                </div>
                                <div className={`font-bold uppercase tracking-widest opacity-70 acid-body relative z-10 pointer-events-none mt-3 text-[10px] @md:mt-0 @md:text-sm`}>
                                    {p.description || 'View details'} • {new Date(p.createdAt).getFullYear()}
                                </div>

                                {/* Video Indicator (Neon Clear Play) */}
                                {isVideo && (
                                    <div className="absolute right-[20%] top-1/2 -translate-y-1/2 hidden @md:flex items-center gap-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-12 h-12 flex items-center justify-center border-2 border-current" style={{ color: themeColor }}>
                                            <i className="fas fa-play"></i>
                                        </div>
                                        <span className="font-bold text-xs tracking-widest uppercase acid-body">Play_Preview</span>
                                    </div>
                                )}

                                {/* Mobile Inline Image */}
                                <div className={`block @md:hidden mt-6 w-full aspect-[16/9] relative z-10 overflow-hidden ${cardStyleClassDark} ${cardRadiusClass}`}>
                                    <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className="w-full h-full object-cover grayscale" />
                                    {isVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <div className="w-12 h-12 flex items-center justify-center border-2 border-white text-white">
                                                <i className="fas fa-play"></i>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Desktop Hover Image */}
                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className={`hover-img hidden @md:block grayscale object-cover`} />
                            </motion.div>
                        )
                    }) : <div className="py-20 text-center text-zinc-600 font-bold text-xs uppercase tracking-widest acid-body">SYSTEM: NO_DATA_FOUND</div>}
                </div>

                {/* Tombol Gallery Utama */}
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                    className={`w-full mt-8 mb-12 @md:mt-20 @md:mb-24 border-y-2 border-zinc-800`}
                >
                    <Link href={`/${subdomain}/gallery`} scroll={false} className="group block w-full no-underline relative overflow-hidden bg-[#09090b] hover:bg-zinc-900 transition-colors duration-300">
                        <div className={`flex items-center justify-between px-6 py-6 @md:px-12 @md:py-12 @lg:py-16`}>
                            <div className="flex flex-col relative z-10">
                                <span className="acid-text font-bold text-[10px] @md:text-xs uppercase tracking-[0.2em] acid-body mb-2 @md:mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-none animate-pulse" style={{ backgroundColor: themeColor }}></span> System: Access_Granted
                                </span>
                                <h3 className={`acid-heading font-extrabold uppercase tracking-tighter text-[#fafafa] group-hover:text-[var(--theme-color)] transition-colors duration-300 leading-none text-3xl @md:text-5xl @lg:text-[5.5rem]`} style={{ '--theme-color': themeColor } as any}>
                                    <EditableText value={theme?.customTexts?.explore_archive || 'VIEW FULL ARCHIVE'} field="explore_archive" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                                </h3>
                            </div>

                            <motion.div 
                                whileHover={{ scale: 1.1, rotate: 12 }}
                                className={`shrink-0 border-2 border-zinc-800 group-hover:border-[var(--theme-color)] transition-all duration-300 flex items-center justify-center bg-[#09090b] group-hover:bg-[var(--theme-color)] w-10 h-10 @md:w-24 @md:h-24 @lg:w-32 @lg:h-32`} style={{ '--theme-color': themeColor } as any}
                            >
                                <i className={`fas fa-arrow-right group-hover:-rotate-45 transition-transform duration-300 text-zinc-500 group-hover:text-[#09090b] text-sm @md:text-3xl @lg:text-5xl`}></i>
                            </motion.div>
                        </div>
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" style={{ backgroundColor: themeColor }}></div>
                    </Link>
                </motion.div>
            </section>

            {/* 3D SHOWCASE SECTION */}
            {items3D.length > 0 && (
                <section className="p-8 @lg:p-12 border-t-2 border-zinc-800 bg-[#09090b]">
                    <motion.div
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
                        variants={fadeUp} custom={0.2}
                        className="mb-10 flex justify-between items-end"
                    >
                        <h2 className="text-3xl font-extrabold uppercase tracking-tighter text-[#fafafa] acid-heading flex items-center gap-4">
                            <span className="text-4xl" style={{ color: themeColor }}>3D</span>
                            <span className="text-[#fafafa]"><EditableText value={theme?.customTexts?.models_title || 'OBJECTS'} field="models_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" /></span>
                        </h2>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] acid-body" style={{ color: themeColor }}>{items3D.length} FILES</span>
                    </motion.div>

                    <motion.div
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 gap-8"
                    >
                        {items3D.map((p: any, i: number) => (
                            <motion.div key={p.id || i} variants={fadeUp} className="group">
                                <div className={`w-full ${cardStyleClassDark} ${cardRadiusClass} overflow-hidden transition-all duration-300`} style={{ ':hover': { borderColor: themeColor } } as any}>
                                    <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0a0a0a" />
                                </div>
                                <div className="flex justify-between items-start mt-4">
                                    <div>
                                        <h3 className="text-base font-extrabold uppercase tracking-tight text-[#fafafa] acid-heading">{p.title}</h3>
                                        {p.description && <p className="text-xs text-zinc-500 mt-1 acid-body">{p.description}</p>}
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#09090b] px-2 py-1 shrink-0 acid-body" style={{ backgroundColor: themeColor }}>3D</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            )}

            {/* INTEGRATIONS */}
            {data?.id && (
                <div className="px-6 @md:px-12 mb-10">
                    <PenpotShowcase userId={data.id} variant="acid" themeColor={themeColor} />
                    <CanvaShowcase userId={data.id} variant="acid" themeColor={themeColor} />
                </div>
            )}

            {/* GITHUB STATS */}
            {data?.id && (
                <div className="px-6 @md:px-12 mb-10">
                    <GithubStats userId={data.id} variant="acid" themeColor={themeColor} />
                </div>
            )}

            {/* AWARDS SECTION */}
            <section className="acid-bg text-[#09090b] py-20 @md:py-24" id="awards">
                <div className="max-w-6xl mx-auto px-6 @md:px-12">
                    <motion.h2 
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: false }} variants={fadeUp}
                        className={`acid-heading font-extrabold uppercase tracking-tighter mb-12 text-4xl @md:text-[clamp(3rem,6cqi,5rem)]`}
                    >
                        <EditableText value={theme?.customTexts?.awards_title || 'RECOGNITION'} field="awards_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                    </motion.h2>

                    <div className="border-t-4 border-[#09090b]">
                        {awardItems.length > 0 ? awardItems.map((award: any, i: number) => {
                            const isOpen = openAward === award.id;
                            return (
                                <motion.div 
                                    key={`award-${award.id || i}`}
                                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, margin: "50px" }} variants={fadeUp}
                                    className="border-b-4 border-[#09090b] group"
                                >
                                    <div className={`award-row flex justify-between items-center cursor-pointer hover:bg-[#09090b] hover:text-[var(--theme-color)] transition-colors px-2 @md:px-4 py-5 @md:py-6`} style={{ '--theme-color': themeColor } as any} onClick={() => setOpenAward(isOpen ? null : award.id)}>
                                        <div className="flex items-center gap-4 @md:gap-6 w-full @md:w-auto">
                                            <span className={`font-bold acid-body shrink-0 text-lg w-12 @md:text-2xl @md:w-16`}>{award.year || new Date(award.createdAt).getFullYear()}</span>
                                            <h3 className={`acid-heading font-extrabold uppercase tracking-tighter line-clamp-1 text-xl @md:text-2xl @lg:text-4xl`}>{award.title}</h3>
                                        </div>
                                        <motion.i 
                                            animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}
                                            className={`fas fa-plus text-xl @md:text-2xl shrink-0 ml-4 ${isOpen ? 'text-white' : ''}`}
                                        ></motion.i>
                                    </div>

                                    <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
                                        <div className={`px-2 @md:px-4 pb-8 pt-4 flex items-start gap-6 border-t border-[#09090b]/20 mt-2 @md:mt-4 flex-col @md:flex-row`}>
                                            <div className={`shrink-0 bg-[#000] border-2 border-[#09090b] flex items-center justify-center p-1 w-48 h-32`}>
                                                <LazyImage src={award.mediaUrl || "https://via.placeholder.com/600"} className="w-full h-full object-contain p-2 grayscale" alt="Certificate" />
                                            </div>
                                            <div className="acid-body">
                                                <h4 className={`font-bold uppercase tracking-widest mb-2 text-xs`}>{award.issuer}</h4>
                                                <p className={`font-medium max-w-lg leading-relaxed text-[#09090b]/80 text-sm`}>{award.description || 'Awarded for excellence and outstanding contribution in the respective creative category.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        }) : <div className="py-10 font-bold text-sm uppercase tracking-widest text-[#09090b]/50 acid-body">SYSTEM: NO_DATA_FOUND</div>}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            {testimonials.length > 0 && (
                <section className="bg-zinc-900 border-y-4 border-[#09090b] py-20 @md:py-24" id="testimonials">
                    <div className="max-w-6xl mx-auto px-6 @md:px-12">
                        <motion.h2 
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: false }} variants={fadeUp}
                            className={`acid-heading font-extrabold uppercase tracking-tighter mb-12 text-4xl @md:text-[clamp(3rem,6cqi,5rem)] acid-text`}
                        >
                            <EditableText value={theme?.customTexts?.testimonials_title || 'ENDORSEMENTS'} field="testimonials_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                        </motion.h2>

                        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6 @md:gap-10">
                            {testimonials.map((t: any, i: number) => (
                                <motion.div 
                                    key={t.id}
                                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, margin: "50px" }} variants={fadeUp}
                                    className={`${testimonialStyleClass} ${cardRadiusClass} p-6 @md:p-10 hover:-translate-y-2 transition-all duration-300`}
                                    style={{ '--theme-color': themeColor } as any}
                                >
                                    <p className="font-medium text-lg @md:text-2xl leading-relaxed text-[#fafafa] italic mb-8 acid-body">
                                        "{t.content}"
                                    </p>
                                    <div className="flex items-center gap-4 pt-6 border-t-2 border-zinc-800">
                                        {t.avatarUrl ? (
                                            <LazyImage src={t.avatarUrl} alt={t.clientName} className={`w-14 h-14 ${radiusClass} border-2 border-zinc-600 grayscale object-cover`} />
                                        ) : (
                                            <div className="w-14 h-14 bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center font-bold text-xl uppercase acid-heading text-white">
                                                {t.clientName.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-extrabold text-white text-lg uppercase tracking-tight acid-heading">{t.clientName}</h4>
                                            {t.company && <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 acid-body">{t.company}</p>}
                                        </div>
                                        <div className="ml-auto flex gap-1">
                                            {[...Array(5)].map((_, idx) => (
                                                <i key={idx} className={`text-xs ${idx < t.rating ? 'fas fa-star acid-text' : 'far fa-star text-zinc-700'}`}></i>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FOOTER */}
            <motion.footer 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
                className="pt-24 @md:pt-32 pb-12 px-6 @md:px-12 text-center bg-[#09090b]"
            >
                <motion.p variants={fadeUp} className="acid-text font-bold uppercase tracking-[0.3em] mb-6 acid-body text-[10px] @md:text-xs"><EditableText value={theme?.customTexts?.cta_subtitle || 'Drop a Line'} field="cta_subtitle" entity="appearance" isEditor={isEditor} maxLength={25} as="span" /></motion.p>
                <motion.a variants={fadeUp} href={`mailto:${userEmail}`} className={`block acid-heading font-extrabold uppercase tracking-tighter leading-[0.8] transition-colors duration-300 mb-16 @md:mb-20 hover:text-[var(--theme-color)]`} style={{ '--theme-color': themeColor } as any}>
                    <span className={`block w-full break-words text-5xl @md:text-[clamp(5rem,15cqi,10rem)]`}><EditableText value={theme?.customTexts?.cta_title || 'CONTACT'} field="cta_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" /></span>
                </motion.a>

                <motion.div variants={fadeUp} className={`flex justify-between items-center border-t border-zinc-800 pt-8 font-bold uppercase tracking-widest text-zinc-500 acid-body flex-col gap-4 text-[9px] @md:flex-row @md:text-xs`}>
                    <p>© 2026 {fullName}</p>
                    <div className={`flex gap-4 my-2 @md:gap-6 @md:my-0`}>
                        {links.map((l: any, i: number) => (
                            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-white transition" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = themeColor} onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}>{l.platform.substring(0, 2)}</a>
                        ))}
                    </div>
                    <a href={`/${subdomain}`} className="transition flex items-center gap-2" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = themeColor} onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}>
                        PORTFO.BE/{subdomain?.toUpperCase()} <motion.i whileHover={{ x: 5 }} className="fas fa-arrow-right -rotate-45"></motion.i>
                    </a>
                </motion.div>
            </motion.footer>

            {/* ACID MEDIA MODAL */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10"
                    >
                        {/* High Contrast Backdrop */}
                        <div className="absolute inset-0 bg-[#09090b]/95" onClick={() => setSelectedMedia(null)}>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--theme-color)] to-transparent opacity-50" style={{ '--theme-color': themeColor } as any}></div>
                        </div>

                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, x: -20 }} animate={{ scale: 1, opacity: 1, x: 0 }} exit={{ scale: 1.1, opacity: 0, x: 20 }}
                            className={`relative w-full max-w-5xl bg-[#09090b] border-4 border-white shadow-[10px_10px_0px_var(--theme-color)] flex flex-col overflow-hidden`}
                            style={{ '--theme-color': themeColor } as any}
                        >
                            {/* Neon Header */}
                            <div className="flex justify-between items-center p-4 @md:p-8 bg-white text-[#09090b] relative z-10">
                                <div className="flex flex-col">
                                    <span className="font-bold uppercase tracking-[0.3em] acid-body text-[10px] mb-1">SYSTEM://MEDIA_PLAYER</span>
                                    <h3 className="acid-heading font-extrabold uppercase tracking-tighter text-2xl @md:text-4xl">{selectedMedia.title}</h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="w-12 h-12 bg-[#09090b] text-white flex items-center justify-center hover:bg-[var(--theme-color)] hover:text-black transition-colors transform -skew-x-12"
                                    style={{ '--theme-color': themeColor } as any}
                                >
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            {/* Player Area */}
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[60vh]'} bg-zinc-900 border-y-4 border-white flex items-center justify-center p-2 @md:p-4`}
                            >
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-black/40">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[55vh] object-contain grayscale hover:grayscale-0 transition-all duration-500" />
                                    </div>
                                )}
                            </motion.div>

                            {/* Neon Footer */}
                            <div className="p-4 flex justify-between items-center bg-[#09090b] px-6 @md:px-10">
                                <div className="flex items-center gap-4 hidden @md:flex">
                                    <div className="w-3 h-3 acid-bg animate-ping"></div>
                                    <span className="acid-body text-[10px] font-bold uppercase tracking-widest text-white/40">Live_Stream_Active</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="acid-body text-[10px] font-bold uppercase tracking-[0.5em] text-white hover:text-[var(--theme-color)] transition-colors"
                                    style={{ '--theme-color': themeColor } as any}
                                >
                                    TERMINATE_PREVIEW [ESC]
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}