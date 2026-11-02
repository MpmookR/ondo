import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Switch } from './Switch';

/** On/off, named by visible text. Switch the theme in the toolbar to see it in dark. */
const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { checked: false, onChange: () => {}, labelledBy: 'switch-label' },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: function Render() {
    const [on, setOn] = useState(false);
    return (
      <div className="flex items-center justify-between gap-12 font-sans">
        <span className="flex flex-col">
          <span id="switch-label" className="text-label">Keep in every delivery</span>
          <span className="text-caption text-text-muted">{on ? 'Every 15 days' : 'First box only'}</span>
        </span>
        <Switch checked={on} onChange={setOn} labelledBy="switch-label" />
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-8 font-sans">
      <span id="off">Off</span>
      <Switch checked={false} onChange={() => {}} labelledBy="off" />
      <span id="on">On</span>
      <Switch checked onChange={() => {}} labelledBy="on" />
      <span id="disabled">Disabled</span>
      <Switch checked={false} disabled onChange={() => {}} labelledBy="disabled" />
    </div>
  ),
};
