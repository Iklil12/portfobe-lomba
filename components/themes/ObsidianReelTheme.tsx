"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { EditableText } from '@/components/ui/EditableText';
import { ReactLenis } from '@studio-freight/react-lenis';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { PenpotShowcase } from '@/components/themes/widgets/PenpotShowcase';
import { CanvaShowcase } from '@/components/themes/widgets/CanvaShowcase';
import { GithubStats } from '@/components/themes/widgets/GithubStats';

export default function ObsidianReelTheme({ data, theme, isMobileView = false, isCardPreview = false, isEditor = false }: { data: any, theme: any, isMobileView?: boolean, isCardPreview?: boolean, isEditor?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null>(null);
    
    useEscapeKey(() => setSelectedMedia(null), !!selectedMedia);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "Lacete Studio";
    const profession = data?.profile?.profession || data?.profession || "Video Production Studio";
    const bio = data?.profile?.bio || data?.bio || "We bring your ideas to life, creating content that not only meets but exceeds your expectations. From concept to final cut.";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    
    const allProjects = data?.projects || data?.user?.projects || [];
    const displayProjects = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d').slice(0, 4); // Exclude 3D and limit to 4
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];
    const services = data?.services || data?.user?.services || [
        { title: 'Post-Production', description: 'Offering comprehensive editing services to enhance video quality, including color correction, sound editing, and special effects.' },
        { title: 'Creative Development', description: 'Our creative team can create the scripts for your next commercial or film, ensuring the narrative aligns perfectly with your brand identity.' },
        { title: 'Drone & Aerial Video', description: 'We are commercial drone licensed and offer aerial photos and videos for real estate and other projects.' }
    ];

    const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
    const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
    const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1534938665420-4193d6aa2a28?q=80&w=2000&auto=format&fit=crop`;

    const videoProject = allProjects.find((p: any) => p.projectType === 'video');
    const photoProject = allProjects.find((p: any) => p.projectType === 'photo');
    const heroProject = videoProject || photoProject || null;
    
    const heroMediaUrl = heroProject?.mediaUrl || displayAvatar;
    const heroMediaTitle = heroProject?.title || 'Showreel';
    const heroMediaType = heroProject ? heroProject.projectType : 'video';
    const heroImageThumb = heroProject && heroProject.projectType === 'video' 
        ? getVideoThumbnail(heroProject.mediaUrl) 
        : heroMediaUrl;


    // Font Config
    const fontHeading = theme?.fontHeading || 'Outfit';
    const fontBody = theme?.fontBody || 'Inter';

    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('outfit')) return "'Outfit', sans-serif";
        if (f?.toLowerCase().includes('mono') || f?.toLowerCase().includes('space')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif') || f?.toLowerCase().includes('playfair')) return "'Playfair Display', serif";
        return "'Inter', sans-serif";
    };
    
    const customHeadingFont = getFontFamily(fontHeading);
    const customBodyFont = getFontFamily(fontBody);

    // Editor Controls
    const accentColor = theme?.themeColor || '#ffffff';
    
    // Map button shape from editor to Tailwind classes
    const getBtnShapeClass = (shape?: string) => {
        if (shape === 'hard' || shape === 'square') return 'rounded-none';
        if (shape === 'rounded') return 'rounded-md';
        return 'rounded-full'; // 'pill' or default
    };
    const btnShape = getBtnShapeClass(theme?.buttonShape);

    // Map card style from editor to Tailwind classes
    const getCardShapeClass = (style?: string) => {
        if (style === 'hard-shadow' || style === 'hard') {
            return 'rounded-none border-2 border-[rgba(255,255,255,0.2)] shadow-[6px_6px_0_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-[var(--brand-accent)] hover:shadow-[6px_6px_0_0_var(--brand-accent)]';
        }
        if (style === 'flat') {
            return 'rounded-none border border-[rgba(255,255,255,0.1)] hover:border-[var(--brand-accent)] transition-colors duration-300';
        }
        if (style === 'soft-shadow' || style === 'soft') {
            return 'rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-xl hover:shadow-[0_8px_30px_rgb(255,255,255,0.1)] transition-all duration-300';
        }
        return 'rounded-2xl'; // default
    };
    const cardShape = getCardShapeClass(theme?.cardStyle);
    
    // Determine text color on top of accent color for readability
    const accentText = (accentColor === '#000000' || accentColor === '#0f172a' || accentColor === '#166534') ? '#ffffff' : '#000000';

    const revealVariants: any = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };
    
    const staggerReveal: any = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const isSmoothScroll = theme?.customTexts?.smooth_scroll === 'true';

    const content = (
        <div className="relative obsidian-root bg-[#050505] text-[#f5f5f5] min-h-screen">
            <style dangerouslySetInnerHTML={{
                __html: `
                .obsidian-theme {
                    --brand-bg: #050505;
                    --brand-text: #f5f5f5;
                    --brand-muted: #8a8a93;
                    --brand-border: rgba(255, 255, 255, 0.1);
                    --brand-accent: ${accentColor};
                    --accent-text: ${accentText};
                }
                .obsidian-theme .font-heading { font-family: ${customHeadingFont} !important; }
                .obsidian-theme .font-body { font-family: ${customBodyFont} !important; }
                .obsidian-theme ::selection { background: rgba(255,255,255,0.2); color: #fff; }
                .obsidian-img-container { overflow: hidden; }
                .obsidian-img-container img { transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1); }
                .obsidian-img-container:hover img { transform: scale(1.05); }
                
                .obsidian-btn-primary {
                    background-color: var(--brand-accent);
                    color: var(--accent-text);
                }
                .obsidian-btn-primary:hover {
                    opacity: 0.9;
                    transform: scale(1.02);
                }
                .obsidian-btn-outline:hover {
                    background-color: var(--brand-accent) !important;
                    color: var(--accent-text) !important;
                }
                .hover-accent:hover {
                    color: var(--brand-accent) !important;
                }
                .group:hover .group-hover-accent {
                    color: var(--brand-accent) !important;
                }
                .group:hover .group-hover-bg-accent {
                    background-color: var(--brand-accent) !important;
                    color: var(--accent-text) !important;
                    border-color: var(--brand-accent) !important;
                }
            `}} />

            <div className="obsidian-theme font-body">
                {/* Navbar */}
                <nav className={`fixed top-0 left-0 w-full z-50 px-6 transition-all duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-md py-4' : 'mix-blend-difference py-6'}`}>
                    <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                        <a href="#" className="font-heading text-xl font-semibold tracking-wide text-white flex items-center gap-2">
                            <div className={`w-4 h-4 bg-[var(--brand-accent)] ${btnShape}`}></div>
                            <EditableText value={fullName.split(' ')[0]} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                        </a>
                        
                        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
                            <a href="#work" className="hover-accent transition-colors">
                                <EditableText value={theme?.customTexts?.nav_work || 'Work'} field="nav_work" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                            </a>
                            <a href="#about" className="hover-accent transition-colors">
                                <EditableText value={theme?.customTexts?.nav_about || 'Studio'} field="nav_about" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                            </a>
                            <a href="#services" className="hover-accent transition-colors">
                                <EditableText value={theme?.customTexts?.nav_services || 'Services'} field="nav_services" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                            </a>
                        </div>

                        <a href="#contact" className={`hidden md:flex items-center gap-2 border border-[rgba(255,255,255,0.1)] ${btnShape} px-5 py-2 text-sm transition-colors duration-300 text-white obsidian-btn-outline`}>
                            <EditableText value={theme?.customTexts?.nav_cta || "Let's Talk"} field="nav_cta" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                        </a>

                        <button className="md:hidden text-white text-2xl hover-accent" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                    </div>
                </nav>
                
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-[#050505] flex flex-col items-center justify-center gap-8 text-2xl font-heading">
                        <a href="#work" onClick={() => setIsMobileMenuOpen(false)} className="hover-accent">Work</a>
                        <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover-accent">Studio</a>
                        <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover-accent">Services</a>
                        <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className={`mt-4 border border-[rgba(255,255,255,0.1)] ${btnShape} px-8 py-3 transition-colors duration-300 obsidian-btn-outline`}>Let's Talk</a>
                    </div>
                )}

                {/* Header */}
                <header className="relative pt-40 pb-20 px-6 min-h-screen flex flex-col justify-center">
                    <div className="max-w-screen-2xl mx-auto w-full">
                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="max-w-4xl mb-12">
                            <motion.div variants={revealVariants} className={`inline-block border border-[rgba(255,255,255,0.1)] ${btnShape} px-4 py-1.5 text-xs font-body uppercase tracking-widest text-[#8a8a93] mb-6`}>
                                <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                            </motion.div>
                            <motion.h1 variants={revealVariants} className="font-heading text-5xl sm:text-6xl md:text-8xl font-medium tracking-tight leading-[1.05] mb-8">
                                <EditableText value={theme?.customTexts?.hero_title || 'Visual storytelling that leaves a mark.'} field="hero_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} />
                            </motion.h1>
                            <motion.p variants={revealVariants} className="font-body text-[#8a8a93] text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
                                <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={150} />
                            </motion.p>
                            <motion.div variants={revealVariants} className="flex flex-wrap items-center gap-4">
                                <a href="#work" className={`obsidian-btn-primary px-8 py-4 ${btnShape} font-medium transition-all`}>
                                    <EditableText value={theme?.customTexts?.hero_cta1 || 'Explore Works'} field="hero_cta1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                </a>
                                <button onClick={() => setSelectedMedia({ url: heroMediaUrl, title: heroMediaTitle, type: heroMediaType as any })} className={`flex items-center gap-2 border border-[rgba(255,255,255,0.1)] px-8 py-4 ${btnShape} transition-colors duration-300 obsidian-btn-outline`}>
                                    <i className="fas fa-play-circle text-xl"></i> 
                                    <EditableText value={theme?.customTexts?.hero_cta2 || 'Play Showreel'} field="hero_cta2" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                </button>
                            </motion.div>
                        </motion.div>

                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className={`w-full h-[50vh] md:h-[70vh] ${cardShape} obsidian-img-container relative cursor-pointer`} onClick={() => setSelectedMedia({ url: heroMediaUrl, title: heroMediaTitle, type: heroMediaType as any })}>
                            <img src={heroImageThumb} alt={heroMediaTitle} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none group-hover:bg-black/10 transition-colors">
                                <div className={`w-24 h-24 ${btnShape} border border-white/30 backdrop-blur-md flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    <i className="fas fa-play text-white text-2xl ml-1"></i>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* About Section */}
                <section id="about" className="py-24 px-6 border-t border-[rgba(255,255,255,0.1)] bg-[#050505]">
                    <div className="max-w-screen-2xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="md:col-span-5">
                                <h2 className="font-heading text-3xl md:text-4xl font-medium mb-6">
                                    <EditableText value={theme?.customTexts?.about_title || 'About our studio'} field="about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                                </h2>
                            </motion.div>
                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="md:col-span-7">
                                <p className="font-heading text-xl md:text-3xl font-light leading-snug text-gray-300">
                                    <EditableText value={theme?.customTexts?.about_desc || 'Founded by a passionate team of filmmakers, editors, and visual artists, our studio was born from a shared vision. With years of experience and a diverse portfolio, we have established ourselves as a leading force in the world of video production.'} field="about_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={300} />
                                </p>
                            </motion.div>
                        </div>

                        {/* Stats Grid */}
                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 border-t border-[rgba(255,255,255,0.1)] pt-16">
                            <motion.div variants={revealVariants}>
                                <h3 className="font-heading text-5xl md:text-6xl font-medium mb-3">
                                    <EditableText value={theme?.customTexts?.stat_1_val || '14'} field="stat_1_val" entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                                </h3>
                                <p className="font-body text-sm text-[#8a8a93] uppercase tracking-widest">
                                    <EditableText value={theme?.customTexts?.stat_1_label || 'Years of experience'} field="stat_1_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                </p>
                            </motion.div>
                            
                            <motion.div variants={revealVariants}>
                                <h3 className="font-heading text-5xl md:text-6xl font-medium mb-3">
                                    <EditableText value={theme?.customTexts?.stat_2_val || '80+'} field="stat_2_val" entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                                </h3>
                                <p className="font-body text-sm text-[#8a8a93] uppercase tracking-widest">
                                    <EditableText value={theme?.customTexts?.stat_2_label || 'Projects done'} field="stat_2_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                </p>
                            </motion.div>
                            
                            <motion.div variants={revealVariants}>
                                <h3 className="font-heading text-5xl md:text-6xl font-medium mb-3">
                                    <EditableText value={theme?.customTexts?.stat_3_val || '280+'} field="stat_3_val" entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                                </h3>
                                <p className="font-body text-sm text-[#8a8a93] uppercase tracking-widest">
                                    <EditableText value={theme?.customTexts?.stat_3_label || 'Satisfied clients'} field="stat_3_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                </p>
                            </motion.div>
                            
                            <motion.div variants={revealVariants}>
                                <h3 className="font-heading text-5xl md:text-6xl font-medium mb-3">
                                    {awardItems.length}
                                </h3>
                                <p className="font-body text-sm text-[#8a8a93] uppercase tracking-widest">
                                    <EditableText value={theme?.customTexts?.awards_title || 'Awards'} field="awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-24 px-6 border-t border-[rgba(255,255,255,0.1)]">
                    <div className="max-w-screen-2xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="md:col-span-4">
                                <div className="sticky top-32">
                                    <span className="font-body text-sm text-[#8a8a93] uppercase tracking-widest mb-4 block">
                                        <EditableText value={theme?.customTexts?.services_label || 'What we do'} field="services_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                    </span>
                                    <h2 className="font-heading text-4xl md:text-5xl font-medium">
                                        <EditableText value={theme?.customTexts?.services_title || 'Our Services'} field="services_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                    </h2>
                                </div>
                            </motion.div>
                            
                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="md:col-span-8 flex flex-col">
                                {services.slice(0, 3).map((svc: any, i: number) => (
                                    <motion.div key={i} variants={revealVariants} className="border-t border-[rgba(255,255,255,0.1)] py-10 group cursor-default">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-heading text-2xl md:text-3xl font-medium group-hover-accent transition-all duration-300">
                                                <EditableText value={theme?.customTexts?.[`svc_${i}_title`] || svc.title || svc.name || 'Service Title'} field={`svc_${i}_title`} entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                                            </h3>
                                            <i className="fas fa-arrow-right text-xl opacity-0 group-hover:opacity-100 transition-opacity group-hover-accent"></i>
                                        </div>
                                        <p className="font-body text-[#8a8a93] leading-relaxed max-w-2xl">
                                            <EditableText value={theme?.customTexts?.[`svc_${i}_desc`] || svc.description || 'Service description goes here...'} field={`svc_${i}_desc`} entity="appearance" isEditor={isEditor} as="span" maxLength={200} />
                                        </p>
                                    </motion.div>
                                ))}
                                <div className="border-t border-[rgba(255,255,255,0.1)]"></div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Portfolio Section */}
                <section id="work" className="py-24 px-6 border-t border-[rgba(255,255,255,0.1)] bg-[#030303]">
                    <div className="max-w-screen-2xl mx-auto">
                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                            <div>
                                <span className="font-body text-sm text-[#8a8a93] uppercase tracking-widest mb-4 block">
                                    <EditableText value={theme?.customTexts?.portfolio_label || 'Portfolio'} field="portfolio_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                </span>
                                <h2 className="font-heading text-4xl md:text-5xl font-medium">
                                    <EditableText value={theme?.customTexts?.portfolio_title || 'Selected Works'} field="portfolio_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                </h2>
                            </div>
                            <Link href={`/${subdomain}/gallery`} className="hidden md:block font-body text-sm hover:underline mt-4 md:mt-0 text-gray-300 hover-accent">
                                <EditableText value={theme?.customTexts?.portfolio_view_all || 'View all projects'} field="portfolio_view_all" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                            </Link>
                        </motion.div>

                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                            {displayProjects.map((p: any, i: number) => {
                                const isVideo = p.projectType === 'video';
                                return (
                                    <motion.div key={i} variants={revealVariants} className="block group cursor-pointer" onClick={() => {
                                        if (isVideo || p.projectType === 'photo') {
                                            setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                                        } else if (p.mediaUrl) {
                                            window.open(p.mediaUrl, '_blank');
                                        }
                                    }}>
                                        <div className={`w-full aspect-[4/3] ${cardShape} obsidian-img-container mb-6 bg-[#050505] relative`}>
                                            <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover" />
                                            {isVideo && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                                    <i className="fas fa-play text-white text-3xl drop-shadow-lg"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-heading text-2xl font-medium mb-1 group-hover-accent transition-colors">{p.title}</h3>
                                                <p className="font-body text-[#8a8a93] text-sm capitalize">{p.projectType || 'Project'}</p>
                                            </div>
                                            <div className={`w-10 h-10 ${btnShape} border border-[rgba(255,255,255,0.1)] flex items-center justify-center group-hover-bg-accent transition-colors`}>
                                                <i className="fas fa-arrow-right -rotate-45"></i>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                        
                        {/* Explore Gallery Button */}
                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="mt-16 flex justify-center">
                            <Link href={`/${subdomain}/gallery`} scroll={false} className={`group flex items-center gap-4 px-8 py-4 border border-[rgba(255,255,255,0.1)] ${btnShape} obsidian-btn-outline transition-all duration-300`}>
                                <span className="font-heading font-medium text-lg">
                                    <EditableText value={theme?.customTexts?.explore_archive || 'Explore Gallery'} field="explore_archive" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                                </span>
                                <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* 3D SHOWCASE SECTION */}
                {items3D.length > 0 && (
                    <section className="py-24 px-6 bg-[#0a0a0a] border-t border-[rgba(255,255,255,0.1)]">
                        <div className="max-w-screen-2xl mx-auto">
                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="flex flex-col md:flex-row justify-between md:items-end mb-16">
                                <div>
                                    <span className="font-body text-sm text-[#8a8a93] uppercase tracking-widest mb-4 block">
                                        <EditableText value={theme?.customTexts?.obsidian_3d_label || 'Immersive'} field="obsidian_3d_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                    </span>
                                    <h2 className="font-heading text-4xl md:text-5xl font-medium">
                                        <EditableText value={theme?.customTexts?.obsidian_3d_title || '3D Models'} field="obsidian_3d_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                                    </h2>
                                </div>
                                <span className="text-[#8a8a93] font-medium hidden md:block group">
                                    <i className="fas fa-cube mr-2 group-hover-accent transition-colors"></i> 
                                    {items3D.length} Models
                                </span>
                            </motion.div>

                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} 
                                className={`grid grid-cols-1 ${items3D.length === 1 ? 'max-w-4xl mx-auto w-full' : 'md:grid-cols-2'} gap-10 md:gap-16`}
                            >
                                {items3D.map((p: any, i: number) => (
                                    <motion.div key={i} variants={revealVariants} className="group flex flex-col">
                                        <div className={`w-full ${cardShape} overflow-hidden bg-[#050505] relative shadow-2xl group-hover:border-[var(--brand-accent)] transition-colors duration-500`}>
                                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#050505" />
                                        </div>
                                        <div className="mt-8 flex justify-between items-start px-2">
                                            <div>
                                                <h3 className="font-heading text-2xl md:text-3xl font-medium group-hover-accent transition-colors">{p.title}</h3>
                                                <p className="font-body text-[#8a8a93] text-base mt-2 max-w-lg">{p.description || 'Interactive 3D Asset'}</p>
                                            </div>
                                            <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#8a8a93] border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                                                <i className="fas fa-cube"></i>
                                                <EditableText value={theme?.customTexts?.obsidian_3d_badge || '3D Asset'} field="obsidian_3d_badge" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>
                )}



                {/* Widgets Section */}
                <section className="py-24 px-6 border-t border-[rgba(255,255,255,0.1)] bg-[#050505]">
                    <div className="max-w-screen-2xl mx-auto space-y-24">
                        <PenpotShowcase userId={data.id} variant="cinematic" />
                        <CanvaShowcase userId={data.id} variant="cinematic" />
                        <GithubStats userId={data.id} variant="cinematic" themeColor="#ffffff" />
                    </div>
                </section>

                {/* Awards Section */}
                {awardItems.length > 0 && (
                    <section className="py-24 px-6 border-t border-[rgba(255,255,255,0.1)]">
                        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="md:col-span-4">
                                <span className="font-body text-sm text-[#8a8a93] uppercase tracking-widest mb-4 block">
                                    <EditableText value={theme?.customTexts?.awards_label || 'Recognition'} field="awards_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                </span>
                                <h2 className="font-heading text-4xl md:text-5xl font-medium">
                                    <EditableText value={theme?.customTexts?.awards_title || 'Awards'} field="awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                </h2>
                            </motion.div>
                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="md:col-span-8">
                                {awardItems.map((award: any, i: number) => (
                                    <motion.div key={i} variants={revealVariants} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[rgba(255,255,255,0.1)] py-6 group hover:pl-4 transition-all duration-300 cursor-default">
                                        <h3 className="font-heading text-xl md:text-2xl font-medium mb-2 sm:mb-0 group-hover-accent transition-colors">{award.title}</h3>
                                        <p className="font-body text-[#8a8a93]">{award.issuer} {award.year ? `(${award.year})` : ''}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Testimonials Section */}
                {testimonials.length > 0 && (
                    <section className="py-24 px-6 border-t border-[rgba(255,255,255,0.1)]">
                        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="md:col-span-4">
                                <span className="font-body text-sm text-[#8a8a93] uppercase tracking-widest mb-4 block">
                                    <EditableText value={theme?.customTexts?.testimonials_label || 'Voices'} field="testimonials_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                </span>
                                <h2 className="font-heading text-4xl md:text-5xl font-medium">
                                    <EditableText value={theme?.customTexts?.testimonials_title || 'Client Feedback'} field="testimonials_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                                </h2>
                            </motion.div>
                            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {testimonials.map((t: any, i: number) => (
                                    <motion.div key={i} variants={revealVariants} className={`p-8 bg-[#050505] border border-[rgba(255,255,255,0.05)] ${cardShape} flex flex-col justify-between group hover:border-[var(--brand-accent)] transition-colors duration-300`}>
                                        <div>
                                            <i className="fas fa-quote-left text-2xl text-[var(--brand-accent)] opacity-50 mb-6 block"></i>
                                            <p className="font-body text-lg text-[#d1d1d6] leading-relaxed mb-8">"{t.content}"</p>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2">
                                            {t.avatarUrl || t.avatar ? (
                                                <img src={t.avatarUrl || t.avatar} alt={t.clientName || t.name || 'Client'} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 border border-white/10 uppercase font-medium">
                                                    {(t.clientName || t.name || 'U').charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-heading text-lg font-medium text-white">{t.clientName || t.name || 'Anonymous Client'}</h4>
                                                <p className="font-body text-[#8a8a93] text-sm">{t.position || ''} {t.company ? `${t.position ? 'at ' : ''}${t.company}` : ''}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer id="contact" className="pt-32 pb-10 px-6 border-t border-[rgba(255,255,255,0.1)] bg-[#030303]">
                    <div className="max-w-screen-2xl mx-auto">
                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="text-center mb-32">
                            <h2 className="font-heading text-6xl md:text-[8rem] font-medium tracking-tight mb-8">
                                <EditableText value={theme?.customTexts?.footer_title || "Let's create."} field="footer_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
                            </h2>
                            <p className="font-body text-[#8a8a93] text-lg mb-10 max-w-xl mx-auto">
                                <EditableText value={theme?.customTexts?.footer_desc || 'Have an idea in mind? Let us tell your story and leave a lasting impression.'} field="footer_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={100} />
                            </p>
                            <a href={`mailto:${userEmail}`} className={`inline-block obsidian-btn-primary px-10 py-5 ${btnShape} font-medium text-lg transition-transform hover:scale-105 duration-300`}>
                                <EditableText value={theme?.customTexts?.footer_btn || 'Get in touch'} field="footer_btn" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                            </a>
                        </motion.div>

                        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="flex flex-col md:flex-row justify-between items-center border-t border-[rgba(255,255,255,0.1)] pt-10 font-body text-sm text-[#8a8a93]">
                            <p>&copy; {new Date().getFullYear()} {fullName}. All Rights Reserved.</p>
                            <div className="flex gap-6 mt-4 md:mt-0">
                                {links.map((l: any, i: number) => (
                                    <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover-accent transition-colors capitalize">
                                        {l.platform}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </footer>

                {/* Modals for media preview */}
                <AnimatePresence>
                    {selectedMedia && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-0 @md:p-10"
                        >
                            <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedMedia(null)}></div>
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                                className={`relative w-full max-w-6xl bg-black flex flex-col overflow-hidden border border-white/10 shadow-2xl ${cardShape}`}
                            >
                                <div className="flex justify-between items-center px-4 py-3 @md:px-6 border-b border-white/10 bg-[#0a0a0a]">
                                    <div className="flex flex-col">
                                        <h3 className="font-heading font-medium text-lg @md:text-xl text-white">{selectedMedia.title}</h3>
                                    </div>
                                    <button onClick={() => setSelectedMedia(null)} className={`w-9 h-9 flex items-center justify-center bg-white text-black hover:bg-gray-200 transition-all ${btnShape} shrink-0`}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>

                                <div className="w-full bg-black relative" style={{ aspectRatio: selectedMedia.type !== 'video' ? undefined : '16/9' }}>
                                    {selectedMedia.type === 'video' ? (
                                        <UniversalPlayer mediaUrl={selectedMedia.url} title={selectedMedia.title} />
                                    ) : (
                                        <div className="w-full flex items-center justify-center p-4 @md:p-12">
                                            <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[70vh] object-contain shadow-2xl border border-white/20" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* STYLE UTILITIES */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .obsidian-theme {
                    --brand-accent: ${accentColor};
                    --accent-text: ${accentText};
                }
                .obsidian-theme .group:hover .group-hover-accent {
                    color: var(--brand-accent) !important;
                }
                .obsidian-theme .group:hover .group-hover-bg-accent {
                    background-color: var(--brand-accent) !important;
                    color: var(--accent-text) !important;
                    border-color: var(--brand-accent) !important;
                }
                
                /* Lenis Smooth Scroll CSS */
                html.lenis, html.lenis body { height: auto; }
                .lenis.lenis-smooth { scroll-behavior: auto !important; }
                .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
                .lenis.lenis-stopped { overflow: hidden; }
                .lenis.lenis-scrolling iframe { pointer-events: none; }
                `
            }} />
        </div>
    );

    if (isSmoothScroll) {
        return (
            <ReactLenis 
                root 
                options={{ 
                    duration: 1.2, 
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
                    smoothWheel: true
                }}
            >
                {content}
            </ReactLenis>
        );
    }

    return content;
}
