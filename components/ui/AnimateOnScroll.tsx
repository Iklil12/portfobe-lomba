// components/ui/AnimateOnScroll.tsx
// Wrapper IntersectionObserver — animasi hanya saat elemen masuk viewport.
// Desain: subtle fade + slide, cocok untuk web profesional kelas atas.
"use client";

import React, { useRef, useEffect, useState } from 'react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  /** Delay animasi dalam ms */
  delay?: number;
  /** translateY awal (default 18px) */
  translateY?: number;
  className?: string;
}

export function AnimateOnScroll({
  children,
  delay = 0,
  translateY = 18,
  className = '',
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.06 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${translateY}px)`,
        transition: visible
          ? `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms`
          : 'none',
      }}
    >
      {children}
    </div>
  );
}
