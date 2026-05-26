import React, { useState, useRef, useEffect } from 'react';
import { LinkData } from '@/hooks/useLinks';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkItemProps {
  link: LinkData;
  index: number;
  actions: any;
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: 'fa-brands fa-instagram', placeholder: 'https://instagram.com/username' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'fa-brands fa-whatsapp', placeholder: 'https://wa.me/628...' },
  { id: 'tiktok', name: 'TikTok', icon: 'fa-brands fa-tiktok', placeholder: 'https://tiktok.com/@username' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'fa-brands fa-linkedin', placeholder: 'https://linkedin.com/in/username' },
  { id: 'youtube', name: 'YouTube', icon: 'fa-brands fa-youtube', placeholder: 'https://youtube.com/@channel' },
  { id: 'x', name: 'X / Twitter', icon: 'fa-brands fa-x-twitter', placeholder: 'https://x.com/username' },
  { id: 'github', name: 'GitHub', icon: 'fa-brands fa-github', placeholder: 'https://github.com/username' },
  { id: 'custom', name: 'Website / Custom', icon: 'fa-solid fa-link', placeholder: 'https://yourwebsite.com' },
];

export function LinkItem({ link, index, actions }: LinkItemProps) {
  const { updateLocalLink, setLinkToDelete } = actions;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPlatform = PLATFORMS.find(p => p.id === link.platform) || PLATFORMS[PLATFORMS.length - 1];
  const iconClass = currentPlatform.icon;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUrlChange = (val: string) => {
    if (link.platform === 'whatsapp' && val.length > 8 && !val.includes('wa.me')) {
      toast('Format WhatsApp sebaiknya menggunakan wa.me', {
        id: 'wa-hint',
        icon: '💡',
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '12px' },
        duration: 2000
      });
    }
    updateLocalLink(link.id, { url: val });
  };

  const selectPlatform = (id: string) => {
    updateLocalLink(link.id, { platform: id });
    setIsOpen(false);
  };

  return (
    <div 
      className={`group bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-slate-300 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center transition-all duration-500 animate-enter relative ${isOpen ? 'z-[110]' : 'z-10'}`}
      style={{animationDelay: `${index * 80}ms`, opacity: 0}}
    >
      <div className="flex w-full items-center gap-4 sm:gap-6">

        {/* Icon Box Premium */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center text-2xl sm:text-3xl shrink-0 group-hover:scale-105 group-hover:rotate-3 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] relative overflow-hidden ml-1 sm:ml-2">
          <i className={iconClass}></i>
          <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[20px]"></div>
        </div>

        {/* Input Fields */}
        <div className="flex-1 min-w-0 flex flex-col gap-1 sm:gap-1.5 relative">
          
          {/* CUSTOM DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 w-full text-left font-black text-slate-900 hover:text-slate-600 transition-colors text-lg sm:text-xl tracking-tight group/btn"
            >
              {currentPlatform.name}
              <motion.i 
                animate={{ rotate: isOpen ? 180 : 0 }}
                className="fas fa-chevron-down text-[10px] text-slate-300 group-hover/btn:text-slate-900 transition-colors"
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 top-full mt-2 w-64 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-[100] overflow-hidden p-1.5"
                >
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => selectPlatform(p.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          link.platform === p.id 
                            ? 'bg-slate-900 text-white shadow-lg' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <i className={`${p.icon} w-5 text-center`}></i>
                        {p.name}
                        {link.platform === p.id && <i className="fas fa-check ml-auto text-[10px]"></i>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* URL INPUT */}
          <div className="flex items-center gap-2 text-slate-300 focus-within:text-slate-900 transition-colors relative z-10">
              <i className="fas fa-link text-[10px] sm:text-xs"></i>
              <input 
                type="url" 
                value={link.url} 
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full bg-transparent text-[11px] sm:text-xs font-semibold text-slate-500 focus:outline-none focus:text-slate-900 truncate placeholder:text-slate-300 transition-colors"
                placeholder={currentPlatform.placeholder}
              />
          </div>
        </div>
      </div>

      {/* ACTION BAR (Responsive) */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        
        {/* Switch Status */}
        <div className="flex items-center gap-3">
            <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest transition-colors ${link.isActive ? 'text-slate-900' : 'text-slate-400'}`}>
              {link.isActive ? 'Visible' : 'Hidden'}
            </span>

          {/* Toggle Button iOS Style */}
          <button
            onClick={() => updateLocalLink(link.id, { isActive: !link.isActive })}
            className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-12 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${
              link.isActive ? 'bg-slate-900' : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full transition-transform duration-300 shadow-sm ${
                link.isActive ? 'translate-x-6 sm:translate-x-6 bg-white' : 'translate-x-1 bg-white'
            }`} />
          </button>
        </div>

        <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

        {/* Delete Button Monokrom */}
        <button 
          onClick={() => setLinkToDelete(link.id)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 flex items-center justify-center active:scale-90 transition-all duration-300 shrink-0 shadow-sm"
          title="Hapus tautan"
        >
          <i className="fas fa-trash-alt text-[11px] sm:text-xs"></i>
        </button>
        
      </div>
    </div>
  );
}
