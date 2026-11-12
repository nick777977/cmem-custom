# cmem-light: Claude Code entry point

This is the private Windows local-first fork. Apply the working agreement:

@AGENTS.md

If this Claude Code version does not expand that import, read `AGENTS.md`
explicitly before acting. Then follow its entry order:
`docs/enterprise-local/README.md` → newest active `memory/STATE.md` →
`docs/roadmap.md` → newest `memory/TASKS.md` ownership section.

For the first session after moving development to another machine, read
`docs/enterprise-local/CLAUDE-CODE-BOOTSTRAP.md`. For later sessions use the
current `docs/enterprise-local/NEXT-SESSION.md`; do not replay bootstrap work.
Tracked repository memory is the durable handoff. Auto memory and old chat
summaries do not override current decisions or actual Git/source evidence.

Do not use the old upstream `build-and-sync`/marketplace restart instructions
as this fork's default. Inspect scripts first; `build:compile` is the separate
compile lane. Use explicit task-owned host/data/runtime bindings for tests.
No normal-memory inspection, registration, AWS inference test, publication,
machine-level installation or permission bypass follows from opening the repo.

Claude Code already using Bedrock for this development conversation is
separate from testing a child Claude host or configuring the memory worker's
model/auth profile. Do not change the working development login or silently
reuse it for a product inference test. Follow the current owner scope.

Work serially on `feat/cmem-light-local`, preserve WIP, and close every session
through STATE/TASKS/WORKLOG/DECISIONS and one concrete NEXT-SESSION prompt.
Explain results and missing evidence in concise Russian. Full details and
exceptions live in AGENTS and the current task contracts, not duplicated here.
