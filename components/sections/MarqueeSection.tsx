import { MARQUEE_TEXTS } from '@/lib/constants';

export function MarqueeSection() {
  return (
    <section className="py-8 border-y border-slate-200 bg-white overflow-hidden relative z-30">
      <div className="flex space-x-12 marquee w-max text-slate-300 font-extrabold tracking-widest text-lg md:text-xl uppercase">
        {[1, 2, 3].map((group) => (
            <div key={group} className="flex items-center space-x-12">
                {MARQUEE_TEXTS.map((txt, i) => (
                    <span key={i} className="flex items-center gap-12 hover:text-[#ff9e00] transition-colors cursor-default">
                        <span className="text-[#ff9e00]/50">*</span>
                        <span>{txt}</span>
                    </span>
                ))}
            </div>
        ))}
      </div>
    </section>
  );
}
