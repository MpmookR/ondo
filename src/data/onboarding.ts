import type { IconName } from '@/components/Icon';
import type { BrewKit, BrewMethod, Customer, DrinkCategory, Extra, Taste } from '@/types';

/**
 * Onboarding: the questions, their reason lines and the safe defaults used when one is skipped.
 * Rules and copy are in doc/prd.md (Onboarding: build your first box); change both together.
 */

export type StepId = 'goal' | 'drinkers' | 'cups' | 'drinks' | 'brewKit' | 'caffeine' | 'avoids' | 'extras';

export interface StepCopy {
  id: StepId;
  question: string;
  /** One line under the question: why we ask. */
  reason: string;
}

export const onboardingSteps: StepCopy[] = [
  { id: 'goal', question: 'How do you want your day to feel?', reason: 'So we suggest things that fit your day.' },
  { id: 'drinkers', question: 'How many people drink it?', reason: 'So the box is the right size.' },
  { id: 'cups', question: 'How many cups a day, each?', reason: "So you don't run out between deliveries." },
  { id: 'drinks', question: 'What do you drink now?', reason: 'So your first box starts with what you know.' },
  { id: 'brewKit', question: 'What do you brew with?', reason: 'So we send beans and leaves you can brew.' },
  { id: 'caffeine', question: "What's your caffeine limit?", reason: "We'll never suggest anything stronger." },
  { id: 'avoids', question: 'Anything to avoid?', reason: "We'll leave these out of everything we suggest." },
  { id: 'extras', question: 'A few extras', reason: 'Optional, for better picks.' },
];

/** Answers when a question is skipped: safe, never a guess that could break a hard filter. */
export const SKIPPED: Customer = {
  goal: null,
  drinkers: 1,
  cupsPerDay: 2,
  drinks: [],
  brewKit: [],
  maxCaffeine: 3,
  avoids: [],
};

/** Which kit suits which drink, so a tea drinker isn't asked about espresso machines. */
export const kitFor: Record<BrewKit, DrinkCategory[]> = {
  'espresso-machine': ['coffee'],
  filter: ['coffee'],
  'moka-pot': ['coffee'],
  cafetiere: ['coffee'],
  grinder: ['coffee'],
  teapot: ['tea'],
  whisk: ['matcha'],
};

/** The brew methods a piece of kit can do (a grinder brews nothing on its own). */
export const kitMethods: Record<BrewKit, BrewMethod[]> = {
  'espresso-machine': ['espresso'],
  filter: ['filter'],
  'moka-pot': ['moka'],
  cafetiere: ['filter'],
  grinder: [],
  teapot: ['steep'],
  whisk: ['whisk'],
};

/** An example drink per caffeine level, so the 1–5 scale means something. */
export const caffeineExample: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'About a cup of decaf',
  2: 'About a cup of green tea',
  3: 'About a cup of black tea or matcha',
  4: 'About a cup of filter coffee',
  5: 'About a double espresso',
};

export const tasteOptions: { id: Taste | 'not-sure'; label: string }[] = [
  { id: 'fruity', label: 'Bright and fruity' },
  { id: 'chocolatey', label: 'Chocolatey and nutty' },
  { id: 'mellow', label: 'Smooth and mellow' },
  { id: 'not-sure', label: 'Not sure' },
];

/** Tasting notes that count as each taste (matched against an item's `notes`). */
export const tasteNotes: Record<Taste, string[]> = {
  fruity: ['jasmine', 'bergamot', 'peach', 'cherry', 'orange', 'plum', 'orchid'],
  chocolatey: ['cocoa', 'toffee', 'hazelnut', 'dark chocolate', 'chocolate', 'molasses', 'caramel', 'malt', 'nutty'],
  mellow: ['sweet cream', 'cream', 'honey', 'sweet pea', 'umami', 'grassy'],
};

export const extraOptions: { id: Extra; label: string; icon: IconName }[] = [
  { id: 'bites', label: 'Bites', icon: 'cookie' },
  { id: 'sweeteners', label: 'Sweetener', icon: 'jar' },
];
