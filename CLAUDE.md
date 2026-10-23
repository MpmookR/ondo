# Ondo

Design system and demo shop for Ondo, an invented caffeine subscription.

Product goal: build your first subscription box. Raise AOV and items per order in a new customer's
first box without costing conversion. When a design choice trades one against the other,
conversion wins (price always visible, no pushy or irrelevant suggestions).

Read `doc/agent.md` first: it has the design rules, code rules, commands and definition of done.
Then `doc/design_system.md` (tokens and components), `doc/prd.md` (product rules) and
`doc/architecture.md` (structure and data model).

The one rule that matters most: every visual value comes from `src/styles/tokens.css`.
No hex codes or arbitrary values in components, and no branching on category or theme for styling.
