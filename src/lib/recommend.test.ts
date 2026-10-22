import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogue } from '../data/catalogue';
import { defaultBox, defaultCustomer } from '../data/customer';
import { recommend, recommendForItem, unavailableReason } from './recommend';
import { boxReducer, totals, type BoxState } from './box';

const ids = (goal = defaultCustomer.goal) =>
  recommend({ ...defaultCustomer, goal }, defaultBox, catalogue, { goalLabel: 'calm focus' }).map((s) => s.item.id);

const byId = (id: string) => catalogue.find((i) => i.id === id)!;

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

test('item page rail uses that drink as the context', () => {
  const rail = recommendForItem(byId('m-ceremonial'), defaultCustomer, catalogue);
  assert.equal(rail[0].item.id, 'g-whisk-set');
  assert.equal(rail[0].reason, 'Goes with your Kyoto Ceremonial Matcha');
  assert.ok(!rail.some((s) => s.item.id === 'm-ceremonial'));
});

test('unavailable reasons', () => {
  assert.equal(unavailableReason(byId('c-moka'), defaultCustomer), 'Above your caffeine limit');
  assert.equal(unavailableReason(byId('t-chai'), defaultCustomer), 'Contains dairy');
  assert.equal(unavailableReason(byId('g-grinder'), defaultCustomer), 'Back soon');
  assert.equal(unavailableReason(byId('t-oolong'), defaultCustomer), null);
});

test('reducer: quantities, and the rail only refreshes on preference changes', () => {
  let state: BoxState = { lines: defaultBox, plan: 'fortnightly', customer: defaultCustomer, railLines: defaultBox };
  state = boxReducer(state, { type: 'setQty', itemId: 'g-infuser', qty: 1 });
  state = boxReducer(state, { type: 'setQty', itemId: 't-sencha', qty: 2 });
  state = boxReducer(state, { type: 'setQty', itemId: 'c-yirgacheffe', qty: 0 });
  assert.deepEqual(state.lines, [
    { itemId: 't-sencha', qty: 2 },
    { itemId: 'g-infuser', qty: 1 },
  ]);
  assert.deepEqual(state.railLines, defaultBox, 'adding does not reshuffle the rail');

  state = boxReducer(state, { type: 'toggleAvoid', avoid: 'dairy' });
  assert.deepEqual(state.customer.avoids, []);
  assert.deepEqual(state.railLines, state.lines, 'a preference change refreshes it');
});

test('totals split drinks and gear', () => {
  const lines = [
    { itemId: 't-sencha', qty: 2 },
    { itemId: 'g-infuser', qty: 1 },
  ];
  assert.deepEqual(totals(lines, catalogue, 0.1), {
    drinkCount: 2,
    gearCount: 1,
    count: 3,
    subtotal: 34,
    discount: 3.4,
    total: 30.6,
  });
});
