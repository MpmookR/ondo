import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, ButtonLink, IconButton } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Build your box', variant: 'primary', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'accent', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-12">
      <Button variant="primary">Primary</Button>
      <Button variant="accent" icon="plus">Accent</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};

export const InEveryAccent: Story = {
  name: 'Accent button in each category',
  render: () => (
    <div className="flex flex-wrap gap-12">
      {(['coffee', 'tea', 'matcha'] as const).map((c) => (
        <div key={c} data-category={c}>
          <Button variant="accent" icon="plus">{`Add ${c}`}</Button>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <Button size="md">Medium · 44px</Button>
      <Button size="lg" icon="arrow-right" iconPosition="end">Large · 52px</Button>
    </div>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <IconButton icon="plus" label="Add" />
      <IconButton icon="minus" label="Remove" variant="ghost" />
      <IconButton icon="check" label="Done" variant="accent" />
    </div>
  ),
};

export const AsLink: Story = {
  name: 'ButtonLink (goes to another page)',
  render: () => (
    <div className="flex flex-wrap items-center gap-12">
      <ButtonLink href="/box" size="lg" icon="arrow-right" iconPosition="end">Build your first box</ButtonLink>
      <ButtonLink href="/shop" variant="secondary" size="lg">Browse the shop</ButtonLink>
    </div>
  ),
};
