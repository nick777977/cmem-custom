# Current handoff

Updated: 2026-11-02. Session 02 / BUILD-02 source and local checks finished; roadmap
step 2 remains **in progress**, with lifecycle-policy/offline/provenance gates open.
Branch: `feat/cmem-light-local`. Entry `4d773b4b790879d993fb5bfbd6bef6003cf16594`.
Current source/test HEAD: `705cd1dc9a6dcf805d9748cc85715239f13eac7e`; subsequent
memory commit is in Git log. Compile tested source `153a9953c3e62534ff3b96afc228645b88911399`.
Historical audit source remains `d7c2da3e5f9397b394dbc6b6966f4b261b489f7b`; no re-audit.

## Completed / evidence

- USER-SETUP preserved exactly against all 10 recorded SHA-256 hashes, separately:
  `49e4f65e1` inputs/generator/trust/manifests/lock; `ce7ded4dc` four bundles/maps.
  User-reported prior build/start remains distinct from agent checks.
- `153a9953c`: build -> build:compile; explicit preparation commands own viewer ci
  and plugin lock resolution. Viewer preflights local tsc/Vite without repair.
  Existing viewer, targets, source generators and verification retained.
- Exact existing Node **22.23.4**, npm **10.9.9**, Bun **1.4.4** found locally;
  default PATH was different. Use process-local paths in DEV-ENVIRONMENT.
- Agent `npm.cmd run build:compile`: **PASS**, including bundle/distribution/template/
  attribution checks. 199 tracked output hashes unchanged; 15 input/sentinel hashes
  unchanged, including locks and trust JSON. No new generated delta to commit.
- Six inert boundary fixtures **PASS**; 21 committed-bundle syntax checks **PASS**.
  `705cd1dc9` fixes their MSYS-dependent extraction with native git/tar.
- Full evidence, commands, source lines/hashes, initial harness/fixture failures,
  subprocess trace and rollback: [BUILD-02](../handoffs/BUILD-02.md).

## Current limits

Allowlist guard actually **FAILS** (exit 1) on preserved root onnxruntime-node and
msgpackr-extract additions absent from the canonical list. Not introduced by the
compile patch. No trust expansion or guard weakening; plugin trust JSON still paired
with generator. Narrow installed script review identified possible download/native
build behavior, not policy approval. Next task is the bounded consistency review.

Compile used synthetic HOME/config/data and isolated npm config/cache plus offline npm
mode, child trace and Node-socket tripwire. No installer/lock/deploy/runtime-repair
command or Node socket event observed. Vite invoked `net use` for Windows mapped-path
normalization. No OS-wide network/process capture: **full no-egress remains UNKNOWN**.
No exhaustive installed-tree hash, clean build/root-lock provenance or full dependency
closure proof. Worker self-contained runtime-hook fixture and full suites NOT RUN.
No worker/MCP/plugin/service execution, AWS, downloads, installed user settings/data,
push or step 3. Existing user worker/process state remains UNKNOWN and untouched.

## One next task

**BUILD-02-TRUST**, ready-unclaimed, serial, no active file reservations. Read
AGENTS -> README -> this STATE -> roadmap step 2/graph -> TASKS -> accepted DECISIONS
-> DEV-ENVIRONMENT current Session 02 section -> BUILD-02 pending policy ->
[NEXT-SESSION](../NEXT-SESSION.md). No whole audit/initial plan/bundle reread.

Review only the two root extras, canonical guard/map, generator trust JSON and relevant
local lifecycle scripts/lock metadata. Produce a reviewable reconciliation and policy
choice; do not automatically broaden trust or remove user setup. The next launcher
defines permissions and completion criteria. Root-input reproducibility/OS-offline
evidence stay explicitly pending; do not silently add them or start step 3.

Preserve viewer and upstream capture/retrieval/project/worktree/sharing/filter semantics,
SQLite canonical / Chroma derived. Close every session via TASKS, STATE, WORKLOG,
DECISIONS, affected contracts/environment and one fresh NEXT-SESSION prompt.
