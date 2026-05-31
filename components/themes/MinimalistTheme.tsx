"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { GithubStats } from '@/components/themes/widgets/GithubStats';
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { TestimonialSection } from '@/components/features/testimonials/TestimonialSection';
import { EditableText } from '@/components/ui/EditableText';


const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

// --- VARIANTS ANIMASI LEVEL DEWA (Dengan Koreografi Delay) ---
const premiumEase = [0.16, 1, 0.3, 1] as const;

// Menerima parameter 'custom' untuk mengatur urutan (delay) secara spesifik
const cinematicBlurUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

const cinematicBlurRight = {
  hidden: { opacity: 0, x: -40, filter: "blur(12px)" },
  visible: (customDelay = 0) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

const imageReveal = {
  hidden: { opacity: 0, scale: 1.1, filter: "blur(20px)" },
  visible: (customDelay = 0) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.6, ease: premiumEase, delay: customDelay }
  })
};

// Container Staggering (Menyusun urutan elemen di DALAM blok)
const getStaggerContainer = (delayStart = 0, staggerGap = 0.15) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

export default function MinimalistTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
  const [openAward, setOpenAward] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);

  // --- ANIMASI STABILISASI ---
  // Kita gunakan animate="visible" untuk editor agar langsung tampil tanpa pemicu scroll (yang sering rusak di preview)
  // Tapi tetap gunakan whileInView untuk live site agar ada efek scroll reveal.
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";


  const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
  const profession = data?.profile?.profession || data?.profession || "Director & Editor";
  const bio = data?.profile?.bio || data?.bio || "A visual storyteller based in Jakarta. I craft meticulous, high-end visual narratives for commercial brands and independent films.";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;
  const allProjects = data?.projects || data?.user?.projects || [];
  const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
  const items3D = allProjects.filter((p: any) => p.projectType === '3d');
  const awardItems = data?.certificates || data?.user?.certificates || [];
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];
  const testimonials = data?.testimonials || data?.user?.testimonials || [];

  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop`;

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const getFontFamily = (fontName: string) => {
    if (!fontName) return "'Inter', sans-serif";
    if (fontName.toLowerCase().includes('space') || fontName.toLowerCase().includes('mono')) return "'Space Mono', monospace";
    if (fontName.toLowerCase().includes('serif') || fontName.toLowerCase().includes('elegant')) return "'Playfair Display', serif";
    return "'Inter', sans-serif";
  };

  const headingFont = getFontFamily(theme?.fontHeading);
  const bodyFont = getFontFamily(theme?.fontBody);
  const themeColor = isValidHexColor(theme?.themeColor) ? theme?.themeColor : undefined;
  const buttonShape = theme?.buttonShape || 'rounded';
  const radiusClass = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-lg';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-white border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]' : 'bg-gray-50 border border-gray-200 shadow-sm';

  return (
    <div className={`flex w-full min-h-screen bg-white text-black relative min-body flex-col @lg:flex-row min-theme`}>
      <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />

      <style dangerouslySetInnerHTML={{
        __html: `
        .min-heading { font-family: ${headingFont} !important; }
        .min-body { font-family: ${bodyFont} !important; }
        .min-theme ::-webkit-scrollbar { width: 5px; height: 5px; }
        .min-theme ::-webkit-scrollbar-track { background: transparent; }
        .min-theme ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .min-theme ::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
        .min-theme * { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        .min-theme ::selection { background: #000000; color: #ffffff; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* 3D LOADING ANIMATION */
        @keyframes mv3d-spin { 0% { transform: rotateX(35deg) rotateY(0deg); } 100% { transform: rotateX(35deg) rotateY(360deg); } }
        @keyframes mv3d-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes mv3d-dash { 0% { stroke-dashoffset: 200; } 100% { stroke-dashoffset: 0; } }
        .mv3d-loader {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16px;
          background: linear-gradient(135deg, #fafafa 0%, #f4f4f5 50%, #fafafa 100%);
          z-index: 10;
        }
        .mv3d-cube {
          width: 56px; height: 56px; perspective: 200px;
        }
        .mv3d-cube-inner {
          width: 100%; height: 100%; position: relative;
          transform-style: preserve-3d;
          animation: mv3d-spin 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
        .mv3d-face {
          position: absolute; width: 100%; height: 100%;
          border: 2px solid #d4d4d8; background: rgba(0,0,0,0.02);
          border-radius: 4px;
        }
        .mv3d-face:nth-child(1) { transform: rotateY(0deg) translateZ(28px); }
        .mv3d-face:nth-child(2) { transform: rotateY(90deg) translateZ(28px); }
        .mv3d-face:nth-child(3) { transform: rotateY(180deg) translateZ(28px); }
        .mv3d-face:nth-child(4) { transform: rotateY(270deg) translateZ(28px); }
        .mv3d-face:nth-child(5) { transform: rotateX(90deg) translateZ(28px); }
        .mv3d-face:nth-child(6) { transform: rotateX(-90deg) translateZ(28px); }
        .mv3d-label {
          font-size: 9px; font-weight: 700; letter-spacing: 0.25em;
          text-transform: uppercase; color: #a1a1aa;
          animation: mv3d-pulse 2s ease-in-out infinite;
        }
        .mv3d-bar {
          width: 80px; height: 2px; background: #e4e4e7; border-radius: 2px; overflow: hidden;
        }
        .mv3d-bar-fill {
          width: 100%; height: 100%; background: #71717a; border-radius: 2px;
          animation: mv3d-dash 1.8s ease-in-out infinite alternate;
          transform-origin: left;
        }
      `}} />

      {/* --- KIRI: SIDEBAR (Mulai Animasi di Detik 0.1) --- */}
      <motion.aside
        initial="hidden" animate="visible" variants={getStaggerContainer(0.1, 0.15)}
        className={`bg-gray-50 border-gray-200 p-8 flex flex-col justify-between z-10 overflow-y-auto hide-scrollbar w-full @lg:w-[35%] @lg:sticky @lg:top-0 @lg:h-screen @lg:border-r @lg:p-12`}
      >
        <div>
          <div className="flex justify-between items-start mb-10 @container">
            <motion.h1 variants={cinematicBlurRight} className="text-2xl font-black tracking-tighter uppercase leading-none min-heading flex flex-col">
              <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" className="min-heading" maxLength={10} />
              <EditableText value={lastName || '.'} field="lastName" entity="profile" isEditor={isEditor} as="span" className="min-heading" maxLength={10} />
            </motion.h1>
            <motion.div variants={cinematicBlurRight} className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Available</span>
            </motion.div>
          </div>

          <motion.div variants={imageReveal} className="w-full aspect-square mb-8 relative group">
            <div className="w-full h-full overflow-hidden border border-gray-200 relative">
              <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
            {/* Verified Badge */}
            {(data?.plan !== 'FREE' || data?.userPlan !== 'FREE') && (data?.plan || data?.userPlan) && (
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${themeColor ? 'text-white' : 'bg-blue-500 text-white'} rounded-full border-[3px] border-white flex items-center justify-center text-[10px] shadow-lg z-20`} style={themeColor ? { backgroundColor: themeColor } : {}}>
                <i className="fas fa-check"></i>
              </div>
            )}
          </motion.div>

          <motion.h2 variants={cinematicBlurUp} className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3 min-heading">
            <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" className="min-heading" maxLength={20} />
          </motion.h2>
          <motion.p variants={cinematicBlurUp} className="text-gray-600 text-sm leading-relaxed mb-6 min-body">
            <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" className="min-body" maxLength={250} />
          </motion.p>

          <motion.ul variants={cinematicBlurUp} className="text-xs font-mono text-gray-500 space-y-2 mb-8 opacity-80">
            {[
              { id: 'skill_1', default: 'Minimalist Layout' },
              { id: 'skill_2', default: 'Clean Typography' },
              { id: 'skill_3', default: 'High-end Visuals' }
            ].map((item, idx) => (
              <motion.li key={idx} whileHover={{ x: 5, color: "#000" }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="cursor-default flex items-center gap-1.5">
                <span>→</span>
                <EditableText 
                  value={theme?.customTexts?.[item.id] || item.default} 
                  field={item.id} 
                  entity="appearance" 
                  isEditor={isEditor} 
                  maxLength={30} 
                  as="span"
                  className="min-body"
                />
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div variants={cinematicBlurUp} className={`pt-8 border-t border-gray-200 mt-8`}>
          <motion.a whileHover={{ scale: 1.02, originX: 0 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} href={`mailto:${userEmail}`} className="inline-block text-xl font-bold tracking-tight hover:text-gray-500 transition-colors mb-6 truncate min-heading">
            {userEmail}
          </motion.a>
          <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest">
            {links.map((l: any, i: number) => (
              <motion.a key={i} href={l.url} target="_blank" rel="noreferrer" whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }} className="text-gray-500 hover:text-black transition-colors relative inline-block group">
                {l.platform}
                <span className="absolute bottom-[-2px] left-0 w-0 h-px bg-black transition-all duration-300 ease-out group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.aside>

      {/* --- KANAN: MAIN CONTENT --- */}
      <main className={`bg-white w-full @lg:w-[65%]`}>

        {/* STATS SECTION */}
        <motion.section
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
          variants={getStaggerContainer(0.8, 0.2)} className="border-b border-gray-200"
        >
          <div className="grid grid-cols-2 border-b border-gray-200">
            <motion.div variants={cinematicBlurUp} className="p-8 border-r border-gray-200 flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 min-heading">
                <EditableText value={theme?.customTexts?.stats_projects || 'Projects'} field="stats_projects" entity="appearance" isEditor={isEditor} maxLength={15} className="min-heading" />
              </p>
              <motion.p className={`text-3xl @md:text-4xl font-black tracking-tighter min-heading flex items-center gap-2`}>
                <span className="min-heading">{(data?.projects || data?.user?.projects || []).length}</span>
                <EditableText value={theme?.customTexts?.stats_total || 'Total'} field="stats_total" entity="appearance" isEditor={isEditor} maxLength={15} className="min-heading" />
              </motion.p>
            </motion.div>
            <motion.div variants={cinematicBlurUp} className="p-8 flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 min-heading">
                <EditableText value={theme?.customTexts?.stats_recognition || 'Recognition'} field="stats_recognition" entity="appearance" isEditor={isEditor} maxLength={15} className="min-heading" />
              </p>
              <motion.p className={`text-3xl @md:text-4xl font-black tracking-tighter min-heading flex items-center gap-2`}>
                <span className="min-heading">{awardItems.length}</span>
                <EditableText value={theme?.customTexts?.stats_awards || 'Awards'} field="stats_awards" entity="appearance" isEditor={isEditor} maxLength={15} className="min-heading" />
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* PROJECTS SECTION */}
        <section className={`p-8 @lg:p-12`}>
          <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
            variants={cinematicBlurUp} custom={1.2}
            className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6"
          >
            <h2 className="text-2xl font-black uppercase tracking-tighter min-heading">
              <EditableText value={theme?.customTexts?.projects_title || 'Selected Index'} field="projects_title" entity="appearance" isEditor={isEditor} maxLength={25} className="min-heading" />
            </h2>
            <span className="text-[10px] font-mono text-gray-400 uppercase min-heading">
              <EditableText value={theme?.customTexts?.projects_subtitle || 'Archive'} field="projects_subtitle" entity="appearance" isEditor={isEditor} maxLength={15} className="min-heading" />
            </span>
          </motion.div>

          <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
            variants={getStaggerContainer(1.4, 0.25)}
            className={`grid grid-cols-1 gap-8 @md:grid-cols-2`}
          >
            {archiveItems.map((p: any, i: number) => {
              const isVideo = p.projectType === 'video';
              return (
                <motion.div
                  variants={cinematicBlurUp} whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  key={i} className="group cursor-pointer block"
                  onClick={() => {
                    if (isVideo || p.projectType === 'photo') {
                      setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                    } else if (p.mediaUrl) {
                      window.open(p.mediaUrl, '_blank');
                    }
                  }}
                >
                  <div className={`w-full aspect-[4/3] mb-4 overflow-hidden relative ${cardStyleClass} ${radiusClass}`}>
                    <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] grayscale group-hover:grayscale-0 group-hover:scale-110" />
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] 
                      ${isVideo
                        ? 'bg-transparent opacity-100'
                        : 'bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100'
                      }`}>
                      <div className={`flex items-center justify-center shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${radiusClass}
                        ${isVideo
                          ? 'w-12 h-12 bg-white/90 text-black opacity-100 scale-100 group-hover:scale-110'
                          : 'w-14 h-14 bg-white text-black opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 delay-100'
                        }`}>
                        <i className={`fas ${isVideo ? 'fa-play ml-1' : 'fa-arrow-right -rotate-45'}`}></i>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start mt-4">
                    <div>
                      <h3 className="text-base font-bold tracking-tight mb-1 min-heading group-hover:text-gray-600 transition-colors">{p.title}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{p.projectType}</p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 pt-1 group-hover:text-black transition-colors">0{i + 1}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          {/* --- MINIMALIST EXPLORE BUTTON --- */}
          <motion.div
            initial="hidden"
            {...{ [animationTrigger]: "visible" }}
            viewport={{ once: true }}
            variants={cinematicBlurUp}
            custom={0.3}
            className="w-full flex justify-center mt-16 mb-20 relative z-10"
          >
            <Link href={`/${subdomain}/gallery`} scroll={false} className="group inline-flex items-center gap-4 @md:gap-6 no-underline p-2">
              <span className="text-[10px] @md:text-xs font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors duration-500 relative min-heading">
                <EditableText value={theme?.customTexts?.explore_archive || 'EXPLORE ARCHIVE'} field="explore_archive" entity="appearance" isEditor={isEditor} maxLength={20} as="span" className="min-heading" />
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"></span>
              </span>
              <div className={`w-10 h-10 @md:w-12 @md:h-12 border border-gray-200 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-black group-hover:border-black shadow-sm group-hover:shadow-md overflow-hidden relative ${radiusClass}`}>
                <i className="fas fa-arrow-right absolute transform -translate-x-[150%] text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 text-[10px] @md:text-xs"></i>
                <i className="fas fa-arrow-right absolute transform translate-x-0 text-gray-400 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[150%] opacity-100 group-hover:opacity-0 text-[10px] @md:text-xs"></i>
              </div>
            </Link>
          </motion.div>
        </section>

        {/* 3D SHOWCASE SECTION */}
        {items3D.length > 0 && (
          <section className="border-t border-gray-200 bg-zinc-50/50">
            <motion.div
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
              variants={cinematicBlurUp} custom={0.2}
              className="p-8 @lg:p-12 pb-6 flex justify-between items-end"
            >
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter min-heading">3D Showcase</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Interactive Models</p>
              </div>
              <span className="text-[10px] font-mono text-gray-400 uppercase"><i className="fas fa-cube mr-1"></i> {items3D.length} Model{items3D.length > 1 ? 's' : ''}</span>
            </motion.div>

            <motion.div
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
              variants={getStaggerContainer(0.4, 0.3)}
              className="px-8 @lg:px-12 pb-12 grid grid-cols-1 gap-8"
            >
              {items3D.map((p: any, i: number) => (
                <motion.div key={p.id || i} variants={cinematicBlurUp} className="group w-full">
                  <div className={`w-full overflow-hidden relative hover:shadow-xl transition-shadow ${cardStyleClass} ${radiusClass}`}>
                    <Interactive3DViewer mediaUrl={p.mediaUrl} />
                  </div>
                  <div className="flex justify-between items-start mt-4">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight mb-1 min-heading">{p.title}</h3>
                      {p.description && <p className="text-xs text-gray-500 max-w-lg">{p.description}</p>}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1.5 border border-gray-200 shrink-0">3D Model</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* PENPOT SHOWCASE SECTION */}
        <PenpotShowcase userId={data?.userId || data?.user?.id || data?.id || ""} variant="minimalist" themeColor={themeColor} />
        <CanvaShowcase userId={data?.userId || data?.user?.id || data?.id || ""} variant="minimalist" themeColor={themeColor} />

        {/* OPEN SOURCE SECTION (GITHUB) */}
        <GithubStats userId={data?.userId || data?.user?.id || data?.id || ""} variant="minimalist" themeColor={themeColor} />

        {/* AWARDS SECTION */}
        <section className="border-t border-gray-200 bg-gray-50/30 overflow-hidden">
          <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={cinematicBlurUp} custom={0.2} className={`p-8 @lg:p-12 pb-6`}>
            <h2 className="text-2xl font-black uppercase tracking-tighter min-heading">
              <EditableText value={theme?.customTexts?.awards_title || 'Honors & Awards'} field="awards_title" entity="appearance" isEditor={isEditor} maxLength={25} className="min-heading" />
            </h2>
          </motion.div>

          <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={getStaggerContainer(0.4, 0.2)} className="border-t border-gray-200">
            {awardItems.length > 0 ? awardItems.map((award: any, i: number) => {
              const isOpen = openAward === award.id;
              return (
                <motion.div variants={cinematicBlurUp} key={i} className="border-b border-gray-200 group">
                  <div className={`px-8 @lg:px-12 py-6 flex justify-between items-center cursor-pointer transition-colors duration-500 hover:bg-gray-100 ${isOpen ? 'bg-gray-100' : 'bg-transparent'}`} onClick={() => setOpenAward(isOpen ? null : award.id)}>
                    <div className="flex items-center gap-4 @md:gap-8 w-2/3">
                      <span className={`font-mono text-[10px] text-gray-400 group-hover:text-black transition-colors @md:block`}>{award.year || new Date(award.createdAt).getFullYear()}</span>
                      <h3 className="text-sm @md:text-lg font-bold tracking-tight min-heading group-hover:translate-x-2 transition-transform duration-500 ease-out">{award.title}</h3>
                    </div>
                    <div className="flex items-center justify-end gap-6 w-1/3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest text-gray-500 @md:block text-right truncate`}>{award.issuer}</span>
                      <motion.i animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="fas fa-chevron-down text-[10px] text-gray-400" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: premiumEase }} className="overflow-hidden bg-white border-t border-gray-200">
                        <div className={`px-8 @lg:px-12 py-8 flex gap-8 flex-col @md:flex-row`}>
                          <motion.div initial={{ scale: 0.9, filter: "blur(5px)" }} animate={{ scale: 1, filter: "blur(0px)" }} transition={{ duration: 0.8, delay: 0.2, ease: premiumEase }} className={`bg-gray-50 border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center p-2 w-full @md:w-64`}>
                            <LazyImage src={award.mediaUrl} className="w-full h-auto object-contain grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700" alt="Certificate" />
                          </motion.div>

                          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: premiumEase }} className="flex flex-col justify-center flex-1">
                            <p className="font-bold mb-2 min-heading text-sm uppercase tracking-wider">{award.status || 'Verified Achievement'}</p>
                            <p className="text-xs text-gray-600 max-w-md leading-relaxed mb-6 opacity-90 min-body">{award.description || 'Awarded for exceptional performance and dedication in the respective field.'}</p>

                            <a href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-gray-500 transition-colors w-max relative group/btn min-heading">
                              <EditableText value={theme?.customTexts?.awards_view || 'Lihat Lampiran'} field="awards_view" entity="appearance" isEditor={isEditor} maxLength={20} as="span" className="min-heading" /> 
                              <i className="fas fa-arrow-right group-hover/btn:translate-x-1 transition-transform"></i>
                              <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-black transition-all duration-300 group-hover/btn:w-full"></span>
                            </a>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }) : (
              <div className="px-8 py-10 text-gray-400 text-sm font-mono border-b border-gray-200 text-center">
                <EditableText value={theme?.customTexts?.awards_empty || 'No awards recorded.'} field="awards_empty" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
              </div>
            )}
          </motion.div>
        </section>

        {/* TESTIMONIALS SECTION */}
        {testimonials.length > 0 && (
          <section className="border-t border-gray-200 bg-white">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={cinematicBlurUp} custom={0.2} className="p-8 @lg:p-12 pb-6">
              <TestimonialSection testimonials={testimonials} variant="grid" isEditor={isEditor} theme={theme} />
            </motion.div>
          </section>
        )}

        {/* FOOTER */}
        <motion.footer initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={cinematicBlurUp} custom={0.2} className={`p-8 text-center flex gap-4 bg-gray-100 border-t border-gray-200 min-body flex-col @md:flex-row @md:text-left justify-between @lg:p-12`}>
          <p className="text-[10px] font-mono text-gray-500">
            © {new Date().getFullYear()} {fullName}. <EditableText value={theme?.customTexts?.footer_rights || 'All Rights Reserved.'} field="footer_rights" entity="appearance" isEditor={isEditor} maxLength={30} as="span" className="min-body" />
          </p>
          <span className="text-[10px] font-bold uppercase tracking-widest text-black min-heading">portfo.be/{subdomain}</span>
        </motion.footer>
      </main>

      {/* --- MEDIA PLAYER MODAL --- */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 @md:p-10"
          >
            <div className="max-w-5xl w-full flex flex-col gap-6">
              <div className="flex justify-between items-center px-2">
                <div>
                  <h3 className="text-xl font-black tracking-tighter uppercase min-heading">{selectedMedia.title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                    {selectedMedia.type === 'video' ? 'Cinematic Presentation' : 'Visual Showcase'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className={`w-12 h-12 bg-black text-white flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-lg ${radiusClass}`}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className={`w-full ${selectedMedia.type === 'video' ? 'aspect-video bg-black' : 'max-h-[70vh] overflow-hidden bg-gray-50'} shadow-2xl relative flex items-center justify-center border border-gray-100 ${radiusClass}`}
              >
                {selectedMedia.type === 'video' ? (
                  <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
                    <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[65vh] object-contain shadow-sm" />
                  </div>
                )}
              </motion.div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
                >
                  [ CLOSE {selectedMedia.type === 'video' ? 'PLAYER' : 'PREVIEW'} ]
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}