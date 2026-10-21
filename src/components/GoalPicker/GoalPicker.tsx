import type { Goal } from '@/types';
import { goals as allGoals, type GoalInfo } from '@/data/goals';
import { Icon } from '../Icon';
import { useRadioGroup } from '../shared/useRadioGroup';

export interface GoalPickerProps {
  value: Goal;
  onChange: (goal: Goal) => void;
  goals?: GoalInfo[];
  label?: string;
  className?: string;
}

export function GoalPicker({ value, onChange, goals = allGoals, label = 'How do you want your day to feel?', className = '' }: GoalPickerProps) {
  const { getOptionProps } = useRadioGroup(goals.map((g) => g.id), value, onChange);

  return (
    <div role="radiogroup" aria-label={label} className={`grid grid-cols-1 gap-12 sm:grid-cols-2 ${className}`}>
      {goals.map((goal, i) => {
        const checked = goal.id === value;
        return (
          <div
            key={goal.id}
            {...getOptionProps(goal.id, i)}
            className={`relative flex min-h-44 cursor-pointer flex-col gap-4 rounded-card border p-16 transition-colors duration-120 ease-brew ${
              checked ? 'border-accent bg-bg-surface' : 'border-border hover:border-border-strong'
            }`}
          >
            <span className="font-mono text-eyebrow uppercase text-text-muted">{goal.eyebrow}</span>
            <span className="pr-32 font-display text-title">{goal.label}</span>
            <span className="text-body text-text-muted">{goal.blurb}</span>
            <span
              aria-hidden="true"
              className={`absolute right-16 top-16 flex size-24 items-center justify-center rounded-pill border ${
                checked ? 'border-accent bg-accent text-on-accent' : 'border-border-strong text-transparent'
              }`}
            >
              <Icon name="check" size={16} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
