import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stepper } from './Stepper';
import { useQty } from '@/stories/fixtures';

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  args: { value: 0, itemName: 'Shizuoka Sencha', onChange: () => {}, size: 'default' },
  argTypes: { size: { control: 'inline-radio', options: ['default', 'compact', 'bar'] } },
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: function Render(args) {
    const [qty, setQty] = useQty(0);
    return <Stepper {...args} value={qty} onChange={setQty} />;
  },
};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-16">
      <Stepper {...args} value={0} />
      <Stepper {...args} value={1} />
      <Stepper {...args} value={3} />
      <Stepper {...args} value={2} size="compact" />
      <Stepper {...args} value={2} size="bar" />
    </div>
  ),
};
