import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { defaultCustomer } from '@/data/customer';
import { BrewGuide } from '../BrewGuide';
import { BrewHighlights, DetailAccordion, OrderBar } from './ItemDetail';
import { Phone, item, useQty } from '@/stories/fixtures';

const meta = {
  title: 'Patterns/ItemDetail',
  component: BrewHighlights,
  args: { item: item('m-ceremonial'), customer: defaultCustomer },
  decorators: [(Story) => <Phone><div className="bg-bg-surface"><Story /></div></Phone>],
} satisfies Meta<typeof BrewHighlights>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Highlights: Story = {};
export const HighlightsWithClash: Story = { name: 'Highlights: contains something you avoid', args: { item: item('t-chai') } };
export const HighlightsOverLimit: Story = { name: 'Highlights: above your caffeine limit', args: { item: item('c-night-shift') } };
export const Gear: Story = { args: { item: item('g-whisk-set') } };

export const Accordions: Story = {
  render: (args) => (
    <div className="flex flex-col">
      <DetailAccordion title="How to brew" defaultOpen>
        <BrewGuide brew={args.item.brew!} />
      </DetailAccordion>
      <DetailAccordion title="Caffeine: medium">
        <p className="font-sans text-body">Moderate. Steady energy that builds slowly.</p>
      </DetailAccordion>
    </div>
  ),
};

export const OrderBarStates: Story = {
  decorators: [(Story) => <div className="min-h-200"><Story /></div>],
  render: function Render(args) {
    const [qty, setQty] = useQty(0);
    return <OrderBar item={args.item} qty={qty} onQtyChange={setQty} />;
  },
};

export const OrderBarBlocked: Story = {
  decorators: [(Story) => <div className="min-h-200"><Story /></div>],
  render: () => <OrderBar item={item('c-night-shift')} qty={0} onQtyChange={() => {}} blockedReason="Above your caffeine limit" />,
};
