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

  // Deteksi Bunny Stream (UUID format: 8-4-4-4-12)
  const isBunny = urlOrId.length === 36 && urlOrId.includes('-');
  if (isBunny) {
    // Jika ada Pull Zone, gunakan Pull Zone. Jika tidak, gunakan dummy/placeholder
    const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;
    if (pullZone) {
      return `https://${pullZone}/${urlOrId}/thumbnail.jpg`;
    }
    // Fallback image untuk video
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop';
  }

  // Jika berupa file MP4 langsung
  if (urlOrId.endsWith('.mp4')) {
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop';
  }

  return urlOrId;
};
