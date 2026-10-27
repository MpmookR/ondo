import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogue } from '../data/catalogue';
import { defaultBox, defaultCustomer } from '../data/customer';
import { cupsInBox, suggestDelivery } from './delivery';

test('cups in the box count drinks only', () => {
  // Yirgacheffe 16 + Sencha 25; the pour-over set makes none.
  assert.equal(cupsInBox([...defaultBox, { itemId: 'g-pour-over', qty: 1 }], catalogue), 41);
  assert.equal(cupsInBox([{ itemId: 't-sencha', qty: 2 }], catalogue), 50);
});

test('suggests the frequency closest to how long the box lasts', () => {
  // 41 cups, 1 person, 2 a day: 20 days, so every 15 days.
  assert.deepEqual(suggestDelivery(defaultBox, catalogue, defaultCustomer), {
    planId: 'every-15', cupsInBox: 41, cupsPerDay: 2, daysLasting: 20, runsShort: false,
  });
  // 1 a day: 41 days, closest to 45.
  assert.equal(suggestDelivery(defaultBox, catalogue, { ...defaultCustomer, cupsPerDay: 1 })?.planId, 'every-45');
  // 5 Yirgacheffe + 1 Sencha = 105 cups, 2 people × 2 cups: 26 days, closest to 30.
  const big = [{ itemId: 'c-yirgacheffe', qty: 5 }, { itemId: 't-sencha', qty: 1 }];
  assert.equal(suggestDelivery(big, catalogue, { ...defaultCustomer, drinkers: 2 })?.planId, 'every-30');
  // 3 packs of Assam (150 cups) at 2 a day: 75 days, so every 45 days.
  assert.equal(suggestDelivery([{ itemId: 't-assam', qty: 3 }], catalogue, defaultCustomer)?.planId, 'every-45');
});

test('people multiply the cups a day', () => {
  // 2 people × 2 cups = 4 a day: 41 cups last 10 days, shorter than the most frequent delivery.
  const s = suggestDelivery(defaultBox, catalogue, { ...defaultCustomer, drinkers: 2 });
  assert.equal(s?.cupsPerDay, 4);
  assert.equal(s?.daysLasting, 10);
  assert.equal(s?.planId, 'every-15');
  assert.equal(s?.runsShort, true);
});

test('no suggestion without drinks', () => {
  assert.equal(suggestDelivery([{ itemId: 'g-pour-over', qty: 1 }], catalogue, defaultCustomer), null);
  assert.equal(suggestDelivery([], catalogue, defaultCustomer), null);
});
