import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PuterScript from "./components/PuterScript";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chat Interface",
  description: "A web interface for interacting with AI models using Puter.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PuterScript />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
