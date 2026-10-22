const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export const formatPrice = (value: number): string => gbp.format(value);

export const pluralise = (n: number, word: string, plural = `${word}s`): string => `${n} ${n === 1 ? word : plural}`;
