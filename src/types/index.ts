export type Category = 'coffee' | 'tea' | 'matcha' | 'gear';
export type DrinkCategory = Exclude<Category, 'gear'>;
export type Goal = 'strong-start' | 'calm-focus' | 'no-crash' | 'cutting-down';
export type BrewMethod = 'espresso' | 'filter' | 'moka' | 'cold-brew' | 'steep' | 'whisk';
export type CaffeineLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type PlanId = 'fortnightly' | 'monthly' | 'once';

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
}

export interface Customer {
  goal: Goal;
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
  discount: number; // 0.1 = 10% off
}

export interface Suggestion {
  item: Item;
  score: number;
  reason: string;
}
