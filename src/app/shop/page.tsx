import { Suspense } from 'react';
import { ShopPage } from '@/views/ShopPage';

export const metadata = { title: 'Ondo · Shop' };

export default function Page() {
  // useSearchParams needs a Suspense boundary for static rendering.
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  );
}
