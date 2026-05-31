import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Resend } from 'resend';
import { checkRateLimit } from '@/lib/rate-limit';

// Mengambil API Key dari .env yang baru saja Anda buat
const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789_dummy_doang");

export async function PATCH(req: Request) {
  try {
    // Rate limit: maks 3 request per menit (mencegah flooding email verifikasi)
    const rateLimitResponse = await checkRateLimit(3, 60000);
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newEmail, password } = await req.json();

    if (!newEmail || !password) {
      return NextResponse.json({ error: "Email baru dan kata sandi diperlukan." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true } // Tambahkan ini untuk membaca tabel accounts
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });
    }
    if (user.accounts && user.accounts.length > 0) {
      return NextResponse.json({ error: "Akun ini terhubung dengan Google. Alamat email tidak dapat diubah." }, { status: 403 });
    }

    // Wajib verifikasi password sebelum mengizinkan ganti email
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Kata sandi saat ini salah." }, { status: 400 });
    }

    // Cek apakah email baru sudah dipakai akun lain
    const existingEmail = await prisma.user.findUnique({
      where: { email: newEmail }
    });

    if (existingEmail) {
      return NextResponse.json({ error: "Email tersebut sudah terdaftar di sistem." }, { status: 400 });
    }

    // Generate Token & Waktu Kadaluarsa (15 Menit)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    // Simpan ke Ruang Tunggu di Database
    await prisma.user.update({
      where: { email: user.email },
      data: {
        pendingEmail: newEmail,
      }
    });

    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email }
    });

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: token,
        expires: expires
      }
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const magicLink = `${baseUrl}/api/account/verify-email?token=${token}`;

    // Kirim Email via Resend pakai Subdomain Baru Anda!
    await resend.emails.send({
      from: 'Portfo Security <portfosecure@mail.ritions.com>',
      to: newEmail,
      subject: '🔐 Konfirmasi Perubahan Email - Portfo.be',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);">
          <h2 style="color: #0f172a; margin-bottom: 15px; font-weight: 900; font-size: 24px; letter-spacing: -0.5px;">Konfirmasi Email Baru</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
            Halo! Kami menerima permintaan untuk mengubah alamat email utama akun Portfo.be Anda menjadi email ini.
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">
            Jika ini memang Anda, silakan klik tombol di bawah ini untuk menyelesaikan proses:
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${magicLink}" style="background-color: #0f172a; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; display: inline-block; letter-spacing: 0.5px;">Verifikasi Email</a>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 25px;">
            ⚠️ <strong>Perhatian:</strong> Tautan ini hanya berlaku selama <strong>15 menit</strong>. Jika Anda tidak pernah meminta perubahan ini, abaikan email ini.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Magic link terkirim" }, { status: 200 });

  } catch (error) {
    console.error("EMAIL_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Gagal memproses permintaan." }, { status: 500 });
  }
}