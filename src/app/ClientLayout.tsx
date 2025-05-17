'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/modules/auth';
import NavigationBar from './NavigationBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <AuthProvider>
      {!isHomePage && <NavigationBar />}
      <main>{children}</main>
    </AuthProvider>
  );
}
