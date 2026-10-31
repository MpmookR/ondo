import type { BoxLine, Customer } from '@/types';

/** The demo customer: answers from the onboarding quiz. */
export const defaultCustomer: Customer = {
  goal: 'calm-focus',
  drinkers: 1,
  cupsPerDay: 2,
  drinks: ['coffee', 'matcha'],
  brewKit: ['filter'],
  maxCaffeine: 4,
  avoids: ['dairy'],
};

/** A sample first box, for tests and stories. The app itself starts with an empty box. */
export const defaultBox: BoxLine[] = [
  { itemId: 'c-yirgacheffe', qty: 2 },
  { itemId: 'm-ceremonial', qty: 1 },
  { itemId: 's-vanilla-syrup', qty: 1 },
];
