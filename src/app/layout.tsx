import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./tailwind.css";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Employee Performance Dashboard",
  description:
    "Track, analyze, and improve your team's performance metrics in real-time",
  keywords: [
    "employee",
    "performance",
    "dashboard",
    "hr",
    "management",
    "analytics",
  ],
  authors: [{ name: "EPD Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#4F46E5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
