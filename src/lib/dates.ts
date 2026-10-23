/**
 * Calendar dates as local 'YYYY-MM-DD' strings. Strings compare correctly with < and >, and they
 * avoid time-zone surprises from Date objects at midnight.
 */
export type ISODate = string;

const pad = (n: number) => String(n).padStart(2, '0');

export function toISO(date: Date): ISODate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromISO(iso: ISODate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const todayISO = (now: Date = new Date()): ISODate => toISO(now);

export function addDays(iso: ISODate, days: number): ISODate {
  const d = fromISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

export function addMonths(iso: ISODate, months: number): ISODate {
  const d = fromISO(iso);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return toISO(d);
}

export const isBefore = (a: ISODate, b: ISODate) => a < b;
export const monthKey = (iso: ISODate) => iso.slice(0, 7); // 'YYYY-MM'
export const startOfMonth = (iso: ISODate) => `${monthKey(iso)}-01`;

/** Monday-first weeks for the month containing `iso`. Days outside the month are null. */
export function monthGrid(iso: ISODate): (ISODate | null)[][] {
  const first = fromISO(startOfMonth(iso));
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Monday = 0
  const cells: (ISODate | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${monthKey(iso)}-${pad(d)}`);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (ISODate | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const fmt = (iso: ISODate, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', options).format(fromISO(iso));

/** Built from parts because engines differ on the comma after the weekday ("Tue, 3 Nov"). */
function parts(iso: ISODate, style: 'short' | 'long') {
  return new Intl.DateTimeFormat('en-GB', { weekday: style, day: 'numeric', month: style, year: 'numeric' })
    .formatToParts(fromISO(iso))
    .reduce<Record<string, string>>((acc, p) => ({ ...acc, [p.type]: p.value }), {});
}

/** "Tue 3 Nov" */
export function formatShort(iso: ISODate): string {
  const p = parts(iso, 'short');
  return `${p.weekday} ${p.day} ${p.month}`;
}

/** "Tuesday 3 November 2026" */
export function formatLong(iso: ISODate): string {
  const p = parts(iso, 'long');
  return `${p.weekday} ${p.day} ${p.month} ${p.year}`;
}

/** "Thursday 29 October" */
export function formatDay(iso: ISODate): string {
  const p = parts(iso, 'long');
  return `${p.weekday} ${p.day} ${p.month}`;
}

/** Fastest delivery slot: tomorrow. Today and anything earlier can't be picked. */
export const EARLIEST_LEAD_DAYS = 1;
export const earliestDeliveryISO = (now: Date = new Date()): ISODate => addDays(todayISO(now), EARLIEST_LEAD_DAYS);

/** "November 2026" */
export const formatMonth = (iso: ISODate) => fmt(iso, { month: 'long', year: 'numeric' });

export const weekdayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
export const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
