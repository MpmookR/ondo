'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { HomeHero } from '@/components/HomeHero';
import { useBox } from '@/components/BoxProvider';
import { Preloader, type PreloadPhase } from '@/components/Preloader';
import { itemById } from '@/data/catalogue';
import { bestSellerIds } from '@/data/bestSellers';
import type { Item } from '@/types';

/* Below the fold, so their code loads separately from the hero's. They're still rendered on the server. */
const HowItWorks = dynamic(() => import('@/components/HowItWorks').then((m) => m.HowItWorks));
const BestSellers = dynamic(() => import('@/components/BestSellers').then((m) => m.BestSellers));

const bestSellers = bestSellerIds.map(itemById).filter((item): item is Item => Boolean(item));

/** The homepage: preloader, then hero, how it works, best sellers. More sections to come. */
export function HomePage() {
  const { theme, setTheme } = useBox();
  // Only a real reveal plays the settle; a returning visitor (no preloader) just sees the page.
  const [opened, setOpened] = useState(false);
  const onPhaseChange = (phase: PreloadPhase) => {
    if (phase === 'opening') setOpened(true);
  };
  return (
    <>
      <Preloader onPhaseChange={onPhaseChange} />
      {/* The page settles from a slight zoom as the preloader opens up */}
      <main className={`overflow-x-clip ${opened ? 'animate-page-in' : ''}`}>
        <HomeHero theme={theme} onThemeChange={setTheme} />
        <HowItWorks />
        <BestSellers items={bestSellers} />
      </main>
    </>
  );
}
