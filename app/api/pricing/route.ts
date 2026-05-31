import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Prevent Prisma Client instantiation issues in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    // @ts-ignore
    const plans = await prisma.pricingPlan.findMany({
      where: { isActive: true },
    });

    const formattedPricing: Record<string, any> = {};

    plans.forEach((plan: any) => {
      formattedPricing[plan.code] = {
        name: plan.name,
        monthly: {
          price: plan.monthlyPrice,
          original: plan.monthlyOriginal,
          total: plan.monthlyPrice
        },
        yearly: {
          price: plan.yearlyPrice,
          original: plan.yearlyOriginal,
          total: plan.yearlyPrice * 12,
          originalTotal: plan.yearlyOriginal * 12
        }
      };
    });

    return NextResponse.json(formattedPricing);
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 });
  }
}
