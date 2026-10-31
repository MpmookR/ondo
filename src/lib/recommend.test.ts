import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogue } from '../data/catalogue';
import { defaultBox, defaultCustomer } from '../data/customer';
import { recommend, recommendForAddOn, recommendForItem, unavailableReason } from './recommend';
import { boxReducer, totals, type BoxState } from './box';

const ids = (goal = defaultCustomer.goal) =>
  recommend({ ...defaultCustomer, goal }, defaultBox, catalogue, { goalLabel: 'calm focus' }).map((s) => s.item.id);

const byId = (id: string) => catalogue.find((i) => i.id === id)!;

test('worked example from prd.md (calm focus)', () => {
  assert.deepEqual(ids(), ['g-whisk-set', 'm-taster', 'b-dark-chocolate', 't-sencha', 't-oolong', 'm-everyday']);
});

test('reason prefers an explicit pairing', () => {
  const rail = recommend(defaultCustomer, defaultBox, catalogue, { goalLabel: 'calm focus' });
  assert.equal(rail.find((s) => s.item.id === 'g-whisk-set')?.reason, 'Goes with your Kyoto Ceremonial Matcha');
  assert.equal(rail.find((s) => s.item.id === 'b-dark-chocolate')?.reason, 'Goes with your Kyoto Ceremonial Matcha');
  assert.equal(rail.find((s) => s.item.id === 't-oolong')?.reason, 'Fits calm focus');
});

test('hard filters: caffeine limit, avoids, stock, already in box', () => {
  for (const goal of ['strong-start', 'calm-focus', 'no-crash', 'cutting-down'] as const) {
    const rail = ids(goal);
    assert.ok(!rail.includes('c-moka'), 'over caffeine limit');
    assert.ok(!rail.includes('c-night-shift'), 'over caffeine limit');
    assert.ok(!rail.includes('t-chai'), 'contains dairy');
    assert.ok(!rail.includes('g-grinder'), 'out of stock');
    assert.ok(!rail.includes('m-ceremonial'), 'already in box');
  }
});

test('add-ons: bites follow the avoids, and only gear can "brew" a drink', () => {
  const box = [{ itemId: 'c-moka', qty: 1 }];
  const strong = { ...defaultCustomer, goal: 'strong-start' as const, maxCaffeine: 5 as const, avoids: [] };
  const rail = recommend(strong, box, catalogue);
  assert.equal(rail.find((s) => s.item.id === 'b-biscotti')?.reason, 'Goes with your Moka Morning Blend');
  assert.ok(!recommend({ ...strong, avoids: ['nuts'] }, box, catalogue).some((s) => s.item.id === 'b-biscotti'), 'contains nuts');
  assert.ok(!rail.some((s) => s.item.category !== 'gear' && s.reason.startsWith('Brews')));
});

test('ties break on lower price', () => {
  const rail = recommend(defaultCustomer, defaultBox, catalogue);
  for (let i = 1; i < rail.length; i++) {
    if (rail[i].score === rail[i - 1].score) assert.ok(rail[i].item.price >= rail[i - 1].item.price);
  }
});

test('empty when nothing scores', () => {
  const strict = { ...defaultCustomer, goal: 'cutting-down' as const, maxCaffeine: 1 as const, avoids: [] };
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
  let state: BoxState = { lines: defaultBox, plan: 'every-15', customer: defaultCustomer, railLines: defaultBox, deliveryDate: null, answered: true };
  state = boxReducer(state, { type: 'setQty', itemId: 'g-infuser', qty: 1 });
  state = boxReducer(state, { type: 'setQty', itemId: 'm-ceremonial', qty: 2 });
  state = boxReducer(state, { type: 'setQty', itemId: 'c-yirgacheffe', qty: 0 });
  assert.deepEqual(state.lines, [
    { itemId: 'm-ceremonial', qty: 2 },
    { itemId: 's-vanilla-syrup', qty: 1 },
    { itemId: 'g-infuser', qty: 1 },
  ]);
  assert.deepEqual(state.railLines, defaultBox, 'adding does not reshuffle the rail');

  state = boxReducer(state, { type: 'toggleAvoid', avoid: 'dairy' });
  assert.deepEqual(state.customer.avoids, []);
  assert.deepEqual(state.railLines, state.lines, 'a preference change refreshes it');
});

test('reducer: onboarding answers update the customer and refresh the rail', () => {
  let state: BoxState = { lines: defaultBox, plan: 'every-15', customer: defaultCustomer, railLines: [], deliveryDate: null, answered: true };
  state = boxReducer(state, { type: 'updateCustomer', patch: { drinkers: 3, brewKit: [] } });
  assert.equal(state.customer.drinkers, 3);
  assert.deepEqual(state.customer.brewKit, []);
  assert.equal(state.customer.goal, defaultCustomer.goal, 'other answers are kept');
  assert.deepEqual(state.railLines, state.lines);
});

test('totals split drinks and gear', () => {
  const lines = [
    { itemId: 't-sencha', qty: 2 },
    { itemId: 'g-infuser', qty: 1 },
  ];
  assert.deepEqual(totals(lines, catalogue, 0.1), {
    drinkCount: 2,
    addOnCount: 1,
    count: 3,
    subtotal: 34,
    discount: 3.4,
    total: 30.6,
  });
});

test('onboarding answers: owned gear is never suggested', () => {
  const owner = { ...defaultCustomer, brewKit: ['whisk' as const] };
  const rail = recommend(owner, defaultBox, catalogue, { goalLabel: 'calm focus' }).map((s) => s.item.id);
  assert.ok(!rail.includes('g-whisk-set'), 'they already have a whisk');
});

test('onboarding answers: a drink their kit can brew scores, with the kit as its reason', () => {
  const c = { ...defaultCustomer, goal: null, brewKit: ['moka-pot' as const], maxCaffeine: 5 as const, avoids: [] };
  const moka = recommend(c, [], catalogue, { limit: 30 }).find((s) => s.item.id === 'c-half-half');
  assert.equal(moka?.reason, 'Brews with your moka pot');
});

test('onboarding answers: taste and asked-for add-ons lift the score', () => {
  const base = { ...defaultCustomer, goal: null, brewKit: [], avoids: [] };
  const score = (c: typeof base, id: string) => recommend(c, [], catalogue, { limit: 30 }).find((s) => s.item.id === id)?.score ?? 0;
  assert.equal(score({ ...base, taste: 'fruity' }, 't-honeybush') - score(base, 't-honeybush'), 1, 'orange is fruity');
  // With a drink in the box, so bites can be suggested either way.
  const withDrink = (c: typeof base) => recommend(c, [{ itemId: 't-sencha', qty: 1 }], catalogue, { limit: 30 }).find((s) => s.item.id === 'b-oat-cookies')?.score ?? 0;
  assert.equal(withDrink({ ...base, extras: ['bites'] }) - withDrink(base), 1);
});

test('no drinks in the box: no bites or sweeteners, unless asked for', () => {
  const ids = (c: typeof defaultCustomer) => recommend(c, [], catalogue, { limit: 30 }).map((s) => s.item.category);
  assert.ok(!ids(defaultCustomer).some((c) => c === 'bites' || c === 'sweeteners'));
  assert.ok(ids({ ...defaultCustomer, extras: ['bites'] }).includes('bites'));
});

test('add-on page: gear shows the drinks it brews; bites the drinks they pair with; best sellers top up', () => {
  const open = { ...defaultCustomer, maxCaffeine: 5 as const, avoids: [] };
  const best = ['c-moka', 't-sencha', 'm-everyday', 'c-night-shift'];
  const moka = recommendForAddOn(byId('g-moka-pot'), open, catalogue, best);
  // Two drinks brew in a moka pot, so one best seller (not already shown) tops it up to three.
  assert.deepEqual(moka.map((s) => [s.item.id, s.reason]), [
    ['c-half-half', 'Brew it in this'],
    ['c-moka', 'Brew it in this'],
    ['t-sencha', 'Best seller'],
  ]);
  // Oat cookies pair with Half & Half and the decaf: two, so one best seller tops it up to three.
  const cookies = recommendForAddOn(byId('b-oat-cookies'), open, catalogue, best);
  assert.deepEqual(cookies.map((s) => [s.item.id, s.reason]), [
    ['c-decaf', 'Pairs with this'],
    ['c-half-half', 'Pairs with this'],
    ['c-moka', 'Best seller'],
  ]);
});
