import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding coupons...');
  
  // Create a 20% off promo code
  await prisma.coupon.upsert({
    where: { code: 'DISKON20' },
    update: {},
    create: {
      code: 'DISKON20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      isActive: true,
      // maxUses: 100 // Optional limit
    },
  });

  // Create a fixed Rp 50.000 off promo code
  await prisma.coupon.upsert({
    where: { code: 'POTONGAN50K' },
    update: {},
    create: {
      code: 'POTONGAN50K',
      discountType: 'FIXED',
      discountValue: 50000,
      isActive: true,
    },
  });

  console.log('Coupons seed completed! Try code: DISKON20 or POTONGAN50K');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
