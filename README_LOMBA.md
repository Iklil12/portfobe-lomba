# Portfo.be Lomba Edition

Versi ini adalah versi simplifikasi (MVP) dari Portfo.be yang dikhususkan untuk didemokan dalam event lomba Vibe Code Google.

## Perubahan Utama
- Semua fitur monetisasi (Billing, Pricing, dll) telah dihapus.
- Seluruh user otomatis berstatus PRO.
- Watermark "Built with Portfo.be" dihapus.
- Skema database di-simplifikasi.

## Setup Database Sementara
Untuk menjalankan aplikasi ini dengan database sementara (MySQL), ikuti langkah berikut:

1. Buka file `.env`.
2. Ubah/Pastikan nilai `DATABASE_URL` menjadi string koneksi MySQL sementara untuk lomba:
   ```env
   DATABASE_URL="mysql://u733030636_portfobe_lomba:Portfobe_lomba16@srv1786.hstgr.io:3306/u733030636_portfobe_lomba"
   ```
3. Sinkronisasikan skema Prisma ke database dengan menjalankan:
   ```bash
   npx prisma db push
   ```
4. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
5. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

## Catatan Tambahan
Fitur "Community" dan "AI Builder" sengaja dipertahankan di sidebar dengan badge "SEGERA" untuk menunjukkan visi roadmap Portfo.be di masa depan kepada juri.
