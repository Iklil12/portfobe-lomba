"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface Testimonial {
  id: string;
  clientName: string;
  company?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}

interface TestimonialSectionProps {
  testimonials: Testimonial[];
  variant?: 'marquee' | 'grid' | 'slider' | 'stack';
}

export function TestimonialSection({ testimonials, variant = 'grid' }: TestimonialSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  if (variant === 'grid') {
    return (
      <div className="w-full py-10">
        <h3 className="text-2xl font-bold mb-8">Testimonials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <motion.div 
              key={t.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt={t.clientName} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold">
                    {t.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold">{t.clientName}</h4>
                  {t.company && <p className="text-sm opacity-70">{t.company}</p>}
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(t.rating)].map((_, i) => <i key={i} className="fas fa-star text-sm text-amber-400"></i>)}
              </div>
              <p className="text-sm opacity-90 leading-relaxed italic">"{t.content}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // BISA DITAMBAHKAN VARIAN LAIN SEPERTI MARQUEE, SLIDER, STACK DI SINI
  
  return (
    <div className="w-full py-10">
      <h3 className="text-2xl font-bold mb-8 text-center">Testimonials</h3>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {testimonials.map((t) => (
          <div key={t.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-lg opacity-90 leading-relaxed italic mb-6">"{t.content}"</p>
            <div className="flex justify-center mb-2">
              {[...Array(t.rating)].map((_, i) => <i key={i} className="fas fa-star text-sm text-amber-400 mx-0.5"></i>)}
            </div>
            <h4 className="font-bold">{t.clientName}</h4>
            {t.company && <p className="text-sm opacity-70">{t.company}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
