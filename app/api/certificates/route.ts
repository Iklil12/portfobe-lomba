// File: app/api/certificates/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { checkRateLimit } from "@/lib/rate-limit";

// MENGAMBIL SERTIFIKAT USER DENGAN PAGINATION
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where: { userId: user.id, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip,
      }),
      prisma.certificate.count({
        where: { userId: user.id, deletedAt: null },
      })
    ]);

    return NextResponse.json({
      data: certificates,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("GET Certificates Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// MENAMBAH SERTIFIKAT BARU
export async function POST(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { title, description, mediaUrl, issuer, year, status } = body;

    if (!title || !mediaUrl || !issuer || !year) {
      return NextResponse.json({ error: "Kolom wajib harus diisi." }, { status: 400 });
    }

    const newCertificate = await prisma.certificate.create({
      data: {
        title,
        description,
        mediaUrl,
        issuer,
        year,
        status: status || "VERIFIED",
        userId: user.id,
      }
    });

    // REKAM AKTIVITAS KE HISTORY
    await logActivity(user.id, "CREATE_CERTIFICATE", `Menambahkan sertifikat/pencapaian: "${title}"`);

    return NextResponse.json(newCertificate, { status: 201 });
  } catch (error) {
    console.error("POST Certificate Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan sertifikat." }, { status: 500 });
  }
}

// MENGEDIT SERTIFIKAT YANG ADA
export async function PATCH(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { id, title, description, mediaUrl, issuer, year, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID Sertifikat tidak ditemukan." }, { status: 400 });
    }

    const existingCert = await prisma.certificate.findUnique({ where: { id } });
    if (!existingCert) return NextResponse.json({ error: "Sertifikat tidak ditemukan." }, { status: 404 });

    // --- IDOR PROTECTION ---
    if (existingCert.userId !== user.id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const updatedCertificate = await prisma.certificate.update({
      where: { id },
      data: {
        title,
        description,
        mediaUrl,
        issuer,
        year,
        status
      }
    });

    // REKAM AKTIVITAS KE HISTORY
    await logActivity(user.id, "UPDATE_CERTIFICATE", `Memperbarui data pencapaian: "${title}"`);

    return NextResponse.json(updatedCertificate);
  } catch (error) {
    console.error("PATCH Certificate Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui sertifikat." }, { status: 500 });
  }
}

// MENGHAPUS SERTIFIKAT
export async function DELETE(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID Sertifikat wajib disertakan." }, { status: 400 });
    }

    const existingCert = await prisma.certificate.findUnique({ where: { id } });
    if (!existingCert) return NextResponse.json({ error: "Sertifikat tidak ditemukan." }, { status: 404 });

    // --- IDOR PROTECTION ---
    if (existingCert.userId !== user.id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    await prisma.certificate.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    // REKAM AKTIVITAS KE HISTORY
    await logActivity(user.id, "DELETE_CERTIFICATE", `Memindahkan ke trash: "${existingCert.title}"`);

    return NextResponse.json({ message: "Sertifikat dipindahkan ke trash." });
  } catch (error) {
    console.error("DELETE Certificate Error:", error);
    return NextResponse.json({ error: "Gagal menghapus sertifikat." }, { status: 500 });
  }
}