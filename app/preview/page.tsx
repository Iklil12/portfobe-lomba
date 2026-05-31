"use client";

import React, { useState, useEffect } from 'react';
import PortfolioView from '@/components/PortfolioView';

export default function PreviewPage() {
  const [data, setData] = useState<any>(null);
  const [theme, setTheme] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_UPDATE') {
        setData(event.data.data);
        setTheme(event.data.theme);
        setIsMobileView(!!event.data.isMobileView);
        setIsReady(true);
      }
    };

    window.addEventListener('message', handleMessage);

    // Beritahu parent (PreviewPanel) bahwa iframe sudah siap menerima data
    if (window.parent) {
      window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (!isReady || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="w-6 h-6 border-2 border-slate-700 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-clip bg-white">
      <PortfolioView data={data} theme={theme} isMobileView={isMobileView} isCardPreview={false} isEditor={true} />
    </main>
  );
}
