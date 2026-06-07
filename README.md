# Lerna + Vite Monorepo Template

A starter template for React monorepos using **Yarn workspaces**, **Lerna**, **Vite**, **Vitest**, and **Storybook**.

[Use this template on GitHub](https://github.com/dvegap95/lerna-vite-monorepo-template/generate) · [react-embed (standalone)](https://github.com/dvegap95/react-embed)

## Stack

| Tool                      | Purpose                               |
| ------------------------- | ------------------------------------- |
| Yarn 3 + Lerna 8          | Workspaces and independent versioning |
| Vite 6 + Vitest 3         | Build and unit tests                  |
| Storybook 8 + test-runner | Component docs and interaction tests  |
| Changesets                | Versioning and npm publish workflow   |
| Husky + lint-staged       | Pre-commit lint/format                |
| Emotion + TypeScript      | Styling and types                     |

## Quick start

```bash
corepack enable
yarn install
yarn init:monorepo --scope @your-org   # rename @monorepo scope
yarn dev:example-app                   # http://localhost:3000/apps/example-app/
yarn test
```

## Packages

| Package             | Role                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `common-lib`        | Shared library, test utilities, MyButton example, WebComponentApp                                  |
| `react-embed`       | **Vendored** web-component base — canonical repo: [dvegap95/react-embed](docs/REACT_EMBED_REPO.md) |
| `example-app`       | Minimal Vite app (Emotion only)                                                                    |
| `example-mui-stack` | **Optional** MUI + ag-grid demo — delete if not needed                                             |

## Scripts

| Script                            | Description                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| `yarn init:monorepo --scope @org` | Rename `@monorepo` everywhere                                                         |
| `yarn use:external-package`       | Swap vendored package for npm (see [EXTERNAL_PACKAGES.md](docs/EXTERNAL_PACKAGES.md)) |
| `yarn enable:github-template`     | Enable GitHub template mode (needs `GITHUB_TOKEN`)                                    |
| `yarn changeset`                  | Add a changeset for publishable packages                                              |
| `yarn version:packages`           | Apply changesets and bump versions                                                    |
| `yarn release:packages`           | Build and publish to npm                                                              |
| `yarn test-storybook:ci`          | Build Storybook + run Playwright interaction tests                                    |
| `yarn start:mui-stack`            | Storybook for optional MUI/ag-grid example (port 6003)                                |

## External packages (react-embed)

`react-embed` is vendored for zero setup but lives in its own repo:

```bash
yarn use:external-package \
  --package react-embed \
  --npm @dvegap95/react-embed \
  --version ^0.1.0
```

See [docs/EXTERNAL_PACKAGES.md](docs/EXTERNAL_PACKAGES.md) and [docs/REACT_EMBED_REPO.md](docs/REACT_EMBED_REPO.md).

## CI & release

- **CI** (`.github/workflows/ci.yml`) — lint, test, build + Storybook test-runner
- **Release** (`.github/workflows/release.yml`) — Changesets version PRs and npm publish (set `NPM_TOKEN` secret)
- **Dependabot** — weekly dependency updates

## Enable GitHub template mode

Either manually: **Settings → General → Template repository**, or:

```bash
GITHUB_TOKEN=ghp_... yarn enable:github-template
```

## Optional MUI / ag-grid stack

Heavy dependencies (MUI, ag-grid, Redux patterns) live in `packages/example-mui-stack/` only — not in the lean root. Remove that package entirely if your monorepo won't use them.

## Creating packages

Use `.fttemplates/` with the Folder Templates VS Code extension: `Component`, `View`, `ReactProjectPackage`, `WebComponentApp`.

## Testing conventions

Component Test Object pattern in `__tests__/*.to.ts` — see `packages/common-lib/src/components/MyButton/`.

## License

MIT
