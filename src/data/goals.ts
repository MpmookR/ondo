import type { Goal } from '@/types';

export interface GoalInfo {
  id: Goal;
  eyebrow: string;
  label: string;
  /** Used in the rail title: "For {railLabel}" */
  railLabel: string;
  blurb: string;
}

export const goals: GoalInfo[] = [
  { id: 'strong-start', eyebrow: '06:30', label: 'Strong morning start', railLabel: 'a strong start', blurb: 'Bold, full-bodied cups to get going.' },
  { id: 'calm-focus', eyebrow: '10:00', label: 'Calm focus', railLabel: 'calm focus', blurb: 'Steady energy for deep work.' },
  { id: 'no-crash', eyebrow: '15:00', label: 'Afternoon without the crash', railLabel: 'the afternoon', blurb: 'Lighter cups that keep you even.' },
  { id: 'cutting-down', eyebrow: 'Any time', label: 'Cutting down', railLabel: 'cutting down', blurb: 'Same ritual, less caffeine.' },
];

export const goalById = (id: Goal | null): GoalInfo | undefined => goals.find((g) => g.id === id);

/** The rail's title: the goal when there is one, otherwise a neutral one. */
export const railTitle = (id: Goal | null): string => {
  const goal = goalById(id);
  return goal ? `For ${goal.railLabel}` : 'Goes with your box';
};
