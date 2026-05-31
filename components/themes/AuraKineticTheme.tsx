"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
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

export default function AuraKineticTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [isCopied, setIsCopied] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    // --- ANIMASI STABILISASI ---
    // Kita gunakan animate="visible" untuk editor agar langsung tampil tanpa pemicu scroll (yang sering rusak di preview)
    // Tapi tetap gunakan whileInView untuk live site agar ada efek scroll reveal.
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (isCardPreview || isEditor) return; // Skip scroll detection di card preview
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsScrolled(!entry.isIntersecting);
            },
            { root: null, rootMargin: '0px', threshold: 0 }
        );

        const sentinel = document.getElementById('aura-scroll-sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => {
            if (sentinel) observer.unobserve(sentinel);
        };
    }, [isCardPreview]);

    // Ekstraksi Data Standar
    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const firstName = fullName.split(' ')[0];
    const profession = data?.profile?.profession || data?.profession || "Art Director & Designer";
    const bio = data?.profile?.bio || data?.bio || "Creating clean, functional, and visually striking digital experiences with extreme attention to detail.";
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

    const fontHeading = theme?.fontHeading || 'Instrument Sans'; // Pakai Sans untuk modern look
    const fontBody = theme?.fontBody || 'Instrument Sans';
    const radiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-3xl';
    const cardRadiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-3xl';
    const cardStyle = theme?.cardStyle || 'glassmorphism';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#18181b] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border-2 border-[var(--hl)] shadow-[6px_6px_0_0_var(--hl)]' : cardStyle === 'flat' ? 'bg-[#0a0a0c] border-2 border-white/20' : 'bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:border-white/20 hover:bg-white/10';

    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        return "'Inter', sans-serif";
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    const rawHighlightColor = theme?.themeColor || '#8b5cf6'; // Default Purple Aura
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#8b5cf6';

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // SETUP ANIMASI "MANJA" (Smooth Spring & Cubic Bezier)
    const smoothEase = [0.16, 1, 0.3, 1] as any; // Sangat mulus di akhir
    const springTransition = { type: "spring", stiffness: 100, damping: 20 };

    const fadeUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <main className="relative min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-[var(--hl)] selection:text-white overflow-x-hidden @container aura-theme" style={{ '--hl': highlightColor } as React.CSSProperties}>
            {/* SENTINEL FOR SCROLL DETECTION */}
            <div id="aura-scroll-sentinel" className="absolute top-0 left-0 w-full h-[60px] pointer-events-none opacity-0"></div>

            <style dangerouslySetInnerHTML={{
                __html: `
            .aura-theme { font-family: ${customBodyFont}; }
            .aura-theme .font-outfit { font-family: ${customHeadingFont}; }
            .aura-theme .font-serif { font-family: ${customHeadingFont}; }
            .aura-theme .font-sans { font-family: ${customBodyFont}; }

            @keyframes blob {
                0% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0, 0) scale(1); }
            }
            .animate-blob { animation: blob 7s infinite alternate; }
          `}} />
            {/* ================= BACKGROUND AURA (KINETIC BLOBS) ================= */}
            <div className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center`}>
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--hl)] opacity-[0.15] rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 opacity-[0.1] rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000"></div>
                <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-purple-500 opacity-[0.1] rounded-full blur-[90px] mix-blend-screen animate-blob animation-delay-4000"></div>
                {/* Noise Halus */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05]"></div>
            </div>

            {/* ================= NAVBAR (DYNAMIC SCROLL) ================= */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} left-0 w-full z-50 flex justify-center pointer-events-none transition-all duration-500 ease-in-out ${isScrolled ? 'top-6 px-4' : 'top-0 px-6 @md:px-12 py-6'}`}
            >
                <nav
                    className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-in-out 
                    ${isScrolled
                            ? 'gap-4 @md:gap-10 px-4 @md:px-10 py-2 @md:py-4 bg-white/10 border border-white/20 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-[95%] @md:w-full max-w-[1200px] hover:bg-white/15'
                            : 'gap-4 @md:gap-10 px-0 py-0 bg-transparent border-transparent w-[95%] @md:w-full max-w-[1400px]'
                        }`}
                >
                    {/* Logo/Name */}
                    <span className={`font-sans font-bold tracking-tight text-white transition-all duration-500 ease-in-out ${isScrolled ? 'text-base @md:text-2xl' : 'text-xl @md:text-4xl'}`}>
                        <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} /><span className="text-[var(--hl)]">.</span>
                    </span>

                    {/* Links */}
                    <div className={`hidden @md:flex font-sans font-semibold text-white/50 transition-all duration-500 ease-in-out ${isScrolled ? 'gap-8 text-sm' : 'gap-10 text-base'}`}>
                        <a href="#work" className="hover:text-white transition-colors">
                            <EditableText value={theme?.customTexts?.aura_nav_work || 'Work'} field="aura_nav_work" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                        </a>
                        <a href="#awards" className="hover:text-white transition-colors">
                            <EditableText value={theme?.customTexts?.aura_nav_awards || 'Awards'} field="aura_nav_awards" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                        </a>
                    </div>

                    {/* Button */}
                    <a href={`mailto:${userEmail}`} className={`font-sans font-bold uppercase tracking-widest text-black bg-[var(--hl)] hover:scale-105 transition-all duration-500 ease-in-out whitespace-nowrap ${isScrolled ? 'text-[10px] @md:text-xs px-4 @md:px-6 py-2 @md:py-3 rounded-full' : 'text-[10px] @md:text-sm px-5 @md:px-8 py-2.5 @md:py-4 rounded-full'}`}>
                        <EditableText value={theme?.customTexts?.aura_nav_cta || 'Hire Me'} field="aura_nav_cta" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                    </a>
                </nav>
            </motion.div>

            {/* ================= HERO SECTION ================= */}
            <section className="relative z-10 w-full max-w-[1400px] mx-auto min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">

                    <motion.div variants={fadeUp} className="mb-8">
                        <div className="w-24 h-24 @md:w-32 @md:h-32 rounded-full overflow-hidden border-2 border-white/10 p-1 mb-6 mx-auto group">
                            <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <span className="px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full font-sans text-xs font-semibold text-[var(--hl)] flex items-center gap-2 max-w-max mx-auto cursor-default hover:bg-white/10 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-[var(--hl)] animate-pulse shadow-[0_0_10px_var(--hl)]"></span>
                            <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                        </span>
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="font-serif text-5xl @md:text-7xl @lg:text-[6rem] font-bold tracking-tight leading-[1.1] mb-6 max-w-4xl">
                        <EditableText value={theme?.customTexts?.aura_hero_title1 || 'Designing'} field="aura_hero_title1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> <EditableText value={theme?.customTexts?.aura_hero_title2 || 'Fluid'} field="aura_hero_title2" entity="appearance" isEditor={isEditor} as="span" className="text-gradient-animate italic" maxLength={20} /> <EditableText value={theme?.customTexts?.aura_hero_title3 || '& Interactive Experiences.'} field="aura_hero_title3" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                    </motion.h1>

                    <motion.p variants={fadeUp} className="font-sans text-white/50 font-medium text-base @md:text-lg max-w-2xl leading-relaxed mb-10">
                        <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />
                    </motion.p>

                </motion.div>

                {/* Scroll Indicator */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mt-16 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    <span className="font-sans text-[10px] uppercase tracking-widest font-bold">
                        <EditableText value={theme?.customTexts?.aura_scroll_text || 'Scroll'} field="aura_scroll_text" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                    </span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
                </motion.div>
            </section>

            {/* ================= METRICS SECTION ================= */}
            <section className="relative z-10 w-full max-w-[1000px] mx-auto px-6 py-12 @md:py-20 border-y border-white/5 bg-white/[0.02]">
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer} className="flex flex-wrap justify-center @md:justify-between gap-10 text-center">
                    {[
                        { label: theme?.customTexts?.aura_stat_1 || 'Total Projects', value: (data?.projects || data?.user?.projects || []).length || 24, field: 'aura_stat_1', dynamic: true },
                        { label: theme?.customTexts?.aura_stat_2 || 'Recognitions', value: awardItems.length || 5, field: 'aura_stat_2', dynamic: true },
                        { label: theme?.customTexts?.aura_stat_3 || 'Years Active', value: theme?.customTexts?.aura_stat_3_val || '05+', field: 'aura_stat_3', valField: 'aura_stat_3_val', dynamic: false },
                        { label: theme?.customTexts?.aura_stat_4 || 'Global Clients', value: theme?.customTexts?.aura_stat_4_val || '12+', field: 'aura_stat_4', valField: 'aura_stat_4_val', dynamic: false }
                    ].map((stat, i) => (
                        <motion.div key={i} variants={fadeUp} className="flex flex-col items-center">
                            <span className="font-serif text-4xl @md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40">
                                {stat.dynamic ? stat.value : <EditableText value={stat.value as string} field={stat.valField as string} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />}
                            </span>
                            <span className="font-sans text-xs uppercase tracking-widest text-white/50 mt-2">
                                <EditableText value={stat.label} field={stat.field} entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ================= INTERACTIVE WORK GRID ================= */}
            <section id="work" className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-24 @md:py-32">
                <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-serif text-4xl @md:text-5xl font-bold text-center mb-16">
                    <EditableText value={theme?.customTexts?.stats_projects || 'Selected Works'} field="stats_projects" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                </motion.h2>

                <div className="grid grid-cols-1 @md:grid-cols-2 gap-6 @md:gap-10">
                    {archiveItems.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        const isLarge = i === 0 || i === 3;

                        return (
                            <motion.div
                                key={i}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className={`group relative block w-full cursor-pointer ${isLarge ? '@md:col-span-2' : '@md:col-span-1'}`}
                                onClick={() => {
                                    if (isVideo || p.projectType === 'photo') {
                                        setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                    } else if (p.mediaUrl) {
                                        window.open(p.mediaUrl, '_blank');
                                    }
                                }}
                            >
                                <div className={`relative w-full ${isLarge ? 'aspect-video @md:aspect-[21/9]' : 'aspect-video @md:aspect-[4/3]'} ${cardRadiusClass} overflow-hidden ${cardStyleClassDark} p-2 transition-all duration-500`}>
                                    <div className={`relative w-full h-full ${cardRadiusClass} overflow-hidden bg-[#0a0a0c]`}>
                                        <LazyImage
                                            src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl}
                                            alt={p.title}
                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-40 transition-opacity duration-500"></div>

                                        {isVideo && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                                                    <i className="fas fa-play text-white ml-1"></i>
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute bottom-0 left-0 w-full p-6 @md:p-8 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                            <div className="flex flex-col">
                                                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--hl)] mb-2 drop-shadow-md">{p.projectType}</span>
                                                <h3 className="font-serif text-2xl @md:text-4xl font-bold text-white drop-shadow-lg">{p.title}</h3>
                                            </div>
                                            {!isVideo && (
                                                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform rotate-[-45deg] group-hover:rotate-0 transition-all duration-500 ease-out shadow-xl">
                                                    <i className="fas fa-arrow-right"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mt-16 flex justify-center">
                    <Link href={`/${subdomain}/gallery`} scroll={false} className={`group relative inline-flex items-center justify-center gap-4 px-8 py-4 bg-white/5 border border-white/10 hover:border-[var(--hl)] backdrop-blur-md transition-all duration-300 ${radiusClass} overflow-hidden shadow-lg`}>
                        <div className="absolute inset-0 bg-[var(--hl)] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <span className="font-sans text-xs uppercase tracking-widest font-bold text-white group-hover:text-[var(--hl)] transition-colors">
                            <EditableText value={theme?.customTexts?.explore_archive || 'Explore Full Archive'} field="explore_archive" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                        </span>
                        <i className="fas fa-arrow-right text-[var(--hl)] transform group-hover:translate-x-2 transition-transform duration-300"></i>
                    </Link>
                </motion.div>
            </section>

            {/* ================= 3D SHOWCASE SECTION ================= */}
            {items3D.length > 0 && (
                <section className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-24 @md:py-32 border-t border-white/5">
                    <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="text-center mb-16">
                        <h2 className="font-serif text-4xl @md:text-5xl font-bold">
                            <EditableText value={theme?.customTexts?.models_title || 'Interactive Models'} field="models_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                        </h2>
                        <p className="font-sans text-white/50 mt-4 text-sm">
                            <EditableText value={theme?.customTexts?.models_subtitle || 'Explore spatial design in 3D.'} field="models_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                        </p>
                    </motion.div>

                    <div className="flex flex-col gap-10 @md:gap-16">
                        {items3D.map((p: any, i: number) => (
                            <motion.div
                                key={i}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className={`group relative block w-full`}
                            >
                                <div className={`relative w-full aspect-[4/3] @md:aspect-video ${cardRadiusClass} overflow-hidden ${cardStyleClassDark} p-2 @md:p-3 transition-all duration-500 hover:border-[var(--hl)] hover:bg-white/10`}>
                                    <div className={`relative w-full h-full ${cardRadiusClass} overflow-hidden bg-[#0a0a0c]`}>
                                        <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0a0a0c" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none opacity-80 group-hover:opacity-40 transition-opacity duration-500"></div>

                                        <div className="absolute bottom-0 left-0 w-full p-8 @md:p-12 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none">
                                            <div className="flex flex-col">
                                                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)] mb-3 drop-shadow-md">
                                                    <EditableText value={theme?.customTexts?.aura_model_label || 'Aura Asset'} field="aura_model_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> 0{i + 1}
                                                </span>
                                                <h3 className="font-serif text-3xl @md:text-6xl font-bold text-white drop-shadow-lg leading-none">{p.title}</h3>
                                                {p.description && <p className="text-white/60 text-sm @md:text-base max-w-xl mt-4 font-sans line-clamp-2">{p.description}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* INTEGRATIONS */}
            {data?.id && (
                <section className="relative z-10 w-full max-w-[1000px] mx-auto px-6 mb-10">
                    <PenpotShowcase userId={data.id} variant="aura" themeColor={highlightColor} />
                    <CanvaShowcase userId={data.id} variant="aura" themeColor={highlightColor} />
                </section>
            )}

            {/* ================= GITHUB STATS ================= */}
            {data?.id && (
                <section className="relative z-10 w-full max-w-[1000px] mx-auto px-6">
                    <GithubStats userId={data.id} variant="aura" themeColor={highlightColor} />
                </section>
            )}

            {/* ================= INTERACTIVE AWARDS LIST ================= */}
            {awardItems.length > 0 && (
                <section id="awards" className="relative z-10 w-full max-w-[1000px] mx-auto px-6 py-24 @md:py-32">
                    <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="text-center mb-16">
                        <h2 className="font-serif text-4xl @md:text-5xl font-bold">
                            <EditableText value={theme?.customTexts?.awards_title || 'Recognitions'} field="awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                        </h2>
                        <p className="font-sans text-white/50 mt-4 text-sm">
                            <EditableText value={theme?.customTexts?.awards_subtitle || 'Validations of quality and expertise.'} field="awards_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={45} />
                        </p>
                    </motion.div>

                    <div className="flex flex-col gap-4">
                        {awardItems.map((award: any, i: number) => (
                            <motion.a
                                href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                // List Item Interaktif
                                className={`group flex flex-col @md:flex-row items-start @md:items-center justify-between p-6 @md:p-8 bg-white/5 border border-white/10 hover:border-[var(--hl)]/50 backdrop-blur-md hover:bg-white/10 transition-all duration-500 ${cardRadiusClass} relative overflow-hidden`}
                            >
                                {/* Efek Cahaya dari Kiri saat Hover */}
                                <div className="absolute top-0 left-0 w-2 h-full bg-[var(--hl)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="flex items-center gap-6 mb-4 @md:mb-0">
                                    <span className="font-serif text-white/30 text-xl font-bold">{award.year || new Date(award.createdAt).getFullYear()}</span>
                                    <div>
                                        <h3 className="font-sans font-bold text-lg @md:text-xl text-white group-hover:text-[var(--hl)] transition-colors">{award.title}</h3>
                                        <span className="font-sans text-sm text-white/50">{award.issuer}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full @md:w-auto justify-between @md:justify-end">
                                    <span className="font-sans text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-white/5 rounded-full text-white/50 group-hover:text-white transition-colors">{award.status || 'Verified'}</span>
                                    {/* Panah berputar mantul */}
                                    <motion.i whileHover={{ x: 5, color: highlightColor }} className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-500 text-white/30 group-hover:text-white"></motion.i>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </section>
            )}

            {/* ================= TESTIMONIALS AURA ================= */}
            {testimonials.length > 0 && (
                <section id="testimonials" className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-24 @md:py-32">
                    <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="text-center mb-16">
                        <h2 className="font-serif text-4xl @md:text-5xl font-bold">
                            <EditableText value={theme?.customTexts?.testimonials_title || 'Client Feedback'} field="testimonials_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                        </h2>
                        <p className="font-sans text-white/50 mt-4 text-sm">
                            <EditableText value={theme?.customTexts?.testimonials_subtitle || 'Voices of collaboration and impact.'} field="testimonials_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={45} />
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-6 @md:gap-8">
                        {testimonials.map((t: any, i: number) => (
                            <motion.div
                                key={t.id}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className={`group relative p-8 transition-all duration-500 ${cardRadiusClass} ${cardStyleClassDark} overflow-hidden flex flex-col justify-between`}
                            >
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--hl)] opacity-0 group-hover:opacity-10 blur-[50px] transition-opacity duration-500 rounded-full"></div>

                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        {t.avatarUrl ? (
                                            <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-12 h-12 rounded-full object-cover border border-white/20" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg border border-white/20 text-[var(--hl)]">
                                                {t.clientName.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-sans font-bold text-white group-hover:text-[var(--hl)] transition-colors">{t.clientName}</h4>
                                            {t.company && <p className="font-sans text-[10px] uppercase tracking-widest text-white/40">{t.company}</p>}
                                        </div>
                                    </div>
                                    <p className="font-sans text-sm @md:text-base leading-relaxed text-white/70 mb-8 italic relative z-10">
                                        "{t.content}"
                                    </p>
                                </div>

                                <div className="flex gap-1 relative z-10 mt-auto">
                                    {[...Array(5)].map((_, idx) => (
                                        <i key={idx} className={`text-xs ${idx < t.rating ? 'fas fa-star text-[var(--hl)]' : 'far fa-star text-white/20'}`}></i>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* ================= MARQUEE TEXT ================= */}
            <div className="relative z-10 w-full overflow-hidden border-y border-white/5 py-6 bg-[var(--hl)]/10 mt-20 backdrop-blur-md">
                <div className="flex whitespace-nowrap animate-marquee w-max">
                    {/* Diulang beberapa kali agar tidak putus */}
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="font-serif text-2xl @md:text-4xl italic text-white/50 px-8 flex items-center gap-8">
                            <EditableText value={theme?.customTexts?.aura_marquee || "Let's build something extraordinary."} field="aura_marquee" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                            <span className="w-3 h-3 rounded-full bg-[var(--hl)]"></span>
                        </span>
                    ))}
                </div>
            </div>

            {/* ================= MAGNETIC FOOTER CTA ================= */}
            <footer className="relative z-10 w-full px-6 py-32 border-t border-white/5 bg-black/20 overflow-hidden">
                {/* Efek Glow di Footer */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60cqi] h-[30cqi] bg-[var(--hl)] opacity-20 blur-[150px] rounded-t-full pointer-events-none"></div>

                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                    <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--hl)] mb-6">
                        <EditableText value={theme?.customTexts?.aura_footer_top || 'Got an Idea?'} field="aura_footer_top" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </span>

                    <h2 className="font-serif text-5xl @md:text-7xl font-bold mb-10 leading-tight">
                        <EditableText value={theme?.customTexts?.aura_footer_title1 || "Let's build something"} field="aura_footer_title1" entity="appearance" isEditor={isEditor} as="span" maxLength={40} /> <EditableText value={theme?.customTexts?.aura_footer_title2 || 'extraordinary.'} field="aura_footer_title2" entity="appearance" isEditor={isEditor} as="span" className="italic text-white/50" maxLength={30} />
                    </h2>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyEmail}
                        className={`group relative overflow-hidden px-8 py-4 bg-white text-black font-sans text-sm font-bold uppercase tracking-widest ${radiusClass} shadow-[0_0_30px_rgba(255,255,255,0.2)]`}
                    >
                        {/* Efek Hover Background Isi Button */}
                        <div className="absolute inset-0 bg-[var(--hl)] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
                        <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors">
                            {isCopied ? 'Email Copied!' : <EditableText value={theme?.customTexts?.aura_copy_email || 'Copy Email Address'} field="aura_copy_email" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />}
                            <i className={isCopied ? 'fas fa-check' : 'far fa-envelope'}></i>
                        </span>
                    </motion.button>
                </motion.div>

                <div className="relative z-10 max-w-[1400px] mx-auto mt-32 flex flex-col @md:flex-row justify-between items-center gap-6 font-sans text-xs font-semibold text-white/40">
                    <p>© {new Date().getFullYear()} <EditableText value={fullName} field="fullName" entity="profile" isEditor={isEditor} as="span" maxLength={30} />. <EditableText value={theme?.customTexts?.footer_rights || 'All rights reserved.'} field="footer_rights" entity="appearance" isEditor={isEditor} as="span" maxLength={40} /></p>
                    <div className="flex gap-6">
                        {links.map((l: any, i: number) => (
                            <motion.a whileHover={{ y: -2, color: '#fff' }} key={i} href={l.url} target="_blank" rel="noreferrer" className="uppercase tracking-widest transition-colors">
                                {l.platform}
                            </motion.a>
                        ))}
                    </div>
                </div>
            </footer>

            {/* ================= KINETIC MEDIA MODAL ================= */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10"
                    >
                        <motion.div
                            initial={{ backdropFilter: "blur(0px)" }} animate={{ backdropFilter: "blur(20px)" }}
                            className="absolute inset-0 bg-black/80" onClick={() => setSelectedMedia(null)}
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotateX: 20 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }} exit={{ scale: 0.8, opacity: 0, rotateX: 20 }}
                            transition={{ type: "spring", stiffness: 150, damping: 20 }}
                            className={`relative w-full max-w-5xl flex flex-col overflow-hidden ${cardRadiusClass} ${cardStyleClassDark}`}
                        >
                            <div className="flex justify-between items-center p-6 @md:p-8 border-b border-white/5 relative z-10">
                                <div className="flex flex-col text-left">
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-1">
                                        <EditableText value={theme?.customTexts?.aura_modal_player || 'Aura Kinetic Player'} field="aura_modal_player" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                    </span>
                                    <h3 className="font-serif text-2xl @md:text-3xl font-bold text-white">{selectedMedia.title}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedMedia(null)}
                                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group"
                                >
                                    <i className="fas fa-times text-white group-hover:rotate-90 transition-transform duration-300"></i>
                                </button>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[60vh]'} bg-black/50 flex items-center justify-center p-4`}
                            >
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[55vh] object-contain rounded-lg shadow-2xl" />
                                    </div>
                                )}
                            </motion.div>

                            <div className="p-4 flex justify-center bg-white/[0.02]">
                                <button
                                    onClick={() => setSelectedMedia(null)}
                                    className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 hover:text-[var(--hl)] transition-colors"
                                >
                                    <EditableText value={theme?.customTexts?.aura_close_btn || 'CLOSE KINETIC'} field="aura_close_btn" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}