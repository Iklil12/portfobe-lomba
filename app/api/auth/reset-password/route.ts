import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_buat_build_doang");

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password || password.length < 6) {
      return NextResponse.json({ error: "Data tidak valid atau sandi minimal 6 karakter." }, { status: 400 });
    }

    // 1. Cari token di database
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetRecord) {
      return NextResponse.json({ error: "Link reset tidak valid atau sudah digunakan." }, { status: 400 });
    }

    // 2. Cek masa kadaluarsa (1 jam)
    if (new Date() > resetRecord.expires) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return NextResponse.json({ error: "Link reset sudah kadaluarsa. Silakan minta ulang." }, { status: 400 });
    }

    // 3. Hash sandi baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Update sandi user di database
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword }
    });

    // 5. Hapus token agar tidak bisa dipakai dua kali (PENTING!)
    await prisma.passwordResetToken.delete({ where: { token } });

    // 6. Kirim notifikasi keamanan bahwa sandi berhasil diubah
    resend.emails.send({
      from: 'Portfo Security <portfosecure@mail.ritions.com>',
      to: resetRecord.email,
      subject: '🛡️ Kata Sandi Berhasil Direset',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; color: #334155;">
          <h2 style="color: #0f172a;">Sandi Berhasil Diperbarui</h2>
          <p>Halo,</p>
          <p>Ini adalah notifikasi otomatis bahwa kata sandi untuk akun Portfo.be Anda baru saja berhasil diubah melalui fitur "Lupa Password".</p>
          <p>Anda sekarang dapat login menggunakan kata sandi yang baru.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">Jika Anda tidak melakukan perubahan ini, segera hubungi tim kami.</p>
        </div>
      `
    }).catch(e => console.error("Gagal kirim notif reset:", e));

    return NextResponse.json({ message: "Kata sandi berhasil diubah." }, { status: 200 });

  } catch (error) {
    console.error("RESET_PW_ERROR:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}