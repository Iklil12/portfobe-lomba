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

export default function BentoTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [isCopied, setIsCopied] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

  // --- ANIMASI STABILISASI ---
  // Kita gunakan animate="visible" untuk editor agar langsung tampil tanpa pemicu scroll (yang sering rusak di preview)
  // Tapi tetap gunakan whileInView untuk live site agar ada efek scroll reveal.
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const [currentTime, setCurrentTime] = useState("");

    // Update Jam Real-Time
    useEffect(() => {
        if (isCardPreview || isEditor) return; // Skip interval di card preview untuk mencegah re-render terus menerus
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
    const bio = data?.profile?.bio || data?.bio || "Mengubah ide rumit menjadi antarmuka elegan dan pengalaman digital yang tak terlupakan.";
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
    const rawHighlightColor = theme?.themeColor || '#ff0055';
    const highlightColor = isValidHexColor(rawHighlightColor) ? rawHighlightColor : '#ff0055';

    // Font Sync
    const fontHeading = theme?.fontHeading || 'Plus Jakarta Sans';
    const fontBody = theme?.fontBody || 'Plus Jakarta Sans';
    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        return "'Plus Jakarta Sans', sans-serif";
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    // Button Shape Sync
    const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';
    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#121214] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1a1a1d] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#1a1a1d] border border-white/5 shadow-md';

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const nameParts = fullName.split(' ');
    const firstName = data?.profile?.firstName || data?.firstName || nameParts[0];

    // Animasi Muncul Berulang (Memicu Setiap Di-Scroll)
    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    const techStack = [
        { icon: 'fa-react', name: 'React', color: '#61dafb' },
        { icon: 'fa-js', name: 'JavaScript', color: '#f7df1e' },
        { icon: 'fa-node-js', name: 'Node.js', color: '#339933' },
        { icon: 'fa-figma', name: 'Figma', color: '#f24e1e' },
        { icon: 'fa-aws', name: 'AWS', color: '#ff9900' },
        { icon: 'fa-docker', name: 'Docker', color: '#2496ed' },
        { icon: 'fa-python', name: 'Python', color: '#3776ab' },
        { icon: 'fa-git-alt', name: 'Git', color: '#f34f29' },
    ];

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 0, 85';
    };

    return (
        <main className={`min-h-screen bg-[#09090b] text-slate-200 font-sans selection:bg-white/20 overflow-hidden p-4 @md:p-6 @lg:p-8 bento-theme @container`}>

            <style dangerouslySetInnerHTML={{
                __html: `
        .bento-theme { font-family: ${customBodyFont}; }
        .bento-theme *:not(i) { font-family: ${customBodyFont}; }
        .bento-theme .custom-heading { font-family: ${customHeadingFont} !important; }
        .bento-theme .custom-body { font-family: ${customBodyFont} !important; }
        
        .bento-card {
          background-color: ${cardStyle === 'hard-shadow' || cardStyle === 'hard' ? '#1a1a1d' : cardStyle === 'soft-shadow' || cardStyle === 'soft' ? '#121214' : '#121214'};
          border: ${cardStyle === 'hard-shadow' || cardStyle === 'hard' ? '2px solid white' : cardStyle === 'soft-shadow' || cardStyle === 'soft' ? '1px solid transparent' : '1px solid rgba(255,255,255,0.06)'};
          border-radius: ${theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? '0' : theme?.buttonShape === 'pill' ? '32px' : '24px'};
          box-shadow: ${cardStyle === 'hard-shadow' || cardStyle === 'hard' ? '6px 6px 0 0 white' : cardStyle === 'soft-shadow' || cardStyle === 'soft' ? '0 20px 50px rgba(0,0,0,0.5)' : 'inset 0 1px 1px rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.5)'};
          overflow: hidden;
          position: relative;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .bento-card:hover {
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-4px);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.6);
        }
        
        .bento-card-colored {
          background-color: var(--hl);
          color: #000;
          border: none;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.3), 0 10px 30px rgba(0,0,0,0.5);
        }
        .bento-card-colored:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 20px 40px rgba(var(--hl-rgb), 0.4);
        }
 
        .scroller {
          max-width: 100%;
          overflow: hidden;
          -webkit-mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
          mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
        }
        .scroller__inner {
          display: flex;
          width: max-content;
          animation: ${isCardPreview ? 'none' : 'scroll 25s linear infinite'};
        }
        .scroller__inner:hover { animation-play-state: paused; }
        @keyframes scroll { to { transform: translateX(-50%); } }
      `}} />

            <div 
                className={`w-full max-w-[1800px] mx-auto grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4`} 
                style={{ '--hl': highlightColor, '--hl-rgb': hexToRgb(highlightColor) } as React.CSSProperties}
            >

                {/* HERO SECTION - MOBILE RESPONSIVE FIX */}
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                    className={`bento-card flex flex-col justify-between p-8 @lg:p-12 @lg:col-span-3 @lg:row-span-3`}
                >
                    <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] blur-[120px] rounded-full mix-blend-screen pointer-events-none opacity-30 @container" style={{ backgroundColor: highlightColor }}></div>

                    

                    {/* Identitas Atas */}
                    <div className="relative z-10 flex flex-col mt-2 @lg:mt-8">
                        <h1 className={`font-black tracking-tighter text-white uppercase text-[5rem] @md:text-[8rem] @lg:text-[10rem] leading-[0.8] mb-2`}>
                            <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                        </h1>
                        <h2 className={`font-extrabold tracking-tight text-transparent bg-clip-text text-3xl @md:text-5xl @lg:text-6xl mb-6`} style={{ backgroundImage: `linear-gradient(to right, ${highlightColor}, #ffffff)` }}>
                            <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                        </h2>
                        <p className={`text-slate-400 font-medium leading-relaxed max-w-2xl text-base @lg:text-xl mt-4`}>
                            <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />
                        </p>
                    </div>

                    {/* Interaksi Bawah (Telah diperbaiki untuk Mobile) */}
                    <div className={`relative z-10 flex w-full flex-row gap-4 mt-16`}>
                        
                        <div onClick={handleCopyEmail} className={`flex-1 bg-[#1a1a1d] hover:bg-[#222226] border border-white/5 flex items-center gap-3 @md:gap-4 cursor-pointer transition-colors group shadow-lg ${radiusClass} p-2 pr-6`}>
                            <div className={`${radiusClass} bg-black/50 flex shrink-0 items-center justify-center group-hover:bg-[var(--hl)] group-hover:text-black transition-colors w-12 h-12`}>
                                <i className={`fas ${isCopied ? 'fa-check' : 'fa-paper-plane'} text-lg`}></i>
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <span className={`text-slate-500 font-bold uppercase tracking-widest leading-none text-[10px] mb-1.5`}>Send a Message</span>
                                <span className={`font-bold text-white truncate leading-none group-hover:text-[var(--hl)] transition-colors text-sm @md:text-base`}>
                                    {isCopied ? 'Copied to clipboard!' : userEmail}
                                </span>
                            </div>
                        </div>

                        <div className={`bg-[#1a1a1d] border border-white/5 flex flex-col justify-center shadow-lg relative overflow-hidden @sm:w-1/3 ${radiusClass} p-2 px-6 items-center text-center`}>
                            <i className={`fas fa-globe-asia absolute text-white/5 pointer-events-none -right-2 -bottom-4 text-5xl`}></i>
                            
                            {/* Layout Location & Time di mobile dibuat menyamping agar lebih rapi */}
                            <div className={`flex z-10 w-full flex-col items-center`}>
                                <span className={`text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1`}><EditableText value={location} field="location" entity="profile" isEditor={isEditor} as="span" maxLength={25} /></span>
                                <span className={`font-bold text-white text-sm @md:text-base`}>{currentTime || "00:00"}</span>
                            </div>
                        </div>

                    </div>
                </motion.div>

                {/* AVATAR BOX */}
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                    className={`bento-card p-2 relative group @lg:col-span-1 @lg:row-span-3`}
                >
                    <div className="w-full h-full rounded-[24px] overflow-hidden relative bg-[#1a1a1d]">
                        <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>
                </motion.div>

                {/* STATS BOX */}
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                    className={`bento-card flex flex-col items-start justify-center p-8 group @lg:col-span-1 @lg:row-span-1`}
                >
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2"><EditableText value={theme?.customTexts?.stats_archive || 'Total Archive'} field="stats_archive" entity="appearance" isEditor={isEditor} maxLength={20} as="span" /></span>
                    <h3 className="text-6xl font-black text-white group-hover:text-[var(--hl)] transition-colors">{archiveItems.length}</h3>
                </motion.div>

                {/* SOCIAL BOX */}
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                    className={`bento-card flex flex-row p-3 gap-3 @lg:col-span-1 @lg:row-span-1`}
                >
                    <a href={githubLink?.url || '#'} target="_blank" rel="noreferrer" className={`flex-1 ${cardRadiusClass} bg-[#1a1a1d] border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors group cursor-pointer text-slate-400 min-h-[100px]`}>
                        <i className={`fab fa-github text-4xl group-hover:scale-110 transition-transform ${!githubLink && 'opacity-20'}`}></i>
                    </a>
                    <a href={linkedinLink?.url || '#'} target="_blank" rel="noreferrer" className={`flex-1 ${cardRadiusClass} bg-[#1a1a1d] border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-[#0a66c2] hover:text-white transition-colors group cursor-pointer text-slate-400 min-h-[100px]`}>
                        <i className={`fab fa-linkedin-in text-4xl group-hover:scale-110 transition-transform ${!linkedinLink && 'opacity-20'}`}></i>
                    </a>
                </motion.div>

                {/* COLORED CTA BOX */}
                <Link href={`/${subdomain}/gallery`} scroll={false} className={`@lg:col-span-2 @lg:row-span-1`}>
                    <motion.div 
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                        className="bento-card bento-card-colored w-full h-full p-8 flex items-center justify-between group cursor-pointer"
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70"><EditableText value={theme?.customTexts?.cta_subtitle || 'Complete Portfolio'} field="cta_subtitle" entity="appearance" isEditor={isEditor} maxLength={25} as="span" /></span>
                            <h3 className="text-2xl @md:text-3xl font-black tracking-tight"><EditableText value={theme?.customTexts?.cta_title || 'View All Works'} field="cta_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" /></h3>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                            <i className="fas fa-arrow-right -rotate-45 text-xl group-hover:rotate-0 transition-transform duration-300"></i>
                        </div>
                    </motion.div>
                </Link>

                {/* TECH STACK MARQUEE */}
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                    className={`bento-card flex items-center p-6 @md:p-8 gap-6 overflow-hidden @lg:col-span-4 @lg:row-span-1 flex-row`}
                >
                    <div className="shrink-0">
                        <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1"><EditableText value={theme?.customTexts?.tech_subtitle || 'Tech Stack'} field="tech_subtitle" entity="appearance" isEditor={isEditor} maxLength={25} as="span" /></p>
                        <h4 className="text-xl font-bold text-white whitespace-nowrap"><EditableText value={theme?.customTexts?.tech_title || 'My Arsenal'} field="tech_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" /></h4>
                    </div>
                    <div className="scroller w-full relative flex items-center">
                        <div className="scroller__inner">
                            <div className="flex gap-4 pr-4">
                                {[...techStack, ...techStack, ...techStack].map((tech, i) => (
                                    <div key={`t1-${i}`} className={`${cardStyleClass} ${cardRadiusClass} flex items-center justify-center w-14 h-14 shrink-0 transition-colors cursor-crosshair group`}>
                                        <i className={`fab ${tech.icon} text-2xl text-slate-500 transition-colors duration-300 group-hover:text-[var(--hl)]`}></i>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* PROJECTS GRID */}
                {archiveItems.map((p: any, i: number) => {
                    const spanClass = 'col-span-1 aspect-[4/5] ' + (i === 2 || i === 3 ? '@lg:col-span-4 @lg:row-span-3 @lg:aspect-auto' : '@lg:col-span-2 @lg:row-span-3 aspect-square @lg:aspect-auto');
                    const isVideo = p.projectType === 'video';
                    
                    return (
                        <motion.div
                            key={i}
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim}
                            onClick={() => {
                                if (isVideo || p.projectType === 'photo') {
                                    setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                } else if (p.mediaUrl) {
                                    window.open(p.mediaUrl, '_blank');
                                }
                            }}
                            className={`bento-card p-2 @md:p-3 group relative overflow-hidden flex flex-col justify-end cursor-pointer ${spanClass}`}
                        >
                            <div className={`w-full h-full ${cardRadiusClass} overflow-hidden relative`}>
                                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700"></div>

                                {isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-[var(--hl)] group-hover:border-transparent transition-all duration-500">
                                            <i className="fas fa-play text-white text-lg ml-1"></i>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 w-full p-6 @lg:p-8 flex flex-col gap-2 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex justify-between items-center w-full mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">{p.projectType}</span>
                                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <i className="fas fa-arrow-right -rotate-45"></i>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl @md:text-3xl font-black text-white line-clamp-2 leading-tight">{p.title}</h3>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* 3D SHOWCASE */}
                {items3D.length > 0 && (
                    <motion.div
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim}
                        className={`bento-card p-6 @md:p-8 @lg:col-span-4 @lg:row-span-auto`}
                    >
                        <div className="flex flex-col @md:flex-row justify-between items-start @md:items-end mb-8 gap-4">
                            <div>
                                <h3 className="text-xl @md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                                    <i className="fas fa-cube text-[var(--hl)]"></i> <EditableText value={theme?.customTexts?.models_title || '3D Models'} field="models_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                                </h3>
                                <p className="custom-body text-sm text-slate-400 mt-2"><EditableText value={theme?.customTexts?.models_subtitle || 'Interactive spatial assets'} field="models_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} as="span" /></p>
                            </div>
                            <span className={`text-[10px] font-bold tracking-widest uppercase text-[var(--hl)] bg-[#1a1a1d] px-4 py-2 ${radiusClass} border border-white/10`}>{items3D.length} Items</span>
                        </div>

                        <div className="flex flex-col gap-6">
                            {items3D.map((p: any, i: number) => (
                                <div key={p.id || i} className={`group relative overflow-hidden ${cardStyleClass} ${cardRadiusClass} p-4 hover:border-[var(--hl)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(var(--hl-rgb),0.15)]`}>
                                    <div className="relative w-full aspect-video rounded-[24px] overflow-hidden bg-[#121214]">
                                        <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#121214" />
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--hl)]/30 rounded-[24px] pointer-events-none transition-colors duration-300"></div>
                                    </div>
                                    <div className="flex justify-between items-center mt-6 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-1 opacity-60">Asset 0{i+1}</span>
                                            <h4 className="font-bold text-white text-2xl group-hover:text-[var(--hl)] transition-colors">{p.title}</h4>
                                            {p.description && <p className="text-sm text-slate-400 mt-2 line-clamp-2 max-w-2xl">{p.description}</p>}
                                        </div>
                                        <div className="hidden @md:flex w-12 h-12 rounded-full border border-white/10 items-center justify-center text-slate-500 group-hover:bg-[var(--hl)] group-hover:text-black transition-all">
                                            <i className="fas fa-cube"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* INTEGRATIONS */}
                {data?.id && (
                    <motion.div 
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                        className={`bento-card p-0 @lg:col-span-4 @lg:row-span-auto mb-6`}
                    >
                        <PenpotShowcase userId={data.id} variant="bento" themeColor={highlightColor} />
                        <CanvaShowcase userId={data.id} variant="bento" themeColor={highlightColor} />
                    </motion.div>
                )}

                {/* GITHUB STATS */}
                {data?.id && (
                    <motion.div 
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                        className={`bento-card p-0 @lg:col-span-4 @lg:row-span-auto`}
                    >
                        <GithubStats userId={data.id} variant="bento" themeColor={highlightColor} />
                    </motion.div>
                )}

                {/* AWARDS SECTION */}
                {awardItems.length > 0 && (
                    <motion.div 
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                        className={`bento-card flex flex-col p-6 @lg:p-10 @lg:col-span-4 @lg:row-span-auto`}
                    >
                        <h3 className="text-xl @md:text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <i className="fas fa-award text-[var(--hl)]"></i> <EditableText value={theme?.customTexts?.awards_title || 'Honors & Awards'} field="awards_title" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
                        </h3>
                        <div className={`grid gap-4 grid-cols-2 @lg:grid-cols-4`}>
                            {awardItems.slice(0, 4).map((award: any, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => award.mediaUrl && setSelectedMedia({ url: award.mediaUrl, title: award.title, type: 'certificate' })}
                                    className={`${cardStyleClass} ${cardRadiusClass} flex flex-col gap-4 p-4 hover:bg-white/5 transition-colors group cursor-pointer overflow-hidden`}
                                >
                                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black relative border border-white/5">
                                        <LazyImage src={award.mediaUrl} alt={award.title} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-[var(--hl)] transition-colors">{award.title}</h4>
                                        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">{award.issuer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* TESTIMONIALS SECTION */}
                {testimonials.length > 0 && (
                    <motion.div 
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                        className={`bento-card flex flex-col p-6 @lg:p-10 @lg:col-span-4 @lg:row-span-auto`}
                    >
                        <h3 className="text-xl @md:text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <i className="fas fa-comment-dots text-[var(--hl)]"></i> <EditableText value={theme?.customTexts?.testimonials_title || 'Client Voices'} field="testimonials_title" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
                        </h3>
                        <div className={`grid gap-4 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3`}>
                            {testimonials.map((t: any, i: number) => (
                                <div
                                    key={t.id}
                                    className={`${cardStyleClass} ${cardRadiusClass} flex flex-col gap-4 p-6 hover:bg-white/5 transition-colors group`}
                                >
                                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                        {t.avatarUrl ? (
                                            <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-12 h-12 rounded-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg text-white">
                                                {t.clientName.charAt(0)}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <h4 className="font-bold text-white leading-tight">{t.clientName}</h4>
                                            {t.company && <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t.company}</span>}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 italic leading-relaxed">
                                        "{t.content}"
                                    </p>
                                    <div className="mt-auto pt-2 flex gap-1">
                                        {[...Array(5)].map((_, idx) => (
                                            <i key={idx} className={`text-xs ${idx < t.rating ? 'fas fa-star text-[var(--hl)]' : 'far fa-star text-white/10'}`}></i>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* FOOTER */}
                <motion.footer 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                    className={`bento-card flex flex-col @md:flex-row justify-between items-center gap-6 p-8 @lg:p-10 @lg:col-span-4 @lg:row-span-1`}
                >
                    <div className="flex flex-col text-center @md:text-left">
                        <h3 className="text-xl @md:text-2xl font-black text-white mb-1"><EditableText value={theme?.customTexts?.footer_title || 'Ready to build?'} field="footer_title" entity="appearance" isEditor={isEditor} maxLength={30} as="span" /></h3>
                        <a href={`mailto:${userEmail}`} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                            {userEmail}
                        </a>
                    </div>
                    
                    <div className="flex flex-col items-center @md:items-end gap-4">
                        <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-slate-500">
                            <span>© {new Date().getFullYear()} {fullName}</span>
                            <Link href={`/${subdomain}`} className="hover:text-[var(--hl)] transition-colors">PORTFO.BE</Link>
                        </div>
                    </div>
                </motion.footer>

            </div>

            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 @md:p-10"
                    >
                        <div className="absolute inset-0 bg-[#09090b]/90 backdrop-blur-xl" onClick={() => setSelectedMedia(null)}></div>
                        <motion.div
                            initial={{ y: 30, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 90, damping: 20 }}
                            className="relative w-full max-w-6xl bento-card flex flex-col overflow-hidden rounded-[32px]"
                        >
                            <div className="flex justify-between items-center px-5 py-3 @md:px-8 border-b border-white/5 bg-[#121214]">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">Now Playing</span>
                                    <h3 className="text-lg @md:text-xl font-black text-white leading-tight">{selectedMedia.title}</h3>
                                </div>
                                <button onClick={() => setSelectedMedia(null)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shrink-0">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div 
                                className="w-full bg-black"
                                style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}
                            >
                                {selectedMedia.type === 'video' ? (
                                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                ) : (
                                    <div className="w-full flex items-center justify-center p-4 @md:p-10">
                                        <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}