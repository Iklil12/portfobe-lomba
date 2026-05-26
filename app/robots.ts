import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/', // Boleh merayapi seluruh halaman publik
      disallow: [
        '/api/', // Jangan biarkan Google mengindeks file API kita
        '/dashboard/', // Dasbor adalah area privat kreator
        '/impersonate/', // Area admin (hanya untuk tim internal)
        '/reset-password/',
        '/actions/',
        
      ],
    },
    // Beri tahu Google letak peta situs kita
    sitemap: 'https://portfo.be/sitemap.xml',
  };
}