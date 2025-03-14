import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Platform",
  description: "Next-generation AI platform for developers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
