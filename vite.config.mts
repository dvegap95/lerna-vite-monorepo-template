/// <reference types="vitest" />
/// <reference types="node" />
import path from 'path';

import { LibraryOptions, PluginOption, UserConfig } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsConfigPaths from 'vite-tsconfig-paths';
import {
  UserConfig as VitestUserConfig,
  coverageConfigDefaults,
  defineConfig,
} from 'vitest/config';

import createDynamicSrcAlias from './middlewares/createDynamicSrcAlias';

// eslint-disable-next-line no-undef
const isUi = process.argv.includes('--ui');

type Config = UserConfig &
  VitestUserConfig & {
    lib?: LibraryOptions;
    plugins?: PluginOption[];
  };

const moduleChunkMap = {
  'ag-grid': 'ag-grid',
  mui: 'mui',
};

export const getBaseConfig = ({ plugins = [], lib, ...rest }: Config) =>
  defineConfig({
    plugins: [
      pluginReact({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: [
            [
              '@emotion/babel-plugin',
              {
                labelFormat: '--[filename]-[local]',
              },
            ],
          ],
        },
      }),
      reactRefresh(),
      tsConfigPaths(),
      createDynamicSrcAlias(),
      ...plugins,
    ],
    define: {
      global: {},
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 3000,
      open: true,
      cors: true,
    },
    ...rest,
    build: {
      lib,
      minify: true,
      cssMinify: true,
      manifest: true,
      outDir: 'dist',
      // eslint-disable-next-line no-undef
      assetsInlineLimit: (_path, content: Buffer) => {
        return content.byteLength < 1024 * 10;
      },
      rollupOptions: {
        output: {
          entryFileNames: lib ? '[name].js' : 'main.js',
          ...(lib
            ? {}
            : {
                manualChunks(id, { getModuleInfo }) {
                  for (const [key, value] of Object.entries(moduleChunkMap)) {
                    const valueArr = Array.isArray(value) ? value : [value];
                    if (valueArr.some((v) => id.includes(v))) {
                      return key;
                    }
                  }
                  const size = getModuleInfo(id)?.code?.length || 0;
                  if (size > 40000) {
                    // eslint-disable-next-line no-console
                    console.log('Large content file imported:', id, size);
                  }
                },
                chunkFileNames: 'js/[name].[hash].js',
              }),
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return `css/${assetInfo.name}`;
            }
            return `assets/${assetInfo.name}`;
          },
        },
      },
      ...rest.build,
    },
    base: `/apps${rest.base || '/'}`,
    test: {
      environment: 'jsdom',
      globals: true,
      // eslint-disable-next-line no-undef
      setupFiles: [path.join(__dirname, 'vitest.setup.tsx')],
      include: ['**/__tests__/**/*.test.{ts,tsx}'],
      css: {
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },
      exclude: [
        // eslint-disable-next-line spellcheck/spell-checker
        '.fttemplates/**',
        'node_modules/**',
      ],
      coverage: {
        include: ['**/src/**'],
        exclude: ['**/__*__/**', ...coverageConfigDefaults.exclude],
      },
      testTimeout: isUi ? 50000 : 20000,
      maxThreads: 1,
      minThreads: 1,
      maxConcurrency: 1,
      pool: 'threads',
      ...rest.test,
    },
  } as VitestUserConfig);

export default getBaseConfig({
  lib: {
    entry: 'packages/common-lib/src/index.ts',
    name: 'vite-monorepo',
  },
});
