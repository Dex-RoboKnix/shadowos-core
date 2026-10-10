---
provenance: AAC
---

# Releasing

dex.md pins a tag or a full commit, never a branch.

1. Branch from `main`; open a PR; the owner merges.
2. Build passes: `npm run build`. (No test suite yet.)
3. Run the scan from `START.md`.
4. The owner creates the tag `vX.Y.Z` (SemVer, pre-1.0 while L2 is a prototype). Agents do not tag.
5. Record the tag or commit wherever dex.md pins it.
