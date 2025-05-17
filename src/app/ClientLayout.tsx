'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/modules/auth';
import { initializeAnalyticsModule } from '@/modules/analytics/core/services/setupAnalyticsService';
import NavigationBar from './NavigationBar';

// Initialize modules immediately
// This ensures modules are initialized before any components render
// We want this to happen on the client side only, so keep it inside the 'use client' file
if (typeof window !== 'undefined') {
  initializeAnalyticsModule();
  console.log('Modules initialized before component render');
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [initialized, setInitialized] = useState(false);

  // Double-check that modules are initialized
  useEffect(() => {
    if (!initialized) {
      // Initialize the analytics module
      initializeAnalyticsModule();
      setInitialized(true);
      console.log('Modules initialized in useEffect');
    }
  }, [initialized]);

  return (
    <AuthProvider>
      {!isHomePage && <NavigationBar />}
      <main>{children}</main>
    </AuthProvider>
  );
}
