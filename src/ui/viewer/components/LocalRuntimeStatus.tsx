import React, { useEffect, useState } from 'react';
// Public fields from /api/health. Never load the worker's profile settings in the browser.
type RoleStatus = { inherited: boolean; lastFailure?: string } & (
  | { state: 'configured'; profileId: string; provider: string; model: string; auth: string }
  | { state: 'paused'; issue: keyof typeof PROFILE_ISSUES }
);
type Roles = Partial<Record<keyof typeof ROLE_LABELS, RoleStatus>>;
type ChromaStatus = {
  status: 'disabled' | 'healthy' | 'unhealthy';
  connected: boolean;
  localRuntime?: 'idle' | 'connected' | 'setup-required';
  probe?: { ok: boolean; stage: 'connect' | 'list' | 'query' | 'done' };
};

const ROLE_LABELS = {
  observer: 'Observer',
  summary: 'Summary',
  compression: 'Field compression',
  refresh: 'Work view refresh',
  copy: 'Card copy',
  requestJudge: 'Request judge',
  focusJudge: 'Focus judge',
  knowledge: 'Knowledge',
  telegramWrapup: 'Telegram wrap-up',
};

const PROFILE_ISSUES = {
  profile_required: 'A default profile is required',
  invalid_profile: 'Invalid profile',
  unsupported_route: 'Unsupported provider or auth route',
  credential_unavailable: 'Selected credential or endpoint binding unavailable',
  unsupported_capability: 'Unsupported for this role',
  disabled: 'Off',
};

function describeChroma(chroma: ChromaStatus | null | undefined): string {
  if (chroma === undefined) return 'Checking local runtime and semantic search…';
  if (!chroma) return 'Chroma status unavailable.';
  if (chroma.status === 'disabled') return 'Chroma is disabled.';
  if (chroma.localRuntime === 'setup-required') {
    return 'Setup required. Local Python or MiniLM assets are missing or invalid, or the runtime is misconfigured.';
  }
  if (chroma.status === 'healthy' && chroma.probe?.ok) return 'Local runtime ready. Semantic search probe passed.';
  if (chroma.connected) {
    return chroma.probe?.stage === 'query'
      ? 'Local runtime connected. Semantic query failed. Check again after memory is indexed.'
      : 'Local runtime connected. Semantic search is unverified.';
  }
  return 'Local runtime unavailable. Semantic search is unverified.';
}

export function LocalRuntimeStatus() {
  const [roles, setRoles] = useState<Roles | null>();
  const [chroma, setChroma] = useState<ChromaStatus | null>();
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(45_000)]);
    const options = { signal, cache: 'no-store' as const };

    fetch('/api/health', options).then(async response => {
      // A degraded queue still returns the effective roles in the health body.
      if (!response.ok && response.status !== 503) throw new Error('Health unavailable');
      const { ai }: { ai?: { roles?: Roles } } = await response.json();
      if (!controller.signal.aborted) setRoles(ai?.roles ?? null);
    }).catch(() => { if (!controller.signal.aborted) setRoles(null); });

    fetch('/api/chroma/status?deep=true', options).then(async response => {
      if (!response.ok) throw new Error('Chroma status unavailable');
      const status: ChromaStatus = await response.json();
      if (!controller.signal.aborted) setChroma(status);
    }).catch(() => { if (!controller.signal.aborted) setChroma(null); });

    return () => controller.abort();
  }, [revision]);

  return (
    <div className="local-runtime-status">
      <section aria-label="Chroma semantic search" aria-live="polite">
        <h3>Chroma semantic search</h3>
        <small>Local embeddings use paraphrase-multilingual-MiniLM-L12-v2.</small>
        <p>{describeChroma(chroma)}</p>
        {chroma?.localRuntime === 'setup-required' && (
          <small>Run <code>prepare-local-chroma.ps1</code> and check <code>CLAUDE_MEM_CHROMA_RUNTIME_DIR</code> in the worker settings.</small>
        )}
      </section>
      <button type="button" disabled={roles === undefined || chroma === undefined} onClick={() => {
        setRoles(undefined);
        setChroma(undefined);
        setRevision(value => value + 1);
      }}>Recheck status</button>
      <section aria-label="Effective worker model profiles" aria-live="polite">
        <h3>Effective worker model profiles</h3>
        <small>These profiles govern background work. Your host session chooses its own model.</small>
        {roles ? <dl>
          {Object.entries(ROLE_LABELS).map(([role, label]) => {
            const status = roles[role as keyof Roles];
            if (!status) return null;
            return <div key={role}>
              <dt>{label}</dt>
              <dd>
                {status.state === 'configured'
                  ? <>{status.profileId} · {status.model} · {status.provider} · {status.auth}</>
                  : PROFILE_ISSUES[status.issue] ?? 'Paused'}
                <small>
                  {status.inherited ? 'Inherits default' : 'Role override'}
                  {status.state === 'configured' && ' · Configured'}
                  {status.lastFailure && ` · Last failure: ${status.lastFailure.replaceAll('_', ' ')}`}
                </small>
              </dd>
            </div>;
          })}
        </dl> : <p>{roles === undefined ? 'Reading effective profiles…' : 'Effective profile status unavailable.'}</p>}
        <small>Manage worker profiles with <code>CLAUDE_MEM_MODEL_PROFILES</code> in the worker settings or environment.</small>
      </section>
    </div>
  );
}
