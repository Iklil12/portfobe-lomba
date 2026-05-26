"use client";

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';

export default function SubdomainLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const params = useParams();
  const subdomain = params.subdomain as string;

  // JANGAN biarkan Intercepting Route galeri aktif jika kita sedang berada di dashboard
  // Ini untuk mencegah rute dinamis [subdomain] memakan rute statis /dashboard
  const isDashboard = subdomain === 'dashboard' || subdomain === 'settings' || subdomain === 'api';

  return (
    <>
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
      
      {!isDashboard && (
        <AnimatePresence mode="wait">
          {modal}
        </AnimatePresence>
      )}
    </>
  );
}
