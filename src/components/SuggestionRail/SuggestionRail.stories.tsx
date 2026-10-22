import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { BoxLine } from '@/types';
import { SuggestionRail } from './SuggestionRail';
import { Phone, sampleSuggestions } from '@/stories/fixtures';

const meta = {
  title: 'Patterns/SuggestionRail',
  component: SuggestionRail,
  args: { title: 'For calm focus', suggestions: sampleSuggestions, lines: [], onQtyChange: () => {} },
} satisfies Meta<typeof SuggestionRail>;
export default meta;
type Story = StoryObj<typeof meta>;

function Live(args: React.ComponentProps<typeof SuggestionRail>) {
  const [lines, setLines] = useState<BoxLine[]>([]);
  const onQtyChange = (itemId: string, qty: number) =>
    setLines((ls) => [...ls.filter((l) => l.itemId !== itemId), ...(qty > 0 ? [{ itemId, qty }] : [])]);
  return <SuggestionRail {...args} lines={lines} onQtyChange={onQtyChange} />;
}

export const Mobile: Story = {
  name: 'Mobile (scrolls sideways)',
  decorators: [(Story) => <Phone><Story /></Phone>],
  render: (args) => <Live {...args} />,
};

export const Desktop: Story = {
  name: 'Desktop (two-column grid)',
  parameters: { viewport: { defaultViewport: 'desktop' } },
  decorators: [(Story) => <div className="max-w-480"><Story /></div>],
  render: (args) => <Live {...args} />,
};

export const Empty: Story = {
  args: { suggestions: [] },
  parameters: { docs: { description: { story: 'Renders nothing: no empty box when nothing qualifies.' } } },
};
