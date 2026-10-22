import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PageHeader, SavingsLine } from './PageHeader';

const meta = {
  title: 'Patterns/PageHeader',
  component: PageHeader,
  args: { theme: 'light', onThemeChange: () => {} },
  decorators: [(Story) => <div className="-m-24"><Story /></div>],
} satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const YourBox: Story = { render: (args) => <PageHeader {...args}><SavingsLine saving="10%" /></PageHeader> };
export const Shop: Story = { args: { title: 'Shop', backHref: '/' } };
export const ItemWithLongName: Story = { args: { title: 'Tieguanyin Oolong, first flush, Anxi province', backHref: '/' } };
