import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { BoxLine, Customer, PlanId } from '@/types';
import { catalogue } from '@/data/catalogue';
import { defaultBox, defaultCustomer } from '@/data/customer';
import { addDays, todayISO } from '@/lib/dates';
import { suggestDelivery } from '@/lib/delivery';
import { BuildBoxPrompt, DeliveryCard, PreferencesCard } from './InfoCards';
import { Phone } from '@/stories/fixtures';

const meta = {
  title: 'Patterns/InfoCards',
  component: DeliveryCard,
  args: {
    plan: 'every-15',
    onPlanChange: () => {},
    date: '2026-11-03',
    onDateChange: () => {},
    suggestion: null,
    drinkers: 1,
  },
  decorators: [(Story) => <Phone><Story /></Phone>],
} satisfies Meta<typeof DeliveryCard>;
export default meta;
type Story = StoryObj<typeof meta>;

function DeliveryDemo({ customer, lines, initialPlan = 'every-15', open = true, attention = 0 }: { customer: Customer; lines: BoxLine[]; initialPlan?: PlanId | null; open?: boolean; attention?: number }) {
  const [plan, setPlan] = useState<PlanId | null>(initialPlan);
  const [date, setDate] = useState<string | null>(addDays(todayISO(), 7));
  return (
    <DeliveryCard
      plan={plan}
      onPlanChange={setPlan}
      date={date}
      onDateChange={setDate}
      suggestion={suggestDelivery(lines, catalogue, customer)}
      drinkers={customer.drinkers}
      defaultOpen={open}
      attention={attention}
    />
  );
}

export const Delivery: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The suggestion, how often, then the first delivery. The suggestion is the frequency closest to how long the box lasts: cups in the box ÷ (people × cups a day). It never changes the choice by itself, because the saving differs.',
      },
    },
  },
  decorators: [(Story) => <div className="pb-320"><Story /></div>],
  render: () => <DeliveryDemo customer={defaultCustomer} lines={defaultBox} />,
};

export const DeliveryCollapsed: Story = {
  parameters: { docs: { description: { story: 'Folded to the frequency and the first delivery date, like Your preferences.' } } },
  render: () => <DeliveryDemo customer={defaultCustomer} lines={defaultBox} open={false} />,
};

export const DeliveryNotOnSuggestion: Story = {
  parameters: { docs: { description: { story: 'The suggestion stays in view when the customer picks something else.' } } },
  render: () => <DeliveryDemo customer={{ ...defaultCustomer, cupsPerDay: 1 }} lines={defaultBox} />,
};

export const DeliveryRunsShort: Story = {
  parameters: { docs: { description: { story: 'Two people, two cups each: the box lasts less than 15 days.' } } },
  render: () => <DeliveryDemo customer={{ ...defaultCustomer, drinkers: 2 }} lines={defaultBox} />,
};

export const DeliveryOneOff: Story = {
  render: () => <DeliveryDemo customer={defaultCustomer} lines={defaultBox} initialPlan="once" />,
};

export const DeliveryGearOnly: Story = {
  parameters: { docs: { description: { story: 'No drinks in the box, so there is nothing to suggest from.' } } },
  render: () => <DeliveryDemo customer={defaultCustomer} lines={[{ itemId: 'g-pour-over', qty: 1 }]} />,
};

function PreferencesDemo({ initial = defaultCustomer, editing = false }: { initial?: Customer; editing?: boolean }) {
  const [c, setC] = useState<Customer>(initial);
  return <PreferencesCard customer={c} defaultOpen defaultEditing={editing} onChange={(patch) => setC({ ...c, ...patch })} />;
}

export const Preferences: Story = {
  parameters: { docs: { description: { story: 'The onboarding answers as a summary, with Edit preferences.' } } },
  render: () => <PreferencesDemo />,
};

export const PreferencesEditing: Story = {
  parameters: { docs: { description: { story: 'Goal, people, cups and caffeine limit are radiogroups (arrow keys); drinks, brew kit and avoids are toggles.' } } },
  render: () => <PreferencesDemo editing />,
};

export const PreferencesEmptyAnswers: Story = {
  parameters: { docs: { description: { story: 'Skipped answers read as "Not sure yet", "Nothing yet" and "Nothing".' } } },
  render: () => <PreferencesDemo initial={{ ...defaultCustomer, drinkers: 3, cupsPerDay: 4, drinks: [], brewKit: [], avoids: [] }} />,
};

export const PreferencesCollapsed: Story = {
  render: function Render() {
    const [c, setC] = useState<Customer>(defaultCustomer);
    return <PreferencesCard customer={c} onChange={(patch) => setC({ ...c, ...patch })} />;
  },
};

/** Instead of Your preferences until the customer has answered anything. */
export const BuildBoxPromptCard: Story = {
  render: () => <BuildBoxPrompt href="/onboarding" />,
};

/** The shop's For you tab, before any answers: centred, with its own copy. */
export const BuildBoxPromptCentered: Story = {
  render: () => (
    <BuildBoxPrompt
      href="/onboarding"
      align="centered"
      title="Tell us a little about you"
      body="Tell us how you like your cup, and we'll find your perfect match. It only takes a minute."
    />
  ),
};

/** Nothing chosen yet: the collapsed card asks for a choice. */
export const DeliveryNothingChosen: Story = {
  render: () => <DeliveryDemo customer={defaultCustomer} lines={defaultBox} initialPlan={null} open={false} />,
};

/** Checkout was tapped with nothing chosen: open, with the message until a choice is made. */
export const DeliveryNeedsChoice: Story = {
  render: () => <DeliveryDemo customer={defaultCustomer} lines={defaultBox} initialPlan={null} open={false} attention={1} />,
};
