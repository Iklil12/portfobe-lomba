"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Resend } from "resend"; // <-- 1. IMPORT RESEND DI SINI
import { headers } from "next/headers";
import crypto from "crypto";

// <-- 2. INISIALISASI RESEND (Di luar function agar hemat memori server)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerUser(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // --- 0. RATE LIMITING (IP-BASED) ---
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    
    // Mencegah IP Spoofing dengan memprioritaskan x-real-ip (diset oleh server) 
    // atau mengambil elemen terakhir dari x-forwarded-for (IP dari proxy terluar yang terpercaya)
    let ip = "unknown";
    if (realIp) {
      ip = realIp;
    } else if (forwardedFor) {
      const ips = forwardedFor.split(",").map(i => i.trim());
      ip = ips[ips.length - 1];
    }

    // Cek berapa banyak akun yang dibuat IP ini dalam 1 jam terakhir
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRegistrations = await prisma.registerAttempt.findFirst({
      where: { ip },
      orderBy: { updatedAt: 'desc' }
    });

    if (recentRegistrations && recentRegistrations.count >= 3 && recentRegistrations.updatedAt >= oneHourAgo) {
      return { error: "Terlalu banyak pembuatan akun dari jaringan Anda. Silakan coba lagi dalam 1 jam." };
    }
    // ----------------------------------

    // --- 0.5 VERIFIKASI CAPTCHA KE GOOGLE ---
    const captchaToken = formData.get("captchaToken") as string;

    // Hanya lakukan validasi jika admin sudah menyetel Secret Key
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!captchaToken) {
        return { error: "Harap selesaikan verifikasi reCAPTCHA terlebih dahulu." };
      }

      const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        console.error("CAPTCHA Validation Failed:", verifyData);
        return { error: "Validasi CAPTCHA gagal. Sistem mendeteksi aktivitas mencurigakan." };
      }
    }
    // -----------------------------------------

    // 1. Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar." };
    }

    // 2. Enkripsi Password agar aman di Hostinger
    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || "User")}&background=random`;

    // --- 2.5 GENERATE VERIFICATION TOKEN ---
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam

    // 3. Simpan data ke MySQL Hostinger dengan Skema Baru (Terpisah)
    const newUser = await prisma.user.create({
      data: {
        // Data khusus tabel User
        email: email,
        password: hashedPassword,
        plan: "FREE",
        avatar: defaultAvatar,

        // Data khusus tabel Profile (Prisma akan otomatis membuatkannya)
        profile: {
          create: {
            fullName: fullName,
          }
        },
        siteAppearance: {
          create: {}
        }
      }
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: tokenExpires
      }
    });

    console.log("✅ User berhasil dibuat:", newUser.email);

    // ==============================================================
    // 4. KIRIM WELCOME EMAIL SETELAH USER SUKSES DIBUAT
    // ==============================================================
    resend.emails.send({
      from: 'Portfobe <hellocreator@mail.ritions.com>',
      to: email,
      replyTo: 'ikliluluyun@ritions.com', // User bisa balas langsung ke Anda
      subject: 'Welcome to Portfobe!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
          <p style="font-size: 16px;">Hey,</p>
          <p style="font-size: 16px;">My name is <strong>IKLIL</strong> — I'm the founder and CEO of <strong>portfobe</strong>.</p>
          <p style="font-size: 16px;">Saya ingin mengucapkan terima kasih secara personal karena kamu telah memilih portfobe sebagai tempat untuk memamerkan karya terbaikmu. Kami membangun platform ini dengan satu misi: membantu kreator seperti kamu memiliki 'rumah digital' yang profesional, elegan, dan selesai dalam hitungan menit.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff9e00;">
            <p style="font-size: 16px; margin-top: 0; font-weight: bold;">Tinggal 1 Langkah Lagi!</p>
            <p style="font-size: 14px; margin-bottom: 20px;">Sebelum Anda bisa meluncurkan portofolio ke publik (Live), harap verifikasi alamat email Anda terlebih dahulu.</p>
            <a href="${process.env.NEXTAUTH_URL}/verify?token=${verificationToken}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">Verifikasi Email Saya</a>
          </div>

          <p style="font-size: 16px;">Saya sangat tidak sabar melihat portofolio yang akan kamu bangun. Jika kamu punya masukan, ide fitur, atau sekadar ingin menyapa, jangan ragu untuk membalas email ini.</p>
          <p style="font-size: 16px;">Selamat berkarya!</p>
          <br />
          <p style="font-size: 16px; margin-bottom: 5px;">Best,</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 2px;">IKLIL</p>
          <p style="font-size: 14px; color: #64748b; margin-top: 0;">Founder, portfobe</p>
        </div>
      `,
    }).catch((err) => console.error("🚨 Gagal mengirim Welcome Email:", err));
    // ==============================================================

    // --- 5. CATAT KEBERHASILAN PENDAFTARAN KE RATE LIMITER ---
    if (recentRegistrations) {
      const newCount = recentRegistrations.updatedAt < oneHourAgo ? 1 : recentRegistrations.count + 1;
      await prisma.registerAttempt.update({
        where: { id: recentRegistrations.id },
        data: { count: newCount, updatedAt: new Date() }
      });
    } else {
      await prisma.registerAttempt.create({
        data: {
          ip,
          count: 1
        }
      });
    }

    return { success: true };

  } catch (e) {
    // Jika ada error (koneksi database, dll), akan muncul di terminal
    console.error("🚨 DATABASE ERROR:", e);
    return { error: "Terjadi kesalahan pada koneksi database." };
  }
}

// ============================================================================
// FUNGSI UNTUK MENGIRIM ULANG EMAIL VERIFIKASI
// ============================================================================
export async function resendVerificationEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) return { error: "Pengguna tidak ditemukan." };
    if (user.emailVerified !== null) return { error: "Email sudah terverifikasi." };

    // --- RATE LIMITING (5 MENIT) ---
    const existingToken = await prisma.verificationToken.findFirst({
      where: { identifier: email },
      orderBy: { expires: 'desc' }
    });

    if (existingToken) {
      const timeRemainingMs = existingToken.expires.getTime() - Date.now();
      const twentyFourHoursMs = 24 * 60 * 60 * 1000;
      const fiveMinutesMs = 5 * 60 * 1000;

      if (timeRemainingMs > (twentyFourHoursMs - fiveMinutesMs)) {
        return { error: "Tunggu sekitar 5 menit sebelum Anda dapat mengirim ulang email verifikasi." };
      }
    }
    // -------------------------------

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: tokenExpires
      }
    });

    const fullName = user.profile?.fullName || "Kreator";

    await resend.emails.send({
      from: 'Portfobe <hellocreator@mail.ritions.com>',
      to: email,
      replyTo: 'ikliluluyun@ritions.com',
      subject: 'Verifikasi Ulang Akun Portfobe Anda',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
          <p style="font-size: 16px;">Halo ${fullName},</p>
          <p style="font-size: 16px;">Kami menerima permintaan untuk mengirimkan ulang tautan verifikasi email Anda.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff9e00;">
            <p style="font-size: 16px; margin-top: 0; font-weight: bold;">Verifikasi Akun Anda</p>
            <p style="font-size: 14px; margin-bottom: 20px;">Klik tombol di bawah ini untuk memverifikasi alamat email Anda dan membuka fitur portofolio Live.</p>
            <a href="${process.env.NEXTAUTH_URL}/verify?token=${verificationToken}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">Verifikasi Email Saya</a>
          </div>

          <p style="font-size: 14px; color: #64748b;">Tautan ini akan kedaluwarsa dalam 24 jam. Jika Anda tidak meminta email ini, abaikan saja.</p>
          <br />
          <p style="font-size: 16px; margin-bottom: 5px;">Best,</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 2px;">IKLIL</p>
          <p style="font-size: 14px; color: #64748b; margin-top: 0;">Founder, portfobe</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Gagal mengirim ulang email:", error);
    return { error: "Terjadi kesalahan sistem saat mengirim email." };
  }
}