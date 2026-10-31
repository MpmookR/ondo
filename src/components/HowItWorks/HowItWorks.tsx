'use client';

import type { ReactNode } from 'react';
import type { Category } from '@/types';
import { onboardingHref } from '@/lib/routes';
import { ButtonLink } from '../Button';
import { ProductImage } from '../ProductImage';
import { Reveal, WordReveal, beat } from '../shared/Reveal';
import { useParallax } from '../shared/useParallax';

/*
 * Editorial motion, after the brief's reference: one soft ease-out (`ease-silk`), long calm moves,
 * nothing bounces or tilts. As each step scrolls in: its arch opens upwards while the photo inside
 * settles from a slight zoom, a hairline draws across, the title's words slide up one by one and
 * the copy follows. While scrolling, the photos drift a little slower than the page (parallax).
 * Without JavaScript or with reduced motion, everything simply shows.
 */

const pack = (id: string) => `/brand/shop/web/${id}`;

interface Step {
  title: string;
  body: string;
  detail: string;
  category: Category;
  /** The photos inside the arch, centred a little below the middle (under the curve), clear of the edges as they drift. */
  art: ReactNode;
}

const steps: Step[] = [
  {
    title: 'Tell us how you sip',
    body: 'Coffee, tea or matcha, how many cups a day and what you brew with.',
    detail: 'Two minutes · Skip any question',
    category: 'coffee',
    art: (
      <div className="flex h-full items-center justify-center -space-x-40 px-24 pt-64">
        <ProductImage category="coffee" image={pack('c-yirgacheffe')} sizes="20vw" className="aspect-3/4 w-2/5" />
        <ProductImage category="tea" image={pack('t-oolong')} sizes="24vw" className="relative z-10 aspect-3/4 w-1/2" />
        <ProductImage category="matcha" image={pack('m-ceremonial')} sizes="20vw" className="aspect-3/4 w-2/5" />
      </div>
    ),
  },
  {
    title: 'We pick your box',
    body: 'Drinks that suit your mornings and stay under your caffeine limit, each with a reason it made the cut.',
    detail: 'Picked for you · Never over your limit',
    category: 'tea',
    art: (
      <div className="flex h-full items-center justify-center -space-x-32 px-24 pt-64">
        <ProductImage category="tea" image={pack('t-sencha')} sizes="26vw" className="aspect-3/4 w-3/5" />
        <ProductImage category="bites" image={pack('b-shortbread')} sizes="18vw" className="relative z-10 aspect-3/4 w-2/5" />
      </div>
    ),
  },
  {
    title: 'Sip, skip or swap',
    body: 'It arrives every 15, 30 or 45 days, or just once. Save up to 10% on a subscription and change it any time.',
    detail: 'Every 15, 30 or 45 days · Pause any time',
    category: 'matcha',
    art: (
      <div className="flex h-full items-center justify-center px-40 pt-64">
        <ProductImage category="gear" image={pack('g-pour-over')} sizes="30vw" className="aspect-3/4 w-4/5" />
      </div>
    ),
  },
];

/** The arch: opens upwards on scroll-in; inside, the photo settles from a slight zoom and drifts on scroll. */
function Arch({ category, children }: { category: Category; children: ReactNode }) {
  const drift = useParallax<HTMLDivElement>(-0.1);
  return (
    <div data-category={category} className="aspect-4/5 w-full group-data-ready:opacity-0 group-data-seen:animate-arch-open">
      <div className="relative size-full overflow-hidden rounded-t-pill bg-accent-subtle">
        <div ref={drift} className="parallax absolute -inset-y-48 inset-x-0">
          <div className="h-full group-data-seen:animate-settle">{children}</div>
        </div>
      </div>
    </div>
  );
}

function StepRow({ step, index }: { step: Step; index: number }) {
  const flipped = index % 2 === 1;
  const number = String(index + 1).padStart(2, '0');
  return (
    <Reveal
      as="li"
      threshold={0.25}
      className="grid items-center gap-32 lg:grid-cols-12 lg:gap-gutter"
    >
      <div className={`lg:col-span-5 lg:row-start-1 ${flipped ? 'lg:col-start-8' : 'lg:col-start-1'}`}>
        <Arch category={step.category}>{step.art}</Arch>
      </div>

      <div className={`flex flex-col gap-20 lg:col-span-6 lg:row-start-1 ${flipped ? 'lg:col-start-1' : 'lg:col-start-7'}`}>
        <div className="flex items-baseline justify-between gap-16">
          <span className="font-heading text-display text-brand group-data-ready:opacity-0 group-data-seen:animate-soft-up" style={beat(0)}>
            {number}
          </span>
          <span className="font-sans text-eyebrow uppercase text-text-muted group-data-ready:opacity-0 group-data-seen:animate-soft-up" style={beat(1)}>
            Step {index + 1} of {steps.length}
          </span>
        </div>
        <div aria-hidden="true" className="h-1 origin-left bg-border-strong group-data-ready:opacity-0 group-data-seen:animate-rule-draw" />
        <h3 className="font-heading text-heading">
          <WordReveal text={step.title} start={1} />
        </h3>
        <p className="max-w-column font-sans text-body-lg group-data-ready:opacity-0 group-data-seen:animate-soft-up" style={beat(4)}>
          {step.body}
        </p>
        <p className="font-sans text-label text-text-muted group-data-ready:opacity-0 group-data-seen:animate-soft-up" style={beat(5)}>
          {step.detail}
        </p>
        {/* After the last step, the next move: it arrives with that step's words. */}
        {index === steps.length - 1 && (
          <span className="mt-12 self-start group-data-ready:opacity-0 group-data-seen:animate-soft-up" style={beat(6)}>
            <ButtonLink href={onboardingHref} size="lg" icon="arrow-right" iconPosition="end">
              Start with step one
            </ButtonLink>
          </span>
        )}
      </div>
    </Reveal>
  );
}

/** A slow band of promises, running only while it's on screen. Decorative (it repeats the steps). */
function Ticker() {
  const words = ['Picked for your mornings', 'Skip any question', 'Every 15, 30 or 45 days', 'Save up to 10%', 'Pause any time'];
  const run = (copy: number) =>
    words.map((w) => (
      <span key={`${copy}-${w}`} className="flex items-center gap-40 pr-40">
        <span>{w}</span>
        <span className="text-spark">✦</span>
      </span>
    ));
  return (
    <Reveal threshold={0} className="overflow-hidden border-y border-border py-24 lg:py-32">
      <div aria-hidden="true" className="flex w-max font-heading text-heading uppercase text-brand motion-safe:group-data-playing:animate-ticker">
        {run(0)}
        {run(1)}
      </div>
    </Reveal>
  );
}

/** "How it works": an editorial zig-zag of three steps, product photography in arches, then a ticker. */
export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="py-96 lg:py-128">
      <div className="mx-auto max-w-content px-margin">
        <Reveal className="flex flex-col items-center gap-16 text-center">
          <p className="font-sans text-eyebrow uppercase text-text-muted group-data-ready:opacity-0 group-data-seen:animate-soft-up">
            How it works
          </p>
          <h2 id="how-it-works-title" className="font-heading text-display text-brand">
            <span className="block">
              <WordReveal text="From your first sip" />
            </span>
            <span className="block">
              <WordReveal text="to your doorstep" start={4} />
            </span>
          </h2>
        </Reveal>

        <ol className="mt-80 flex flex-col gap-96 lg:mt-128 lg:gap-128">
          {steps.map((step, i) => (
            <StepRow key={step.title} step={step} index={i} />
          ))}
        </ol>
      </div>

      <div className="mt-96 lg:mt-128">
        <Ticker />
      </div>
    </section>
  );
}
