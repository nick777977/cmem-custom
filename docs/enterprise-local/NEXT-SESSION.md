# Next session: BUILD-02-TRUST-APPLY — explicit policy selection first

Updated: 2026-11-02 after the bounded BUILD-02-TRUST review. This replaces the
completed review launcher. The review applied no policy; this document is not consent.
Owner must select A/B/C before dependent edits. Step 2 remains in progress.

Review entry/source SHA: `66a4c961da95d21526d00c44cad26199b8eda59e`; review docs commit
follows it in Git log. [BUILD-02-TRUST](handoffs/BUILD-02-TRUST.md) is the bounded
policy/evidence source. A is recommended: remove only root ONNX/msgpackr npm extras;
retain JSON/generator/plugin/lock byte-for-byte. B additionally revokes ONNX Bun trust
in paired JSON/plugin/lock lists. C broadens canonical npm permission (not recommended).
No choice grants lifecycle execution, acquisition or runtime work.

## Copyable prompt

Replace the selection slot with one explicit choice. An unfilled slot is not approval;
prepare/clarify only the missing choice, without changing policy.

```text
Продолжаем в C:/0/ai/claude/claude-mem-custom/cmem-light,
ветка feat/cmem-light-local. Только BUILD-02-TRUST-APPLY, продолжение step 2.
Мой явный выбор политики: <A, B или C — заменить перед запуском>.

BUILD-02-TRUST review завершён при source SHA 66a4c961da95d21526d00c44cad26199b8eda59e;
результат в docs/enterprise-local/handoffs/BUILD-02-TRUST.md, docs commit — в Git log.
Policy пока не применена. Последний actual guard — Session 02 FAIL exit 1.
Canonical/plugin npm maps: 28; root: 30, extras только onnxruntime-node/msgpackr-extract.
JSON/plugin/lock Bun trust уже совпадают: 26 имён; root Bun trust: отдельные 11.
npm 10.9.9 не фильтрует lifecycle по этим manifest fields; Bun 1.4.4 explicit trust
заменяет defaults. Сохранение trust не разрешает исполнение lifecycle scripts.

Уже сохранено: user setup 49e4f65e1/ce7ded4dc; pure compile 153a9953c;
Windows fixture 705cd1dc9. Compile PASS; 6 boundary + 21 syntax PASS;
199 tracked outputs и 15 selected inputs/sentinels тогда не изменились.
Не повторять аудит, baseline-коммиты, installed lifecycle review или compile
без новой причины. Полного no-egress/runtime acceptance нет.

Чтение: AGENTS -> docs/enterprise-local/README.md -> memory/STATE.md ->
docs/roadmap.md step 2/graph -> memory/TASKS.md -> memory/DECISIONS.md P09/A13 ->
DEV-ENVIRONMENT.md current Session 02 и BUILD-02-TRUST -> handoffs/BUILD-02-TRUST.md ->
docs/PATCH-SEQUENCE.md §2. memory/, handoffs/, DEV-ENVIRONMENT относительно
docs/enterprise-local. Проверь свежие branch/status/HEAD.
Claim BUILD-02-TRUST-APPLY в TASKS, один coordinator, serial, без чужого WIP.

Разрешаю только выбранный declaration delta и логические локальные commits:
A: удалить только два root allowScripts extras. Canonical/guard, trust JSON,
generator, plugin manifest и lock оставить byte-for-byte прежними.
B: как A, плюс удалить только onnxruntime-node из JSON и paired plugin/lock Bun trust
(26 -> 25). Сохранить JSON file/generator, все grammar/CLI entries, versions,
overrides/integrities/dependency graph. Сначала проверить точность paired delta;
не использовать install/resolution, чтобы согласовать metadata. Если без этого
нельзя обосновать корректность lock — записать точный blocker и остановиться.
C: добавить только два extras в canonical и согласовать root/plugin npm map (30).
Bun JSON/trust/lock не расширять; никаких разрешений на запуск installer.
Если выбор не заполнен/неоднозначен — сначала один предметный вопрос, без policy edits.

Перед выполнением перечитай guard; разрешаю прямой запуск этого read-only guard
точным Node 22.23.4, static set/hash checks и docs validation. Не запускать npm install,
ci, bun install/trust, lifecycle scripts, generators/build/compile для варианта A.
Для B/C меняй только необходимые reviewed source/generated declarations; без build
или нового dependency graph. Запиши actual guard exit/result, не выдай structural
comparison за запуск guard. Сверь source/JSON/output/lock pairing и scope diff.

Node 22.23.4/npm 10.9.9/Bun 1.4.4 уже существуют; точные пути в DEV-ENVIRONMENT.
Default PATH был другим; только process-local PATH, без глобальных переключений.
Никаких installs/downloads/upgrades, lock resolution, сервисов/worker/MCP/plugin
start/restart, AWS/live inference, real credentials/settings/databases/user data,
push, новых веток/worktrees/subagents или step 3. Preserve viewer, SQLite canonical /
Chroma derived и memory/project/worktree/sharing/filter/capture/retrieval semantics.

Закрой STATE/TASKS/WORKLOG/DECISIONS/DEV-ENVIRONMENT/PATCH-SEQUENCE по факту;
не меняй roadmap dependencies без причины и не объявляй step 2 completed/shipped.
OS-offline, root-lock provenance, clean closure/reproducibility и runtime gates отдельно.
Обнови NEXT-SESSION одним bounded prompt, не начинай следующий increment.
Финал: выбранная policy, exact diff/commits, реальные проверки/ограничения и next prompt.
```
