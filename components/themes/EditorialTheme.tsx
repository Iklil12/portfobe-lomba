"use client";

import React, { useState } from 'react';
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

export default function EditorialTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [isCopied, setIsCopied] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

  // --- ANIMASI STABILISASI ---
  // Kita gunakan animate="visible" untuk editor agar langsung tampil tanpa pemicu scroll (yang sering rusak di preview)
  // Tapi tetap gunakan whileInView untuk live site agar ada efek scroll reveal.
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";


    // Ekstraksi Data
    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const profession = data?.profile?.profession || data?.profession || "Art Director & Designer";
    const bio = data?.profile?.bio || data?.bio || "Creating clean, functional, and visually striking digital experiences with extreme attention to detail.";
    const location = data?.profile?.location || data?.location || "Indonesia";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

    // Warna Tema & Variabel Custom
    const fontHeading = theme?.fontHeading || 'Newsreader';
    const fontBody = theme?.fontBody || 'Instrument Sans';
    const radiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[2rem]';
    const cardStyle = theme?.cardStyle || 'soft';

    const cardRadiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[3rem]' : 'rounded-2xl';
    const cardStyleClassLight = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-white shadow-[0_30px_60px_rgba(0,0,0,0.08)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-white border-2 border-[#111] shadow-[8px_8px_0_0_#111]' : 'bg-[#fdfdfc] border border-[rgba(0,0,0,0.08)] shadow-sm';

    const getFontFamily = (f: string) => {
        if (!f) return "'Newsreader', serif";
        if (f.toLowerCase().includes('mono') || f.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f.toLowerCase().includes('serif') || f.toLowerCase().includes('playfair') || f.toLowerCase().includes('newsreader') || f.toLowerCase().includes('elegant')) return "'Playfair Display', serif";
        if (f.toLowerCase().includes('inter')) return "'Inter', sans-serif";
        return `'${f}', sans-serif`;
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    const rawHighlightColor = theme?.themeColor || '#2563eb';
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#2563eb';

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];

    // --- SETUP ANIMASI HALUS ---
    const canvasEase = [0.22, 1, 0.36, 1] as any;

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        // Background Off-White (Putih Kanvas) dan Teks Abu-abu Gelap / Hitam
        <main className="w-full bg-[#fdfdfc] text-[#111111] font-sans selection:bg-[var(--hl)] selection:text-white overflow-x-hidden @container editorial-theme" style={{ '--hl': highlightColor } as React.CSSProperties}>

            <style dangerouslySetInnerHTML={{
                __html: `
        .editorial-theme .font-sans { font-family: ${customBodyFont}; }
        .editorial-theme .font-serif { font-family: ${customHeadingFont}; }

        /* Custom Scrollbar — scoped ke editorial-theme */
        .editorial-theme ::-webkit-scrollbar { width: 6px; }
        .editorial-theme ::-webkit-scrollbar-track { background: #fdfdfc; }
        .editorial-theme ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .editorial-theme ::-webkit-scrollbar-thumb:hover { background: var(--hl); }

        .border-subtle { border-color: rgba(0, 0, 0, 0.08); }
        .bg-subtle { background-color: rgba(0, 0, 0, 0.03); }
        
        .shadow-soft { box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05); }
        .shadow-hover { box-shadow: 0 30px 60px -20px rgba(0,0,0,0.12); }

        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}} />

            {/* NAVBAR (Kapsul Melayang di Tengah) */}
            <div className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} top-6 left-0 w-full z-50 flex justify-center pointer-events-none px-4`}>
                <nav className="pointer-events-auto bg-white/80 backdrop-blur-md border border-subtle shadow-soft rounded-full px-4 py-2 @md:px-6 @md:py-3 flex items-center justify-between gap-4 @md:gap-16 w-full max-w-max">
                    <span className="font-sans font-bold tracking-tight text-sm">
                        {firstName}
                    </span>
                    <div className="hidden @md:flex items-center gap-6 font-sans text-xs font-medium text-slate-500">
                        <a href="#work" className="hover:text-black transition-colors">Projects</a>
                        <a href="#awards" className="hover:text-black transition-colors">Recognitions</a>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full animate-pulse bg-[var(--hl)] shrink-0"></span>
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden @md:block">Available</span>
                    </div>
                </nav>
            </div>

            {/* HERO SECTION (Clean Editorial Layout) */}
            <section className={`relative w-full max-w-[1600px] mx-auto flex flex-col justify-center min-h-[90svh] pt-32 px-6 @md:pt-40 @md:px-12 @lg:px-20`}>

                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer} className="flex flex-col @md:flex-row items-center justify-between gap-12 @lg:gap-24 h-full">

                    {/* Left Typography */}
                    <div className="flex flex-col w-full @md:w-3/5 order-2 @md:order-1">
                        <motion.span variants={fadeUp} className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-slate-300"></span>
                            Creative Portfolio
                        </motion.span>

                        <motion.h1 variants={fadeUp} className={`font-sans font-semibold tracking-tight text-[#111] leading-[1.05] mb-8 text-5xl @md:text-6xl @lg:text-[6.5cqi]`}>
                            Designing <span className="font-serif italic text-slate-500">clarity</span> out of complexity.
                        </motion.h1>

                        <motion.p variants={fadeUp} className={`font-sans text-slate-500 font-medium leading-relaxed max-w-xl text-base @md:text-lg @lg:text-xl`}>
                            {bio}
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex items-center gap-4 mt-10">
                            <a href={`mailto:${userEmail}`} className={`px-6 py-3 @md:px-8 @md:py-4 ${radiusClass} bg-[#111] text-white font-sans text-sm @md:text-base font-medium hover:bg-[var(--hl)] transition-colors duration-300 shadow-xl shadow-black/10`}>
                                Get in touch
                            </a>
                            <button onClick={handleCopyEmail} className={`px-6 py-3 @md:px-8 @md:py-4 ${radiusClass} bg-white border border-subtle text-[#111] font-sans text-sm @md:text-base font-medium hover:bg-slate-50 transition-colors duration-300 flex items-center gap-2`}>
                                {isCopied ? 'Email Copied' : 'Copy Email'} <i className={isCopied ? 'fas fa-check text-[var(--hl)]' : 'far fa-copy text-slate-400'}></i>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Portrait Image */}
                    <motion.div variants={fadeUp} className={`w-full @md:w-2/5 order-1 @md:order-2 flex justify-center @md:justify-end mb-4 @md:mb-0`}>
                        <div className={`relative ${radiusClass} overflow-hidden shadow-soft border border-subtle w-full aspect-square max-w-sm @md:w-[90%] @md:aspect-[3/4] @md:max-w-md`}>
                            <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                    </motion.div>

                </motion.div>
            </section>

            {/* MARQUEE SEPARATOR */}
            <div className="w-full border-y border-subtle py-4 @md:py-6 bg-white overflow-hidden my-12 @md:my-20">
                <div className="w-[200%] flex animate-marquee font-serif italic text-2xl @md:text-4xl text-slate-300 whitespace-nowrap">
                    <div className="flex items-center gap-8 @md:gap-16 px-4 @md:px-8">
                        {[...Array(5)].map((_, i) => (<React.Fragment key={i}><span className="hover:text-[var(--hl)] transition-colors">{profession}</span><span className="text-slate-200">✦</span></React.Fragment>))}
                    </div>
                    <div className="flex items-center gap-8 @md:gap-16 px-4 @md:px-8">
                        {[...Array(5)].map((_, i) => (<React.Fragment key={i + 10}><span className="hover:text-[var(--hl)] transition-colors">{profession}</span><span className="text-slate-200">✦</span></React.Fragment>))}
                    </div>
                </div>
            </div>

            {/* SELECTED WORKS (Staggered / Offset Grid Layout) */}
            <section id="work" className={`w-full max-w-[1600px] mx-auto flex flex-col px-6 py-12 @md:px-12 @lg:px-20 @md:py-24`}>

                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex flex-col @md:flex-row justify-between items-start @md:items-end mb-16 @md:mb-24 gap-6">
                    <h2 className={`font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl @lg:text-6xl`}>
                        Selected <span className="font-serif italic text-slate-400">Works</span>
                    </h2>
                    <p className="font-sans text-sm @md:text-base font-medium text-slate-500 max-w-xs">
                        A curated collection of digital products, visual systems, and brand identities.
                    </p>
                </motion.div>

                {/* Grid Asimetris (Kiri dan Kanan naik-turun) */}
                <div className={`grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-16 @lg:gap-24`}>
                    {archiveItems.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        const isEven = i % 2 !== 0;

                        return (
                            <motion.div
                                key={i}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className={`flex flex-col group cursor-pointer w-full ${isEven ? '@md:mt-32' : ''}`}
                                onClick={() => {
                                    if (isVideo || p.projectType === 'photo') {
                                        setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                    } else if (p.mediaUrl) {
                                        window.open(p.mediaUrl, '_blank');
                                    }
                                }}
                            >
                                {/* Image Box */}
                                <div className={`w-full aspect-[4/5] @md:aspect-[3/4] ${cardRadiusClass} overflow-hidden relative mb-6 @md:mb-8 ${cardStyleClassLight} group-hover:-translate-y-2 transition-all duration-700`}>
                                    <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />

                                    {/* Video Play Indicator (Elegant Editorial) */}
                                    {isVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/40 transition-all duration-500">
                                                <i className="fas fa-play text-white/80 text-lg ml-1"></i>
                                            </div>
                                        </div>
                                    )}

                                    {/* Hover Reveal Arrow */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <i className="fas fa-arrow-right -rotate-45 text-[#111] text-xl"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="flex flex-col px-2">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-sans text-2xl @md:text-3xl font-semibold text-[#111] group-hover:text-[var(--hl)] transition-colors">{p.title}</h3>
                                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{p.projectType}</span>
                                    </div>
                                    <p className="font-sans text-sm @md:text-base text-slate-500 line-clamp-2 leading-relaxed">
                                        {p.description || 'View detailed case study of this project.'}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={fadeUp} className="w-full flex justify-center mt-20 @md:mt-32">
                    <Link href={`/${subdomain}/gallery`} scroll={false} className={`group inline-flex items-center justify-center gap-4 px-8 py-4 ${radiusClass} border border-subtle hover:border-[var(--hl)] hover:bg-[var(--hl)] hover:text-white transition-all duration-300 font-sans font-medium text-sm @md:text-base text-[#111]`}>
                        View Full Archive
                        <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                </motion.div>

            </section>

            {/* 3D SHOWCASE (Editorial Layout) */}
            {items3D.length > 0 && (
                <section className={`w-full max-w-[1600px] mx-auto flex flex-col px-6 py-12 @md:px-12 @lg:px-20 @md:py-24 border-t border-subtle`}>
                    <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex flex-col @md:flex-row justify-between items-start @md:items-end mb-16 @md:mb-24 gap-6">
                        <h2 className={`font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl @lg:text-6xl`}>
                            Spatial <span className="font-serif italic text-slate-400">Models</span>
                        </h2>
                        <p className="font-sans text-sm @md:text-base font-medium text-slate-500 max-w-xs">
                            Interactive 3D environments and digital objects.
                        </p>
                    </motion.div>

                    <div className={`grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-16 @lg:gap-24`}>
                        {items3D.map((p: any, i: number) => {
                            const isEven = i % 2 !== 0;

                            return (
                                <motion.div
                                    key={i}
                                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                    className={`flex flex-col group w-full ${isEven ? '@md:mt-32' : ''}`}
                                >
                                    <div className={`w-full aspect-square ${cardRadiusClass} overflow-hidden relative mb-6 @md:mb-8 ${cardStyleClassLight} group-hover:-translate-y-2 transition-all duration-700`}>
                                        <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#fdfdfc" />
                                    </div>

                                    <div className="flex flex-col px-2">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-sans text-2xl @md:text-3xl font-semibold text-[#111]">{p.title}</h3>
                                            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">3D Asset</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* PENPOT & CANVA SHOWCASE SECTION */}
            {data?.id && (
                <div className="w-full bg-[#fdfdfc]">
                    <PenpotShowcase userId={data.id} variant="editorial" themeColor={highlightColor} />
                    <CanvaShowcase userId={data.id} variant="editorial" themeColor={highlightColor} />
                </div>
            )}

            {/* GITHUB STATS SECTION */}
            {data?.id && (
                <div className="w-full bg-[#fdfdfc]">
                    <GithubStats userId={data.id} variant="editorial" themeColor={highlightColor} />
                </div>
            )}

            {/* AWARDS / RECOGNITION (Minimalist List) */}
            {awardItems.length > 0 && (
                <section id="awards" className="w-full bg-white border-y border-subtle py-20 @md:py-32">
                    <div className={`max-w-[1600px] mx-auto flex flex-col @lg:flex-row gap-12 @lg:gap-24 px-6 @md:px-12 @lg:px-20`}>

                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="w-full @lg:w-1/3">
                            <h2 className={`font-sans font-semibold tracking-tight text-[#111] mb-4 text-4xl @md:text-5xl`}>
                                Honors & <br /><span className="font-serif italic text-slate-400">Awards</span>
                            </h2>
                            <p className="font-sans text-sm text-slate-500 leading-relaxed">
                                Recognition from the industry for pushing the boundaries of digital product design and engineering.
                            </p>
                        </motion.div>

                        <div className="w-full @lg:w-2/3 flex flex-col">
                            {awardItems.map((award: any, i: number) => (
                                <motion.a
                                    href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i}
                                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                    className="group flex flex-col @md:flex-row @md:items-center justify-between border-b border-subtle py-6 @md:py-8 cursor-pointer relative overflow-hidden"
                                >
                                    {/* Hover Line Effect */}
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--hl)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                                    <div className="flex flex-col @md:flex-row @md:items-center gap-2 @md:gap-8 w-full @md:w-3/4 mb-4 @md:mb-0">
                                        <span className="font-serif text-slate-400 italic text-lg @md:text-xl w-16">{award.year || new Date(award.createdAt).getFullYear()}</span>
                                        <div className="flex flex-col">
                                            <h3 className="font-sans font-semibold text-xl @md:text-2xl text-[#111] group-hover:text-[var(--hl)] transition-colors">{award.title}</h3>
                                            <span className="font-sans text-xs font-medium text-slate-500 mt-1">{award.issuer}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center w-full @md:w-auto gap-8">
                                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-1 rounded-full border border-subtle">{award.status || 'Verified'}</span>
                                        <i className="fas fa-arrow-right -rotate-45 text-slate-300 group-hover:text-[var(--hl)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"></i>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* TESTIMONIALS SECTION (Editorial Quotes) */}
            {testimonials.length > 0 && (
                <section className="w-full bg-[#fdfdfc] py-20 @md:py-32 px-6 @md:px-12 @lg:px-20 border-t border-subtle">
                    <div className="max-w-[1600px] mx-auto">
                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-16">
                            <h2 className={`font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl`}>
                                Client <span className="font-serif italic text-slate-400">Voices</span>
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-12 @md:gap-20">
                            {testimonials.map((t: any, i: number) => (
                                <motion.div
                                    key={t.id}
                                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                    className="flex flex-col"
                                >
                                    <span className="text-6xl font-serif text-slate-300 mb-[-20px] leading-none">"</span>
                                    <p className="font-serif italic text-xl @md:text-3xl text-[#111] leading-relaxed mb-10 pl-6 border-l-2 border-[var(--hl)]">
                                        {t.content}
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-subtle">
                                            {t.avatarUrl ? (
                                                <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 flex items-center justify-center font-serif text-xl font-bold text-[#111]">
                                                    {t.clientName.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-sans font-bold text-[#111] uppercase tracking-wide text-sm">{t.clientName}</h4>
                                            {t.company && <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-slate-400">{t.company}</p>}
                                        </div>
                                        <div className="ml-auto flex gap-1">
                                            {[...Array(5)].map((_, idx) => (
                                                <i key={idx} className={`text-xs ${idx < t.rating ? 'fas fa-star text-slate-800' : 'far fa-star text-slate-300'}`}></i>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FOOTER (Giant Minimal CTA) */}
            <footer className={`w-full bg-[#fdfdfc] flex flex-col items-center justify-center pt-32 pb-12 px-6 @md:px-12 @lg:px-20`}>

                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex flex-col items-center text-center w-full max-w-4xl mx-auto mb-24 @md:mb-40">
                    <span className="font-sans text-[10px] @md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">What's Next?</span>

                    <div onClick={handleCopyEmail} className="cursor-pointer group relative w-full">
                        <h2 className={`font-sans font-bold tracking-tighter text-[#111] leading-[0.9] transition-colors duration-500 text-[15cqw] @md:text-[10cqw]`}>
                            LET'S <span className="font-serif italic text-slate-300 group-hover:text-[var(--hl)] transition-colors">TALK</span>
                        </h2>

                        {/* Hover Popup Message */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111] text-white px-6 py-3 rounded-full font-sans text-sm font-medium opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none shadow-xl flex items-center gap-2">
                            {isCopied ? 'Email Copied!' : 'Click to Copy Email'} <i className={isCopied ? 'fas fa-check text-green-400' : 'far fa-copy text-slate-400'}></i>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Links */}
                <div className="w-full max-w-[1600px] mx-auto flex flex-col @md:flex-row justify-between items-center gap-6 pt-8 border-t border-subtle font-sans text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                        <span>© {new Date().getFullYear()} {fullName}.</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full mx-2"></span>
                        <span>All rights reserved.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        {links.map((l: any, i: number) => (
                            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-[var(--hl)] hover:underline transition-colors uppercase tracking-widest font-bold text-[10px]">
                                {l.platform}
                            </a>
                        ))}
                    </div>

                    <Link href={`/${subdomain}`} className="hover:text-[var(--hl)] transition-colors font-bold uppercase tracking-widest text-[10px]">
                        PORTFO.BE/{subdomain.toUpperCase()}
                    </Link>
                </div>

            </footer>

            {/* EDITORIAL MEDIA MODAL */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10"
                    >
                        {/* Soft Canvas Backdrop */}
                        <motion.div 
                            initial={{ backdropFilter: "blur(0px)" }} animate={{ backdropFilter: "blur(10px)" }}
                            className="absolute inset-0 bg-[#fdfdfc]/80" onClick={() => setSelectedMedia(null)}
                        ></motion.div>

                        <motion.div 
                            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.6, ease: canvasEase }}
                            className={`relative w-full max-w-5xl flex flex-col overflow-hidden ${cardStyleClassLight} ${cardRadiusClass}`}
                        >
                            {/* Museum-style Header */}
                            <div className="flex justify-between items-center p-6 @md:p-10 border-b border-subtle relative z-10">
                                <div className="flex flex-col">
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Editorial Exhibition</span>
                                    <h3 className="font-serif italic text-3xl @md:text-5xl text-[#111]">{selectedMedia.title}</h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="w-12 h-12 rounded-full border border-subtle flex items-center justify-center hover:bg-[#111] hover:text-white transition-all duration-300"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Presentation Area */}
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[65vh]'} bg-[#f8f8f6] flex items-center justify-center p-2 @md:p-8`}
                            >
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[55vh] object-contain shadow-2xl border-4 border-white" />
                                    </div>
                                )}
                            </motion.div>

                            {/* Minimal Footer */}
                            <div className="p-6 flex justify-center border-t border-subtle bg-white">
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 hover:text-[var(--hl)] transition-colors"
                                >
                                    DISMISS EXHIBITION
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}