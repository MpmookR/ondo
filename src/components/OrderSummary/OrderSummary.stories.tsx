import { useReducer, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { catalogue } from '@/data/catalogue';
import { defaultCustomer } from '@/data/customer';
import { boxReducer, totals, type BoxState } from '@/lib/box';
import { unavailableReason } from '@/lib/recommend';
import { ItemCard, OrderSummary } from './OrderSummary';
import { Phone, item, useQty } from '@/stories/fixtures';

const meta = {
  title: 'Patterns/OrderSummary',
  component: ItemCard,
  args: { item: item('m-ceremonial'), qty: 1, onQtyChange: () => {} },
  decorators: [(Story) => <Phone><Story /></Phone>],
} satisfies Meta<typeof ItemCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  render: function Render(args) {
    const [qty, setQty] = useQty(1);
    return <ItemCard {...args} qty={qty} onQtyChange={setQty} />;
  },
};

export const LineOverLimit: Story = {
  name: 'Line no longer fits preferences',
  args: { item: item('c-night-shift'), warning: 'Above your caffeine limit' },
};

/** A bite in a subscription: first box only until "Keep in every delivery" is turned on. */
export const KeepInEveryDelivery: Story = {
  render: function Render(args) {
    const [on, setOn] = useState(false);
    return (
      <ItemCard
        {...args}
        item={item('b-dark-chocolate')}
        pickedReason="Goes with your Moka Morning Blend"
        everyDelivery={{ on, cadence: 'every 15 days', onChange: setOn }}
      />
    );
  },
};

/** Gear and tasters come once, even in a subscription. */
export const SentOnce: Story = {
  args: { item: item('g-moka-pot'), sentOnce: true },
};

const start: BoxState = {
  lines: [
    { itemId: 'c-yirgacheffe', qty: 1 },
    { itemId: 't-sencha', qty: 2 },
    { itemId: 'g-pour-over', qty: 1 },
    { itemId: 'b-dark-chocolate', qty: 1 },
  ],
  plan: 'every-15',
  customer: defaultCustomer,
  railLines: [],
  deliveryDate: null,
  answered: true,
  ordered: false,
};

export const WholeBox: Story = {
  render: function Render() {
    const [state, dispatch] = useReducer(boxReducer, start);
    return (
      <OrderSummary
        lines={state.lines}
        catalogue={catalogue}
        totals={totals(state.lines, catalogue, 0.1)}
        onQtyChange={(itemId, qty) => dispatch({ type: 'setQty', itemId, qty })}
        warningFor={(i) => unavailableReason(i, defaultCustomer)}
        cadence="every 15 days"
        onEveryDeliveryChange={(itemId, on) => dispatch({ type: 'setEveryDelivery', itemId, on })}
      />
    );
  },
};

export const EmptyGroups: Story = {
  render: () => <OrderSummary lines={[]} catalogue={catalogue} totals={totals([], catalogue, 0)} onQtyChange={() => {}} />,
};
