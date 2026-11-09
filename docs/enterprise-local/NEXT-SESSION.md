# Next implementation: WINDOWS-09-LOCAL — user-level bootstrap and Codex integration

Current authority A27 (2026-11-04): clarified functional phase one, not another
blocked-native API review. Existing plan owns all numbered steps; no parallel tree.

~~~text
Продолжаем cmem-light, feat/cmem-light-local, один coordinator serial, no agents/
branches/worktrees/push. AGENTS -> README -> STATE -> roadmap phase-one route ->
TASKS -> VALIDATION A27 -> LLM-PROFILES -> DEV-ENVIRONMENT. Branch/status/HEAD,
exact source/test/generator/output claim до edits. Историю и готовые checks не повторять.

Реализуй WINDOWS-09-LOCAL: рабочую user-level подготовку и локальную Codex-привязку
нашего build. Codex CLI найден: 0.166.0-alpha.6; Node22.23.4/npm10.9.9/Bun1.4.4
сохранить, Python3.13.15 только найден, совместимость Chroma ещё не доказана.
Сначала direct installer/launcher/Codex consumers, затем concrete bounded source
slice и нужные checks; не восстанавливать старый signup/bootstrap целиком.

Сборка, зависимости, setup/install/run/uninstall обязательно без admin/UAC:
user/project-local инструменты/venv/config/data, без machine PATH/registry/system
services. Необходимые пакеты/runtime/model downloads и bootstrap разрешены; выбрать
только реальные зависимости из официальных/корпоративных источников, inspect scripts,
фиксировать versions/inputs. Не переустанавливать совместимое окружение без причины.
Никакой CMEM регистрации/аккаунта/SAML/subscription, telemetry/cloud corpus sync/
невыбранного gateway/model/auth fallback. Никакой публичной marketplace публикации.

Сделать supported local Codex catalog/config и явные пути к нашему build, учитывать
фактическую CLI version/help; публичный marketplace не нужен. Отдельные тестовые
папки/settings/data, реальную память не читать/не мигрировать. Изменения основного
host config — только конкретные reviewed правки с rollback, не перезаписывать профиль.
Сохранить Claude Code Enterprise/Bedrock/AWS SSO и другие selected adapters; выбор
host не должен неявно выбирать observer/model/auth. На корпоративном AWS сейчас не тестировать.

Три baseline TS2345 — SettingsDefaults vs Record<string,string> в Chroma helpers;
исправлять корректный контракт по необходимости, не type-cast ради green и не
объяснять отсутствием Chrome. Специальный native OS sandbox/CI не prerequisites
первой версии. Reuse runner/fixtures, ordinary timeouts/owned cleanup, не fake V3.
Source runCase native refusal менять только в concrete reviewed implementation;
никакого label/callback approval, image/PID/global-port kill.

После relevant source delta targeted tests, typechecks и reviewed build:compile
по документированному boundary с input/source/generated fingerprints; dependency
preparation отдельно от compile, без build-and-sync/dev/deploy сюрпризов.
Затем реальные bounded compiled-process/local setup checks в synthetic data.
Не считать step9 готовым без рабочего no-admin host setup/lifecycle evidence.

Codex login и gpt-6-luna одобрены для максимум 3 коротких synthetic live calls.
Проверить доступность модели до inference. При недоступности показать результат и
предложить вариант. Без fallback/automatic retries. Сохранить общий бюджет на всю проверку.
Секреты не выводить; штатная auth только выбранного профиля. Большую регрессию гонять
с deterministic fake LLM, настоящие вызовы только для связки/setup acceptance.

Bun SQLite 3.53.4, WAL, reopen и FTS5 уже проверены на отдельном файле. Системный
SQLite не нужен. В проверенных Python 3.13/user-site/.venv/venv каталогах нет
chromadb/chroma-mcp. Для шага 7 выбрать совместимое пользовательское окружение
Python и локальные embeddings, установить туда и проверить реальную связку.

Документировать actual checks/no-admin limits, preservation/rollback и следующую
конкретную задачу в STATE/TASKS/WORKLOG/DECISIONS/contracts/environment/NEXT-SESSION.
Исторические 09/09B/09C/09D/09E/09F commits сохранить. Local logical commits
hooks/signing off разрешены; sandbox .git write approval не Windows admin elevation.
~~~
