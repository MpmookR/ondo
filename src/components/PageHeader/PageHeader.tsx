'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Theme } from '@/lib/box';
import { Icon } from '../Icon';

export interface PageHeaderProps {
  /** Page title. Leave out to show the Ondo wordmark. */
  title?: string;
  /** With the wordmark: the page name screen readers hear after "ondo". */
  pageName?: string;
  /** Where the back arrow goes. Leave out to hide it. */
  backHref?: string;
  onBack?: () => void;
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  /** Extra row under the title bar (e.g. the savings line). */
  children?: ReactNode;
  sticky?: boolean;
}

/** The Ondo emblem + name. In dark mode the emblem sits on a light disc so its olive outline stays visible. */
export function Wordmark() {
  return (
    <span className="inline-flex items-center font-heading text-title font-bold">
      <span className="grid size-40 place-items-center rounded-pill bg-logo-disc">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/ondo-mark-96.webp"
          srcSet="/brand/ondo-mark-96.webp 1x, /brand/ondo-mark-192.webp 2x"
          width={36}
          height={36}
          alt=""
          className="size-36"
        />
      </span>
      ondo
    </span>
  );
}

const iconButton = "relative grid size-24 place-items-center before:absolute before:-inset-10 before:content-['']";

/** Title bar: back, wordmark or title, theme switch. Same layout on every page. */
export function PageHeader({ title, pageName = 'your box', backHref, onBack, theme, onThemeChange, children, sticky = false }: PageHeaderProps) {
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
    <header className={`border-b border-border bg-bg-surface ${sticky ? 'sticky top-0 z-20' : ''}`}>
      <div className="mx-auto flex max-w-content items-center gap-8 px-16 py-16 lg:px-24 lg:py-20">
        {back}
        <div className="flex min-w-0 flex-1 justify-center">
          {title ? (
            <h1 className="line-clamp-2 text-center font-heading text-title">{title}</h1>
          ) : (
            <h1>
              <Wordmark />
              <span className="sr-only">: {pageName}</span>
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

/** "You'll save 10% · How it works" line under the header. Leave out `learnMoreHref` to hide the link. */
export function SavingsLine({ saving, learnMoreHref = '#delivery' }: { saving: string; learnMoreHref?: string | null }) {
  return (
    <p className="flex flex-wrap items-center justify-center gap-4 px-16 pb-16 font-sans text-label">
      <Icon name="tag" size={20} />
      <span>
        You&apos;ll save <span className="highlight px-4 py-2">{saving}</span> with a subscription
      </span>
      {learnMoreHref && (
        <a href={learnMoreHref} className="font-medium text-text-muted underline underline-offset-4">
          How it works
        </a>
      )}
    </p>
  );
}
