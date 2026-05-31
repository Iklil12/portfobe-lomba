//components/themes/SpatialTheme.tsx
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
import { EditableText } from '@/components/ui/EditableText';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export default function AuraTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [isCopied, setIsCopied] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    // --- ANIMASI STABILISASI ---
    // Kita gunakan animate="visible" untuk editor agar langsung tampil tanpa pemicu scroll (yang sering rusak di preview)
    // Tapi tetap gunakan whileInView untuk live site agar ada efek scroll reveal.
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const [currentTime, setCurrentTime] = useState("");

    // Update Jam Real-Time — skip di card preview untuk hindari re-render tiap detik
    useEffect(() => {
        if (isCardPreview || isEditor) return;
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
    const profession = data?.profile?.profession || data?.profession || "Software Engineer & UI/UX Enthusiast";
    const bio = data?.profile?.bio || data?.bio || "Crafting digital experiences with precision, blending aesthetic design with robust engineering.";
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

    const githubLink = links.find((l: any) => l.platform.toLowerCase().includes('github'));
    const linkedinLink = links.find((l: any) => l.platform.toLowerCase().includes('linkedin'));

    // Theme Setup
    const rawHighlightColor = theme?.themeColor || '#6366f1'; // Default elegant blue
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#6366f1';

    // Font Sync
    const fontHeading = theme?.fontHeading || 'Inter';
    const fontBody = theme?.fontBody || 'Inter';
    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        return "'Inter', sans-serif";
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    // Button Shape Sync
    const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';
    const xlCardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[48px]' : 'rounded-[32px]';
    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0f1115] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[8px_8px_0_0_#ffffff]' : 'glass-panel border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]';

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const firstName = fullName.split(' ')[0];

    // Animasi Elegan — di card preview langsung visible (skip animasi agar tidak flicker)
    const auraAnim = isCardPreview
        ? { hidden: { opacity: 1, y: 0, filter: "blur(0px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }
        : { hidden: { opacity: 0, y: 40, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
    const staggerContainer = isCardPreview
        ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
        : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    // Gunakan animate langsung di preview (bukan whileInView) agar tidak re-trigger
    const viewAnim = isCardPreview
        ? { initial: "visible" as const, animate: "visible" as const }
        : { initial: "hidden" as const, whileInView: "visible" as const, viewport: { once: true, amount: 0.1 } };

    return (
        <main className={`min-h-screen bg-[#020202] text-slate-200 font-sans selection:bg-[var(--hl)] selection:text-white relative overflow-hidden pb-20 spatial-theme`} style={{ '--hl': highlightColor } as React.CSSProperties}>

            <style dangerouslySetInnerHTML={{
                __html: `
        .spatial-theme *:not(i):not(.fa):not(.fas):not(.far):not(.fab) { font-family: ${customBodyFont} !important; }
        .spatial-theme h1, .spatial-theme h2, .spatial-theme h3, .spatial-theme h1 *:not(i):not(.fa), .spatial-theme h2 *:not(i):not(.fa), .spatial-theme h3 *:not(i):not(.fa) { font-family: ${customHeadingFont} !important; }
        /* Glassmorphism Mewah */
        .glass-panel {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        
        .glass-panel:hover {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-nav {
          background: rgba(10, 10, 10, 0.5);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Animasi Latar Belakang Aura */
        @keyframes aura-float {
            0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            33% { transform: translate(30px, -50px) scale(1.1); opacity: 0.5; }
            66% { transform: translate(-20px, 20px) scale(0.9); opacity: 0.4; }
            100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        }
        .aura-1 { animation: aura-float 15s ease-in-out infinite; }
        .aura-2 { animation: aura-float 20s ease-in-out infinite reverse; }

        /* Kustomisasi Teks Gradien */
        .text-gradient {
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-image: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.5) 100%);
        }
      `}} />

            {/* DYNAMIC AURA BACKGROUND */}
            <div className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} inset-0 pointer-events-none z-0 overflow-hidden bg-[#020202] @container`}>
                {/* Gunakan % bukan vw agar tidak glitch di card preview scale */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] mix-blend-screen aura-1" style={{ background: `radial-gradient(circle, ${highlightColor}40 0%, transparent 70%)` }}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] mix-blend-screen aura-2" style={{ background: `radial-gradient(circle, ${highlightColor}30 0%, transparent 70%)` }}></div>
                {/* Noise Overlay for texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
            </div>

            {/* FLOATING NAVBAR */}
            <motion.nav
                initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
                className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} top-0 left-0 w-full z-50 glass-nav flex justify-center py-4 px-6`}
            >
                <div className="w-full max-w-6xl flex justify-between items-center">
                    <span className="font-semibold tracking-tight text-white">
                        <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} /> <EditableText value={theme?.customTexts?.spatial_nav_portfolio || 'Portfolio'} field="spatial_nav_portfolio" entity="appearance" isEditor={isEditor} as="span" className="opacity-40" maxLength={15} />
                    </span>
                    <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
                        <a href="#projects" className="hover:text-white transition-colors">Projects</a>
                        <a href="#awards" className="hover:text-white transition-colors hidden @md:block">Awards</a>
                        <a href={`mailto:${userEmail}`} className="text-white hover:opacity-80 transition-opacity">Contact</a>
                    </div>
                </div>
            </motion.nav>

            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col pt-32 @md:pt-40">

                {/* HERO SECTION (Centered, Elegant) */}
                <motion.div
                    {...viewAnim} variants={staggerContainer}
                    className={`flex flex-col items-center text-center px-8`}
                >
                    {/* Status Pill */}
                    <motion.div variants={auraAnim} className={`inline-flex items-center gap-3 px-4 py-2 ${radiusClass} glass-panel mb-8`}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--hl)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--hl)]"></span>
                        </span>
                        <span className="text-xs font-medium text-slate-300">
                            <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                        </span>
                    </motion.div>

                    {/* Massive Elegant Typography */}
                    <motion.h1 variants={auraAnim} className={`font-semibold tracking-[-0.04em] text-gradient leading-[1.1] max-w-4xl mx-auto text-7xl @md:text-[6rem]`}>
                        <EditableText value={theme?.customTexts?.spatial_hero_title1 || 'Building digital experiences that'} field="spatial_hero_title1" entity="appearance" isEditor={isEditor} as="span" maxLength={60} /> <EditableText value={theme?.customTexts?.spatial_hero_title2 || 'inspire.'} field="spatial_hero_title2" entity="appearance" isEditor={isEditor} as="span" className="italic font-light text-white" maxLength={20} />
                    </motion.h1>

                    <motion.p variants={auraAnim} className={`text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto mt-8 text-xl`}>
                        <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />
                    </motion.p>

                    {/* Action Row & Avatar */}
                    <motion.div variants={auraAnim} className={`flex items-center justify-center gap-4 mt-12 w-full flex-row`}>

                        {/* Avatar Capsule */}
                        <div className={`glass-panel p-1.5 pr-6 ${radiusClass} flex items-center gap-4 hover:scale-105 transition-transform duration-500`}>
                            <div className="w-12 h-12 rounded-full overflow-hidden relative">
                                <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-semibold text-white">
                                    <EditableText value={fullName} field="fullName" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                                </span>
                                <span className="text-[11px] text-slate-400">
                                    <EditableText value={location} field="location" entity="profile" isEditor={isEditor} as="span" maxLength={20} /> {currentTime ? `• ${currentTime}` : ''}
                                </span>
                            </div>
                        </div>

                        {/* Copy Email Button */}
                        <div onClick={handleCopyEmail} className={`glass-panel p-4 px-6 ${radiusClass} flex items-center gap-3 cursor-pointer group hover:scale-105 transition-transform duration-500 relative overflow-hidden`}>
                            {isCopied && <motion.div initial={{ opacity: 1, scale: 0 }} animate={{ opacity: 0, scale: 2 }} className="absolute inset-0 bg-[var(--hl)] opacity-20"></motion.div>}
                            <span className={`text-sm font-medium transition-colors ${isCopied ? 'text-[var(--hl)]' : 'text-slate-300 group-hover:text-white'}`}>
                                {isCopied ? 'Email Copied!' : <EditableText value={theme?.customTexts?.spatial_copy_email || 'Copy Email'} field="spatial_copy_email" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />}
                            </span>
                            <i className={`text-sm ${isCopied ? 'fas fa-check text-[var(--hl)]' : 'far fa-copy text-slate-500 group-hover:text-white transition-colors'}`}></i>
                        </div>

                    </motion.div>
                </motion.div>

                {/* DIVIDER */}
                <motion.div
                    initial={isCardPreview ? { scaleX: 1 } : { scaleX: 0 }}
                    whileInView={isCardPreview ? undefined : { scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-24 @md:my-32"
                ></motion.div>

                {/* PROJECTS SECTION (Asymmetrical Layout) */}
                <div id="projects" className={`flex flex-col w-full px-8 gap-12`}>
                    <motion.div {...viewAnim} variants={auraAnim} className="flex justify-between items-end mb-4">
                        <h2 className={`font-medium tracking-tight text-white text-4xl`}>
                            <EditableText value={theme?.customTexts?.stats_projects || 'Selected Works'} field="stats_projects" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                        </h2>
                        <span className="text-slate-500 font-medium">({archiveItems.length})</span>
                    </motion.div>

                    <div className="grid grid-cols-1 @md:grid-cols-12 gap-6 @md:gap-8">
                        {archiveItems.map((p: any, i: number) => {
                            const colSpan = 'col-span-1 ' + (i % 4 === 0 || i % 4 === 3 ? '@md:col-span-7' : '@md:col-span-5');
                            const isVideo = p.projectType === 'video';

                            return (
                                <motion.div
                                    key={i}
                                    {...viewAnim} variants={auraAnim}
                                    className={`group flex flex-col gap-4 cursor-pointer ${colSpan}`}
                                    onClick={() => {
                                        if (isVideo || p.projectType === 'photo') {
                                            setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                        } else if (p.mediaUrl) {
                                            window.open(p.mediaUrl, '_blank');
                                        }
                                    }}
                                >
                                    {/* Image Container with deep shadow and glow on hover */}
                                    <div className={`w-full aspect-[4/3] ${cardRadiusClass} overflow-hidden relative ${cardStyleClass} p-2 transition-all duration-700 group-hover:shadow-[0_0_40px_rgba(var(--hl-rgb),0.15)] group-hover:border-[var(--hl)]/30`}>
                                        <div className="w-full h-full rounded-[16px] overflow-hidden relative bg-[#0a0a0a]">
                                            <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                                            
                                            {/* Hover Overlay adapted for Spatial (Clear for video, Blur for photo) */}
                                            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500
                                                ${isVideo 
                                                    ? 'bg-transparent opacity-100' 
                                                    : 'bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100'
                                                }`}>
                                                <div className={`rounded-full flex items-center justify-center border transition-all duration-500
                                                    ${isVideo
                                                        ? 'w-12 h-12 bg-white/10 backdrop-blur-md border-white/20 scale-100 group-hover:scale-110 group-hover:bg-white/20'
                                                        : 'w-14 h-14 bg-white/10 backdrop-blur-md border-white/20 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100'
                                                    }`}>
                                                    <i className={`fas ${isVideo ? 'fa-play ml-1' : 'fa-arrow-right -rotate-45'} text-white`}></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex flex-col px-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="text-xl font-medium text-white group-hover:text-[var(--hl)] transition-colors">{p.title}</h3>
                                            <span className={`text-[10px] uppercase tracking-widest text-slate-500 border border-slate-800 px-2 py-1 ${radiusClass}`}>{p.projectType}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed">{p.description || 'View detailed case study of this project.'}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Explore More Button */}
                    <motion.div {...viewAnim} variants={auraAnim} className="w-full flex justify-center mt-8">
                        <Link href={`/${subdomain}/gallery`} scroll={false} className={`${cardStyleClass} px-8 py-4 ${radiusClass} flex items-center gap-3 hover:scale-105 hover:bg-white/5 transition-all duration-500 group`}>
                            <span className="font-medium text-white">
                                <EditableText value={theme?.customTexts?.explore_archive || 'Explore Full Archive'} field="explore_archive" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                            </span>
                            <i className="fas fa-arrow-right text-sm text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all"></i>
                        </Link>
                    </motion.div>
                </div>

                {/* 3D SHOWCASE SECTION */}
                {items3D.length > 0 && (
                    <div className={`flex flex-col w-full px-8 gap-12 mt-24 @md:mt-32`}>
                        <motion.div {...viewAnim} variants={auraAnim} className="flex justify-between items-end mb-4">
                            <h2 className={`font-medium tracking-tight text-white text-4xl`}>
                                <EditableText value={theme?.customTexts?.models_title || 'Spatial Assets'} field="models_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                            </h2>
                            <span className="text-slate-500 font-medium">({items3D.length})</span>
                        </motion.div>

                        <div className="flex flex-col gap-12 @md:gap-20">
                            {items3D.map((p: any, i: number) => (
                                <motion.div
                                    key={i}
                                    {...viewAnim} variants={auraAnim}
                                    className="group flex flex-col gap-6"
                                >
                                    <div className={`w-full aspect-[4/3] @md:aspect-video ${xlCardRadiusClass} overflow-hidden relative ${cardStyleClass} p-2 @md:p-3 transition-all duration-700 group-hover:shadow-[0_0_60px_rgba(var(--hl-rgb),0.2)] group-hover:border-[var(--hl)]/30`}>
                                        <div className="w-full h-full rounded-[24px] @md:rounded-[36px] overflow-hidden relative bg-[#0a0a0a]">
                                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0a0a0a" />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center pointer-events-none">
                                                <div className="w-20 h-20 bg-white/10 backdrop-blur-md border-white/20 rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                                    <i className="fas fa-cube text-white text-2xl"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col px-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--hl)] font-bold mb-1 opacity-60">
                                                    <EditableText value={theme?.customTexts?.spatial_model_label || 'Spatial Model'} field="spatial_model_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> 0{i+1}
                                                </span>
                                                <h3 className="text-3xl @md:text-5xl font-medium text-white group-hover:text-[var(--hl)] transition-colors">{p.title}</h3>
                                            </div>
                                            <span className={`text-[10px] uppercase tracking-widest text-slate-500 border border-slate-800 px-4 py-2 ${radiusClass}`}>
                                                <EditableText value={theme?.customTexts?.spatial_asset_label || '3D Asset'} field="spatial_asset_label" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                                            </span>
                                        </div>
                                        {p.description && <p className="text-slate-400 text-sm @md:text-base max-w-2xl mt-2 leading-relaxed">{p.description}</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* INTEGRATIONS SECTION */}
                {data?.id && (
                    <div className="w-full mt-10 px-8">
                        <PenpotShowcase userId={data.id} variant="spatial" />
                        <CanvaShowcase userId={data.id} variant="spatial" />
                    </div>
                )}

                {/* GITHUB STATS SECTION */}
                {data?.id && (
                    <GithubStats userId={data.id} variant="spatial" themeColor={highlightColor} />
                )}

                {/* TESTIMONIALS SECTION */}
                {testimonials.length > 0 && (
                    <div className={`flex flex-col w-full mt-24 @md:mt-32 px-8`}>
                        <motion.div {...viewAnim} variants={auraAnim} className="mb-8">
                            <h2 className={`font-medium tracking-tight text-white text-4xl`}>
                                <EditableText value={theme?.customTexts?.testimonials_title || 'Client Voices'} field="testimonials_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 @md:grid-cols-2 gap-8">
                            {testimonials.map((t: any, i: number) => (
                                <motion.div
                                    key={t.id}
                                    {...viewAnim} variants={auraAnim}
                                    className={`${cardStyleClass} p-8 ${xlCardRadiusClass} flex flex-col gap-6 relative overflow-hidden group hover:border-[var(--hl)]/30 transition-colors`}
                                >
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[var(--hl)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <p className="text-slate-300 italic text-base @md:text-lg leading-relaxed font-light">
                                        "{t.content}"
                                    </p>
                                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
                                            {t.avatarUrl ? (
                                                <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-white/5 flex items-center justify-center font-bold text-white text-lg">
                                                    {t.clientName.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-semibold text-white group-hover:text-[var(--hl)] transition-colors">{t.clientName}</h4>
                                            {t.company && <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{t.company}</p>}
                                        </div>
                                        <div className="ml-auto flex gap-1">
                                            {[...Array(5)].map((_, idx) => (
                                                <i key={idx} className={`text-[10px] ${idx < t.rating ? 'fas fa-star text-[var(--hl)]' : 'far fa-star text-white/20'}`}></i>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* AWARDS SECTION (Sleek List View) */}
                {awardItems.length > 0 && (
                    <div id="awards" className={`flex flex-col w-full mt-24 @md:mt-32 px-8`}>
                        <motion.div {...viewAnim} variants={auraAnim} className="mb-8">
                            <h2 className={`font-medium tracking-tight text-white text-4xl`}>
                                <EditableText value={theme?.customTexts?.awards_title || 'Recognitions'} field="awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                            </h2>
                        </motion.div>

                        <div className="flex flex-col border-t border-white/10">
                            {awardItems.slice(0, 5).map((award: any, i: number) => (
                                <motion.a
                                    href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i}
                                    {...viewAnim} variants={auraAnim}
                                    className={`flex flex-col @md:flex-row @md:items-center justify-between py-6 border-b border-white/5 group cursor-pointer gap-4 @md:gap-0`}
                                >
                                    <div className="flex items-center gap-4 @md:gap-6 w-full @md:w-auto">
                                        <span className="text-xs font-mono text-slate-500 w-10 shrink-0">{award.year || new Date(award.createdAt).getFullYear()}</span>
                                        <div className="flex flex-col">
                                            <h4 className="text-lg @md:text-xl font-medium text-white group-hover:text-[var(--hl)] transition-colors">{award.title}</h4>
                                            <span className="text-xs text-slate-400 mt-1">{award.issuer}</span>
                                        </div>
                                    </div>
                                    <div className={`flex items-center justify-between @md:justify-end w-full @md:w-auto`}>
                                        <p className="text-sm text-slate-500 line-clamp-1 max-w-xs hidden @lg:block">{award.description}</p>
                                        <div className={`w-10 h-10 ${radiusClass} border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all @md:ml-8`}>
                                            <i className="fas fa-arrow-right -rotate-45 text-slate-400 group-hover:text-white transition-colors"></i>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                )}

                {/* FOOTER (Massive CTA) */}
                <motion.footer
                    {...viewAnim} variants={auraAnim}
                    className={`mt-24 @md:mt-40 mb-10 glass-panel ${xlCardRadiusClass} flex flex-col items-center text-center relative overflow-hidden mx-8 p-10 @md:p-20`}
                >
                    {/* Inner Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: highlightColor }}></div>

                    <h2 className={`font-semibold tracking-tight text-white relative z-10 text-4xl @md:text-7xl`}>
                        <EditableText value={theme?.customTexts?.spatial_footer_title1 || "Let's build something"} field="spatial_footer_title1" entity="appearance" isEditor={isEditor} as="span" maxLength={40} /> <br className="hidden @md:block" />
                        <EditableText value={theme?.customTexts?.spatial_footer_title2 || 'extraordinary.'} field="spatial_footer_title2" entity="appearance" isEditor={isEditor} as="span" className="text-slate-400" maxLength={30} />
                    </h2>

                    <a href={`mailto:${userEmail}`} className={`mt-10 px-8 py-4 bg-white text-black ${radiusClass} font-semibold text-lg hover:scale-105 transition-transform duration-300 relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.3)]`}>
                        <EditableText value={theme?.customTexts?.spatial_footer_cta || 'Get in touch'} field="spatial_footer_cta" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </a>

                    <div className="w-full mt-20 pt-8 border-t border-white/10 flex justify-between items-center relative z-10 flex-col @md:flex-row gap-6">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <div className="w-2 h-2 rounded-full bg-[var(--hl)]"></div>
                            <span>© {new Date().getFullYear()} <EditableText value={fullName} field="fullName" entity="profile" isEditor={isEditor} as="span" maxLength={30} />. <EditableText value={theme?.customTexts?.footer_rights || 'All rights reserved.'} field="footer_rights" entity="appearance" isEditor={isEditor} as="span" maxLength={40} /></span>
                        </div>
                        <div className="flex gap-4">
                            {links.map((l: any, i: number) => (
                                <a key={i} href={l.url} target="_blank" rel="noreferrer" className={`w-10 h-10 ${radiusClass} bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors`}>
                                    <i className={`fab fa-${l.platform.toLowerCase()}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.footer>

                {/* --- SPATIAL MEDIA MODAL --- */}
                <AnimatePresence>
                    {selectedMedia && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10"
                        >
                            {/* Backdrop with Aura Glow */}
                            <div className="absolute inset-0 bg-[#020202]/90 backdrop-blur-2xl" onClick={() => setSelectedMedia(null)}>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[180px] opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle, ${highlightColor} 0%, transparent 70%)` }}></div>
                            </div>

                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className={`relative w-full max-w-5xl glass-panel p-4 @md:p-8 ${xlCardRadiusClass} border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col gap-6 overflow-hidden`}
                                style={{ border: `1px solid ${highlightColor}20` } as any}
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[1px] opacity-50" style={{ background: `linear-gradient(90deg, transparent, ${highlightColor}, transparent)` }}></div>
                                <div className="flex justify-between items-center relative z-10 px-2">
                                    <div className="flex flex-col text-left">
                                        <h3 className="text-2xl font-semibold tracking-tight text-white">{selectedMedia.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--hl)]"></div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-left">
                                                {selectedMedia.type === 'video' ? 
                                                    <EditableText value={theme?.customTexts?.spatial_video_label || 'Spatial Video Stream'} field="spatial_video_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> 
                                                    : 
                                                    <EditableText value={theme?.customTexts?.spatial_photo_label || 'Visual Masterpiece'} field="spatial_photo_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedMedia(null)}
                                        className={`w-12 h-12 ${radiusClass} glass-panel flex items-center justify-center hover:bg-white/10 transition-colors group`}
                                    >
                                        <i className="fas fa-times text-slate-400 group-hover:text-white transition-colors"></i>
                                    </button>
                                </div>
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                    className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[60vh]'} ${cardRadiusClass} overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center`}
                                >
                                    {selectedMedia.type === 'video' ? (
                                        <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-2">
                                            <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[55vh] object-contain rounded-lg" />
                                        </div>
                                    )}
                                </motion.div>
                                <div className="flex justify-center relative z-10 pb-2">
                                    <button 
                                        onClick={() => setSelectedMedia(null)}
                                        className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 hover:text-[var(--hl)] transition-colors"
                                    >
                                        <EditableText value={theme?.customTexts?.spatial_close_btn || 'CLOSE ESCAPE'} field="spatial_close_btn" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}