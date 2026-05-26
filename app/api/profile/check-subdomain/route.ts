import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isForbiddenUsername } from "@/lib/constants/reserved-usernames";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json({ error: "Subdomain wajib diisi" }, { status: 400 });
    }

    const forbiddenCheck = isForbiddenUsername(subdomain);
    if (forbiddenCheck.forbidden) {
      return NextResponse.json({ available: false, error: forbiddenCheck.reason });
    }

    // Cari apakah ada yang pakai subdomain ini di tabel profile
    const existingProfile = await prisma.profile.findUnique({
      where: { subdomain: subdomain }
    });

    // Kembalikan status 'available' (Tersedia: true/false)
    return NextResponse.json({ available: !existingProfile });

  } catch (error) {
    console.error("Error Check Subdomain:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}