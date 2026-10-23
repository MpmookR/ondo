/**
 * Card form helpers for the demo checkout. Nothing is sent anywhere: these only format what the
 * customer types and check it looks like a real card before the (pretend) payment.
 */

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'unknown';

export const digitsOnly = (value: string) => value.replace(/\D/g, '');

export function cardBrand(value: string): CardBrand {
  const d = digitsOnly(value);
  if (/^4/.test(d)) return 'visa';
  if (/^3[47]/.test(d)) return 'amex';
  if (/^(5[1-5]|2(2[2-9][1-9]|2[3-9]\d|[3-6]\d\d|7[01]\d|720))/.test(d)) return 'mastercard';
  return 'unknown';
}

const lengthFor = (brand: CardBrand) => (brand === 'amex' ? 15 : 16);
const cvcLengthFor = (brand: CardBrand) => (brand === 'amex' ? 4 : 3);

/** "4242424242424242" → "4242 4242 4242 4242"; Amex as 4-6-5. */
export function formatCardNumber(value: string): string {
  const brand = cardBrand(value);
  const d = digitsOnly(value).slice(0, lengthFor(brand));
  const groups = brand === 'amex' ? [4, 6, 5] : [4, 4, 4, 4];
  const out: string[] = [];
  let i = 0;
  for (const size of groups) {
    if (i >= d.length) break;
    out.push(d.slice(i, i + size));
    i += size;
  }
  return out.join(' ');
}

/** "0427" → "04/27"; adds the slash as you type. */
export function formatExpiry(value: string): string {
  const d = digitsOnly(value).slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`;
}

/** Luhn checksum: catches most typos in a card number. */
export function luhn(value: string): boolean {
  const d = digitsOnly(value);
  if (d.length < 12) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

export interface CardInput {
  number: string;
  expiry: string;
  cvc: string;
}

export type CardErrors = Partial<Record<keyof CardInput, string>>;

export function validateCard(card: CardInput, now: Date = new Date()): CardErrors {
  const errors: CardErrors = {};
  const brand = cardBrand(card.number);
  const number = digitsOnly(card.number);

  if (!number) errors.number = 'Enter your card number';
  else if (number.length !== lengthFor(brand) || !luhn(number)) errors.number = 'Check your card number';

  const exp = digitsOnly(card.expiry);
  if (!exp) errors.expiry = 'Enter the expiry date';
  else {
    const month = Number(exp.slice(0, 2));
    const year = 2000 + Number(exp.slice(2, 4));
    if (exp.length !== 4 || month < 1 || month > 12) errors.expiry = 'Use the format MM/YY';
    else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
      errors.expiry = 'This card has expired';
    }
  }

  const cvc = digitsOnly(card.cvc);
  if (!cvc) errors.cvc = 'Enter the security code';
  else if (cvc.length !== cvcLengthFor(brand)) errors.cvc = `Enter the ${cvcLengthFor(brand)}-digit code`;

  return errors;
}
