"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, animate } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { GithubStats } from '@/components/themes/widgets/GithubStats';
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { EditableText } from '@/components/ui/EditableText';

export default function ViewfinderTheme({ data, theme, isMobileView, isCardPreview = false, isEditor = false }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);
    
    const profile = data?.profile || data || {};
    const projects = data?.projects || data?.user?.projects || [];
    const items3D = projects.filter((p: any) => p.projectType === '3d');
    const archiveItems = projects.filter((p: any) => p.projectType !== '3d');
    const certificates = data?.certificates || data?.user?.certificates || [];
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
    const links = data?.links || data?.user?.links || [];

    const fullName = profile.fullName || "JAMAL ARIFIN";
    const profession = profile.profession || "Cinematographer & Editor";
    const bio = profile.bio || `"Weaving light, shadow, and sound to capture the human experience. Specializing in high-end commercial and narrative films."`;
    const location = profile.location || "JAKARTA, IDN";
    const email = data?.email || "hello@example.com";

    const totalProjects = archiveItems.length;
    const totalHonors = certificates.length;

    const primaryColor = theme?.themeColor || '#FF0033';

    // Font Sync
    const fontHeading = theme?.fontHeading || 'Bebas Neue';
    const fontBody = theme?.fontBody || 'Space Mono';
    const getFontFamily = (f: string) => {
        if (!f) return "'Space Mono', monospace";
        if (f.toLowerCase().includes('space') || f.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (f.toLowerCase().includes('serif') || f.toLowerCase().includes('elegant') || f.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        if (f.toLowerCase().includes('bebas')) return "'Bebas Neue', sans-serif";
        return "'Inter', sans-serif";
    };
    const customBodyFont = getFontFamily(fontBody);
    const customHeadingFont = getFontFamily(fontHeading);

    const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-sm';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-2xl' : 'rounded-md';
    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#111] shadow-[0_30px_60px_rgba(255,255,255,0.05)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#050505] border border-[#222] hover:border-[#444]';
    const cardStyleClassLight = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-white border-2 border-[#050505] shadow-[6px_6px_0_0_#050505]' : 'bg-white border-2 border-[#050505]';

    const [timecode] = useState("00:04:26:15");
    const [selectedCert, setSelectedCert] = useState<any>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: -500, behavior: 'smooth' });
    };
    const scrollRight = () => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: 500, behavior: 'smooth' });
    };

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0]?.toUpperCase() || "VISUAL";
    const lastName = nameParts.slice(1).join(' ').toUpperCase() || "STORYTELLER";

    const subdomain = profile.subdomain || data?.subdomain || "username";

    // Konfigurasi animasi kustom untuk tampilan profesional
    const cinematicEase = [0.16, 1, 0.3, 1] as any;
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
    };

    return (
        <div
            style={{ '--primary': primaryColor } as React.CSSProperties}
            className="viewfinder-theme antialiased bg-[#050505] text-[#F3F3F1] relative w-full h-full overflow-hidden @container"
        >
            <style dangerouslySetInnerHTML={{
                __html: `
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

            .viewfinder-theme { font-family: ${customBodyFont} !important; }
            .vf-body, .vf-hud-text { font-family: ${customBodyFont} !important; }
            .viewfinder-theme ::selection { background-color: var(--primary); color: #fff; }
            .viewfinder-theme .font-cinema { font-family: ${customHeadingFont} !important; }

            .viewfinder-theme .film-strip::-webkit-scrollbar { display: none; }
            .viewfinder-theme .film-strip { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; }
            .viewfinder-theme .film-frame { scroll-snap-align: center; }

            .viewfinder-theme .viewfinder-tl { border-top: 2px solid #F3F3F1; border-left: 2px solid #F3F3F1; }
            .viewfinder-theme .viewfinder-tr { border-top: 2px solid #F3F3F1; border-right: 2px solid #F3F3F1; }
            .viewfinder-theme .viewfinder-bl { border-bottom: 2px solid #F3F3F1; border-left: 2px solid #F3F3F1; }
            .viewfinder-theme .viewfinder-br { border-bottom: 2px solid #F3F3F1; border-right: 2px solid #F3F3F1; }

            .viewfinder-theme .cine-img { transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1); }
            .viewfinder-theme .cine-img:hover { transform: scale(1.05); }

            .viewfinder-theme .vf-crosshair::before, .viewfinder-theme .vf-crosshair::after {
                content: ''; position: absolute; background: rgba(255,255,255,0.15);
                top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
            }
            .viewfinder-theme .vf-crosshair::before { width: 100%; height: 1px; }
            .viewfinder-theme .vf-crosshair::after { width: 1px; height: 100%; }

            .viewfinder-theme .vf-scroll::-webkit-scrollbar { width: 6px; }
            .viewfinder-theme .vf-scroll::-webkit-scrollbar-track { background: #050505; }
            .viewfinder-theme .vf-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
            .viewfinder-theme .vf-scroll::-webkit-scrollbar-thumb:hover { background: var(--primary); }

            .viewfinder-theme .vf-scanline {
                width: 100%; height: 100px; z-index: 10; pointer-events: none;
                background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.03), transparent);
                position: absolute; left: 0; top: -100px;
                animation: scanline 8s linear infinite;
            }
            @keyframes scanline {
                0% { top: -100px; }
                100% { top: 100%; }
            }

            .viewfinder-theme .hero-reveal { clip-path: inset(100% 0 0 0); animation: revealUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            @keyframes revealUp { to { clip-path: inset(0 0 0 0); } }

            /* --- Refined Sizing to match reference --- */
            .viewfinder-theme .vf-hud-text { font-size: 10px; }
            .viewfinder-theme .vf-hero-title { font-size: clamp(48px, 18cqw, 72px); line-height: 1; }
            .viewfinder-theme .vf-hero-sub { font-size: 12px; }
            .viewfinder-theme .vf-section-title { font-size: 36px; }
            .viewfinder-theme .vf-reel-card { width: 60cqw; }
            .viewfinder-theme .vf-reel-title { font-size: 24px; }
            .viewfinder-theme .vf-log-stat-label { font-size: 9px; }
            .viewfinder-theme .vf-log-stat-value { font-size: 48px; }
            .viewfinder-theme .vf-footer-title { font-size: 32px; }
            .viewfinder-theme .vf-hud-padding { padding: 1rem; }
            .viewfinder-theme .vf-hud-brackets { inset: 1.5rem; }
            .viewfinder-theme .vf-cert-title { font-size: 18px; }
            .viewfinder-theme .vf-cert-arrow { font-size: 14px; }

            /* Container-based responsive logic */
            .viewfinder-theme .vf-hero-container { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%; max-width: 56rem; margin: 0 auto; }
            .viewfinder-theme .vf-social-row { display: flex; justify-content: center; gap: 1.25rem; margin-top: 1.5rem; font-size: 1.125rem; color: #6b7280; }
            
            .viewfinder-theme .vf-reel-header { display: flex; flex-direction: column; gap: 1.5rem; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; padding: 0 1rem; }
            .viewfinder-theme .vf-button-group { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; align-items: flex-start; }
            .viewfinder-theme .vf-nav-btns { display: flex; gap: 0.5rem; width: 100%; }
            .viewfinder-theme .vf-nav-btn { flex: 1; text-align: center; }

            @container (min-width: 600px) {
                .viewfinder-theme .vf-hud-text { font-size: 14px; }
                .viewfinder-theme .vf-hero-title { font-size: clamp(80px, 16cqw, 192px); }
                .viewfinder-theme .vf-hero-sub { font-size: 16px; }
                .viewfinder-theme .vf-section-title { font-size: 72px; }
                .viewfinder-theme .vf-reel-card { width: 45cqw; }
                .viewfinder-theme .vf-reel-title { font-size: 50px; }
                .viewfinder-theme .vf-log-stat-label { font-size: 12px; }
                .viewfinder-theme .vf-log-stat-value { font-size: 72px; }
                .viewfinder-theme .vf-footer-title { font-size: 96px; }
                .viewfinder-theme .vf-hud-padding { padding: 3rem; }
                .viewfinder-theme .vf-hud-brackets { inset: 10rem; }
                .viewfinder-theme .vf-cert-title { font-size: 24px; }
                .viewfinder-theme .vf-cert-arrow { font-size: 20px; }
                
                .viewfinder-theme .vf-reel-header { flex-direction: row; align-items: flex-end; }
                .viewfinder-theme .vf-button-group { width: auto; align-items: flex-end; }
                .viewfinder-theme .vf-nav-btns { width: auto; }
                .viewfinder-theme .vf-nav-btn { flex: none; }
            }
            `}} />




            {/* ===== STICKY HUD OVERLAY ===== */}
            <div className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} inset-0 z-50 pointer-events-none vf-hud-padding flex flex-col justify-between @container`} style={{ mixBlendMode: 'difference' }}>
                {/* Top */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5, ease: cinematicEase }}
                    className="flex justify-between items-start vf-hud-text font-bold tracking-widest text-white"
                >
                    <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary)', mixBlendMode: 'normal' }}></span>
                            <EditableText value={theme?.customTexts?.vf_hud_rec || 'REC'} field="vf_hud_rec" entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                        </span>
                        <span><EditableText value={theme?.customTexts?.vf_hud_tc || 'TC'} field="vf_hud_tc" entity="appearance" isEditor={isEditor} as="span" maxLength={5} /> {timecode}</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                        <span className={`border border-current px-1.5 py-0.5 ${radiusClass} text-[9px]`}>100% 🔋</span>
                        <span><EditableText value={theme?.customTexts?.vf_hud_iso || 'ISO 800 | 24FPS'} field="vf_hud_iso" entity="appearance" isEditor={isEditor} as="span" maxLength={25} /></span>
                    </div>
                </motion.div>

                {/* Viewfinder brackets */}
                <motion.div
                    initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 0.2 }} transition={{ duration: 2, ease: cinematicEase }}
                    className="absolute vf-hud-brackets flex items-center justify-center pointer-events-none"
                >
                    <div className="w-full h-full relative">
                        <div className="absolute top-0 left-0 w-8 h-8 viewfinder-tl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 viewfinder-tr"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 viewfinder-bl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 viewfinder-br"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-6 h-px bg-white"></div>
                            <div className="w-px h-6 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5, ease: cinematicEase }}
                    className="flex justify-between items-end vf-hud-text font-bold tracking-widest text-white"
                >
                    <div className="leading-snug">
                        <span><EditableText value={theme?.customTexts?.vf_dir || 'DIR.'} field="vf_dir" entity="appearance" isEditor={isEditor} as="span" maxLength={10} /> <EditableText value={fullName.toUpperCase()} field="fullName" entity="profile" isEditor={isEditor} as="span" maxLength={30} /></span>
                        <br /><EditableText value={location.toUpperCase()} field="location" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                    </div>
                    <div className="text-right pointer-events-auto flex flex-col gap-0.5" style={{ mixBlendMode: 'normal' }}>
                        <a href="#reel" className="hover:opacity-70 transition">/ <EditableText value={theme?.customTexts?.vf_nav_reel || 'REEL'} field="vf_nav_reel" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></a>
                        <a href="#log" className="hover:opacity-70 transition">/ <EditableText value={theme?.customTexts?.vf_nav_log || 'LOG'} field="vf_nav_log" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></a>
                        <a href={`mailto:${email}`} className="hover:opacity-70 transition">/ <EditableText value={theme?.customTexts?.vf_nav_contact || 'CONTACT'} field="vf_nav_contact" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></a>
                    </div>
                </motion.div>
            </div>

            {/* MAIN SCROLLABLE AREA */}
            <div className="w-full h-full overflow-y-auto overflow-x-hidden vf-scroll">

                {/* ===== HERO SECTION ===== */}
                <section className="relative bg-[#050505] vf-crosshair overflow-hidden" style={{ minHeight: '100svh' }}>
                    <div className="vf-scanline"></div>

                    {/* Hero Content */}
                    <div className="relative z-10 flex items-center justify-center px-6 py-24 mix-blend-difference" style={{ minHeight: '100svh' }}>
                        <motion.div
                            // PERUBAHAN: Gunakan whileInView dan once: false agar berulang saat di-scroll naik/turun
                            initial="hidden"
                            {...{ [animationTrigger]: "visible" }}
                            viewport={{ once: true, amount: 0 }}
                            variants={{
                                hidden: { opacity: 0, scale: 0.95 },
                                visible: {
                                    opacity: 1,
                                    scale: 1,
                                    transition: { duration: 1.2, ease: cinematicEase, staggerChildren: 0.2 }
                                }
                            }}
                            className="vf-hero-container"
                        >
                            <motion.p
                                variants={{
                                    hidden: { opacity: 0, letterSpacing: '1em' },
                                    visible: { opacity: 1, letterSpacing: '0.4em', transition: { duration: 1.5, ease: cinematicEase } }
                                }}
                                className="text-gray-400 mb-3 uppercase vf-hero-sub"
                            >
                                <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={40} />
                            </motion.p>

                            <motion.h1
                                // PERUBAHAN: Mengganti class CSS dengan animasi clipPath murni dari Framer agar bisa di-reset
                                variants={{
                                    hidden: { opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' },
                                    visible: { opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)', transition: { duration: 1.2, ease: cinematicEase } }
                                }}
                                className="font-cinema leading-none tracking-wider text-[#F3F3F1] vf-hero-title"
                            >
                                <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={20} /><br /><EditableText value={lastName} field="lastName" entity="profile" isEditor={isEditor} as="span" maxLength={20} />
                            </motion.h1>

                            <motion.p
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
                                }}
                                className="text-gray-400 max-w-md mx-auto leading-relaxed mt-5 vf-hero-sub vf-body"
                            >
                                "<EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />"
                            </motion.p>

                            <motion.div
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                                }}
                                className="vf-social-row"
                            >
                                {links.map((link: any, idx: number) => (
                                    <motion.a
                                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                        whileHover={{ scale: 1.3, color: "#F3F3F1" }}
                                        whileTap={{ scale: 0.9 }}
                                        key={idx} href={link.url} target="_blank" rel="noreferrer"
                                        className="transition-colors duration-300"
                                    >
                                        <i className={`fab fa-${link.platform.toLowerCase()}`}></i>
                                    </motion.a>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* ===== REEL SECTION ===== */}
                <section id="reel" className="relative z-20 py-20 bg-[#050505] border-y border-white/10 overflow-hidden">
                    <motion.div
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
                        variants={fadeUpVariants}
                        className="vf-reel-header pointer-events-auto"
                    >
                        <h2 className="font-cinema tracking-wide text-[#F3F3F1] vf-section-title"><EditableText value={theme?.customTexts?.vf_reel_title || 'THE REEL'} field="vf_reel_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> <span style={{ color: 'var(--primary)' }}>.</span></h2>
                        <div className="vf-button-group">
                            <div className="vf-nav-btns">
                                <motion.button
                                    whileHover={{ x: -8, backgroundColor: "#F3F3F1", color: "#050505" }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={scrollLeft}
                                    className="vf-nav-btn text-[10px] @sm:text-sm border border-white/20 px-4 @sm:px-6 py-2 transition-colors uppercase tracking-[0.1em] @sm:tracking-[0.2em] font-bold bg-transparent text-white"
                                >
                                    <i className="fas fa-chevron-left mr-2"></i> <EditableText value={theme?.customTexts?.vf_btn_prev || 'PREV'} field="vf_btn_prev" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ x: 8, backgroundColor: "#F3F3F1", color: "#050505" }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={scrollRight}
                                    className="vf-nav-btn text-[10px] @sm:text-sm border border-white/20 px-4 @sm:px-6 py-2 transition-colors uppercase tracking-[0.1em] @sm:tracking-[0.2em] font-bold bg-transparent text-white"
                                >
                                    <EditableText value={theme?.customTexts?.vf_btn_next || 'NEXT'} field="vf_btn_next" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /> <i className="fas fa-chevron-right ml-2"></i>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    <div ref={scrollRef} className="film-strip flex gap-4 overflow-x-auto px-4 pb-8 pt-2 pointer-events-auto">
                        {archiveItems.length > 0 ? archiveItems.map((p: any, idx: number) => {
                            const isVideo = p.projectType === 'video';
                            return (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    viewport={{ once: true, amount: 0 }}
                                    transition={{ duration: 0.8, delay: (idx % 3) * 0.1, ease: cinematicEase }}
                                    whileHover={{ y: -5 }}
                                    key={p.id || idx}
                                    onClick={() => {
                                        if (isVideo || p.projectType === 'photo') {
                                            setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                        } else if (p.mediaUrl) {
                                            window.open(p.mediaUrl, '_blank');
                                        }
                                    }}
                                    className="film-frame flex-none block vf-reel-card group cursor-pointer"
                                >
                                    <div className={`w-full aspect-video overflow-hidden ${cardStyleClassDark} ${cardRadiusClass} relative`}>
                                        <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover opacity-80 cine-img group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" />
                                        
                                        {/* Cinematic Play Overlay */}
                                        {isVideo && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className={`w-14 h-14 ${radiusClass} border border-white/40 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500`}>
                                                    <i className="fas fa-play text-white text-xs ml-1"></i>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 overflow-hidden text-left">
                                        <h3 className="font-cinema tracking-wide text-[#F3F3F1] vf-reel-title group-hover:text-[var(--primary)] transition-colors duration-500">
                                            {p.title}
                                        </h3>
                                        <p className="uppercase tracking-widest mt-1 vf-hud-text opacity-60" style={{ color: 'var(--primary)' }}>{p.projectType}</p>
                                    </div>
                                </motion.div>
                            );
                        }) : (
                            <div className="film-frame flex-none vf-reel-card group">
                                <div className={`w-full aspect-[21/9] overflow-hidden ${cardStyleClassDark} ${cardRadiusClass}`}>
                                    <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" />
                                </div>
                                <div className="mt-3 text-left">
                                    <h3 className="font-cinema tracking-wide text-[#F3F3F1] vf-reel-title">NIKE - THE RUN</h3>
                                    <p className="uppercase tracking-widest mt-0.5 vf-hud-text" style={{ color: 'var(--primary)' }}>Commercial</p>
                                </div>
                            </div>
                        )}
                        <div className="flex-none w-4"></div>
                    </div>

                    <motion.div
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
                        variants={fadeUpVariants}
                        className="mt-12 flex justify-center"
                    >
                        <Link href={`/${subdomain}/gallery`} scroll={false}>
                            <motion.div
                                whileHover="hover"
                                initial="initial"
                                className="group flex items-center gap-3 px-8 py-3 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-black transition-all duration-300 cursor-pointer uppercase font-black tracking-[0.3em] text-[10px] @sm:text-xs"
                            >
                                <span><EditableText value={theme?.customTexts?.vf_btn_explore || 'EXPLORE ALL'} field="vf_btn_explore" entity="appearance" isEditor={isEditor} as="span" maxLength={25} /></span>
                                <motion.i
                                    variants={{
                                        initial: { x: 0, y: 0 },
                                        hover: { x: 5, y: -5 }
                                    }}
                                    className="fas fa-arrow-right -rotate-45"
                                ></motion.i>
                            </motion.div>
                        </Link>
                    </motion.div>
                </section>

                {/* ===== 3D MODELS SECTION ===== */}
                {items3D.length > 0 && (
                    <section className="relative z-20 py-20 bg-[#050505] border-y border-white/10 overflow-hidden">
                        <motion.div
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
                            variants={fadeUpVariants}
                            className="vf-reel-header pointer-events-auto"
                        >
                            <h2 className="font-cinema tracking-wide text-[#F3F3F1] vf-section-title"><EditableText value={theme?.customTexts?.vf_3d_title || '3D MODELS'} field="vf_3d_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> <span style={{ color: 'var(--primary)' }}>.</span></h2>
                        </motion.div>
                        <div className="flex flex-col gap-16 @md:gap-32 px-6 @md:px-12 pb-20">
                            {items3D.map((p: any, idx: number) => {
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                                        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                        viewport={{ once: true, amount: 0 }}
                                        transition={{ duration: 1.2, delay: (idx % 3) * 0.1, ease: cinematicEase }}
                                        key={idx}
                                        className="relative block w-full group"
                                    >
                                        <div className={`w-full aspect-video overflow-hidden ${cardStyleClassDark} ${cardRadiusClass} relative shadow-[0_0_100px_rgba(0,0,0,0.5)]`}>
                                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#050505" />
                                            {/* HUD Overlay for Cinematic Feel */}
                                            <div className="absolute top-8 left-8 flex flex-col gap-2 pointer-events-none z-20">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                                                    <span className="font-cinema text-[10px] tracking-[0.4em] text-white opacity-40 uppercase"><EditableText value={theme?.customTexts?.vf_3d_rendering || 'Rendering Asset_'} field="vf_3d_rendering" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />{idx+1}</span>
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/10 transition-colors duration-700 pointer-events-none"></div>
                                        </div>
                                        <div className="mt-8 flex flex-col @md:flex-row justify-between items-start @md:items-end gap-6">
                                            <div className="flex flex-col gap-2">
                                                <h3 className="font-cinema tracking-wide text-[#F3F3F1] text-4xl @md:text-8xl group-hover:text-[var(--primary)] transition-colors duration-500 leading-none">
                                                    {p.title}
                                                </h3>
                                                {p.description && <p className="vf-hud-text text-sm @md:text-base opacity-40 max-w-xl mt-4 leading-relaxed uppercase tracking-widest">{p.description}</p>}
                                            </div>
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                <p className="uppercase tracking-[0.5em] vf-hud-text text-[10px] opacity-60" style={{ color: 'var(--primary)' }}><EditableText value={theme?.customTexts?.vf_3d_metadata || 'Cine_Asset_Metadata'} field="vf_3d_metadata" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /></p>
                                                <div className="h-px w-24 bg-[var(--primary)] opacity-20 mt-1"></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ===== PRODUCTION LOG ===== */}
                <section id="log" className="relative z-20 py-24 px-6 bg-[#F3F3F1] text-[#050505]">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
                            variants={fadeUpVariants}
                            className="border-b-2 border-[#050505] pb-3 mb-6 flex justify-between items-end"
                        >
                            <h2 className="font-cinema tracking-wide vf-section-title"><EditableText value={theme?.customTexts?.vf_log_title || 'PRODUCTION LOG'} field="vf_log_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /></h2>
                            <span className="font-bold uppercase tracking-widest vf-hud-text"><EditableText value={theme?.customTexts?.vf_log_file || 'FILE_NO: 0042'} field="vf_log_file" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /></span>
                        </motion.div>

                        <motion.div
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                            className="grid grid-cols-2 gap-4 mb-10"
                        >
                            {[
                                { label: theme?.customTexts?.vf_stat_1 || "ACTIVE YEARS", val: "08+", field: 'vf_stat_1' },
                                { label: theme?.customTexts?.vf_stat_2 || "PROJECTS WRAPPED", val: totalProjects, field: 'vf_stat_2' },
                                { label: theme?.customTexts?.vf_stat_3 || "HONORS", val: totalHonors, field: 'vf_stat_3' },
                                { label: theme?.customTexts?.vf_stat_4 || "BASE OF OPS", val: location.split(',')[0].substring(0, 3).toUpperCase(), field: 'vf_stat_4' }
                            ].map((stat, idx) => (
                                <motion.div key={idx} variants={fadeUpVariants}>
                                    <p className="font-bold uppercase tracking-widest mb-1 text-gray-500 vf-log-stat-label">
                                        <EditableText value={stat.label} field={stat.field} entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                    </p>
                                    <p className="font-cinema vf-log-stat-value">{stat.val}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <div className="mb-10">
                            <PenpotShowcase userId={data.id} variant="viewfinder" />
                            <CanvaShowcase userId={data.id} variant="viewfinder" />
                        </div>

                        {data?.id && (
                            <div className="mb-10">
                                <GithubStats userId={data.id} variant="viewfinder" themeColor={primaryColor} />
                            </div>
                        )}

                        {/* ENDORSEMENTS */}
                        {testimonials.length > 0 && (
                            <div className="mb-12">
                                <motion.h3
                                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
                                    className="text-[10px] font-bold uppercase tracking-widest mb-4 bg-[#050505] text-[#F3F3F1] inline-block px-3 py-1"
                                >
                                    <EditableText value={theme?.customTexts?.vf_reviews_title || 'CLIENT REVIEWS'} field="vf_reviews_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                </motion.h3>
                                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                                    {testimonials.map((t: any, i: number) => (
                                        <motion.div
                                            key={t.id}
                                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
                                            className={`p-6 flex flex-col relative ${cardStyleClassLight} ${cardRadiusClass}`}
                                        >
                                            <div className="absolute top-2 right-2 flex gap-0.5">
                                                {[...Array(5)].map((_, idx) => (
                                                    <i key={idx} className={`text-[8px] ${idx < t.rating ? 'fas fa-star text-[var(--primary)]' : 'far fa-star text-gray-300'}`}></i>
                                                ))}
                                            </div>
                                            <p className="vf-body text-xs @md:text-sm text-gray-600 italic mb-6 leading-relaxed relative z-10">
                                                "{t.content}"
                                            </p>
                                            <div className="flex items-center gap-3 mt-auto">
                                                <div className="w-8 h-8 border border-[#050505] overflow-hidden shrink-0">
                                                    {t.avatarUrl ? (
                                                        <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale" />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#050505] flex items-center justify-center font-bold text-white text-[10px]">
                                                            {t.clientName.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="font-bold text-[10px] text-[#050505] uppercase tracking-widest">{t.clientName}</h4>
                                                    {t.company && <p className="vf-body text-[8px] uppercase tracking-[0.2em] text-[var(--primary)]">{t.company}</p>}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <motion.h3
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
                            className="text-[10px] font-bold uppercase tracking-widest mb-3 bg-[#050505] text-[#F3F3F1] inline-block px-3 py-1"
                        >
                            <EditableText value={theme?.customTexts?.vf_festivals_title || 'FESTIVALS & RECOGNITION'} field="vf_festivals_title" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                        </motion.h3>

                        <div className="border-y-2 border-[#050505]">
                            {certificates.length > 0 ? certificates.map((cert: any, idx: number) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0 }}
                                    transition={{ duration: 0.6, delay: idx * 0.05, ease: cinematicEase }}
                                    key={cert.id} className="border-b border-gray-300 overflow-hidden"
                                >
                                    <motion.div
                                        whileHover={{ backgroundColor: "rgba(0,0,0,0.05)", x: 10 }}
                                        onClick={() => setSelectedCert(selectedCert?.id === cert.id ? null : cert)}
                                        className="grid grid-cols-12 py-4 transition-all cursor-pointer items-center px-2"
                                    >
                                        <div className="col-span-2 text-[10px] font-bold text-gray-500">{cert.year || new Date(cert.createdAt).getFullYear()}</div>
                                        <div className="col-span-8 text-sm font-black uppercase" style={{ color: 'var(--primary)' }}>{cert.title}</div>
                                        <div className={`col-span-2 text-right transition-transform duration-500 ${selectedCert?.id === cert.id ? 'rotate-90' : ''}`}>
                                            <i className="fas fa-chevron-right text-xs opacity-30"></i>
                                        </div>
                                    </motion.div>

                                    <AnimatePresence>
                                        {selectedCert?.id === cert.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.5, ease: cinematicEase }}
                                                className="bg-white/50"
                                            >
                                                <div className="p-6 flex flex-col @md:flex-row gap-8 items-start">
                                                    {cert.mediaUrl && (
                                                        <div className="w-full @md:w-64 aspect-video overflow-hidden bg-gray-200 border border-gray-300 shrink-0">
                                                            <LazyImage src={cert.mediaUrl} alt={cert.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest">ISSUER: {cert.issuer}</div>
                                                        <p className="text-gray-600 text-xs @sm:text-sm leading-relaxed mb-4 border-l-2 pl-4 border-gray-300 italic">
                                                            {cert.description || "Verification details and festival recognition summary."}
                                                        </p>
                                                        {cert.url && (
                                                            <a href={cert.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-black/20 px-4 py-2 hover:bg-black hover:text-white transition-all">
                                                                <EditableText value={theme?.customTexts?.vf_cert_verify || 'Verify Award'} field="vf_cert_verify" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> <i className="fas fa-external-link-alt text-[8px]"></i>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )) : (
                                <div className="grid grid-cols-12 py-3 border-b border-gray-300 items-start">
                                    <div className="col-span-2 text-[10px] font-bold text-gray-500">2018</div>
                                    <div className="col-span-7 text-xs font-bold uppercase" style={{ color: 'var(--primary)' }}>SITE OF THE DAY</div>
                                    <div className="col-span-3 text-[9px] text-gray-400 text-right">AWWWARDS</div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ===== FOOTER ===== */}
                <motion.footer
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
                    variants={fadeUpVariants}
                    className="relative z-20 py-24 bg-[#050505] text-center border-t border-white/5"
                >
                    <p className="vf-hud-text vf-body uppercase tracking-[0.3em] font-bold mb-4" style={{ color: 'var(--primary)' }}><EditableText value={theme?.customTexts?.vf_footer_wrap || "Cut. That's a wrap."} field="vf_footer_wrap" entity="appearance" isEditor={isEditor} as="span" maxLength={40} /></p>
                    <motion.h2
                        whileHover={{ scale: 1.05 }}
                        className="font-cinema text-[#F3F3F1] hover:text-[var(--primary)] transition-colors cursor-pointer mb-10 vf-footer-title leading-tight inline-block"
                    >
                        <a href={`mailto:${email}`}>
                            <EditableText value={theme?.customTexts?.vf_footer_d1 || 'DIRECT'} field="vf_footer_d1" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /><br /><EditableText value={theme?.customTexts?.vf_footer_d2 || 'DIRECTIVE ↗'} field="vf_footer_d2" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /><br />
                        </a>
                    </motion.h2>
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[10px] text-gray-600 uppercase tracking-widest vf-body">
                        <span>© {new Date().getFullYear()} {fullName.toUpperCase()}</span>
                        {links.length > 0 ? links.slice(0, 3).map((link: any, idx: number) => (
                            <motion.a whileHover={{ y: -2, color: "#F3F3F1" }} key={idx} href={link.url} target="_blank" rel="noreferrer" className="transition-colors">{link.platform}</motion.a>
                        )) : (
                            <>
                                <a href="#" className="hover:text-[#F3F3F1] transition">INSTAGRAM</a>
                                <a href="#" className="hover:text-[#F3F3F1] transition">VIMEO</a>
                            </>
                        )}
                        <motion.a whileHover={{ y: -2, color: "#F3F3F1" }} href={`https://portfo.be/${data?.profile?.subdomain || 'jamal'}`} className="text-[#F3F3F1]/50 transition-colors">
                            PORTFO.BE/{data?.profile?.subdomain?.toUpperCase() || 'JAMAL'}
                        </motion.a>
                    </div>
                </motion.footer>

            </div>
            {/* VIEW_FINDER MEDIA MODAL */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-0 @md:p-10"
                    >
                        {/* Immersive Blackout */}
                        <div className="absolute inset-0 bg-black/95" onClick={() => setSelectedMedia(null)}></div>

                        <motion.div 
                            initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }}
                            className="relative w-full max-w-6xl bg-black flex flex-col overflow-hidden border-white/10 @md:border shadow-2xl"
                        >
                            {/* Compact top bar */}
                            <div className="flex justify-between items-center px-4 py-2 @md:px-6 bg-[#111] border-b border-white/10">
                                <span className="font-cinema tracking-widest text-[13px] text-white/50 uppercase">{selectedMedia.title}</span>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white text-white hover:text-black transition-all shrink-0"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Content Player with HUD */}
                            <div 
                                className="w-full bg-black relative"
                                style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}
                            >
                                {/* MODAL HUD OVERLAY */}
                                <div className="absolute inset-0 z-20 pointer-events-none p-5 flex flex-col justify-between opacity-60">
                                    <div className="flex justify-between items-start vf-hud-text font-bold">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
                                                <span><EditableText value={theme?.customTexts?.vf_modal_play || 'PLAYBACK'} field="vf_modal_play" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></span>
                                            </div>
                                            <span><EditableText value={theme?.customTexts?.vf_modal_tc || 'TC 00:00:00:00'} field="vf_modal_tc" entity="appearance" isEditor={isEditor} as="span" maxLength={25} /></span>
                                        </div>
                                        <div className="text-right">
                                            <span><EditableText value={theme?.customTexts?.vf_modal_top_r1 || '4K RAW | 24FPS'} field="vf_modal_top_r1" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /></span>
                                            <br /><span><EditableText value={theme?.customTexts?.vf_modal_top_r2 || 'LOG-C3'} field="vf_modal_top_r2" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end vf-hud-text font-bold">
                                        <span><EditableText value={theme?.customTexts?.vf_modal_bot_l || 'CH1 [||||||||--]'} field="vf_modal_bot_l" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /></span>
                                        <span><EditableText value={theme?.customTexts?.vf_modal_bot_r || 'BAT 88%'} field="vf_modal_bot_r" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                                    </div>
                                </div>

                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4 @md:p-12">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain" />
                                    </div>
                                )}
                            </div>

                            {/* Footer Status */}
                            <div className="bg-[#111] py-2.5 px-4 @md:px-6 flex justify-between items-center border-t border-white/10">
                                <span className="font-cinema tracking-widest text-[12px] text-white/40">{selectedMedia.title.toUpperCase()}</span>
                                <button onClick={() => setSelectedMedia(null)} className="vf-hud-text font-bold text-[var(--primary)] hover:opacity-70 transition">/ <EditableText value={theme?.customTexts?.vf_modal_exit || 'EXIT_VIEW'} field="vf_modal_exit" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}