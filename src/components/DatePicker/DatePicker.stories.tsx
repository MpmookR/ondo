import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { addDays, todayISO } from '@/lib/dates';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  args: { value: null, onChange: () => {}, label: 'First delivery date' },
  decorators: [(Story) => <div className="flex justify-end pb-400 max-w-frame"><Story /></div>],
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Today and earlier are disabled (tomorrow is the fastest slot). Keyboard: arrows, Home/End, Page Up/Down, Enter, Escape.',
      },
    },
  },
  render: function Render(args) {
    const [date, setDate] = useState<string | null>(addDays(todayISO(), 7));
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const NoDateYet: Story = {};

export const ChangeLink: Story = {
  name: 'As a "Change" link (checkout)',
  render: function Render(args) {
    const [date, setDate] = useState<string | null>(addDays(todayISO(), 7));
    return <DatePicker {...args} value={date} onChange={setDate} trigger="link" />;
  },
};
