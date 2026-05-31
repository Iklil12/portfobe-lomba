// app/api/cron/purge-trash/route.ts
// Hapus permanen semua item trash yang sudah > 30 hari
// Dipanggil harian via Vercel Cron atau layanan eksternal
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const RETENTION_DAYS = 30;

export async function GET(req: Request) {
  // Auth via ?key= — konsisten dengan cron aggregate & check-plan-expiry di Hostinger
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key || key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

    const [projects, certificates] = await Promise.all([
      prisma.project.deleteMany({
        where: { deletedAt: { not: null, lte: cutoff } },
      }),
      prisma.certificate.deleteMany({
        where: { deletedAt: { not: null, lte: cutoff } },
      }),
    ]);

    const total = projects.count + certificates.count;
    console.log(`[purge-trash] Dihapus permanen: ${projects.count} proyek, ${certificates.count} sertifikat`);

    return NextResponse.json({
      message: `Purge selesai: ${total} item dihapus permanen`,
      projects: projects.count,
      certificates: certificates.count,
      cutoffDate: cutoff.toISOString(),
    });
  } catch (error) {
    console.error("Cron purge-trash error:", error);
    return NextResponse.json({ error: "Gagal menjalankan purge" }, { status: 500 });
  }
}
