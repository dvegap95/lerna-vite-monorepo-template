#!/usr/bin/env node
/**
 * Renames the @monorepo scope across the template after cloning.
 *
 * Usage:
 *   node scripts/init-monorepo.mjs --scope @my-org
 *   yarn init:monorepo --scope @my-org
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

const args = process.argv.slice(2);
const scopeIndex = args.indexOf('--scope');
const newScope = scopeIndex !== -1 ? args[scopeIndex + 1] : null;

if (!newScope || !newScope.startsWith('@')) {
  console.error('Usage: node scripts/init-monorepo.mjs --scope @your-org');
  process.exit(1);
}

const configPath = join(rootDir, 'monorepo.config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const oldScope = config.scope;

if (oldScope === newScope) {
  console.log(`Scope is already ${newScope}. Nothing to do.`);
  process.exit(0);
}

const skipDirs = new Set([
  'node_modules',
  '.git',
  '.yarn',
  'dist',
  'coverage',
  'storybook-static',
]);

const textExtensions = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.html',
  '.yml',
  '.yaml',
]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (skipDirs.has(entry)) continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, files);
    } else if ([...textExtensions].some((ext) => entry.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

let updatedFiles = 0;

for (const filePath of walk(rootDir)) {
  const content = readFileSync(filePath, 'utf8');
  if (!content.includes(oldScope)) continue;

  const next = content.replaceAll(oldScope, newScope);
  writeFileSync(filePath, next);
  updatedFiles += 1;
  console.log(`Updated ${relative(rootDir, filePath)}`);
}

config.scope = newScope;
if (config.replaceablePackages?.['react-embed']) {
  config.replaceablePackages['react-embed'].workspaceName =
    `${newScope}/react-embed`;
}
writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

console.log(`\nRenamed ${oldScope} → ${newScope} in ${updatedFiles} files.`);
console.log('Run yarn install to refresh the lockfile.');
