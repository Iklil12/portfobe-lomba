import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  try {
    // 1. AWAIT PARAMS: Kunci untuk error Next.js terbaru
    const resolvedParams = await params;
    
    // 2. Bersihkan teks
    const userSubdomain = resolvedParams.subdomain.trim().toLowerCase();

    // 3. Cari di database (SEKARANG KITA JADIKAN 'USER' SEBAGAI AKARNYA)
    const userData = await prisma.user.findFirst({
      where: { 
        profile: {
          subdomain: userSubdomain // Cari user berdasarkan subdomain di dalam profilnya
        }
      },
      include: {
        profile: true,
        siteAppearance: true, // <--- INI DIA BINTANG UTAMANYA!
        links: { 
          where: { isActive: true }, 
          orderBy: { order: 'asc' } 
        },
        projects: { 
          where: { deletedAt: null },   // FIX K2: exclude item di trash
          orderBy: { createdAt: 'desc' } 
        },
        certificates: { 
          where: { deletedAt: null },   // FIX K2: exclude item di trash
          orderBy: { createdAt: 'desc' }
        },
        testimonials: {
          where: { isVisible: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    // 4. Jika tidak ketemu
    if (!userData || !userData.profile) {
      return NextResponse.json({ error: "Portfolio tidak ditemukan" }, { status: 404 });
    }

    // 5. SOFT LOCK: Batasi data berdasarkan plan untuk halaman publik
    // Data ke-6 dst tetap AMAN di database, hanya tidak ditampilkan ke publik
    const publicProjects     = userData.projects;
    const publicLinks        = userData.links;
    const publicCertificates = userData.certificates;
    const publicTestimonials = userData.testimonials;

    // 6. Susun Ulang Data
    const responseData = {
      ...userData,
      projects:     publicProjects,
      links:        publicLinks,
      certificates: publicCertificates,
      testimonials: publicTestimonials,
      name:      userData.profile.fullName || userSubdomain,
      subdomain: userData.profile.subdomain
    };

    // 7. Jika sukses, kirimkan data
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("🔥 CRITICAL API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}