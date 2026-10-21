import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Goal } from '@/types';
import { GoalPicker } from './GoalPicker';

const meta = {
  title: 'Components/GoalPicker',
  component: GoalPicker,
  args: { value: 'calm-focus', onChange: () => {} },
  decorators: [(Story) => <div className="max-w-720"><Story /></div>],
} satisfies Meta<typeof GoalPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  parameters: { docs: { description: { story: 'Radiogroup: Tab moves in, arrow keys change the goal.' } } },
  render: function Render(args) {
    const [goal, setGoal] = useState<Goal>(args.value);
    return <GoalPicker {...args} value={goal} onChange={setGoal} />;
  },
};
