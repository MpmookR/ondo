'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  Button,
  CaffeinePicker,
  ChipGroup,
  ChoiceCard,
  CupTally,
  IconButton,
  KitDrawings,
  OnboardingProgress,
  QuestionHeading,
  WindowLight,
  useBox,
  type CaffeineLimit,
} from '@/components';
import { useRadioGroup } from '@/components/shared/useRadioGroup';
import { catalogue } from '@/data/catalogue';
import { goals } from '@/data/goals';
import { avoidOptions, brewKitOptions, counts, countLabel } from '@/data/labels';
import {
  SKIPPED,
  caffeineExample,
  extraOptions,
  kitFor,
  onboardingSteps,
  tasteOptions,
  type StepId,
} from '@/data/onboarding';
import { starterBox } from '@/lib/starterBox';
import { boxHref, homeHref, shopHref } from '@/lib/routes';
import type { BrewKit, Count, Customer, DrinkCategory, Extra, Goal, Taste } from '@/types';
import type { IconName } from '@/components/Icon';

/** What's been answered so far. `undefined` = not answered yet; skipped questions fall back to SKIPPED. */
interface Draft {
  goal?: Goal;
  drinkers?: Count;
  cupsPerDay?: Count;
  drinks?: DrinkCategory[];
  brewKit?: BrewKit[];
  /** "Nothing yet" chosen (distinct from not answered). */
  noKit?: boolean;
  maxCaffeine?: CaffeineLimit;
  avoids?: string[];
  noAvoids?: boolean;
  taste?: Taste | 'not-sure';
  extras?: Extra[];
}

const drinkCards: { id: DrinkCategory; label: string; blurb: string; icon: IconName }[] = [
  { id: 'coffee', label: 'Coffee', blurb: 'Filter, espresso, moka', icon: 'bean' },
  { id: 'tea', label: 'Tea', blurb: 'Green, black, oolong, herbal', icon: 'leaf' },
  { id: 'matcha', label: 'Matcha', blurb: 'Ceremonial and everyday', icon: 'whisk' },
];

const kitLabels = Object.fromEntries(brewKitOptions.map((k) => [k.id, k.label])) as Record<BrewKit, string>;

/** The answers so far, as a full customer: anything not answered takes the safe default. */
function toCustomer(d: Draft): Customer {
  return {
    goal: d.goal ?? SKIPPED.goal,
    drinkers: d.drinkers ?? SKIPPED.drinkers,
    cupsPerDay: d.cupsPerDay ?? SKIPPED.cupsPerDay,
    drinks: d.drinks ?? SKIPPED.drinks,
    brewKit: d.brewKit ?? SKIPPED.brewKit,
    maxCaffeine: d.maxCaffeine ?? SKIPPED.maxCaffeine,
    avoids: d.avoids ?? SKIPPED.avoids,
    taste: d.taste === 'not-sure' ? undefined : d.taste,
    extras: d.extras ?? [],
  };
}

/** Only what was actually answered, for "I'd rather browse" (it keeps answers, never invents them). */
function answeredOnly(d: Draft): Partial<Customer> {
  const full = toCustomer(d);
  const patch: Partial<Customer> = {};
  if (d.goal) patch.goal = full.goal;
  if (d.drinkers) patch.drinkers = full.drinkers;
  if (d.cupsPerDay) patch.cupsPerDay = full.cupsPerDay;
  if (d.drinks?.length) patch.drinks = full.drinks;
  if (d.brewKit?.length || d.noKit) patch.brewKit = full.brewKit;
  if (d.maxCaffeine) patch.maxCaffeine = full.maxCaffeine;
  if (d.avoids?.length || d.noAvoids) patch.avoids = full.avoids;
  return patch;
}

function isAnswered(id: StepId, d: Draft): boolean {
  switch (id) {
    case 'goal':
      return Boolean(d.goal);
    case 'drinkers':
      return Boolean(d.drinkers);
    case 'cups':
      return Boolean(d.cupsPerDay);
    case 'drinks':
      return Boolean(d.drinks?.length);
    case 'brewKit':
      return Boolean(d.brewKit?.length || d.noKit);
    case 'caffeine':
      return Boolean(d.maxCaffeine);
    case 'avoids':
      return Boolean(d.avoids?.length || d.noAvoids);
    case 'extras':
      return true;
  }
}

/**
 * Onboarding: eight short screens that build the first box. One question per screen (the optional
 * extras share one), every one skippable, with the step, the count left and a filling cup always in
 * view. Nothing moves on by itself: every answer waits for Next. Rules and copy: doc/prd.md (Onboarding).
 */
export function OnboardingPage() {
  const router = useRouter();
  const { dispatch, theme, setTheme } = useBox();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [draft, setDraft] = useState<Draft>({});
  const headingRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const step = onboardingSteps[index];
  const total = onboardingSteps.length;
  const isLast = index === total - 1;
  const headingId = `question-${step.id}`;

  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const go = (to: number) => {
    setDirection(to > index ? 1 : -1);
    setIndex(to);
  };
  const next = () => go(Math.min(index + 1, total - 1));
  const back = () => go(Math.max(index - 1, 0));

  // A new question: back to the top, and focus moves to it so screen readers hear it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    headingRef.current?.querySelector('h1')?.focus();
  }, [index]);

  /** "Skip these" leaves the optional answers out entirely, so nothing extra is added. */
  const finish = (skipOptional = false) => {
    const answers = skipOptional ? { ...draft, taste: undefined, extras: undefined } : draft;
    const customer = toCustomer(answers);
    // Picks are added to anything they'd already put in the box; nothing of theirs changes.
    dispatch({ type: 'startFirstBox', customer, lines: starterBox(customer, catalogue).lines });
    router.push(boxHref);
  };

  const browse = () => {
    const patch = answeredOnly(draft);
    if (Object.keys(patch).length > 0) dispatch({ type: 'updateCustomer', patch });
    router.push(shopHref());
  };

  // ---------- Single-choice groups (arrow keys move, a tap commits) ----------
  const goalGroup = useRadioGroup(
    goals.map((g) => g.id),
    draft.goal ?? null,
    (goal) => update({ goal }),
  );
  const drinkersGroup = useRadioGroup(counts, draft.drinkers ?? null, (drinkers) => update({ drinkers }));
  const cupsGroup = useRadioGroup(counts, draft.cupsPerDay ?? null, (cupsPerDay) => update({ cupsPerDay }));

  const kitOptions = brewKitOptions.filter((k) => !draft.drinks?.length || kitFor[k.id].some((d) => draft.drinks!.includes(d)));

  const renderAnswers = () => {
    switch (step.id) {
      case 'goal':
        return (
          <div role="radiogroup" aria-labelledby={headingId} className="grid gap-12 sm:grid-cols-2">
            {goals.map((g, i) => (
              <ChoiceCard
                key={g.id}
                kind="radio"
                checked={draft.goal === g.id}
                eyebrow={g.eyebrow}
                label={g.label}
                blurb={g.blurb}
                order={i}
                {...goalGroup.getOptionProps(g.id, i)}
              />
            ))}
          </div>
        );
      case 'drinkers':
        return (
          <div role="radiogroup" aria-labelledby={headingId} className="grid grid-cols-4 gap-8">
            {counts.map((n, i) => (
              <ChoiceCard
                key={n}
                kind="radio"
                size="tile"
                checked={draft.drinkers === n}
                label={countLabel(n)}
                blurb={n === 1 ? 'Just me' : 'people'}
                aria-label={n === 1 ? 'Just me' : `${countLabel(n)} people`}
                order={i}
                {...drinkersGroup.getOptionProps(n, i)}
              />
            ))}
          </div>
        );
      case 'cups':
        return (
          <>
            <div role="radiogroup" aria-labelledby={headingId} className="grid grid-cols-4 gap-8">
              {counts.map((n, i) => (
                <ChoiceCard
                  key={n}
                  kind="radio"
                  size="tile"
                  checked={draft.cupsPerDay === n}
                  label={countLabel(n)}
                  blurb={n === 1 ? 'cup' : 'cups'}
                  aria-label={`${countLabel(n)} ${n === 1 ? 'cup' : 'cups'} a day`}
                  order={i}
                  {...cupsGroup.getOptionProps(n, i)}
                />
              ))}
            </div>
            {draft.cupsPerDay && <CupTally drinkers={draft.drinkers ?? SKIPPED.drinkers} cupsPerDay={draft.cupsPerDay} />}
          </>
        );
      case 'drinks':
        return (
          <div role="group" aria-labelledby={headingId} className="flex flex-col gap-12">
            <p className="font-sans text-body-sm text-text-muted">Pick any.</p>
            {drinkCards.map((c, i) => {
              const checked = draft.drinks?.includes(c.id) ?? false;
              return (
                <ChoiceCard
                  key={c.id}
                  kind="checkbox"
                  checked={checked}
                  category={c.id}
                  icon={c.icon}
                  label={c.label}
                  blurb={c.blurb}
                  order={i}
                  onClick={() => {
                    const now = draft.drinks ?? [];
                    update({ drinks: checked ? now.filter((d) => d !== c.id) : [...now, c.id] });
                  }}
                />
              );
            })}
          </div>
        );
      case 'brewKit':
        return (
          <>
            <ChipGroup
              legend={step.question}
              options={kitOptions}
              selected={draft.brewKit ?? []}
              onChange={(brewKit) => update({ brewKit, noKit: false })}
              noneLabel="Nothing yet"
              noneSelected={draft.noKit}
              onNone={() => update({ brewKit: [], noKit: !draft.noKit })}
            />
            <KitDrawings kit={draft.brewKit ?? []} labels={kitLabels} />
          </>
        );
      case 'caffeine':
        return (
          <CaffeinePicker
            value={draft.maxCaffeine ?? null}
            onChange={(maxCaffeine) => update({ maxCaffeine })}
            examples={caffeineExample}
            labelledBy={headingId}
          />
        );
      case 'avoids':
        return (
          <ChipGroup
            legend={step.question}
            options={[...avoidOptions]}
            selected={draft.avoids ?? []}
            onChange={(avoids) => update({ avoids, noAvoids: false })}
            noneLabel="None"
            noneSelected={draft.noAvoids}
            onNone={() => update({ avoids: [], noAvoids: !draft.noAvoids })}
          />
        );
      case 'extras':
        return (
          <div className="flex flex-col gap-24">
            {/* Two short questions, both optional. Only answers that change the box are asked. */}
            <fieldset className="flex flex-col gap-12">
              <legend className="pb-12 font-sans text-label">Add something to try with your cup?</legend>
              <div className="grid gap-12 sm:grid-cols-2">
                {extraOptions.map((o, i) => {
                  const checked = draft.extras?.includes(o.id) ?? false;
                  return (
                    <ChoiceCard
                      key={o.id}
                      kind="checkbox"
                      checked={checked}
                      icon={o.icon}
                      label={o.label}
                      order={i}
                      onClick={() => {
                        const now = draft.extras ?? [];
                        update({ extras: checked ? now.filter((e) => e !== o.id) : [...now, o.id] });
                      }}
                    />
                  );
                })}
              </div>
              <p className="font-sans text-body-sm text-text-muted">First box only. Remove it any time.</p>
            </fieldset>
            <ChipGroup
              legend="What do you like the taste of?"
              showLegend
              single
              options={tasteOptions}
              selected={draft.taste ? [draft.taste] : []}
              onChange={([taste]) => update({ taste })}
              order={2}
            />
          </div>
        );
    }
  };

  const answered = isAnswered(step.id, draft);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-bg-page">
      <WindowLight />

      <header className="relative mx-auto flex w-full max-w-content items-center justify-between gap-16 px-margin py-12">
        <Link
          href={homeHref}
          aria-label="Ondo, home"
          className="flex min-h-44 items-center rounded-sm font-heading text-title font-heavy uppercase tracking-wide text-brand"
        >
          Ondo
        </Link>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={browse}
            className="flex min-h-44 items-center rounded-pill px-12 font-sans text-label font-semibold transition-colors duration-120 ease-brew hover:bg-bg-subtle"
          >
            I&apos;d rather browse
          </button>
          <IconButton
            icon={theme === 'light' ? 'moon' : 'sun'}
            label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            variant="ghost"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
        </div>
      </header>

      {/* Always one column, question above answers: 560px on phones and tablets, 800px from 1024px. */}
      <div className="relative mx-auto w-full max-w-column px-margin lg:max-w-form">
        <OnboardingProgress step={index + 1} total={total} lastIsOptional />
      </div>

      <main className="relative mx-auto flex w-full max-w-column flex-1 flex-col px-margin pb-48 pt-32 lg:max-w-form lg:pt-64">
        {/* A new key per question replays the entrance, sliding from the side you're heading. */}
        <div
          key={step.id}
          ref={headingRef}
          className="flex flex-col gap-24 animate-step-in motion-reduce:animate-none lg:gap-32"
          style={{ '--step-dir': direction } as CSSProperties}
        >
          <QuestionHeading
            id={headingId}
            eyebrow={isLast ? 'Optional' : `Question ${index + 1}`}
            question={step.question}
            reason={step.reason}
          />
          <div className="flex flex-col gap-24">{renderAnswers()}</div>
        </div>
      </main>

      <footer className="sticky bottom-0 z-10 border-t border-border bg-bg-page pb-safe shadow-bar">
        <div className="mx-auto flex w-full max-w-column items-center gap-8 px-margin py-12 lg:max-w-form">
          {index > 0 && (
            <Button variant="ghost" icon="chevron-left" onClick={back} className="px-12 sm:px-20">
              {/* Icon only on small phones, where the last step's two buttons need the room. */}
              <span className="sr-only sm:not-sr-only">Back</span>
            </Button>
          )}
          <div className="ml-auto flex items-center gap-8">
            {isLast ? (
              <>
                <Button variant="ghost" onClick={() => finish(true)}>
                  Skip these
                </Button>
                <Button size="lg" icon="arrow-right" iconPosition="end" onClick={() => finish()}>
                  Build my box
                </Button>
              </>
            ) : (
              <>
                {/* Answered: Next. Not yet: Skip, which uses the safe default. */}
                {!answered && (
                  <Button variant="ghost" onClick={next}>
                    Skip
                  </Button>
                )}
                {answered && (
                  <Button size="lg" icon="arrow-right" iconPosition="end" onClick={next}>
                    Next
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
