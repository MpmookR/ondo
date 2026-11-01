import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SiteFooter } from './SiteFooter';

/** The brand sign-off on the homepage, shop and item pages. Switch the theme in the toolbar for dark. */
const meta = {
  title: 'Patterns/SiteFooter',
  component: SiteFooter,
  parameters: { layout: 'fullscreen' },
  args: { clearFixedBar: false },
} satisfies Meta<typeof SiteFooter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** On pages with a bar fixed to the bottom (shop, item), it leaves room under itself. */
export const AboveAFixedBar: Story = { args: { clearFixedBar: true } };
