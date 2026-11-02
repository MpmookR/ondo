'use client';

import { useEffect, useRef, useState, type CSSProperties, type Ref } from 'react';
import { useRouter } from 'next/navigation';
import type { Item } from '@/types';
import { Icon } from '../Icon';
import { ProductImage } from '../ProductImage';

export interface PackingData {
  /** The packs going in, in order (the starter box's picks). At most four are drawn. */
  items: Item[];
  /** The answers that shaped it, checked off one at a time. */
  lines: string[];
}

/** The timeline, in ms. Each answer is checked 1.5s after the one before. */
const FIRST_CHECK = 900;
const CHECK_GAP = 1500;
const LID_AFTER_LAST = 500;
const READY_AFTER_LID = 500;
const LEAVE_AFTER_READY = 900;
/** Matches `animate-pack-open`: the circle that opens onto Your box. */
const OPEN_MS = 2000;
const REDUCED_MS = 1600;

export function packingTimeline(lineCount: number, packCount: number) {
  const lastCheck = FIRST_CHECK + Math.max(0, lineCount - 1) * CHECK_GAP;
  const lidAt = lastCheck + LID_AFTER_LAST;
  const readyAt = lidAt + READY_AFTER_LID;
  // Packs spread over the checking, the first right away.
  const spread = packCount > 1 ? (lastCheck - 300) / (packCount - 1) : 0;
  return {
    check: (i: number) => FIRST_CHECK + i * CHECK_GAP,
    line: (i: number) => 200 + i * 120,
    pack: (i: number) => Math.round(300 + i * spread),
    lidAt,
    readyAt,
    leaveAt: readyAt + LEAVE_AFTER_READY,
  };
}

/** When an element's animation starts on the timeline. */
const at = (value: number): CSSProperties => ({ animationDelay: `${value}ms` });

/**
 * "Preparing your box", the picture: an open kraft box with its flaps up. The picked packs drop in
 * while each answer that shaped them is checked off in turn (an empty circle, then the tick), the
 * flaps fold shut and "Your box is ready". Under reduced motion everything simply shows.
 */
export function PackingBox({ items, lines, boxRef }: PackingData & { boxRef?: Ref<HTMLDivElement> }) {
  const packs = items.slice(0, 4);
  const empty = packs.length === 0;
  const t = packingTimeline(lines.length, packs.length);
  return (
    <div className="flex w-full max-w-column flex-col items-center gap-32">
      {/* The box, from the front: a shadow on the floor, the open flaps, the back wall, the packs,
          the front wall over them, then the two lid flaps folding down. */}
      <div ref={boxRef} aria-hidden="true" className="relative h-208 w-300">
        <div className="absolute inset-x-16 -bottom-8 h-16 rounded-pill bg-illo-table-shadow blur-md" />
        <div style={at(t.lidAt)} className={`absolute inset-x-0 bottom-128 flex ${empty ? '' : 'animate-pack-flaps-out motion-reduce:animate-none'}`}>
          <div className="h-40 w-1/2 origin-bottom skew-x-12 rounded-t-sm bg-illo-kraft-light" />
          <div className="h-40 w-1/2 origin-bottom -skew-x-12 rounded-t-sm bg-illo-kraft-light" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-128 rounded-t-sm bg-illo-kraft-dark" />
        <div className="absolute inset-x-16 bottom-8 flex items-end justify-center">
          {packs.map((item, i) => (
            <div key={item.id} style={at(t.pack(i))} className="-mx-4 animate-pack-drop motion-reduce:animate-none">
              <ProductImage category={item.category} label={item.size} image={item.image} sizes="80px" className="h-120 w-80" />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-72 items-center justify-center rounded-b-sm bg-illo-kraft shadow-card">
          <span className="font-heading text-title font-heavy uppercase tracking-wide text-illo-kraft-dark">Ondo</span>
        </div>
        {!empty && (
          <div className="absolute inset-x-0 bottom-72 flex h-56">
            {[0, 1].map((n) => (
              <div
                key={n}
                style={at(t.lidAt + n * 200)}
                className={`h-full w-1/2 origin-top bg-illo-kraft-light animate-pack-lid motion-reduce:animate-none ${n === 0 ? 'border-r border-illo-kraft-dark' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      <div role="status" className="flex flex-col items-center gap-16 text-center">
        <p className="font-heading text-title text-brand">{empty ? 'Nothing fits every answer yet' : 'Preparing your box'}</p>
        <ul className="flex flex-col items-start gap-8 font-sans text-body">
          {lines.map((line, i) => (
            <li key={line} style={at(t.line(i))} className="flex items-center gap-8 animate-pack-line motion-reduce:animate-none">
              {/* An empty circle until this answer's turn, then the tick pops in. */}
              <span className="relative grid size-24 shrink-0 place-items-center rounded-pill border-2 border-border-strong">
                <span
                  style={at(t.check(i))}
                  className="absolute -inset-2 grid place-items-center rounded-pill bg-primary text-on-primary animate-pack-check motion-reduce:animate-none"
                >
                  <Icon name="check" size={16} />
                </span>
              </span>
              <span style={at(t.check(i))} className="animate-pack-done motion-reduce:animate-none">
                {line}
              </span>
            </li>
          ))}
        </ul>
        <p style={at(t.readyAt)} className="font-sans text-label font-bold text-text-primary animate-pack-ready motion-reduce:animate-none">
          {empty ? 'Taking you to your box to start with a drink' : 'Your box is ready'}
        </p>
      </div>
    </div>
  );
}

/**
 * Plays "Preparing your box" over everything (it lives in BoxProvider, so it survives the move to
 * Your box), then opens onto Your box the way the homepage preloader does: the view zooms into the
 * box while a circle grows from it. Theme: the page's. Reduced motion: shown briefly, no reveal.
 */
export function PackingOverlay({ data, onDone }: { data: PackingData; onDone: () => void }) {
  const router = useRouter();
  const [opening, setOpening] = useState(false);
  const [focusY, setFocusY] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = packingTimeline(data.lines.length, Math.min(data.items.length, 4));
    const timers: number[] = [];
    router.prefetch('/box');
    timers.push(
      window.setTimeout(
        () => {
          router.push('/box');
          if (reduced) {
            done.current();
            return;
          }
          const box = boxRef.current?.getBoundingClientRect();
          if (box) setFocusY(box.top + box.height / 2);
          setOpening(true);
          timers.push(window.setTimeout(() => done.current(), OPEN_MS));
        },
        reduced ? REDUCED_MS : t.leaveAt,
      ),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [data, router]);

  return (
    <div
      style={focusY === null ? undefined : ({ '--focus-y': `${focusY}px` } as CSSProperties)}
      className={`fixed inset-0 z-50 bg-bg-page ${opening ? 'preload-mask pointer-events-none animate-pack-open' : ''}`}
    >
      <div className={`preload-focus flex h-full items-center justify-center px-margin ${opening ? 'animate-pack-zoom' : ''}`}>
        <PackingBox {...data} boxRef={boxRef} />
      </div>
    </div>
  );
}
