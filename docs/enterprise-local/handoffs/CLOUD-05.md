# CLOUD-05 evidence

2026-11-09, one coordinator on `feat/cmem-light-local`. Clean entry
`7b7e5cbdb62ebcb0b9aff1cab93c2c0e5f83a152`. Source, tests and paired build
`e87ef65ae1532dc01d2b84d211d0fbc99dcf58d0`.

## Local worker boundary

- [DatabaseManager.ts:22](../../../src/services/worker/DatabaseManager.ts#L22)
  opens the guarded SQLite database and disables new cloud mutation ops.
  Legacy outboxes and the stored device ID stay readable. The worker clears
  the stale sync-health warning. Local ChromaSync construction remains.
- [worker-service.ts:574](../../../src/services/worker-service.ts#L574)
  supplies the stored device ID for work-view ordering.
  [Worker startup](../../../src/services/worker-service.ts#L830) wires search
  and the local cache without a pull client or remote-only routes.
  [SearchRoutes.ts:427](../../../src/services/worker/http/routes/SearchRoutes.ts#L427)
  proceeds directly to local context rendering.
  [Local Chroma backfill](../../../src/services/worker-service.ts#L883) is
  still registered when Chroma is enabled.
- [DataRoutes.ts:441](../../../src/services/worker/http/routes/DataRoutes.ts#L441)
  retains the existing cloud-disabled guard for acknowledged rows. Deletes
  still check ownership, clean up local Chroma and notify the viewer. Local
  project edits use the existing predicates without queuing a cloud mutation.
  [Project merge](../../../src/services/infrastructure/ProjectMerge.ts#L80),
  [worktree adoption](../../../src/services/infrastructure/WorktreeAdoption.ts#L595),
  [CWD remap](../../../src/services/infrastructure/ProcessManager.ts#L381).
- The emitted worker source map no longer includes CloudSync, SyncClient,
  SyncApply, CloudSyncRoutes or TeamBrainRoutes. The standalone server API
  and host-side TeamBrain entrypoints are tracked separately.
  [Egress inventory](../../EGRESS-INVENTORY.md#cloud-05-local-worker-disposition-2026-11-09).

## Validation

- Final focused runs passed 83 tests and 446 assertions across 14 files.
  They covered legacy settings, queue retention, local deletes and rollback,
  SessionStart/context, work state, project and worktree remaps, and mocked
  Chroma reconciliation and settings precedence. Test fixtures explicitly
  release SQLite statements or collect closed handles before Windows cleanup.
- Root and viewer typechecks and guarded `npm run build:compile` passed
  with Node 22.23.4, npm 10.9.9 and Bun 1.4.4. All 19 inputs and 871 source
  sentinels were stable across compile, including the deliberate source
  deletion. Of 192 tracked outputs, five CJS/map pairs changed: worker,
  context generator, context reader, MCP server and transcript watcher.
  The latter four bundles lost the project remap outbox helper through their
  shared imports. The standalone server pair was byte-identical. Generated
  minifier whitespace was kept. Source, test and docs whitespace checks passed.
- The initial sandboxed runtime attempt stopped before installation when
  Bun's loopback positive control returned EACCES. The approved retry used
  an ordinary Windows user and a fresh private catalog and home. The launcher
  installed the copied bundle. The fixture started that exact worker
  directly because launcher start masks old cloud credentials. It used
  synthetic settings, an explicit loopback OpenAI-compatible profile and
  disabled Chroma. One preliminary run cleaned up successfully but used an
  invalid assertion that SessionStart must display the manual note. The
  final run checked local context and retrieved the note through the
  observation API.
- Both cycles passed readiness, viewer, context, local SQLite read and
  graceful stop. Five routes returned 404: sync status and TeamBrain
  status, board, brief and search. The fixture used wrapped settings on
  disk in both cycles and environment overrides on the restart. It seeded
  a mutation and a content tombstone between starts. Reopening SQLite
  after the second stop confirmed the note and both queued rows remained.
  The reachable fixture recorded zero HTTP requests or WebSocket upgrades
  after the positive control. Both child processes exited and both listeners
  closed. The private launcher removed the disposable Codex registration.
- A broad preliminary test command included an upstream fixture that
  attempted a Git push to its own disposable local bare repository. The
  sandbox stopped that command. The final run filtered out the fixture and
  limited Git to the file protocol. Two unrelated native-memory path lookup
  cases failed in a preliminary Windows run. The affected local note/vector
  regression passed in the focused run.

The installed worker was byte-identical to the compiled checkout. Its SHA-256
was `866a5c73b1550b46d6893c66b811b1f5287b10ee4feacd806f3d5be09319495c`.
The compiled check covers this worker and fixture. Whole-process egress,
other entrypoints, real Chroma and model-backed summaries have their own
acceptance steps. All three previously approved live turns remain unused.

## Rollback and handoff

Keep the SQLite data. Revert the source and compiled pairs together if
required. Reverting can re-enable cloud sync for previously configured
settings and queues, so keep a reverted worker stopped until its settings
have been reviewed. No down migration is needed for the CLOUD-05 change.
[PROFILE-06A](../NEXT-SESSION.md) owns explicit main-worker model roles.
