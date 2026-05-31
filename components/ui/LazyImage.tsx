import React, { useState, useEffect, useRef } from 'react';

export const LazyImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<any>(null);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const isVideo = currentSrc?.match(/\.(mp4|webm|ogg)$/i) || currentSrc?.includes('.mp4');

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse z-[-1] rounded-inherit"></div>
      )}
      {isVideo ? (
        <video
          ref={imgRef}
          src={currentSrc}
          className={`
            ${className || ''} 
            ${!className?.includes('absolute') && !className?.includes('fixed') ? 'relative' : ''} 
            ${!className?.includes('z-') ? 'z-0' : ''} 
            transition-all duration-700 ease-in-out object-cover
            ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm scale-105'}
          `}
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setIsLoaded(true)}
          onError={() => {
            setCurrentSrc("https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop");
          }}
        />
      ) : (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setCurrentSrc("https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop");
          }}
          className={`
            ${className || ''} 
            ${!className?.includes('absolute') && !className?.includes('fixed') ? 'relative' : ''} 
            ${!className?.includes('z-') ? 'z-0' : ''} 
            transition-all duration-700 ease-in-out
            ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm scale-105'}
          `}
        />
      )}
    </>
  );
};
