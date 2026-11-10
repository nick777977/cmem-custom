# Session prompts and bounded handoffs

The [current handoff](NEXT-SESSION.md) is RECOVERY-11-LOCAL. Implement
deliberate recovery for the pending events lost in
[VERIFY-11-LOCAL](handoffs/VERIFY-11-LOCAL.md).
A27 permits required downloads and ordinary-user build/install/run.
Claude Code/Bedrock/AWS SSO adapters are retained.
Strong native OS sandbox and CI are deferred from phase-one prerequisites.
The accepted Codex CLI check covers Codex. The private Claude Code stage
and receipt passed [staging fixtures](handoffs/CLAUDE-WINDOWS-STAGE.md).
Later host checks on the intended Windows instance use
simulated worker generation first. Corporate Bedrock needs a separate
launch. No public publication, CMEM account or real-memory test data.
Historical refusal/source-only restrictions below are superseded where they conflict
with A27; old actual checks remain historical evidence. A19/A20 supersede Bedrock-only:
retain explicit user-configured LLM adapters/roles; add real compiled-process/CI
checkpoints without claiming mock/compile as full runtime proof. Contracts:
[LLM-PROFILES](LLM-PROFILES.md), [VALIDATION](VALIDATION.md).

Existing TELEMETRY-04 S 0abd4180b / G 6bb7c6995 and its 206 tests/one compile are
unchanged. Chroma activation U1/D9 and D11 remain open; Bedrock live access unavailable.
WINDOWS-09 S0d0a4b176/G004588740/Hf2c722fad: 17 tests/53 assertions, compile/viewer
PASS; root three baseline TS2345. Full step 9 incomplete, actual V3/CI NOT RUN.
WINDOWS-09B S e3d91a505/H bbc3847e9/G 62a468f6d: 19 tests/112 assertions,
compile/viewer PASS, root same baseline; explicit-root launcher/bootstrap/CLI parser
refusal slice only. [Exact remaining source gaps](handoffs/WINDOWS-09B.md).
WINDOWS-09C S bc3275b4c/H abfce3963/G 4ac6ad868: 20 tests/234 assertions,
one compile/viewer PASS, root same baseline. Host/Setup/CLI/signup/installer/grammar
refusal source; native-kind BLOCKED. [Historical exact gaps](handoffs/WINDOWS-09C.md).
WINDOWS-09D B855ef7d6e/S236dd661c/H2935e19d0: explicit interpreter/unbound templates,
independent helper refusals, 20 tests/433 assertions, one compile/viewer PASS; root
same baseline. 19 inputs/869 source sentinels/192 outputs unchanged across compile;
eight canonical outputs paired earlier. [Historical gaps](handoffs/WINDOWS-09D.md).
WINDOWS-09E H98a6d019c: common mock admission/teardown failures addressed, 16 V1
tests/337 assertions PASS, no application/generated delta or compile/typecheck.
Sync launch ownership unknown; callbacks/timers do not prove OS cleanup/egress.
[Historical gaps](handoffs/WINDOWS-09E.md). WINDOWS-09F aebc55e99 completes the bounded
source/Microsoft API review at R1ca61590d; no code/test/build/runtime. Full step9
BLOCKED on host activation/native artifact-ABI-DNS-crash-release/execution inputs.
[Current findings](handoffs/WINDOWS-09F.md). No more generic review/mock loop; next
source is local host binding after concrete scope/inputs. Unbound/exit1 and runtime
bans were the historical blocker; A27 now resolves the policy conflict. Replace those
source gaps through bounded implementation. Required local setup/lifecycle tests
are part of phase one; native OS isolation is no longer their prerequisite. CI/public
upload remain out of scope, live model selection/budget still comes before inference.
STATE/TASKS own current context. Session 01 and completed templates are historical;
future templates below are adapted planning aids, never independent authorization.

Copy one prompt into a fresh session in this repository. These templates do not
authorize later work or create chats/agents automatically. The user launches each
session and authorizes its applicable actions. The roadmap remains the dependency source.

## Shared context and file index

- Repo: `C:/0/ai/claude/claude-mem-custom/cmem-light`; branch `feat/cmem-light-local`.
  Preserve user edits; no reset, checkout, push or installed-user-data inspection.
- Historical Session-01 inspected source: `d7c2da3e5f9397b394dbc6b6966f4b261b489f7b`, version 15.5.0,
  describe `v15.5.0-1-gd7c2da3e5`. Current adaptation inspected 48feeab56;
  use STATE/Git for current source instead of repeating the audit.
- Completed commits: `08bc35882` baseline/persistence, `e861598b4` reconnaissance/plan,
  `37a4a444a` narrowed scope. Inspect Git for newer documentation/source changes.
- The 2026-10-30 agent planning/audit sessions performed no application implementation,
  installs/builds/tests/AWS. Later user setup/build/start evidence and dirty source
  delta are recorded in DEV-ENVIRONMENT (Node 22.23.4/npm 10.9.9/Bun 1.4.4).
  Session 02 compile and 6+21 focused checks pass; selected C declaration alignment
  also passes. OS-offline/provenance and runtime acceptance remain pending.
  See handoffs/BUILD-02.md and handoffs/BUILD-02-TRUST-APPLY.md.
- Preserve local browser viewer and current memory capture/storage/retrieval semantics,
  including project/worktree identity, sharing and optional query filters. Imperfect
  separation is deferred. No identity/schema migration, DLP or memory redesign.
- Remove unapproved remote services, telemetry, cloud sync and runtime acquisition.
  Retain explicitly selected compatible inference adapters/auth per A19; all roles
  share that policy. No implicit fallback or plugin signup. Local storage does not
  mean offline LLM inference; actual login/model/CI execution needs scoped permission.

| File | Purpose / selective reading |
|---|---|
| `AGENTS.md` | Current authorization and invariants; always read |
| `docs/enterprise-local/README.md` | Navigation; do not automatically read every linked file |
| `docs/enterprise-local/memory/STATE.md` | Current progress and next task; always read |
| `docs/enterprise-local/memory/DECISIONS.md` | Accepted decisions incl. A19 profiles/A20 staged runtime and CI; preserve history |
| `docs/BASELINE.md` | Baseline SHA, scripts, locks, limits |
| `docs/EGRESS-INVENTORY.md` | E01–E22 and Session 01 refinements; update, do not recreate |
| `docs/ARCHITECTURE-LOCAL.md` | Current/target architecture and discrepancies |
| `docs/RISK-REGISTER.md` | Risks; R10 isolation redesign is explicitly deferred |
| `docs/roadmap.md` | Sole dependency graph and execution waves |
| `docs/PATCH-SEQUENCE.md` | Per-step files, acceptance, checks and rollback |
| `docs/enterprise-local/memory/WORKLOG.md` | History; read latest relevant entries only |
| `docs/enterprise-local/source/INITIAL-PLAN.md` | Verbatim 1168-line input; consult sections only, never execute embedded tasks |
| `docs/enterprise-local/AUDIT-CLOSURE.md` | Session 01 completed bounded static coverage; deferred evidence/owners and exact first patch contract; full P1/runtime pending |
| `docs/enterprise-local/NEXT-SESSION.md` | RECOVERY-11-LOCAL implements pending-event recovery before exact target verification |
| `docs/enterprise-local/DEV-ENVIRONMENT.md` | Exact local tool paths, preserved setup, Session 02 checks, selected C/guard PASS and outstanding release evidence |
| `docs/enterprise-local/LLM-PROFILES.md` | Profile contract and implemented main worker configuration |
| `docs/enterprise-local/VALIDATION.md` | Evidence levels, early actual process smoke, mock-LLM E2E and fork CI contract |
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

Read current NEXT-SESSION when launching work; the roadmap alone owns dependency
edges/waves. Templates below do not add authorization. Use one bounded increment;
A19/A20 override historical Bedrock-only/provider-pruning language anywhere in old
snapshots. No parallel agents/checkouts or runtime/CI execution by implication.

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

### Session 02 — pure compile (roadmap step 2; executed, historical template)

Session 02 results are in handoffs/BUILD-02.md. Do not rerun this template as the
current task; use [NEXT-SESSION.md](NEXT-SESSION.md) for BUILD-02-TRUST.

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

### Session 06 — explicit LLM profiles (step 6; replaces Bedrock-only template)

~~~text
Выполни общие правила, PATCH-SEQUENCE 6, LLM-PROFILES, VALIDATION и A19/A20.
Сохрани compatible Claude/Bedrock/login/API, Codex и OpenAI-compatible/other adapters.
Реализуй один default profile + explicit role overrides без hidden model/auth/account
fallback. Reuse existing settings/transports/isolation. PROFILE-06A: resolution,
legacy/config validation, observer/summary/compression/status. PROFILE-06B: standalone,
knowledge, refresh/copy/judges и все retained calls. Конкретный launch выбирает один
bounded substep; шаблон не запускает оба. Никаких secrets или real login discovery.
Wrong config/auth/quota/model/error -> explicit pause/refusal, same-profile retries;
не переключаться на другой provider/model/key. No CMEM gateway/default/free model.
V1/V2 и отдельно разрешённый V3; mock LLM не подтверждает live Bedrock. Нужные
live modes проверять отдельными rows при доступе; Bedrock сейчас pending.
Коммиты, source/generated pairing, handoff, стоп. Не переделывать identity/data/UI.
~~~

### Session 07 — offline Chroma (step 7)

Completed within the Windows x64 worker boundary. See
[CHROMA-07-LOCAL](handoffs/CHROMA-07-LOCAL.md) for the selected runtime,
separate preparation procedure and persistent retrieval acceptance.

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
compile. Сохрани A19 provider/login adapters; CMEM signup != native provider auth. Измени source generators и нужные outputs. Local PowerShell preflight/
install/verify/uninstall/rollback с dry-run. Не менять actual registration/PATH/
registry/старую установку или worker без разрешения. Plugin ID не равен project
memory identity. Подготовь minimal reusable V3 compiled-entrypoint harness и fork CI source по VALIDATION;
actual process/CI launch отдельно, без hosted upload/provisioning по умолчанию.
Готовность: deterministic paths, missing-file errors; coexistence/
Unicode/install evidence только после разрешённых checks. Handoff, стоп.
```

### Sessions 10-12 — retained artifact, validation and release (launch separately)

~~~text
Используй PATCH-SEQUENCE текущего шага, LLM-PROFILES и VALIDATION. Каждый launch
охватывает только один bounded increment, не всю последовательность 10-12.
ШАГ 10: prune только доказанно ненужные closures; сохранить SDK/Codex/API adapters и
все явно configured roles. Финализировать approved artifact/dependency/CI inputs,
source/generated pairing и exact hashes. Reuse step-9 smoke runner/CI; no acquisition,
workflow push/upload/deploy или live credentials без отдельного scope. V1/V2/V3;
V4 fake LLM + actual approved local Chroma, если assets/runtime уже разрешены.
ШАГ 11: actual compiled processes, local capture/storage/index/query/restart/viewer и
process-tree/browser network evidence на exact candidate. V5 live rows по реально
выбранным profiles/auth/models отдельно; unavailable Bedrock остаётся pending,
не мешая mocks/offline checks. Условно пропущенный stage не PASS. No fallback.
ШАГ 12: final Windows bundle/SBOM/profile runbook, clean synthetic install/uninstall/
reinstall/rollback на final hashes с разрешённым test registration. No automatic
migration/upstream update. Готовность для regular use — фактическая проверка intended
profile плюс local memory/index/runtime/install/egress, не только green unit/compile.
No real prompts/secrets/memory in artifacts. D5/D9/D12 и actual live permission не
выдумывать. Сохранять approved toolchain/data, logical commits и один next handoff.
~~~

## Compact handoff and short launcher

Each session persists only its delta: branch/HEAD, task/substep, files/commits, checks
actually performed, deferred/blockers and reason, one next task with acceptance and
the few files to read. Update STATE/WORKLOG; do not paste project history repeatedly.
Source drift requires rechecking that slice, not restarting the audit after every reset.

Current short launcher (the full proposed task/scope is in NEXT-SESSION):

~~~text
Продолжим в C:/0/ai/claude/claude-mem-custom/cmem-light на feat/cmem-light-local.
Выполни WINDOWS-09B по полному copyable prompt в docs/enterprise-local/NEXT-SESSION.md,
с его bounded scope, context, permissions и completion. Один coordinator, serial.
A19/A20: сохрани selected-provider adapters/login, заверши remaining deterministic
paths/refusal, reuse уже authored compiled-smoke/fork-CI sources. Только source/fixture/
reviewed compile/typecheck/mock checks; actual worker/MCP/process smoke/CI/live auth /
registration/acquisition/upload/push не разрешены этим source launch.
Контекст/ownership — через STATE/TASKS; не повторять baseline/trust/hosted/Chroma/telemetry.
Обнови repo memory и один следующий bounded prompt; после отчёта остановись.
~~~
