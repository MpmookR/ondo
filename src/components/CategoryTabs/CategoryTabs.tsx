'use client';

import { useEffect, useRef } from 'react';

export interface CategoryTab<T extends string> {
  id: T;
  label: string;
}

export interface CategoryTabsProps<T extends string> {
  tabs: CategoryTab<T>[];
  active: T;
  onChange: (id: T) => void;
  panelId: string;
}

/** 44px tabs, active = bold + 3px underline, scroll sideways on mobile, centred on desktop. */
export function CategoryTabs<T extends string>({ tabs, active, onChange, panelId }: CategoryTabsProps<T>) {
  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  return (
    <nav aria-label="Shop categories" className="border-b border-border bg-bg-surface">
      <div role="tablist" className="mx-auto flex max-w-content gap-4 overflow-x-auto px-12 scrollbar-none lg:justify-center lg:px-24">
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={selected ? activeRef : undefined}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={panelId}
              onClick={() => onChange(tab.id)}
              className={`flex min-h-44 shrink-0 items-center whitespace-nowrap border-b-3 px-12 pb-10 pt-12 font-sans text-label transition-colors duration-120 ease-brew ${
                selected ? 'border-action font-bold' : 'border-transparent font-medium text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
