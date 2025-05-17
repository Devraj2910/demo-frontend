'use client';

import React from 'react';
import { AuthProvider } from '@/clean-architecture/auth/AuthContext';
import NavigationBar from './NavigationBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavigationBar />
      <main>{children}</main>
    </AuthProvider>
  );
}
