"use client";

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#050505] text-slate-400 pt-24 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* CTA SECTION - Dipertahankan karena ini bagus untuk konversi */}
          <div className="bg-[#111] rounded-[2.5rem] p-10 md:p-16 mb-24 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
              <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#ff9e00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              <div className="relative z-10 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">Ready to launch?</h2>
                  <p className="text-slate-400 font-medium">Join thousands of visual creators on Portfo.be today.</p>
              </div>
              <Link href="/register" className="shrink-0 px-8 py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-[#ff9e00] hover:text-black active:scale-95 transition-all duration-300 shadow-lg flex items-center gap-3 z-10 group/btn">
                  Get Started Free <i className="fas fa-arrow-right text-xs group-hover/btn:translate-x-1 transition-transform"></i>
              </Link>
          </div>

          {/* GRID SECTION - Disesuaikan menjadi 4 Kolom agar proporsional */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
              
              {/* KOLOM LOGO & DESKRIPSI (Mengambil 2 porsi grid) */}
              <div className="col-span-2 pr-0 md:pr-12">
                  <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2 mb-6">
                      <img src="/portfo.be.png" alt="Portfo.be Logo" className="h-8 md:h-10 w-auto object-contain brightness-0 invert" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed mb-8 text-slate-500 max-w-sm">The premier hub for visual creators to showcase work, share links, and land high-paying clients without writing a single line of code.</p>
                  <div className="flex gap-4">
                      <a href="https://web.facebook.com/profile.php?id=61589094247534" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-blue-500 hover:scale-110 hover:-translate-y-1 transition-all duration-300"><i className="fab fa-facebook"></i></a>
                      <a href="https://www.instagram.com/portfo.be/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-pink-600 hover:scale-110 hover:-translate-y-1 transition-all duration-300"><i className="fab fa-instagram"></i></a>
                      <a href="https://www.tiktok.com/@portfo.be" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-110 hover:-translate-y-1 transition-all duration-300"><i className="fab fa-tiktok"></i></a>
                  </div>
              </div>
              
              {/* KOLOM PLATFORM (Disederhanakan untuk Landing Page) */}
              <div className="col-span-1">
                  <h4 className="text-white font-bold mb-6">Platform</h4>
                  <ul className="space-y-4 text-sm font-medium">
                      <li><a href="#features" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Features</a></li>
                      <li><a href="/pricing" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Pricing</a></li>
                      <li><a href="/support" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Support</a></li>
                  </ul>
              </div>
              
              {/* KOLOM LEGAL (Wajib untuk rilis MVP) */}
              <div className="col-span-1">
                  <h4 className="text-white font-bold mb-6">Legal</h4>
                  <ul className="space-y-4 text-sm font-medium">
                      <li><Link href="/privacy" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Privacy Policy</Link></li>
                      <li><Link href="/terms" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">Terms of Service</Link></li>
                  </ul>
              </div>
          </div>

          {/* BOTTOM COPYRIGHT */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-600">
              <p>&copy; {new Date().getFullYear()} Portfo.be Inc.</p>
          </div>
      </div>
    </footer>
  );
}