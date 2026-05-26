"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

export function PreviewPanel({ state, actions }: { state: any, actions: any }) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeReady = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileScale, setMobileScale] = useState(1);

  const {
    isEditorCollapsed,
    isSaving,
    subdomain,
    isLive,
    livePreviewData,
    livePreviewTheme
  } = state;

  const { setIsEditorCollapsed, saveDesign } = actions;

  // Kirim data ke iframe setiap kali livePreviewData atau livePreviewTheme berubah
  const sendDataToIframe = useCallback(() => {
    if (iframeRef.current?.contentWindow && iframeReady.current) {
      iframeRef.current.contentWindow.postMessage({
        type: 'PREVIEW_UPDATE',
        data: livePreviewData,
        theme: livePreviewTheme,
        isMobileView: previewMode === 'mobile'
      }, window.location.origin);
    }
  }, [livePreviewData, livePreviewTheme, previewMode]);

  // Listener untuk sinyal PREVIEW_READY dari iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_READY') {
        iframeReady.current = true;
        sendDataToIframe();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sendDataToIframe]);

  // Kirim update setiap kali data berubah
  useEffect(() => {
    sendDataToIframe();
  }, [sendDataToIframe]);

  // Kalkulasi scale untuk mobile mockup agar tidak kotak/terpotong
  useEffect(() => {
    const calculateScale = () => {
      if (previewMode === 'mobile' && containerRef.current) {
        const targetWidth = 454;
        const targetHeight = 932;
        const availableHeight = containerRef.current.clientHeight - 180;
        const availableWidth = containerRef.current.clientWidth - 80;
        const scaleH = availableHeight / targetHeight;
        const scaleW = availableWidth / targetWidth;
        setMobileScale(Math.min(1, scaleH, scaleW));
      } else {
        setMobileScale(1);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [previewMode]);

  // Desktop zoom controls
  const ZOOM_MIN = 0.4;
  const ZOOM_MAX = 1.0;
  const ZOOM_STEP = 0.1;
  const [desktopZoom, setDesktopZoom] = useState(0.75);

  const zoomIn  = () => setDesktopZoom(z => Math.min(ZOOM_MAX, parseFloat((z + ZOOM_STEP).toFixed(2))));
  const zoomOut = () => setDesktopZoom(z => Math.max(ZOOM_MIN, parseFloat((z - ZOOM_STEP).toFixed(2))));

  return (
    <div ref={containerRef} className="flex-1 h-full relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-10">

      {/* Tombol Re-open Panel Editor */}
      <div className={`absolute top-1/2 left-0 -translate-y-1/2 z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isEditorCollapsed ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setIsEditorCollapsed(false)} className="w-7 h-20 bg-slate-900 border border-slate-800 border-l-0 rounded-r-2xl shadow-[5px_0_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-slate-400 hover:text-white hover:w-9 transition-all active:scale-95" title="Tampilkan Panel Editor">
          <i className="fas fa-chevron-right text-[11px]"></i>
        </button>
      </div>

      <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0"></div>

      {/* FLOATING ACTION BAR */}
      <div className="absolute top-6 z-40 flex items-center gap-3 transition-all duration-700">

        {/* Mode Switcher */}
        <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-slate-200 flex items-center gap-1 shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-2 ${previewMode === 'desktop' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <i className="fas fa-desktop text-[13px]"></i> Desktop
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-2 ${previewMode === 'mobile' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <i className="fas fa-mobile-alt text-[13px]"></i> Mobile
          </button>
        </div>

        {/* Desktop Zoom Controls */}
        {previewMode === 'desktop' && (
          <div className="bg-white/80 backdrop-blur-xl px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-2 shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
            <button
              onClick={zoomOut}
              disabled={desktopZoom <= ZOOM_MIN}
              title="Zoom Out"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
            >
              <i className="fas fa-minus text-[10px]"></i>
            </button>
            <span className="text-[10px] font-extrabold text-slate-700 w-8 text-center tabular-nums">
              {Math.round(desktopZoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={desktopZoom >= ZOOM_MAX}
              title="Zoom In"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
            >
              <i className="fas fa-plus text-[10px]"></i>
            </button>
          </div>
        )}

        {isEditorCollapsed && (
          <button onClick={saveDesign} disabled={isSaving} className="hidden lg:flex px-6 py-2.5 bg-black text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
            {isSaving ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-save"></i>} Simpan
          </button>
        )}

        {subdomain && isLive && isEditorCollapsed && (
          <a href={`/${subdomain}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm active:scale-90" title="Buka Portofolio di Tab Baru">
            <i className="fas fa-external-link-alt text-[11px]"></i>
          </a>
        )}
      </div>

      {/* CONTAINER MOCKUP DEVICE */}
      <div
        className={`relative z-10 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden shrink-0 mt-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200/80
          ${previewMode === 'desktop' ? 'bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-2xl sm:rounded-[2rem]' : 'bg-black border-[12px] border-slate-900 rounded-[3rem] origin-center'}
        `}
        style={previewMode === 'mobile' ? {
          width: '454px',
          height: '932px',
          transform: `scale(${mobileScale})`
        } : undefined}
      >
        <div className="shrink-0 transition-all duration-700 z-20">
          {previewMode === 'desktop' ? (
            <div className="h-12 flex items-center px-4 gap-3 bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>
              <div className="mx-auto px-6 py-1.5 bg-white text-[10px] font-mono text-slate-400 rounded-md flex items-center gap-2 font-bold shadow-sm border border-slate-200/50 truncate max-w-[250px]">
                <i className="fas fa-lock"></i>portfo.be/{subdomain || 'username'}
              </div>
            </div>
          ) : (
            <div className="absolute top-0 left-0 h-7 bg-transparent flex justify-center w-full z-50 pointer-events-none transition-all duration-700">
              <div className="w-28 h-6 bg-slate-900 rounded-b-3xl"></div>
            </div>
          )}
        </div>

        {/* IFRAME PREVIEW */}
        <div className={`flex-1 relative z-0 transition-all duration-700 overflow-hidden ${previewMode === 'desktop' ? 'bg-white' : 'bg-transparent'}`}>
          <iframe
            ref={iframeRef}
            src="/preview"
            title="Portfolio Preview"
            sandbox="allow-scripts allow-same-origin allow-popups"
            style={previewMode === 'desktop' ? {
              border: 'none',
              transformOrigin: 'top left',
              transform: `scale(${desktopZoom})`,
              width: `${(1 / desktopZoom) * 100}%`,
              height: `${(1 / desktopZoom) * 100}%`,
            } : {
              border: 'none',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>

      {/* FLOATING LIVE PREVIEW BUTTON */}
      {subdomain && (
        <a
          href={`/${subdomain}`}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-6 right-6 z-50 px-6 py-3.5 bg-[#ff9e00] text-black font-black uppercase text-[10px] tracking-widest rounded-full shadow-[0_10px_30px_rgba(255,158,0,0.4)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 border-[2px] border-black"
        >
          <i className="fas fa-external-link-alt"></i> Live Preview
        </a>
      )}
    </div>
  );
}
