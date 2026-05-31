import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // @ts-ignore
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id, // hanya milik user sendiri
      },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: { fullName: true, location: true },
            },
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    // Generate nomor receipt: PORTFO-YYYY-XXXXXXXX
    const year = new Date(transaction.createdAt).getFullYear();
    const shortId = transaction.id.replace(/-/g, "").substring(0, 8).toUpperCase();
    const receiptNumber = `PORTFO-${year}-${shortId}`;

    return NextResponse.json({
      receiptNumber,
      id: transaction.id,
      plan: transaction.plan,
      status: transaction.status,
      amount: transaction.amount,
      durationDays: transaction.durationDays,
      gateway: transaction.gateway,
      createdAt: transaction.createdAt,
      user: {
        email: transaction.user.email,
        fullName: transaction.user.profile?.fullName || transaction.user.email,
        location: transaction.user.profile?.location || "Indonesia",
      },
    });
  } catch (error) {
    console.error("GET /api/receipts/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
