import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HowItWorks } from './HowItWorks';

const meta = {
  title: 'Patterns/HowItWorks',
  component: HowItWorks,
} satisfies Meta<typeof HowItWorks>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Scroll down: each step's arch opens, the hairline draws and the title slides up word by word. */
export const Default: Story = {};

export const Dark: Story = { globals: { theme: 'dark' } };
