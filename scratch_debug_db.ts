
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("--- DEBUG INTEGRATIONS DATA ---");
  
  // 1. Cek User & Profile
  const users = await prisma.user.findMany({
    take: 5,
    select: { 
      id: true, 
      email: true,
      profile: {
        select: { subdomain: true }
      }
    }
  });
  console.log("Users Samples:", JSON.stringify(users, null, 2));

  // 2. Cek Penpot Integrations
  const penpot = await prisma.integration.findMany({
    where: { provider: "PENPOT" },
    select: { userId: true, settings: true }
  });
  console.log("Penpot Data Count:", penpot.length);
  console.log("Penpot Details:", JSON.stringify(penpot, null, 2));

  // 3. Cek Canva Projects
  const canva = await prisma.canvaProject.findMany({
    select: { userId: true, title: true }
  });
  console.log("Canva Data Count:", canva.length);
  console.log("Canva Details:", JSON.stringify(canva, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
