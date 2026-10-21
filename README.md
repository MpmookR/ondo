# Ondo design system

**Ondo** is a fictional caffeine subscription (coffee, tea, matcha and the gear to brew them).
This repo is its design system and a demo shop built only from it, made **with Claude and code**
by [Mook (Puangpaka Rattana)](https://mooksportfolio.netlify.app/).

- **Tokens** in one file, themed by two attributes: `data-theme` (cream / fog) and
  `data-category` (coffee / tea / matcha). One component, every look.
- **Components** documented in Storybook, every state in both themes, accessibility checks on.
- **Demo page** "Build your box": pick how you want your day to feel, and a rules-based rail
  suggests drinks and gear with a reason for each.
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

- Type: [Cabinet Grotesk](https://www.fontshare.com/fonts/cabinet-grotesk) and
  [Erode](https://www.fontshare.com/fonts/erode) by Indian Type Foundry, free under the ITF Free Font
  License and loaded from Fontshare (font files are not included in this repo).
- Products, prices and caffeine levels are illustrative.
