import type { AddOnCategory, BrewKit, BrewMethod, CaffeineLevel, Category, Count, DrinkCategory } from '@/types';

export const categoryLabel: Record<Category, string> = {
  coffee: 'Coffee',
  tea: 'Tea',
  matcha: 'Matcha',
  gear: 'Gear',
  bites: 'Bites',
  sweeteners: 'Sweeteners',
};

export const drinkCategories: DrinkCategory[] = ['coffee', 'tea', 'matcha'];
export const addOnCategories: AddOnCategory[] = ['gear', 'bites', 'sweeteners'];
export const categoryOrder: Category[] = [...drinkCategories, ...addOnCategories];

export const isDrinkCategory = (c: Category): c is DrinkCategory => (drinkCategories as Category[]).includes(c);
/** Bites and sweeteners are food: they always list what they contain. */
export const isFoodCategory = (c: Category) => c === 'bites' || c === 'sweeteners';

export const brewMethodLabel: Record<BrewMethod, string> = {
  espresso: 'Espresso',
  filter: 'Filter',
  moka: 'Moka pot',
  'cold-brew': 'Cold brew',
  steep: 'Steep',
  whisk: 'Whisk',
};

/** Things a customer can ask us to avoid; each appears in at least one item's `contains`. */
export const avoidOptions = [
  { id: 'dairy', label: 'Dairy' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'soya', label: 'Soya' },
  { id: 'sesame', label: 'Sesame' },
] as const;

export const avoidLabel = (id: string) => avoidOptions.find((a) => a.id === id)?.label ?? id;

/** Onboarding answers shown in Your preferences. */
export const counts: Count[] = [1, 2, 3, 4];
/** 4 means "4 or more". */
export const countLabel = (n: Count) => (n === 4 ? '4+' : String(n));

export const drinkOptions: { id: DrinkCategory; label: string }[] = [
  { id: 'coffee', label: 'Coffee' },
  { id: 'tea', label: 'Tea' },
  { id: 'matcha', label: 'Matcha' },
];

export const brewKitOptions: { id: BrewKit; label: string }[] = [
  { id: 'espresso-machine', label: 'Espresso machine' },
  { id: 'filter', label: 'Filter' },
  { id: 'moka-pot', label: 'Moka pot' },
  { id: 'cafetiere', label: 'Cafetière' },
  { id: 'teapot', label: 'Teapot or infuser' },
  { id: 'whisk', label: 'Matcha whisk' },
  { id: 'grinder', label: 'Grinder' },
];


/** The shop's caffeine filter on the drink tabs. Bands, so the choice stays simple. */
export type CaffeineBand = 'all' | 'low' | 'medium' | 'high';
export const caffeineBands: { id: Exclude<CaffeineBand, 'all'>; label: string; range: string; min: CaffeineLevel; max: CaffeineLevel }[] = [
  { id: 'low', label: 'Low', range: '0 to 2', min: 0, max: 2 },
  { id: 'medium', label: 'Medium', range: '3', min: 3, max: 3 },
  { id: 'high', label: 'High', range: '4 to 5', min: 4, max: 5 },
];
export function inCaffeineBand(level: CaffeineLevel, band: CaffeineBand): boolean {
  if (band === 'all') return true;
  const b = caffeineBands.find((x) => x.id === band)!;
  return level >= b.min && level <= b.max;
}

export type ShopTabId = 'for-you' | Category;
export const shopTabs: { id: ShopTabId; label: string }[] = [
  { id: 'for-you', label: 'For you' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'tea', label: 'Tea' },
  { id: 'matcha', label: 'Matcha' },
  { id: 'gear', label: 'Gear' },
  { id: 'bites', label: 'Bites' },
  { id: 'sweeteners', label: 'Sweeteners' },
];

/** The journey shown in the header: Your box is "Delivery" (step 2), checkout is "Payment" (step 3). */
export const CHECKOUT_STEPS = ['Sign up', 'Delivery', 'Payment'];
export const STEP_DELIVERY = 1;
export const STEP_PAYMENT = 2;
