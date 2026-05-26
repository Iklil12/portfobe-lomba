"use client";

import React, { useEffect, useState } from "react";

const TYPE_TABS = [
  { id: "all",         label: "Semua",      icon: "fa-border-all" },
  { id: "video",       label: "Video",      icon: "fa-play"       },
  { id: "photo",       label: "Foto",       icon: "fa-image"      },
  { id: "certificate", label: "Sertifikat", icon: "fa-award"      },
  { id: "3d",          label: "3D",         icon: "fa-cube"       },
] as const;

/* ── Skeleton ──────────────────────────────────────────────── */
function FilterSkeleton() {
  return (
    <div className="mb-8 space-y-3 animate-pulse">
      {/* row 1: tab bar skeleton */}
      <div className="inline-flex items-center gap-1 bg-slate-100/80 rounded-2xl p-1.5">
        {[88, 72, 60, 96, 52].map((w, i) => (
          <div
            key={i}
            className="h-9 rounded-xl bg-slate-200/70 shrink-0"
            style={{ width: w }}
          />
        ))}
      </div>
      {/* row 2: tag chips skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-3 w-6 rounded bg-slate-200/70" />
        <div className="h-3.5 w-px bg-slate-200" />
        {[52, 68, 44].map((w, i) => (
          <div
            key={i}
            className="h-7 rounded-lg bg-slate-100"
            style={{ width: w }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────── */
export function ProjectFilterTabs({ state, actions }: { state: any; actions: any }) {
  const { isLoading, items, activeTab } = state;
  const { setActiveTab } = actions;

  // Entrance animation trigger
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setVisible(true), 30);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  /* ── loading state ── */
  if (isLoading && items.length === 0) return <FilterSkeleton />;

  /* ── counts ──────────────────────────────────────── */
  const counts: Record<string, number> = {
    all:         items.length,
    video:       items.filter((p: any) => p.projectType === "video").length,
    photo:       items.filter((p: any) => p.projectType === "photo").length,
    certificate: items.filter((p: any) => p.projectType === "certificate").length,
    "3d":        items.filter((p: any) => p.projectType === "3d").length,
  };

  /* ── tags ────────────────────────────────────────── */
  const allTags = Array.from(
    new Set(
      items
        .filter((p: any) => p.itemType !== "certificate")
        .flatMap((p: any) => {
          try { return Array.isArray(p.tags) ? p.tags : JSON.parse(p.tags || "[]"); }
          catch { return []; }
        })
    )
  ) as string[];

  allTags.forEach((tag) => {
    counts[`tag:${tag}`] = items.filter((p: any) => {
      try {
        const t = Array.isArray(p.tags) ? p.tags : JSON.parse(p.tags || "[]");
        return t.includes(tag);
      } catch { return false; }
    }).length;
  });

  /* ── helpers ─────────────────────────────────────── */
  const onTag = (tag: string) => {
    const id = `tag:${tag}`;
    setActiveTab(activeTab === id ? "all" : (id as any));
  };

  /* ── render ──────────────────────────────────────── */
  return (
    <>
      <style>{`
        @keyframes filterFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .filter-enter      { animation: filterFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .filter-enter-tags { animation: filterFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 80ms both; }
        @keyframes scrollHint {
          0%, 100% { transform: translateX(0) translateY(-50%); opacity: 0.5; }
          50%       { transform: translateX(3px) translateY(-50%); opacity: 1; }
        }
        .scroll-hint-icon { animation: scrollHint 1.4s ease-in-out 1.2s 3; }
      `}</style>

      <div className="mb-8 space-y-3">

        {/* ── ROW 1: type tabs — segmented pill ── */}
        <div className="relative">
          {/* scroll hint: right fade + chevron — mobile only */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10 md:hidden flex items-center justify-end pr-1.5"
            style={{ background: 'linear-gradient(to left, rgba(248,250,252,0.98) 20%, transparent)' }}
          >
            <i className="scroll-hint-icon fas fa-chevron-right text-[9px] text-slate-400" />
          </div>

          <div
            role="tablist"
            className={`flex items-center gap-1 bg-slate-100/80 rounded-2xl p-1.5
              overflow-x-auto hide-scrollbar w-full md:w-auto md:inline-flex
              ${visible ? "filter-enter" : "opacity-0"}`}
          >
          {TYPE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const count    = counts[tab.id] ?? 0;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2
                  px-4 py-2.5 rounded-xl
                  text-[12px] font-bold tracking-wide whitespace-nowrap shrink-0
                  transition-all duration-200 select-none
                  ${isActive
                    ? "bg-white text-slate-900 shadow-sm shadow-slate-200/80"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                  }
                `}
              >
                <i className={`fas ${tab.icon} text-[10px] ${isActive ? "text-slate-600" : "text-slate-400"}`} />
                {tab.label}
                {count > 0 && (
                  <span className={`
                    text-[10px] font-black min-w-[18px] h-[18px] px-1.5 rounded-md
                    inline-flex items-center justify-center leading-none
                    ${isActive ? "bg-slate-100 text-slate-600" : "bg-slate-200/60 text-slate-400"}
                  `}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          </div>{/* end tablist */}
        </div>{/* end relative wrapper */}

        {/* ── ROW 2: tag chips ── */}
        {allTags.length > 0 && (
          <div className={`flex items-center gap-2 flex-wrap ${visible ? "filter-enter-tags" : "opacity-0"}`}>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Tag
            </span>
            <div className="w-px h-3.5 bg-slate-200" />
            {allTags.map((tag) => {
              const isActive = activeTab === `tag:${tag}`;
              return (
                <button
                  key={tag}
                  onClick={() => onTag(tag)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    text-[11px] font-semibold tracking-wide
                    transition-all duration-150 border
                    ${isActive
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                    }
                  `}
                >
                  <i className={`fas fa-hashtag text-[8px] ${isActive ? "opacity-60" : "opacity-30"}`} />
                  {tag}
                  <span className={`text-[9px] font-black ml-0.5 ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                    {counts[`tag:${tag}`] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>{/* end mb-8 space-y-3 */}
    </>
  );
}
