import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import ClientLayout from "@/app/ClientLayout";
import "./globals.css";
import "./tailwind.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Digital Kudos Wall",
  description: "Celebrate achievements and thank your colleagues publicly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body className={`${inter.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
