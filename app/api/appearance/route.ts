//app/api/appearance/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { safeStringifyJson } from "@/lib/safeJson";

import { THEMES_DATA } from "@/lib/themes";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// MENGAMBIL TEMA & PROFIL YANG SEDANG DIPAKAI (UNTUK PREVIEW)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');

    // MODE LITE: Hanya ambil data dasar untuk performa tinggi (digunakan di Themes Page)
    if (mode === 'lite') {
      const liteData = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          profile: { select: { subdomain: true, fullName: true } },
          siteAppearance: { select: { themeTemplate: true, favoriteThemes: true } }
        }
      });
      return NextResponse.json(liteData);
    }

    // MODE FULL: Tarik data lengkap untuk Editor / Preview
    const userData = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
        siteAppearance: true,
        links: { orderBy: { order: 'asc' } },
        projects: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
        certificates: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
        testimonials: { orderBy: { order: 'asc' } }
      }
    });

    if (!userData) return NextResponse.json({});
    return NextResponse.json(userData);
  } catch (error) {
    console.error("GET Appearance Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// MENYIMPAN PERUBAHAN TEMA
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    
    // TANGKAP DATA DARI FRONTEND
    const { 
        themeTemplate, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle,
        splashScreen,
        favoriteThemes
    } = body;

    // OPTIMASI: Jika hanya update favorit, lewati pengecekan plan dan logging
    const isOnlyFavorites = favoriteThemes !== undefined && themeTemplate === undefined;

    if (!isOnlyFavorites) {
      // Pro features enabled for everyone in Lomba edition
    }

    // UPDATE ATAU CREATE KE TABEL SITE_APPEARANCE
    const updatedAppearance = await prisma.siteAppearance.upsert({
      where: { userId: user.id },
      update: { 
        themeTemplate, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle,
        splashScreen,
        favoriteThemes: favoriteThemes !== undefined ? safeStringifyJson(favoriteThemes) : undefined
      },
      create: {
        userId: user.id,
        themeTemplate, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle,
        splashScreen,
        favoriteThemes: favoriteThemes !== undefined ? safeStringifyJson(favoriteThemes) : "[]"
      }
    });

    if (!isOnlyFavorites) {
      await logActivity(user.id, "UPDATE_THEME", `Memperbarui tema portofolio ke ${themeTemplate}`);
    }

    return NextResponse.json(updatedAppearance);
  } catch (error) {
    console.error("PATCH Appearance Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan tema" }, { status: 500 });
  }
}