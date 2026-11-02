# Next session: preserve user setup, implement pure compile, validate locally

Updated: 2026-11-02. Replaces the 2026-10-30 pre-install launcher. This template
authorizes nothing in the current docs session; the user launches it in a new chat.

## Current baseline

Dependencies are user-installed. Supplied logs show existing build finishing and
worker:start returning ready. Preferred versions: Node **22.23.4**, npm **10.9.9**,
Bun **1.4.4**. See [DEV-ENVIRONMENT](DEV-ENVIRONMENT.md) for evidence/limits.
No automated suite, pure/offline compile or full memory acceptance is demonstrated.

Entry HEAD was `62e79cceb`; user setup was **uncommitted** (9 tracked files + 1 new
trust JSON). A subsequent docs commit does not absorb that work. DEV-ENVIRONMENT
records exact files/fingerprints and suggested source commit subjects. Preserve them.

Next increment stays roadmap step 2. Do not reinstall or repeat the audit by default.
Preserve setup baseline -> patch compile -> validate with existing local inputs.
Root allowScripts/canonical-list drift is a known baseline issue, not automatically
a regression introduced by the next patch. Keep new trust JSON in generator inputs.
Successful setup does not approve every native script or final runtime connection.

Use previously recommended GPT-6.1 Sol / Medium for this scoped increment. No new
model/context-size claim is needed. Do not combine unrelated subsystem removals.

## Copy this prompt into the new session

```text
Продолжаем в C:/0/ai/claude/claude-mem-custom/cmem-light,
ветка feat/cmem-light-local. Выполни Session 02 / roadmap step 2:
сохрани user setup baseline -> реализуй pure compile -> проверь текущий increment.

Факты:
- Session 01 bounded static audit завершена (f9f2b2efe); полный runtime/dependency
  acceptance остаётся pending. Не повторять завершённый аудит/initial plan.
- Я установил зависимости; переданный npm run build завершил все build targets;
  npm run worker:start вернул status ready. Это user evidence, не pass E2E/tests.
- Рабочая toolchain: Node.js 22.23.4, npm 10.9.9, Bun 1.4.4. Используй её;
  не обновляй версии/не переустанавливай зависимости по умолчанию.
- На инспекции 2026-11-02 после HEAD 62e79cceb были мои 9 modified files и
  untracked scripts/plugin-trusted-dependencies.json. Проверь свежий Git:
  docs-коммиты могут быть новее, исходные изменения могли быть мной закоммичены.

В ЭТОЙ новой сессии разрешаю source/build-script изменения для step 2,
связанный код целевых проверок, документы и локальные логические коммиты.
Разрешаю read-only preflight tool versions/paths, узкий review необходимых local
dependency manifests/scripts, использование подготовленных dev-зависимостей,
исправленный build:compile и просмотренные целевые локальные проверки этого шага.
Это не разрешение на новую установку/загрузки, npm test целиком, live inference,
worker/MCP/plugin start/restart, установленную конфигурацию или реальные данные.
Не запрашивай повторно уже выданные здесь разрешения.

1. Контекст: AGENTS.md -> docs/enterprise-local/README.md -> memory/STATE.md
   -> docs/roadmap.md (step 2 и graph). Далее memory/TASKS.md, memory/DECISIONS.md,
   DEV-ENVIRONMENT.md, docs/PATCH-SEQUENCE.md §2, AUDIT-CLOSURE первый patch/E15/U2–U4.
   Все сокращённые memory/пути здесь относительны docs/enterprise-local, кроме
   PATCH-SEQUENCE и roadmap, для которых выше явно указан docs/.
   Проверь Git branch/status/HEAD/source drift. Не загружай всю историю/bundles.

2. Зафиксируй владение BUILD-02 через TASKS у единственного coordinator.
   Сначала сохрани мой setup baseline: проверь delta из DEV-ENVIRONMENT, не делай
   reset/stash/cleanup. Если изменения уже закоммичены — используй реальные SHA,
   не создавай дубликат. Если всё ещё WIP, разрешаю отдельно зафиксировать только
   перечисленные setup inputs и подтверждённые generated outputs после review;
   не включай посторонние/новые неизвестные изменения. Явно отдели мой baseline
   от своего нового патча, не утверждай, что старые inputs прошли новые проверки.
   Подходящие subjects в DEV-ENVIRONMENT; исходные install errors неизвестны.

3. Проверь известный allowScripts drift и новый generator input:
   root добавляет onnxruntime-node/msgpackr-extract, canonical allowlist не менялся;
   plugin trustedDependencies теперь читаются из JSON. Не расширяй trust автоматически
   и не ослабляй guard. Если нужен минимальный consistency fix, сначала установи
   нужный script/политику и сохрани отдельным concern/commit; если разрешения
   недостаточно — запиши точный pending, продолжи pure-compile часть.

4. Реализуй первый patch contract:
   - package.json: явный build:compile; build вызывает его; plugin lock resolution
     и viewer dependency preparation — отдельные explicit commands;
   - scripts/build-viewer.js: убрать npm ci; оставить локальные tsc/Vite,
     Windows invocation/cwd/error propagation и fail без auto-install при missing inputs;
   - сохранить viewer, generators/verifiers/outputs/attribution checks;
     сохранить мой trust JSON и wiring. Не менять только generated manifest.
   Не добавлять sync/restart/registration/runtime binary compile/repair в compile.

5. До каждого выполнения прочитай script/fixture и цепочку children. Используй
   существующие зависимости и точные версии. Проверь исправленный compile и
   релевантные минимальные проверки без внешних calls или runtime bootstrap.
   Missing-dependency failure проверяй disposable способом, не удаляя/переименовывая
   мои node_modules. Для process fixtures — synthetic temp HOME/data; реальный
   worker и созданные settings/data не трогать. Проверки, способные вызвать
   SDK/Bedrock/Chroma downloads или services, исключить до отдельного разрешения.
   Если offline enforcement/полный traffic proof недоступны, не заявляй no-egress.
   Если выполнение нельзя ограничить текущим scope, укажи точный blocker и
   продолжи независимую часть. Не делай установки/апгрейды ради зелёного build.

6. Сравни source/manifests/locks/generated delta с сохранённым user baseline;
   проверь, что compile не запускает installers/lock resolution/sync/restart.
   Результаты pass/fail/pending с command/cwd/source/input hashes и причиной;
   пользовательский прежний build не выдавай за свою проверку нового кода.

7. Поддерживай самодостаточную repo memory по TASKS: current STATE, WORKLOG delta,
   решения DECISIONS, фактический DEV-ENVIRONMENT, PATCH-SEQUENCE §2, ownership board.
   Обнови NEXT-SESSION под следующий минимальный шаг: context files, task IDs,
   разрешения, критерии завершения. Замени устаревшие активные указания, сохрани
   исторические evidence/решения; не оставляй противоречащие handoffs.
   Roadmap status по факту, edges только при изменении зависимостей.
   Никакого completed/shipped при невыполненных acceptance gates.

Сохраняем viewer, SQLite canonical + Chroma derived и upstream capture/retrieval/
projects/worktrees semantics. Никаких scope/DLP/identity/schema redesign.
Без AWS, реальных credentials/memories/user settings, registry/PATH/plugin registration,
остановки/рестарта моего worker, push, upstream update и перехода к step 3.
Без новых веток/worktrees/subagents: текущая сессия serial; будущий параллелизм
только по отдельному запросу с claims/file ownership через TASKS.

Финал: изменения, baseline/new commits, проверки/ограничения/rollback,
один следующий шаг и свежий copyable prompt. Затем остановись.
```
