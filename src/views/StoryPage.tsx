'use client';

import Link from 'next/link';
import { Chip, PageHeader, useBox } from '@/components';

type Effect = 'Grows the box' | 'Protects conversion';

interface Change {
  n: number;
  title: string;
  before: string;
  after: string;
  effects: Effect[];
}

/** The six changes; the numbers match the orange callouts on the wireframes. */
const changes: Change[] = [
  {
    n: 1,
    title: 'Give every suggestion a reason',
    before: 'One line for everyone: “Craving more? Check out this week’s add-ons.”',
    after: 'Each suggestion says why it’s there: “Fits calm focus”, “Goes with your Shizuoka Sencha”, “Brews your Moka Blend”.',
    effects: ['Grows the box', 'Protects conversion'],
  },
  {
    n: 2,
    title: 'Use what the customer already told us',
    before: 'Goals and allergens are asked for earlier in the flow, then the summary shows the same featured add-ons to everyone.',
    after: 'A preferences card replays the answers (goal, caffeine limit, things to avoid) and can be edited. Anything they can’t have is never suggested, is tucked away with a reason in the shop, and is flagged on its product page.',
    effects: ['Protects conversion', 'Grows the box'],
  },
  {
    n: 3,
    title: 'Add without leaving the page',
    before: 'Add-ons sit behind “Add / change add-ons”, a separate full-screen list.',
    after: 'Add straight from the suggestion rail or a product page. The button turns into a stepper and the rail doesn’t reshuffle while you add.',
    effects: ['Grows the box'],
  },
  {
    n: 4,
    title: 'Show the whole box at a glance',
    before: 'Meals are a carousel of large photos: one card in view, no quantities.',
    after: 'A compact list grouped by type, with quantity steppers. Groups collapse to thumbnails so the box stays visible.',
    effects: ['Protects conversion'],
  },
  {
    n: 5,
    title: 'One shop instead of two long lists',
    before: 'Meals and add-ons are separate pickers, one large card per row (27 and 33 items).',
    after: 'One shop with tabs (For you · Coffee · Tea · Matcha · Gear) in two columns. “For you” runs the same rules as the suggestion rail.',
    effects: ['Grows the box'],
  },
  {
    n: 6,
    title: 'Put the total first',
    before: 'The box and its total sit at the bottom of the payment page, below the Pay Now button, after every line in the order.',
    after: '“Your first box” opens with the total and cadence; every line, the saving and free delivery are one tap away. The delivery date can be changed in place.',
    effects: ['Protects conversion'],
  },
];

const screens = [
  { before: 'before-1-order-summary', beforeLabel: 'Order summary', after: 'after-1-your-box', afterLabel: 'Your box', href: '/', numbers: [1, 2, 3, 4] },
  { before: 'before-2-select-meals', beforeLabel: 'Select meals', after: 'after-2-shop', afterLabel: 'Shop', href: '/shop', numbers: [5, 2, 1] },
  { before: 'before-3-select-add-ons', beforeLabel: 'Select add-ons', after: 'after-3-item', afterLabel: 'Item page', href: '/item/m-ceremonial', numbers: [3, 1, 2] },
  { before: 'before-4-checkout', beforeLabel: 'Checkout', after: 'after-4-checkout', afterLabel: 'Checkout', href: '/checkout', numbers: [6] },
];

function Marker({ n }: { n: number }) {
  return (
    <span aria-hidden="true" className="grid size-28 shrink-0 place-items-center rounded-pill bg-action font-sans text-label font-bold text-action-text">
      {n}
    </span>
  );
}

function Figure({ file, label, side }: { file: string; label: string; side: 'Before' | 'After' }) {
  return (
    <figure className="flex min-w-0 flex-col gap-8">
      <figcaption className="font-sans text-caption">
        <span className={side === 'After' ? 'font-bold' : 'text-text-muted'}>{side}</span> · {label}
      </figcaption>
      <a href={`/story/${file}.png`} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-card border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/story/${file}.png`}
          width={402}
          height={1200}
          loading="lazy"
          alt={`${side}: low-fi wireframe of the ${label.toLowerCase()} screen, with numbered callouts`}
          className="h-auto w-full"
        />
      </a>
    </figure>
  );
}

/** The redesign story: low-fi before and after, and why each change was made. */
export function StoryPage() {
  const { theme, setTheme } = useBox();

  return (
    <>
      <PageHeader title="The story" backHref="/" theme={theme} onThemeChange={setTheme} />

      <main className="mx-auto flex w-full max-w-content flex-col gap-48 px-16 pb-96 pt-32 lg:px-24 lg:pt-48">
        <section className="mx-auto flex max-w-column flex-col gap-16 lg:max-w-720">
          <p className="font-mono text-eyebrow uppercase text-text-muted">Before and after</p>
          <h2 className="font-heading text-heading">From a take-home task to Ondo</h2>
          <p className="font-sans text-body-lg">
            Ondo recreates a take-home task from one of my job interviews: a food subscription&apos;s first box, where
            add-ons were easy to miss. I presented a working prototype on the day. Here, the original screens are
            redrawn as low-fi wireframes with the brand removed, next to the same screens in Ondo.
          </p>
          <div className="rounded-card border border-primary bg-primary-subtle p-16">
            <p className="font-sans text-label font-bold">The goal</p>
            <p className="mt-4 font-sans text-body">
              Raise average order value and items per order in a new customer&apos;s first box,{' '}
              <strong>without costing conversion</strong>. When the two pull against each other, conversion wins.
            </p>
          </div>
          <p className="font-sans text-body-sm text-text-muted">
            The orange numbers on the wireframes match the six changes below.
          </p>
        </section>

        {screens.map((s) => (
          <section key={s.after} aria-label={`${s.beforeLabel} to ${s.afterLabel}`} className="mx-auto flex w-full flex-col gap-16 lg:max-w-880">
            <div className="flex flex-wrap items-center justify-between gap-12">
              <h2 className="font-heading text-title">
                {s.beforeLabel} <span aria-hidden="true">→</span>
                <span className="sr-only">became</span> {s.afterLabel}
              </h2>
              <div className="flex items-center gap-6">
                {s.numbers.map((n) => (
                  <Marker key={n} n={n} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-12 lg:gap-32">
              <Figure file={s.before} label={s.beforeLabel} side="Before" />
              <Figure file={s.after} label={s.afterLabel} side="After" />
            </div>
            <Link href={s.href} className="self-start font-sans text-label font-bold underline underline-offset-4">
              Open {s.afterLabel} in Ondo
            </Link>
          </section>
        ))}

        <section aria-labelledby="changes-title" className="mx-auto flex w-full max-w-column flex-col gap-24 lg:max-w-720">
          <h2 id="changes-title" className="font-heading text-heading">
            Six changes, and why
          </h2>
          <ol className="flex flex-col gap-16">
            {changes.map((c) => (
              <li key={c.n} className="flex gap-12 rounded-card border border-border bg-bg-surface p-16 shadow-card">
                <Marker n={c.n} />
                <div className="flex min-w-0 flex-col gap-8">
                  <h3 className="font-heading text-title">{c.title}</h3>
                  <p className="font-sans text-body">
                    <span className="font-bold">Before: </span>
                    <span className="text-text-muted">{c.before}</span>
                  </p>
                  <p className="font-sans text-body">
                    <span className="font-bold">After: </span>
                    {c.after}
                  </p>
                  <ul className="flex flex-wrap gap-6" aria-label="Effect">
                    {c.effects.map((e) => (
                      <li key={e}>
                        <Chip tone={e === 'Grows the box' ? 'note' : 'outline'}>{e}</Chip>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto flex w-full max-w-column flex-col gap-12 lg:max-w-720">
          <h2 className="font-heading text-title">What stayed</h2>
          <p className="font-sans text-body">
            Some things already worked and were kept: the total pinned to the bottom of the screen, the savings line,
            the box-wide plan switch (now delivery frequency) and the checkout steps.
          </p>
          <p className="font-sans text-body-sm text-text-muted">
            Wireframes are redrawn from the original layout with all branding, product names, photos and prices removed.
            Ondo, its products and prices are fictional.
          </p>
          <Link
            href="/"
            className="mt-8 flex min-h-48 items-center justify-center rounded-pill bg-action px-24 font-sans text-label font-bold text-action-text transition-opacity duration-120 ease-brew hover:opacity-90 sm:self-start"
          >
            Try Ondo
          </Link>
        </section>
      </main>
    </>
  );
}
