import React from 'react';

export function LinksSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i, index) => (
        <div 
            key={i} 
            className="h-auto sm:h-28 w-full bg-slate-50/50 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center p-5 sm:p-6 gap-4 sm:gap-6 shadow-sm animate-enter"
            style={{animationDelay: `${index * 80}ms`, opacity: 0}}
        >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-200 rounded-2xl shrink-0 shimmer border border-slate-100"></div>
            <div className="flex-1 w-full space-y-3">
                <div className="h-5 w-2/3 sm:w-1/3 bg-slate-200 rounded-md shimmer"></div>
                <div className="h-3 w-full sm:w-1/2 bg-slate-200 rounded-md shimmer"></div>
            </div>
            <div className="w-full sm:w-24 h-10 bg-slate-200 rounded-xl shimmer mt-2 sm:mt-0"></div>
        </div>
      ))}
    </>
  );
}

export function AddingSkeleton() {
  return (
    <div className="h-auto sm:h-28 w-full bg-slate-50/50 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center p-5 sm:p-6 gap-4 sm:gap-6 shadow-sm animate-enter">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-200 rounded-2xl shrink-0 shimmer border border-slate-100"></div>
        <div className="flex-1 w-full space-y-3">
            <div className="h-5 w-2/3 sm:w-1/3 bg-slate-200 rounded-md shimmer"></div>
            <div className="h-3 w-full sm:w-1/2 bg-slate-200 rounded-md shimmer"></div>
        </div>
    </div>
  );
}
