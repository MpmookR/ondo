import type { BoxLine, BrewMethod, Customer, Item, Suggestion } from '../types';

/** Points per signal. Documented in doc/prd.md; change both together. */
export const POINTS = {
  goalMatch: 3,
  pairsWithBox: 2,
  brewsYourBox: 1,
  easyToTry: 1,
} as const;

export const EASY_PRICE = 6;
export const DEFAULT_LIMIT = 6;

type Signal = keyof typeof POINTS;

interface Context {
  drinks: Item[];
}

const isDrink = (item: Item) => item.category !== 'gear';

/** The rail's context: the drinks in the box (not gear), so adding gear never reshuffles the rail. */
function buildContext(box: BoxLine[], catalogue: Item[]): Context {
  const inBox = box
    .filter((line) => line.qty > 0)
    .map((line) => catalogue.find((i) => i.id === line.itemId))
    .filter((i): i is Item => Boolean(i));
  return { drinks: inBox.filter(isDrink) };
}

// ---------- Step 1: hard filters ----------

export function passesFilters(item: Item, customer: Customer, box: BoxLine[]): boolean {
  if (item.caffeineLevel > customer.maxCaffeine) return false;
  if (item.contains.some((c) => customer.avoids.includes(c))) return false;
  if (!item.inStock) return false;
  if (box.some((line) => line.itemId === item.id && line.qty > 0)) return false;
  return true;
}

// ---------- Step 2: signals ----------

function pairedDrink(item: Item, drinks: Item[]): Item | undefined {
  return drinks.find((d) => d.pairsWith?.includes(item.id) || item.pairsWith?.includes(d.id));
}

/** Gear that can brew a drink in the box (only counted when there's no explicit pairing). */
function drinkThisGearBrews(item: Item, drinks: Item[]): Item | undefined {
  if (isDrink(item)) return undefined;
  return drinks.find((d) => d.brewMethods.some((m: BrewMethod) => item.brewMethods.includes(m)));
}

interface Scored {
  item: Item;
  score: number;
  signals: Signal[];
  pairedWith?: Item;
  brews?: Item;
}

function score(item: Item, customer: Customer, ctx: Context): Scored {
  const signals: Signal[] = [];
  const pairedWith = pairedDrink(item, ctx.drinks);
  const brews = pairedWith ? undefined : drinkThisGearBrews(item, ctx.drinks);

  if (item.goalTags.includes(customer.goal)) signals.push('goalMatch');
  if (pairedWith) signals.push('pairsWithBox');
  if (brews) signals.push('brewsYourBox');
  if (item.price <= EASY_PRICE || item.isSample) signals.push('easyToTry');

  const total = signals.reduce((sum, s) => sum + POINTS[s], 0);
  return { item, score: total, signals, pairedWith, brews };
}

// ---------- Step 4: reason line ----------

export function reasonFor(s: Scored, goalLabel: string): string {
  if (s.pairedWith) return `Goes with your ${s.pairedWith.name}`;
  if (s.brews) return `Brews your ${s.brews.name}`;
  if (s.signals.includes('goalMatch')) return `Fits ${goalLabel}`;
  return s.item.isSample ? 'A small size to try' : 'Easy to try';
}

// ---------- Public API ----------

export function recommend(
  customer: Customer,
  box: BoxLine[],
  catalogue: Item[],
  options: { limit?: number; goalLabel?: string } = {},
): Suggestion[] {
  const { limit = DEFAULT_LIMIT, goalLabel = 'your goal' } = options;
  const ctx = buildContext(box, catalogue);

  return catalogue
    .filter((item) => passesFilters(item, customer, box))
    .map((item) => score(item, customer, ctx))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.item.price - b.item.price)
    .slice(0, limit)
    .map((s) => ({ item: s.item, score: s.score, reason: reasonFor(s, goalLabel) }));
}

/** Suggestions for one item's page: that drink is the context. Gear pages fall back to the box's rail. */
export function recommendForItem(
  item: Item,
  customer: Customer,
  catalogue: Item[],
  options: { limit?: number; goalLabel?: string } = {},
): Suggestion[] {
  return recommend(customer, [{ itemId: item.id, qty: 1 }], catalogue, options);
}

/** Why an item can't be added on the shop grid (null if it can). */
export function unavailableReason(item: Item, customer: Customer): string | null {
  if (!item.inStock) return 'Back soon';
  if (item.caffeineLevel > customer.maxCaffeine) return 'Above your caffeine limit';
  const clash = item.contains.find((c) => customer.avoids.includes(c));
  if (clash) return `Contains ${clash}`;
  return null;
}
