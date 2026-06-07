#!/usr/bin/env node
/**
 * Enables GitHub "Template repository" on the monorepo template repo.
 * Requires GITHUB_TOKEN with repo scope.
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_... node scripts/enable-github-template.mjs
 *   GITHUB_TOKEN=ghp_... node scripts/enable-github-template.mjs --repo react-embed
 */
const token = process.env.GITHUB_TOKEN;
const repo = process.argv.includes('--repo')
  ? process.argv[process.argv.indexOf('--repo') + 1]
  : 'lerna-vite-monorepo-template';
const owner = process.env.GITHUB_OWNER ?? 'dvegap95';

if (!token) {
  console.error('Set GITHUB_TOKEN with repo scope to enable template mode.');
  process.exit(1);
}

const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
  body: JSON.stringify({
    is_template: true,
    description:
      repo === 'lerna-vite-monorepo-template'
        ? 'Template for easily starting monorepos with Lerna, Vite, Vitest, and Storybook'
        : 'Web component base class for embedding React apps in any host page',
  }),
});

if (!response.ok) {
  const body = await response.text();
  console.error(`GitHub API error (${response.status}): ${body}`);
  process.exit(1);
}

const data = await response.json();
console.log(`Template mode enabled for ${data.full_name}`);
console.log(data.html_url);
