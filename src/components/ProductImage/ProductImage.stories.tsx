import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProductImage } from './ProductImage';

const meta = {
  title: 'Components/ProductImage',
  component: ProductImage,
  args: { category: 'coffee', label: '250g', className: 'h-160 w-160 rounded-card' },
  argTypes: { category: { control: 'inline-radio', options: ['coffee', 'tea', 'matcha', 'gear', 'bites', 'sweeteners'] } },
} satisfies Meta<typeof ProductImage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllPacks: Story = {
  render: () => (
    <div className="flex flex-wrap gap-16">
      <ProductImage category="coffee" label="250g" className="h-160 w-128 rounded-card" />
      <ProductImage category="tea" label="80g" className="h-160 w-128 rounded-card" />
      <ProductImage category="matcha" label="30g tin" className="h-160 w-128 rounded-card" />
      <ProductImage category="gear" className="h-160 w-128 rounded-card" />
      <ProductImage category="bites" className="h-160 w-128 rounded-card" />
      <ProductImage category="sweeteners" className="h-160 w-128 rounded-card" />
    </div>
  ),
};
