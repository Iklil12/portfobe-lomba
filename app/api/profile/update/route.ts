import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 
import { logActivity } from "@/lib/activity"; 
import { checkRateLimit } from "@/lib/rate-limit";
import { isForbiddenUsername } from "@/lib/constants/reserved-usernames";

export async function PATCH(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, subdomain, profession, bio, avatar } = body; 
    
    // Ambil data User & Profile yang sekarang ada di database
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true, siteAppearance: true } // Pastikan untuk menarik data siteAppearance juga
    });

    if (!currentUser) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    // VALIDASI SUBDOMAIN: Cek kata cadangan dan apakah sudah dipakai user lain
    if (subdomain && subdomain !== currentUser.profile?.subdomain) {
      const forbiddenCheck = isForbiddenUsername(subdomain);
      if (forbiddenCheck.forbidden) {
        return NextResponse.json({ error: forbiddenCheck.reason }, { status: 400 });
      }

      const existingSubdomain = await prisma.profile.findUnique({
        where: { subdomain: subdomain }
      });
      
      // Jika subdomain ada di DB dan BUKAN milik user ini
      if (existingSubdomain && existingSubdomain.userId !== currentUser.id) {
        return NextResponse.json({ error: `Subdomain "${subdomain}" sudah dipakai orang lain.` }, { status: 400 });
      }
    }

    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || "User Baru";

    // EKSEKUSI UPDATE KE DATABASE
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        avatar: avatar, // Simpan url foto di tabel User
        profile: {
          upsert: {
            create: { 
              fullName, 
              subdomain, 
              profession, 
              bio,
              avatarUrl: avatar // Sinkronkan ke tabel Profile juga
            },
            update: { 
              fullName, 
              subdomain, 
              profession, 
              bio,
              avatarUrl: avatar // Sinkronkan ke tabel Profile juga
            }
          }
        }
      },
      include: { profile: true, siteAppearance: true } 
    });

    // LOGIKA HISTORY / ACTIVITY LOG (SANGAT DETAIL)
    const currentAvatar = currentUser.avatar;
    const currentSubdomain = currentUser.profile?.subdomain;

    // 1. Logika Foto Profil
    if (avatar !== currentAvatar) {
      if (!avatar || avatar === "") {
        await logActivity(currentUser.id, "DELETE_AVATAR", "Menghapus foto profil utama");
      } else {
        await logActivity(currentUser.id, "UPDATE_AVATAR", "Mengganti foto profil utama");
      }
    }

    // 2. Logika Subdomain
    if (subdomain !== currentSubdomain) {
      // Jika sebelumnya kosong lalu diisi, atau diganti dengan yang baru
      await logActivity(currentUser.id, "UPDATE_PROFILE", `Mengubah custom subdomain menjadi "${subdomain}"`);
    }

    // 3. Logika Teks Biasa (Jika foto & subdomain tidak berubah, tapi mereka menekan simpan)
    if (avatar === currentAvatar && subdomain === currentSubdomain) {
       await logActivity(currentUser.id, "UPDATE_PROFILE", "Memperbarui informasi bio dan profil");
    }

    return NextResponse.json({ 
      message: "Profil berhasil disimpan", 
      user: updatedUser 
    });

  } catch (error) {
    console.error("Error Simpan Profil:", error);
    return NextResponse.json({ error: "Gagal menyimpan profil" }, { status: 500 });
  }
}