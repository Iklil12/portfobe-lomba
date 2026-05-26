"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CloseModalButton } from '@/components/ui/CloseModalButton';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';

interface GalleryModalViewProps {
  projects: any[];
  subdomain: string;
}

// --- VARIANTS ANIMASI ---
const premiumEase = [0.16, 1, 0.3, 1] as const;

const radialVariants = {
  initial: { clipPath: "circle(0% at 50% 100%)", opacity: 0, filter: "blur(20px)" },
  animate: { clipPath: "circle(150% at 50% 100%)", opacity: 1, filter: "blur(0px)", transition: { duration: 1.2, ease: premiumEase } },
  exit: { clipPath: "circle(0% at 50% 100%)", opacity: 0, filter: "blur(20px)", transition: { duration: 0.8, ease: premiumEase } }
};

const staggerGrid = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
};

const imageItemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95, filter: "blur(15px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 1.2, ease: premiumEase } }
};

const textHoverVariants = {
  initial: { y: 20, opacity: 0 },
  hover: { y: 0, opacity: 1, transition: { duration: 0.5, ease: premiumEase } }
};

export default function GalleryModalView({ projects, subdomain }: GalleryModalViewProps) {
  return (
    <motion.div 
      variants={radialVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col overflow-hidden origin-bottom selection:bg-white selection:text-black"
    >
      {/* --- ANIMATED DARK AURA BACKGROUND (VISIBILITY FIX) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
        {/* Gumpalan Kiri Atas: Dibuat lebih tebal (white/20) dan blur dikurangi agar intinya terlihat */}
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-white/20 blur-[80px] animate-blob" />
        
        {/* Gumpalan Kanan Bawah: Menggunakan warna Slate gelap untuk memberikan dimensi 'dingin' */}
        <div className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-slate-800/30 blur-[90px] animate-blob animation-delay-2000" />
        
        {/* Gumpalan Tengah: Sedikit lebih kecil dan tebal */}
        <div className="absolute top-[30%] right-[30%] w-[40vw] h-[40vw] rounded-full bg-white/15 blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Noise Texture: Opacity dinaikkan sedikit agar teksturnya lebih menangkap cahaya dari gumpalan */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" style={{ mixBlendMode: 'overlay' }}></div>

      {/* Noise Texture */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.25] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" style={{ mixBlendMode: 'overlay' }}></div>

      <header className="shrink-0 px-8 py-8 md:px-12 flex justify-between items-center z-20 relative">
        <motion.div
          initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.6, duration: 1, ease: premiumEase }}
        >
          <h2 className="text-white text-xs font-black uppercase tracking-[0.4em]">Full Gallery</h2>
          <p className="text-white/40 text-[10px] font-bold uppercase mt-1 tracking-widest">{subdomain}.sys / archive</p>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
           animate={{ opacity: 1, scale: 1, rotate: 0 }}
           transition={{ delay: 0.8, duration: 1, ease: premiumEase }}
        >
          <CloseModalButton />
        </motion.div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 pb-32 z-10 relative">
        {projects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="h-full flex flex-col items-center justify-center text-center"
          >
            <p className="text-white/30 font-bold uppercase text-[10px] tracking-widest animate-pulse">Belum ada karya yang diunggah</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerGrid}
            initial="hidden"
            animate="visible"
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-[1600px] mx-auto w-full"
          >
            {projects.map((project) => {
              // DETEKSI GAMBAR ATAU VIDEO UNTUK THUMBNAIL
              const displayMedia = project.projectType === 'video' 
                ? getVideoThumbnail(project.mediaUrl) 
                : (project.mediaUrl || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop");

              return (
                <motion.div 
                  key={project.id} 
                  variants={imageItemVariants}
                  className="break-inside-avoid mb-6"
                >
                  <motion.div 
                    initial="initial"
                    whileHover="hover"
                    className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/5 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.5)] w-full block"
                  >
                    {/* IMPLEMENTASI THUMBNAIL YANG SUDAH DIPERBAIKI */}
                    <LazyImage 
                      src={displayMedia} 
                      alt={project.title}
                      className="w-full h-auto object-cover transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-80"
                    />
                    
                    {/* Glassmorphism Hover Overlay tanpa Blur */}
                    <motion.div 
                      variants={{
                        initial: { opacity: 0 },
                        hover: { opacity: 1 }
                      }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 border-[0.5px] border-white/10"
                    >
                      <motion.div variants={textHoverVariants}>
                        <h3 className="text-white text-base md:text-lg font-black uppercase tracking-tight leading-tight mb-2">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-full border border-white/20 text-white/80 text-[8px] font-bold uppercase tracking-widest bg-white/5">
                            {project.projectType || 'Media'}
                          </span>
                          {project.description && (
                            <p className="text-white/60 text-[10px] font-medium line-clamp-1 flex-1">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                      
                      {/* Hover Icon Reveal */}
                      <motion.div 
                        variants={{
                          initial: { scale: 0, opacity: 0, x: -20 },
                          hover: { scale: 1, opacity: 1, x: 0 }
                        }}
                        transition={{ duration: 0.5, ease: premiumEase, delay: 0.1 }}
                        className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-lg"
                      >
                        <i className={`fas ${project.projectType === 'video' ? 'fa-play ml-1' : 'fa-arrow-right -rotate-45'} text-sm`}></i>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* --- INJEKSI CSS ANIMASI LOKAL --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }

        /* Keyframes untuk Gumpalan Bernapas */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(4vw, -6vh) scale(1.1); }
          66% { transform: translate(-3vw, 4vh) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </motion.div>
  );
}