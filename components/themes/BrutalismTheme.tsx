"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
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
import { TestimonialSection } from '@/components/features/testimonials/TestimonialSection';
import { EditableText } from '@/components/ui/EditableText';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export default function BrutalismTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
  const [openAward, setOpenAward] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
  useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const pathname = usePathname();
  
  // Utilitas Responsif Tailwind
  // Data Parsing & Konfigurasi Tema
  const rawThemeColor = theme?.themeColor || "#000000";
  const themeColor = isValidHexColor(rawThemeColor) ? rawThemeColor : "#ff3300"; // Default warna neon orange/merah khas brutalism
  const fontHeading = theme?.fontHeading || "Space Mono";
  const fontBody = theme?.fontBody || "Space Mono"; // Brutalism sering menggunakan Mono untuk body juga

  const fullName = data?.profile?.fullName || data?.fullName || "JOHN DOE";
  const nameParts = fullName.split(' ');
  const firstName = data?.profile?.firstName || data?.firstName || nameParts[0];
  const lastName = data?.profile?.lastName || data?.lastName || nameParts.slice(1).join(' ');
  const profession = data?.profile?.profession || data?.profession || "SYSTEM ARCHITECT";
  const bio = data?.profile?.bio || data?.bio || "Executing raw logic into brutal visual experiences. Unapologetic design systems.";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const userEmail = data?.email || data?.user?.email || `connect@${subdomain}.net`;

  const allProjects = data?.projects || data?.user?.projects || [];
  const items3D = allProjects.filter((p: any) => p.projectType === '3d');
  const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
  const awardItems = data?.certificates || data?.user?.certificates || [];
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];
  const testimonials = data?.testimonials || data?.user?.testimonials || [];

  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=000000&textColor=ffffff`;

  const cardStyle = theme?.cardStyle || 'hard-shadow';
  const buttonShape = theme?.buttonShape || 'hard';

  // Memaksa Brutalism Style (Border Tebal)
  const strokeWidth = "border-[3px] border-black";

  // Dynamic Shadows based on cardStyle
  const hardShadow = cardStyle === 'flat' ? 'shadow-none' :
    (cardStyle === 'soft-shadow' || cardStyle === 'soft') ? 'shadow-xl' :
      'shadow-[6px_6px_0px_0px_#000]';

  const hardShadowHover = cardStyle === 'flat' ? 'hover:bg-black hover:text-white transition-colors' :
    (cardStyle === 'soft-shadow' || cardStyle === 'soft') ? 'hover:shadow-2xl hover:-translate-y-1 transition-all' :
      'hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all';

  // Dynamic Border Radius based on buttonShape
  const radiusClass = buttonShape === 'pill' ? 'rounded-full' :
    buttonShape === 'rounded' ? 'rounded-2xl' :
      'rounded-none';

  const getFontFamily = (fontName: string) => {
    if (fontName === 'sans-serif' || fontName === 'Inter') return "'Inter', sans-serif";
    return "'Space Mono', monospace";
  };

  const customHeadingFont = getFontFamily(fontHeading);
  const customBodyFont = getFontFamily(fontBody);

  // Animasi Brutal: Kaku, Cepat, Tanpa Elasticity
  const brutalEase = [0, 0, 0, 1] as any; // Step-like feel

  // --- ANIMASI STABILISASI ---
  // Kita gunakan animate="visible" untuk editor agar langsung tampil tanpa pemicu scroll (yang sering rusak di preview)
  // Tapi tetap gunakan whileInView untuk live site agar ada efek scroll reveal.
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const starkReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: brutalEase } 
    }
  };

  const slideInHard = {
    hidden: { x: -40, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: { duration: 0.4, ease: brutalEase } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.12 } 
    }
  };

  return (
    // Container Utama: Latar warna putih mentah, border tebal
    <main className={`relative w-full min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-black selection:text-white @container overflow-x-hidden brutal-theme ${isCardPreview ? '' : 'p-4 @sm:p-6'}`} style={{ '--hl': themeColor } as React.CSSProperties}>

      <style dangerouslySetInnerHTML={{
        __html: `
        .brutal-theme .custom-heading { font-family: ${customHeadingFont} !important; }
        .brutal-theme .custom-body { font-family: ${customBodyFont} !important; }
        .brutal-theme *:not(i) { font-family: inherit; }
        
        .brutal-theme::-webkit-scrollbar { width: 10px; border-left: 3px solid black; }
        .brutal-theme::-webkit-scrollbar-track { background: #f4f4f0; }
        .brutal-theme::-webkit-scrollbar-thumb { background: black; }

        /* Ticker Marquee untuk Header */
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .brutal-theme .animate-marquee { animation: ${isCardPreview ? 'none' : 'marquee 15s linear infinite'}; }

        .brutal-theme .brutal-hover-invert:hover {
            background-color: black !important;
            color: white !important;
        }
      `}} />

      {/* KOTAK KONTEN UTAMA */}
      <div className={`w-full max-w-[1400px] mx-auto bg-white ${strokeWidth} ${hardShadow} relative z-10 flex flex-col`}>

        {/* DEKORASI SUDUT TANDA SILANG (+) */}
        <div className="absolute -top-3 -left-3 text-xl font-bold font-mono">+</div>
        <div className="absolute -top-3 -right-3 text-xl font-bold font-mono">+</div>
        <div className="absolute -bottom-3 -left-3 text-xl font-bold font-mono">+</div>
        <div className="absolute -bottom-3 -right-3 text-xl font-bold font-mono">+</div>

        {/* ================= HEADER / NAVBAR ================= */}
        {/* PERUBAHAN: once: false agar di-trigger ulang saat scroll */}
        <motion.header
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal}
          className={`w-full ${strokeWidth} border-t-0 border-x-0 bg-white ${!(isCardPreview || isEditor) ? 'sticky top-0 z-[100]' : 'relative z-10'}`}
        >
          {/* Ticker Tape Atas */}
          <div className={`w-full border-b-[3px] border-black overflow-hidden py-1 flex bg-[var(--hl)] text-black font-mono text-[10px] font-black uppercase tracking-widest`}>
            <div className="w-[200%] flex animate-marquee whitespace-nowrap">
              <span className="w-1/2 flex justify-around">
                <span>SYSTEM: ONLINE</span>
                <span>[ DATA STREAM ACTIVE ]</span>
                <span>RAW OUTPUT</span>
                <span>{profession}</span>
              </span>
              <span className="w-1/2 flex justify-around">
                <span>SYSTEM: ONLINE</span>
                <span>[ DATA STREAM ACTIVE ]</span>
                <span>RAW OUTPUT</span>
                <span>{profession}</span>
              </span>
            </div>
          </div>

          {/* Nav Bar Utama */}
          <div className="flex justify-between items-stretch">
            <div className={`flex-1 border-r-[3px] border-black flex items-center bg-white ${'p-4 @sm:p-6'}`}>
              <h2 className={"custom-heading text-lg @sm:text-2xl font-black uppercase tracking-tighter leading-none"}>
                <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} /> <br /> <EditableText value={lastName} field="lastName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
              </h2>
            </div>

            <div className={`hidden ${'@md:flex'} font-mono text-xs font-bold uppercase`}>
              <a href="#work" className="px-8 border-r-[3px] border-black flex items-center justify-center brutal-hover-invert transition-none">
                [ WORK_LOG ]
              </a>
              <a href="#awards" className="px-8 border-r-[3px] border-black flex items-center justify-center brutal-hover-invert transition-none">
                [ CERTS ]
              </a>
            </div>

            <button
              onClick={() => setIsContactOpen(!isContactOpen)}
              className={`bg-black text-white font-mono text-xs @sm:text-sm font-bold uppercase flex items-center justify-center hover:bg-[var(--hl)] hover:text-black transition-none focus:outline-none px-6 @sm:px-10 ${radiusClass}`}
            >
              {isContactOpen ? 'CLOSE_X' : 'COMMUNICATE'}
            </button>
          </div>

          {/* Dropdown Menu Kontak (Gaya Kertas Turun) */}
          <div className={`w-full border-t-[3px] border-black bg-[#f4f4f0] font-mono transition-all duration-300 origin-top overflow-hidden ${isContactOpen ? 'max-h-[500px]' : 'max-h-0 border-t-0'}`}>
            <div className={`p-6 ${'@sm:p-10'} flex flex-col ${'@md:flex-row'} gap-10`}>
              <div className="flex-1">
                <span className="text-[10px] font-bold bg-black text-white px-2 py-1 uppercase tracking-widest inline-block mb-4">DIRECT_LINE</span>
                <a href={`mailto:${userEmail}`} className={"block text-2xl @sm:text-4xl font-black custom-heading hover:text-[var(--hl)] hover:underline decoration-[3px] underline-offset-4 break-words"}>
                  {userEmail}
                </a>
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold bg-black text-white px-2 py-1 uppercase tracking-widest inline-block mb-4">NETWORK_LINKS</span>
                <div className="flex flex-col gap-2">
                  {links.length > 0 ? links.map((l: any, i: number) => (
                    <a key={i} href={l.url} target="_blank" rel="noreferrer" className="text-sm @sm:text-base font-bold uppercase hover:bg-black hover:text-white w-max px-2 transition-none">
                      -&gt; {l.platform}
                    </a>
                  )) : <span className="text-xs text-gray-500">NO EXTERNAL NODES.</span>}
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* ================= HERO SECTION (NEWSPAPER GRID) ================= */}
        {/* PERUBAHAN: once: false agar di-trigger ulang saat scroll */}
        <motion.section
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
          className={`w-full grid grid-cols-1 ${'@md:grid-cols-12'} border-b-[3px] border-black`}
        >
          {/* Kiri: Avatar & Tagline */}
          <div className={`col-span-1 @md:col-span-4 border-b-[3px] border-black @md:border-b-0 @md:border-r-[3px] flex flex-col`}>
            <motion.div variants={starkReveal} className={"w-full aspect-square border-b-[3px] border-black bg-gray-200 relative overflow-hidden group p-4 @sm:p-8 bg-[#f4f4f0]"}>
              {/* Background Raster Dot Pattern */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '15px 15px' }}></div>

              <LazyImage
                src={displayAvatar}
                className={`w-full h-full object-cover grayscale contrast-150 border-[3px] border-black ${hardShadow} ${radiusClass} transition-transform duration-300 group-hover:scale-[1.02] bg-white`}
                alt="Profile"
              />
            </motion.div>
            <div className="p-6 bg-[var(--hl)] text-black font-mono flex-1">
              <motion.p variants={slideInHard} className={"text-xl @sm:text-2xl font-black uppercase leading-tight custom-heading"}>
                <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
              </motion.p>
            </div>
          </div>

          {/* Kanan: Bio Raksasa */}
          <div className={`col-span-1 @md:col-span-8 p-4 @sm:p-12 @lg:p-20 flex flex-col justify-center bg-white`}>
            <motion.div variants={starkReveal} className={"mb-4 font-mono text-[9px] @sm:text-xs font-bold uppercase border-l-[3px] border-black pl-4"}>
              ID // {subdomain.toUpperCase()} <br />
              STATUS // OPERATIONAL
            </motion.div>

            <motion.h1 variants={starkReveal} className={"custom-heading text-sm @sm:text-lg @md:text-[1.1cqi] font-bold uppercase leading-normal tracking-tight mb-8 break-words text-left"}>
              <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />
            </motion.h1>

            <motion.div variants={starkReveal} className="flex flex-wrap gap-4">
              <button onClick={() => setIsContactOpen(true)} className={`flex-1 @sm:flex-none font-mono text-xs @sm:text-sm font-bold bg-black text-white px-8 py-4 border-[3px] border-black ${hardShadow} ${hardShadowHover} ${radiusClass}`}>
                INITIATE
              </button>
              <a href="#work" className={`flex-1 @sm:flex-none font-mono text-xs @sm:text-sm font-bold bg-white text-black px-8 py-4 border-[3px] border-black ${hardShadow} ${hardShadowHover} text-center flex items-center justify-center ${radiusClass}`}>
                SCROLL ↓
              </a>
            </motion.div>
          </div>
        </motion.section>

        {/* ================= DATA BAR (STATS) ================= */}
        {/* PERUBAHAN: once: false agar di-trigger ulang saat scroll */}
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal}
          className={`w-full grid grid-cols-2 border-b-[3px] border-black font-mono uppercase bg-black text-white divide-x-[3px] divide-black`}
        >
          <div className={"p-3 @sm:p-6 flex flex-col @sm:flex-row justify-between items-center bg-white text-black brutal-hover-invert transition-none text-center @sm:text-left"}>
            <span className={"text-[10px] @sm:text-xs font-bold"}><EditableText value={theme?.customTexts?.stats_projects || 'PROJECTS'} field="stats_projects" entity="appearance" isEditor={isEditor} maxLength={15} as="span" /></span>
            <span className={"text-xl @sm:text-4xl font-black custom-heading"}>{archiveItems.length}</span>
          </div>
          <div className={"p-3 @sm:p-6 flex flex-col @sm:flex-row justify-between items-center bg-[var(--hl)] text-black brutal-hover-invert transition-none text-center @sm:text-left"}>
            <span className={"text-[10px] @sm:text-xs font-bold"}><EditableText value={theme?.customTexts?.stats_awards || 'AWARDS'} field="stats_awards" entity="appearance" isEditor={isEditor} maxLength={15} as="span" /></span>
            <span className={"text-xl @sm:text-4xl font-black custom-heading"}>{awardItems.length}</span>
          </div>
        </motion.div>

        {/* ================= ARCHIVE SECTION ================= */}
        <section id="work" className="w-full flex flex-col border-b-[3px] border-black bg-[#f4f4f0]">
          {/* PERUBAHAN: once: false agar di-trigger ulang saat scroll */}
          <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className={"p-6 border-b-[3px] border-black bg-white"}>
            <h2 className={"custom-heading text-4xl @sm:text-5xl font-black uppercase tracking-tighter"}><EditableText value={theme?.customTexts?.projects_title || 'INDEX_OF_WORK'} field="projects_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" /></h2>
          </motion.div>

          <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
            className={`grid grid-cols-1 ${'@md:grid-cols-2'}`}
          >
            {archiveItems.length > 0 ? archiveItems.map((p: any, i: number) => {
              const isVideo = p.projectType === 'video';
              const isOdd = i % 2 !== 0;

              return (
                <motion.div
                  variants={starkReveal}
                  key={i}
                  onClick={() => {
                    if (isVideo || p.projectType === 'photo') {
                      setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                    } else if (p.mediaUrl) {
                      window.open(p.mediaUrl, '_blank');
                    }
                  }}
                  className={`group flex flex-col bg-white border-b-[3px] border-black ${!isOdd ? '@md:border-r-[3px]' : ''} cursor-pointer brutal-theme-item brutal-hover-invert transition-none`}
                >
                  {/* Header Kartu */}
                  <div className={"flex justify-between items-center p-4 border-b-[3px] border-black font-mono text-[10px] @sm:text-xs font-bold uppercase bg-[#f4f4f0] group-hover:bg-black group-hover:text-white transition-none group-hover:border-white"}>
                    <span className="bg-black text-white group-hover:bg-white group-hover:text-black px-2 py-1">FILE_0{i + 1}</span>
                    <span>[{p.projectType}]</span>
                  </div>

                  {/* Gambar */}
                  <div className={"w-full aspect-video border-b-[3px] border-black bg-gray-200 relative overflow-hidden group-hover:border-white transition-none p-4 @sm:p-6 bg-[#f4f4f0]"}>
                    <div className={`w-full h-full border-[3px] border-black bg-white overflow-hidden relative group-hover:border-white ${hardShadow} ${radiusClass}`}>
                      <LazyImage
                        src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl}
                        className="w-full h-full object-cover grayscale contrast-125 mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-300"
                        alt={p.title}
                      />
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-[var(--hl)] text-black border-[3px] border-black px-6 py-2 font-mono font-bold text-xs shadow-[4px_4px_0px_0px_#000] group-hover:bg-white transition-colors">PLAY_PREVIEW</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <h3 className={"custom-heading text-2xl @sm:text-3xl @md:text-4xl font-black uppercase tracking-tighter mb-4 leading-none"}>{p.title}</h3>
                    <p className={"custom-body font-mono text-xs @sm:text-sm font-bold uppercase leading-relaxed line-clamp-3"}>
                      &gt; {p.description || 'NO ADDITIONAL DATA PROVIDED FOR THIS RECORD.'}
                    </p>
                  </div>
                </motion.div>
              );
            }) : (
              <div className={`col-span-2 p-12 text-center font-mono text-sm font-bold uppercase bg-black text-white`}>
                [ NULL ] NO ARCHIVE DATA FOUND IN DATABASE.
              </div>
            )}
          </motion.div>

          {/* Tombol Gallery */}
          {/* PERUBAHAN: once: false agar di-trigger ulang saat scroll */}
          <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className={"p-6 @sm:p-12 flex justify-center bg-white border-t-[3px] border-black"}>
            <Link href={`/${subdomain}/gallery`} scroll={false}>
              <button className={`bg-[var(--hl)] text-black border-[3px] border-black font-mono font-black uppercase px-8 @sm:px-16 py-4 @sm:py-6 text-sm @sm:text-lg ${hardShadow} ${hardShadowHover} ${radiusClass}`}>
                <EditableText value={theme?.customTexts?.explore_archive || 'ACCESS FULL DATABASE'} field="explore_archive" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
              </button>
            </Link>
          </motion.div>
        </section>

        {/* ================= 3D SHOWCASE SECTION ================= */}
        {items3D.length > 0 && (
          <section className="w-full flex flex-col border-b-[3px] border-black bg-[#f4f4f0]">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className={"p-6 border-b-[3px] border-black bg-white"}>
              <h2 className={"custom-heading text-4xl @sm:text-5xl font-black uppercase tracking-tighter"}><EditableText value={theme?.customTexts?.models_title || '3D_MODELS'} field="models_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" /></h2>
            </motion.div>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer} className="flex flex-col">
              {items3D.map((p: any, i: number) => {
                return (
                  <motion.div key={i} variants={starkReveal} className={`group flex flex-col bg-white border-b-[3px] border-black brutal-theme-item transition-none`}>
                    <div className={"flex justify-between items-center p-6 border-b-[3px] border-black font-mono text-xs @sm:text-sm font-black uppercase bg-[#f4f4f0] group-hover:bg-black group-hover:text-white transition-none group-hover:border-white"}>
                      <span className="bg-black text-white group-hover:bg-white group-hover:text-black px-4 py-2">3D_RENDER_0{i + 1}</span>
                      <span className="tracking-widest">[{p.title}]</span>
                    </div>
                    <div className={"w-full aspect-[4/3] @md:aspect-video border-b-[3px] border-black bg-gray-200 relative overflow-hidden transition-none p-6 @sm:p-12 bg-[#f4f4f0]"}>
                      <div className={`w-full h-full border-[3px] border-black bg-white overflow-hidden relative ${hardShadow} ${radiusClass}`}>
                        <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#ffffff" />
                      </div>
                    </div>
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <h3 className={"custom-heading text-2xl @sm:text-3xl font-black uppercase tracking-tighter mb-2 leading-none"}>{p.title}</h3>
                      {p.description && <p className={"custom-body font-mono text-[10px] @sm:text-xs font-bold uppercase leading-relaxed line-clamp-2"}>&gt; {p.description}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>
        )}

        {/* ================= INTEGRATIONS ================= */}
        {data?.id && (
          <section className="w-full bg-white border-b-[3px] border-black">
            <PenpotShowcase userId={data.id} variant="brutalism" themeColor={themeColor} />
            <CanvaShowcase userId={data.id} variant="brutalism" themeColor={themeColor} />
          </section>
        )}

        {/* ================= GITHUB STATS ================= */}
        {data?.id && (
          <section className="w-full bg-white border-b-[3px] border-black">
            <GithubStats userId={data.id} variant="brutalism" themeColor={themeColor} />
          </section>
        )}

        {/* ================= AWARDS SECTION ================= */}
        {awardItems.length > 0 && (
          <section id="awards" className="w-full bg-white border-b-[3px] border-black">
            {/* PERUBAHAN: once: false agar di-trigger ulang saat scroll */}
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className="p-6 border-b-[3px] border-black bg-black text-white">
              <h2 className={"custom-heading text-4xl @sm:text-5xl font-black uppercase tracking-tighter"}><EditableText value={theme?.customTexts?.awards_title || 'VERIFIED_RECORDS'} field="awards_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" /></h2>
            </motion.div>

            <motion.div
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
              className="flex flex-col"
            >
              {awardItems.map((award: any, idx: number) => (
                <motion.div
                  variants={starkReveal}
                  key={award.id}
                  className={`flex flex-col border-b-[3px] border-black last:border-b-0`}
                >
                  {/* List Baris */}
                  <div
                    className={"p-4 @sm:p-6 flex flex-col @sm:flex-row justify-between items-start @sm:items-center cursor-pointer brutal-hover-invert transition-none"}
                    onClick={() => setOpenAward(openAward === award.id ? null : award.id)}
                  >
                    <div className={"flex items-center gap-4 @sm:gap-8 w-full @sm:w-auto"}>
                      <span className={"font-mono text-lg @sm:text-2xl font-black"}>
                        {openAward === award.id ? '[-]' : '[+]'}
                      </span>
                      <span className={"font-mono text-xs @sm:text-sm font-bold px-2 py-1 bg-gray-200 text-black hidden @sm:block"}>
                        {award.year || new Date(award.createdAt).getFullYear()}
                      </span>
                      <h3 className={"custom-heading text-xl @sm:text-3xl @md:text-4xl font-black uppercase tracking-tighter truncate max-w-[200px] @sm:max-w-[400px]"}>
                        {award.title}
                      </h3>
                    </div>
                    <div className={"mt-2 @sm:mt-0 pl-12 @sm:pl-0 font-mono text-[10px] @sm:text-xs font-bold uppercase text-left @sm:text-right"}>
                      {award.issuer || 'ISSUER UNKNOWN'} <br />
                      <span className="bg-black text-white px-2 py-1 mt-1 inline-block">{award.status || 'VALID'}</span>
                    </div>
                  </div>

                  {/* Konten Expand */}
                  <div className={`overflow-hidden transition-all duration-300 font-mono bg-[#f4f4f0] ${openAward === award.id ? 'max-h-[800px] border-t-[3px] border-black' : 'max-h-0'}`}>
                    <div className={"p-6 @sm:p-10 flex flex-col @md:flex-row gap-6 @sm:gap-10"}>
                      <div className={`w-full @md:w-1/3 aspect-[4/3] bg-white border-[3px] border-black p-2 ${hardShadow} ${radiusClass}`}>
                        <LazyImage src={award.mediaUrl || "https://via.placeholder.com/400x300?text=NO+IMAGE"} className={`w-full h-full object-cover grayscale contrast-125 ${radiusClass}`} alt="Certificate" />
                      </div>
                      <div className={"w-full @md:w-2/3 flex flex-col justify-center"}>
                        <p className={`text-xs @sm:text-sm font-bold uppercase mb-6 leading-relaxed bg-white border-[3px] border-black p-4 ${radiusClass}`}>
                          &gt; {award.description || 'Details of the certification are secured in the main databank.'}
                        </p>
                        <a href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" className={`w-max bg-black text-white font-bold text-xs @sm:text-sm px-6 py-3 border-[3px] border-transparent hover:bg-white hover:text-black hover:border-black transition-none ${radiusClass}`}>
                          ACCESS ATTACHMENT_
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* ================= TESTIMONIALS ================= */}
        {testimonials.length > 0 && (
          <section className="w-full bg-white border-b-[3px] border-black">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className="p-6 border-b-[3px] border-black bg-[var(--hl)] text-black">
              <h2 className={"custom-heading text-4xl @sm:text-5xl font-black uppercase tracking-tighter"}><EditableText value={theme?.customTexts?.testimonials_title || 'CLIENT_RECORDS'} field="testimonials_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" /></h2>
            </motion.div>
            <div className="p-8 @lg:p-12">
              <TestimonialSection testimonials={testimonials} variant="grid" />
            </div>
          </section>
        )}

        {/* ================= FOOTER TERMINAL ================= */}
        {/* PERUBAHAN: once: false agar di-trigger ulang saat scroll */}
        <motion.footer initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className="w-full flex flex-col">
          <div className={"p-12 @sm:p-20 flex flex-col items-center justify-center text-center border-b-[3px] border-black bg-[var(--hl)]"}>
            <h2 className={"custom-heading text-5xl @sm:text-7xl @md:text-[8cqi] font-black uppercase tracking-tighter leading-[0.8] mb-8"}>
              <EditableText value={theme?.customTexts?.cta_title || 'END OF TRANSMISSION'} field="cta_title" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
            </h2>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`bg-black text-white font-mono font-bold uppercase px-8 py-4 text-xs @sm:text-sm border-[3px] border-black ${hardShadow} ${hardShadowHover} ${radiusClass}`}>
              RETURN TO TOP ^
            </button>
          </div>

          <div className={"p-6 bg-white font-mono text-[10px] @sm:text-xs font-bold uppercase flex flex-col @sm:flex-row justify-between items-center gap-4"}>
            <span>© {new Date().getFullYear()} {fullName}.SYS</span>
            <div className={"flex gap-4 @sm:gap-6 flex-wrap justify-center"}>
              {links.length > 0 ? links.map((l: any, i: number) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:bg-black hover:text-white px-2 py-1 transition-none">
                  [{l.platform}]
                </a>
              )) : <span>[NO_LINKS]</span>}
            </div>
          </div>
        </motion.footer>

      </div>
      {/* BRUTAL MEDIA MODAL */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 @md:p-10"
          >
            {/* Raw Backdrop */}
            <div className="absolute inset-0 bg-[#f4f4f0]/90 backdrop-blur-sm" onClick={() => setSelectedMedia(null)}></div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, rotate: -1 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.9, opacity: 0, rotate: 1 }}
              className={`relative w-full max-w-5xl bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_#000] flex flex-col overflow-hidden ${radiusClass}`}
            >
              {/* Industrial Header */}
              <div className="flex justify-between items-center p-4 @md:p-8 border-b-[4px] border-black bg-[var(--hl)] text-black relative z-10">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] bg-black text-white px-2 py-0.5 w-max mb-2">RECORD_VIEWER</span>
                  <h3 className="custom-heading font-black uppercase tracking-tighter text-2xl @md:text-4xl">{selectedMedia.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedMedia(null)}
                  className="w-14 h-14 bg-black text-white flex items-center justify-center hover:bg-white hover:text-black border-l-[4px] border-black transition-none group"
                >
                  <i className="fas fa-times text-xl group-hover:rotate-90 transition-transform duration-200"></i>
                </button>
              </div>

              {/* Player / Content */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className={`relative w-full ${selectedMedia.type === 'video' ? 'aspect-video' : 'max-h-[60vh]'} bg-gray-100 flex items-center justify-center p-4 border-b-[4px] border-black`}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}></div>
                
                {selectedMedia.type === 'video' ? (
                  <div className={`w-full h-full border-[4px] border-black ${hardShadow} bg-black`}>
                    <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                  </div>
                ) : (
                  <div className={`w-full h-full flex items-center justify-center bg-white border-[4px] border-black ${hardShadow}`}>
                    <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[50vh] object-contain grayscale hover:grayscale-0 transition-all duration-500 p-2" />
                  </div>
                )}
              </motion.div>

              {/* Bottom Info Bar */}
              <div className="p-4 flex justify-between items-center bg-white px-6 @md:px-10 font-mono">
                <div className="flex items-center gap-4 hidden @md:flex">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">BUFFERING_READY</span>
                  <div className="w-20 h-2 bg-gray-200 border border-black">
                    <div className="w-3/4 h-full bg-black"></div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMedia(null)}
                  className="text-[10px] font-bold uppercase tracking-[0.5em] text-black hover:bg-black hover:text-white px-4 py-2 transition-none border-2 border-transparent hover:border-black"
                >
                  DISCONNECT_X
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}