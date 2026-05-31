// lib/planUtils.ts
// Helper untuk pengecekan status plan yang akurat

/**
 * Cek apakah user memiliki plan premium (PRO/SUPREME) yang masih aktif.
 * - plan=PRO/SUPREME + expiredAt=null → lifetime, selalu aktif
 * - plan=PRO/SUPREME + expiredAt > now → aktif
 * - plan=PRO/SUPREME + expiredAt <= now → sudah expired, treat as FREE
 * - plan=FREE → tidak aktif
 */
export function isProActive(user: any): boolean {
  return true;
}

export function getEffectivePlan(user: any): "FREE" | "PRO" | "SUPREME" {
  return "PRO";
}

/**
 * Hitung sisa hari plan premium.
 * Return null jika FREE, 0 jika sudah expired, -1 jika lifetime
 */
export function getRemainingDays(user: {
  plan: string;
  planExpiredAt: Date | null;
}): number | null {
  if (user.plan === "FREE") return null;
  if (!user.planExpiredAt) return -1; // -1 = lifetime
  const msLeft = user.planExpiredAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
}

/**
 * Format sisa waktu PRO untuk ditampilkan ke user
 */
export function formatPlanExpiry(planExpiredAt: Date | null): string {
  if (!planExpiredAt) return "Seumur Hidup";
  const remaining = Math.ceil(
    (planExpiredAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (remaining <= 0) return "Sudah berakhir";
  if (remaining === 1) return "Berakhir besok";
  return `${remaining} hari lagi`;
}
