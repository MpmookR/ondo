import { useRef, type KeyboardEvent } from 'react';

/**
 * Roving-tabindex radio group: arrow keys move selection, only the checked option is tabbable.
 * https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 */
export function useRadioGroup<T extends string | number>(options: readonly T[], value: T, onChange: (v: T) => void) {
  const refs = useRef<(HTMLElement | null)[]>([]);

  const move = (from: number, delta: number) => {
    const next = (from + delta + options.length) % options.length;
    onChange(options[next]);
    refs.current[next]?.focus();
  };

  const getOptionProps = (option: T, index: number) => ({
    ref: (el: HTMLElement | null) => {
      refs.current[index] = el;
    },
    role: 'radio' as const,
    'aria-checked': option === value,
    tabIndex: option === value ? 0 : -1,
    onClick: () => onChange(option),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        move(index, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        move(index, -1);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onChange(option);
      }
    },
  });

  return { getOptionProps };
}
