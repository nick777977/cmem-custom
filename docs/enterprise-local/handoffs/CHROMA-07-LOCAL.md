# CHROMA-07-LOCAL

Windows x64, 2026-11-10, one coordinator on `feat/cmem-light-local`. Clean
entry `80a6b0868867ad017a19580a7fedb8e334cd647d`. This slice supersedes the
activation refusal in [CHROMA-07](CHROMA-07.md) for this runtime.
Inspected and tested source and paired output `c476b5cd014a89bcc3f2ecf75df1ab7448e545fc`.

## Runtime and provenance

The reused CPython 3.13.15 AMD64 executable reports `tags/v3.13.15:4061bc4`
and has a valid Python Software Foundation Authenticode signature. The host
executable SHA-256 is
`85b71d8c6ec1905935f74be0c9869aae198d00e98f39df699ec66f9c5a84cecd`.
The local `python313.dll` SHA-256 is
`e820bf024efd2b56bb2b82791e6b6ddc7303f070f8e72cba7637482a8a906238`.
[CPython release](https://www.python.org/downloads/release/python-31315/),
[PSF license](https://docs.python.org/3/license.html).

| Runtime component | Artifact and license |
|---|---|
| Chroma 1.5.9 | `chromadb-1.5.9-cp39-abi3-win_amd64.whl`, Apache-2.0. [PyPI](https://pypi.org/project/chromadb/1.5.9/) |
| MCP 1.26.0 | `mcp-1.26.0-py3-none-any.whl`, MIT. [PyPI](https://pypi.org/project/mcp/1.26.0/) |
| ONNX Runtime 1.24.4 | `onnxruntime-1.24.4-cp313-cp313-win_amd64.whl`, MIT. [PyPI](https://pypi.org/project/onnxruntime/1.24.4/) |
| Tokenizers 0.22.2 | `tokenizers-0.22.2-cp39-abi3-win_amd64.whl`, Apache-2.0. [PyPI](https://pypi.org/project/tokenizers/0.22.2/) |
| Multilingual MiniLM | Publisher `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`, revision `e8f8c211226b894fcb81acc59f3b34ba3efd5f42`, Apache-2.0. [Model and publisher SHA-256](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/blob/e8f8c211226b894fcb81acc59f3b34ba3efd5f42/onnx/model.onnx), [tokenizer](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/blob/e8f8c211226b894fcb81acc59f3b34ba3efd5f42/tokenizer.json). |

The [wheel lock](../../../scripts/chroma-local-requirements.txt) records all 93
resolved PyPI wheel hashes. SHA-256 of the committed LF lock is
`559a033c3552b81fa8fa9b545ddd61388324124ee48d2a8394b537629085ce91`.
The packages were downloaded as Windows-compatible wheels into task scratch
and installed from that wheelhouse with `--no-index`. An independent offline
pip dry run with `--ignore-installed --require-hashes` verified the full lock.
`pip check` and the preparation script's verified asset reuse passed. The
installed wheel metadata and license files supplied the package license checks.
Release SBOM and redistribution review remain with steps 10 and 12.

| Model file in the runtime's `model` directory | Bytes | SHA-256 |
|---|---:|---|
| `model.onnx` | 470301610 | `10f7a088420252b26caf819236ca2c9d2987afd0fc06fec7553b542a5655a05a` |
| `tokenizer.json` | 9081518 | `2c3387be76557bd40970cec13153b3bbf80407865484b209e655e5e4729076b8` |

[Separate preparation and settings](../WINDOWS-LOCAL-SETUP.md#prepare-local-chroma)
preserve the private Codex build and registration flow. Setup is the only
entry point that acquires wheels and weights.

## Worker binding

- [Preflight](../../../src/services/worker/dependency-preflight.ts#L26) checks
  the prepared path without spawning or searching for uvx. The
  [runtime gate](../../../src/services/sync/ChromaLocalRuntime.ts#L38) selects
  the fixed venv interpreter and packaged stdio adapter. The
  [manager](../../../src/services/sync/ChromaMcpManager.ts#L226) owns the child,
  writer lock and setup failure diagnostics.
- [Worker backfill](../../../src/services/worker-service.ts#L890) reads
  canonical SQLite and sends the existing ChromaSync tools. The
  [adapter](../../../plugin/scripts/chroma-local.py#L40) checks assets and
  exact runtime versions, loads the local tokenizer and CPU ONNX graph, and
  applies masked mean pooling with a 128-token limit. Chroma opens
  `PersistentClient` and the collection with `embedding_function=None`.
  Add and content update pass explicit vectors. Query passes
  `query_embeddings` from the same encoder. The collection stores its
  encoder identity and uses cosine distance. [Chroma explicit-vector API](https://docs.trychroma.com/docs/querying-collections/query-and-get),
  [pinned Python client](https://raw.githubusercontent.com/chroma-core/chroma/1.5.9/chromadb/api/client.py).
- The [search route](../../../src/services/worker/SearchManager.ts#L442)
  rehydrates matches from SQLite. `default` is a compatibility selector at the
  worker boundary. The separate server's model table is outside this route.
  The store and [checkpoint](../../../src/services/sync/ChromaSyncState.ts#L32)
  use the `chroma-minilm-v1` namespace so an old index and watermark cannot
  stand in for this model. Existing SQLite identity and search filters apply.
- The sidecar uses local stdio, explicit Chroma telemetry-off settings and
  `OTEL_SDK_DISABLED=true`. The pinned product capture method is a no-op.
  ONNX Runtime telemetry is explicitly disabled. Hugging Face offline and
  telemetry flags supplement the local-file API. The CPython audit hook
  refuses external socket addresses and DNS while permitting numeric loopback
  for Windows asyncio. [Pinned Chroma product capture](https://raw.githubusercontent.com/chroma-core/chroma/1.5.9/chromadb/telemetry/product/posthog.py),
  [ONNX Runtime Python API](https://onnxruntime.ai/docs/api/python/api_summary.html).

## Checks and rollback

The direct Windows compatibility fixture produced 384-dimensional vectors.
The Russian paraphrase ranked the expected English result first at cosine
distance 0.268. The distractors scored 1.022 and 1.076.

The ordinary-user [copied-worker fixture](../../../tests/integration/chroma-local-worker.mjs)
passed in `.scratch/enterprise-local/chroma-07-local/copied-worker-q2hHhq`.
The missing tokenizer was refused before index creation. The corrupt tokenizer
was refused by the sidecar's SHA-256 check before Chroma opened the store.
The worker stored three synthetic observations, one summary and one prompt in
SQLite. With Chroma unavailable, the Russian observation query returned zero
matches. The staged runtime indexed all three row kinds and returned the
English observation at SQLite ID 1, first among the distractors. The summary
and prompt searches also returned their expected row kinds. After shutdown
and restart, all three queries passed again. The backfill reported zero
new vector writes and the persisted embedding IDs and sequence values matched.
The worker exited cleanly, released its writer lock and left zero matching
worker or Python processes in the Windows process query.

The fixture used synthetic home, config and database paths, a dead HTTP proxy
for worker traffic other than numeric loopback, and a sidecar Python audit
hook. A separate negative probe denied external DNS and socket connect.
The worker logs recorded zero audit denials or runtime model downloads and
no Chroma default cache appeared. Native DLL or OS-wide traffic was outside
the fixture's enforcement and remains a step 11 check. All three approved
generative turns remain unused.

Preliminary copied runs exposed stale uvx advice, a 15-second fixture
shutdown deadline and automatic v12.4.3 startup cleanup of legacy Chroma
artifacts. The final source checks the staged path, keeps the old cleanup
as explicit maintenance, and preserves both legacy artifacts. The final
fixture uses a bounded 60-second shutdown deadline. The old manual cleanup
unit suite separately reported six Windows `EBUSY` errors at test-directory
teardown, including on an ordinary-user recheck. The other test passed.

The 18 focused Chroma test files and the preflight test file passed with
214 tests and 822 assertions. Authored source and docs passed whitespace
checks. The generated worker retains compiler-emitted third-party whitespace.

The final root and viewer typechecks and guarded compile passed. The compile
preserved 19 build inputs and 2023 tracked source sentinels. Against the entry
build, 17 of 192 tracked emitted files changed, including the worker CJS/map.
The worker SHA-256 is
`0ebc69f02e9a887606ad44f21899be1fdecbc068c2a853d9b61f070aa9f93810`.
The packaged Python adapter SHA-256 is
`f2500a72d736c6a2fdadd55fc3cd792659f4f9e343c7885ab68df036e4f63bf8`.

For rollback, stop the worker and revert the paired implementation commit
with its generated files. Preserve SQLite, the staged runtime, and both
derived index namespaces and checkpoints. An earlier worker cannot use the
new MiniLM store through the old route. D11 remains open. Exact-artifact
native network and release transfer checks remain with steps 11 and 12.
