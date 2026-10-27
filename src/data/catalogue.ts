import type { Item } from '@/types';

/**
 * Illustrative catalogue. Caffeine levels, pairings and goal tags are my own judgement for the
 * demo; in a real business the buyers would own them. `cups` is a rough cups-per-pack figure.
 */
export const catalogue: Item[] = [
  // ---- Coffee ----
  {
    id: 'c-moka', name: 'Moka Morning Blend', category: 'coffee',
    description: 'A dense, sweet blend built for the stovetop.',
    notes: ['cocoa', 'toffee', 'hazelnut'], caffeineLevel: 5, price: 12.5, size: '250g',
    brew: { ratio: '1:7', tempC: 95, time: '4–5 min' },
    brewMethods: ['moka', 'espresso'], contains: [], goalTags: ['strong-start'],
    pairsWith: ['g-moka-pot'], inStock: true, cups: 16,
  },
  {
    id: 'c-night-shift', name: 'Night Shift Espresso', category: 'coffee',
    description: 'Dark, syrupy and unapologetic.',
    notes: ['dark chocolate', 'molasses'], caffeineLevel: 5, price: 13, size: '250g',
    brew: { ratio: '1:2', tempC: 93, time: '28 s' },
    brewMethods: ['espresso'], contains: [], goalTags: ['strong-start'], inStock: true, cups: 16,
  },
  {
    id: 'c-yirgacheffe', name: 'Yirgacheffe Filter', category: 'coffee',
    description: 'Washed Ethiopian with a clean, floral cup.',
    notes: ['jasmine', 'bergamot', 'peach'], caffeineLevel: 4, price: 14, size: '250g',
    brew: { ratio: '1:16', tempC: 94, time: '3–4 min' },
    brewMethods: ['filter'], contains: [], goalTags: ['strong-start'],
    pairsWith: ['g-pour-over'], inStock: true, cups: 16,
  },
  {
    id: 'c-half-half', name: 'Half & Half Blend', category: 'coffee',
    description: 'Half regular, half Swiss Water decaf. All of the taste.',
    notes: ['caramel', 'hazelnut'], caffeineLevel: 2, price: 11.5, size: '250g',
    brew: { ratio: '1:16', tempC: 94, time: '3–4 min' },
    brewMethods: ['filter', 'moka'], contains: [], goalTags: ['cutting-down', 'no-crash'], inStock: true, cups: 16,
  },
  {
    id: 'c-decaf', name: 'Swiss Water Decaf', category: 'coffee',
    description: 'Chemical-free decaf from Colombia.',
    notes: ['malt', 'plum'], caffeineLevel: 1, price: 11, size: '250g',
    brew: { ratio: '1:16', tempC: 94, time: '3–4 min' },
    brewMethods: ['filter', 'espresso'], contains: [], goalTags: ['cutting-down'], inStock: true, cups: 16,
  },
  {
    id: 'c-cold-brew-taster', name: 'Cold Brew Taster', category: 'coffee',
    description: 'Coarse-ground for overnight steeping. Two batches.',
    notes: ['chocolate', 'orange'], caffeineLevel: 4, price: 5.5, size: '100g', isSample: true,
    brew: { ratio: '1:8', tempC: 4, time: '14–16 h' },
    brewMethods: ['cold-brew'], contains: [], goalTags: ['strong-start'],
    pairsWith: ['g-cold-brew-bottle'], inStock: true, cups: 6,
  },

  // ---- Tea ----
  {
    id: 't-sencha', name: 'Shizuoka Sencha', category: 'tea',
    description: 'Steamed green tea, bright and gently sweet.',
    notes: ['cut grass', 'sweet pea'], caffeineLevel: 2, price: 9, size: '80g',
    brew: { ratio: '1g : 60ml', tempC: 70, time: '1 min', steeps: 3 },
    brewMethods: ['steep', 'cold-brew'], contains: [], goalTags: ['calm-focus', 'no-crash'],
    pairsWith: ['g-infuser'], inStock: true, cups: 25,
  },
  {
    id: 't-oolong', name: 'Tieguanyin Oolong', category: 'tea',
    description: 'Rolled oolong that opens up over many steeps.',
    notes: ['orchid', 'cream'], caffeineLevel: 2, price: 11, size: '80g',
    brew: { ratio: '1g : 50ml', tempC: 90, time: '45 s', steeps: 6 },
    brewMethods: ['steep'], contains: [], goalTags: ['no-crash', 'calm-focus'], inStock: true, cups: 25,
  },
  {
    id: 't-assam', name: 'Assam Breakfast', category: 'tea',
    description: 'Malty black tea that stands up to milk.',
    notes: ['malt', 'honey'], caffeineLevel: 3, price: 8, size: '50 bags',
    brew: { ratio: '1 bag : 250ml', tempC: 100, time: '4 min' },
    brewMethods: ['steep'], contains: [], goalTags: ['strong-start'], inStock: true, cups: 50,
  },
  {
    id: 't-chai', name: 'Masala Chai Latte Blend', category: 'tea',
    description: 'Black tea, spices and milk powder. Just add water.',
    notes: ['cardamom', 'clove', 'ginger'], caffeineLevel: 3, price: 9.5, size: '200g',
    brew: { ratio: '2 tsp : 200ml', tempC: 90, time: 'Stir' },
    brewMethods: ['steep'], contains: ['dairy'], goalTags: ['no-crash'], inStock: true, cups: 20,
  },
  {
    id: 't-honeybush', name: 'Honeybush & Orange Peel', category: 'tea',
    description: 'Caffeine-free South African herbal.',
    notes: ['honey', 'orange'], caffeineLevel: 0, price: 7, size: '80g',
    brew: { ratio: '1g : 80ml', tempC: 100, time: '5 min' },
    brewMethods: ['steep', 'cold-brew'], contains: [], goalTags: ['cutting-down', 'no-crash'], inStock: true, cups: 25,
  },

  // ---- Matcha ----
  {
    id: 'm-ceremonial', name: 'Kyoto Ceremonial Matcha', category: 'matcha',
    description: 'First-harvest Uji matcha for drinking straight.',
    notes: ['umami', 'sweet cream'], caffeineLevel: 3, price: 24, size: '30g tin',
    brew: { ratio: '2g : 70ml', tempC: 75, time: '20 s', whisk: 'M-shape, 20 s' },
    brewMethods: ['whisk'], contains: [], goalTags: ['calm-focus'],
    pairsWith: ['g-whisk-set'], inStock: true, cups: 15,
  },
  {
    id: 'm-everyday', name: 'Everyday Latte Matcha', category: 'matcha',
    description: 'Robust second-harvest matcha for lattes.',
    notes: ['grassy', 'nutty'], caffeineLevel: 3, price: 14, size: '50g',
    brew: { ratio: '2g : 50ml', tempC: 80, time: '15 s', whisk: 'Then add milk' },
    brewMethods: ['whisk'], contains: [], goalTags: ['calm-focus', 'no-crash'],
    pairsWith: ['g-whisk-set'], inStock: true, cups: 25,
  },
  {
    id: 'm-taster', name: 'Matcha Taster Tin', category: 'matcha',
    description: 'Ten servings of ceremonial grade to try first.',
    notes: ['umami', 'seaweed'], caffeineLevel: 3, price: 5, size: '10g', isSample: true,
    brew: { ratio: '2g : 70ml', tempC: 75, time: '20 s', whisk: 'M-shape, 20 s' },
    brewMethods: ['whisk'], contains: [], goalTags: ['calm-focus'], inStock: true, cups: 5,
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

  // ---- Bites ----
  {
    id: 'b-biscotti', name: 'Almond Biscotti', category: 'bites',
    description: 'Twice-baked with whole almonds, made for dunking.', notes: ['almond', 'vanilla'], caffeineLevel: 0,
    price: 4.5, size: '6 pieces', brewMethods: [], contains: ['nuts', 'gluten'], goalTags: [],
    pairsWith: ['c-night-shift', 'c-moka'], inStock: true,
  },
  {
    id: 'b-shortbread', name: 'Butter Shortbread', category: 'bites',
    description: 'Short, crumbly and properly buttery.', notes: ['butter', 'sea salt'], caffeineLevel: 0,
    price: 5, size: '8 fingers', brewMethods: [], contains: ['dairy', 'gluten'], goalTags: [],
    pairsWith: ['t-assam'], inStock: true,
  },
  {
    id: 'b-oat-cookies', name: 'Oat & Raisin Cookies', category: 'bites',
    description: 'Chewy, not too sweet, and made without dairy.', notes: ['oat', 'raisin', 'cinnamon'], caffeineLevel: 0,
    price: 5.5, size: '6 cookies', brewMethods: [], contains: ['gluten'], goalTags: [],
    pairsWith: ['c-half-half', 'c-decaf'], inStock: true,
  },
  {
    id: 'b-dark-chocolate', name: 'Dark Chocolate Thins', category: 'bites',
    description: '70% cocoa, snapped thin.', notes: ['cocoa', 'cherry'], caffeineLevel: 0,
    price: 4, size: '100g', brewMethods: [], contains: ['soya'], goalTags: [],
    pairsWith: ['m-ceremonial', 'c-moka'], inStock: true,
  },
  {
    id: 'b-rice-crackers', name: 'Sesame Rice Crackers', category: 'bites',
    description: 'Light, savoury and made without gluten.', notes: ['sesame', 'toasted rice'], caffeineLevel: 0,
    price: 4, size: '80g', brewMethods: [], contains: ['sesame'], goalTags: [],
    pairsWith: ['t-sencha', 'm-everyday'], inStock: true,
  },

  // ---- Sweeteners ----
  {
    id: 's-demerara', name: 'Demerara Sugar Cubes', category: 'sweeteners',
    description: 'Golden, crunchy cubes with a light toffee note.', notes: ['toffee'], caffeineLevel: 0,
    price: 3, size: '500g', brewMethods: [], contains: [], goalTags: [],
    pairsWith: ['t-assam', 'c-moka'], inStock: true,
  },
  {
    id: 's-honey', name: 'Wildflower Honey', category: 'sweeteners',
    description: 'Runny, floral honey from British hives.', notes: ['floral'], caffeineLevel: 0,
    price: 7.5, size: '340g jar', brewMethods: [], contains: [], goalTags: [],
    pairsWith: ['t-honeybush', 't-chai'], inStock: true,
  },
  {
    id: 's-vanilla-syrup', name: 'Vanilla Syrup', category: 'sweeteners',
    description: 'For lattes and iced coffee. One pump per cup.', notes: ['vanilla'], caffeineLevel: 0,
    price: 6.5, size: '250ml', brewMethods: [], contains: [], goalTags: [],
    pairsWith: ['m-everyday', 'c-cold-brew-taster'], inStock: true,
  },
];

export const itemById = (id: string): Item | undefined => catalogue.find((i) => i.id === id);
