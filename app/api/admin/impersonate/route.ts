import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // 1. Cek sesi Admin yang sedang login
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Tidak diizinkan. Silakan login." }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses ditolak. Anda bukan admin." }, { status: 403 });
    }

    // 2. Ambil target user ID dari request body
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "ID target user tidak disertakan." }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target user tidak ditemukan." }, { status: 404 });
    }

    // 3. Buat token JWT untuk impersonasi (berlaku 60 detik)
    if (!process.env.NEXTAUTH_SECRET) {
      throw new Error("NEXTAUTH_SECRET is not defined");
    }

    const token = jwt.sign(
      { targetUserId: userId, isAdminImpersonating: true },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: "60s" }
    );

    // Anda dapat menambahkan log ke AdminLog di sini jika diperlukan
    // await prisma.adminLog.create({ ... })

    return NextResponse.json({ 
      message: "Token impersonasi berhasil dibuat.", 
      impersonateToken: token 
    }, { status: 200 });

  } catch (error) {
    console.error("Error generating impersonate token:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
