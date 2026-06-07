import { getBaseConfig } from '../../vite.config.mts';

export default getBaseConfig({
  lib: {
    entry: './src/index.ts',
    name: 'common-lib',
  },
});
