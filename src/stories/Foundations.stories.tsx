import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { contrast, firstFamily, fontFaces, resolve, sourceOf, type Theme } from './tokenSheet';

const meta = {
  title: 'Foundations/Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Every value on these pages is read from src/styles/tokens.css, so they always match the code. Use the token name in code; the hex and px values are there to check against Figma.',
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

/* ---------- Shared bits ---------- */

const themes: Theme[] = ['light', 'dark'];
const hex = (v: string) => (/^#[0-9a-f]{3,8}$/i.test(v) ? v.toUpperCase() : v);
const short = (v: string) => v.replace(/^--(raw|theme)-/, '');

function Page({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-32 p-24 lg:p-48">
      <header className="flex max-w-column flex-col gap-8">
        <h1 className="font-heading text-heading">{title}</h1>
        <p className="font-sans text-body text-text-muted">{intro}</p>
      </header>
      {children}
    </div>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-12">
      <h2 className="font-heading text-title">{title}</h2>
      {note && <p className="max-w-column font-sans text-body-sm text-text-muted">{note}</p>}
      {/* Focusable so keyboard users can scroll the table sideways on small screens. */}
      <div role="region" aria-label={title} tabIndex={0} className="overflow-x-auto rounded-card border border-border bg-bg-surface">
        {children}
      </div>
    </section>
  );
}

const th = 'px-16 py-12 text-left font-sans text-label text-text-muted whitespace-nowrap';
const td = 'px-16 py-12 align-top font-sans text-body-sm';
const mono = 'font-mono text-caption';

function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-border">
          {head.map((h) => (
            <th key={h} scope="col" className={th}>
              {h || <span className="sr-only">Swatch</span>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">{children}</tbody>
    </table>
  );
}

/** A colour in one theme: its hex, and the raw token it comes from. */
function Value({ name, mode, category }: { name: string; mode: Theme; category?: string }) {
  const src = sourceOf(name, mode, category);
  return (
    <div className="flex flex-col gap-2 whitespace-nowrap">
      <code className={`${mono} text-text-primary`}>{hex(resolve(name, mode, category))}</code>
      {src.startsWith('--') && <code className={`${mono} text-text-muted`}>{short(src)}</code>}
    </div>
  );
}

function Ratio({ fg, bg, min, mode, category }: { fg: string; bg: string; min: number; mode: Theme; category?: string }) {
  const r = contrast(resolve(fg, mode, category), resolve(bg, mode, category));
  if (r === null) return <span className={mono}>–</span>;
  const pass = r >= min;
  return (
    <span className="inline-flex items-center gap-8 whitespace-nowrap">
      <code className={`${mono} text-text-primary`}>{r.toFixed(1)}:1</code>
      <span className={`font-sans text-caption ${pass ? 'text-text-muted' : 'text-danger'}`}>{pass ? `passes ${min}` : `fails ${min}`}</span>
    </span>
  );
}

/* ---------- Colour ---------- */

const semantic: { util: string; swatch: string; token: string; use: string }[] = [
  { util: 'bg-bg-page', swatch: 'bg-bg-page', token: '--theme-bg-page', use: 'Page background' },
  { util: 'bg-bg-surface', swatch: 'bg-bg-surface', token: '--theme-bg-surface', use: 'Cards, sheets, the header' },
  { util: 'bg-bg-subtle', swatch: 'bg-bg-subtle', token: '--theme-bg-subtle', use: 'Quiet fills: tracks, chips, size pills' },
  { util: 'text-text-primary', swatch: 'bg-text-primary', token: '--theme-text-primary', use: 'Body text, headings, icons' },
  { util: 'text-text-muted', swatch: 'bg-text-muted', token: '--theme-text-muted', use: 'Secondary text, hints, labels' },
  { util: 'text-text-inverse', swatch: 'bg-text-inverse', token: '--theme-text-inverse', use: 'Text on a text-coloured fill' },
  { util: 'border-border', swatch: 'bg-border', token: '--theme-border', use: 'Card and divider lines' },
  { util: 'border-border-strong', swatch: 'bg-border-strong', token: '--theme-border-strong', use: 'Inputs, unselected controls' },
  { util: 'bg-action', swatch: 'bg-action', token: '--theme-action', use: 'The one main call to action per screen' },
  { util: 'text-action-text', swatch: 'bg-action-text', token: '--theme-action-text', use: 'Text on the action button' },
  { util: 'bg-brand', swatch: 'bg-brand', token: '--theme-brand', use: 'Secondary buttons, selected tabs and toggles' },
  { util: 'text-on-brand', swatch: 'bg-on-brand', token: '--theme-on-brand', use: 'Text on brand' },
  { util: 'bg-primary', swatch: 'bg-primary', token: '--theme-primary', use: 'Selected borders and fills' },
  { util: 'bg-primary-subtle', swatch: 'bg-primary-subtle', token: '--theme-primary-subtle', use: 'Selected cards, info panels' },
  { util: 'text-on-primary', swatch: 'bg-on-primary', token: '--theme-on-primary', use: 'Text on primary' },
  { util: 'bg-spark', swatch: 'bg-spark', token: '--theme-spark', use: 'Highlights: in-box ring, logo dot' },
  { util: 'bg-spark-subtle', swatch: 'bg-spark-subtle', token: '--theme-spark-subtle', use: 'Savings highlight' },
  { util: 'text-on-spark-subtle', swatch: 'bg-on-spark-subtle', token: '--theme-on-spark-subtle', use: 'Text on the savings highlight' },
  { util: 'text-danger', swatch: 'bg-danger', token: '--theme-danger', use: 'Warnings and errors only' },
  { util: 'bg-danger-subtle', swatch: 'bg-danger-subtle', token: '--theme-danger-subtle', use: 'Warning panels' },
];

const pairs: { fg: string; bg: string; label: string; min: number }[] = [
  { fg: '--theme-text-primary', bg: '--theme-bg-page', label: 'Text on page', min: 4.5 },
  { fg: '--theme-text-primary', bg: '--theme-bg-subtle', label: 'Text on subtle', min: 4.5 },
  { fg: '--theme-text-muted', bg: '--theme-bg-page', label: 'Muted text on page', min: 4.5 },
  { fg: '--theme-text-muted', bg: '--theme-bg-subtle', label: 'Muted text on subtle', min: 4.5 },
  { fg: '--theme-action-text', bg: '--theme-action', label: 'Action button', min: 4.5 },
  { fg: '--theme-on-brand', bg: '--theme-brand', label: 'Brand button', min: 4.5 },
  { fg: '--theme-on-primary', bg: '--theme-primary', label: 'On primary', min: 4.5 },
  { fg: '--theme-on-spark-subtle', bg: '--theme-spark-subtle', label: 'Savings highlight', min: 4.5 },
  { fg: '--theme-danger', bg: '--theme-bg-page', label: 'Danger on page', min: 4.5 },
  { fg: '--theme-danger', bg: '--theme-danger-subtle', label: 'Danger on its panel', min: 4.5 },
  { fg: '--theme-border-strong', bg: '--theme-bg-page', label: 'Strong border (non-text)', min: 3 },
  { fg: '--theme-spark', bg: '--theme-bg-page', label: 'Spark ring (non-text)', min: 3 },
];

const categories = ['coffee', 'tea', 'matcha', 'gear', 'bites', 'sweeteners'] as const;

export const Colour: Story = {
  render: () => (
    <Page
      title="Colour"
      intro="Use the token in code (bg-bg-page), never the hex. Values come straight from tokens.css; the second line under each hex is the raw palette token it points at."
    >
      <Section title="Semantic colours">
        <Table head={['', 'Token', 'Light', 'Dark', 'Use']}>
          {semantic.map(({ util, swatch, token, use }) => (
            <tr key={util}>
              <td className={td}>
                <span className="flex gap-4">
                  {themes.map((m) => (
                    <span key={m} data-theme={m} className={`block size-32 rounded-sm border border-border ${swatch}`} />
                  ))}
                </span>
              </td>
              <td className={td}>
                <code className={`${mono} whitespace-nowrap text-text-primary`}>{util}</code>
              </td>
              {themes.map((m) => (
                <td key={m} className={td}>
                  <Value name={token} mode={m} />
                </td>
              ))}
              <td className={`${td} min-w-200 text-text-muted`}>{use}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section title="Contrast" note="WCAG 2.2 AA: 4.5:1 for text, 3:1 for borders and other non-text marks. Worked out from the values above.">
        <Table head={['Pair', 'Tokens', 'Light', 'Dark']}>
          {pairs.map((p) => (
            <tr key={p.label}>
              <td className={`${td} min-w-160`}>{p.label}</td>
              <td className={td}>
                <code className={`${mono} whitespace-nowrap text-text-muted`}>
                  {short(p.fg)} on {short(p.bg)}
                </code>
              </td>
              {themes.map((m) => (
                <td key={m} className={td}>
                  <Ratio fg={p.fg} bg={p.bg} min={p.min} mode={m} />
                </td>
              ))}
            </tr>
          ))}
        </Table>
      </Section>

      <Section
        title="Category accents"
        note="Set data-category on a wrapper and use text-accent, bg-accent, bg-accent-subtle and text-on-accent. Ratios: accent text on a card, and on-accent on an accent fill."
      >
        <Table head={['Category', 'accent', 'accent-subtle', 'on-accent', 'Accent on card', 'On-accent on accent']}>
          {categories.flatMap((c) =>
            themes.map((m) => (
              <tr key={c + m}>
                <td className={td}>
                  <span data-theme={m} className="inline-flex items-center gap-8 rounded-pill bg-bg-page px-12 py-4">
                    <span data-category={c} className="flex gap-4">
                      <span className="block size-20 rounded-pill bg-accent" />
                      <span className="block size-20 rounded-pill border border-border bg-accent-subtle" />
                    </span>
                    <span className="whitespace-nowrap font-sans text-label capitalize text-text-primary">
                      {c} · {m}
                    </span>
                  </span>
                </td>
                {['--accent', '--accent-subtle', '--on-accent'].map((t) => (
                  <td key={t} className={td}>
                    <Value name={t} mode={m} category={c} />
                  </td>
                ))}
                <td className={td}>
                  <Ratio fg="--accent" bg="--theme-bg-surface" min={4.5} mode={m} category={c} />
                </td>
                <td className={td}>
                  <Ratio fg="--on-accent" bg="--accent" min={4.5} mode={m} category={c} />
                </td>
              </tr>
            )),
          )}
        </Table>
      </Section>
    </Page>
  ),
};

/* ---------- Typography ---------- */

const families: { util: string; token: string; use: string }[] = [
  { util: 'font-heading', token: '--font-heading', use: 'Headlines: wordmark, page and section titles' },
  { util: 'font-sans', token: '--font-sans', use: 'Body and UI: labels, buttons, descriptions, prices' },
  { util: 'font-mono', token: '--font-mono', use: 'Brew data (ratio, temperature, time) and eyebrows' },
];

const typeScale: { style: string; cls: string; family: 'font-heading' | 'font-sans' | 'font-mono'; sample: string; use: string; extra?: string }[] = [
  { style: 'display', cls: 'text-display', family: 'font-heading', sample: 'Ondo', use: 'Hero headline' },
  { style: 'heading', cls: 'text-heading', family: 'font-heading', sample: 'How do you want your day to feel?', use: 'Page titles' },
  { style: 'title', cls: 'text-title', family: 'font-heading', sample: 'For calm focus', use: 'Section titles' },
  { style: 'title', cls: 'text-title', family: 'font-sans', sample: '£20.70', use: 'Big prices' },
  { style: 'body-lg', cls: 'text-body-lg', family: 'font-sans', sample: 'Coffee, tea and matcha, paced to your day.', use: 'Intro paragraphs' },
  { style: 'body', cls: 'text-body', family: 'font-sans', sample: 'First-harvest Uji matcha for drinking straight.', use: 'Body text' },
  { style: 'body-sm', cls: 'text-body-sm', family: 'font-sans', sample: 'Washed Ethiopian with a clean, floral cup.', use: 'Dense mobile copy' },
  { style: 'footnote', cls: 'text-footnote', family: 'font-sans', sample: 'Includes 10% subscription saving', use: 'Card descriptions, sub-labels' },
  { style: 'label', cls: 'text-label', family: 'font-sans', sample: 'Start subscription', use: 'Buttons, form labels' },
  { style: 'caption', cls: 'text-caption', family: 'font-sans', sample: 'Goes with your Shizuoka Sencha', use: 'Reasons, small meta' },
  { style: 'eyebrow', cls: 'text-eyebrow', family: 'font-mono', sample: 'Ratio 1:16 · 94°C', use: 'Brew data, section eyebrows', extra: 'uppercase' },
];

const weightName: Record<string, string> = { '400': 'Regular', '500': 'Medium', '600': 'Semibold', '700': 'Bold', '800': 'Heavy' };

function sizeAt(style: string, size: 'mobile' | 'desktop') {
  const px = resolve(`--text-${style}`, 'light', undefined, size);
  const lh = resolve(`--text-${style}--line-height`, 'light', undefined, size);
  return `${px.replace('px', '')} / ${lh.replace('px', '')}`;
}

export const Typography: Story = {
  render: () => (
    <Page
      title="Typography"
      intro="Two families, self-hosted under the SIL Open Font License, plus the system monospace. Sizes are px (size / line height); the scale steps up at 1024px."
    >
      <Section title="Families">
        <Table head={['Token', 'Family', 'Weights loaded', 'Use']}>
          {families.map(({ util, token, use }) => {
            const family = firstFamily(resolve(token, 'light'));
            const weights = fontFaces.filter((f) => f.family === family).map((f) => f.weight.replace(' ', '–'));
            return (
              <tr key={util}>
                <td className={td}>
                  <code className={`${mono} whitespace-nowrap text-text-primary`}>{util}</code>
                </td>
                <td className={td}>
                  <span className={`${util} text-title`}>{family === 'ui-monospace' ? 'System monospace' : family}</span>
                </td>
                <td className={td}>
                  <code className={mono}>{weights.length ? weights.join(', ') : 'system'}</code>
                </td>
                <td className={`${td} text-text-muted`}>{use}</td>
              </tr>
            );
          })}
        </Table>
      </Section>

      <Section title="Type scale">
        <Table head={['Sample', 'Token', 'Family', 'Weight', 'Mobile', 'Desktop ≥1024', 'Letter spacing', 'Use']}>
          {typeScale.map(({ style, cls, family, sample, use, extra }) => {
            const famToken = families.find((f) => f.util === family)!.token;
            const weight = resolve(`--text-${style}--font-weight`, 'light') || '400';
            const tracking = resolve(`--text-${style}--letter-spacing`, 'light') || '0';
            return (
              <tr key={style + family}>
                <td className={`${td} min-w-200`}>
                  <span className={`${cls} ${family} ${extra ?? ''} block`}>{sample}</span>
                </td>
                <td className={td}>
                  <code className={`${mono} text-text-primary whitespace-nowrap`}>{cls}</code>
                  <br />
                  <code className={`${mono} text-text-muted whitespace-nowrap`}>
                    {family}
                    {extra ? ` ${extra}` : ''}
                  </code>
                </td>
                <td className={`${td} whitespace-nowrap`}>{firstFamily(resolve(famToken, 'light')).replace('ui-monospace', 'System mono')}</td>
                <td className={`${td} whitespace-nowrap`}>
                  {weight} {weightName[weight] ?? ''}
                </td>
                <td className={td}>
                  <code className={`${mono} whitespace-nowrap`}>{sizeAt(style, 'mobile')}</code>
                </td>
                <td className={td}>
                  <code className={`${mono} whitespace-nowrap`}>{sizeAt(style, 'desktop')}</code>
                </td>
                <td className={td}>
                  <code className={mono}>{tracking}</code>
                </td>
                <td className={`${td} min-w-160 text-text-muted`}>{use}</td>
              </tr>
            );
          })}
        </Table>
      </Section>
    </Page>
  ),
};

export const ShapeAndDepth: Story = {
  name: 'Radius & elevation',
  render: () => (
    <div className="flex flex-wrap gap-24">
      {(['rounded-sm', 'rounded-card', 'rounded-panel', 'rounded-pill'] as const).map((r) => (
        <div key={r} className="flex flex-col items-center gap-8">
          <span className={`block h-80 w-120 border border-border-strong bg-bg-surface ${r}`} />
          <code className="font-mono text-caption">{r}</code>
        </div>
      ))}
      <div className="flex flex-col items-center gap-8">
        <span className="block h-80 w-120 rounded-card bg-bg-surface shadow-raised" />
        <code className="font-mono text-caption">shadow-raised</code>
      </div>
      <div className="flex flex-col items-center gap-8">
        <span data-theme="dark" className="grain relative block h-80 w-120 overflow-hidden rounded-card bg-bg-page" />
        <code className="font-mono text-caption">grain</code>
      </div>
    </div>
  ),
};
