'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Theme } from '@/lib/box';
import { Icon } from '../Icon';

export interface PageHeaderProps {
  /** Page title. Leave out to show the Ondo wordmark. */
  title?: string;
  /** Where the back arrow goes. Leave out to hide it. */
  backHref?: string;
  onBack?: () => void;
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  /** Extra row under the title bar (e.g. the savings line). */
  children?: ReactNode;
  sticky?: boolean;
}

export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-6 font-display text-title font-heavy tracking-tight">
      <span aria-hidden="true" className="grid size-24 place-items-center rounded-pill border-3 border-text-primary">
        <span className="size-6 rounded-pill bg-accent" data-category="matcha" />
      </span>
      ondo
    </span>
  );
}

const iconButton = "relative grid size-24 place-items-center before:absolute before:-inset-10 before:content-['']";

/** Title bar: back, wordmark or title, theme switch. Same layout on every page. */
export function PageHeader({ title, backHref, onBack, theme, onThemeChange, children, sticky = false }: PageHeaderProps) {
  const back = onBack ? (
    <button type="button" onClick={onBack} aria-label="Back" className={iconButton}>
      <Icon name="chevron-left" />
    </button>
  ) : backHref ? (
    <Link href={backHref} aria-label="Back" className={iconButton}>
      <Icon name="chevron-left" />
    </Link>
  ) : (
    <span className="size-24" aria-hidden="true" />
  );

  return (
    <header className={`bg-bg-surface ${sticky ? 'sticky top-0 z-20' : ''}`}>
      <div className="mx-auto flex max-w-content items-center gap-8 px-16 py-16 lg:px-24 lg:py-20">
        {back}
        <div className="flex min-w-0 flex-1 justify-center">
          {title ? (
            <h1 className="line-clamp-2 text-center font-display text-label uppercase tracking-wide">{title}</h1>
          ) : (
            <h1>
              <Wordmark />
              <span className="sr-only">: your box</span>
            </h1>
          )}
        </div>
        {theme && onThemeChange ? (
          <button
            type="button"
            className={iconButton}
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} />
          </button>
        ) : (
          <span className="size-24" aria-hidden="true" />
        )}
      </div>
      {children}
    </header>
  );
}

/** "You'll save 10% · Learn more" line under the header on Your box. */
export function SavingsLine({ saving }: { saving: string }) {
  return (
    <p className="flex flex-wrap items-center justify-center gap-4 px-16 pb-16 font-display text-label">
      <Icon name="tag" size={20} />
      <span>
        You&apos;ll save <span className="highlight px-2" data-category="matcha">{saving}</span> with a subscription
      </span>
      <a href="#delivery" className="font-medium text-text-muted underline underline-offset-4">
        How it works
      </a>
    </p>
  );
}
