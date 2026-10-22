import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { BoxProvider } from '@/components/BoxProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ondo · Your box',
  description: 'Ondo is a fictional caffeine subscription and design system case study by Mook (Puangpaka Rattana).',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#fbf8f2',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Fontshare (ITF Free Font License). Files are loaded from Fontshare, not redistributed. */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,600,700,800&f[]=erode@400,500,600,400i&display=swap"
        />
      </head>
      <body>
        <BoxProvider>{children}</BoxProvider>
      </body>
    </html>
  );
}
