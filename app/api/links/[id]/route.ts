import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { checkRateLimit } from "@/lib/rate-limit";

// PATCH: Mengupdate informasi link (Nama Platform, URL, atau Status Active)
export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; 
    const body = await req.json();
    // SECURITY: Hanya terima field yang diizinkan (mencegah mass assignment)
    const { platform, url, isActive } = body;

    // 1. Validasi URL jika ada perubahan URL
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      return NextResponse.json({ error: "URL wajib diawali dengan http:// atau https://" }, { status: 400 });
    }

    // 2. Cari data link saat ini
    const currentLink = await prisma.link.findUnique({ where: { id: id } });
    if (!currentLink) return NextResponse.json({ error: "Link tidak ditemukan" }, { status: 404 });

    // --- IDOR PROTECTION ---
    if (currentLink.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    // -----------------------

    // 3. Validasi Limit 4 Link Aktif
    if (body.isActive === true && currentLink.isActive === false) {
      const activeCount = await prisma.link.count({
        where: { userId: currentLink.userId, isActive: true }
      });

      if (activeCount >= 4) {
        return NextResponse.json({ 
          error: "Maksimal hanya 4 link yang bisa tampil di profil." 
        }, { status: 403 });
      }
    }

    const updatedLink = await prisma.link.update({
      where: { id: id },
      data: {
        ...(platform !== undefined && { platform }),
        ...(url !== undefined && { url }),
        ...(isActive !== undefined && { isActive }),
      }
    });

    // RECORD ACTIVITY
    await logActivity(
      updatedLink.userId, 
      "UPDATE_LINK", 
      `Memperbarui tautan "${updatedLink.platform}"`
    );

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

// DELETE: Menghapus link secara permanen
export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Cari dulu data link sebelum dihapus untuk mendapatkan informasi userId dan platform
    const link = await prisma.link.findUnique({ where: { id: id } });
    if (!link) return NextResponse.json({ error: "Link tidak ditemukan" }, { status: 404 });

    // --- IDOR PROTECTION ---
    if (link.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    // -----------------------

    await prisma.link.delete({ where: { id: id } });

    // RECORD ACTIVITY
    await logActivity(
      link.userId, 
      "DELETE_LINK", 
      `Menghapus tautan "${link.platform}" dari profil`
    );

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}