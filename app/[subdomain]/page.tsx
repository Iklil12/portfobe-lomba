//app/[subdomain]/page.tsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link'; 
import { motion } from 'framer-motion';
import PortfolioView from '@/components/PortfolioView';

export default function PublicPortfolioPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [data, setData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [showSplash, setShowSplash] = useState(false); 
  const [liftCurtain, setLiftCurtain] = useState(false);
  const [removeSplash, setRemoveSplash] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if ((heartbeatRef as any)._cleanup) (heartbeatRef as any)._cleanup();
    };
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`/api/portfolio/${subdomain}?t=${new Date().getTime()}`, {
          cache: 'no-store'
        });

        if (res.ok) {
          const result = await res.json();
          setData(result);

          if (result.id) {
            const generateSessionId = () => {
              if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
              return Math.random().toString(36).substring(2) + Date.now().toString(36);
            };
            const sessionId = generateSessionId();
            
            const trackRes = await fetch('/api/analytics/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                subdomain: subdomain,  // FIX K1: server resolves userId dari subdomain
                type: 'VIEW',
                pagePath: window.location.pathname,
                url: window.location.href,
                sessionId: sessionId,
                referrer: document.referrer
              })
            });

            if (trackRes.ok) {
              const trackData = await trackRes.json();
              const analyticsId = trackData.id;
              if (analyticsId) {
                // Simpan di sessionStorage supaya bisa diakses saat flush pagehide
                sessionStorage.setItem('_pfAnalyticsId', analyticsId);

                // Heartbeat tiap 15 detik agar sesi pendek pun tertangkap
                if (heartbeatRef.current) clearInterval(heartbeatRef.current);
                heartbeatRef.current = setInterval(() => {
                  fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'HEARTBEAT', analyticsId })
                  }).catch(() => null);
                }, 15000); // 15 detik

                // Flush durasi saat user pindah tab / close tab / navigasi keluar
                const flushDuration = () => {
                  const id = sessionStorage.getItem('_pfAnalyticsId');
                  if (!id) return;
                  // sendBeacon tidak dibatalkan browser saat halaman unload
                  const blob = new Blob(
                    [JSON.stringify({ type: 'HEARTBEAT', analyticsId: id })],
                    { type: 'application/json' }
                  );
                  navigator.sendBeacon('/api/analytics/track', blob);
                };

                const handleVisibility = () => {
                  if (document.visibilityState === 'hidden') flushDuration();
                };

                document.addEventListener('visibilitychange', handleVisibility);
                window.addEventListener('pagehide', flushDuration);

                // Simpan cleanup ke ref agar bisa dibersihkan di useEffect cleanup
                (heartbeatRef as any)._cleanup = () => {
                  document.removeEventListener('visibilitychange', handleVisibility);
                  window.removeEventListener('pagehide', flushDuration);
                  sessionStorage.removeItem('_pfAnalyticsId');
                };
              }
            }
          }
          
          if (result.siteAppearance?.splashScreen === true || result.splashScreen === true) {
            setShowSplash(true);
            setTimeout(() => {
              setLiftCurtain(true);
              setTimeout(() => setRemoveSplash(true), 800);
            }, 1800);
          } else {
            setLiftCurtain(true);
            setRemoveSplash(true);
            setShowSplash(false);
          }
        }
      } catch (error) {
        console.error("Gagal memuat portofolio", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (subdomain) {
      setIsFetching(true);
      fetchPortfolio();
    }
  }, [subdomain]);

  if (!isFetching && !data) {
    return (
      <div onMouseMove={handleMouseMove} className="relative min-h-screen flex flex-col items-center justify-center bg-[#050505] overflow-hidden font-sans selection:bg-white selection:text-black">
        <div className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300" style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 40%)` }} />
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="relative z-20 flex flex-col items-center text-center">
          <h1 className="text-[8rem] md:text-[15rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-900 leading-none tracking-tighter">404</h1>
          <h2 className="text-xl md:text-2xl font-bold text-slate-200 tracking-tight mb-3">Destinasi Tidak Diketahui</h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 px-4 leading-relaxed">Portofolio dengan subdomain <span className="text-white px-2 py-0.5 bg-white/10 rounded-md font-mono text-sm border border-white/20 shadow-sm mx-1">{subdomain}</span> tidak ditemukan.</p>
          <Link href="/" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-full">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  if (!isFetching && data && data.isLive === false) {
    return (
      <div className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-sans overflow-hidden">
        <div className="relative z-10 flex flex-col items-center w-full max-w-xl mx-auto text-white">
          <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase">Sedang <span className="text-white/50 italic font-medium">Dimasak.</span></h1>
          <p className="text-white/50 text-sm leading-relaxed mb-10">Akses ke portofolio ini ditangguhkan sementara oleh pemiliknya.</p>
          <Link href="/" className="px-8 py-4 bg-white text-black font-bold text-sm tracking-wide">BUAT PORTOFOLIOMU JUGA</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        .splash-screen { position: fixed; inset: 0; z-index: 9999; background-color: #050505; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1); }
        .curtain-up { transform: translateY(-100%); }
        .splash-text { color: #ffffff; font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; font-weight: bold; opacity: 0; animation: blurFadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .splash-line-container { width: 180px; height: 1px; background-color: rgba(255,255,255,0.15); margin-top: 24px; overflow: hidden; opacity: 0; animation: blurFadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards; }
        .splash-line-progress { height: 100%; background-color: #ffffff; width: 0%; animation: loadProgress 1.5s cubic-bezier(0.8, 0, 0.2, 1) 0.4s forwards; }
        @keyframes blurFadeIn { 0% { opacity: 0; filter: blur(5px); transform: translateY(10px); } 100% { opacity: 1; filter: blur(0px); transform: translateY(0); } }
        @keyframes loadProgress { 0% { width: 0%; } 40% { width: 60%; } 100% { width: 100%; } }
        .initial-loader { position: fixed; inset: 0; z-index: 9998; background-color: #F1F5F9; display: flex; align-items: center; justify-content: center; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}} />

      {isFetching && (
        <div className="initial-loader">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        </div>
      )}

      {!removeSplash && showSplash && (
        <div className={`splash-screen ${liftCurtain ? 'curtain-up' : ''}`}>
          <div className="splash-text">{subdomain?.toUpperCase() || 'LOADING'}.SYS</div>
          <div className="splash-line-container"><div className="splash-line-progress"></div></div>
        </div>
      )}

      <main className={`min-h-screen relative overflow-x-clip transition-all duration-1000 ${liftCurtain ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        {data && liftCurtain && <PortfolioView data={data} theme={data.siteAppearance || data} />}
      </main>

      {/* PORTFOBE WATERMARK REMOVED FOR LOMBA EDITION */}
    </>
  );
}