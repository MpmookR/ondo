# Ondo design system

**Ondo** is a fictional caffeine subscription (coffee, tea, matcha and the gear to brew them).
The product brief: **build your first subscription box**, raising AOV and items per order in a new
customer's first box **without costing conversion**.

This repo is its design system and a demo shop built only from it, made **with Claude and code**
by [Mook (Puangpaka Rattana)](https://mooksportfolio.netlify.app/).

- **Tokens** in one file, themed by two attributes: `data-theme` (light / dark) and
  `data-category` (coffee / tea / matcha). One component, every look.
- **Components** documented in Storybook, every state in both themes, accessibility checks on.
- **Three mobile-first screens** built only from the system: *Your box* (order summary with a
  goal-based suggestion rail), *Shop* (tabs, unavailable items tucked away with a reason) and an
  *item page* with brew highlights. Light and dark themes switch from the header.
- **AI guide**: `CLAUDE.md` + `doc/agent.md` keep AI-generated UI on-brand.

## Run it

```bash
npm install
npm run dev              # app at localhost:3000
npm run storybook        # design system at localhost:6006
npm test                 # recommendation rules and totals
npm run lint             # type-check
```

## Read more

| Doc | What's in it |
| --- | --- |
| [doc/design_system.md](doc/design_system.md) | Token layers, colour and contrast, type, components, states |
| [doc/prd.md](doc/prd.md) | Product, goals, recommendation rules, wording rules |
| [doc/architecture.md](doc/architecture.md) | Stack, structure, data model |
| [doc/agent.md](doc/agent.md) | Rules for AI coding tools and the definition of done |
| [doc/case-study.md](doc/case-study.md) | How it was built with Claude |

## Credits

- Type: [Fira Sans](https://github.com/mozilla/Fira) (headlines) and
  [Source Sans 3](https://github.com/adobe-fonts/source-sans) (body), both under the SIL Open Font
  License (licences in `public/fonts`).
- Products, prices and caffeine levels are illustrative.
