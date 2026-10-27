import type { Plan, PlanId } from '@/types';

/** Delivery frequency. Saving: 10% every 15 days, 5% every 30 or 45 days, none for a one-off. */
export const plans: Plan[] = [
  { id: 'every-15', label: '15 days', cadence: 'every 15 days', days: 15, discount: 0.1 },
  { id: 'every-30', label: '30 days', cadence: 'every 30 days', days: 30, discount: 0.05 },
  { id: 'every-45', label: '45 days', cadence: 'every 45 days', days: 45, discount: 0.05 },
  { id: 'once', label: 'One-off', cadence: 'once', discount: 0 },
];

export const subscriptionPlans = plans.filter((p): p is Plan & { days: number } => p.days !== undefined);

export const planById = (id: PlanId): Plan => plans.find((p) => p.id === id) ?? plans[0];
