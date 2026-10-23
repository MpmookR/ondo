import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { catalogue } from '@/data/catalogue';
import { planById } from '@/data/plans';
import { totals } from '@/lib/box';
import { OrderReview } from './OrderReview';
import { Phone } from '@/stories/fixtures';

const lines = [
  { itemId: 'c-yirgacheffe', qty: 1 },
  { itemId: 't-sencha', qty: 2 },
  { itemId: 'g-infuser', qty: 1 },
];

const meta = {
  title: 'Patterns/OrderReview',
  component: OrderReview,
  args: {
    lines,
    catalogue,
    totals: totals(lines, catalogue, 0.1),
    plan: planById('fortnightly'),
    deliveryDate: '2026-10-29',
  },
  decorators: [(Story) => <Phone><Story /></Phone>],
} satisfies Meta<typeof OrderReview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};
export const Expanded: Story = { args: { defaultOpen: true } };
export const OneOff: Story = {
  args: { defaultOpen: true, plan: planById('once'), totals: totals(lines, catalogue, 0) },
};
