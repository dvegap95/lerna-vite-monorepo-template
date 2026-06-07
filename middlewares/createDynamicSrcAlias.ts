import path from 'path';
import fs from 'fs';

import type { Plugin } from 'vite';

function findNearestSrcDir(startDir: string): string {
  let dir = startDir;
  while (dir !== path.parse(dir).root) {
    const potentialSrcDir = path.join(dir, 'src');
    if (
      fs.existsSync(potentialSrcDir) &&
      // eslint-disable-next-line spellcheck/spell-checker
      fs.lstatSync(potentialSrcDir).isDirectory()
    ) {
      return potentialSrcDir;
    }
    dir = path.dirname(dir);
  }
  throw new Error('src directory not found');
}

export default function createDynamicSrcAlias(): Plugin {
  return {
    name: 'vite-plugin-dynamic-src-alias',
    resolveId(source, importer) {
      if (source.startsWith('@/')) {
        if (!importer) {
          return null;
        }
        const nearestSrc = findNearestSrcDir(path.dirname(importer));
        const resolvedPath = path.join(nearestSrc, source.slice(2)); // slice(2) removes the '@/' from the path
        return resolvedPath;
      }
      return null;
    },
  };
}
