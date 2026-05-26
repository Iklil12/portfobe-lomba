"use client";

import React, { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function ManualPenpotManager() {
  const { data, mutate } = useSWR('/api/penpot/manual', fetcher);
  const [projects, setProjects] = useState<{ title: string; url: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (data?.projects && !hasInitialized.current) {
      setProjects(data.projects);
      hasInitialized.current = true;
    }
  }, [data?.projects]);

  // Fungsi internal untuk menyimpan ke database
  const persistData = async (updatedProjects: { title: string; url: string }[]) => {
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan perubahan...');
    try {
      const res = await fetch('/api/penpot/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: updatedProjects }),
      });
      if (res.ok) {
        await mutate();
        toast.success('Tersimpan secara otomatis!', { id: toastId });
      } else {
        toast.error('Gagal menyimpan otomatis.', { id: toastId });
      }
    } catch (err) {
      toast.error('Kesalahan jaringan.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (projects.length >= 10) {
      toast.error('Maksimal 10 proyek diperbolehkan.');
      return;
    }
    const newIndex = projects.length;
    setProjects(prev => [...prev, { title: '', url: '' }]);
    setEditingIndex(newIndex);
    toast.success('Baris baru ditambahkan.');
  };

  const handleRemove = async (index: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    const updated = [...projects];
    updated.splice(index, 1);
    setProjects(updated);
    setDeleteConfirm(null);
    if (editingIndex === index) setEditingIndex(null);
    
    // Langsung simpan setelah hapus
    await persistData(updated);
  };

  const handleChange = (index: number, field: 'title' | 'url', value: string) => {
    setProjects(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDone = async () => {
    setEditingIndex(null);
    // Langsung simpan setelah klik Done
    await persistData(projects);
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-8 relative z-40">
      
      <div className="space-y-4">
        {projects.map((p, idx) => (
          <div key={idx} className="relative group">
            <AnimatePresence mode="wait">
              {editingIndex === idx ? (
                <motion.div 
                  key="edit"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="flex flex-col gap-4 p-6 rounded-[1.5rem] border-2 border-slate-900 bg-white shadow-xl relative z-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em] ml-1">Project Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Landing Page Design" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-900 font-bold text-slate-800 transition-all"
                        value={p.title}
                        onChange={(e) => handleChange(idx, 'title', e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em] ml-1">Public Share Link</label>
                      <input 
                        type="text" 
                        placeholder="https://design.penpot.app/..." 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[10px] focus:outline-none focus:border-slate-900 font-medium text-slate-500 transition-all"
                        value={p.url}
                        onChange={(e) => handleChange(idx, 'url', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                     <button type="button" onClick={() => setEditingIndex(null)} className="px-4 py-2 rounded-lg text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors">Batal</button>
                     <button type="button" onClick={handleDone} disabled={isSaving} className="px-5 py-2 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                       {isSaving ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-check"></i>}
                       Simpan & Selesai
                     </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setActiveMenu(activeMenu === idx ? null : idx)}
                  className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all group cursor-pointer sm:cursor-default"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-2">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-900 text-xs font-black">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 tracking-tight truncate">{p.title || 'Untitled Project'}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{p.url}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 transition-all ${activeMenu === idx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0'}`}>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setEditingIndex(idx); }} className="w-9 h-9 shrink-0 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300 flex items-center justify-center transition-all shadow-sm">
                      <i className="fas fa-pencil-alt text-[10px]"></i>
                    </button>
                    {deleteConfirm === idx ? (
                      <div className="flex items-center gap-1">
                         <button type="button" onClick={(e) => { e.stopPropagation(); handleRemove(idx, e); }} className="px-3 py-2 rounded-lg bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg">Ya, Hapus</button>
                         <button type="button" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }} className="p-2 text-slate-400 hover:text-slate-900"><i className="fas fa-times"></i></button>
                      </div>
                    ) : (
                      <button type="button" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(idx); }} className="w-9 h-9 shrink-0 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-100 flex items-center justify-center transition-all shadow-sm">
                        <i className="fas fa-trash-alt text-[10px]"></i>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-50">
        <button type="button" onClick={handleAdd} className="w-full py-4 px-6 rounded-2xl bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95">
          <i className="fas fa-plus-circle text-xs text-slate-400"></i> Add New Penpot Project
        </button>
      </div>
    </div>
  );
}
