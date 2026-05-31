import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (Anti-Spam Bot): Batasi maksimal 10 request upload per menit per IP
    const rateLimitRes = await checkRateLimit(10, 60 * 1000);
    if (rateLimitRes) {
      return rateLimitRes;
    }

    // 2. Autentikasi
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // 3. Otorisasi Plan/Tier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true }
    });

    if (!user || user.plan === 'FREE') {
      return NextResponse.json({ error: 'Upgrade ke PRO untuk mengunggah model 3D.' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;

    if (!file || !title) {
      return NextResponse.json({ error: 'File dan judul wajib diisi' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
       return NextResponse.json({ error: 'Hanya format .glb / .gltf yang diizinkan' }, { status: 400 });
    }

    const max3DSize = user.plan === 'SUPREME' ? 100 * 1024 * 1024 : 50 * 1024 * 1024;

    if (file.size > max3DSize) {
      return NextResponse.json({ error: `Ukuran maksimal file 3D adalah ${user.plan === 'SUPREME' ? '100MB' : '50MB'}` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 4. Validasi Magic Bytes (File Content Sniffing)
    const isGlb = buffer.length >= 4 && buffer.toString('ascii', 0, 4) === 'glTF';
    let isGltf = false;
    if (!isGlb) {
      try {
        const text = buffer.toString('utf-8', 0, 100).trim();
        if (text.startsWith('{')) {
          isGltf = true;
        }
      } catch (e) {}
    }

    if (!isGlb && !isGltf) {
      return NextResponse.json({ error: 'Format file tidak valid. Harap unggah file model 3D GLB atau GLTF yang asli.' }, { status: 400 });
    }
    const safeTitle = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `${Date.now()}-${safeTitle}.glb`;
    const storagePath = `${userId}/${filename}`;
    
    // Upload to Bunny Storage (Singapore region typical URL sg.storage.bunnycdn.com)
    const storageName = process.env.BUNNY_STORAGE_NAME;
    const accessKey = process.env.BUNNY_PASSWORD;
    
    if (!storageName || !accessKey) {
      return NextResponse.json({ error: 'Konfigurasi storage belum diset' }, { status: 500 });
    }

    const bunnyUrl = `https://storage.bunnycdn.com/${storageName}/${storagePath}`;
    
    const bunnyRes = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': accessKey,
        'Content-Type': 'application/octet-stream'
      },
      body: buffer
    });

    if (!bunnyRes.ok) {
      const errTxt = await bunnyRes.text();
      console.error("Bunny storage error:", errTxt);
      return NextResponse.json({ error: 'Gagal mengunggah ke CDN' }, { status: 500 });
    }

    const mediaUrl = `https://${storageName}.b-cdn.net/${storagePath}`;

    // Save to DB
    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        mediaUrl,
        projectType: '3d',
        userId,
        detail3D: {
          create: {
            fileSize: file.size,
            storagePath
          }
        }
      }
    });

    return NextResponse.json(project);

  } catch (error: any) {
    console.error('Upload 3D Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
