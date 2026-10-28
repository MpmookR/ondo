export type DrinkCategory = 'coffee' | 'tea' | 'matcha';
/** Everything that isn't a drink: brewing gear, something to eat, something to sweeten. */
export type AddOnCategory = 'gear' | 'bites' | 'sweeteners';
export type Category = DrinkCategory | AddOnCategory;
export type Goal = 'strong-start' | 'calm-focus' | 'no-crash' | 'cutting-down';
export type BrewMethod = 'espresso' | 'filter' | 'moka' | 'cold-brew' | 'steep' | 'whisk';
export type CaffeineLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type PlanId = 'every-15' | 'every-30' | 'every-45' | 'once';
/** Brewing kit a customer already owns (an onboarding answer), not the brew methods of an item. */
export type BrewKit = 'espresso-machine' | 'filter' | 'moka-pot' | 'cafetiere' | 'teapot' | 'whisk' | 'grinder';
/** 4 means "4 or more". */
export type Count = 1 | 2 | 3 | 4;

export interface BrewGuideData {
  ratio: string;
  tempC: number;
  time: string;
  steeps?: number;
  whisk?: string;
}

export interface Item {
  id: string;
  name: string;
  category: Category;
  description: string;
  notes: string[];
  caffeineLevel: CaffeineLevel;
  price: number;
  size: string;
  isSample?: boolean;
  brew?: BrewGuideData;
  brewMethods: BrewMethod[];
  contains: string[];
  goalTags: Goal[];
  pairsWith?: string[];
  inStock: boolean;
  /**
   * Drinks only: pack shot base path, without size or extension. ProductImage loads
   * `${image}-304.webp` and `${image}-684.webp` (transparent, 3:4). Items without one show their icon.
   */
  image?: string;
  /** Drinks only: roughly how many cups one pack makes. Used to suggest how often to deliver. */
  cups?: number;
}

/** The onboarding answers, replayed and editable in Your preferences. */
export interface Customer {
  goal: Goal;
  /** How many people drink it. */
  drinkers: Count;
  /** Cups a day, per person. */
  cupsPerDay: Count;
  /** What they drink now. Empty means "not sure yet". */
  drinks: DrinkCategory[];
  /** What they brew with. Empty means "nothing yet". */
  brewKit: BrewKit[];
  maxCaffeine: 1 | 2 | 3 | 4 | 5;
  avoids: string[];
}

export interface BoxLine {
  itemId: string;
  qty: number;
}

export interface Plan {
  id: PlanId;
  label: string;
  cadence: string;
  /** Days between deliveries; undefined for a one-off. */
  days?: number;
  discount: number; // 0.1 = 10% off
}

export interface Suggestion {
  item: Item;
  score: number;
  reason: string;
}
