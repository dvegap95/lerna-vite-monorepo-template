import type { Preview } from '@storybook/react';
import '@fontsource/poppins'

const viewportModes = {
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1440px',
      height: '900px',
    },
    type: 'desktop',
  },
  mobile: {
    name: 'Mobile',
    styles: {
      width: '360px',
      height: '640px',
    },
    type: 'mobile',
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: viewportModes,
    },
  },
};

export default preview;
