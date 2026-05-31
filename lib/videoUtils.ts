export const getVideoThumbnail = (urlOrId: string) => {
  if (!urlOrId) return '';
  
  // Deteksi YouTube
  const ytMatch = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  if (ytMatch) {
    return `https://res.cloudinary.com/deobqjna7/image/youtube/${ytMatch[1]}.jpg`;
  }
  
  // Deteksi Vimeo (Thumbnail dari Vimeo API biasanya butuh async fetch, jadi kita pakai placeholder atau fetch dari oembed)
  // Untuk kesederhanaan, jika Vimeo kita kembalikan URL default atau biarkan player yang load
  const vimeoMatch = urlOrId.match(/(?:vimeo\.com\/)(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
  if (vimeoMatch) {
    // Return placeholder
    return `https://vumbnail.com/${vimeoMatch[1]}.jpg`; 
  }

  // Deteksi Bunny Stream (bisa berupa GUID murni 36 karakter, atau URL bertanda tangan lengkap)
  let bunnyGuid = '';
  if (urlOrId.length === 36 && urlOrId.includes('-')) {
    bunnyGuid = urlOrId;
  } else if (urlOrId.includes('mediadelivery.net') || urlOrId.includes('bunnycdn')) {
    try {
      const urlObj = new URL(urlOrId);
      const paths = urlObj.pathname.split('/').filter(Boolean);
      // Path format: /embed/{libraryId}/{videoId}
      if (paths[0] === 'embed' && paths[2]) {
        bunnyGuid = paths[2];
      }
    } catch (e) {
      // Fallback regex untuk mencari UUID di dalam URL
      const uuidMatch = urlOrId.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
      if (uuidMatch) {
        bunnyGuid = uuidMatch[0];
      }
    }
  }

  if (bunnyGuid) {
    const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;
    if (pullZone) {
      return `https://${pullZone}/${bunnyGuid}/thumbnail.jpg`;
    }
    // Fallback image untuk video
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop';
  }

  // Jika berupa file MP4 langsung
  if (urlOrId.endsWith('.mp4') || urlOrId.endsWith('.webm')) {
    return urlOrId;
  }

  return urlOrId;
};
