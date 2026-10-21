import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CaffeineMeter } from './CaffeineMeter';

const meta = {
  title: 'Components/CaffeineMeter',
  component: CaffeineMeter,
  args: { level: 3, display: 'full' },
  argTypes: {
    level: { control: { type: 'range', min: 0, max: 5, step: 1 } },
    display: { control: 'inline-radio', options: ['full', 'compact'] },
  },
} satisfies Meta<typeof CaffeineMeter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      {([0, 1, 2, 3, 4, 5] as const).map((l) => (
        <CaffeineMeter key={l} level={l} />
      ))}
    </div>
  ),
};

export const PerCategory: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      <div data-category="coffee"><CaffeineMeter level={5} /></div>
      <div data-category="tea"><CaffeineMeter level={2} /></div>
      <div data-category="matcha"><CaffeineMeter level={3} /></div>
    </div>
  ),
};
