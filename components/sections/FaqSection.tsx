"use client";

import { useState } from 'react';
import { FAQ_LIST } from '@/lib/constants';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} className="py-24 bg-white border-t border-slate-100 relative">
      <div className="max-w-3xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Frequently Asked.</h2>
        </div>
        
        <div className="space-y-4">
          {FAQ_LIST.map((faq) => (
              <div key={faq.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                <button onClick={() => toggleFaq(faq.id)} className="w-full text-left px-6 py-6 font-bold text-slate-800 flex justify-between items-center transition-colors">
                  <span className="text-lg pr-4">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${openFaq === faq.id ? 'bg-slate-900 text-white shadow-md rotate-180' : 'bg-slate-100 text-slate-400 rotate-0'}`}>
                      <i className="fas fa-chevron-down text-sm"></i>
                  </div>
                </button>
                <div className={`px-6 text-slate-500 text-sm md:text-base font-medium leading-relaxed transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${openFaq === faq.id ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0 overflow-hidden'}`}>
                  {faq.a}
                </div>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
