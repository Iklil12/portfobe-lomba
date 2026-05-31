import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_buat_build_doang");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // 1. Cari user di database
    const user = await prisma.user.findUnique({ where: { email } });

    // Keamanan Tingkat Tinggi: Jangan pernah beritahu hacker apakah email terdaftar atau tidak.
    // Jika user tidak ada atau dia daftar pakai Google, kita tetap balas "Sukses" di frontend, 
    // tapi TIDAK MENGIRIM email apa-apa di backend.
    if (!user || user.password === "GOOGLE_LOGIN_NO_PASSWORD") {
      return NextResponse.json({ message: "Jika email terdaftar, link reset akan dikirim." });
    }

    // 2. Buat Token unik & set kadaluarsa (1 jam dari sekarang)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000);

    // 3. Hapus token lama (jika user minta berkali-kali) lalu simpan yang baru
    await prisma.passwordResetToken.deleteMany({ where: { email } });
    await prisma.passwordResetToken.create({
      data: { email, token, expires }
    });

    // 4. Buat URL Reset (Pastikan NEXTAUTH_URL sudah ada di .env Anda)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // 5. Kirim Email via Resend
    await resend.emails.send({
      from: 'Portfo Security <hellocreator@mail.ritions.com>',
      to: email,
      subject: '🔑 Reset Kata Sandi Portfobe Anda',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
          <h2>Permintaan Reset Password</h2>
          <p>Seseorang (semoga itu Anda) baru saja meminta reset kata sandi untuk akun Portfobe.</p>
          <p>Silakan klik tombol di bawah ini untuk membuat kata sandi baru:</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Kata Sandi</a>
          </div>
          <p style="font-size: 12px; color: #64748b;">
            Link ini akan kadaluarsa dalam 1 jam. Jika Anda tidak pernah meminta reset password, abaikan saja email ini.
          </p>
        </div>
      `
    });

    return NextResponse.json({ message: "Jika email terdaftar, link reset akan dikirim." });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return NextResponse.json({ error: "Gagal memproses permintaan" }, { status: 500 });
  }
}