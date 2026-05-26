import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity"; 
import { checkRateLimit } from "@/lib/rate-limit";

// AMBIL SEMUA LINK USER
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const [links, total] = await Promise.all([
    prisma.link.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { order: 'asc' },
      take: limit,
      skip: skip,
    }),
    prisma.link.count({
      where: { user: { email: session.user.email } }
    })
  ]);

  return NextResponse.json({
    data: links,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit)
    }
  });
}

// TAMBAH LINK BARU
export async function POST() {
  const rateLimitResponse = await checkRateLimit();
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Limit checking removed for Lomba Edition

  // --- ACTIVE LIMIT: CEK MAKSIMAL 4 LINK AKTIF ---
  const activeCount = await prisma.link.count({ 
    where: { userId: user.id, isActive: true } 
  });
  const shouldBeActive = activeCount < 4;
  // -----------------------------------------

  // 1. Simpan link baru ke database
  const newLink = await prisma.link.create({
    data: {
      userId: user.id,
      platform: "custom",
      url: "https://",
      isActive: shouldBeActive,
      order: 0
    }
  });

  // 2. Catat aktivitasnya
  await logActivity(user.id, "ADD_LINK", `Menambahkan tautan baru ke profil`);

  return NextResponse.json(newLink);
}