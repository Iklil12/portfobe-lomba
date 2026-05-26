// app/api/themes/favorite/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET: Ambil daftar favorit milik user yang login
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const favorites = await prisma.themeFavorite.findMany({
      where: { userId: user.id },
      select: { themeId: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ favorites: favorites.map((f) => f.themeId) });
  } catch (error) {
    console.error("GET ThemeFavorite Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data favorit" }, { status: 500 });
  }
}

// POST: Toggle favorit (like jika belum, unlike jika sudah)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const body = await req.json();
    const { themeId } = body;
    if (!themeId || typeof themeId !== "string") {
      return NextResponse.json({ error: "themeId tidak valid" }, { status: 400 });
    }

    // Cek apakah sudah difavoritkan
    const existing = await prisma.themeFavorite.findUnique({
      where: { userId_themeId: { userId: user.id, themeId } },
    });

    if (existing) {
      // Unlike
      await prisma.themeFavorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await prisma.themeFavorite.create({ data: { userId: user.id, themeId } });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("POST ThemeFavorite Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan favorit" }, { status: 500 });
  }
}
