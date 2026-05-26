"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import toast from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const isLoggedIn = false;
  const isPro = false;


  const handleSend = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Mohon lengkapi semua field.");
      return;
    }

    setIsSending(true);
    const toastId = toast.loading("Mengirim pesan...");

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Pesan terkirim! Kami akan segera menghubungi Anda.", { id: toastId });
        setFormData(prev => ({ ...prev, message: '' }));
      } else {
        toast.error("Gagal mengirim pesan. Silakan coba lagi.", { id: toastId });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.", { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  const waNumber = "6283144303789"; // Ganti dengan nomor WhatsApp admin Anda
  const waMessage = encodeURIComponent(`Halo Admin Portfobe! Saya User (Guest). Saya butuh bantuan terkait...`);
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-24 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-slate-200/30 to-transparent pointer-events-none z-0"></div>
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0; 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(30px); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}} />

      <div className="max-w-6xl mx-auto px-6 pt-10 md:pt-20 relative z-10">

        {/* Navigation */}
        <div className="flex justify-between items-center mb-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/portfo.be.png" alt="Logo" className="h-6 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold text-slate-900 px-5 py-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all">Login</Link>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-16 animate-enter">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <i className="fas fa-headset"></i> Help Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            Ada yang bisa kami <span className="text-slate-400 font-light">Bantu</span>?
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed">
            Kami siap membantu Anda membangun portofolio terbaik. Pilih saluran dukungan yang sesuai dengan paket Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          {/* FAQ / Knowledge Base */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all animate-enter group" style={{ animationDelay: '100ms' }}>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <i className="fas fa-book-open"></i>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-3">Pusat Bantuan</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">Cari jawaban cepat untuk pertanyaan umum seputar fitur dan pengaturan.</p>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
              Buka Artikel <i className="fas fa-arrow-right text-[8px]"></i>
            </Link>
          </div>

          {/* Email Support */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all animate-enter group" style={{ animationDelay: '200ms' }}>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <i className="fas fa-envelope"></i>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-3">Kirim Email</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">Hubungi tim kami via email untuk pertanyaan yang lebih teknis atau spesifik.</p>
            <a href="mailto:ikliluluyun@ritions.com" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2">
              Kirim Pesan <i className="fas fa-paper-plane text-[8px]"></i>
            </a>
          </div>

          {/* WhatsApp Priority Support */}
          <div className={`relative p-8 rounded-[2rem] border transition-all animate-enter group overflow-hidden ${isPro ? 'bg-white border-emerald-500 shadow-lg' : 'bg-slate-50 border-slate-100 opacity-80'}`} style={{ animationDelay: '300ms' }}>
            {isPro && (
              <div className="absolute top-4 right-4 text-emerald-500 text-xs animate-pulse">
                <i className="fas fa-bolt"></i> Prioritas Aktif
              </div>
            )}

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all ${isPro ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-200 text-slate-400'}`}>
              <i className="fab fa-whatsapp text-xl"></i>
            </div>

            <h3 className={`text-lg font-black mb-3 ${isPro ? 'text-slate-900' : 'text-slate-400'}`}>
              WhatsApp Chat {!isPro && <i className="fas fa-lock text-xs ml-1"></i>}
            </h3>

            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">
              Dapatkan dukungan 1-on-1 langsung dari tim kami. Eksklusif untuk pengguna paket PRO.
            </p>

            {isPro ? (
              <a href={waUrl} target="_blank" rel="noreferrer" className="w-full py-4 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 shadow-md">
                Mulai Chat Sekarang
              </a>
            ) : (
              <Link href="/pricing" className="w-full py-4 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                Upgrade Pro untuk Akses
              </Link>
            )}
          </div>

        </div>

        {/* Form Support Section */}
        <div className="mt-20 max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-enter" style={{ animationDelay: '400ms' }}>
          <h4 className="text-xl font-black text-slate-900 mb-2">Formulir Kontak</h4>
          <p className="text-xs text-slate-500 font-medium mb-8">Butuh bantuan lebih lanjut? Isi formulir di bawah dan kami akan membalas dalam 24-48 jam.</p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan nama..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Email</label>
                <input
                  type="email"
                  placeholder="email@contoh.com"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Pesan / Kendala</label>
              <textarea
                rows={4}
                placeholder="Ceritakan masalah Anda secara detail..."
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Mengirim...' : 'Kirim Formulir'}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
