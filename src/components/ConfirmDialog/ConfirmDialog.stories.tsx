import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../Button';
import { ConfirmDialog } from './ConfirmDialog';

/** Asked before something is added to every delivery. Escape or a tap outside cancels. */
const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  args: {
    open: false,
    title: 'Add to your subscription?',
    confirmLabel: 'Add to subscription',
    onConfirm: () => {},
    onCancel: () => {},
    children: null,
  },
} satisfies Meta<typeof ConfirmDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const KeepInEveryDelivery: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open the dialog
        </Button>
        <ConfirmDialog {...args} open={open} onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)}>
          <p>Dark Chocolate Thins will come in every delivery, every 15 days, at £4.00 each.</p>
          <p className="text-body-sm text-text-muted">You can add, remove or cancel anything in your subscription at any time.</p>
        </ConfirmDialog>
      </>
    );
  },
};
