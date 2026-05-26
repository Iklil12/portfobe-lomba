"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { showToast } from '@/lib/customToast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  avatarUrl?: string;
}

export function ShareModal({ isOpen, onClose, subdomain, avatarUrl }: ShareModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Gunakan origin jika ada (browser), jika tidak fallback
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://portfo.be';
  // Untuk local development, sesuaikan URL agar bisa dites. Jika di production, hapus port.
  const baseUrl = origin.includes('localhost') ? origin : 'https://portfo.be';
  
  // URL portofolio yang dibagikan (menggunakan subdirektori untuk local/development, idealnya custom domain)
  const shareUrl = `${baseUrl}/${subdomain}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const shareText = encodeURIComponent(`Lihat portofolio profesional saya di Portfo.be!`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      showToast({ id: 'copy-success', message: 'Tautan disalin ke clipboard!', icon: 'fa-check' });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      showToast({ id: 'copy-error', message: 'Gagal menyalin tautan.', icon: 'fa-times' });
    }
  };

  const shareLinks = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      color: 'bg-[#25D366] text-white hover:bg-[#128C7E]',
      url: `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'fab fa-linkedin-in',
      color: 'bg-[#0A66C2] text-white hover:bg-[#004182]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: 'fab fa-x-twitter',
      color: 'bg-black text-white hover:bg-slate-800',
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
    },
  ];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000001] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          ></motion.div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 border border-slate-100"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <i className="fas fa-share-nodes text-[#ff9e00]"></i> Bagikan Portofolio
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Tunjukkan karyamu ke dunia!</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            {/* OG Preview Simulation */}
            <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
                <div className="aspect-[1.91/1] w-full bg-slate-900 relative flex flex-col items-center justify-center text-center p-6">
                    {/* Simplified OG Image content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-xl z-10 overflow-hidden border-2 border-white">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <i className="fas fa-rocket text-2xl text-indigo-600"></i>
                        )}
                    </div>
                    <h4 className="text-white text-xl font-black z-10 drop-shadow-md tracking-tight">{subdomain} <br/><span className="text-sm font-medium text-white/70">Portofolio Profesional</span></h4>
                </div>
                <div className="p-3 bg-white">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Portfo.be</p>
                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{subdomain} | Professional Portfolio</p>
                </div>
            </div>

            {/* Copy Link Input */}
            <div className="mb-6">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Tautan Langsung
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center overflow-hidden">
                  <p className="text-sm font-medium text-slate-600 truncate">{shareUrl}</p>
                </div>
                <button
                  onClick={handleCopy}
                  className={`px-4 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center w-[100px] shrink-0
                    ${isCopied 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {isCopied ? (
                    <><i className="fas fa-check mr-2"></i> Disalin</>
                  ) : (
                    'Salin'
                  )}
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 text-center">
                Bagikan ke Media Sosial
              </label>
              <div className="flex items-center justify-center gap-4">
                {shareLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all hover:scale-110 hover:shadow-lg active:scale-95 ${link.color}`}
                    title={`Bagikan ke ${link.name}`}
                  >
                    <i className={link.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
