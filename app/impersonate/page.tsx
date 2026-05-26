"use client";

import { useEffect, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function ImpersonateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Mengautentikasi...");

  useEffect(() => {
    if (token) {
      signIn("credentials", {
        impersonateToken: token,
        redirect: false,
      }).then((result) => {
        if (result?.ok) {
          setStatus("Berhasil! Mengalihkan ke dashboard...");
          router.push("/dashboard");
        } else {
          setStatus("Akses Ditolak: Token tidak valid atau kedaluwarsa!");
          setTimeout(() => router.push("/login"), 3000);
        }
      });
    } else {
      setStatus("Token impersonasi tidak ditemukan di URL!");
      setTimeout(() => router.push("/login"), 3000);
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-sans">
      <div className="bg-zinc-900 p-8 rounded-2xl flex flex-col items-center gap-4 w-96 shadow-2xl border border-zinc-800">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-2"></div>
        <h1 className="text-xl font-bold text-center">Admin Override</h1>
        <p className="text-zinc-400 text-sm text-center font-medium">{status}</p>
      </div>
    </div>
  );
}

export default function ImpersonatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">Memuat...</div>}>
      <ImpersonateContent />
    </Suspense>
  );
}