'use client';

import { useId } from 'react';
import { caffeineBands, type CaffeineBand } from '@/data/labels';
import { ToggleChip } from '../Chip';

export interface CaffeineFilterProps {
  value: CaffeineBand;
  onChange: (band: CaffeineBand) => void;
  /** Items in each band on this tab. A band with none is disabled, so a tap never ends empty. */
  counts: Record<CaffeineBand, number>;
}

/**
 * One-tap caffeine filter for the drink tabs: All, Low (0 to 2), Medium (3), High (4 to 5).
 * Tapping the selected band again goes back to All.
 */
export function CaffeineFilter({ value, onChange, counts }: CaffeineFilterProps) {
  const labelId = useId();
  const options = [{ id: 'all' as const, label: 'All', range: '' }, ...caffeineBands];
  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-col">
      <span id={labelId} className="font-sans text-caption uppercase tracking-wide text-text-muted">
        Caffeine
      </span>
      <div className="-mx-16 flex gap-x-8 overflow-x-auto px-16 scrollbar-none">
        {options.map((o) => {
          const pressed = value === o.id;
          const count = counts[o.id];
          return (
            <ToggleChip
              key={o.id}
              className="shrink-0"
              pressed={pressed}
              disabled={o.id !== 'all' && count === 0}
              onPressedChange={() => onChange(pressed && o.id !== 'all' ? 'all' : o.id)}
              aria-label={o.id === 'all' ? `All caffeine levels, ${count} items` : `${o.label} caffeine, ${o.range} of 5, ${count} items`}
            >
              {o.label}
              <span className={`tabular-nums ${pressed ? '' : 'text-text-muted'}`}>{count}</span>
            </ToggleChip>
          );
        })}
      </div>
    </div>
  );
}
