import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// API untuk mengelola link Penpot secara manual (tanpa token)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    let userId = searchParams.get("userId");

    // Jika tidak ada userId di query (dashboard), gunakan ID dari session
    if (!userId && session?.user?.id) {
      userId = session.user.id;
    }

    if (!userId) return NextResponse.json({ projects: [] });

    const integration = await prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: "PENPOT",
        },
      },
    });

    const settings = integration?.settings ? JSON.parse(integration.settings) : {};
    return NextResponse.json({ projects: settings.manualProjects || [] });
  } catch (error) {
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projects } = await req.json();

    // --- VALIDASI KEAMANAN ---
    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: "Format data tidak valid" }, { status: 400 });
    }

    // 1. Batasi maksimal 10 proyek per user
    if (projects.length > 10) {
      return NextResponse.json({ error: "Maksimal 10 proyek diperbolehkan" }, { status: 400 });
    }

    // 2. Validasi setiap item
    for (const project of projects) {
      const { title, url } = project;

      // Cek panjang judul (max 100)
      if (title && title.length > 100) {
        return NextResponse.json({ error: "Judul terlalu panjang (maks 100 karakter)" }, { status: 400 });
      }

      // Cek panjang URL (max 500) & format
      if (url) {
        if (url.length > 500) {
          return NextResponse.json({ error: "URL terlalu panjang (maks 500 karakter)" }, { status: 400 });
        }
        if (!url.startsWith('https://')) {
          return NextResponse.json({ error: "URL harus diawali dengan https://" }, { status: 400 });
        }
      }
    }

    // Simpan ke model Integration dengan provider "PENPOT"
    await prisma.integration.upsert({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: "PENPOT",
        },
      },
      update: {
        providerId: "penpot",
        settings: JSON.stringify({ manualProjects: projects }),
      },
      create: {
        userId: session.user.id,
        provider: "PENPOT",
        providerId: "penpot",
        settings: JSON.stringify({ manualProjects: projects }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save Manual Penpot Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}
