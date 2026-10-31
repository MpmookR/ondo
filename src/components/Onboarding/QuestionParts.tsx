import { Fragment, type ReactNode } from 'react';
import type { Count } from '@/types';
import { beat } from '../shared/Reveal';
import { Icon } from '../Icon';
import { ToggleChip } from '../Chip';

export interface QuestionHeadingProps {
  /** "Question 3", or "Optional" on the extras screen. */
  eyebrow: string;
  question: string;
  reason: string;
  /** Labels the question for the answers' group (`aria-labelledby`). */
  id: string;
}

/** The question: its words rise one by one, then the reason line fades up under it. */
export function QuestionHeading({ eyebrow, question, reason, id }: QuestionHeadingProps) {
  const words = question.split(' ');
  return (
    <div className="flex flex-col gap-8 lg:gap-16">
      <p className="font-sans text-eyebrow uppercase text-text-muted">{eyebrow}</p>
      <h1 id={id} tabIndex={-1} className="outline-none font-heading text-heading text-brand lg:text-hero">
        {words.map((word, i) => (
          // The space sits between the masks: inside an inline-block it would collapse.
          <Fragment key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden pb-4 align-bottom">
              <span className="inline-block animate-word-up-quick motion-reduce:animate-none" style={beat(i)}>
                {word}
              </span>
            </span>{' '}
          </Fragment>
        ))}
      </h1>
      <p className="font-sans text-body-lg text-text-muted animate-option-in motion-reduce:animate-none" style={beat(0)}>
        {reason}
      </p>
    </div>
  );
}

/** Most cups drawn in the tally; past this it just says the number. */
export const MAX_TALLY_CUPS = 16;

/**
 * "That's 4 cups a day between you", with a cup for each one popping in as the numbers change.
 * `drinkers` and `cupsPerDay` use 4 for "4 or more", so the total gets a "+".
 */
export function CupTally({ drinkers, cupsPerDay }: { drinkers: Count; cupsPerDay: Count }) {
  const total = drinkers * cupsPerDay;
  const plus = drinkers === 4 || cupsPerDay === 4 ? '+' : '';
  const shown = Math.min(total, MAX_TALLY_CUPS);
  const text =
    drinkers === 1
      ? `That's ${total}${plus} ${total === 1 ? 'cup' : 'cups'} a day`
      : `That's ${total}${plus} cups a day between you`;
  return (
    <div className="flex flex-col gap-8 rounded-card bg-bg-surface p-16 shadow-card" aria-live="polite">
      <ul aria-hidden="true" className="flex flex-wrap gap-4 text-spark">
        {Array.from({ length: shown }, (_, i) => (
          <li key={`${total}-${i}`} className="animate-cup-in motion-reduce:animate-none" style={beat(i)}>
            <Icon name="cup" size={20} />
          </li>
        ))}
      </ul>
      <p className="font-sans text-label">{text}</p>
    </div>
  );
}

export interface ChipChoice<T extends string> {
  id: T;
  label: string;
}

export interface ChipGroupProps<T extends string> {
  /** Names the group for screen readers (and shows above it when `showLegend`). */
  legend: string;
  showLegend?: boolean;
  options: ChipChoice<T>[];
  selected: T[];
  onChange: (next: T[]) => void;
  /** "None", "Nothing yet": choosing it clears the rest, and choosing another clears it. */
  noneLabel?: string;
  /** Whether "none" is the current answer (distinct from not answered yet). */
  noneSelected?: boolean;
  onNone?: () => void;
  /** Only one at a time (e.g. taste). */
  single?: boolean;
  order?: number;
}

/** Pick-any (or pick-one) chips for onboarding answers, with an optional "none" that clears the rest. */
export function ChipGroup<T extends string>({
  legend,
  showLegend = false,
  options,
  selected,
  onChange,
  noneLabel,
  noneSelected = false,
  onNone,
  single = false,
  order = 0,
}: ChipGroupProps<T>) {
  const toggle = (id: T, pressed: boolean) => {
    if (single) onChange(pressed ? [id] : []);
    else onChange(pressed ? [...selected, id] : selected.filter((s) => s !== id));
  };
  return (
    <fieldset className="flex flex-col gap-4 animate-option-in motion-reduce:animate-none" style={beat(order)}>
      <legend className={showLegend ? 'pb-4 font-sans text-label' : 'sr-only'}>{legend}</legend>
      <div className="flex flex-wrap gap-x-8">
        {options.map((o) => (
          <ToggleChip key={o.id} pressed={selected.includes(o.id)} onPressedChange={(p) => toggle(o.id, p)}>
            {selected.includes(o.id) && <Icon name="check" size={16} />}
            {o.label}
          </ToggleChip>
        ))}
        {noneLabel && onNone && (
          <ToggleChip pressed={noneSelected} onPressedChange={() => onNone()}>
            {noneSelected && <Icon name="check" size={16} />}
            {noneLabel}
          </ToggleChip>
        )}
      </div>
    </fieldset>
  );
}

/** A column that keeps answers readable on wide screens. */
export function AnswerArea({ children, labelledBy, role }: { children: ReactNode; labelledBy: string; role?: 'radiogroup' | 'group' }) {
  return (
    <div role={role ?? 'group'} aria-labelledby={labelledBy} className="flex flex-col gap-12">
      {children}
    </div>
  );
}
