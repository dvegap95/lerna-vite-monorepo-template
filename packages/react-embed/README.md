# @monorepo/react-embed

> **Vendored / replaceable package** — this folder exists so the template works out of the box. When you publish `react-embed` from a separate repository, swap it for the npm package:

```bash
yarn use:external-package --package react-embed --npm @your-org/react-embed --version ^1.0.0
```

See [docs/EXTERNAL_PACKAGES.md](../../docs/EXTERNAL_PACKAGES.md) for the full migration guide.

## Public API

Consumers should import **only** from the package entry point:

```ts
import ReactEmbed from '@monorepo/react-embed';
// or
import { ReactEmbed, ReactEmbedConfigContext } from '@monorepo/react-embed';
```

Do not import from deep paths inside this package — that keeps migration to an external package a dependency change, not a code refactor.

## Extracting to a separate repo

When publishing externally, this package should:

1. Keep the same export surface (`"."` → main entry with `ReactEmbed` default export)
2. Declare `react` and `react-dom` as peer dependencies
3. Ship as ESM (`"type": "module"`)
4. Include its own Vitest suite (copy `src/__tests__/`)

After publishing, remove this folder from the monorepo and run the swap script above.
