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
import { EditableText } from '@/components/ui/EditableText';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export default function MidnightEmulsionTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [isCopied, setIsCopied] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
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

    const nameParts = fullName.trim().split(' ');
    const displayFirstName = nameParts[0];
    const displayLastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Creative';

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

    const radiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';
    const cardStyle = theme?.cardStyle || 'glassmorphism';
    const fontHeading = theme?.fontHeading || 'Cormorant Garamond';
    const fontBody = theme?.fontBody || 'Inter';

    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair') || f?.toLowerCase().includes('cormorant')) return `'${f}', serif`;
        return "'Inter', sans-serif";
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    const rawHighlightColor = theme?.themeColor || '#4fd1c5';
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#4fd1c5';

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: canvasEase } }
    };

    return (
        <main className="relative min-h-screen bg-[#030508] text-[#e2e8f0] font-sans selection:bg-[var(--hl)] selection:text-[#030508] @container flex flex-col @lg:flex-row midnight-theme" style={{ '--hl': highlightColor } as React.CSSProperties}>
            <style dangerouslySetInnerHTML={{
                    __html: `
            .midnight-theme .font-serif { font-family: ${customHeadingFont}; }
            .midnight-theme .font-sans { font-family: ${customBodyFont}; }
            .film-grain { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.05; }
            .text-stroke { -webkit-text-stroke: 1px rgba(255,255,255,0.2); color: transparent; }
            .text-stroke-hover:hover { -webkit-text-stroke: 1px var(--hl); }
          `}} />
            <div className={`${(isCardPreview || isEditor) ? "absolute" : "fixed"} inset-0 z-50 pointer-events-none film-grain mix-blend-overlay`}></div>

            <div className="relative z-20 w-full @lg:w-5/12 @lg:h-screen @lg:sticky @lg:top-0 flex flex-col justify-between p-8 @md:p-12 @lg:p-16 border-b @lg:border-b-0 @lg:border-r border-white/5 overflow-hidden bg-[#030508]">
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-60">
                    <div className="absolute top-[-10%] left-[-20%] w-[400px] h-[400px] bg-[var(--hl)] opacity-10 rounded-full blur-[100px]" />
                </div>

                <header className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                            <LazyImage src={displayAvatar} alt={displayFirstName} className="w-full h-full object-cover grayscale" />
                        </div>
                        <span className="font-sans font-bold tracking-tight text-white uppercase text-xs">
                            <EditableText value={displayFirstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                        </span>
                    </div>
                </header>

                <div className="relative z-10 my-16 @lg:my-auto">
                    <motion.p initial="hidden" animate="visible" variants={fadeUp} className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--hl)] mb-6 flex items-center gap-4">
                        <span className="w-8 h-[1px] bg-[var(--hl)] opacity-50"></span>
                        <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                    </motion.p>
                    <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="font-serif text-5xl @md:text-6xl @lg:text-7xl leading-[0.9] mb-8 uppercase tracking-tighter break-words">
                        <span className="block text-white">
                            <EditableText value={displayFirstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                        </span>
                        <span className="block text-stroke text-stroke-hover transition-all duration-500 cursor-default">
                            <EditableText value={displayLastName} field="lastName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                        </span>
                    </motion.h1>
                    <motion.p initial="hidden" animate="visible" variants={fadeUp} className="font-sans text-slate-400 font-medium leading-relaxed max-w-sm text-sm @md:text-base">
                        <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />
                    </motion.p>
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mt-10 flex gap-4">
                        <button onClick={handleCopyEmail} className={`px-6 py-3 border border-white/10 hover:border-[var(--hl)] bg-white/5 hover:bg-[var(--hl)]/10 text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 backdrop-blur-md ${radiusClass}`}>
                            {isCopied ? 'Access Granted' : <EditableText value={theme?.customTexts?.midnight_btn_contact || 'Initiate Contact'} field="midnight_btn_contact" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />}
                        </button>
                    </motion.div>
                </div>

                <footer className="relative z-10 flex gap-6 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 flex-wrap">
                    {links.map((l: any, i: number) => (
                        <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-[var(--hl)] transition-colors">{l.platform}</a>
                    ))}
                </footer>
            </div>

            <div className="relative z-10 w-full @lg:w-7/12 bg-[#05070a] flex flex-col">
                <div className="hidden @lg:flex h-32 items-center justify-center border-b border-white/5 shrink-0">
                    <span className="font-serif italic text-slate-600 text-sm tracking-widest">
                        <EditableText value={theme?.customTexts?.midnight_scroll || 'Scroll to explore'} field="midnight_scroll" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </span>
                </div>

                <div className="p-6 @md:p-12 @lg:p-20 flex flex-col gap-24 @lg:gap-40 shrink-0">
                    {archiveItems.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        const sceneNumber = (i + 1).toString().padStart(2, '0');
                        return (
                            <motion.div
                                key={i}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                onClick={() => {
                                    if (isVideo || p.projectType === 'photo') {
                                        setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                    } else if (p.mediaUrl) {
                                        window.open(p.mediaUrl, '_blank');
                                    }
                                }}
                                className="group flex flex-col w-full relative cursor-pointer"
                            >
                                <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
                                    <div className="flex flex-col">
                                        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-1">
                                            <EditableText value={theme?.customTexts?.midnight_scene_label || 'Scene'} field="midnight_scene_label" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /> {sceneNumber}
                                        </span>
                                        <h2 className="font-serif text-2xl @md:text-4xl text-white group-hover:text-[var(--hl)] transition-colors">{p.title}</h2>
                                    </div>
                                    <span className="font-sans text-xs font-medium text-slate-500 hidden @md:block uppercase">{p.projectType}</span>
                                </div>
                                <div className={`w-full aspect-video @md:aspect-[21/9] bg-[#0a0f1e] overflow-hidden relative shadow-2xl ${radiusClass}`}>
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.03)_50%,rgba(255,255,255,0))] bg-[length:100%_4px] z-10 pointer-events-none opacity-20"></div>
                                    <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover grayscale-[80%] opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-1000 ease-out" />
                                    {isVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center z-20">
                                            <div className="w-20 h-20 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:border-[var(--hl)] group-hover:bg-[var(--hl)]/20 transition-all duration-700">
                                                <i className="fas fa-play text-white text-xl ml-1"></i>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6 ml-auto w-full @md:w-3/4 @lg:w-2/3">
                                    <p className="font-sans text-sm @md:text-base text-slate-400 leading-relaxed text-right">{p.description || 'Visual exploration and structural design implementation.'}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* 3D SHOWCASE SECTION */}
                {items3D.length > 0 && (
                    <div className="p-6 @md:p-12 @lg:p-20 flex flex-col gap-12 @lg:gap-16 border-t border-white/5 shrink-0">
                        <div className="flex flex-col mb-4">
                            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-2">
                                <EditableText value={theme?.customTexts?.midnight_3d_top || 'Spatial Division'} field="midnight_3d_top" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                            </span>
                            <h2 className="font-serif text-3xl @md:text-5xl text-white">
                                <EditableText value={theme?.customTexts?.midnight_3d_title || '3D Models'} field="midnight_3d_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                            </h2>
                        </div>
                        
                        <div className="flex flex-col gap-12 @md:gap-24">
                            {items3D.map((p: any, i: number) => {
                                const sceneNumber = (i + 1).toString().padStart(2, '0');
                                return (
                                    <motion.div
                                        key={i}
                                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                        className="group flex flex-col w-full relative"
                                    >
                                        <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-6">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">
                                                        <EditableText value={theme?.customTexts?.midnight_3d_layer || 'Spatial Layer'} field="midnight_3d_layer" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> {sceneNumber}
                                                    </span>
                                                    <div className="h-px w-10 bg-white/10"></div>
                                                </div>
                                                <h2 className="font-serif text-4xl @md:text-7xl text-white group-hover:text-[var(--hl)] transition-colors leading-none">{p.title}</h2>
                                            </div>
                                            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 border border-white/10 px-4 py-2 rounded-full hidden @md:block">3D Asset</span>
                                        </div>
                                        <div className={`w-full aspect-[4/3] @md:aspect-video bg-[#0a0f1e] overflow-hidden relative shadow-2xl ${radiusClass} border border-white/5 group-hover:border-[var(--hl)]/30 transition-all duration-700`}>
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.03)_50%,rgba(255,255,255,0))] bg-[length:100%_4px] z-10 pointer-events-none opacity-20"></div>
                                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#05070a" />
                                            {p.description && (
                                                <div className="absolute bottom-8 left-8 right-8 z-20 pointer-events-none">
                                                    <p className="font-sans text-sm @md:text-base text-slate-400 max-w-xl bg-black/60 backdrop-blur-md p-4 @md:p-6 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">{p.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* INTEGRATIONS SECTION */}
                {data?.id && (
                    <div className="w-full">
                        <PenpotShowcase userId={data.id} variant="midnight" />
                        <CanvaShowcase userId={data.id} variant="midnight" />
                    </div>
                )}

                {/* GITHUB STATS SECTION */}
                {data?.id && (
                    <GithubStats userId={data.id} variant="midnight" themeColor={highlightColor} />
                )}

                {testimonials.length > 0 && (
                    <div className="p-6 @md:p-12 @lg:p-20 flex flex-col border-t border-white/5 bg-[#030508]/50 shrink-0">
                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-12">
                            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-2 block">
                                <EditableText value={theme?.customTexts?.midnight_testi_top || 'Client Experience'} field="midnight_testi_top" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                            </span>
                            <h2 className="font-serif text-3xl @md:text-5xl text-white">
                                <EditableText value={theme?.customTexts?.midnight_testi_title || 'Endorsements'} field="midnight_testi_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                            </h2>
                        </motion.div>
                        <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-12">
                            {testimonials.map((t: any, i: number) => (
                                <motion.div
                                    key={t.id}
                                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                    className="group flex flex-col p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 rounded-2xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--hl)] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top z-0"></div>
                                    <p className="font-serif italic text-lg @md:text-xl text-slate-300 leading-relaxed mb-8 relative z-10">
                                        "{t.content}"
                                    </p>
                                    <div className="flex items-center gap-4 relative z-10 mt-auto border-t border-white/10 pt-6">
                                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/20">
                                            {t.avatarUrl ? (
                                                <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                                            ) : (
                                                <div className="w-full h-full bg-white/10 flex items-center justify-center font-sans font-bold text-white text-lg">
                                                    {t.clientName.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-sans font-medium text-white group-hover:text-[var(--hl)] transition-colors">{t.clientName}</h4>
                                            {t.company && <p className="font-sans text-[10px] uppercase tracking-widest text-slate-500">{t.company}</p>}
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

                {awardItems.length > 0 && (
                    <div id="awards" className="p-6 @md:p-12 @lg:p-20 flex flex-col border-t border-white/5 bg-[#030508]/50 shrink-0">
                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-12">
                            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-2 block">
                                <EditableText value={theme?.customTexts?.midnight_awards_top || 'Accolades'} field="midnight_awards_top" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                            </span>
                            <h2 className="font-serif text-3xl @md:text-5xl text-white">
                                <EditableText value={theme?.customTexts?.midnight_awards_title || 'Recognitions'} field="midnight_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                            </h2>
                        </motion.div>
                        <div className="flex flex-col border-t border-white/10">
                            {awardItems.map((award: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                    onClick={() => award.mediaUrl && setSelectedMedia({ url: award.mediaUrl, title: award.title, type: 'certificate' })}
                                    className="group flex flex-col @md:flex-row @md:items-center justify-between border-b border-white/10 py-6 @md:py-8 cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--hl)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-0"></div>
                                    <div className="relative z-10 flex flex-col @md:flex-row @md:items-center gap-2 @md:gap-8 w-full @md:w-3/4 mb-4 @md:mb-0">
                                        <span className="font-serif text-slate-500 italic text-lg @md:text-xl w-16">{award.year || new Date(award.createdAt).getFullYear()}</span>
                                        <div className="flex flex-col">
                                            <h3 className="font-sans font-medium text-lg @md:text-xl text-white group-hover:text-[var(--hl)] transition-colors">{award.title}</h3>
                                            <span className="font-sans text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest">{award.issuer}</span>
                                        </div>
                                    </div>
                                    <div className="relative z-10 flex justify-between items-center w-full @md:w-auto gap-8">
                                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--hl)] px-3 py-1 rounded-full border border-[var(--hl)]/20 bg-[var(--hl)]/5">{award.status || 'Verified'}</span>
                                        <i className="fas fa-arrow-right -rotate-45 text-slate-500 group-hover:text-[var(--hl)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"></i>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-20 border-t border-white/5 flex justify-center pb-32 bg-[#05070a] shrink-0">
                    <Link href={`/${subdomain}/gallery`} scroll={false} className="group relative overflow-hidden font-serif italic text-3xl @md:text-5xl text-slate-500 hover:text-white transition-colors duration-500 flex items-center gap-6">
                        <EditableText value={theme?.customTexts?.midnight_archive || 'Open Full Archive'} field="midnight_archive" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                        <i className="fas fa-arrow-right text-[var(--hl)] -rotate-45 group-hover:rotate-0 transition-transform duration-500"></i>
                    </Link>
                </div>
            </div>

            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10"
                    >
                        <div className="absolute inset-0 bg-[#030508]/95 backdrop-blur-md" onClick={() => setSelectedMedia(null)}></div>
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                            className={`relative w-full max-w-5xl bg-[#05070a] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col overflow-hidden ${radiusClass}`}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center px-5 py-3 @md:px-6 border-b border-white/5 bg-black/20">
                                <div className="flex flex-col">
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)]">
                                        <EditableText value={theme?.customTexts?.midnight_modal_top || 'Developing Room'} field="midnight_modal_top" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                    </span>
                                    <h3 className="font-serif text-lg @md:text-xl text-white leading-tight">{selectedMedia.title}</h3>
                                </div>
                                <button onClick={() => setSelectedMedia(null)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:rotate-90 transition-all duration-300 shrink-0">
                                    <i className="fas fa-times text-base"></i>
                                </button>
                            </div>

                            {/* Video / Image — aspect-video lives HERE, not on modal wrapper */}
                            <div className="w-full relative overflow-hidden bg-black" style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}>
                                <div className="absolute inset-0 film-grain opacity-10 pointer-events-none"></div>
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4 @md:p-8">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 ease-out" />
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center px-5 py-2.5 @md:px-6 bg-black/40 border-t border-white/5 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <div className="flex items-center gap-5">
                                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--hl)]"></span> <EditableText value={theme?.customTexts?.midnight_modal_f1 || 'Focus: Active'} field="midnight_modal_f1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                                    <span className="hidden @md:inline"><EditableText value={theme?.customTexts?.midnight_modal_f2 || 'Emulsion: Fixed'} field="midnight_modal_f2" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
                                </div>
                                <button onClick={() => setSelectedMedia(null)} className="hover:text-[var(--hl)] transition-colors tracking-[0.4em]">
                                    <EditableText value={theme?.customTexts?.midnight_modal_close || '/ Close_Scene'} field="midnight_modal_close" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}