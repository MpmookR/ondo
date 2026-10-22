import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ViewBoxBar } from './ViewBoxBar';
import { sampleTotals } from '@/stories/fixtures';

const meta = {
  title: 'Patterns/ViewBoxBar',
  component: ViewBoxBar,
  args: { totals: sampleTotals },
  decorators: [(Story) => <div className="min-h-200"><Story /></div>],
} satisfies Meta<typeof ViewBoxBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
