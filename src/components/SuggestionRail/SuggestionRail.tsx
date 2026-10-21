import type { ReactNode } from 'react';

export interface SuggestionRailProps {
  title: string;
  description?: string;
  /** One child per card. The rail is hidden when there are none. */
  children: ReactNode[];
  className?: string;
}

/** Horizontal snap scroll on mobile, a three-column grid from 1024px. */
export function SuggestionRail({ title, description, children, className = '' }: SuggestionRailProps) {
  if (children.length === 0) return null;
  return (
    <section aria-label={title} className={className}>
      <div className="mb-16">
        <h2 className="font-display text-heading">{title}</h2>
        {description && <p className="mt-4 text-body text-text-muted">{description}</p>}
      </div>
      <ul className="-mx-margin flex snap-x snap-mandatory scroll-px-margin gap-12 overflow-x-auto px-margin pb-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-gutter lg:overflow-visible lg:px-0">
        {children.map((child, i) => (
          <li key={i} className="w-256 shrink-0 snap-start lg:w-auto">
            {child}
          </li>
        ))}
      </ul>
    </section>
  );
}
