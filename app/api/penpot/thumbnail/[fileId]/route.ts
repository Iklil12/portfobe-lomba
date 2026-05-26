import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decryptToken } from "@/lib/encryption";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    if (!fileId) return new Response("Missing fileId", { status: 400 });

    // Cari integrasi penpot (kita ambil milik siapa pun file ini, tapi karena ini proxy umum, 
    // kita cari integrasi pertama yang valid atau berdasarkan userId jika ada di query)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return new Response("Missing userId", { status: 400 });

    const integration = await prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: "PENPOT",
        },
      },
    });

    if (!integration || !integration.accessToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = decryptToken(integration.accessToken);
    if (!token) return new Response("Token error", { status: 500 });

    // Fetch thumbnail dari Penpot
    const res = await fetch(`https://design.penpot.app/api/files/id/${fileId}/thumbnail`, {
      headers: {
        'Authorization': `Token ${token}`,
        'User-Agent': 'Portfobe-App/1.0'
      }
    });

    if (!res.ok) return new Response("Failed to fetch thumbnail", { status: res.status });

    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // Cache selama 1 jam
      },
    });

  } catch (error) {
    console.error("Thumbnail Proxy Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
