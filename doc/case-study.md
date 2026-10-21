# Case study: building Ondo's design system with Claude

> Draft. Sections marked **[Mook]** are for my own words; the rest records what actually happened.

## The brief I set myself

A role I applied for asked for experience "building design systems with Claude and code". I'd
already done a take-home where design drift after handoff was the client's main pain, so I wanted
to show the fix end to end: a system where the design names *are* the code names, and where an
AI coding tool can't easily go off-brand.

I invented a brand so the work is mine to publish: **Ondo**, a caffeine subscription.

**[Mook]** Why caffeine, why coffee *and* tea *and* matcha, why these fonts.

## The hard problem: one brand, three characters

Coffee, tea and matcha each need their own feel, but I didn't want three versions of every
component. The answer is attributes, not props:

- `data-theme` swaps surfaces (cream for the shop, fog for the hero, taken from my moodboard).
- `data-category` swaps the accent.
- Components only use semantic utilities, so the same `ProductCard` works everywhere.

**A bug worth telling.** The first version declared the semantic colours in Tailwind's normal
`@theme`. That resolves `var(--accent)` once, at the root, so a `data-category` further down the
page changed nothing. Switching to `@theme inline` makes each utility read the variable where it's
used. Small change, but it's the difference between theming that works and theming that only
looks like it does in a single-theme screenshot.

## Accessibility as a token rule, not a review step

Every colour pair was checked before it became a token (script output in
`design_system.md`): body text 15:1, muted text 5.3:1, every accent 5.5:1 or better in both
themes. The rule that follows is written into the docs: accent tints are backgrounds only.
The caffeine meter always has a text label, and Storybook runs axe on every story.

## How I worked with Claude

| Step | Claude did | I decided or changed |
| --- | --- | --- |
| Concept | Suggested domains and names | **[Mook]** Picked caffeine (not coffee only), named the repo `ondo`, chose Cabinet Grotesk + Erode |
| Licensing | Checked the fonts were free and flagged that committing them to a public repo is redistribution | Load from Fontshare instead |
| Docs | Drafted prd, design system, architecture and agent docs from my previous take-home's structure | **[Mook]** |
| Rules | Wrote `recommend.ts` and tests | See below |
| Visual review | **[Mook]** | **[Mook]** |

**Where the first draft was wrong.** The first scoring gave paired gear points twice (pairing *and*
"fills a brew gap"), so a pour-over set topped every goal's rail, even "cutting down". Worse, the
brew-gap rule looked at gear already in the box, so adding gear from the rail would reshuffle it,
which breaks the stability rule in the PRD. Running the rules for all four goals made both obvious.
The fix was a smaller, separate "brews something in your box" signal that only looks at drinks, and
the worked example in the PRD is now a test.

**[Mook]** Where you overruled Claude on visual or product decisions.

## What `CLAUDE.md` is for

It's the system's interface for AI tools. It tells any agent: no hex values or arbitrary sizes in
components, no styling branches on category or theme, stories for every state, check contrast,
and a grep that proves it. **[Mook]** A before/after: the same prompt with and without the guide.

## What I'd do next

- Figma variables generated from `tokens.css`, so design and code share one source both ways.
- Visual regression on the stories (Chromatic).
- Real product photography to replace the category marks.
