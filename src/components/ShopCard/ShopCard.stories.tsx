import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ShopCard } from './ShopCard';
import { item, useQty } from '@/stories/fixtures';

const meta = {
  title: 'Components/ShopCard',
  component: ShopCard,
  args: { item: item('t-oolong'), qty: 0, onQtyChange: () => {} },
  decorators: [(Story) => <div className="w-180"><Story /></div>],
} satisfies Meta<typeof ShopCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: function Render(args) {
    const [qty, setQty] = useQty(0);
    return <ShopCard {...args} qty={qty} onQtyChange={setQty} />;
  },
};
export const WithReason: Story = { args: { item: item('m-taster'), reason: 'Fits calm focus' } };
export const InBox: Story = { args: { item: item('c-yirgacheffe'), qty: 1 } };
export const AboveCaffeineLimit: Story = { args: { item: item('c-night-shift'), unavailable: 'Above your caffeine limit' } };
export const BackSoon: Story = { args: { item: item('g-grinder'), unavailable: 'Back soon' } };

/** One component, three accents: only data-category changes. */
export const Grid: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div className="grid max-w-frame grid-cols-2 gap-12">
      {['c-half-half', 't-sencha', 'm-everyday', 'g-whisk-set'].map((id) => (
        <ShopCard key={id} item={item(id)} qty={0} onQtyChange={() => {}} />
      ))}
    </div>
  ),
};
