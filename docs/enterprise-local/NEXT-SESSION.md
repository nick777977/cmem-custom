# Next session: BUILD-02-TRUST — bounded lifecycle consistency review

Updated: 2026-11-02 after Session 02. This replaces the completed baseline/compile
launcher. It grants no new work until the user launches it. Step 2 remains in progress;
no instruction here advances to step 3.

Current source/test HEAD: `705cd1dc9a6dcf805d9748cc85715239f13eac7e`; later docs commit
is in Git log. Baseline: `49e4f65e1` inputs, `ce7ded4dc` bundles. Pure compile:
`153a9953c` PASS, 6 boundary + 21 syntax checks PASS, zero tracked generated delta.
Allowlist guard FAILS on known preserved root drift. Full OS-offline/clean dependency
provenance and runtime acceptance remain pending. [BUILD-02](handoffs/BUILD-02.md)
contains durable commands, hashes, failures, observed child classes and rollback.

## Copyable prompt

```text
Продолжаем в C:/0/ai/claude/claude-mem-custom/cmem-light,
ветка feat/cmem-light-local. Выполни только BUILD-02-TRUST, продолжение step 2.

Session 02 уже выполнена: user setup сохранён 49e4f65e1/ce7ded4dc,
pure compile — 153a9953c, Windows syntax fixture — 705cd1dc9.
Agent build:compile PASS; 6 boundary + 21 syntax checks PASS; 199 tracked outputs
и 15 selected inputs/sentinels не изменились. Не повторяй аудит, baseline-коммиты
или compile без новой причины. Не выдавай это за полный no-egress/runtime acceptance.

Задача: подготовить конкретное согласование lifecycle/trust policy, которое устраняет
известный drift без автоматического расширения trust или потери моего setup.
Root allowScripts содержит onnxruntime-node/msgpackr-extract, canonical list их
не содержит; guard реально FAIL exit 1. Новый scripts/plugin-trusted-dependencies.json
уже используется генератором и должен сохраняться согласованно с outputs/lock.
Наличие записи в моём baseline не доказывает разрешённость любого lifecycle script.

Разрешаю чтение нужных repository files и узкий read-only review существующих local
package manifests/lifecycle scripts для этих двух extras и текущего trust JSON,
planning/evidence docs и логические локальные docs-коммиты. Сохраняются ранее выданные
разрешения на step-2 source/build/целевые проверки, но эта задача сначала должна дать
конкретный policy review. Никаких новых installs/downloads/upgrade или исполнения
lifecycle scripts. Не меняй trust maps, canonical list, guard или lock до обоснованного
выбора политики. Если необходимо решение владельца — сначала подготовь точные варианты
с последствиями, затем задай один предметный вопрос; не спрашивай снова о разрешённом
чтении/документах. После review остановись, не начинай следующий increment.

Порядок:
1. AGENTS.md -> docs/enterprise-local/README.md -> memory/STATE.md -> docs/roadmap.md
   step 2/graph -> memory/TASKS.md -> memory/DECISIONS.md -> DEV-ENVIRONMENT.md,
   раздел Current Session 02 -> handoffs/BUILD-02.md Pending policy -> PATCH-SEQUENCE §2.
   memory/, handoffs/ и DEV-ENVIRONMENT здесь относительно docs/enterprise-local;
   roadmap и PATCH-SEQUENCE — относительно docs/. Проверь свежие Git branch/status/HEAD.
2. Claim BUILD-02-TRUST через TASKS, один coordinator, serial. Не трогай чужой WIP.
   Не пересоздавай уже сохранённые baseline/source commits. Не читай реальные credentials,
   settings, memory databases или installed plugin state.
3. Сравни root allowScripts, canonical postinstall-allowlist.js, check guard,
   build-hooks generator, trust JSON, plugin manifest/lock и точечные local lifecycle
   scripts. Установи отдельно npm 10.9.9 semantics и Bun 1.4.4 trust semantics;
   отличай static evidence, inference и unknown. Если нужна документация, используй
   первичные источники без скачивания пакетов. Не считай успешный compile доводом
   за разрешение installer. Известны потенциальные NuGet downloads у ONNX postinstall
   и fallback node-gyp у msgpackr-extract; это не запускалось.
4. Составь один bounded review в handoffs/BUILD-02-TRUST.md: цель каждого permission,
   нужен ли он compile или только preparation/runtime, reachable script/children,
   доказательства path:line + source SHA либо local input hash, рекомендуемый вариант
   согласования, риски/rollback и точный pending policy choice. Не ослабляй guard.
   Не удаляй/не расширяй user trust JSON молча. Не генерируй новый dependency graph.
5. Обнови STATE/TASKS/WORKLOG/DECISIONS/DEV-ENVIRONMENT и NEXT-SESSION по факту.
   Отдели это от оставшихся OS-offline/root-lock/provenance gates. Roadmap dependencies
   не меняются без реальной причины; step 2 не объявляй shipped/completed.

Используй существующие Node 22.23.4/npm 10.9.9/Bun 1.4.4, если потребуется read-only
version preflight. DEV-ENVIRONMENT содержит точные пути: default PATH давал другие
версии. Только process-local PATH, без глобальных переключений/регистрации.
Сохраняем viewer, SQLite canonical/Chroma derived и memory/project/worktree/sharing/
filter/capture/retrieval semantics. Без AWS, live inference, worker/MCP/plugin
start/restart, user data, push, новых веток/worktrees/subagents и step 3.

Финал: policy findings/конкретное предложение, docs commit, pending choice,
один следующий самодостаточный prompt. Затем остановись.
```
