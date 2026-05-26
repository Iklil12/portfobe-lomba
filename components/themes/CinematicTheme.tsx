"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { GithubStats } from '@/components/themes/widgets/GithubStats';
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export default function CinematicTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [openAward, setOpenAward] = useState<string | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

  // --- ANIMASI STABILISASI ---
  // Kita gunakan animate="visible" untuk editor agar langsung tampil tanpa pemicu scroll (yang sering rusak di preview)
  // Tapi tetap gunakan whileInView untuk live site agar ada efek scroll reveal.
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";


    // --- IDENTITAS ---
    const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
    const profession = data?.profile?.profession || data?.profession || "Director & Editor";
    const bio = data?.profile?.bio || data?.bio || "Transforming raw vision into cinematic reality. Specializing in high-end commercials and visual storytelling.";
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
    const displayAvatar = (rawAvatar.replace(/"/g, '').trim() !== "" && rawAvatar !== "null") ? rawAvatar.replace(/"/g, '').trim() : `https://images.unsplash.com/photo-1580234797602-22c37b4a6230?q=80&w=2067&auto=format&fit=crop`;

    // --- PENGATURAN DESAIN ---
    const rawThemeColor = theme?.themeColor || "#ffffff";
    const themeColor = isValidHexColor(rawThemeColor) ? rawThemeColor : "#ff9e00";
    const fontHeading = theme?.fontHeading || "Inter";
    const fontBody = theme?.fontBody || "Inter";
    const cardStyle = theme?.cardStyle || "hard";
    const buttonShape = theme?.buttonShape || 'hard';

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const getFontFamily = (fontName: string) => {
        if (!fontName) return "'Inter', sans-serif";
        if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant')) return "'Playfair Display', serif";
        return "'Inter', sans-serif";
    };

    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);
    const radiusClass = theme?.buttonShape === 'pill' ? 'rounded-full' : theme?.buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const cardRadiusClass = theme?.buttonShape === 'pill' ? 'rounded-3xl' : theme?.buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0a0a0a] shadow-[0_30px_60px_rgba(255,255,255,0.03)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/30 shadow-[4px_4px_0_0_#fff]' : 'bg-black border border-[#1f1f1f] hover:border-white/20';
    return (
        <div className={`w-full min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black relative text-sm cinematic-theme`}>

            <style dangerouslySetInnerHTML={{
                __html: `
        .cine-heading { font-family: ${customHeadingFont} !important; }
        .cine-body { font-family: ${customBodyFont} !important; }
        .cine-accent { color: ${themeColor} !important; }
        .cine-border-accent:hover { border-color: ${themeColor} !important; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 15s linear infinite; }
        .project-row { transition: all 0.4s ease; border-bottom: 1px solid #1f1f1f; }
        .project-row:hover { background-color: #111; padding-left: 1rem; padding-right: 1rem; border-color: ${themeColor}; }
        .award-row { transition: all 0.3s ease; }
        .award-row:hover { color: ${themeColor}; border-color: ${themeColor}; }
        .cinematic-theme ::-webkit-scrollbar { width: 4px; }
        .cinematic-theme ::-webkit-scrollbar-track { background: #0a0a0a; }
        .cinematic-theme ::-webkit-scrollbar-thumb { background: #333; }
      `}} />

            {/* NAVBAR */}
            <nav className={`absolute top-0 left-0 w-full z-50 mix-blend-difference flex justify-between items-center cine-body p-6`}>
                <div className={`font-black tracking-tighter cine-heading text-xl`}>{firstName[0]}{lastName ? lastName[0] : ''}.</div>
                <div className={`flex font-bold uppercase tracking-widest gap-4 @md:gap-6 text-xs @md:text-sm`}>
                    <a href="#work" className="hover:cine-accent transition">Work</a>
                    <a href="#about" className="hover:cine-accent transition">Info</a>
                </div>
            </nav>

            {/* HERO SECTION */}
            <header className="relative min-h-[90vh] flex flex-col justify-end pb-16 px-6 @md:px-12 overflow-hidden pt-32">
                <div className="absolute inset-0 z-0 @container">
                    <LazyImage src={displayAvatar} alt="Hero Background" className="w-full h-full object-cover grayscale opacity-30 scale-105 animate-[pulse_10s_ease-in-out_infinite]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
                </div>

                {/* PERBAIKAN: Ubah @md: menjadi @lg: agar bio di tablet tetap di bawah nama */}
                <div className={`relative z-10 w-full flex justify-between gap-6 flex-col @lg:flex-row @lg:items-end @lg:gap-10`}>
                    <div className="flex-1 w-full min-w-0">
                        <p className={`text-gray-400 font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3 cine-body text-xs @md:text-sm`}>
                            <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: themeColor }}></span>
                            <span className="truncate">{profession}</span>
                        </p>

                        {/* PERBAIKAN: Penggunaan text-[clamp()] agar font membesar/mengecil bagai karet */}
                        <h1 className={`font-black leading-[0.85] tracking-tighter uppercase cine-heading break-words w-full
                      text-[clamp(4rem,10cqi,10rem)]
                  `}>
                            {firstName}<br />
                            <span className="text-transparent break-words w-full block" style={{ WebkitTextStroke: `2px ${themeColor === '#000000' ? '#ffffff' : themeColor}` }}>
                                {lastName || 'Portfolio'}
                            </span>
                        </h1>
                    </div>

                    {/* PERBAIKAN: Posisi bio diatur jadi rata kiri saat tablet, baru rata kanan saat layar sangat besar */}
                    <div className={`cine-body w-full @lg:max-w-sm text-left @lg:text-right pb-4 @lg:pb-6 shrink-0`}>
                        <p className={`cine-body text-gray-400 leading-relaxed text-sm @md:text-base mt-6 @lg:mt-0`}>
                            {bio}
                        </p>
                        <div className={`mt-6 flex flex-wrap gap-4 justify-start @lg:justify-end`}>
                            {links.map((l: any, i: number) => (
                                <a key={i} href={l.url} target="_blank" rel="noreferrer" className={`text-white hover:cine-accent transition font-bold uppercase tracking-widest text-xs @md:text-sm`}>{l.platform}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* MARQUEE */}
            <div className={`w-full bg-white text-black py-3 overflow-hidden border-y border-white cine-heading`}>
                <div className={`flex whitespace-nowrap animate-marquee font-black uppercase tracking-tighter text-xl @md:text-3xl`}>
                    <div className="flex items-center space-x-6 px-4">
                        {[...Array(6)].map((_, i) => (<React.Fragment key={i}><span>{profession}</span><span>•</span></React.Fragment>))}
                    </div>
                    <div className="flex items-center space-x-6 px-4">
                        {[...Array(6)].map((_, i) => (<React.Fragment key={i + 10}><span>{profession}</span><span>•</span></React.Fragment>))}
                    </div>
                </div>
            </div>

            {/* STATS SECTION */}
            <section className="border-b border-[#1f1f1f]" id="about">
                <div className={`grid divide-[#1f1f1f] grid-cols-2 @md:grid-cols-4 divide-x divide-y @md:divide-y-0`}>
                    <div className={`flex flex-col items-center justify-center text-center hover:bg-white hover:text-black transition duration-300 p-8 @md:p-16`}>
                        <span className={`font-black mb-1 tracking-tighter cine-heading text-4xl @md:text-7xl`}>{archiveItems.length}</span>
                        <span className="text-[9px] @md:text-xs uppercase tracking-widest font-bold cine-body">Projects</span>
                    </div>
                    <div className={`flex flex-col items-center justify-center text-center hover:bg-white hover:text-black transition duration-300 p-8 @md:p-16`}>
                        <span className={`font-black mb-1 tracking-tighter cine-heading text-4xl @md:text-7xl`}>{awardItems.length}</span>
                        <span className="text-[9px] @md:text-xs uppercase tracking-widest font-bold cine-body">Awards</span>
                    </div>
                    <div className={`flex flex-col items-center justify-center text-center hover:bg-white hover:text-black transition duration-300 p-8 @md:p-16`}>
                        <span className={`font-black mb-1 tracking-tighter cine-heading text-4xl @md:text-7xl`}>{links.length}</span>
                        <span className="text-[9px] @md:text-xs uppercase tracking-widest font-bold cine-body">Links</span>
                    </div>
                    <div className={`flex flex-col items-center justify-center text-center hover:bg-white hover:text-black transition duration-300 group cursor-pointer p-8 @md:p-16`} onClick={() => window.location.href = `mailto:${userEmail}`}>
                        <span className={`font-black mb-2 tracking-tighter cine-heading text-4xl @md:text-6xl`}><i className="fas fa-envelope group-hover:scale-110 transition-transform"></i></span>
                        <span className="text-[9px] @md:text-xs uppercase tracking-widest font-bold cine-body mt-1">Hire Me</span>
                    </div>
                </div>
            </section>

            {/* PROJECTS SECTION */}
            <section className={`py-20 @md:py-24 px-6 @md:px-12`} id="work">
                <div className="flex justify-between items-end mb-12">
                    <h2 className={`font-black uppercase tracking-tighter cine-heading text-[clamp(2.5rem,8cqi,5rem)]`}>Selected<br />Works <span className="text-gray-600 text-xl @md:text-2xl">({archiveItems.length})</span></h2>
                </div>

                <div className="flex flex-col border-t border-[#1f1f1f]">
                    {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        return (
                            <div 
                                key={i} 
                                onClick={() => {
                                    if (isVideo || p.projectType === 'photo') {
                                        setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                    } else if (p.mediaUrl) {
                                        window.open(p.mediaUrl, '_blank');
                                    }
                                }}
                                className={`project-row relative group flex justify-between cursor-pointer cine-border-accent flex-col @md:flex-row @md:items-center py-8 @md:py-14`}
                            >
                                <div className={`flex relative z-10 pointer-events-none flex-col @md:flex-row @md:items-center gap-4 @md:gap-20`}>
                                    <span className="text-gray-600 font-mono text-sm @md:text-lg hidden @md:block">0{i + 1}</span>
                                    <h3 className={`font-black tracking-tighter uppercase group-hover:cine-accent text-gray-300 transition-colors cine-heading line-clamp-1 text-[clamp(1.5rem,5cqi,4rem)]`}>{p.title}</h3>
                                </div>
                                
                                {/* Video Play Indicator */}
                                {isVideo && (
                                    <div className="absolute left-[40%] top-1/2 -translate-y-1/2 hidden @md:flex items-center gap-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                                        <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
                                            <i className="fas fa-play text-[10px] ml-1"></i>
                                        </div>
                                        <span className="font-bold text-[10px] uppercase tracking-[0.3em] cine-body">Watch_Now</span>
                                    </div>
                                )}

                                <div className={`flex flex-col relative z-10 pointer-events-none cine-body mt-4 @md:mt-0 @md:text-right`}>
                                    <span className="text-[10px] @md:text-sm font-bold uppercase tracking-widest text-white">{p.projectType}</span>
                                    <span className="cine-body text-gray-500 mt-1 text-[10px] @md:text-sm truncate max-w-[200px]">{p.description || 'View Project'}</span>
                                </div>

                                {/* Mobile Inline Image */}
                                <div className={`block @md:hidden mt-5 w-full aspect-video relative z-10 overflow-hidden ${radiusClass}`}>
                                    <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className="w-full h-full object-cover grayscale" />
                                    {isVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
                                                <i className="fas fa-play text-xs ml-0.5"></i>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Desktop Absolute Hover Image */}
                                <div className={`hidden @md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40cqi] h-[40vh] z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden ${radiusClass}`}>
                                    <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : (p.mediaUrl || "https://via.placeholder.com/800")} alt={p.title} className="w-full h-full object-cover grayscale opacity-50" />
                                </div>
                            </div>
                        )
                    }) : <div className="py-20 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">No projects available.</div>}
                </div>

                {/* Tombol Gallery Utama (Sleek Cinematic Style) */}
                <div className={`w-full flex justify-center mb-20 px-6 mt-12`}>
                    <Link href={`/${subdomain}/gallery`} scroll={false} className="group relative block w-full max-w-4xl no-underline overflow-hidden border-y border-[#1f1f1f] hover:border-white/30 transition-colors duration-700">
                        {/* Background Glow Effect */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-700"></div>

                        <div className={`relative z-10 flex items-center justify-between py-10 @md:py-14 px-2 @md:px-8`}>
                            <div className="flex flex-col">
                                <span className={`font-mono text-gray-500 uppercase tracking-[0.3em] group-hover:text-gray-300 transition-colors duration-500 text-[9px] @md:text-xs mb-3`}>
                                    <i className="fas fa-film mr-2"></i>Full Index
                                </span>
                                <h3 className={`font-black uppercase tracking-tighter text-gray-300 group-hover:text-white transition-colors duration-500 cine-heading flex items-center gap-4 text-3xl @md:text-6xl`}>
                                    Explore Archive
                                </h3>
                            </div>

                            {/* Animated Arrow */}
                            <div className={`flex items-center justify-center shrink-0 ${radiusClass} border border-[#1f1f1f] group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-700 text-gray-500 w-12 h-12 @md:w-20 @md:h-20`}>
                                <i className={`fas fa-arrow-right group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] text-lg @md:text-2xl`}></i>
                            </div>
                        </div>

                        {/* Scanning Line (Cinematic Lens Flare effect) */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out"></div>
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-[1.5s] ease-in-out"></div>
                    </Link>
                </div>
            </section>

            {/* 3D SHOWCASE SECTION */}
            {items3D.length > 0 && (
                <section className="border-b border-[#1f1f1f] bg-[#050505] py-20 @md:py-24 px-6 @md:px-12">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className={`font-black uppercase tracking-tighter cine-heading text-[clamp(2.5rem,8cqi,5rem)]`}>3D<br />Models <span className="text-gray-600 text-xl @md:text-2xl">({items3D.length})</span></h2>
                    </div>

                    <div className="flex flex-col gap-12 @md:gap-24">
                        {items3D.map((p: any, i: number) => (
                            <div key={i} className={`group relative w-full aspect-[4/3] @md:aspect-video ${cardRadiusClass} overflow-hidden ${cardStyleClass} transition-all duration-700`}>
                                <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#000000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 pointer-events-none group-hover:opacity-40 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 w-full p-8 @md:p-16 flex flex-col gap-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-out pointer-events-none">
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-[10px] uppercase tracking-[0.5em] text-gray-500">Asset_0{i+1}</span>
                                        <div className="h-px w-12 bg-white/10"></div>
                                    </div>
                                    <h3 className="font-black uppercase tracking-tighter text-4xl @md:text-8xl text-white leading-none">{p.title}</h3>
                                    {p.description && <p className="cine-body text-gray-400 text-sm @md:text-lg max-w-2xl mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">{p.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* INTEGRATIONS SECTION */}
            {data?.id && (
                <div className="w-full bg-[#0a0a0a]">
                    <PenpotShowcase userId={data.id} variant="cinematic" />
                    <CanvaShowcase userId={data.id} variant="cinematic" />
                </div>
            )}

            {/* GITHUB STATS SECTION */}
            {data?.id && (
                <div className="w-full bg-[#0a0a0a]">
                    <GithubStats userId={data.id} variant="cinematic" themeColor={themeColor} />
                </div>
            )}

            {/* AWARDS SECTION */}
            <section className={`bg-[#050505] border-t border-[#1f1f1f] py-20 @md:py-24 px-6 @md:px-12`}>
                <div className={`grid gap-10 @md:grid-cols-12 @md:gap-12`}>
                    <div className={`@md:col-span-4`}>
                        <div className="@md:sticky @md:top-24">
                            <h2 className={`font-black uppercase tracking-tighter mb-3 cine-heading text-3xl @md:text-5xl`}>Recognition</h2>
                            <p className={`text-gray-500 max-w-xs cine-body text-sm`}>Acknowledged by the industry for exceptional visual storytelling.</p>
                        </div>
                    </div>

                    <div className={`border-t border-[#1f1f1f] @md:col-span-8`}>
                        {awardItems.length > 0 ? awardItems.map((award: any, i: number) => {
                            const isOpen = openAward === award.id;
                            return (
                                <div key={i} className="border-b border-[#1f1f1f] @container">
                                    <div className={`award-row flex justify-between items-center cursor-pointer text-gray-400 py-6 @md:py-8 flex-wrap @md:flex-nowrap`} onClick={() => setOpenAward(isOpen ? null : award.id)}>

                                        <div className={`flex justify-between items-center w-full @md:w-auto mb-2 @md:mb-0`}>
                                            <h3 className={`font-bold uppercase tracking-tighter cine-heading ${isOpen ? 'text-white' : ''} text-xl @md:text-2xl`}>{award.title}</h3>
                                            <span className="@md:hidden font-mono text-[10px]">{award.year || new Date(award.createdAt).getFullYear()}</span>
                                        </div>

                                        <div className="hidden @md:flex flex-1 justify-center"><span className="text-[10px] @md:text-sm uppercase tracking-widest cine-body">{award.issuer}</span></div>

                                        <div className={`flex items-center gap-6`}>
                                            <span className="hidden @md:block font-mono text-sm">{award.year || new Date(award.createdAt).getFullYear()}</span>
                                            <i className={`fas fa-arrow-right transition-transform duration-300 text-sm ${isOpen ? '-rotate-45 text-white' : 'rotate-45'}`}></i>
                                        </div>

                                    </div>

                                    <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                                        <div className={`pb-6 flex gap-5 flex-col @md:flex-row`}>
                                            <div className={`shrink-0 bg-[#111] flex items-center justify-center overflow-hidden ${radiusClass} w-full @md:w-48 h-32`}>
                                                <LazyImage src={award.mediaUrl || "https://via.placeholder.com/600"} className="w-full h-full object-contain p-2 grayscale hover:grayscale-0 transition-all duration-500" alt="Certificate" />
                                            </div>
                                            <div className="flex flex-col justify-center cine-body">
                                                <p className="text-white font-bold mb-1 text-[11px] uppercase tracking-wider">{award.status || 'Verified'}</p>
                                                <p className="cine-body text-gray-500 text-[11px] @md:text-sm max-w-md leading-relaxed mb-4">{award.description || 'Awarded for excellence in the respective category.'}</p>
                                                <a href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-gray-400 transition flex items-center gap-2">View Certificate <i className="fas fa-external-link-alt text-[8px]"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <div className="py-10 text-gray-600 font-mono text-xs uppercase tracking-widest">No recognitions yet.</div>}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            {testimonials.length > 0 && (
                <section className="bg-[#050505] border-t border-[#1f1f1f] py-20 @md:py-24 px-6 @md:px-12">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className={`font-black uppercase tracking-tighter cine-heading text-[clamp(2.5rem,8cqi,5rem)]`}>Client<br />Reviews <span className="text-gray-600 text-xl @md:text-2xl">({testimonials.length})</span></h2>
                    </div>

                    <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-12">
                        {testimonials.map((t: any, i: number) => (
                            <div key={t.id} className={`group ${cardStyleClass} ${cardRadiusClass} transition-colors duration-700 p-8 @md:p-12`}>
                                <div className="flex items-center gap-6 mb-8 border-b border-[#1f1f1f] pb-6 group-hover:border-white/20 transition-colors">
                                    <div className={`w-16 h-16 shrink-0 bg-[#111] ${radiusClass} overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700`}>
                                        {t.avatarUrl ? (
                                            <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-xl text-white cine-heading">
                                                {t.clientName.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="font-black text-white text-xl uppercase tracking-tight cine-heading">{t.clientName}</h4>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-1 cine-body">{t.company || 'CLIENT'}</span>
                                    </div>
                                </div>
                                <p className="cine-body text-sm @md:text-lg text-gray-400 italic leading-relaxed mb-8 group-hover:text-white transition-colors duration-500">
                                    "{t.content}"
                                </p>
                                <div className="flex gap-2 text-xs">
                                    {[...Array(5)].map((_, idx) => (
                                        <i key={idx} className={`${idx < t.rating ? 'fas fa-star text-white' : 'far fa-star text-white/20'}`}></i>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* FOOTER CTA */}
            <footer className={`bg-white text-black text-center relative overflow-hidden group py-24 @md:py-32 px-6 @md:px-12`}>
                <a href={`mailto:${userEmail}`} className="relative z-10 block cursor-pointer">
                    <p className={`font-bold uppercase tracking-[0.3em] text-gray-500 mb-4 group-hover:text-black transition cine-body text-xs @md:text-sm`}>Got a project?</p>
                    <h2 className={`font-black uppercase tracking-tighter leading-none group-hover:-translate-y-2 transition-transform duration-500 cine-heading text-[clamp(3rem,10cqi,8rem)]`}>
                        Let's Talk
                    </h2>
                </a>

                <div className={`mt-16 flex justify-between items-center font-bold text-gray-500 uppercase tracking-widest cine-body flex-col @md:flex-row mt-20 @md:mt-24 text-xs @md:text-sm`}>
                    <p>© 2026 {fullName}</p>
                    <p className="flex items-center gap-2">
                        <i className="fas fa-link"></i> portfo.be/{subdomain}
                    </p>
                </div>
            </footer>

            {/* CINEMATIC MEDIA MODAL */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-0 @md:p-10"
                    >
                        {/* Immersive Blackout */}
                        <div className="absolute inset-0 bg-black/98" onClick={() => setSelectedMedia(null)}></div>

                        <motion.div 
                            initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.05, opacity: 0 }}
                            className={`relative w-full max-w-6xl bg-black border-y @md:border border-white/10 flex flex-col overflow-hidden ${cardRadiusClass}`}
                        >
                            {/* Theater Header */}
                            <div className="flex justify-between items-center p-6 @md:p-8 border-b border-white/5 relative z-10 bg-black">
                                <div className="flex flex-col">
                                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.5em] text-gray-500 mb-2">Cinematic Preview</span>
                                    <h3 className="cine-heading font-black uppercase tracking-tighter text-2xl @md:text-4xl text-white">{selectedMedia.title}</h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className={`w-12 h-12 flex items-center justify-center bg-white text-black hover:bg-gray-200 transition-colors ${radiusClass}`}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Widescreen Player */}
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[60vh]'} bg-black flex items-center justify-center`}
                            >
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-4">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[55vh] object-contain shadow-[0_0_50px_rgba(255,255,255,0.1)]" />
                                    </div>
                                )}
                            </motion.div>

                            {/* Minimal Bottom Bar */}
                            <div className="p-4 flex justify-between items-center bg-black px-8">
                                <div className="flex items-center gap-2 opacity-30">
                                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                                    <span className="font-mono text-[9px] uppercase tracking-widest text-white">Playback_Active</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedMedia(null)}
                                    className="cine-body text-[9px] font-bold uppercase tracking-[0.5em] text-white/40 hover:text-white transition-colors"
                                >
                                    CLOSE_THEATER
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}