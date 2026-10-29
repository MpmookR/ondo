import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { itemById } from '@/data/catalogue';
import { bestSellerIds } from '@/data/bestSellers';
import type { Item } from '@/types';
import { BestSellers } from './BestSellers';

const items = bestSellerIds.map(itemById).filter((item): item is Item => Boolean(item));

const meta = {
  title: 'Patterns/BestSellers',
  component: BestSellers,
  args: { items },
} satisfies Meta<typeof BestSellers>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Scroll it into view to play the entrance. Hover an arch to lift its pack. */
export const Default: Story = {};

export const Dark: Story = { globals: { theme: 'dark' } };

export const TwoItems: Story = { args: { items: items.slice(0, 2) } };
