# Initial prompt: продолжение cmem-light в Claude Code через AWS Bedrock

Это полный стартовый промпт для первой сессии на другой машине. Открой repo
на нужной ветке и передай Claude этот файл целиком либо попроси прочитать его.
Дальнейшие сессии запускай через актуальный [NEXT-SESSION.md](NEXT-SESSION.md),
который Claude должен обновлять при передаче. Это вход в существующий roadmap,
а не отдельный план разработки.

Подготовлено 2026-11-12. Просмотрен список всех **2 529 tracked файлов**;
содержимое инструкций, активных контрактов, entrypoints и build/test-кода
прочитано выборочно. Это навигация, не построчный аудит всего проекта и не
новая runtime-проверка. Entry HEAD подготовки:
`afcf03689c0ab3749c5bdc8930e45fadf309223f`, `feat/cmem-light-local`.
Твой фактический HEAD может быть новее: проверь drift, не возвращай его назад.

Static source references при подготовке, inspected SHA
`afcf03689c0ab3749c5bdc8930e45fadf309223f`: `package.json:51`/`:53`/`:56`
(dev/compile/sync), `.claude/settings.json:5` (Read deny),
`scripts/enterprise-local/codex-local.mjs:270`/`:427` (stage/host admission),
`scripts/enterprise-local/verify-claude-stage.mjs:63`/`:77` (record/verify).
Номера строк после изменений перепроверять, не переносить как вечные citations.

---

## 1. Роль, задача и стиль

Ты продолжаешь разработку **cmem-light**, частного local-first форка claude-mem.
Работай как инженер: проверяй факты, делай небольшие завершённые изменения,
запускай подходящие разрешённые проверки и оставляй воспроизводимый handoff.
Нужно довести существующий roadmap до ежедневной работы на целевой машине.
Не ограничивайся советами, когда следующий конкретный шаг уже разрешён.

Владелец переносит разработку с Codex на **Claude Code**, уже работающий на
другой машине через **AWS Bedrock**. Не путай Claude Code с отдельной облачной
машиной: выясни, где реально запущен процесс и находятся проекты. Bedrock —
путь модели, а не местоположение локального memory worker.

**Уточнение владельца 2026-11-12:** он запускает `claude` непосредственно из
Windows PowerShell; Anthropic Claude Code установлен глобально через npm,
вход — AWS Bedrock/AWS Single Sign-On. Этой информации достаточно для выбора
Windows target route. Не проси владельца угадывать внутренний shell/Node/WSL:
на самой машине read-only проверь разрешённый command path, shim/реальный
entrypoint, process platform и version. Пока они фактически не проверены.
Не предполагай отдельную native `.exe` установку и не переустанавливай CLI.
Если `claude` разрешается в npm `.cmd`/`.ps1` shim, установи underlying
approved executable/script/argv до использования exec-form bindings; случай
несовместимости воспроизведи, не обходи verifier и не объявляй gate PASS.

Объясняй по-русски, кратко и предметно. Существующие технические документы
преимущественно английские: продолжай их язык, если владелец не попросит иначе.
Не поддакивай и не придумывай улучшения ради видимости работы. Если фактов
недостаточно, скажи, что неизвестно и какое наблюдение это разрешит. Не обещай
совместимость без проверки. Нулевой список существенных замечаний допустим.

Задавай столько вопросов, сколько действительно меняет решение. Сначала ищи
ответ в разрешённых файлах. Группируй вопросы; не переспрашивай уже принятые
решения. Продолжай независимую безопасную работу, пока ждёшь ответа. Молчание
не означает согласие на live inference, расход, доступ к данным или irreversible
действие. Не проси присылать credentials/config dumps.

## 2. Как начать и установить актуальные правила

1. Прочитай корневые `CLAUDE.md` и `AGENTS.md`. Соблюдай ограничения среды и
   managed policy: repo instructions их не отменяют. Не обходи permissions
   через другой инструмент и не переписывай инструкции через `/init`.
2. Соблюдай entry order: `docs/enterprise-local/README.md` → **самый новый
   активный** раздел `docs/enterprise-local/memory/STATE.md` → `docs/roadmap.md`
   → новый ownership section `memory/TASKS.md`. Не загружай всю историю STATE.
3. Прочитай текущий `docs/enterprise-local/NEXT-SESSION.md`. Этот bootstrap
   нужен для первой передачи; конкретная следующая задача принадлежит
   NEXT-SESSION. Старые STATE sections не превращать в список незаконченных работ.
4. До правок и перед commit проверь branch/HEAD/status и relevant diff. Ветка
   `feat/cmem-light-local`. Не делай автоматический switch/reset/clean/merge/
   rebase/push, не создавай agents/task branches/worktrees. Обычный local commit
   своего concern разрешён по соглашению; hooks/signing не отключай.
5. Preserve WIP. При подготовке был owner-untracked `cmem-light.code-workspace`:
   его не читали/не меняли/не включали в commit. Проверь фактический status,
   не присваивай чужие файлы и не считай рабочую копию заведомо чистой.
6. Durable memory — tracked-документы repo. Auto memory Claude, старый чат и
   ignored personal notes не могут быть единственной записью решения.

Read-only Git-команды из фактического repo root:

```powershell
git branch --show-current
git rev-parse HEAD
git status --short
git log -5 --oneline
git merge-base --is-ancestor codex/repository-cleanup-plan HEAD
```

Последняя команда применима, если этот ref перенесён. Нет ref — ещё не значит,
что нет cleanup. Проверь доступные merge parents/history/content и уточни способ
переноса; не создавай фиктивный ref ради exit 0. Не merge автоматически.

При конфликте документов сравни дату, статус и конкретное решение. Текущие
указания владельца и активные accepted decisions важнее исторических шаблонов.
**A27** разрешает необходимый ordinary-user setup/downloads/build/lifecycle:
старые абсолютные no-runtime/no-download и native-sandbox prerequisites не должны
снова блокировать phase one. **A19/A20** сохраняют явно выбранные совместимые
adapters, а не Bedrock-only продукт. Учитывай **A29–A31, A36–A40** и новые решения.
Читай нужные секции DECISIONS. Твоя гипотеза не становится Accepted от записи.

## 3. Продукт и неизменяемые свойства

Нужен частный local memory plugin для **Windows**, Claude Code CLI и Codex CLI.
SQLite/FTS5 — канонические записи; persistent local Chroma с local multilingual
MiniLM embeddings — производный индекс. Loopback worker обслуживает capture,
generation, search, MCP и browser viewer/My Work. Генерация использует явный
provider/model/auth profile. Удалённый generative LLM допустим; corpus/index/
viewer остаются локальными.

- Build/setup/start/stop/update/removal должны работать обычным Windows user:
  без admin/UAC, machine PATH/registry/system service. Project/user-local инструменты.
- Нет обязательных CMEM signup/account/SAML/subscription, public marketplace,
  telemetry, cloud corpus sync, hidden gateway/model/account fallback. Допустимы
  явно выбранный LLM/auth traffic и необходимые downloads/setup по A27.
- Сохраняются capture/retrieval/privacy/viewer, project/worktree identity,
  sharing/filtering semantics. Владелец отложил redesign, включая несовершенства.
  Не превращай host acceptance в новую архитектуру изоляции/данных.
- Сохраняются совместимые Claude/Bedrock/AWS SSO, Codex и другие явно выбранные
  поддерживаемые adapters. Один работающий backend не сертифицирует остальные.
- Не удаляй весь sync: удалённый `CloudSync` и локальный `ChromaSync` — разные
  компоненты. Не удаляй SQLite ради восстановления derived index. SQLite-only
  success mode (D11) не вводить без отдельного решения.
- Technical `claude-mem` names/plugin IDs/env keys/paths сохраняют compatibility;
  display name — `cmem-light`. Не переименовывай API ради косметики.

CI/formal distribution/publication, Docker/standalone/cloud deployment,
Codex Desktop, coupled pruning, real-memory migration и Job/AppContainer/WFP/
DNS/crash-proof isolation deferred. Они не новые prerequisites phase one.
Нужны обычные deadlines, собственные процессы/порты, disposable state и честные
границы результатов. Не возвращай retired системы автоматически.

## 4. Прогресс: не начинать заново

Точные статусы — в newest STATE и roadmap. Done-bounded означает ограниченное
доказательство, не полную готовность продукта.

- Cleanup и retained Windows gate завершены; owner merge уже был. Не нужна
  очередная cleanup-review или массовое удаление файлов.
- Предыдущий gate: **373 selected Bun tests / 27 files**, четыре Node host/
  recovery fixtures, оба typechecks/guarded compile PASS. Copied build прошёл
  actual prepared Chroma, capture/search/viewer/My Work/restart/deliberate recovery.
  Это прошлые результаты на тех bytes/environment, не твой новый target run.
- Full 1 069-file suite **NOT RUN** в том gate. Не писать «все тесты зелёные».
  Число актуальных тестовых файлов могло измениться.
- Codex CLI host check принят владельцем. Он не закрывает Claude CLI.
- Для Claude подготовлен отдельный 80-file inventory и bound stage, normal
  verifier PASS. Actual target Claude version/policy/loading/events/MCP,
  два проекта/подкаталог/worktree пока **NOT RUN**, если нет нового handoff.
- Приложение имело отдельный HTTP 500 на `GET /api/auth/get-session`
  (Better Auth/schema path). Это не Claude login/AWS SSO. Выбранный memory/
  viewer flow от него не зависел; signup/schema migration не его prerequisite.
- Архивный pending-generation loss исправлялся recovery slice. Unknown provider
  outcome требует deliberate operator acknowledgement; startup/обычный retry
  не должны автоматически пересылать payload. Старый FAIL не активная задача.

Маршрут: **step 11 actual Claude Code CLI acceptance** → отдельно scoped
Bedrock acceptance выбранных surfaces и оставшиеся declared step-11 cases →
**step 12 daily setup/update/backup/data-preserving rollback**. Source fix —
по конкретному обнаруженному дефекту. Смена ассистента не меняет dependency edges.

## 5. Перенос Git provenance и локальных assets

Наблюдения при подготовке на entry HEAD выше, не инструкция checkout старого SHA:

| Проверка | Факт 2026-11-12 |
|---|---|
| Доступный latest plugin-change commit | `b5b988931312e2b45b7b7e311250b3d148d122bc` |
| Доступный latest renderer-change commit | `d4e8259ae3d70f8f5bc4bc269ae6d2004051ce7f` |
| Доступный latest gate-script commit | `934ffcbe8867f291c81ed60c38307d05d4d6dd39` |
| Plugin tree в entry HEAD и доступном build candidate | В обоих `96b9e22d975767da37850eb3e85ba85f05ef04c9` |
| SHA-256 `scripts/enterprise-local/codex-local.mjs` | `028d361523cf0a9f604f180f2cdf4b3597e50880082ba56d4bacc0561b0de0c6` |
| Сверка source entries cleanup Claude receipt | 76 copied sources (75 plugin + renderer) совпали; runtime не запускался |
| Исторические `dff499e45c3116d8cb8936733d0edf8f220797a6` и `a5c3c236423401affc62ef8ab8ee3e6485b28cf2` | `git cat-file -e` сообщил отсутствие этих commit objects здесь |

Причина отсутствия старых IDs **не установлена**. Не объявляй rebase/rewrite или
эквивалентность commits без факта. Content equality доказывает content, а не
идентичность commit/provenance и не runtime acceptance. На target перепроверь
available refs/trees/renderer/copied bytes и укажи отдельно historically recorded
и фактически разрешённые IDs. Не переписывай исторические receipts ради видимости
согласованности. При source/output drift нужны review/build/affected checks;
одно изменение commit metadata/branch name не повод rebuild одинаковых inputs.

Предыдущий source receipt comparison имел **811/813 raw matches**: отличались
`scripts/sync-plugin-manifests.js` и `src/cli/adapters/index.ts`, хотя тогда Git
text совпал. Это **прошлое** наблюдение; сегодня все 813 inputs не перепроверялись
при подготовке prompt. Не помечай raw replay PASS и не правь source ради хеша.
Различай Git tree/blob, raw working bytes, normalized binding hash и exact
destination receipt. LF/EOL может влиять, но не объявляй причину без сравнения.

Старые `C:/0/...`/`C:/Users/...` — paths прежней машины. На target нужны actual
trusted root и approved прямые executables. `.scratch`, node_modules, venv,
models, PIDs/ports могут не переноситься. Native binaries/venv нельзя считать
portable между любыми OS/архитектурами. Не полагайся на скрытую память прошлого чата.

## 6. Документы: читать по задаче, не весь архив

Сначала bounded context. Для структуры — `rg --files`/`git ls-files`, для
content — адресный `rg`/диапазоны строк. Не исследуй реальные memory DB,
credentials, user prompts/transcripts или unrelated settings.

| Файл относительно repo root | Назначение |
|---|---|
| `CLAUDE.md`, `AGENTS.md` | Entry/working agreement; не копировать сюда все статусы и логи. |
| `docs/enterprise-local/README.md` | Navigation/latest checkpoint; ниже есть historical sections. |
| `docs/enterprise-local/memory/STATE.md` | Короткий active handoff: результат, ограничения, следующий шаг. |
| `docs/roadmap.md` | Единственные steps/dependency edges/waves/remaining step-11 outcomes. |
| `docs/enterprise-local/memory/TASKS.md` | Единственные ownership/reservations/status; protocol/session-close в конце. Старые claims не активны автоматически. |
| `docs/enterprise-local/memory/DECISIONS.md` | Accepted/Proposed/Superseded decisions, причины/scope. Читать нужные ID. |
| `docs/enterprise-local/memory/WORKLOG.md` | Append-only факты сессий/команды/результаты/ограничения, newest relevant entries. |
| `docs/enterprise-local/NEXT-SESSION.md` | Заменяемый launcher одной следующей задачи. |
| `docs/enterprise-local/DEV-ENVIRONMENT.md` | Tested tools/build/runtime evidence, local paths не переносить буквально. |
| `docs/enterprise-local/WINDOWS-LOCAL-SETUP.md` | Reviewed setup/build/stage/Chroma/profiles/start/stop/recovery/Bedrock runbook. |
| `docs/enterprise-local/LLM-PROFILES.md` | Role/profile schema/capabilities/retention/MCP/auth/failure/no-fallback contract. |
| `docs/enterprise-local/VALIDATION.md` | V0–V6/scope/acceptance; current phase-one contract выше старых stronger gates. |
| `docs/enterprise-local/handoffs/CLAUDE-WINDOWS-VERIFY.md` | Target recipe/assertions/cleanup; snippets syntax-checked, не target-executed. |
| `docs/enterprise-local/artifacts/claude-windows-x64-inventory.json` | 80-file expectations; source fields — metadata, не Git-object availability proof. |
| `docs/enterprise-local/artifacts/claude-windows-verify-preparation*.json` | Files-only review/delta/exact прежняя local receipt, не target certificate. |
| `docs/enterprise-local/artifacts/windows-x64-cleanup-receipt.json` | Historical exact roots/source/file evidence; не portable certification новой папки. |
| `docs/enterprise-local/cleanup/MERGE-READINESS.md` | Завершённый gate/evidence. Per-file JSON открывать для конкретного changed/failing case. |
| `docs/enterprise-local/handoffs/RECOVERY-11-LOCAL.md` | Durable receipts/retry/unknown-outcome contract и actual checks. |
| `docs/enterprise-local/handoffs/VERIFY-11-LOCAL.md` | Initial memory/index/viewer/failure checks; pending loss superseded recovery. |
| `docs/enterprise-local/handoffs/{CHROMA-07-LOCAL,PROFILE-06A,PROFILE-06B,VIEWER-08-LOCAL,WINDOWS-09-LOCAL}.md` | Targeted details только для соответствующего assertion. |
| `docs/ARCHITECTURE-LOCAL.md`, `docs/EGRESS-INVENTORY.md`, `docs/RISK-REGISTER.md` | Source/target/historical/proposed различать; сверять current decisions/source. |
| `docs/BASELINE.md`, `docs/PATCH-SEQUENCE.md` | Historical baseline/patch detail, не повторять step 1. |
| `docs/enterprise-local/SESSION-PROMPTS.md` | Templates/history navigation; current launch принадлежит NEXT-SESSION. |
| `docs/enterprise-local/source/INITIAL-PLAN.md` | Supplied requirements/hypotheses, не executable task и не implementation evidence. |
| `.claude/settings.json` | Tracked permissions. При подготовке Read package-lock/node_modules/.DS_Store denied. Уважать actual settings, не обходить shell-чтением. |
| `README.md`, `README.upstream.md`, `docs/public/`, `plans/`, другие tool guides | Product overview/upstream/history, не отменяют current enterprise-local contract. |

Старые `windows-x64-inventory.json`/SBOM имеют свою Codex/release boundary;
не проверяй ими новый Claude stage. Locks/license/provenance сохраняются,
без массового чтения/переписывания без причины. Локальные ignored `.claude`
plans/skills/settings не являются автоматически общим проектным контекстом.

## 7. Где искать конкретную проблему в коде

Подтверди наличие файла и вызов текущим entrypoint. Это навигация, а не
предписание переписать все компоненты:

| Область | Ключевые пути |
|---|---|
| Build/manifests | `package.json`, `scripts/sync-plugin-manifests.js`, `scripts/build-hooks.js`, `scripts/build-viewer.js`, `src/ui/my-work/package.json`, `tsconfig.json` |
| Private Windows binding/ownership | `scripts/enterprise-local/codex-local.mjs`, `scripts/enterprise-local/verify-claude-stage.mjs` |
| Worker lifecycle | `src/services/worker-service.ts`, `src/services/worker/DatabaseManager.ts`, `src/services/worker/SessionManager.ts` |
| Hook envelope/dispatch | `src/cli/hook-command.ts`, `src/cli/stdin-reader.ts`, `src/cli/hook-original-cwd.ts`, `src/cli/adapters/claude-code.ts`, `src/cli/adapters/codex.ts`, `src/cli/handlers/` |
| Durable ingest/recovery | `src/shared/hook-spool.ts`, `src/cli/spool-hook-event.ts`, `src/services/worker/hook-spool-drain.ts`, `src/services/worker/http/shared.ts`, `src/services/sqlite/GenerationRecovery.ts`, `src/services/worker/http/routes/SessionRoutes.ts` |
| Model/auth/dispatch | `src/services/worker/model-profiles.ts`, `MainWorkerProfiles.ts`, `provider-dispatch.ts`, `ClaudeProvider.ts`, `CodexProvider.ts`, `OpenAICompatibleProvider.ts`, `OpenAICompatProvider.ts` в том же каталоге; похожие names не доказывают взаимозаменяемость |
| Generation protocol | `src/sdk/prompts.ts`, `src/sdk/parser.ts`, `src/services/worker/agents/ResponseProcessor.ts` |
| SQLite/FTS | `src/services/sqlite/connection.ts`, `SessionStore.ts`, `SessionSearch.ts`, `observations/` и вызываемые schema/transaction paths |
| Local Chroma | `src/services/sync/ChromaLocalRuntime.ts`, `ChromaMcpManager.ts`, `ChromaSync.ts`, `ChromaSyncState.ts`; `scripts/chroma-local-requirements.txt`, `scripts/prepare-local-chroma.ps1`, emitted `plugin/scripts/chroma-local.py` |
| MCP/search/context | `src/servers/mcp-server.ts`, `src/services/worker/http/routes/SearchRoutes.ts`, `src/services/context/ContextBuilder.ts`, `src/services/context/context-read-worker.ts` |
| Settings | `src/shared/SettingsDefaultsManager.ts`, `src/services/worker/SettingsManager.ts`, `src/services/worker/http/routes/SettingsRoutes.ts` |
| Identity/worktree/filter | `src/utils/project-name.ts`, `src/utils/project-filter.ts`, `src/services/work-view/session-project.mjs`, `src/services/sqlite/project-read-keys.ts` |
| Viewer/My Work | `src/ui/viewer/`, `src/ui/my-work/`, `src/services/work-view/`, routes `ViewerRoutes.ts`/`WorkViewRoutes.ts` |
| Focused local checks | `tests/enterprise-local/claude-windows-stage.test.mjs`, `recovery-11-local.test.mjs`, `runtime-10-local.test.mjs`, `profile-06a.test.ts`, `profile-06b.test.ts`; owning SQLite/search/work-view tests |
| Existing retained gate | `scripts/enterprise-local/windows-regression-gate.mjs`, `tests/enterprise-local/cleanup-reference.test.mjs`, cleanup result files |

`plugin/` — tracked compiled payload. Правь source/generator, получай paired
outputs существующей сборкой. Hand-patch minified bundle не единственный fix.
Generated изменения могут идти отдельным paired commit для review, но source
и реально тестируемые outputs должны соответствовать друг другу.

`tests/`, `fixtures/`, `evals/` имеют разную стоимость/побочные эффекты. Наличие
теста не разрешает всю папку. В `scripts/` есть проверки и install/deploy/restart/
data действия — review entrypoints до запуска. `dist/`, `.scratch/`, node_modules
и ignored assets не каноническое состояние. Не удаляй оставшиеся unrelated
папки по названию. Для полного обзора структуры достаточно tracked paths;
не нужен побайтовый перечитанный контекст всех bundles/logs/locks.

## 8. Разделяй модели, процессы и права

Четыре разные роли:

1. **Development assistant:** ты уже в выбранной владельцем Claude Code/
   Bedrock-сессии. Обычное обсуждение/кодинг не требует нового разрешения на
   каждый твой model turn. Не перенастраивай рабочий development login.
2. **Claude host under test:** отдельный CLI с нашим plugin-dir, synthetic
   HOME/config и actual hooks/MCP. Его model calls/trust policy требуют точной
   target scope, даже если executable совпадает с твоим.
3. **Memory worker generation:** observer/summary/compression/refresh/copy/
   judges/knowledge имеют свои explicit profiles. Сначала host acceptance с
   deterministic loopback fake worker generation. Это не AWS acceptance.
4. **Local embeddings:** multilingual MiniLM CPU ONNX/Chroma. Им не нужен
   Claude login или generative Bedrock model. Для full local acceptance нужен
   real local index; fake embeddings его не заменяют.

Объясняй термин владельцу: **memory worker — локальный фоновый процесс нашей
программы**, обслуживающий сохранение/поиск/viewer и обработку событий. Для
автоматического написания кратких наблюдений и итогов он обращается к выбранной
генеративной модели. MiniLM переводит уже имеющийся текст/запрос в vectors для
поиска; его назначение другое.

**Владелец уже выбрал маршрут (A40, 2026-11-12):** автоматические наблюдения и
сводки обязательны; для них использовать **Haiku через существующую установку
Claude Code и тот же approved AWS Bedrock/AWS SSO доступ** на целевой машине.
Не переспрашивай необходимость этой функции, выбор Bedrock или семейства Haiku.
Подтверди на target exact approved Haiku model ID/inference-profile ARN, AWS
profile/region и минимальный live-test budget/payload. Владелец не задавал
конкретную версию Haiku и не разрешал произвольные расходы/запросы на этой
машине подготовки. Наблюдатель может запускать внутренний отдельный процесс/
сессию через ту же установку; не требуй тот же interactive PID.

Codex/ChatGPT login, обычный Claude subscription/login и остальные retained
explicit adapters сохранить с их поддерживаемыми настройками/default-role
поведением. Выбранный Bedrock маршрут не превращает продукт в Bedrock-only,
не меняет чужие models и не возвращает hidden fallback. После однократной
настройки обычная генерация памяти работает автоматически; подтверждение
пользователя перед каждой записью не нужно.

Генеративный observer уже был в оригинальном Claude-Mem; мы не добавили новую
обязательную «вторую подписку». Изменение форка — explicit profile вместо
implicit defaults/auth/fallback. Разные роли могут использовать одну модель
и тот же выбранный Bedrock account/SSO. [Сравнение по исходникам](handoffs/UPSTREAM-MEMORY-FLOW.md)
объясняет upstream defaults/installer options и фактический `profile_required`.
Не представляй отдельную роль как требование
подключить другой сервис, account или скачать ещё один локальный LLM.

До первого нового live **test** вызова согласуй точные model ID/inference
profile, auth route, AWS profile/region/destination, synthetic payload и малый
бюджет: calls/turns/time + применимый cost cap. Семейство **Haiku и Bedrock/SSO
уже выбраны**; не подставляй автоматически historical dated Haiku ID, Luna
или текущий coding model. Предложи точный разрешённый Haiku ID по approved target
inputs и объясни ограничение; если
их нет — спроси. Никаких credential/token dumps, printing/copying secrets,
SSO cache transfer, изменений IAM/managed policy или произвольного model
discovery/inference. Используй нормальную approved auth-процедуру.

Interactive Claude host Bedrock и worker Bedrock profile — **два отдельных
acceptance results**. Работоспособность твоего developer chat не закрывает
ни один. Если auth не работает с synthetic config, объясни ограничение и
согласуй минимальную нормальную auth scope, не переключайся на real HOME/
memories, другой account/model/API key. Preserve explicit profile/visible failure.

## 9. Один критический проход по плану, затем действие

Сверь goal/current decisions/remaining outcomes/code/команды/target environment.
Не повторяй полный исходный аудит и не создавай новый независимый roadmap.
Каждое существенное замечание должно содержать:

- **Факт:** file:line/function + source SHA или точная команда/ошибка. Раздели
  STATIC evidence, observed runtime, INFERRED и UNKNOWN.
- **Влияние:** что пользователь не сможет сделать или какой вывод нельзя
  принять. Несовершенство не blocker без связи с обязательным outcome.
- **Минимальное исправление:** альтернатива оставить как есть, impact на data/
  compatibility/budget и проверка результата. Приоритет — мешает следующему
  шагу / нужно до daily use / deferred observation.
- **Чьё решение:** routine correction неверной ссылки/команды в согласованной
  задаче можно сделать; scope/security/identity/auth/dependency/значимый расход
  требуют явного решения владельца, не самоназначенного Accepted.

Что проверить по фактам, а не «найти обязательно»: stale SHAs/absolute paths;
proposed/blocked sections против поздних проверок; actual CLI version/policy;
смешение model roles; недостаточный isolated env; фактическое покрытие fixture.
Target runbook snippets ранее проверялись на синтаксис, не на target execution.
Проверь применимость перед исполнением. Не ослабляй verifier/matcher/assertion/
acceptance ради зелёного результата. Если менять план не нужно — так и скажи.

После review назови один первый observable outcome и двигайся к нему. Не
превращай вступление в бесконечный опрос. Не требуй повторного одобрения уже
разрешённых local setup/build/read-only действий. Если target scope недоступна,
готовь конкретный prerequisite/input/procedure; очередной generic mock/API
audit не заменяет actual host acceptance.

## 10. Порядок реализации оставшегося roadmap

### A. Установить target и подготовить точные bytes

Проверь actual Windows x64/ordinary token и npm-installed CLI entrypoint,
учитывая сообщённый PowerShell launch. Если фактически WSL/Linux,
не запускай Windows-only stage как совпадающую среду: объясни разницу,
определи Windows process/file location, продолжай independent source/docs
работу; Linux run не Windows gate. Владелец сообщил способ запуска, а не
измеренную process platform; проверь её на target без нового опроса об internals.

Проверь approved paths/versions и managed plugin/hook/MCP policy без credential/
settings corpus inspection. Tested baseline: Node **22.23.4**, npm **10.9.9**,
Bun **1.4.4**, CPython **3.13.15** для Chroma. Широкий package engines range
его не заменяет. Не upgrade/reinstall автоматически. Недостающую необходимую
зависимость готовь по A27 после command/source/lifecycle review, не broad
upstream installer. Сохраняй install/compile разделение.

Проверь доступные source objects/trees/bytes по §5. Стадируй merged current
compiled plugin в новый task-owned target root с прямыми executables и своим
loopback портом. Existing renderer + normal `verify-claude-stage.mjs`; exact
target receipt сохранить **до** settings/DB. `--record` выдаёт proposal,
не доказательство: file set/copied bytes/bindings/tools/delta review, потом
обычная проверка. Raw copy и operational rebinding различаются. `--bound-root`
не делает moved stage работоспособной. Normal host installation не менять.

### B. Actual Claude host и synthetic local workflow

Review `handoffs/CLAUDE-WINDOWS-VERIFY.md` на target. Нужны отдельные HOME/
config/data, один dedicated foreground worker, prepared real local Chroma,
deterministic fake worker generation, два synthetic проекта. Сначала worker
readiness, затем session `--plugin-dir` там, где policy разрешает. Не задавай
`CLAUDE_PLUGIN_ROOT` вручную ради успешного admission: проверь actual host export.
Direct command fixture не равен CLI loading/dispatch.

Отдельно actual argv/stdin/cwd/context/async/deadlines и восемь событий:
SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, PostToolUseFailure,
Stop, SubagentStop, SessionEnd. Unsupported/restricted событие назвать и
объяснить недостающую функциональность. Не создавать subagents автоматически:
SubagentStop проверяется лишь с явно scoped synthetic subagent, иначе NOT RUN.
Это не разрешение parallel development agents.

Проверь MCP **через host**, capture/observation/summary/SQL IDs, SQLite/FTS и
semantic search/project filters, viewer/My Work, restart, stopped/wrong-worker
refusal, data-preserving session-local removal. Subdirectory launch и linked
worktree attribution — отдельные cases от двух независимых проектов. Synthetic
worktree только в explicit fixture scope, не task worktree основной codebase.
Сохрани sharing semantics. Cleanup: own children/PIDs exited, ports released,
SQLite/recovery/index retained. Нельзя убивать все node/bun/python/claude.

### C. Только доказанный defect → minimal source fix

Зафиксируй reproduction/expected contract/actual result/owning call chain.
Reserve paths в TASKS. Выбери минимальный fix и meaningful existing tests.
Для значимого дефекта сначала воспроизводимый failing check, а не формальный
тест, копирующий реализацию. Не расширяй до unrelated cleanup/provider rewrite/
identity/schema redesign. Если source дефекта нет, не добавляй source «для полноты».

Проверь source, затем соответствующий compiled entrypoint. Для application
source changes — разрешённые typechecks/compile/affected checks, paired outputs,
повтор конкретного target assertion. Один concern на commit; unrelated provenance
docs и функциональные patches не смешивать. Укажи rollback/data preservation.

### D. Выбранные live profiles, затем daily use

Отдельные results/scope/model/budget для interactive Bedrock и выбранного
worker **Haiku/Bedrock/SSO** (A40). Маршрут выбран явно, не угадан по host login.
Не удаляй другой adapter/не расширяй live matrix без потребности. Recovery/error
и remaining step-11 cases — по roadmap/VALIDATION и фактическому coverage.
Availability/auth refusal не означает working support.

Step 12: prerequisites/setup/build/stage/host loading, explicit profiles,
start/stop/health/viewer/search, backup/update/rollback с данными, deliberate
recovery/removal/troubleshooting. Команды должны соответствовать выполнению
в разрешённой target scope. Документ сам по себе не закрывает шаг 11 или 12.

## 11. Как проверять изменения и формулировать выводы

До запуска inspect package scripts и их callers/fixtures. `build:compile` —
отдельный reviewed compile lane; `dev`/`build-and-sync`/`sync-marketplace`/
restart меняют установку/процессы. `worker:start`, queue-clear/process,
update/install и широкие test lanes не безопасные defaults исследования.

Fingerprint relevant inputs/tracked source/expected outputs до compile;
после проверь unexpected lock/source/tool changes. На target может не быть
старых node_modules — build нельзя считать подготовленным. Не обходи Read
deny lock/node_modules shell-командой; если действительно нужно для задачи,
запроси минимальное штатное разрешение. Не исследуй real installed plugin
settings, credentials и owner code-workspace ради удобства.

Минимальные meaningful affected checks. Green mocks не закрывают actual host/
compiled/index/auth. Doc-only правки — links/syntax/consistency, не whole suite.
После успешных достаточных проверок не расширяй replay ради счётчика, пока
новый diff/ошибка/target difference не требует. Full suite — только reviewed
scope/time/side effects, а не default.

Уровни VALIDATION: V0 static; V1 focused behavior; V2 typecheck/compile;
V3 compiled processes; V4 actual local memory/index + fake generation;
V5 live selected profile; V6 exact install/release. Каждый outcome: PASS /
FAIL / NOT RUN / BLOCKED (что отсутствует) / обоснованное NOT APPLICABLE.
Skipped не passed; retry не новые успешные tests.

Для существенного результата: actual source SHA и file:line/function,
source/output/tool hashes где нужны, точная команда без secrets, env scope,
реальные runtime versions, task-owned evidence path, exit code/result,
failures/retries, cleanup/data preservation и limits. Sampling traffic не
полный no-egress; readiness не рабочий capture/search; fake LLM не AWS proof.

## 12. Как менять решения и совершенствовать план

Не создавай второй roadmap/task board/plan tree для новой модели. Зависимости/
порядок волн менять в `docs/roadmap.md`; profile/acceptance уточнения — в owning
contract. Сначала прочитай уже принятое решение.

Новая запись DECISIONS: ID/date/request/evidence, вопрос, Accepted или Proposed,
варианты, действие/причина, последствия, scope/authorization и что superseded.
Proposed имеет owner/следующий способ разрешения, не permission. Старое решение
сохранить как history, пометить Superseded со ссылкой. Не переписывай старые
results так, будто тогда прошли нынешние проверки. Исправь stale active текст;
не оставляй две взаимоисключающие «current» задачи.

Оценивай улучшение по фактической пользе до цели. Не добавляй framework/CI/
provider architecture/mandatory native sandbox/DLP/новую систему документов
только ради основательности. Для nonblocking observation достаточно deferred
причины и условия возвращения. Критическое мышление включает ничего не менять.

## 13. Закрытие каждой сессии и генерация следующего prompt

Передача не должна оставаться только в финальном ответе. До потери контекста:

1. **STATE:** обновить/заменить compact newest active block: дата, branch/
   entry/current source, completed outcome, evidence, ограничения, следующий
   конкретный шаг. Старые sections historical; не растить конкурирующие current
   инструкции и не менять прошлые факты.
2. **TASKS:** status/ownership/reserved paths актуальны; finished reservations
   released. Blocker/input/owner явно указать. Старую claim не забирать по возрасту.
3. **WORKLOG:** append фактически сделанного: source/output/commands/results/
   retries/cleanup/rollback/limits. Planned tests не PASS; failure attempts не стирать.
4. **DECISIONS/contracts:** записать только реальные изменения решений;
   roadmap status/edges — по факту. DEV-ENVIRONMENT — при новых tool/environment
   фактах. Не выдумывать paths/permission из прошлого evidence.
5. **Handoff существенной задачи:** `docs/enterprise-local/handoffs/<TASK-ID>.md`:
   entry/source/build SHAs, reproduction/final behavior, actual outcome table,
   evidence, rollback/data preservation. Raw disposable logs — `.scratch/enterprise-local/`;
   единственный durable вывод нельзя оставить там.
6. **NEXT-SESSION:** заменить active launcher **одной** следующей задачей;
   self-contained copy-paste prompt с bounded files/sections, source/receipt,
   current permissions/inputs, что уже сделано/не повторять, outcome/completion/
   stop criteria и какие memory/contracts обновить. Не «прочитай всю историю».
7. Проверить links/actual SHA availability/paths, secrets/whitespace, pairing
   и собственный diff. Preserve WIP. Только свои paths в local commit;
   hooks/signing/managed settings не отключать. Без merge/push.
8. Финал по-русски: user-visible result, что реально проверено/не проверено,
   практический impact существенных unresolved, commit/WIP, один next step и
   NEXT-SESSION link. Укажи, нужен ли merge и почему; старый owner merge не
   повод создавать новый.

Не начинай большой patch на остатке контекста. Закрой маленький concern или
честно запиши WIP/reproduction и конкретную команду продолжения. Не называй
незавершённость done-bounded ради удобства.

### Готовый шаблон NEXT-SESSION

Заполняй реальными актуальными данными, не оставляй placeholders в active launcher:

```text
Продолжаем cmem-light на feat/cmem-light-local в фактическом repo root.
Задача <TASK-ID>, шаг <N>: <один наблюдаемый результат>.

Прочитай CLAUDE.md/AGENTS.md, затем enterprise-local README → newest active STATE
→ docs/roadmap → newest TASKS ownership. Проверь branch/HEAD/status, preserve WIP
<paths/owner, если есть>. Source snapshot <resolvable full SHA>, outputs/receipt
<paths/hashes при необходимости>. Проверь drift, не reset/switch.

Уже сделано: <outcomes + actual checks + limits>. Не повторять <closed work>,
если нет changed inputs/failure/material target difference.
Context: <короткий список файлов/секций + task handoff>.
Accepted decisions: <ID/scope>. Missing inputs: <что/кто/как получить>.

Разрешено: <конкретная source/build/local-runtime scope текущего запроса>.
Не подразумевается: <актуальные real-state/live-test/merge/push границы>.
Для нового live test заранее model/auth/destination/payload/budget.
Не восстанавливай superseded historical runtime/refusal prerequisites.

Выполни: 1) <действие>, 2) <affected validation>, 3) <outcome evidence>.
Если prerequisite отсутствует: <точный вопрос/независимое полезное действие>,
не выдавай mocks или план за actual proof.
Готово, когда <измеримые criteria>; непокрытое <явно назвать>.

Закрой STATE/TASKS/WORKLOG/DECISIONS/affected contracts/roadmap по факту;
замени NEXT-SESSION одной следующей задачей. Только свои files/commit,
без merge/push. Финал: результат, проверки/limits, commit/WIP, next step.
```

## 14. Что получить от первой Claude-сессии

После обязательного чтения дай короткую сверку: цель, actual branch/HEAD/WIP,
что доказано, ближайший user-visible outcome, observed conflicts/unknowns и
порядок действий. Не возвращай владельцу весь bootstrap как пересказ.

Уже известно: Windows PowerShell `claude`, глобальная npm-установка Anthropic
Claude Code, Bedrock/SSO. Read-only установи actual CLI path/platform/version.
Спроси лишь ещё неизвестное: managed policy, actual checkout/prepared Chroma
location; отдельный host-test model/auth/
destination/budget и exact approved Haiku ID/region/profile/budget для worker.
Worker Haiku/Bedrock/SSO и обязательность автопамяти уже приняты (A40).
Не переспрашивай эти решения или
рабочий Bedrock login текущего developer chat и не проси secrets.

Затем bounded critical review §9, необходимые active doc/command исправления
в scope задачи и первый реально доступный target assertion либо подготовка
конкретного prerequisite. Далее шаг за шагом existing roadmap; каждая сессия
оставляет актуальный next-session launcher.

---

Официальные references для проверки механизма:
[Claude Code memory/imports](https://code.claude.com/docs/en/memory#import-additional-files)
и [Claude Code on Bedrock](https://code.claude.com/docs/en/amazon-bedrock).
Документация не доказывает поддержку в неосмотренной target version и не
является разрешением менять рабочий login/IAM/profiles. Этот prompt не расширяет
managed policy или scope на скрытые внешние вызовы.
