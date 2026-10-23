import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDays, addMonths, earliestDeliveryISO, formatLong, formatShort, isBefore, monthGrid, todayISO } from './dates';

test('today uses the local calendar date', () => {
  assert.equal(todayISO(new Date(2026, 9, 22, 23, 59)), '2026-10-22');
});

test('past dates compare before today', () => {
  assert.ok(isBefore('2026-10-21', '2026-10-22'));
  assert.ok(!isBefore('2026-10-22', '2026-10-22'), 'today is not in the past');
  assert.ok(isBefore('2025-12-31', '2026-01-01'));
});

test('earliest delivery is tomorrow, so today is not selectable', () => {
  const now = new Date(2026, 9, 22, 9, 0);
  assert.equal(earliestDeliveryISO(now), '2026-10-23');
  assert.ok(isBefore(todayISO(now), earliestDeliveryISO(now)));
  assert.equal(earliestDeliveryISO(new Date(2026, 9, 31, 23, 0)), '2026-11-01', 'month end');
});

test('adding days and months crosses boundaries', () => {
  assert.equal(addDays('2026-10-29', 7), '2026-11-05');
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(addMonths('2026-12-15', 1), '2027-01-15');
});

test('month grid is Monday-first with blanks', () => {
  const grid = monthGrid('2026-11-10'); // 1 Nov 2026 is a Sunday
  assert.deepEqual(grid[0], [null, null, null, null, null, null, '2026-11-01']);
  assert.equal(grid.flat().filter(Boolean).length, 30);
  assert.ok(grid.every((week) => week.length === 7));
});

test('formatting in en-GB', () => {
  assert.equal(formatShort('2026-11-03'), 'Tue 3 Nov');
  assert.equal(formatLong('2026-11-03'), 'Tuesday 3 November 2026');
});
