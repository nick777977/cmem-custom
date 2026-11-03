# WINDOWS-09E — common mock admission/teardown failures

2026-11-03, feat/cmem-light-local, one coordinator, serial. Clean entry
**b9e683b75ed43c154a274c66fd599a200f666de8**. Exact TASKS claim preceded edits.
Source/tests **H 98a6d019c468e63e9d78dbcd643e6f062e117a36**; documentation follows H.
Only scripts/enterprise-local/compiled-smoke.mjs and its existing test changed.
No agents/branches/worktrees/other steps. **Step9 partial; do not activate.**

## Static source evidence at H

| Path:line | Result and limit |
|---|---|
| scripts/enterprise-local/compiled-smoke.mjs:45 | Copied-artifact fixture uses only windows-09e scratch; exact source/copy hashes, exclusive directory ownership and realpath-confined cleanup reused. Copied bundles are never evaluated. |
| scripts/enterprise-local/compiled-smoke.mjs:118 | Admission validates case ID, absolute executable/cwd, string args/env/stdin, exit/expectations and positive safe-integer limits capped at existing defaults (15s run, 5s per cleanup stage, 64KiB result). Invalid inputs refuse before launch. This validates mock inputs, not executable approval or env security. |
| scripts/enterprise-local/compiled-smoke.mjs:146 | Native-kind rejection remains unconditional before launch: NATIVE_OS_BOUNDARY_NOT_IMPLEMENTED. No native adapter/default spawn, nominal approval flag or OS probe added. |
| scripts/enterprise-local/compiled-smoke.mjs:160 | Launch now occurs inside failure capture. Sync refusal or no usable object leaves ownership unknown. No handle does not mean the OS tree/resources were released. A returned object is labelled returned-unverified, never proof of native ownership. Cleanup methods are captured independently so one missing/throwing member cannot suppress the other. Async launch handles are rejected and their rejection drained. |
| scripts/enterprise-local/compiled-smoke.mjs:171 | Completion must be thenable; malformed cleanup handles fail admission while rejected completion is drained. Completion rejection, startup exit/signal, malformed result, combined UTF-8 stream size, deadline and expected/refusal parsing failures are primary failures. Size validation applies to the completed mock result; live stream capture/startup enforcement is absent. |
| scripts/enterprise-local/compiled-smoke.mjs:193 | Stop and release run independently in order, with separate cleanupMs deadlines. Release is attempted after failed/timed-out stop; missing/throwing methods are explicit phase failures. Explicit false refuses. A late pending callback is not cancelled by Promise.race; synchronous JS cannot be preempted. No OS cleanup claim follows these callbacks. |
| scripts/enterprise-local/compiled-smoke.mjs:202 | AggregateError retains original primary and cleanup rejection values (including undefined), ordered errors and stop/release phase records; primaryFailed distinguishes no primary failure from undefined rejection. Error metadata says cleanup unproved; sync launch ownership remains unknown. No cleanup failure yields PASS. |
| scripts/enterprise-local/compiled-smoke.mjs:207 | Success remains PASS/V1/substituted/readiness:false. Neither mock release callback success nor native label supplies V3/OS/egress proof. |

Tests at H, tests/enterprise-local/compiled-smoke.test.ts:59 validate no-launch
inputs; :72 sync refusal; :83 malformed handles/missing or throwing cleanup members
and async launch; :118 primary plus two cleanup failures; :138 startup/signal/
output/malformed result/run deadline combined with both cleanup timeouts; :159 all
25 stop/release combinations (resolve, throw, reject, timeout, false). Existing
copied-artifact leaf/refusal/wrapper mocks remain at :190/:232/:246. Native refusal
at :55 does not invoke launch. No fabricated MCP/worker lifecycle success added.

## Checks actually run

Reviewed harness/tests, copied-artifact fixture and confined afterAll deletion,
bunfig.toml, tests/preload.ts and its import-free readiness override, plus the reused
process/network/listener/fetch guard and synthetic environment/runner before execution.
The upstream worker-bundle subprocess test was inspected as fixture provenance only,
not executed. No application import or actual child under test.

Existing **Bun 1.4.4+38afee6c8** verified. One affected-file run:

`bun test --preload ./.scratch/enterprise-local/windows-09e/test-guard.ts --timeout 20000 tests/enterprise-local/compiled-smoke.test.ts`

**16 PASS, 0 FAIL, 337 assertions; exit0.** Zero recorded forbidden tripwire events.
No test retry. Test runner only; all launch/completion/stop/release functions are mocks.
Ambient env cleared; process-local explicit tool/Windows PATH; synthetic HOME/
USERPROFILE/APPDATA/LOCALAPPDATA/CODEX_HOME/CLAUDE_CONFIG_DIR/data/temp, empty npm
configs and isolated offline cache under windows-09e. No real settings/credentials/
memory/models/caches or installed runtime assets read. No dependency/toolchain change.
Node22.23.4/npm10.9.9 baseline retained; not re-executed for this Bun-only slice.

**No compile or typecheck:** no application/generator/output edit warrants replay.
09D's one compile, 19 inputs/869 source sentinels/192 outputs unchanged across that
compile and viewer PASS/root three baseline TS2345 remain historical evidence, not
new checks. Source commit changes exactly the harness and its test; generated files,
application/provider/native-login/viewer/SQLite/Chroma/identity/manifests/locks/trust/
build guard/workflows/planner unchanged in tracked diff. No compiler input edited or installed-tree
rehash/audit or OS no-egress proof. git diff --check PASS.

Scratch evidence (conclusions persist here; scratch is disposable): tests.log SHA-256
`0407012cde5e706066afc990003d85af94b8766eade07113e57d05fde43af0b9`;
test-guard.ts `3bb7f1b219d190cd064db78d5ef7c0d6ce2a124ed8fbc66b6646f311a205f511`.
Git index write initially sandbox-denied; authorized .git escalation succeeded with
hooks/signing disabled. No automatic-review rejection, push or remote mutation.

## Preservation and remaining gaps

All 09/09B/09C commits and handoffs, and 09D **B855ef7d6e/S236dd661c/H2935e19d0**,
preserved. Protocol3 explicit-root refusal, no acquisition/PATH repair/signup,
canonical structured commands unbound, Codex/Setup exit1 and wrappers without env-node
shebang unchanged. Literal renderer and post-load realpath checks are not interpreter
approval/host/runtime proof. Both D5 private namespace and absolute unpacked-path
options remain proposed; registration prohibited. A19/A20 and all retained Claude/
Bedrock/API/Codex ChatGPT/OpenAI-compatible/native-login implementations preserved;
step6 profiles not implemented. Viewer/SQLite canonical/Chroma derived/identity/
sharing/filter/capture/retrieval unchanged; no SQLite-only success bypass.

The common mock failure gap in 09D item3 is addressed within V1 only. Still absent:

1. Concrete reviewed Windows OS substrate/helper API and immutable artifact contract.
   No native source adapter until these exist. Atomic admission before child code,
   including launch failures; descendant identity/PID reuse/breakaway control; inherited
   OS egress AND DNS deny; bounded startup/stream capture/deadlines; every-path OS
   owned-tree/listener/handle/boundary release evidence are all missing. Mock timers,
   callbacks, names, PID values or global-port/image-name kills cannot supply them.
2. Approved interpreter/hash/version/ABI/closure and actual host binding/loading/
   quoting contract. Unbound hosts remain non-runnable; no registration or activation.
3. Approved grammar/native/query/Chroma assets and concrete MCP initialize/list-tools
   and worker lifecycle success/failure specs. U1/D9 activation blocked; V4 needs
   approved Chroma assets. No fabricated protocol success or approval manifest.

V1 PASS only. **V2 NOT RUN this slice; V3/V4/V5/V6/CI NOT RUN.** No generated
process/hook/worker/MCP/service/listener/native runtime/auth/inference/AWS/acquisition/
preparation/build-and-sync/dev/real assets/registration/machine PATH/registry or CI
provision/job/dispatch/upload. Planner remains source/dry-run BLOCKED D5; fork CI
manual-only BLOCKED D12. Upstream triggers require review before future authorized
push. D11 and A15 steps10/11/12 remain open; roadmap graph unchanged.

One next remaining-source task: **WINDOWS-09F — concrete native OS substrate/API and
artifact-interface review**, using only bounded source and official API documentation.
Map each unmet admission/cleanup guarantee to a concrete primitive and artifact
contract, or explicitly BLOCK it. No nominal adapter or invented OS approval. Do not
offer actual V3 until approved immutable artifacts, implemented native adapter/OS
boundary, permissions and cleanup readiness all exist. [Single prompt](../NEXT-SESSION.md).

## Rollback

Revert **98a6d019c** after reviewing later overlap; it only restores the former mock
orchestration and scratch selection, including its unsafe launch/teardown error handling.
This grants no runtime permission. Revert the following documentation closure separately
if needed; preserve older commits and user state. No reset/clean/reinstall. Claims are
released in TASKS; STATE/WORKLOG/DECISIONS/contracts/environment/NEXT-SESSION close the chain.

Documentation closure PASS: 14 Markdown files / 121 relative links / 18 H-pinned
source-line assertions; balanced fences/whitespace. Source/tests still equal H;
tracked preservation scope and roadmap graph unchanged. Final local documentation
commit follows these checks with hooks/signing disabled.
