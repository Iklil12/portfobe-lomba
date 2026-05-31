import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { isLive: true }
  });

  return NextResponse.json({ isLive: user?.isLive ?? true });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { isLive } = await req.json();

  if (isLive === true) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { emailVerified: true }
    });

    if (!user || user.emailVerified === null) {
      return NextResponse.json({ 
        error: "FORBIDDEN", 
        message: "Verifikasi email Anda terlebih dahulu untuk mengaktifkan portofolio." 
      }, { status: 403 });
    }
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { isLive },
  });

  return NextResponse.json({ success: true, isLive });
}