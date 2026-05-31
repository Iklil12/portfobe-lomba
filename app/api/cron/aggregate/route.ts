import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // 1. Verifikasi Keamanan
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const authHeader = req.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const secret = process.env.CRON_SECRET;

    if (!secret) {
      return NextResponse.json({ error: "Unauthorized: CRON_SECRET not set in server environment" }, { status: 401 });
    }

    if (key !== secret && bearerToken !== secret) {
      return NextResponse.json({ error: "Unauthorized: Key mismatch" }, { status: 401 });
    }

    // 2. Tentukan Tanggal Agregasi (Kemarin)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Ambil semua User ID yang aktif kemarin
    const activeUserIds = await prisma.analytics.findMany({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today
        }
      },
      select: { userId: true },
      distinct: ['userId']
    });

    console.log(`Starting aggregation for ${activeUserIds.length} users...`);

    const results = [];

    // 4. Proses Agregasi per User
    for (const { userId } of activeUserIds) {
      // Hitung View
      const views = await prisma.analytics.count({
        where: {
          userId,
          type: 'VIEW',
          createdAt: { gte: yesterday, lt: today }
        }
      });

      // Hitung Click (misal: PROJECT_OPEN atau CLICK)
      const clicks = await prisma.analytics.count({
        where: {
          userId,
          type: { in: ['CLICK', 'PROJECT_OPEN'] },
          createdAt: { gte: yesterday, lt: today }
        }
      });

      // Upsert ke DailyStats
      const stat = await prisma.dailyStats.upsert({
        where: {
          userId_date: {
            userId,
            date: yesterday
          }
        },
        update: { views, clicks },
        create: { userId, date: yesterday, views, clicks }
      });

      results.push(stat);
    }

    // 5. AUTO-CLEANUP: Hapus data mentah yang sudah lewat 7 hari
    // Kita simpan 7 hari terakhir buat jaga-jaga, sisanya hapus karena sudah ada di DailyStats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await prisma.analytics.deleteMany({
      where: {
        createdAt: { lt: sevenDaysAgo }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully aggregated ${activeUserIds.length} users and cleaned up old data.`,
      count: results.length
    });

  } catch (error) {
    console.error("Aggregation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
