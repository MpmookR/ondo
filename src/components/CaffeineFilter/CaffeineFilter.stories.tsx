import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CaffeineBand } from '@/data/labels';
import { CaffeineFilter } from './CaffeineFilter';
import { Phone } from '@/stories/fixtures';

const meta = {
  title: 'Patterns/CaffeineFilter',
  component: CaffeineFilter,
  args: { value: 'all', onChange: () => {}, counts: { all: 6, low: 2, medium: 0, high: 4 } },
  decorators: [(Story) => <Phone><Story /></Phone>],
} satisfies Meta<typeof CaffeineFilter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Coffee: Story = {
  parameters: { docs: { description: { story: 'Single choice. A band with no items is disabled; tapping the selected band again goes back to All.' } } },
  render: function Render(args) {
    const [band, setBand] = useState<CaffeineBand>(args.value);
    return <CaffeineFilter value={band} onChange={setBand} counts={args.counts} />;
  },
};

export const Selected: Story = { args: { value: 'low' } };

export const MatchaOnlyMedium: Story = {
  parameters: { docs: { description: { story: 'Every matcha is a 3, so Low and High are disabled.' } } },
  args: { counts: { all: 3, low: 0, medium: 3, high: 0 } },
};
