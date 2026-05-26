// app/api/trash/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const TRASH_RETENTION_DAYS = 30;
const DEFAULT_LIMIT = 10;

// ── GET: Ambil item di trash milik user (dengan pagination) ──────────────
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get("page")  ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10)));
    const skip  = (page - 1) * limit;

    // Hitung total terlebih dahulu (ringan, hanya count)
    const [totalProjects, totalCerts] = await Promise.all([
      prisma.project.count({ where: { userId: user.id, deletedAt: { not: null } } }),
      prisma.certificate.count({ where: { userId: user.id, deletedAt: { not: null } } }),
    ]);
    const total = totalProjects + totalCerts;

    // Ambil semua item dari kedua tabel lalu sort + slice di memori.
    // Efisien karena trash biasanya kecil (< 100 item) & ada index pada deletedAt.
    const [projects, certificates] = await Promise.all([
      prisma.project.findMany({
        where: { userId: user.id, deletedAt: { not: null } },
        orderBy: { deletedAt: "desc" },
        select: { id: true, title: true, mediaUrl: true, projectType: true, deletedAt: true, createdAt: true },
      }),
      prisma.certificate.findMany({
        where: { userId: user.id, deletedAt: { not: null } },
        orderBy: { deletedAt: "desc" },
        select: { id: true, title: true, mediaUrl: true, deletedAt: true, createdAt: true },
      }),
    ]);

    const formattedProjects = projects.map((p) => ({
      ...p,
      itemType: "project",
      expiresAt: new Date(p.deletedAt!.getTime() + TRASH_RETENTION_DAYS * 86400000),
    }));
    const formattedCerts = certificates.map((c) => ({
      ...c,
      itemType: "certificate",
      projectType: "certificate",
      expiresAt: new Date(c.deletedAt!.getTime() + TRASH_RETENTION_DAYS * 86400000),
    }));

    // Gabung, sort desc deletedAt, lalu slice untuk halaman yang diminta
    const allItems = [...formattedProjects, ...formattedCerts].sort(
      (a, b) => new Date(b.deletedAt!).getTime() - new Date(a.deletedAt!).getTime()
    );

    const items      = allItems.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);
    const hasMore    = page < totalPages;

    return NextResponse.json({ items, total, page, totalPages, hasMore });
  } catch (error) {
    console.error("GET Trash Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data trash" }, { status: 500 });
  }
}

// ── POST: Restore / Purge satu item / Purge all ───────────────────────────
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const body = await req.json();
    const { action, id, type } = body;

    // ── RESTORE ───────────────────────────────────────────────────────────
    if (action === "restore") {
      if (!id || !type) return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });

      if (type === "project") {
        const item = await prisma.project.findUnique({ where: { id } });
        if (!item || item.userId !== user.id)
          return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

        await prisma.project.update({ where: { id }, data: { deletedAt: null } });
        await logActivity(user.id, "RESTORE_PROJECT", `Memulihkan karya dari trash: "${item.title}"`);
        return NextResponse.json({ message: "Proyek berhasil dipulihkan" });
      }

      if (type === "certificate") {
        const item = await prisma.certificate.findUnique({ where: { id } });
        if (!item || item.userId !== user.id)
          return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

        await prisma.certificate.update({ where: { id }, data: { deletedAt: null } });
        await logActivity(user.id, "RESTORE_CERTIFICATE", `Memulihkan sertifikat dari trash: "${item.title}"`);
        return NextResponse.json({ message: "Sertifikat berhasil dipulihkan" });
      }

      return NextResponse.json({ error: "Tipe tidak valid" }, { status: 400 });
    }

    // ── PURGE (hapus permanen satu item) ──────────────────────────────────
    if (action === "purge") {
      if (!id || !type) return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });

      if (type === "project") {
        const item = await prisma.project.findUnique({ where: { id } });
        if (!item || item.userId !== user.id)
          return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
        await prisma.project.delete({ where: { id } });
        await logActivity(user.id, "PURGE_PROJECT", `Menghapus permanen karya: "${item.title}"`);
        return NextResponse.json({ message: "Proyek dihapus permanen" });
      }

      if (type === "certificate") {
        const item = await prisma.certificate.findUnique({ where: { id } });
        if (!item || item.userId !== user.id)
          return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
        await prisma.certificate.delete({ where: { id } });
        await logActivity(user.id, "PURGE_CERTIFICATE", `Menghapus permanen sertifikat: "${item.title}"`);
        return NextResponse.json({ message: "Sertifikat dihapus permanen" });
      }

      return NextResponse.json({ error: "Tipe tidak valid" }, { status: 400 });
    }

    // ── PURGE ALL (kosongkan seluruh trash) ───────────────────────────────
    if (action === "purge_all") {
      const [projDel, certDel] = await Promise.all([
        prisma.project.deleteMany({ where: { userId: user.id, deletedAt: { not: null } } }),
        prisma.certificate.deleteMany({ where: { userId: user.id, deletedAt: { not: null } } }),
      ]);
      const total = projDel.count + certDel.count;
      await logActivity(user.id, "PURGE_ALL_TRASH", `Mengosongkan trash: ${total} item dihapus permanen`);
      return NextResponse.json({ message: `${total} item dihapus permanen` });
    }

    return NextResponse.json({ error: "Action tidak dikenali" }, { status: 400 });
  } catch (error) {
    console.error("POST Trash Error:", error);
    return NextResponse.json({ error: "Gagal memproses permintaan" }, { status: 500 });
  }
}
