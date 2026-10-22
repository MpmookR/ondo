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
        {/* Kalnia + Mona Sans, self-hosted (SIL Open Font License). @font-face lives in tokens.css. */}
        <link rel="preload" href="/fonts/MonaSans-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/Kalnia-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <BoxProvider>{children}</BoxProvider>
      </body>
    </html>
  );
}
