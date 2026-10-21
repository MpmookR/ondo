import type { BoxLine, Goal, Item, PlanId } from '../types';

export interface BoxState {
  lines: BoxLine[];
  goal: Goal;
  plan: PlanId;
}

export type BoxAction =
  | { type: 'add'; itemId: string }
  | { type: 'remove'; itemId: string }
  | { type: 'setQty'; itemId: string; qty: number }
  | { type: 'setGoal'; goal: Goal }
  | { type: 'setPlan'; plan: PlanId };

const MAX_QTY = 9;

export function qtyOf(lines: BoxLine[], itemId: string): number {
  return lines.find((l) => l.itemId === itemId)?.qty ?? 0;
}

function withQty(lines: BoxLine[], itemId: string, qty: number): BoxLine[] {
  const clamped = Math.max(0, Math.min(MAX_QTY, qty));
  if (clamped === 0) return lines.filter((l) => l.itemId !== itemId);
  if (lines.some((l) => l.itemId === itemId)) {
    return lines.map((l) => (l.itemId === itemId ? { ...l, qty: clamped } : l));
  }
  return [...lines, { itemId, qty: clamped }];
}

export function boxReducer(state: BoxState, action: BoxAction): BoxState {
  switch (action.type) {
    case 'add':
      return { ...state, lines: withQty(state.lines, action.itemId, qtyOf(state.lines, action.itemId) + 1) };
    case 'remove':
      return { ...state, lines: withQty(state.lines, action.itemId, qtyOf(state.lines, action.itemId) - 1) };
    case 'setQty':
      return { ...state, lines: withQty(state.lines, action.itemId, action.qty) };
    case 'setGoal':
      return { ...state, goal: action.goal };
    case 'setPlan':
      return { ...state, plan: action.plan };
  }
}

export interface Totals {
  count: number;
  subtotal: number;
  discount: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function totals(lines: BoxLine[], catalogue: Item[], discountRate: number): Totals {
  let count = 0;
  let subtotal = 0;
  for (const line of lines) {
    const item = catalogue.find((i) => i.id === line.itemId);
    if (!item) continue;
    count += line.qty;
    subtotal += item.price * line.qty;
  }
  subtotal = round2(subtotal);
  const discount = round2(subtotal * discountRate);
  return { count, subtotal, discount, total: round2(subtotal - discount) };
}
