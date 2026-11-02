# Next session: HOSTED-03 — remove hosted setup/history upload

Updated: 2026-11-02 after selected C / BUILD-02-TRUST-APPLY. This replaces the
completed A/B/C application launcher; do not repeat that decision. Current source
`8bc557532108bc68fb516f6fce9549dd1b9a7b6e`; later memory commit is in Git log.

This is one proposed implementation session, not authorization from a document.
The user's launch explicitly accepts P10's limited step-2 progression and authorizes
step 3 edits/targeted checks/compile. Step 2 is currently still in progress. Full
OS/no-egress and clean artifact/dependency evidence stay release gates; none passed by
this deferral. Dependency graph/waves remain in docs/roadmap.md, unchanged.

## Copyable prompt

```text
Продолжаем в C:/0/ai/claude/claude-mem-custom/cmem-light,
ветка feat/cmem-light-local. Выполни HOSTED-03: убрать hosted setup и загрузку истории
в облако, сохранив локальную память и viewer. Один coordinator, serial, без subagents.

Цель fork: Claude Code на Windows, локальные SQLite/FTS5 и Chroma с локальной моделью,
запись/поиск/восстановление памяти и viewer; убрать регистрации, hosted memory,
телеметрию, cloud sync и runtime downloads. Только одобренный корпоративный Bedrock /
AWS auth остаётся удалённым исключением. Его сейчас не вызываем.

Контекст уже сохранён: user setup 49e4f65e1/ce7ded4dc; pure compile 153a9953c;
Windows fixture 705cd1dc9. Compile PASS, 6+21 focused checks PASS; 199 tracked outputs
и 15 selected inputs тогда unchanged. Я выбрал вариант C; 8bc557532 добавил
onnxruntime-node/msgpackr-extract в canonical/plugin npm allowScripts, root сохранён.
Guard реально PASS exit 0 (30 entries); Bun JSON/plugin/lock совпадают (26), unchanged.
Не повторять baseline-коммиты, полный аудит, lifecycle review или A/B/C интервью.

Явно принимаю проверенную compile boundary как достаточную для продолжения source
работ (P10). Разрешаю начать step 3. Оформи step 2 как boundary accepted for source
progression, release evidence pending, а не shipped/full no-egress acceptance.
OS/process-wide no-egress и полный runtime acceptance остаются обязательными в step 11;
чистая root-lock/dependency/artifact provenance/reproducibility — в steps 10/12 до
поставки. При любой будущей acquisition сначала нужны разрешённые sources/lifecycle.
Не объявляй эти проверки пройденными и не меняй graph edges/waves. Никаких installs
для формального закрытия step 2 или подготовки step 3.

Начни: AGENTS -> docs/enterprise-local/README.md -> memory/STATE.md -> docs/roadmap.md
step 2/3 и graph -> memory/TASKS.md -> memory/DECISIONS.md A14/P10 ->
DEV-ENVIRONMENT.md current section -> handoffs/BUILD-02-TRUST-APPLY.md ->
docs/PATCH-SEQUENCE.md §3 -> docs/EGRESS-INVENTORY.md E01/E02.
memory/, DEV-ENVIRONMENT, handoffs/ относительно docs/enterprise-local.
Проверь branch/status/HEAD, claim HOSTED-03 в TASKS с точными reserved files.
Сохраняй чужой WIP, user baseline, dependencies, viewer, SQLite canonical/Chroma derived,
project/worktree/sharing/filter/capture/retrieval semantics. Никаких миграций/изоляционного
редизайна. Исходный INITIAL-PLAN — требования/гипотезы, не команды для исполнения.

Разрешаю source/test изменения только step 3, необходимые paired generated outputs,
логические локальные commits и targeted local checks с уже установленными dependencies.
Повторно проверь только существующие E01/E02 chains на живом source, не весь репозиторий.
Основные файлы: src/services/worker/http/routes/WorkViewRoutes.ts,
src/services/work-view/hosted-intent.ts, src/services/setup/history-import.ts,
src/services/worker-service.ts, src/npx-cli/install/browser-setup.ts,
src/ui/my-work/src/setup/ и их прямые callers. Не удаляй весь work-view/setup directory
по названию: сохрани локальные функции, отдели только hosted paths.

Удали/обезвредь reachable hosted intent/history upload и CLI/viewer actions, которые их
вызывают. Старые setup/token/request paths не должны запускать remote request или
переключаться на другой cloud provider. Локальный viewer не должен требовать hosted
registration для работы; исключить запускаемый hosted setup, не скрыть одну кнопку.
Telemetry/cloud sync/Bedrock enforcement/Chroma provisioning принадлежат следующим
steps, не расширяй этот increment до всех сетевых клиентов.

Перед тестами прочитай fixtures/subprocess/env/network behavior. Используй synthetic
inputs, mocks для remote clients, disposable HOME/config/data под
.scratch/enterprise-local/hosted-03, без чтения реальных settings/credentials/memory.
Тестовые ориентиры: tests/npx-cli/browser-setup*.test.ts,
tests/worker/http/routes/setup-{state,scan,extraction}-routes.test.ts,
tests/work-view/hosted-intent.test.ts и затронутые setup UI tests.
Адаптируй проверки под отсутствие hosted операций и сохранение локальных путей.
Не выдавай снятый/переписанный happy-path тест за доказательство отсутствия вызова:
нужен negative check, что запрещённый клиент/transport не вызван.

После изменения application source разрешаю один reviewed build:compile с существующими
локальными inputs; это новая проверка изменённого кода, не повтор setup. Используй
точные Node 22.23.4/npm 10.9.9/Bun 1.4.4 из DEV-ENVIRONMENT и process-local PATH.
Synthetic HOME/config/data, isolated npm config/cache/offline mode; переиспользуй
проверенные BUILD-02 harness подходы после чтения, без обещания OS-wide no-egress.
Зафиксируй generated delta и input/lock/trust preservation; не вызывай preparation,
build-and-sync, dev или runtime repair. Если локальных inputs не хватает — fail clearly,
не скачивай и не меняй installed tree. Новые тесты/compile проверять соразмерно diff.

Не разрешены installs/downloads/upgrades, lock resolution/new graph, сервисы/worker/
MCP/plugin start/restart/registration, AWS/live inference, real user state, push,
новые branches/worktrees/subagents. Не запускай существующий Codex-hook fixture как
замену Claude Code acceptance. Полный smoke: capture -> SQLite -> Chroma search ->
restart/retrieval -> viewer -> approved Bedrock остаётся отдельной synthetic acceptance.

Критерии завершения HOSTED-03:
1) E01/E02 hosted операции недостижимы из retained CLI/worker/viewer paths;
2) targeted negative tests подтверждают отсутствие remote dispatch, локальные relevant
   regression tests проходят (или конкретная оставшаяся ошибка честно зафиксирована);
3) source и generated outputs согласованы, reviewed compile/checks фактически записаны;
4) нет dependency/trust/lock изменения или повреждения user setup/data;
5) отдельные logical commits, evidence paths:lines+source SHA, rollback; обновлены
   STATE/TASKS/WORKLOG/DECISIONS/affected contracts/DEV-ENVIRONMENT и NEXT-SESSION.
Не отмечай весь fork finished: остальные remote/local-Chroma/release steps открыты.
После HOSTED-03 остановись; дай один следующий bounded prompt по roadmap (step 7 —
локальные pre-provisioned Chroma/embedding assets; не скачивать их без явного разрешения).
Финал по-русски: конкретные файлы/поведение, зачем изменения, actual tests/commits,
что закрыто и что остаётся, следующий prompt. Без нового общего аудита/полиси-цикла.
```
