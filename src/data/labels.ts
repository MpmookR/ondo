import type { BrewMethod, Category } from '@/types';

export const categoryLabel: Record<Category, string> = {
  coffee: 'Coffee',
  tea: 'Tea',
  matcha: 'Matcha',
  gear: 'Gear',
};

export const categoryOrder: Category[] = ['coffee', 'tea', 'matcha', 'gear'];

export const brewMethodLabel: Record<BrewMethod, string> = {
  espresso: 'Espresso',
  filter: 'Filter',
  moka: 'Moka pot',
  'cold-brew': 'Cold brew',
  steep: 'Steep',
  whisk: 'Whisk',
};

/** Things a customer can ask us to avoid. Only dairy appears in the demo catalogue. */
export const avoidOptions = [{ id: 'dairy', label: 'Dairy' }] as const;

export const avoidLabel = (id: string) => avoidOptions.find((a) => a.id === id)?.label ?? id;


export type ShopTabId = 'for-you' | Category;
export const shopTabs: { id: ShopTabId; label: string }[] = [
  { id: 'for-you', label: 'For you' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'tea', label: 'Tea' },
  { id: 'matcha', label: 'Matcha' },
  { id: 'gear', label: 'Gear' },
];

/** The journey shown in the header: Your box is "Delivery" (step 2), checkout is "Payment" (step 3). */
export const CHECKOUT_STEPS = ['Sign up', 'Delivery', 'Payment'];
export const STEP_DELIVERY = 1;
export const STEP_PAYMENT = 2;
