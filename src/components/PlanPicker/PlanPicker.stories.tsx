import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { PlanId } from '@/types';
import { PlanPicker } from './PlanPicker';

const meta = {
  title: 'Components/PlanPicker',
  component: PlanPicker,
  args: { value: 'fortnightly', onChange: () => {} },
  decorators: [(Story) => <div className="max-w-frame"><Story /></div>],
} satisfies Meta<typeof PlanPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: function Render(args) {
    const [plan, setPlan] = useState<PlanId>(args.value);
    return <PlanPicker {...args} value={plan} onChange={setPlan} />;
  },
};
