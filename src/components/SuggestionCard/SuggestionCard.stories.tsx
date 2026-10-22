import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SuggestionCard } from './SuggestionCard';
import { sampleSuggestions, useQty } from '@/stories/fixtures';

const meta = {
  title: 'Components/SuggestionCard',
  component: SuggestionCard,
  args: { suggestion: sampleSuggestions[5], qty: 0, onQtyChange: () => {} },
} satisfies Meta<typeof SuggestionCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: function Render(args) {
    const [qty, setQty] = useQty(0);
    return <SuggestionCard {...args} qty={qty} onQtyChange={setQty} />;
  },
};

export const InBox: Story = { args: { qty: 2 } };

export const EveryAccent: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      {sampleSuggestions.slice(0, 4).map((s) => (
        <SuggestionCard key={s.item.id} suggestion={s} qty={0} onQtyChange={() => {}} />
      ))}
    </div>
  ),
};
