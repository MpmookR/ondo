import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CategoryBadge } from './CategoryBadge';

const meta = {
  title: 'Components/CategoryBadge',
  component: CategoryBadge,
  args: { category: 'coffee' },
  argTypes: { category: { control: 'inline-radio', options: ['coffee', 'tea', 'matcha', 'gear'] } },
} satisfies Meta<typeof CategoryBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const All: Story = {
  render: () => (
    <div className="flex gap-8">
      {(['coffee', 'tea', 'matcha', 'gear'] as const).map((c) => (
        <CategoryBadge key={c} category={c} />
      ))}
    </div>
  ),
};
