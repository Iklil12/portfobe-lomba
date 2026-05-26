// File: app/api/projects/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity"; 
import { checkRateLimit } from "@/lib/rate-limit";

// 1. GET: Menarik Semua Proyek
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { userId: user.id, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip,
      }),
      prisma.project.count({
        where: { userId: user.id, deletedAt: null },
      })
    ]);

    return NextResponse.json({
      data: projects,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error Fetch Projects:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// 2. POST: Menyimpan Proyek Baru
export async function POST(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const body = await req.json();
    const { title, description, mediaUrl, projectType, tags } = body;

    if (!title || !mediaUrl) {
      return NextResponse.json({ error: "Judul dan Media wajib diisi" }, { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        title: title,
        description: description || null,
        mediaUrl: mediaUrl,
        projectType: projectType || "photo",
        tags: Array.isArray(tags) ? JSON.stringify(tags) : "[]",
        userId: user.id
      }
    });

    // REKAM AKTIVITAS KE HISTORY
    let actionLabel = "Mengunggah proyek baru";
    if (projectType === 'video') actionLabel = "Menambahkan portofolio video";
    await logActivity(user.id, "UPLOAD_PROJECT", `${actionLabel}: "${title}"`);

    return NextResponse.json({ message: "Proyek berhasil ditambahkan", project: newProject }, { status: 201 });

  } catch (error) {
    console.error("Error Create Project:", error);
    return NextResponse.json({ error: "Gagal menyimpan proyek ke server" }, { status: 500 });
  }
}

// 3. PATCH: Memperbarui Proyek
export async function PATCH(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const body = await req.json();
    const { id, title, description, mediaUrl, projectType, tags } = body;

    if (!id || !title || !mediaUrl) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject || existingProject.userId !== user.id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description: description || null,
        mediaUrl,
        projectType,
        tags: Array.isArray(tags) ? JSON.stringify(tags) : (existingProject.tags ?? "[]")
      }
    });

    // REKAM AKTIVITAS KE HISTORY
    await logActivity(user.id, "UPDATE_PROJECT", `Memperbarui karya: "${title}"`);

    return NextResponse.json({ message: "Proyek berhasil diperbarui", project: updatedProject }, { status: 200 });

  } catch (error) {
    console.error("Error Update Project:", error);
    return NextResponse.json({ error: "Gagal memperbarui proyek" }, { status: 500 });
  }
}

// 4. DELETE: Menghapus Proyek
export async function DELETE(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID proyek tidak valid" }, { status: 400 });

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject || existingProject.userId !== user.id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    
    // REKAM AKTIVITAS KE HISTORY
    await logActivity(user.id, "DELETE_PROJECT", `Memindahkan ke trash: "${existingProject.title}"`);

    return NextResponse.json({ message: "Proyek dipindahkan ke trash" }, { status: 200 });

  } catch (error) {
    console.error("Error Delete Project:", error);
    return NextResponse.json({ error: "Gagal menghapus proyek" }, { status: 500 });
  }
}