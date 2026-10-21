import type { Plan, PlanId } from '@/types';

export const plans: Plan[] = [
  { id: 'fortnightly', label: 'Every 2 weeks', cadence: 'every 2 weeks', discount: 0.1 },
  { id: 'monthly', label: 'Every 4 weeks', cadence: 'every 4 weeks', discount: 0.05 },
  { id: 'once', label: 'One-off box', cadence: 'once', discount: 0 },
];

export const planById = (id: PlanId): Plan => plans.find((p) => p.id === id) ?? plans[0];
