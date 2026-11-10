# VIEWER-08-LOCAL

2026-11-10 on `feat/cmem-light-local`, one coordinator. Clean entry
`47e990374abb39bc4afe560b0f2a45dd4c45da6e`. Source citations refer to paired
implementation `2b77e9331e501b835627ceab9ecdde2682eabb4e`.

## Viewer and API

- [Settings → Local runtime](../../../src/ui/viewer/components/ContextSettingsModal.tsx#L320)
  reads effective roles from `/api/health`. The [panel](../../../src/ui/viewer/components/LocalRuntimeStatus.tsx#L52)
  shows profile ID, model, provider, auth mode, inheritance or override, and
  safe failure categories. Profile configuration stays in worker settings or
  its environment. The viewer labels the separate legacy provider controls.
- The panel runs the [existing Chroma status probe](../../../src/services/worker/http/routes/ChromaRoutes.ts#L13)
  when expanded or rechecked. It distinguishes setup required, disabled,
  disconnected, connected with unverified or failed queries, and a passing
  semantic round trip. A setup failure short-circuits the query. The API probe
  reports outcome, stage, counts and latency. Raw errors stay in worker logs.
- [Settings reads](../../../src/services/worker/http/routes/SettingsRoutes.ts#L189)
  omit the legacy Claude credential directory. The status uses the existing
  safe role projection. The [GitHub link](../../../src/ui/viewer/components/GitHubStarsButton.tsx#L9)
  opens on user click and loads without fetching a star count.

## Verification

54 focused tests and 237 assertions passed across 12 files. Coverage includes
the health and settings API, profile resolution, Chroma status and redaction,
the browser status recheck, and Settings load, save, count and auth regressions.
Earlier attempts exposed sandbox loopback denial, Chrome DevTools startup
under a stripped Windows environment, transient file locks and a panel that
was hidden when the context preview collapsed. The final fixture keeps the
necessary Windows system variables, isolates Chrome's profile and verifies
that the status panel is rendered at 800 pixels wide.

The guarded `build:compile` and root and viewer typechecks passed with Node
22.23.4, npm 10.9.9 and Bun 1.4.4. The final compile preserved all 19 build
inputs and 2028 tracked and newly added source/test sentinels. Relative to
entry, four of 193 tracked emitted files changed. They are the worker CJS
and map, viewer JavaScript and viewer HTML. The Node socket tripwire recorded
zero events. This guard does not provide OS-wide network evidence.

| Emitted file | SHA-256 |
|---|---|
| `plugin/scripts/worker-service.cjs` | `bea2b8fe7a0e1543d96d8e45296f66e655121871fdcc86a8a3a3833df882ade5` |
| `plugin/ui/viewer-bundle.js` | `f00b469771ac650d13f828ab6a0431d151c5d2229b3d22955d5407a5cc6a99f8` |
| `plugin/ui/viewer.html` | `42786ccdee25aa3ef97f3dae518b38614b13ce7a5b4a5dbb7cd643922d212036` |

The copied-worker and browser fixture passed under
`.scratch/enterprise-local/viewer-08-local/copied-viewer-zYAYIM/`. It compared
the copied worker, adapter, viewer HTML and viewer bundle byte for byte with
the build. The first start used a task-owned directory with missing runtime
files. The browser displayed **Setup required**, no vector database existed,
and SQLite search returned zero results for the Russian paraphrase. The
second start reused the staged runtime and indexed the three imported SQLite
observations. The browser displayed **Semantic search probe passed**, and the
same query returned the expected English observation at SQLite ID 1.

Both views showed an inherited observer profile, an explicit summary profile
and disabled card copy. The status responses and panel omitted the fixture's
key, key reference, endpoint, executable and credential directory markers.
The loopback provider tripwire received zero requests. Browser resource URLs
were same-origin. Both worker starts exited with code 0, the writer lock
was released and the Windows process query found zero matching worker,
Python or browser processes. The earlier [Chroma handoff](CHROMA-07-LOCAL.md)
contains the separate corrupt-asset validation.

## Boundaries and rollback

The slice changes diagnostics and presentation. Project and worktree identity,
sharing, filters, capture and retrieval continue through their existing paths.
D11 stays open. The exact native Codex route still needs automatic retry
disablement proof. All three approved `gpt-6-luna` turns remain unused.

For rollback, stop the local worker and revert the paired source and emitted
files together. Keep settings, canonical SQLite, the prepared runtime and the
derived Chroma store. The next step is [local package admission](../NEXT-SESSION.md).
