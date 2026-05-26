import { NextResponse } from "next/server";
import { sendSupportEmail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    // --- IP RATE LIMITING UNTUK MENCEGAH SPAM ---
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

    if (ip !== "unknown") {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const rateLimitRecord = await prisma.registerAttempt.findFirst({
        where: { ip },
        orderBy: { updatedAt: 'desc' }
      });

      if (rateLimitRecord && rateLimitRecord.count >= 5 && rateLimitRecord.updatedAt >= oneHourAgo) {
         return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi dalam 1 jam." }, { status: 429 });
      }

      if (rateLimitRecord) {
        const newCount = rateLimitRecord.updatedAt < oneHourAgo ? 1 : rateLimitRecord.count + 1;
        await prisma.registerAttempt.update({
          where: { id: rateLimitRecord.id },
          data: { count: newCount, updatedAt: new Date() }
        });
      } else {
        await prisma.registerAttempt.create({ data: { ip, count: 1 } });
      }
    }
    // --------------------------------------------

    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Mohon lengkapi semua field." }, { status: 400 });
    }

    const result = await sendSupportEmail(name, email, message);

    if (result.success) {
      return NextResponse.json({ message: "Pesan berhasil dikirim. Kami akan segera menghubungi Anda." });
    } else {
      return NextResponse.json({ error: "Gagal mengirim pesan. Silakan coba lagi nanti." }, { status: 500 });
    }
  } catch (error) {
    console.error("Support API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
