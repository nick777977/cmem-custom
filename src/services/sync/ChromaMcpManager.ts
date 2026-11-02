
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import type { ChildProcess } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { logger } from '../../utils/logger.js';
import { SettingsDefaultsManager } from '../../shared/SettingsDefaultsManager.js';
import { USER_SETTINGS_PATH, paths } from '../../shared/paths.js';
import { killProcessTree, collectDescendantIdentities } from '../../shared/kill-process-tree.js';
import { reclaimOrphanChromaDataDirWriters } from '../../shared/port-reclaim.js';
import { getSupervisor } from '../../supervisor/index.js';
import { captureProcessName, captureProcessStartToken, isSameProcess, isSameProcessName, isPidAlive, normalizeProcessName } from '../../supervisor/process-registry.js';
import { clearDependencyStatus, recordChromaVectorSearchUnavailable } from '../../shared/dependency-health.js';
import { ChromaUnavailableError } from '../worker/search/errors.js';
import type { ChromaCollectionDrop } from './ChromaSync.js';

import { assertLocalChromaConfiguration, assertLocalEmbeddingFunction, requireApprovedLocalChromaRuntime } from './ChromaLocalRuntime.js';
import type { LocalChromaLaunch } from './ChromaLocalRuntime.js';

const CHROMA_MCP_CLIENT_NAME = 'claude-mem-chroma';
const CHROMA_MCP_CLIENT_VERSION = '1.0.0';
const MCP_CONNECTION_TIMEOUT_MS = 30_000;
const DEFAULT_CHROMA_MUTATION_TIMEOUT_MS = 600_000;
const CHROMA_MUTATION_TIMEOUT_BOUNDS = { min: 60_000, max: 3_600_000 } as const;
// Bounded wait for the child's 'exit' after close() resolves. close() can
// return before Node processes the event, and treating that gap as "still
// alive" escalates to a hard kill against a process that already exited —
// which is what SIGKILLs `uv` mid-build and leaks its scratch dir (#3540).
const CHROMA_EXIT_OBSERVE_TIMEOUT_MS = 1_000;
const RECONNECT_BACKOFF_MS = 10_000;
const CHROMA_WRITER_LOCK_FILENAME = '.claude-mem-chroma-writer.lock';
// An unparseable lock (typically a 0-byte file left by a crash mid-write) has no
// owner to probe; once it is this old no concurrent writer is still filling it in.
const CHROMA_WRITER_LOCK_UNREADABLE_GRACE_MS = 10_000;
const CHROMA_STORE_RECORD_FILENAME = '.claude-mem-chroma-store.json';
// Writer epoch — monotonic integer, bumped only when an older writer can no
// longer safely follow a newer one's store layout. Deliberately not tied to
// the package version so routine releases do not trigger spurious refusals.
//
// Bump it whenever the chromadb pin in CHROMA_MCP_DEP_OVERRIDES crosses a
// store-format boundary. chromadb migrations are forward-only, and an older
// engine can crash on a newer store: chromadb 1.0.16 panics opening a store
// that 1.5.9 wrote ("range start index 10 out of range", #3384). After the
// bump, an older claude-mem refuses such a store up front instead of handing
// it to an engine that cannot read it.
const CHROMA_WRITER_EPOCH = 1;
// Size cap for the store record. A legitimate record is a small JSON envelope;
// anything larger is damaged or adversarially written and must fail open.
const CHROMA_STORE_RECORD_MAX_BYTES = 64 * 1024;
const CHROMA_SUPERVISOR_ID = 'chroma-mcp';
const CHROMA_OUTPUT_TAIL_MAX_CHARS = 2048;
const DEFAULT_MAX_PENDING_MUTATIONS = 5_000;
const CHROMA_MUTATION_TOOL_PATTERN = /^chroma_(?:add|create|delete|modify|update|upsert)_/;

// Historical store metadata only; no Python runtime is approved by these values.
const CHROMA_MCP_PINNED_VERSION = '0.2.6';
const CHROMADB_PINNED_VERSION = '1.5.9';
const CHROMA_MCP_DEP_OVERRIDES: ReadonlyArray<string> = [];

/** Chroma child health for /api/admin/doctor and `npx claude-mem doctor`. */
export interface ChromaCrashState {
  /** Unexpected exits of the local adapter child in this worker lifetime. */
  count: number;
  /** Last direct-child exit; not evidence of an approved Python runtime. */
  lastExit: {
    timestamp: string;
    code: number | null;
    signal: NodeJS.Signals | null;
  } | null;
  chromaMcpVersion: string;
  dependencyOverrides: string[];
  localRuntime: 'artifact-contract-unverified';
  /** Compatibility health field: runtime prewarm was removed; always stopped. */
  prewarm: {
    consecutiveFailures: number;
    state: 'ok' | 'paused' | 'stopped';
  };
  /** The last collection dropped as corrupt and rebuilt from SQLite (#3202), if any. */
  collectionDrop?: ChromaCollectionDrop | null;
}

class ChromaMcpConnectionCancelledError extends Error {
  constructor(message = 'chroma-mcp connection cancelled during shutdown') {
    super(message);
    this.name = 'ChromaMcpConnectionCancelledError';
  }
}

/**
 * A child PID paired with the start token captured WHILE IT WAS ALIVE.
 *
 * killProcessTree self-captures the root token when a caller does not supply
 * one, which is safe only if the process is still alive at the moment of the
 * call. Every deferred cleanup in this class violates that: `onclose` fires
 * BECAUSE the child died, and the prewarm paths kill a handle that may have
 * exited already. Self-capture there reads whatever now owns the number — so
 * it would bind to a replacement and then validate it against itself.
 *
 * Pairing the token with the PID at spawn time makes that structural: the two
 * travel together, so no cleanup path in this class can forget to carry it.
 */
interface TrackedChild {
  pid: number;
  startToken: string | null;
}

/** Capture identity while the child is provably ours — call right after spawn. */
function trackChild(child: ChildProcess): TrackedChild | null {
  const pid = child.pid;
  if (!pid) return null;
  return { pid, startToken: captureProcessStartToken(pid) };
}

/** Runtimes a Chroma writer (the worker) can run under. */
const CHROMA_WRITER_RUNTIMES = new Set(['bun', 'node']);

interface ChromaWriterLockPayload {
  pid: number;
  ownerId: string;
  dataDir: string;
  acquiredAt: string;
  startToken?: string | null;
  processName?: string | null;
  /** Unique per acquisition, so a release can only ever remove the lock it took. */
  lockToken?: string;
}

/**
 * One acquisition of the writer lock. A connection attempt keeps the handle it
 * acquired and releases only that handle: after stop(), a cancelled attempt's
 * cleanup can run while a newer attempt already holds a fresh lock on the same
 * store, and the process-wide ownerId alone cannot tell the two apart.
 */
interface ChromaWriterLockHandle {
  path: string;
  dataDir: string;
  ownerId: string;
  lockToken: string;
}

interface ChromaStoreRecord {
  writerEpoch: number;
  chromaMcpVersion: string;
  /** The chromadb engine version that last wrote the store ('' when unknown). */
  chromadbVersion: string;
  // depOverrides is written for diagnostic provenance but not parsed back —
  // element types are unchecked and the field never participates in any predicate.
  clientType: string;
  claudeMemVersion: string;
  updatedAt: string;
}

declare const __DEFAULT_PACKAGE_VERSION__: string;
const claudeMemVersion = typeof __DEFAULT_PACKAGE_VERSION__ !== 'undefined' ? __DEFAULT_PACKAGE_VERSION__ : '0.0.0-dev';

// Keep one writer identity for the lifetime of this process. Multiple manager
// instances can be created during reconnects/tests, and they must be able to
// re-acquire a lock that this process already owns.
const CHROMA_WRITER_OWNER_ID = `${process.pid}:${Date.now()}:${Math.random().toString(36).slice(2)}`;

export class ChromaMcpManager {
  private static instance: ChromaMcpManager | null = null;
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private connected: boolean = false;
  private lastConnectionFailureTimestamp: number = 0;
  private connecting: Promise<void> | null = null;
  private connectionGeneration: number = 0;
  private intentionallyClosingTransports = new WeakSet<object>();
  private readonly chromaWriterOwnerId = CHROMA_WRITER_OWNER_ID;
  private chromaWriterLock: ChromaWriterLockHandle | null = null;
  /**
   * Teardown of a subprocess that is gone or being taken down: an unexpected
   * close, or the restart of one hung on a read. Callers wait for it before
   * they reconnect, so nothing reuses the old client or disposes it twice.
   */
  private unexpectedCloseCleanup: Promise<void> | null = null;
  private mutationTail: Promise<void> = Promise.resolve();
  private pendingMutationCalls = 0;
  /** Mutation requests sent to chroma-mcp and not yet answered, in either Chroma mode. */
  private mutationCallsInFlight = 0;
  /**
   * The transport on which a write outlived its deadline. chroma-mcp runs one
   * request at a time (its tools call the blocking Chroma client), so that
   * write may still be committing until chroma-mcp answers anything else on
   * the same transport; until then a read timeout never restarts it.
   */
  private timedOutWriteTransport: unknown = null;
  private readonly maxPendingMutationCalls: number;
  private readonly mutationTimeoutMs: number;
  private readonly serializeMutations: boolean;
  private acceptingLocalMutations = true;
  private chromaCrashCount = 0;
  private chromaLastExit: ChromaCrashState['lastExit'] = null;
  private static exitObserveTimeoutMs = CHROMA_EXIT_OBSERVE_TIMEOUT_MS;

  private constructor() {
    const settings = SettingsDefaultsManager.loadFromFile(USER_SETTINGS_PATH);
    const configuredLimit = Number.parseInt(settings.CLAUDE_MEM_CHROMA_MAX_PENDING_MUTATIONS, 10);
    this.maxPendingMutationCalls = Number.isInteger(configuredLimit) && configuredLimit > 0
      ? configuredLimit
      : DEFAULT_MAX_PENDING_MUTATIONS;
    const configuredMutationTimeout = Number.parseInt(settings.CLAUDE_MEM_CHROMA_MUTATION_TIMEOUT_MS, 10);
    this.mutationTimeoutMs = Number.isInteger(configuredMutationTimeout)
      ? Math.min(
          CHROMA_MUTATION_TIMEOUT_BOUNDS.max,
          Math.max(CHROMA_MUTATION_TIMEOUT_BOUNDS.min, configuredMutationTimeout)
        )
      : DEFAULT_CHROMA_MUTATION_TIMEOUT_MS;
    this.serializeMutations = true;
  }

  static getInstance(): ChromaMcpManager {
    if (!ChromaMcpManager.instance) {
      ChromaMcpManager.instance = new ChromaMcpManager();
    }
    return ChromaMcpManager.instance;
  }

  private async ensureConnected(): Promise<void> {
    // Configuration/artifact refusals must stay explicit on every call, including
    // cached connections and retries. Do not turn U1/D9 into transient backoff.
    const launch = requireApprovedLocalChromaRuntime(SettingsDefaultsManager.loadFromFile(USER_SETTINGS_PATH));
    await this.waitForUnexpectedCloseCleanup();

    if (this.connected && this.client) {
      return;
    }

    const timeSinceLastFailure = Date.now() - this.lastConnectionFailureTimestamp;
    if (this.lastConnectionFailureTimestamp > 0 && timeSinceLastFailure < RECONNECT_BACKOFF_MS) {
      throw new ChromaUnavailableError(`chroma-mcp connection in backoff (${Math.ceil((RECONNECT_BACKOFF_MS - timeSinceLastFailure) / 1000)}s remaining)`);
    }

    if (this.connecting) {
      await this.connecting;
      return;
    }

    const connectionAttempt = this.connectInternal(launch);
    this.connecting = connectionAttempt;
    try {
      await connectionAttempt;
    } catch (error) {
      if (error instanceof ChromaMcpConnectionCancelledError) {
        logger.debug('CHROMA_MCP', 'Connection attempt cancelled during shutdown');
        throw error;
      }
      this.lastConnectionFailureTimestamp = Date.now();
      if (error instanceof ChromaUnavailableError) {
        // Chroma being unavailable is transient and already handled downstream
        // (reconnect backoff + skip-the-write). Log at warn so it does not route
        // through the error sink (captureException) and flood error tracking on
        // every reconnect.
        logger.warn('CHROMA_MCP', 'Connection attempt failed; Chroma unavailable', { error: error.message });
      } else if (error instanceof Error) {
        logger.error('CHROMA_MCP', 'Connection attempt failed', {}, error);
      } else {
        logger.error('CHROMA_MCP', 'Connection attempt failed with non-Error value', { error: String(error) });
      }
      throw error;
    } finally {
      // stop() clears `connecting`, so a newer attempt may own it by now.
      if (this.connecting === connectionAttempt) {
        this.connecting = null;
      }
    }
  }

  private async connectInternal(launch: LocalChromaLaunch): Promise<void> {
    const connectionGeneration = this.connectionGeneration;
    await this.disposeCurrentSubprocess();
    this.assertConnectionNotCancelled(connectionGeneration);
    const localChromaDataDir = paths.chroma();
    ChromaMcpManager.assertChromaStoreCompatible(localChromaDataDir);
    getSupervisor().assertCanSpawn('chroma mcp');

    let writerLock: ChromaWriterLockHandle | null = null;
    try {
      if (localChromaDataDir) {
        writerLock = this.acquireChromaWriterLock(localChromaDataDir);
        // #4608: the writer lock proves no LIVE worker owns this store, so a
        // chroma-mcp still carrying our --data-dir is an orphan of a dead
        // generation (PPID=1 after a crash or an upgrade replaced the
        // worker). Kill it BEFORE spawning our own sidecar, or two writers
        // share one persistent store — the state the reporter logged for 16
        // days (110 failed batch adds, 84 transport errors, a store once
        // judged corrupt). Fail-soft: a sweep hiccup never blocks the
        // connection.
        await reclaimOrphanChromaDataDirWriters({
          dataDir: () => localChromaDataDir,
          // stop() bumps the generation and releases the lock; a sweep it
          // overtook must not kill the next owner's sidecar, even once a newer
          // attempt holds a fresh lock on the same store.
          stillOwnsStore: () =>
            this.connectionGeneration === connectionGeneration && this.chromaWriterLock === writerLock,
        });
        this.assertConnectionNotCancelled(connectionGeneration);
        ChromaMcpManager.assertChromaStoreCompatible(localChromaDataDir);
      }

      this.transport = new StdioClientTransport({
        command: launch.command,
        args: launch.args,
        env: launch.env,
        cwd: os.homedir(),
        stderr: 'pipe'
      });
    } catch (error) {
      // Only the lock THIS attempt acquired: after stop(), a newer attempt may
      // already hold a fresh one on the same store.
      this.releaseChromaWriterLock(writerLock);
      throw error;
    }
    const ownTransport = this.transport;
    const transportStderrTail = ChromaMcpManager.captureOutputTail(this.transport.stderr);

    let mcpConnectionPromise: Promise<void>;
    try {
      this.client = new Client(
        { name: CHROMA_MCP_CLIENT_NAME, version: CHROMA_MCP_CLIENT_VERSION },
        { capabilities: {} }
      );
      mcpConnectionPromise = this.client.connect(this.transport);
    } catch (error) {
      await this.disposeCurrentSubprocess();
      throw error;
    }
    let timeoutId: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error(`MCP connection to chroma-mcp timed out after ${MCP_CONNECTION_TIMEOUT_MS}ms`)),
        MCP_CONNECTION_TIMEOUT_MS
      );
    });

    try {
      await Promise.race([mcpConnectionPromise, timeoutPromise]);
      this.assertConnectionNotCancelled(connectionGeneration);
    } catch (connectionError) {
      clearTimeout(timeoutId!);
      if (
        connectionError instanceof ChromaMcpConnectionCancelledError ||
        this.connectionGeneration !== connectionGeneration
      ) {
        logger.debug('CHROMA_MCP', 'MCP connection cancelled during shutdown');
        // stop() already disposed our transport; whatever is current now
        // belongs to a newer attempt and is not ours to kill.
        if (this.transport === ownTransport) {
          await this.disposeCurrentSubprocess();
        }
        this.releaseChromaWriterLock(writerLock);
        throw connectionError instanceof ChromaMcpConnectionCancelledError
          ? connectionError
          : new ChromaMcpConnectionCancelledError();
      }
      const stderrTail = transportStderrTail();
      logger.warn('CHROMA_MCP', 'Connection failed, killing subprocess tree to prevent zombie', {
        error: connectionError instanceof Error ? connectionError.message : String(connectionError),
        ...(stderrTail ? { stderrTail } : {})
      });
      // Tree-kill (not just transport.close) so failed-connect descendants
      // can't survive on Linux (#2313).
      await this.disposeCurrentSubprocess();
      // A failed MCP handshake means Chroma is unavailable, the same as a
      // missing uvx, a failed prewarm, or a lost writer lock. The SDK sends
      // `notifications/initialized` right after `initialize`; when the
      // subprocess dies mid-handshake that send throws a bare
      // `Error: Not connected`. Classify every connect failure as
      // ChromaUnavailableError so callers take the reconnect-backoff and
      // skip-the-write path instead of surfacing a raw error to error tracking.
      const unavailableMessage = `chroma-mcp connection failed: ${connectionError instanceof Error ? connectionError.message : String(connectionError)}`;
      recordChromaVectorSearchUnavailable(unavailableMessage);
      throw new ChromaUnavailableError(unavailableMessage, connectionError instanceof Error ? connectionError : undefined);
    }
    clearTimeout(timeoutId!);

    if (localChromaDataDir) {
      ChromaMcpManager.writeChromaStoreRecord(localChromaDataDir);
    }

    this.connected = true;
    this.registerManagedProcess();
    clearDependencyStatus('chroma');

    logger.info('CHROMA_MCP', 'Connected to chroma-mcp successfully');

    const currentTransport = this.transport;
    // Captured HERE, while the child is alive and attached — not in the
    // onclose handler below, which by definition runs after it has died.
    const transportChild = (this.transport as unknown as { _process?: ChildProcess })._process;
    const currentTracked = transportChild ? trackChild(transportChild) : null;
    const currentTrackedPid = currentTracked?.pid;
    // client.connect() installed the SDK's own close handler, which rejects
    // in-flight requests with ConnectionClosed. Replacing it would leave a
    // pending write waiting out the full mutation timeout after a crash.
    const sdkOnClose = this.transport.onclose;
    this.transport.onclose = () => {
      sdkOnClose?.();
      if (this.transport !== currentTransport) {
        logger.debug('CHROMA_MCP', 'Ignoring stale onclose from previous transport');
        return;
      }
      if (
        this.connectionGeneration !== connectionGeneration ||
        this.intentionallyClosingTransports.has(currentTransport as unknown as object)
      ) {
        logger.debug('CHROMA_MCP', 'Ignoring onclose from intentionally closed transport');
        return;
      }
      // The transport clears its own handle before onclose fires, so read the
      // exit from the child captured at connect. That child is uvx, not
      // python: a crash in chroma-mcp (e.g. SIGSEGV) usually surfaces as uvx's
      // exit code rather than a signal on uvx itself, so both are recorded.
      this.chromaCrashCount += 1;
      this.chromaLastExit = {
        timestamp: new Date().toISOString(),
        code: transportChild?.exitCode ?? null,
        signal: transportChild?.signalCode ?? null,
      };
      const stderrTail = transportStderrTail();
      logger.warn('CHROMA_MCP', 'chroma-mcp subprocess closed unexpectedly, applying reconnect backoff', {
        count: this.chromaCrashCount,
        exitCode: this.chromaLastExit.code,
        signalCode: this.chromaLastExit.signal,
        chromaMcpVersion: CHROMA_MCP_PINNED_VERSION,
        dependencyOverrides: [...CHROMA_MCP_DEP_OVERRIDES],
        ...(stderrTail ? { stderrTail } : {}),
      });
      this.connected = false;
      if (currentTrackedPid) getSupervisor().unregisterProcess(CHROMA_SUPERVISOR_ID, currentTrackedPid);
      this.client = null;
      this.transport = null;
      this.lastConnectionFailureTimestamp = Date.now();

      // Direct child (uvx) emitted close, but on Linux the grandchildren
      // (uv/python/chroma-mcp) often outlive their parent because MCP SDK
      // does not use process groups. Sweep the descendant tree using the
      // captured PID — best-effort; pgrep returns nothing if everything
      // already exited (#2313).
      this.scheduleUnexpectedCloseCleanup(currentTracked, writerLock);
    };
  }

  getCrashState(): ChromaCrashState {
    return {
      count: this.chromaCrashCount,
      lastExit: this.chromaLastExit ? { ...this.chromaLastExit } : null,
      chromaMcpVersion: CHROMA_MCP_PINNED_VERSION,
      dependencyOverrides: [...CHROMA_MCP_DEP_OVERRIDES],
      localRuntime: 'artifact-contract-unverified',
      prewarm: {
        consecutiveFailures: 0,
        state: 'stopped',
      },
    };
  }

  private scheduleUnexpectedCloseCleanup(tracked: TrackedChild | null, writerLock: ChromaWriterLockHandle | null): void {
    let cleanup: Promise<void>;
    cleanup = this.cleanupUnexpectedCloseSubprocess(tracked, writerLock).finally(() => {
      if (this.unexpectedCloseCleanup === cleanup) {
        this.unexpectedCloseCleanup = null;
      }
    });
    this.unexpectedCloseCleanup = cleanup;
  }

  private async cleanupUnexpectedCloseSubprocess(
    tracked: TrackedChild | null,
    writerLock: ChromaWriterLockHandle | null,
  ): Promise<void> {
    const pid = tracked?.pid;
    try {
      if (tracked) {
        // The spawn-time token is REQUIRED here, not an optimisation. This
        // path runs because the child already exited, so killProcessTree's
        // self-capture would read whatever now holds that PID and validate the
        // replacement against itself — then `taskkill /T /F` would take that
        // stranger and its whole subtree down.
        await killProcessTree(tracked.pid, { expectedStartToken: tracked.startToken });
      }
    } catch (error) {
      logger.debug('CHROMA_MCP', 'Background tree-kill after onclose finished (best-effort)', {
        pid,
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      this.releaseChromaWriterLock(writerLock);
    }
  }

  private async waitForUnexpectedCloseCleanup(): Promise<void> {
    const cleanup = this.unexpectedCloseCleanup;
    if (cleanup) {
      await cleanup;
    }
  }

  private assertConnectionNotCancelled(connectionGeneration: number): void {
    if (this.connectionGeneration !== connectionGeneration) {
      throw new ChromaMcpConnectionCancelledError();
    }
  }

  private acquireChromaWriterLock(dataDir: string): ChromaWriterLockHandle {
    const normalizedDataDir = path.resolve(dataDir);
    if (this.chromaWriterLock?.dataDir === normalizedDataDir) {
      return this.chromaWriterLock;
    }
    if (this.chromaWriterLock) {
      this.releaseChromaWriterLock();
    }

    fs.mkdirSync(normalizedDataDir, { recursive: true });
    const lockPath = path.join(normalizedDataDir, CHROMA_WRITER_LOCK_FILENAME);
    const payload: ChromaWriterLockPayload = {
      pid: process.pid,
      ownerId: this.chromaWriterOwnerId,
      dataDir: normalizedDataDir,
      acquiredAt: new Date().toISOString(),
      startToken: captureProcessStartToken(process.pid),
      processName: normalizeProcessName(process.execPath),
      lockToken: randomUUID(),
    };
    const handle: ChromaWriterLockHandle = {
      path: lockPath,
      dataDir: normalizedDataDir,
      ownerId: this.chromaWriterOwnerId,
      lockToken: payload.lockToken!,
    };

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        fs.writeFileSync(lockPath, JSON.stringify(payload, null, 2), {
          encoding: 'utf-8',
          flag: 'wx',
        });
        this.chromaWriterLock = handle;
        logger.debug('CHROMA_MCP', 'Acquired Chroma writer lock', { lockPath, dataDir: normalizedDataDir });
        return handle;
      } catch (error) {
        const errno = error instanceof Error ? (error as NodeJS.ErrnoException).code : undefined;
        if (errno !== 'EEXIST') {
          const message = `Unable to acquire Chroma writer lock at ${lockPath}: ${error instanceof Error ? error.message : String(error)}`;
          recordChromaVectorSearchUnavailable(message);
          throw new ChromaUnavailableError(message, error instanceof Error ? error : undefined);
        }

        const existing = ChromaMcpManager.readChromaWriterLock(lockPath);
        if (!existing) {
          // Without a readable owner the liveness reaper below can never run,
          // so vector sync would stay dead until someone deletes the file (#3916).
          // Treat an unreadable lock that is past the write grace period as stale.
          if (ChromaMcpManager.isChromaWriterLockAbandoned(lockPath)) {
            try {
              fs.rmSync(lockPath, { force: true });
              logger.info('CHROMA_MCP', 'Removed unreadable Chroma writer lock', { lockPath });
              continue;
            } catch (removeError) {
              const message = `Unable to remove unreadable Chroma writer lock at ${lockPath}: ${removeError instanceof Error ? removeError.message : String(removeError)}`;
              recordChromaVectorSearchUnavailable(message);
              throw new ChromaUnavailableError(message, removeError instanceof Error ? removeError : undefined);
            }
          }
          const message = `Chroma writer lock at ${lockPath} is unreadable; refusing to start a second writer`;
          recordChromaVectorSearchUnavailable(message);
          throw new ChromaUnavailableError(message);
        }

        if (existing.pid === process.pid && existing.ownerId === this.chromaWriterOwnerId) {
          // Re-stamp it with this acquisition's token, so an earlier holder's
          // release can no longer remove it.
          try {
            fs.writeFileSync(lockPath, JSON.stringify(payload, null, 2), 'utf-8');
          } catch (rewriteError) {
            const message = `Unable to re-acquire Chroma writer lock at ${lockPath}: ${rewriteError instanceof Error ? rewriteError.message : String(rewriteError)}`;
            recordChromaVectorSearchUnavailable(message);
            throw new ChromaUnavailableError(message, rewriteError instanceof Error ? rewriteError : undefined);
          }
          this.chromaWriterLock = handle;
          return handle;
        }

        if (!ChromaMcpManager.isChromaWriterLockLive(existing)) {
          try {
            fs.rmSync(lockPath, { force: true });
            logger.info('CHROMA_MCP', 'Removed stale Chroma writer lock', {
              lockPath,
              priorPid: existing.pid,
              priorStartedAt: existing.acquiredAt,
            });
            continue;
          } catch (removeError) {
            const message = `Unable to remove stale Chroma writer lock at ${lockPath}: ${removeError instanceof Error ? removeError.message : String(removeError)}`;
            recordChromaVectorSearchUnavailable(message);
            throw new ChromaUnavailableError(message, removeError instanceof Error ? removeError : undefined);
          }
        }

        const message = `Chroma data dir ${normalizedDataDir} is already owned by PID ${existing.pid}; refusing to start a second writer`;
        recordChromaVectorSearchUnavailable(message);
        throw new ChromaUnavailableError(message);
      }
    }

    const message = `Unable to acquire Chroma writer lock at ${lockPath} after removing stale lock`;
    recordChromaVectorSearchUnavailable(message);
    throw new ChromaUnavailableError(message);
  }

  /** Release one acquisition (by default the current one); never a newer lock on the same store. */
  private releaseChromaWriterLock(lock: ChromaWriterLockHandle | null = this.chromaWriterLock): void {
    if (!lock) {
      return;
    }
    if (this.chromaWriterLock === lock) {
      this.chromaWriterLock = null;
    }

    const existing = ChromaMcpManager.readChromaWriterLock(lock.path);
    if (!existing) {
      logger.debug('CHROMA_MCP', 'Chroma writer lock already missing or unreadable during release', {
        lockPath: lock.path,
      });
      return;
    }

    if (existing.pid !== process.pid || existing.ownerId !== lock.ownerId || existing.lockToken !== lock.lockToken) {
      logger.debug('CHROMA_MCP', 'Chroma writer lock not owned by this acquisition, leaving it in place', {
        lockPath: lock.path,
        recordedPid: existing.pid,
        currentPid: process.pid,
      });
      return;
    }

    try {
      fs.rmSync(lock.path, { force: true });
      logger.debug('CHROMA_MCP', 'Released Chroma writer lock', { lockPath: lock.path });
    } catch (error) {
      logger.debug('CHROMA_MCP', 'Failed to release Chroma writer lock', {
        lockPath: lock.path,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private static readChromaWriterLock(lockPath: string): ChromaWriterLockPayload | null {
    try {
      if (!fs.statSync(lockPath).isFile()) return null;
      const raw = JSON.parse(fs.readFileSync(lockPath, 'utf-8')) as Partial<ChromaWriterLockPayload>;
      if (
        typeof raw.pid !== 'number' ||
        typeof raw.ownerId !== 'string' ||
        typeof raw.dataDir !== 'string' ||
        typeof raw.acquiredAt !== 'string'
      ) {
        return null;
      }
      return {
        pid: raw.pid,
        ownerId: raw.ownerId,
        dataDir: raw.dataDir,
        acquiredAt: raw.acquiredAt,
        startToken: typeof raw.startToken === 'string' || raw.startToken === null ? raw.startToken : undefined,
        processName: typeof raw.processName === 'string' ? raw.processName : undefined,
        lockToken: typeof raw.lockToken === 'string' ? raw.lockToken : undefined,
      };
    } catch {
      return null;
    }
  }

  private static isChromaWriterLockAbandoned(lockPath: string): boolean {
    try {
      return Date.now() - fs.statSync(lockPath).mtimeMs >= CHROMA_WRITER_LOCK_UNREADABLE_GRACE_MS;
    } catch (error) {
      // Only ENOENT proves the lock vanished between the failed create and the stat;
      // transient stat errors (e.g. EMFILE, EIO, EACCES) must not reap a live lock (#4951).
      const errno = error instanceof Error ? (error as NodeJS.ErrnoException).code : undefined;
      return errno === 'ENOENT';
    }
  }

  private static isChromaWriterLockLive(lock: ChromaWriterLockPayload): boolean {
    if (!isPidAlive(lock.pid)) {
      return false;
    }
    if (!lock.startToken) {
      // No identity was recorded (the capture can fail, e.g. a slow PowerShell
      // CIM lookup on Windows). If the PID now runs a different program than the
      // writer, the OS reused the PID and the lock is stale. Keeping it would
      // disable vector sync until someone deletes the file by hand. This check
      // does not depend on wall-clock ordering; an unreadable name keeps the
      // lock, as before. Older locks lack processName and may have been written
      // under either JS runtime, so any of them keeps such a lock.
      const currentName = captureProcessName(lock.pid);
      if (currentName === null) return true;
      if (lock.processName) return isSameProcessName(currentName, lock.processName);
      return isSameProcessName(currentName, normalizeProcessName(process.execPath)) || CHROMA_WRITER_RUNTIMES.has(currentName);
    }
    const currentStartToken = captureProcessStartToken(lock.pid);
    return currentStartToken === null || currentStartToken === lock.startToken;
  }

  private static readChromaStoreRecord(
    dataDir: string,
  ): { kind: 'absent' } | { kind: 'damaged'; reason: string } | { kind: 'valid'; record: ChromaStoreRecord } {
    const recordPath = path.join(path.resolve(dataDir), CHROMA_STORE_RECORD_FILENAME);
    let raw: string;
    try {
      const stat = fs.statSync(recordPath);
      if (!stat.isFile()) {
        return { kind: 'damaged', reason: 'record path is not a regular file' };
      }
      if (stat.size > CHROMA_STORE_RECORD_MAX_BYTES) {
        return { kind: 'damaged', reason: `record size ${stat.size} exceeds limit ${CHROMA_STORE_RECORD_MAX_BYTES}` };
      }
      raw = fs.readFileSync(recordPath, 'utf-8');
    } catch (error) {
      const errno = error instanceof Error ? (error as NodeJS.ErrnoException).code : undefined;
      if (errno === 'ENOENT') {
        return { kind: 'absent' };
      }
      return { kind: 'damaged', reason: error instanceof Error ? error.message : String(error) };
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { kind: 'damaged', reason: 'JSON parse error' };
    }
    if (typeof parsed !== 'object' || parsed === null) {
      return { kind: 'damaged', reason: 'record is not an object' };
    }
    const candidate = parsed as Record<string, unknown>;
    if (!Number.isInteger(candidate.writerEpoch)) {
      return { kind: 'damaged', reason: `writerEpoch is ${typeof candidate.writerEpoch}, expected integer` };
    }
    return {
      kind: 'valid',
      record: {
        writerEpoch: candidate.writerEpoch as number,
        chromaMcpVersion: typeof candidate.chromaMcpVersion === 'string' ? candidate.chromaMcpVersion : '',
        chromadbVersion: typeof candidate.chromadbVersion === 'string' ? candidate.chromadbVersion : '',
        clientType: typeof candidate.clientType === 'string' ? candidate.clientType : '',
        claudeMemVersion: typeof candidate.claudeMemVersion === 'string' ? candidate.claudeMemVersion : '',
        updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : '',
      },
    };
  }

  private static assertChromaStoreCompatible(dataDir: string): void {
    const stored = ChromaMcpManager.readChromaStoreRecord(dataDir);
    if (stored.kind === 'damaged') {
      logger.warn('CHROMA_MCP', 'Chroma store record is damaged; connecting anyway', {
        dataDir,
        reason: stored.reason,
      });
      return;
    }
    if (stored.kind !== 'valid' || stored.record.writerEpoch <= CHROMA_WRITER_EPOCH) {
      return;
    }

    // Strip non-printables and cap each field so injected control characters
    // or outsized strings cannot propagate through the health map to API responses.
    const sanitizeField = (s: string) => s.replace(/[^\x20-\x7E]/g, '').slice(0, 80);
    const version = sanitizeField(stored.record.claudeMemVersion);
    const ts = sanitizeField(stored.record.updatedAt);
    const engine = sanitizeField(stored.record.chromadbVersion);
    const writerDesc = [
      version
        ? `claude-mem ${version}${ts ? ` at ${ts}` : ''}`
        : ts || 'an unknown version',
      ...(engine ? [`chromadb ${engine}`] : []),
    ].join(', ');
    const message =
      `Chroma data dir ${path.resolve(dataDir)} was last written by epoch ` +
      `${stored.record.writerEpoch} (${writerDesc}); this writer is epoch ${CHROMA_WRITER_EPOCH}. ` +
      `Upgrade claude-mem to match the version that last wrote this store, ` +
      `or configure a distinct CLAUDE_MEM_DATA_DIR.`;
    recordChromaVectorSearchUnavailable(message);
    throw new ChromaUnavailableError(message);
  }

  private static writeChromaStoreRecord(dataDir: string): void {
    const normalizedDataDir = path.resolve(dataDir);
    const recordPath = path.join(normalizedDataDir, CHROMA_STORE_RECORD_FILENAME);
    const tmp = `${recordPath}.tmp`;
    // depOverrides is written for diagnostic provenance but not typed on ChromaStoreRecord
    // (see interface comment) — the write payload intentionally extends beyond the read type.
    const record = {
      writerEpoch: CHROMA_WRITER_EPOCH,
      chromaMcpVersion: CHROMA_MCP_PINNED_VERSION,
      chromadbVersion: CHROMADB_PINNED_VERSION ?? '',
      depOverrides: [...CHROMA_MCP_DEP_OVERRIDES],
      clientType: 'persistent',
      claudeMemVersion,
      updatedAt: new Date().toISOString(),
    };
    try {
      fs.writeFileSync(tmp, JSON.stringify(record, null, 2), 'utf-8');
      fs.renameSync(tmp, recordPath);
    } catch (error) {
      logger.warn('CHROMA_MCP', 'Failed to write Chroma store record; connecting anyway', {
        recordPath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private static captureOutputTail(
    stream: { on(event: 'data', listener: (chunk: Buffer | string | Uint8Array) => void): unknown } | null | undefined,
  ): () => string {
    let tail = '';
    stream?.on('data', (chunk: Buffer | string | Uint8Array) => {
      const text = Buffer.isBuffer(chunk)
        ? chunk.toString()
        : chunk instanceof Uint8Array
          ? Buffer.from(chunk).toString()
          : String(chunk);
      tail = (tail + text).slice(-CHROMA_OUTPUT_TAIL_MAX_CHARS);
    });
    return () => tail.trim();
  }

  /**
   * Whether a mutation sent now would be accepted. False in local mode once
   * stop() has begun, because callTool() then refuses every mutation.
   */
  acceptsMutations(): boolean {
    return !this.serializeMutations || this.acceptingLocalMutations;
  }

  async callTool(toolName: string, toolArguments: Record<string, unknown>): Promise<unknown> {
    assertLocalChromaConfiguration(SettingsDefaultsManager.loadFromFile(USER_SETTINGS_PATH));
    if ('embedding_function_name' in toolArguments) {
      assertLocalEmbeddingFunction(toolArguments.embedding_function_name);
    }
    if (!this.serializeMutations || !ChromaMcpManager.isMutationTool(toolName)) {
      return this.callToolUnqueued(toolName, toolArguments);
    }
    if (!this.acceptingLocalMutations) {
      throw new ChromaUnavailableError('Local Chroma mutations are unavailable after shutdown begins');
    }

    return this.enqueueMutation(() => this.callToolUnqueued(toolName, toolArguments), toolName);
  }

  private async callToolUnqueued(toolName: string, toolArguments: Record<string, unknown>): Promise<unknown> {
    const callGeneration = this.connectionGeneration;
    await this.ensureConnected();
    const callTransport = this.transport;
    const isMutation = ChromaMcpManager.isMutationTool(toolName);

    // Chroma embedding/index mutations routinely exceed the MCP SDK's
    // 60-second default once a persistent collection grows. The SDK treats
    // that deadline as a request failure, and tearing chroma-mcp down while
    // SQLite/FTS5 may still be committing can leave the persistent index
    // malformed (a timeout is therefore never handled as a transport error,
    // see below). Give mutations a bounded, configurable deadline while
    // keeping read/query latency at the SDK default.
    const requestOptions = isMutation
      ? { timeout: this.mutationTimeoutMs }
      : undefined;

    logger.debug('CHROMA_MCP', `Calling tool: ${toolName}`, {
      arguments: JSON.stringify(toolArguments).slice(0, 200),
      ...(requestOptions ? { timeoutMs: requestOptions.timeout } : {})
    });

    let result;
    if (isMutation) {
      this.mutationCallsInFlight += 1;
    }
    try {
      result = await this.client!.callTool({
        name: toolName,
        arguments: toolArguments
      }, undefined, requestOptions);
      if (this.timedOutWriteTransport === callTransport) {
        // chroma-mcp answered again, so the write that timed out has finished.
        this.timedOutWriteTransport = null;
      }
    } catch (transportError) {
      if (ChromaMcpManager.isRequestTimeout(transportError)) {
        const cause = transportError instanceof Error ? transportError : undefined;
        if (isMutation) {
          this.timedOutWriteTransport = callTransport;
        } else if (this.mutationCallsInFlight === 0 && this.timedOutWriteTransport !== callTransport) {
          await this.restartHungSubprocess(toolName, callTransport);
          throw new ChromaUnavailableError(`chroma-mcp did not answer "${toolName}" in time and was restarted`, cause);
        }
        // A request that outlived its deadline while a write is, or may still
        // be, in flight means chroma-mcp is slow, not gone: the SDK has already
        // sent notifications/cancelled, and the write may still be committing.
        // Tree-killing it here is what leaves a persistent index malformed,
        // and a retry would repeat the same slow work, so neither happens.
        // The caller keeps the row pending.
        const message = `chroma-mcp "${toolName}" timed out; the subprocess was left running`;
        logger.warn('CHROMA_MCP', message, {
          timeoutMs: requestOptions?.timeout,
          error: transportError instanceof Error ? transportError.message : String(transportError)
        });
        throw new ChromaUnavailableError(message, cause);
      }

      logger.warn('CHROMA_MCP', `Transport error during "${toolName}", reconnecting and retrying once`, {
        error: transportError instanceof Error ? transportError.message : String(transportError)
      });

      if (callGeneration !== this.connectionGeneration) {
        throw new ChromaMcpConnectionCancelledError('chroma-mcp call cancelled during shutdown');
      }

      // Tree-kill the dying subprocess before reconnect. Previously this path
      // just nulled the handle, which on Linux leaks the uv/python/chroma-mcp
      // descendants every time a transport error happens (#2313). When its
      // teardown is already under way (an unexpected close, or a restart for
      // a hung read that cut this call off) or the subprocess was replaced,
      // wait instead: disposing again could take down its replacement.
      if (this.unexpectedCloseCleanup || this.transport !== callTransport) {
        await this.waitForUnexpectedCloseCleanup();
      } else {
        await this.disposeCurrentSubprocess();
      }

      try {
        if (callGeneration !== this.connectionGeneration) {
          throw new ChromaMcpConnectionCancelledError('chroma-mcp call cancelled during shutdown');
        }
        await this.ensureConnected();
        result = await this.client!.callTool({
          name: toolName,
          arguments: toolArguments
        }, undefined, requestOptions);
      } catch (retryError) {
        this.connected = false;
        throw new Error(`chroma-mcp transport error during "${toolName}" (retry failed): ${retryError instanceof Error ? retryError.message : String(retryError)}`);
      }
    } finally {
      if (isMutation) {
        this.mutationCallsInFlight -= 1;
      }
    }

    if (result.isError) {
      const errorText = (result.content as Array<{ type: string; text?: string }>)
        ?.find(item => item.type === 'text')?.text || 'Unknown chroma-mcp error';
      throw new Error(`chroma-mcp tool "${toolName}" returned error: ${errorText}`);
    }

    const contentArray = result.content as Array<{ type: string; text?: string }>;
    if (!contentArray || contentArray.length === 0) {
      return null;
    }

    const firstTextContent = contentArray.find(item => item.type === 'text' && item.text);
    if (!firstTextContent || !firstTextContent.text) {
      return null;
    }

    try {
      return JSON.parse(firstTextContent.text);
    } catch (parseError: unknown) {
      if (parseError instanceof Error) {
        logger.debug('CHROMA_MCP', 'Non-JSON response from tool, returning null', {
          toolName,
          textPreview: firstTextContent.text.slice(0, 100)
        });
      }
      return null;
    }
  }

  private async enqueueMutation<T>(operation: () => Promise<T>, toolName: string): Promise<T> {
    if (this.pendingMutationCalls >= this.maxPendingMutationCalls) {
      const message = `Chroma mutation queue is full (${this.pendingMutationCalls}/${this.maxPendingMutationCalls}); deferring "${toolName}" to a later backfill`;
      logger.warn('CHROMA_MCP', message, {
        toolName,
        pendingMutations: this.pendingMutationCalls,
        maxPendingMutations: this.maxPendingMutationCalls
      });
      throw new ChromaUnavailableError(message);
    }

    this.pendingMutationCalls += 1;
    const enqueuedGeneration = this.connectionGeneration;
    const run = this.mutationTail
      .catch(() => undefined)
      .then(async () => {
        if (enqueuedGeneration !== this.connectionGeneration) {
          throw new ChromaMcpConnectionCancelledError('queued chroma-mcp mutation cancelled during shutdown');
        }
        return operation();
      });

    this.mutationTail = run.then(() => undefined, () => undefined);

    try {
      return await run;
    } finally {
      this.pendingMutationCalls -= 1;
    }
  }

  private static isMutationTool(toolName: string): boolean {
    return CHROMA_MUTATION_TOOL_PATTERN.test(toolName);
  }

  private static isRequestTimeout(error: unknown): boolean {
    return error instanceof McpError && error.code === ErrorCode.RequestTimeout;
  }

  /**
   * A read outlived the SDK's deadline while no write was in flight or still
   * possibly committing after its own deadline. Reads are short, so chroma-mcp
   * is hung rather than busy, and left running it makes every later read wait
   * out the same deadline. Take it down so the
   * next call reconnects to a fresh subprocess. The teardown is published as
   * the close cleanup: ensureConnected() and stop() wait for it, and a call
   * it cuts off joins it instead of disposing a second time.
   */
  private async restartHungSubprocess(toolName: string, callTransport: unknown): Promise<void> {
    if (this.unexpectedCloseCleanup) {
      await this.waitForUnexpectedCloseCleanup();
      return;
    }
    if (!callTransport || this.transport !== callTransport) {
      return;
    }
    logger.warn('CHROMA_MCP', `chroma-mcp did not answer "${toolName}" in time and no write is in flight; restarting it`);
    // Waiters on the close cleanup expect it never to reject, like the
    // unexpected-close cleanup it shares the slot with.
    let restart: Promise<void>;
    restart = this.disposeCurrentSubprocess()
      .catch((error: unknown) => {
        logger.warn('CHROMA_MCP', 'Restarting a hung chroma-mcp did not finish cleanly', {
          error: error instanceof Error ? error.message : String(error)
        });
      })
      .finally(() => {
        if (this.unexpectedCloseCleanup === restart) {
          this.unexpectedCloseCleanup = null;
        }
      });
    this.unexpectedCloseCleanup = restart;
    await restart;
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.callTool('chroma_list_collections', { limit: 1 });
      return true;
    } catch (error) {
      logger.warn('CHROMA_MCP', 'Health check failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }

  async probeSemanticSearch(): Promise<{
    ok: boolean;
    stage: 'connect' | 'list' | 'query' | 'done';
    error?: string;
    collections?: number;
    queryLatencyMs?: number;
  }> {
    let collections: number | undefined;

    try {
      const listResult: any = await this.callTool('chroma_list_collections', { limit: 100 });
      if (Array.isArray(listResult)) {
        collections = listResult.length;
      } else if (listResult && Array.isArray(listResult.collections)) {
        collections = listResult.collections.length;
      } else if (listResult && typeof listResult === 'object' && 'length' in listResult) {
        collections = (listResult as { length: number }).length;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.warn('CHROMA_MCP', 'Deep probe failed at list stage', { error: message });
      return { ok: false, stage: 'list', error: message };
    }

    const queryStartedAt = Date.now();
    try {
      await this.callTool('chroma_query_documents', {
        collection_name: 'cm__claude-mem',
        query_texts: ['ping'],
        n_results: 1
      });
      const queryLatencyMs = Date.now() - queryStartedAt;
      return { ok: true, stage: 'done', collections, queryLatencyMs };
    } catch (error) {
      const queryLatencyMs = Date.now() - queryStartedAt;
      const rawMessage = error instanceof Error ? error.message : String(error);
      const isMissingOrEmpty = /not exist|missing|empty|no such/i.test(rawMessage);
      const errorMessage = isMissingOrEmpty
        ? `collection cm__claude-mem missing or empty (${rawMessage})`
        : rawMessage;
      logger.warn('CHROMA_MCP', 'Deep probe failed at query stage', {
        error: rawMessage,
        queryLatencyMs
      });
      return {
        ok: false,
        stage: 'query',
        error: errorMessage,
        collections,
        queryLatencyMs
      };
    }
  }

  /**
   * Singleton enforcement helper (#2313): tree-kill the currently tracked
   * chroma-mcp subprocess and reset all state so the next spawn starts clean.
   *
   * Why this is the singleton invariant: every code path that intends to
   * abandon `this.transport` / `this.client` (reconnect, transport error,
   * connect-timeout, onclose, stop()) MUST funnel through here. The MCP
   * SDK's transport.close() only signals the direct child (uvx); on Linux
   * the grandchildren (uv, python, chroma-mcp) re-parent to init and
   * accumulate. Calling killProcessTree() against the captured PID before
   * we drop the reference is the only way to guarantee at most one
   * chroma-mcp subprocess tree exists per worker process.
   *
   * Idempotent and best-effort — safe to call when there is no active
   * subprocess (no-op in that case).
   */
  private async disposeCurrentSubprocess(): Promise<void> {

    const closingTransport = this.transport;
    if (closingTransport) {
      this.intentionallyClosingTransports.add(closingTransport as unknown as object);
    }

    const chromaProcess = (this.transport as unknown as { _process?: ChildProcess })?._process;
    const trackedPid = chromaProcess?.pid;

    // #3540 — graceful FIRST, hard tree-kill only as escalation.
    //
    // The previous order tree-killed before closing, so `uv` was always
    // SIGKILLed mid-build and never unlinked its builds-v0/.tmp* scratch dir.
    // StdioClientTransport.close() already implements exactly the escalation
    // this needs — stdin EOF, wait 2s, SIGTERM, wait 2s, SIGKILL — so the
    // grace period is the SDK's, not a new timer scheme of ours.
    //
    // The #2313 singleton invariant is preserved, but it needs the descendant
    // set captured BEFORE the close: once the root exits, its children
    // re-parent and drop out of the walk, so a post-mortem scan finds nothing
    // to reap. collectDescendantPids() enumerates on Windows too — a
    // POSIX-only walk returned [] there and left the chain untracked.
    // The ROOT's identity, captured BEFORE close(). uvx can exit during the
    // close, and on Windows the escalation below is unconditional — so without
    // this, a reused PID would be handed to `taskkill /PID <pid> /T /F`, force
    // terminating an unrelated process AND its entire descendant tree.
    const rootStartToken = trackedPid ? captureProcessStartToken(trackedPid) : null;
    const descendantsBeforeClose = trackedPid
      ? await ChromaMcpManager.snapshotDescendantIdentities(trackedPid)
      : [];

    if (closingTransport) {
      try { await closingTransport.close(); } catch { /* already dead */ }
    }
    if (this.client) {
      try { await this.client.close(); } catch { /* already dead */ }
    }

    // Both directions of the close/exit race have to be handled, and they pull
    // opposite ways:
    //
    //   - Escalate too eagerly and `uv` gets SIGKILLed mid-build, which is
    //     #3540 (leaked builds-v0/.tmp* scratch). close() can resolve before
    //     Node has processed the child's 'exit', so exitCode is briefly still
    //     null for a process that is already gone — hence the bounded wait
    //     below rather than reading exitCode the instant close() returns.
    //   - Escalate too reluctantly and the chain is orphaned, which is #3482.
    //
    // On Windows the second risk dominates and cannot be handled by the
    // exitCode check at all: close() ends in TerminateProcess against ONE pid,
    // so uvx.exe dies while uv -> python -> chroma-mcp keep running. Reading
    // exitCode there would skip the `taskkill /T /F` that is the only thing
    // able to reach them. So win32 always escalates; taskkill against an
    // already-dead pid is the tolerated not-found case, not an error.
    const exitedCleanly = chromaProcess
      ? await ChromaMcpManager.waitForChildExit(chromaProcess, ChromaMcpManager.exitObserveTimeoutMs)
      : true;
    const mustEscalate = process.platform === 'win32' || !exitedCleanly;

    if (trackedPid && mustEscalate) {
      try {
        // expectedStartToken makes this a no-op if the PID was reused; the
        // identity-validated descendant reap below still runs, which is the
        // part that matters once the real root is gone.
        await killProcessTree(trackedPid, { expectedStartToken: rootStartToken });
      } catch (error) {
        logger.warn('CHROMA_MCP', 'failed to kill prior chroma-mcp tree (best-effort)', {
          pid: trackedPid,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // Re-scan AFTER the close and union with the pre-close snapshot.
    //
    // The pre-close snapshot alone leaves a hole: if the walk ran before uvx
    // had forked `uv`, the snapshot is empty. Re-collecting here catches any
    // layer that became visible after the first walk and is still reachable
    // from the root. Descendants re-parent once the root is gone, so this
    // second walk is not guaranteed to see everything — which is exactly why
    // it UNIONS with the pre-close set rather than replacing it. Between the
    // two, a descendant has to be invisible at BOTH sample points to escape.
    // Only re-scan when the root is still the process we recorded — walking a
    // reused PID would enumerate a stranger's children and then reap them.
    const descendantsAfterClose = trackedPid && isSameProcess(trackedPid, rootStartToken)
      ? await ChromaMcpManager.snapshotDescendantIdentities(trackedPid)
      : [];
    ChromaMcpManager.reapOrphanedDescendants([...descendantsBeforeClose, ...descendantsAfterClose]);

    if (trackedPid) {
      getSupervisor().unregisterProcess(CHROMA_SUPERVISOR_ID, trackedPid);
    }
    this.releaseChromaWriterLock();

    this.client = null;
    this.transport = null;
    this.connected = false;
  }

  /**
   * Wait (bounded) for a child's 'exit' to be observed.
   *
   * close() can resolve before Node has processed the exit event, so reading
   * `exitCode` the instant it returns reports a live process that is already
   * gone — and escalating on that false negative is what SIGKILLs `uv`
   * mid-build (#3540). Resolves true when the child is known to have exited.
   */
  private static waitForChildExit(child: ChildProcess, timeoutMs: number): Promise<boolean> {
    if (child.exitCode !== null || child.signalCode !== null) {
      return Promise.resolve(true);
    }
    return new Promise<boolean>(resolve => {
      const onExit = () => {
        clearTimeout(timer);
        resolve(true);
      };
      const timer = setTimeout(() => {
        child.off('exit', onExit);
        resolve(child.exitCode !== null || child.signalCode !== null);
      }, timeoutMs);
      child.once('exit', onExit);
    });
  }

  /**
   * Descendants of `rootPid` with their start tokens captured.
   *
   * The token is what makes the later reap safe: a bare PID can be recycled by
   * the OS between snapshot and teardown, and SIGKILLing a recycled PID kills
   * an unrelated process. Captured here, at snapshot time, so it describes the
   * process we actually intend to reap.
   */
  private static async snapshotDescendantIdentities(
    rootPid: number
  ): Promise<Array<{ pid: number; startToken: string | null }>> {
    // Identity comes from the SAME process-table read that discovered the PID.
    // Enumerating first and probing each PID afterwards would let a reissued
    // number have the REPLACEMENT's token captured, which the later check would
    // then happily validate — certifying a stranger as a legitimate target.
    return collectDescendantIdentities(rootPid);
  }

  /**
   * SIGKILL descendants that outlived their parent, verifying identity first.
   *
   * These have already had the full graceful window (stdin EOF -> SIGTERM ->
   * SIGKILL against their parent); surviving it means they re-parented and
   * nothing else will ever reap them.
   *
   * A PID alone is not sufficient authority to kill: if the descendant died
   * and the OS reissued its number, the start token no longer matches and the
   * entry is skipped rather than killing a stranger. When no token could be
   * captured at snapshot time we fall back to liveness — the pre-existing
   * behavior — because refusing to reap would resurrect #2313.
   */
  private static reapOrphanedDescendants(
    entries: Array<{ pid: number; startToken: string | null }>
  ): void {
    const seen = new Set<number>();

    for (const { pid, startToken } of entries) {
      if (seen.has(pid)) continue;
      seen.add(pid);
      if (!isPidAlive(pid)) continue;

      if (!isSameProcess(pid, startToken)) {
        logger.debug('CHROMA_MCP', 'Skipping reap: PID was recycled since the snapshot', { pid });
        continue;
      }

      try {
        process.kill(pid, 'SIGKILL');
        logger.debug('CHROMA_MCP', 'Reaped orphaned chroma-mcp descendant', { pid });
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code !== 'ESRCH') {
          logger.warn('CHROMA_MCP', 'Failed to reap orphaned chroma-mcp descendant', {
            pid,
            code,
          });
        }
      }
    }
  }

  private static async waitForChildClose(child: ChildProcess, timeoutMs: number): Promise<void> {
    if (child.exitCode !== null || child.signalCode !== null) {
      return;
    }

    await new Promise<void>((resolve) => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      const finish = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        child.off('close', finish);
        child.off('exit', finish);
        resolve();
      };

      timeoutId = setTimeout(finish, timeoutMs);
      child.once('close', finish);
      child.once('exit', finish);
    });
  }

  /**
   * Gracefully stop the MCP connection and kill the chroma-mcp subprocess tree.
   *
   * The MCP SDK's client.close() sends stdin close -> SIGTERM -> SIGKILL to the
   * direct child (uvx), but the spawn chain (uvx -> uv -> python -> chroma-mcp)
   * can leave descendants orphaned because MCP SDK does not use process groups.
   *
   * Fix: kill the entire process tree rooted at the direct child PID BEFORE
   * closing the MCP client, ensuring no orphan python/chroma-mcp processes
   * accumulate across reconnects or worker restarts. Matches the tree-kill
   * pattern from shutdown.ts (Principle 5: OS-supervised teardown).
   */
  async stop(): Promise<void> {
    this.acceptingLocalMutations = false;
    this.connectionGeneration += 1;
    await this.waitForUnexpectedCloseCleanup();

    if (!this.client && !this.transport) {
      logger.debug('CHROMA_MCP', 'No active MCP connection to stop');
      this.releaseChromaWriterLock();
      this.connecting = null;
      return;
    }

    logger.info('CHROMA_MCP', 'Stopping chroma-mcp MCP connection');

    await this.disposeCurrentSubprocess();
    this.connecting = null;

    logger.info('CHROMA_MCP', 'chroma-mcp MCP connection stopped');
  }

  /**
   * Reset the singleton instance (for testing).
   * Awaits stop() to prevent dual subprocesses.
   */
  static async reset(): Promise<void> {
    if (ChromaMcpManager.instance) {
      await ChromaMcpManager.instance.stop();
    }
    ChromaMcpManager.instance = null;
  }

  /** Retained bounded teardown test seam; there is no prewarm process. */
  static setChildExitWaitTimeoutsForTesting(timeoutMs: number | null): void {
    ChromaMcpManager.exitObserveTimeoutMs = timeoutMs ?? CHROMA_EXIT_OBSERVE_TIMEOUT_MS;
  }

  private registerManagedProcess(): void {
    const chromaProcess = (this.transport as unknown as { _process?: ChildProcess })._process;
    const chromaPid = chromaProcess?.pid;
    if (!chromaProcess || !chromaPid) {
      return;
    }

    // Register with pgid so the supervisor's shutdown cascade can use
    // process-group signaling (kill(-pgid, signal)) to tear down the
    // entire spawn chain (uvx -> uv -> python -> chroma-mcp) in one
    // syscall, matching the SDK subprocess pattern in process-registry.ts.
    //
    // Note: MCP SDK's StdioClientTransport does NOT use detached:true,
    // so the child shares our process group — setting pgid here enables
    // tree-kill via signalProcess() in shutdown.ts which falls back to
    // taskkill /T on Windows when pgid is present but group signal fails.
    // On POSIX the pgid recorded here is used by killProcessTree() in
    // stop() for explicit tree teardown rather than negative-PID signaling.
    getSupervisor().registerProcess(CHROMA_SUPERVISOR_ID, {
      pid: chromaPid,
      type: 'chroma',
      startedAt: new Date().toISOString(),
      // Store pid as pgid — shutdown.ts will attempt kill(-pgid) on POSIX.
      // If the child isn't actually its own group leader, the ESRCH is caught
      // and shutdown falls back to single-PID kill (see signalProcess()).
      pgid: chromaPid
    }, chromaProcess);

    chromaProcess.once('exit', () => {
      getSupervisor().unregisterProcess(CHROMA_SUPERVISOR_ID, chromaPid);
    });
  }
}
