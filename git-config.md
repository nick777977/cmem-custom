[2026-11-12 21:31:25 UTC+01:00]

# Полная миграция Git-истории между двумя GitHub-аккаунтами через PowerShell 7

Инструкция адаптирована под Windows и PowerShell 7.6.9. Git Bash и WSL не потребуются.

Исходные параметры:

| Параметр              | Значение                         |
| --------------------- | -------------------------------- |
| Старый GitHub-аккаунт | `nick777977`                     |
| Старый репозиторий    | `cmem-custom`                    |
| Новый GitHub-аккаунт  | Определяется автоматически       |
| Новый репозиторий     | `local-dash-cmm` или `local-cmm` |
| Новый Author Name     | Из глобальной конфигурации Git   |
| Новый Author Email    | Из глобальной конфигурации Git   |
| Инструмент миграции   | `git-filter-repo`                |
| Терминал              | PowerShell 7                     |

Ты указал два варианта названия нового репозитория, поэтому предусмотрел ввод точного названия непосредственно в PowerShell.

## 0. Ожидаемый результат

nick777977/cmem-custom

Исходный репозиторий

git-filter-repo

Замена Author, Committer, TaggerСохранение файлов, дат, сообщений и графа истории

NEW_ACCOUNT/local-dash-cmm

Независимый репозиторий с переписанной историей

| Что произойдёт               | Результат       |
| ---------------------------- | --------------- |
| Author Name                  | Новый           |
| Author Email                 | Новый           |
| Committer Name               | Новый           |
| Committer Email              | Новый           |
| Tagger                       | Новый           |
| Commit messages              | Без изменений   |
| Даты создания коммитов       | Без изменений   |
| Даты коммиттеров             | Без изменений   |
| Часовые пояса                | Без изменений   |
| Содержимое файлов            | Без изменений   |
| Ветки                        | Сохраняются     |
| Merge-коммиты                | Сохраняются     |
| Теги                         | Сохраняются     |
| Commit SHA                   | Пересчитываются |
| Криптографические подписи    | Удаляются       |
| Старый репозиторий на GitHub | Не изменяется   |

Все команды выполняй последовательно в одной сессии PowerShell.

# Этап 1. Подготовка окружения

## 1.1. Проверяем инструменты

```
$PSVersionTable.PSVersion

git --version

py -3 --version

gh --version
```

Если Python или GitHub CLI не установлены:

```
winget install --id Python.Python.3.13 -e
```

```
winget install --id GitHub.cli -e
```

После установки при необходимости перезапусти PowerShell.

## 1.2. Устанавливаем git-filter-repo

```
py -3 -m pip install --upgrade git-filter-repo
```

Проверяем:

```
git filter-repo --version
```

Если Windows не находит `git-filter-repo`, добавь директорию Python Scripts в PATH либо используй:

```
py -3 -m git_filter_repo --version
```

Особенности установки на Windows описаны в [официальной документации git-filter-repo](https://github.com/newren/git-filter-repo/blob/main/INSTALL.md?utm_source=chatgpt.com).&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub



## 1.3. Настраиваем безопасное выполнение команд

Следующий вспомогательный метод будет останавливать соответствующий блок команд при ошибке Git.

```
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false

function Invoke-GitChecked {
    & git @args

    if ($LASTEXITCODE -ne 0) {
        throw "Git command failed: $($args -join ' ')"
    }
}
```

# Этап 2. Получаем данные нового пользователя

## 2.1. Проверяем глобальную конфигурацию Git

```
git config --global user.name
git config --global user.email
```

Также можно посмотреть полную глобальную конфигурацию:

```
git config --global --list
```

## 2.2. Сохраняем данные в переменные

```
$NewName = Invoke-GitChecked config --global --get user.name

$NewEmail = Invoke-GitChecked config --global --get user.email

if (
    [string]::IsNullOrWhiteSpace($NewName) -or
    [string]::IsNullOrWhiteSpace($NewEmail)
) {
    throw 'Global Git identity is missing'
}

$env:NEW_GIT_NAME = $NewName
$env:NEW_GIT_EMAIL = $NewEmail

Write-Host "New author name:  $NewName"
Write-Host "New author email: $NewEmail"
```

Именно эти данные автоматически будут использованы при переписывании всех коммитов.

## 2.3. Проверяем email в GitHub

Открой настройки второго аккаунта:

[https://github.com/settings/emails](https://github.com/settings/emails?utm_source=chatgpt.com)

GitHub определяет принадлежность коммита к профилю по email автора, а не по `user.name`. Поэтому глобальный email должен быть привязан к новому GitHub-аккаунту.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.github.com\&sz=32)

GitHub Docs



Допустимо использовать и приватный GitHub email вида:

```
ACCOUNT_ID+USERNAME@users.noreply.github.com
```

# Этап 3. Подготавливаем исходный репозиторий

## 3.1. Переходим в склонированный репозиторий

Например:

```
Set-Location "C:\Projects\cmem-custom"
```

Укажи свой фактический путь.

## 3.2. Проверяем состояние репозитория

```
git status

git remote -v

git branch -a

git tag

git rev-parse --is-shallow-repository
```

Проверь, что текущий `origin` действительно относится к исходному репозиторию аккаунта `nick777977`.

Если репозиторий shallow, загружаем полную историю:

```
if (
    (Invoke-GitChecked rev-parse --is-shallow-repository) -eq 'true'
) {
    Invoke-GitChecked fetch --unshallow origin
}
```

Загружаем все актуальные удалённые ветки и теги:

```
Invoke-GitChecked fetch --prune --tags origin `
    '+refs/heads/*:refs/remotes/origin/*'
```

Эта команда не изменяет файлы проекта или коммиты локальных веток, но обновляет remote-tracking refs.

Если исходный репозиторий приватный, для этой операции потребуется доступ к нему.

## 3.3. Проверяем всех существующих авторов

```
git log --all --format='%an <%ae>' |
    Sort-Object -Unique
```

Проверяем коммиттеров:

```
git log --all --format='%cn <%ce>' |
    Sort-Object -Unique
```

Смотрим историю:

```
git log --all --graph --oneline --decorate
```

Важно: дальнейшая команда заменит абсолютно всех авторов и коммиттеров в сохраняемой истории. Используй её для коммитов, действительно принадлежащих тебе. Если в списке присутствуют другие разработчики, их авторство следует сохранить посредством выборочной миграции.

# Этап 4. Создаём резервную копию

Я намеренно не рекомендую переписывать исходный локальный репозиторий. Лучше создать отдельное пространство для миграции.

## 4.1. Определяем директории

```
$Source = Invoke-GitChecked rev-parse --show-toplevel

$Parent = Split-Path -Parent $Source

$Work = Join-Path $Parent "cmem-identity-migration"

$Backup = Join-Path $Work "original-backup.git"

$Baseline = Join-Path $Work "baseline.git"

$Rewritten = Join-Path $Work "rewritten.git"

if (Test-Path $Work) {
    throw "Migration directory already exists: $Work"
}

New-Item -ItemType Directory -Path $Work | Out-Null
```

## 4.2. Создаём mirror backup

```
Invoke-GitChecked clone --mirror --no-local $Source $Backup
```

Проверяем целостность:

```
Invoke-GitChecked -C $Backup fsck --full
```

Mirror clone сохраняет все доступные Git refs, включая локальные и remote-tracking branches.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://git-scm.com\&sz=32)

git-clone Documentation



## 4.3. Создаём baseline для будущего сравнения

```
Invoke-GitChecked clone --bare --no-local $Backup $Baseline
```

## 4.4. Сохраняем все удалённые ветки

Это обязательный шаг, если ты хочешь сохранить не только `main`, но и остальные ветки.

При обычном `git clone` не все ветки представлены как локальные. Многие находятся в `refs/remotes/origin/`.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://code.googlesource.com\&sz=32)

Git at Google



Следующий код преобразует их в полноценные ветки в копии для миграции.

```
$LocalBranches = @{}

$LocalRefs = Invoke-GitChecked -C $Baseline for-each-ref `
    '--format=%(refname) %(objectname)' `
    refs/heads/

foreach ($Line in $LocalRefs) {
    $Ref, $Sha = $Line -split ' ', 2
    $LocalBranches[$Ref] = $Sha
}

$RemoteRefs = Invoke-GitChecked -C $Backup for-each-ref `
    '--format=%(refname) %(objectname) %(symref)' `
    refs/remotes/origin/

foreach ($Line in $RemoteRefs) {

    $Parts = $Line.Trim() -split '\s+', 3

    $Ref = $Parts[0]
    $Sha = $Parts[1]

    if ($Parts.Count -gt 2) {
        continue
    }

    if ($Ref -eq 'refs/remotes/origin/HEAD') {
        continue
    }

    $Branch = $Ref.Substring('refs/remotes/origin/'.Length)
    $Target = "refs/heads/$Branch"

    if ($LocalBranches.ContainsKey($Target)) {

        $Current = $LocalBranches[$Target]

        if ($Current -eq $Sha) {
            continue
        }

        git -C $Backup merge-base --is-ancestor $Sha $Current
        $AncestorResult = $LASTEXITCODE

        if ($AncestorResult -eq 0) {
            continue
        }

        if ($AncestorResult -ne 1) {
            throw "Cannot compare branch: $Branch"
        }

        git -C $Backup merge-base --is-ancestor $Current $Sha

        if ($LASTEXITCODE -ne 0) {
            throw "Divergent branch: $Branch. Manual review required."
        }
    }

    Invoke-GitChecked -C $Baseline fetch --no-tags `
        $Backup "${Ref}:${Target}"

    Write-Host "Preserved branch: $Branch"
}
```

Если локальная и удалённая ветки разошлись, процедура остановится, чтобы не потерять одну из версий.

## 4.5. Создаём финальную копию для переписывания

```
Invoke-GitChecked clone --bare --no-local $Baseline $Rewritten
```

Теперь у тебя такая структура:

```
Projects/
|
|-- cmem-custom/
|
|-- cmem-identity-migration/
    |
    |-- original-backup.git/
    |-- baseline.git/
    |-- rewritten.git/
```

Назначение:

| Директория            | Для чего                                |
| --------------------- | --------------------------------------- |
| `cmem-custom`         | Оригинальный рабочий репозиторий        |
| `original-backup.git` | Резервная копия всех refs               |
| `baseline.git`        | Оригинальная история для сравнения      |
| `rewritten.git`       | Репозиторий, который будем переписывать |

Проверяем ветки:

```
git -C $Baseline branch

git -C $Rewritten branch

git -C $Rewritten tag
```

# Этап 5. Полностью переписываем Git-историю

Это главная команда всей процедуры.

```
Invoke-GitChecked -C $Rewritten filter-repo `
    --name-callback 'import os; return os.environ["NEW_GIT_NAME"].encode("utf-8")' `
    --email-callback 'import os; return os.environ["NEW_GIT_EMAIL"].encode("utf-8")' `
    --preserve-commit-hashes `
    --preserve-commit-encoding `
    --prune-empty never `
    --prune-degenerate never `
    --no-ff `
    --replace-refs delete-no-add
```

Если используешь Python-модуль вместо команды `git filter-repo`, эквивалентный вариант:

```
Push-Location $Rewritten

try {
    py -3 -m git_filter_repo `
        --name-callback 'import os; return os.environ["NEW_GIT_NAME"].encode("utf-8")' `
        --email-callback 'import os; return os.environ["NEW_GIT_EMAIL"].encode("utf-8")' `
        --preserve-commit-hashes `
        --preserve-commit-encoding `
        --prune-empty never `
        --prune-degenerate never `
        --no-ff `
        --replace-refs delete-no-add

    if ($LASTEXITCODE -ne 0) {
        throw 'History rewrite failed'
    }
}
finally {
    Pop-Location
}
```

Выполняй только один из этих двух вариантов.

### Что делают параметры

| Параметр                       | Назначение                                                    |
| ------------------------------ | ------------------------------------------------------------- |
| `--name-callback`              | Заменяет имена                                                |
| `--email-callback`             | Заменяет email                                                |
| `--preserve-commit-hashes`     | Сохраняет упоминания старых SHA в тексте сообщений            |
| `--preserve-commit-encoding`   | Сохраняет кодировку сообщений                                 |
| `--prune-empty never`          | Сохраняет пустые коммиты                                      |
| `--prune-degenerate never`     | Не удаляет вырожденные merge-коммиты                          |
| `--no-ff`                      | Предотвращает определённые упрощения родителей merge-коммитов |
| `--replace-refs delete-no-add` | Не оставляет Git replace refs                                 |

Официальная документация: [git-filter-repo manual](https://github.com/newren/git-filter-repo/blob/main/Documentation/git-filter-repo.txt?utm_source=chatgpt.com).&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub



Обрати внимание: `--preserve-commit-hashes` не означает сохранение SHA коммитов. Меняется содержимое Git-объектов, поэтому их SHA пересчитываются.

# Этап 6. Проверяем результаты

## 6.1. Проверяем авторов

```
git -C $Rewritten log --all --format='%an <%ae>' |
    Sort-Object -Unique
```

## 6.2. Проверяем коммиттеров

```
git -C $Rewritten log --all --format='%cn <%ce>' |
    Sort-Object -Unique
```

В обоих случаях должна остаться только одна комбинация имени и email нового пользователя.

## 6.3. Проверяем теги

```
git -C $Rewritten for-each-ref `
    '--format=%(refname) %(taggername) %(taggeremail)' `
    refs/tags/
```

Lightweight tags не имеют собственного Tagger, поэтому у них эти поля будут пустыми.

## 6.4. Проверяем количество коммитов

```
$BeforeCount = Invoke-GitChecked -C $Baseline rev-list --all --count

$AfterCount = Invoke-GitChecked -C $Rewritten rev-list --all --count

Write-Host "Before: $BeforeCount"
Write-Host "After:  $AfterCount"

if ($BeforeCount -ne $AfterCount) {
    throw 'Commit count mismatch'
}
```

Количество коммитов должно совпадать.

## 6.5. Проверяем количество и названия веток и тегов

```
$BeforeRefs = Invoke-GitChecked -C $Baseline for-each-ref `
    '--format=%(refname)' refs/heads/ refs/tags/

$AfterRefs = Invoke-GitChecked -C $Rewritten for-each-ref `
    '--format=%(refname)' refs/heads/ refs/tags/

$Differences = Compare-Object `
    -ReferenceObject @($BeforeRefs) `
    -DifferenceObject @($AfterRefs) `
    -CaseSensitive

if ($Differences) {
    $Differences
    throw 'Branches or tags do not match'
}

Write-Host 'All branches and tags match'
```

## 6.6. Проверяем граф истории

```
git -C $Rewritten log --all --graph --oneline --decorate
```

## 6.7. Проверяем целостность Git

```
Invoke-GitChecked -C $Rewritten fsck --full
```

# Этап 7. Полная автоматизированная проверка каждого коммита

Этот этап настоятельно рекомендую не пропускать.

Скрипт проверяет каждый коммит относительно оригинальной истории:

- Author и Committer.
- Обе даты с часовыми поясами.
- Commit message на уровне байтов.
- Содержимое всех файлов через Tree SHA.
- Родительские коммиты и их порядок.
- Отсутствие потерянных или объединённых коммитов.
- Соответствие конечных коммитов каждой ветки.

Запускается непосредственно в PowerShell. Отдельно создавать Python-файл не нужно.

```
$env:GIT_MIGRATION_BASELINE = $Baseline
$env:GIT_MIGRATION_REWRITTEN = $Rewritten

@'
import os
import subprocess
from pathlib import Path

before = os.environ["GIT_MIGRATION_BASELINE"]
after = os.environ["GIT_MIGRATION_REWRITTEN"]

identity = (
    os.environ["NEW_GIT_NAME"]
    + " <"
    + os.environ["NEW_GIT_EMAIL"]
    + ">"
).encode("utf-8")

def git(repo, *args):
    return subprocess.check_output(
        ["git", "-C", repo, *args]
    )

def check(condition, message):
    if not condition:
        raise RuntimeError(message)

def read_commit(repo, sha):
    raw = git(repo, "cat-file", "commit", sha)
    headers, message = raw.split(b"\n\n", 1)

    fields = {}

    for line in headers.splitlines():
        if line.startswith(b" "):
            continue

        key, _, value = line.partition(b" ")
        fields.setdefault(key, []).append(value)

    return fields, message

mapping = {}

map_file = Path(after) / "filter-repo" / "commit-map"

for line in map_file.read_text().splitlines()[1:]:
    old, new = line.split()
    mapping[old] = new

old_commits = set(
    git(before, "rev-list", "--all").decode().split()
)

new_commits = set(
    git(after, "rev-list", "--all").decode().split()
)

check(set(mapping) == old_commits, "Incomplete commit map")

check(
    len(old_commits) == len(new_commits),
    "Commit count mismatch"
)

check(
    set(mapping.values()) == new_commits,
    "Unexpected commit mapping"
)

for old, new in mapping.items():

    a, old_message = read_commit(before, old)
    b, new_message = read_commit(after, new)

    check(
        a[b"tree"] == b[b"tree"],
        f"Tree changed: {old}"
    )

    check(
        old_message == new_message,
        f"Message changed: {old}"
    )

    check(
        a.get(b"encoding") == b.get(b"encoding"),
        f"Encoding changed: {old}"
    )

    expected_parents = [
        mapping[p.decode()].encode()
        for p in a.get(b"parent", [])
    ]

    check(
        expected_parents == b.get(b"parent", []),
        f"Parent topology changed: {old}"
    )

    for field in (b"author", b"committer"):

        _, old_date = a[field][0].rsplit(b"> ", 1)

        new_identity, new_date = b[field][0].rsplit(b"> ", 1)

        check(
            old_date == new_date,
            f"Date changed: {old}"
        )

        check(
            new_identity + b">" == identity,
            f"Identity mismatch: {old}"
        )

def branches(repo):
    result = {}

    for line in git(
        repo, "for-each-ref",
        "--format=%(refname) %(objectname)",
        "refs/heads/"
    ).decode().splitlines():

        ref, sha = line.split()
        result[ref] = sha

    return result

old_branches = branches(before)
new_branches = branches(after)

check(
    set(old_branches) == set(new_branches),
    "Branch list mismatch"
)

for ref, old_sha in old_branches.items():
    check(
        mapping[old_sha] == new_branches[ref],
        f"Branch tip mismatch: {ref}"
    )

print("SUCCESS")
print(f"Verified commits: {len(old_commits)}")
print(f"Verified branches: {len(old_branches)}")
print("Trees, messages, dates, identities and topology match.")
'@ | py -3 -

if ($LASTEXITCODE -ne 0) {
    throw 'History verification failed. DO NOT PUSH.'
}
```

Ожидаемый результат:

SUCCESS

Verified commits: ...

Verified branches: ...

Trees, messages, dates, identities and topology match.

При любой ошибке не продолжай публикацию.

# Этап 8. Проверяем оставшиеся упоминания старого аккаунта

Замена Git Author и Committer не удаляет упоминания пользователя из содержимого файлов и текста коммитов.

## 8.1. Проверяем commit messages

```
git -C $Rewritten log --all --format='%B' |
    Select-String -SimpleMatch 'nick777977'
```

Проверяем дополнительные авторские атрибуты:

```
git -C $Rewritten log --all --format='%B' |
    Select-String -Pattern 'Co-authored-by:|Signed-off-by:'
```

GitHub также учитывает `Co-authored-by` при атрибуции коммитов.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.github.com\&sz=32)

GitHub Docs



## 8.2. Проверяем старый email

```
$OldEmail = Read-Host "Enter previous Git email"

if ($OldEmail) {
    git -C $Rewritten log --all --format='%B' |
        Select-String -SimpleMatch $OldEmail
}
```

## 8.3. Проверяем исторические изменения файлов

```
git -C $Rewritten log --all -i -G 'nick777977' --oneline
```

Также особое внимание стоит уделить следующим файлам:

```
README.md
LICENSE
AUTHORS
CONTRIBUTORS
package.json
.gitmodules
.mailmap
.github/
```

Это предварительный поиск, а не исчерпывающий аудит всех исторических файлов.

Если обнаружатся упоминания старого аккаунта, придётся выбирать между абсолютным сохранением оригинального содержимого и удалением этих упоминаний. Обязательные лицензионные уведомления нужно сохранить.

# Этап 9. Авторизуемся под новым GitHub-аккаунтом

Глобальная конфигурация `user.name` и `user.email` не определяет аккаунт, под которым выполняется push.

Для этого используем GitHub CLI.

## 9.1. Проверяем авторизацию

```
gh auth status
```

Если новый аккаунт ещё не авторизован:

```
gh auth login --hostname github.com --git-protocol https --web
```

Если авторизованы оба аккаунта:

```
gh auth switch --hostname github.com
```

Выбери новый аккаунт. GitHub CLI официально поддерживает переключение между несколькими аккаунтами.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://cli.github.com\&sz=32)

Take GitHub to the command line



## 9.2. Автоматически определяем новый username

```
if ($env:GH_TOKEN -or $env:GITHUB_TOKEN) {
    throw 'Environment token may override GitHub CLI authentication'
}

$NewGitHubUser = gh api user --jq '.login'

if (
    $LASTEXITCODE -ne 0 -or
    [string]::IsNullOrWhiteSpace($NewGitHubUser)
) {
    throw 'GitHub authentication failed'
}

if ($NewGitHubUser -eq 'nick777977') {
    throw 'You are still authenticated as the old GitHub account'
}

Write-Host "New GitHub account: $NewGitHubUser"
```

Этот safeguard не позволит продолжить процедуру под старым аккаунтом.

## 9.3. Настраиваем авторизацию Git для нового репозитория

Чтобы не менять глобальную авторизацию Git для остальных проектов, будем явно использовать GitHub CLI как credential helper только в необходимых командах.

```
function Invoke-NewGit {
    & git `
        -c 'credential.helper=' `
        -c 'credential.helper=!gh auth git-credential' `
        @args

    if ($LASTEXITCODE -ne 0) {
        throw "Authenticated Git command failed"
    }
}
```

# Этап 10. Подключаем новый Origin

## 10.1. Указываем название нового репозитория

```
$RepoName = Read-Host "Enter exact new repository name"

if ([string]::IsNullOrWhiteSpace($RepoName)) {
    throw 'Repository name is missing'
}

$TargetRepo = "$NewGitHubUser/$RepoName"

$TargetUrl = "https://github.com/$TargetRepo.git"

Write-Host "Target repository: $TargetRepo"
Write-Host "Target URL: $TargetUrl"
```

Введи `local-dash-cmm` или `local-cmm`, в зависимости от его фактического названия.

## 10.2. Проверяем целевой репозиторий через GitHub API

```
$RepoJson = gh repo view $TargetRepo `
    --json nameWithOwner,isEmpty,isFork,isPrivate,viewerPermission

if ($LASTEXITCODE -ne 0) {
    throw 'Target repository cannot be accessed'
}

$RepoInfo = $RepoJson | ConvertFrom-Json

$RepoInfo | Format-List

if ($RepoInfo.nameWithOwner -ne $TargetRepo) {
    throw 'Incorrect repository owner or name'
}

if (-not $RepoInfo.isEmpty) {
    throw 'Target repository is not empty'
}

if ($RepoInfo.isFork) {
    throw 'Target repository is a fork'
}

if ($RepoInfo.viewerPermission -notin @('ADMIN', 'MAINTAIN', 'WRITE')) {
    throw 'Insufficient repository permissions'
}
```

Все используемые поля поддерживаются официальной командой `gh repo view`.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://cli.github.com\&sz=32)

Take GitHub to the command line



Если проект содержит конфиденциальный код, убедись также, что `isPrivate` имеет значение `True`.

## 10.3. Устанавливаем новый origin

```
$ExistingRemotes = @(
    Invoke-GitChecked -C $Rewritten remote
)

if ($ExistingRemotes -contains 'origin') {
    Invoke-GitChecked -C $Rewritten remote remove origin
}

Invoke-GitChecked -C $Rewritten remote add origin $TargetUrl
```

Проверяем:

```
git -C $Rewritten remote -v
```

Должен отображаться только новый репозиторий как `origin`.

## 10.4. Дополнительная проверка пустоты

```
$RemoteRefs = @(
    Invoke-NewGit -C $Rewritten ls-remote origin
)

if ($RemoteRefs.Count -ne 0) {
    throw 'Remote repository already contains refs'
}

Write-Host 'Target repository is empty'
```

# Этап 11. Публикуем новую историю

## 11.1. Проверяем публикуемые refs

```
git -C $Rewritten for-each-ref '--format=%(refname)'
```

Должны присутствовать только нужные ветки и теги.

```
$UnexpectedRefs = @(
    Invoke-GitChecked -C $Rewritten for-each-ref '--format=%(refname)' |
        Where-Object {
            $_ -notmatch '^refs/(heads|tags)/'
        }
)

if ($UnexpectedRefs.Count -gt 0) {
    $UnexpectedRefs
    throw 'Unexpected refs detected'
}
```

## 11.2. Формируем refspec

```
$PushRefspecs = @(
    'refs/heads/*:refs/heads/*'
)

$Tags = @(
    Invoke-GitChecked -C $Rewritten tag
)

if ($Tags.Count -gt 0) {
    $PushRefspecs += 'refs/tags/*:refs/tags/*'
}
```

## 11.3. Выполняем dry-run

```
Invoke-NewGit -C $Rewritten push `
    --dry-run `
    --atomic `
    origin `
    @PushRefspecs
```

На этом этапе Git не публикует refs.

## 11.4. Выполняем настоящий push

```
$Confirmation = Read-Host "Type PUSH to publish to $TargetRepo"

if ($Confirmation -cne 'PUSH') {
    throw 'Publication cancelled'
}

Invoke-NewGit -C $Rewritten push `
    --atomic `
    origin `
    @PushRefspecs
```

Атомарная публикация позволяет обновить все указанные refs вместе либо не обновлять ни одного при ошибке, если сервер поддерживает `--atomic`.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://git-scm.com\&sz=32)

git-push Documentation



Не используй:

```
git push --force
```

или:

```
git push --mirror
```

Для пустого репозитория принудительная публикация не нужна. Mirror push также может отправить нежелательные технические refs.

# Этап 12. Финальная проверка после публикации

## 12.1. Сравниваем локальные и удалённые refs

```
$LocalRefs = @(
    Invoke-GitChecked -C $Rewritten for-each-ref `
        '--format=%(objectname)%09%(refname)' `
        refs/heads/ refs/tags/
)

$PublishedRefs = @(
    Invoke-NewGit -C $Rewritten ls-remote `
        --refs origin
)

$Differences = Compare-Object `
    -ReferenceObject $LocalRefs `
    -DifferenceObject $PublishedRefs `
    -CaseSensitive

if ($Differences) {
    $Differences
    throw 'Published refs do not match'
}

Write-Host 'All branches and tags successfully published'
```

## 12.2. Устанавливаем main как default branch

Если исходная основная ветка называлась `main`:

```
gh repo edit $TargetRepo --default-branch main
```

## 12.3. Открываем новый репозиторий

```
Start-Process "https://github.com/$TargetRepo"
```

Проверяем Contributors:

```
Start-Process "https://github.com/$TargetRepo/graphs/contributors"
```

Проверяем историю:

```
Start-Process "https://github.com/$TargetRepo/commits/main/"
```

GitHub может потребоваться до 24 часов для обновления персональной статистики contributions.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.github.com\&sz=32)

GitHub Docs



# Этап 13. Создаём новую рабочую копию

После успешной публикации лучше полностью прекратить работу со старым клоном.

```
Set-Location $Parent

Invoke-NewGit clone $TargetUrl
```

```
Set-Location $RepoName
```

Устанавливаем правильное авторство непосредственно в новом репозитории:

```
git config --local user.name $NewName

git config --local user.email $NewEmail
```

Закрепляем авторизацию через GitHub CLI для этого репозитория:

```
git config --local --replace-all credential.helper ""

git config --local --add credential.helper '!gh auth git-credential'
```

Проверяем:

```
git var GIT_AUTHOR_IDENT

git var GIT_COMMITTER_IDENT

git remote -v

git config --show-origin --get-regexp '^user\.'
```

Теперь можно продолжать разработку в новом репозитории.

# Дополнительные нюансы

| Компонент                  | Что произойдёт                                   |
| -------------------------- | ------------------------------------------------ |
| GPG/SSH signatures         | Оригинальные подписи удаляются                   |
| Verified badges            | Могут исчезнуть                                  |
| Git LFS                    | Требуется отдельный перенос объектов             |
| Submodules                 | История вложенных репозиториев не переписывается |
| GitHub Releases            | Нужно переносить отдельно                        |
| Issues / Pull Requests     | Не переносятся                                   |
| GitHub Actions workflows   | Файлы сохраняются                                |
| Actions history            | Не переносится                                   |
| GitHub Secrets             | Не переносятся                                   |
| Старые репозитории и форки | Остаются неизменными                             |

Если используется Git LFS, до публикации необходимо дополнительно загрузить LFS-объекты из исходного репозитория и перенести их в новый. Обычный Git clone не гарантирует наличие всех LFS-объектов.

[Официальная инструкция GitHub по переносу репозиториев с Git LFS](https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository?utm_source=chatgpt.com).&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.github.com\&sz=32)

GitHub Docs



# Итоговый checklist

### Git Identity Migration

0 / 18

Проверить глобальный user.name и user.email

Проверить принадлежность email новому аккаунту

Загрузить все ветки и теги

Проверить существующих авторов

Создать mirror backup

Создать baseline со всеми ветками

Создать rewritten.git

Выполнить git-filter-repo

Проверить количество коммитов и веток

Выполнить автоматизированную проверку каждого коммита

Проверить остаточные упоминания старого аккаунта

Авторизоваться под новым GitHub-аккаунтом

Проверить пустоту нового репозитория

Подключить новый origin

Выполнить dry-run

Опубликовать переписанную историю

Сравнить локальные и удалённые refs

Клонировать новый репозиторий

Скопировать checklist

Главное: этот подход переносит всю Git-историю в независимый репозиторий, используя данные второго аккаунта из глобальной конфигурации Windows. Исходные коммиты и старый удалённый репозиторий не переписываются.

Инструкция сверена с официальной документацией, но непосредственно на твоём репозитории и установленной версии PowerShell не выполнялась. Поэтому обязательны резервная копия, автоматизированный аудит и dry-run.

Также невозможно гарантировать абсолютную невозможность установить происхождение проекта: оригинальная история может оставаться в старом репозитории, форках, клонах и кэшированных представлениях GitHub.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.github.com\&sz=32)

GitHub Docs


Прочитай полностью docs/enterprise-local/CLAUDE-CODE-BOOTSTRAP.md
и следуй ему как стартовому промпту продолжения разработки.

Соблюдай CLAUDE.md и AGENTS.md, прочитай указанный обязательный
контекст, проверь фактическое состояние репозитория и окружения.

Проведи предусмотренный ограниченный критический анализ,
затем продолжай существующий roadmap с актуальной следующей задачи.
Решение A40 о Haiku через Bedrock/SSO уже принято.