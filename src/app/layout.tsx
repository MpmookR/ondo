import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ondo · Caffeine, paced to your day',
  description: 'Ondo is a fictional caffeine subscription and design system case study by Mook (Puangpaka Rattana).',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#131a19',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" data-theme="light">
      <head>
        {/* Fontshare (ITF Free Font License). Files are loaded from Fontshare, not redistributed. */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,600,700,800&f[]=erode@400,500,600,400i&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
