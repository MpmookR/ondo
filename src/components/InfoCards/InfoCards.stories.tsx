import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Customer } from '@/types';
import { defaultCustomer } from '@/data/customer';
import { DeliveryCard, PreferencesCard } from './InfoCards';
import { Phone } from '@/stories/fixtures';

const meta = {
  title: 'Patterns/InfoCards',
  component: DeliveryCard,
  args: { date: 'Tue 3 Nov' },
  decorators: [(Story) => <Phone><Story /></Phone>],
} satisfies Meta<typeof DeliveryCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Delivery: Story = {};

export const Preferences: Story = {
  parameters: { docs: { description: { story: 'Editable quiz answers. Goal and caffeine limit are radiogroups (arrow keys).' } } },
  render: function Render() {
    const [c, setC] = useState<Customer>(defaultCustomer);
    return (
      <PreferencesCard
        customer={c}
        defaultOpen
        onGoalChange={(goal) => setC({ ...c, goal })}
        onMaxCaffeineChange={(maxCaffeine) => setC({ ...c, maxCaffeine })}
        onToggleAvoid={(a) => setC({ ...c, avoids: c.avoids.includes(a) ? c.avoids.filter((x) => x !== a) : [...c.avoids, a] })}
      />
    );
  },
};
