'use client';

import { useId, useState, type ReactNode } from 'react';
import { Icon } from '../Icon';

export interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

/** Collapsed by default: unavailable items are tucked away, never silently removed. */
export function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return (
    <section className="flex flex-col gap-12">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-48 w-full items-center justify-between rounded-card border border-border bg-bg-surface px-16 py-12 text-left font-display text-label font-bold"
      >
        {title}
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
      </button>
      <div id={panelId} hidden={!open}>
        {children}
      </div>
    </section>
  );
}
