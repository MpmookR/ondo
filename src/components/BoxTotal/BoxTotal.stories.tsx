import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BoxTotal } from './BoxTotal';
import { emptyTotals, sampleTotals } from '@/stories/fixtures';

const meta = {
  title: 'Patterns/BoxTotal',
  component: BoxTotal,
  args: { totals: sampleTotals, cadence: 'every 15 days', discountRate: 0.1 },
  parameters: { docs: { description: { component: 'Fixed to the bottom below 1024px; a card in the sidebar above. Resize the canvas to see both.' } } },
  decorators: [(Story) => <div className="min-h-320"><Story /></div>],
} satisfies Meta<typeof BoxTotal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Subscription: Story = {};
export const OneOff: Story = { args: { cadence: 'once', discountRate: 0, totals: { ...sampleTotals, discount: 0, total: sampleTotals.subtotal } } };
export const Empty: Story = { args: { totals: emptyTotals } };
