import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function ProjectHeader({ state, actions }: { state: any; actions: any }) {
  const { handleOpenModal } = actions;
  const { userPlan, projectCount, certCount, isLoading } = state;
  
  const isProjectFull = userPlan === 'FREE' && projectCount >= 5;
  const isCertFull = userPlan === 'FREE' && certCount >= 2;
  const isQuotaFull = isProjectFull && isCertFull;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 gap-6 animate-enter">
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-2.5 sm:gap-3">
            Karya & Sertifikat
            <i className="fas fa-asterisk text-slate-300 text-[1rem] md:text-[1.3rem] animate-spin-slow"></i>
          </h1>
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading-badge"
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
                className="bg-slate-100 text-slate-500 text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest uppercase border border-slate-200"
               >
                 FREE
               </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-4 max-w-md"
            >
              <div className="space-y-2">
                <div className="w-24 h-2 bg-slate-100 rounded-full animate-pulse"></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="w-24 h-2 bg-slate-100 rounded-full animate-pulse"></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full animate-pulse"></div>
              </div>
            </motion.div>
          ) : userPlan === 'FREE' ? (
            <motion.div 
              key="free-stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-4 max-w-md"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">Kapasitas Proyek</span>
                  <span className={`text-[10px] font-black ${isProjectFull ? 'text-rose-500' : 'text-slate-900'}`}>{projectCount}/5</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((projectCount / 5) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${isProjectFull ? 'bg-rose-500' : 'bg-slate-900'}`} 
                  ></motion.div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">Kapasitas Sertifikat</span>
                  <span className={`text-[10px] font-black ${isCertFull ? 'text-rose-500' : 'text-slate-900'}`}>{certCount}/2</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((certCount / 2) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className={`h-full ${isCertFull ? 'bg-rose-500' : 'bg-slate-900'}`} 
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.p 
              key="pro-desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs sm:text-sm text-slate-500 font-medium mt-2"
            >
              Kelola portofolio tanpa batas sebagai {userPlan === 'SUPREME' ? 'Supreme' : 'Pro'} Creator.
            </motion.p>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {!isLoading && userPlan === 'FREE' && (isProjectFull || isCertFull) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-rose-50 border border-rose-100 p-3 rounded-xl mt-5 inline-flex items-center gap-2"
            >
              <i className="fas fa-crown text-[10px] text-rose-500 animate-pulse"></i> 
              <p className="text-[9px] font-bold text-rose-600 leading-none">
                {isProjectFull && isCertFull 
                  ? "Semua limit tercapai. Upgrade PRO untuk akses tak terbatas."
                  : isProjectFull 
                    ? "Limit proyek tercapai. Upgrade PRO untuk menambah karya lagi."
                    : "Limit sertifikat tercapai. Upgrade PRO untuk menambah pencapaian."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full md:w-auto">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full md:w-40 h-12 bg-slate-100 rounded-2xl animate-pulse"
            ></motion.div>
          ) : isQuotaFull ? (
            <motion.div
              key="upgrade-btn"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Link 
                href="/pricing"
                className="w-full md:w-auto bg-[#0a0a0a] text-white px-7 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-slate-800 transition-all duration-300 active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <i className="fas fa-crown text-[#ff9e00]"></i> 
                Upgrade ke Pro
              </Link>
            </motion.div>
          ) : (
            <motion.button
              key="add-btn"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => handleOpenModal()}
              className="group w-full md:w-auto relative overflow-hidden flex items-center gap-0 rounded-2xl bg-slate-900 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-300 active:scale-95 hover:-translate-y-0.5"
            >
              {/* shimmer sweep on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

              {/* icon box */}
              <div className="flex items-center justify-center w-11 h-11 m-1.5 rounded-xl bg-white/10 shrink-0">
                <i className="fas fa-plus text-white text-[11px]" />
              </div>

              {/* label */}
              <span className="pr-5 text-[11px] font-black uppercase tracking-widest text-white">
                Tambah Data
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
