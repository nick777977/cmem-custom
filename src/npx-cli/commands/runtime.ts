/** WINDOWS-09D: CLI runtime compatibility surface; no private launch helpers/imports. */
export function serverVectorSearchAllowed(): boolean { throw new Error('LOCAL_RUNTIME_UNAPPROVED: installer runtime settings are not approved.'); }

export function runServerStartCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runServerStopCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runServerRestartCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runServerStatusCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runServerWorkerStartCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runStartCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runStopCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runRestartCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runStatusCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runServerApiKeyCommand(extraArgs: string[] = []): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runAdoptCommand(extraArgs: string[] = []): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runProjectCommand(extraArgs: string[] = []): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runCleanupCommand(extraArgs: string[] = []): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runMcpCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runHookCommand(extraArgs: string[] = []): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export async function runSearchCommand(queryParts: string[]): Promise<void> {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runTranscriptWatchCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runMemoryIngestCommand(extraArgs: string[] = []): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}
