'use client';

import { useEffect, useState } from 'react';

export interface TypedHeadlineProps {
  /** Typed one after another, then round again. Keep each short enough to fit on one line. */
  phrases: string[];
  className?: string;
}

/** Typing pace in ms: unhurried, to match the slow brew. */
const TYPE_MS = 75;
const DELETE_MS = 35;
const HOLD_MS = 1800;
/** The last phrase stays longest: it's the one the page is about. */
const HOLD_LAST_MS = 3200;
const PAUSE_MS = 350;

type Phase = 'hold' | 'deleting' | 'typing';

/**
 * A headline that types its phrases one after another, with a blinking Flame caret.
 * Screen readers get all the phrases once, as a plain heading; the moving text is hidden from them.
 * It starts fully typed (no empty flash, and it reads fine without JavaScript), and stays still
 * on the last phrase when the visitor prefers reduced motion.
 */
export function TypedHeadline({ phrases, className = '' }: TypedHeadlineProps) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(phrases[0]?.length ?? 0);
  const [phase, setPhase] = useState<Phase>('hold');
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setStill(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (still || phrases.length < 2) return;
    const phrase = phrases[index];
    const isLast = index === phrases.length - 1;
    let delay: number;
    let step: () => void;

    if (phase === 'hold') {
      delay = isLast ? HOLD_LAST_MS : HOLD_MS;
      step = () => setPhase('deleting');
    } else if (phase === 'deleting') {
      if (length > 0) {
        delay = DELETE_MS;
        step = () => setLength((n) => n - 1);
      } else {
        delay = PAUSE_MS;
        step = () => {
          setIndex((i) => (i + 1) % phrases.length);
          setPhase('typing');
        };
      }
    } else if (length < phrase.length) {
      delay = TYPE_MS;
      step = () => setLength((n) => n + 1);
    } else {
      delay = 0;
      step = () => setPhase('hold');
    }

    const timer = window.setTimeout(step, delay);
    return () => window.clearTimeout(timer);
  }, [still, phrases, index, length, phase]);

  const last = phrases[phrases.length - 1] ?? '';
  const shown = still ? last : (phrases[index] ?? '').slice(0, length);

  return (
    <h1 className={className}>
      <span className="sr-only">{phrases.join(' ')}</span>
      <span aria-hidden="true" className="block whitespace-nowrap">
        {/* A no-break space keeps the line's height while it's empty. */}
        <span className="border-r-4 border-spark pr-4 animate-caret motion-reduce:animate-none">{shown || ' '}</span>
      </span>
    </h1>
  );
}
