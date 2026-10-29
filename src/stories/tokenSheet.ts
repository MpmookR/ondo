/**
 * Reads src/styles/tokens.css as text so the Foundations pages show the values that are really
 * in the file: nothing on those pages is typed in by hand, so they can't drift from the tokens.
 * Storybook only (Vite `?raw` import); the app never loads this.
 */
import css from '../styles/tokens.css?raw';

type Decls = Record<string, string>;
export type Theme = 'light' | 'dark';

const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '');

function decls(body: string): Decls {
  const out: Decls = {};
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

/** Cuts `@media (min-width: …) { … }` out of the text and returns its inner rules separately. */
function cutMedia(text: string) {
  const start = text.indexOf('@media (min-width: 1024px)');
  if (start < 0) return { rest: text, media: '' };
  const open = text.indexOf('{', start);
  let depth = 0;
  let end = open;
  for (; end < text.length; end++) {
    if (text[end] === '{') depth++;
    if (text[end] === '}' && --depth === 0) break;
  }
  return { rest: text.slice(0, start) + text.slice(end + 1), media: text.slice(open + 1, end) };
}

const source = stripComments(css);
const { rest, media } = cutMedia(source);
const blocks = [...rest.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), body: m[2] }));

const raw: Decls = {};
const light: Decls = {};
const dark: Decls = {};
const theme: Decls = {};
const catLight: Record<string, Decls> = {};
const catDark: Record<string, Decls> = {};
export const fontFaces: { family: string; weight: string }[] = [];

for (const { sel, body } of blocks) {
  const d = decls(body);
  const cats = [...sel.matchAll(/data-category='([\w-]+)'/g)].map((m) => m[1]);
  if (sel === '@font-face') {
    const family = /font-family:\s*'([^']+)'/.exec(body)?.[1] ?? '';
    const weight = /font-weight:\s*([^;]+);/.exec(body)?.[1].trim() ?? '';
    fontFaces.push({ family, weight });
  } else if (sel.startsWith('@theme')) Object.assign(theme, d);
  else if (cats.length) {
    const target = sel.includes("data-theme='dark'") ? catDark : catLight;
    for (const c of cats) target[c] = { ...target[c], ...d };
  } else if (sel.includes("data-theme='dark'")) Object.assign(dark, d);
  else if (sel.includes("data-theme='light'")) Object.assign(light, d);
  else if (sel === ':root') Object.assign(raw, d);
}
const desktop = decls(media);

function scopes(mode: Theme, category?: string): Decls[] {
  const cat = category ? [mode === 'dark' ? catDark[category] ?? {} : {}, catLight[category] ?? {}] : [];
  return [...cat, ...(mode === 'dark' ? [dark] : []), light, theme, raw];
}

/** Follows `var(--x)` references to the final value, e.g. `--theme-bg-page` → `#fff6dc`. */
export function resolve(name: string, mode: Theme, category?: string, size: 'mobile' | 'desktop' = 'mobile'): string {
  const chain = size === 'desktop' ? [desktop, ...scopes(mode, category)] : scopes(mode, category);
  let value = chain.find((d) => name in d)?.[name] ?? '';
  for (let i = 0; i < 8 && value.includes('var('); i++) {
    value = value.replace(/var\((--[\w-]+)\)/g, (_, v: string) => resolve(v, mode, category, size));
  }
  return value;
}

/**
 * The palette token a value comes from, following aliases until it reaches a `--raw-*` or a
 * `--theme-*` token: `--theme-bg-page` → `--raw-vanilla-100`, `--accent` (coffee) → `--raw-bistre`.
 */
export function sourceOf(name: string, mode: Theme, category?: string): string {
  let current = name;
  for (let i = 0; i < 8; i++) {
    const value = scopes(mode, category).find((d) => current in d)?.[current] ?? '';
    const next = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
    if (!next) return current === name ? value : current;
    current = next;
    if (current.startsWith('--raw-') || (current.startsWith('--theme-') && current !== name)) return current;
  }
  return current;
}

/** First family in a stack, without quotes: `'Fira Sans', ui-sans-serif` → `Fira Sans`. */
export const firstFamily = (stack: string) => stack.split(',')[0].trim().replace(/^'|'$/g, '');

function luminance(hex: string) {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio of two #rrggbb colours, or null if either isn't one. */
export function contrast(a: string, b: string): number | null {
  if (!/^#[0-9a-f]{6}$/i.test(a) || !/^#[0-9a-f]{6}$/i.test(b)) return null;
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
