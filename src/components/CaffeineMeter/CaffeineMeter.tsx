import type { CaffeineLevel } from '@/types';

export const caffeineLabel: Record<CaffeineLevel, string> = {
  0: 'Caffeine free',
  1: 'Very low',
  2: 'Low',
  3: 'Medium',
  4: 'High',
  5: 'Very high',
};

export const caffeineText = (level: CaffeineLevel) =>
  level === 0 ? 'Caffeine free' : `Caffeine ${level} of 5, ${caffeineLabel[level].toLowerCase()}`;

export interface CaffeineMeterProps {
  level: CaffeineLevel;
  /** `full` shows the word label; `compact` keeps it for screen readers only. */
  display?: 'full' | 'compact';
  className?: string;
}

/** Ondo's signature component: caffeine on a 1–5 scale, never shown as colour alone. */
export function CaffeineMeter({ level, display = 'full', className = '' }: CaffeineMeterProps) {
  return (
    <div className={`flex items-center gap-8 ${className}`}>
      <span className="flex items-center gap-2" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((step) => (
          <span
            key={step}
            className={`block h-12 w-8 rounded-pill border ${step <= level ? 'border-accent bg-accent' : 'border-border-strong'}`}
          />
        ))}
      </span>
      <span className="sr-only">{caffeineText(level)}</span>
      {display === 'full' && (
        <span aria-hidden="true" className="font-display text-caption text-text-muted">
          {caffeineLabel[level]}
        </span>
      )}
    </div>
  );
}
