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
      return NextResponse.json({ error: 'Upgrade ke PRO untuk mengunggah video.' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Video file is required' }, { status: 400 });
    }

    const validMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Format tidak didukung. Harap unggah video MP4, WEBM, atau MOV.' }, { status: 400 });
    }

    const maxVideoSize = user.plan === 'SUPREME' ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    
    if (file.size > maxVideoSize) {
      return NextResponse.json({ error: `Ukuran maksimal video adalah ${user.plan === 'SUPREME' ? '100MB' : '50MB'}` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 4. Validasi Magic Bytes (File Content Sniffing)
    const isMp4OrMov = buffer.length >= 8 && buffer.toString('ascii', 4, 8) === 'ftyp';
    const isWebm = buffer.length >= 4 && buffer.readUInt32BE(0) === 0x1A45DFA3;

    if (!isMp4OrMov && !isWebm) {
      return NextResponse.json({ error: 'Format file tidak valid. Harap unggah file video MP4, WEBM, atau MOV yang asli.' }, { status: 400 });
    }

    const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
    const apiKey = process.env.BUNNY_API_KEY;

    if (!libraryId || !apiKey) {
      console.error("Bunny Stream credentials missing");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 5. Create Video Object in Bunny Stream
    const createRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: "POST",
      headers: {
        "AccessKey": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ title: title || file.name })
    });

    if (!createRes.ok) {
      const errTxt = await createRes.text();
      console.error("Bunny API Create Error:", errTxt);
      return NextResponse.json({ error: "Gagal membuat objek video di Bunny" }, { status: 500 });
    }

    const { guid } = await createRes.json();

    if (!guid) {
      return NextResponse.json({ error: "Gagal mendapatkan referensi video" }, { status: 500 });
    }

    // 6. Upload Video Binary to Bunny Stream
    const uploadRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${guid}`, {
      method: 'PUT',
      headers: {
        'AccessKey': apiKey,
        'Content-Type': 'application/octet-stream'
      },
      body: buffer
    });

    if (!uploadRes.ok) {
      const errTxt = await uploadRes.text();
      console.error("Bunny API Upload Error:", errTxt);
      return NextResponse.json({ error: "Gagal mengunggah video ke CDN" }, { status: 500 });
    }

    // Return the guid to be saved as mediaUrl
    return NextResponse.json({ guid });

  } catch (error: any) {
    console.error('Upload Video Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
