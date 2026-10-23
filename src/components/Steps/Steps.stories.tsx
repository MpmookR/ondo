import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Steps } from './Steps';

const meta = {
  title: 'Patterns/Steps',
  component: Steps,
  args: { steps: ['Sign up', 'Delivery', 'Payment'], current: 2 },
  decorators: [(Story) => <div className="-m-24 bg-bg-surface"><Story /></div>],
} satisfies Meta<typeof Steps>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Payment: Story = {};
export const Delivery: Story = { args: { current: 1 } };
