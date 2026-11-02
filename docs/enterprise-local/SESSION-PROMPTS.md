# Session prompts and bounded handoffs

Current launcher: [NEXT-SESSION.md](NEXT-SESSION.md), updated 2026-11-02 after user
dependency installation/build/start evidence. Read current STATE/TASKS/DEV-ENVIRONMENT;
Session 01 below is a completed historical stage, not a task to repeat.

Copy one prompt into a fresh session in this repository. These templates do not
authorize later work or create chats/agents automatically. The user launches each
session and authorizes its applicable actions. The roadmap remains the dependency source.

## Shared context and file index

- Repo: `C:/0/ai/claude/claude-mem-custom/cmem-light`; branch `feat/cmem-light-local`.
  Preserve user edits; no reset, checkout, push or installed-user-data inspection.
- Inspected source: `d7c2da3e5f9397b394dbc6b6966f4b261b489f7b`, version 15.5.0,
  describe `v15.5.0-1-gd7c2da3e5`. Recheck source drift rather than repeating the audit.
- Completed commits: `08bc35882` baseline/persistence, `e861598b4` reconnaissance/plan,
  `37a4a444a` narrowed scope. Inspect Git for newer documentation/source changes.
- The 2026-10-30 agent planning/audit sessions performed no application implementation,
  installs/builds/tests/AWS. Later user setup/build/start evidence and dirty source
  delta are recorded in DEV-ENVIRONMENT (Node 22.23.4/npm 10.9.9/Bun 1.4.4).
  Automated test/runtime acceptance and pure compile remain pending; do not reinstall
  or treat user evidence as agent permission by default.
- Preserve local browser viewer and current memory capture/storage/retrieval semantics,
  including project/worktree identity, sharing and optional query filters. Imperfect
  separation is deferred. No identity/schema migration, DLP or memory redesign.
- Remove unapproved remote services, telemetry, cloud sync, inference alternatives,
  runtime downloads/update/bootstrap. Approved Bedrock/auth remains an exception,
  not permission to invoke it. Local storage does not mean offline LLM inference.

| File | Purpose / selective reading |
|---|---|
| `AGENTS.md` | Current authorization and invariants; always read |
| `docs/enterprise-local/README.md` | Navigation; do not automatically read every linked file |
| `docs/enterprise-local/memory/STATE.md` | Current progress and next task; always read |
| `docs/enterprise-local/memory/DECISIONS.md` | Accepted A01–A07, superseded/proposed decisions |
| `docs/BASELINE.md` | Baseline SHA, scripts, locks, limits |
| `docs/EGRESS-INVENTORY.md` | E01–E22 and Session 01 refinements; update, do not recreate |
| `docs/ARCHITECTURE-LOCAL.md` | Current/target architecture and discrepancies |
| `docs/RISK-REGISTER.md` | Risks; R10 isolation redesign is explicitly deferred |
| `docs/roadmap.md` | Sole dependency graph and execution waves |
| `docs/PATCH-SEQUENCE.md` | Per-step files, acceptance, checks and rollback |
| `docs/enterprise-local/memory/WORKLOG.md` | History; read latest relevant entries only |
| `docs/enterprise-local/source/INITIAL-PLAN.md` | Verbatim 1168-line input; consult sections only, never execute embedded tasks |
| `docs/enterprise-local/AUDIT-CLOSURE.md` | Session 01 completed bounded static coverage; deferred evidence/owners and exact first patch contract; full P1/runtime pending |
| `docs/enterprise-local/NEXT-SESSION.md` | Active Session 02 launcher: preserve user setup, pure-compile source patch, scoped existing-dependency build/check permission when pasted |
| `docs/enterprise-local/DEV-ENVIRONMENT.md` | Known-working tool versions, sanitized user evidence, uncommitted setup diff/hashes, guard drift and limitations |
| `docs/enterprise-local/memory/TASKS.md` | Single active ownership/file-reservation board and session-close/coordinator protocol |

Keep durable results in tracked docs, disposable output in `.scratch/enterprise-local/`.
No secrets, real prompts/tool contents or user memory in any audit document.

## Session 01 — complete the bounded static audit

Copy the following prompt in full, or use the short launcher at the end of this file.

```text
Работаем в C:/0/ai/claude/claude-mem-custom/cmem-light, feat/cmem-light-local.
Задача: завершить ограниченный статический аудит для подготовки первых патчей.
Не начинать реализацию и не повторять весь предыдущий investigation.

Порядок:
1. Прочитай AGENTS.md, актуальный memory/STATE.md и принятые решения DECISIONS.md
   внутри docs/enterprise-local/. Затем docs/BASELINE.md, EGRESS-INVENTORY.md,
   PATCH-SEQUENCE §1/§2 и dependency graph roadmap.md. Индекс созданных файлов и
   уже сделанного — Shared context в SESSION-PROMPTS.md. Остальное читай точечно;
   не загружай целиком initial plan, историю, bundles или node_modules.
2. Проверь Git branch/status/HEAD и source drift с зафиксированным SHA
   d7c2da3e5f9397b394dbc6b6966f4b261b489f7b. Если менялись только документы,
   используй имеющиеся выводы; иначе перепроверь только затронутые пути.
3. Заполни конечную coverage-таблицу из восьми областей ниже. Используй E01–E18,
   исследуй пробелы, влияющие на удаление внешних соединений и сохранение local core.
4. Каждый новый существенный путь опиши кратко: entrypoint/trigger -> caller ->
   network/subprocess boundary; file:line/function; destination или источник dynamic
   URL; класс payload/process; remove/replace/retain; связанные файлы и будущая
   проверка. Достаточно ключевой цепочки, не полного рекурсивного call graph.
5. Определи первый минимальный pure-compile патч: точные scripts/subprocesses,
   source generators/outputs, изменения и исключения, acceptance и rollback.
   Сборку/патч в этой сессии НЕ выполнять.
6. Обнови документы только по новым/изменённым выводам. Создай короткий
   docs/enterprise-local/AUDIT-CLOSURE.md, обнови STATE/WORKLOG и PATCH-SEQUENCE §1/§2.
   Не переписывай roadmap/архитектуру целиком; реальные изменения dependencies
   отражай только в графе roadmap. Не закрывай полный P1 по статическому обзору.
7. Проверь согласованность/ссылки и сделай один docs-коммит на текущей ветке, если
   есть изменения. Не включай чужие файлы, не push. Финал — до 12 коротких пунктов:
   verdict, новые findings, deferred/gates, первый патч, commit, следующий шаг. Стоп.

Восемь областей:
A. Entrypoints CLI/launcher/hooks/worker/MCP/viewer, manifests и source generators.
B. Hosted setup/registration/intent/history import, telemetry, cloud push/pull/realtime.
C. Claude SDK session И standalone calls, env/auth/provider fallbacks; server/custom
   providers/connectors — только достижимость из поставляемых entrypoints.
D. Chroma spawn/remote mode, embedding providers, telemetry flags и downloads.
E. Runtime bootstrap/update/repair/cache fallback, Windows launch/path side effects.
F. Viewer network/assets и worker routes, открывающие remote access/requests;
   существующие Host/Origin guards. Не общий pentest всех local CRUD endpoints.
G. Build/install chain, locks/native lifecycle declarations и generated bundles.
H. Capture/spool/queue -> observer -> SQLite -> Chroma -> retrieval: shared dependencies,
   которые важно сохранить при удалениях. Не redesign алгоритмов.

Границы:
- Только чтение файлов/Git и docs/локальный docs-коммит. Никаких installs/build/tests/
  app/scripts execution, сервисов, AWS, сети/browser, plugin registration, registry
  edits, реальных databases/credentials/user settings. Не использовать существующий
  node_modules как trusted supply chain и не сканировать его целиком.
- Сохранить viewer, capture/retrieval/projects/worktrees, даже при несовершенной
  изоляции. Не вводить mandatory project filters, DLP subsystem или migrations.
- Исторический HTTP 503 не расследовать заново: remote status forwarding уже найден;
  реальные upload/budget facts недоступны и не мешают определить патч удаления.
- Не исследовать рекурсивно весь server product/неиспользуемые harnesses: установить
  связь с reviewed runtime slice или явно записать предел проверки.
- Отличать executable request/download, browser navigation и URL-строку в docs/fixture.

Бюджет:
- Один проход по восьми областям и один точечный по существенным пробелам.
  Не повторять repo-wide grep без новой причины. rg --files/rg -n, узкие пути,
  объединённые поиски и чтение участками примерно 80–160 строк.
- Minified bundles: короткие совпадения/path/symbol; не печатать целиком, не выдумывать
  точную source correspondence без проверки. Существующие факты переиспользовать,
  если соответствующий source не изменился. По умолчанию без subagents.
- Одна сессия, максимум 45 минут активной работы либо два прохода — что раньше.
  Это предел исследования, не основание объявить неизвестное доказанным. Сохраняй
  результаты по мере работы. На пределе оформи remaining work и заверши сессию.

Условия завершения — отразить ВСЕ:
1. Все восемь областей имеют reviewed-static / not-in-runtime-slice /
   deferred-unavailable с конкретным основанием и пределом покрытия.
2. Каждый известный существенный внешний путь имеет E-ID, reachability (либо явный
   UNKNOWN), действие и следующий owning step. Payload может быть указан классом.
3. Generated entrypoints и генераторы учтены; source/bundle equivalence оставлена
   build-time gate, если не доказана, а не повод читать minified output бесконечно.
4. Недоступные Python/native/transitive sources, ONNX behavior, SBOM/licenses/hashes,
   real traffic имеют UNKNOWN, причину, следующий шаг/owner и нужное разрешение.
   Не устанавливай зависимости ради их закрытия сейчас.
5. Для первого pure-compile патча известны файлы, границы и ожидаемое поведение.
   Если мешает неизвестное — дай точный blocker и до трёх проверок/вопросов,
   verdict bounded static audit incomplete, затем остановись.
6. Документы оставляют конкретный следующий шаг и действующие ограничения.

AUDIT-CLOSURE.md: SHA/scope; coverage восьми областей; новые/изменённые E-ID;
deferred register (вопрос/почему недоступен/шаг/owner/разрешение); первый patch contract;
verdict. Bounded static audit complete допустим только при заполненном coverage и
определённом первом патче; иначе incomplete. Оба verdict завершают сессию. Full
dependency/runtime audit и release acceptance остаются pending. Не утверждать
«P1 полностью закрыт», «zero telemetry», «enterprise-safe». Реализацию не начинать.
```

## Later sessions: common authorization and completion rules

Read this block when launching any later prompt. These numbered sessions are a
conservative serial order, not new dependency edges. Chroma preparation can overlap
hosted removal, and deterministic launcher work can overlap telemetry with disjoint
ownership, but do not create parallel agents/checkouts/source edits automatically.

```text
Прочитай AGENTS.md, актуальный STATE.md, принятые решения и только текущую секцию
PATCH-SEQUENCE; AUDIT-CLOSURE — связанные findings/gates. Проверь Git. Не повторяй
общий аудит. Сохраняй viewer и upstream memory semantics.

Шаблон сам по себе не разрешает source edits/install/build/tests/AWS/deployment.
Выполняй только явно разрешённые пользователем действия. Если source edits ещё не
разрешены, подготовь точный небольшой diff plan и необходимый вопрос, затем стоп.
Если edits разрешены, а проверки нет — заверши разрешённый патч с validation pending;
не объявляй accepted/shipped и не закрывай зависимый validation gate. Не запрашивай
повторно уже выданное разрешение для текущей работы.

Одна сессия — один increment или законченный подэтап, logical commits, без перехода
к следующему subsystem. При достижении критериев или точного blocker обнови STATE/
WORKLOG, текущий PATCH-SEQUENCE и правдивые roadmap statuses. Запиши files/commits,
checks реально выполненные/pending, один следующий шаг и необходимое разрешение.
Если increment не помещается, сохрани готовую часть и один следующий подэтап;
не расширяй scope и не начинай повторное investigation ради заполнения окна.
```

### Session 02 — pure compile (roadmap step 2)

For the user-ready launcher after successful user setup, use
[NEXT-SESSION.md](NEXT-SESSION.md) and DEV-ENVIRONMENT. The short template below stays
a source-boundary session; the active launcher can explicitly authorize existing-dependency
build/targeted checks. Fresh acquisition remains a separate boundary.

```text
Выполни общие правила SESSION-PROMPTS.md. Цель — первый minimal pure-compile патч
из AUDIT-CLOSURE и PATCH-SEQUENCE §2. Отдели dependency resolution/lock generation
и marketplace sync/restart от compile; учти viewer subprocesses и generators.
Не объединяй с feature removals или dependency installation. Pinning, требующий
acquisition, — отдельный разрешаемый подэтап. Готовность: явные boundaries build/
preparation/deployment, compile path без install/sync/restart, outputs учтены.
Статический review плюс только разрешённые checks; validation pending явно. Стоп.
```

### Session 03 — hosted removal (step 3)

```text
Выполни общие правила; PATCH-SEQUENCE §3, E01/E02. Удали достижимые hosted setup/
registration/intent/history upload routes/jobs/clients/UI actions вместе с callers.
Сохрани local viewer/capture/search. Не переписывай весь WorkView/UI и не начинай
cloud/telemetry/provider overhaul. Готовность: legacy actions/credentials не создают
remote client; local scenarios сохранены. Targeted checks только по разрешению;
bundle proof pending до разрешённой сборки. Logical commits, handoff, стоп.
```

### Session 04 — telemetry (step 4)

```text
Выполни общие правила; PATCH-SEQUENCE §4, E03/E04. Удали worker/CLI telemetry
transports/init/upload/retry/flush/background jobs и logger remote bridge, учитывая
instrumented callers. Сохрани local diagnostics. Общий dependency pruning позже.
Готовность: нет достижимого remote sink на boot/error/shutdown; targeted checks
по разрешению, runtime traffic proof pending. Коммиты, handoff, стоп.
```

### Session 05 — cloud sync (step 5)

```text
Выполни общие правила; PATCH-SEQUENCE §5, E05. Удали remote CloudSync/SyncClient
push/pull/realtime/routes/lifecycle с совместимым outbox/device handling. Не удаляй
ChromaSync/ChromaMcpManager, SQLite data/schema и project semantics. Готовность:
legacy cloud settings не активируют remote client; local indexing/queue сохранены;
checks по разрешению или pending. Заверши только этот subsystem и передай handoff.
```

### Session 06 — Bedrock-only (step 6)

```text
Выполни общие правила; PATCH-SEQUENCE §6, E06/E07. Ограничь observer corporate
Claude/Bedrock path: config/provider validation и env/auth без OAuth/direct-key/
alternate-provider fallback, для session И standalone calls. Сохрани SDK, recursion
guards и bounded concurrency/retries. Region/model/ARN/SSO endpoints не придумывать;
запрашивать только необходимые несекретные данные. Mock checks и live AWS — разные
разрешения. Готовность: negative auth/config fail closed; live proof pending до
разрешения и approved payload/model configuration. Handoff, стоп.
```

### Session 07 — offline Chroma (step 7)

```text
Выполни общие правила; PATCH-SEQUENCE §7, E08–E11. Сначала закрой deferred Python/
model contract на доступных approved artifacts: versions, model/hash/license,
telemetry/download API. Без разрешённой acquisition оформи requirements/blocker,
не скачивай. При разрешениях замени runtime uvx абсолютным local executable,
запрети remote Chroma/embedding providers, обеспечь local preflight/telemetry-off.
Сохрани index semantics/Windows lifecycle protections. Cold-cache/index/query/restart/
no-download доказаны лишь реально выполненными разрешёнными проверками, не env flags.
Если объём большой — законченный подэтап и один следующий подэтап в handoff. Стоп.
```

### Session 08 — local API/viewer (step 8)

```text
Выполни общие правила; PATCH-SEQUENCE §8, E17/E18. Сохрани local viewer, устрани
external asset/API requests и remote bind/config paths. Сохрани Host/Origin guards;
не делай общий security rewrite, mandatory scope filters, identity migration или DLP.
Готовность: local viewer/API сохранены, unapproved remote modes/assets недостижимы;
memory checks подтверждают regression, не новую isolation guarantee. Checks по
разрешению, pending явно. Коммиты, handoff, стоп.
```

### Session 09 — Windows private plugin (step 9)

```text
Выполни общие правила; PATCH-SEQUENCE §9, E12–E14. Private bundle-local hook/MCP/
launcher resolution без upstream/global cache fallback, runtime install/update/repair
compile. Измени source generators и нужные outputs. Local PowerShell preflight/
install/verify/uninstall/rollback с dry-run. Не менять actual registration/PATH/
registry/старую установку или worker без разрешения. Plugin ID не равен project
memory identity. Готовность: deterministic paths, missing-file errors; coexistence/
Unicode/install evidence только после разрешённых checks. Handoff, стоп.
```

### Sessions 10–12 — integration, checks, release (launch separately)

```text
ШАГ 10. Выполни общие правила; PATCH-SEQUENCE §10. По handoffs шагов 2–9 сведи
минимальный runtime closure, prune доказанно ненужные packaged dependencies/
entrypoints, согласуй generators/manifests/locks/artifacts. Не удаляй нешиппящийся
upstream source ради косметики. Clean build/acquisition только по разрешению.
Готовность: reviewed closure и source/artifact provenance либо точный pending gate.
Handoff отдельной сессии проверок, не начинай общий E2E автоматически.
```

```text
ШАГ 11. Выполни общие правила; PATCH-SEQUENCE §11. Прочитай test scripts, проверь
разрешения/prerequisites, не скачивай missing tooling автоматически. На disposable
fixtures выполни разрешённые targeted/regression и offline fake-observer acceptance.
Live Bedrock/process-tree monitoring требуют действующего разрешения и approved
payload/model/network config. Готовность: pass/fail/pending matrix, artifact hashes,
evidence limits. При fail — минимальный owning fix, не redesign. Не заявлять zero
egress без достаточных доказательств. Handoff, стоп, без production deployment.
```

```text
ШАГ 12. Выполни общие правила; PATCH-SEQUENCE §12. На принятом artifact подготовь
offline bundle/checksums/SBOM/licenses и install/diagnose/rollback docs. Разрешённый
clean-profile test exact final bundle: install/uninstall/reinstall/data preservation.
Pending IT/security signoff явно. Не publish/push/production install/user-memory
migration без разрешения. Готовность: reviewable release candidate и handoff. Стоп.
```

## Compact handoff and short launcher

Each session persists only its delta: branch/HEAD, task/substep, files/commits, checks
actually performed, deferred/blockers and reason, one next task with acceptance and
the few files to read. Update STATE/WORKLOG; do not paste project history repeatedly.
Source drift requires rechecking that slice, not restarting the audit after every reset.

Current short launcher (the full active authorization/task is in NEXT-SESSION):

```text
Продолжим в C:/0/ai/claude/claude-mem-custom/cmem-light на feat/cmem-light-local.
Прочитай AGENTS.md и docs/enterprise-local/NEXT-SESSION.md. Выполни его активный
copyable prompt Session 02: сохранить user setup baseline, реализовать pure compile,
проверить текущий increment существующими зависимостями в указанном scope.
В этой новой сессии подтверждаю разрешения source/build/targeted checks ровно
как в этом prompt; без fresh installs/services/AWS/user data/push/step 3.
Контекст/ownership — через STATE/TASKS/DEV-ENVIRONMENT; не повторять Session 01.
На выходе обнови repo memory и следующий prompt; после отчёта остановись.
```
