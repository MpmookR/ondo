'use client';

import Link from 'next/link';
import type { Theme } from '@/lib/box';
import { boxHref, homeHref, onboardingHref, shopHref } from '@/lib/routes';
import { ButtonLink, IconButton } from '../Button';
import { BrewScene } from './BrewScene';
import { TypedHeadline } from './TypedHeadline';
import { WindowLight } from './WindowLight';

export interface HomeHeroProps {
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

/** Typed in turn under the "A box for" eyebrow. The longest must fit on one line at `text-hero` (about 18 characters). */
const HEADLINE = ['Early birds', 'Tea people', 'Matcha mornings', 'Slow sippers'];
/** Screen readers hear the eyebrow first, then this, once, instead of each phrase in turn. */
const HEADLINE_LABEL = 'early birds, tea people, matcha mornings and slow sippers.';

const navLink =
  'flex min-h-44 items-center rounded-pill px-12 font-sans text-label font-semibold ' +
  'transition-colors duration-120 ease-brew hover:bg-bg-subtle';

/** Plank seams on the tabletop, running towards a vanishing point behind the table (0–1000 wide). */
const seams = [60, 190, 320, 450, 580, 710, 840, 970];
/** Fine grain between the seams. */
const grain = [120, 255, 385, 515, 645, 775, 905];
/** Where a line at the back (x) lands at the front edge, in perspective. */
const front = (x: number) => 500 + (x - 500) * 1.35;

/**
 * The wooden table the scene stands on, in 3D: a top surface seen in perspective (planks and grain
 * running away from you, lighter where the window light falls nearest), a lit front edge, and its
 * shadow on the floor. Decorative.
 */
function Table({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="relative h-40 overflow-hidden bg-linear-to-b from-illo-table-back to-illo-table-front lg:h-64">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
          <g stroke="var(--illo-table-grain)" fill="none" vectorEffect="non-scaling-stroke">
            {seams.map((x) => (
              <line key={x} x1={x} y1="0" x2={front(x)} y2="100" strokeOpacity="0.28" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            ))}
            {grain.map((x) => (
              <path
                key={x}
                d={`M${x} 0 C${x + 6} 35 ${front(x) - 8} 65 ${front(x)} 100`}
                strokeOpacity="0.1"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        </svg>
      </div>
      <div className="h-16 border-t-2 border-illo-table-bevel bg-linear-to-b from-illo-table-edge-top to-illo-table-edge-bottom lg:h-40" />
      <div className="h-16 bg-bg-page lg:h-24">
        <div className="h-full bg-linear-to-b from-illo-table-shadow to-transparent" />
      </div>
    </div>
  );
}

/**
 * Homepage hero, "Sunday Drip": slow-brew scene, headline and the one main call to action.
 * Mobile: the headline on top, then the scene on its table, then the words and buttons.
 * From 1024px: words on the left (7 of 12 columns, vertically centred), the scene on the right
 * (5 columns, at most 460px wide), standing on a full-width 3D table.
 * The window light and every loop stop under prefers-reduced-motion.
 */
export function HomeHero({ theme, onThemeChange }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-illo-wall-top to-illo-wall-bottom">
      <WindowLight />

      <header className="relative mx-auto flex max-w-content items-center justify-between gap-16 px-margin py-12">
        <Link
          href={homeHref}
          aria-label="Ondo, home"
          className="flex min-h-44 items-center rounded-sm font-heading text-title font-heavy uppercase tracking-wide text-brand"
        >
          Ondo
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4">
          <Link href={shopHref()} className={navLink}>
            Shop
          </Link>
          <Link href={boxHref} className={navLink}>
            Your box
          </Link>
          {theme && onThemeChange && (
            <IconButton
              icon={theme === 'light' ? 'moon' : 'sun'}
              label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              variant="ghost"
              onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
            />
          )}
        </nav>
      </header>

      {/* Mobile: headline, then the scene on its table, then the words and buttons.
          From 1024px: a 12-column grid. Headline and words share 7 columns and meet in the middle
          of the scene, which takes the last 5 and stands on the table. */}
      {/* The scene overlaps the tabletop (negative margin) so the carafe and plant stand on it, not behind it. */}
      <div className="relative z-10 mx-auto flex max-w-content flex-col px-margin lg:-mb-48 lg:grid lg:grid-cols-12 lg:grid-rows-2 lg:gap-x-gutter lg:pt-24">
        <div className="flex animate-brew-rise flex-col gap-12 pb-16 pt-16 motion-reduce:animate-none lg:col-span-7 lg:row-start-1 lg:gap-16 lg:self-end lg:pb-8 lg:pt-48">
          <p className="font-sans text-eyebrow uppercase text-text-muted">A box for</p>
          {/* Typed one at a time; the size scales so the longest phrase always fits on one line. */}
          <TypedHeadline phrases={HEADLINE} label={HEADLINE_LABEL} className="font-heading text-hero text-brand" />
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-end">
          <BrewScene className="relative z-10 mx-auto -mb-32 max-w-scene lg:mb-0" />
          <Table className="-mx-margin lg:hidden" />
        </div>

        <div className="-mx-margin flex animate-brew-rise flex-col gap-16 bg-bg-page px-margin pb-48 pt-24 motion-reduce:animate-none lg:col-span-7 lg:row-start-2 lg:mx-0 lg:self-start lg:bg-transparent lg:px-0 lg:pb-48 lg:pt-8">
          <p className="max-w-column font-sans text-body-lg">
            Coffee, tea and matcha picked for your mornings. Build your first box in two minutes, then pause
            or swap any time.
          </p>
          <div className="mt-8 flex flex-col gap-12 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href={onboardingHref} size="lg" icon="arrow-right" iconPosition="end">
              Build your first box
            </ButtonLink>
            <ButtonLink href={shopHref()} variant="secondary" size="lg">
              Browse the shop
            </ButtonLink>
          </div>
        </div>
      </div>

      <Table className="relative hidden lg:block" />
    </section>
  );
}
