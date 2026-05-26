"use client";

import React, { useState, useEffect, useRef } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { motion, AnimatePresence } from 'framer-motion';

export type CalendarThemeVariant = 'monochrome' | 'classic' | 'acid' | 'aura' | 'noir' | 'bento' | 'brutalism' | 'cinematic' | 'editorial' | 'midnight' | 'monolith' | 'spatial' | 'split' | 'viewfinder' | 'minimalist';

interface GithubCalendarWidgetProps {
  username: string;
  variant?: CalendarThemeVariant;
  colorScheme?: 'light' | 'dark';
  themeColor?: string;
  year?: number | 'last';
}

function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 57, g: 211, b: 83 };
}

export function GithubCalendarWidget({
  username,
  variant = 'monochrome',
  colorScheme = 'light',
  themeColor,
  year: initialYear = new Date().getFullYear()
}: GithubCalendarWidgetProps) {

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | 'last'>(initialYear);
  const [isReady, setIsReady] = useState(false);
  const [hoveredData, setHoveredData] = useState<{ count: number, date: string, x: number, y: number, progress: number } | null>(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  const years = [currentYear, currentYear - 1, currentYear - 2];

  // Gunakan skema warna GitHub standar untuk stabilitas
  const { r, g, b } = hexToRgb(themeColor || "");
  let baseColor = colorScheme === 'dark' ? '#161b22' : '#ebedf0';
  
  // Brighten empty squares for noir & aura variant as it's often too dark on true black
  if ((variant === 'noir' || variant === 'aura') && colorScheme === 'dark') {
    baseColor = '#30363d';
  }

  const calendarTheme = {
    light: [baseColor, `rgba(${r},${g},${b},0.25)`, `rgba(${r},${g},${b},0.5)`, `rgba(${r},${g},${b},0.75)`, `rgba(${r},${g},${b},1)`],
    dark: [baseColor, `rgba(${r},${g},${b},0.25)`, `rgba(${r},${g},${b},0.5)`, `rgba(${r},${g},${b},0.75)`, `rgba(${r},${g},${b},1)`]
  };

  const getTitleColor = () => {
    if (themeColor) return themeColor;
    switch (variant) {
      case 'acid': return '#a3e635';
      case 'aura': return '#a78bfa';
      case 'classic': return '#64748b';
      case 'monochrome':
      default: return '#94a3b8';
    }
  };

  // Reset & Re-mount setiap ganti tahun untuk menghindari error library
  useEffect(() => {
    setIsReady(false);
    setIsCalendarVisible(false);
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, [username, selectedYear]);

  // Scroll-triggered: animasi kotak hanya mulai saat kalender terlihat di viewport
  useEffect(() => {
    const el = calendarContainerRef.current;
    if (!el || !isReady) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsCalendarVisible(true), 400);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isReady]);

  if (!username) return null;

  return (
    <div className="w-full font-sans relative">
      <div className="flex flex-col @sm:flex-row justify-between items-start @sm:items-center gap-4 mb-6">
        <span className="text-[10px] font-bold uppercase tracking-widest block opacity-70" style={{ color: getTitleColor() }}>
          Contributions ({selectedYear === 'last' ? 'Last Year' : selectedYear})
        </span>

        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
          {years.map((y) => (
            <button key={y} onClick={() => setSelectedYear(y)} className={`px-3 py-1 text-[9px] font-bold uppercase transition-all rounded-md ${selectedYear === y ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}>{y}</button>
          ))}
          <button onClick={() => setSelectedYear('last')} className={`px-3 py-1 text-[9px] font-bold uppercase transition-all rounded-md ${selectedYear === 'last' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}>Last Year</button>
        </div>
      </div>

      <div ref={calendarContainerRef} className="w-full overflow-x-auto hide-scrollbar pb-2 relative">
        <div className="min-w-max relative pt-12 pb-4">
          <AnimatePresence mode="wait">
            {!isReady ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
              </motion.div>
            ) : (
              <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <GitHubCalendar
                  username={username}
                  year={selectedYear}
                  colorScheme={colorScheme}
                  theme={calendarTheme}
                  blockSize={11}
                  blockMargin={4}
                  fontSize={11}
                  renderBlock={(block, activity) => {
                    const date = new Date(activity.date);
                    const startDate = selectedYear === 'last' 
                      ? new Date().getTime() - 365 * 24 * 60 * 60 * 1000 
                      : new Date(Number(selectedYear), 0, 1).getTime();
                    const dayIndex = Math.max(0, Math.floor((date.getTime() - startDate) / 86400000));

                    return (
                      <motion.rect
                        {...(block.props as any)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isCalendarVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 18,
                          delay: isCalendarVisible ? dayIndex * 0.004 : 0,
                        }}
                        onMouseEnter={(e: React.MouseEvent) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const container = e.currentTarget.closest('.min-w-max.relative');
                          const containerRect = container?.getBoundingClientRect();
                          
                          if (containerRect) {
                            const x = rect.left - containerRect.left + rect.width / 2;
                            const progress = x / containerRect.width;
                            setHoveredData({
                              count: activity.count,
                              date: activity.date,
                              x: Math.round(x),
                              y: Math.round(rect.top - containerRect.top),
                              progress: progress
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredData(null)}
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tooltip Floating */}
          <AnimatePresence>
            {hoveredData && (
              <motion.div
                initial={{ opacity: 0, y: '-95%', scale: 0.9 }}
                animate={{ opacity: 1, y: '-100%', scale: 1 }}
                exit={{ opacity: 0, y: '-95%', scale: 0.9 }}
                transition={{ duration: 0.1 }}
                style={{ 
                  position: 'absolute', 
                  left: hoveredData.x, 
                  top: (hoveredData.y || 0) - 10,
                  x: `${-hoveredData.progress * 100}%`,
                  pointerEvents: 'none', 
                  zIndex: 999 
                }}
                className="bg-slate-900 text-white text-[10px] font-bold py-1.5 px-3 rounded shadow-xl whitespace-nowrap border border-slate-700"
              >
                {hoveredData.count} contributions on {new Date(hoveredData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                <div 
                  className="absolute top-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-900 -translate-x-1/2"
                  style={{ left: `${hoveredData.progress * 100}%` }}
                ></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
