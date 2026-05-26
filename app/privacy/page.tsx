"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  const premiumEase = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 py-24 px-6 relative overflow-hidden selection:bg-white selection:text-black">
      {/* --- BACKGROUND ATMOSFER (Matching Landing Page) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-slate-800/20 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
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
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">Privacy <br/><span className="text-slate-500">Policy.</span></h1>
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
          <div className="space-y-12 text-sm md:text-base leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-slate-500">01</span>
                Introduction & Authentication
              </h2>
              <p className="text-slate-400 pl-9">Welcome to Portfo.be. We use **NextAuth** for secure Google-based authentication. We only collect the necessary profile data (Email, Name, Image) to personalize your experience and manage your portfolio.</p>
            </section>

            <section>
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-slate-500">02</span>
                Data Storage & Assets
              </h2>
              <div className="pl-9 space-y-4 text-slate-400">
                <p>Your portfolio data (titles, descriptions, links) is stored in our secure database hosted on **Hostinger**. All media assets (Images, Portfolio Covers) are uploaded and served via **Cloudinary**.</p>
                <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl text-xs space-y-2">
                  <p className="text-white font-bold">What we store:</p>
                  <p>- Google account identifiers (encrypted).</p>
                  <p>- Portfolio content & metadata.</p>
                  <p>- Aggregated daily statistics.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-slate-500">03</span>
                Visitor Analytics Tracking
              </h2>
              <div className="pl-9 space-y-4 text-slate-400">
                <p>To help you understand your audience, we collect anonymous visitor data including:</p>
                <ul className="list-none space-y-2">
                   <li className="flex gap-4">
                     <i className="fas fa-check text-[8px] mt-1.5 text-slate-600"></i>
                     <span>**Views:** Every visit to your portfolio page.</span>
                   </li>
                   <li className="flex gap-4">
                     <i className="fas fa-check text-[8px] mt-1.5 text-slate-600"></i>
                     <span>**Clicks:** Interactions with your project links.</span>
                   </li>
                </ul>
                <p className="italic text-slate-500 text-xs">Note: Visitor IP addresses are processed for aggregation but are not permanently stored in their raw form.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-slate-500">04</span>
                Cookies & Sessions
              </h2>
              <p className="text-slate-400 pl-9">We use essential cookies to maintain your login session. We do not use third-party tracking cookies for advertising purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="text-[10px] w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-slate-500">05</span>
                Contact & Support
              </h2>
              <p className="text-slate-400 pl-9">For data deletion requests or privacy inquiries, contact us at: <strong className="text-white underline">ikliluluyun@ritions.com</strong></p>
            </section>
          </div>

          <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest">
             <div className="text-slate-600">
               &copy; {new Date().getFullYear()} Portfo.be Inc.
             </div>
             <Link href="/terms" className="text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
