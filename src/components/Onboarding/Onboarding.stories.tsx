import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Count, DrinkCategory } from '@/types';
import { goals } from '@/data/goals';
import { avoidOptions, counts, countLabel } from '@/data/labels';
import { caffeineExample, tasteOptions } from '@/data/onboarding';
import { Phone } from '@/stories/fixtures';
import { WindowLight } from '../HomeHero';
import { OnboardingProgress } from './OnboardingProgress';
import { ChoiceCard } from './ChoiceCard';
import { CaffeinePicker, type CaffeineLimit } from './CaffeinePicker';
import { ChipGroup, CupTally, QuestionHeading } from './QuestionParts';
import { KitDrawings } from './KitDrawings';
import { brewKitOptions } from '@/data/labels';
import type { BrewKit } from '@/types';

/** Onboarding parts. Switch the theme in the toolbar to see each in dark. */
const meta = {
  title: 'Patterns/Onboarding',
  component: OnboardingProgress,
  args: { step: 3, total: 8, lastIsOptional: true },
  argTypes: { step: { control: { type: 'range', min: 1, max: 8 } } },
  decorators: [
    (Story) => (
      <Phone>
        <div className="relative overflow-hidden bg-bg-page p-16">
          <WindowLight />
          <div className="relative flex flex-col gap-24">
            <Story />
          </div>
        </div>
      </Phone>
    ),
  ],
} satisfies Meta<typeof OnboardingProgress>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Step, how many are left, a segmented bar and a cup that fills (steam on the last step). */
export const Progress: Story = {};

export const ProgressStates: Story = {
  render: () => (
    <>
      <OnboardingProgress step={1} total={8} lastIsOptional />
      <OnboardingProgress step={5} total={8} lastIsOptional />
      <OnboardingProgress step={8} total={8} lastIsOptional />
      <OnboardingProgress step={8} total={8} />
    </>
  ),
};

/** The question's words rise one by one; replay with the reload button. */
export const Heading: Story = {
  render: () => <QuestionHeading id="q" eyebrow="Question 1" question="How do you want your day to feel?" reason="So we suggest things that fit your day." />,
};

/** One answer: cards (with a time eyebrow) and tiles. Tap to tick. */
export const SingleChoice: Story = {
  render: function Render() {
    const [goal, setGoal] = useState<string | null>('calm-focus');
    const [n, setN] = useState<Count | null>(null);
    return (
      <>
        <div role="radiogroup" aria-label="Goal" className="flex flex-col gap-12">
          {goals.map((g, i) => (
            <ChoiceCard key={g.id} kind="radio" checked={goal === g.id} eyebrow={g.eyebrow} label={g.label} blurb={g.blurb} order={i} onClick={() => setGoal(g.id)} />
          ))}
        </div>
        <div role="radiogroup" aria-label="People" className="grid grid-cols-4 gap-8">
          {counts.map((c, i) => (
            <ChoiceCard key={c} kind="radio" size="tile" checked={n === c} label={countLabel(c)} blurb={c === 1 ? 'Just me' : 'people'} order={i} onClick={() => setN(c)} />
          ))}
        </div>
      </>
    );
  },
};

/** Pick any, with the drink's accent on the icon only (blue always means selected). */
export const MultiChoice: Story = {
  render: function Render() {
    const [drinks, setDrinks] = useState<DrinkCategory[]>(['coffee']);
    const toggle = (d: DrinkCategory) => setDrinks((now) => (now.includes(d) ? now.filter((x) => x !== d) : [...now, d]));
    return (
      <div role="group" aria-label="Drinks" className="flex flex-col gap-12">
        <ChoiceCard kind="checkbox" category="coffee" icon="bean" label="Coffee" blurb="Filter, espresso, moka" checked={drinks.includes('coffee')} onClick={() => toggle('coffee')} />
        <ChoiceCard kind="checkbox" category="tea" icon="leaf" label="Tea" blurb="Green, black, oolong, herbal" checked={drinks.includes('tea')} order={1} onClick={() => toggle('tea')} />
        <ChoiceCard kind="checkbox" category="matcha" icon="whisk" label="Matcha" blurb="Ceremonial and everyday" checked={drinks.includes('matcha')} order={2} onClick={() => toggle('matcha')} />
      </div>
    );
  },
};

export const CupTallyStates: Story = {
  render: () => (
    <>
      <CupTally drinkers={1} cupsPerDay={1} />
      <CupTally drinkers={2} cupsPerDay={2} />
      <CupTally drinkers={4} cupsPerDay={4} />
    </>
  ),
};

/** Five rising bars; nothing chosen, then a level with its example drink. Arrow keys move. */
export const Caffeine: Story = {
  render: function Render() {
    const [level, setLevel] = useState<CaffeineLimit | null>(null);
    return (
      <>
        <p id="caffeine-q" className="font-heading text-title text-brand">What&apos;s your caffeine limit?</p>
        <CaffeinePicker value={level} onChange={setLevel} examples={caffeineExample} labelledBy="caffeine-q" />
      </>
    );
  },
};

/** Chips with an exclusive "none": choosing it clears the rest, and the other way round. */
export const Chips: Story = {
  render: function Render() {
    const [avoids, setAvoids] = useState<string[]>([]);
    const [none, setNone] = useState(false);
    const [taste, setTaste] = useState<string[]>(['fruity']);
    return (
      <>
        <ChipGroup
          legend="Anything to avoid?"
          showLegend
          options={[...avoidOptions]}
          selected={avoids}
          onChange={(a) => {
            setAvoids(a);
            setNone(false);
          }}
          noneLabel="None"
          noneSelected={none}
          onNone={() => {
            setAvoids([]);
            setNone((n) => !n);
          }}
        />
        <ChipGroup legend="What do you like the taste of?" showLegend single options={tasteOptions} selected={taste} onChange={setTaste} />
      </>
    );
  },
};

const kitLabels = Object.fromEntries(brewKitOptions.map((k) => [k.id, k.label])) as Record<BrewKit, string>;

/** Tick kit to watch it draw itself in; a second glides the first to the left, two to a line. */
export const BrewKitDrawings: Story = {
  render: function Render() {
    const [kit, setKit] = useState<BrewKit[]>(['espresso-machine']);
    return (
      <>
        <ChipGroup legend="What do you brew with?" showLegend options={brewKitOptions} selected={kit} onChange={setKit} />
        <KitDrawings kit={kit} labels={kitLabels} />
      </>
    );
  },
};
