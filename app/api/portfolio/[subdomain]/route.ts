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
    const isFree = userData.plan === 'FREE';
    const publicProjects     = isFree ? userData.projects.slice(0, 5)     : userData.projects;
    const publicLinks        = isFree ? userData.links.slice(0, 1)        : userData.links;
    const publicCertificates = isFree ? userData.certificates.slice(0, 2) : userData.certificates;
    const publicTestimonials = isFree ? userData.testimonials.slice(0, 2) : userData.testimonials;

    // 6. Susun Ulang Data & Tanda Tangani (Sign) URL Aset Bunny CDN untuk Keamanan
    const tokenKey = process.env.BUNNY_API_KEY || 'default_secret';
    const { signBunnyUrl } = require("@/lib/bunnySign");
    
    const signedProjects = publicProjects.map((proj: any) => {
      if (proj.projectType === '3d' || proj.projectType === 'video') {
        return {
          ...proj,
          mediaUrl: signBunnyUrl(proj.mediaUrl, tokenKey)
        };
      }
      return proj;
    });

    const responseData = {
      ...userData,
      projects:     signedProjects,
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