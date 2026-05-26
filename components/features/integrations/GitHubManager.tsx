"use client";

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import toast from 'react-hot-toast';
import { showToast } from '@/lib/customToast';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function GitHubManager() {
  const { data: session } = useSession();
  const { data: integrationsData } = useSWR('/api/settings/integrations', fetcher);

  const [isDisconnectingGithub, setIsDisconnectingGithub] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState<'github' | null>(null);
  const [isRefreshingGithub, setIsRefreshingGithub] = useState(false);
  const [lastGithubRefresh, setLastGithubRefresh] = useState<Date | null>(null);

  const integrations: any[] = integrationsData?.integrations || [];
  const githubIntegration = integrations.find((i) => i.provider === 'GITHUB');
  const isGithubConnected = !!githubIntegration;
  const githubUsername = githubIntegration?.providerId || null;

  useEffect(() => {
    if (githubIntegration?.updatedAt && !lastGithubRefresh) {
      setLastGithubRefresh(new Date(githubIntegration.updatedAt));
    }
  }, [githubIntegration]);

  const timeAgo = (date: Date | null) => {
    if (!date) return null;
    const diff = Math.floor((Date.now() - date.getTime()) / 1000 / 60);
    if (diff < 1) return 'Baru saja';
    if (diff < 60) return `${diff} menit lalu`;
    return `${Math.floor(diff / 60)} jam lalu`;
  };

  const handleRefreshGithub = async () => {
    if (!session?.user?.id || isRefreshingGithub) return;
    setIsRefreshingGithub(true);
    const toastId = toast.loading('Mensinkronisasi data GitHub...');
    try {
      const res = await fetch(`/api/github/stats?userId=${session.user.id}&bust=1`);
      if (res.ok) {
        setLastGithubRefresh(new Date());
        toast.success('Sinkronisasi GitHub berhasil!', { id: toastId });
      } else {
        const err = await res.json();
        toast.error(err.error || 'Sinkronisasi gagal.', { id: toastId });
      }
    } catch {
      toast.error('Kesalahan jaringan saat sinkronisasi.', { id: toastId });
    } finally {
      setIsRefreshingGithub(false);
    }
  };

  const handleDisconnectGithub = async () => {
    setIsDisconnectingGithub(true);
    const toastId = toast.loading('Memutuskan koneksi GitHub...');
    try {
      const res = await fetch('/api/settings/integrations/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'GITHUB' }),
      });
      if (res.ok) {
        mutate('/api/settings/integrations');
        setConfirmDisconnect(null);
        toast.success('Koneksi GitHub diputuskan.', { id: toastId });
      } else {
        toast.error('Gagal memutuskan koneksi.', { id: toastId });
      }
    } catch {
      toast.error('Kesalahan jaringan.', { id: toastId });
    } finally {
      setIsDisconnectingGithub(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500 relative z-40">
      <div className="space-y-8">
        {isGithubConnected ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-[1.5rem] border border-slate-50 bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg">
                  <i className="fab fa-github text-2xl"></i>
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900 tracking-tight">@{githubUsername}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Connected</p>
                  </div>
                </div>
              </div>
              <a 
                href={`https://github.com/${githubUsername}`} 
                target="_blank" 
                rel="noreferrer" 
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all text-center shadow-sm"
              >
                Profile <i className="fas fa-external-link-alt text-[9px] ml-1.5 opacity-30"></i>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-[1.5rem] border border-slate-50 bg-slate-50/20">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sync Management</p>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="block text-xs text-slate-600 font-bold">
                      {timeAgo(lastGithubRefresh) ? `Last synced ${timeAgo(lastGithubRefresh)}` : 'Never synced'}
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium italic">Auto-sync every 15 minutes</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshGithub}
                    disabled={isRefreshingGithub}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-900 shadow-sm hover:border-slate-300 transition-all disabled:opacity-30 active:scale-95 flex items-center justify-center"
                  >
                    <i className={`fas fa-sync-alt text-xs ${isRefreshingGithub ? 'animate-spin' : ''}`}></i>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-[1.5rem] border border-slate-50 bg-slate-50/20">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Danger Zone</p>
                {confirmDisconnect === 'github' ? (
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setConfirmDisconnect(null)} className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Batal</button>
                    <button type="button" onClick={handleDisconnectGithub} disabled={isDisconnectingGithub} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95">Hapus</button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setConfirmDisconnect('github')}
                    className="w-full py-3 rounded-xl border border-rose-100 bg-rose-50/30 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
                  >
                    Disconnect Account
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 shadow-inner">
              <i className="fab fa-github text-4xl"></i>
            </div>
            <div className="max-w-[280px]">
              <h4 className="text-lg font-black text-slate-900 tracking-tight">GitHub Not Connected</h4>
              <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">Connect your account to display repositories and code activity on your portfolio.</p>
            </div>
            <button
              type="button"
              onClick={() => signIn('github', { callbackUrl: '/dashboard/integrations' })}
              className="px-8 py-4 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95"
            >
              Connect GitHub Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
