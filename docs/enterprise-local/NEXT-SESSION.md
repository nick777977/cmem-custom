# Next session: compile boundary and development prerequisites

Prepared: 2026-10-30, after audit commit `f9f2b2efe`.
This is a proposed future authorization for the user to copy, not permission to
implement or install anything in the current documentation session.

## Scope and dependency clarification

The user reports that they have not installed this fork's dependencies. The previously
observed node_modules directory is still of unknown origin/completeness; its presence
is not a successful setup. No package/tool version, build or test baseline is verified.

Recommended next increment: implement the defined pure-compile boundary, inventory
development prerequisites and produce a concrete dependency-preparation contract.
These belong together in step 2. Keep source changes, dependency input changes and
generated outputs in separate logical commits where applicable. Do not combine this
with hosted/telemetry/cloud/provider removals.

Installation/build/targeted checks can follow in the same session if the user supplies
the additional authorization below and the prerequisites are satisfied. Otherwise
finish the source patch and preparation report; leave execution pending with one exact
next action. Missing package policy is not a reason to redo the static audit.

Development acquisition is separate from runtime networking. Building on a controlled
development machine may require approved package downloads; the final plugin must not
download dependencies/models or contact unapproved services at runtime. Installing
the upstream plugin or launching the current worker to check setup is unnecessary
and can activate the external paths already inventoried.

## Suggested model and session size

Use **GPT-6.1 Sol / Medium** for this defined build increment and routine implementation.
Use High selectively for Bedrock/env/fallback enforcement, Windows process boundaries,
offline model integration or difficult regressions. This is an engineering recommendation,
not a model quality guarantee. Start serially, without subagents.

Official OpenAI documentation lists a default **500,000-token** context for GPT-6.1 Sol
in Codex/ChatGPT Work, and describes Medium as balancing speed/depth. Actual availability
and client configuration can differ; API maximum context is not the amount of free
space in a desktop chat. Sources checked on 2026-10-30:
[Models](https://learn.chatgpt.com/docs/models),
[Model selection](https://learn.chatgpt.com/docs/model-selection).

Do not fill that window deliberately. One subsystem with its preparation, focused
validation and handoff fits the intended workflow. Prefer a fresh session after an
accepted increment or a precise environment blocker. STATE is the current handoff,
WORKLOG is history, DECISIONS owns decisions, roadmap owns dependencies. Later sessions
read the current slice and relevant E/U IDs, not the whole document history.

## Copyable main prompt — source patch and preparation contract

```text
Продолжаем в C:/0/ai/claude/claude-mem-custom/cmem-light,
на ветке feat/cmem-light-local. Выполни следующий законченный increment:
Session 02 / roadmap step 2 — pure compile и подготовка dev-окружения.

Контекст:
- Session 01 завершена: bounded static audit complete, commit f9f2b2efe.
  Полный dependency/runtime audit, билд и тесты ещё не выполнены.
- Я не устанавливал зависимости этого fork. Найденный ранее node_modules
  не считай подготовленным или доверенным окружением.
- Конечная цель: сохранить local viewer, SQLite/FTS5, локальный Chroma и текущую
  capture/retrieval/project/worktree логику; убрать неразрешённые внешние соединения
  и runtime downloads; сохранить approved Bedrock/auth exception.

Разрешаю в ЭТОЙ новой сессии менять source/build scripts только для step 2,
связанные документы и необходимые целевые проверки как код, делать локальные
логические коммиты. Разрешаю обычный read-only preflight установленных Node/npm/Bun
через разрешение пути и --version, без выполнения кода проекта/зависимостей.
Установка/загрузка пакетов, выполнение сборки/тестов и запуск приложения пока
не разрешены, если я отдельно не добавил блок разрешения ниже.

1. Прочитай AGENTS.md -> docs/enterprise-local/README.md -> memory/STATE.md
   -> docs/roadmap.md (step 2, зависимости и gates). Затем принятые DECISIONS,
   PATCH-SEQUENCE §2 и AUDIT-CLOSURE: первый patch contract, E15 и U2–U4.
   Пути memory относительны docs/enterprise-local. Проверь branch/status/HEAD
   и source drift. Сохрани чужие изменения. Не перечитывай initial plan,
   весь WORKLOG, все bundles или полный аудит; новые чтения только по текущему diff.

2. Реализуй первый минимальный патч из AUDIT-CLOSURE:
   - package.json: явный build:compile; build вызывает его; lock resolution
     и viewer dependency preparation — отдельные явно вызываемые команды;
   - scripts/build-viewer.js: убрать встроенный npm ci, сохранить локальную
     TypeScript/Vite сборку, cwd/Windows invocation/error propagation;
     отсутствующие локальные compiler inputs дают понятную ошибку без установки;
   - сохранить существующие generators/verifiers/outputs, local viewer,
     integrity/attribution checks. Не включать sync/restart/runtime binary
     compile/repair/registration в compile. Не удалять другие подсистемы.
   Повторно проверь цепочку subprocesses, включая viewer child.

3. Подготовь короткий docs/enterprise-local/DEV-ENVIRONMENT.md:
   - фактически обнаруженные пути/версии Node/npm/Bun либо missing/UNKNOWN;
   - отдельные root и My Work dependency roots, plugin runtime отдельно;
   - какие manifests/locks нужны, почему untracked root lock пока не даёт
     воспроизводимости, как предлагаешь фиксировать разрешённые inputs;
   - конкретные будущие команды, cwd, затрагиваемые директории, пакетные
     источники и lifecycle/native scripts, которые требуют разрешения;
   - какой минимум нужен для compile и выбранных тестов. Не устанавливать
     Python/Chroma/ONNX/модели и весь plugin runtime ради первого build-патча;
     если текущая широкая сборка требует дополнительные build inputs, перечисли
     их честно, не начинай packaging redesign или массовые upgrades;
   - варианты проверки missing-dependency failure, generators и viewer outputs;
     ожидаемые проблемы среды отделить от регрессии текущего патча.
   Старый node_modules не удалять/не переименовывать/не использовать молча.
   Предложи проверяемое чистое окружение, сохраняющее исходное дерево и user data.

4. Если дополнительного разрешения/источника пакетов нет: выполни всё независимое
   по пунктам 1–3, source review и локальные коммиты. Подготовь один компактный
   запрос на разрешение с точными командами/источниками/lifecycles/местом установки.
   Не выполняй установку, build или test. Зафиксируй validation pending.
   Если разрешение есть — следуй дополнительному блоку и продолжи в этой сессии
   лишь подготовку/сборку/целевые проверки текущего increment.

5. Обнови STATE/WORKLOG/PATCH-SEQUENCE §2: исходный и новый source SHA, изменения,
   решения, commits, checks actually run / pass / fail / pending, причины и rollback.
   DEV-ENVIRONMENT хранит воспроизводимые команды и фактический baseline.
   Статусы roadmap менять только по реальному прогрессу; dependency graph — только
   при реальном изменении зависимостей. Не писать accepted/shipped при pending gates.
   Source citations перепроверить только для изменённых путей.

Границы:
Не запускать upstream build/build-and-sync/dev до отделения и проверки compile.
Не запускать worker/MCP/plugin/сервер, не регистрировать plugin, не менять PATH/
registry/старую установку. Не читать реальные memories/credentials/user settings.
Не обращаться к AWS/Bedrock, hosted/telemetry/cloud/API; не запускать installers
через npx или автоматический repair. Никаких push, migration или обновления upstream.
Никаких subagents/новых веток/перехода к step 3 без моего отдельного запроса.

Готовность: минимальный source-патч завершён; compile не вызывает acquisition/
sync/restart; dev preparation конкретна; разрешённые проверки выполнены либо
точные ограничения записаны. Финал: что изменено, доказательства/ограничения,
commits и один следующий минимальный шаг. Затем остановись.
```

## Optional additional authorization — fill sources before pasting

Append this only when the allowed package sources and lifecycle scope are known.
It supersedes the main prompt's no-install/build/test boundary only for this increment.
Unfilled placeholders are not approval. No such execution is authorized now.

```text
Дополнительно для этой Session 02 разрешаю подготовку dev-зависимостей, выполнение
исправленного compile и целевых проверок. Это заменяет запрет install/build/test
в основном промпте только в пределах следующих условий:

- Разрешённые источники пакетов/артефактов: <указать registry/mirror и при
  необходимости отдельно binary sources>. Другие адреса не разрешены.
- Место установки: отдельное чистое dev-окружение внутри
  .scratch/enterprise-local/, с проверенными абсолютными путями и воспроизводимой
  копией нужных source inputs. Исходный неизвестный node_modules и установленный
  plugin не трогать. Рабочие source изменения/коммиты остаются на текущей ветке.
- Сначала установи зависимости с lifecycle scripts отключёнными. До установки
  проверь ограничения package manager по scripts/optional dependencies и источник
  каждого необходимого download; не обходи этот режим автоматически.
- Lifecycle/native execution разрешаю только после проверки точного package/script
  и только для: <явный список или «ничего»>. Если compiler/native tool нельзя
  подготовить без дополнительного источника/script, зафиксируй точный запрос;
  не ослабляй политику ради зелёной сборки и не переустанавливай toolchain глобально.
- Фиксируй manifests/locks/версии и хеши реально использованных inputs;
  изменения input pins/lock strategy коммить отдельно от pure-compile source-патча.
- После подготовки проверь npm run build:compile и релевантные проверки, прочитав
  их scripts/fixtures. Укажи точные commands/cwd/results. Обычный npm test и
  интеграционный запуск не разрешены этим блоком автоматически.
- Compile и тесты должны быть без внешних обращений. Используй доступное
  подтверждённое сетевое ограничение; если его нет, явно запиши предел доказательств
  и согласуй способ перед выполнением потенциально сетевого процесса. Не меняй
  системную firewall/корпоративную network policy. Отсутствие замеченного запроса
  само по себе не доказывает offline/no-egress.
- Только synthetic fixtures и disposable paths. Нельзя запускать текущий worker,
  SDK inference или реальный Chroma download как smoke test. Изолированный локальный
  fixture server допустим только если заранее просмотренный выбранный тест этого
  требует и не запускает приложение/внешние clients.
- Исправляй только проблемы текущего build-патча. Для независимого upstream/toolchain
  сбоя — diagnosis и один следующий fix, без расширения на другие подсистемы.

Все остальные запреты основного промпта остаются в силе. При конкретном блокере
заверши разрешённую независимую часть, запиши failed/pending и handoff; не подменяй
невыполненную проверку статическим «pass».
```
