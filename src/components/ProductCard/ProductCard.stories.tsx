import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProductCard } from './ProductCard';
import { itemById } from '@/data/catalogue';

const item = (id: string) => itemById(id)!;

const meta = {
  title: 'Components/ProductCard',
  component: ProductCard,
  args: { item: item('m-ceremonial'), qty: 0, onAdd: () => {}, onRemove: () => {} },
  decorators: [(Story) => <div className="w-288"><Story /></div>],
} satisfies Meta<typeof ProductCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: function Render(args) {
    const [qty, setQty] = useState(0);
    return <ProductCard {...args} qty={qty} onAdd={() => setQty(qty + 1)} onRemove={() => setQty(qty - 1)} />;
  },
};

export const WithReason: Story = { args: { item: item('g-infuser'), reason: 'Goes with your Shizuoka Sencha' } };
export const InBox: Story = { args: { item: item('t-oolong'), qty: 2 } };
export const OverCaffeineLimit: Story = { args: { item: item('c-night-shift'), unavailable: 'Above your caffeine limit' } };
export const OutOfStock: Story = { args: { item: item('g-grinder'), unavailable: 'Back soon' } };
export const Taster: Story = { args: { item: item('m-taster'), reason: 'A small size to try' } };

/** One component, three categories: only data-category changes. */
export const OneCardThreeAccents: Story = {
  decorators: [(Story) => <Story />],
  render: (args) => (
    <div className="grid w-full grid-cols-1 gap-16 sm:grid-cols-3">
      {['c-moka', 't-sencha', 'm-everyday'].map((id) => (
        <ProductCard key={id} {...args} item={item(id)} />
      ))}
    </div>
  ),
};
