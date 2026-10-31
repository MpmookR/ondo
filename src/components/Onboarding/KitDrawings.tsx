'use client';

import { useLayoutEffect, useRef } from 'react';
import type { BrewKit } from '@/types';
import { beat } from '../shared/Reveal';

/**
 * One line drawing per piece of brew kit, on a 120 × 120 grid. `lines` are drawn in brand green, in
 * order; `detail` (crema, steam, the coffee level) is drawn last in spark, so each one finishes with
 * a little flourish.
 */
const drawings: Record<BrewKit, { lines: string[]; detail: string[] }> = {
  'espresso-machine': {
    lines: [
      'M24 18h72a4 4 0 0 1 4 4v68H20V22a4 4 0 0 1 4-4z',
      'M20 34h80',
      'M78 26a4 4 0 1 0 8 0a4 4 0 1 0 -8 0',
      'M42 34v10h36V34',
      'M40 50h40M80 50h16',
      'M46 70h28v8a8 8 0 0 1-8 8H54a8 8 0 0 1-8-8z',
      'M74 73h3a3 3 0 0 1 0 6h-3',
      'M12 96h96',
    ],
    detail: ['M56 54v12', 'M64 54v12'],
  },
  filter: {
    lines: [
      'M24 28h72',
      'M30 28l16 34h28l16-34',
      'M44 36l7 20M60 36v22M76 36l-7 20',
      'M50 62h20v8H50z',
      'M38 74h44l4 28a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6z',
    ],
    detail: ['M60 72v6', 'M40 92h40'],
  },
  'moka-pot': {
    lines: [
      'M38 108l-4-28h52l-4 28z',
      'M34 80l8-8h36l8 8',
      'M42 72l-4-34h44l-4 34',
      'M36 38h48',
      'M54 38v-6h12v6',
      'M38 44l-12-6',
      'M82 44h8c4 0 6 4 5 8l-5 20',
    ],
    detail: ['M54 24c-3-4 3-6 0-10', 'M66 24c-3-4 3-6 0-10'],
  },
  cafetiere: {
    lines: [
      'M38 34h44v66a6 6 0 0 1-6 6H44a6 6 0 0 1-6-6z',
      'M32 34h56',
      'M60 12v44',
      'M52 12h16',
      'M40 56h40',
      'M82 42h8a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6h-8',
    ],
    detail: ['M40 70h40', 'M44 82h32'],
  },
  grinder: {
    lines: [
      'M42 50h36v52a4 4 0 0 1-4 4H46a4 4 0 0 1-4-4z',
      'M44 50l-4-12h40l-4 12',
      'M60 38V24h28',
      'M88 24v-8',
      'M84 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0',
      'M42 78h36',
    ],
    detail: ['M52 92c3-3 7 0 4 3', 'M64 90c3-3 7 0 4 3'],
  },
  teapot: {
    lines: [
      'M30 82c0-20 14-32 30-32s30 12 30 32c0 12-6 20-16 20H46c-10 0-16-8-16-20z',
      'M44 50c0-8 7-12 16-12s16 4 16 12',
      'M56 38c0-5 8-5 8 0',
      'M31 74c-10-2-15-10-19-20 7 1 12 5 19 12',
      'M90 62c10 0 14 6 14 12s-4 12-14 14',
    ],
    detail: ['M12 46c-3-4 3-6 0-10', 'M20 44c-3-4 3-6 0-10'],
  },
  whisk: {
    lines: [
      'M54 12h12v26H54z',
      'M54 38c-10 6-14 16-12 26',
      'M66 38c10 6 14 16 12 26',
      'M58 38c-4 8-6 16-5 26M62 38c4 8 6 16 5 26',
      'M20 74h80c0 20-17 32-40 32S20 94 20 74z',
    ],
    detail: ['M30 80c12 5 48 5 60 0'],
  },
};

/** How a drawing glides to its new place (motion tokens, so nothing is hard-coded here). */
const GLIDE = ['transition-transform', 'duration-500', 'ease-silk'];

/** A single drawing: green lines first, then the spark detail, each stroke drawing itself in. */
export function KitDrawing({ kit, className = '' }: { kit: BrewKit; className?: string }) {
  const { lines, detail } = drawings[kit];
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={`overflow-visible ${className}`}>
      <g fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {lines.map((d, i) => (
          <path key={d} d={d} pathLength={1} stroke="currentColor" className="animate-draw motion-reduce:animate-none" style={beat(i)} />
        ))}
        {detail.map((d, i) => (
          <path
            key={d}
            d={d}
            pathLength={1}
            stroke="var(--color-spark)"
            className="animate-draw motion-reduce:animate-none"
            style={beat(lines.length + i)}
          />
        ))}
      </g>
    </svg>
  );
}

export interface KitDrawingsProps {
  /** The kit chosen, in the order it was chosen: new picks are drawn as they're added. */
  kit: BrewKit[];
  labels: Record<BrewKit, string>;
}

/**
 * The kit the customer ticked, drawn in, two to a line. One sits in the middle; when a second is
 * added, the first glides left to make room (and back when one is taken away). Decorative: the
 * chips above carry the answer.
 */
export function KitDrawings({ kit, labels }: KitDrawingsProps) {
  const refs = useRef(new Map<BrewKit, HTMLLIElement>());
  const last = useRef(new Map<BrewKit, DOMRect>());
  const order = kit.join('|');

  // FLIP: after each change, start every drawing where it was, then glide it to where it now is.
  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const now = new Map<BrewKit, DOMRect>();
    refs.current.forEach((el, id) => {
      const rect = el.getBoundingClientRect();
      now.set(id, rect);
      const before = last.current.get(id);
      if (reduce || !before) return;
      const dx = before.left - rect.left;
      const dy = before.top - rect.top;
      if (dx === 0 && dy === 0) return;
      el.classList.remove(...GLIDE);
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      requestAnimationFrame(() => {
        el.classList.add(...GLIDE);
        el.style.transform = '';
      });
    });
    last.current = now;
  }, [order]);

  if (kit.length === 0) return null;
  return (
    <ul aria-hidden="true" className="flex flex-wrap justify-center gap-16">
      {kit.map((id) => (
        <li
          key={id}
          ref={(el) => {
            if (el) refs.current.set(id, el);
            else refs.current.delete(id);
          }}
          className="flex w-5/12 flex-col items-center gap-8 rounded-card bg-bg-surface p-16 shadow-card animate-option-in motion-reduce:animate-none"
        >
          <KitDrawing kit={id} className="size-96 text-brand lg:size-120" />
          <span className="text-center font-sans text-label">{labels[id]}</span>
        </li>
      ))}
    </ul>
  );
}
