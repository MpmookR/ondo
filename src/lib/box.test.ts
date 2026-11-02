import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogue } from '../data/catalogue';
import { SKIPPED } from '../data/onboarding';
import { afterSaving, boxReducer, repeatRule, repeatingLines, totals, type BoxState } from './box';

const item = (id: string) => catalogue.find((i) => i.id === id)!;
const taster = catalogue.find((i) => i.isSample)!;

test('drinks repeat, gear and tasters come once, bites and sweeteners are the customer\'s choice', () => {
  assert.equal(repeatRule(item('c-decaf')), 'always');
  assert.equal(repeatRule(taster), 'once');
  assert.equal(repeatRule(item('g-moka-pot')), 'once');
  assert.equal(repeatRule(item('b-dark-chocolate')), 'choice');
  assert.equal(repeatRule(item('s-demerara')), 'choice');
});

const box: BoxState = {
  lines: [
    { itemId: 'c-decaf', qty: 2 },
    { itemId: 'g-moka-pot', qty: 1 },
    { itemId: 'b-dark-chocolate', qty: 1, pickedReason: 'Easy to try' },
  ],
  plan: 'every-15',
  customer: SKIPPED,
  railLines: [],
  deliveryDate: null,
  answered: true,
  ordered: false,
};

test('an add-on is first box only until they keep it', () => {
  assert.deepEqual(repeatingLines(box.lines, catalogue).map((l) => l.itemId), ['c-decaf']);
  const kept = boxReducer(box, { type: 'setEveryDelivery', itemId: 'b-dark-chocolate', on: true });
  assert.deepEqual(repeatingLines(kept.lines, catalogue).map((l) => l.itemId), ['c-decaf', 'b-dark-chocolate']);
  const dropped = boxReducer(kept, { type: 'setEveryDelivery', itemId: 'b-dark-chocolate', on: false });
  assert.equal(dropped.lines[2].everyDelivery, undefined);
  assert.equal(dropped.lines[2].pickedReason, 'Easy to try', 'the rest of the line is untouched');
});

test('later deliveries cost only what repeats, with the same saving', () => {
  const kept = boxReducer(box, { type: 'setEveryDelivery', itemId: 'b-dark-chocolate', on: true });
  const first = totals(kept.lines, catalogue, 0.1);
  const next = totals(repeatingLines(kept.lines, catalogue), catalogue, 0.1);
  const expected = Math.round((item('c-decaf').price * 2 + item('b-dark-chocolate').price) * 0.9 * 100) / 100;
  assert.equal(next.total, expected);
  assert.ok(next.total < first.total, 'the moka pot comes once');
});

test('a line price after the subscription saving, to the penny', () => {
  assert.equal(afterSaving(4, 0.1), 3.6);
  assert.equal(afterSaving(5.5, 0.05), 5.23);
  assert.equal(afterSaving(32, 0), 32);
});

test('the first box saves only on what repeats; keeping a bite adds it to the saving', () => {
  const first = totals(box.lines, catalogue, 0.1);
  assert.equal(first.discount, Math.round(item('c-decaf').price * 2 * 0.1 * 100) / 100);
  const kept = boxReducer(box, { type: 'setEveryDelivery', itemId: 'b-dark-chocolate', on: true });
  const withBite = totals(kept.lines, catalogue, 0.1);
  assert.equal(withBite.discount, Math.round((item('c-decaf').price * 2 + item('b-dark-chocolate').price) * 0.1 * 100) / 100);
});
