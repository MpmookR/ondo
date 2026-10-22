import type { BoxLine, Suggestion } from '@/types';
import { qtyOf } from '@/lib/box';
import { SuggestionCard } from '../SuggestionCard';

export interface SuggestionRailProps {
  title: string;
  suggestions: Suggestion[];
  lines: BoxLine[];
  onQtyChange: (itemId: string, qty: number) => void;
  className?: string;
}

/**
 * Goal-based rail: horizontal snap scroll at every width, so on desktop the sticky sidebar stays
 * short enough to keep the box total in view.
 * Hidden when nothing qualifies: an empty box is worse than no box.
 */
export function SuggestionRail({ title, suggestions, lines, onQtyChange, className = '' }: SuggestionRailProps) {
  if (suggestions.length === 0) return null;
  return (
    <section
      id="suggestions"
      aria-labelledby="suggestions-title"
      className={`flex scroll-mt-16 flex-col gap-8 rounded-card border border-border bg-bg-surface p-8 shadow-card ${className}`}
    >
      <h3 id="suggestions-title" className="px-4 pt-4 font-display text-label font-bold">
        {title}
      </h3>
      <div className="relative -mx-8 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-px-8 px-8 pb-4 scrollbar-none">
        {suggestions.map((s) => (
          <SuggestionCard
            key={s.item.id}
            suggestion={s}
            qty={qtyOf(lines, s.item.id)}
            onQtyChange={(qty) => onQtyChange(s.item.id, qty)}
          />
        ))}
      </div>
    </section>
  );
}
