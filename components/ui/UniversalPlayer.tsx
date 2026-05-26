"use client";

import React, { useState } from 'react';

interface UniversalPlayerProps {
  mediaUrl: string;
  title?: string;
}

export function UniversalPlayer({ mediaUrl, title = "Video Player" }: UniversalPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Fungsi deteksi YouTube
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  // Fungsi deteksi Vimeo
  const getVimeoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:vimeo\.com\/)(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
    return match ? match[1] : null;
  };

  // Cek apakah itu Bunny Stream ID
  // Biasanya Bunny Stream menggunakan UUID (8-4-4-4-12) atau string GUID.
  const isBunnyStream = (url: string) => {
    // Anggap URL adalah Bunny ID jika bukan URL yang valid atau memiliki format Bunny
    if (url.length === 36 && url.includes('-')) return true; // Cek pola UUID sederhana
    return false;
  };

  const ytId = getYouTubeId(mediaUrl);
  const vimeoId = getVimeoId(mediaUrl);
  const bunnyLibraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;

  return (
    <div className="@container w-full h-full relative group">
      <div className={`w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200/60 bg-slate-900 transition-all duration-500 relative ${!isLoaded ? 'animate-pulse' : ''}`}>
        
        {/* Loading State Spinner */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <i className="fas fa-circle-notch text-white/30 animate-spin text-3xl"></i>
          </div>
        )}

        {ytId ? (
          <iframe
            className="w-full h-full object-cover z-10 relative opacity-0 transition-opacity duration-700"
            style={{ opacity: isLoaded ? 1 : 0 }}
            src={`https://www.youtube.com/embed/${ytId}?modestbranding=1&rel=0&showinfo=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoaded(true)}
          ></iframe>
        ) : vimeoId ? (
          <iframe
            className="w-full h-full object-cover z-10 relative opacity-0 transition-opacity duration-700"
            style={{ opacity: isLoaded ? 1 : 0 }}
            src={`https://player.vimeo.com/video/${vimeoId}?color=ffffff&title=0&byline=0&portrait=0`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoaded(true)}
          ></iframe>
        ) : isBunnyStream(mediaUrl) ? (
          // BUNNY STREAM PLAYER IFRAME
          <iframe
            className="w-full h-full object-cover z-10 relative opacity-0 transition-opacity duration-700"
            style={{ opacity: isLoaded ? 1 : 0, border: 'none' }}
            src={`https://iframe.mediadelivery.net/embed/${bunnyLibraryId}/${mediaUrl}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
            title={title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
            onLoad={() => setIsLoaded(true)}
          ></iframe>
        ) : (
          // FALLBACK KE VIDEO TAG JIKA LINK LANGSUNG (.mp4 dll)
          <video
            className="w-full h-full object-cover z-10 relative opacity-0 transition-opacity duration-700"
            style={{ opacity: isLoaded ? 1 : 0 }}
            controls
            preload="metadata"
            onLoadedData={() => setIsLoaded(true)}
          >
            <source src={mediaUrl} />
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Hover overlay gradient (Premium touch) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"></div>
      </div>
    </div>
  );
}
