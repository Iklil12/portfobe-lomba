// lib/rate-limit.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

// In-memory store (sangat cepat, 0 beban ke database)
const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Global Rate Limiter
 * @param limit Batas jumlah request (default 60)
 * @param windowMs Jendela waktu dalam milidetik (default 1 menit / 60000ms)
 * @returns NextResponse (jika diblokir) atau null (jika lolos)
 */
export async function checkRateLimit(
  limit: number = 60,
  windowMs: number = 60 * 1000 
) {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  
  let ip = "unknown";
  if (realIp) {
    ip = realIp;
  } else if (forwardedFor) {
    const ips = forwardedFor.split(",").map(i => i.trim());
    ip = ips[ips.length - 1];
  }

  // Jika tidak bisa dapat IP, anggap lolos (fallback aman agar user asli tidak kena blokir acak)
  if (ip === "unknown") return null;

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Jika record sudah expired, reset hitungan
  if (record && record.resetAt < now) {
    rateLimitMap.delete(ip);
  }

  const currentRecord = rateLimitMap.get(ip);

  if (!currentRecord) {
    // Request pertama di jendela waktu ini
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return null; // Lolos
  }

  // Jika sudah melebihi batas
  if (currentRecord.count >= limit) {
    return NextResponse.json(
      { error: "Sistem mendeteksi aktivitas tidak wajar (terlalu banyak permintaan). Silakan tunggu sebentar." }, 
      { status: 429 }
    );
  }

  // Tambah hitungan
  currentRecord.count += 1;
  return null; // Lolos
}

// Garbage collection ringan tiap 5 menit agar RAM server tidak penuh dengan IP usang
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (record.resetAt < now) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);
