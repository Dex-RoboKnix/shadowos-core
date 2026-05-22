# ShadowOS Core Repo Status

This repo has been seeded from the working browser desktop prototype.

## Included

- React/Vite app source.
- Electron and local server prototype files from the source artefact.
- Legacy technical/product docs retained under `docs/legacy`.

## Validation

The source prototype passed `npm run build` before migration.

## Next Work

1. Canonicalize package name to `@dexroboknix/shadowos-core`.
2. Replace unsafe local sync behavior with a validated persistence API.
3. Add app registry.
4. Add tests for window store, file store, persistence, and app launch.
5. Define the ADE adapter contract.

