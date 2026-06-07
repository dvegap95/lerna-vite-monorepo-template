# Publishing react-embed

The standalone package is prepared locally at `../react-embed` (sibling to this template clone).

## Create the GitHub repository

1. Create an empty repo at [github.com/new](https://github.com/new) named `react-embed`
2. Push the prepared package:

```bash
cd ../react-embed
git push -u origin main
```

3. Publish to npm (when ready):

```bash
npm publish --access public
```

4. In monorepos cloned from this template, swap the vendored copy:

```bash
yarn use:external-package --package react-embed --npm @dvegap95/react-embed --version ^0.1.0
```
