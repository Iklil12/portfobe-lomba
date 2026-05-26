import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
    }

    // Perintah sakti untuk menghapus User dari Database MySQL Hostinger
    // Catatan: Pastikan di schema.prisma Anda, relasi tabel Profile memiliki opsi onDelete: Cascade
    // agar data profil ikut terhapus otomatis saat user dihapus.
    await prisma.user.delete({
      where: { email: session.user.email }
    });

    return NextResponse.json({ message: "Akun berhasil dihapus selamanya" });
  } catch (error) {
    console.error("Error Hapus Akun:", error);
    return NextResponse.json({ error: "Gagal menghapus akun. Cek relasi database." }, { status: 500 });
  }
}