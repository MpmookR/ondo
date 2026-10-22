import { useReducer, type ReactNode } from 'react';
import type { Totals } from '@/lib/box';
import { catalogue, itemById } from '@/data/catalogue';
import { defaultBox, defaultCustomer } from '@/data/customer';
import { recommend } from '@/lib/recommend';

export const item = (id: string) => itemById(id)!;

export const sampleTotals: Totals = { drinkCount: 2, gearCount: 1, count: 3, subtotal: 39, discount: 3.9, total: 35.1 };
export const emptyTotals: Totals = { drinkCount: 0, gearCount: 0, count: 0, subtotal: 0, discount: 0, total: 0 };

export const sampleSuggestions = recommend(defaultCustomer, defaultBox, catalogue, { goalLabel: 'calm focus' });

/** Phone-width frame for page-level stories. */
export function Phone({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-frame">{children}</div>;
}

/** Local quantity state for interactive stories. */
export function useQty(initial = 0) {
  return useReducer((_: number, next: number) => next, initial);
}
