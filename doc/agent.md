# Agent Instructions

How to work on Ondo with Claude Code or any AI coding tool. **This file is part of the design
system**: it's what keeps AI-generated UI on-brand.

## Project context

Ondo is an invented caffeine subscription (coffee, tea, matcha, gear). The repo is a design system
(tokens, components, Storybook) plus one demo page built only from it. Portfolio quality: it must
look polished and read clearly. It is not production code.

## Before you start

1. Read [Product requirements](prd.md), especially the recommendation and wording rules.
2. Read [Design system](design_system.md).
3. Read [Architecture](architecture.md).
4. Look at `src/components` and its stories before creating anything new. Screens live in
   `src/views` and only compose components; new visual patterns belong in `src/components`.

## Design rules (non-negotiable)

- **Never hard-code a colour, font size, radius, shadow or duration.** Use the token utilities
  (`bg-bg-surface`, `text-text-muted`, `text-title`, `rounded-card`, `shadow-raised`).
  If a token is missing, add it to `src/styles/tokens.css` first and document it in
  `design_system.md`. No `[#hex]` or other arbitrary values in components.
- **Never branch on category or theme inside a component** (no `category === 'tea' ? … : …` for
  colour). Set `data-category` / `data-theme` on a wrapper and use `accent` utilities.
- Spacing unit is 1px: `p-16` = 16px. Use the documented steps.
- Type: headings and UI in `font-display` (Cabinet Grotesk), body copy in `font-serif` (Erode),
  brew data in `font-mono`.
- Mobile first: phone layout, then `md:` / `lg:`. Check 402px, 820px, 1440px; no sideways scroll.
  Bars fixed to the bottom use `pb-safe`; whole-card links use `stretched-link`.
- Every interactive element: visible focus state, 44px tap target, accessible name.
- Caffeine level always has a text label. No health claims on cards.
- Check new colour pairs against the contrast table; AA minimum.

## Code rules

- TypeScript strict. One component per folder with a `.stories.tsx` covering every variant and
  state, shown in both themes.
- Reuse `ShopCard`, `SuggestionCard`, `ItemCard`, `Stepper`, `Chip`, `Button`; no near-duplicates.
- Keep `recommend.ts` pure: short functions, named constants for points.
- Don't add libraries (UI kits, state managers, icon packs) without asking. Tailwind is the only
  styling tool.
- Don't commit font files (licence). Fonts load from Fontshare in `layout.tsx` and `.storybook/preview-head.html`.

## Commands

| Task | Command |
| --- | --- |
| Install | `npm install` |
| Dev server | `npm run dev` |
| Storybook | `npm run storybook` |
| Build app | `npm run build` |
| Build Storybook | `npm run build-storybook` |
| Type-check | `npm run lint` |
| Tests | `npm test` |

## Definition of done

1. `npm run lint`, `npm test` and `npm run build` pass.
2. The component has stories for each variant and state, in light and dark.
3. No arbitrary values: `grep -rE "\[#|\[[0-9]+px\]" src/components` returns nothing.
4. Docs updated if a token, rule or component changed.
