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
   * Pack shot base path, without size or extension. ProductImage loads
   * `${image}-304.webp` and `${image}-684.webp` (transparent, 3:4). Items without one show their icon.
   */
  image?: string;
  /** Drinks only: roughly how many cups one pack makes. Used to suggest how often to deliver. */
  cups?: number;
}

/** Optional onboarding answers (the "A few extras" screen). */
export type Taste = 'fruity' | 'chocolatey' | 'mellow';
/** Add-on categories a customer said yes to in onboarding ("Add something to try with your cup?"). */
export type Extra = 'bites' | 'sweeteners';

/** The onboarding answers, replayed and editable in Your preferences. */
export interface Customer {
  /** Null when the question was skipped: no goal score, and the rail gets a neutral title. */
  goal: Goal | null;
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
  /** Unset, or "not sure". */
  taste?: Taste;
  /** The only answer that can put an add-on in the starter box. Empty or unset means none. */
  extras?: Extra[];
}

export interface BoxLine {
  itemId: string;
  qty: number;
  /** Set on lines the starter box picked: why it's there ("For calm focus"). */
  pickedReason?: string;
  /** An add-on pre-added from `extras`: sent in the first box only, unless the customer keeps it. */
  firstBoxOnly?: boolean;
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
