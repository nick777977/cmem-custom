# RUNTIME-10-LOCAL

2026-11-10 on `feat/cmem-light-local`, one coordinator. Clean entry
`d26953ec07659fc52c88ac772396fef8514c9610`. Source citations refer to paired
implementation `2bb4746b2d1ab20f06501b80358cbc6ecbe490d9`.

## Admission boundary

- The private [staging allowlist](../../../scripts/enterprise-local/codex-local.mjs#L24)
  copies the worker, search MCP, context reader, Chroma Python adapter, SQLite
  helpers, viewer and modes. The catalog retains memory search, smart explore,
  knowledge agent, request progress and owner goals. Cloud sync, legacy
  setup/backup and other skills outside that list are excluded from the catalog.
  [Staging](../../../scripts/enterprise-local/codex-local.mjs#L170) renders the
  seven recognized hooks and MCP entry for the destination and pins their paths
  in the manifest. The Chroma adapter now travels with the copy. Python packages
  and weights remain separate target inputs.
- The launcher [pins the runtime to worker](../../../scripts/enterprise-local/codex-local.mjs#L82).
  The compiled worker [refuses lifecycle, keys and jobs delegation](../../../src/services/worker-service.ts#L1218)
  before looking up either standalone server filename when explicitly in worker
  mode. The SQLite-backed API key compatibility command remains separate.
  The standalone [server start](../../../src/server/runtime/ServerService.ts#L469)
  and [generation worker](../../../src/server/runtime/ServerService.ts#L820)
  load the separate factory. The factory can [import an explicitly configured
  custom module](../../../src/server/runtime/create-server-service.ts#L378).
  Those server paths stay outside the private package.
- The dormant [installer probe](../../../src/npx-cli/cmem-memory-credentials.ts#L115)
  can perform a loopback completion. Its installer reference is [type-only](../../../src/npx-cli/commands/install.ts#L7).
  The legacy [NPX dispatcher](../../../src/npx-cli/index.ts#L94) refuses install
  before its dynamic import. Esbuild checks the [worker input graph](../../../scripts/build-hooks.js#L677)
  for the absence of the standalone service, its factory and the credential
  module, and the [NPX input graph](../../../scripts/build-hooks.js#L1067) for the
  absence of the credential module.
- The [native detector](../../../src/services/agent-runner/detect.ts#L359) and
  [runtime-root helper](../../../src/services/agent-runner/runtime-read-roots.ts#L28)
  had no production callers in the checked-out source. The detector file also
  exports `runCommand`, used by refresh and its Python helper. This slice
  leaves that shared module intact. Worker profile dispatch and native adapters
  retain their earlier admission policy.

The separate build still emits `plugin/scripts/server-service.cjs`,
`context-generator.cjs`, `transcript-watcher.cjs`, the legacy launcher
and wrappers, `dist/npx-cli/index.js`, `dist/bug-report/index.js`, and
the OpenClaw, OpenCode, Pi and DSH integrations. These entrypoints were
excluded from the tested private catalog.

## Verification

- 21 focused tests with 167 assertions passed across four files. The nine
  admission tests checked staged bytes and rendered paths, rejected an extra
  hook and unreviewed manifest entry, and refused eight server invocations
  with executable fixtures at both sibling server filenames. The other files
  covered explicit provider/role admission, native adapter selection through
  fakes and Windows spawn options. Direct execution of the compiled NPX
  `install --provider host` returned the expected installer refusal.
- Root and viewer typechecks passed. Guarded `build:compile` passed with
  Node 22.23.4, npm 10.9.9 and Bun 1.4.4. All 19 build inputs and 2,029
  source/test sentinels retained their hashes. Only the worker CJS and map
  changed among 193 tracked outputs. The worker, MCP, context reader and
  both SQLite helper maps listed none of the three excluded source modules.
  The Node socket tripwire recorded zero events. The tripwire covers
  instrumented Node connections.
- The private launcher staged a transferred copy with no Codex registration.
  The first sandboxed run bound and initialized SQLite, but readiness was
  never confirmed by the launcher. The launcher reported forced termination
  and the worker PID exited. The approved loopback rerun verified the exact
  copied worker path and PID, readiness, the viewer and a synthetic SQLite
  import. The worker log recorded graceful shutdown, the launcher exited 0,
  the PID and loopback listener were gone and the control lock was released.
  SQLite reopened with the expected row. The shared provider and legacy
  server tripwire received zero requests. The fixture explicitly disabled
  Chroma for this lifecycle check. Real Chroma evidence is in [CHROMA-07-LOCAL](CHROMA-07-LOCAL.md).
- Additional historical tests had seven failures on unchanged inputs.
  `server-embedder-install-gate.test.ts` still expects two installer decisions
  from the already-refusing runtime API. `windows-09c.test.ts` had four
  failures from a mock that forbids reading `CLAUDE_MEM_NODE_EXECUTABLE` and
  one from its expectation that retired installer internals still exist.
  The latter file also had five passes.

| Paired output | SHA-256 |
|---|---|
| `plugin/scripts/worker-service.cjs` | `6cd629fd7b21374387e8a664ec0c8dfb1da4aa3d25e3d3f234575ca9be5781e7` |
| `plugin/scripts/worker-service.cjs.map` | `b9cbe4cc0b0af820af567c330e1fbc668c50467258363d6785e7a6e5cbbfac35` |

## Remaining work and rollback

Step 10 still owns exact artifact provenance, SBOM and D12 CI admission.
D11 stays open. All three approved `gpt-6-luna` turns remain unused. Retry
disablement on the exact native route still gates a live turn. This slice's
loopback check leaves external provider behavior and OS-wide egress unverified.

To roll back, stop the private worker and revert `2bb4746b2` as a unit with
its emitted files. Re-stage the intended version in a separate root using
the setup runbook. Keep the existing data and prepared Chroma assets.
The subsequent [ARTIFACT-10-LOCAL](ARTIFACT-10-LOCAL.md) slice pins and
verifies the private Windows x64 distribution and its independent inputs.
