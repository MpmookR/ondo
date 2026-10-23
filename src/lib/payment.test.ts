import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cardBrand, formatCardNumber, formatExpiry, luhn, validateCard } from './payment';

const now = new Date(2026, 9, 22);

test('brands', () => {
  assert.equal(cardBrand('4242 4242'), 'visa');
  assert.equal(cardBrand('5555'), 'mastercard');
  assert.equal(cardBrand('2223 0000'), 'mastercard');
  assert.equal(cardBrand('3782'), 'amex');
  assert.equal(cardBrand('6011'), 'unknown');
});

test('formatting as you type', () => {
  assert.equal(formatCardNumber('42424242424242429999'), '4242 4242 4242 4242');
  assert.equal(formatCardNumber('378282246310005'), '3782 822463 10005');
  assert.equal(formatExpiry('0'), '0');
  assert.equal(formatExpiry('0427'), '04/27');
  assert.equal(formatExpiry('04/2'), '04/2');
});

test('luhn', () => {
  assert.ok(luhn('4242 4242 4242 4242'));
  assert.ok(!luhn('4242 4242 4242 4241'));
});

test('a valid test card passes', () => {
  assert.deepEqual(validateCard({ number: '4242 4242 4242 4242', expiry: '04/28', cvc: '123' }, now), {});
  assert.deepEqual(validateCard({ number: '3782 822463 10005', expiry: '10/26', cvc: '1234' }, now), {}, 'this month is still valid');
});

test('errors say what to fix', () => {
  assert.deepEqual(validateCard({ number: '', expiry: '', cvc: '' }, now), {
    number: 'Enter your card number',
    expiry: 'Enter the expiry date',
    cvc: 'Enter the security code',
  });
  const e = validateCard({ number: '4242 4242 4242 4241', expiry: '09/26', cvc: '12' }, now);
  assert.equal(e.number, 'Check your card number');
  assert.equal(e.expiry, 'This card has expired');
  assert.equal(e.cvc, 'Enter the 3-digit code');
  assert.equal(validateCard({ number: '4242424242424242', expiry: '13/27', cvc: '123' }, now).expiry, 'Use the format MM/YY');
});
