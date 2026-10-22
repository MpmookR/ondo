# Architecture

Front end only. Mock data lives in typed files; the recommendation logic is a pure function that
can be read and tested on its own; every visual value comes from one tokens file.

## System overview

```text
tokens.css (raw → theme → category → @theme)   ← every visual value
        ↓
components (src/components) + stories (Storybook)
        ↓
Mock data (catalogue, customer)  →  recommend(customer, box, catalogue)   ← pure, one file
        ↓
React state (box, goal, plan)  →  "Build your box" page
```

## Tech stack

| Part | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript (strict) | Common production stack; static export friendly. |
| Styling | Tailwind CSS v4, tokens as `@theme` in `src/styles/tokens.css` | One token source; utilities can't drift from the system. |
| Docs | Storybook (`@storybook/nextjs-vite`) | Standard way to document and test components in isolation. |
| State | `useReducer` in a `BoxProvider` | Small, no library needed. |
| Tests | Node's built-in test runner via `tsx` | Rules and totals checked without a test framework. |
| Fonts | Cabinet Grotesk + Erode from the Fontshare CSS API | Free (ITF Free Font License); files not redistributed. |
| Hosting | Vercel (app), Chromatic or Vercel (Storybook) | Shareable links for a portfolio. |

## Pages

| Route | Screen | Built from |
| --- | --- | --- |
| `/` | Your box (order summary) | `PageHeader`, `DeliveryCard`, `PreferencesCard`, `FrequencySelector`, `OrderSummary`, `SuggestionRail`, `BoxTotal` |
| `/shop?tab=for-you\|coffee\|tea\|matcha\|gear` | Shop | `PageHeader`, `CategoryTabs`, `ShopCard`, `CollapsibleSection`, `ViewBoxBar` |
| `/item/[id]` | Product page (pre-rendered for every item) | `PageHeader`, `ProductImage`, `BrewHighlights`, `DetailAccordion`, `BrewGuide`, `SuggestionRail`, `OrderBar` |

The box, preferences, delivery plan and theme live in `BoxProvider` (React context in the root
layout), so moving between pages loses nothing. The theme is remembered per browser.

## Project structure

```text
/src
  /app                    # Routes only: layout, /, /shop, /item/[id], globals.css
  /views                  # The three screens, composed from components (not part of the system)
    YourBoxPage.tsx  ShopPage.tsx  ItemPage.tsx
  /components             # The design system: one folder per component, each with stories
    Icon/ Button/ Chip/ CategoryBadge/ CaffeineMeter/ BrewGuide/ Stepper/ Price/ ProductImage/
    PageHeader/ InfoCards/ FrequencySelector/ OrderSummary/ SuggestionCard/ SuggestionRail/
    BoxTotal/ CategoryTabs/ CollapsibleSection/ ShopCard/ ViewBoxBar/ ItemDetail/
    BoxProvider/          # State shared by every page
    shared/useRadioGroup.ts
  /lib
    recommend.ts          # Filter + score rules (see prd.md)
    recommend.test.ts
    box.ts                # Reducer, totals
    format.ts  routes.ts
  /data
    catalogue.ts  customer.ts  goals.ts  plans.ts  labels.ts
  /styles
    tokens.css
  /stories                # Foundations pages, intro, shared fixtures
  /types
/.storybook               # Theme + accent toolbar, Fontshare fonts
/doc                      # These docs
CLAUDE.md                 # Entry point for AI coding tools
```

## Data model

```ts
type Category = 'coffee' | 'tea' | 'matcha' | 'gear';
type Goal = 'strong-start' | 'calm-focus' | 'no-crash' | 'cutting-down';
type BrewMethod = 'espresso' | 'filter' | 'moka' | 'cold-brew' | 'steep' | 'whisk';

interface Item {
  id: string;
  name: string;
  category: Category;
  description: string;
  notes: string[];                 // tasting notes, e.g. ['cocoa', 'cherry']
  caffeineLevel: 0 | 1 | 2 | 3 | 4 | 5;   // 0 for gear
  price: number;
  size: string;                    // '250g', '50 bags', '30g tin'
  isSample?: boolean;
  brew?: BrewGuide;                // drinks only
  brewMethods: BrewMethod[];       // drinks: how it can be brewed; gear: what it brews
  contains: string[];              // e.g. ['dairy'] for a latte blend
  goalTags: Goal[];
  pairsWith?: string[];            // item ids
  inStock: boolean;
}

interface BrewGuide {
  ratio: string;                   // '1:16'
  tempC: number;
  time: string;                    // '3–4 min'
  steeps?: number;                 // tea
  whisk?: string;                  // matcha, e.g. 'M-shape, 20 s'
}

interface Customer { goal: Goal; maxCaffeine: 1 | 2 | 3 | 4 | 5; avoids: string[]; }
interface BoxLine { itemId: string; qty: number; }
```

## Recommendation logic (`lib/recommend.ts`)

```ts
recommend(customer, box, catalogue, limit = 6): Suggestion[]
// Suggestion = { item, score, reason }
```

1. **Filter:** over caffeine limit, contains an avoid, out of stock, already in the box.
2. **Score:** +3 goal match; +2 explicit pairing with a drink in the box; +1 gear that can brew a
   drink in the box (only without a pairing); +1 if price ≤ £6 or a sample. Zero scores dropped.
3. **Sort:** score descending, then price ascending. Take `limit`.
4. **Reason:** pairing ("Goes with your Shizuoka Sencha"), else brewing ("Brews your Shizuoka
   Sencha"), else goal ("Fits calm focus"), else "A small size to try" / "Easy to try".
5. **Stability:** the rail is worked out from `railLines`, a copy of the box taken when a page opens
   or a preference changes, so items added from the rail stay where they are and show a stepper.
6. **Item page:** `recommendForItem(item, …)` runs the same function with that drink as the context.

## Production notes

- Goal tags and pairings would come from a CMS owned by the tea and coffee buyers.
- Analytics: `rail_impression`, `rail_item_added` (item, position, reason), `goal_changed`.
- Later: tune rules with co-purchase data.
