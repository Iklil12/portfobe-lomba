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
          return new NextResponse(
            JSON.stringify({ 
              error: "Terlahu banyak mengakses halaman. Silakan tunggu 1 menit untuk mencoba kembali." 
            }),
            { 
              status: 429, 
              headers: { "Content-Type": "application/json" } 
            }
          );
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
