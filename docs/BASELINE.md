# Baseline: enterprise local fork

Recorded: 2026-10-29. Evidence: local read-only source and Git inspection only.

| Item | Observed value |
|---|---|
| Working directory | `C:/0/ai/claude/claude-mem-custom/cmem-light` |
| User-selected branch | `feat/cmem-light-local` |
| Inspected source SHA | `d7c2da3e5f9397b394dbc6b6966f4b261b489f7b` |
| Git describe | `v15.5.0-1-gd7c2da3e5` (not exactly the tag) |
| Last subject | `docs: update CHANGELOG.md for v15.5.0` |
| Manifest version | root and plugin `15.5.0` |
| Initial worktree | clean before this session's documentation changes |
| Instructions found | root `CLAUDE.md`; no `AGENTS.md` found by repository file discovery before this session |
| Tool constraints | root Node `^20.19.0 || >=22.12.0`, Bun `>=1.1.31`; actual executable versions unprobed |
| Existing dependency folder | `node_modules/` exists; origin/completeness/trust UNKNOWN; not used |
| Locks | tracked `plugin/bun.lock`, `workers/sync-hub/bun.lock`, `services/sync-api/bun.lock`, `src/ui/my-work/package-lock.json`; root npm/Bun locks ignored |
| Built assets | 51 tracked files under `plugin/scripts` and `plugin/ui`; source/build correspondence UNKNOWN |
| Local Git hooks | only `.sample` files observed in `.git/hooks`; no configured `core.hooksPath` returned |
| Original plan SHA-256 | `A86429E6FCAC39C145D22FB8788E08914F44C04D7064C6E9B3CA7FE534A92ADE` |

## Execution boundaries

No dependency installs, build/test/application invocations, worker restarts, AWS calls,
web lookups, machine configuration edits or installed-memory inspection. Git read
commands and documentation commits are within the requested work. No clone, branch
switch, reset, push or upstream update is needed.

The supplied plan's earlier installed v15.4.0 and hosted HTTP 503 are historical reports;
the installed version and event payload are not verified here. The checkout is newer.

## Build and supply-chain findings

- `package.json` scripts `build-and-sync` / `dev` include marketplace synchronization
  and worker restart. Root `CLAUDE.md` recommends this upstream workflow; the user's
  current no-run instruction takes precedence.
- `build` runs manifest generation, bundle generation and lockfile generation.
  `scripts/gen-plugin-lockfile.cjs:57` runs `bun install --ignore-scripts`.
  Therefore even `build` is not a pure offline compile step.
- `scripts/build-hooks.js:483` onward generates `plugin/package.json`; changing only
  that generated manifest would be overwritten. Manifest and hook generators must be
  changed with their output.
- Root `package.json` includes `posthog-node`, Claude Agent SDK, server/auth,
  Redis/Postgres and Hugging Face tooling. Dependency sections alone do not establish
  runtime reachability: many packages are bundled from devDependencies.
- `plugin/package.json` has native tree-sitter dependencies, allowScripts settings and
  optional transformers. Pinning and lifecycle review must precede installation.

## Baseline completion limits

Repository baseline is captured. The P0 runtime/test isolation gate is NOT complete:
no disposable runtime data directory or plugin registration has been configured.
P1 is a preliminary static inventory, NOT a full dependency or dynamic egress audit.
Source citations below and in sibling reports refer to the inspected SHA, preceding
the documentation commits. Rebaseline when implementation changes the source.
