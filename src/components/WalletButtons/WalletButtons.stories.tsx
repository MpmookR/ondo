import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WalletButtons } from './WalletButtons';

const meta = {
  title: 'Components/WalletButtons',
  component: WalletButtons,
  args: { onPay: () => {}, purpose: 'pay', theme: 'light' },
  argTypes: { purpose: { control: 'inline-radio', options: ['pay', 'buy'] } },
  parameters: {
    docs: {
      description: {
        component:
          'Static demo buttons: the official Apple Pay and Google Pay artwork, drawn by their scripts. No payment API is called; tapping goes to the order confirmation.',
      },
    },
  },
  decorators: [(Story) => <div className="max-w-frame"><Story /></div>],
} satisfies Meta<typeof WalletButtons>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Subscription: Story = {};
export const OneOff: Story = { args: { purpose: 'buy' } };
export const OnDark: Story = { args: { theme: 'dark' }, globals: { theme: 'dark' } };
