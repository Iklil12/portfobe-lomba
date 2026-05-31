import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(req: Request) {
  try {
    const { code, plan, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Kode kupon diperlukan' }, { status: 400 });
    }

    // @ts-ignore
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Kode kupon tidak ditemukan' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'Kupon ini sedang dinonaktifkan' }, { status: 400 });
    }

    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      return NextResponse.json({ error: 'Kupon ini belum bisa digunakan' }, { status: 400 });
    }

    if (coupon.validUntil && now > coupon.validUntil) {
      return NextResponse.json({ error: 'Kupon ini sudah kedaluwarsa' }, { status: 400 });
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json({ error: 'Batas penggunaan kupon sudah habis' }, { status: 400 });
    }

    // CHECK MINIMUM PURCHASE
    if (coupon.minPurchase !== null && coupon.minPurchase !== undefined) {
      if (subtotal !== undefined && subtotal < coupon.minPurchase) {
        return NextResponse.json({
          error: `Minimal pembelian untuk menggunakan kupon ini adalah Rp ${coupon.minPurchase.toLocaleString('id-ID')}`
        }, { status: 400 });
      }
    }

    // CHECK ALLOWED PLAN
    if (coupon.allowedPlan && coupon.allowedPlan !== "ALL") {
      if (plan && plan !== coupon.allowedPlan) {
        return NextResponse.json({
          error: `Kupon ini hanya berlaku untuk pembelian paket ${coupon.allowedPlan.toUpperCase()}`
        }, { status: 400 });
      }
    }

    // CHECK USER SPECIFIC LIMIT
    if (coupon.maxUsesPerUser) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Harap masuk terlebih dahulu untuk menggunakan kupon ini' }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (!user) {
        return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
      }

      // @ts-ignore
      const userUsageCount = await prisma.couponUsage.count({
        where: {
          couponId: coupon.id,
          userId: user.id
        }
      });

      if (userUsageCount >= coupon.maxUsesPerUser) {
        return NextResponse.json({
          error: `Anda sudah menggunakan kupon ini sebanyak batas maksimal (${coupon.maxUsesPerUser} kali)`
        }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchase: coupon.minPurchase,
        allowedPlan: coupon.allowedPlan
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'Gagal memvalidasi kupon' }, { status: 500 });
  }
}

