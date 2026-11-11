# Next session — verify cleanup before merge

The three cleanup source slices are implemented. Empty-tree follow-up removed
116 unnecessary directories. Do not repeat deletion or resume the main roadmap.
The next task is to establish whether retained local functionality and its checks
are ready to merge into `feat/cmem-light-local`.

```text
Подготовь существующую ветку codex/repository-cleanup-plan к решению о merge
в feat/cmem-light-local. Сначала прочитай AGENTS.md и установленный им стартовый
контекст, затем docs/enterprise-local/cleanup/RESULTS.md (включая Tree follow-up),
текущий STATE/TASKS, WINDOWS-LOCAL-SETUP.md и текущую cleanup-квитанцию.
Проверь свежие HEAD/status и ancestry; сохрани чужой WIP. Один координатор,
без агентов, новых веток/worktrees и push. Merge пока не выполняй.

Цель: понятный ответ, какие оставшиеся локальные возможности реально проверены,
какие сбои вызвала очистка, что было сломано раньше и можно ли сливать ветку.
Не ограничивайся заменой пяти строк в тестах и не объявляй весь проект исправным
на основании focused PASS.

1. Закрой пять известных ошибочных ожиданий в
   tests/cli/adapters/claude-code-session-start.test.ts и
   tests/shared/host-hook-limits.test.ts. Четыре проверки ищут старый автозапуск
   командой 'claude-mem start' и буквальную команду context; пятая по старой
   строке не находит timeout. Сопоставь их с принятым локальным режимом:
   foreground worker запускается отдельно, установщик привязывает hooks к
   конкретным executable/stage paths. Общие канонические templates не являются
   готовой установкой. Проверь правильные события/контекст/таймауты и отказ при
   остановленном worker. Не активируй общий шаблон и не ослабляй поведенческие
   проверки ради зелёного результата. Используй существующий bound-host fixture
   tests/enterprise-local/claude-windows-stage.test.mjs и codex-local.mjs.

2. Прочитай scripts/test-lanes.ts и команды выбранных тестов. Составь перечень
   оставшейся локальной функциональности: Claude/Codex adapters/hooks/MCP,
   provider profiles/auth selection, SQLite/FTS/capture/recovery/backup,
   Chroma persistence/search, project/worktree/sharing/filtering и viewer/My Work.
   Найди тесты/manifest/resource checks, всё ещё требующие удалённые hosts,
   workflows или standalone outputs. Убирай только проверки намеренно удалённой
   функции; общие тесты сохраняй. Запусти применимые локальные наборы после
   проверки их изоляции и команд, включая оба typecheck и guarded compile при
   изменении source/build inputs. Старый upstream whole-suite/CI/deploy не
   запускай вслепую. Для каждого непроверенного набора укажи причину и риск.

3. Уточни отдельную ошибку GET /api/auth/get-session нашего loopback worker.
   Это Better Auth локального HTTP API, не ChatGPT/Codex login и не AWS SSO.
   В synthetic log run-46f6b0d2 ошибка Database schema mismatch: отсутствуют
   user/session/account/verification/apikey/organization/team/teamMember/member/
   invitation. Установи, нужен ли этот endpoint выбранному локальному сценарию,
   где возникает несовместимость и существовала ли она до cleanup. Воспроизводи
   только на одноразовой БД. Если безопасное исправление нужно для сохранённого
   локального сценария — реализуй и проверь его; иначе зафиксируй отдельный
   дефект с конкретным влиянием и аргументом, блокирует ли он merge. Не добавляй
   CMEM signup/cloud auth и не мигрируй реальную БД ради обхода ошибки.

4. Проверь инструменты staging/verification: старые inventory/SBOM относятся к
   другим байтам, текущая cleanup-квитанция — к точным reference stages, не к
   произвольному новому пути установки. Обнови действующий локальный verifier/
   receipt flow, если он нужен для проверки текущего build; сохрани предыдущую
   evidence и не переноси старый PASS на новые bytes. Не требуется промышленный
   distributable/SBOM/полная provenance-перестройка. Если менялись runtime bytes,
   повтори один inspected copied-build fixture с fake loopback LLM, capture/
   search/recovery, viewer/My Work, prepared real Chroma и restart.

Старые server/storage/cloud исходники и pg/BullMQ/ioredis/embedding зависимости
оставлены сознательно: часть связана с общими модулями/тестами. Сам standalone
build/launch удалён. Не превращай проверку merge в массовый refactor оставшегося
кода. Наличие этих файлов само по себе не означает, что worker посылает данные
в облако; нужные границы доказывай проверками и ссылками на source.

Используй имеющиеся Node 22.23.4/npm 10.9.9/Bun 1.4.4. Только reviewed bounded
локальные проверки, fresh task-owned scratch, deadlines и cleanup детей. Без
admin/UAC, реальных установок/настроек/памяти/credentials, регистрации, AWS,
live inference, CI, build-and-sync и слепого install/update. Модели/venv/
wheelhouse/node_modules/ignored dist и locks не очищай. Удалённые пустые папки
Git не хранит: повторная чистка не нужна, если их не воссоздала новая команда.

В конце создай/обнови cleanup/MERGE-READINESS.md: таблица поведения и реально
запущенных тестов PASS/FAIL/NOT RUN, происхождение каждого сбоя, влияние auth500,
актуальность artifact verification, конкретные blockers/неблокирующие deferrals
и однозначная рекомендация merge/не merge в feat/cmem-light-local. Для каждого
остатка объясни человеческими словами: что сломано, как влияет, что делать.
Обнови STATE/TASKS/WORKLOG/DECISIONS/NEXT-SESSION, создай concern-коммиты с paired
outputs при необходимости. Не делай merge/push автоматически.
```
