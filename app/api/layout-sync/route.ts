// File: app/api/layout-sync/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// --- BRUTE-FORCE ANTI-CACHE: Dijamin 100% Real-Time ---
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(req: Request) { 
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(null, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true , siteAppearance: true}
      
    });

    if (!user) return NextResponse.json(null, { status: 404 });

    // Format khusus yang HANYA dibutuhkan oleh Layout
    return NextResponse.json({
      isLive: user.isLive,
      subdomain: user.profile?.subdomain || null,
      profession: user.profile?.profession || null,
      bio: user.profile?.bio || null,
      avatar: user.profile?.avatarUrl || user.avatar || null,
      plan: user.plan || "FREE",
      fullName: user.profile?.fullName,
      email: user.email,
    });
  } catch (error) {
    return NextResponse.json(null, { status: 500 });
  }
}