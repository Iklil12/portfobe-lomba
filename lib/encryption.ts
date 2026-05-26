import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Membuat kunci 32-byte (256-bit) yang valid dari NEXTAUTH_SECRET
const secret = process.env.NEXTAUTH_SECRET || "default_fallback_secret_must_be_changed";
const KEY = crypto.createHash('sha256').update(secret).digest();

export function encryptToken(text: string): string {
  if (!text) return "";
  
  // Initialization Vector untuk keunikan enkripsi
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Format penyimpanan: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptToken(encryptedText: string): string {
  try {
    if (!encryptedText) return "";
    
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      // Menangani kasus jika data di database masih berupa plaintext lama
      return encryptedText; 
    }
    
    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error("Gagal mendekripsi token:", error);
    return ""; // Kembalikan string kosong jika dekripsi gagal agar sistem tidak crash
  }
}
