import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { shopTabs, type ShopTabId } from '@/data/labels';
import { CategoryTabs } from './CategoryTabs';

const meta = {
  title: 'Patterns/CategoryTabs',
  component: CategoryTabs,
  args: { tabs: shopTabs, active: 'for-you', onChange: () => {}, panelId: 'panel' },
  decorators: [(Story) => <div className="-m-24"><Story /></div>],
} satisfies Meta<typeof CategoryTabs<ShopTabId>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: function Render(args) {
    const [active, setActive] = useState<ShopTabId>('for-you');
    return (
      <>
        <CategoryTabs {...args} active={active} onChange={setActive} />
        <div id="panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="p-24 font-serif text-body">
          Showing: {active}
        </div>
      </>
    );
  },
};
