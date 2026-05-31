import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding pricing plans...');
  
  const plans = [
    {
      code: "pro",
      name: "Pro Creator",
      monthlyPrice: 39000,
      monthlyOriginal: 49000,
      yearlyPrice: 30000,
      yearlyOriginal: 49000,
      isActive: true
    },
    {
      code: "supreme",
      name: "Supreme VIP",
      monthlyPrice: 79000,
      monthlyOriginal: 89000,
      yearlyPrice: 65000,
      yearlyOriginal: 89000,
      isActive: true
    }
  ];

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { code: plan.code },
      update: plan,
      create: plan,
    });
    console.log(`Upserted plan: ${plan.code}`);
  }

  console.log('Pricing seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
