import crypto from 'crypto';

/**
 * Menghasilkan URL bertanda tangan (Signed URL) untuk mengamankan aset Bunny CDN / Bunny Stream
 * @param url URL atau GUID Bunny Stream
 * @param tokenKey Kunci rahasia token (diambil dari environment variable)
 * @param expiresMinutes Durasi kedaluwarsa URL dalam menit (default 10 menit)
 */
export function signBunnyUrl(url: string, tokenKey: string, expiresMinutes: number = 10): string {
  if (!url) return url;
  
  const expires = Math.floor(Date.now() / 1000) + (expiresMinutes * 60);

  // Jika input adalah GUID Bunny Stream (36 karakter dengan strip)
  const isGuid = url.length === 36 && url.includes('-');
  if (isGuid) {
    const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '';
    // Konstruksi URL iframe asli
    const iframeUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${url}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;
    
    // Hash untuk Bunny Stream: sha256(tokenKey + videoId + expires)
    const hash = crypto
      .createHash('sha256')
      .update(`${tokenKey}${url}${expires}`)
      .digest('hex');

    return `${iframeUrl}&token=${hash}&expires=${expires}`;
  }

  try {
    const parsedUrl = new URL(url);

    // 1. Jika URL adalah iframe Bunny Stream yang sudah dikonstruksi
    if (parsedUrl.hostname.includes('mediadelivery.net')) {
      const paths = parsedUrl.pathname.split('/').filter(Boolean);
      // Path format: /embed/{libraryId}/{videoId}
      const videoId = paths[2];
      if (videoId) {
        const hash = crypto
          .createHash('sha256')
          .update(`${tokenKey}${videoId}${expires}`)
          .digest('hex');

        parsedUrl.searchParams.set('token', hash);
        parsedUrl.searchParams.set('expires', expires.toString());
        return parsedUrl.toString();
      }
    }

    // 2. Jika URL adalah Pull Zone Bunny CDN (misalnya b-cdn.net)
    if (parsedUrl.hostname.endsWith('b-cdn.net') || parsedUrl.hostname.endsWith('bunnycdn.com')) {
      const path = parsedUrl.pathname;
      
      // Standard Bunny CDN Token Auth: sha256(tokenKey + path + expires)
      // Lalu di-encode ke base64 url-safe
      const hash = crypto
        .createHash('sha256')
        .update(`${tokenKey}${path}${expires}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      parsedUrl.searchParams.set('token', hash);
      parsedUrl.searchParams.set('expires', expires.toString());
      return parsedUrl.toString();
    }

    return url;
  } catch (e) {
    return url;
  }
}
