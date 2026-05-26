"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// ── helpers ────────────────────────────────────────────────────────────────────

function formatDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatGateway(gateway: string | null) {
  if (!gateway) return "—";
  const map: Record<string, string> = {
    admin_grant: "Manual (Admin)",
    midtrans: "Midtrans",
    xendit: "Xendit",
  };
  return map[gateway] ?? gateway;
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    ACTIVE:    "bg-emerald-100 text-emerald-700 border-emerald-200",
    EXPIRED:   "bg-slate-100   text-slate-500   border-slate-200",
    CANCELLED: "bg-rose-100    text-rose-600    border-rose-200",
    SUCCESS:   "bg-emerald-100 text-emerald-700 border-emerald-200",
    FAILED:    "bg-rose-100    text-rose-600    border-rose-200",
    PENDING:   "bg-amber-100   text-amber-700   border-amber-200",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest uppercase border ${cfg[status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

// ── component ──────────────────────────────────────────────────────────────────

export default function BillingContent() {
  const { data, isLoading, mutate } = useSWR("/api/subscriptions", fetcher);
  const [tab, setTab] = useState<"subscriptions" | "transactions">("subscriptions");
  const [isClaimingTrial, setIsClaimingTrial] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isTrialSuccess, setIsTrialSuccess] = useState(false);
  const [isMinimumLoadTimeMet, setIsMinimumLoadTimeMet] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Artificial delay to show the beautiful skeleton for a professional feel
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsMinimumLoadTimeMet(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const plan: string           = data?.plan ?? "FREE";
  const remainingDays: number | null = data?.remainingDays ?? null;
  const isPro                  = plan !== "FREE";
  const isSupreme              = plan === "SUPREME";
  const planLabel              = isSupreme ? "Supreme Creator" : "Pro Creator";
  const canClaimTrial          = data?.canClaimTrial ?? false;
  const sub                    = data?.subscription;
  const subHistory: any[]      = data?.subscriptionHistory ?? [];
  const transactions: any[]    = data?.transactions ?? [];

  const handleOpenTrialModal = () => setIsTrialModalOpen(true);
  const handleCloseTrialModal = () => {
    if (isClaimingTrial) return;
    setIsTrialModalOpen(false);
    setIsTrialSuccess(false);
  };

  const handleClaimTrial = async () => {
    setIsClaimingTrial(true);
    try {
      const res = await fetch("/api/subscriptions/trial", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setIsTrialSuccess(true);
        mutate(); // Refresh SWR data
      } else {
        alert("Gagal: " + json.error);
        setIsTrialModalOpen(false);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
      setIsTrialModalOpen(false);
    } finally {
      setIsClaimingTrial(false);
    }
  };

  // Skeleton shimmer
  if (isLoading || !isMinimumLoadTimeMet) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-8 animate-billing-fade">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes billingFadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-billing-fade { opacity: 0; animation: billingFadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        `}} />
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-9 w-64 skeleton-premium rounded-lg mb-3" />
          <div className="h-5 w-80 skeleton-premium rounded-md" />
        </div>
        
        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Card Skeleton */}
          <div className="lg:col-span-2 h-[320px] skeleton-premium rounded-3xl" />
          
          {/* Right Card Skeleton */}
          <div className="h-[320px] skeleton-premium rounded-3xl" />
        </div>
        
        {/* Tabs & History Skeleton */}
        <div className="pt-2">
          <div className="h-10 w-64 skeleton-premium rounded-xl mb-6" />
          <div className="h-[300px] w-full skeleton-premium rounded-3xl" />
        </div>
      </div>
    );
  }

  // ── countdown ring helpers ─────────────────────────────────────────────────
  const maxDays = 30; // reference full arc at 30 days
  const pct     = remainingDays === -1 ? 100 : Math.min(100, ((remainingDays ?? 0) / maxDays) * 100);
  const r       = 30;
  const circ    = 2 * Math.PI * r;
  const dash    = circ * (pct / 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes billingFadeIn { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-billing-fade { opacity: 0; animation: billingFadeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .tab-active { background: white; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .tab-inactive { color: #64748b; }
        .tab-inactive:hover { color: #0f172a; }
      `}} />

      {/* ── PAGE HEADER ── */}
      <div className="animate-billing-fade">
        <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Billing & Langganan</h1>
        <p className="text-slate-500 mt-2 font-medium text-[15px]">
          Kelola paket akun, pantau sisa hari, dan unduh riwayat transaksi.
        </p>
      </div>

      {/* ── MAIN GRID ── */}
      {/* ── TRIAL BANNER ── */}
      {!isPro && canClaimTrial && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg shadow-amber-500/20 text-white animate-billing-fade">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              <i className="fas fa-gift"></i> Hadiah Pengguna Baru
            </div>
            <h2 className="text-2xl font-black mb-1">Coba PRO Gratis 14 Hari!</h2>
            <p className="text-white/80 text-sm font-medium">Buka semua batas tema, analitik, dan proyek. Tidak perlu kartu kredit.</p>
          </div>
          <button
            onClick={handleOpenTrialModal}
            className="shrink-0 w-full sm:w-auto px-8 py-3.5 bg-white text-orange-600 font-black rounded-xl hover:bg-orange-50 transition-colors shadow-sm"
          >
            Klaim Trial Sekarang
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-billing-fade delay-100">
        
        {/* LEFT CARD: Current Plan Overview */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col relative">
          
          {/* Subtle background gradient if PRO */}
          {isPro && <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl to-transparent opacity-50 rounded-bl-full pointer-events-none ${isSupreme ? 'from-violet-400/10' : 'from-amber-400/10'}`} />}

          <div className="p-8 flex-1 relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Paket Saat Ini</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isPro ? planLabel : "Starter"}</h2>
                  {isPro && sub && (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-extrabold uppercase tracking-widest rounded-md flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active
                    </span>
                  )}
                </div>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${isPro ? (isSupreme ? "bg-gradient-to-br from-violet-100 to-violet-50 border-violet-200" : "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-200") : "bg-slate-50 border-slate-100"}`}>
                <i className={`fas ${isPro ? "fa-crown" : "fa-lock"} text-2xl ${isPro ? (isSupreme ? "text-violet-500" : "text-amber-500") : "text-slate-300"}`}></i>
              </div>
            </div>

            <div className="space-y-1">
              {isPro && sub ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
                  <div className="py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sisa Hari</p>
                    <p className="font-extrabold text-slate-900 text-[15px]">
                      {remainingDays === -1 ? (
                        <span className={isSupreme ? 'text-violet-500' : 'text-amber-500'}>Seumur Hidup ♾️</span>
                      ) : (
                        <span>
                          {remainingDays} Hari 
                          {remainingDays !== null && remainingDays <= 7 && (
                            <span className="text-[10px] bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded-md ml-2 relative -top-0.5">Hampir Habis</span>
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Berakhir Pada</p>
                    <p className="font-bold text-slate-900 text-[15px]">
                      {sub.isLifetime ? "Selamanya" : formatDate(sub.expiredAt)}
                    </p>
                  </div>
                  <div className="py-3 border-b border-slate-100 sm:col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Siklus Penagihan (Mulai)</p>
                    <p className="font-bold text-slate-900 text-[15px]">{formatDate(sub.startedAt)}</p>
                  </div>
                </div>
              ) : (
                <div className="pt-2 max-w-lg">
                  <p className="text-[15px] text-slate-600 font-medium leading-relaxed mb-6">
                    Kamu menggunakan paket gratis. Upgrade ke PRO untuk membuka akses ke semua tema, analitik tingkat lanjut, dan menghapus batas proyek.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Batas 5 Proyek", icon: "fa-folder" },
                      { label: "Tema Terbatas", icon: "fa-palette" },
                    ].map((f) => (
                      <div key={f.label} className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
                        <i className={`fas ${f.icon} text-slate-300`}></i> {f.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Card Footer Actions */}
          <div className="bg-slate-50/50 p-6 sm:px-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
            {isPro ? (
              <>
                <p className="text-xs text-slate-500 font-medium">
                  Lisensi diberikan oleh: <span className="font-bold text-slate-700">{sub?.grantedBy || 'System Admin'}</span>
                </p>
                <a
                  href={`https://wa.me/628xxxxxxxxx?text=Halo%2C+saya+ingin+memperpanjang+paket+${plan}+saya.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md"
                >
                  Perpanjang {plan}
                </a>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-500 font-medium">Tanpa biaya bulanan.</p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#ff9e00] text-white text-[13px] font-bold rounded-xl hover:bg-amber-500 transition-colors shadow-md shadow-amber-500/20"
                >
                  Upgrade ke PRO <i className="fas fa-arrow-right ml-1"></i>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* RIGHT CARD: Member Profile / Setup */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-inner">
              <i className="fas fa-user-astronaut text-xl text-white"></i>
            </div>
            
            <div>
              <p className="text-white/50 text-[11px] font-extrabold uppercase tracking-widest mb-1.5">Member Sejak</p>
              <p className="text-2xl font-black tracking-tight">{formatDate(data?.memberSince)}</p>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-white/10 relative z-10">
            <p className="text-white/50 text-[11px] font-extrabold uppercase tracking-widest mb-3">Platform Terhubung</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1.5">
                <img src="/portfo.be.png" alt="Logo" className="w-full h-full object-contain brightness-0 invert opacity-90" />
              </div>
              <span className="text-[15px] font-bold tracking-wide">Portfobe</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── TABS & HISTORY ── */}
      <div className="animate-billing-fade delay-200">
        
        {/* Custom Pill Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl mb-6">
          {(["subscriptions", "transactions"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-[13px] font-extrabold rounded-lg transition-all ${tab === t ? "tab-active" : "tab-inactive"}`}
            >
              {t === "subscriptions" ? "Riwayat Langganan" : "Invoices & Transaksi"}
            </button>
          ))}
        </div>

        {/* History Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
          
          {/* SUBSCRIPTIONS VIEW */}
          {tab === "subscriptions" && (
            <div className="divide-y divide-slate-100">
              {subHistory.length === 0 ? (
                <EmptyState icon="fa-layer-group" text="Belum ada riwayat langganan yang tercatat." />
              ) : (
                subHistory.map((s: any) => (
                  <div key={s.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:bg-slate-50/50 transition-colors">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${s.status === "ACTIVE" ? (s.plan === "SUPREME" ? "bg-violet-50 border-violet-100" : "bg-amber-50 border-amber-100") : "bg-slate-50 border-slate-200"}`}>
                      <i className={`fas fa-layer-group text-lg ${s.status === "ACTIVE" ? (s.plan === "SUPREME" ? "text-violet-500" : "text-amber-500") : "text-slate-300"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[15px] font-extrabold text-slate-900">
                          Portfobe {s.plan} {s.isLifetime && "♾️"}
                        </span>
                        <StatusBadge status={s.status} />
                      </div>
                      <p className="text-[13px] text-slate-500 font-medium">
                        {formatDate(s.startedAt)} <span className="mx-2 text-slate-300">→</span> {s.isLifetime ? "Seumur Hidup" : formatDate(s.expiredAt)}
                      </p>
                      {s.notes && <p className="text-[11px] text-slate-400 mt-1.5 italic flex items-center gap-1.5"><i className="fas fa-info-circle"></i> {s.notes}</p>}
                    </div>
                    <div className="text-right shrink-0 mt-2 sm:mt-0">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Dibuat Pada</p>
                      <p className="text-[13px] font-bold text-slate-700 mt-0.5">{formatDate(s.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TRANSACTIONS VIEW */}
          {tab === "transactions" && (
            <div className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <EmptyState icon="fa-receipt" text="Belum ada riwayat transaksi." />
              ) : (
                transactions.map((t: any) => (
                  <div key={t.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:bg-slate-50/50 transition-colors group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${t.status === "SUCCESS" ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-200"}`}>
                      <i className={`fas fa-receipt text-lg ${t.status === "SUCCESS" ? "text-emerald-500" : "text-slate-300"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[15px] font-extrabold text-slate-900">
                          {t.plan} Access — {t.durationDays >= 36500 ? "Lifetime" : `${t.durationDays} Days`}
                        </span>
                        <StatusBadge status={t.status} />
                      </div>
                      <p className="text-[13px] text-slate-500 font-medium">
                        via {formatGateway(t.gateway)} · {formatDate(t.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-3 mt-4 sm:mt-0">
                      <div className="sm:text-right">
                        <p className="text-base font-black text-slate-900">
                          {t.amount === 0 ? <span className="text-emerald-600">Free / Granted</span> : `Rp ${t.amount.toLocaleString("id-ID")}`}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{t.id.substring(0, 12).toUpperCase()}</p>
                      </div>
                      {t.status === "SUCCESS" && (
                        <Link 
                          href={`/receipt/${t.id}`}
                          target="_blank"
                          className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 shadow-sm px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 w-fit"
                        >
                          <i className="fas fa-download"></i> Receipt
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── TRIAL ACTIVATION MODAL ── */}
      {isTrialModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes floatTrial {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
              100% { transform: translateY(0px); }
            }
            @keyframes shimmerTrial {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .animate-float-trial { animation: floatTrial 4s ease-in-out infinite; }
            .animate-shimmer-trial { animation: shimmerTrial 2.5s infinite; }
          `}} />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={handleCloseTrialModal}></div>
          <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] animate-enter-modal overflow-hidden flex flex-col md:flex-row">
            
            {/* Success State */}
            {isTrialSuccess ? (
              <div className="p-12 md:p-20 flex flex-col items-center text-center w-full bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-50 via-white to-white opacity-50 pointer-events-none"></div>
                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-8 animate-bounce relative z-10 shadow-lg shadow-emerald-500/20">
                  <i className="fas fa-check text-4xl"></i>
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight relative z-10">Selamat Datang di PRO! 🎉</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 max-w-lg relative z-10">
                  Paket <strong>PRO Creator 14 Hari</strong> Anda sudah aktif. Sekarang Anda bebas mengeksplorasi seluruh fitur premium tanpa batas.
                </p>
                <button 
                  onClick={handleCloseTrialModal}
                  className="w-full max-w-sm py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-transform active:scale-95 shadow-xl relative z-10"
                >
                  Mulai Gunakan PRO
                </button>
              </div>
            ) : (
              /* Activation State (2 Columns) */
              <>
                {/* Left Column (Graphic) */}
                <div className="hidden md:flex md:w-5/12 bg-slate-900 p-10 flex-col relative overflow-hidden items-center justify-center text-center border-r border-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/20 opacity-50"></div>
                  <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-amber-500 rounded-full mix-blend-screen filter blur-[60px] opacity-30 animate-pulse"></div>
                  <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-orange-500 rounded-full mix-blend-screen filter blur-[60px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/40 mb-8 animate-float-trial relative z-10">
                    <i className="fas fa-crown text-5xl text-white"></i>
                  </div>
                  
                  <h3 className="text-white text-3xl font-black mb-3 relative z-10 tracking-tight leading-tight">Portfobe<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">PRO Creator</span></h3>
                  <p className="text-slate-400 font-medium relative z-10">Tingkatkan karir profesionalmu dengan alat super lengkap.</p>
                </div>

                {/* Right Column (Content) */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col bg-white">
                  
                  {/* Mobile Header Graphic (Only shows on small screens) */}
                  <div className="md:hidden h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden shadow-lg shadow-orange-500/20">
                    <i className="fas fa-crown text-4xl text-white relative z-10 animate-float-trial"></i>
                  </div>

                  <div className="mb-8 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-100">
                      <i className="fas fa-gift"></i> Penawaran Spesial
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">Klaim Trial 14 Hari</h3>
                    <p className="text-slate-500 font-medium">Buka semua fitur tanpa batas. Tanpa perlu memasukkan kartu kredit. 100% Gratis selama masa percobaan.</p>
                  </div>
                  
                  {/* Features List */}
                  <div className="space-y-5 mb-10">
                    {[
                      { icon: "fa-chart-pie", title: "Analitik Mendalam", desc: "Pantau pengunjung & performa portofolio." },
                      { icon: "fa-globe", title: "Custom Domain Pribadi", desc: "Ubah URL menjadi namakamu.com." },
                      { icon: "fa-layer-group", title: "Tanpa Batas Proyek", desc: "Upload karya sebanyak yang kamu mau." },
                      { icon: "fa-palette", title: "Tema Eksklusif", desc: "Akses ke seluruh template premium." }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                          <i className={`fas ${feature.icon}`}></i>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 mb-0.5">{feature.title}</p>
                          <p className="text-xs text-slate-500">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 md:gap-4 mt-auto pt-4 border-t border-slate-100">
                    <button 
                      onClick={handleCloseTrialModal}
                      disabled={isClaimingTrial}
                      className="px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={handleClaimTrial}
                      disabled={isClaimingTrial}
                      className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl hover:shadow-xl hover:shadow-orange-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden group"
                    >
                      {!isClaimingTrial && (
                        <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:animate-shimmer-trial pointer-events-none"></div>
                      )}
                      {isClaimingTrial ? (
                        <><i className="fas fa-circle-notch animate-spin"></i> Mengaktifkan...</>
                      ) : (
                        <>Aktifkan Sekarang <i className="fas fa-arrow-right"></i></>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>,
        document.body
      )}

      {/* ── SUPPORT BANNER ── */}
      <div className="animate-billing-fade delay-300 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
            <i className="fas fa-life-ring text-xl text-blue-500" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Punya kendala dengan tagihan?</h3>
            <p className="text-[13px] text-slate-600 font-medium">
              Tim support kami siap membantu pertanyaan soal upgrade, pembayaran, atau perpanjangan.
            </p>
          </div>
        </div>
        <a
          href="/support"
          className="shrink-0 px-6 py-2.5 bg-white border border-slate-200 text-slate-900 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          Hubungi Support
        </a>
      </div>

    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
        <i className={`fas ${icon} text-xl text-slate-300`} />
      </div>
      <p className="text-sm font-bold text-slate-400">{text}</p>
    </div>
  );
}
