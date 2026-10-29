'use client';

import { useEffect, useRef, useState } from 'react';
import { BrewScene } from '../HomeHero/BrewScene';

export type PreloadPhase = 'loading' | 'opening' | 'done';

export interface PreloaderProps {
  /** Told when the reveal starts (`opening`) and when the preloader has gone (`done`). */
  onPhaseChange?: (phase: PreloadPhase) => void;
}

/** The fill always takes at least this long, so it reads as a pour rather than a flicker. */
const MIN_FILL_MS = 4200;
/** Never keep anyone waiting longer than this, loaded or not. */
const MAX_WAIT_MS = 6000;
/** While the page is still loading the counter waits here, then finishes once it has. */
const WAIT_AT = 90;
const HOLD_FULL_MS = 700;
/** Matches `animate-preload-open` (3s: a slow, calm reveal). */
const OPEN_MS = 3000;
const SEEN_KEY = 'ondo:preloaded';

/** Gentle at both ends, like a pour that starts, flows, then settles. */
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/**
 * Homepage preloader: the pour-over drips into an empty carafe that fills as the counter climbs
 * from 0 to 100%. When the page has loaded (window load + fonts) and the carafe is full, the view
 * zooms into the coffee while a circle opens from it to reveal the page.
 * Shows once per visit (sessionStorage). Under reduced motion the reveal is instant. A CSS
 * failsafe hides it after 10s, so it can never cover the page.
 */
export function Preloader({ onPhaseChange }: PreloaderProps) {
  const [phase, setPhase] = useState<PreloadPhase>('loading');
  const [progress, setProgress] = useState(0);
  const notify = useRef(onPhaseChange);
  useEffect(() => {
    notify.current = onPhaseChange;
  }, [onPhaseChange]);

  useEffect(() => {
    notify.current?.(phase);
  }, [phase]);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Storage blocked (private mode): just show it.
    }
    if (seen) {
      setPhase('done');
      return;
    }

    const start = performance.now();
    let loaded = false;
    let frame = 0;
    const timers: number[] = [];
    const markLoaded = () => {
      loaded = true;
    };

    const pageLoad =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
    Promise.all([pageLoad, document.fonts?.ready]).then(markLoaded, markLoaded);
    timers.push(window.setTimeout(markLoaded, MAX_WAIT_MS));

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const tick = (now: number) => {
      const timeShare = easeInOut(Math.min(1, (now - start) / MIN_FILL_MS)) * 100;
      const next = Math.floor(loaded ? timeShare : Math.min(WAIT_AT, timeShare));
      setProgress(next);
      if (next >= 100) {
        timers.push(
          window.setTimeout(() => {
            setPhase('opening');
            document.body.style.overflow = previousOverflow;
            try {
              sessionStorage.setItem(SEEN_KEY, '1');
            } catch {
              // Fine: it will show again next time.
            }
            timers.push(window.setTimeout(() => setPhase('done'), OPEN_MS));
          }, HOLD_FULL_MS),
        );
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((t) => window.clearTimeout(t));
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (phase === 'done') return null;
  const opening = phase === 'opening';

  return (
    <div
      data-preloader
      className={`fixed inset-0 z-50 grid place-items-center bg-linear-to-b from-illo-wall-top to-illo-wall-bottom px-margin ${
        opening ? 'preload-mask pointer-events-none animate-preload-open' : 'animate-preload-failsafe'
      }`}
    >
      <div className={`flex w-full max-w-frame flex-col items-center gap-16 ${opening ? 'animate-preload-zoom' : ''}`}>
        <div className="w-3/4">
          <BrewScene level={progress / 100} />
        </div>
        <div
          role="progressbar"
          aria-label="Loading Ondo"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="flex flex-col items-center gap-4"
        >
          <span className="font-heading text-hero tabular-nums text-brand">{progress}%</span>
          <span className="font-sans text-eyebrow uppercase text-text-muted">Brewing your mornings</span>
        </div>
      </div>
    </div>
  );
}
