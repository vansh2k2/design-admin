import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SITE } from "@/config/site";
import { LanguageProvider } from "@/contexts/LanguageContext";
import StoreProvider from "@/store/StoreProvider";

import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: { default: SITE.adminTitle, template: `%s | ${SITE.adminTitle}` },
  description: `Content and enquiry management for ${SITE.legalName}.`,
  // The admin must never appear in search results
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      {/* Extensions (e.g. password managers) add attributes to <body> before hydration */}
      <body className={`${inter.className} flex min-h-full flex-col`} suppressHydrationWarning>
        <LanguageProvider>
          <StoreProvider>{children}</StoreProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
