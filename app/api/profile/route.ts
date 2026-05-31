import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isForbiddenUsername } from "@/lib/constants/reserved-usernames";
import { checkRateLimit } from "@/lib/rate-limit";

// --- 1. FUNGSI GET (AMBIL DATA PROFIL LENGKAP) ---
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        plan: true, // Penting agar UI Profil tahu kalau user sudah PRO
        isLive: true,
        profile: true,
        siteAppearance: true,
        integrations: true
      } 
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Kita gabungkan User + Profile + Plan ke satu level agar mudah dibaca Frontend
    return NextResponse.json({
      ...user,
      ...user.profile,
      plan: user.plan // Pastikan plan ada di level utama
    });
  } catch (error) {
    console.error("Error Fetch Profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- 2. FUNGSI POST (VALIDASI SUBDOMAIN CEPAT) ---
export async function POST(req: Request) {
  try {
    // Rate limit: maks 10 cek per menit untuk mencegah enumerasi subdomain
    const rateLimitResponse = await checkRateLimit(10, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();

    if (body.action === 'check_subdomain') {
      const { subdomain } = body;
      if (!subdomain) return NextResponse.json({ error: "Subdomain kosong" }, { status: 400 });

      const check = isForbiddenUsername(subdomain);
      if (check.forbidden) {
        return NextResponse.json({ available: false, message: check.reason });
      }

      // Cukup gunakan count (lebih cepat daripada findUnique)
      const existingCount = await prisma.profile.count({
        where: { subdomain: subdomain.toLowerCase() }
      });

      if (existingCount > 0) {
        return NextResponse.json({ available: false, message: "URL ini sudah dipakai kreator lain." });
      }

      return NextResponse.json({ available: true });
    }

    return NextResponse.json({ error: "Aksi tidak dikenali" }, { status: 400 });
  } catch (error) {
    console.error("Check Subdomain Error:", error);
    return NextResponse.json({ error: "Gagal mengecek." }, { status: 500 });
  }
}

// --- 3. FUNGSI PUT (UPDATE DATA PROFIL) ---
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { subdomain, fullName, profession } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true } // Hanya butuh ID untuk relasi
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (subdomain) {
      // Validasi simpel
      if (subdomain.length < 3 || subdomain.length > 15) {
        return NextResponse.json({ error: "Subdomain harus 3-15 karakter." }, { status: 400 });
      }

      const check = isForbiddenUsername(subdomain);
      if (check.forbidden) {
        return NextResponse.json({ error: check.reason }, { status: 400 });
      }
      
      const existingProfile = await prisma.profile.findUnique({
        where: { subdomain: subdomain.toLowerCase() },
        select: { userId: true }
      });

      if (existingProfile && existingProfile.userId !== user.id) {
        return NextResponse.json({ error: "URL ini sudah dipakai orang lain." }, { status: 400 });
      }
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        ...(subdomain !== undefined && { subdomain: subdomain.toLowerCase() }),
        ...(fullName !== undefined && { fullName }),
        ...(profession !== undefined && { profession })
      },
      create: {
        userId: user.id,
        fullName: fullName || "Creator",
        subdomain: subdomain ? subdomain.toLowerCase() : null,
        profession: profession || null
      }
    });

    return NextResponse.json({ message: "Profil diperbarui", profile: updatedProfile });
  } catch (error) {
    console.error("Error Update Profile:", error);
    return NextResponse.json({ error: "Gagal memproses data." }, { status: 500 });
  }
}

// --- 4. FUNGSI PATCH (PARTIAL UPDATE UNTUK INLINE EDITING) ---
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const allowedFields = ['fullName', 'profession', 'bio', 'subdomain', 'location'];
    
    // Filter only allowed fields
    const updateData: any = {};
    for (const key of Object.keys(body)) {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: updateData,
      create: {
        userId: user.id,
        fullName: updateData.fullName || "Creator",
        subdomain: updateData.subdomain || null,
        profession: updateData.profession || null,
        bio: updateData.bio || null
      }
    });

    return NextResponse.json({ message: "Profil diperbarui sebagian", profile: updatedProfile });
  } catch (error) {
    console.error("Error Patch Profile:", error);
    return NextResponse.json({ error: "Gagal memproses data patch." }, { status: 500 });
  }
}