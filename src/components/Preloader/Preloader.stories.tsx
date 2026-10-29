import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { BrewScene } from '../HomeHero/BrewScene';
import { Preloader } from './Preloader';

const meta = {
  title: 'Patterns/Preloader',
  component: Preloader,
  parameters: { docs: { story: { inline: false, iframeHeight: 600 } } },
} satisfies Meta<typeof Preloader>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Plays once per browser session; clear `ondo:preloaded` from session storage or use Replay. */
export const Default: Story = {
  render: () => {
    function Demo() {
      const [run, setRun] = useState(0);
      return (
        <div>
          <button
            type="button"
            className="min-h-44 rounded-pill border border-border-strong px-20 font-sans text-label"
            onClick={() => {
              sessionStorage.removeItem('ondo:preloaded');
              setRun((n) => n + 1);
            }}
          >
            Replay
          </button>
          <Preloader key={run} />
        </div>
      );
    }
    return <Demo />;
  },
};

/** The carafe at a few fill levels, as the counter climbs. */
export const FillLevels: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-24 lg:grid-cols-4">
      {[0, 0.33, 0.66, 1].map((level) => (
        <figure key={level} className="flex flex-col items-center gap-8 rounded-card bg-linear-to-b from-illo-wall-top to-illo-wall-bottom p-16">
          <BrewScene level={level} />
          <figcaption className="font-sans text-label">{Math.round(level * 100)}%</figcaption>
        </figure>
      ))}
    </div>
  ),
};
