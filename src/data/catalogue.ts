import type { Item } from '@/types';

/**
 * Illustrative catalogue. Caffeine levels, pairings and goal tags are my own judgement for the
 * demo; in a real business the buyers would own them.
 */
export const catalogue: Item[] = [
  // ---- Coffee ----
  {
    id: 'c-moka', name: 'Moka Morning Blend', category: 'coffee',
    description: 'A dense, sweet blend built for the stovetop.',
    notes: ['cocoa', 'toffee', 'hazelnut'], caffeineLevel: 5, price: 12.5, size: '250g',
    brew: { ratio: '1:7', tempC: 95, time: '4–5 min' },
    brewMethods: ['moka', 'espresso'], contains: [], goalTags: ['strong-start'],
    pairsWith: ['g-moka-pot'], inStock: true,
  },
  {
    id: 'c-night-shift', name: 'Night Shift Espresso', category: 'coffee',
    description: 'Dark, syrupy and unapologetic.',
    notes: ['dark chocolate', 'molasses'], caffeineLevel: 5, price: 13, size: '250g',
    brew: { ratio: '1:2', tempC: 93, time: '28 s' },
    brewMethods: ['espresso'], contains: [], goalTags: ['strong-start'], inStock: true,
  },
  {
    id: 'c-yirgacheffe', name: 'Yirgacheffe Filter', category: 'coffee',
    description: 'Washed Ethiopian with a clean, floral cup.',
    notes: ['jasmine', 'bergamot', 'peach'], caffeineLevel: 4, price: 14, size: '250g',
    brew: { ratio: '1:16', tempC: 94, time: '3–4 min' },
    brewMethods: ['filter'], contains: [], goalTags: ['strong-start'],
    pairsWith: ['g-pour-over'], inStock: true,
  },
  {
    id: 'c-half-half', name: 'Half & Half Blend', category: 'coffee',
    description: 'Half regular, half Swiss Water decaf. All of the taste.',
    notes: ['caramel', 'hazelnut'], caffeineLevel: 2, price: 11.5, size: '250g',
    brew: { ratio: '1:16', tempC: 94, time: '3–4 min' },
    brewMethods: ['filter', 'moka'], contains: [], goalTags: ['cutting-down', 'no-crash'], inStock: true,
  },
  {
    id: 'c-decaf', name: 'Swiss Water Decaf', category: 'coffee',
    description: 'Chemical-free decaf from Colombia.',
    notes: ['malt', 'plum'], caffeineLevel: 1, price: 11, size: '250g',
    brew: { ratio: '1:16', tempC: 94, time: '3–4 min' },
    brewMethods: ['filter', 'espresso'], contains: [], goalTags: ['cutting-down'], inStock: true,
  },
  {
    id: 'c-cold-brew-taster', name: 'Cold Brew Taster', category: 'coffee',
    description: 'Coarse-ground for overnight steeping. Two batches.',
    notes: ['chocolate', 'orange'], caffeineLevel: 4, price: 5.5, size: '100g', isSample: true,
    brew: { ratio: '1:8', tempC: 4, time: '14–16 h' },
    brewMethods: ['cold-brew'], contains: [], goalTags: ['strong-start'],
    pairsWith: ['g-cold-brew-bottle'], inStock: true,
  },

  // ---- Tea ----
  {
    id: 't-sencha', name: 'Shizuoka Sencha', category: 'tea',
    description: 'Steamed green tea, bright and gently sweet.',
    notes: ['cut grass', 'sweet pea'], caffeineLevel: 2, price: 9, size: '80g',
    brew: { ratio: '1g : 60ml', tempC: 70, time: '1 min', steeps: 3 },
    brewMethods: ['steep', 'cold-brew'], contains: [], goalTags: ['calm-focus', 'no-crash'],
    pairsWith: ['g-infuser'], inStock: true,
  },
  {
    id: 't-oolong', name: 'Tieguanyin Oolong', category: 'tea',
    description: 'Rolled oolong that opens up over many steeps.',
    notes: ['orchid', 'cream'], caffeineLevel: 2, price: 11, size: '80g',
    brew: { ratio: '1g : 50ml', tempC: 90, time: '45 s', steeps: 6 },
    brewMethods: ['steep'], contains: [], goalTags: ['no-crash', 'calm-focus'], inStock: true,
  },
  {
    id: 't-assam', name: 'Assam Breakfast', category: 'tea',
    description: 'Malty black tea that stands up to milk.',
    notes: ['malt', 'honey'], caffeineLevel: 3, price: 8, size: '50 bags',
    brew: { ratio: '1 bag : 250ml', tempC: 100, time: '4 min' },
    brewMethods: ['steep'], contains: [], goalTags: ['strong-start'], inStock: true,
  },
  {
    id: 't-chai', name: 'Masala Chai Latte Blend', category: 'tea',
    description: 'Black tea, spices and milk powder. Just add water.',
    notes: ['cardamom', 'clove', 'ginger'], caffeineLevel: 3, price: 9.5, size: '200g',
    brew: { ratio: '2 tsp : 200ml', tempC: 90, time: 'Stir' },
    brewMethods: ['steep'], contains: ['dairy'], goalTags: ['no-crash'], inStock: true,
  },
  {
    id: 't-honeybush', name: 'Honeybush & Orange Peel', category: 'tea',
    description: 'Caffeine-free South African herbal.',
    notes: ['honey', 'orange'], caffeineLevel: 0, price: 7, size: '80g',
    brew: { ratio: '1g : 80ml', tempC: 100, time: '5 min' },
    brewMethods: ['steep', 'cold-brew'], contains: [], goalTags: ['cutting-down', 'no-crash'], inStock: true,
  },

  // ---- Matcha ----
  {
    id: 'm-ceremonial', name: 'Kyoto Ceremonial Matcha', category: 'matcha',
    description: 'First-harvest Uji matcha for drinking straight.',
    notes: ['umami', 'sweet cream'], caffeineLevel: 3, price: 24, size: '30g tin',
    brew: { ratio: '2g : 70ml', tempC: 75, time: '20 s', whisk: 'M-shape, 20 s' },
    brewMethods: ['whisk'], contains: [], goalTags: ['calm-focus'],
    pairsWith: ['g-whisk-set'], inStock: true,
  },
  {
    id: 'm-everyday', name: 'Everyday Latte Matcha', category: 'matcha',
    description: 'Robust second-harvest matcha for lattes.',
    notes: ['grassy', 'nutty'], caffeineLevel: 3, price: 14, size: '50g',
    brew: { ratio: '2g : 50ml', tempC: 80, time: '15 s', whisk: 'Then add milk' },
    brewMethods: ['whisk'], contains: [], goalTags: ['calm-focus', 'no-crash'],
    pairsWith: ['g-whisk-set'], inStock: true,
  },
  {
    id: 'm-taster', name: 'Matcha Taster Tin', category: 'matcha',
    description: 'Ten servings of ceremonial grade to try first.',
    notes: ['umami', 'seaweed'], caffeineLevel: 3, price: 5, size: '10g', isSample: true,
    brew: { ratio: '2g : 70ml', tempC: 75, time: '20 s', whisk: 'M-shape, 20 s' },
    brewMethods: ['whisk'], contains: [], goalTags: ['calm-focus'], inStock: true,
  },

  // ---- Gear ----
  {
    id: 'g-moka-pot', name: 'Three-Cup Moka Pot', category: 'gear',
    description: 'Aluminium stovetop brewer.', notes: [], caffeineLevel: 0, price: 32, size: '3 cup',
    brewMethods: ['moka'], contains: [], goalTags: ['strong-start'], inStock: true,
  },
  {
    id: 'g-pour-over', name: 'Ceramic Pour-Over Set', category: 'gear',
    description: 'Dripper, 40 filters and a glass server.', notes: [], caffeineLevel: 0, price: 28, size: '600ml',
    brewMethods: ['filter'], contains: [], goalTags: [], inStock: true,
  },
  {
    id: 'g-whisk-set', name: 'Bamboo Whisk & Bowl Set', category: 'gear',
    description: '80-prong chasen, holder and a stoneware bowl.', notes: [], caffeineLevel: 0, price: 26, size: 'Set of 3',
    brewMethods: ['whisk'], contains: [], goalTags: ['calm-focus'], inStock: true,
  },
  {
    id: 'g-cold-brew-bottle', name: 'Cold-Brew Bottle', category: 'gear',
    description: 'Glass bottle with a fine mesh filter. Coffee or tea.', notes: [], caffeineLevel: 0, price: 18, size: '1 litre',
    brewMethods: ['cold-brew'], contains: [], goalTags: ['no-crash'], inStock: true,
  },
  {
    id: 'g-infuser', name: 'Glass Infuser Mug', category: 'gear',
    description: 'Double-walled mug with a steel infuser.', notes: [], caffeineLevel: 0, price: 16, size: '350ml',
    brewMethods: ['steep'], contains: [], goalTags: [], inStock: true,
  },
  {
    id: 'g-grinder', name: 'Conical Hand Grinder', category: 'gear',
    description: 'Steel burrs, 40 click settings.', notes: [], caffeineLevel: 0, price: 45, size: '30g hopper',
    brewMethods: ['filter', 'espresso', 'moka'], contains: [], goalTags: [], inStock: false,
  },
];

export const itemById = (id: string): Item | undefined => catalogue.find((i) => i.id === id);
