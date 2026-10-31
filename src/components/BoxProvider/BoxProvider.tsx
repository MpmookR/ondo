'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type Dispatch, type ReactNode } from 'react';
import type { Suggestion } from '@/types';
import { catalogue } from '@/data/catalogue';
import { SKIPPED } from '@/data/onboarding';
import { goalById } from '@/data/goals';
import { planById } from '@/data/plans';
import { boxReducer, isBoxState, totals as computeTotals, type BoxAction, type BoxState, type Theme, type Totals } from '@/lib/box';
import { addDays, todayISO } from '@/lib/dates';
import { recommend } from '@/lib/recommend';

/**
 * A new customer: an empty box and no answers yet. Suggestions run on the safe defaults until they
 * do onboarding (or keep some answers from "I'd rather browse").
 */
export const INITIAL_BOX: BoxState = {
  lines: [],
  plan: null,
  customer: SKIPPED,
  answered: false,
  railLines: [],
  deliveryDate: null,
};

/** Default first delivery: a week from today. The rest of the delivery rules come later. */
export const DEFAULT_LEAD_DAYS = 7;

interface BoxContextValue {
  state: BoxState;
  dispatch: Dispatch<BoxAction>;
  totals: Totals;
  /** The rail's suggestions: the same result powers Your box and the shop's "For you" tab. */
  suggestions: Suggestion[];
  setQty: (itemId: string, qty: number) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  /**
   * The last list page the customer was on (home, a shop tab or Your box). An item page's Back goes
   * here, so hopping from product to product never makes Back walk through every product.
   */
  returnTo: string | null;
  setReturnTo: (path: string) => void;
}

const BoxContext = createContext<BoxContextValue | null>(null);
const THEME_KEY = 'ondo-theme';
/** One tab's shopping session: the box, the answers and the delivery choice. Cleared when the tab closes. */
const SESSION_KEY = 'ondo-session-v1';

/** One box shared by every page, so nothing is lost moving between them. */
export function BoxProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boxReducer, INITIAL_BOX);
  const [theme, setThemeState] = useState<Theme>('light');
  const [returnTo, setReturnTo] = useState<string | null>(null);

  // Restore this tab's session (box, answers, delivery) so a reload or a typed address keeps it.
  // Otherwise start fresh, with the default delivery date set in the browser (relative to the real
  // today, not build day). sessionStorage can be missing or blocked: then it just starts fresh.
  // Saving waits until the restore has landed (`restored` is set in the same render as the restored
  // state), so the empty starting state never overwrites a saved session.
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    let saved: unknown = null;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      saved = raw ? JSON.parse(raw) : null;
    } catch {}
    if (isBoxState(saved)) dispatch({ type: 'restore', state: saved });
    else dispatch({ type: 'setDeliveryDate', date: addDays(todayISO(), DEFAULT_LEAD_DAYS) });
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
    } catch {}
  }, [state, restored]);

  // Remember the viewer's theme (a per-viewer convenience; the page works without it).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') setThemeState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const value = useMemo<BoxContextValue>(
    () => ({
      state,
      dispatch,
      totals: computeTotals(state.lines, catalogue, state.plan ? planById(state.plan).discount : 0),
      suggestions: recommend(state.customer, state.railLines, catalogue, {
        goalLabel: goalById(state.customer.goal)?.railLabel,
      }),
      setQty: (itemId, qty) => dispatch({ type: 'setQty', itemId, qty }),
      theme,
      setTheme: setThemeState,
      returnTo,
      setReturnTo,
    }),
    [state, theme, returnTo],
  );

  return <BoxContext.Provider value={value}>{children}</BoxContext.Provider>;
}

export function useBox(): BoxContextValue {
  const ctx = useContext(BoxContext);
  if (!ctx) throw new Error('useBox must be used inside <BoxProvider>');
  return ctx;
}

/** Marks this page as where an item page's Back returns to. */
export function useReturnHere(path: string) {
  const { setReturnTo } = useBox();
  useEffect(() => {
    setReturnTo(path);
  }, [path, setReturnTo]);
}

/** Rebuild the rail from the current box when a page opens (it then stays put while you add). */
export function useFreshRail() {
  const { dispatch } = useBox();
  useEffect(() => {
    dispatch({ type: 'refreshRail' });
  }, [dispatch]);
}
