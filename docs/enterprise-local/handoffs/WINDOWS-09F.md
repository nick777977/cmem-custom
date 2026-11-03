# WINDOWS-09F — concrete Windows admission/cleanup API review

2026-11-03; feat/cmem-light-local; one coordinator, serial. Clean inspected source
**R 1ca61590d18ebc80e2ef3e2aea74b89ffe54cf3a**. Exact TASKS claim before edits.
Read-only source/Microsoft API review; no source, harness, generated or workflow edit.
**Review complete; native adapter and full step9 remain BLOCKED.** No generic audit
or another mock-hardening slice is needed to rediscover these inputs.

The owner's priority is a usable local plugin without a CMEM account, with local
Chroma and explicitly chosen LLM/auth. Minor first-release imperfections may be
deferred. This does not silently revoke the same request's explicit preservation
of unbound host commands/exit1, native BLOCKED, no registration/runtime/acquisition
or other-step work. Those constraints prevent a working installation in this slice.
OS smoke isolation is validation infrastructure, not CMEM signup removal; it must
not be confused with product functionality or expanded indefinitely.

## Exact source boundary at R

| Source:line | Static evidence; runtime remains unknown |
|---|---|
| scripts/enterprise-local/compiled-smoke.mjs:146 | Native-kind rejects before launch. No native bridge or OS API implementation in this runner. Targeted native-API symbol search in src/launcher, scripts/enterprise-local and tests/enterprise-local found no implementation; no installed-tree survey. |
| scripts/enterprise-local/compiled-smoke.mjs:160 | Mock launch/handle/completion admission; sync refusal leaves ownership unknown. :193 independently bounds stop/release; :202 retains failures; :207 labels success V1/substituted/readiness:false. Native callbacks cannot attest ownership or release. |
| src/build/hook-shell-template.ts:48 | Structured interpreter command is empty; :72/:75 return shell exit1. :31 explicit-path payload still refuses. A literal or post-load realpath is not pre-execution approval. These templates cannot provide a working installation. |
| src/launcher/local-preflight.ts:65 | Even a present explicit-root bundle returns blocked/PRIVATE_LAUNCH_POLICY_PENDING. Version/no-op behavior at :22/:26 is not worker/MCP readiness. Protocol3 unchanged. |
| scripts/enterprise-local/windows-bundle.ps1:16 | Planner dryRun=true, status BLOCKED D5, no mutations, exit1 at :22. It is not an installer. Both D5 namespace/absolute-unpacked-path choices remain proposed. |
| .github/workflows/fork-local-validation.yml:4 | Manual workflow_dispatch only; :23 throws BLOCKED D12. No approved CI execution or upstream-trigger change. |

## Concrete API feasibility, not approval

Microsoft references read 2026-11-03. Only API references and Microsoft's authored
engineering article support the findings; search-result Q&A/comments are not relied on.
The candidate below is a native bridge for the existing runner, not a second harness,
chosen packaging format, accepted ABI, approval manifest or implementation.

| Guarantee | Concrete primitive/order and failure handling | Missing input/evidence; disposition |
|---|---|---|
| Admission before initial child execution | Prepare a private job and limits first, then CreateProcessW with STARTUPINFOEX/EXTENDED_STARTUPINFO_PRESENT and PROC_THREAD_ATTRIBUTE_JOB_LIST. Microsoft documents assignment before the initial thread runs. The older create-suspended then AssignProcessToJobObject sequence has a creator-crash orphan window, so it is not an equivalent substitute. Check every setup/CreateProcess result. [JOB_LIST reference](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-updateprocthreadattribute), [Microsoft ordering explanation](https://devblogs.microsoft.com/oldnewthing/20230209-00/?p=107812). | JOB_LIST requires Windows10/Server2016+, not merely an arbitrary existing Windows tool. Exact supported OS/build/architecture and bridge artifact/ABI absent. Initial-thread ordering does not itself establish all creator-interruption/partial-failure/resource-release guarantees. BLOCKED. |
| Launch failure ownership | A native ownership record must exist before the first resource/creation attempt, retain job/security/pipe/attribute resources and returned PROCESS_INFORMATION handles, and survive startup failure. CreateProcessW zero means inspect GetLastError; success precedes DLL initialization, so later exit is still startup failure. [CreateProcessW](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createprocessw). | No reviewed bridge ABI for partial creation, interrupted calls, cancellation/late returns or resource transfer. Sync JS throw without a handle remains unknown, never clean. A blocking native create call cannot be bounded by the runner timer that starts after launch. BLOCKED. |
| Descendants and PID reuse | Keep the job handle and actual process handles, omit both breakaway flags, never rediscover ownership from a PID/name. Ordinary CreateProcess descendants inherit job membership; brokered Win32_Process.Create is explicitly excluded. [Job membership/breakaway](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects), [process-ID notification caveat](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-jobobject_associate_completion_port). | Need a concrete restricted-token/IPC/broker policy preventing out-of-job launches and unwanted handle duplication. No proof that job membership alone covers every descendant route. Holding process handles avoids treating recycled IDs as ownership; no PID/image/global-port kill. BLOCKED. |
| Inherited egress deny | Candidate AppContainer token/capabilities plus per-boundary WFP deny filters established before creation. WFP ALE_AUTH_CONNECT V4/V6 authorizes TCP and outgoing non-TCP; package-ID conditions exist at these layers. Use a write transaction, exact owned filter identities and readback before admission. [ALE layers](https://learn.microsoft.com/en-us/windows/win32/fwp/management-filtering-layer-identifiers-), [condition availability](https://learn.microsoft.com/en-us/windows/win32/fwp/filtering-conditions-available-at-each-filtering-layer), [transaction API](https://learn.microsoft.com/en-us/windows/win32/api/fwpmu/nf-fwpmu-fwpmtransactionbegin0). | A job is not network isolation. Executable-path filters identify an image, not its whole descendant tree. Need approved boundary identity, capabilities, IPv4/IPv6/non-TCP/loopback policy and WFP permissions; no machine-wide filter operation authorized. Candidate only, BLOCKED. |
| DNS and brokered traffic deny | Direct UDP/TCP DNS is part of denied outgoing traffic. AppContainer restricts resources and ordinary child token inheritance, but those facts do not prove that DNS/service/broker requests stay inside the chosen boundary. [AppContainer legacy process model](https://learn.microsoft.com/en-us/windows/win32/secauthz/appcontainer-for-legacy-applications-). | No concrete reviewed DNS/broker isolation contract or independent observation of denied queries. An IP/port53 rule or empty JS socket trace is insufficient, including alternate DNS transports. Need boundary-specific inherited OS deny and DNS evidence; do not change shared DNS settings/services. BLOCKED. |
| Boundary lifetime and supervisor failure | Dynamic WFP session objects are deleted when the session ends. Therefore policy-session lifetime must outlive every contained process, even after supervisor failure; deleting filters is not proof the children are gone. AppContainer profile creation mutates per-user folders/registry; existing-name result is not ownership. [WFP lifetime](https://learn.microsoft.com/en-us/windows/win32/api/fwpmu/nf-fwpmu-fwpmengineopen0), [WFP rights](https://learn.microsoft.com/en-us/windows/win32/fwp/access-control), [profile creation](https://learn.microsoft.com/en-us/windows/win32/api/userenv/nf-userenv-createappcontainerprofile). | Need a reviewed crash-order contract and approved identity/ACL/profile/filter ownership/cleanup substrate. No profile/registry/firewall permission inferred from API availability. Dynamic filters plus kill-on-close do not document ordering between their crash teardowns. BLOCKED. |
| Startup/wall deadline/output cap | A native controller must monitor startup and both byte streams while the process runs; overlapped named pipes provide asynchronous reads. Enforce the existing aggregate 64KiB cap before retention, stop on overflow, bounded startup/run deadline separate from CPU limits. CancelIoEx requests cancellation but does not await completion; keep OVERLAPPED buffers alive until completion. [Overlapped pipes](https://learn.microsoft.com/en-us/windows/win32/api/namedpipeapi/nf-namedpipeapi-createnamedpipew), [CancelIoEx](https://learn.microsoft.com/en-us/windows/win32/api/ioapiset/nf-ioapiset-cancelioex). | Need native asynchronous/cancellation ABI, monotonic deadline/sleep policy and stream/drain behavior. JS result-size check is after completion, JS timers cannot preempt native create/stop, CPU-time job limits are not wall deadlines. No fixed startup-success protocol invented. BLOCKED. |
| Owned-tree stop and release | TerminateJobObject targets the retained job; KILL_ON_JOB_CLOSE is a last-handle failsafe. Termination is not an instantaneous release barrier: wait on retained process handles, reconcile job accounting, drain/cancel I/O, close owned handles. Ordinary job-port messages are not guaranteed. ActiveProcesses decreases after exit and reference release, so retained handles need an explicit accounting order. [TerminateJobObject](https://learn.microsoft.com/en-us/windows/win32/api/jobapi2/nf-jobapi2-terminatejobobject), [termination/waits](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-terminateprocess), [kill-on-close limit](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-jobobject_basic_limit_information), [accounting semantics](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-jobobject_basic_accounting_information). | Need every-path native ownership ledger, wait/accounting/handle order and deadline failure disposition. Timeout bounds the observation/reporting attempt; it cannot certify physical cleanup. Pending/unknown release is FAIL, never PASS. No reviewed universal finite OS cleanup bound. BLOCKED. |
| Listener/handle/boundary release evidence | Owned process identity and I/O handles must reconcile with job emptiness; TCP endpoint snapshots alone cover neither UDP nor handle/boundary release. Only after tree/I/O release may owned WFP/profile state be removed. DeleteAppContainerProfile can succeed for an absent profile; storage handles can prevent complete removal, and failure leaves state undetermined. [TCP table scope](https://learn.microsoft.com/en-us/windows/win32/api/iphlpapi/nf-iphlpapi-getextendedtcptable), [profile deletion limits](https://learn.microsoft.com/en-us/windows/win32/api/userenv/nf-userenv-deleteappcontainerprofile). | No reviewed listener+UDP/handle/boundary evidence interface, independent owned-profile cleanup verification or authority to create those resources. Endpoint/PID snapshots and callbacks are not proof. BLOCKED. |

## Artifact/interface inputs still required

This is a missing-input contract, **not an accepted executable manifest/schema**.

| Input group | Concrete required input; current status |
|---|---|
| Platform/bridge | Supported Windows editions/builds/architectures, selected reviewed native bridge packaging and source revision, exact compiler/SDK/runtime ABI/CRT or static-link policy, imports/DLL closure, immutable artifact bytes/hash/provenance/license. None supplied/approved. Kernel32/Userenv/Fwpuclnt are candidate OS API libraries, not approval to build/load a helper. |
| Resource protocol | Synchronous lease/opaque ownership identity before native work, startup/completion/failure/cancellation/late-result semantics, owned job/process/pipe/filter/profile ledger, bounded I/O and error/release records. Raw HANDLE/PID values must not become JS-number ownership or self-attestation. No concrete ABI implementation supplied. |
| Executable/content | Approved interpreter exact version/hash/architecture/closure, bundle hashes, native/grammar/query/Python/Chroma/model closure and licenses/API evidence. Node22.23.4/npm10.9.9/Bun1.4.4 are development baselines, not immutable runtime admission. No installed asset inspection authorized. |
| Immutable loading | Explicit executable and UTF-16 argv/cwd/env/stdin, allowlisted inherited handles, held artifact identity/ACLs and no replacement/reparse gaps through load. CreateFile sharing can deny later write/delete opens while held, but does not freeze an entire dependency closure or close every pathname/loader race. [CreateFileW sharing rules](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew). Whole-closure admission contract absent. |
| Host/product activation | Concrete host/version command-loading/quoting contract and selected D5 loading option, exact bundle/interpreter paths as inputs; no real settings or registration. Working local startup needs an authorized replacement of unbound/exit1 refusals. Chroma activation U1/D9 and model-selection step6 are separate unmet product work, not implied by this API review. |

Candidate ordering: validate immutable inputs -> allocate owned boundary/job/I/O and
record every resource -> commit/read back effective deny policy -> create in job with
restricted security/handle attributes -> monitor startup/streams/deadlines -> stop
owned job -> verify tree/I/O/handles -> remove only owned boundary state. Each failure
retains primary plus cleanup errors and an explicit unknown state until verified.
This ordering is a review result; unresolved crash/broker/ABI rows prevent native code
or an actual V3 proposal. It is not a claim Windows cannot support a suitable solution.

## Disposition, actual checks and preservation

WINDOWS-09F review is complete. Full step9 is **BLOCKED**, not a functioning local
install: (1) host/loading activation is explicitly disabled and D5 unselected;
(2) immutable artifacts/native boundary ABI and DNS/crash/release contract absent;
(3) actual validation/registration/runtime scope prohibited. Repeating source reviews
or mock tests cannot fill those inputs. No further generic audit/harness loop queued.
The request to finish a working step9 conflicts with retaining its unbound/exit1
behavior and execution ban; a scope clarification was requested while this independent
review proceeded. No unanswered option is treated as permission or an accepted deferral.

Only V0 source/API/document review performed. **V1/V2/V3/V4/V5/V6/CI NOT RUN** in 09F;
no compile/typecheck/test replay, tools probing, native bridge load, process/network/
firewall/DNS/profile/registry action or installed-asset read. Browser documentation
fetches are research traffic, not an application's no-egress measurement. Exact local
baseline retained without re-execution/install/update. Docs link/line/scope checks are
recorded at closure; they are not application evidence.

All 09/09B/09C and 09D B855ef7d6e/S236dd661c/H2935e19d0 preserved; 09D one compile,
19 inputs/869 source sentinels/192 outputs stable across that compile unchanged as
historical evidence. 09E H98a6d019c 16 V1 tests/337 assertions and unknown-ownership/
independent stop-release behavior preserved. No source/generated/manifest/lock/trust/
workflow/planner change. A19/A20 and provider/native-login source, viewer/SQLite canonical/
Chroma derived/identity/sharing/filter/capture/retrieval unchanged. No SQLite-only
success bypass. U1/D9 blocked, V4 needs approved Chroma assets; D11/D12 and A15
10/11/12 open. No agents/branches/worktrees/push; local commits hooks/signing off.

One next remaining-source action: **working local host-binding implementation after
concrete contract/scope resolution** (NEXT-SESSION). Do not launch another generic
API review. Native adapter still needs the concrete reviewed inputs above; actual V3
requires approved immutable artifacts, implemented native adapter/OS boundary,
permissions and cleanup readiness. No invented MCP initialize/list-tools or worker
lifecycle success specs. No other numbered step executed.

## Rollback

This review is documentation-only. Revert its evidence and closure commits in reverse
order after checking later overlap; no source/generated rollback, reset/clean/reinstall,
user-state change or runtime permission. Historical handoffs and decisions remain.
