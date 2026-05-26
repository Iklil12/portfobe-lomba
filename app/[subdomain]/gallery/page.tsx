import React from 'react';
import Link from 'next/link';

export default async function FullGalleryPage({ params }: { params: { subdomain: string } }) {
  const { subdomain } = await params;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-white text-4xl font-black mb-6 uppercase tracking-tighter">Halaman Galeri Penuh</h1>
      <p className="text-white/40 mb-10">Eksplorasi karya-karya terbaik dari {subdomain}.</p>
      
      <Link 
        href={`/${subdomain}`}
        className="px-8 py-4 bg-white text-black font-bold rounded-full text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
      >
        Kembali ke Portofolio
      </Link>
    </div>
  );
}
