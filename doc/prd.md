# Product Requirements: Ondo design system and demo

Ondo is an invented caffeine subscription brand: coffee, tea, matcha and the gear to brew them.
This repo is a portfolio piece. It shows a design system built **with Claude and code**, and a
working page built only from that system.

The idea started from a meal-delivery take-home (goal-based cross-sell). Ondo is a new brand and
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

Help a new subscriber build a first box that fits their day, and raise items per box
**without hiding the price**. The total is always visible.

## Target user

People who drink caffeine daily, on mobile first, who are curious but busy. They don't need a
lesson in coffee; they want a sensible box and a reason for each suggestion.

## Goals the customer can pick

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
2. **Demo page "Build your box"** (`/`): goal picker, the customer's box, a "For your {goal}" rail
   of up to 6 suggestions with a one-line reason each, and a sticky box total.
3. **Hero section** in the dark theme, to show both themes on one page.
4. **AI guide:** `CLAUDE.md` + `doc/agent.md` so Claude Code (or any AI coding tool) builds
   on-brand by default.
5. **Case study:** `doc/case-study.md`, how the system was built with Claude and where I overruled it.
6. **States:** empty rail, item over the customer's caffeine limit, out of stock, long names.

### Out
- Checkout, accounts, payments, a backend.
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
| Pairs with something in the box | +2 | Whisk set next to matcha |
| Fills a brew gap | +2 | Beans in the box but no way to brew them |
| Easy to try | +1 | Price ≤ £6 or a sample size |

Tie-break: lower price first. Show the top 6; zero scores are never shown. The reason line is the
pairing if there is one (most specific), otherwise the highest-scoring signal.

**Stable rail:** context is the drinks in the box, not the gear added from the rail, so adding
from the rail never reshuffles it.

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

- **Primary:** items per first box, share of boxes with more than one category.
- **Guard rail:** subscription conversion from the box page.
- **Diagnostic:** rail impressions, add rate from the rail, adds by category.
