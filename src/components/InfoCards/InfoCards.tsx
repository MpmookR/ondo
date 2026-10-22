'use client';

import { useId, useState } from 'react';
import type { CaffeineLevel, Customer, Goal } from '@/types';
import { goals } from '@/data/goals';
import { avoidOptions } from '@/data/labels';
import { caffeineLabel } from '../CaffeineMeter';
import { ToggleChip } from '../Chip';
import { Icon, type IconName } from '../Icon';
import { useRadioGroup } from '../shared/useRadioGroup';

export const cardClass = 'rounded-card border border-border bg-bg-surface shadow-card';

function Badge({ icon }: { icon: IconName }) {
  return (
    <span data-category="matcha" className="grid size-32 shrink-0 place-items-center rounded-pill bg-accent-subtle text-text-primary">
      <Icon name={icon} size={20} />
    </span>
  );
}

export function DeliveryCard({ date }: { date: string }) {
  return (
    <div className={`flex items-center justify-between gap-8 p-8 ${cardClass}`}>
      <span className="flex items-center gap-8 font-display text-label">
        <Badge icon="truck" />
        Your first delivery
      </span>
      <button
        type="button"
        className="flex min-h-36 items-center gap-12 rounded-sm border border-border-strong px-8 font-display text-label"
        aria-label={`First delivery ${date}, change date`}
      >
        {date}
        <Icon name="chevron-down" size={20} />
      </button>
    </div>
  );
}

export interface PreferencesCardProps {
  customer: Customer;
  onGoalChange: (goal: Goal) => void;
  onMaxCaffeineChange: (level: Customer['maxCaffeine']) => void;
  onToggleAvoid: (avoid: string) => void;
  defaultOpen?: boolean;
}

const levels = [1, 2, 3, 4, 5] as const;

/** The quiz answers, replayed and editable. Collapsed by default; changes re-rank the rail. */
export function PreferencesCard({ customer, onGoalChange, onMaxCaffeineChange, onToggleAvoid, defaultOpen = false }: PreferencesCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const goalGroup = useRadioGroup(goals.map((g) => g.id), customer.goal, onGoalChange);
  const levelGroup = useRadioGroup(levels, customer.maxCaffeine, onMaxCaffeineChange);
  const goal = goals.find((g) => g.id === customer.goal);

  return (
    <div className={`flex flex-col gap-8 p-8 ${cardClass}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-36 w-full items-center justify-between gap-8 text-left"
      >
        <span className="flex items-center gap-8 font-display text-label">
          <Badge icon="sliders" />
          Your preferences
        </span>
        <span className="flex items-center gap-4 font-display text-caption text-text-muted">
          {!open && <span className="max-w-128 truncate">{goal?.label}</span>}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} className="text-text-primary" />
        </span>
      </button>

      <div id={panelId} hidden={!open} className="flex flex-col gap-16 px-4 pb-8">
        <fieldset className="flex flex-col gap-8">
          <legend className="mb-8 font-display text-caption uppercase tracking-wide text-text-muted">Goal</legend>
          <div role="radiogroup" aria-label="Goal" className="grid grid-cols-2 gap-8">
            {goals.map((g, i) => {
              const checked = g.id === customer.goal;
              return (
                <div
                  key={g.id}
                  {...goalGroup.getOptionProps(g.id, i)}
                  className={`flex min-h-44 flex-col justify-center rounded-sm border px-12 py-8 transition-colors duration-120 ease-brew ${
                    checked ? 'border-action bg-bg-page' : 'border-border hover:border-border-strong'
                  }`}
                >
                  <span className="font-mono text-footnote uppercase text-text-muted">{g.eyebrow}</span>
                  <span className={`font-display text-label ${checked ? 'font-bold' : 'font-medium'}`}>{g.label}</span>
                </div>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-8 font-display text-caption uppercase tracking-wide text-text-muted">Caffeine limit</legend>
          <div role="radiogroup" aria-label="Caffeine limit" className="flex gap-4 rounded-pill bg-bg-subtle p-4">
            {levels.map((level, i) => {
              const checked = level === customer.maxCaffeine;
              return (
                <div
                  key={level}
                  {...levelGroup.getOptionProps(level, i)}
                  aria-label={`Up to ${level}, ${caffeineLabel[level as CaffeineLevel].toLowerCase()}`}
                  className={`flex min-h-36 flex-1 items-center justify-center rounded-pill border-2 font-display text-label tabular-nums transition-colors duration-120 ease-brew ${
                    checked ? 'border-action bg-bg-surface font-bold' : 'border-transparent text-text-muted'
                  }`}
                >
                  {level}
                </div>
              );
            })}
          </div>
          <p className="mt-4 px-4 font-serif text-footnote text-text-muted">
            We won&apos;t suggest anything above {customer.maxCaffeine} of 5 ({caffeineLabel[customer.maxCaffeine].toLowerCase()}).
          </p>
        </fieldset>

        <fieldset>
          <legend className="font-display text-caption uppercase tracking-wide text-text-muted">Avoid</legend>
          <div className="flex flex-wrap gap-x-8">
            {avoidOptions.map((a) => (
              <ToggleChip key={a.id} pressed={customer.avoids.includes(a.id)} onPressedChange={() => onToggleAvoid(a.id)}>
                {customer.avoids.includes(a.id) && <Icon name="check" size={16} />}
                {a.label}
              </ToggleChip>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
