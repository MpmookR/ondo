import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Chip, ToggleChip } from './Chip';

const meta = { title: 'Components/Chip', component: Chip, args: { children: 'cocoa' } } satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TastingNotes: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      {(['coffee', 'tea', 'matcha'] as const).map((c) => (
        <div key={c} data-category={c} className="flex gap-4">
          <Chip>{c === 'coffee' ? 'cocoa' : c === 'tea' ? 'orchid' : 'umami'}</Chip>
          <Chip>{c === 'coffee' ? 'toffee' : c === 'tea' ? 'cream' : 'sweet cream'}</Chip>
          <Chip tone="outline">{c}</Chip>
        </div>
      ))}
    </div>
  ),
};

export const Filters: Story = {
  render: function Render() {
    const [on, setOn] = useState('All');
    return (
      <div className="flex gap-8" role="group" aria-label="Filter">
        {['All', 'Coffee', 'Tea', 'Matcha', 'Gear'].map((f) => (
          <ToggleChip key={f} pressed={on === f} onPressedChange={() => setOn(f)}>
            {f}
          </ToggleChip>
        ))}
      </div>
    );
  },
};
