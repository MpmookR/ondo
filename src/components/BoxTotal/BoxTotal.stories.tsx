import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BoxTotal } from './BoxTotal';

const meta = {
  title: 'Patterns/BoxTotal',
  component: BoxTotal,
  args: {
    layout: 'card',
    cadence: 'every 2 weeks',
    totals: { count: 3, subtotal: 34, discount: 3.4, total: 30.6 },
  },
  argTypes: { layout: { control: 'inline-radio', options: ['card', 'bar'] } },
  decorators: [(Story) => <div className="max-w-frame"><Story /></div>],
} satisfies Meta<typeof BoxTotal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {};
export const Bar: Story = { args: { layout: 'bar' } };
export const OneOff: Story = { args: { cadence: 'once', totals: { count: 1, subtotal: 24, discount: 0, total: 24 } } };
export const Empty: Story = { args: { totals: { count: 0, subtotal: 0, discount: 0, total: 0 } } };
