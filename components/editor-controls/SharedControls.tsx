"use client";
import React from 'react';

export interface ThemeControlProps {
  themeColor?: string;
  setThemeColor?: (color: string) => void;
  fontHeading?: string;
  setFontHeading?: (font: string) => void;
  fontBody?: string;
  setFontBody?: (font: string) => void;
  cardStyle?: string;
  setCardStyle?: (style: string) => void;
  buttonShape?: string;
  setButtonShape?: (shape: string) => void;
}

const DEFAULT_COLORS = [
  { name: 'Noir', hex: '#000000' },
  { name: 'Slate', hex: '#64748b' },
  { name: 'Navy', hex: '#0f172a' },
  { name: 'Crimson', hex: '#991b1b' },
  { name: 'Forest', hex: '#166534' },
  { name: 'Azure', hex: '#2563eb' },
  { name: 'Amber', hex: '#f59e0b' }
];

export function ColorPicker({ themeColor, setThemeColor }: { themeColor?: string, setThemeColor?: (c: string) => void }) {
  if (!setThemeColor) return null;
  return (
    <div className="mb-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded flex items-center justify-center text-neutral-400"><i className="fas fa-palette text-[10px]"></i></div>
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">Aksen Warna Utama</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {DEFAULT_COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => setThemeColor(c.hex)}
            className={`group relative w-10 h-10 rounded-full border-2 transition-all duration-300 ${themeColor?.toLowerCase() === c.hex || (!themeColor && c.hex === '#000000') ? 'border-neutral-900 scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
          >
            <div className="absolute inset-[3px] rounded-full" style={{ backgroundColor: c.hex }}></div>
            {(themeColor?.toLowerCase() === c.hex || (!themeColor && c.hex === '#000000')) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-check text-white text-[10px]"></i>
              </div>
            )}
          </button>
        ))}
        <div className="relative group">
          <div className={`w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center overflow-hidden transition-all duration-300 ${themeColor && !DEFAULT_COLORS.find(c => c.hex === themeColor.toLowerCase()) ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2 scale-105' : 'hover:border-neutral-300 bg-neutral-50'}`}>
            <input
              type="color"
              value={themeColor || '#000000'}
              onChange={(e) => setThemeColor(e.target.value)}
              className="absolute inset-[-10px] w-16 h-16 cursor-pointer opacity-0"
            />
            <i className="fas fa-plus text-[10px] text-neutral-400 group-hover:text-neutral-700 transition-colors"></i>
          </div>
        </div>
      </div>
      <div className="w-full h-px bg-neutral-100 mt-10"></div>
    </div>
  );
}

export function FontPicker({ fontHeading, setFontHeading, setFontBody }: { fontHeading?: string, setFontHeading?: (f: string) => void, setFontBody?: (f: string) => void }) {
  if (!setFontHeading) return null;
  const isFontMono = fontHeading?.toLowerCase().includes('space') || fontHeading?.toLowerCase().includes('mono');
  const isFontSerif = fontHeading?.toLowerCase().includes('serif') || fontHeading?.toLowerCase().includes('elegant') || fontHeading?.toLowerCase().includes('playfair');
  const isFontSans = !isFontMono && !isFontSerif;

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-right-4 duration-500 delay-75">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded flex items-center justify-center text-neutral-400"><i className="fas fa-font text-[10px]"></i></div>
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">Tipografi Font</h3>
      </div>
      <div className="flex p-1 bg-neutral-50 rounded-2xl border border-neutral-200/60">
        <button onClick={() => {setFontHeading('Space Mono'); setFontBody?.('Space Mono')}} className={`flex-1 py-3 rounded-xl text-[11px] font-semibold transition-all duration-300 font-mono tracking-wide ${isFontMono ? 'bg-white shadow-sm text-neutral-900 border border-neutral-200/50' : 'text-neutral-500 hover:text-neutral-800'}`}>Monospace</button>
        <button onClick={() => {setFontHeading('Inter'); setFontBody?.('Inter')}} className={`flex-1 py-3 rounded-xl text-[11px] font-semibold transition-all duration-300 font-sans ${isFontSans ? 'bg-white shadow-sm text-neutral-900 border border-neutral-200/50' : 'text-neutral-500 hover:text-neutral-800'}`}>Modern Sans</button>
        <button onClick={() => {setFontHeading('serif'); setFontBody?.('serif')}} className={`flex-1 py-3 rounded-xl text-[11px] font-semibold transition-all duration-300 font-serif italic ${isFontSerif ? 'bg-white shadow-sm text-neutral-900 border border-neutral-200/50' : 'text-neutral-500 hover:text-neutral-800'}`}>Elegant Serif</button>
      </div>
      <div className="w-full h-px bg-neutral-100 mt-10"></div>
    </div>
  );
}

export function CardStylePicker({ cardStyle, setCardStyle }: { cardStyle?: string, setCardStyle?: (s: string) => void }) {
  if (!setCardStyle) return null;
  const isCardHard = cardStyle === 'hard-shadow' || cardStyle === 'hard';
  const isCardFlat = cardStyle === 'flat';
  const isCardSoft = cardStyle === 'soft-shadow' || cardStyle === 'soft';

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded flex items-center justify-center text-neutral-400"><i className="fas fa-border-all text-[10px]"></i></div>
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">Gaya Kartu Proyek</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setCardStyle('hard-shadow')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isCardHard ? 'bg-neutral-900 border-neutral-900 shadow-md' : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm'}`}>
          <div className={`w-8 h-8 rounded-md transition-all duration-300 shrink-0 ${isCardHard ? 'bg-white border-2 border-neutral-400 shadow-[3px_3px_0px_0px_#cbd5e1]' : 'bg-neutral-100 border border-neutral-300 group-hover:shadow-[3px_3px_0px_0px_#94a3b8]'}`}></div>
          <span className={`text-[9px] font-semibold uppercase tracking-widest ${isCardHard ? 'text-white' : 'text-neutral-500'}`}>Brutalism</span>
        </button>
        <button onClick={() => setCardStyle('flat')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isCardFlat ? 'bg-neutral-900 border-neutral-900 shadow-md' : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm'}`}>
          <div className={`w-8 h-8 rounded-md transition-all duration-300 shrink-0 ${isCardFlat ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-neutral-200 group-hover:border-neutral-400'}`}></div>
          <span className={`text-[9px] font-semibold uppercase tracking-widest ${isCardFlat ? 'text-white' : 'text-neutral-500'}`}>Clean Flat</span>
        </button>
        <button onClick={() => setCardStyle('soft-shadow')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isCardSoft ? 'bg-neutral-900 border-neutral-900 shadow-md' : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm'}`}>
          <div className={`w-8 h-8 rounded-xl transition-all duration-300 shrink-0 ${isCardSoft ? 'bg-white shadow-[0_4px_15px_rgba(255,255,255,0.2)]' : 'bg-white border border-neutral-100 group-hover:shadow-sm group-hover:border-neutral-200'}`}></div>
          <span className={`text-[9px] font-semibold uppercase tracking-widest ${isCardSoft ? 'text-white' : 'text-neutral-500'}`}>Soft Drop</span>
        </button>
      </div>
      <div className="w-full h-px bg-neutral-100 mt-10"></div>
    </div>
  );
}

export function ButtonShapePicker({ buttonShape, setButtonShape }: { buttonShape?: string, setButtonShape?: (s: string) => void }) {
  if (!setButtonShape) return null;
  const isBtnHard = buttonShape === 'hard' || buttonShape === 'square';
  const isBtnRounded = buttonShape === 'rounded';
  const isBtnPill = buttonShape === 'pill';

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded flex items-center justify-center text-neutral-400"><i className="fas fa-shapes text-[10px]"></i></div>
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">Bentuk Elemen</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setButtonShape('hard')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isBtnHard ? 'bg-neutral-900 border-neutral-900 shadow-md' : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm'}`}>
          <div className={`w-8 h-4 transition-all duration-300 rounded-none ${isBtnHard ? 'bg-neutral-500' : 'bg-neutral-200 group-hover:bg-neutral-400'}`}></div>
          <span className={`text-[9px] font-semibold uppercase tracking-widest ${isBtnHard ? 'text-white' : 'text-neutral-500'}`}>Kotak</span>
        </button>
        <button onClick={() => setButtonShape('rounded')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isBtnRounded ? 'bg-neutral-900 border-neutral-900 shadow-md' : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm'}`}>
          <div className={`w-8 h-4 transition-all duration-300 rounded-md ${isBtnRounded ? 'bg-neutral-500' : 'bg-neutral-200 group-hover:bg-neutral-400'}`}></div>
          <span className={`text-[9px] font-semibold uppercase tracking-widest ${isBtnRounded ? 'text-white' : 'text-neutral-500'}`}>Melingkar</span>
        </button>
        <button onClick={() => setButtonShape('pill')} className={`group relative py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 active:scale-95 ${isBtnPill ? 'bg-neutral-900 border-neutral-900 shadow-md' : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm'}`}>
          <div className={`w-8 h-4 transition-all duration-300 rounded-full ${isBtnPill ? 'bg-neutral-500' : 'bg-neutral-200 group-hover:bg-neutral-400'}`}></div>
          <span className={`text-[9px] font-semibold uppercase tracking-widest ${isBtnPill ? 'text-white' : 'text-neutral-500'}`}>Kapsul</span>
        </button>
      </div>
    </div>
  );
}
