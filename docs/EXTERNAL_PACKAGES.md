# External packages

Some dependencies are **vendored inside the monorepo** for zero-config bootstrapping, but are designed to be published and consumed from separate repositories.

Configuration lives in [`monorepo.config.json`](../monorepo.config.json).

## react-embed

| Mode                | Location                                                        | Dependency                               |
| ------------------- | --------------------------------------------------------------- | ---------------------------------------- |
| **Local (default)** | `packages/react-embed/`                                         | `"@monorepo/react-embed": "workspace:*"` |
| **External**        | [dvegap95/react-embed](https://github.com/dvegap95/react-embed) | `"@dvegap95/react-embed": "^0.1.0"`      |

### Dependency graph

```
example-app ──► common-lib ──► react-embed
                  ▲
                  └── WebComponentApp extends ReactEmbed
```

Only `common-lib` needs a direct dependency on `react-embed`. Apps import `WebComponentApp` from `@monorepo/common-lib/utils/embed/WebComponentApp` and never touch `react-embed` directly (unless building a custom element without the common-lib wrapper).

### Switching to the external package

After publishing `react-embed` from its own repo:

```bash
yarn use:external-package \
  --package react-embed \
  --npm @dvegap95/react-embed \
  --version ^0.1.0

yarn install
yarn test
```

Preview changes first:

```bash
node scripts/use-external-package.mjs \
  --package react-embed \
  --npm @your-org/react-embed \
  --version ^1.0.0 \
  --dry-run
```

The script will:

1. Replace `workspace:*` references with the npm version in all `package.json` files
2. Delete `packages/react-embed/`
3. Update `monorepo.config.json` with the external name

### Contract for the external react-embed package

The published package must expose:

```ts
// Default export
export default class ReactEmbed extends HTMLElement { ... }

// Named exports
export { ReactEmbed, ReactEmbedConfigContext, EventManager };
export type { AttributesMap, TransformAttributesMap, ... };
```

`common-lib`'s `WebComponentApp` extends `ReactEmbed` and adds optional attribute maps — no other coupling.

### Adding future replaceable packages

Extend `monorepo.config.json`:

```json
{
  "replaceablePackages": {
    "my-lib": {
      "localPath": "packages/my-lib",
      "workspaceName": "@monorepo/my-lib",
      "externalName": null,
      "externalVersion": null,
      "repository": "https://github.com/your-org/my-lib",
      "description": "..."
    }
  }
}
```

Then run `use-external-package.mjs` with `--package my-lib`.
