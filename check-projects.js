const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.project.findMany({ select: { title: true, mediaUrl: true } });
  console.log(JSON.stringify(p, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
