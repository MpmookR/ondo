import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CollapsibleSection } from './CollapsibleSection';

const meta = {
  title: 'Components/CollapsibleSection',
  component: CollapsibleSection,
  args: { title: 'Above your caffeine limit (2)', children: <p className="font-serif text-body">Night Shift Espresso, Moka Morning Blend</p> },
  decorators: [(Story) => <div className="max-w-frame"><Story /></div>],
} satisfies Meta<typeof CollapsibleSection>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
