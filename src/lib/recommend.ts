import type { BoxLine, BrewKit, BrewMethod, Customer, Item, Suggestion } from '../types';
import { brewKitOptions, isDrinkCategory } from '../data/labels';
import { kitGearId, kitMethods, tasteNotes } from '../data/onboarding';

/** Points per signal. Documented in doc/prd.md; change both together. */
export const POINTS = {
  goalMatch: 3,
  pairsWithBox: 2,
  brewsYourBox: 1,
  /** A drink they can brew with kit they own (onboarding: "What do you brew with?"). */
  brewsWithYourKit: 1,
  /** A coffee or tea whose notes match the taste they picked. */
  tasteMatch: 1,
  /** A bite or sweetener in a category they said yes to ("Add something to try with your cup?"). */
  askedFor: 1,
  easyToTry: 1,
} as const;

export const EASY_PRICE = 6;
export const DEFAULT_LIMIT = 6;

type Signal = keyof typeof POINTS;

interface Context {
  drinks: Item[];
}

const isDrink = (item: Item) => isDrinkCategory(item.category);

/** The rail's context: the drinks in the box (not add-ons), so adding an add-on never reshuffles the rail. */
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
  if (ownsIt(item, customer)) return false;
  return true;
}

/** Gear they told us they already have. */
function ownsIt(item: Item, customer: Customer): boolean {
  return customer.brewKit.some((kit) => kitGearId[kit] === item.id);
}

// ---------- Step 2: signals ----------

function pairedDrink(item: Item, drinks: Item[]): Item | undefined {
  return drinks.find((d) => d.pairsWith?.includes(item.id) || item.pairsWith?.includes(d.id));
}

/** Gear that can brew a drink in the box (only counted when there's no explicit pairing). */
function drinkThisGearBrews(item: Item, drinks: Item[]): Item | undefined {
  if (item.category !== 'gear') return undefined;
  return drinks.find((d) => d.brewMethods.some((m: BrewMethod) => item.brewMethods.includes(m)));
}

/** The kit they own that can brew this drink, if any. */
function theirKitFor(item: Item, customer: Customer): BrewKit | undefined {
  if (!isDrink(item)) return undefined;
  return customer.brewKit.find((kit) => kitMethods[kit].some((m) => item.brewMethods.includes(m)));
}

const kitLabel = (kit: BrewKit) => (brewKitOptions.find((k) => k.id === kit)?.label ?? kit).toLowerCase();

function matchesTaste(item: Item, customer: Customer): boolean {
  return Boolean(isDrink(item) && customer.taste && item.notes.some((n) => tasteNotes[customer.taste!].includes(n)));
}

interface Scored {
  item: Item;
  score: number;
  signals: Signal[];
  pairedWith?: Item;
  brews?: Item;
  kit?: BrewKit;
}

function score(item: Item, customer: Customer, ctx: Context): Scored {
  const signals: Signal[] = [];
  const pairedWith = pairedDrink(item, ctx.drinks);
  const brews = pairedWith ? undefined : drinkThisGearBrews(item, ctx.drinks);
  const kit = theirKitFor(item, customer);

  if (customer.goal && item.goalTags.includes(customer.goal)) signals.push('goalMatch');
  if (pairedWith) signals.push('pairsWithBox');
  if (brews) signals.push('brewsYourBox');
  if (kit) signals.push('brewsWithYourKit');
  if (matchesTaste(item, customer)) signals.push('tasteMatch');
  if ((customer.extras as string[] | undefined)?.includes(item.category)) signals.push('askedFor');
  if (item.price <= EASY_PRICE || item.isSample) signals.push('easyToTry');

  const total = signals.reduce((sum, s) => sum + POINTS[s], 0);
  return { item, score: total, signals, pairedWith, brews, kit };
}

/**
 * A bite or sweetener goes with a drink, so with no drink in the box there's nothing to go with:
 * it isn't suggested, unless they asked for one in onboarding.
 */
function needsADrink(item: Item, customer: Customer, ctx: Context): boolean {
  const foodAddOn = item.category === 'bites' || item.category === 'sweeteners';
  const askedFor = (customer.extras as string[] | undefined)?.includes(item.category);
  return foodAddOn && ctx.drinks.length === 0 && !askedFor;
}

// ---------- Step 4: reason line ----------

export function reasonFor(s: Scored, goalLabel: string): string {
  if (s.pairedWith) return `Goes with your ${s.pairedWith.name}`;
  if (s.brews) return `Brews your ${s.brews.name}`;
  if (s.signals.includes('goalMatch')) return `Fits ${goalLabel}`;
  if (s.kit) return `Brews with your ${kitLabel(s.kit)}`;
  if (s.signals.includes('tasteMatch')) return 'Suits your taste';
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
    .filter((item) => !needsADrink(item, customer, ctx))
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

/** How many cards an add-on's "Goes well with this" rail should have before best sellers top it up. */
export const MIN_ADD_ON_RAIL = 3;

/**
 * "Goes well with this" on an add-on's page: the drinks that belong with it. Gear: the drinks it can
 * brew (shared brew method). Bites and sweeteners: the drinks they pair with. The customer's limits
 * still apply. Fewer than MIN_ADD_ON_RAIL: best sellers top it up.
 */
export function recommendForAddOn(
  item: Item,
  customer: Customer,
  catalogue: Item[],
  bestSellerIds: string[],
  limit = DEFAULT_LIMIT,
): Suggestion[] {
  const fits = (i: Item) => i.id !== item.id && passesFilters(i, customer, []);
  const isGear = item.category === 'gear';
  const goesWith = (d: Item) =>
    isGear ? d.brewMethods.some((m) => item.brewMethods.includes(m)) : Boolean(d.pairsWith?.includes(item.id) || item.pairsWith?.includes(d.id));

  const partners: Suggestion[] = catalogue
    .filter((d) => isDrink(d) && fits(d) && goesWith(d))
    .sort((a, b) => a.price - b.price)
    .slice(0, limit)
    .map((d) => ({ item: d, score: 0, reason: isGear ? 'Brew it in this' : 'Pairs with this' }));

  if (partners.length >= MIN_ADD_ON_RAIL) return partners;
  const topUp: Suggestion[] = bestSellerIds
    .map((id) => catalogue.find((i) => i.id === id))
    .filter((i): i is Item => Boolean(i) && fits(i!) && !partners.some((p) => p.item.id === i!.id))
    .slice(0, MIN_ADD_ON_RAIL - partners.length)
    .map((i) => ({ item: i, score: 0, reason: 'Best seller' }));
  return [...partners, ...topUp];
}

/** Why an item can't be added on the shop grid (null if it can). */
export function unavailableReason(item: Item, customer: Customer): string | null {
  if (!item.inStock) return 'Back soon';
  if (item.caffeineLevel > customer.maxCaffeine) return 'Above your caffeine limit';
  const clash = item.contains.find((c) => customer.avoids.includes(c));
  if (clash) return `Contains ${clash}`;
  return null;
}
