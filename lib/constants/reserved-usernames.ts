export const SYSTEM_RESERVED = [
  // 1. Halaman Sistem & Dasbor
  "dashboard", "admin", "login", "register", "signup", "signin", "logout", "auth", 
  "settings", "account", "profile", "billing", "pricing", "plan", "upgrade",
  
  // 2. Fitur & Halaman Publik
  "document", "docs", "explore", "community", "templates", "themes", "showcase", 
  "features", "blog", "news", "update", "changelog",
  
  // 3. Legalitas & Dukungan
  "about", "contact", "support", "help", "faq", "terms", "privacy", "policy", "legal",
  
  // 4. Teknis & API
  "api", "graphql", "static", "_next", "assets", "images", "root", "superadmin",

  // 5. Kategori Transaksi & Monetisasi
  "checkout", "invoice", "payment", "cart", "store", "shop", "premium", 
  "enterprise", "downgrade", "plans","system",

  "www", "mail", "ftp", "localhost", "cdn", "media", "webhook", "oauth", "socket", "ws",
  "inbox", "messages", "notifications", "security", "trust", "abuse", "report", 
  "dmca", "privacy-policy", "terms-of-service","jobs", "careers", "teams", "partners", "affiliate", "forum", "cv", "resume", 
  "hire", "hire-me","portfo", "admin-portfo", "support-portfo", "portfobe-admin"
];

export const PROFANITY_LIST = [
  // Bahasa Indonesia & Daerah
  "anjing", "babi", "bangsat", "jancok", "tolol", "goblok", "kontol", "memek", 
  "ngentot", "peler", "kampret", "bajingan", "pantek", "kimak", "lonte", "sundel",
  "bego", "tai", "bgst", "anjg", "cok", "cokcok", "cokgiat", "taik", "ajg","entot","sange","crot",
  
  // Bahasa Inggris
  "bitch", "fuck", "shit", "asshole", "dick", "pussy", "cunt", "motherfucker", 
  "bastard", "slut", "whore", "nigger", "nigga", "faggot", "bullshit"
];

export const RESERVED_USERNAMES = [...SYSTEM_RESERVED, ...PROFANITY_LIST];

import { Filter } from 'bad-words';

const profanityFilter = new Filter();
profanityFilter.addWords(...PROFANITY_LIST);

export function isForbiddenUsername(username: string): { forbidden: boolean, reason?: string } {
  if (!username) return { forbidden: false };

  const lower = username.toLowerCase();
  const normalized = lower.replace(/(.)\1+/g, '$1'); 

  // 1. Cek Reserved System (Pengecekan Tepat / Exact Match)
  if (SYSTEM_RESERVED.includes(lower) || SYSTEM_RESERVED.includes(normalized)) {
    return { forbidden: true, reason: "Username ini tidak dapat digunakan karena merupakan kata cadangan sistem." };
  }

  // 2. Cek Profanity Manual (Lebih agresif)
  // Untuk kata >= 4 huruf, kita cek substring (contoh: "anjingbanget" akan diblokir karena mengandung "anjing")
  // Untuk kata < 4 huruf (seperti "tai", "cok"), kita pakai exact match agar tidak memblokir kata normal seperti "retail" atau "coklat"
  const hasProfanity = PROFANITY_LIST.some(word => {
    if (word.length >= 4) {
      return lower.includes(word) || normalized.includes(word);
    } else {
      return lower === word || normalized === word;
    }
  });

  if (hasProfanity) {
    return { forbidden: true, reason: "Username mengandung kata yang tidak pantas." };
  }

  // 3. Cek dengan library bad-words (Bagus untuk mengecek kata kasar di dalam kalimat/string dengan spasi/strip)
  // bad-words akan memecah string berdasarkan delimiter seperti '-' atau '_'
  if (profanityFilter.isProfane(lower) || profanityFilter.isProfane(normalized)) {
    return { forbidden: true, reason: "Username mengandung kata yang tidak pantas." };
  }

  // Lolos semua filter
  return { forbidden: false };
}
