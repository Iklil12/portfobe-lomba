import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://portfo.be';
  // ... (kode sitemap sebelumnya)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1, 
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    },
    // --- TAMBAHAN DARI STRUKTUR FOLDERMU ---
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const, // Pricing mungkin berubah harganya
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];
// ... (lanjutan kode database dynamicRoutes)
// 2. Daftarkan Halaman Dinamis (Profil Kreator dari Database)
  try {
    // Hanya ambil user yang sudah isLive dan punya subdomain
    const activeProfiles = await prisma.user.findMany({
      where: { 
        isLive: true,
      },
      select: {
        updatedAt: true,
        profile: {
          select: { subdomain: true }
        }
      }
    });

    const dynamicRoutes = activeProfiles
      .filter((user) => user.profile?.subdomain) // Pastikan subdomain tidak kosong
      .map((user) => ({
        // Asumsi format URL profil kreator adalah portfo.be/subdomain
        url: `${baseUrl}/${user.profile?.subdomain}`,
        lastModified: user.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9, // Beri prioritas tinggi untuk halaman kreator
      }));

    // Gabungkan rute statis dan rute dinamis
    return [...staticRoutes, ...dynamicRoutes];

  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    // Kalau database sedang error, minimal tetap kirim rute statis ke Google
    return staticRoutes; 
  }
}