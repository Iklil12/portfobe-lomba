import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function VerifyPage(props: { searchParams: Promise<{ token?: string }> }) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <style dangerouslySetInnerHTML={{__html: `@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');`}} />
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md border border-slate-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-times text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Token Tidak Valid</h1>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">Tautan verifikasi tidak lengkap atau rusak. Pastikan Anda menyalin tautan secara penuh dari email.</p>
          <Link href="/dashboard" className="block w-full bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition">Ke Dashboard</Link>
        </div>
      </div>
    );
  }

  const verification = await prisma.verificationToken.findUnique({
    where: { token: token }
  });

  if (!verification || new Date() > verification.expires) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <style dangerouslySetInnerHTML={{__html: `@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');`}} />
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md border border-slate-100">
          <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-clock text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Tautan Kedaluwarsa</h1>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">Tautan verifikasi ini sudah tidak berlaku (lebih dari 24 jam). Silakan minta tautan baru dari dashboard Anda.</p>
          <Link href="/dashboard" className="block w-full bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition">Ke Dashboard</Link>
        </div>
      </div>
    );
  }

  // Update status verifikasi
  await prisma.user.update({
    where: { email: verification.identifier },
    data: {
      emailVerified: new Date(),
    }
  });

  await prisma.verificationToken.delete({
    where: { token: token }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');`}} />
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/40 text-center max-w-md border border-slate-100">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <i className="fas fa-check text-3xl"></i>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-3">Email Terverifikasi!</h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">Terima kasih. Akun Anda kini sepenuhnya terverifikasi dan Anda sudah bisa mempublikasikan portofolio Anda.</p>
        <Link href="/dashboard" className="block w-full bg-[#ff9e00] text-black px-6 py-4 rounded-2xl font-bold tracking-wide hover:-translate-y-1 hover:shadow-lg hover:shadow-[#ff9e00]/20 transition-all duration-300">Luncurkan Portofolio</Link>
      </div>
    </div>
  );
}
