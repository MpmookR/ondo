'use client';

import type { PlanId } from '@/types';
import { plans } from '@/data/plans';
import { Icon } from '../Icon';
import { useRadioGroup } from '../shared/useRadioGroup';

const descriptions: Record<PlanId, string> = {
  fortnightly: 'The same box every 2 weeks. Skip, swap or pause any time.',
  monthly: 'The same box every 4 weeks. Skip, swap or pause any time.',
  once: 'Just this box, at full price. No subscription.',
};

const subLabel = (discount: number) => (discount > 0 ? `Save ${Math.round(discount * 100)}%` : 'Full price');

export interface FrequencySelectorProps {
  value: PlanId;
  onChange: (plan: PlanId) => void;
}

/** A box-wide setting (Frive's Plan Type pattern): a segmented pill, stacked below 560px of width. */
export function FrequencySelector({ value, onChange }: FrequencySelectorProps) {
  const { getOptionProps } = useRadioGroup(plans.map((p) => p.id), value, onChange);

  return (
    <section id="delivery" className="@container scroll-mt-16 rounded-card border border-border bg-bg-surface p-16 shadow-card">
      <div className="flex flex-col gap-8 @xl:flex-row @xl:items-center @xl:justify-between @xl:gap-24">
        <div className="flex flex-col gap-4 @xl:min-w-0 @xl:flex-1">
          <h2 id="frequency-label" className="flex items-center gap-8 font-display text-label">
            <Icon name="truck" size={20} />
            Delivery
          </h2>
          <p className="hidden font-serif text-body-sm text-text-muted @xl:block">{descriptions[value]}</p>
        </div>

        <div
          role="radiogroup"
          aria-labelledby="frequency-label"
          className="flex gap-4 rounded-pill bg-bg-subtle p-4 @xl:w-400 @xl:shrink-0"
        >
          {plans.map((plan, i) => {
            const selected = plan.id === value;
            return (
              <div
                key={plan.id}
                {...getOptionProps(plan.id, i)}
                className={`flex min-h-48 min-w-0 flex-1 flex-col items-center justify-center rounded-pill border-2 px-4 py-4 transition-colors duration-120 ease-brew ${
                  selected ? 'border-action bg-bg-surface' : 'border-transparent hover:bg-bg-page'
                }`}
              >
                <span className={`whitespace-nowrap font-display text-label ${selected ? 'font-bold' : 'font-medium'}`}>
                  {plan.label}
                </span>
                <span className="whitespace-nowrap font-display text-footnote text-text-muted">{subLabel(plan.discount)}</span>
              </div>
            );
          })}
        </div>

        <p className="px-4 font-serif text-body-sm text-text-muted @xl:hidden">{descriptions[value]}</p>
      </div>
    </section>
  );
}
