'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type Dispatch, type ReactNode } from 'react';
import type { Suggestion } from '@/types';
import { catalogue } from '@/data/catalogue';
import { SKIPPED } from '@/data/onboarding';
import { goalById } from '@/data/goals';
import { planById } from '@/data/plans';
import { boxReducer, isBoxState, repeatingLines, totals as computeTotals, type BoxAction, type BoxState, type Theme, type Totals } from '@/lib/box';
import { addDays, todayISO } from '@/lib/dates';
import { recommend } from '@/lib/recommend';
import { PackingOverlay, type PackingData } from '../Onboarding/PackingBox';

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
  ordered: false,
};

/** Default first delivery: a week from today. The rest of the delivery rules come later. */
export const DEFAULT_LEAD_DAYS = 7;

interface BoxContextValue {
  state: BoxState;
  dispatch: Dispatch<BoxAction>;
  /** The first box. */
  totals: Totals;
  /**
   * Every delivery after the first: the drinks, plus the add-ons they chose to keep. Null without
   * a subscription (a one-off, or no delivery chosen yet).
   */
  repeatTotals: Totals | null;
  /** The chosen subscription's saving (0.1 = 10%); 0 for a one-off or no choice yet. */
  discountRate: number;
  /** Your box's rail: quick adds only, so no gear (the shop's "For you" tab works out its own). */
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
  /**
   * Play "Preparing your box" and then open Your box. It lives here, above the pages, so it can keep
   * playing while Your box loads underneath and then open onto it.
   */
  startPacking: (data: PackingData) => void;
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
  const [packing, setPacking] = useState<PackingData | null>(null);

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

  const value = useMemo<BoxContextValue>(() => {
    const plan = state.plan ? planById(state.plan) : null;
    const subscription = plan !== null && plan.days !== undefined;
    return {
      state,
      dispatch,
      totals: computeTotals(state.lines, catalogue, plan?.discount ?? 0),
      discountRate: plan?.discount ?? 0,
      repeatTotals: subscription ? computeTotals(repeatingLines(state.lines, catalogue), catalogue, plan.discount) : null,
      suggestions: recommend(state.customer, state.railLines, catalogue, {
        goalLabel: goalById(state.customer.goal)?.railLabel,
        quickAdd: true,
      }),
      setQty: (itemId, qty) => dispatch({ type: 'setQty', itemId, qty }),
      theme,
      setTheme: setThemeState,
      returnTo,
      setReturnTo,
      startPacking: setPacking,
    };
  }, [state, theme, returnTo]);

  return (
    <BoxContext.Provider value={value}>
      {children}
      {packing && <PackingOverlay data={packing} onDone={() => setPacking(null)} />}
    </BoxContext.Provider>
  );
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
