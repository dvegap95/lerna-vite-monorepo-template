import { getBaseConfig } from '../../vite.config.mts';

export default getBaseConfig({
  lib: {
    entry: './src/main.ts',
    name: 'react-embed',
  },
});
