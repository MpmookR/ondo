import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Price } from './Price';

const meta = { title: 'Components/Price', component: Price, args: { value: 12.5 } } satisfies Meta<typeof Price>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Each: Story = { args: { each: true } };
export const Discounted: Story = { args: { value: 22.5, was: 25 } };
export const Small: Story = { args: { size: 'small', value: 5 } };
