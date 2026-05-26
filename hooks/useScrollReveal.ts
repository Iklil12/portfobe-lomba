"use client";

import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement>(delayMs: number = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Cek apakah elemen sudah terlihat di viewport saat halaman pertama dimuat
    const rect = el.getBoundingClientRect();
    const isAlreadyVisible = (
      rect.top < window.innerHeight &&
      rect.bottom > 0
    );

    // Jika sudah terlihat saat load, langsung tampilkan tanpa animasi
    if (isAlreadyVisible) {
      el.classList.add('opacity-100', 'translate-y-0', 'scale-100');
      return;
    }

    // Jika belum terlihat, sembunyikan dulu dan pasang observer
    el.classList.add(
      'transition-all', 
      'duration-[1400ms]', 
      'ease-[cubic-bezier(0.22,1,0.36,1)]', 
      'opacity-0', 
      'translate-y-8', 
      'scale-[0.97]', 
      'will-change-transform'
    );

    const BASE_PAUSE = 400; // Jeda awal sebelum animasi mulai

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
          entry.target.classList.remove('opacity-0', 'translate-y-8', 'scale-[0.97]');
        }, BASE_PAUSE + delayMs);
        observer.disconnect();
      }
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [delayMs]);

  return ref;
}

