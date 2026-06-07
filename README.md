# Lerna + Vite Monorepo Template

A starter template for React monorepos using **Yarn workspaces**, **Lerna**, **Vite**, **Vitest**, and **Storybook**. It includes shared tooling, a component library scaffold, web-component embedding, and an example app.

Use this repo as a [GitHub template](https://github.com/dvegap95/lerna-vite-monorepo-template/generate) or clone it to bootstrap a new monorepo with the same setup.

## Stack

| Tool                                                     | Purpose                                          |
| -------------------------------------------------------- | ------------------------------------------------ |
| [Yarn 3](https://yarnpkg.com/)                           | Package manager with workspaces                  |
| [Lerna 8](https://lerna.js.org/)                         | Independent versioning and cross-package scripts |
| [Vite 6](https://vite.dev/)                              | Dev server, builds, and shared config            |
| [Vitest 3](https://vitest.dev/)                          | Unit tests with jsdom                            |
| [Storybook 8](https://storybook.js.org/)                 | Component documentation and visual testing       |
| [Emotion](https://emotion.sh/)                           | CSS-in-JS styling                                |
| [TypeScript 5](https://www.typescriptlang.org/)          | Static typing                                    |
| [ESLint + Prettier](https://eslint.org/)                 | Linting and formatting                           |
| [Husky + lint-staged](https://typicode.github.io/husky/) | Pre-commit hooks                                 |

Optional hoisted deps (MUI, ag-grid, Redux) are available at the root for apps that need them — see `vitest.setup.tsx` for related test mocks.

## Quick start

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- Corepack enabled (for Yarn 3)

```bash
corepack enable
yarn install
```

### First-time setup after cloning

Rename the placeholder scope:

```bash
yarn init:monorepo --scope @your-org
yarn install
```

### Run the example app

```bash
yarn dev:example-app
# → http://localhost:3000/apps/example-app/
```

### Run tests

```bash
yarn test
yarn test:diff    # only files changed vs main
yarn test:ui      # Vitest UI
```

## Repository structure

```
.
├── .devcontainer/         # VS Code / GitHub Codespaces config
├── .fttemplates/          # Folder Templates for scaffolding
├── .github/               # CI workflow + Dependabot
├── .husky/                # Git hooks (lint-staged on pre-commit)
├── .storybook/            # Shared Storybook config
├── .vscode/               # Recommended extensions + settings
├── docs/
│   └── EXTERNAL_PACKAGES.md   # Swapping vendored packages for npm
├── middlewares/           # Vite plugins (dynamic @/ alias)
├── monorepo.config.json     # Scope + replaceable package registry
├── packages/
│   ├── common-lib/        # Shared library + test utilities + MyButton
│   ├── react-embed/       # Vendored web-component base (→ external npm)
│   └── example-app/       # Reference Vite app
├── scripts/
│   ├── init-monorepo.mjs          # Rename @monorepo scope
│   └── use-external-package.mjs   # Swap vendored pkg for npm
├── vite.config.mts        # Shared getBaseConfig()
├── vitest.setup.tsx       # Global test mocks
└── vitest.workspace.ts
```

## Packages

### `@monorepo/common-lib`

Shared library with MyButton example, Component Test Object utilities, `WebComponentApp`, and `dynamicConfig`.

Depends on `@monorepo/react-embed` via `workspace:*`. Apps should import `WebComponentApp` from common-lib, not react-embed directly.

### `@monorepo/react-embed` (vendored / replaceable)

Local copy of the web-component embedding library. Marked with `.external-package` — intended to move to a **separate repository** and be consumed as an npm dependency.

See [docs/EXTERNAL_PACKAGES.md](docs/EXTERNAL_PACKAGES.md).

### `@monorepo/example-app`

Reference app registered as `<example-app>`. Depends only on `common-lib`.

## Replaceable packages (react-embed)

The template vendors `react-embed` so it works immediately. When you publish it externally:

```bash
yarn use:external-package \
  --package react-embed \
  --npm @your-org/react-embed \
  --version ^1.0.0

yarn install && yarn test
```

This removes `packages/react-embed/`, updates all `package.json` references, and records the external name in `monorepo.config.json`.

**Design rule:** only import from `@monorepo/react-embed` (package entry), never from deep paths — so the swap is a dependency change, not a refactor.

## Root scripts

| Script                            | Description                                             |
| --------------------------------- | ------------------------------------------------------- |
| `yarn init:monorepo --scope @org` | Rename `@monorepo` scope across the repo                |
| `yarn use:external-package`       | Swap a vendored package for npm                         |
| `yarn build`                      | Build all packages                                      |
| `yarn test`                       | Run all package tests                                   |
| `yarn lint`                       | ESLint across the monorepo                              |
| `yarn test:diff`                  | Test changed files only (used in CI-friendly workflows) |
| `yarn storybook`                  | Root Storybook (port 6006)                              |
| `yarn dev:example-app`            | Example app dev server                                  |

## Creating a new package

Use **Folder Templates** (`.fttemplates/`) with the [Folder Templates](https://marketplace.visualstudio.com/items?itemName=Huuums.vscode-fast-folder-structure) extension:

- `Component/` — component + hook + styles + tests + stories
- `View/` — page-level view
- `ReactProjectPackage/` — minimal Vite SPA
- `WebComponentApp/` — custom element app

Or manually create `packages/my-app/` extending root `getBaseConfig()`.

## Testing conventions

```
Component/
├── Component.tsx
├── __tests__/
│   ├── Component.test.tsx
│   └── Component.to.ts      # Component Test Object
```

```ts
const button = MyButtonTestObject.getInstance();
expect(button).toBeInTheDocument();
await button.click();
```

## CI & quality

- **GitHub Actions** — lint, test, build on push/PR (`.github/workflows/ci.yml`)
- **Dependabot** — weekly npm + monthly GitHub Actions updates
- **Husky** — runs `lint-staged` (ESLint + Prettier) on pre-commit
- **Devcontainer** — reproducible Node 20 environment

## Publishing packages

1. Set `"private": false` in the target `package.json`
2. Configure registry in `lerna.json`
3. `npx lerna version --no-private && npx lerna publish from-package`

## License

MIT
