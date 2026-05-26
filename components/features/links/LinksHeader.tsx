import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface LinksHeaderProps {
  state: {
    hasChanges: boolean;
    isSaving: boolean;
    isAdding: boolean;
    isLoading: boolean;
    userPlan: string;
    linkCount: number;
  };
  actions: {
    addLink: () => void;
    saveAllChanges: () => void;
  };
}

export function LinksHeader({ state, actions }: LinksHeaderProps) {
  const { hasChanges, isSaving, isAdding, isLoading, userPlan, linkCount } = state;
  const { addLink, saveAllChanges } = actions;

  const isFull = userPlan === 'FREE' && linkCount >= 1;

  return (
    <div className="mb-10 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-enter" style={{animationDelay: '100ms'}}>
      <div className="text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 shadow-sm">
            <i className="fas fa-link text-slate-400"></i> Integrasi Publik
          </div>
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="skeleton-badge"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-14 h-5 bg-slate-200 rounded-md animate-pulse"
              ></motion.div>
            ) : userPlan !== 'FREE' ? (
               <motion.span 
                key="pro-badge"
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="bg-slate-900 text-white text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest uppercase flex items-center gap-1.5 shadow-sm"
               >
                  <i className={`fas fa-crown text-[8px] ${userPlan === 'SUPREME' ? 'text-violet-400' : 'text-[#ff9e00]'}`}></i> {userPlan}
               </motion.span>
            ) : (
               <motion.span 
                key="free-badge"
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="bg-slate-50 text-slate-400 text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest uppercase border border-slate-200"
               >
                FREE
               </motion.span>
            )}
          </AnimatePresence>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2 flex items-center justify-center md:justify-start gap-3">
          Social Links.
          <i className="fas fa-asterisk text-slate-300 text-[1.2rem] md:text-[1.8rem] animate-spin-slow"></i>
        </h1>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading-meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center md:justify-start gap-3 mt-4"
            >
              <div className="w-32 h-2 bg-slate-100 rounded-full animate-pulse"></div>
              <div className="w-20 h-2 bg-slate-100 rounded-full animate-pulse"></div>
            </motion.div>
          ) : userPlan === 'FREE' ? (
             <motion.div 
              key="free-quota"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center md:justify-start gap-3 mt-4"
             >
                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((linkCount / 1) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${isFull ? 'bg-rose-500' : 'bg-slate-900'}`} 
                  ></motion.div>
                </div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-[10px] font-black ${isFull ? 'text-rose-500' : 'text-slate-500'}`}
                >
                  {linkCount}/1 Tautan Digunakan
                </motion.span>
             </motion.div>
          ) : (
            <motion.p 
              key="pro-status"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs sm:text-sm font-medium text-slate-500 max-w-lg mt-2"
            >
              Kelola direktori tautan tanpa batas sebagai {userPlan === 'SUPREME' ? 'Supreme' : 'Pro'} Creator.
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isLoading && isFull && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-[10px] font-bold text-rose-500 mt-3 flex items-center justify-center md:justify-start gap-1.5"
            >
              <i className="fas fa-crown text-[9px] animate-pulse"></i> Limit tercapai. Upgrade ke PRO untuk menambah lebih banyak link.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <AnimatePresence>
          {hasChanges && (
            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={saveAllChanges} 
              disabled={isSaving} 
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 text-white rounded-xl sm:rounded-full text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.1)] active:scale-95 transition-all hover:bg-slate-800 hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] disabled:opacity-50"
            >
              {isSaving ? <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div> : <i className="fas fa-check text-[10px]"></i>}
              Simpan
            </motion.button>
          )}
        </AnimatePresence>
        
        {isLoading ? (
          <div className="w-full sm:w-32 h-12 bg-slate-100 rounded-xl sm:rounded-full animate-pulse"></div>
        ) : isFull ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Link 
              href="/pricing"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#0a0a0a] text-white border border-transparent rounded-xl sm:rounded-full text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all hover:bg-slate-800 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <i className="fas fa-crown text-[#ff9e00]"></i> 
              Upgrade PRO
            </Link>
          </motion.div>
        ) : (
          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={addLink} 
            disabled={isAdding} 
            className="w-full sm:w-auto px-6 py-3.5 bg-white text-slate-900 border border-slate-200 rounded-xl sm:rounded-full text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
          >
            {isAdding ? <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div> : <i className="fas fa-plus text-[10px]"></i>} 
            {isAdding ? 'Membuat...' : 'Tambah Baru'}
          </motion.button>
        )}
      </div>
    </div>
  );
}
