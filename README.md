# Lerna + Vite Monorepo Template

A starter template for React monorepos using **Yarn workspaces**, **Lerna**, **Vite**, **Vitest**, and **Storybook**. It includes shared tooling, a component library scaffold, web-component embedding, and an example app.

Use this repo as a [GitHub template](https://github.com/dvegap95/lerna-vite-monorepo-template/generate) or clone it to bootstrap a new monorepo with the same setup.

## Stack

| Tool | Purpose |
|------|---------|
| [Yarn 3](https://yarnpkg.com/) | Package manager with workspaces |
| [Lerna 8](https://lerna.js.org/) | Independent versioning and cross-package scripts |
| [Vite 6](https://vite.dev/) | Dev server, builds, and shared config |
| [Vitest 3](https://vitest.dev/) | Unit tests with jsdom |
| [Storybook 8](https://storybook.js.org/) | Component documentation and visual testing |
| [Emotion](https://emotion.sh/) | CSS-in-JS styling |
| [MUI](https://mui.com/) | Material UI components (optional, hoisted at root) |
| [TypeScript 5](https://www.typescriptlang.org/) | Static typing |
| [ESLint + Prettier](https://eslint.org/) | Linting and formatting |

## Getting started

### Prerequisites

- Node.js 20+
- Corepack enabled (for Yarn 3)

```bash
corepack enable
```

### Install

```bash
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
# or for a single package:
yarn test:common-lib
```

### Run Storybook

```bash
# All packages (root, port 6006)
yarn storybook

# common-lib only (port 6001)
yarn start:common-lib
```

## Repository structure

```
.
├── .fttemplates/          # Folder Templates for scaffolding (VS Code / JetBrains)
├── .storybook/            # Shared Storybook config (re-exported by packages)
├── middlewares/           # Vite plugins (dynamic @/ alias)
├── packages/
│   ├── common-lib/        # Shared library + test utilities + example MyButton
│   ├── react-embed/       # Web component base class for embedding React apps
│   └── example-app/       # Minimal Vite app consuming common-lib
├── scripts/               # CI helpers (test changed files only)
├── vite.config.mts        # Shared getBaseConfig() for all packages
├── vitest.setup.tsx       # Global test mocks and matchers
└── vitest.workspace.ts    # Vitest workspace over packages/*
```

## Packages

### `@monorepo/common-lib`

Shared library with:

- **MyButton** — minimal example component with tests, stories, and the Component Test Object pattern
- **Test utilities** — `Component.to.ts`, `Api.to.ts`, custom Vitest matchers
- **WebComponentApp** — base class extending `react-embed` for custom-element apps
- **dynamicConfig** — runtime config loaded from `config.json`

### `@monorepo/react-embed`

Lightweight `ReactEmbed` custom element base class. Map HTML attributes and JS properties to React component props.

### `@monorepo/example-app`

Reference Vite app registered as `<example-app>` web component. Shows how packages depend on `common-lib`.

## Root scripts

| Script | Description |
|--------|-------------|
| `yarn build` | Build all packages |
| `yarn test` | Run all package tests |
| `yarn lint` | ESLint across the monorepo |
| `yarn test:ui` | Vitest UI with coverage |
| `yarn test:diff` | Run tests only for files changed vs `main` |
| `yarn storybook` | Root Storybook (all `__stories__`) |
| `yarn dev:example-app` | Dev server for example-app |

## Creating a new package

### Option 1: Folder Templates (`.fttemplates/`)

Use the **Folder Templates** extension to scaffold from:

- `Component/` — single component with hook, styles, tests, stories
- `View/` — page-level view scaffold
- `ReactProjectPackage/` — minimal Vite SPA package
- `WebComponentApp/` — full web-component app (custom element + Vite)

### Option 2: Manual

1. Create `packages/my-package/` with `package.json`, `tsconfig.json`, `vite.config.mts`
2. Extend root config:

```ts
import { getBaseConfig } from '../../vite.config.mts';

export default getBaseConfig({
  base: '/my-package/',
});
```

3. Add workspace dependency: `"@monorepo/common-lib": "*"`
4. Run `yarn install` from the root

## Testing conventions

Tests live in `__tests__/` folders next to source:

```
Component/
├── Component.tsx
├── __tests__/
│   ├── Component.test.tsx   # Vitest + Testing Library
│   └── Component.to.ts      # Component Test Object (page object pattern)
```

The **Component Test Object** pattern wraps DOM queries and user interactions. Custom matchers extend `@testing-library/jest-dom` to work on test objects directly:

```ts
const button = MyButtonTestObject.getInstance();
expect(button).toBeInTheDocument();
await button.click();
```

Global setup in `vitest.setup.tsx` mocks dynamic config, ag-grid, and MUI Dialog for jsdom compatibility.

## Customization

After cloning, replace the `@monorepo` scope with your org name:

1. Find-and-replace `@monorepo` → `@your-org` in all `package.json` files and imports
2. Update `lerna.json` publish registry if publishing to a private npm
3. Rename packages under `packages/`

## Publishing packages

1. Set `"private": false` in the target package's `package.json`
2. Configure your registry in `lerna.json`
3. Run:

```bash
npx lerna version --no-private
npx lerna publish from-package
```

## Shared Vite config

All packages use `getBaseConfig()` from the root `vite.config.mts`:

- Emotion JSX with labeled CSS classes
- Dynamic `@/` alias resolving to the nearest `src/` directory
- Vitest with jsdom, global setup, and coverage defaults
- Base path pattern: `/apps/{package-name}/`

Override per package:

```ts
export default getBaseConfig({
  base: '/my-app/',
  test: { pool: 'forks' },
});
```

## License

MIT — use freely for new projects.
