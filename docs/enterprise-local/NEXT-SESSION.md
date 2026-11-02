# Next session: WINDOWS-09 — deterministic private Windows plugin paths

Updated: 2026-11-02 after TELEMETRY-04 S 0abd4180b / G 6bb7c6995.
Replaces the completed step-4 launcher. Proposed only; await explicit user launch.
Roadmap wave 4's remaining independent increment is step 9. No graph/wave changes.

TELEMETRY-04: 206 tests / 728 assertions, one compile PASS; 16 inputs unchanged.
Node E03/E04 sinks/jobs removed, local diagnostics retained. CHROMA-07 local activation
still blocked by U1/D9; Python E11 unverified, D11 open. Release gates stay 10/11/12.

## Copyable prompt

~~~text
Продолжаем в C:/0/ai/claude/claude-mem-custom/cmem-light,
ветка feat/cmem-light-local. Выполни WINDOWS-09, roadmap wave 4 / step 9:
детерминированные private Windows launcher/hook/MCP paths без runtime acquisition,
upstream/global cache fallback и self-repair compile. Один coordinator, serial,
без agents/branches/worktrees. Не запускать другие roadmap steps.

Начни AGENTS -> README -> STATE -> docs/roadmap.md step 9/graph -> TASKS -> DECISIONS
A06/A07/A09/A14/A15/A17/A18 -> DEV-ENVIRONMENT current -> TELEMETRY-04 / CHROMA-07
handoff limits -> PATCH-SEQUENCE section 9 -> E12/E13/E14/E21 и AUDIT-CLOSURE notes.
Проверь branch/status/HEAD; claim точных файлов до edits. Не повторяй baseline/trust/
hosted/Chroma/telemetry implementation. Сохрани user WIP и установленное дерево.

Разрешаю bounded step-9 source/test changes в launcher, CLI bootstrap/preflight,
tree-sitter runtime acquisition и прямых callers; нужные hook/MCP/source generators,
paired generated outputs, логические local commits и targeted checks с existing dev
dependencies. Retain compatibility and local diagnostics; missing executable/artifact
must fail clearly without discovery/download/install/repair/fallback. Private identity
не меняет project/worktree memory identity. Учитывай D5: не придумывай одобрение private
registration/installation; unresolved identity/policy оформить как конкретный blocker
с reviewable вариантами, продолжая независимую source refusal работу.

PowerShell preflight/install/verify/uninstall/rollback tooling — только source и
synthetic dry-run, без actual registration/PATH/registry/marketplace или существующей
установки. Перед checks прочитай fixtures/subprocess/env/network behavior. Только mocks
и synthetic HOME/config/data под .scratch/enterprise-local/windows-09; real worker,
service, MCP/plugin и OS smoke запрещены. Unicode/spaces/coexistence/missing-file checks
должны оставаться fixtures, не использовать installed launcher/cache/assets.

После application source изменений разрешаю один reviewed build:compile: точные
Node 22.23.4/npm 10.9.9/Bun 1.4.4, existing inputs, process-local PATH, synthetic
HOME/config/data, isolated npm config/cache/offline mode, reviewed BUILD-02 harness.
Сверь source/generated и locks/trust/dependency/compiler sentinels. Missing inputs ->
clear failure, no repair. Если step-9 generator change требует нового manifest identity,
заранее отдели ожидаемый declared manifest delta от запрещённой lock resolution;
не скрывай drift и не меняй dependency graph ради compile.

Запрещены downloads/install/update/lock resolution/new dependency graph, preparation/
build-and-sync/dev, actual services/worker/MCP/plugin start/restart/registration,
machine PATH/registry effects, AWS/live inference, real settings/credentials/memory,
installed Python/model/cache inspection, push, agents/branches/worktrees.
Chroma не активировать. SQLite canonical/Chroma derived и capture/retrieval/project/
worktree/sharing/filter semantics не менять. A15 release gates остаются открытыми.

Completion: source entrypoints/generators use deterministic Windows-local resolution,
runtime acquisition/repair cannot dispatch including missing/stale/legacy failure paths;
retained local behavior tested with fixtures; source/generated paired, preservation
evidence and rollback. Если закончен только bounded refusal подэтап — точно укажи
что остаётся, не объявляй full step-9 install acceptance. Обнови STATE/TASKS/WORKLOG/
DECISIONS/affected contracts/DEV-ENVIRONMENT/NEXT-SESSION и остановись. Не заявляй
full memory/Chroma/Bedrock/OS no-egress/release acceptance.
~~~
