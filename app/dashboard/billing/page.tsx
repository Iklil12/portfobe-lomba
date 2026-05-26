"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect /dashboard/billing → /dashboard/settings?tab=billing
export default function BillingRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/settings?tab=billing");
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
  );
}
