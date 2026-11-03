# Current handoff

Updated 2026-11-03 after WINDOWS-09B closure (launch 2026-11-02). Branch
feat/cmem-light-local; clean entry e27548d5450c7f91ea64004db851152a73a8a0db.
Single coordinator; no active reservations. Full evidence/rollback:
[WINDOWS-09B](../handoffs/WINDOWS-09B.md).

## Latest bounded result

Launcher e9c8038ca, bootstrap 8bbf2830c, final application source **S e3d91a505**,
source/mock harness **H bbc3847e9**, paired outputs **G 62a468f6d**. Docs follow G.
Protocol 3 private launcher only inspects explicit CLAUDE_MEM_BUNDLE_ROOT and its
own entry/siblings; missing/foreign/present-but-unapproved all refuse. No cache,
PATH/global host settings/Bun/worker discovery or child. Version and hook opt-out
remain inert; hook failures preserve the nonblocking envelope without readiness.
SessionStart sibling preflight remains always blocked, as in WINDOWS-09.

Automatic npx default/install/repair/update/upgrade reject before installer/auth
imports; setup-runtime acquisition/discovery/marker APIs are inert/refusing.
Four launcher install/PATH/removal entrypoints refuse before options/host inspection.
Parser CLI resolution now uses explicit bundle root plus existing version/hash
verification, no CLI module/PATH fallback. Direct doctor parser caller reports
unavailability. These gates are not a complete boundary around legacy entrypoints.

19 tests / 112 assertions PASS; affected nine copied-artifact mock cases rerun
against G PASS (57 assertions, not 28 unique tests). Zero forbidden operations.
One reviewed build:compile PASS, viewer --noEmit PASS. Root --noEmit FAIL: exactly
three unchanged TS2345, ChromaMcpManager 227/842 and ChromaSync 385, diagnostic text
matches previous run. No Chroma type workaround or new baseline overlay.
19 selected inputs unchanged vs previous/pre-post compile; 866 selected tracked
source/config hashes unchanged across compile. 184/192 outputs unchanged; four
expected CJS/map pairs changed. Manifests/locks/trust/identity/generators/UI preserved.
No source edits after the compile. Resume verified checkout/fingerprints, no reruns.

## Exact remaining same-step source gaps

- E13 hook/MCP/shell/on-PATH/global-node/cache templates and wrappers unchanged;
  can bypass the new launcher or select upstream. Canonical pairing PASS is not
  private-path compliance. No activation/registration policy chosen (D5).
- E12 Setup/version-check still has discovery/acquisition; old installer OAuth/
  inner/bootstrap helpers remain source behind rejected wrappers. Other CLI
  runtime/doctor/IDE command roots and diagnostics need bounded direct-caller work.
  Preserve native provider login implementation while retiring plugin signup.
- E14 historical compile-path/registry-script/codesign/probe utilities remain;
  four mutation entrypoints refuse, not a complete private installer/rollback.
- E21 CLI fallback removed, but parser.ts grammar module resolution/library build/
  query fallback remains. Approved grammar/native artifact contract still required.
- Native V3 owned-tree/OS-egress/cleanup adapter and runtime-version/hash/MCP/worker
  specs not finished. Current kind label alone is not enforcement. Actual V3 NOT RUN.

PowerShell planner unchanged source-only BLOCKED D5. Fork CI unchanged manual-only,
unconditional BLOCKED D12, no job/provision/upload. Upstream acquisition/publish
triggers reviewed only; all relevant workflows must be reviewed before any push.
Do not run this partial candidate or claim full step 9/readiness.

A19/A20 compatible Claude/Bedrock/API/login/Codex ChatGPT/OpenAI-compatible adapters
and native auth source preserved. Step 6 profile/role/model/fallback enforcement
unimplemented. Viewer and memory identity/sharing/filter/capture/retrieval behavior
not redesigned. SQLite canonical, Chroma derived; U1/D9 activation/D11 remain open,
no SQLite-only success mode. V4 needs approved Chroma assets, V5/V6 NOT RUN; A15
release gates in 10/11/12 remain open. No actual hooks/worker/MCP/services/listeners,
Python/model/assets, credentials/real state, inference/AWS, acquisition or push.

Earlier source evidence is retained in WINDOWS-09, TELEMETRY-04, CHROMA-07,
HOSTED-03 and BUILD-02 handoffs, not replayed. Initial Git index write was sandbox
denied; authorized escalation completed local commits with hooks/signing disabled.
No automatic-review rejection or external publication.

## One next task

**WINDOWS-09C remaining source**, same step 9, awaiting explicit
[NEXT-SESSION](../NEXT-SESSION.md) launch. Finish direct host templates/Setup/grammar
refusal and native-adapter prerequisites. Not a V3 launch: artifacts/OS boundary/
ownership/cleanup and applicable runtime permission are still missing. No other
roadmap step, runtime/acquisition/CI/registration/user-state/agent/worktree scope.
