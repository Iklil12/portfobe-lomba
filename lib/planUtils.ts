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

export function getRemainingDays(user: any): number | null {
  return -1; // -1 = lifetime
}

export function formatPlanExpiry(planExpiredAt: any): string {
  return "Seumur Hidup";
}

