# Next session: CHROMA-07 — pre-provisioned local vector assets

Updated: 2026-11-02 after HOSTED-03. Replaces the completed hosted-removal launcher.
Source/tests `417483949`, paired generated `298d44742`; current memory commit follows
in Git log. Evidence: [handoffs/HOSTED-03.md](handoffs/HOSTED-03.md), A15/A16 and WORKLOG.
Do not repeat the completed hosted-removal launch or baseline/trust decisions.

This is **one proposed task**, not authorization from a document. HOSTED-03 stopped
after step 3. No source/provisioning/download/runtime work for step 7 has begun.
The dependency graph/waves remain solely in docs/roadmap.md, unchanged.

## Copyable prompt

```text
Продолжаем в C:/0/ai/claude/claude-mem-custom/cmem-light,
ветка feat/cmem-light-local. Выполни CHROMA-07, roadmap step 7: подключение только
локальных заранее provisioned Python/Chroma/embedding assets. Один coordinator,
serial, без subagents/новых branches/worktrees.

HOSTED-03 завершён в границе E01/E02: source/tests 417483949, generated 298d44742;
58 targeted tests PASS, один compile PASS, 16 inputs unchanged. Не повторяй baseline,
trust interview, полный аудит или hosted implementation. A15/P10 принят: step 2 —
boundary accepted for source progression, release evidence pending. OS/process-wide
no-egress и full runtime acceptance остаются step 11; root-lock/dependency/artifact
provenance/reproducibility — 10/12. Не объявляй их пройденными, не меняй graph/waves.

Начни AGENTS -> docs/enterprise-local/README.md -> memory/STATE.md -> docs/roadmap.md
step 7/graph -> memory/TASKS.md -> DECISIONS A06/A07/A09/A14/A15/A16 -> DEV-ENVIRONMENT
current section -> handoffs/HOSTED-03.md limits -> docs/PATCH-SEQUENCE.md §7 ->
docs/EGRESS-INVENTORY.md E08–E11 и их соответствующие AUDIT-CLOSURE notes.
Проверь branch/status/HEAD, claim CHROMA-07 с точными reserved files до edits.

Разрешаю source/test изменения только step 7 и необходимые paired generated outputs,
логические local commits, targeted local checks с уже установленными dev dependencies.
Основной scope: src/services/sync/ChromaMcpManager.ts, ChromaSync.ts, нужные settings
и прямые callers/tests. Shared worker/settings integration — только один coordinator.
Не удаляй весь sync directory: local ChromaSync остаётся, cloud sync — отдельный step 5.

Замени runtime uvx/package resolution на явно заданный absolute pre-provisioned
executable. Remote Chroma/embedding providers не должны использоваться, в том числе
из legacy config; cold/missing/corrupt assets должны завершаться понятным локальным
отказом без auto-install/download/repair/fallback. Enforce подтверждённый локальный
embedding/model и поддерживаемое отключение Python Chroma telemetry на основе реального
artifact/API evidence. Не выдумывай Python API/model hashes/совместимость.

Используй только repo evidence и явно предоставленные approved artifact paths/contracts.
Наличие установленного Python/cache/model само по себе не разрешает читать/исполнять
его или реальные settings/data. Если approved artifacts/interface отсутствуют, продвинь
независимую source/fixture работу, запиши конкретные unknowns и нужные входы; не скачивай.
Любая acquisition отдельно требует явного разрешения sources/lifecycle. D11 о degraded
SQLite-only режиме остаётся открытым: не вводи его молча; не меняй capture/retrieval
семантику и SQLite canonical/Chroma derived contract.

Перед тестами прочитай fixtures/subprocess/env/network behavior. Используй mocks для
Python/subprocess/remote clients и synthetic HOME/config/data под
.scratch/enterprise-local/chroma-07. Нужны negative checks: нет package manager,
downloader, remote transport или provider fallback даже на ошибках/cold-cache.
Сохрани local SQLite/viewer/project/worktree/sharing/filter/capture/retrieval behavior.
Реальный Python/Chroma/model process, services и full smoke сейчас не разрешены.

После application source изменений разрешаю один reviewed build:compile с точными
Node 22.23.4/npm 10.9.9/Bun 1.4.4, existing local inputs, process-local PATH, synthetic
HOME/config/data, isolated npm config/cache/offline mode и проверенным BUILD-02 harness.
Если inputs не хватает — fail clearly; никаких installs или изменения installed tree.
Зафиксируй generated delta и сохранность dependencies/trust/locks. Не обещай OS-wide
no-egress от Node tripwires. Не запускай preparation/build-and-sync/dev/runtime repair.

Не разрешены downloads/installs/upgrades, lock resolution/new dependency graph,
service/worker/MCP/plugin start/restart/registration, AWS/live inference, real user
state/credentials/memory, push, новые branches/worktrees/subagents. Telemetry Node,
cloud sync, Bedrock enforcement и Windows plugin packaging — другие increments.

Completion: step-7 source не может запускать acquisition/remote mode; verified local
asset contract либо честный explicit unknown; targeted negative/local regression checks
фактически записаны, source/generated paired, inputs preserved, logical commits и rollback.
Обнови STATE/TASKS/WORKLOG/DECISIONS/affected contracts/DEV-ENVIRONMENT/NEXT-SESSION.
Не объявляй full Chroma/Claude Code/Bedrock acceptance без отдельного разрешённого smoke.
После bounded step 7 остановись и дай один следующий prompt по roadmap.
```
