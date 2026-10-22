import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = { title: 'Foundations/Tokens', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj;

const semantic = [
  ['bg-bg-page', 'bg-page'],
  ['bg-bg-surface', 'bg-surface'],
  ['bg-bg-subtle', 'bg-subtle'],
  ['bg-text-primary', 'text-primary'],
  ['bg-text-muted', 'text-muted'],
  ['bg-border', 'border'],
  ['bg-border-strong', 'border-strong'],
  ['bg-action', 'action'],
  ['bg-primary', 'primary'],
  ['bg-primary-subtle', 'primary-subtle'],
] as const;

function Swatch({ cls, name }: { cls: string; name: string }) {
  return (
    <div className="flex items-center gap-12">
      <span className={`size-40 shrink-0 rounded-sm border border-border ${cls}`} />
      <code className="font-mono text-caption text-text-primary">{name}</code>
    </div>
  );
}

function ThemePanel({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <section data-theme={theme} className="flex-1 bg-bg-page p-32 text-text-primary">
      <p className="font-mono text-eyebrow uppercase text-text-muted">{theme === 'light' ? 'Light' : 'Dark'}</p>
      <div className="mt-16 grid grid-cols-2 gap-12">
        {semantic.map(([cls, name]) => (
          <Swatch key={name} cls={cls} name={name} />
        ))}
      </div>
      <p className="mt-32 font-mono text-eyebrow uppercase text-text-muted">Category accents</p>
      <div className="mt-16 grid grid-cols-2 gap-12">
        {(['coffee', 'tea', 'matcha', 'gear'] as const).map((c) => (
          <div key={c} data-category={c} className="rounded-card border border-border bg-bg-surface p-16">
            <div className="flex gap-8">
              <span className="size-32 rounded-pill bg-accent" />
              <span className="size-32 rounded-pill bg-accent-subtle" />
            </div>
            <p className="mt-12 font-sans text-title text-accent capitalize">{c}</p>
            <p className="mt-8 inline-flex rounded-pill bg-accent px-12 py-4 font-sans text-caption text-on-accent">on-accent</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export const Colour: Story = {
  render: () => (
    <div className="-m-24 flex flex-col lg:flex-row">
      <ThemePanel theme="light" />
      <ThemePanel theme="dark" />
    </div>
  ),
};

const typeScale = [
  ['text-display', 'font-heading', 'Ondo'],
  ['text-heading', 'font-heading', 'How do you want your day to feel?'],
  ['text-title', 'font-heading', 'For calm focus'],
  ['text-title', 'font-sans', '£20.70'],
  ['text-body-lg', 'font-sans', 'Coffee, tea and matcha, paced to your day.'],
  ['text-body', 'font-sans', 'First-harvest Uji matcha for drinking straight.'],
  ['text-label', 'font-sans', 'Start subscription'],
  ['text-caption', 'font-sans', 'Goes with your Shizuoka Sencha'],
  ['text-eyebrow', 'font-mono uppercase', 'Ratio 1:16 · 94°C'],
] as const;

export const Typography: Story = {
  render: () => (
    <div className="flex flex-col gap-24">
      {typeScale.map(([size, family, sample]) => (
        <div key={size} className="grid gap-8 border-b border-border pb-16 lg:grid-cols-12">
          <code className="font-mono text-caption text-text-muted lg:col-span-3">
            {size}
            <br />
            {family}
          </code>
          <p className={`${size} ${family} lg:col-span-9`}>{sample}</p>
        </div>
      ))}
    </div>
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
