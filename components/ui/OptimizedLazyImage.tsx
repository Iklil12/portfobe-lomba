import React, { useState } from 'react';
import Image from 'next/image';

export const OptimizedLazyImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const isVideo = imgSrc?.match(/\.(mp4|webm|ogg)$/i) || imgSrc?.includes('.mp4');

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse z-[-1] rounded-inherit"></div>
      )}
      {isVideo ? (
        <video
          src={imgSrc}
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
            setImgSrc("https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop");
          }}
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setImgSrc("https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop");
            setIsLoaded(true);
          }}
          className={`
            ${className || ''} 
            ${!className?.includes('absolute') && !className?.includes('fixed') ? 'relative' : ''} 
            ${!className?.includes('z-') ? 'z-0' : ''} 
            transition-all duration-700 ease-in-out object-cover
            ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm scale-105'}
          `}
        />
      )}
    </>
  );
};
