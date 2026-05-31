const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    data: { plan: 'PRO' }
  });
  console.log('Successfully updated all users to PRO');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
