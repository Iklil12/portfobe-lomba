import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';
import { checkRateLimit } from '@/lib/rate-limit';

// Inisialisasi Resend
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_buat_build_doang");

export async function PATCH(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Sandi baru minimal 6 karakter." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });
    }

    const isGoogleLogin = user.password === "GOOGLE_LOGIN_NO_PASSWORD";

    if (!isGoogleLogin) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Kata sandi saat ini diperlukan." }, { status: 400 });
      }
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Kata sandi saat ini salah." }, { status: 400 });
      }
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 1. Update sandi di database
    await prisma.user.update({
      where: { email: user.email },
      data: { password: hashedNewPassword }
    });

    // 2. Kirim Notifikasi Keamanan ke Email User
    // Kita jalankan tanpa 'await' agar respons ke frontend lebih cepat (background task)
    resend.emails.send({
      from: 'Portfo Security <portfosecure@mail.ritions.com>',
      to: user.email,
      subject: '🛡️ Pemberitahuan Keamanan: Kata Sandi Berhasil Diubah',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-bottom: 15px; font-weight: 900; font-size: 22px;">Kata Sandi Berhasil Diperbarui</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
            Halo! Pesan ini dikirim untuk mengonfirmasi bahwa kata sandi akun Portfo.be Anda baru saja berhasil diubah.
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; padding: 15px; border-radius: 12px; margin: 25px 0;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">
              <strong>Waktu Perubahan:</strong> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB<br>
              <strong>Status:</strong> Berhasil
            </p>
          </div>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">
            Jika ini adalah Anda, maka Anda tidak perlu melakukan tindakan apa pun. Namun, <strong>jika Anda tidak merasa melakukan perubahan ini</strong>, segera hubungi tim dukungan kami untuk mengamankan akun Anda.
          </p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
            Ini adalah email otomatis dari sistem keamanan Portfo.be. Mohon jangan membalas email ini demi kerahasiaan data Anda.
          </p>
        </div>
      `,
    }).catch(err => console.error("Gagal kirim notifikasi sandi:", err));

    return NextResponse.json({ message: "Kata sandi berhasil diperbarui." }, { status: 200 });

  } catch (error) {
    console.error("UPDATE_PASSWORD_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}