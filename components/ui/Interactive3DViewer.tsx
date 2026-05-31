import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

const ModelViewer = 'model-viewer' as any;

export function Interactive3DViewer({ mediaUrl, bgColor, alwaysShowControls }: { mediaUrl: string, bgColor?: string, alwaysShowControls?: boolean }) {
  const [exposure, setExposure] = useState(1.0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px' } // Increased margin to trigger earlier
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Fallback: Force load after 3 seconds if observer fails (due to GSAP transforms, etc)
    const timeout = setTimeout(() => {
      setInView(true);
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  // Controls are always visible on mobile/touch OR when explicitly requested
  const controlsClass = alwaysShowControls
    ? "absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full z-30 mv3d-controls-mobile"
    : "absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full opacity-0 group-hover/mv:opacity-100 [@media(hover:none)]:opacity-100 transition-all duration-500 translate-y-3 group-hover/mv:translate-y-0 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:mv3d-controls-mobile z-30";

  return (
    <div ref={containerRef} className="w-full aspect-video min-h-[300px] @md:min-h-[400px] relative group/mv" style={bgColor ? { backgroundColor: bgColor } : {}}>
      {inView ? (
        <>
          <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />

          <ModelViewer
            src={mediaUrl}
            auto-rotate={autoRotate ? "" : null}
            camera-controls
            shadow-intensity="1"
            environment-image="neutral"
            exposure={exposure}
            loading="eager"
            reveal="auto"
            interaction-prompt="auto"
            style={{ width: '100%', height: '100%', '--poster-color': 'transparent' } as any}
          >
            {/* Premium Loading Poster */}
            <div slot="poster" className="mv3d-loader absolute inset-0 flex flex-col items-center justify-center gap-4 z-10" style={{ background: bgColor || 'transparent' }}>
              <div className="mv3d-cube w-10 h-10 perspective-[200px]">
                <div className="mv3d-cube-inner w-full h-full relative" style={{ transformStyle: 'preserve-3d', animation: 'mv3d-spin 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite' }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="mv3d-face absolute w-full h-full border border-white/20 rounded-sm bg-white/5" style={{
                      transform: i === 0 ? 'rotateY(0deg) translateZ(20px)' :
                        i === 1 ? 'rotateY(90deg) translateZ(20px)' :
                          i === 2 ? 'rotateY(180deg) translateZ(20px)' :
                            i === 3 ? 'rotateY(270deg) translateZ(20px)' :
                              i === 4 ? 'rotateX(90deg) translateZ(20px)' :
                                'rotateX(-90deg) translateZ(20px)'
                    }}></div>
                  ))}
                </div>
              </div>
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase opacity-50" style={{ color: 'inherit' }}>Loading 3D</span>
            </div>

            {/* Minimalist Floating Controls */}
            <div className={controlsClass}>
              {/* Exposure Slider */}
              <div className="flex items-center gap-2 px-2 border-r border-white/10">
                <i className="fas fa-sun text-[8px] text-white/50"></i>
                <input
                  type="range" min="0.5" max="2" step="0.1"
                  value={exposure}
                  onChange={(e) => setExposure(parseFloat(e.target.value))}
                  className="w-14 @md:w-24 h-[3px] bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
              {/* Auto Rotate Toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${autoRotate ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                title="Toggle Auto-Rotate"
              >
                <i className={`fas fa-sync-alt text-[8px] ${autoRotate ? 'animate-spin-slow' : ''}`}></i>
              </button>
            </div>
          </ModelViewer>
        </>
      ) : (
        /* Static Placeholder sebelum masuk viewport */
        <div onClick={() => setInView(true)} className="mv3d-loader absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 cursor-pointer hover:bg-white/5 transition-colors" style={{ background: bgColor || 'transparent' }}>
          <div className="mv3d-cube w-10 h-10 perspective-[200px]">
            <div className="mv3d-cube-inner w-full h-full relative" style={{ transformStyle: 'preserve-3d', animation: 'mv3d-spin 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="mv3d-face absolute w-full h-full border border-white/20 rounded-sm bg-white/5" style={{
                  transform: i === 0 ? 'rotateY(0deg) translateZ(20px)' :
                    i === 1 ? 'rotateY(90deg) translateZ(20px)' :
                      i === 2 ? 'rotateY(180deg) translateZ(20px)' :
                        i === 3 ? 'rotateY(270deg) translateZ(20px)' :
                          i === 4 ? 'rotateX(90deg) translateZ(20px)' :
                            'rotateX(-90deg) translateZ(20px)'
                }}></div>
              ))}
            </div>
          </div>
          <span className="text-[9px] font-bold tracking-[0.25em] uppercase opacity-50" style={{ color: 'inherit' }}>Click to Load 3D</span>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes mv3d-spin { 0% { transform: rotateX(35deg) rotateY(0deg); } 100% { transform: rotateX(35deg) rotateY(360deg); } }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `
      }} />
    </div>
  );
}
