import type { BoxLine, BrewKit, Customer, DrinkCategory, Extra, Item } from '../types';
import { brewKitOptions, categoryLabel, drinkCategories, isDrinkCategory } from '../data/labels';
import { goalById } from '../data/goals';
import { kitMethods, tasteNotes } from '../data/onboarding';
import { EASY_PRICE, passesFilters } from './recommend';

/**
 * The starter box: what onboarding puts in a new customer's first box.
 * It reuses the rail's filters and signals, so there is one recommendation system, not two.
 * Rules in doc/prd.md (Starter box); change both together.
 */

/** Points per signal for picking a drink. */
export const STARTER_POINTS = {
  goalMatch: 3,
  brewsWithKit: 1,
  tasteMatch: 1,
} as const;

/** Size the box to last about this long: the middle delivery option. */
export const TARGET_DAYS = 30;
export const MIN_PACKS = 1;
/** Keeps a large household's first box from getting very expensive. */
export const MAX_PACKS = 3;
/** One drink per drink type, at most this many. */
export const MAX_DRINKS = 3;

export interface LeftOut {
  category: DrinkCategory;
  reason: string;
}

export interface StarterBox {
  lines: BoxLine[];
  /** Drink types they asked for that had nothing to pick, with a line saying why. */
  leftOut: LeftOut[];
}

interface Candidate {
  item: Item;
  score: number;
  reason: string;
}

/** The kit they own that can brew this drink, if any. */
function kitThatBrews(item: Item, kit: BrewKit[]): BrewKit | undefined {
  return kit.find((k) => kitMethods[k].some((m) => item.brewMethods.includes(m)));
}

const kitLabel = (kit: BrewKit) => (brewKitOptions.find((k) => k.id === kit)?.label ?? kit).toLowerCase();

function scoreDrink(item: Item, customer: Customer): Candidate {
  const goal = goalById(customer.goal);
  const goalMatch = Boolean(customer.goal && item.goalTags.includes(customer.goal));
  const kit = kitThatBrews(item, customer.brewKit);
  const tasteMatch = Boolean(customer.taste && item.notes.some((n) => tasteNotes[customer.taste!].includes(n)));

  const score =
    (goalMatch ? STARTER_POINTS.goalMatch : 0) +
    (kit ? STARTER_POINTS.brewsWithKit : 0) +
    (tasteMatch ? STARTER_POINTS.tasteMatch : 0);

  // The most specific reason first: the goal, then the kit, then taste.
  const reason =
    goalMatch && goal ? `For ${goal.railLabel}` : kit ? `Brews with your ${kitLabel(kit)}` : tasteMatch ? 'Suits your taste' : 'A good place to start';
  return { item, score, reason };
}

/** Highest score first; ties go to the lower price (protects conversion). */
const byScoreThenPrice = (a: Candidate, b: Candidate) => b.score - a.score || a.item.price - b.item.price;

/** Drinks that can go in a starter box: full packs (tasters are for the rail) that pass the hard filters. */
function eligibleDrinks(customer: Customer, catalogue: Item[]): Item[] {
  return catalogue.filter((item) => isDrinkCategory(item.category) && !item.isSample && passesFilters(item, customer, []));
}

function whyNothing(category: DrinkCategory, customer: Customer, catalogue: Item[]): string {
  const ofType = catalogue.filter((i) => i.category === category && !i.isSample && i.inStock);
  const label = categoryLabel[category].toLowerCase();
  if (ofType.length > 0 && ofType.every((i) => i.caffeineLevel > customer.maxCaffeine)) {
    return `No ${label} under your caffeine limit`;
  }
  return `No ${label} that fits your answers`;
}

/** Step 3: the top drink per type they drink (or the single best one if they didn't say). */
function pickDrinks(customer: Customer, catalogue: Item[]): { picks: Candidate[]; leftOut: LeftOut[] } {
  const scored = eligibleDrinks(customer, catalogue).map((item) => scoreDrink(item, customer));
  if (customer.drinks.length === 0) {
    const best = [...scored].sort(byScoreThenPrice)[0];
    return { picks: best ? [best] : [], leftOut: [] };
  }
  const picks: Candidate[] = [];
  const leftOut: LeftOut[] = [];
  for (const category of drinkCategories.filter((c) => customer.drinks.includes(c))) {
    const best = scored.filter((c) => c.item.category === category).sort(byScoreThenPrice)[0];
    if (best) picks.push(best);
    else leftOut.push({ category, reason: whyNothing(category, customer, catalogue) });
  }
  return { picks: picks.slice(0, MAX_DRINKS), leftOut };
}

/** Step 4: packs per drink so the box lasts about TARGET_DAYS, between MIN_PACKS and MAX_PACKS. */
export function packsFor(item: Item, customer: Customer, drinkCount: number): number {
  const cupsNeeded = (customer.drinkers * customer.cupsPerDay * TARGET_DAYS) / Math.max(1, drinkCount);
  const packs = Math.round(cupsNeeded / (item.cups ?? cupsNeeded));
  return Math.min(MAX_PACKS, Math.max(MIN_PACKS, packs));
}

const pairs = (a: Item, b: Item) => Boolean(a.pairsWith?.includes(b.id) || b.pairsWith?.includes(a.id));

/**
 * Step 6: one add-on per category the customer said yes to, and only then. It must pair with a drink
 * in the box, pass the hard filters and be easy to try. Nothing qualifies: nothing is added (no filler).
 */
function pickAddOns(extras: Extra[], drinks: Item[], customer: Customer, catalogue: Item[]): BoxLine[] {
  const lines: BoxLine[] = [];
  for (const category of extras) {
    const best = catalogue
      .filter((i) => i.category === category && i.price <= EASY_PRICE && passesFilters(i, customer, []))
      .map((item) => ({ item, drink: drinks.find((d) => pairs(item, d)) }))
      .filter((c): c is { item: Item; drink: Item } => Boolean(c.drink))
      .sort((a, b) => a.item.price - b.item.price)[0];
    if (best) {
      lines.push({ itemId: best.item.id, qty: 1, firstBoxOnly: true, pickedReason: `Goes with your ${best.drink.name}` });
    }
  }
  return lines;
}

export function starterBox(customer: Customer, catalogue: Item[]): StarterBox {
  const { picks, leftOut } = pickDrinks(customer, catalogue);
  const drinkLines: BoxLine[] = picks.map((p) => ({
    itemId: p.item.id,
    qty: packsFor(p.item, customer, picks.length),
    pickedReason: p.reason,
  }));
  const addOnLines = pickAddOns(customer.extras ?? [], picks.map((p) => p.item), customer, catalogue);
  return { lines: [...drinkLines, ...addOnLines], leftOut };
}
