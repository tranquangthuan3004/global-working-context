# global-working-context

A minimal installer package to copy `GLOBAL_WORKING_CONTEXT.md` into the root of any project.

## Overview

Running this command copies the packaged `GLOBAL_WORKING_CONTEXT.md` into the current working directory (`process.cwd()`).
If `GLOBAL_WORKING_CONTEXT.md` already exists at the destination, the command will abort with an error and exit with a non-zero code to prevent overwriting.

## Usage

### GitHub usage

Run directly from a GitHub repository using `npx`:

```bash
npx github:<github-user>/<repo-name>
```

This installs `GLOBAL_WORKING_CONTEXT.md` into the current project root.

### npm usage

Once published to npm, run:

```bash
npx <package-name>
```

This installs `GLOBAL_WORKING_CONTEXT.md` into the current project root.

## Testing

### Local testing

To run the installer directly from this repository:

1. Create and navigate into a temporary directory:
   ```bash
   mkdir temp-test && cd temp-test
   ```
2. Execute the installer script directly with Node.js:
   ```bash
   node /path/to/global-working-context/bin/install.mjs
   ```
3. Verify that `GLOBAL_WORKING_CONTEXT.md` has been copied to `temp-test/`.
4. Run the command a second time to verify that it refuses to overwrite the existing file and exits with a non-zero status.

### Package testing

To test the packaged tarball locally:

1. In the repository root, package the project:
   ```bash
   npm pack
   ```
2. Navigate into a temporary directory:
   ```bash
   mkdir temp-test && cd temp-test
   ```
3. Execute the resulting `.tgz` package with `npx`:
   ```bash
   npx --package ../global-working-context-1.0.0.tgz global-working-context
   ```
   *(or `npx ../global-working-context-1.0.0.tgz`)*
4. Verify that `GLOBAL_WORKING_CONTEXT.md` is installed correctly.
5. Re-run the command to confirm that it prevents overwriting existing files.
