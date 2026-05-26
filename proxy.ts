import middleware from "next-auth/middleware";

// Mengikuti standar Next.js 16: menggunakan proxy.ts sebagai pengganti middleware.ts
export default function proxy(req: any) {
  return middleware(req);
}

export const config = { 
  // Proteksi untuk folder dashboard
  matcher: ["/dashboard/:path*"],

};
