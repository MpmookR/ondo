import type { Decorator, Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'light';
  const category = context.globals.category ?? 'none';
  return (
    <div
      data-theme={theme}
      data-category={category === 'none' ? undefined : category}
      className="min-h-screen bg-bg-page p-24 text-text-primary"
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    category: {
      description: 'Category accent',
      toolbar: {
        title: 'Accent',
        icon: 'paintbrush',
        items: [
          { value: 'none', title: 'Default' },
          { value: 'coffee', title: 'Coffee' },
          { value: 'tea', title: 'Tea' },
          { value: 'matcha', title: 'Matcha' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', category: 'none' },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
    options: {
      storySort: { order: ['Introduction', 'Foundations', 'Components', 'Patterns'] },
    },
  },
};

export default preview;
