// app/api/dashboard/sync/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    // Konsisten dengan analytics/stats: gunakan UTC midnight
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setUTCHours(0, 0, 0, 0);

    let startDate = new Date(startOfToday);
    if (range === "7d") startDate.setUTCDate(startDate.getUTCDate() - 6);      // 7 hari termasuk hari ini
    else if (range === "30d") startDate.setUTCDate(startDate.getUTCDate() - 29); // 30 hari termasuk hari ini
    else if (range === "1d") { /* startDate = startOfToday, sudah benar */ }
    else startDate = new Date(0); // all

    // 2. PARALLEL EXECUTION: OPTIMASI SUPER RINGAN
    const [user, announcements, historicalStats, todayLogs, projectsCount, certificatesCount, linksCount, testimonialsCount, activities] = await Promise.all([
      // A. Layout & Appearance
      prisma.user.findUnique({
        where: { email: userEmail },
        include: { 
          profile: true, 
          siteAppearance: true
        }
      }),
      // B. Announcements
      prisma.$queryRaw`
        SELECT id, title, message, type, channel, targetPlan, isActive, createdAt 
        FROM Announcement 
        WHERE isActive = true 
        ORDER BY createdAt DESC
      `,
      // C. Historical Stats (hari sebelum hari ini)
      prisma.dailyStats.findMany({
        where: { userId, date: { gte: startDate, lt: startOfToday } },
        orderBy: { date: 'asc' }
      }),
      // D. Raw logs dalam FULL RANGE (bukan hanya hari ini)
      prisma.analytics.findMany({
        where: { userId, createdAt: { gte: startDate } },
        select: { id: true, type: true, ipAddress: true, duration: true, sessionId: true, referrer: true, createdAt: true }
      }),
      // E. Projects (OPTIMASI: Gunakan count, hasilkan 1 angka integer)
      prisma.project.count({ where: { userId, deletedAt: null } }),
      // F. Certificates (OPTIMASI: Gunakan count, hasilkan 1 angka integer)
      prisma.certificate.count({ where: { userId, deletedAt: null } }),
      // G. Links (OPTIMASI: Gunakan count, hasilkan 1 angka integer)
      prisma.link.count({ where: { userId } }),
      // H. Testimonials (OPTIMASI: Gunakan count, hasilkan 1 angka integer)
      prisma.testimonial.count({ where: { userId } }),
      // I. Activities (Dibatasi take: 5 agar ringan)
      prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, actionType: true, details: true, createdAt: true }
      })
    ]);

    if (!user) return NextResponse.json(null, { status: 404 });

    // --- 3. Format Data Layout & Appearance ---
    const layout = {
      isLive: user.isLive,
      subdomain: user.profile?.subdomain || null,
      profession: user.profile?.profession || null,
      bio: user.profile?.bio || null,
      avatar: user.profile?.avatarUrl || user.avatar || null,
      plan: "PRO",
      fullName: user.profile?.fullName,
      email: user.email,
      siteAppearance: user.siteAppearance,
      canClaimTrial: false,
    };

    // --- 4. Format Data Announcements ---
    const formattedAnnouncements = Array.isArray(announcements) ? announcements.map((a: any) => ({
      ...a, isActive: Boolean(a.isActive),
    })) : [];

    // --- 5. Format Data Stats Analytics ---
    const historicalViews = historicalStats.reduce((acc: number, curr: any) => acc + curr.views, 0);
    const todayViews = todayLogs.filter((l: any) => l.type === 'VIEW').length;
    const totalViews = historicalViews + todayViews;

    let statsResult = {
      summary: { totalViews: 0, uniqueVisitors: 0, avgTime: "0s", bounceRate: "0%" },
      dailyStats: [] as any[],
      stats: { totalViews: 0, uniqueVisitors: 0, avgTime: "0s", bounceRate: "0%" },
      chartData: [] as any[],
      sources: [] as any[]
    };

    if (totalViews > 0) {
      // Unique visitors: IP unik dari raw logs + estimasi historis
      const uniqueIPs = new Set(todayLogs.map((log: any) => log.ipAddress).filter(Boolean));
      const uniqueVisitors = uniqueIPs.size + Math.round(historicalViews * 0.7);

      // Avg. Time: dari semua rawLogs dalam range (bukan hanya hari ini)
      const logsWithDuration = todayLogs.filter((l: any) => l.duration > 0);
      const totalDuration = logsWithDuration.reduce((acc: number, curr: any) => acc + curr.duration, 0);
      const avgSec = logsWithDuration.length > 0 ? Math.round(totalDuration / logsWithDuration.length) : 0;
      const avgTimeStr = avgSec >= 60 ? `${Math.floor(avgSec / 60)}m ${avgSec % 60}s` : `${avgSec}s`;

      // Bounce Rate: berdasarkan sessionId dalam range
      const sessionsMap: Record<string, number> = {};
      todayLogs.filter((l: any) => l.type === 'VIEW' && l.sessionId).forEach((l: any) => {
        sessionsMap[l.sessionId] = (sessionsMap[l.sessionId] || 0) + 1;
      });
      const totalSessions = Object.keys(sessionsMap).length;
      const bouncedSessions = Object.values(sessionsMap).filter((v: number) => v === 1).length;
      const rawViewCount = todayLogs.filter((l: any) => l.type === 'VIEW').length;
      const bounceRate = totalSessions > 0
        ? Math.round((bouncedSessions / totalSessions) * 100)
        : rawViewCount > 0
        ? Math.round((todayLogs.filter((l: any) => l.duration > 0 && l.duration < 10).length / rawViewCount) * 100)
        : 0;

      // Sources: dari semua raw logs dalam range
      const sourcesMap: Record<string, number> = {};
      todayLogs.filter((l: any) => l.type === 'VIEW').forEach((log: any) => {
        let ref = "Direct";
        if (log.referrer && log.referrer !== "Direct") {
          const r = log.referrer.toLowerCase();
          if (r.includes("portfo.be") || r.includes("localhost")) ref = "Direct";
          else if (r.includes("instagram")) ref = "Instagram";
          else if (r.includes("t.co") || r.includes("twitter")) ref = "Twitter / X";
          else if (r.includes("facebook")) ref = "Facebook";
          else if (r.includes("google")) ref = "Google";
          else if (r.includes("whatsapp") || r.includes("wa.me")) ref = "WhatsApp";
          else if (r.includes("linkedin")) ref = "LinkedIn";
          else {
            try { ref = new URL(log.referrer).hostname.replace('www.', ''); }
            catch { ref = "Other"; }
          }
        }
        sourcesMap[ref] = (sourcesMap[ref] || 0) + 1;
      });

      const totalRefViews = Object.values(sourcesMap).reduce((s: number, v: number) => s + v, 0);
      const sources = Object.entries(sourcesMap)
        .map(([name, count]) => ({ name, count, percentage: Math.round((count / (totalRefViews || 1)) * 100) }))
        .sort((a, b) => b.count - a.count);

      // Chart Data: gunakan TANGGAL (YYYY-MM-DD) sebagai key, bukan nama hari
      const dailyMap: Record<string, number> = {};
      historicalStats.forEach((stat: any) => {
        const key = stat.date.toISOString().split('T')[0];
        dailyMap[key] = (dailyMap[key] || 0) + stat.views;
      });
      todayLogs.filter((l: any) => l.type === 'VIEW').forEach((l: any) => {
        const key = l.createdAt.toISOString().split('T')[0];
        dailyMap[key] = (dailyMap[key] || 0) + 1;
      });

      const chartData: any[] = [];
      const cursor = new Date(startDate);
      cursor.setUTCHours(0, 0, 0, 0);
      const endDay = new Date(startOfToday);
      let count = 0;
      while (cursor <= endDay && count < 90) {
        const key = cursor.toISOString().split('T')[0];
        const label = range === '7d'
          ? cursor.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })
          : cursor.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        chartData.push({ day: label, date: key, views: dailyMap[key] || 0 });
        cursor.setUTCDate(cursor.getUTCDate() + 1);
        count++;
      }

      statsResult = {
        summary: { totalViews, uniqueVisitors, avgTime: avgTimeStr, bounceRate: `${bounceRate}%` },
        dailyStats: chartData,
        stats: { totalViews, uniqueVisitors, avgTime: avgTimeStr, bounceRate: `${bounceRate}%` },
        chartData: chartData,
        sources: sources.slice(0, 5),
      };
    }

    return NextResponse.json({
      layout,
      announcements: formattedAnnouncements,
      stats: statsResult,
      overview: {
        projectsCount: projectsCount, // LANGSUNG MENGGUNAKAN HASIL COUNT (Angka murni)
        certificatesCount: certificatesCount, // LANGSUNG MENGGUNAKAN HASIL COUNT
        linksCount: linksCount, // LANGSUNG MENGGUNAKAN HASIL COUNT
        testimonialsCount: testimonialsCount,
        activities
      }
    });
  } catch (error) {
    console.error("Dashboard Sync API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}