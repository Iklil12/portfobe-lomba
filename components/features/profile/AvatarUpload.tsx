import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { showToast } from '@/lib/customToast';
import Link from 'next/link';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { LazyImage } from '@/components/ui/LazyImage';

interface AvatarUploadProps {
  state: any;
  actions: any;
}

export function AvatarUpload({ state, actions }: AvatarUploadProps) {
  const { session, firstName, lastName, avatarUrl } = state;
  const { setAvatarUrl } = actions;

  // Ambil userPlan langsung dari layout hook (sinkron dengan Topbar)
  const { userPlan } = useDashboardLayout();

  const fullName = session?.user?.name || "User Portfo";
  const email = session?.user?.email || "user@example.com";
  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "paperions_preset";

  // Deteksi status PRO
  const isPro = userPlan !== 'FREE';
  const isSupreme = userPlan === 'SUPREME';

  return (
    <div className="relative mb-8 border-b border-slate-100 pb-8 sm:pb-10 pt-32 sm:pt-40">
      {/* Banner / Cover Image - Gap tipis 6px dari dinding luar dan melingkar di semua sudut */}
      <div className="absolute -top-[18px] -left-[18px] -right-[18px] sm:-top-[34px] sm:-left-[34px] sm:-right-[34px] md:-top-[42px] md:-left-[42px] md:-right-[42px] h-40 sm:h-48 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 rounded-[1.25rem] sm:rounded-[1.5rem] overflow-hidden z-0 border border-slate-200/40 flex items-center justify-center group">

        {/* Efek Pola Grid Tipis (Desain Kreatif) */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#f97316 0.5px, transparent 0.5px)', backgroundSize: '20px 20px', opacity: 0.15 }}></div>

        {/* Cahaya Latar Berpendar (Glow) */}
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-orange-400/20 rounded-full blur-3xl group-hover:bg-orange-400/30 transition-colors duration-700"></div>
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-amber-400/20 rounded-full blur-3xl group-hover:bg-amber-400/30 transition-colors duration-700"></div>

        {/* Logo Tengah */}
        <div className="relative z-10 p-4">
          <div className="absolute inset-0 bg-white/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <LazyImage
            src="/portfo.be.png"
            className="relative h-10 sm:h-12 md:h-14 w-auto object-contain opacity-80 drop-shadow-sm"
            alt="Portfo.be Cover"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-end justify-between gap-4 relative z-10">
        {/* Avatar & Info Area */}
        <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
          <CldUploadWidget
            uploadPreset={cloudinaryPreset}
            options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["jpg", "png", "webp"], sources: ["local", "camera", "url"], showPoweredBy: false }}
            onSuccess={(result) => {
              if (typeof result.info === 'object' && 'secure_url' in result.info) {
                setAvatarUrl(result.info.secure_url);
                showToast({ message: "Foto terunggah! Jangan lupa klik Simpan.", id: "upload-success-toast", icon: "fa-cloud-upload-alt" });
              }
            }}
          >
            {({ open }) => (
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 group cursor-pointer -mt-16 sm:-mt-20 mb-4 z-20" onClick={() => open()}>
                <div className="absolute -inset-1 bg-slate-900 rounded-full blur-lg opacity-0 group-hover:opacity-10 transition duration-500"></div>
                <div className="relative w-full h-full rounded-full border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] overflow-hidden bg-slate-50">
                  <LazyImage
                    src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName || fullName)}&background=fff7ed&color=ea580c&bold=true`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    alt="Profile Avatar"
                  />
                  <div className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                    <i className="fas fa-camera text-xl mb-1"></i>
                  </div>
                </div>
                {/* Verified Badge - HANYA MUNCUL JIKA PRO/SUPREME */}
                {isPro && (
                  <div className={`absolute -bottom-0.5 -right-0.5 w-9 h-9 rounded-full border-[3px] border-white flex items-center justify-center text-white text-[12px] shadow-lg z-40 ${isSupreme ? 'bg-violet-500' : 'bg-blue-500'}`}>
                    <i className="fas fa-check"></i>
                  </div>
                )}
              </div>
            )}
          </CldUploadWidget>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {firstName ? `${firstName} ${lastName}` : fullName}
              </h2>
              {/* Creator Tag - HANYA MUNCUL JIKA PRO/SUPREME */}
              {isPro && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-widest shadow-sm ${isSupreme ? 'bg-violet-50 text-violet-600 border border-violet-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isSupreme ? 'bg-violet-500' : 'bg-orange-500'}`}></span> {isSupreme ? 'Supreme Creator' : 'Pro Creator'}
                </span>
              )}
            </div>
            <p className="text-[13px] font-medium text-slate-500 flex items-center gap-1.5">
              <i className="far fa-envelope opacity-70"></i> {email}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center sm:justify-end gap-3 w-full sm:w-auto mt-6 sm:mt-0">
          <Link href="/dashboard/projects" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 text-slate-700 text-[13px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all active:scale-95">
            <i className="fas fa-archive text-orange-500"></i> Archive
          </Link>
        </div>
      </div>
    </div>
  );
}
