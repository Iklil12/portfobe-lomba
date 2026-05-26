// app/api/themes/stats/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: Total like count per tema dari seluruh user
export async function GET() {
  try {
    const grouped = await prisma.themeFavorite.groupBy({
      by: ["themeId"],
      _count: { themeId: true },
      orderBy: { _count: { themeId: "desc" } },
    });

    // Konversi ke objek { themeId: count }
    const stats: Record<string, number> = {};
    grouped.forEach((g) => {
      stats[g.themeId] = g._count.themeId;
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET ThemeStats Error:", error);
    return NextResponse.json({ error: "Gagal mengambil statistik tema" }, { status: 500 });
  }
}
