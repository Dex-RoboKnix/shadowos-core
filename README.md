---
provenance: AAC
---

# ShadowOS Core

**Layer: L2** (a product that conforms to DexSpine at L1). Pre-1.0 / prototype: a goal with a working prototype, not a shipped product.

**Used by dex.md for:** not used directly. dex.md Stage 6b runs the private `Dex-RoboKnix/shadowos` repo at v0.2.0 (the Node MVP). This public repo is the earlier browser-desktop prototype (React/Vite, seeded from legacy GoWork/dexos naming); it is not the code Stage 6b runs and it is not a dependency of that repo.

ShadowOS is composed of ADE, the shell and the window manager (L3 components) and hosts DexFolio and DexScape (independently installable L2 products). See the glossary in the DexRoboKnix `CONTEXT.md` and ADR-0012.

## Which document do I read?

| I want to... | Read |
| --- | --- |
| Build, test or scan as an LLM | [START.md](START.md) |
| Understand the repo as a person | [docs/README.md](docs/README.md) |
| Agent rules for this repo | [CLAUDE.md](CLAUDE.md) |
| Cut a release | [RELEASING.md](RELEASING.md) |
| See what was seeded and what is next | [REPO-STATUS.md](REPO-STATUS.md) |
| Read the old product narrative (legacy) | [docs/legacy/](docs/legacy/) |

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



## Licence

OpenCore: this Core edition is AGPL-3.0 (see [LICENSE](LICENSE)). No Enterprise edition exists yet.
