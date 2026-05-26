"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') === 'supreme' ? 'supreme' : 'pro';
  
  const [plan, setPlan] = useState<'pro' | 'supreme'>(initialPlan);
  const [duration, setDuration] = useState<'monthly' | 'yearly'>('yearly');
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ 
    code: string; 
    discountType: string; 
    discountValue: number; 
    minPurchase?: number | null; 
    allowedPlan?: string | null; 
  } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: coupon.trim(),
          plan: plan,
          subtotal: baseTotal
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon(data.coupon);
        setShowCouponInput(false);
        setCouponError('');
      } else {
        setCouponError(data.error || 'Kupon tidak valid');
      }
    } catch (err) {
      setCouponError('Terjadi kesalahan jaringan');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon('');
  };

  const handleDurationChange = (newDuration: 'monthly' | 'yearly') => {
    if (newDuration === duration) return;
    setIsRecalculating(true);
    setDuration(newDuration);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 600);
  };
  const [showCouponInput, setShowCouponInput] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  const { data: pricing, isLoading: pricingLoading } = useSWR('/api/pricing', fetcher);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/checkout?plan=${initialPlan}`);
    }
  }, [status, router, initialPlan]);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const selectedPricing = pricing?.[plan]?.[duration];
  const baseTotal = selectedPricing?.total || 0;

  // Reactive validation for minimum purchase & allowed plan when subtotal or plan changes
  useEffect(() => {
    if (appliedCoupon) {
      if (appliedCoupon.minPurchase !== null && appliedCoupon.minPurchase !== undefined && baseTotal < appliedCoupon.minPurchase) {
        setAppliedCoupon(null);
        setCouponError(`Kupon "${appliedCoupon.code}" dilepas karena minimal belanja Rp ${appliedCoupon.minPurchase.toLocaleString('id-ID')} belum terpenuhi.`);
      } else if (appliedCoupon.allowedPlan && appliedCoupon.allowedPlan !== 'ALL' && plan !== appliedCoupon.allowedPlan) {
        setAppliedCoupon(null);
        setCouponError(`Kupon "${appliedCoupon.code}" dilepas karena hanya berlaku untuk paket ${appliedCoupon.allowedPlan.toUpperCase()}`);
      }
    }
  }, [baseTotal, plan, appliedCoupon]);

  if (status === 'loading' || status === 'unauthenticated' || !minLoadingDone || pricingLoading || !pricing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] relative overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-75"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 mb-6 relative">
            <div className="absolute inset-0 border-2 border-slate-100 rounded-2xl animate-ping opacity-20"></div>
            <img src="/portfo.be.png" alt="Portfobe" className="h-8 w-auto relative z-10 animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Check if the plan is valid and exists in pricing (is active)
  const isPlanActive = pricing && pricing[plan];
  
  if (!isPlanActive) {
    const activePlans = pricing ? Object.keys(pricing) : [];
    
    return (
      <div className="min-h-screen bg-[#F4F5F7] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
          * { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}} />
        
        <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 relative z-10">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-center mx-auto text-rose-500 shadow-sm">
            <i className="fas fa-exclamation-triangle text-2xl animate-bounce"></i>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Paket Tidak Tersedia</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Maaf, paket layanan <span className="font-extrabold text-slate-800 uppercase">"{plan}"</span> saat ini sedang tidak diaktifkan oleh administrator atau tidak tersedia untuk dibeli.
            </p>
          </div>
          
          {activePlans.length > 0 ? (
            <div className="space-y-3 pt-2 text-left">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center">Silakan pilih paket lain yang tersedia:</p>
              <div className="flex flex-col gap-2">
                {activePlans.map((pCode) => (
                  <button 
                    key={pCode}
                    onClick={() => setPlan(pCode as any)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 py-3.5 px-4 rounded-xl text-sm font-bold text-slate-700 flex items-center justify-between transition-all active:scale-[0.98]"
                  >
                    <span className="capitalize">Paket {pricing[pCode].name}</span>
                    <i className="fas fa-arrow-right text-xs text-slate-400"></i>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <Link href="/" className="inline-flex w-full bg-slate-900 text-white font-black py-3.5 rounded-xl hover:bg-slate-800 transition-all justify-center text-sm shadow-sm active:scale-95">
                Kembali ke Beranda
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = (baseTotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, baseTotal - discountAmount);

  // Calculate total savings (from original prices)
  const savings = (duration === 'yearly' 
    ? (selectedPricing?.originalTotal - selectedPricing?.total) 
    : (selectedPricing?.original - selectedPricing?.price)) + discountAmount;

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans pb-24">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <img src="/portfo.be.png" alt="Portfobe Logo" className="h-6 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-500 hidden md:block">{session?.user?.email}</span>
          {session?.user?.image ? (
            <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" />
          ) : (
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
              {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Left Column - Configurations */}
        <div className="lg:col-span-8 space-y-6">
          <h1 className="text-2xl font-black text-slate-900 mb-2">Keranjang Anda</h1>
          
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <i className="fas fa-info text-blue-600 text-[10px]"></i>
            </div>
            <p className="text-sm text-blue-800 font-medium leading-relaxed">
              Anda diarahkan ke halaman checkout Portfobe. Harga layanan yang dipilih telah disesuaikan dengan diskon promosi saat ini.
            </p>
          </div>

          {/* Main Plan Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className={`p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${duration === 'yearly' ? 'border-b border-slate-100' : ''}`}>
              
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                    <i className={`fas ${plan === 'supreme' ? 'fa-crown text-amber-400' : 'fa-rocket'}`}></i>
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Paket {pricing[plan].name}</h2>
                    <p className="text-xs font-bold text-slate-400">Lisensi Portofolio Premium</p>
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Durasi Tagihan</label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                      className={`w-full text-left bg-white border ${isDurationDropdownOpen ? 'border-[#ff9e00] ring-2 ring-[#ff9e00]/20' : 'border-slate-200 hover:border-slate-300'} text-slate-900 font-bold text-sm rounded-xl px-4 py-3.5 pr-10 transition-all cursor-pointer shadow-sm`}
                    >
                      {duration === 'yearly' 
                        ? `12 Bulan - ${formatIDR(pricing[plan].yearly.price)}/bln (Paling Hemat)` 
                        : `1 Bulan - ${formatIDR(pricing[plan].monthly.price)}/bln`}
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                        {isRecalculating ? (
                          <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin"></div>
                        ) : (
                          <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isDurationDropdownOpen ? 'rotate-180' : ''}`}></i>
                        )}
                      </div>
                    </button>

                    {isDurationDropdownOpen && (
                      <>
                        {/* Overlay */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsDurationDropdownOpen(false)}></div>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          <button 
                            onClick={() => { handleDurationChange('monthly'); setIsDurationDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${duration === 'monthly' ? 'bg-slate-50 text-[#ff9e00]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                          >
                            <span>1 Bulan - {formatIDR(pricing[plan].monthly.price)}/bln</span>
                            {duration === 'monthly' && <i className="fas fa-check text-[#ff9e00]"></i>}
                          </button>
                          
                          <button 
                            onClick={() => { handleDurationChange('yearly'); setIsDurationDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${duration === 'yearly' ? 'bg-[#ff9e00]/10 text-[#ff9e00]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                          >
                            <span>
                              12 Bulan - {formatIDR(pricing[plan].yearly.price)}/bln 
                              <span className="ml-2 text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase font-black tracking-wider border border-emerald-200">Paling Hemat</span>
                            </span>
                            {duration === 'yearly' && <i className="fas fa-check text-[#ff9e00]"></i>}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="text-left md:text-right shrink-0">
                {isRecalculating ? (
                  <div className="flex flex-col items-start md:items-end gap-1.5 animate-pulse w-32 md:ml-auto">
                    <div className="h-3 w-16 bg-slate-100 rounded"></div>
                    <div className="h-8 w-28 bg-slate-100 rounded"></div>
                    <div className="h-5 w-32 bg-emerald-50 rounded mt-1"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-xs font-bold text-slate-400 line-through decoration-slate-300 mb-1">
                      {formatIDR(selectedPricing.original)}/bulan
                    </div>
                    <div className="flex items-baseline gap-1 md:justify-end">
                      <span className="text-3xl font-black text-slate-900 tracking-tighter animate-in fade-in zoom-in duration-300">{formatIDR(selectedPricing.price)}</span>
                      <span className="text-sm font-bold text-slate-500">/bln</span>
                    </div>
                    {duration === 'yearly' && (
                      <div className={`mt-2 inline-block bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-md animate-in fade-in slide-in-from-bottom-2`}>
                        HEMAT {formatIDR(selectedPricing.original - selectedPricing.price)}/BLN
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Free Domain Notice */}
            {duration === 'yearly' && (
              <div className="bg-emerald-50/50 p-4 md:px-8 border-t border-emerald-100 flex gap-3 items-center rounded-b-3xl">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <i className="fas fa-check text-[10px]"></i>
                </div>
                <p className="text-sm font-semibold text-emerald-800">
                  Kabar baik! Anda dapat domain <strong className="font-black">GRATIS</strong> selama 1 tahun di paket ini.
                </p>
              </div>
            )}
          </div>



        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 p-6 md:p-8 sticky top-24 min-h-[500px] flex flex-col">
            {isRecalculating ? (
              <div className="animate-pulse flex-1 flex flex-col w-full">
                <div className="h-6 w-32 bg-slate-100 rounded mb-6"></div>
                <div className="space-y-4 mb-6">
                  <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
                  <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
                </div>
                <div className="mt-auto border-t border-slate-100 pt-6">
                  <div className="flex justify-between items-end mb-3">
                    <div className="h-4 w-24 bg-slate-100 rounded"></div>
                    <div className="h-8 w-32 bg-slate-100 rounded"></div>
                  </div>
                  <div className="h-3 w-32 bg-slate-100 rounded ml-auto mb-6"></div>
                  <div className="h-14 w-full bg-slate-100 rounded-2xl mb-6"></div>
                  <div className="h-20 w-full bg-slate-100 rounded-xl"></div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black text-slate-900 mb-6">Daftar pesanan</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">Paket {pricing[plan].name}</h4>
                      <p className="text-xs font-semibold text-slate-500">Durasi {duration === 'yearly' ? '12 bulan' : '1 bulan'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 line-through decoration-slate-300 mb-0.5">
                        {formatIDR(duration === 'yearly' ? selectedPricing.originalTotal! : selectedPricing.original)}
                      </p>
                      <p className="text-sm font-black text-slate-900 animate-in fade-in zoom-in duration-300">{formatIDR(baseTotal)}</p>
                    </div>
                  </div>

                  {duration === 'yearly' && (
                    <div className="flex justify-between items-start animate-in fade-in slide-in-from-bottom-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">Nama Domain</h4>
                        <p className="text-xs font-semibold text-slate-500">Tahun pertama</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-500">Rp 0</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 mb-6">
                  {appliedCoupon && (
                    <div className="flex justify-between items-end mb-2 text-slate-400">
                      <span className="text-sm font-bold">Subtotal</span>
                      <span className="text-sm font-bold line-through decoration-slate-300">{formatIDR(baseTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-bold text-slate-500">Total Tagihan</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight animate-in fade-in zoom-in duration-300">{formatIDR(grandTotal)}</span>
                  </div>
                  <p className="text-right text-[10px] font-bold text-emerald-500">
                    Anda menghemat {formatIDR(savings)}!
                  </p>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-6 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-tags text-emerald-500"></i>
                      <div>
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-wider">{appliedCoupon.code}</p>
                        <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Diskon {appliedCoupon.discountType === 'PERCENTAGE' ? `${appliedCoupon.discountValue}%` : formatIDR(appliedCoupon.discountValue)} diterapkan</p>
                      </div>
                    </div>
                    <button onClick={removeCoupon} className="text-emerald-500 hover:text-emerald-700 transition-colors">
                      <i className="fas fa-times text-sm"></i>
                    </button>
                  </div>
                ) : !showCouponInput ? (
                  <button 
                    onClick={() => setShowCouponInput(true)}
                    className="text-xs font-bold text-[#6366f1] hover:text-[#4f46e5] transition-colors mb-6 flex items-center gap-1.5"
                  >
                    <i className="fas fa-ticket-alt"></i> Punya Kode Kupon?
                  </button>
                ) : (
                  <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Masukkan kupon" 
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 uppercase focus:outline-none focus:border-[#6366f1] transition-colors"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !coupon.trim()}
                        className="bg-slate-900 text-white rounded-xl px-4 text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isApplyingCoupon ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : 'Terapkan'}
                      </button>
                    </div>
                    {couponError && <p className="text-[10px] font-bold text-rose-500 mt-2">{couponError}</p>}
                  </div>
                )}

                <button className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-[#6366f1]/30">
                  Lanjutkan Pembayaran <i className="fas fa-arrow-right ml-2 text-sm"></i>
                </button>

                {/* Trust Badges */}
                <div className="mt-6 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
                    <i className="fas fa-shield-check text-slate-400"></i> Jaminan 30 hari uang kembali
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-black text-slate-700 mr-1">Excellent</span>
                      <div className="flex gap-0.5 text-[#00b67a]">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>
                      </div>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400">
                      <span className="font-bold text-slate-500">4.8/5</span> dari 1,024 ulasan di <span className="font-black text-slate-700"><i className="fas fa-star text-[#00b67a]"></i> Trustpilot</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400 font-bold">Memuat keranjang...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
