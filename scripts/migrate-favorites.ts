// scripts/migrate-favorites.ts
// Jalankan sekali: npx ts-node --skip-project scripts/migrate-favorites.ts
// Memindahkan data favoriteThemes lama (JSON string di SiteAppearance) ke tabel ThemeFavorite baru

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai migrasi favoriteThemes → ThemeFavorite...");

  const appearances = await prisma.siteAppearance.findMany({
    select: { userId: true, favoriteThemes: true },
  });

  let totalMigrated = 0;
  let totalSkipped = 0;

  for (const row of appearances) {
    let themeIds: string[] = [];
    try {
      themeIds =
        typeof row.favoriteThemes === "string"
          ? JSON.parse(row.favoriteThemes || "[]")
          : row.favoriteThemes ?? [];
    } catch {
      console.warn(`  ⚠ Gagal parse favoriteThemes untuk user ${row.userId}`);
      continue;
    }

    if (!Array.isArray(themeIds) || themeIds.length === 0) {
      console.log(`  → User ${row.userId}: tidak ada favorit, dilewati.`);
      continue;
    }

    for (const themeId of themeIds) {
      if (typeof themeId !== "string") continue;
      try {
        await prisma.themeFavorite.upsert({
          where: { userId_themeId: { userId: row.userId, themeId } },
          update: {}, // sudah ada, tidak perlu update
          create: { userId: row.userId, themeId },
        });
        totalMigrated++;
        console.log(`  ✓ Migrated: user=${row.userId} tema=${themeId}`);
      } catch (e) {
        totalSkipped++;
        console.error(`  ✗ Gagal: user=${row.userId} tema=${themeId}`, e);
      }
    }
  }

  console.log(`\nSelesai! ${totalMigrated} favorit dimigrasikan, ${totalSkipped} dilewati.`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
