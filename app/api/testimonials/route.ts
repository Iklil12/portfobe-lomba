import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

// GET ALL TESTIMONIALS FOR USER
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const testimonials = await prisma.testimonial.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json(testimonials);
}

// CREATE NEW TESTIMONIAL
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const body = await req.json();
    const { clientName, company, content, rating, avatarUrl } = body;

    if (!clientName || !content) {
      return NextResponse.json({ error: "Nama dan isi testimoni wajib diisi" }, { status: 400 });
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        userId: user.id,
        clientName,
        company: company || null,
        content,
        rating: rating ? parseInt(rating) : 5,
        avatarUrl: avatarUrl || null,
        isVisible: true,
        order: 0
      }
    });

    await logActivity(user.id, "ADD_TESTIMONIAL", `Menambahkan testimoni dari ${clientName}`);

    return NextResponse.json(newTestimonial);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Gagal membuat testimoni" }, { status: 500 });
  }
}
