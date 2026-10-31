import type { Metadata } from "next";
import localFont from "next/font/local";

import { SITE } from "@/config/site";
import { LanguageProvider } from "@/contexts/LanguageContext";
import StoreProvider from "@/store/StoreProvider";

import "./globals.css";

// Self-hosted: Turbopack's next/font/google breaks on Google's `/l/font?kit=…&skey=…` file URLs
const inter = localFont({
  variable: "--font-inter",
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
});

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
