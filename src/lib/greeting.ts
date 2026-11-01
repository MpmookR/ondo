/** A greeting for the visitor's own time of day (their device clock). */
export type Greeting = 'Good morning.' | 'Good afternoon.' | 'Good evening.';

/** Morning 5:00–11:59, afternoon 12:00–17:59, evening the rest (night owls included). */
export function greetingFor(hour: number): Greeting {
  if (hour >= 5 && hour < 12) return 'Good morning.';
  if (hour >= 12 && hour < 18) return 'Good afternoon.';
  return 'Good evening.';
}
