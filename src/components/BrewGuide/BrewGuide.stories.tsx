import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BrewGuide } from './BrewGuide';
import { itemById } from '@/data/catalogue';

const brewOf = (id: string) => itemById(id)!.brew!;

const meta = {
  title: 'Components/BrewGuide',
  component: BrewGuide,
  args: { brew: brewOf('c-yirgacheffe') },
  decorators: [(Story) => <div className="max-w-frame"><Story /></div>],
} satisfies Meta<typeof BrewGuide>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Coffee: Story = {};
export const TeaWithSteeps: Story = { args: { brew: brewOf('t-oolong') } };
export const MatchaWithWhisk: Story = { args: { brew: brewOf('m-ceremonial') } };
