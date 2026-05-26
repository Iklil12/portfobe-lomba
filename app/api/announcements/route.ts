import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";



export async function GET() {
  try {
    // Gunakan raw query agar tidak bergantung pada Prisma generate
    const announcements: any[] = await prisma.$queryRaw`
      SELECT id, title, message, type, channel, targetPlan, isActive, createdAt 
      FROM Announcement 
      WHERE isActive = true 
      ORDER BY createdAt DESC
    `;
    
    // Convert MySQL tinyint(1) ke boolean
    const formatted = announcements.map((a: any) => ({
      ...a,
      isActive: Boolean(a.isActive),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Announcements API error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
