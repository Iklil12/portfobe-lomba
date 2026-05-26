import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

// UPDATE TESTIMONIAL
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await req.json();
    
    // Verify ownership
    const existingTestimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!existingTestimonial || existingTestimonial.userId !== user.id) {
      return NextResponse.json({ error: "Testimonial tidak ditemukan atau akses ditolak" }, { status: 404 });
    }

    const { clientName, company, content, rating, avatarUrl, isVisible, order } = body;

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        clientName: clientName !== undefined ? clientName : existingTestimonial.clientName,
        company: company !== undefined ? company : existingTestimonial.company,
        content: content !== undefined ? content : existingTestimonial.content,
        rating: rating !== undefined ? parseInt(rating) : existingTestimonial.rating,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : existingTestimonial.avatarUrl,
        isVisible: isVisible !== undefined ? isVisible : existingTestimonial.isVisible,
        order: order !== undefined ? parseInt(order) : existingTestimonial.order,
      }
    });

    await logActivity(user.id, "UPDATE_TESTIMONIAL", `Memperbarui testimoni dari ${updatedTestimonial.clientName}`);

    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json({ error: "Gagal memperbarui testimoni" }, { status: 500 });
  }
}

// DELETE TESTIMONIAL
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Verify ownership
    const existingTestimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!existingTestimonial || existingTestimonial.userId !== user.id) {
      return NextResponse.json({ error: "Testimonial tidak ditemukan atau akses ditolak" }, { status: 404 });
    }

    await prisma.testimonial.delete({ where: { id } });
    await logActivity(user.id, "DELETE_TESTIMONIAL", `Menghapus testimoni dari ${existingTestimonial.clientName}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "Gagal menghapus testimoni" }, { status: 500 });
  }
}
