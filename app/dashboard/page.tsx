"use client";

import React from 'react';
import { useDashboardOverview } from '@/hooks/useDashboardOverview';
import { OverviewHeader } from '@/components/features/dashboard/OverviewHeader';
import { MetricsSummary } from '@/components/features/dashboard/MetricsSummary';
import { StatCards } from '@/components/features/dashboard/StatCards';
import { RecentActivity } from '@/components/features/dashboard/RecentActivity';
import { TrafficOverview } from '@/components/features/dashboard/TrafficOverview';
import { MiniLivePreview } from '@/components/features/dashboard/MiniLivePreview';

export default function DashboardOverview() {
  const {
    stats,
    activities,
    subdomain,
    avatarUrl,
    analytics,
    userPlan,
    isLoadingStats,
    isLoadingActivities,
    isLoadingAnalytics
  } = useDashboardOverview();

  return (
    <div className="relative min-h-screen font-sans selection:bg-slate-200 selection:text-slate-900 pb-32 overflow-hidden">
      {/* ELEMEN DEKORASI BACKGROUND DIHAPUS (Dipindah ke layout.tsx) */}

      {/* KONTEN UTAMA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 relative z-10">
        <OverviewHeader subdomain={subdomain} avatarUrl={avatarUrl} isLoading={isLoadingStats} />
        
        <MetricsSummary 
          analytics={analytics} 
          strength={stats.strength || 0} 
          breakdown={stats.strengthBreakdown || []}
          userPlan={userPlan}
          isLoading={isLoadingAnalytics} 
        />

        <StatCards stats={stats as any} isLoading={isLoadingStats} />
        
        {/* MAIN CONTENT SPLIT (CHART & OTHERS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrafficOverview analytics={analytics} isLoading={isLoadingAnalytics} />
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="min-h-[250px]">
              <MiniLivePreview themeName={stats.themeName} subdomain={subdomain} isLoading={isLoadingStats} />
            </div>
            <div>
              <RecentActivity activities={activities} isLoading={isLoadingActivities} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}