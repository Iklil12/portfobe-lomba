"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CldUploadWidget } from 'next-cloudinary';
import { LazyImage } from '@/components/ui/LazyImage';
import { showToast } from '@/lib/customToast';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({ clientName: '', company: '', content: '', rating: 5, avatarUrl: '' });

  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "paperions_preset";

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        resetForm();
        showToast({ message: `Testimoni berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}!`, id: "save-success", icon: "fa-check-circle" });
        fetchTestimonials();
      } else {
        const data = await res.json();
        showToast({ message: data.error || "Gagal menyimpan testimoni", id: "save-error", icon: "fa-exclamation-circle" });
      }
    } catch (error) {
      console.error(error);
      showToast({ message: "Terjadi kesalahan sistem", id: "save-error", icon: "fa-exclamation-triangle" });
    } finally {
      setIsAdding(false);
    }
  };

  const resetForm = () => {
    setFormData({ clientName: '', company: '', content: '', rating: 5, avatarUrl: '' });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEditClick = (t: any) => {
    setFormData({
      clientName: t.clientName,
      company: t.company || '',
      content: t.content,
      rating: t.rating,
      avatarUrl: t.avatarUrl || ''
    });
    setEditingId(t.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string) => {
    setTestimonialToDelete(id);
  };

  const confirmDelete = async () => {
    if (!testimonialToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/testimonials/${testimonialToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTestimonials();
        showToast({ message: "Testimoni dihapus", id: "del-success", icon: "fa-trash" });
      } else {
        const data = await res.json();
        showToast({ message: data.error || "Gagal menghapus testimoni", id: "del-error", icon: "fa-exclamation-triangle" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      setTestimonialToDelete(null);
    }
  };

  const handleToggleVisible = async (id: string, currentStatus: boolean) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !currentStatus })
      });
      if (res.ok) {
        fetchTestimonials();
      } else {
        const data = await res.json();
        showToast({ message: data.error || "Gagal mengubah status", id: "toggle-error", icon: "fa-exclamation-triangle" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === testimonials.length - 1)) return;

    const newTestimonials = [...testimonials];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newTestimonials[index], newTestimonials[targetIndex]] = [newTestimonials[targetIndex], newTestimonials[index]];
    setTestimonials(newTestimonials);

    try {
      const res = await fetch('/api/testimonials/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: newTestimonials.map((t: any) => t.id) })
      });
      if (!res.ok) {
        const data = await res.json();
        showToast({ message: data.error || "Terlalu banyak request, tunggu sebentar", id: "reorder-error", icon: "fa-hand-paper" });
        fetchTestimonials(); // Revert ke data asli jika gagal
      }
    } catch (error) {
      console.error(error);
      fetchTestimonials();
    }
  };

  return (
    <main className="min-h-screen font-sans relative overflow-hidden selection:bg-orange-100 selection:text-orange-900 pb-24">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .animate-enter { opacity: 0; animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(3px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .skeleton-premium {
          background: linear-gradient(110deg, #f1f5f9 8%, #e2e8f0 18%, #f1f5f9 33%);
          background-size: 200% 100%;
          animation: 1.5s shine linear infinite;
        }
        @keyframes shine { to { background-position-x: -200%; } }
      `}} />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">
        
        {/* MODAL HAPUS */}
        {testimonialToDelete && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
              onClick={() => !isDeleting && setTestimonialToDelete(null)}
            ></div>
            
            <div className="relative z-10 w-full max-w-[310px] md:max-w-[400px] animate-enter mx-auto">
              <div className="absolute inset-[-12px] md:inset-[-20px] bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/50 shadow-2xl"></div>
              
              <div className="relative bg-white rounded-[1.5rem] p-5 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex flex-col text-center">
                <button onClick={() => !isDeleting && setTestimonialToDelete(null)} className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                   <i className="fas fa-times text-xs md:text-sm"></i>
                </button>

                <div className="relative flex items-center justify-center mx-auto mb-4 w-10 h-10 md:w-12 md:h-12">
                  <div className="absolute inset-0 bg-[#ff9e00]/20 rounded-full animate-ping opacity-70" style={{ animationDuration: '2s' }}></div>
                  <div className="absolute inset-1.5 bg-[#ff9e00]/10 rounded-full"></div>
                  <div className="relative w-5 h-5 md:w-6 md:h-6 bg-[#ff9e00] text-white rounded-full flex items-center justify-center shadow-md">
                    <i className="fas fa-exclamation text-[8px] md:text-[10px]"></i>
                  </div>
                </div>
                
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1.5 md:mb-2 tracking-tight">Hapus Testimoni?</h3>
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
                    onClick={() => setTestimonialToDelete(null)} 
                    disabled={isDeleting}
                    className="flex-1 py-2.5 md:py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 active:scale-95 transition-all text-xs md:text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        {isLoading ? (
          /* ─── FULL PAGE SKELETON ─── */
          <div className="space-y-4 animate-enter">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <div className="space-y-2.5">
                <div className="h-9 w-52 skeleton-premium rounded-2xl"></div>
                <div className="h-4 w-72 skeleton-premium rounded-lg"></div>
              </div>
              <div className="h-10 w-44 skeleton-premium rounded-xl"></div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row gap-5">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full skeleton-premium"></div>
                </div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="flex items-center gap-2">
                    <div className="h-5 skeleton-premium rounded-lg w-36"></div>
                    <div className="h-4 skeleton-premium rounded-md w-24"></div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => <div key={j} className="w-3.5 h-3.5 skeleton-premium rounded-sm"></div>)}
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="h-3.5 skeleton-premium rounded-md w-full"></div>
                    <div className="h-3.5 skeleton-premium rounded-md w-4/5"></div>
                    <div className="h-3.5 skeleton-premium rounded-md w-3/5"></div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col gap-2 border-l border-slate-50 pl-5 w-[130px] shrink-0">
                  <div className="h-9 skeleton-premium rounded-xl w-full"></div>
                  <div className="h-9 skeleton-premium rounded-xl w-full"></div>
                  <div className="h-9 skeleton-premium rounded-xl w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ─── REAL CONTENT ─── */
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 animate-enter">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <i className="fas fa-comment-quote text-orange-500"></i>
                  Testimonials
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-2">Bangun kredibilitas portofoliomu dengan ulasan klien.</p>
              </div>
              <button
                onClick={() => { if (isFormOpen) resetForm(); else setIsFormOpen(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 text-slate-700 text-sm font-bold shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all active:scale-95"
              >
                <i className={`fas ${isFormOpen ? 'fa-times text-slate-400' : 'fa-plus text-orange-500'}`}></i>
                {isFormOpen ? 'Batal' : 'Tambah Testimoni'}
              </button>
            </div>

            {/* FORM TAMBAH / EDIT */}
            {isFormOpen && (
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)] mb-10 animate-enter">
            <h2 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
              <i className="fas fa-pen-nib text-orange-400"></i> {editingId ? 'Edit Ulasan' : 'Tulis Ulasan'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-8">
                {/* Bagian Upload Foto */}
                <div className="flex flex-col items-center sm:items-start gap-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Foto (Opsional)</label>
                  <CldUploadWidget
                    uploadPreset={cloudinaryPreset}
                    options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["jpg", "png", "webp"], sources: ["local", "url"], showPoweredBy: false }}
                    onSuccess={(result) => {
                      if (typeof result.info === 'object' && 'secure_url' in result.info) {
                        setFormData({...formData, avatarUrl: result.info.secure_url});
                        showToast({ message: "Foto terunggah!", id: "up-ok", icon: "fa-check" });
                      }
                    }}
                  >
                    {({ open }) => (
                      <div 
                        onClick={() => open()}
                        className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-all group overflow-hidden relative shadow-sm"
                      >
                        {formData.avatarUrl ? (
                          <>
                            <LazyImage src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                            <i className="fas fa-camera absolute text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity text-xl"></i>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-slate-400 group-hover:text-orange-500 transition-colors">
                            <i className="fas fa-camera text-xl mb-1"></i>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CldUploadWidget>
                </div>

                {/* Bagian Input Teks */}
                <div className="flex-1 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Klien *</label>
                      <input required type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all placeholder:font-normal placeholder:text-slate-400" placeholder="Contoh: Budi Santoso" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Posisi / Perusahaan</label>
                      <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all placeholder:font-normal placeholder:text-slate-400" placeholder="Contoh: CEO, TechCorp" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Isi Testimoni *</label>
                    <textarea required rows={4} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all placeholder:font-normal placeholder:text-slate-400 resize-none" placeholder="Tuliskan apresiasi atau ulasan klien di sini..." />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Rating Bintang</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map((star) => (
                        <button 
                          key={star} type="button" 
                          onClick={() => setFormData({...formData, rating: star})}
                          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-orange-50 transition-colors focus:outline-none"
                        >
                          <i className={`fa-star text-lg ${formData.rating >= star ? 'fas text-amber-400' : 'far text-slate-300'}`}></i>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button disabled={isAdding} type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-slate-900/20">
                  {isAdding ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-check"></i>}
                  {isAdding ? 'Menyimpan...' : 'Simpan Testimoni'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LIST TESTIMONI */}
            <div className="space-y-4">
              {testimonials.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed animate-enter">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <i className="fas fa-comment-slash text-2xl text-slate-300"></i>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Belum ada testimoni</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">Kamu belum memiliki ulasan dari klien. Tambahkan sekarang untuk meningkatkan kepercayaan.</p>
                  <button onClick={() => setIsFormOpen(true)} className="text-sm font-bold text-orange-500 hover:text-orange-600">
                    + Tambah Testimoni Pertama
                  </button>
                </div>
              ) : (
                testimonials.map((t, index) => (
                  <div key={t.id} className={`bg-white p-5 sm:p-6 rounded-3xl border transition-all duration-300 ${t.isVisible ? 'border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'} flex flex-col sm:flex-row gap-5 animate-enter`} style={{animationDelay: `${index * 100}ms`}}>
                    
                    <div className="flex-shrink-0 flex sm:flex-col items-center justify-between sm:justify-start gap-4 sm:gap-2">
                      <div className="flex flex-col gap-1 sm:hidden mr-2">
                        <button disabled={index === 0} onClick={() => handleMove(index, 'up')} className="text-slate-300 hover:text-orange-500 disabled:opacity-30"><i className="fas fa-chevron-up text-xs"></i></button>
                        <button disabled={index === testimonials.length - 1} onClick={() => handleMove(index, 'down')} className="text-slate-300 hover:text-orange-500 disabled:opacity-30"><i className="fas fa-chevron-down text-xs"></i></button>
                      </div>
                      {t.avatarUrl ? (
                        <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center font-black text-xl">
                          {t.clientName.charAt(0)}
                        </div>
                      )}
                      <div className="flex sm:hidden gap-2">
                        <button onClick={() => handleEditClick(t)} className="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-all"><i className="fas fa-edit text-xs"></i></button>
                        <button disabled={processingId === t.id} onClick={() => handleToggleVisible(t.id, t.isVisible)} className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all disabled:opacity-50 ${t.isVisible ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-slate-800 text-white'}`}>
                          {processingId === t.id ? <i className="fas fa-spinner fa-spin text-xs"></i> : <i className={`fas ${t.isVisible ? 'fa-eye' : 'fa-eye-slash'} text-xs`}></i>}
                        </button>
                        <button onClick={() => handleDeleteClick(t.id)} className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"><i className="fas fa-trash text-xs"></i></button>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                        <h3 className="font-black text-slate-900 text-lg">{t.clientName}</h3>
                        {t.company && <span className="text-xs font-bold uppercase tracking-widest text-slate-400 px-2 py-0.5 bg-slate-100 rounded-md">{t.company}</span>}
                      </div>
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => <i key={i} className={`${i < t.rating ? 'fas text-amber-400' : 'far text-slate-200'} fa-star text-xs mr-0.5`}></i>)}
                      </div>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-2xl italic">"{t.content}"</p>
                    </div>
                    
                    <div className="hidden sm:flex flex-col justify-between items-center px-2">
                      <button disabled={index === 0} onClick={() => handleMove(index, 'up')} className="p-1 text-slate-300 hover:text-orange-500 disabled:opacity-30 transition-colors"><i className="fas fa-chevron-up text-lg"></i></button>
                      <button disabled={index === testimonials.length - 1} onClick={() => handleMove(index, 'down')} className="p-1 text-slate-300 hover:text-orange-500 disabled:opacity-30 transition-colors"><i className="fas fa-chevron-down text-lg"></i></button>
                    </div>
                    
                    <div className="hidden sm:flex flex-col gap-2 justify-start border-l border-slate-100 pl-5 w-[130px] shrink-0">
                      <button onClick={() => handleEditClick(t)} className="px-3 py-2 flex items-center justify-center gap-2 rounded-xl transition-all text-xs font-bold w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100"><i className="fas fa-edit"></i> Edit</button>
                      <button disabled={processingId === t.id} onClick={() => handleToggleVisible(t.id, t.isVisible)} className={`px-3 py-2 flex items-center justify-center gap-2 rounded-xl transition-all text-xs font-bold w-full disabled:opacity-50 ${t.isVisible ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200' : 'bg-slate-800 text-white hover:bg-slate-900 shadow-md'}`}>
                        {processingId === t.id ? <i className="fas fa-spinner fa-spin"></i> : <i className={`fas ${t.isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>} {t.isVisible ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                      <button onClick={() => handleDeleteClick(t.id)} className="px-3 py-2 flex items-center justify-center gap-2 rounded-xl transition-all text-xs font-bold w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"><i className="fas fa-trash"></i> Hapus</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </main>
  );
}
