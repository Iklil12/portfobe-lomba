"use client";

import React, { useState, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '@/lib/customToast';
import { ProjectType } from '@/hooks/useProjects';
import { LazyImage } from '@/components/ui/LazyImage';

// --- VARIANTS ANIMASI ---
const modalSpring = { type: "spring", stiffness: 300, damping: 25 } as const;
const smoothEase = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: smoothEase } }
};

export function ProjectFormModal({ state, actions }: { state: any, actions: any }) {
  const [videoMethod, setVideoMethod] = useState<'link' | 'upload'>('link');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Saat edit video yang sudah diupload (GUID Bunny), otomatis pindah ke tab 'upload'
  const isBunnyGuid = (url: string) => url && !url.includes('youtube') && !url.includes('vimeo') && !url.includes('http') && url.length === 36 && url.includes('-');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file3d, setFile3d] = useState<File | null>(null);
  const file3dInputRef = useRef<HTMLInputElement>(null);
  const [isUploading3D, setIsUploading3D] = useState(false);
  const [upload3DProgress, setUpload3DProgress] = useState(0);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileImageInputRef = useRef<HTMLInputElement>(null);

  const {
    isModalOpen,
    editingId,
    projectType,
    projectTitle,
    projectDescription,
    mediaUrl,
    certIssuer,
    certYear,
    certStatus,
    projectTags,
    isSubmitting,
    userPlan
  } = state;

  const {
    handleCloseModal,
    setProjectType,
    setProjectTitle,
    setProjectDescription,
    setMediaUrl,
    setCertIssuer,
    setCertYear,
    setCertStatus,
    setProjectTags,
    handleSubmit
  } = actions;

  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "paperions_preset";

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (userPlan === 'FREE') {
      setShowUpgradeModal(true);
      return;
    }

    const maxVideoSize = userPlan === 'SUPREME' ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    const maxVideoSizeLabel = userPlan === 'SUPREME' ? '100MB' : '50MB';

    if (file.size > maxVideoSize) {
      showToast({ message: `Ukuran video maksimal ${maxVideoSizeLabel}`, id: "err-video-size", icon: "fa-exclamation-triangle" });
      return;
    }

    setIsUploadingVideo(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('title', projectTitle || file.name);
      formData.append('file', file);

      // Gunakan XMLHttpRequest untuk melacak progress upload ke backend kita
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/projects/upload-video', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          // Progress ini hanya mencatat dari Client ke Server kita
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.guid) {
              setMediaUrl(data.guid);
              showToast({ message: "Video berhasil diunggah!", id: "upload-success", icon: "fa-check-circle" });
            } else {
              showToast({ message: "Gagal mengunggah video.", id: "upload-fail", icon: "fa-times-circle" });
            }
          } catch (e) {
            showToast({ message: "Respon server tidak valid.", id: "upload-fail-parse", icon: "fa-times-circle" });
          }
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            showToast({ message: err.error || "Gagal mengunggah video.", id: "upload-fail", icon: "fa-times-circle" });
          } catch {
            showToast({ message: "Gagal mengunggah video.", id: "upload-fail", icon: "fa-times-circle" });
          }
        }
        setIsUploadingVideo(false);
      };

      xhr.onerror = () => {
        showToast({ message: "Terjadi kesalahan jaringan saat mengunggah.", id: "upload-error", icon: "fa-wifi" });
        setIsUploadingVideo(false);
      };

      xhr.send(formData);

    } catch (error: any) {
      console.error(error);
      showToast({ message: error.message || "Gagal memproses video", id: "upload-exception", icon: "fa-exclamation-triangle" });
      setIsUploadingVideo(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop (Dark & Blur) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={handleCloseModal}
      />

      {/* Outer Glass Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={modalSpring}
        className="relative w-full max-w-2xl bg-white/60 backdrop-blur-xl p-2 md:p-3 rounded-[32px] shadow-2xl border border-white/40 z-10 flex flex-col max-h-[95vh]"
      >
        {/* Inner Content Container */}
        <div className="bg-white rounded-[24px] w-full shadow-sm border border-slate-100 flex flex-col overflow-hidden h-full relative">
          {/* Tombol Tutup dengan interaksi putar */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCloseModal}
            className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100/50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors z-20"
          >
            <i className="fas fa-times text-sm"></i>
          </motion.button>

          <div className="overflow-y-auto custom-scrollbar w-full h-full relative z-10">
            <div className="p-6 sm:p-8 md:p-10">

              {/* Modal Header */}
              <div className="mb-8 pr-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingId ? 'Edit Data' : (projectType ? `Detail ${projectType === 'certificate' ? 'Sertifikat' : 'Proyek'}` : 'Pilih Tipe Unggahan')}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1.5">
                  {editingId ? 'Perbarui informasi data ini dengan cermat.' : (projectType ? 'Lengkapi formulir di bawah ini dengan detail yang sesuai.' : 'Pilih format data yang akan ditambahkan ke portofolio Anda.')}
                </p>
              </div>

              {/* ANIMATE PRESENCE: Transisi mulus antara Pilih Tipe & Isi Form */}
              <AnimatePresence mode="wait">
                {!projectType ? (
                  // --- STEP 1: PEMILIHAN TIPE PROYEK ---
                  <motion.div
                    key="type-selection"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    {[
                      { id: 'video', icon: 'fa-video', label: 'Video', desc: 'YouTube / Vimeo' },
                      { id: 'photo', icon: 'fa-image', label: 'Foto / Desain', desc: 'Portofolio Visual' },
                      { id: 'certificate', icon: 'fa-certificate', label: 'Sertifikat', desc: 'Lisensi & Pencapaian' },
                      { id: '3d', icon: 'fa-cube', label: '3D Model', desc: 'FORMAT .GLB', isPro: true }
                    ].map((opt) => (
                      <motion.button
                        key={opt.id}
                        variants={cardItem}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (opt.isPro && userPlan === 'FREE') {
                             setShowUpgradeModal(true);
                             return;
                          }
                          setProjectType(opt.id as ProjectType)
                        }}
                        className="group relative p-6 rounded-[20px] border border-slate-200 bg-white hover:border-slate-900 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all text-center overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {opt.isPro && (
                           <span className="absolute top-3 right-3 bg-slate-900 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-sm shadow-sm z-20">PRO</span>
                        )}
                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-900 transition-colors duration-300 relative z-10 shadow-sm">
                          <i className={`fas ${opt.icon} text-xl text-slate-400 group-hover:text-white transition-colors duration-300 group-hover:scale-110`}></i>
                        </div>
                        <p className="font-bold text-slate-900 text-sm relative z-10">{opt.label}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest relative z-10">{opt.desc}</p>
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  // --- STEP 2: FORM ISIAN ---
                  <motion.form
                    key="form-input"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: smoothEase }}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (projectType === '3d') {
                        // Jika edit (sudah ada mediaUrl) dan tidak upload file baru, gunakan PATCH biasa
                        if (editingId && !file3d) {
                          handleSubmit(e);
                          return;
                        }
                        if (!projectTitle || !file3d) {
                           showToast({ message: 'Judul dan File 3D wajib diisi!', id: 'err-3d-req', icon: 'fa-exclamation' });
                           return;
                        }
                        setIsUploading3D(true);
                        setUpload3DProgress(0);
                        
                        try {
                          const formData = new FormData();
                          formData.append('title', projectTitle);
                          formData.append('file', file3d);
                          if (projectDescription) formData.append('description', projectDescription);

                          // Gunakan XMLHttpRequest untuk tracking progress
                          const xhr = new XMLHttpRequest();
                          xhr.open('POST', '/api/projects/upload-3d', true);

                          xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable) {
                              const pct = Math.round((event.loaded / event.total) * 100);
                              setUpload3DProgress(pct);
                            }
                          };

                          xhr.onload = () => {
                            if (xhr.status >= 200 && xhr.status < 300) {
                              showToast({ message: '3D Model berhasil diunggah!', id: 'succ-3d', icon: 'fa-check-circle' });
                              handleCloseModal();
                              window.location.reload();
                            } else {
                              try {
                                const err = JSON.parse(xhr.responseText);
                                showToast({ message: err.error || 'Gagal mengunggah', id: 'err-3d-api', icon: 'fa-times-circle' });
                              } catch {
                                showToast({ message: 'Gagal mengunggah 3D model', id: 'err-3d-api', icon: 'fa-times-circle' });
                              }
                            }
                            setIsUploading3D(false);
                          };

                          xhr.onerror = () => {
                            showToast({ message: 'Gagal terhubung ke server', id: 'err-net', icon: 'fa-wifi' });
                            setIsUploading3D(false);
                          };

                          xhr.send(formData);
                        } catch (err) {
                           showToast({ message: 'Gagal terhubung server', id: 'err-net', icon: 'fa-wifi' });
                           setIsUploading3D(false);
                        }
                      } else {
                        handleSubmit(e);
                      }
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* INPUT JUDUL */}
                      <div className={projectType === 'certificate' ? 'md:col-span-1' : 'md:col-span-2'}>
                        <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-3">Judul {projectType === 'certificate' ? 'Sertifikat/Acara' : 'Proyek'} <span className="text-rose-500">*</span></label>
                        <input
                          type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder={projectType === 'certificate' ? "Contoh: Lomba Film UI 2022..." : "Contoh: UI/UX Masterclass..."}
                          className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 focus:shadow-md outline-none text-sm font-semibold text-slate-900 transition-all duration-300 placeholder:font-medium placeholder:text-slate-400 hover:border-slate-300"
                        />
                      </div>

                      {/* KHUSUS SERTIFIKAT */}
                      {projectType === 'certificate' && (
                        <>
                          <div className="md:col-span-1">
                            <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-3">Pencapaian / Status <span className="text-rose-500">*</span></label>
                            <input
                              type="text" value={certStatus} onChange={(e) => setCertStatus(e.target.value)} placeholder="Misal: Juara 1, Staff Kominfo..."
                              className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 focus:shadow-md outline-none text-sm font-semibold text-slate-900 transition-all duration-300 placeholder:font-medium placeholder:text-slate-400 hover:border-slate-300"
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-3">Lembaga / Penyelenggara <span className="text-rose-500">*</span></label>
                            <input
                              type="text" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} placeholder="Misal: BEM KM, Coursera..."
                              className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 focus:shadow-md outline-none text-sm font-semibold text-slate-900 transition-all duration-300 placeholder:font-medium placeholder:text-slate-400 hover:border-slate-300"
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-3">Tahun <span className="text-rose-500">*</span></label>
                            <input
                              type="number" value={certYear} onChange={(e) => setCertYear(e.target.value)} placeholder="Misal: 2024"
                              className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 focus:shadow-md outline-none text-sm font-semibold text-slate-900 transition-all duration-300 placeholder:font-medium placeholder:text-slate-400 hover:border-slate-300"
                            />
                          </div>
                        </>
                      )}

                      {/* INPUT MEDIA */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-3">
                          {projectType === 'video' ? 'Tautan Video (YouTube)' : projectType === '3d' ? 'Unggah File 3D (.GLB)' : 'Unggah File Gambar'} <span className="text-rose-500">*</span>
                        </label>
                        {projectType === '3d' ? (
                          <div className="w-full">
                            <input type="file" accept=".glb,.gltf" className="hidden" ref={file3dInputRef} onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const max3DSize = userPlan === 'SUPREME' ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
                                const max3DLabel = userPlan === 'SUPREME' ? '100MB' : '50MB';
                                if (f.size > max3DSize) {
                                   showToast({ message: `Maksimal ${max3DLabel}`, id: "err-3d", icon: "fa-exclamation" });
                                   return;
                                }
                                setFile3d(f);
                              }
                            }} />
                            <div 
                              onClick={() => file3dInputRef.current?.click()}
                              className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all duration-300 rounded-[20px] flex flex-col items-center justify-center overflow-hidden relative min-h-[160px] w-full group/upload"
                            >
                              {file3d ? (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 mb-3 border border-indigo-200">
                                    <i className="fas fa-cube text-lg"></i>
                                  </div>
                                  <span className="text-sm font-bold text-slate-900">{file3d.name}</span>
                                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">Klik untuk mengganti</span>
                                </div>
                              ) : editingId && mediaUrl ? (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-3 border border-green-200">
                                    <i className="fas fa-check text-lg"></i>
                                  </div>
                                  <span className="text-sm font-bold text-slate-900">File 3D Sudah Terlampir</span>
                                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">Klik untuk mengganti file</span>
                                </div>
                              ) : (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3 group-hover/upload:bg-slate-900 group-hover/upload:text-white transition-all duration-300 group-hover/upload:shadow-md group-hover/upload:-translate-y-1">
                                    <i className="fas fa-cloud-upload-alt text-lg"></i>
                                  </div>
                                  <span className="text-sm font-bold text-slate-900 flex items-center gap-2">Pilih File 3D (.GLB/.GLTF)</span>
                                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">Maksimal {userPlan === 'SUPREME' ? '100MB' : '50MB'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : projectType === 'video' ? (
                          <div className="flex flex-col gap-4">
                            <div className="flex gap-2 p-1 bg-slate-100 rounded-full w-full sm:max-w-[280px]">
                              <button
                                type="button"
                                onClick={() => setVideoMethod('link')}
                                className={`flex-1 py-2.5 text-[11px] font-bold rounded-full transition-all ${(isBunnyGuid(mediaUrl) ? 'upload' : videoMethod) === 'link' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                              >
                                Link (YouTube/Vimeo)
                              </button>
                              <button
                                type="button"
                                onClick={() => setVideoMethod('upload')}
                                className={`flex-1 py-2.5 text-[11px] font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${(isBunnyGuid(mediaUrl) ? 'upload' : videoMethod) === 'upload' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                              >
                                Unggah <i className="fas fa-crown text-amber-500"></i>
                              </button>
                            </div>

                            {(isBunnyGuid(mediaUrl) ? 'upload' : videoMethod) === 'link' ? (
                              <input
                                type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://youtube.com/..."
                                className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 focus:shadow-md outline-none text-sm font-semibold text-slate-900 transition-all duration-300 hover:border-slate-300"
                              />
                            ) : (
                              <div className="w-full">
                                <input type="file" accept="video/mp4,video/x-m4v,video/*" className="hidden" ref={fileInputRef} onChange={handleVideoUpload} />
                                <div 
                                  onClick={() => {
                                    if(userPlan === 'FREE') setShowUpgradeModal(true); 
                                    else fileInputRef.current?.click();
                                  }}
                                  className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all duration-300 rounded-[20px] flex flex-col items-center justify-center overflow-hidden relative min-h-[160px] w-full group/upload"
                                >
                                  {isUploadingVideo ? (
                                    <div className="w-full px-8 flex flex-col items-center">
                                      <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden border border-slate-300">
                                        <div className="bg-[#ff9e00] h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(255,158,0,0.5)]" style={{ width: `${uploadProgress}%` }}></div>
                                      </div>
                                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Mengunggah... {uploadProgress}%</span>
                                    </div>
                                  ) : mediaUrl && !mediaUrl.includes('youtube') && !mediaUrl.includes('vimeo') && mediaUrl.length === 36 ? (
                                    <div className="py-8 flex flex-col items-center text-center px-4">
                                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-3 border border-green-200">
                                        <i className="fas fa-check text-lg"></i>
                                      </div>
                                      <span className="text-sm font-bold text-slate-900">Video Berhasil Diunggah</span>
                                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">Klik untuk mengganti</span>
                                    </div>
                                  ) : (
                                    <div className="py-8 flex flex-col items-center text-center px-4">
                                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3 group-hover/upload:bg-[#ff9e00] group-hover/upload:text-white transition-all duration-300 group-hover/upload:shadow-md group-hover/upload:-translate-y-1">
                                        <i className="fas fa-cloud-upload-alt text-lg"></i>
                                      </div>
                                      <span className="text-sm font-bold text-slate-900 flex items-center gap-2">Unggah Video Langsung <i className="fas fa-crown text-amber-500 text-xs"></i></span>
                                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">Maksimal {userPlan === 'SUPREME' ? '100MB' : '50MB'} (MP4, WEBM)</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full">
                            <input 
                              type="file" 
                              accept="image/png,image/jpeg,image/jpg,image/webp" 
                              className="hidden" 
                              ref={fileImageInputRef} 
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                
                                const maxImageSize = userPlan === 'SUPREME' ? 15 * 1024 * 1024 : userPlan === 'PRO' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
                                const maxImageLabel = userPlan === 'SUPREME' ? '15MB' : userPlan === 'PRO' ? '10MB' : '5MB';
                                
                                if (f.size > maxImageSize) {
                                  showToast({ message: `Maksimal ukuran gambar ${maxImageLabel}`, id: "err-img", icon: "fa-exclamation" });
                                  return;
                                }

                                setIsUploadingImage(true);
                                const formData = new FormData();
                                formData.append('file', f);

                                try {
                                  const res = await fetch('/api/projects/upload-image', {
                                    method: 'POST',
                                    body: formData
                                  });
                                  const data = await res.json();
                                  
                                  if (res.ok && data.secure_url) {
                                    setMediaUrl(data.secure_url);
                                    showToast({ message: "Aset berhasil dilampirkan", id: "upload-asset-success", icon: "fa-image" });
                                  } else {
                                    showToast({ message: data.error || "Gagal mengunggah gambar", id: "upload-asset-fail", icon: "fa-times" });
                                  }
                                } catch (err) {
                                  showToast({ message: "Terjadi kesalahan jaringan", id: "upload-asset-err", icon: "fa-wifi" });
                                } finally {
                                  setIsUploadingImage(false);
                                }
                              }} 
                            />
                            <div
                              onClick={() => !isUploadingImage && fileImageInputRef.current?.click()}
                              className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all duration-300 rounded-[20px] flex flex-col items-center justify-center overflow-hidden relative group/upload min-h-[160px]"
                            >
                              {isUploadingImage ? (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <i className="fas fa-circle-notch animate-spin text-3xl text-[#ff9e00] mb-3"></i>
                                  <span className="text-sm font-bold text-slate-900">Mengunggah Gambar...</span>
                                </div>
                              ) : mediaUrl ? (
                                <div className="relative w-full h-48 bg-slate-100">
                                  <LazyImage src={mediaUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/upload:scale-105" />
                                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-[2px]">
                                    <span className="bg-white/20 border border-white/40 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl">
                                      <i className="fas fa-camera"></i> Ganti Gambar
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-8 flex flex-col items-center text-center px-4">
                                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3 group-hover/upload:bg-slate-900 group-hover/upload:text-white transition-all duration-300 group-hover/upload:shadow-md group-hover/upload:-translate-y-1">
                                    <i className="fas fa-cloud-upload-alt text-lg"></i>
                                  </div>
                                  <span className="text-sm font-bold text-slate-900">Klik untuk Unggah Media</span>
                                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">Maksimal {userPlan === 'SUPREME' ? '15MB' : userPlan === 'PRO' ? '10MB' : '5MB'} (JPG, PNG)</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* INPUT DESKRIPSI */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-3">Deskripsi (Opsional)</label>
                        <textarea
                          rows={3} value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Tambahkan penjelasan singkat..."
                          className="w-full px-5 py-4 rounded-[24px] border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 focus:shadow-md outline-none text-sm font-medium text-slate-900 resize-none transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300 custom-scrollbar"
                        />
                      </div>

                      {/* INPUT TAGS — hanya untuk project (bukan sertifikat) */}
                      {projectType !== 'certificate' && (
                        <div className="md:col-span-2">
                          <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 ml-3">
                            Tags <span className="normal-case font-medium text-slate-400">(Opsional)</span>
                          </label>
                          {/* Chips yang sudah ditambah */}
                          {projectTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {projectTags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-full"
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => setProjectTags(projectTags.filter((t: string) => t !== tag))}
                                    className="w-3.5 h-3.5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors leading-none"
                                  >
                                    <i className="fas fa-times text-[7px]"></i>
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                          <input
                            type="text"
                            placeholder={projectTags.length >= 5 ? 'Maksimal 5 tag' : 'Ketik tag lalu tekan Enter atau koma...'}
                            disabled={projectTags.length >= 5}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                const val = (e.target as HTMLInputElement).value.trim().replace(/,/g, '');
                                if (val && !projectTags.includes(val) && projectTags.length < 5) {
                                  setProjectTags([...projectTags, val]);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                            className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 outline-none text-sm font-semibold text-slate-900 transition-all duration-300 placeholder:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                          />
                          <p className="text-[10px] font-medium text-slate-400 mt-2 ml-3">Contoh: UI/UX, Branding, React — Maks. 5 tag</p>
                        </div>
                      )}
                    </div>
                    {/* AKSI BUTTONS */}
                    <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3 border-t border-slate-100 mt-6">
                      {!editingId && (
                        <motion.button
                          whileHover={{ backgroundColor: "#f1f5f9" }}
                          whileTap={{ scale: 0.96 }}
                          type="button"
                          onClick={() => setProjectType(null)}
                          className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-slate-600 bg-slate-50 border border-slate-200 transition-colors text-sm"
                        >
                          Kembali
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting || isUploading3D}
                        className="w-full sm:flex-1 py-3.5 rounded-full bg-[#ff9e00] text-white font-bold text-sm shadow-[0_8px_20px_rgba(255,158,0,0.3)] hover:bg-[#ff9e00]/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {(isSubmitting || isUploading3D) && <i className="fas fa-circle-notch animate-spin text-white/70"></i>}
                        {isUploading3D ? `Mengunggah 3D... ${upload3DProgress}%` : isSubmitting ? 'Memproses...' : 'Simpan ke Portofolio'}
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </motion.div>

      {/* MODAL UPGRADE PRO */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowUpgradeModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 max-w-sm w-full relative z-10 shadow-2xl flex flex-col items-center text-center"
            >
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
              
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 mb-6">
                <i className="fas fa-rocket text-4xl text-white"></i>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Upgrade ke PRO</h3>
              <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                Nikmati fitur unggah video langsung ke server super cepat (bebas iklan YouTube), ukuran hingga 100MB, dan kustomisasi tanpa batas.
              </p>
              
              <button className="w-full py-4 rounded-full bg-slate-900 text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                Lihat Paket PRO
              </button>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="w-full mt-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
              >
                Nanti Saja
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}