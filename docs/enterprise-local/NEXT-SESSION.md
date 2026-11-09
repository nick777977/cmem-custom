# Next implementation — PROFILE-06B

Continue step 6 on `feat/cmem-light-local` with one coordinator.
[PROFILE-06A](handoffs/PROFILE-06A.md) covers the main worker's observation,
session summary and field compression routes at `534de7911`.

1. Recheck branch, status and HEAD. Read [STATE](memory/STATE.md),
   [TASKS](memory/TASKS.md), the [profile contract](LLM-PROFILES.md) and
   [roadmap step 6](../roadmap.md). Reserve the exact source, test and
   build paths before edits.
2. Trace `src/services/agent-runner/run.ts`, `WorkViewRoutes.ts`,
   `src/services/work-view/{human-copy-worker,request-judge}.mjs`,
   `src/services/worker/knowledge/KnowledgeAgent.ts` and standalone helpers.
   Include the Telegram wrap-up formatter and retained model callers reached
   from these paths. Reuse the explicit profile resolver and compatible
   adapters. Validate each job's capability, auth and destination before
   dispatch. Remove legacy auto-detection, model lists and credential fallbacks
   from the covered paths. Preserve local cached results and file-tool policy.
3. Verify actual role dispatch, safe effective status and no-send failures
   with fake transports and disposable settings. Run focused checks, root and
   viewer typechecks, the reviewed compile and a bounded compiled loopback
   check where the launch authorizes it. Finish when every retained role in
   scope uses explicit selection or reports a tested capability refusal before
   dispatch. Record any further call sites with a specific owner and boundary.
4. Close STATE, TASKS, WORKLOG, changed contracts and NEXT-SESSION. Chroma and
   offline embeddings belong to step 7.

Keep the existing private Windows setup and synthetic SQLite evidence. All
three approved `gpt-6-luna` turns remain unused. Prove the exact route can
disable automatic retries before any live inference. The tested Codex CLI
rejected zero-retry overrides for the built-in OpenAI provider. Synthetic
checks need no live inference. No real corpus, external registration,
public marketplace, push, AWS execution or admin/UAC.
