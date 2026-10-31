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
React state (box, answers, plan; starts with an empty box and no answers)  →  homepage (/) and "Your box" (/box)
```

## Tech stack

| Part | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript (strict) | Common production stack; static export friendly. |
| Styling | Tailwind CSS v4, tokens as `@theme` in `src/styles/tokens.css` | One token source; utilities can't drift from the system. |
| Docs | Storybook (`@storybook/nextjs-vite`) | Standard way to document and test components in isolation. |
| State | `useReducer` in a `BoxProvider` | Small, no library needed. |
| Tests | Node's built-in test runner via `tsx` | Rules and totals checked without a test framework. |
| Fonts | Fira Sans + Source Sans 3, self-hosted woff2 | SIL Open Font License; no third-party requests, works offline. |
| Hosting | Vercel (app), Chromatic or Vercel (Storybook) | Shareable links for a portfolio. |

## Pages

| Route | Screen | Built from |
| --- | --- | --- |
| `/` | Homepage | `Preloader` (first visit per session), `HomeHero` (`BrewScene`, `TypedHeadline`, `ButtonLink`), `HowItWorks`, `BestSellers` (both loaded separately) |
| `/onboarding` | Build your first box: eight questions, then the starter box | `WindowLight`, `OnboardingProgress`, `QuestionHeading`, `ChoiceCard`, `CupTally`, `CaffeinePicker`, `ChipGroup`, `Button` |
| `/box` | Your box (order summary) | `PageHeader`, `PreferencesCard`, `DeliveryCard`, `OrderSummary`, `SuggestionRail`, `BoxTotal` |
| `/shop?tab=for-you\|coffee\|tea\|matcha\|gear\|bites\|sweeteners` | Shop | `PageHeader`, `CategoryTabs`, `ShopCard`, `CollapsibleSection`, `ViewBoxBar` |
| `/checkout` | Checkout (demo, nothing is charged) | `PageHeader`, `Steps`, `OrderReview`, `DatePicker`, `WalletButtons`, `TextField`, `Checkbox`, `Divider` |
| `/item/[id]` | Product page (pre-rendered for every item) | `PageHeader`, `ProductImage`, `BrewHighlights`, `DetailAccordion`, `BrewGuide`, `SuggestionRail`, `OrderBar` |

**Back on an item page** returns to the last list page the customer was on (home, a shop tab or
Your box; each marks itself with `useReturnHere`), however many products they hopped through via
"Goes well with this". Opened directly, it goes to the shop.

The box, preferences, delivery plan and theme live in `BoxProvider` (React context in the root
layout), so moving between pages loses nothing. The session (box, answers, delivery choice) is also
saved to `sessionStorage` for the tab, so a reload or a typed address keeps it until the tab closes;
a missing, blocked or old-shaped save just starts fresh. The theme is remembered per browser.

## Project structure

```text
/src
  /app                    # Routes only: layout, /, /box, /shop, /checkout, /item/[id], globals.css
  /views                  # The three screens, composed from components (not part of the system)
    HomePage.tsx  OnboardingPage.tsx  YourBoxPage.tsx  ShopPage.tsx  ItemPage.tsx  CheckoutPage.tsx
  /components             # The design system: one folder per component, each with stories
    Icon/ Button/ Chip/ CategoryBadge/ CaffeineMeter/ BrewGuide/ Stepper/ Price/ ProductImage/
    PageHeader/ HomeHero/ Onboarding/ HowItWorks/ BestSellers/ Preloader/ InfoCards/ OrderSummary/ SuggestionCard/ SuggestionRail/
    BoxTotal/ CategoryTabs/ CollapsibleSection/ ShopCard/ ViewBoxBar/ ItemDetail/
    BoxProvider/          # State shared by every page
    shared/useRadioGroup.ts  shared/useInView.ts  shared/useParallax.ts  shared/Reveal.tsx
  /lib
    recommend.ts          # Filter + score rules (see prd.md)
    recommend.test.ts
    box.ts                # Reducer, totals
    format.ts  routes.ts
    dates.ts              # Local YYYY-MM-DD dates, calendar grid, earliest delivery (tomorrow)
    delivery.ts           # Cups in the box and the suggested delivery frequency
    starterBox.ts         # What onboarding puts in the first box (see prd.md, Starter box)
    payment.ts            # Card formatting, brand, Luhn and expiry checks (demo checkout)
  /data
    catalogue.ts  customer.ts  goals.ts  plans.ts  labels.ts  bestSellers.ts
    onboarding.ts         # Questions, reason lines, skip defaults, kit and taste mappings
  /styles
    tokens.css
  /stories                # Foundations pages, intro, shared fixtures
  /types
/.storybook               # Theme + accent toolbar, font preloads
/public/fonts             # Fira Sans + Source Sans 3 (OFL) with their licences
/doc                      # These docs
CLAUDE.md                 # Entry point for AI coding tools
```

## Data model

```ts
type DrinkCategory = 'coffee' | 'tea' | 'matcha';
type AddOnCategory = 'gear' | 'bites' | 'sweeteners';
type Category = DrinkCategory | AddOnCategory;
type Goal = 'strong-start' | 'calm-focus' | 'no-crash' | 'cutting-down';
type BrewMethod = 'espresso' | 'filter' | 'moka' | 'cold-brew' | 'steep' | 'whisk';
type BrewKit = 'espresso-machine' | 'filter' | 'moka-pot' | 'cafetiere' | 'teapot' | 'whisk' | 'grinder';
type Count = 1 | 2 | 3 | 4;        // 4 = 4 or more
type PlanId = 'every-15' | 'every-30' | 'every-45' | 'once';

interface Item {
  id: string;
  name: string;
  category: Category;
  description: string;
  notes: string[];                 // tasting notes, e.g. ['cocoa', 'cherry']
  caffeineLevel: 0 | 1 | 2 | 3 | 4 | 5;   // 0 for add-ons
  price: number;
  size: string;                    // '250g', '50 bags', '30g tin'
  isSample?: boolean;
  brew?: BrewGuide;                // drinks only
  brewMethods: BrewMethod[];       // drinks: how it can be brewed; gear: what it brews; [] for bites and sweeteners
  contains: string[];              // e.g. ['dairy'] for a latte blend
  goalTags: Goal[];
  pairsWith?: string[];            // item ids
  inStock: boolean;
  cups?: number;                   // drinks: rough cups per pack, for the delivery suggestion
}

interface BrewGuide {
  ratio: string;                   // '1:16'
  tempC: number;
  time: string;                    // '3–4 min'
  steeps?: number;                 // tea
  whisk?: string;                  // matcha, e.g. 'M-shape, 20 s'
}

interface Customer {               // the onboarding answers
  goal: Goal | null;               // null: skipped (no goal score, neutral rail title)
  drinkers: Count;                 // how many people drink it
  cupsPerDay: Count;               // per person
  drinks: ('coffee' | 'tea' | 'matcha')[];   // empty = not sure yet
  brewKit: BrewKit[];              // what they brew with; empty = nothing yet
  maxCaffeine: 1 | 2 | 3 | 4 | 5;
  avoids: string[];
  taste?: 'fruity' | 'chocolatey' | 'mellow';  // optional screen
  extras?: ('bites' | 'sweeteners')[];  // the only answer that can pre-add an add-on
}
interface BoxLine {
  itemId: string;
  qty: number;
  pickedReason?: string;           // set by the starter box ("For calm focus")
  firstBoxOnly?: boolean;          // add-on pre-added from `extras`
}
```

## Recommendation logic (`lib/recommend.ts`)

```ts
recommend(customer, box, catalogue, limit = 6): Suggestion[]
// Suggestion = { item, score, reason }
```

1. **Filter:** over caffeine limit, contains an avoid, out of stock, already in the box, gear they own.
2. **Score:** +3 goal match; +2 explicit pairing with a drink in the box; +1 gear that can brew a
   drink in the box (only without a pairing); +1 a drink their own kit can brew; +1 a drink whose
   notes match their taste; +1 a bite or sweetener they asked for; +1 if price ≤ £6 or a sample.
   Zero scores dropped. Gear they already own is filtered out with the other hard rules.
3. **Sort:** score descending, then price ascending. Take `limit`.
4. **Reason:** pairing ("Goes with your Shizuoka Sencha"), else brewing ("Brews your Shizuoka
   Sencha"), else goal ("Fits calm focus"), else "A small size to try" / "Easy to try".
5. **Stability:** the rail is worked out from `railLines`, a copy of the box taken when a page opens
   or a preference changes, so items added from the rail stay where they are and show a stepper.
6. **Item page:** `recommendForItem(item, …)` runs the same function with that drink as the context.

## Starter box (`lib/starterBox.ts`)

```ts
starterBox(customer, catalogue): { lines: BoxLine[]; leftOut: { category, reason }[] }
```

Drinks pass the rail's hard filters (taster packs excluded), score +3 goal, +1 brews with their kit,
+1 taste, and the top one per drink type is picked (ties to the lower price, at most three). Packs
per drink make the box last about 30 days, between 1 and 3. Then one add-on per category in
`extras`, only if it pairs with a picked drink and costs £6 or less, marked `firstBoxOnly`.
Onboarding dispatches `startFirstBox` with the answers and these lines. Rules in
[prd.md](prd.md#starter-box).

## Delivery suggestion (`lib/delivery.ts`)

```ts
suggestDelivery(lines, catalogue, customer): DeliverySuggestion | null
// { planId, cupsInBox, cupsPerDay, daysLasting, runsShort }
```

Cups in the box ÷ (people × cups a day) gives the days the box lasts; the suggestion is the closest
frequency, with `runsShort` under 15 days. Null when the box has no drinks. Rules in
[prd.md](prd.md#delivery-frequency-your-box).

## Production notes

- Goal tags and pairings would come from a CMS owned by the tea and coffee buyers.
- Analytics: `rail_impression`, `rail_item_added` (item, position, reason), `goal_changed`.
- Later: tune rules with co-purchase data.
