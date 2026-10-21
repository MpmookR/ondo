import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stepper } from './Stepper';

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  args: { qty: 0, itemName: 'Shizuoka Sencha', onAdd: () => {}, onRemove: () => {} },
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: function Render(args) {
    const [qty, setQty] = useState(0);
    return <Stepper {...args} qty={qty} onAdd={() => setQty(qty + 1)} onRemove={() => setQty(qty - 1)} />;
  },
};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-12">
      <Stepper {...args} qty={0} />
      <Stepper {...args} qty={1} />
      <Stepper {...args} qty={3} />
    </div>
  ),
};
