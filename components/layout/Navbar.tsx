"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Features', href: '/#features' },
    { label: 'Templates', href: '/#templates' },
    { label: 'Pricing', href: '/pricing' }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock mobile scroll saat menu aktif
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className={`animate-hero-nav fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex justify-center ${isScrolled ? 'pt-4 px-4' : 'pt-6 px-6 md:px-12'}`}>
        <div className={`flex justify-between items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] w-full rounded-full ${isScrolled ? 'bg-white/90 backdrop-blur-md border border-slate-300 shadow-[0_10px_40px_rgba(0,0,0,0.05)] px-6 py-3 max-w-4xl' : 'bg-transparent border border-transparent px-0 py-0 max-w-7xl'}`}>

          <Link href="/" className="flex items-center cursor-pointer group">
            <img src="/portfo.be.png" alt="Portfo.be Logo" className="h-6 md:h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            {navItems.map(item => (
              <Link key={item.label} href={item.href} className="nav-link text-slate-600 hover:text-slate-900 text-sm font-bold transition-colors">{item.label}</Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login" className="text-slate-600 hover:text-slate-900 text-sm font-bold px-5 py-2 hover:bg-slate-100 rounded-full transition-colors">Log in</Link>
            <Link href="/register" className="px-7 py-2.5 rounded-full bg-[#0f172a] text-white text-sm font-bold hover:bg-black transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 flex items-center gap-2 group">
              Get Started
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-900 focus:outline-none bg-slate-100 hover:bg-slate-200 w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all">
            <i className="fas fa-bars text-sm"></i>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU (SIDE DRAWER) */}
      <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      <div className={`fixed top-0 right-0 w-[85%] max-w-sm h-[100dvh] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <span className="flex items-center">
            <img src="/portfo.be.png" alt="Portfo.be Logo" className="h-6 w-auto object-contain" />
          </span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 active:scale-90 transition-transform">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 mt-4">
          {navItems.map((item, i) => (
            <Link key={item.label} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 font-extrabold text-3xl hover:text-[#ff9e00] transition-colors flex items-center justify-between group" style={{ animationDelay: `${i * 100}ms` }}>
              {item.label} <i className="fas fa-chevron-right text-sm text-slate-300 group-hover:text-[#ff9e00] group-hover:translate-x-2 transition-transform"></i>
            </Link>
          ))}
        </div>
        <div className="p-6 border-t border-slate-100 flex flex-col gap-3">
          <Link href="/login" className="block w-full text-slate-900 font-bold py-4 text-center bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Log in</Link>
          <Link href="/register" className="block w-full py-4 rounded-xl bg-slate-900 text-white text-center font-bold shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2">
            Get Started Free <i className="fas fa-bolt text-yellow-400"></i>
          </Link>
        </div>
      </div>
    </>
  );
}
