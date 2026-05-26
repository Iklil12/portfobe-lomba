import prisma from "@/lib/prisma"; // Pastikan path ini sesuai dengan file prisma client-mu

export async function logActivity(userId: string, actionType: string, details: string) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        actionType,
        details,
      }
    });
  } catch (error) {
    console.error("Gagal mencatat aktivitas:", error);
  }
}