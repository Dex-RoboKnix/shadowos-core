---
provenance: AAC
---

# START (for an LLM)

Read `CLAUDE.md` first. Layer: L2, pre-1.0 prototype.

1. Build: `npm install` then `npm run build` (runs `tsc -b && vite build`).
2. Test: there is no test suite yet (`package.json` has no `test` script). Report that; do not invent one. Known: `npm run lint` currently reports 11 errors that predate this contract.
3. Scan before any push: grep the diff for personal emails, keys and tokens (`git diff origin/main | grep -Ei "@(gmail|icloud|me)\.com|api[_-]?key|secret|token|BEGIN .*PRIVATE"`). Never read `.env` contents.
4. Commit as the GitHub no-reply address. Never push to `main`; use a branch and a PR.

Human authority (Layer 8) overrides every step here.
