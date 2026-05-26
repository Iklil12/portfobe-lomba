// app/api/search/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Sesuaikan jika beda
import prisma from "@/lib/prisma"; // Tanpa kurung kurawal sesuai fix sebelumnya

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  // Jangan mencari jika user belum login atau ketikan kurang dari 2 huruf
  if (!session || query.length < 2) return NextResponse.json([]);

  try {
    const userId = (session.user as any)?.id;

    // 🚀 GOD MODE: Cari ke 4 tabel sekaligus secara paralel!
    const [projects, links, certificates, activities] = await Promise.all([
      // 1. Cari Proyek (berdasarkan judul)
      prisma.project.findMany({
        where: { userId, title: { contains: query} },
        take: 3
      }),
      // 2. Cari Tautan/Link (berdasarkan nama platform, misal "Instagram")
      prisma.link.findMany({
        where: { userId, platform: { contains: query} },
        take: 3
      }),
      // 3. Cari Sertifikat (berdasarkan judul sertifikat)
      prisma.certificate.findMany({
        where: { userId, title: { contains: query} },
        take: 2
      }),
      // 4. Cari Riwayat Aktivitas (berdasarkan detail aktivitas)
      prisma.activity.findMany({
        where: { userId, details: { contains: query} },
        take: 2
      })
    ]);

    // 📦 FORMATTING: Ubah semua data menjadi format seragam untuk GlobalSearch
    const results = [
      ...projects.map(p => ({
        id: `prj-${p.id}`, 
        title: p.title, 
        group: "Hasil: Proyek & Karya", 
        icon: "fa-paint-roller", 
        link: `/dashboard/projects?highlight=${p.id}`, 
        type: "link"
      })),
      ...links.map(l => ({
        id: `lnk-${l.id}`, 
        title: l.platform, 
        group: "Hasil: Tautan Sosial", 
        icon: "fa-link", 
        link: `/dashboard/links?edit=${l.id}`, 
        type: "link"
      })),
      ...certificates.map(c => ({
        id: `cert-${c.id}`, 
        title: c.title, 
        group: "Hasil: Sertifikat", 
        icon: "fa-certificate", 
        link: `/dashboard/certificates?edit=${c.id}`, 
        type: "link"
      })),
      ...activities.map(a => ({
        id: `actlog-${a.id}`, 
        title: a.details, // Menampilkan log aktivitas ("Anda mengubah tema menjadi brutalism")
        group: "Hasil: Riwayat Aktivitas", 
        icon: "fa-history", 
        link: `/dashboard/analytics?tab=history`, 
        type: "link"
      }))
    ];

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}