import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogue } from '../data/catalogue';
import { defaultBox, defaultCustomer } from '../data/customer';
import { recommend, unavailableReason } from './recommend';
import { boxReducer, totals, type BoxState } from './box';

const ids = (goal = defaultCustomer.goal) =>
  recommend({ ...defaultCustomer, goal }, defaultBox, catalogue, { goalLabel: 'calm focus' }).map((s) => s.item.id);

test('worked example from prd.md (calm focus)', () => {
  assert.deepEqual(ids(), ['m-taster', 't-oolong', 'm-everyday', 'm-ceremonial', 'g-whisk-set', 'g-infuser']);
});

test('reason prefers an explicit pairing', () => {
  const rail = recommend(defaultCustomer, defaultBox, catalogue, { goalLabel: 'calm focus' });
  assert.equal(rail.find((s) => s.item.id === 'g-infuser')?.reason, 'Goes with your Shizuoka Sencha');
  assert.equal(rail.find((s) => s.item.id === 't-oolong')?.reason, 'Fits calm focus');
});

test('hard filters: caffeine limit, avoids, stock, already in box', () => {
  for (const goal of ['strong-start', 'calm-focus', 'no-crash', 'cutting-down'] as const) {
    const rail = ids(goal);
    assert.ok(!rail.includes('c-moka'), 'over caffeine limit');
    assert.ok(!rail.includes('c-night-shift'), 'over caffeine limit');
    assert.ok(!rail.includes('t-chai'), 'contains dairy');
    assert.ok(!rail.includes('g-grinder'), 'out of stock');
    assert.ok(!rail.includes('t-sencha'), 'already in box');
  }
});

test('ties break on lower price', () => {
  const rail = recommend(defaultCustomer, defaultBox, catalogue);
  for (let i = 1; i < rail.length; i++) {
    if (rail[i].score === rail[i - 1].score) assert.ok(rail[i].item.price >= rail[i - 1].item.price);
  }
});

test('empty when nothing scores', () => {
  const strict = { goal: 'cutting-down' as const, maxCaffeine: 1 as const, avoids: [] };
  const everythingInBox = catalogue.map((i) => ({ itemId: i.id, qty: 1 }));
  assert.equal(recommend(strict, everythingInBox, catalogue).length, 0);
});

test('unavailable reasons', () => {
  const byId = (id: string) => catalogue.find((i) => i.id === id)!;
  assert.equal(unavailableReason(byId('c-moka'), defaultCustomer), 'Above your caffeine limit');
  assert.equal(unavailableReason(byId('t-chai'), defaultCustomer), 'Contains dairy');
  assert.equal(unavailableReason(byId('g-grinder'), defaultCustomer), 'Back soon');
  assert.equal(unavailableReason(byId('t-oolong'), defaultCustomer), null);
});

test('reducer and totals', () => {
  let state: BoxState = { lines: defaultBox, goal: defaultCustomer.goal, plan: 'fortnightly' };
  state = boxReducer(state, { type: 'add', itemId: 'g-infuser' });
  state = boxReducer(state, { type: 'add', itemId: 't-sencha' });
  state = boxReducer(state, { type: 'remove', itemId: 'c-yirgacheffe' });
  assert.deepEqual(state.lines, [
    { itemId: 't-sencha', qty: 2 },
    { itemId: 'g-infuser', qty: 1 },
  ]);
  const t = totals(state.lines, catalogue, 0.1);
  assert.deepEqual(t, { count: 3, subtotal: 34, discount: 3.4, total: 30.6 });
});
