"use client";

import { useRouter } from 'next/navigation';

export function CloseModalButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all active:scale-90 z-[60]"
      title="Tutup (Esc)"
    >
      <i className="fas fa-times text-xl"></i>
    </button>
  );
}
