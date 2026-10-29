import Link from 'next/link';
import type { Totals } from '@/lib/box';
import { formatPrice, pluralise } from '@/lib/format';
import { boxHref } from '@/lib/routes';

/** The shop's sticky bar: the box total is always in view. */
export function ViewBoxBar({ totals }: { totals: Totals }) {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-30 bg-bg-surface px-16 pt-12 shadow-bar">
      <div aria-live="polite" className="mx-auto max-w-frame">
        <Link
          href={boxHref}
          className="flex min-h-52 w-full items-center justify-center rounded-pill bg-action font-sans text-label font-bold uppercase tracking-wide text-action-text transition-opacity duration-120 ease-brew hover:opacity-90"
        >
          View your box · {pluralise(totals.count, 'item')} · {formatPrice(totals.total)}
        </Link>
      </div>
    </div>
  );
}
