# Product Requirements: Build your first subscription box

> **Business goal:** raise AOV (average order value) and items per order in a new customer's
> first box **without costing conversion**.

Ondo is an invented caffeine subscription brand: coffee, tea, matcha and the gear to brew them.
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
| Pairings and "brews your…" gear: adds a second category to the box | Hard filters: nothing above the caffeine limit or containing an avoid is ever suggested |
| "Easy to try" tasters (≤ £6) as a low-risk first add | Rail is hidden when nothing qualifies (no filler); it never reshuffles while you add |
| Shop "For you" tab uses the same rules | One tap to add, one tap to undo; nothing is pre-added to the box |
| Subscription saving shown up front (10% / 5%) | One-off is always an option; "skip, swap or pause any time" next to the choice |
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
2. **Your box** (`/`): first delivery, editable preferences (goal, caffeine limit, avoids), delivery
   frequency, the box grouped into drinks and gear, a "For {goal}" rail of up to 6 suggestions with
   a one-line reason each, and the box total always in view.
3. **Shop** (`/shop`): tabs For you · Coffee · Tea · Matcha · Gear. "For you" runs the same rules as
   the rail. Items the customer can't have are tucked into collapsed sections with the reason.
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
Box: Yirgacheffe Filter, Shizuoka Sencha. Top 6: Matcha Taster Tin (4), Tieguanyin Oolong (3),
Everyday Latte Matcha (3), Kyoto Ceremonial Matcha (3), Bamboo Whisk & Bowl Set (3), Glass Infuser
Mug (2, "Goes with your Shizuoka Sencha"). The espresso blends are over the caffeine limit, the chai
contains dairy and the grinder is out of stock, so none of them can appear.

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
- **Secondary:** share of first boxes with more than one category (drinks + gear), subscription
  vs one-off mix.
- **Diagnostic:** rail impressions, add rate from the rail by position and reason, removals of
  rail-added items before checkout (a sign of regret), adds by category.
