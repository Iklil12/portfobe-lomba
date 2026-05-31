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

export default function AbsoluteNoirTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
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
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const totalProjects = allProjects.length;
    const totalAwards = awardItems.length;
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const nameParts = fullName.toUpperCase().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'SYSTEM';

    // Font & Button Shape Sync
    const fontHeading = theme?.fontHeading || 'Inter';
    const fontBody = theme?.fontBody || 'Inter';
    const buttonShape = theme?.buttonShape || 'hard';
    const radiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-xl' : 'rounded-none';

    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        return "'Inter', sans-serif";
    };
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    const smoothEase = [0.33, 1, 0.68, 1] as any;
    const wireframeReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
    };

    const staggerGrid = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="relative noir-root">
        <main className="relative bg-[#050505] text-white font-sans selection:bg-white selection:text-black @container tracking-tight noir-theme">
            <style dangerouslySetInnerHTML={{
                    __html: `
            .noir-theme .font-sans { font-family: ${customHeadingFont} !important; }
            .noir-theme .font-mono { font-family: ${customBodyFont} !important; }
            @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .animate-ticker { animation: ticker 30s linear infinite; }
            .wire-border-b { border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
            .wire-border-r { border-right: 1px solid rgba(255, 255, 255, 0.1); }
            .hover-invert:hover { background-color: white !important; color: black !important; }
          `}} />

            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={wireframeReveal} 
                className="w-full wire-border-b overflow-hidden bg-white text-black py-2 pt-8 @md:pt-2"
            >
                <div className="flex animate-ticker font-mono text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap w-max">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center gap-8 px-4 pr-8">
                            <EditableText value={theme?.customTexts?.noir_ticker_title || 'PORTFO_BE V.2.0'} field="noir_ticker_title" entity="appearance" isEditor={isEditor} maxLength={25} />
                            <EditableText value={theme?.customTexts?.noir_ticker_status || '[ STATUS: ACTIVE ]'} field="noir_ticker_status" entity="appearance" isEditor={isEditor} maxLength={25} />
                            <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={20} />
                            <EditableText value={theme?.customTexts?.noir_ticker_location || 'LOCATION: ID'} field="noir_ticker_location" entity="appearance" isEditor={isEditor} maxLength={20} />
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="w-full flex flex-col @lg:flex-row wire-border-b">
                <div className="w-full @lg:w-8/12 flex flex-col">
                    <motion.div variants={wireframeReveal} className="p-6 @md:p-12 wire-border-b flex-1 flex flex-col justify-center overflow-hidden">
                        <h1 className="font-sans font-black text-[14cqw] @md:text-[12cqw] @lg:text-[8cqw] leading-[0.9] uppercase tracking-tighter break-words">
                            <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                        </h1>
                        <h1 className="font-sans font-black text-[14cqw] @md:text-[12cqw] @lg:text-[8cqw] leading-[0.9] uppercase tracking-tighter break-words text-transparent" style={{ WebkitTextStroke: '2px white' }}>
                            <EditableText value={lastName || '.'} field="lastName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                        </h1>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 @md:grid-cols-2">
                        <motion.div variants={wireframeReveal} className="p-6 wire-border-b @md:wire-border-b-0 @md:wire-border-r flex flex-col justify-between min-h-[200px]">
                            <span className="font-mono text-xs text-white/50 uppercase">
                                <EditableText value={theme?.customTexts?.noir_overview_label || '[ OVERVIEW ]'} field="noir_overview_label" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />
                            </span>
                            <p className="font-sans text-sm @md:text-base font-medium leading-relaxed mt-4">
                                <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />
                            </p>
                        </motion.div>
                        <motion.div variants={wireframeReveal} className="p-0 flex flex-col justify-end">
                            <button onClick={handleCopyEmail} className="w-full h-full min-h-[100px] hover-invert wire-border-t @md:wire-border-t-0 p-6 flex flex-col justify-between items-start group transition-colors">
                                <span className="font-mono text-xs uppercase">
                                    <EditableText value={theme?.customTexts?.noir_contact_label || '[ CONTACT ]'} field="noir_contact_label" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />
                                </span>
                                <span className="font-sans text-2xl font-bold uppercase mt-4">
                                    {isCopied ? 'COPIED TO CLIPBOARD' : <EditableText value={theme?.customTexts?.noir_contact_button || 'INITIATE COMM'} field="noir_contact_button" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />}
                                </span>
                            </button>
                        </motion.div>
                    </div>
                </div>

                <motion.div variants={wireframeReveal} className="w-full @lg:w-4/12 wire-border-t @lg:wire-border-t-0 @lg:wire-border-l flex flex-col bg-[#0a0a0a]">
                    <div className="p-4 wire-border-b flex justify-between font-mono text-[10px] uppercase text-white/50">
                        <EditableText value={theme?.customTexts?.noir_img_ref || 'IMG_REF_01'} field="noir_img_ref" entity="appearance" isEditor={isEditor} maxLength={15} as="span" />
                        <EditableText value={theme?.customTexts?.noir_img_res || 'HQ_RESOLUTION'} field="noir_img_res" entity="appearance" isEditor={isEditor} maxLength={15} as="span" />
                    </div>
                    <div className="w-full aspect-square @lg:aspect-auto @lg:flex-1 p-6 relative group overflow-hidden">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 z-10 pointer-events-none"></div>
                        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/20 z-10 pointer-events-none"></div>
                        <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale-[100%] contrast-[1.3] brightness-90 group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-4 wire-border-t font-mono text-xs text-center uppercase tracking-widest bg-white text-black font-bold">
                        <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={20} />
                    </div>
                </motion.div>
            </motion.section>

            <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="w-full flex flex-col @md:flex-row wire-border-b bg-[#050505]">
                <motion.div variants={wireframeReveal} className="flex-1 p-8 @md:p-12 wire-border-b @md:wire-border-b-0 @md:wire-border-r flex flex-col items-start justify-center group hover-invert transition-colors">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-white/50 group-hover:text-black/50">
                        <EditableText value={theme?.customTexts?.stats_projects || '[ ARCHIVED_PROJECTS ]'} field="stats_projects" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                    </span>
                    <h3 className="font-sans font-black text-6xl @md:text-8xl tracking-tighter leading-none">{totalProjects < 10 ? `0${totalProjects}` : totalProjects}</h3>
                </motion.div>
                <motion.div variants={wireframeReveal} className="flex-1 p-8 @md:p-12 wire-border-b @md:wire-border-b-0 @md:wire-border-r flex flex-col items-start justify-center group hover-invert transition-colors">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-white/50 group-hover:text-black/50">
                        <EditableText value={theme?.customTexts?.stats_recognition || '[ RECOGNITIONS ]'} field="stats_recognition" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                    </span>
                    <h3 className="font-sans font-black text-6xl @md:text-8xl tracking-tighter leading-none">{totalAwards < 10 ? `0${totalAwards}` : totalAwards}</h3>
                </motion.div>
                <motion.div variants={wireframeReveal} className="flex-1 p-8 @md:p-12 flex flex-col items-start justify-center group hover-invert transition-colors">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-white/50 group-hover:text-black/50">
                        <EditableText value={theme?.customTexts?.noir_stats_uptime || '[ SYSTEM_UPTIME ]'} field="noir_stats_uptime" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                    </span>
                    <h3 className="font-sans font-black text-6xl @md:text-8xl tracking-tighter leading-none">99<span className="text-2xl @md:text-4xl">%</span></h3>
                </motion.div>
            </motion.section>

            <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} id="work" className="w-full flex flex-col">
                <motion.div variants={wireframeReveal} className="w-full py-4 px-6 wire-border-b flex justify-between items-center bg-[#0a0a0a]">
                    <span className="font-mono text-sm uppercase tracking-widest">
                        <EditableText value={theme?.customTexts?.noir_archive_label || '[ SYSTEM_ARCHIVE ]'} field="noir_archive_label" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                    </span>
                    <span className="font-mono text-xs text-white/50">
                        <EditableText value={theme?.customTexts?.noir_archive_displaying || 'DISPLAYING:'} field="noir_archive_displaying" entity="appearance" isEditor={isEditor} maxLength={15} as="span" /> {archiveItems.length} <EditableText value={theme?.customTexts?.noir_archive_items || 'ITEMS'} field="noir_archive_items" entity="appearance" isEditor={isEditor} maxLength={10} as="span" />
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 @md:grid-cols-12 auto-rows-min">
                    {archiveItems.map((p: any, i: number) => {
                        const isVideo = p.projectType === 'video';
                        const colSpan = i % 2 === 0 ? '@md:col-span-8' : '@md:col-span-4';
                        const borderRight = i % 2 === 0 ? '@md:wire-border-r' : '';

                        return (
                            <motion.div
                                key={i}
                                variants={wireframeReveal}
                                onClick={() => {
                                    if (isVideo || p.projectType === 'photo') {
                                        setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                    } else if (p.mediaUrl) {
                                        window.open(p.mediaUrl, '_blank');
                                    }
                                }}
                                className={`group flex flex-col w-full wire-border-b ${colSpan} ${borderRight} hover-invert cursor-pointer bg-[#050505] transition-colors`}
                            >
                                <div className="p-4 flex justify-between items-center wire-border-b group-hover:border-black transition-colors">
                                    <span className="font-mono text-[10px] uppercase">ID_0{i + 1}</span>
                                    <span className="font-mono text-[10px] uppercase border border-white/30 group-hover:border-black px-2 py-1">{p.projectType}</span>
                                </div>
                                
                                <div className="w-full aspect-[4/3] @md:aspect-video relative overflow-hidden bg-black p-4">
                                    <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover grayscale-[100%] contrast-[1.4] wire-border group-hover:border-black group-hover:opacity-80 transition-all duration-300" />
                                    {isVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500">
                                                <i className="fas fa-play text-xs ml-1"></i>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 wire-border-t group-hover:border-black transition-colors flex flex-col justify-between h-full">
                                    <h3 className="font-sans text-2xl @lg:text-4xl font-black uppercase tracking-tight mb-4">{p.title}</h3>
                                    <p className="font-mono text-xs text-white/60 group-hover:text-black leading-relaxed">
                                        {p.description || 'Data rendering complete. Visual metrics optimized for viewing.'}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div variants={wireframeReveal} className="w-full">
                    <Link href={`/${subdomain}/gallery`} scroll={false} className="w-full flex items-center justify-between p-8 @md:p-12 bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 group border-b-2 border-transparent hover:border-white">
                        <div className="flex flex-col items-start">
                            <span className="font-mono text-[10px] @md:text-xs font-bold uppercase tracking-[0.3em] mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                <EditableText value={theme?.customTexts?.noir_explore_label || '[ DATA_OVERFLOW ]'} field="noir_explore_label" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />
                            </span>
                            <span className="font-sans font-black text-3xl @md:text-6xl uppercase tracking-tighter group-hover:italic group-hover:pl-4 transition-all duration-300">
                                <EditableText value={theme?.customTexts?.explore_archive || 'Explore Archive'} field="explore_archive" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />
                            </span>
                        </div>
                        <div className="w-16 h-16 @md:w-24 @md:h-24 flex items-center justify-center border-4 border-black group-hover:border-white rounded-full transition-colors duration-300 shrink-0 ml-4">
                            <i className="fas fa-arrow-right text-2xl @md:text-4xl -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                        </div>
                    </Link>
                </motion.div>
            </motion.section>

            {/* 3D SHOWCASE SECTION */}
            {items3D.length > 0 && (
                <section className="p-8 @md:p-12 border-t border-white/10 bg-[#050505] text-white wire-border-b">
                    <motion.div
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
                        variants={wireframeReveal}
                        className="mb-10 flex justify-between items-end"
                    >
                        <div>
                            <h2 className="font-sans font-black text-3xl @md:text-5xl tracking-tighter uppercase mb-2">
                                <EditableText value={theme?.customTexts?.models_title || '3D Models'} field="models_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                            </h2>
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                                <EditableText value={theme?.customTexts?.models_subtitle || 'Interactive Viewer'} field="models_subtitle" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                            </span>
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 bg-white/5 px-2 py-1 border border-white/10">{items3D.length} <EditableText value={theme?.customTexts?.noir_models_assets || 'ASSETS'} field="noir_models_assets" entity="appearance" isEditor={isEditor} maxLength={15} as="span" /></span>
                    </motion.div>

                    <motion.div
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
                        variants={staggerGrid}
                        className="grid grid-cols-1 gap-12"
                    >
                        {items3D.map((p: any, i: number) => (
                            <motion.div key={p.id || i} variants={wireframeReveal} className="group flex flex-col gap-4">
                                <div className="w-full border border-white/20 bg-[#0a0a0a] overflow-hidden transition-all duration-500 hover:border-white/50 p-1">
                                    <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0a0a0a" />
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg @md:text-xl font-black uppercase tracking-tight text-white mb-1">{p.title}</h3>
                                        {p.description && <p className="text-xs text-white/60 font-mono max-w-lg">{p.description}</p>}
                                    </div>
                                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 bg-white/5 px-2 py-1 border border-white/10 shrink-0">OBJ</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            )}

            {/* INTEGRATIONS */}
            {data?.id && (
                <div className="w-full">
                    <PenpotShowcase userId={data.id} variant="noir" />
                    <CanvaShowcase userId={data.id} variant="noir" />
                </div>
            )}

            {/* GITHUB STATS */}
            {data?.id && (
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="w-full">
                    <GithubStats userId={data.id} variant="noir" />
                </motion.div>
            )}

            {awardItems.length > 0 && (
                <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} id="awards" className="w-full">
                    <motion.div variants={wireframeReveal} className="w-full py-4 px-6 wire-border-b flex items-center bg-[#0a0a0a]">
                        <span className="font-mono text-sm uppercase tracking-widest">
                            <EditableText value={theme?.customTexts?.awards_title || '[ CERTIFICATIONS_LOG ]'} field="awards_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                        </span>
                    </motion.div>

                    <motion.div variants={wireframeReveal} className="w-full overflow-x-auto">
                        <table className="w-full text-left font-mono text-xs @md:text-sm whitespace-normal break-words">
                            <thead className="bg-[#111]">
                                <tr>
                                    <th className="p-4 wire-border-b wire-border-r font-normal text-white/50 w-16 @md:w-24 align-top">
                                        <EditableText value={theme?.customTexts?.noir_cert_year || 'YEAR'} field="noir_cert_year" entity="appearance" isEditor={isEditor} maxLength={10} as="span" />
                                    </th>
                                    <th className="p-4 wire-border-b wire-border-r font-normal text-white/50 align-top">
                                        <EditableText value={theme?.customTexts?.noir_cert_designation || 'DESIGNATION'} field="noir_cert_designation" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />
                                    </th>
                                    <th className="p-4 wire-border-b wire-border-r font-normal text-white/50 align-top">
                                        <EditableText value={theme?.customTexts?.noir_cert_issuer || 'ISSUER'} field="noir_cert_issuer" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />
                                    </th>
                                    <th className="p-4 wire-border-b font-normal text-white/50 text-right align-top">
                                        <EditableText value={theme?.customTexts?.noir_cert_status || 'STATUS'} field="noir_cert_status" entity="appearance" isEditor={isEditor} maxLength={15} as="span" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {awardItems.map((award: any, i: number) => (
                                    <tr key={i} className="hover:bg-white hover:text-black transition-colors cursor-pointer group">
                                        <td className="p-4 wire-border-b group-hover:border-black/20 wire-border-r align-top">
                                            {award.year || new Date(award.createdAt).getFullYear()}
                                        </td>
                                        <td className="p-4 wire-border-b group-hover:border-black/20 wire-border-r font-bold font-sans text-sm @md:text-base uppercase align-top">
                                            {award.title}
                                        </td>
                                        <td className="p-4 wire-border-b group-hover:border-black/20 wire-border-r uppercase align-top">
                                            {award.issuer}
                                        </td>
                                        <td className="p-4 wire-border-b group-hover:border-black/20 text-right align-top">
                                            <span className="border border-white/30 group-hover:border-black px-2 py-1 inline-block mt-1">
                                                {award.status || 'VALID'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </motion.section>
            )}

            {testimonials.length > 0 && (
                <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} id="testimonials" className="w-full">
                    <motion.div variants={wireframeReveal} className="w-full py-4 px-6 wire-border-b flex items-center bg-[#0a0a0a]">
                        <span className="font-mono text-sm uppercase tracking-widest">
                            <EditableText value={theme?.customTexts?.testimonials_title || '[ CLIENT_ENDORSEMENTS ]'} field="testimonials_title" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                        </span>
                    </motion.div>

                    <div className="grid grid-cols-1 @lg:grid-cols-2">
                        {testimonials.map((t: any, i: number) => {
                            const isLastOdd = i === testimonials.length - 1 && testimonials.length % 2 !== 0;
                            return (
                                <motion.div key={t.id} variants={wireframeReveal} className={`p-8 @md:p-12 flex flex-col justify-between wire-border-b ${!isLastOdd && i % 2 === 0 ? '@lg:wire-border-r' : ''} ${isLastOdd ? '@lg:col-span-2' : ''} group hover-invert transition-colors`}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full border border-white/20 group-hover:border-black/20 overflow-hidden shrink-0">
                                            {t.avatarUrl ? (
                                                <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale-[100%] contrast-[1.2]" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-mono font-bold bg-white/5 group-hover:bg-black/5 text-white group-hover:text-black">
                                                    {t.clientName.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-sans font-black uppercase text-lg leading-tight tracking-tight">{t.clientName}</h4>
                                            <p className="font-mono text-[10px] uppercase text-white/50 group-hover:text-black/50">{t.company || 'CLIENT'}</p>
                                        </div>
                                        <div className="ml-auto flex gap-1">
                                            {[...Array(5)].map((_, idx) => (
                                                <i key={idx} className={`text-[10px] ${idx < t.rating ? 'fas fa-star text-white group-hover:text-black' : 'far fa-star text-white/20 group-hover:text-black/20'}`}></i>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="font-sans text-lg @md:text-xl font-medium leading-relaxed italic">
                                        "{t.content}"
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.section>
            )}

            <motion.footer initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="w-full flex flex-col bg-[#050505]">
                <motion.div variants={wireframeReveal} onClick={handleCopyEmail} className="w-full p-12 @md:p-32 flex flex-col items-center justify-center text-center wire-border-b hover:bg-white hover:text-black transition-colors cursor-pointer group">
                    <span className="font-mono text-xs uppercase tracking-[0.3em] mb-6 text-white/50 group-hover:text-black/50">
                        <EditableText value={theme?.customTexts?.noir_footer_status || '[ SYSTEM ALIGNMENT READY ]'} field="noir_footer_status" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
                    </span>
                    <h2 className="font-sans font-black text-[12cqw] @md:text-6xl @lg:text-[8cqw] leading-[1] uppercase tracking-tighter break-words">
                        {isCopied ? 'DATA COPIED' : <EditableText value={theme?.customTexts?.noir_footer_connect || 'CONNECT'} field="noir_footer_connect" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />}
                    </h2>
                </motion.div>

                <motion.div variants={wireframeReveal} className="w-full flex flex-col @md:flex-row justify-between items-center p-6 gap-6 font-mono text-[10px] uppercase text-white/50">
                    <span>
                        <EditableText value={theme?.customTexts?.noir_footer_eof || 'END_OF_FILE'} field="noir_footer_eof" entity="appearance" isEditor={isEditor} maxLength={20} as="span" /> © {new Date().getFullYear()}
                    </span>
                    <div className="flex gap-4">
                        {links.map((l: any, i: number) => (
                            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                                // {l.platform}
                            </a>
                        ))}
                    </div>
                </motion.div>
            </motion.footer>

        </main>

        {/* Modal rendered OUTSIDE the filtered main so fixed positioning works correctly */}
        <AnimatePresence>
            {selectedMedia && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-0 @md:p-10"
                >
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedMedia(null)}></div>
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-6xl bg-black flex flex-col overflow-hidden border border-white/10 shadow-2xl"
                    >
                        <div className="flex justify-between items-center px-4 py-3 @md:px-6 border-b border-white/10 bg-[#0a0a0a]">
                            <div className="flex flex-col">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">NOIR_PREVIEW_SYSTEM</span>
                                <h3 className="font-sans font-black uppercase text-lg @md:text-xl">{selectedMedia.title}</h3>
                            </div>
                            <button onClick={() => setSelectedMedia(null)} className="w-9 h-9 flex items-center justify-center bg-white text-black hover:invert transition-all shrink-0">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div 
                            className="w-full bg-black relative"
                            style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}
                        >
                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            {selectedMedia.type === 'video' ? (
                                <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                            ) : (
                                <div className="w-full flex items-center justify-center p-4 @md:p-12">
                                    <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain shadow-2xl border border-white/20" />
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-3 @md:px-6 flex justify-between items-center bg-[#0a0a0a] border-t border-white/10 font-mono text-[10px]">
                            <div className="flex items-center gap-4">
                                <span className="text-white/40">RESOLUTION: OPTIMIZED</span>
                                <span className="text-white/40">GRAYSCALE: 100%</span>
                            </div>
                            <button onClick={() => setSelectedMedia(null)} className="text-white hover:underline uppercase tracking-widest">/ EXIT_SYSTEM</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </div>
    );
}