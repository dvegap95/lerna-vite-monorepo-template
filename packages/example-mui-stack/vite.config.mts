import path from 'path';
import { fileURLToPath } from 'url';

import { getBaseConfig } from '../../vite.config.mts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default getBaseConfig({
  base: '/example-mui-stack/',
  lib: {
    entry: './src/index.ts',
    name: 'example-mui-stack',
  },
  test: {
    setupFiles: [path.join(__dirname, 'vitest.setup.mui.tsx')],
  },
});
