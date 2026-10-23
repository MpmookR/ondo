'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import {
  addDays,
  addMonths,
  earliestDeliveryISO,
  formatLong,
  formatMonth,
  formatShort,
  isBefore,
  monthGrid,
  monthKey,
  startOfMonth,
  todayISO,
  weekdayLabels,
  weekdayNames,
  type ISODate,
} from '@/lib/dates';
import { Icon } from '../Icon';

export interface DatePickerProps {
  value: ISODate | null;
  onChange: (date: ISODate) => void;
  /** Earliest selectable date. Defaults to tomorrow (the fastest delivery slot). */
  min?: ISODate;
  /** Accessible name for the dialog and the trigger, e.g. "First delivery date". */
  label: string;
  placeholder?: string;
  /** `field`: date in a bordered box (Your box). `link`: an underlined "Change" link (checkout). */
  trigger?: 'field' | 'link';
}

/**
 * Trigger button + calendar popover. Dates before `min` (default: tomorrow) are disabled.
 * Keyboard: arrows move a day/week, Home/End go to the start/end of the week,
 * Page Up/Down change month, Enter or Space pick, Escape closes.
 */
export function DatePicker({ value, onChange, min, label, placeholder = 'Choose a date', trigger = 'field' }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [earliest, setEarliest] = useState<ISODate | null>(min ?? null);
  const [focused, setFocused] = useState<ISODate | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  const dialogId = useId();
  const titleId = useId();

  const lowest = earliest ?? earliestDeliveryISO();
  const clamp = (d: ISODate) => (isBefore(d, lowest) ? lowest : d);

  const openPanel = () => {
    // Work out "today" when the calendar opens (in the browser), not when the page was built.
    const start = min ?? earliestDeliveryISO();
    setEarliest(start);
    setFocused(value && !isBefore(value, start) ? value : start);
    setOpen(true);
  };
  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };
  const pick = (date: ISODate) => {
    if (isBefore(date, lowest)) return;
    onChange(date);
    close();
  };

  // Move DOM focus to the focused day whenever it changes.
  useEffect(() => {
    if (!open || !focused) return;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus();
  }, [open, focused]);

  // Close on a click outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) close(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const onGridKey = (e: KeyboardEvent) => {
    if (!focused) return;
    const weekday = (new Date(`${focused}T12:00`).getDay() + 6) % 7;
    const moves: Record<string, () => ISODate> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -weekday),
      End: () => addDays(focused, 6 - weekday),
      PageUp: () => addMonths(focused, -1),
      PageDown: () => addMonths(focused, 1),
    };
    if (moves[e.key]) {
      e.preventDefault();
      setFocused(clamp(moves[e.key]()));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(focused);
    }
  };

  const month = focused ?? lowest;
  const canGoBack = monthKey(month) > monthKey(lowest);
  const today = todayISO();

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : openPanel())}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        aria-label={value ? `${label}: ${formatLong(value)}. Change date` : `${label}: ${placeholder}`}
        className={
          trigger === 'link'
            ? "relative font-sans text-label font-bold underline underline-offset-4 before:absolute before:-inset-x-8 before:-inset-y-12 before:content-['']"
            : 'flex min-h-36 items-center gap-12 rounded-sm border border-border-strong px-8 font-sans text-label'
        }
      >
        {trigger === 'link' ? (
          'Change'
        ) : (
          <>
            {value ? formatShort(value) : placeholder}
            <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
          </>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation();
              close();
            }
          }}
          className="absolute right-0 top-full z-40 mt-8 w-312 rounded-card border border-border bg-bg-surface p-12 shadow-raised"
        >
          <div className="mb-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setFocused(clamp(addMonths(month, -1)))}
              disabled={!canGoBack}
              aria-label="Previous month"
              className="grid size-40 place-items-center rounded-pill hover:bg-bg-subtle disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Icon name="chevron-left" size={20} />
            </button>
            <h2 id={titleId} className="font-heading text-label font-bold" aria-live="polite">
              <span className="sr-only">{label}, </span>
              {formatMonth(month)}
            </h2>
            <button
              type="button"
              onClick={() => setFocused(clamp(startOfMonth(addMonths(month, 1))))}
              aria-label="Next month"
              className="grid size-40 place-items-center rounded-pill hover:bg-bg-subtle"
            >
              <Icon name="chevron-left" size={20} className="rotate-180" />
            </button>
          </div>

          <table ref={gridRef} role="grid" aria-labelledby={titleId} onKeyDown={onGridKey} className="w-full border-collapse">
            <thead>
              <tr>
                {weekdayLabels.map((d, i) => (
                  <th key={d} scope="col" abbr={weekdayNames[i]} className="pb-4 font-sans text-footnote font-semibold text-text-muted">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthGrid(month).map((week, w) => (
                <tr key={w}>
                  {week.map((date, i) => {
                    if (!date) return <td key={i} />;
                    const past = isBefore(date, lowest);
                    const selected = date === value;
                    const isToday = date === today;
                    return (
                      <td key={date} className="p-0 text-center" aria-selected={selected || undefined}>
                        <button
                          type="button"
                          data-date={date}
                          tabIndex={date === focused ? 0 : -1}
                          disabled={past}
                          aria-label={`${formatLong(date)}${isToday ? ', today' : ''}${past ? ', unavailable' : ''}`}
                          onClick={() => pick(date)}
                          onFocus={() => setFocused(date)}
                          className={`mx-auto grid size-40 place-items-center rounded-pill font-sans text-body-sm tabular-nums transition-colors duration-120 ease-brew ${
                            selected
                              ? 'bg-brand font-bold text-on-brand'
                              : past
                                ? 'cursor-not-allowed text-text-muted line-through opacity-40'
                                : `hover:bg-bg-subtle ${isToday ? 'border border-primary font-bold' : ''}`
                          }`}
                        >
                          {Number(date.slice(8))}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-8 px-4 font-sans text-footnote text-text-muted">Earliest delivery is tomorrow.</p>
        </div>
      )}
    </div>
  );
}
