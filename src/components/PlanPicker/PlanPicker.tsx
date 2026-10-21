import type { Plan, PlanId } from '@/types';
import { plans as allPlans } from '@/data/plans';
import { useRadioGroup } from '../shared/useRadioGroup';

export interface PlanPickerProps {
  value: PlanId;
  onChange: (plan: PlanId) => void;
  plans?: Plan[];
  className?: string;
}

/** Delivery plan as a radiogroup of PlanCards. */
export function PlanPicker({ value, onChange, plans = allPlans, className = '' }: PlanPickerProps) {
  const { getOptionProps } = useRadioGroup(plans.map((p) => p.id), value, onChange);
  return (
    <div role="radiogroup" aria-label="Delivery" className={`flex flex-col gap-8 ${className}`}>
      {plans.map((plan, i) => (
        <PlanCard key={plan.id} plan={plan} checked={plan.id === value} {...getOptionProps(plan.id, i)} />
      ))}
    </div>
  );
}

type OptionProps = ReturnType<ReturnType<typeof useRadioGroup>['getOptionProps']>;

export interface PlanCardProps extends Partial<OptionProps> {
  plan: Plan;
  checked: boolean;
}

export function PlanCard({ plan, checked, ...optionProps }: PlanCardProps) {
  return (
    <div
      {...optionProps}
      className={`flex min-h-52 cursor-pointer items-center gap-12 rounded-card border px-16 py-12 transition-colors duration-120 ease-brew ${
        checked ? 'border-accent bg-bg-surface' : 'border-border hover:border-border-strong'
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex size-20 shrink-0 items-center justify-center rounded-pill border-2 ${checked ? 'border-accent' : 'border-border-strong'}`}
      >
        {checked && <span className="size-10 rounded-pill bg-accent" />}
      </span>
      <span className="flex-1 font-display text-label">{plan.label}</span>
      {plan.discount > 0 && (
        <span className="rounded-pill bg-accent-subtle px-8 py-2 font-display text-caption">
          Save {Math.round(plan.discount * 100)}%
        </span>
      )}
    </div>
  );
}
