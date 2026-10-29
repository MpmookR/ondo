import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import type { Theme } from '@/lib/box';
import { HomeHero } from './HomeHero';
import { BrewScene } from './BrewScene';
import { TypedHeadline } from './TypedHeadline';

const meta = {
  title: 'Patterns/HomeHero',
  component: HomeHero,
  // The hero runs edge to edge, so undo the canvas padding.
  decorators: [(Story) => <div className="-m-24"><Story /></div>],
} satisfies Meta<typeof HomeHero>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Without a theme switch (the toggle only shows when both props are passed). */
export const Default: Story = {};

export const Dark: Story = {
  name: 'Dark (evening)',
  globals: { theme: 'dark' },
};

export const WithThemeSwitch: Story = {
  render: () => {
    function Demo() {
      const [theme, setTheme] = useState<Theme>('light');
      return (
        <div data-theme={theme}>
          <HomeHero theme={theme} onThemeChange={setTheme} />
        </div>
      );
    }
    return <Demo />;
  },
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div className="max-w-frame">
      <HomeHero />
    </div>
  ),
};

export const SceneOnly: Story = {
  name: 'BrewScene on its own',
  render: () => (
    <div className="max-w-column bg-linear-to-b from-illo-wall-top to-illo-wall-bottom p-24">
      <BrewScene />
    </div>
  ),
};

export const TypedHeadlineOnly: Story = {
  name: 'TypedHeadline on its own',
  render: () => (
    <TypedHeadline
      lead="A box for"
      phrases={['early birds.', 'tea people.', 'matcha mornings.', 'slow sippers.']}
      className="font-heading text-hero text-brand"
    />
  ),
};
