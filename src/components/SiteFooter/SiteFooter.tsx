'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { greetingFor } from '@/lib/greeting';
import { TypedHeadline } from '../HomeHero/TypedHeadline';
import { useInView } from '../shared/useInView';
import { boxHref, onboardingHref, shopHref } from '@/lib/routes';
import { beat, Reveal } from '../shared/Reveal';

/** The live design system (Storybook), published separately. */
export const DESIGN_SYSTEM_URL = 'https://mooksportfolio.netlify.app/';

export interface SiteFooterProps {
  /** Leaves room under the footer for a bar fixed to the bottom (the shop's View your box, an item's order bar). */
  clearFixedBar?: boolean;
}

const links = [
  { href: shopHref(), label: 'Shop' },
  { href: boxHref, label: 'Your box' },
  { href: onboardingHref, label: 'Build your first box' },
];

/** The typed line settles on the last one: the cup is on its way. */
const CUP_STEPS = ['picked', 'packed', 'on its way.'];

const linkClass =
  'flex min-h-44 items-center rounded-pill px-12 font-sans text-label font-semibold underline-offset-4 ' +
  'transition-opacity duration-120 ease-brew hover:underline';

/**
 * The brand sign-off on the browsing pages (homepage, shop, item pages): a greeting for the visitor's
 * time of day over "Your next cup is picked / packed / on its way." (typed once, as it scrolls into
 * view, echoing the hero's typed headline), a few links,
 * the ONDO wordmark set across the full width, and the portfolio note. Cal Poly Green with Vanilla
 * text (the theme swaps them). Not on Your box, onboarding or checkout, where nothing should pull
 * people away.
 */
export function SiteFooter({ clearFixedBar = false }: SiteFooterProps) {
  // The greeting needs the visitor's clock, so it's set in the browser (the server can't know it).
  const [greeting, setGreeting] = useState('Hello.');
  useEffect(() => setGreeting(greetingFor(new Date().getHours())), []);
  const { ref, seen } = useInView<HTMLDivElement>(0.6);

  return (
    <footer className={`overflow-hidden bg-brand text-on-brand ${clearFixedBar ? 'pb-96' : ''}`}>
      <Reveal className="mx-auto flex max-w-content flex-col gap-32 px-margin pt-64 lg:pt-96">
        <div className="flex flex-col gap-24 lg:flex-row lg:items-end lg:justify-between">
          <div ref={ref} className="max-w-column group-data-ready:opacity-0 group-data-seen:animate-soft-up">
            <TypedHeadline
              as="h2"
              prefix={`${greeting} Your next cup is `}
              phrases={CUP_STEPS}
              loop={true}
              play={seen}
              label={`${greeting} Your next cup is picked, packed and on its way.`}
              className="font-sans text-body-lg"
            />
          </div>
          <nav aria-label="Footer" className="group-data-ready:opacity-0 group-data-seen:animate-soft-up" style={beat(1)}>
            <ul className="-mx-12 flex flex-wrap">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* The wordmark fills the width at any size: SVG text, its viewBox cropped to the letters (measured
            in Fira Sans Heavy), so it scales evenly instead of stretching. Decorative. */}
        <svg
          viewBox="15 1 70 19.6"
          aria-hidden="true"
          className="w-full fill-current group-data-ready:opacity-0 group-data-seen:animate-soft-up"
          style={beat(2)}
        >
          <text x="50" y="20" textAnchor="middle" className="font-heading font-heavy" fontSize="26">
            ONDO
          </text>
        </svg>

        <div className="flex flex-col gap-8 border-t border-current/20 py-24 font-sans text-body-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            Ondo is an invented brand, designed and built by Mook (Puangpaka Rattana) with Claude and code. Nothing here is for
            sale.
          </p>
          <a href={DESIGN_SYSTEM_URL} target="_blank" rel="noreferrer" className={`${linkClass} -mx-12 shrink-0`}>
            View Portfolio ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </Reveal>
    </footer>
  );
}
