# Launch prompt — implement the local cleanup

Скопируй текст ниже в следующую сессию этого проекта.

```text
Выполни согласованную очистку cmem-light за одну рабочую сессию, начиная с
крупных и легко отделяемых частей. Это запуск реализации, а не новый аудит
или запрос повторного подтверждения. Основной roadmap не продолжай.

Рабочая ветка уже существует: codex/repository-cleanup-plan. Проверь HEAD,
branch/status и владельцев в TASKS. Не создавай другую ветку, worktree или
субагентов, не делай push. Сохрани чужой WIP; не делай reset/clean.

Прочитай AGENTS.md и установленный им стартовый контекст, затем:
1. docs/enterprise-local/cleanup/README.md — актуальный финальный план.
2. docs/enterprise-local/cleanup/removal-targets.tsv — точные кандидаты и gates.
3. docs/enterprise-local/cleanup/EVIDENCE.md — только относящиеся к срезу связи.
Не перечитывай всю историю и не создавай новую систему планирования. Старые
метки P-CI/P-DOCS в inventory.tsv — исторический снимок; актуальный план
разрешает удаление CI/CD и восьми PDF. Код изучен на a9364604d, первый план
зафиксирован в 683bd9062; свежий Git HEAD проверяй отдельно.

В этой сессии разрешены необходимые изменения исходников/генераторов,
удаления в согласованных категориях, локальные коммиты и проверенная
ограниченная проверка на синтетических данных. Не спрашивай снова,
можно ли удалить уже согласованные CI/CD, PDF и лишние хосты. Если кандидат
требует большой переделки, оставь его и зафиксируй причину, продолжая
независимую простую работу. Не выдавай частичную очистку за полную.

Выполни три среза из README:

1. Удали восемь PDF-презентаций (117.31 MiB), все десять GitHub workflows,
   funding/issue templates, отделённые Docker/Compose, public installer,
   Vercel/publish/release/translation helpers. Сохрани локальные тесты,
   typecheck, guarded compile, viewer preparation, Windows private setup,
   Chroma preparation и полезную .github/copilot-instructions.md.
   Markdown-исходники презентаций и важные записи разработки остаются.

2. Оставь хосты Codex CLI и Claude Code CLI. Отдели и удали Cursor, Grok Bot,
   Qoder, OpenClaw, OMP, Hermes, ODS, Pi, DSH, Ragtime, Cowork и другие
   нецелевые хосты. Сначала исправь обязательные manifest/build inputs,
   preflights, registry/dispatch и worker callers; затем удаляй точные файлы.
   Сохрани общие parser/identity/compatibility-функции, все выбранные
   поддерживаемые LLM-провайдеры и авторизацию, в том числе Bedrock/AWS SSO.

   Название продукта в UI, display metadata и private catalog: cmem-light.
   Убери персональные author/developerName/URL и рекламные/социальные ссылки
   upstream из пользовательских поверхностей там, где позволяет схема.
   При обязательном поле используй честное нейтральное обозначение local fork.
   Измени источник генерации, а не только сгенерированный JSON.
   Для экономии сохрани технические claude-mem IDs, пути, env keys, команды,
   поля БД/протокола и private plugin identity, если переименование требует
   миграции. Не изобретай URL или авторство всего заимствованного кода.

   Исключение финального плана: сохрани core LICENSE/NOTICE и действующие
   copyright/provenance/font notices для остающегося кода; не показывай их
   как рекламу в UI. Лицензии и дублированные документы полностью удаляемых
   интеграций могут уйти вместе с их кодом, после удаления build preflight.
   Это не массовая замена авторских заголовков и не переписывание истории.

3. Удали отделённые cloud sync service projects и standalone deployment:
   его build output/target, Postgres/BullMQ launch, CLI delegation и
   исключительно серверные модули/зависимости, если они отделяются просто.
   Если полное удаление исходников требует большой перестройки общего
   worker/API/storage, безопасно убери standalone build/launch, оставь
   связанные исходники/зависимости и перечисли остаток в RESULTS.md.
   Не удаляй src/server/ или src/services/sync/ целиком. Локальные auth/API,
   SQLite/FTS5/Chroma и общий HTTP/viewer server должны работать.
   Не скрывай существующий отдельный local-auth HTTP 500; его исправление
   не входит в задачу. Удаляй зависимости только после последнего потребителя;
   parser/SDK/UI и Python Chroma grpcio нельзя вычёркивать по названию.

Сохрани docs/enterprise-local целиком, ADR, исходный roadmap и историю
решений/проверок, полезные технические Markdown и AI-agent guidance, modes/
skills, viewer/My Work, capture/search/recovery/backup, старые данные/schema,
project/worktree/sharing/filtering semantics. Не меняй реальную установку,
настройки, логины, базы памяти, модели или каталог другого пользователя.
Не очищай node_modules, .scratch, .git, venv, wheelhouse, ignored dist/locks.

Проверки и экономия:
- Используй имеющиеся Node 22.23.4, npm 10.9.9, Bun 1.4.4. Не устанавливай
  индексы/AI-сервисы и не обновляй toolchain. Если обязательного входа нет,
  сначала проверь команду/setup; ставь только необходимое для локальной проверки.
- До удаления сформируй точные пути и проверь retained runtime/build/resource/
  test consumers. TSV — не скрипт массового удаления. На Windows проверь
  абсолютные цели рекурсивного удаления и используй один PowerShell с LiteralPath.
- На каждый завершённый source slice: относящиеся focused tests, оба
  typecheck и один guarded build:compile. Не запускай целый upstream suite,
  build-and-sync, deployment, release или старые install/restart scripts.
- Проверь, что compile не восстановил удалённые targets/старый branding,
  review emitted changes и input guards. Исходники и outputs коммить вместе.
- В конце переиспользуй проверенный ограниченный copied-build fixture:
  start/health/stop worker; прямые Claude/Codex hooks и MCP; синтетические
  SQLite/FTS capture/recovery; viewer/My Work; prepared real local Chroma
  search/restart с loopback fake LLM. Сначала прочитай выбранные fixture/env/
  subprocess команды. Свежая task-owned scratch, deadlines и cleanup детей.
- Без admin/UAC, machine PATH/registry/services, CI, push, AWS, регистрации,
  live inference и чтения реальных данных/credentials. Sandbox escalation
  не означает Windows elevation. Не запускай повторно каждую историческую
  проверку; используй один итоговый runtime fixture, где это возможно.
- Не удаляй проверки общего поведения ради зелёного результата. Тесты только
  намеренно удалённой функции могут уйти вместе с ней. Новые тесты добавляй
  лишь для содержательного изменённого поведения, не для каждого удалённого файла.

Цель — три логичных concern-коммита, не по коммиту на каталог. В конце
создай docs/enterprise-local/cleanup/RESULTS.md: фактические удаления/байты,
проверки с честными PASS/FAIL/NOT RUN и отложенные связанные файлы. Обнови
STATE/TASKS/WORKLOG/DECISIONS/NEXT-SESSION по необходимости. Если изменились
артефакты, сохрани старую evidence и создай/обнови корректный current receipt;
не приписывай новым байтам старый runtime PASS. Заверши максимально полезную
безопасную очистку в этой сессии, даже если глубокий refactor отложен.
```
