import React from 'react';
import prisma from '@/lib/prisma';
import GalleryModalView from '@/components/features/gallery/GalleryModalView';

export default async function FullGalleryModal({ 
  params 
}: { 
  params: { subdomain: string } 
}) {
  const { subdomain } = await params;

  // Fetch Data dari Prisma di Sisi Server (Lebih Cepat)
  const userData = await prisma.user.findFirst({
    where: { 
      profile: { subdomain: subdomain } 
    },
    include: {
      projects: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const projects = userData?.projects || [];

  return (
    <GalleryModalView 
      projects={projects} 
      subdomain={subdomain} 
    />
  );
}
