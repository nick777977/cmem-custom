# BUILD-02-TRUST-APPLY: owner-selected C, consistency restored

Date: 2026-11-02. Branch: `feat/cmem-light-local`; single coordinator, serial.
Entry HEAD: `6aa253dfb0ed3b90ab3339e73c7e6f2fe03a94e2`, clean index/worktree.
Source commit: **`8bc557532108bc68fb516f6fce9549dd1b9a7b6e`** (S below).
User explicitly chose C after discussing the concrete two entries, authorized edits,
local commits, durable memory and one next-session launcher. No repeated policy question.

## Outcome and exact change

The lifecycle declaration subtask is **done**: canonical/root/plugin npm maps all
contain the same **30 true entries**, including `onnxruntime-node` and `msgpackr-extract`.
The existing guard now actually **PASSes, exit 0**, instead of Session 02's drift FAIL.
This is the selected permission expansion; it is not an execution or download approval.

| Path at S | Actual delta / purpose |
|---|---|
| `scripts/postinstall-allowlist.js:51-52` | Add the two reviewed names to POSTINSTALL_ALLOWLIST, preserving the user's root entries. |
| `plugin/package.json:100-101` | Add true entries for those same names to allowScripts. All other parsed fields unchanged. |
| `package.json:253-254` | No change: user's two root entries retained. |
| `scripts/build-hooks.js:9,569-579` | No change: generator already emits allowScriptsMap(); the committed plugin map now matches that output. |
| `scripts/check-postinstall-allowlist.js:85-130` | No change: exact-equality guard retained and run directly. |
| `scripts/plugin-trusted-dependencies.json`; `plugin/package.json:43-70`; `plugin/bun.lock:40-67` | No Bun permission changes. JSON, generated trust list and lock trust list still agree as 26-name sets. |

Only two source/generated-declaration files are in S (5 insertions, 1 deletion).
Plugin allowScripts was updated directly rather than running the broad build generator;
the map, full manifest formatting and preserved fields were checked against its contract.
No dependency version/override/integrity/resolution change or new graph. No dependency,
installed file, viewer or bundle was deleted. Baseline 49e4f65e1/ce7ded4dc remains intact.

## Checks actually run

Working directory: `C:/0/ai/claude/claude-mem-custom/cmem-light`.
Exact existing executable used, without changing global or process PATH:

```powershell
& 'C:/Users/MykolaPushnikov/AppData/Local/Volta/tools/image/node/22.23.4/node.exe' --version
# v22.23.4; exit 0
& 'C:/Users/MykolaPushnikov/AppData/Local/Volta/tools/image/node/22.23.4/node.exe' scripts/check-postinstall-allowlist.js
# Postinstall allowlist guard passed — 26 plugin deps checked, no unexpected install/postinstall scripts.
# allowScripts declaration guard passed — root + plugin manifests match the 30-entry allowlist.
# exit 0
```

The reviewed guard reads repository/local dependency manifests; it neither imports
those packages nor invokes lifecycle scripts. Its limited direct-dependency coverage
has not become a complete optional/transitive lifecycle audit.

An inline built-in-only Node assertion check also **PASSed, exit 0**:

- Imported the inspected canonical map and required deep equality with both manifests
  (30 entries). Root and plugin true values/order agree with generator output.
- Read the previous plugin manifest using read-only git show, substituted only its
  allowScripts map and required full parsed equality with the new manifest.
- Required full plugin text (normalizing line endings) to equal JSON.stringify with
  two-space indentation and final newline, as build-hooks writes it.
- Required plugin trustedDependencies to equal the generator's literal CLI + JSON
  deduplicated array; compared existing lock trust names as a sorted set (26 each).
- SHA-256 checks confirmed all five preserved inputs below unchanged before/after.

Git source diff and staged whitespace checks **PASS**. Source commit hooks/signing
were disabled only for the commit command; no machine Git configuration changed.
Docs links, final whitespace/scope and final status are checked at session close and
recorded in WORKLOG. No full compile or 6+21 test replay: no compiler/bundle/runtime
source changed. Their Session 02 passes remain historical evidence at their tested SHAs.

## Fingerprints

| File | SHA-256 at S | Status |
|---|---|---|
| scripts/postinstall-allowlist.js | `68cdc604841bdb93e805af79a9f7040ddee43f8c74cace231f03a9d93e2730d9` | Changed by selected C |
| plugin/package.json | `d54291d304e4d47208c83b3380e1ff53568de57d2fa08397bc5d936493f552d7` | Only allowScripts changed |
| package.json | `dcdaa006f8b245ece40c6f3c5b7f9217204f597a891bb88514f5a0f0bf4c981d` | Unchanged |
| scripts/build-hooks.js | `98eca741aa7461a87ab28ce0c8108f9503581ee2ed706f4e1918f5ffd490aa7d` | Unchanged |
| scripts/check-postinstall-allowlist.js | `9b28be193552d510f20e1b9133f27694854fd79f13702356c0fa6d942b5cbc89` | Unchanged |
| scripts/plugin-trusted-dependencies.json | `036ff6bd4fbd6fc3c854f2d4123eb106825d2558e8b703f8250df06d719ac0f8` | Unchanged |
| plugin/bun.lock | `8db1a1527dd3a784622fcbe1ed7d036b67c0b807f7fd28a6aa9faa5f8bc2388e` | Unchanged |

## Permission meaning and remaining limits

The [historical review](BUILD-02-TRUST.md) remains the pinned source/local-script
evidence for npm 10.9.9 and Bun 1.4.4. Its recommendation A was not adopted; owner
choice C is now accepted as A14. There is no pending A/B/C choice.

This is a name-based npm declaration for both contexts, including versions other than
the locally inspected ones. npm 10.9.9 does not selectively enforce the manifest map.
Bun trust is separate and unchanged. Existing ignore-scripts installation paths remain
unchanged. Potential ONNX downloads/native builds are not approved to run here.
No inference is made that the original installation errors were caused/fixed by these
two root entries; supplied successful build/setup evidence is preserved as supplied.

No install/download/upgrade, package lifecycle/native load, lock resolution, service,
worker/MCP/plugin start/restart, AWS/live inference, real settings/data/credentials,
push, new branch/worktree/subagent or step 3 execution occurred.
No OS-wide network enforcement/capture or clean root-lock/dependency provenance was
established. Step 2 is **not** labelled fully completed/shipped; only this subtask is done.

## Completion criteria and next useful implementation

For BUILD-02-TRUST-APPLY all criteria are satisfied: explicit C, exact two-file delta,
actual guard PASS, preserved setup/trust/lock pairing and durable evidence/handoff.
Do not create another trust review or rerun compile merely to repeat this result.

Next proposed task: **HOSTED-03**, roadmap step 3, after explicit user launch accepts
the existing compile boundary for development progression (P10). The launcher includes
that limited acceptance and carries outstanding release evidence forward explicitly;
it is not accepted or executed in this session. It avoids another docs-only closing
session while retaining all release gates:

| Evidence still open | Proposed owner / when required |
|---|---|
| OS/process-wide no-egress, full startup/memory/Chroma/Bedrock acceptance | Step 11 against the final artifact; no claim of offline/security acceptance from compile. |
| Root-lock/native/dependency provenance, clean/reproducible artifact closure | Steps 10/12 before distribution; before any acquisition, D1/source policy must separately be satisfied. No install is needed merely to edit hosted source. |
| Existing worker self-contained fixture | It invokes a Codex hook with inherited environment; it is not Claude Code memory acceptance. Do not run it just to close an unrelated declaration change. Review/select relevant isolated regressions with the affected implementation. |

Roadmap dependency edges/waves stay unchanged: step 3 relies on the compile boundary
not acquiring/deploying, already implemented/tested. P10 concerns acceptance of remaining
evidence for progression, not proof those gates passed or removal of final checks.
Until that launch, step 2 stays in progress and HOSTED-03 is awaiting authorization.

HOSTED-03 should remove the already-mapped E01/E02 hosted setup/history upload paths
and their CLI/viewer callers, preserving local capture/storage/retrieval and the viewer.
Reuse E01/E02 and inspect only affected live source/tests; do not repeat full audit.
Done means legacy hosted operations cannot dispatch an outbound request (negative tests
with synthetic inputs), local paths survive relevant regressions, source/generated output
is paired after an authorized compile, and no hosted setup is required by the local flow.
This is not full Chroma/Bedrock/live-memory acceptance; those stay in steps 7/11.

## Rollback

Revert only S to restore the prior declarations. Expect the known root/canonical drift
guard failure to return. Keep baseline commits, dependencies, bundles, SQLite/Chroma and
all user state. No reset/clean/reinstall/service operation is part of rollback. A separate
docs revert changes handoff only; record any rollback in the same repository memory.
