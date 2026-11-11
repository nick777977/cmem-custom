# Next cleanup task — align retained hook tests

The approved three-slice cleanup is implemented. Do not repeat deletion,
inventory analysis or the original launch. See [RESULTS](RESULTS.md) for exact
removals, current receipts, validation and intentionally retained source.

```text
На существующей ветке codex/repository-cleanup-plan проверь свежие HEAD/status
и TASKS. Один координатор, без агентов/веток/worktrees/push. Прочитай AGENTS,
README/STATE, cleanup/RESULTS.md и текущую cleanup-квитанцию. Основной roadmap
и проверку реального Claude/Bedrock не продолжай.

Одна задача: согласуй пять старых проверок формата hooks с текущим контрактом
канонических unbound templates и private-bound Claude/Codex stages.
Файлы: tests/cli/adapters/claude-code-session-start.test.ts и
 tests/shared/host-hook-limits.test.ts. Переиспользуй
 tests/enterprise-local/claude-windows-stage.test.mjs,
 scripts/enterprise-local/codex-local.mjs и src/build/hook-shell-template.ts.
Сохрани проверку matcher/timeout/семантики запуска и инъекции контекста;
не удаляй общие assertions и не превращай их в проверки буквального кода.
Не активируй канонические unbound hooks ради старого ожидания.

Ранее четыре assertions ожидали 'claude-mem start/context' в заведомо unbound
hooks, ещё один не находил timeout по старой команде. Оба канонических hook
файла не менялись во время cleanup. Прямые bound hooks/MCP и recovery прошли.

Разрешены ограниченные изменения focused tests и их synthetic fixtures,
локальные проверки и concern-коммит. Используй существующие Node 22.23.4,
npm 10.9.9 и Bun 1.4.4; никакого whole suite/build-and-sync, install, admin/UAC,
регистрации, AWS, live inference или реальных данных/настроек/логинов.
Сначала изучи команды выбранных fixtures, задай свежую task-owned scratch,
сроки и cleanup детей. Не меняй product source без найденной причины.
Если потребуются новые application bytes, нужны guarded compile/typechecks
и свежая квитанция; старый runtime PASS на них не переносится.

Готово: все пять содержательных проверок проходят вместе с сохранёнными
canonical-template и bound-host тестами; обновлены RESULTS/STATE/TASKS/WORKLOG
и один конкретный следующий шаг. Deferred server/storage/cloud refactor и
local-auth HTTP 500 остаются вне этой задачи.
```

The destination-bound cleanup receipt covers the tested reference stage only.
Older inventory/SBOM verifiers must be refreshed before a new target transfer;
this follow-up does not authorize real Claude CLI or AWS execution.
