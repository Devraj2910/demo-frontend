"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Check if the current page is login or register
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer - only show on non-auth pages */}
      {!isAuthPage && (
        <footer className="py-6 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} Employee Performance Dashboard. All
              rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
