param(
    [Parameter(Mandatory)] [string] $Python,
    [Parameter(Mandatory)] [string] $RuntimeDir
)

$ErrorActionPreference = 'Stop'
if ($Python -notmatch '^[a-z]:[\\/]' -or $RuntimeDir -notmatch '^[a-z]:[\\/]') {
    throw 'Supply absolute local drive paths for Python and RuntimeDir.'
}
$identity = & $Python -I -c "import sys, sysconfig; print(sys.version.split()[0], sysconfig.get_platform())"
if ($LASTEXITCODE -ne 0 -or $identity -ne '3.13.15 win-amd64') {
    throw 'This wheel lock requires CPython 3.13.15 for Windows x64.'
}

New-Item -ItemType Directory -Force -Path $RuntimeDir | Out-Null
$venv = Join-Path $RuntimeDir 'venv'
$localPython = Join-Path $venv 'Scripts/python.exe'
if (!(Test-Path -LiteralPath $localPython -PathType Leaf)) {
    & $Python -I -m venv $venv
    if ($LASTEXITCODE -ne 0) { throw 'Could not create the local virtual environment.' }
}
$identity = & $localPython -I -c "import sys, sysconfig; assert sys.prefix != sys.base_prefix; print(sys.version.split()[0], sysconfig.get_platform())"
if ($LASTEXITCODE -ne 0 -or $identity -ne '3.13.15 win-amd64') {
    throw 'The existing local virtual environment does not match the wheel lock.'
}

$previousPipConfig = $env:PIP_CONFIG_FILE
try {
    $env:PIP_CONFIG_FILE = 'NUL'
    & $localPython -I -m pip --isolated --disable-pip-version-check --no-cache-dir install --no-input `
        --index-url https://pypi.org/simple --retries 0 --timeout 30 --only-binary=:all: `
        --require-hashes -r (Join-Path $PSScriptRoot 'chroma-local-requirements.txt')
    if ($LASTEXITCODE -ne 0) { throw 'Could not install the pinned PyPI wheels.' }
    & $localPython -I -m pip --isolated --disable-pip-version-check check
    if ($LASTEXITCODE -ne 0) { throw 'The local wheel dependencies are inconsistent.' }
} finally {
    $env:PIP_CONFIG_FILE = $previousPipConfig
}

$revision = 'e8f8c211226b894fcb81acc59f3b34ba3efd5f42'
$source = "https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/resolve/$revision"
$modelDir = Join-Path $RuntimeDir 'model'
New-Item -ItemType Directory -Force -Path $modelDir | Out-Null
$assets = @{
    'tokenizer.json' = '2c3387be76557bd40970cec13153b3bbf80407865484b209e655e5e4729076b8'
    'onnx/model.onnx' = '10f7a088420252b26caf819236ca2c9d2987afd0fc06fec7553b542a5655a05a'
}
foreach ($relative in $assets.Keys) {
    $file = Join-Path $modelDir (Split-Path $relative -Leaf)
    if (Test-Path -LiteralPath $file) {
        if ((Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash -ne $assets[$relative]) {
            throw "Existing asset failed SHA-256 verification at $file. Move it aside before retrying preparation."
        }
        continue
    }
    & curl.exe -q --fail --silent --show-error --location --proto '=https' --proto-redir '=https' `
        --max-time 360 --output "$file.part" "$source/$relative"
    if ($LASTEXITCODE -ne 0) { throw "Could not stage $relative." }
    if ((Get-FileHash -LiteralPath "$file.part" -Algorithm SHA256).Hash -ne $assets[$relative]) {
        throw "Downloaded asset failed SHA-256 verification at $file.part."
    }
    Move-Item -LiteralPath "$file.part" -Destination $file
}
Write-Output "Set CLAUDE_MEM_CHROMA_RUNTIME_DIR to $RuntimeDir in the worker settings."
