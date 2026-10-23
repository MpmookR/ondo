'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type Dispatch, type ReactNode } from 'react';
import type { Suggestion } from '@/types';
import { catalogue } from '@/data/catalogue';
import { defaultBox, defaultCustomer } from '@/data/customer';
import { goalById } from '@/data/goals';
import { planById } from '@/data/plans';
import { boxReducer, totals as computeTotals, type BoxAction, type BoxState, type Theme, type Totals } from '@/lib/box';
import { addDays, todayISO } from '@/lib/dates';
import { recommend } from '@/lib/recommend';

export const INITIAL_BOX: BoxState = {
  lines: defaultBox,
  plan: 'fortnightly',
  customer: defaultCustomer,
  railLines: defaultBox,
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
}

const BoxContext = createContext<BoxContextValue | null>(null);
const THEME_KEY = 'ondo-theme';

/** One box shared by every page, so nothing is lost moving between them. */
export function BoxProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boxReducer, INITIAL_BOX);
  const [theme, setThemeState] = useState<Theme>('light');

  // Set the default delivery date in the browser, so it's relative to the real today, not build day.
  useEffect(() => {
    dispatch({ type: 'setDeliveryDate', date: addDays(todayISO(), DEFAULT_LEAD_DAYS) });
  }, []);

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
      totals: computeTotals(state.lines, catalogue, planById(state.plan).discount),
      suggestions: recommend(state.customer, state.railLines, catalogue, {
        goalLabel: goalById(state.customer.goal).railLabel,
      }),
      setQty: (itemId, qty) => dispatch({ type: 'setQty', itemId, qty }),
      theme,
      setTheme: setThemeState,
    }),
    [state, theme],
  );

  return <BoxContext.Provider value={value}>{children}</BoxContext.Provider>;
}

export function useBox(): BoxContextValue {
  const ctx = useContext(BoxContext);
  if (!ctx) throw new Error('useBox must be used inside <BoxProvider>');
  return ctx;
}

/** Rebuild the rail from the current box when a page opens (it then stays put while you add). */
export function useFreshRail() {
  const { dispatch } = useBox();
  useEffect(() => {
    dispatch({ type: 'refreshRail' });
  }, [dispatch]);
}
