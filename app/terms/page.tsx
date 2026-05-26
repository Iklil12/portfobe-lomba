"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  const premiumEase = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 py-24 px-6 relative overflow-hidden selection:bg-white selection:text-black">
      {/* --- BACKGROUND ATMOSFER (Matching Landing Page) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-slate-800/20 blur-[100px]" />
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Tombol Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: premiumEase }}
        >
          <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all mb-16 group">
            <i className="fas fa-arrow-left transition-transform group-hover:-translate-x-1"></i> Back to Home
          </Link>
        </motion.div>
        
        <motion.header
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">Terms of <br/><span className="text-slate-500">Service.</span></h1>
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-12 bg-white/20"></span>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">Last updated: April 2026</p>
          </div>
        </motion.header>

        {/* GLASS CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: premiumEase, delay: 0.2 }}
          className="bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative group"
        >
           {/* Decorative corner */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="space-y-12 text-sm md:text-base leading-relaxed font-medium">
            <section className="relative">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-slate-500">01</span>
                Acceptance of Terms
              </h2>
              <p className="text-slate-400 pl-9">By accessing and using Portfo.be ("the Service"), you agree to be bound by these Terms of Service. Our service is designed to help creators showcase their work through dynamic web portfolios.</p>
            </section>

            <section className="relative">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-slate-500">02</span>
                Account Registration
              </h2>
              <p className="text-slate-400 pl-9">Portfo.be uses social authentication (Google) via NextAuth. By logging in, you grant us access to basic profile information (email and name). You are responsible for maintaining the security of your account session.</p>
            </section>

            <section className="relative">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-slate-500">03</span>
                Subscription Models (Free vs Pro)
              </h2>
              <ul className="list-none space-y-4 pl-9">
                <li className="flex gap-4 text-slate-400">
                  <i className="fas fa-info-circle text-[10px] mt-1.5 text-slate-600"></i>
                  <span>**Free Account:** Limited to 4 projects, basic themes, and standard analytics.</span>
                </li>
                <li className="flex gap-4 text-slate-400">
                  <i className="fas fa-crown text-[10px] mt-1.5 text-yellow-500/50"></i>
                  <span>**Pro Account:** Unlimited projects, premium themes (Acid, Cinematic, etc.), custom domain support (coming soon), and advanced analytics dashboard.</span>
                </li>
              </ul>
            </section>

            <section className="relative">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-slate-500">04</span>
                Content Licensing & Media
              </h2>
              <div className="pl-9 space-y-4">
                <p className="text-slate-400">You retain all ownership of your work. However, by uploading assets via **Cloudinary** to our platform, you grant Portfo.be a worldwide license to host and display your content on your public URL.</p>
                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
                   <p className="text-white font-bold text-xs uppercase tracking-widest mb-3">Portfolio Availability:</p>
                   <p className="text-slate-500 text-sm">Your portfolio is public by default. Anyone with your link can view your projects and analytics (if enabled).</p>
                </div>
              </div>
            </section>

            <section className="relative">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-slate-500">05</span>
                Analytics & Data Aggregation
              </h2>
              <p className="text-slate-400 pl-9">We track "Views" and "Clicks" on your portfolio to provide you with insights. This data is aggregated daily via an automated cron job. We do not sell this traffic data to third parties.</p>
            </section>
          </div>

          <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
               &copy; {new Date().getFullYear()} Portfo.be Inc.
             </div>
             <div className="flex gap-8">
               <Link href="/privacy" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}