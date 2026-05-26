import React from 'react';

interface DeleteLinkModalProps {
  state: any;
  actions: any;
}

export function DeleteLinkModal({ state, actions }: DeleteLinkModalProps) {
  const { linkToDelete, isDeleting } = state;
  const { setLinkToDelete, confirmDelete } = actions;

  if (!linkToDelete) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* 1. Full Screen Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={() => !isDeleting && setLinkToDelete(null)}
      ></div>
      
      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-[310px] md:max-w-[400px] animate-enter mx-auto">
        {/* 2. Outer Blurred Box */}
        <div className="absolute inset-[-12px] md:inset-[-20px] bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/50 shadow-2xl"></div>
        
        {/* 3. Main Inner White Box */}
        <div className="relative bg-white rounded-[1.5rem] p-5 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex flex-col text-center">
          
          {/* Close Button */}
          <button onClick={() => !isDeleting && setLinkToDelete(null)} className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
             <i className="fas fa-times text-xs md:text-sm"></i>
          </button>

          {/* Rippling Orange Icon */}
          <div className="relative flex items-center justify-center mx-auto mb-4 w-10 h-10 md:w-12 md:h-12">
            <div className="absolute inset-0 bg-[#ff9e00]/20 rounded-full animate-ping opacity-70" style={{ animationDuration: '2s' }}></div>
            <div className="absolute inset-1.5 bg-[#ff9e00]/10 rounded-full"></div>
            <div className="relative w-5 h-5 md:w-6 md:h-6 bg-[#ff9e00] text-white rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-exclamation text-[8px] md:text-[10px]"></i>
            </div>
          </div>
          
          <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1.5 md:mb-2 tracking-tight">Hapus Tautan?</h3>
          <p className="text-xs md:text-sm font-medium text-slate-500 mb-5 md:mb-6 leading-relaxed px-1">
            Data ini akan dihapus permanen dari sistem dan tidak dapat dikembalikan lagi.
          </p>
          
          <div className="flex flex-row gap-2 md:gap-3 w-full">
            <button 
              onClick={confirmDelete} 
              disabled={isDeleting} 
              className="flex-1 py-2.5 md:py-3 bg-[#ff9e00] hover:bg-[#e68e00] rounded-xl font-bold text-white shadow-lg shadow-[#ff9e00]/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs md:text-sm disabled:opacity-50"
            >
              {isDeleting ? <i className="fas fa-circle-notch animate-spin text-white"></i> : 'Delete'}
            </button>
            <button 
              onClick={() => setLinkToDelete(null)} 
              disabled={isDeleting}
              className="flex-1 py-2.5 md:py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 active:scale-95 transition-all text-xs md:text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
