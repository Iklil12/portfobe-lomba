import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const { orderedIds } = await req.json();

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "Format data tidak valid" }, { status: 400 });
    }

    // Update order in a transaction
    const updatePromises = orderedIds.map((id: string, index: number) => {
      return prisma.testimonial.update({
        where: { id, userId: user.id },
        data: { order: index }
      });
    });

    await prisma.$transaction(updatePromises);
    await logActivity(user.id, "REORDER_TESTIMONIALS", "Mengubah urutan testimoni");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering testimonials:", error);
    return NextResponse.json({ error: "Gagal menyusun ulang testimoni" }, { status: 500 });
  }
}
