import { NextRequest, NextResponse } from "next/server";
import authMiddleware from "next-auth/middleware";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

// In-memory rate limit store for persistent VPS/PM2 hosting
const rateLimitMap = new Map<string, RateLimitRecord>();

export default function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // 1. Jalankan Next-Auth middleware untuk dashboard
  if (pathname.startsWith("/dashboard")) {
    return (authMiddleware as any)(req);
  }

  // 2. Jalankan Rate Limiter untuk halaman publik (maks 30 request per menit per IP)
  // Kecuali untuk static assets, favicon, dan API
  if (
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".")
  ) {
    const ip = (req as any).ip || req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    if (ip !== "unknown") {
      const now = Date.now();
      const record = rateLimitMap.get(ip);

      // Reset record jika sudah melewati jendela waktu 1 menit
      if (record && record.resetAt < now) {
        rateLimitMap.delete(ip);
      }

      const currentRecord = rateLimitMap.get(ip);

      if (!currentRecord) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 1000 });
      } else {
        if (currentRecord.count >= 30) {
          const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terlalu Banyak Permintaan - portfobe</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #0a0a0a;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
        }
        .container {
            max-width: 500px;
            padding: 40px;
            background: #111;
            border-radius: 24px;
            border: 1px solid #222;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        h1 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 16px;
            color: #ff9e00;
        }
        p {
            font-size: 15px;
            color: #a3a3a3;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .loader {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 158, 0, 0.2);
            border-top-color: #ff9e00;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="loader"></div>
        <h1 style="margin-top:24px;">Terlalu Banyak Permintaan</h1>
        <p>Sistem mendeteksi aktivitas yang tidak wajar dari jaringan Anda. Silakan tunggu <strong>1 menit</strong> sebelum memuat ulang halaman.</p>
        <button onclick="window.location.reload()" style="background: #ff9e00; color: #000; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 14px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Muat Ulang Halaman</button>
    </div>
</body>
</html>
          `;
          return new NextResponse(htmlContent, {
            status: 429,
            headers: { "Content-Type": "text/html; charset=utf-8" }
          });
        }
        currentRecord.count += 1;
      }
    }
  }

  return NextResponse.next();
}

export const config = { 
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg, dll.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)",
  ],
};
