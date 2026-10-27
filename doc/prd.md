# Product Requirements: Build your first subscription box

> **Business goal:** raise AOV (average order value) and items per order in a new customer's
> first box **without costing conversion**.

Ondo is an invented caffeine subscription brand: coffee, tea, matcha, the gear to brew them, and
add-ons to go with them (bites and sweeteners).
This repo is a portfolio piece. It shows a design system built **with Claude and code**, and a
working page built only from that system.

The idea started from a meal-delivery take-home task (goal-based cross-sell). Ondo is a new brand and
a new domain, built from scratch, so none of that company's brand, tokens or content is used.

## Product overview

**What:** a subscription shop where customers pick how they want their day to feel, not just what
they like. The goal drives what Ondo suggests.

**Why a design system first:** coffee, tea and matcha each need their own character inside one
brand. That is a theming problem, and solving it in tokens (not by copying components) is the
main thing this project demonstrates.

## Problem the demo solves

Caffeine shoppers choose by product type ("I drink coffee"), so they rarely try the rest of the
range or the gear that goes with it. Most shops show the whole catalogue in one grid. Customers
already know *how* they want caffeine to fit their day; the shop doesn't ask.

## Goal

**Business goal:** raise AOV and items per order in a new customer's first box **without costing
conversion**.

**Customer goal:** build a first box that fits how they want their day to feel, quickly, with a
reason for every suggestion and the price always in view.

The two pull against each other: every extra suggestion is a chance to add an item and a chance to
make the box feel pushy or expensive. So each part of the design either **grows the box** or
**protects conversion**, and the second always wins a tie.

| Grows the box (AOV, items per order) | Protects conversion (the guard rail) |
| --- | --- |
| Goal-based rail: up to 6 suggestions, each with a one-line reason | Total, saving and cadence always visible (sticky bar on mobile, sidebar on desktop) |
| Pairings and "brews your…" gear, plus bites and sweeteners that go with a drink in the box: adds a second category | Hard filters: nothing above the caffeine limit or containing an avoid is ever suggested |
| "Easy to try" tasters (≤ £6) as a low-risk first add | Rail is hidden when nothing qualifies (no filler); it never reshuffles while you add |
| Shop "For you" tab uses the same rules | One tap to add, one tap to undo; nothing is pre-added to the box |
| Subscription saving shown up front (10% every 15 days, 5% every 30 or 45) | One-off is always an option; "skip, swap or pause any time" next to the choice |
| Delivery suggestion says plainly when the box won't last as long as the most frequent delivery | The suggested frequency never switches the choice (and so the price) by itself |
| | Checkout shows the full breakdown, the delivery date and the terms in plain English before "Pay" |
| | No health claims on cards; goal language only in rail titles |

## Target user

People who drink caffeine daily, on mobile first, who are curious but busy. They don't need a
lesson in coffee; they want a sensible box and a reason for each suggestion.

## Customer goals (what the rail is tuned to)

| Goal id | Label | Typical picks |
| --- | --- | --- |
| `strong-start` | Strong morning start | Espresso blends, moka pot |
| `calm-focus` | Calm focus | Matcha, whisk and bowl set |
| `no-crash` | Afternoon without the crash | Green tea, oolong, cold-brew bottle |
| `cutting-down` | Cutting down | Half-caf, decaf, herbal blends |

## Scope

### In (v1)
1. **Design system:** tokens (light and dark theme, three category accents), core components,
   all documented in Storybook.
2. **Your box** (`/`): "Your preferences" (the core onboarding answers, as a summary with "Edit
   preferences"), one **Delivery** card (how often, with a suggestion worked out from the box, then
   the first delivery date), the box grouped into drinks and add-ons (gear, bites, sweeteners), each
   sub-grouped by category, a "For {goal}" rail of up to 6
   suggestions with a one-line reason each, and the box total always in view.
3. **Shop** (`/shop`): tabs For you · Coffee · Tea · Matcha · Gear · Bites · Sweeteners. "For you" runs
   the same rules as
   the rail. Coffee, Tea and Matcha have a one-tap caffeine filter (All · Low 0–2 · Medium 3 ·
   High 4–5; a band with nothing in it is disabled). The choice carries across the drink tabs; on a
   tab where that band is empty, everything shows. Items the customer can't have are tucked into
   collapsed sections with the reason.
4. **Item page** (`/item/[id]`): pack, description, caffeine, brew highlights, a "Contains" box that
   is never collapsed, brew guide, a "Goes well with this" rail and a pinned order bar.
5. **Checkout** (`/checkout`): progress steps (Sign up · Delivery · Payment), "Your first box"
   summary that expands to every line, subtotal, saving, free delivery and the total; first delivery
   date with a "Change" calendar (earliest slot tomorrow); Apple Pay / Google Pay; card form with
   inline validation; billing address; "Pay £…" button; plain-English subscription terms and
   reassurance. **Demo only: no payment is taken**, and the page says so.
6. **Light and dark themes**, switchable from the header on every page.
7. **AI guide:** `CLAUDE.md` + `doc/agent.md` so Claude Code (or any AI coding tool) builds
   on-brand by default.
8. **States:** empty rail, item over the customer's caffeine limit, out of stock, long names.

### Out
- Real payments (the checkout is a demo), accounts, a backend.
- Real product data or real caffeine figures (all values are illustrative).

### Next
- **Onboarding** to build the first box from the customer's answers (see below). Until it ships,
  the demo starts from a sample customer's answers in `src/data/customer.ts`. The core answers
  are already shown and editable in Your preferences.

## Onboarding: build your first box (next)

A short set of questions before the first box, so the box and the suggestions start from what the
customer told us. **A question earns its place only if the answer changes the box.** Anything that
doesn't is asked later or not at all, because every extra screen is a chance to drop off.

### Rules

- One question per screen, each with a one-line reason ("So we send beans you can brew").
- Every question can be skipped. A skipped answer falls back to a safe default, never a guess
  that could break a hard filter.
- A progress indicator throughout, and back works on every screen.
- The answers are replayed on Your box in the preferences card, where they can be edited.
- No budget question: the plan prices cover it, and asking up front feels like a sales question.

### Core questions

| # | Question | Example answers | What it changes | Field |
| --- | --- | --- | --- | --- |
| 1 | How do you want your day to feel? | Strong morning start · Calm focus · Afternoon without the crash · Cutting down | Goal match in the ranking (+3) and the rail title | `goal` |
| 2 | How many people drink it? | Just me · 2 · 3 · 4+ | Quantities and pack sizes | `drinkers` |
| 3 | How many cups a day, each? | 1 · 2 · 3 · 4+ | Box size and suggested delivery frequency | `cupsPerDay` |
| 4 | What do you drink now? | Coffee · Tea · Matcha (pick any) | Where the first box starts, and what counts as trying something new | `drinks` |
| 5 | What do you brew with? | Espresso machine · Filter · Moka pot · Cafetière · Teapot or infuser · Matcha whisk · Grinder (pick any, or nothing yet) | Ground or whole bean, and which gear to suggest | `brewKit` |
| 6 | What's your caffeine limit? | 1 Very low · 2 Low · 3 Medium · 4 High · 5 Very high | Hard filter | `maxCaffeine` |
| 7 | Anything to avoid? | Dairy · Nuts · Soya · None | Hard filter | `avoids` |

Questions 2 and 3 are one person or several on purpose: cups are asked **per person**, and the
card shows the total ("That's 4 cups a day between you"). Delivery frequency (or one-off) is
chosen on Your box, not here; questions 2 and 3 drive its suggestion (see
[Delivery frequency](#delivery-frequency-your-box)).

The caffeine question stays a 1–5 limit. A cut-off time ("nothing after 2pm") says *when* someone
drinks caffeine, not *how much*, so it can't set a fair limit on its own.

### Optional questions (one screen, skippable as a whole)

| Question | Example answers | What it changes | Field |
| --- | --- | --- | --- |
| Milk or black? | Black · Dairy milk · Oat · Soya · Almond | Roast suggestions (darker roasts suit milk). Choosing a plant milk doesn't add to `avoids`; only question 7 does | `milk` |
| What do you like the taste of? | Bright and fruity · Chocolatey and nutty · Smooth and mellow · Not sure | Picks the first coffee or tea when several fit; matched against `notes` | `taste` |
| Stick or explore? | My usual · Surprise me | How far suggestions go from what they drink now | `explore` |

### How the answers feed the rules

Proposed additions to the recommendation rules once onboarding ships:

- **Hard filter:** never suggest gear the customer already owns (from `brewKit`).
- **Hard filter:** whole-bean coffee only if `brewKit` includes a grinder; otherwise send ground
  for their brew method. A grinder can be suggested on its own merits.
- **Score:** a drink that suits a brew method they own scores as "Brews with your …" (+1).
- **Score:** with `explore`, a drink type they don't drink yet gets +1; without it, their current
  drink types are preferred.
- **Defaults when skipped:** goal none (no goal score), 1 drinker, 2 cups, all drink types,
  no brew kit (so ground, never whole bean), caffeine limit 3, no avoids.

Until then, drinks and brew kit are saved and shown in Your preferences but don't change the
suggestions yet.

### Data model

The core answers are in the `Customer` type already (see [architecture.md](architecture.md)). The
optional ones are added when onboarding is built:

```ts
interface Customer {
  // …core answers
  milk?: 'black' | 'dairy' | 'oat' | 'soya' | 'almond';
  taste?: 'fruity' | 'chocolatey' | 'mellow';
  explore?: boolean;
}
```

### Ask later, not in onboarding

- How they heard about Ondo, and marketing consent: at checkout or after the first order.
- Ratings of what they drank: after the first box arrives. The best data for tuning suggestions,
  but it only exists once they've tasted something.

### Onboarding metrics

- Onboarding completion rate, and drop-off by question (any question losing more than a few
  percent is a candidate to move or cut).
- Skip rate per question.
- Share of first boxes kept without changes (the box matched what they wanted).

## Delivery frequency (Your box)

One Delivery card: **how often**, then **the first delivery date**.

| Option | Saving |
| --- | --- |
| Every 15 days | 10% |
| Every 30 days | 5% |
| Every 45 days | 5% |
| One-off | None (full price) |

**Suggestion.** Worked out from the box and the preferences:

1. Cups in the box: each drink's cups per pack × quantity (gear makes none). Cups per pack are
   illustrative (`cups` in the catalogue).
2. Cups a day: people × cups a day each.
3. Days the box lasts: cups in the box ÷ cups a day, rounded down.
4. Suggest the frequency **closest to how long the box lasts**. If it lasts less than 15 days,
   suggest 15 days and say the box may run short.
5. No drinks in the box: no suggestion.

The suggestion is a hint, never a switch: the saving (and so the price) differs between options,
so changing it silently would move the total. It sits above the options, which are one tap away.

**Worked example** (covered by tests). Yirgacheffe Filter (16 cups) + Shizuoka Sencha (25 cups) =
41 cups. One person, 2 cups a day: 20 days, so every 15 days. One cup a day: 41 days, so every 45
days. Two people, 2 cups each: 10 days, so every 15 days, and the box may run short. Five
Yirgacheffe and one Sencha (105 cups) for two people at 2 cups each: 26 days, so every 30 days.

**First delivery.** A date picker (earliest slot tomorrow, default a week ahead), then one line:
"Then every 15 days: next on Thu 19 Nov", or "Just this delivery" for a one-off.

## Recommendation rules (v1, rules-based)

Pairings and goal tags are **my own judgement** for the demo. In a real business a product or
tea/coffee specialist would own them; the code only reads them.

**Step 1: Filter (hard rules, never ranked away)**
- Remove anything above the customer's caffeine limit (`caffeineLevel` > `maxCaffeine`).
- Remove anything containing something the customer avoids (e.g. dairy, nuts).
- Remove anything out of stock.
- Remove anything already in the box.

**Step 2: Score**

| Signal | Points | Example |
| --- | --- | --- |
| Matches the goal | +3 | Ceremonial matcha → calm focus |
| Pairs with something in the box | +2 | Infuser mug next to sencha (an explicit pairing) |
| Brews something in the box | +1 | Cold-brew bottle for a tea that can be cold-brewed (gear only, when there's no explicit pairing) |
| Easy to try | +1 | Price ≤ £6 or a sample size |

Tie-break: lower price first. Show the top 6; zero scores are never shown. The reason line is the
pairing if there is one (most specific), otherwise the highest-scoring signal.

**Stable rail:** the rail is worked out from the box as it was when the page opened. Adding an
item from the rail turns its button into a stepper in place instead of reshuffling the cards.
Changing a preference rebuilds the rail from the current box.

**Worked example** (covered by tests). Goal: calm focus. Caffeine limit 4. Avoids dairy.
Box: Yirgacheffe Filter, Shizuoka Sencha. Top 6: Matcha Taster Tin (4), Sesame Rice Crackers (3,
"Goes with your Shizuoka Sencha"), Tieguanyin Oolong (3), Everyday Latte Matcha (3), Kyoto Ceremonial
Matcha (3), Bamboo Whisk & Bowl Set (3). The espresso blends are over the caffeine limit, the chai and
the shortbread contain dairy and the grinder is out of stock, so none of them can appear.

## Add-ons

Everything that isn't a drink is an add-on, grouped in the box and the shop by category:

| Category | What | Examples |
| --- | --- | --- |
| Gear | Things to brew with | Moka pot, pour-over set, whisk and bowl, infuser mug, grinder |
| Bites | Something to eat with a cup | Almond biscotti, butter shortbread, oat cookies, dark chocolate, rice crackers |
| Sweeteners | Something to sweeten it | Demerara sugar, honey, vanilla syrup |

- Add-ons have no caffeine level and no goal tags. They reach the rail through a **pairing** with a
  drink in the box ("Goes with your Shizuoka Sencha") or as an easy first add (≤ £6), never through
  the goal, so a biscuit is never sold as good for focus.
- Only gear can "brew" a drink. Bites and sweeteners only pair.
- Bites and sweeteners are food, so their "Contains" box always lists the allergens we track (dairy,
  nuts, gluten, soya, sesame), or says there are none. Avoids work on them like on drinks.

## Wording rules

- Goal language ("For calm focus") goes in rail titles only.
- No health claims on product cards ("boosts focus", "burns fat"). Describe taste, origin, brew
  and caffeine level.
- Caffeine level is shown as a 1–5 meter with a text label, never as colour alone.

## Requirements

- Mobile first (402px frame), no sideways scroll at any width, two columns from 1024px.
- Every visual value comes from `src/styles/tokens.css`.
- The total always equals the sum of the lines.
- WCAG 2.2 AA contrast in both themes and all three accents.

## Success metrics (for a real launch, not the demo)

Measured on **new customers' first boxes**, in an A/B test against the box page without the rail.

- **Primary:** AOV and items per order.
- **Guard rail:** conversion from the box page to a started subscription (or a paid one-off), with a
  stop threshold agreed before the test (for example, a drop of more than 1–2 percentage points).
- **Secondary:** share of first boxes with more than one category (drinks + add-ons), subscription
  vs one-off mix.
- **Diagnostic:** rail impressions, add rate from the rail by position and reason, removals of
  rail-added items before checkout (a sign of regret), adds by category.
