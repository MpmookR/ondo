import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SuggestionRail } from './SuggestionRail';
import { ProductCard } from '../ProductCard';
import { catalogue } from '@/data/catalogue';
import { defaultBox, defaultCustomer } from '@/data/customer';
import { recommend } from '@/lib/recommend';

const suggestions = recommend(defaultCustomer, defaultBox, catalogue, { goalLabel: 'calm focus' });

const meta = {
  title: 'Patterns/SuggestionRail',
  component: SuggestionRail,
  args: { title: 'For calm focus', description: 'Picked for your goal, your caffeine limit and your box.', children: [] },
} satisfies Meta<typeof SuggestionRail>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LiveRules: Story = {
  name: 'Driven by recommend()',
  render: (args) => (
    <SuggestionRail {...args}>
      {suggestions.map((s) => (
        <ProductCard key={s.item.id} item={s.item} reason={s.reason} qty={0} onAdd={() => {}} onRemove={() => {}} />
      ))}
    </SuggestionRail>
  ),
};

export const Empty: Story = {
  parameters: { docs: { description: { story: 'Renders nothing: no empty box when nothing qualifies.' } } },
};
