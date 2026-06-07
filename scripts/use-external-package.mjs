#!/usr/bin/env node
/**
 * Swaps a vendored workspace package for an external npm dependency.
 * Designed for react-embed (and future extractable packages).
 *
 * Usage:
 *   node scripts/use-external-package.mjs --package react-embed --npm @your-org/react-embed --version ^1.0.0
 *   yarn use:external-package --package react-embed --npm @your-org/react-embed --version ^1.0.0
 */
import {
  readFileSync,
  writeFileSync,
  rmSync,
  existsSync,
  readdirSync,
  statSync,
} from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index !== -1 ? args[index + 1] : null;
};

const packageKey = getArg('--package');
const npmName = getArg('--npm');
const version = getArg('--version') ?? 'latest';
const dryRun = args.includes('--dry-run');

if (!packageKey || !npmName) {
  console.error(
    'Usage: node scripts/use-external-package.mjs --package react-embed --npm @your-org/react-embed [--version ^1.0.0]',
  );
  process.exit(1);
}

const configPath = join(rootDir, 'monorepo.config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const pkgConfig = config.replaceablePackages?.[packageKey];

if (!pkgConfig) {
  console.error(`Unknown replaceable package "${packageKey}".`);
  process.exit(1);
}

const workspaceName = pkgConfig.workspaceName;
const localPath = join(rootDir, pkgConfig.localPath);
const skipDirs = new Set(['node_modules', '.git', '.yarn', 'dist', 'coverage']);

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    if (skipDirs.has(entry)) continue;
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      walk(fullPath, files);
    } else if (entry === 'package.json') {
      files.push(fullPath);
    }
  }
  return files;
}

const versionSpec = version === 'latest' ? 'latest' : version;
let updatedPackageJsons = 0;

for (const filePath of walk(rootDir)) {
  const pkg = JSON.parse(readFileSync(filePath, 'utf8'));
  let changed = false;

  for (const section of [
    'dependencies',
    'devDependencies',
    'peerDependencies',
  ]) {
    const current = pkg[section]?.[workspaceName];
    if (
      current !== undefined &&
      (current === '*' || current === 'workspace:*')
    ) {
      delete pkg[section][workspaceName];
      pkg[section][npmName] = versionSpec;
      changed = true;
    }
  }

  if (changed) {
    updatedPackageJsons += 1;
    console.log(`Would update ${relative(rootDir, filePath)}`);
    if (!dryRun) {
      writeFileSync(filePath, `${JSON.stringify(pkg, null, 2)}\n`);
    }
  }
}

if (existsSync(localPath)) {
  console.log(`Would remove local package at ${pkgConfig.localPath}`);
  if (!dryRun) {
    rmSync(localPath, { recursive: true, force: true });
  }
}

if (!dryRun) {
  pkgConfig.externalName = npmName;
  pkgConfig.externalVersion = versionSpec;
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

console.log(
  `\n${dryRun ? '[dry-run] ' : ''}Swapped ${workspaceName} → ${npmName}@${versionSpec} in ${updatedPackageJsons} package.json files.`,
);
if (!dryRun) {
  console.log('Run yarn install to apply changes.');
}
