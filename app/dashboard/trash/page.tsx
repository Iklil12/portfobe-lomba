"use client";

import React from "react";
import { useTrash } from "@/hooks/useTrash";

const TYPE_ICON: Record<string, string> = {
  video:       "fa-play",
  photo:       "fa-image",
  certificate: "fa-award",
  "3d":        "fa-cube",
};

const TYPE_LABEL: Record<string, string> = {
  video:       "Video",
  photo:       "Foto",
  certificate: "Sertifikat",
  "3d":        "3D Model",
};

function DaysLeftBadge({ days }: { days: number }) {
  const urgent = days <= 3;
  const warning = days <= 7;
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider
      ${urgent ? "bg-rose-100 text-rose-600" : warning ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"}`}>
      <i className={`fas fa-clock text-[7px] ${urgent ? "animate-pulse" : ""}`} />
      {days === 0 ? "Kedaluwarsa hari ini" : `${days} hari lagi`}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-4 animate-pulse">
      <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-slate-100 rounded w-2/3" />
        <div className="h-3 bg-slate-100 rounded w-1/3" />
        <div className="h-3 bg-slate-100 rounded w-1/4" />
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <div className="h-8 w-24 bg-slate-100 rounded-xl" />
        <div className="h-8 w-24 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function TrashPage() {
  const { state, actions } = useTrash();
  const { items, isLoading, isLoadingMore, totalCount, hasMore, confirmPurgeAll, processingId } = state;
  const { restore, purge, purgeAll, loadMore, setConfirmPurgeAll, getDaysLeft } = actions;

  return (
    <main className="min-h-screen font-sans pb-24 selection:bg-slate-200">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .animate-enter { opacity:0; animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(32px) scale(0.98); filter:blur(4px); }
          to   { opacity:1; transform:translateY(0)    scale(1);    filter:blur(0);   }
        }
      `}} />

      <div className="max-w-3xl mx-auto p-6 md:p-10">

        {/* ── Header ── */}
        <div className="mb-8 animate-enter">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <i className="fas fa-trash-alt text-slate-500 text-[14px]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Trash</h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Item yang dihapus akan otomatis dihapus permanen setelah <strong className="text-slate-600">30 hari</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* ── Actions bar ── */}
        {!isLoading && totalCount > 0 && (
          <div className="flex items-center justify-between mb-5 animate-enter" style={{ animationDelay: "80ms" }}>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {items.length < totalCount
                ? `${items.length} dari ${totalCount} item di trash`
                : `${totalCount} item di trash`}
            </span>

            {!confirmPurgeAll ? (
              <button
                onClick={() => setConfirmPurgeAll(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-500 border border-rose-200 hover:bg-rose-50 transition-colors"
              >
                <i className="fas fa-trash text-[9px]" />
                Kosongkan Semua
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">Yakin hapus semua?</span>
                <button
                  onClick={purgeAll}
                  disabled={processingId === "all"}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors disabled:opacity-50"
                >
                  {processingId === "all" ? <i className="fas fa-circle-notch animate-spin" /> : "Ya, Hapus"}
                </button>
                <button
                  onClick={() => setConfirmPurgeAll(false)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── List ── */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-enter">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <i className="fas fa-check text-2xl text-slate-300" />
              </div>
              <p className="font-black text-slate-700 text-lg mb-1">Trash kosong</p>
              <p className="text-slate-400 text-sm font-medium">
                Tidak ada item yang dihapus. Semua data aman!
              </p>
            </div>
          ) : (
            items.map((item, idx) => {
              const daysLeft = getDaysLeft(item.expiresAt);
              const isProcessing = processingId === item.id;
              const icon = TYPE_ICON[item.projectType] ?? "fa-file";
              const label = TYPE_LABEL[item.projectType] ?? item.projectType;

              return (
                <div
                  key={item.id}
                  className="animate-enter bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Thumbnail / Icon */}
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.mediaUrl && item.projectType !== "3d" ? (
                        <img
                          src={item.projectType === "video"
                            ? `https://img.youtube.com/vi/${extractYtId(item.mediaUrl)}/mqdefault.jpg`
                            : item.mediaUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <i className={`fas ${icon} text-slate-400 text-lg`} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-900 text-sm truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          <i className={`fas ${icon} mr-1`} />{label}
                        </span>
                        <DaysLeftBadge days={daysLeft} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">
                        Dihapus {formatDate(item.deletedAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => restore(item.id, item.itemType)}
                        disabled={isProcessing}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-40 shadow-sm"
                      >
                        {isProcessing
                          ? <i className="fas fa-circle-notch animate-spin text-[10px]" />
                          : <i className="fas fa-undo text-[10px]" />}
                        Pulihkan
                      </button>
                      <button
                        onClick={() => purge(item.id, item.itemType)}
                        disabled={isProcessing}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-colors disabled:opacity-40"
                      >
                        <i className="fas fa-times text-[10px]" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Load More ── */}
        {!isLoading && hasMore && (
          <div className="flex justify-center mt-6 animate-enter">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[12px] font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
            >
              {isLoadingMore ? (
                <><i className="fas fa-circle-notch animate-spin text-[10px]" /> Memuat...</>
              ) : (
                <><i className="fas fa-chevron-down text-[10px]" /> Muat {Math.min(10, totalCount - items.length)} Item Lagi</>
              )}
            </button>
          </div>
        )}

        {/* ── Semua sudah dimuat ── */}
        {!isLoading && !hasMore && totalCount > 10 && (
          <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-6">
            Semua {totalCount} item sudah ditampilkan
          </p>
        )}
      </div>
    </main>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function extractYtId(url: string) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return m ? m[1] : "";
}
