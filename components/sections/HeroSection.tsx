"use client";

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const words = ["Work.", "Portfolio.", "Presence.", "Brand.", "Identity."];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseBeforeDelete = 2000;

    let timer: NodeJS.Timeout;
    const currentFullWord = words[currentWordIndex];

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } else {
        timer = setTimeout(() => {
          setCurrentText(currentFullWord.substring(0, currentText.length - 1));
        }, deletingSpeed);
      }
    } else {
      if (currentText === currentFullWord) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseBeforeDelete);
      } else {
        timer = setTimeout(() => {
          setCurrentText(currentFullWord.substring(0, currentText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 }
    }
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 25, filter: "blur(8px)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.5, type: "spring", bounce: 0.35 }
    }
  };

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.7, type: "spring", bounce: 0.3 }
    }
  };

  return (
    <section className="relative pt-36 pb-24 md:pt-36 md:pb-40 overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-[#FAFAFA] pointer-events-none z-0"></div>

      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-[#ff9e00]/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-blue-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[40%] w-[700px] h-[700px] bg-pink-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">

        {/* TEXT CONTAINER HERO — Full width, centered */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full text-center flex flex-col items-center"
        >



          <motion.h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] tracking-tighter leading-[1.05] text-slate-900 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:gap-x-5 mb-8">
            <motion.span variants={wordVariants} className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">Showcase</motion.span>
            <motion.div variants={wordVariants} className="w-24 md:w-40 h-12 md:h-[4.5rem] rounded-full overflow-hidden inline-block align-middle shadow-[0_8px_20px_rgba(0,0,0,0.12)] shrink-0 hover:scale-105 transition-transform duration-500 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" alt="Creative team" />
            </motion.div>
            <motion.span variants={wordVariants} className="font-light text-slate-400 italic relative inline-block" translate="no">
              {/* Invisible longest word to reserve fixed width */}
              <span className="invisible">Portfolio.</span>
              {/* Visible typing text overlaid on top */}
              <span className="absolute left-0 top-0 whitespace-nowrap">
                {currentText}
                <span className={`inline-block w-[3px] h-[0.75em] bg-slate-400 ml-[2px] align-middle ${currentText === words[currentWordIndex] ? 'animate-[blink_1s_step-end_infinite]' : ''}`}></span>
              </span>
            </motion.span>
            <div className="w-full basis-full h-0"></div>
            <motion.span variants={wordVariants} className="font-extrabold">Land More</motion.span>
            <motion.span variants={wordVariants} className="font-light text-slate-400">Clients.</motion.span>
          </motion.h1>

          <motion.p variants={fadeUpVariants} className="text-slate-500 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
            The quick brown fox minimalist portfolio builder designed exclusively for visual creators. Zero coding, lightning-fast, and unapologetically beautiful.
          </motion.p>

          <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row items-center gap-4 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-full bg-[#ff9e00]/50 blur-2xl rounded-full animate-pulse pointer-events-none"></div>
            <Link href="/register" className="relative z-10 inline-flex items-center gap-4 pl-8 pr-2 py-2 rounded-full bg-[#ff9e00] hover:bg-[#e68e00] active:scale-95 transition-all group shadow-[0_10px_30px_rgba(255,158,0,0.3)]">
              <span className="text-[11px] font-black uppercase tracking-widest text-black">Start Building</span>
              <div className="bg-black w-10 h-10 rounded-full flex items-center justify-center text-white group-hover:bg-slate-800 transition-colors duration-300">
                <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
              </div>
            </Link>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-4 py-2">
              <i className="fas fa-star text-yellow-400 animate-pulse"></i> Free Forever Plan
            </span>
          </motion.div>



        </motion.div>

      </div>
    </section>
  );
}
