import { EventEmitter } from 'events';
import type { PendingMessage, PendingMessageWithId } from '../worker-types.js';
import { logger } from '../../utils/logger.js';

export const IDLE_TIMEOUT_MS = 3 * 60 * 1000;

interface BufferedMessage {
  id: number;
  message: PendingMessage;
  claimed: boolean;
  /**
   * Set aside after its batch spent its PaidSendBudget (paid-send-budget.ts):
   * never claimed or resent again, and not counted as pending, so newer work
   * behind it keeps flowing. It stays in RAM, visible to getParkedMessages,
   * until the session ends.
   */
  parked: boolean;
  /** The `x-client-request-id` of the batch's sends, so a parked message can be traced to them. */
  parkedClientAttemptId?: string;
  enqueuedAt: number;
  generationId?: number;
  dispatched?: boolean;
}

export interface DrainOptions {
  sessionDbId: number;
  signal: AbortSignal;
  onIdleTimeout?: () => void;
  idleTimeoutMs?: number;
}

/**
 * Per-session in-RAM observation buffer. This replaces the durable
 * `pending_messages` SQLite queue (and the BullMQ engine that mirrored it).
 *
 * Why in-RAM and not durable: a buffered message is one tool-use fragment fed
 * to a stateful, non-deterministic reducer (the memory agent batches N
 * tool-uses into M observations using in-memory conversation context). The old
 * durable queue persisted the fragments but threw away the reducer state, so
 * "replaying" pending rows after a crash regenerated different/duplicate
 * observations or looped forever. Transcript replay is a separate ingestion
 * path. The explicit-profile worker records accepted
 * input in SQLite for operator recovery. Its receipts never hydrate this buffer
 * at startup, and a dispatched receipt leaves the buffer if the claim fails.
 */
export class SessionMessageBuffer {
  private readonly buffers = new Map<number, BufferedMessage[]>();
  private readonly events = new Map<number, EventEmitter>();
  private readonly seenToolUseIds = new Map<number, Set<string>>();
  private nextId = 1;

  constructor(private readonly onMutate?: () => void) {}

  /**
   * Append a message. Returns the assigned id, or 0 if suppressed as a
   * duplicate. Dedup matches the old partial UNIQUE(content_session_id,
   * tool_use_id) index: only observations that carry a toolUseId are deduped,
   * and only against others in the same session for this worker's lifetime.
   * Messages with generation receipts already passed durable dedup at ingest.
   */
  enqueue(sessionDbId: number, message: PendingMessage, enqueuedAt = Date.now(), generationId?: number): number {
    const toolUseId = message.toolUseId;
    if (toolUseId && generationId === undefined) {
      const seen = this.getSeen(sessionDbId);
      if (seen.has(toolUseId)) {
        return 0;
      }
      seen.add(toolUseId);
    }

    const id = this.nextId++;
    this.getList(sessionDbId).push({ id, message, claimed: false, parked: false, enqueuedAt, generationId });
    this.onMutate?.();
    this.signal(sessionDbId);
    return id;
  }

  /** Remove a stored message by id. Returns 1 if found, 0 otherwise. */
  confirm(messageId: number): number {
    for (const list of this.buffers.values()) {
      const idx = list.findIndex(m => m.id === messageId);
      if (idx !== -1) {
        list.splice(idx, 1);
        this.onMutate?.();
        return 1;
      }
    }
    return 0;
  }

  isGenerationBuffered(sessionDbId: number, generationId: number): boolean {
    return this.buffers.get(sessionDbId)?.some(message => message.generationId === generationId) ?? false;
  }

  markDispatched(sessionDbId: number, ids: readonly number[]): void {
    const wanted = new Set(ids);
    for (const message of this.buffers.get(sessionDbId) ?? []) {
      if (message.generationId !== undefined && wanted.has(message.generationId)) message.dispatched = true;
    }
  }

  /** Release claims. Dispatched receipts are available only via deliberate recovery. */
  resetClaimed(sessionDbId: number): number {
    const list = this.buffers.get(sessionDbId);
    if (!list) return 0;
    let reset = 0;
    for (let i = list.length - 1; i >= 0; i--) {
      const m = list[i];
      if (m.claimed) {
        if (m.dispatched) list.splice(i, 1);
        else m.claimed = false;
        reset++;
      }
    }
    if (reset > 0) {
      this.onMutate?.();
      this.signal(sessionDbId);
    }
    return reset;
  }

  /**
   * Park the given messages of a session: un-claim them and never yield them
   * again. Returns the ids actually parked (already-stored ids are gone).
   */
  park(sessionDbId: number, messageIds: readonly number[], clientAttemptId: string): number[] {
    const wanted = new Set(messageIds);
    const parkedIds: number[] = [];
    for (const m of this.buffers.get(sessionDbId) ?? []) {
      if (wanted.has(m.id) && !m.parked) {
        m.parked = true;
        m.parkedClientAttemptId = clientAttemptId;
        m.claimed = false;
        parkedIds.push(m.id);
      }
    }
    if (parkedIds.length > 0) this.onMutate?.();
    return parkedIds;
  }

  getParkedMessages(sessionDbId: number): Array<{ messageId: number; clientAttemptId: string | undefined }> {
    return (this.buffers.get(sessionDbId) ?? [])
      .filter(m => m.parked)
      .map(m => ({ messageId: m.id, clientAttemptId: m.parkedClientAttemptId }));
  }

  /** Drop everything buffered for a session. */
  clear(sessionDbId: number): number {
    const cleared = this.buffers.get(sessionDbId)?.length ?? 0;
    this.buffers.delete(sessionDbId);
    // Mirror dispose(): drop the dedup set too. Otherwise a clear() not followed
    // by dispose() leaves seenToolUseIds intact, so a later enqueue carrying a
    // previously-seen toolUseId is silently suppressed (returns 0) and lost.
    this.seenToolUseIds.delete(sessionDbId);
    if (cleared > 0) {
      this.onMutate?.();
    }
    return cleared;
  }

  /** Forget a session entirely (buffer, dedup set, event emitter). */
  dispose(sessionDbId: number): void {
    this.buffers.delete(sessionDbId);
    this.seenToolUseIds.delete(sessionDbId);
    this.events.get(sessionDbId)?.removeAllListeners();
    this.events.delete(sessionDbId);
  }

  /** Messages still to be sent: parked ones are excluded, nothing will send them. */
  getPendingCount(sessionDbId: number): number {
    return (this.buffers.get(sessionDbId) ?? []).filter(m => !m.parked).length;
  }

  /** The id the last enqueued message got; every later message gets a higher one. */
  getLastAssignedId(): number {
    return this.nextId - 1;
  }

  /** The lowest id of the session's messages still to be stored, or null when none are. */
  getOldestPendingId(sessionDbId: number): number | null {
    let oldest: number | null = null;
    for (const m of this.buffers.get(sessionDbId) ?? []) {
      if (!m.parked && (oldest === null || m.id < oldest)) oldest = m.id;
    }
    return oldest;
  }

  getTotalDepth(): number {
    let total = 0;
    for (const list of this.buffers.values()) {
      total += list.filter(m => !m.parked).length;
    }
    return total;
  }

  getMessagesByIds(sessionDbId: number, messageIds: number[]): PendingMessageWithId[] {
    if (messageIds.length === 0) {
      return [];
    }

    const lookup = new Map<number, PendingMessageWithId>();
    for (const buffered of this.buffers.get(sessionDbId) ?? []) {
      lookup.set(buffered.id, {
        ...buffered.message,
        _persistentId: buffered.id,
        _originalTimestamp: buffered.enqueuedAt,
        ...(buffered.generationId === undefined ? {} : { _generationId: buffered.generationId }),
      });
    }

    const messages: PendingMessageWithId[] = [];
    for (const messageId of messageIds) {
      const message = lookup.get(messageId);
      if (message) {
        messages.push(message);
      }
    }
    return messages;
  }

  peekTypes(sessionDbId: number): Array<{ message_type: string; tool_name: string | null }> {
    return (this.buffers.get(sessionDbId) ?? []).filter(m => !m.parked).map(m => ({
      message_type: m.message.type,
      tool_name: m.message.tool_name ?? null
    }));
  }

  /**
   * Drain buffered messages as they arrive. Yields one unclaimed message at a
   * time; when the buffer is empty it waits on the per-session event emitter
   * until a new message is enqueued, the abort signal fires, or the idle
   * timeout elapses (which triggers onIdleTimeout and ends the iterator so the
   * SDK subprocess is killed).
   */
  async *drain(options: DrainOptions): AsyncIterableIterator<PendingMessageWithId> {
    const { sessionDbId, signal, onIdleTimeout, idleTimeoutMs = IDLE_TIMEOUT_MS } = options;
    let lastActivityTime = Date.now();

    while (!signal.aborted) {
      const claimed = this.claimNext(sessionDbId);
      if (claimed) {
        lastActivityTime = Date.now();
        yield {
          ...claimed.message,
          _persistentId: claimed.id,
          _originalTimestamp: claimed.enqueuedAt,
          ...(claimed.generationId === undefined ? {} : { _generationId: claimed.generationId }),
        };
        continue;
      }

      const received = await this.waitForMessage(sessionDbId, signal, idleTimeoutMs);
      if (!received && !signal.aborted) {
        const idleDuration = Date.now() - lastActivityTime;
        if (idleDuration >= idleTimeoutMs) {
          logger.info('SESSION', 'Idle timeout reached, triggering abort to kill subprocess', {
            sessionDbId,
            idleDurationMs: idleDuration,
            thresholdMs: idleTimeoutMs
          });
          onIdleTimeout?.();
          return;
        }
      } else {
        lastActivityTime = Date.now();
      }
    }
  }

  /** Claim only the immediate FIFO head, never wait or cross a rejected barrier. */
  claimNextMatching(sessionDbId: number, accepts: (message: PendingMessageWithId) => boolean): PendingMessageWithId | null {
    const next = this.buffers.get(sessionDbId)?.find(message => !message.claimed && !message.parked);
    if (!next) return null;
    const message = {
      ...next.message, _persistentId: next.id, _originalTimestamp: next.enqueuedAt,
      ...(next.generationId === undefined ? {} : { _generationId: next.generationId }),
    };
    if (!accepts(message)) return null;
    next.claimed = true;
    this.onMutate?.();
    return message;
  }

  private claimNext(sessionDbId: number): BufferedMessage | null {
    const list = this.buffers.get(sessionDbId);
    if (!list) return null;
    const next = list.find(m => !m.claimed && !m.parked);
    if (!next) return null;
    next.claimed = true;
    this.onMutate?.();
    return next;
  }

  private waitForMessage(sessionDbId: number, signal: AbortSignal, timeoutMs: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const events = this.getEvents(sessionDbId);
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      const cleanup = () => {
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }
        events.off('message', onMessage);
        signal.removeEventListener('abort', onAbort);
      };

      const onMessage = () => {
        cleanup();
        resolve(true);
      };
      const onAbort = () => {
        cleanup();
        resolve(false);
      };
      const onTimeout = () => {
        cleanup();
        resolve(false);
      };

      events.once('message', onMessage);
      signal.addEventListener('abort', onAbort, { once: true });
      timeoutId = setTimeout(onTimeout, timeoutMs);
    });
  }

  private getList(sessionDbId: number): BufferedMessage[] {
    let list = this.buffers.get(sessionDbId);
    if (!list) {
      list = [];
      this.buffers.set(sessionDbId, list);
    }
    return list;
  }

  private getSeen(sessionDbId: number): Set<string> {
    let seen = this.seenToolUseIds.get(sessionDbId);
    if (!seen) {
      seen = new Set<string>();
      this.seenToolUseIds.set(sessionDbId, seen);
    }
    return seen;
  }

  private getEvents(sessionDbId: number): EventEmitter {
    let events = this.events.get(sessionDbId);
    if (!events) {
      events = new EventEmitter();
      this.events.set(sessionDbId, events);
    }
    return events;
  }

  private signal(sessionDbId: number): void {
    this.events.get(sessionDbId)?.emit('message');
  }
}
