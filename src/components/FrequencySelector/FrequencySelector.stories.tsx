import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { PlanId } from '@/types';
import { FrequencySelector } from './FrequencySelector';

const meta = {
  title: 'Patterns/FrequencySelector',
  component: FrequencySelector,
  args: { value: 'fortnightly', onChange: () => {} },
} satisfies Meta<typeof FrequencySelector>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
  decorators: [(Story) => <div className="max-w-frame"><Story /></div>],
  render: function Render(args) {
    const [plan, setPlan] = useState<PlanId>(args.value);
    return <FrequencySelector value={plan} onChange={setPlan} />;
  },
};

export const Wide: Story = {
  parameters: { docs: { description: { story: 'A container query puts the switch beside the title once the card is wide enough.' } } },
  decorators: [(Story) => <div className="max-w-content"><Story /></div>],
  render: Mobile.render,
};
