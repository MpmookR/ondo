'use client';

import type { CSSProperties } from 'react';
import { useRadioGroup } from '../shared/useRadioGroup';
import { beat } from '../shared/Reveal';
import { caffeineLabel } from '../CaffeineMeter';

export type CaffeineLimit = 1 | 2 | 3 | 4 | 5;
const LEVELS: CaffeineLimit[] = [1, 2, 3, 4, 5];
/** Bar heights rise with the level, like the caffeine meter on product cards, only bigger. */
const HEIGHTS: Record<CaffeineLimit, string> = { 1: 'h-32', 2: 'h-48', 3: 'h-64', 4: 'h-80', 5: 'h-96' };

/** One stretch of the coffee's surface; two side by side loop seamlessly as they slide. */
function Wave() {
  return (
    <svg viewBox="0 0 40 8" preserveAspectRatio="none" className="h-full w-full shrink-0">
      <path d="M0 4c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3V8H0z" fill="var(--color-illo-coffee)" />
      <path d="M0 4c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3" fill="none" stroke="var(--color-illo-crema)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** How long a glass takes to fill and when it starts: the n-th glass in the pour waits n beats. */
const pour = (n: number): CSSProperties => ({
  transitionDuration: 'var(--pour-duration)',
  transitionDelay: `calc(${n} * var(--pour-stagger))`,
});

export interface CaffeinePickerProps {
  value: CaffeineLimit | null;
  onChange: (level: CaffeineLimit) => void;
  /** An example drink per level, so the number means something. */
  examples: Record<CaffeineLimit, string>;
  labelledBy: string;
}

/**
 * The caffeine limit as five rising glasses, the big sibling of `CaffeineMeter`. Tap one (or use the
 * arrow keys): coffee pours into every glass up to it, one after another, and the label and an
 * example drink show underneath. The chosen glass gets a blue rim.
 */
export function CaffeinePicker({ value, onChange, examples, labelledBy }: CaffeinePickerProps) {
  const group = useRadioGroup(LEVELS, value, onChange);
  return (
    <div className="flex flex-col gap-16">
      <div role="radiogroup" aria-labelledby={labelledBy} className="flex items-end justify-between gap-8 rounded-card bg-bg-surface p-16 shadow-card">
        {LEVELS.map((level, i) => {
          const filled = value !== null && level <= value;
          const option = group.getOptionProps(level, i);
          return (
            <button
              key={level}
              type="button"
              {...option}
              aria-label={`${level} of 5, ${caffeineLabel[level].toLowerCase()}`}
              className="group/bar flex min-h-44 flex-1 flex-col items-center justify-end gap-8 rounded-sm pt-8 animate-option-in motion-reduce:animate-none"
              style={beat(i)}
            >
              {/* A glass that fills with coffee from the bottom. Glasses fill one after another up to
                  the level chosen, and drain from the top down when it goes lower. */}
              <span
                aria-hidden="true"
                className={`relative block w-full max-w-56 overflow-hidden rounded-sm border-2 bg-bg-subtle transition-[border-color,transform] duration-200 ease-brew group-hover/bar:-translate-y-2 motion-reduce:group-hover/bar:translate-y-0 ${HEIGHTS[level]} ${
                  value === level ? 'border-primary' : 'border-border-strong'
                }`}
              >
                <span
                  className={`absolute inset-x-0 bottom-0 bg-illo-coffee transition-[height] ease-silk motion-reduce:transition-none ${filled ? 'h-5/6' : 'h-0'}`}
                  style={pour(filled ? level - 1 : LEVELS.length - level)}
                >
                  {/* The surface: a crema line rippling sideways along the top of the coffee. */}
                  <span
                    className={`absolute inset-x-0 -top-6 flex h-8 overflow-hidden transition-opacity duration-200 ${filled ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <span className="flex w-full shrink-0 animate-liquid-wave motion-reduce:animate-none">
                      <Wave />
                      <Wave />
                    </span>
                  </span>
                </span>
              </span>
              <span aria-hidden="true" className={`font-sans text-label ${value === level ? 'text-text-primary' : 'text-text-muted'}`}>
                {level}
              </span>
            </button>
          );
        })}
      </div>
      {/* The readout, in the same card as the cups tally: a marker per level pops in, then the words. */}
      <div className="flex flex-col gap-8 rounded-card bg-bg-surface p-16 shadow-card" aria-live="polite">
        {value === null ? (
          <p className="font-sans text-body text-text-muted">Pick the most you&apos;d like in one cup.</p>
        ) : (
          <>
            <ul aria-hidden="true" className="flex items-end gap-4">
              {LEVELS.map((level) => (
                <li
                  key={`${value}-${level}`}
                  className={`block h-16 w-8 rounded-pill ${level <= value ? 'bg-spark animate-cup-in motion-reduce:animate-none' : 'border border-border-strong'}`}
                  style={beat(level - 1)}
                />
              ))}
            </ul>
            <p className="font-sans">
              <span className="block text-label">
                Up to {value} of 5, {caffeineLabel[value].toLowerCase()}
              </span>
              <span className="block text-body-sm text-text-muted">{examples[value]}</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
