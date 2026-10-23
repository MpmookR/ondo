import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { BoxProvider } from '@/components/BoxProvider';
import './globals.css';

/**
 * The site's full address, so share previews (Open Graph images) get absolute links.
 * Set NEXT_PUBLIC_SITE_URL once the site has its own domain; on Vercel the production URL is used.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ondo · Your box',
  description: 'Ondo is a fictional caffeine subscription and design system case study by Mook (Puangpaka Rattana).',
  openGraph: { images: ['/brand/ondo-mark-512.png'] },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Fira Sans + Source Sans 3, self-hosted (SIL Open Font License). @font-face lives in tokens.css. */}
        <link rel="preload" href="/fonts/SourceSans3-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/FiraSans-700.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body>; don't treat that as a mismatch. */}
      <body suppressHydrationWarning>
        <BoxProvider>{children}</BoxProvider>
      </body>
    </html>
  );
}
