import type { ButtonHTMLAttributes, Ref } from 'react';
import type { Category } from '@/types';
import { beat } from '../shared/Reveal';
import { Icon, type IconName } from '../Icon';

export interface ChoiceCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  /** Small text above the label, e.g. the time of day for a goal ("06:30"). */
  eyebrow?: string;
  /** One line under the label. */
  blurb?: string;
  icon?: IconName;
  /** Gives the icon a drink's accent (coffee, tea, matcha). The card itself stays neutral, so blue only ever means selected. */
  category?: Category;
  /** `card`: label and blurb, full width. `tile`: one big number or word, for 1 · 2 · 3 · 4+. */
  size?: 'card' | 'tile';
  /** `radio` for one answer (inside a `radiogroup`), `checkbox` for pick any. */
  kind: 'radio' | 'checkbox';
  checked: boolean;
  /** Which beat of the entrance it plays (options rise in one after another). */
  order?: number;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * One answer in onboarding: a big, friendly tap target. Cards with an eyebrow or a blurb sit at the
 * top, so their lines match across a row whatever the text length; a card with only an icon and a
 * label is centred. Selected answers turn blue (the system's
 * selected state) and a tick pops in. Options rise in one after another when a question opens.
 */
export function ChoiceCard({
  label,
  eyebrow,
  blurb,
  icon,
  category,
  size = 'card',
  kind,
  checked,
  order = 0,
  className = '',
  ref,
  ...rest
}: ChoiceCardProps) {
  const ariaChecked = kind === 'checkbox' ? { 'aria-pressed': checked } : { 'aria-checked': checked };
  const tile = size === 'tile';
  // Just an icon and a label: centre them. With a time or a blurb: top-align, so a row's lines match.
  const simple = !eyebrow && !blurb;
  return (
    <button
      ref={ref}
      type="button"
      role={kind === 'radio' ? 'radio' : undefined}
      {...ariaChecked}
      data-category={category}
      style={beat(order)}
      className={`group/choice relative flex min-h-64 w-full gap-12 rounded-card border-2 text-left animate-option-in motion-reduce:animate-none ${
        tile ? 'aspect-square flex-col items-center justify-center p-8 text-center lg:aspect-auto lg:py-24' : `${simple ? 'items-center' : 'items-start'} px-16 py-16 lg:px-20 lg:py-20`
      } transition-[background-color,border-color,transform,box-shadow] duration-200 ease-brew hover:-translate-y-2 hover:shadow-card active:scale-98 motion-reduce:hover:translate-y-0 ${
        checked
          ? 'border-primary bg-primary-subtle shadow-card'
          : 'border-border bg-bg-surface hover:border-border-strong'
      } ${className}`}
      {...rest}
    >
      {icon && (
        <span
          aria-hidden="true"
          className={`flex size-40 shrink-0 items-center justify-center rounded-pill transition-transform duration-200 ease-brew group-hover/choice:-rotate-6 motion-reduce:group-hover/choice:rotate-0 ${
            category ? 'bg-accent text-on-accent' : 'bg-bg-subtle text-text-primary'
          }`}
        >
          <Icon name={icon} size={20} />
        </span>
      )}
      <span className={`flex min-w-0 flex-1 flex-col ${tile ? 'items-center justify-center' : ''}`}>
        {eyebrow && <span className="font-mono text-footnote uppercase text-text-muted">{eyebrow}</span>}
        {/* Titles in Fira Sans like the homepage's headings; the weight never changes when chosen, so nothing jumps. */}
        <span className={`font-heading ${tile ? 'text-heading text-brand' : 'mt-2 text-title'}`}>{label}</span>
        {blurb && <span className={`font-sans text-body-sm text-text-muted ${tile ? '' : 'mt-4'}`}>{blurb}</span>}
      </span>
      {/* The tick pops in when chosen. Cards keep an empty circle so labels don't jump; tiles are
          too small for one, so their tick sits in the corner and only shows once chosen. */}
      {(!tile || checked) && (
        <span
          aria-hidden="true"
          className={`flex shrink-0 items-center justify-center rounded-pill ${tile ? 'absolute right-4 top-4 size-20' : 'size-24'} ${
            checked ? 'bg-primary text-on-primary animate-pop motion-reduce:animate-none' : 'border border-border-strong'
          }`}
        >
          {checked && <Icon name="check" size={16} />}
        </span>
      )}
    </button>
  );
}
