# Current handoff

Updated: 2026-11-02 after BUILD-02-TRUST review. Roadmap step 2 remains **in progress**,
with policy selection/application, OS-offline and provenance gates open.
Branch: `feat/cmem-light-local`. Review entry/source SHA:
`66a4c961da95d21526d00c44cad26199b8eda59e`; subsequent docs commit is in Git log.
Source/test commits remain `153a9953c` / `705cd1dc9`; no source delta in this review.
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
- **BUILD-02-TRUST review complete, no policy applied.** Exact npm 10.9.9 local
  implementation and release-tagged Bun 1.4.4 docs distinguish their semantics.
  Canonical/plugin npm maps = 28 names; root = 30 (only ONNX/msgpackr extras).
  JSON/plugin/lock Bun trust already agree as 26-name sets. Narrow local script review
  covers every JSON name with hashes/missing-input limits. No lifecycle execution.
  [BUILD-02-TRUST](../handoffs/BUILD-02-TRUST.md) contains evidence/options/rollback.

## Current limits

Allowlist guard actually **FAILS** (exit 1) on preserved root onnxruntime-node and
msgpackr-extract additions absent from the canonical list. Not introduced by the
compile patch; not rerun in the review. No trust expansion/removal or guard weakening.
Recommendation **A**, pending owner choice: remove only the two root npm map extras;
preserve JSON/generator/plugin/lock byte-for-byte and prohibit lifecycle execution.
Alternative B additionally revokes ONNX Bun trust in paired input/output/lock; C
broadens canonical npm permission (not recommended). P09 remains proposed, not accepted.

npm 10 ignores both trust fields as lifecycle filters; explicit ignore-scripts is needed
for separately authorized acquisition. Bun's explicit list replaces defaults and is an
active capability if install is run without suppression. Preserving it does not approve
execution. ONNX's inspected default Windows requirements are empty; Linux/CUDA can
download NuGet assets. msgpackr native tests can fall back to node-gyp; SQL grammar uses
npx --yes and CLI installer downloads GitHub binaries. None was run. Missing root
tree-sitter manifest and CLI version differences remain explicit static-review limits.

Compile used synthetic HOME/config/data and isolated npm config/cache plus offline npm
mode, child trace and Node-socket tripwire. No installer/lock/deploy/runtime-repair
command or Node socket event observed. Vite invoked `net use` for Windows mapped-path
normalization. No OS-wide network/process capture: **full no-egress remains UNKNOWN**.
No exhaustive installed-tree hash, clean build/root-lock provenance or full dependency
closure proof. Worker self-contained runtime-hook fixture and full suites NOT RUN.
No worker/MCP/plugin/service execution, AWS, downloads, installed user settings/data,
push or step 3. Existing user worker/process state remains UNKNOWN and untouched.

## One next task

**Owner selects A/B/C from BUILD-02-TRUST**, then **BUILD-02-TRUST-APPLY** only,
serial; no active reservations. [NEXT-SESSION](../NEXT-SESSION.md) is a self-contained
launcher with an explicit selection slot; no default/elapsed-time consent. Read AGENTS
-> README -> STATE -> roadmap step 2/graph -> TASKS -> DECISIONS P09/A13 ->
DEV-ENVIRONMENT current sections -> BUILD-02-TRUST -> PATCH-SEQUENCE §2.
No repeat audit/baseline/compile without a new reason. For recommended A, one root
manifest delta plus direct reviewed guard and static trust/hash comparisons suffice;
JSON/generator/plugin/lock must stay unchanged. No dependency resolution/install.
Root-input reproducibility/OS-offline/runtime work stays separate; no step 3.

Preserve viewer and upstream capture/retrieval/project/worktree/sharing/filter semantics,
SQLite canonical / Chroma derived. Close every session via TASKS, STATE, WORKLOG,
DECISIONS, affected contracts/environment and one fresh NEXT-SESSION prompt.
