import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../Icon';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-8 rounded-pill font-display text-label whitespace-nowrap ' +
  'transition-[background-color,color,opacity,transform] duration-120 ease-brew ' +
  'active:scale-98 disabled:pointer-events-none disabled:opacity-40';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-action text-action-text hover:opacity-90',
  accent: 'bg-accent text-on-accent hover:opacity-90',
  secondary: 'border border-border-strong text-text-primary hover:bg-bg-subtle',
  ghost: 'text-text-primary hover:bg-bg-subtle',
};

const sizes: Record<ButtonSize, string> = {
  md: 'h-44 px-20',
  lg: 'h-52 px-28',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  fullWidth,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const iconEl = icon ? <Icon name={icon} size={20} /> : null;
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {iconPosition === 'start' && iconEl}
      {children}
      {iconPosition === 'end' && iconEl}
    </button>
  );
}

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  /** Accessible name; required because there is no visible text. */
  label: string;
  variant?: 'secondary' | 'ghost' | 'accent';
}

const iconLooks = {
  secondary: 'border border-border-strong text-text-primary group-hover:bg-bg-subtle',
  ghost: 'text-text-primary group-hover:bg-bg-subtle',
  accent: 'bg-accent text-on-accent group-hover:opacity-90',
} as const;

/** 32px visual circle inside a 44px hit area. */
export function IconButton({ icon, label, variant = 'secondary', className = '', type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`group inline-flex size-44 items-center justify-center rounded-pill disabled:opacity-40 ${className}`}
      {...rest}
    >
      <span className={`inline-flex size-32 items-center justify-center rounded-pill transition-colors duration-120 ease-brew ${iconLooks[variant]}`}>
        <Icon name={icon} size={16} />
      </span>
    </button>
  );
}
