'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Item } from '@/types';
import { formatPrice } from '@/lib/format';
import { itemHref, shopHref } from '@/lib/routes';
import { ButtonLink } from '../Button';
import { caffeineLabel } from '../CaffeineMeter';
import { ProductImage } from '../ProductImage';
import { useInView } from '../shared/useInView';

export interface BestSellersProps {
  items: Item[];
}

/** Which beat of the entrance an element plays: the animation tokens multiply their delay by it. */
const stagger = (n: number) => ({ '--stagger': n }) as CSSProperties;

/** Before the entrance plays, only once JavaScript is running (so without it, everything shows). */
const waiting = 'group-data-ready:opacity-0';

/**
 * Best sellers: products standing in arches. On scroll-in the headline lines slide up out of a mask,
 * the arches appear, each product rises into its arch (left to right), then its words fade up.
 * Hovering an arch slowly lifts the pack. The whole arch opens the product page.
 */
export function BestSellers({ items }: BestSellersProps) {
  const { ref, ready, seen } = useInView<HTMLElement>(0.25);

  return (
    <section
      ref={ref}
      aria-labelledby="best-sellers-title"
      data-ready={ready || undefined}
      data-seen={seen || undefined}
      className="group mx-auto max-w-content px-margin py-80 lg:py-128"
    >
      <div className="flex flex-col items-center gap-12 text-center">
        <p className={`font-sans text-eyebrow uppercase text-text-muted ${waiting} group-data-seen:animate-fade-up`} style={stagger(-1)}>
          Best sellers
        </p>
        <h2 id="best-sellers-title" className="font-heading text-display text-brand">
          {/* Each line slides up from behind its own mask */}
          <span className="block overflow-hidden pb-4">
            <span className="block group-data-ready:opacity-0 group-data-seen:animate-line-up" style={stagger(0)}>
              The best cups,
            </span>
          </span>
          <span className="block overflow-hidden pb-4">
            <span className="block group-data-ready:opacity-0 group-data-seen:animate-line-up" style={stagger(1)}>
              in one little box*
            </span>
          </span>
        </h2>
        <p className={`font-sans text-body-sm text-text-muted ${waiting} group-data-seen:animate-fade-up`} style={stagger(0)}>
          *We might be a little biased.
        </p>
      </div>

      <ul className="mt-48 grid grid-cols-2 gap-16 lg:mt-80 lg:grid-cols-4 lg:gap-gutter">
        {items.map((item, i) => (
          <li
            key={item.id}
            data-category={item.category}
            className={`group/card relative flex flex-col overflow-hidden rounded-t-pill border-2 border-accent bg-bg-surface ${waiting} group-data-seen:animate-arch-in`}
            style={stagger(i)}
          >
            <div className="px-16 pt-40 lg:px-32 lg:pt-56">
              <div className="group-data-ready:opacity-0 group-data-seen:animate-rise" style={stagger(i)}>
                <ProductImage
                  category={item.category}
                  image={item.image}
                  sizes="(min-width: 1024px) 220px, 40vw"
                  className="aspect-3/4 w-full transition-[translate] duration-500 ease-silk group-hover/card:-translate-y-12"
                />
              </div>
            </div>

            <div
              className={`flex flex-1 flex-col items-center gap-4 px-12 pb-24 pt-16 text-center lg:gap-8 lg:px-24 lg:pb-32 ${waiting} group-data-seen:animate-fade-up`}
              style={stagger(i)}
            >
              <h3 className="font-heading text-title uppercase text-accent">
                <Link href={itemHref(item.id)} className="stretched-link">
                  {item.name}
                </Link>
              </h3>
              <p className="font-sans text-label">
                {item.size} · {formatPrice(item.price)}
              </p>
              <p className="font-sans text-footnote text-text-muted">
                {caffeineLabel[item.caffeineLevel]} caffeine · {item.notes.join(', ')}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className={`mt-48 flex justify-center lg:mt-64 ${waiting} group-data-seen:animate-fade-up`} style={stagger(items.length)}>
        <ButtonLink href={shopHref()} variant="secondary" size="lg" icon="arrow-right" iconPosition="end">
          Shop all drinks
        </ButtonLink>
      </div>
    </section>
  );
}
