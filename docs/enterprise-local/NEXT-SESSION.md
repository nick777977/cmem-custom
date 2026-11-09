# Next implementation: PROFILE-06A — explicit main worker model roles

CLOUD-05 is done-bounded for the local worker. See [the evidence](handoffs/CLOUD-05.md).
Continue step 6 on `feat/cmem-light-local` with one coordinator.

1. Recheck branch, status and HEAD. Read [STATE](memory/STATE.md),
   [TASKS](memory/TASKS.md), the [profile contract](LLM-PROFILES.md), and step 6
   in the [roadmap](../roadmap.md). Claim the concrete source, test and build
   paths. Use the profile contract's source inventory to trace
   `worker-service.ts`, `provider-dispatch.ts`, `SessionRoutes.ts`, the existing
   observer/summary/compression providers and the effective status paths.
2. Implement one explicit default provider/model/auth profile and optional
   main-worker role overrides. Reuse the existing adapters. Require a complete,
   supported selection before any provider call or child spawn. Legacy defaults,
   unsupported selections, credentials missing from the selected route, and
   provider failures must yield a local diagnostic. Expose the effective roles
   and auth modes without secrets. Keep Claude/Bedrock/AWS SSO and supported
   Claude/Codex login and direct API routes available where explicitly selected.
3. Test role resolution, actual dispatch, invalid and missing selections,
   sanitized status and failures with fake transports and disposable profiles.
   Run focused checks, root/viewer typechecks and the reviewed compile. Use a
   bounded compiled loopback check only within the launch's authorized scope.
4. Close STATE, TASKS, WORKLOG and NEXT-SESSION. Continue PROFILE-06B for
   background refresh, copy, judging, standalone helpers and remaining role
   coverage. Chroma and offline embedding setup are step 7.

Keep the existing private Windows setup and synthetic SQLite evidence. The
approved `gpt-6-luna` allowance still has all three turns unused. Prove the exact
route can disable automatic retries before using it. The tested Codex CLI
rejected retry overrides for the built-in OpenAI provider. No live inference
is needed for PROFILE-06A's loopback tests. No real corpus, external registration,
public marketplace, push, AWS execution or admin/UAC.
