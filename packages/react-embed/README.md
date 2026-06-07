# @monorepo/react-embed

> **Vendored / replaceable package** — local copy for zero-config bootstrapping.

**Canonical source:** [github.com/dvegap95/react-embed](https://github.com/dvegap95/react-embed) (`@dvegap95/react-embed`)

Swap when ready:

```bash
yarn use:external-package --package react-embed --npm @dvegap95/react-embed --version ^0.1.0
```

See [docs/EXTERNAL_PACKAGES.md](../../docs/EXTERNAL_PACKAGES.md).

## Public API

Import only from the package entry:

```ts
import ReactEmbed from '@monorepo/react-embed';
```

Do not use deep paths — keeps external migration to a dependency change only.
