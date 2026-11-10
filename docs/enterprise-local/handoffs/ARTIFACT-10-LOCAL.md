# ARTIFACT-10-LOCAL

Windows x64, 2026-11-10, one coordinator on `feat/cmem-light-local`. Clean
entry `cb9738a2778860b66ed604c887b243231d39935a`. The paired implementation
and emitted bytes are from `2bb4746b2d1ab20f06501b80358cbc6ecbe490d9`.

- [Candidate inventory](../artifacts/windows-x64-inventory.json) pins the
  unregistered private install tree, stage inputs, executable identities,
  independent Chroma wheelhouse and model files.
- [CycloneDX 1.6 SBOM](../artifacts/windows-x64-sbom.json) separates staged
  files, bundled libraries, packages in the build environment, user-level
  tools and separately prepared Chroma inputs. [Format reference](https://cyclonedx.org/docs/1.6/json/)

## What travels

The paired [launcher allowlist](../../../scripts/enterprise-local/codex-local.mjs#L24)
copies selected scripts, SQLite helpers and five skills, plus the entire `modes`
and `ui` trees. The inventory freezes both recursive trees at the file level.
The [renderer](../../../scripts/enterprise-local/codex-local.mjs#L170) produces
five metadata files. Three contain absolute paths or a port. Their inventory
entries carry the normalized template and its SHA-256, plus raw SHA-256 and
size for the reference stage. The two path-independent generated manifests
have ordinary file hashes. Source paths are relative to the pinned checkout.

The standalone and beta servers, legacy installers and wrappers, NPX, bug-report,
other host bundles, unselected skills, build trees and runtime prerequisites
stay outside this private candidate. The three main CJS source maps are inputs
for pairing evidence. Two SQLite helper maps are staged. The candidate starts
with empty data, workspace, Codex, home and temp directories. The verifier
targets this pre-registration state.

Here the candidate is the set of files copied to the local installation folder.
Excluded files may still exist in the checkout or its build outputs. The two
modified copies were disposable test fixtures. Changing one byte while keeping
the file size checked the content comparison. Adding a server file under the
recursively copied viewer directory checked that the verifier rejects unexpected
files anywhere in the installation. These checks describe the tested build and
require no manual tampering during ordinary local use.

The worker's esbuild graph still lists external `better-auth` and
`@better-auth/api-key` imports. The worker registers a lazy local auth route
that tries to load them on request. Their packages stay in the build inventory
and are absent from the candidate. The exact route's failure behavior remains
a step 11 check. Other profile-specific executables require their own input
selection and acceptance. [Worker registration](../../../src/services/worker-service.ts#L399),
[lazy handler](../../../src/server/auth/BetterAuthRoutes.ts#L12).

## Recheck on a matching Windows x64 host

Use the pinned executables in the inventory and an explicit port. For a newly
staged candidate, use its own destination for the path bindings. For a raw
copy of an already staged tree, supply the original destination with
`--bound-root`; re-stage for a different operational destination.

From the trusted checkout root, set `$candidate` to a new absolute path with
an existing parent under task scratch. Set `$node`, `$bun`, `$codex`, and
`$python` to the pinned executable paths, `$wheelhouse` and `$modelDirectory`
to the prepared input directories, and `$port` to the intended loopback port.
To stage the paired checkout bytes without registering the plugin, call the
staging function directly. Keep the resulting receipt with the test evidence.

```powershell
$bundle = (Resolve-Path -LiteralPath plugin).Path
$launcher = (Resolve-Path -LiteralPath scripts/enterprise-local/codex-local.mjs).Path
$stageScript = Join-Path (Split-Path -Parent $candidate) ('.stage-' + [guid]::NewGuid() + '.mjs')
@'
import { pathToFileURL } from 'node:url';
const [launcher, root, codex, bun, port, bundle] = process.argv.slice(2);
const { stageLocalInstall } = await import(pathToFileURL(launcher).href);
stageLocalInstall({ root, codex, bun, port: Number(port), bundle });
'@ | Set-Content -LiteralPath $stageScript -Encoding utf8
& $node $stageScript $launcher $candidate $codex $bun $port $bundle
if ($LASTEXITCODE -ne 0) { throw 'Candidate staging failed' }
```

```powershell
& $node scripts/enterprise-local/verify-windows-artifact.mjs `
  --candidate $candidate --codex $codex --bun $bun --port $port `
  --python $python --wheels $wheelhouse --model $modelDirectory
```

The [verifier](../../../scripts/enterprise-local/verify-windows-artifact.mjs)
checks the exact directory and file sets, rejects symbolic links and junctions
in the candidate tree, renders the pinned bindings and hashes every byte. The
optional Chroma arguments are all-or-none. The receipt records the inventory
hash, raw file sizes/hashes and SHA-256 of the UTF-8 JSON file list. Retain it
before any registration or runtime use. This is a quiescent-tree comparison.

## Executed checks

- Re-staged a transferred launcher and plugin input with the real pinned
  executable paths. Its 81 files and 30 directories matched the inventory.
  A raw copy verified with the original binding produced the identical file
  list and digest
  `179af25d22343c0ee9db0a354466576c485a76dd74e88a0af618e0a063e8d945`.
  The verifier refused the copy with the wrong binding, a same-size mutation,
  a missing file, an extra directory, and a standalone server planted inside
  the recursively copied UI tree. Standalone server, legacy wrapper, context
  generator, transcript watcher, installer, lockfiles and cloud skill inputs
  placed outside the allowed paths stayed outside the staged tree.
- The closeout reran the copy fixture and all five negative cases. The two
  PowerShell blocks above also passed in a fresh scratch destination with
  81 candidate files, 93 wheels and two model files in the receipt.
- Replayed the reviewed compile in scratch with esbuild metafiles and Vite
  rendered module attribution. The Vite replay used the checkout's source
  scan base and scratch config/cache/output so Tailwind scanned the same
  source tree. A replay rooted entirely in scratch produced different CSS.
  The corrected replay matched 29 pinned files, including both viewer builds,
  the staged JS entrypoints and their paired maps. SHA-256 input-tree digests
  cover contributing physical modules. The reviewed guard recorded zero
  instrumented Node socket attempts. The replay used the existing npm trees
  and skipped the preceding My Work typecheck. Native and OS-wide egress
  were outside this check.
- The SBOM records 201 bundled npm package instances and 1,019 other installed
  build-environment instances. JSON structural, unique reference and cross-file
  hash checks passed. A full CycloneDX schema validation was outside this check.
- All 93 wheel files and both model files matched, using the pinned CPython
  executable and DLL for the separate host prerequisites. The wheel lock's
  committed LF SHA-256 is `559a033c3552b81fa8fa9b545ddd61388324124ee48d2a8394b537629085ce91`.
  The local CRLF copy has SHA-256 `b93f4e4243652623ac8eb8354a1b9b5c40e54b5016f61788048a933f7f3d1f18`.
  The version and wheel hash rows agree.

| Delivered document | SHA-256 |
|---|---|
| Windows x64 inventory | `c81096230aa257675165646b5fbb2e34b1f6e2bd97f0d115fca35e0e1e85e2dd` |
| Windows x64 SBOM | `02d43e67b95545b9406704092759d3653e0d0372791abc39f72641cc50a13d51` |

## Provenance limits

- npm package hashes are SHA-256 of a UTF-8 JSON array of sorted
  `[relativePath, fileSha256]` pairs, excluding nested `node_modules` directories.
  Registry integrity comes from the local npm lock data. The ignored root
  `package-lock.json` and the two installed npm lock files are pinned as observed
  inputs. Package-tree hashes and lock integrity measure different bytes.
  The original archives and complete dependency acquisition attestation are
  unavailable. A build-environment row records an installed package outside the
  measured staged bundles. It may be unused by the compile.
- The Codex executable is the local desktop-distributed binary. Its exact
  acquisition archive, release checksum, binary license and bundled notices
  remain unverified. Node, Bun, npm and Python rows pin the listed files only.
  Their full distributions and OS/native DLL closure still require review for
  a portable release. CPython executable and DLL hashes match the earlier
  Chroma handoff. Windows itself is a host prerequisite.
- The two Monaspace font files are pinned to checkout bytes. Exact upstream
  release provenance and notice delivery remain open. The staged application
  tree lacks a complete release notice set. SBOM license entries report local
  or upstream declarations. Redistribution review remains in step 12.
- The wheelhouse hashes match the committed Chroma lock. PyPI project/version
  references identify the recorded source. The exact download URLs and
  acquisition attestations were unavailable. Wheel license metadata and uniquely
  resolved license-file hashes are recorded. A prepared venv, its generated
  config, pip bootstrap and system dependencies are outside this wheelhouse
  inventory. The two model files match the revision and hashes in
  [CHROMA-07-LOCAL](CHROMA-07-LOCAL.md).

## Gates for steps 11 and 12

Under A29, step 11 runs locally and step 12 documents daily operation.
The CI and distribution conditions below apply only to those optional lanes.
[Local delivery route](../../roadmap.md).

D12 still requires owner approval for the runner identity, location, Windows
image and provisioning authority, immutable source and tool/dependency/model
inputs, exact permitted validation commands, OS process/egress and synthetic
data boundaries, and control-plane/dispatch, artifact access, retention and
upload policy. The [manual CI skeleton](../../../.github/workflows/fork-local-validation.yml)
still blocks before execution. CI was not dispatched.

D11 remains open. The step 11 loopback run uses real Chroma and tests visible
refusal for unavailable assets. It does not require a degraded-mode decision
or D12 approval. All three approved `gpt-6-luna` turns remain unused. The
paired [provider source](../../../src/services/worker/CodexProvider.ts#L415)
sets worker-level `maxRetries: 0` for explicit native auth. Step 11 must prove
retry disablement through the exact app-server binary, provider/auth settings
and queue path before spending a live turn. This artifact check did not start
the worker, Codex app-server or Chroma, or perform inference.

Rollback consists of retiring this inventory and verifier as a set and re-staging
the intended paired build in a fresh root. Preserve SQLite and Chroma state.
