import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox, Divider, TextField } from './Form';

const meta = {
  title: 'Components/Form',
  component: TextField,
  args: { label: 'Card number', placeholder: '0000 0000 0000 0000', inputMode: 'numeric' },
  decorators: [(Story) => <div className="max-w-frame"><Story /></div>],
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Field: Story = {};
export const WithHint: Story = { args: { label: 'Security code', placeholder: 'CVC', hint: '3 digits on the back (4 on the front for Amex)' } };
export const WithError: Story = { args: { defaultValue: '4242 4242 4242 4241', error: 'Check your card number' } };

export const CheckboxAndDivider: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(true);
    return (
      <div className="flex flex-col gap-16">
        <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
          Same as delivery address
        </Checkbox>
        <Divider>or pay with card</Divider>
      </div>
    );
  },
};
