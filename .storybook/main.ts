import type { StorybookConfig } from '@storybook/react-vite';
import turbosnap from "vite-plugin-turbosnap";

import { join, dirname } from 'path';
import { mergeConfig } from 'vite';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  stories: ['../**/__stories__/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)'],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: './vite.config.mts',
      },
    },
  },
  typescript: {
    reactDocgen: 'react-docgen',
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      // specifying build options explicitly as discussed here https://github.com/storybookjs/storybook/issues/22223
      build: {
        assetsInlineLimit: 0,
      },
      plugins:
        [
          turbosnap({
            // This should be the base path of your storybook.  In monorepos, you may only need process.cwd().
            rootDir: config.root ?? process.cwd(),
          }),
        ],
    });
  },
};
export default config;
