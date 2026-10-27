import type { BoxLine, Customer } from '@/types';

/** The demo customer: answers from the onboarding quiz. */
export const defaultCustomer: Customer = {
  goal: 'calm-focus',
  drinkers: 1,
  cupsPerDay: 2,
  drinks: ['coffee', 'tea'],
  brewKit: ['filter', 'teapot'],
  maxCaffeine: 4,
  avoids: ['dairy'],
};

/** First box, pre-filled from the quiz. */
export const defaultBox: BoxLine[] = [
  { itemId: 'c-yirgacheffe', qty: 1 },
  { itemId: 't-sencha', qty: 1 },
];
