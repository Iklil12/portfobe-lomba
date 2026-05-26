import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// API untuk mengelola proyek Canva secara manual
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const session = await getServerSession(authOptions);
    const targetUserId = userId || session?.user?.id;

    if (!targetUserId) {
      return NextResponse.json({ projects: [] });
    }

    const projects = await prisma.canvaProject.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data Canva" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projects, isBulk } = await req.json();

    if (isBulk && Array.isArray(projects)) {
      // VALIDASI KEAMANAN
      if (projects.length > 10) {
        return NextResponse.json({ error: "Maksimal 10 proyek diperbolehkan" }, { status: 400 });
      }

      for (const p of projects) {
        if (p.title?.length > 100) return NextResponse.json({ error: "Judul terlalu panjang" }, { status: 400 });
        if (p.embedLink?.length > 1000) return NextResponse.json({ error: "Link terlalu panjang" }, { status: 400 });
        if (p.embedLink && !p.embedLink.startsWith('<iframe') && !p.embedLink.startsWith('<div') && !p.embedLink.startsWith('https://')) {
          return NextResponse.json({ error: "Format link tidak valid" }, { status: 400 });
        }
      }

      // Gunakan Transaction untuk menghapus yang lama dan simpan yang baru
      await prisma.$transaction([
        prisma.canvaProject.deleteMany({ where: { userId: session.user.id } }),
        prisma.canvaProject.createMany({
          data: projects.map((p: any) => ({
            userId: session.user.id,
            title: p.title || "Untitled",
            embedLink: p.embedLink || "",
          })),
        }),
      ]);

      return NextResponse.json({ success: true });
    }

    // Fallback untuk single create (jika masih dibutuhkan)
    const { title, embedLink } = projects[0] || {};
    if (!title || !embedLink) {
      return NextResponse.json({ error: "Judul dan Link Embed wajib diisi" }, { status: 400 });
    }

    await prisma.canvaProject.create({
      data: {
        userId: session.user.id,
        title,
        embedLink,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save Canva Project Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    await prisma.canvaProject.delete({
      where: {
        id,
        userId: session.user.id, // Pastikan hanya bisa hapus milik sendiri
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus proyek" }, { status: 500 });
  }
}
