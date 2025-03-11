'use client';

import Script from "next/script";

export default function PuterScript() {
  return (
    <Script
      src="https://js.puter.com/v2/"
      strategy="beforeInteractive"
      onError={(e) => {
        console.error('Error loading Puter.js:', e);
      }}
    />
  );
}