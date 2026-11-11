# cmem-light

Local memory for Claude Code CLI and Codex CLI on Windows. SQLite/FTS5 keeps
canonical memories; local Chroma/MiniLM supplies semantic search. The worker
serves My Work and the classic viewer on loopback. Model generation uses an
explicitly selected provider, model and auth profile, without CMEM signup.

Start with the [Windows local setup runbook](docs/enterprise-local/WINDOWS-LOCAL-SETUP.md).
It covers a private build, local host binding, model profiles, Chroma preparation,
updates and data-preserving rollback. The supported development baseline is
Node.js 22.23.4, npm 10.9.9 and Bun 1.4.4. Setup and runtime use ordinary-user
permissions.

Local build/check commands use existing prepared dependencies:

```powershell
npm run typecheck
npm run build:compile
```

Compile does not prepare dependencies, deploy, register plugins or restart a
worker. Viewer preparation and private staging are separate steps in the runbook.
Tests are available locally; choose relevant focused files before running them.
CI/CD, public publishing, Docker/standalone deployment and non-target host
integrations have been retired.

The existing technical `claude-mem` names, commands, paths, environment keys and
plugin identities remain for compatibility. Display metadata uses `cmem-light`.
Selected Claude/Bedrock/AWS SSO, Codex and other supported LLM adapters are retained.
Real Claude Code CLI/Bedrock verification still belongs on the authorized target.
The separate local-auth HTTP 500 is a known unresolved defect.

- [Current state and handoff](docs/enterprise-local/memory/STATE.md)
- [Provider/model profiles](docs/enterprise-local/LLM-PROFILES.md)
- [Validation and limits](docs/enterprise-local/VALIDATION.md)
- [Cleanup results and current receipt](docs/enterprise-local/cleanup/RESULTS.md)
- [Local architecture](docs/ARCHITECTURE-LOCAL.md)

Technical Markdown, presentation source Markdown, ADRs and development history
are retained. Other upstream integration/setup documents are historical references;
the local runbook takes precedence for this fork. Core [LICENSE](LICENSE),
[NOTICE](NOTICE) and retained-code/font provenance remain in the repository.
