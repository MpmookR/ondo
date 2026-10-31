import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogue } from '../data/catalogue';
import { SKIPPED } from '../data/onboarding';
import type { Customer } from '../types';
import { boxReducer, type BoxState } from './box';
import { MAX_PACKS, starterBox } from './starterBox';

const customer: Customer = {
  goal: 'calm-focus',
  drinkers: 1,
  cupsPerDay: 2,
  drinks: ['coffee', 'matcha'],
  brewKit: ['filter'],
  maxCaffeine: 4,
  avoids: ['dairy'],
};

const ids = (c: Customer) => starterBox(c, catalogue).lines.map((l) => [l.itemId, l.qty]);

test('worked example from prd.md: one drink per type, sized to about 30 days', () => {
  // 60 cups needed, 30 per drink. Decaf (16 cups) x 2, Everyday matcha (25 cups) x 1: 57 cups, 28 days.
  assert.deepEqual(ids(customer), [
    ['c-decaf', 2],
    ['m-everyday', 1],
  ]);
});

test('each drink line carries its reason, most specific first', () => {
  const { lines } = starterBox(customer, catalogue);
  assert.equal(lines.find((l) => l.itemId === 'm-everyday')?.pickedReason, 'For calm focus');
  assert.equal(lines.find((l) => l.itemId === 'c-decaf')?.pickedReason, 'Brews with your filter');
});

test('add-ons only with a yes in extras: one per category, pairs with a drink, easy to try, first box only', () => {
  assert.ok(starterBox(customer, catalogue).lines.every((l) => !l.firstBoxOnly), 'no extras, no add-ons');
  const { lines } = starterBox({ ...customer, extras: ['bites', 'sweeteners'] }, catalogue);
  const addOns = lines.filter((l) => l.firstBoxOnly);
  // Rice crackers pair with the Everyday matcha. The vanilla syrup pairs too, but costs more than £6: no filler.
  assert.deepEqual(addOns, [
    { itemId: 'b-rice-crackers', qty: 1, firstBoxOnly: true, pickedReason: 'Goes with your Everyday Latte Matcha' },
  ]);
});

test('add-ons respect avoids', () => {
  const { lines } = starterBox({ ...customer, avoids: ['dairy', 'sesame'], extras: ['bites'] }, catalogue);
  assert.ok(!lines.some((l) => l.itemId === 'b-rice-crackers'), 'contains sesame');
});

test('never gear, never tasters', () => {
  const { lines } = starterBox({ ...customer, drinks: ['coffee', 'tea', 'matcha'], extras: ['bites', 'sweeteners'] }, catalogue);
  const items = lines.map((l) => catalogue.find((i) => i.id === l.itemId)!);
  assert.ok(items.every((i) => i.category !== 'gear'));
  assert.ok(items.every((i) => !i.isSample));
});

test('a large household is capped, so the delivery suggestion moves to every 15 days instead', () => {
  const lines = starterBox({ ...customer, drinkers: 4, cupsPerDay: 4 }, catalogue).lines;
  assert.ok(lines.every((l) => l.qty <= MAX_PACKS));
});

test('a drink type with nothing that fits is left out, with the reason', () => {
  const box = starterBox({ ...customer, maxCaffeine: 1 }, catalogue);
  assert.deepEqual(box.leftOut, [{ category: 'matcha', reason: 'No matcha under your caffeine limit' }]);
  assert.deepEqual(box.lines.map((l) => l.itemId), ['c-decaf']);
});

test('every question skipped: one safe drink, no add-ons', () => {
  const { lines } = starterBox(SKIPPED, catalogue);
  assert.equal(lines.length, 1);
  const item = catalogue.find((i) => i.id === lines[0].itemId)!;
  assert.ok(item.caffeineLevel <= SKIPPED.maxCaffeine);
});

test('startFirstBox replaces the sample box and refreshes the rail', () => {
  const box = starterBox(customer, catalogue).lines;
  const sample: BoxState = { lines: [{ itemId: 'c-moka', qty: 1 }], plan: 'every-15', customer: SKIPPED, railLines: [], deliveryDate: null };
  const next = boxReducer(sample, { type: 'startFirstBox', customer, lines: box });
  assert.deepEqual(next.lines, box);
  assert.deepEqual(next.railLines, box);
  assert.equal(next.customer, customer);
});
