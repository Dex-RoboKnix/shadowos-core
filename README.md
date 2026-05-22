# ShadowOS Core

ShadowOS is a local-first desktop environment that runs inside a browser tab.

It provides a desktop-like workspace for DexRoboKnix: windows, dock, menu bar, built-in apps, local file state, and a future adapter surface for ADE. ShadowOS must remain able to run without ADE.

## Current State

This repo has been seeded from the working React/Vite prototype originally stored under legacy `dexos`/GoWork naming.

The prototype currently includes:

- React/Vite desktop shell.
- Window manager store.
- Dock and top bar.
- Built-in app surfaces for Finder, Browser, Notes, Payload, DexConsole, Brain, Terminal, and Settings.
- LocalStorage-backed file model.
- Local sync server prototype.

## Known Gaps

- Persistence API needs path validation, read/list/delete support, and a single source-of-truth decision.
- Terminal is currently mocked.
- Built-in apps need a registry rather than scattered hard-coded branches.
- Test coverage is not yet sufficient.
- Legacy visual/brand language must be cleaned before public launch.
- ADE boundary must be documented before agent-control work is coupled to this shell.

## Development

```powershell
npm install
npm run build
npm run dev
```

## License

License TBD pending the DexRoboKnix license matrix.

